// Uma única conexão com o banco (Prisma Client) para todo o servidor.
const { PrismaClient } = require('@prisma/client');
const env = require('./env');

const prisma = global.__ecoPrisma || new PrismaClient({ log: env.isProd ? ['error'] : ['warn', 'error'] });
if (!env.isProd) global.__ecoPrisma = prisma;

module.exports = prisma;
