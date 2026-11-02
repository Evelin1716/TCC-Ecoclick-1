const prisma = require('../config/prisma');
const { AppError, badRequest, forbidden, notFound, conflict } = require('../utils/AppError');

const ACTIVE = ['planned', 'pending_validation'];
const CLIENT_STATUSES = ['planned', 'pending_validation', 'cancelled'];   // o navegador nunca define "completed" nem "rejected"
const TZ = 'America/Bahia';

const slotKey = (pointId, date, time) => `${pointId}|${date}|${time}`;
const parseDate = (d) => { const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(d); if (!m) return null; const dt = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3])); return dt.getUTCFullYear() === +m[1] && dt.getUTCMonth() === +m[2] - 1 && dt.getUTCDate() === +m[3] ? dt : null; };
const parseTime = (t) => { const m = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(t); return m ? +m[1] * 60 + +m[2] : null; };

/** Agora no horário de Salvador, como { date: 'AAAA-MM-DD', minutes }. */
function nowBahia() {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date());
  const g = (t) => parts.find((p) => p.type === t).value;
  return { date: `${g('year')}-${g('month')}-${g('day')}`, minutes: +g('hour') * 60 + +g('minute') };
}

/** Confere o horário informado com o funcionamento cadastrado do ponto (só se o ponto tiver horário verificado). */
function checkHours(point, dateObj, minutes) {
  const hours = Array.isArray(point.hours) ? point.hours : [];
  if (!hours.length) return;
  const dow = dateObj.getUTCDay();
  const h = hours.find((x) => Array.isArray(x.days) && x.days.includes(dow));
  const toMin = (s) => { const [a, b] = String(s).split(':'); return +a * 60 + +b; };
  if (!h || h.closed || minutes < toMin(h.open) || minutes >= toMin(h.close)) {
    throw new AppError(422, 'closed', 'O ponto não funciona nesse dia ou horário. Escolha outro horário.');
  }
}

async function list(userId) {
  const rows = await prisma.appointment.findMany({ where: { userId }, select: { id: true, status: true, points: true, validatedAt: true } });
  return rows.map((r) => ({ id: r.id, status: r.status, points: r.points, validatedAt: r.validatedAt }));
}

async function taken(pointId, date) {
  const rows = await prisma.appointment.findMany({ where: { pointId, date, status: { in: ACTIVE } }, select: { time: true } });
  return rows.map((r) => r.time);
}

/** Cria ou atualiza o agendamento do próprio usuário. A reserva do horário é protegida por restrição única no banco. */
async function upsert(userId, id, a) {
  const existing = await prisma.appointment.findUnique({ where: { id } });
  if (existing && existing.userId !== userId) throw forbidden('Agendamento de outra pessoa.');
  if (existing && ['completed', 'rejected'].includes(existing.status)) return { ok: true, status: existing.status };   // decisão da equipe do ponto prevalece

  const status = CLIENT_STATUSES.includes(a.status) ? a.status : a.status === 'confirmed' ? 'planned' : null;
  if (!status) throw badRequest('Situação do agendamento inválida.', 'invalid_status');

  const point = await prisma.collectionPoint.findFirst({ where: { id: a.pointId, active: true } });
  if (!point) throw new AppError(422, 'unknown_point', 'Ponto de coleta desconhecido.');
  const dateObj = parseDate(a.date), minutes = parseTime(a.time);
  if (!dateObj || minutes == null) throw new AppError(422, 'invalid_datetime', 'Data ou horário inválido.');

  const changedSlot = !existing || existing.pointId !== a.pointId || existing.date !== a.date || existing.time !== a.time;
  const wantsSlot = ACTIVE.includes(status);
  if (wantsSlot && changedSlot) {
    const n = nowBahia();
    if (a.date < n.date || (a.date === n.date && minutes < n.minutes - 5)) throw new AppError(422, 'invalid_datetime', 'Esse horário já passou.');
    checkHours(point, dateObj, minutes);
  }

  const data = { pointId: a.pointId, date: a.date, time: a.time, status, slotKey: wantsSlot ? slotKey(a.pointId, a.date, a.time) : null, data: { ...a, status } };
  try {
    if (existing) await prisma.appointment.update({ where: { id }, data });
    else await prisma.appointment.create({ data: { id, userId, ...data } });
  } catch (e) {
    if (e.code === 'P2002') throw conflict('Esse horário já está lotado. Escolha outro horário.', 'slot_full');
    throw e;
  }
  return { ok: true, status };
}

/** Validação do descarte pela equipe do ponto (ou administrador): credita os pontos uma única vez. */
async function validate(operator, id, { approve, points }) {
  const appt = await prisma.appointment.findUnique({ where: { id } });
  if (!appt) throw notFound('Agendamento não encontrado.');
  if (operator.role !== 'ADMIN') {
    const link = await prisma.pointOperator.findUnique({ where: { userId_pointId: { userId: operator.id, pointId: appt.pointId } } });
    if (!link) throw forbidden('Você não faz parte da equipe deste ponto.');
  }
  if (appt.status !== 'pending_validation') throw conflict('Este descarte não está aguardando validação.', 'not_pending');
  const now = new Date();
  if (!approve) {
    await prisma.appointment.update({ where: { id }, data: { status: 'rejected', slotKey: null, validatedAt: now, validatedById: operator.id, points: 0 } });
    return { id, status: 'rejected' };
  }
  await prisma.$transaction([
    prisma.appointment.update({ where: { id }, data: { status: 'completed', slotKey: null, validatedAt: now, validatedById: operator.id, points } }),
    prisma.pointLedger.create({ data: { userId: appt.userId, appointmentId: id, delta: points, reason: `descarte:${appt.pointId}` } }),
  ]);
  return { id, status: 'completed', points };
}

/** Descartes aguardando validação nos pontos em que a pessoa trabalha (administrador vê todos). */
async function pendingFor(operator) {
  const where = { status: 'pending_validation' };
  if (operator.role !== 'ADMIN') {
    const links = await prisma.pointOperator.findMany({ where: { userId: operator.id }, select: { pointId: true } });
    where.pointId = { in: links.map((l) => l.pointId) };
  }
  const rows = await prisma.appointment.findMany({ where, orderBy: [{ date: 'asc' }, { time: 'asc' }], include: { user: { select: { name: true } } } });
  return rows.map((r) => ({ id: r.id, pointId: r.pointId, date: r.date, time: r.time, userName: r.user.name, data: r.data }));
}

module.exports = { list, taken, upsert, validate, pendingFor };
