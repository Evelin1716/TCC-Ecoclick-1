const helmet = require('helmet');
const cors = require('cors');
const env = require('../config/env');
const { forbidden } = require('../utils/AppError');

/** Cabeçalhos de segurança e política de conteúdo (CSP). Todo script do site é arquivo próprio (sem JavaScript inline). */
const securityHeaders = helmet({
  contentSecurityPolicy: {
    useDefaults: false,
    directives: {
      'default-src': ["'self'"],
      'script-src': ["'self'"],
      'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      'font-src': ["'self'", 'https://fonts.gstatic.com', 'data:'],
      'img-src': ["'self'", 'data:', 'blob:', 'https://*.tile.openstreetmap.org'],
      'connect-src': ["'self'", 'https://nominatim.openstreetmap.org', ...env.corsOrigins],
      'frame-src': ["'self'"],
      'object-src': ["'none'"],
      'base-uri': ["'self'"],
      'form-action': ["'self'"],
      'frame-ancestors': ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false,
});

/** CORS só para as origens listadas em CORS_ORIGINS (com cookies). */
const corsMiddleware = cors({
  origin(origin, cb) { cb(null, !origin || env.corsOrigins.includes(origin)); },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'X-Requested-With'],
  maxAge: 600,
});

/** Proteção extra contra CSRF: pedidos que alteram dados precisam do cabeçalho X-Requested-With (outros sites não conseguem enviá-lo). */
function requireCustomHeader(req, _res, next) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  if (req.get('X-Requested-With') === 'EcoClick') return next();
  next(forbidden('Pedido não autorizado.', 'csrf'));
}

module.exports = { securityHeaders, corsMiddleware, requireCustomHeader };
