const prisma = require('../config/prisma');
const { COOKIE, verifySession } = require('../utils/tokens');
const { unauthorized, forbidden } = require('../utils/AppError');

async function loadUser(req) {
  const token = req.cookies && req.cookies[COOKIE];
  if (!token) return null;
  const payload = verifySession(token);
  if (!payload) return null;
  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user || user.tokenVersion !== payload.tv) return null;   // conta apagada ou sessão encerrada
  return user;
}

/** Exige sessão válida. Coloca o usuário em req.user. */
async function requireAuth(req, _res, next) {
  try {
    const user = await loadUser(req);
    if (!user) throw unauthorized();
    req.user = user;
    next();
  } catch (e) { next(e); }
}

/** Sessão opcional: req.user fica nulo para visitantes. */
async function optionalAuth(req, _res, next) {
  try { req.user = await loadUser(req); next(); } catch (e) { next(e); }
}

/** Exige um dos papéis informados (ADMIN sempre passa). */
const requireRole = (...roles) => (req, _res, next) => {
  if (!req.user) return next(unauthorized());
  if (req.user.role === 'ADMIN' || roles.includes(req.user.role)) return next();
  next(forbidden('Apenas a equipe autorizada pode fazer isso.'));
};

module.exports = { requireAuth, optionalAuth, requireRole };
