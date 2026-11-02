const prisma = require('../config/prisma');

// Chaves que o navegador NUNCA pode gravar: pertencem ao servidor (sessão, saldo, resgates, validações).
const BLOCKED = new Set(['ecoclick_current_user', 'ecoclick_users', 'ecoclick_owner', 'ecoclick_redemptions', 'ecoclick_disposal_ledger']);
const KEY_RE = /^ecoclick[_:][A-Za-z0-9_:.\-@]{1,180}$/;
const MAX_KEYS_PER_USER = 600;
const MAX_VALUE = 1_000_000; // ~1 MB por chave

const allowed = (k) => KEY_RE.test(k) && !BLOCKED.has(k);

async function list(userId) {
  const rows = await prisma.appData.findMany({ where: { userId } });
  return rows.map((r) => ({ key: r.key, value: r.value }));
}

async function save(userId, items, deleted) {
  const ok = items.filter((i) => allowed(i.key) && i.value.length <= MAX_VALUE);
  const del = deleted.filter(allowed);
  const count = await prisma.appData.count({ where: { userId } });
  if (count + ok.length > MAX_KEYS_PER_USER + del.length) {
    const existing = new Set((await prisma.appData.findMany({ where: { userId }, select: { key: true } })).map((r) => r.key));
    if (existing.size + ok.filter((i) => !existing.has(i.key)).length > MAX_KEYS_PER_USER) return { ok: false, reason: 'limit' };
  }
  await prisma.$transaction([
    ...ok.map((i) => prisma.appData.upsert({
      where: { userId_key: { userId, key: i.key } },
      create: { userId, key: i.key, value: i.value },
      update: { value: i.value },
    })),
    ...(del.length ? [prisma.appData.deleteMany({ where: { userId, key: { in: del } } })] : []),
  ]);
  return { ok: true, saved: ok.length, deleted: del.length };
}

module.exports = { list, save, allowed };
