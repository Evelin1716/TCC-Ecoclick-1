// Lê e valida as variáveis de ambiente (.env). Se algo obrigatório faltar, o servidor não sobe e explica o motivo.
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });
const { z } = require('zod');

const bool = (def) => z.preprocess((v) => (v === undefined || v === '' ? def : String(v).toLowerCase() === 'true'), z.boolean());

const schema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL é obrigatório (veja .env.example)'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET precisa ter pelo menos 32 caracteres (veja .env.example)'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  COOKIE_SECURE: bool(false),
  FRONTEND_URL: z.string().default('http://localhost:3000'),
  CORS_ORIGINS: z.string().default(''),
  SERVE_FRONTEND: bool(true),
  SMTP_HOST: z.string().optional().default(''),
  SMTP_PORT: z.coerce.number().int().default(587),
  SMTP_USER: z.string().optional().default(''),
  SMTP_PASS: z.string().optional().default(''),
  MAIL_FROM: z.string().default('EcoClick <nao-responda@localhost>'),
  PASSWORD_RESET_TTL_MIN: z.coerce.number().int().min(5).max(1440).default(60),
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  const lines = parsed.error.issues.map((i) => `  - ${i.path.join('.') || 'env'}: ${i.message}`).join('\n');
  console.error(`\n[EcoClick] Configuração inválida no arquivo .env:\n${lines}\n\nCopie .env.example para .env e preencha os valores.\n`);
  process.exit(1);
}

const env = parsed.data;
env.isProd = env.NODE_ENV === 'production';
env.corsOrigins = env.CORS_ORIGINS.split(',').map((s) => s.trim()).filter(Boolean);
env.jwtMaxAgeMs = (() => {
  const m = String(env.JWT_EXPIRES_IN).match(/^(\d+)\s*([smhd])$/);
  if (!m) return 7 * 24 * 3600 * 1000;
  return Number(m[1]) * { s: 1000, m: 60000, h: 3600000, d: 86400000 }[m[2]];
})();

module.exports = env;
