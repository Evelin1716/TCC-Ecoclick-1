const appdata = require('../services/appdata.service');
const points = require('../services/points.service');
const appts = require('../services/appointment.service');
const rewards = require('../services/reward.service');
const community = require('../services/community.service');
const catalog = require('../services/catalog.service');

exports.appdataList = async (req, res) => res.json({ items: await appdata.list(req.user.id) });
exports.appdataSave = async (req, res) => {
  const r = await appdata.save(req.user.id, req.body.items, req.body.deleted);
  if (!r.ok) return res.status(413).json({ ok: false, error: { code: 'limit', message: 'Limite de dados da conta atingido.' } });
  res.json(r);
};

exports.pointsList = async (_req, res) => res.json(await points.list());
exports.pointsGet = async (req, res) => res.json(await points.get(req.params.id));
exports.pointsCreate = async (req, res) => res.status(201).json(await points.create(req.body));
exports.pointsUpdate = async (req, res) => res.json(await points.update(req.params.id, req.body));
exports.pointsDelete = async (req, res) => { await points.deactivate(req.params.id); res.status(204).end(); };
exports.materials = async (_req, res) => res.json({ items: await points.listMaterials() });

exports.apptList = async (req, res) => res.json({ items: await appts.list(req.user.id) });
exports.apptTaken = async (req, res) => res.json({ times: await appts.taken(req.query.pointId, req.query.date) });
exports.apptUpsert = async (req, res) => res.json(await appts.upsert(req.user.id, req.params.id, req.body.appointment));
exports.apptValidate = async (req, res) => res.json({ ok: true, ...(await appts.validate(req.user, req.params.id, req.body)) });
exports.apptPending = async (req, res) => res.json({ items: await appts.pendingFor(req.user) });

exports.balance = async (req, res) => res.json({ balance: await rewards.balance(req.user.id) });
exports.rewardsList = async (_req, res) => res.json({ items: await rewards.listRewards() });
exports.redemptions = async (req, res) => res.json({ items: await rewards.listRedemptions(req.user.id) });
exports.redeem = async (req, res) => res.json({ ok: true, ...(await rewards.redeem(req.user.id, req.body.rewardId, req.body.qty)) });

exports.missionCredit = async (req, res) => res.json({ ok: true, ...(await rewards.creditMissions(req.user.id, req.body.items)) });

exports.communityList = async (req, res) => res.json({ items: await community.list(req.params.col) });
exports.communityGet = async (req, res) => res.json(await community.get(req.params.col, req.params.id));
exports.communityPut = async (req, res) => { await community.put(req.params.col, req.params.id, req.body.data, req.user); res.json({ ok: true }); };
exports.communityDelete = async (req, res) => { await community.remove(req.params.col, req.params.id, req.user); res.status(204).end(); };

exports.missions = async (_req, res) => res.json({ items: await catalog.missions() });
exports.contents = async (_req, res) => res.json({ items: await catalog.contents() });
exports.content = async (req, res) => res.json(await catalog.content(req.params.id));
