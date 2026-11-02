// Popula o banco com os catálogos que já existiam no código do EcoClick (pontos, materiais, recompensas, conteúdos e missões).
// Roda com: npm run db:seed   (pode ser repetido: usa "upsert", não duplica).
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();
const read = (f) => JSON.parse(fs.readFileSync(path.join(__dirname, 'seed-data', f), 'utf8'));

async function main() {
  const materials = read('materials.json');
  for (const m of materials) {
    await prisma.material.upsert({ where: { id: m.id }, create: { id: m.id, name: m.name, sortOrder: m.sortOrder, prepTips: m.prepTips }, update: { name: m.name, sortOrder: m.sortOrder, prepTips: m.prepTips } });
  }
  const byName = Object.fromEntries(materials.map((m) => [m.name, m.id]));

  // ATENÇÃO: estes pontos vêm de pesquisa na internet feita no projeto original. Confirme os dados antes de publicar.
  const { points } = read('points.json');
  for (const p of points) {
    const data = {
      name: p.name, kind: p.kind, operator: p.operator, neighborhood: p.neighborhood, address: p.address, geoQuery: p.geoQuery,
      geoApprox: p.geoApprox, lat: p.lat, lng: p.lng, geoLabel: p.geoLabel, geoUrl: p.geoUrl, matNote: p.matNote, pendingNote: p.pendingNote,
      hours: p.hours, hoursNote: p.hoursNote, hoursShort: p.hoursShort, sources: p.sources, verified: p.verified,
    };
    await prisma.collectionPoint.upsert({ where: { id: p.id }, create: { id: p.id, ...data }, update: data });
    await prisma.pointMaterial.deleteMany({ where: { pointId: p.id } });
    const ids = p.materials.map((n) => byName[n]).filter(Boolean);
    if (ids.length) await prisma.pointMaterial.createMany({ data: ids.map((materialId) => ({ pointId: p.id, materialId })), skipDuplicates: true });
  }

  for (const r of read('rewards.json')) {
    const d = { name: r.name, description: r.description, cost: r.cost, glow: r.glow, sortOrder: r.sortOrder };
    await prisma.reward.upsert({ where: { id: r.id }, create: { id: r.id, ...d }, update: d });
  }
  for (const c of read('contents.json')) {
    const d = { type: c.type, category: c.category, title: c.title, description: c.description, image: c.image, body: c.body, refs: c.refs, sortOrder: c.sortOrder };
    await prisma.content.upsert({ where: { id: c.id }, create: { id: c.id, ...d }, update: d });
  }
  for (const m of read('missions.json')) {
    const d = { chain: m.chain, stepOrder: m.stepOrder, category: m.category, title: m.title, description: m.description, points: m.points, xp: m.xp, goal: m.goal, minLevel: m.minLevel || null, sortOrder: m.sortOrder };
    await prisma.mission.upsert({ where: { id: m.id }, create: { id: m.id, ...d }, update: d });
  }

  const email = (process.env.SEED_ADMIN_EMAIL || '').trim().toLowerCase();
  const pass = process.env.SEED_ADMIN_PASSWORD || '';
  if (email && pass.length >= 8) {
    await prisma.user.upsert({
      where: { email },
      create: { name: 'Administrador', email, passwordHash: await bcrypt.hash(pass, 12), role: 'ADMIN' },
      update: { role: 'ADMIN' },
    });
    console.log(`Administrador garantido: ${email}`);
  }
  console.log(`Seed concluído: ${materials.length} materiais, ${points.length} pontos, ${read('rewards.json').length} recompensas, ${read('contents.json').length} conteúdos, ${read('missions.json').length} missões.`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
