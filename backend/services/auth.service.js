const prisma = require('../config/prisma');
const env = require('../config/env');
const pw = require('../utils/password');
const { randomToken, sha256 } = require('../utils/tokens');
const { sendMail } = require('../utils/mailer');
const { badRequest, unauthorized, forbidden, conflict } = require('../utils/AppError');

const publicUser = (u) => ({ id: u.id, name: u.name, email: u.email, role: u.role, createdAt: u.createdAt });

async function signup({ name, email, password, consentVersion }) {
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) throw conflict('Já existe uma conta com esse e-mail. Tente entrar.', 'email_in_use');
  try {
    return await prisma.user.create({
      data: { name, email, passwordHash: await pw.hash(password), consentVersion, consentAt: new Date() },
    });
  } catch (e) {
    if (e.code === 'P2002') throw conflict('Já existe uma conta com esse e-mail. Tente entrar.', 'email_in_use');
    throw e;
  }
}

async function login({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });
  const ok = await pw.verify(password, user && user.passwordHash);
  if (!user || !ok) throw unauthorized('E-mail ou senha incorretos, ou essa conta ainda não existe. Crie uma conta primeiro.');
  return user;
}

/** Encerra todas as outras sessões (e a atual precisa receber um cookie novo). */
async function bumpSessions(userId) {
  return prisma.user.update({ where: { id: userId }, data: { tokenVersion: { increment: 1 } } });
}

async function assertPassword(user, current) {
  if (!(await pw.verify(current, user.passwordHash))) throw forbidden('Senha atual incorreta.', 'wrong_password');
}

async function updateEmail(user, { email, currentPassword }) {
  await assertPassword(user, currentPassword);
  const other = await prisma.user.findUnique({ where: { email } });
  if (other && other.id !== user.id) throw conflict('Esse e-mail já está em uso.', 'email_in_use');
  return prisma.user.update({ where: { id: user.id }, data: { email } });
}

async function updatePassword(user, { currentPassword, newPassword }) {
  await assertPassword(user, currentPassword);
  return prisma.user.update({ where: { id: user.id }, data: { passwordHash: await pw.hash(newPassword), tokenVersion: { increment: 1 } } });
}

/** Pede a recuperação de senha. Sempre responde igual, exista a conta ou não. */
async function requestReset(email) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return;
  const token = randomToken();
  await prisma.passwordReset.create({
    data: { userId: user.id, tokenHash: sha256(token), expiresAt: new Date(Date.now() + env.PASSWORD_RESET_TTL_MIN * 60000) },
  });
  const link = `${env.FRONTEND_URL.replace(/\/$/, '')}/pages/login.html?reset=${token}`;
  await sendMail({
    to: user.email,
    subject: 'EcoClick — criar nova senha',
    text: `Olá, ${user.name}!\n\nPara criar uma nova senha, abra o link (vale por ${env.PASSWORD_RESET_TTL_MIN} minutos):\n${link}\n\nSe não foi você, ignore esta mensagem.`,
  }).catch((e) => console.error('[EcoClick] falha ao enviar e-mail:', e.message));
}

async function confirmReset({ token, password }) {
  const rec = await prisma.passwordReset.findUnique({ where: { tokenHash: sha256(token) } });
  if (!rec || rec.usedAt || rec.expiresAt < new Date()) throw badRequest('Link inválido ou expirado. Peça um novo.', 'invalid_token');
  await prisma.$transaction([
    prisma.user.update({ where: { id: rec.userId }, data: { passwordHash: await pw.hash(password), tokenVersion: { increment: 1 } } }),
    prisma.passwordReset.update({ where: { id: rec.id }, data: { usedAt: new Date() } }),
  ]);
}

async function deleteAccount(userId) {
  await prisma.user.delete({ where: { id: userId } });   // apaga em cascata todos os dados da pessoa
}

/** Exportação dos dados pessoais (LGPD). */
async function exportData(user) {
  const [appData, appointments, ledger, redemptions, community] = await Promise.all([
    prisma.appData.findMany({ where: { userId: user.id } }),
    prisma.appointment.findMany({ where: { userId: user.id } }),
    prisma.pointLedger.findMany({ where: { userId: user.id } }),
    prisma.redemption.findMany({ where: { userId: user.id } }),
    prisma.communityItem.findMany({ where: { ownerId: user.id } }),
  ]);
  return {
    exportedAt: new Date().toISOString(),
    account: { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt, consentVersion: user.consentVersion, consentAt: user.consentAt },
    appData: appData.map((x) => ({ key: x.key, value: x.value, updatedAt: x.updatedAt })),
    appointments, pointLedger: ledger, redemptions,
    community: community.map((c) => ({ collection: c.collection, id: c.id, data: c.data, createdAt: c.createdAt })),
  };
}

module.exports = { publicUser, signup, login, bumpSessions, updateEmail, updatePassword, requestReset, confirmReset, deleteAccount, exportData };
