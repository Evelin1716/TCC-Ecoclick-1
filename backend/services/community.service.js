const prisma = require('../config/prisma');
const userKey = require('../utils/userKey');
const { forbidden, notFound } = require('../utils/AppError');

const MAX = 500;
const str = (v, n) => String(v == null ? '' : v).slice(0, n);

async function list(collection) {
  const rows = await prisma.communityItem.findMany({ where: { collection }, orderBy: { createdAt: 'desc' }, take: MAX });
  return rows.map((r) => ({ data: r.data }));
}
async function get(collection, id) {
  const r = await prisma.communityItem.findUnique({ where: { collection_id: { collection, id } } });
  return { data: r ? r.data : null };
}

/** Curtidas e comentários de quem não é o autor: só mexe nas próprias marcas, o resto do post fica como está. */
function mergeInteraction(old, incoming, user) {
  const k = userKey(user.email);
  const out = { ...old };
  const oldLikes = Array.isArray(old.likes) ? old.likes : [];
  const wants = Array.isArray(incoming.likes) && incoming.likes.includes(k);
  out.likes = oldLikes.filter((x) => x !== k).concat(wants ? [k] : []);
  const oldC = Array.isArray(old.comments) ? old.comments : [];
  const inC = Array.isArray(incoming.comments) ? incoming.comments : [];
  const inIds = new Set(inC.map((c) => c && c.id));
  const kept = oldC.filter((c) => c.uid !== k || inIds.has(c.id));                 // pode apagar só os próprios
  const known = new Set(oldC.map((c) => c.id));
  const added = inC.filter((c) => c && c.uid === k && c.id && !known.has(c.id) && str(c.body, 1000).trim())
    .slice(0, 5).map((c) => ({ id: str(c.id, 40), name: str(user.name, 80), uid: k, body: str(c.body, 1000), at: Number(c.at) || Date.now() }));
  out.comments = kept.concat(added).slice(0, 1000);
  return out;
}

async function put(collection, id, data, user) {
  const key = { collection_id: { collection, id } };
  const cur = await prisma.communityItem.findUnique({ where: key });
  const k = userKey(user.email);
  if (!cur) {
    const clean = { ...data, id, uid: k };              // autoria sempre do usuário logado, nunca escolhida pelo navegador
    await prisma.communityItem.create({ data: { collection, id, ownerId: user.id, data: clean } });
    return;
  }
  if (cur.ownerId === user.id) {
    await prisma.communityItem.update({ where: key, data: { data: { ...data, id, uid: k } } });
    return;
  }
  if (collection !== 'posts') throw forbidden('Só o autor pode alterar.');
  await prisma.communityItem.update({ where: key, data: { data: mergeInteraction(cur.data, data, user) } });
}

async function remove(collection, id, user) {
  const cur = await prisma.communityItem.findUnique({ where: { collection_id: { collection, id } } });
  if (!cur) return;
  if (cur.ownerId !== user.id && user.role !== 'ADMIN') throw forbidden('Só o autor pode excluir.');
  await prisma.communityItem.delete({ where: { collection_id: { collection, id } } });
}

module.exports = { list, get, put, remove };
