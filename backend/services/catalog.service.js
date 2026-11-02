const prisma = require('../config/prisma');
const { notFound } = require('../utils/AppError');

async function missions() {
  const rows = await prisma.mission.findMany({ where: { active: true }, orderBy: { sortOrder: 'asc' } });
  return rows.map((m) => ({ id: m.id, chain: m.chain, order: m.stepOrder, cat: m.category, title: m.title, desc: m.description, pts: m.points, xp: m.xp, goal: m.goal, minLevel: m.minLevel }));
}
const contentShape = (c) => ({ id: c.id, type: c.type, category: c.category, title: c.title, description: c.description, image: c.image || '', body: c.body, refs: c.refs });
async function contents() {
  const rows = await prisma.content.findMany({ where: { published: true }, orderBy: { sortOrder: 'asc' } });
  return rows.map(contentShape);
}
async function content(id) {
  const c = await prisma.content.findFirst({ where: { id, published: true } });
  if (!c) throw notFound('Conteúdo não encontrado.');
  return contentShape(c);
}

module.exports = { missions, contents, content };
