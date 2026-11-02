const rateLimit = require('express-rate-limit');

const make = (windowMs, limit, message) => rateLimit({
  windowMs, limit, standardHeaders: 'draft-7', legacyHeaders: false,
  handler: (_req, res) => res.status(429).json({ ok: false, error: { code: 'rate_limited', message } }),
});

const apiLimiter = make(60 * 1000, 300, 'Muitos pedidos em pouco tempo. Aguarde um instante.');
const authLimiter = make(15 * 60 * 1000, 20, 'Muitas tentativas. Aguarde alguns minutos e tente de novo.');
const resetLimiter = make(60 * 60 * 1000, 5, 'Muitas solicitações. Tente de novo mais tarde.');

module.exports = { apiLimiter, authLimiter, resetLimiter };
