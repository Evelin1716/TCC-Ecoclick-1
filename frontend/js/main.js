/* =====================================================================
   main.js — navegação, autenticação e guarda de rotas compartilhadas por todas as páginas.
   As telas do EcoClick pedem navegação e login por mensagens (window.EcoNav, postMessage). Aqui essas
   mensagens viram navegação real entre arquivos HTML e chamadas à API (api.js).
   Em página aberta diretamente, window.parent === window: a mensagem chega a este mesmo script.
   ===================================================================== */
(function () {
  'use strict';
  var ROUTES = {
    home: 'index.html',
    login: 'pages/login.html',
    signup: 'pages/cadastro.html',
    dashboard: 'pages/dashboard.html',
    progress: 'pages/progresso.html',
    community: 'pages/comunidade.html',
    missions: 'pages/jornada.html',
    mission_list: 'pages/missoes.html',
    profile: 'pages/perfil.html',
    points: 'pages/pontos-coleta.html',
    materials: 'pages/materiais.html',
    dash_recompensas: 'pages/recompensas.html',
    dash_conteudos: 'pages/conteudos.html',
    dash_settings: 'pages/configuracoes.html',
    dash_agenda: 'pages/agendamentos.html',
    privacy: 'pages/privacidade.html',
    terms: 'pages/termos.html'
  };
  var PROTECTED = /^(dashboard|progress|missions|mission_list|profile|points|dash_.*)$/;
  var ROOT = /\/pages\/[^\/]*$/.test(location.pathname) ? '../' : '';
  function urlOf(name) { return ROOT + ROUTES[name]; }
  function user() { try { var u = JSON.parse(localStorage.getItem('ecoclick_current_user')); return u && u.email ? u : null; } catch (e) { return null; } }
  function storageOK() { try { localStorage.setItem('__eco', '1'); localStorage.removeItem('__eco'); return true; } catch (e) { return false; } }
  function ss(k, v) { try { if (v === undefined) return sessionStorage.getItem(k); if (v === null) sessionStorage.removeItem(k); else sessionStorage.setItem(k, v); } catch (e) {} return null; }

  /* ---- navegação ---- */
  function go(name, force) {
    if (!ROUTES[name]) return;
    if (!force && PROTECTED.test(name) && storageOK() && !user()) { ss('eco_after_login', name); name = 'login'; }
    try { if (window.EcoDB) EcoDB.flush(); } catch (e) {}
    location.href = urlOf(name);
  }
  function goAfter() { var d = ss('eco_return_to') || ss('eco_after_login') || 'dashboard'; ss('eco_return_to', null); ss('eco_after_login', null); go(d, true); }
  window.EcoNav = function (to) { go(to); };
  window.EcoRoutes = { urlOf: urlOf, go: go };

  /* cliques em [data-eco-nav] e âncoras "#" (mesmo comportamento que as telas já tinham) */
  document.addEventListener('click', function (e) {
    var t = e.target; if (!t || !t.closest) return;
    var n = t.closest('[data-eco-nav]');
    if (n) { e.preventDefault(); e.stopPropagation(); window.EcoNav(n.getAttribute('data-eco-nav')); return; }
    var a = t.closest('a'); if (!a) return;
    var h = a.getAttribute('href') || '';
    if (h.charAt(0) === '#') {
      e.preventDefault();
      if (window.EcoScroll) {
        if (h.length < 2) window.scrollTo({ top: 0, behavior: 'smooth' });
        else { try { var el = document.querySelector(h); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (x) {} }
      }
    }
  }, true);

  /* ---- guarda de rotas ---- */
  var R = document.documentElement;
  if (R.hasAttribute('data-eco-protected') && storageOK() && !user()) {
    ss('eco_after_login', R.getAttribute('data-eco-route') || 'dashboard');
    location.replace(urlOf('login'));
    return;
  }
  if (R.getAttribute('data-eco-page') === 'login' && user()) { /* já logado: segue direto ao painel */
    if (window.EcoBackend) EcoBackend.ready.then(function () { if (user()) location.replace(urlOf('dashboard')); });
  }

  /* ---- ponte de mensagens (login, comunidade, progresso embutido, navegação com busca) ---- */
  function reply(src, key, payload) { try { var o = {}; o[key] = payload; src.postMessage(o, '*'); } catch (e) {} }
  function doAuth(d, src) {
    if (!window.EcoBackend) return;
    if (d.op === 'logout') { EcoBackend.logout().then(function () { go('home', true); }); return; }
    EcoBackend.auth(d).then(function (r) {
      reply(src, 'ecoAuthRes', { id: d.id, ok: r.ok, msg: r.msg || '' });
      if (r.ok && d.op !== 'reset') goAfter();
    });
  }
  window.addEventListener('message', function (e) {
    var m = e.data; if (!m || typeof m !== 'object' || e.source !== window) return;
    if (m.ecoAuth) { doAuth(m.ecoAuth, e.source); return; }
    if (m.ecoDb) { EcoBackend.community(m.ecoDb).then(function (r) { reply(e.source, 'ecoDbRes', Object.assign({ id: m.ecoDb.id }, r)); }, function () { reply(e.source, 'ecoDbRes', { id: m.ecoDb.id, ok: false }); }); return; }
    if (m.ecoGetPage === 'progress') {
      fetch(ROOT + 'pages/progresso-embed.html').then(function (r) { return r.text(); })
        .then(function (html) { reply(e.source, 'ecoPage', { name: 'progress', html: html }); }, function () {});
      return;
    }
    if (m.ecoNav && ROUTES[m.ecoNav]) {
      var to = m.ecoNav;
      if (typeof m.q === 'string' && m.q && /^(dashboard|points)$/.test(to)) ss('eco_prefill', m.q.slice(0, 80));
      var cur = R.getAttribute('data-eco-page');
      if ((to === 'login' || to === 'signup') && cur === 'community') ss('eco_return_to', 'community');
      else if (to !== 'login' && to !== 'signup') ss('eco_return_to', null);
      go(to);
    }
  });

  /* ---- abrir direto em uma seção (ex.: pontos-coleta.html) ---- */
  var goto = R.getAttribute('data-eco-goto');
  if (goto) {
    window.addEventListener('load', function () {
      setTimeout(function () {
        var el = document.getElementById(goto);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 350);
    });
  }

  /* ---- recuperação de senha: link do e-mail leva a ?reset=TOKEN ---- */
  var tk = (location.search.match(/[?&]reset=([A-Za-z0-9_-]{20,})/) || [])[1];
  if (tk && R.getAttribute('data-eco-page') === 'login') {
    document.addEventListener('DOMContentLoaded', function () {
      var w = document.createElement('div'); w.setAttribute('role', 'dialog'); w.setAttribute('aria-modal', 'true'); w.setAttribute('aria-labelledby', 'eco-rec-t');
      w.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(10,26,28,.6);display:flex;align-items:center;justify-content:center;padding:16px;font-family:system-ui,sans-serif';
      w.innerHTML = '<form style="background:#fff;color:#1d2e4b;border-radius:20px;padding:24px;max-width:380px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,.35)"><h2 id="eco-rec-t" style="margin:0 0 6px;font-size:20px">Criar nova senha</h2><p style="margin:0 0 14px;font-size:14px;color:#4b6a62">Escolha uma nova senha com pelo menos 8 caracteres.</p><input id="eco-rec-p" type="password" minlength="8" autocomplete="new-password" aria-label="Nova senha" style="width:100%;box-sizing:border-box;padding:12px;border:1.5px solid #bfdccf;border-radius:12px;font-size:15px"><p id="eco-rec-m" role="alert" style="min-height:18px;margin:8px 0;font-size:13px;color:#b3261e"></p><button type="submit" style="width:100%;border:0;border-radius:24px;padding:12px;background:#4a8476;color:#fff;font-weight:700;font-size:15px;cursor:pointer">Salvar nova senha</button></form>';
      document.body.appendChild(w);
      var f = w.querySelector('form'), p = w.querySelector('#eco-rec-p'), msg = w.querySelector('#eco-rec-m'); p.focus();
      f.addEventListener('submit', function (ev) {
        ev.preventDefault();
        if (p.value.length < 8) { msg.textContent = 'Use pelo menos 8 caracteres.'; return; }
        EcoBackend.confirmReset(tk, p.value).then(function (r) {
          if (!r.ok) { msg.textContent = r.msg; return; }
          w.remove(); history.replaceState(null, '', location.pathname);
        });
      });
    });
  }
})();
