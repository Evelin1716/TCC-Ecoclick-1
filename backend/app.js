const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const env = require('./config/env');
const { securityHeaders, corsMiddleware, requireCustomHeader } = require('./middlewares/security');
const { apiLimiter } = require('./middlewares/rateLimit');
const { notFoundHandler, errorHandler } = require('./middlewares/errorHandler');
const routes = require('./routes');

const app = express();
app.disable('x-powered-by');
if (env.isProd) app.set('trust proxy', 1);

app.use(securityHeaders);
app.use(corsMiddleware);
app.use(express.json({ limit: '2mb' }));
app.use(cookieParser());

app.use('/api', apiLimiter, requireCustomHeader, routes);
app.use('/api', notFoundHandler);

if (env.SERVE_FRONTEND) {
  const dir = path.join(__dirname, '..', 'frontend');
  app.use(express.static(dir, { extensions: ['html'], maxAge: env.isProd ? '1h' : 0 }));
  app.get('/', (_req, res) => res.sendFile(path.join(dir, 'index.html')));
}

app.use(errorHandler);
module.exports = app;
