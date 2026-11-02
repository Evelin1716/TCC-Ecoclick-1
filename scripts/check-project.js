// Verificação estática do projeto (sem banco e sem servidor): npm run check
//  1) sintaxe de todos os .js (frontend e backend)   2) todo href/src/url() dos HTML e CSS aponta para um arquivo que existe
//  3) todos os links entre páginas (data-eco-nav) apontam para rotas existentes   4) schema.prisma e sementes presentes
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = path.join(__dirname, '..');
let problems = 0;
const fail = (m) => { problems++; console.error('  ✗ ' + m); };
const walk = (d, out = []) => { for (const f of fs.readdirSync(d, { withFileTypes: true })) { if (f.name === 'node_modules' || f.name.startsWith('.git')) continue; const p = path.join(d, f.name); f.isDirectory() ? walk(p, out) : out.push(p); } return out; };
const rel = (p) => path.relative(root, p);
const files = walk(root);

console.log('1) Sintaxe dos arquivos JavaScript');
const js = files.filter((f) => f.endsWith('.js'));
js.forEach((f) => { try { execFileSync(process.execPath, ['--check', f], { stdio: 'pipe' }); } catch (e) { fail(rel(f) + ': ' + String(e.stderr).split('\n').slice(0, 3).join(' ')); } });
console.log(`   ${js.length} arquivos verificados`);

console.log('2) Caminhos de HTML e CSS');
let refs = 0;
const check = (from, ref) => {
  if (!ref || /^(https?:|data:|mailto:|tel:|#|javascript:|\/\/)/.test(ref)) return;
  const clean = ref.split('#')[0].split('?')[0]; if (!clean) return;
  refs++;
  const target = path.resolve(path.dirname(from), clean);
  if (!fs.existsSync(target)) fail(`${rel(from)} → ${ref} (arquivo não encontrado)`);
};
files.filter((f) => f.endsWith('.html')).forEach((f) => {
  const t = fs.readFileSync(f, 'utf8');
  for (const m of t.matchAll(/\b(?:href|src)="([^"]+)"/g)) check(f, m[1]);
});
files.filter((f) => f.endsWith('.css')).forEach((f) => {
  const t = fs.readFileSync(f, 'utf8');
  for (const m of t.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/g)) check(f, m[1]);
});
console.log(`   ${refs} referências verificadas`);

console.log('3) Links entre páginas (data-eco-nav)');
const mainJs = fs.readFileSync(path.join(root, 'frontend/js/main.js'), 'utf8');
const routes = {};
for (const m of mainJs.matchAll(/^\s*(\w+):\s*'([^']+\.html)'/gm)) routes[m[1]] = m[2];
Object.entries(routes).forEach(([k, v]) => { if (!fs.existsSync(path.join(root, 'frontend', v))) fail(`rota "${k}" → ${v} não existe`); });
let navs = 0;
const all = [...files.filter((f) => f.endsWith('.html')), ...files.filter((f) => f.endsWith('.js') && f.includes('frontend'))];
all.forEach((f) => {
  const t = fs.readFileSync(f, 'utf8');
  for (const m of t.matchAll(/data-eco-nav="(\w+)"|EcoNav\(\s*['"](\w+)['"]/g)) { const k = m[1] || m[2]; navs++; if (!routes[k]) fail(`${rel(f)}: rota desconhecida "${k}"`); }
});
console.log(`   ${Object.keys(routes).length} rotas, ${navs} usos verificados`);

console.log('4) Banco de dados');
['prisma/schema.prisma', 'prisma/seed.js', 'prisma/seed-data/points.json', '.env.example'].forEach((f) => { if (!fs.existsSync(path.join(root, f))) fail(`${f} ausente`); });
['points', 'materials', 'rewards', 'contents', 'missions'].forEach((n) => { try { JSON.parse(fs.readFileSync(path.join(root, `prisma/seed-data/${n}.json`), 'utf8')); } catch (e) { fail(`seed-data/${n}.json inválido`); } });

console.log(problems ? `\n${problems} problema(s) encontrado(s).` : '\nTudo certo.');
process.exit(problems ? 1 : 0);
