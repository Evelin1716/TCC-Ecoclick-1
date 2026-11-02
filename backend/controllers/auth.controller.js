const svc = require('../services/auth.service');
const prisma = require('../config/prisma');
const { setSessionCookie, clearSessionCookie } = require('../utils/tokens');

exports.signup = async (req, res) => {
  const user = await svc.signup(req.body);
  setSessionCookie(res, user);
  res.status(201).json({ user: svc.publicUser(user) });
};
exports.login = async (req, res) => {
  const user = await svc.login(req.body);
  setSessionCookie(res, user);
  res.json({ user: svc.publicUser(user) });
};
exports.logout = (_req, res) => { clearSessionCookie(res); res.status(204).end(); };
exports.me = (req, res) => res.json({ user: svc.publicUser(req.user) });
exports.logoutOthers = async (req, res) => {
  const user = await svc.bumpSessions(req.user.id);
  setSessionCookie(res, user);          // a sessão atual continua valendo com um token novo
  res.json({ ok: true });
};
exports.requestReset = async (req, res) => { await svc.requestReset(req.body.email); res.json({ ok: true }); };
exports.confirmReset = async (req, res) => { await svc.confirmReset(req.body); res.json({ ok: true }); };
exports.updateEmail = async (req, res) => { const u = await svc.updateEmail(req.user, req.body); res.json({ user: svc.publicUser(u) }); };
exports.updatePassword = async (req, res) => {
  const user = await svc.updatePassword(req.user, req.body);
  setSessionCookie(res, user);
  res.json({ ok: true });
};
exports.deleteAccount = async (req, res) => { await svc.deleteAccount(req.user.id); clearSessionCookie(res); res.status(204).end(); };
exports.exportData = async (req, res) => {
  res.set('Content-Disposition', 'attachment; filename="ecoclick-meus-dados.json"');
  res.json(await svc.exportData(req.user));
};
exports._prisma = prisma;
