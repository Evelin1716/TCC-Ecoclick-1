const { Router } = require('express');
const { z } = require('zod');
const h = require('../utils/asyncHandler');
const validate = require('../middlewares/validate');
const { requireAuth, optionalAuth, requireRole } = require('../middlewares/auth');
const { authLimiter, resetLimiter } = require('../middlewares/rateLimit');
const prisma = require('../config/prisma');
const A = require('../controllers/auth.controller');
const D = require('../controllers/data.controller');

const r = Router();

/* ---------- validações ---------- */
const email = z.string().trim().toLowerCase().email('E-mail inválido.').max(254);
const password = z.string().min(8, 'A senha precisa ter pelo menos 8 caracteres.').max(200);
const id = z.string().trim().min(1).max(120).regex(/^[A-Za-z0-9_.:\-]+$/, 'Identificador inválido.');
const col = z.enum(['posts', 'stories']);
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida.');

const S = {
  signup: z.object({ name: z.string().trim().min(2, 'Informe seu nome.').max(120), email, password, consent: z.literal(true, { errorMap: () => ({ message: 'Para criar a conta, aceite a Política de Privacidade e os Termos de uso.' }) }), consentVersion: z.string().max(20).default('2026-10') }),
  login: z.object({ email, password: z.string().min(1).max(200) }),
  reset: z.object({ email }),
  resetConfirm: z.object({ token: z.string().min(20).max(200), password }),
  email: z.object({ email, currentPassword: z.string().min(1).max(200) }),
  password: z.object({ currentPassword: z.string().min(1).max(200), newPassword: password }),
  appdata: z.object({
    items: z.array(z.object({ key: z.string().max(200), value: z.string() })).max(60).default([]),
    deleted: z.array(z.string().max(200)).max(200).default([]),
  }),
  appointment: z.object({ appointment: z.object({
    id: z.string().max(120), status: z.string().max(30), pointId: z.string().min(1).max(120), date: date, time: z.string().regex(/^\d{2}:\d{2}$/, 'Horário inválido.'),
  }).passthrough().refine((a) => JSON.stringify(a).length <= 40000, 'Agendamento grande demais.') }),
  validate: z.object({ approve: z.boolean(), points: z.number().int().min(0).max(100000).default(0) })
    .refine((b) => !b.approve || b.points > 0, { message: 'Informe os pontos do descarte aprovado.', path: ['points'] }),
  redeem: z.object({ rewardId: id, qty: z.number().int().min(1).max(99) }),
  community: z.object({ data: z.object({}).passthrough() }),
  point: z.object({
    id, name: z.string().min(1).max(200), kind: z.string().min(1).max(200), operator: z.string().min(1).max(200),
    neighborhood: z.string().max(120).nullish(), address: z.string().max(300).nullish(), phone: z.string().max(40).nullish(),
    geoQuery: z.string().max(300).nullish(), geoApprox: z.boolean().optional(),
    lat: z.number().min(-90).max(90).nullish(), lng: z.number().min(-180).max(180).nullish(),
    geoLabel: z.string().max(200).nullish(), geoUrl: z.string().url().max(500).nullish(),
    matNote: z.string().max(500).nullish(), pendingNote: z.string().max(500).nullish(),
    hours: z.array(z.object({ days: z.array(z.number().int().min(0).max(6)), open: z.string().regex(/^\d{2}:\d{2}$/).optional(), close: z.string().regex(/^\d{2}:\d{2}$/).optional(), closed: z.boolean().optional() })).optional(),
    hoursNote: z.string().max(300).nullish(), hoursShort: z.string().max(60).nullish(),
    sources: z.array(z.any()).optional(), verified: z.record(z.boolean()).optional(), active: z.boolean().optional(),
    materialIds: z.array(z.string().max(60)).max(50).optional(),
  }),
};

/* ---------- saúde ---------- */
r.get('/health', h(async (_req, res) => {
  await prisma.$queryRaw`SELECT 1`;
  res.json({ ok: true, time: new Date().toISOString() });
}));

/* ---------- autenticação e conta ---------- */
r.post('/auth/signup', authLimiter, validate({ body: S.signup }), h(A.signup));
r.post('/auth/login', authLimiter, validate({ body: S.login }), h(A.login));
r.post('/auth/logout', A.logout);
r.get('/auth/me', requireAuth, A.me);
r.post('/auth/logout-others', requireAuth, h(A.logoutOthers));
r.post('/auth/reset', resetLimiter, validate({ body: S.reset }), h(A.requestReset));
r.post('/auth/reset/confirm', authLimiter, validate({ body: S.resetConfirm }), h(A.confirmReset));
r.patch('/me/email', requireAuth, validate({ body: S.email }), h(A.updateEmail));
r.patch('/me/password', requireAuth, authLimiter, validate({ body: S.password }), h(A.updatePassword));
r.get('/me/export', requireAuth, h(A.exportData));
r.delete('/me', requireAuth, h(A.deleteAccount));

/* ---------- dados do usuário (interface) ---------- */
r.get('/appdata', requireAuth, h(D.appdataList));
r.put('/appdata', requireAuth, validate({ body: S.appdata }), h(D.appdataSave));

/* ---------- catálogo público ---------- */
r.get('/points', h(D.pointsList));
r.get('/points/:id', validate({ params: z.object({ id }) }), h(D.pointsGet));
r.post('/points', requireAuth, requireRole('ADMIN'), validate({ body: S.point }), h(D.pointsCreate));
r.patch('/points/:id', requireAuth, requireRole('ADMIN'), validate({ params: z.object({ id }), body: S.point.partial().omit({ id: true }) }), h(D.pointsUpdate));
r.delete('/points/:id', requireAuth, requireRole('ADMIN'), validate({ params: z.object({ id }) }), h(D.pointsDelete));
r.get('/materials', h(D.materials));
r.get('/rewards', h(D.rewardsList));
r.get('/missions', h(D.missions));
r.get('/contents', h(D.contents));
r.get('/contents/:id', validate({ params: z.object({ id }) }), h(D.content));

/* ---------- agendamentos ---------- */
r.get('/appointments', requireAuth, h(D.apptList));
r.get('/appointments/taken', requireAuth, validate({ query: z.object({ pointId: id, date }) }), h(D.apptTaken));
r.get('/appointments/pending', requireAuth, requireRole('OPERATOR'), h(D.apptPending));
r.put('/appointments/:id', requireAuth, validate({ params: z.object({ id }), body: S.appointment }), h(D.apptUpsert));
r.post('/appointments/:id/validate', requireAuth, requireRole('OPERATOR'), validate({ params: z.object({ id }), body: S.validate }), h(D.apptValidate));

/* ---------- pontos, recompensas ---------- */
r.get('/progress/balance', requireAuth, h(D.balance));
r.get('/redemptions', requireAuth, h(D.redemptions));
r.post('/rewards/redeem', requireAuth, validate({ body: S.redeem }), h(D.redeem));

/* ---------- comunidade (leitura pública, escrita só logado) ---------- */
r.get('/community/:col', optionalAuth, validate({ params: z.object({ col }) }), h(D.communityList));
r.get('/community/:col/:id', optionalAuth, validate({ params: z.object({ col, id }) }), h(D.communityGet));
r.put('/community/:col/:id', requireAuth, validate({ params: z.object({ col, id }), body: S.community }), h(D.communityPut));
r.delete('/community/:col/:id', requireAuth, validate({ params: z.object({ col, id }) }), h(D.communityDelete));

module.exports = r;
