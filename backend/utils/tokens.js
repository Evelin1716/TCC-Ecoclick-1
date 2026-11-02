const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const env = require('../config/env');

const COOKIE = 'eco_token';

const signSession = (user) => jwt.sign({ sub: user.id, tv: user.tokenVersion }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
const verifySession = (token) => {
  try { return jwt.verify(token, env.JWT_SECRET); } catch { return null; }
};

const cookieOptions = () => ({
  httpOnly: true,                       // o JavaScript da página nunca enxerga o token
  sameSite: 'lax',
  secure: env.COOKIE_SECURE,
  path: '/',
  maxAge: env.jwtMaxAgeMs,
});
const setSessionCookie = (res, user) => res.cookie(COOKIE, signSession(user), cookieOptions());
const clearSessionCookie = (res) => res.clearCookie(COOKIE, { ...cookieOptions(), maxAge: undefined });

const randomToken = () => crypto.randomBytes(32).toString('base64url');
const sha256 = (s) => crypto.createHash('sha256').update(s).digest('hex');

module.exports = { COOKIE, signSession, verifySession, setSessionCookie, clearSessionCookie, randomToken, sha256 };
