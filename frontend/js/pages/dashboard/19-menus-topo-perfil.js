
    // Menus do topo (notificações e conta) + página de perfil.
    // Persistência local (localStorage) por enquanto; tudo passa por EcoClickAccountAPI para ligar ao backend depois.
    (function(){
      var tr = EcoI18n.t;
      var $ = function(id){ return document.getElementById(id); };

      /* ================= Camada de dados (trocar por backend) =================
         GET   /api/me/notifications                → [{ id, type, title, text, createdAt, read }]
         PATCH /api/me/notifications/:id/read      POST /api/me/notifications/read-all
         GET   /api/me/profile                     PATCH /api/me/profile { name, email, phone, cpf, address, avatar }
         type: appointment | reminder | mission | reward | news                                              */
      var NKEY = 'ecoclick_notifications', PKEY = 'ecoclick_profile', SKEY = 'ecoclick_settings';
      function load(k, d){ try{ var v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; }catch(e){ return d; } }
      function save(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} }
      function wait(ms, fn){ return new Promise(function(res){ setTimeout(function(){ res(fn()); }, ms); }); }
      function ago(m){ return new Date(Date.now() - m * 60000).toISOString(); }
      function seed(){ return []; }
      function sessionUser(){ var u = load('ecoclick_current_user', null); return (u && typeof u === 'object') ? u : {}; }
      var API = {
        listNotifications: function(){ return wait(0, function(){ var l = load(NKEY, null); if(!l){ l = seed(); save(NKEY, l); } return l; }); },
        markRead: function(id){ return wait(80, function(){ var l = load(NKEY, []); l.forEach(function(n){ if(n.id === id) n.read = true; }); save(NKEY, l); return l; }); },
        markAllRead: function(){ return wait(120, function(){ var l = load(NKEY, []); l.forEach(function(n){ n.read = true; }); save(NKEY, l); return l; }); },
        getProfile: function(){
          var p = load(PKEY, {}), acc = (load(SKEY, {}).account) || {}, su = sessionUser();
          return {
            name: p.name || su.name || '', email: acc.email || su.email || '', phone: acc.phone || '',
            cpf: p.cpf || '', address: p.address || '', avatar: p.avatar || '',
            points: typeof p.points === 'number' ? p.points : 0      // começa do zero
          };
        },
        updateProfile: function(d){
          return wait(400, function(){
            var p = load(PKEY, {});
            p.name = d.name; p.cpf = d.cpf; p.address = d.address; p.avatar = d.avatar;
            save(PKEY, p);
            var s = load(SKEY, {}); s.account = Object.assign({}, s.account, { email:d.email, phone:d.phone }); save(SKEY, s);
            return API.getProfile();
          });
        }
      };

      /* ================= Abrir / fechar menus ================= */
      var menus = {
        notif:   { btn:$('notif-btn'),   panel:$('notif-panel') },
        account: { btn:$('account-btn'), panel:$('account-menu') }
      };
      function setMenu(name, open){
        var m = menus[name];
        m.panel.classList.toggle('is-open', open);
        if(open) m.panel.removeAttribute('inert'); else m.panel.setAttribute('inert', '');
        m.btn.setAttribute('aria-expanded', String(open));
      }
      function closeAll(except){ Object.keys(menus).forEach(function(k){ if(k !== except) setMenu(k, false); }); }
      Object.keys(menus).forEach(function(name){
        menus[name].btn.addEventListener('click', function(e){
          e.stopPropagation();
          var open = !menus[name].panel.classList.contains('is-open');
          closeAll(name); setMenu(name, open);
        });
      });
      document.addEventListener('click', function(e){
        Object.keys(menus).forEach(function(k){
          var m = menus[k];
          if(m.panel.classList.contains('is-open') && !m.panel.contains(e.target) && !m.btn.contains(e.target)) setMenu(k, false);
        });
      });
      document.addEventListener('keydown', function(e){
        if(e.key !== 'Escape') return;
        Object.keys(menus).forEach(function(k){ if(menus[k].panel.classList.contains('is-open')){ setMenu(k, false); menus[k].btn.focus(); } });
      });
      document.addEventListener('ecoclick:close-menus', function(){ closeAll(); });

      /* ================= Notificações ================= */
      var ICONS = {
        appointment:'<path d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><path d="M8 3v4M16 3v4M4 11h16M9 16l2 2 4-4"/>',
        reminder:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
        mission:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2"/>',
        reward:'<path d="M20 12v8H4v-8M2 8h20v4H2zM12 20V8M12 8c-2.5 0-4-1-4-2.5S9.5 3 11 4c.8.6 1 1.8 1 4zM12 8c2.5 0 4-1 4-2.5S14.5 3 13 4c-.8.6-1 1.8-1 4z"/>',
        news:'<path d="M4 11v3a1 1 0 0 0 1 1h2l5 4V6L7 10H5a1 1 0 0 0-1 1zM16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11"/>'
      };
      var TARGET = { appointment:'coleta-card', reminder:'coleta-card', mission:null, reward:'recompensas-side', news:null };
      var items = [];
      var NMAP = { appointment:'appointments', reminder:'appointments', mission:'missions', reward:'rewards', news:'news' };
      function visibleItems(){
        var pr = Object.assign({ appointments:true, missions:true, rewards:true, news:false }, (load(SKEY, {}).notifications) || {});
        return items.filter(function(n){ return pr[NMAP[n.type] || 'news'] !== false; });
      }
      var elList = $('notif-list'), elEmpty = $('notif-empty'), elDot = $('notif-dot'), elCount = $('notif-count'), btnAll = $('notif-readall');
      function ago2(iso){
        var s = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
        if(s < 60) return tr('Agora');
        var rtf = new Intl.RelativeTimeFormat(EcoI18n.lang, { numeric:'auto' });
        if(s < 3600) return rtf.format(-Math.round(s / 60), 'minute');
        if(s < 86400) return rtf.format(-Math.round(s / 3600), 'hour');
        return rtf.format(-Math.round(s / 86400), 'day');
      }
      function fillList(ul){
        ul.textContent = '';
        visibleItems().sort(function(a, b){ return new Date(b.createdAt) - new Date(a.createdAt); }).forEach(function(n){
          var li = document.createElement('li'), b = document.createElement('button');
          b.type = 'button'; b.className = 'notif-item' + (n.read ? '' : ' unread'); b.setAttribute('data-id', n.id);
          var ic = document.createElement('span'); ic.className = 'notif-ico'; ic.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true">' + (ICONS[n.type] || ICONS.news) + '</svg>';
          var body = document.createElement('span'); body.className = 'notif-body';
          [['notif-title', tr(n.title)], ['notif-text', tr(n.text)], ['notif-time', ago2(n.createdAt)]].forEach(function(x){
            var s = document.createElement('span'); s.className = x[0]; s.textContent = x[1]; body.appendChild(s);
          });
          b.appendChild(ic); b.appendChild(body);
          if(!n.read){ var d = document.createElement('span'); d.className = 'notif-unread-dot'; d.setAttribute('aria-hidden', 'true'); b.appendChild(d); }
          b.addEventListener('click', function(){ openNotif(n); });
          li.appendChild(b); ul.appendChild(li);
        });
      }
      function unreadCount(){ return visibleItems().filter(function(n){ return !n.read; }).length; }
      function renderNotifs(){
        var unread = unreadCount();
        elDot.hidden = unread === 0;
        elCount.hidden = unread === 0; elCount.textContent = tr('Não lidas: {n}', { n:unread });
        btnAll.disabled = unread === 0;
        menus.notif.btn.setAttribute('aria-label', unread ? tr('Notificações') + ' — ' + tr('Não lidas: {n}', { n:unread }) : tr('Notificações'));
        var vis = visibleItems().length;
        elEmpty.hidden = vis > 0; elList.hidden = vis === 0;
        fillList(elList);
        var pl = $('pn-list');     // mesma lista, também na tela Notificações do Perfil
        pl.hidden = vis === 0; $('pn-empty').hidden = vis > 0; $('pn-readall').disabled = unread === 0;
        fillList(pl);
        if(typeof renderHome === 'function') renderHome();
      }
      function openNotif(n){
        if(!n.read){ n.read = true; renderNotifs(); API.markRead(n.id); }
        setMenu('notif', false);
        if(TARGET[n.type] && window.EcoApp) EcoApp.goTo(TARGET[n.type]);
      }
      function markAll(){ items.forEach(function(n){ n.read = true; }); renderNotifs(); API.markAllRead(); }
      btnAll.addEventListener('click', markAll);
      $('pn-readall').addEventListener('click', markAll);
      API.listNotifications().then(function(l){ items = l; renderNotifs(); });
      window.EcoApp = window.EcoApp || {};
      window.EcoApp.notify = function(n){ items.unshift(n); save(NKEY, items); renderNotifs(); };
      document.addEventListener('ecoclick:notif-prefs-change', renderNotifs);
      window.addEventListener('storage', function(e){ if(e.key === NKEY){ items = load(NKEY, items); renderNotifs(); } });

      /* ================= Conta ================= */
      var LEVELS = ['Semente', 'Broto', 'Folha', 'Árvore', 'Floresta'], STEP = 500;
      function fmtPhone(d){
        d = String(d).replace(/\D/g, '').slice(0, 11);
        if(d.length <= 2) return d ? '(' + d : '';
        if(d.length <= 6) return '(' + d.slice(0, 2) + ') ' + d.slice(2);
        if(d.length <= 10) return '(' + d.slice(0, 2) + ') ' + d.slice(2, 6) + '-' + d.slice(6);
        return '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7);
      }
      function fmtCpf(d){
        d = String(d).replace(/\D/g, '').slice(0, 11);
        var o = d.slice(0, 3); if(d.length > 3) o += '.' + d.slice(3, 6); if(d.length > 6) o += '.' + d.slice(6, 9); if(d.length > 9) o += '-' + d.slice(9);
        return o;
      }
      function cpfOk(d){
        d = String(d).replace(/\D/g, ''); if(d.length !== 11 || /^(\d)\1+$/.test(d)) return false;
        for(var t = 9; t < 11; t++){
          var s = 0; for(var i = 0; i < t; i++) s += +d[i] * (t + 1 - i);
          if(((s * 10) % 11) % 10 !== +d[t]) return false;
        }
        return true;
      }
      function initials(name){
        var w = String(name).trim().split(/\s+/).filter(Boolean);
        if(!w.length) return 'E';
        return (w[0][0] + (w.length > 1 ? w[w.length - 1][0] : '')).toUpperCase();
      }
      var profile = API.getProfile();
      function displayName(){ return profile.name || tr('Usuário EcoClick'); }
      function paintAvatar(imgEl, txtEl, p){
        if(p.avatar){ imgEl.src = p.avatar; imgEl.hidden = false; txtEl.hidden = true; }
        else { imgEl.removeAttribute('src'); imgEl.hidden = true; txtEl.hidden = false; txtEl.textContent = initials(p.name); }
      }
      function renderAccountMenu(){ $('account-name').textContent = displayName(); }
      account_init();
      function account_init(){ renderAccountMenu(); }

      var EcoApp = window.EcoApp = window.EcoApp || {};
      $('account-profile').addEventListener('click', function(){ setMenu('account', false); EcoApp.showView('profile', true); });

      /* ================= Agendamentos (dados) =================
         GET /api/me/appointments   PATCH /api/me/appointments/:id/cancel                                  */
      var AKEY = 'ecoclick_appointments';
      function ymd(d){ return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
      function seedAppts(){ return []; }
      API.listAppointments = function(){ return wait(0, function(){ var l = load(AKEY, null); if(!l){ l = seedAppts(); save(AKEY, l); } return l; }); };
      API.cancelAppointment = function(id){ return wait(250, function(){ var l = load(AKEY, []); l.forEach(function(a){ if(a.id === id){ a.status = 'cancelled'; try{ window.EcoDB.release(a.pointId, a.date, a.time); }catch(e){} } }); save(AKEY, l); return l; }); };
      var appts = [];
      function dtOf(a){ var p = a.date.split('-'), h = a.time.split(':'); return new Date(+p[0], +p[1] - 1, +p[2], +h[0], +h[1]); }
      function statusOf(a){ if(a.status === 'cancelled') return 'cancelled'; if(a.status === 'completed') return 'completed'; return 'confirmed'; }
      function upcoming(){ return appts.filter(function(a){ return statusOf(a) === 'confirmed'; }).sort(function(a, b){ return dtOf(a) - dtOf(b); }); }
      function past(){ return appts.filter(function(a){ return statusOf(a) !== 'confirmed'; }).sort(function(a, b){ return dtOf(b) - dtOf(a); }); }
      function fmtDate(a, o){ return new Intl.DateTimeFormat(EcoI18n.lang, o).format(dtOf(a)); }

      /* ================= Perfil ================= */
      var root = $('view-profile'), form = $('prof-form'), draftAvatar = '';
      var CIRC = 2 * Math.PI * 52, NAMES = { 'pt-BR':'Português (Brasil)', en:'English', es:'Español' };
      var reduceMotion = function(){ return document.documentElement.classList.contains('reduce-motion'); };
      function fmtN(n){ return Number(n).toLocaleString(EcoI18n.lang); }
      function levelInfo(points){
        var lvl = Math.min(Math.floor(points / STEP) + 1, LEVELS.length), max = lvl === LEVELS.length, from = (lvl - 1) * STEP;
        return { lvl:lvl, max:max, name:LEVELS[lvl - 1], pct:max ? 100 : Math.round((points - from) / STEP * 100), missing:max ? 0 : lvl * STEP - points };
      }
      function setRing(id, pct){ var el = $(id); if(!el) return; el.style.strokeDasharray = CIRC; el.style.strokeDashoffset = CIRC * (1 - pct / 100); }
      function countTo(el, n){
        if(!el) return;
        var from = el.__v || 0; el.__v = n;
        if(reduceMotion() || from === n){ el.textContent = fmtN(n); return; }
        var t0 = performance.now(), dur = 800;
        (function step(t){
          var k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
          el.textContent = fmtN(Math.round(from + (n - from) * e));
          if(k < 1) requestAnimationFrame(step);
        })(t0);
      }
      function firstName(n){ return String(n).trim().split(/\s+/)[0] || ''; }

      function renderHome(){
        var L = levelInfo(profile.points), unread = typeof unreadCount === 'function' ? unreadCount() : 0, up = upcoming().length;
        $('prof-name').textContent = displayName();
        $('prof-email').textContent = profile.email || tr('Não informado');
        paintAvatar($('prof-img'), $('prof-initials'), profile);
        countTo($('prof-points'), profile.points);
        $('prof-level').textContent = L.lvl + ' · ' + tr(L.name);
        $('prof-bar').style.width = L.pct + '%'; setRing('prof-ring', L.pct);
        $('prof-next').textContent = L.max ? tr('Nível máximo alcançado') : tr('Faltam {n} pontos para o nível {m}', { n:fmtN(L.missing), m:L.lvl + 1 });
        $('row-notif').textContent = unread ? tr('Não lidas: {n}', { n:unread }) : '';
        $('row-lang').textContent = NAMES[EcoI18n.lang];
        var th = document.documentElement.getAttribute('data-theme-choice') || document.documentElement.getAttribute('data-theme');
        $('row-theme').textContent = th === 'dark' ? tr('Escuro') : th === 'system' ? tr('Sistema') : tr('Claro');
        $('row-appt').textContent = up ? tr('{n} próximos', { n:up }) : '';
        Array.prototype.forEach.call(document.querySelectorAll('[data-lang]'), function(b){ b.setAttribute('aria-checked', String(b.getAttribute('data-lang') === EcoI18n.lang)); });
        Array.prototype.forEach.call(document.querySelectorAll('[data-theme-pick]'), function(b){ b.setAttribute('aria-checked', String(b.getAttribute('data-theme-pick') === th)); });
        renderAccountMenu();
      }
      function renderProfile(){ profile = API.getProfile(); renderHome();}
      document.addEventListener('ecoclick:points-changed', renderProfile);

      /* ----- agendamentos: lista + detalhes ----- */
      var openAppt = null, armed = null;
      function line(dl, k, v){ var d = document.createElement('div'), a = document.createElement('dt'), b = document.createElement('dd'); a.textContent = tr(k); b.textContent = v; d.appendChild(a); d.appendChild(b); dl.appendChild(d); }
      function apptItem(a){
        var st = statusOf(a), acc = document.createElement('div'); acc.className = 'acc' + (openAppt === a.id ? ' open' : '');
        var btn = document.createElement('button'); btn.type = 'button'; btn.className = 'acc-btn'; btn.setAttribute('aria-expanded', String(openAppt === a.id));
        var m = document.createElement('span'); m.className = 'acc-main';
        var s1 = document.createElement('strong'); s1.textContent = fmtDate(a, { weekday:'short', day:'2-digit', month:'short' }) + ' · ' + a.time;
        var s2 = document.createElement('span'); s2.textContent = tr(a.pointName) + ' · ' + tr(a.material);
        m.appendChild(s1); m.appendChild(s2);
        var pill = document.createElement('span'); pill.className = 'pill' + (st === 'completed' ? ' done' : st === 'cancelled' ? ' off' : '');
        pill.textContent = st === 'confirmed' ? tr('Confirmado') : st === 'completed' ? tr('Concluído') : tr('Cancelado');
        btn.appendChild(m); btn.appendChild(pill); btn.insertAdjacentHTML('beforeend', '<svg class="chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>');
        var col = document.createElement('div'); col.className = 'collapse'; var in1 = document.createElement('div'), body = document.createElement('div'); body.className = 'acc-body';
        var dl = document.createElement('dl');
        line(dl, 'Ponto de coleta', tr(a.pointName)); line(dl, 'Endereço', a.address || '—'); line(dl, 'Material', tr(a.material));
        line(dl, 'Data', fmtDate(a, { weekday:'long', day:'2-digit', month:'long', year:'numeric' })); line(dl, 'Horário', a.time);
        line(dl, 'Status', pill.textContent); line(dl, 'Protocolo', a.id.replace('ag_', '').toUpperCase());
        body.appendChild(dl);
        if(st === 'confirmed'){
          var c = document.createElement('button'); c.type = 'button'; c.className = 'btn btn-danger'; c.textContent = armed === a.id ? tr('Confirmar cancelamento') : tr('Cancelar agendamento');
          c.addEventListener('click', function(){
            if(armed !== a.id){ armed = a.id; c.textContent = tr('Confirmar cancelamento'); setTimeout(function(){ if(armed === a.id){ armed = null; c.textContent = tr('Cancelar agendamento'); } }, 3500); return; }
            armed = null; c.disabled = true;
            API.cancelAppointment(a.id).then(function(l){ appts = l; renderAppts();renderHome(); if(EcoApp.say) EcoApp.say('Agendamento cancelado'); });
          });
          body.appendChild(c);
        }
        in1.appendChild(body); col.appendChild(in1); acc.appendChild(btn); acc.appendChild(col);
        btn.addEventListener('click', function(){
          var on = !acc.classList.contains('open');
          Array.prototype.forEach.call(document.querySelectorAll('#appt-root .acc'), function(x){ x.classList.remove('open'); x.querySelector('.acc-btn').setAttribute('aria-expanded', 'false'); });
          acc.classList.toggle('open', on); btn.setAttribute('aria-expanded', String(on)); openAppt = on ? a.id : null;
        });
        return acc;
      }
      function renderAppts(){
        var r = $('appt-root'); r.textContent = '';
        if(!appts.length){
          var e = document.createElement('div'); e.className = 'pcard appt-empty';
          e.innerHTML = '<svg class="leaf-mark" viewBox="0 0 120 120" aria-hidden="true" style="position:static;width:64px;height:64px;color:var(--eco-ink)"><use href="#eco-leaf"/></svg>';
          var p = document.createElement('p'); p.textContent = tr('Você ainda não tem agendamentos.'); e.appendChild(p);
          var b = document.createElement('button'); b.type = 'button'; b.className = 'btn btn-primary'; b.textContent = tr('Agendar descarte');
          b.addEventListener('click', function(){ EcoApp.goTo('coleta-card'); }); e.appendChild(b); r.appendChild(e); return;
        }
        [['Próximos', upcoming()], ['Anteriores', past()]].forEach(function(g){
          if(!g[1].length) return;
          var t2 = document.createElement('div'); t2.className = 'plist-title'; t2.textContent = tr(g[0]); r.appendChild(t2);
          g[1].forEach(function(a){ r.appendChild(apptItem(a)); });
        });
      }
      function loadAppts(){ return API.listAppointments().then(function(l){ appts = l; renderAppts();renderHome(); }); }

      /* ----- navegação entre telas do perfil ----- */
      var screens = Array.prototype.slice.call(root.querySelectorAll('.pscreen'));
      function fillForm(){
        profile = API.getProfile(); draftAvatar = profile.avatar; clearErr();
        $('pf-name').value = profile.name; $('pf-email').value = profile.email; $('pf-phone').value = fmtPhone(profile.phone);
        $('pf-cpf').value = fmtCpf(profile.cpf); $('pf-address').value = profile.address; paintDraft();
      }
      function showScreen(name){
        screens.forEach(function(s){ s.hidden = s.getAttribute('data-pscreen') !== name; });
        window.scrollTo(0, 0);
        if(name === 'manage') fillForm();
        if(name === 'appointments') renderAppts();
        if(name === 'home') renderHome();
      }
      root.addEventListener('click', function(e){
        var go = e.target.closest('[data-go]'), bk = e.target.closest('[data-back]');
        if(bk){ showScreen('home'); return; }
        if(!go) return;
        var k = go.getAttribute('data-go');
        if(k === 'security') EcoApp.openSetting('password'); else showScreen(k);
      });
      EcoApp.openProfile = function(screen){ EcoApp.showView('profile', true); showScreen(screen || 'home'); };
      $('pn-config').addEventListener('click', function(){ EcoApp.openSetting('notifications'); });
      Array.prototype.forEach.call(document.querySelectorAll('[data-lang]'), function(b){ b.addEventListener('click', function(){ EcoApp.setLanguage(b.getAttribute('data-lang')); }); });
      Array.prototype.forEach.call(document.querySelectorAll('[data-theme-pick]'), function(b){ b.addEventListener('click', function(){ EcoApp.setTheme(b.getAttribute('data-theme-pick')); }); });
      Array.prototype.forEach.call(root.querySelectorAll('.acc-btn:not(#appt-root .acc-btn)'), function(btn){
        btn.addEventListener('click', function(){ var acc = btn.parentNode, on = !acc.classList.contains('open'); acc.classList.toggle('open', on); btn.setAttribute('aria-expanded', String(on)); });
      });

      /* ----- gerenciar perfil (formulário) ----- */
      function clearErr(){
        Array.prototype.forEach.call(form.querySelectorAll('[data-err]'), function(e){ e.textContent = ''; });
        Array.prototype.forEach.call(form.querySelectorAll('input'), function(i){ i.removeAttribute('aria-invalid'); });
        $('photo-err').textContent = '';
      }
      function fail(key, input, msg){ form.querySelector('[data-err="' + key + '"]').textContent = tr(msg); input.setAttribute('aria-invalid', 'true'); input.focus(); }
      function paintDraft(){ paintAvatar($('form-img'), $('form-initials'), { name:$('pf-name').value, avatar:draftAvatar }); $('photo-clear').hidden = !draftAvatar; }
      $('prof-reset').addEventListener('click', fillForm);
      $('pf-name').addEventListener('input', function(){ if(!draftAvatar) paintDraft(); });
      $('pf-phone').addEventListener('input', function(e){ e.target.value = fmtPhone(e.target.value); });
      $('pf-cpf').addEventListener('input', function(e){ e.target.value = fmtCpf(e.target.value); });
      $('photo-pick').addEventListener('click', function(){ $('photo-file').click(); });
      $('photo-clear').addEventListener('click', function(){ draftAvatar = ''; $('photo-file').value = ''; paintDraft(); });
      $('photo-file').addEventListener('change', function(e){
        var f = e.target.files && e.target.files[0]; $('photo-err').textContent = '';
        if(!f) return;
        if(!/^image\//.test(f.type) || f.size > 8 * 1024 * 1024){ $('photo-err').textContent = tr('Imagem inválida.'); return; }
        var fr = new FileReader();
        fr.onload = function(){
          var img = new Image();
          img.onload = function(){
            var S = 256, c = document.createElement('canvas'); c.width = c.height = S;
            var side = Math.min(img.width, img.height), sx = (img.width - side) / 2, sy = (img.height - side) / 2;
            c.getContext('2d').drawImage(img, sx, sy, side, side, 0, 0, S, S);
            draftAvatar = c.toDataURL('image/jpeg', .85); paintDraft();
          };
          img.onerror = function(){ $('photo-err').textContent = tr('Imagem inválida.'); };
          img.src = fr.result;
        };
        fr.readAsDataURL(f);
      });
      form.addEventListener('submit', function(e){
        e.preventDefault(); clearErr();
        var name = $('pf-name').value.trim(), email = $('pf-email').value.trim(), phone = $('pf-phone').value.replace(/\D/g, ''),
            cpf = $('pf-cpf').value.replace(/\D/g, ''), address = $('pf-address').value.trim();
        if(name.length < 2) return fail('name', $('pf-name'), 'Informe seu nome.');
        if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail('email', $('pf-email'), 'Informe um e-mail válido.');
        if(phone && (phone.length < 10 || phone.length > 11)) return fail('phone', $('pf-phone'), 'Informe um telefone com DDD.');
        if(cpf && !cpfOk(cpf)) return fail('cpf', $('pf-cpf'), 'Informe um CPF válido.');
        var btn = form.querySelector('[type="submit"]'); btn.disabled = true; btn.textContent = tr('Salvando…');
        API.updateProfile({ name:name, email:email, phone:phone, cpf:cpf, address:address, avatar:draftAvatar }).then(function(){
          renderProfile();
          document.dispatchEvent(new CustomEvent('ecoclick:account-changed'));
          if(EcoApp.say) EcoApp.say('Perfil atualizado');
        }).catch(function(){ if(EcoApp.say) EcoApp.say('Não foi possível salvar. Tente novamente.', true); })
          .then(function(){ btn.disabled = false; btn.textContent = tr('Salvar'); });
      });

      /* ----- ligações com o resto do app ----- */
      document.addEventListener('ecoclick:view-change', function(e){
        if(e.detail && e.detail.view === 'profile') showScreen('home');
      });
      document.addEventListener('ecoclick:account-changed', renderProfile);
      document.addEventListener('ecoclick:theme-change', renderHome);
      document.addEventListener('ecoclick:appointment-created', loadAppts);
      window.addEventListener('storage', function(e){ if(e.key === AKEY || e.key === PKEY) loadAppts(); });
      document.addEventListener('ecoclick:lang-change', function(){
        renderNotifs(); renderProfile(); renderAppts();
        var sb = form.querySelector('[type="submit"]'); if(!sb.disabled) sb.textContent = tr('Salvar');
        clearErr();
      });
      renderProfile();
      loadAppts();
      setInterval(renderNotifs, 60000);   // atualiza "há X min"
    })();
  