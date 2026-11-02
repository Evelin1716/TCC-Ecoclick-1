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

module.exports = { balance, listRewards, listRedemptions, redeem };
