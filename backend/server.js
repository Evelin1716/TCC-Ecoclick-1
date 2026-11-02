const env = require('./config/env');
const prisma = require('./config/prisma');
const app = require('./app');

const server = app.listen(env.PORT, () => {
  console.log(`\n  EcoClick rodando em http://localhost:${env.PORT}`);
  console.log(`  API:       http://localhost:${env.PORT}/api/health`);
  if (env.SERVE_FRONTEND) console.log(`  Site:      http://localhost:${env.PORT}/\n`);
});

async function shutdown(signal) {
  console.log(`\n[EcoClick] ${signal}: encerrando…`);
  server.close(async () => { await prisma.$disconnect(); process.exit(0); });
  setTimeout(() => process.exit(1), 10000).unref();
}
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('unhandledRejection', (e) => console.error('[EcoClick] promessa rejeitada sem tratamento:', e));
