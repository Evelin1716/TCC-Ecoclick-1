const prisma = require('../config/prisma');
const { notFound } = require('../utils/AppError');

// Formato que o mapa do dashboard já espera (mesmos nomes de campo do código original).
const toClient = (p) => ({
  id: p.id, name: p.name, kind: p.kind, operator: p.operator, neighborhood: p.neighborhood, address: p.address, phone: p.phone,
  geoQ: p.geoQuery, geoApprox: p.geoApprox, lat: p.lat, lng: p.lng, geoLabel: p.geoLabel, geoUrl: p.geoUrl,
  materials: p.materials.map((m) => m.material.name), matNote: p.matNote, pendingNote: p.pendingNote,
  hours: p.hours, hoursNote: p.hoursNote, hoursShort: p.hoursShort, src: p.sources, v: p.verified,
});
const include = { materials: { include: { material: true } } };

async function list() {
  const rows = await prisma.collectionPoint.findMany({ where: { active: true }, include, orderBy: { name: 'asc' } });
  return rows.map(toClient);
}
async function get(id) {
  const p = await prisma.collectionPoint.findFirst({ where: { id, active: true }, include });
  if (!p) throw notFound('Ponto de coleta não encontrado.');
  return toClient(p);
}

function dataOf(b) {
  const d = {};
  const map = { name: 'name', kind: 'kind', operator: 'operator', neighborhood: 'neighborhood', address: 'address', phone: 'phone',
    geoQuery: 'geoQuery', geoApprox: 'geoApprox', lat: 'lat', lng: 'lng', geoLabel: 'geoLabel', geoUrl: 'geoUrl', matNote: 'matNote',
    pendingNote: 'pendingNote', hours: 'hours', hoursNote: 'hoursNote', hoursShort: 'hoursShort', sources: 'sources', verified: 'verified', active: 'active' };
  Object.keys(map).forEach((k) => { if (b[k] !== undefined) d[map[k]] = b[k]; });
  return d;
}
async function setMaterials(tx, pointId, ids) {
  await tx.pointMaterial.deleteMany({ where: { pointId } });
  if (ids.length) await tx.pointMaterial.createMany({ data: ids.map((materialId) => ({ pointId, materialId })), skipDuplicates: true });
}

async function create(b) {
  await prisma.$transaction(async (tx) => {
    await tx.collectionPoint.create({ data: { id: b.id, ...dataOf(b) } });
    await setMaterials(tx, b.id, b.materialIds || []);
  });
  return get(b.id);
}
async function update(id, b) {
  const cur = await prisma.collectionPoint.findUnique({ where: { id } });
  if (!cur) throw notFound('Ponto de coleta não encontrado.');
  await prisma.$transaction(async (tx) => {
    await tx.collectionPoint.update({ where: { id }, data: dataOf(b) });
    if (b.materialIds) await setMaterials(tx, id, b.materialIds);
  });
  const p = await prisma.collectionPoint.findUnique({ where: { id }, include });
  return toClient(p);
}
async function deactivate(id) {
  const cur = await prisma.collectionPoint.findUnique({ where: { id } });
  if (!cur) throw notFound('Ponto de coleta não encontrado.');
  await prisma.collectionPoint.update({ where: { id }, data: { active: false } });   // não apaga: agendamentos antigos continuam válidos
}

async function listMaterials() {
  const rows = await prisma.material.findMany({ orderBy: { sortOrder: 'asc' } });
  return rows.map((m) => ({ id: m.id, name: m.name, prepTips: m.prepTips }));
}

module.exports = { list, get, create, update, deactivate, listMaterials };
