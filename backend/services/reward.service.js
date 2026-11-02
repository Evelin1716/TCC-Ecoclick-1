const prisma = require('../config/prisma');
const { AppError, notFound, conflict } = require('../utils/AppError');

async function balanceOf(client, userId) {
  const r = await client.pointLedger.aggregate({ where: { userId }, _sum: { delta: true } });
  return r._sum.delta || 0;
}

const balance = (userId) => balanceOf(prisma, userId);

async function listRewards() {
  const rows = await prisma.reward.findMany({ where: { active: true }, orderBy: { sortOrder: 'asc' } });
  return rows.map((r) => ({ id: r.id, name: r.name, description: r.description, cost: r.cost, glow: r.glow }));
}

async function listRedemptions(userId) {
  const rows = await prisma.redemption.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
  return rows.map((r) => ({ id: r.id, rewardId: r.rewardId, name: r.name, qty: r.qty, total: r.total, createdAt: r.createdAt }));
}

/** Resgate atômico: trava a linha do usuário para dois resgates simultâneos não gastarem os mesmos pontos. */
async function redeem(userId, rewardId, qty) {
  const reward = await prisma.reward.findFirst({ where: { id: rewardId, active: true } });
  if (!reward) throw notFound('Recompensa não encontrada.');
  const total = reward.cost * qty;
  return prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT "id" FROM "User" WHERE "id" = ${userId} FOR UPDATE`;
    const bal = await balanceOf(tx, userId);
    if (bal < total) throw new AppError(409, 'insufficient', 'Saldo insuficiente.', { balance: bal, total });
    const red = await tx.redemption.create({ data: { userId, rewardId, name: reward.name, qty, total } });
    await tx.pointLedger.create({ data: { userId, delta: -total, reason: `resgate:${rewardId}:${red.id}` } });
    return { id: red.id, total, balance: bal - total };
  }, { isolationLevel: 'Serializable' }).catch((e) => {
    if (e.code === 'P2034') throw conflict('Muitos pedidos ao mesmo tempo. Tente novamente.', 'busy');
    throw e;
  });
}

/** Credita pontos de missões sem permitir duplicidade. */
async function creditMissions(userId, items) {
  const ids = [...new Set(items.map((i) => i.id))];

  const catalog = await prisma.mission.findMany({
    where: { id: { in: ids }, active: true },
    select: { id: true, points: true }
  });

  const byId = new Map(catalog.map((m) => [m.id, m.points]));
  let credited = 0;
  let skipped = 0;

  for (const it of items) {
    const max = byId.get(it.id);
    const delta = max == null ? 0 : Math.min(it.pts, max);

    if (delta <= 0) {
      skipped++;
      continue;
    }

    try {
      await prisma.pointLedger.create({
        data: {
          userId,
          delta,
          reason: `missao:${it.id}`,
          refKey: `${userId}:m:${it.key}`
        }
      });
      credited++;
    } catch (e) {
      if (e.code !== 'P2002') throw e;
    }
  }

  return { credited, skipped, balance: await balance(userId) };
}

module.exports = {
  balance,
  listRewards,
  listRedemptions,
  redeem,
  creditMissions
};
