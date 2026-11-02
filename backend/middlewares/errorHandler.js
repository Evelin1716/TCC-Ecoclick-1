const { AppError } = require('../utils/AppError');
const env = require('../config/env');

const notFoundHandler = (_req, res) => {
  res.status(404).json({ ok: false, error: { code: 'not_found', message: 'Rota não encontrada.' } });
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    return res.status(err.status).json({ ok: false, error: { code: err.code, message: err.message }, ...(err.extra || {}) });
  }
  if (err && err.type === 'entity.too.large') return res.status(413).json({ ok: false, error: { code: 'too_large', message: 'Os dados enviados são grandes demais.' } });
  if (err && err.type === 'entity.parse.failed') return res.status(400).json({ ok: false, error: { code: 'bad_json', message: 'Pedido inválido.' } });
  if (err && err.code === 'P2002') return res.status(409).json({ ok: false, error: { code: 'conflict', message: 'Registro duplicado.' } });
  console.error('[EcoClick] erro inesperado:', err);
  res.status(500).json({ ok: false, error: { code: 'internal', message: 'Erro interno. Tente novamente em instantes.', ...(env.isProd ? {} : { detail: String(err && err.message) }) } });
};

module.exports = { notFoundHandler, errorHandler };
