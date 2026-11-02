/* =====================================================================
   api.js — camada única de comunicação do frontend com o backend (Express + Prisma).
   Define, em window:
     EcoApi      cliente HTTP (cookie httpOnly de sessão, JSON, erros padronizados)
     EcoStore    leitura/gravação segura no localStorage (com memória como reserva)
     EcoBackend  autenticação, sincronização dos dados do usuário, agendamentos, recompensas e comunidade
     EcoDB       fachada compatível usada pelas telas (flush, ready, release, takenTimes…)
   As telas continuam usando o localStorage como cache de leitura rápida; tudo que é gravado ali
   é enviado ao servidor (PostgreSQL) e recarregado do servidor ao abrir cada página.
   O que o servidor decide sozinho (nunca o navegador): conta/senha, saldo de pontos, validação de descartes,
   horários lotados, resgates de recompensas.
   ===================================================================== */
(function () {
  'use strict';
  var cfg = window.ECO_CONFIG || (window.ECO_CONFIG = { apiUrl: '/api', policyVersion: '2026-10' });
  var POLICY_VERSION = cfg.policyVersion || '2026-10';
  function base() { return String(cfg.apiUrl || '/api').replace(/\/+$/, ''); }

  /* ---------- armazenamento local ---------- */
  var _set = Storage.prototype.setItem, _rem = Storage.prototype.removeItem;
  var MEM = {};
  function lget(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function raw(k, v) { try { _set.call(localStorage, k, v); } catch (e) {} }
  function rawDel(k) { try { _rem.call(localStorage, k); } catch (e) {} }
  function lj(k, d) { try { var v = JSON.parse(lget(k)); return v == null ? d : v; } catch (e) { return d; } }
  var EcoStore = {
    get: function (k) { var v = lget(k); if (v != null) return v; return Object.prototype.hasOwnProperty.call(MEM, k) ? MEM[k] : null; },
    set: function (k, v) { MEM[k] = v; try { localStorage.setItem(k, v); } catch (e) {} }
  };

  /* ---------- cliente HTTP ---------- */
  function ApiError(status, code, message, data) {
    var e = new Error(message || 'Erro de comunicação com o servidor.');
    e.name = 'ApiError'; e.status = status; e.code = code; e.data = data; return e;
  }
  function request(method, path, body, opt) {
    opt = opt || {};
    var headers = { 'X-Requested-With': 'EcoClick' };
    if (body !== undefined) headers['Content-Type'] = 'application/json';
    return fetch(base() + path, {
      method: method, headers: headers, credentials: 'include', keepalive: !!opt.keepalive,
      body: body !== undefined ? JSON.stringify(body) : undefined
    }).then(function (r) {
      if (r.status === 204) return null;
      return r.text().then(function (t) {
        var d = null; try { d = t ? JSON.parse(t) : null; } catch (e) {}
        if (!r.ok) {
          var er = (d && d.error) || {};
          throw ApiError(r.status, er.code || (d && d.error) || 'http_' + r.status, er.message || (d && d.message) || '', d);
        }
        return d;
      });
    }, function () { throw ApiError(0, 'network', 'Sem conexão com o servidor. Verifique a internet e tente de novo.'); });
  }
  var EcoApi = {
    base: base,
    get: function (p) { return request('GET', p); },
    post: function (p, b) { return request('POST', p, b === undefined ? {} : b); },
    put: function (p, b, o) { return request('PUT', p, b, o); },
    patch: function (p, b) { return request('PATCH', p, b); },
    del: function (p) { return request('DELETE', p); }
  };
  function msgOf(e) {
    if (!e) return 'Não foi possível concluir agora. Tente novamente.';
    if (e.status === 0) return e.message;
    if (e.message && e.status && e.status < 500) return e.message;
    return 'Não foi possível concluir agora. Tente novamente.';
  }

  /* ---------- estado interno ---------- */
  var SKIP = { ecoclick_current_user: 1, ecoclick_users: 1, ecoclick_owner: 1, ecoclick_redemptions: 1, ecoclick_disposal_ledger: 1 };
  function mine(k) { return !!k && (k.indexOf('ecoclick_') === 0 || k.indexOf('ecoclick:') === 0) && !SKIP[k]; }
  var uid = null, mail = '', online = false, pulling = false, busy = false, again = false, timer = null, balance = 0;
  var known = {}, apptKnown = {};
  /* chaves alteradas aqui e ainda não enviadas (sobrevive à troca de página) */
  var DIRTY = 'eco_dirty_keys';
  function dirtySet() { var o = {}; lj(DIRTY, []).forEach(function (k) { o[k] = 1; }); return o; }
  function saveDirty(o) { var a = Object.keys(o); if (a.length) raw(DIRTY, JSON.stringify(a)); else rawDel(DIRTY); }
  function markDirty(k) { var o = dirtySet(); if (!o[k]) { o[k] = 1; saveDirty(o); } }
  function localKeys() {
    var o = {};
    try { for (var i = 0; i < localStorage.length; i++) { var k = localStorage.key(i); if (mine(k)) o[k] = localStorage.getItem(k); } } catch (e) {}
    return o;
  }
  function clearLocal() {
    known = {}; apptKnown = {}; balance = 0;
    var ks = [];
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (k && (k.indexOf('ecoclick_') === 0 || k.indexOf('ecoclick:') === 0) && k !== 'ecoclick_theme') ks.push(k);
      }
    } catch (e) {}
    ks.forEach(rawDel); rawDel(DIRTY);
    try { sessionStorage.removeItem('eco_hydrated'); } catch (e) {}
  }
  function frameDoc() { return document; }
  function fire(name, detail) { try { document.dispatchEvent(new CustomEvent(name, { detail: detail })); } catch (e) {} }
  function pushNotif(type, title, text) {
    var l = lj('ecoclick_notifications', []);
    l.unshift({ id: 'n' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5), type: type, title: title, text: text, createdAt: new Date().toISOString(), read: false });
    raw('ecoclick_notifications', JSON.stringify(l.slice(0, 100)));
  }
  function fixPoints() { var p = lj('ecoclick_profile', {}); if (+p.points !== balance) { p.points = balance; raw('ecoclick_profile', JSON.stringify(p)); } }
  function markSince(email, ts) {
    try {
      email = String(email || '').toLowerCase(); if (!email) return;
      var m = lj('ecoclick_since', {}) || {}; if (m[email]) return;
      var d = new Date(ts || Date.now()); if (isNaN(d.getTime())) d = new Date();
      m[email] = d.toISOString(); raw('ecoclick_since', JSON.stringify(m));
    } catch (e) {}
  }

  /* ---------- servidor -> navegador ---------- */
  function applyItems(items) {
    var dirty = dirtySet(), seen = {};
    (items || []).forEach(function (x) {
      if (!mine(x.key)) return; seen[x.key] = 1;
      if (!dirty[x.key] && lget(x.key) !== x.value) raw(x.key, x.value);
      known[x.key] = x.value;
    });
    Object.keys(known).forEach(function (k) { if (!seen[k] && !dirty[k]) { delete known[k]; rawDel(k); } });
  }
  /* Antes de qualquer script da página rodar, traz os dados do servidor (requisição síncrona, no máximo a cada 30 s).
     Assim as telas sempre leem o que está no banco, mesmo ao trocar de página ou de aparelho. */
  function hydrateSync() {
    try {
      if (!lget('ecoclick_current_user')) return;
      var t = +sessionStorage.getItem('eco_hydrated') || 0;
      if (Date.now() - t < 30000) return;
      var x = new XMLHttpRequest();
      x.open('GET', base() + '/appdata', false); x.withCredentials = true; x.setRequestHeader('X-Requested-With', 'EcoClick');
      x.send();
      if (x.status === 200) {
        applyItems((JSON.parse(x.responseText) || {}).items);
        sessionStorage.setItem('eco_hydrated', String(Date.now()));
        online = true;
      } else if (x.status === 401) { clearLocal(); }
    } catch (e) { online = false; }
  }
  async function pull() {
    if (!uid) return; pulling = true;
    try {
      var r = await EcoApi.get('/appdata'); applyItems(r.items);
      try { sessionStorage.setItem('eco_hydrated', String(Date.now())); } catch (e) {}
      await pullServerOwned();
    } catch (e) { if (e && e.status === 401) { clearLocal(); } else if (!e || e.status !== 0) console.error('backend pull', e); }
    pulling = false; fixPoints(); flush();
  }
  async function pullServerOwned() {
    var b = await EcoApi.get('/progress/balance'); balance = (+b.balance) || 0;
    var rd = await EcoApi.get('/redemptions');
    raw('ecoclick_redemptions', JSON.stringify((rd.items || []).map(function (x) { return { id: x.id, rewardId: x.rewardId, name: x.name, qty: x.qty, total: x.total, at: x.createdAt }; })));
    var ap = await EcoApi.get('/appointments');
    var srv = {}; (ap.items || []).forEach(function (x) { srv[x.id] = x; });
    var list = lj('ecoclick_appointments', []), changed = false, ledger = {}, newly = [];
    list.forEach(function (a) {
      var s = srv[a.id];
      if (s && s.status !== a.status && (s.status === 'completed' || s.status === 'rejected' || a.status === 'completed')) {
        var was = a.status; a.status = s.status === 'rejected' ? 'cancelled' : s.status; changed = true;
        if (!Array.isArray(a.history)) a.history = [];
        if (s.status === 'completed') {
          a.disposal = a.disposal || {}; a.disposal.validated = true;
          a.history.push({ at: s.validatedAt || new Date().toISOString(), ev: 'Descarte validado' });
          if (was !== 'completed') newly.push({ id: a.id, points: s.points, name: a.pointName });
        } else if (s.status === 'rejected') a.history.push({ at: new Date().toISOString(), ev: 'Descarte não validado pela equipe do ponto' });
      } else if (!s && a.status === 'completed') { a.status = 'planned'; changed = true; }   // "concluído" inventado no navegador é desfeito
      if (a.status === 'pending_validation') ledger[a.id] = { status: 'pending_validation', credited: false, at: new Date().toISOString() };
      if (s && s.status === 'completed') ledger[a.id] = { status: 'completed', credited: true, points: s.points, at: s.validatedAt };
    });
    if (changed) raw('ecoclick_appointments', JSON.stringify(list));
    raw('ecoclick_disposal_ledger', JSON.stringify(ledger));
    newly.forEach(function (n) {
      pushNotif('reward', 'Descarte validado', '+' + n.points + ' pontos creditados' + (n.name ? ' (' + n.name + ')' : '') + '.');
      fire('ecoclick:disposal-validated', { id: n.id, points: n.points });
    });
    if (newly.length) fire('ecoclick:points-changed', {});
    if (changed) fire('ecoclick:appointment-created', {});
  }

  /* ---------- navegador -> servidor ---------- */
  async function pushAppointments() {
    var list = lj('ecoclick_appointments', []), changed = false;
    for (var i = 0; i < list.length; i++) {
      var a = list[i]; if (!a || !a.id) continue;
      var sig = [a.status, a.date, a.time, a.pointId].join('|'); if (apptKnown[a.id] === sig) continue;
      try {
        var r = await EcoApi.put('/appointments/' + encodeURIComponent(a.id), { appointment: a });
        if (r && r.ok) { apptKnown[a.id] = sig; continue; }
      } catch (e) {
        var why = e && e.data && e.data.error && (e.data.error.code || e.data.error);
        if (e && e.status === 409 || why === 'slot_full' || why === 'unknown_point' || why === 'invalid_datetime') {
          a.status = 'cancelled'; if (!Array.isArray(a.history)) a.history = [];
          a.history.push({ at: new Date().toISOString(), ev: why === 'slot_full' ? 'Horário lotado: reagende para outro horário' : 'Plano recusado pelo servidor' });
          apptKnown[a.id] = [a.status, a.date, a.time, a.pointId].join('|'); changed = true;
          pushNotif('appointment', 'Horário indisponível', (a.pointName || 'O ponto') + ': esse horário já está lotado. Escolha outro horário.');
        } else if (e && e.status >= 400) console.error('appointment', e);
      }
    }
    if (changed) { raw('ecoclick_appointments', JSON.stringify(list)); fire('ecoclick:appointment-created', {}); }
  }
  async function sync(opt) {
    if (!uid || pulling) return; if (busy) { again = true; return; } busy = true;
    try {
      var cur = localKeys(), items = [];
      Object.keys(cur).forEach(function (k) { if (known[k] !== cur[k]) items.push({ key: k, value: cur[k] }); });
      var gone = Object.keys(known).filter(function (k) { return !(k in cur); });
      for (var i = 0; i < items.length || (i === 0 && gone.length); i += 40) {
        var chunk = items.slice(i, i + 40);
        await EcoApi.put('/appdata', { items: chunk, deleted: i === 0 ? gone : [] }, opt);
        chunk.forEach(function (x) { known[x.key] = x.value; });
        if (i === 0) gone.forEach(function (k) { delete known[k]; });
        if (!items.length) break;
      }
      var d = dirtySet(); Object.keys(cur).forEach(function (k) { if (known[k] === cur[k]) delete d[k]; }); saveDirty(d);
      await pushAppointments(); fixPoints();
    } catch (e) { if (e && (e.status === 401 || e.status === 0)) { /* sessão expirou ou troca de página em andamento */ } else console.error('backend sync', e); }
    busy = false; if (again) { again = false; sync(); }
  }
  function flush() { clearTimeout(timer); timer = setTimeout(sync, 250); }
  function refresh() { return pull(); }

  /* ---------- sessão ---------- */
  async function adopt(user) {
    uid = user.id; mail = user.email || '';
    var owner = lget('ecoclick_owner');
    if (owner && owner !== uid) clearLocal();                       // outro usuário usou este navegador: nunca misturar dados
    raw('ecoclick_current_user', JSON.stringify({ name: user.name || mail.split('@')[0], email: mail }));
    markSince(mail, user.createdAt);
    raw('ecoclick_owner', uid);
    rawDel('ecoclick_users');
    await pull();
  }
  async function auth(d) {
    var email = String(d.email || '').trim().toLowerCase(), pass = String(d.pass || '');
    try {
      if (d.op === 'signup') {
        if (!d.consent) return { ok: false, msg: 'Para criar a conta, aceite a Política de Privacidade e os Termos de uso.' };
        var s = await EcoApi.post('/auth/signup', { name: String(d.name || '').trim(), email: email, password: pass, consent: true, consentVersion: POLICY_VERSION });
        await adopt(s.user); return { ok: true };
      }
      if (d.op === 'login') {
        var l = await EcoApi.post('/auth/login', { email: email, password: pass });
        await adopt(l.user); return { ok: true };
      }
      if (d.op === 'reset') {
        await EcoApi.post('/auth/reset', { email: email });
        return { ok: true, msg: 'Se esse e-mail estiver cadastrado, enviaremos um link para criar uma nova senha.' };   // não revela se a conta existe
      }
    } catch (e) { return { ok: false, msg: msgOf(e) }; }
    return { ok: false, msg: 'Operação não suportada.' };
  }
  async function logout() {
    try { await sync(); } catch (e) {}
    try { await EcoApi.post('/auth/logout'); } catch (e) {}
    uid = null; clearLocal(); rawDel('ecoclick_current_user'); rawDel('ecoclick_owner');
  }
  async function updateEmail(email, pw) {
    try { await EcoApi.patch('/me/email', { email: email, currentPassword: pw }); return { ok: true, pending: false }; }
    catch (e) { return { ok: false, msg: e.status === 403 ? 'Senha atual incorreta.' : msgOf(e) }; }
  }
  async function updatePassword(cur, nw) {
    try { await EcoApi.patch('/me/password', { currentPassword: cur, newPassword: nw }); return { ok: true }; }
    catch (e) { return { ok: false, msg: e.status === 403 ? 'Senha atual incorreta.' : msgOf(e) }; }
  }
  async function signOutOthers() { try { await EcoApi.post('/auth/logout-others'); } catch (e) {} return true; }
  async function exportData() { return EcoApi.get('/me/export'); }
  async function deleteAccount() { await EcoApi.del('/me'); return true; }
  async function confirmReset(token, password) {
    try { await EcoApi.post('/auth/reset/confirm', { token: token, password: password }); return { ok: true }; }
    catch (e) { return { ok: false, msg: msgOf(e) }; }
  }

  /* ---------- recompensas e comunidade ---------- */
  async function redeem(rewardId, qty) {
    if (!uid) return { ok: false, msg: 'Entre na sua conta para resgatar.' };
    try {
      var d = await EcoApi.post('/rewards/redeem', { rewardId: rewardId, qty: qty });
      balance = d.balance; fixPoints();
      return { ok: true, total: d.total, balance: d.balance, id: d.id };
    } catch (e) {
      var d2 = (e && e.data) || {};
      if (d2.balance != null) balance = d2.balance;
      var code = d2.error && (d2.error.code || d2.error);
      return { ok: false, total: d2.total, balance: d2.balance, msg: code === 'insufficient' ? 'Saldo insuficiente. Nenhum ponto foi descontado.' : 'Não foi possível concluir o resgate. Nenhum ponto foi descontado.' };
    }
  }
  async function community(m) {
    var a = m.a || {}, col = a.col === 'stories' ? 'stories' : 'posts', id = String(a.id || '');
    try {
      if (m.op === 'list') { var r = await EcoApi.get('/community/' + col); return { ok: true, posts: r.items.map(function (x) { return x.data; }) }; }
      if (m.op === 'get') { var g = await EcoApi.get('/community/' + col + '/' + encodeURIComponent(id)); return { ok: true, post: g ? g.data : null }; }
      if (!uid) return { ok: false };
      if (m.op === 'set' && a.post && String(a.post.id) === id) {
        if (JSON.stringify(a.post).length > 240000) return { ok: false };
        await EcoApi.put('/community/' + col + '/' + encodeURIComponent(id), { data: a.post }); return { ok: true };
      }
      if (m.op === 'del') { await EcoApi.del('/community/' + col + '/' + encodeURIComponent(id)); return { ok: true }; }
    } catch (e) { return { ok: false }; }
    return { ok: false };
  }

  /* ---------- inicialização ---------- */
  var hooked = false;
  function hook() {
    if (hooked) return; hooked = true;
    window.addEventListener('storage', flush);
    Storage.prototype.setItem = function (k, v) { _set.call(this, k, v); if (this === window.localStorage && mine(k) && !pulling) { markDirty(k); flush(); } };
    Storage.prototype.removeItem = function (k) { _rem.call(this, k); if (this === window.localStorage && mine(k) && !pulling) flush(); };
    setInterval(function () { if (uid && !document.hidden) pull(); }, 60000);
    document.addEventListener('visibilitychange', function () {
      if (!uid) return;
      if (document.hidden) sync({ keepalive: true }); else pull();
    });
    window.addEventListener('pagehide', function () { if (uid) sync({ keepalive: true }); });
  }
  async function init() {
    try {
      var m = await EcoApi.get('/auth/me'); online = true;
      if (m && m.user) await adopt(m.user);
      else if (lget('ecoclick_owner') || lget('ecoclick_current_user')) clearLocal();
    } catch (e) {
      if (e && e.status === 401) { online = true; if (lget('ecoclick_owner') || lget('ecoclick_current_user')) clearLocal(); }
      else { online = false; console.error('backend init', e); }
    }
    hook(); if (uid) sync();
  }
  hydrateSync();
  var ready = Promise.race([init(), new Promise(function (r) { setTimeout(r, 9000); })]);

  window.EcoApi = EcoApi;
  window.EcoStore = EcoStore;
  window.EcoBackend = {
    on: true, ready: ready, online: function () { return online; }, flush: flush, refresh: refresh, auth: auth, logout: logout,
    redeem: redeem, community: community, updateEmail: updateEmail, updatePassword: updatePassword, signOutOthers: signOutOthers,
    exportData: exportData, deleteAccount: deleteAccount, confirmReset: confirmReset, policyVersion: POLICY_VERSION,
    user: function () { try { return JSON.parse(EcoStore.get('ecoclick_current_user')); } catch (e) { return null; } }
  };
  window.EcoDB = {
    shared: function () { return null; }, flush: flush, ready: ready,
    reserve: function () { return Promise.resolve(true); },              // a reserva é feita pelo servidor ao salvar o agendamento
    release: function () { return Promise.resolve(); },                  // o horário é liberado quando o agendamento é cancelado
    takenTimes: function (pointId, date) {
      return EcoApi.get('/appointments/taken?pointId=' + encodeURIComponent(pointId) + '&date=' + encodeURIComponent(date))
        .then(function (r) { return r.times || []; }, function () { return []; });
    },
    mode: function () { return online ? 'backend' : 'local'; }
  };
})();
