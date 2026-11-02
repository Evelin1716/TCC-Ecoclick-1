
    (function(){
      var $ = function(s, r){ return (r || document).querySelector(s); };
      var $$ = function(s, r){ return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
      var root = document.documentElement;
      var tr = EcoI18n.t;

      /* ================= Camada de dados (trocar por backend) =================
         Hoje persiste no navegador (localStorage) para funcionar sem servidor.
         Endpoints previstos:
           GET   /api/me/settings                      PATCH /api/me/email         {email, currentPassword}
           PATCH /api/me/password {currentPassword,newPassword}   PATCH /api/me/phone {phone}
           PATCH /api/me/notifications {...}           PATCH /api/me/preferences {...}
           GET   /api/me/sessions    DELETE /api/me/sessions/:id    DELETE /api/me/sessions?others=true
         Senhas nunca são gravadas no navegador. */
      var KEY = 'ecoclick_settings';
      var DEFAULTS = {
        account: { email:'', phone:'' },
        notifications: { appointments:true, missions:true, rewards:true, news:false },
        preferences: { language:'pt-BR', reduceMotion:false, highContrast:false, autoLocate:false, onlyOpen:false }
      };
      function readStore(){
        var s = {};
        try{ s = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; }catch(e){}
        return {
          account: Object.assign({}, DEFAULTS.account, s.account),
          notifications: Object.assign({}, DEFAULTS.notifications, s.notifications),
          preferences: Object.assign({}, DEFAULTS.preferences, s.preferences)
        };
      }
      function writeStore(s){ try{ localStorage.setItem(KEY, JSON.stringify(s)); }catch(e){} }
      function wait(ms, fn){ return new Promise(function(res){ setTimeout(function(){ res(fn()); }, ms); }); }
      function sessionUser(){
        try{
          var u = JSON.parse(localStorage.getItem('ecoclick_current_user'));
          if(u && u.email) return u.email;
        }catch(e){}
        return '';
      }
      function deviceName(){
        var ua = navigator.userAgent, os = /Windows/.test(ua) ? 'Windows' : /Android/.test(ua) ? 'Android' : /iPhone|iPad/.test(ua) ? 'iOS' : /Mac/.test(ua) ? 'macOS' : /Linux/.test(ua) ? 'Linux' : 'Dispositivo';
        var br = /Edg\//.test(ua) ? 'Edge' : /Chrome\//.test(ua) ? 'Chrome' : /Firefox\//.test(ua) ? 'Firefox' : /Safari\//.test(ua) ? 'Safari' : 'Navegador';
        return os + ' · ' + br;
      }
      var SESSIONS = [   // EXEMPLOS — substituir por GET /api/me/sessions
        { id:'s2', device:'iOS · Safari', place:'Salvador, BA', when:'há 2 horas', type:'phone' },
        { id:'s3', device:'Windows · Chrome', place:'Lauro de Freitas, BA', when:'há 3 dias', type:'desktop' }
      ];
      function BE(){ try{ return !!(window.EcoBackend && window.EcoBackend.on); }catch(e){ return false; } }
      var API = {
        getSettings: function(){ var s = readStore(); if(!s.account.email) s.account.email = sessionUser(); return wait(0, function(){ return s; }); },
        updateEmail: function(p){
          if(BE()) return window.EcoBackend.updateEmail(p.email, p.currentPassword).then(function(r){ if(!r.ok) throw new Error(r.msg); var s = readStore(); return Object.assign({}, s.account, { pending:true }); });
          return wait(450, function(){ var s = readStore(); s.account.email = p.email; writeStore(s); return s.account; }); },
        updatePassword: function(p){
          if(BE()) return window.EcoBackend.updatePassword(p.currentPassword, p.newPassword).then(function(r){ if(!r.ok) throw new Error(r.msg); return r; });
          return wait(450, function(){ return { ok:true }; }); },
        updatePhone: function(p){ return wait(450, function(){ var s = readStore(); s.account.phone = p.phone; writeStore(s); return s.account; }); },
        updateNotifications: function(n){ return wait(150, function(){ var s = readStore(); s.notifications = n; writeStore(s); return n; }); },
        updatePreferences: function(pr){ return wait(150, function(){ var s = readStore(); s.preferences = pr; writeStore(s); return pr; }); },
        getSessions: function(){ return wait(0, function(){ return [{ id:'current', device:deviceName(), place:'Este dispositivo', when:'agora', type:'desktop', current:true }].concat(BE() ? [] : SESSIONS); }); },
        revokeSession: function(id){ return wait(250, function(){ SESSIONS = SESSIONS.filter(function(x){ return x.id !== id; }); return true; }); },
        revokeOthers: function(){ if(BE()) return window.EcoBackend.signOutOthers(); return wait(350, function(){ SESSIONS = []; return true; }); },
        deleteAccount: function(){ if(BE()) return window.EcoBackend.deleteAccount();
          return wait(500, function(){   // backend: DELETE /api/me
          try{ Object.keys(localStorage).forEach(function(k){ if(k.indexOf('ecoclick_') === 0 && k !== 'ecoclick_theme') localStorage.removeItem(k); }); }catch(e){}
          return true;
        }); }
      };
      var state = readStore();

      /* ================= Toast ================= */
      var toast = $('#toast'), toastT;
      function say(msg, err){
        $('#toast-text').textContent = tr(msg);
        toast.classList.toggle('err', !!err); toast.classList.add('show');
        clearTimeout(toastT); toastT = setTimeout(function(){ toast.classList.remove('show'); }, 2600);
      }

      window.EcoApp = window.EcoApp || {}; EcoApp.say = say;

      /* ================= Tema (Sistema / Claro / Escuro) ================= */
      var seg = $('#theme-seg'), animT, ORDER = ['system', 'light', 'dark'];
      var mq = window.matchMedia ? matchMedia('(prefers-color-scheme: dark)') : null;
      function storedTheme(){ try{ var s = localStorage.getItem('ecoclick_theme'); return (s === 'dark' || s === 'system') ? s : 'light'; }catch(e){ return 'light'; } }
      function resolveTheme(c){ return c === 'system' ? ((mq && mq.matches) ? 'dark' : 'light') : c; }
      function paintSeg(c){
        $$('[data-theme-opt]', seg).forEach(function(b){
          var on = b.getAttribute('data-theme-opt') === c;
          b.setAttribute('aria-checked', String(on)); b.tabIndex = on ? 0 : -1;
        });
      }
      function applyTheme(c, animate){
        var t = resolveTheme(c);
        if(animate){ root.classList.add('theme-anim'); clearTimeout(animT); animT = setTimeout(function(){ root.classList.remove('theme-anim'); }, 500); }
        var changed = root.getAttribute('data-theme') !== t || root.getAttribute('data-theme-choice') !== c;
        root.setAttribute('data-theme', t); root.setAttribute('data-theme-choice', c);
        paintSeg(c);
        if(changed) document.dispatchEvent(new CustomEvent('ecoclick:theme-change', { detail:{ theme:t, choice:c } }));
      }
      function chooseTheme(c){
        if(ORDER.indexOf(c) < 0) c = 'light';
        try{ localStorage.setItem('ecoclick_theme', c); }catch(e){}
        applyTheme(c, true);
      }
      $$('[data-theme-opt]', seg).forEach(function(b){
        b.addEventListener('click', function(){ chooseTheme(b.getAttribute('data-theme-opt')); });
        b.addEventListener('keydown', function(e){
          var d = (e.key === 'ArrowRight' || e.key === 'ArrowDown') ? 1 : (e.key === 'ArrowLeft' || e.key === 'ArrowUp') ? -1 : 0;
          if(!d) return;
          e.preventDefault();
          var next = ORDER[(ORDER.indexOf(storedTheme()) + d + ORDER.length) % ORDER.length];
          chooseTheme(next); $('[data-theme-opt="' + next + '"]', seg).focus();
        });
      });
      applyTheme(storedTheme(), false);
      if(mq){ var onMq = function(){ if(storedTheme() === 'system') applyTheme('system', true); }; if(mq.addEventListener) mq.addEventListener('change', onMq); else if(mq.addListener) mq.addListener(onMq); }
      window.addEventListener('storage', function(e){
        if(!e.key || e.key === 'ecoclick_theme'){ applyTheme(storedTheme(), true); }
      });
      window.addEventListener('pageshow', function(){ applyTheme(storedTheme(), false); });

      /* ================= Toggles: notificações e acessibilidade ================= */
      function setSwitch(b, on){ b.setAttribute('aria-checked', String(!!on)); }
      function applyPrefs(){
        root.classList.toggle('reduce-motion', !!state.preferences.reduceMotion);
        root.classList.toggle('high-contrast', !!state.preferences.highContrast);
        $$('[data-motion]').forEach(function(b){ b.setAttribute('aria-checked', String((b.getAttribute('data-motion') === 'reduced') === !!state.preferences.reduceMotion)); });
      }
      $$('[data-notif]').forEach(function(b){
        var k = b.getAttribute('data-notif');
        b.addEventListener('click', function(){
          var on = b.getAttribute('aria-checked') !== 'true';
          setSwitch(b, on); state.notifications[k] = on;
          API.updateNotifications(Object.assign({}, state.notifications)).then(function(){ say(on ? 'Notificações ativadas' : 'Notificações desativadas'); document.dispatchEvent(new CustomEvent('ecoclick:notif-prefs-change')); });
        });
      });
      $$('[data-pref]').forEach(function(b){
        var k = b.getAttribute('data-pref');
        b.addEventListener('click', function(){
          var on = b.getAttribute('aria-checked') !== 'true';
          setSwitch(b, on); state.preferences[k] = on; applyPrefs();
          API.updatePreferences(Object.assign({}, state.preferences)).then(function(){ say('Preferência salva'); document.dispatchEvent(new CustomEvent('ecoclick:prefs-change')); });
        });
      });
      function chooseLanguage(l){
        state.preferences.language = l;
        var cur = readStore(); cur.preferences.language = l; writeStore(cur);   // grava já, antes de traduzir
        EcoI18n.setLang(l);
        API.updatePreferences(Object.assign({}, state.preferences)).then(function(){ say('Idioma salvo'); });
      }
      $$('[data-motion]').forEach(function(b){
        b.addEventListener('click', function(){
          state.preferences.reduceMotion = b.getAttribute('data-motion') === 'reduced'; applyPrefs();
          API.updatePreferences(Object.assign({}, state.preferences)).then(function(){ say('Preferência salva'); document.dispatchEvent(new CustomEvent('ecoclick:prefs-change')); });
        });
      });
      $('#sel-lang').addEventListener('change', function(e){ chooseLanguage(e.target.value); });
      EcoApp.setLanguage = chooseLanguage;
      EcoApp.setTheme = chooseTheme;
      // usado pelo Perfil: abre a tela de Configurações já na seção pedida
      EcoApp.openSetting = function(key){
        EcoApp.showView('settings', true);
        setTimeout(function(){
          if(key === 'password'){
            showPane('conta');
            if(openId !== 'edit-pass') openPanel('edit-pass');
            $('#edit-pass').scrollIntoView({ behavior:'smooth', block:'center' });
          } else if(key === 'notifications'){ showPane('notificacoes'); }
        }, 120);
      };

      /* ================= Conta: edição inline ================= */
      var openId = null;
      function fmtPhone(d){
        d = String(d).replace(/\D/g, '').slice(0, 11);
        if(d.length <= 2) return d ? '(' + d : '';
        if(d.length <= 6) return '(' + d.slice(0, 2) + ') ' + d.slice(2);
        if(d.length <= 10) return '(' + d.slice(0, 2) + ') ' + d.slice(2, 6) + '-' + d.slice(6);
        return '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7);
      }
      function renderAccount(){
        $('#val-email').textContent = state.account.email || tr('Não informado');
        $('#val-phone').textContent = state.account.phone ? fmtPhone(state.account.phone) : tr('Não cadastrado');
      }
      function clearErrors(form){
        $$('[data-err]', form).forEach(function(e){ e.textContent = ''; });
        $$('input', form).forEach(function(i){ i.removeAttribute('aria-invalid'); });
      }
      function fail(form, key, input, msg){
        $('[data-err="' + key + '"]', form).textContent = tr(msg);
        input.setAttribute('aria-invalid', 'true'); input.focus();
      }
      function togglePanel(id, open){
        var panel = document.getElementById(id), btn = $('[data-open="' + id + '"]');
        panel.classList.toggle('open', open);
        if(open) panel.removeAttribute('inert'); else panel.setAttribute('inert', '');
        btn.setAttribute('aria-expanded', String(open));
        btn.textContent = open ? tr('Fechar') : tr(btn.getAttribute('data-label') || 'Alterar');
        if(!open){ var f = $('form', panel); f.reset(); clearErrors(f); }
        else setTimeout(function(){ var i = $('input', panel); if(i) i.focus({ preventScroll:true }); }, 120);
      }
      function openPanel(id){
        if(openId && openId !== id) togglePanel(openId, false);
        var willOpen = openId !== id;
        togglePanel(id, willOpen); openId = willOpen ? id : null;
      }
      $$('[data-open]').forEach(function(b){ b.addEventListener('click', function(){ openPanel(b.getAttribute('data-open')); }); });
      $$('[data-close]').forEach(function(b){ b.addEventListener('click', function(){ if(openId) openPanel(openId); }); });
      function submitting(form, on){
        var btn = $('[type="submit"]', form); btn.disabled = on; btn.textContent = on ? tr('Salvando…') : tr('Salvar');
      }
      function done(msg){ if(openId) openPanel(openId); renderAccount(); say(msg); document.dispatchEvent(new CustomEvent('ecoclick:account-changed')); }

      $('#form-email').addEventListener('submit', function(e){
        e.preventDefault(); var f = e.target; clearErrors(f);
        var em = $('#in-email').value.trim(), pw = $('#in-email-pass').value;
        if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) return fail(f, 'email', $('#in-email'), 'Informe um e-mail válido.');
        if(!pw) return fail(f, 'pass', $('#in-email-pass'), 'Informe sua senha atual.');
        submitting(f, true);
        API.updateEmail({ email:em, currentPassword:pw }).then(function(a){ if(a.pending){ done('Enviamos um link de confirmação para o novo e-mail'); return; } state.account = a; done('E-mail atualizado'); })
          .catch(function(err){ say((err && err.message) || 'Não foi possível salvar. Tente novamente.', true); }).then(function(){ submitting(f, false); });
      });
      $('#form-pass').addEventListener('submit', function(e){
        e.preventDefault(); var f = e.target; clearErrors(f);
        var cur = $('#in-pass-cur').value, nw = $('#in-pass-new').value, rp = $('#in-pass-rep').value;
        if(!cur) return fail(f, 'cur', $('#in-pass-cur'), 'Informe sua senha atual.');
        if(nw.length < 8 || !/[A-Za-z]/.test(nw) || !/\d/.test(nw)) return fail(f, 'next', $('#in-pass-new'), 'Use 8+ caracteres, com letras e números.');
        if(nw === cur) return fail(f, 'next', $('#in-pass-new'), 'A nova senha deve ser diferente da atual.');
        if(rp !== nw) return fail(f, 'rep', $('#in-pass-rep'), 'As senhas não coincidem.');
        submitting(f, true);
        API.updatePassword({ currentPassword:cur, newPassword:nw }).then(function(){ done('Senha atualizada'); })
          .catch(function(err){ say((err && err.message) || 'Não foi possível salvar. Tente novamente.', true); }).then(function(){ submitting(f, false); });
      });
      var phoneIn = $('#in-phone');
      phoneIn.addEventListener('input', function(){ phoneIn.value = fmtPhone(phoneIn.value); });
      $('#form-phone').addEventListener('submit', function(e){
        e.preventDefault(); var f = e.target; clearErrors(f);
        var d = phoneIn.value.replace(/\D/g, '');
        if(d.length < 10 || d.length > 11) return fail(f, 'phone', phoneIn, 'Informe um telefone com DDD.');
        submitting(f, true);
        API.updatePhone({ phone:d }).then(function(a){ state.account = a; done('Telefone atualizado'); })
          .catch(function(){ say('Não foi possível salvar. Tente novamente.', true); }).then(function(){ submitting(f, false); });
      });

      /* ================= Sessões conectadas ================= */
      var sessEl = $('#sessions'), revokeAll = $('#revoke-others');
      var ICON = {
        desktop:'<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/></svg>',
        phone:'<svg viewBox="0 0 24 24"><rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 18h2"/></svg>'
      };
      var lastSessions = [];
      function renderSessions(list){
        lastSessions = list;
        sessEl.textContent = '';
        list.forEach(function(s){
          var row = document.createElement('div'); row.className = 'session'; row.setAttribute('data-id', s.id);
          var main = document.createElement('div'); main.className = 'session-main';
          var ic = document.createElement('div'); ic.className = 'session-ico'; ic.innerHTML = ICON[s.type] || ICON.desktop;
          var tx = document.createElement('div'); tx.className = 'set-text';
          var st = document.createElement('strong'); st.textContent = s.device;
          if(s.current){ var bd = document.createElement('span'); bd.className = 'badge'; bd.textContent = tr('Este dispositivo'); st.appendChild(bd); }
          var sp = document.createElement('span'); sp.textContent = s.current ? tr('Ativo agora') : s.place + ' · ' + tr(s.when);
          tx.appendChild(st); tx.appendChild(sp); main.appendChild(ic); main.appendChild(tx); row.appendChild(main);
          if(!s.current){
            var b = document.createElement('button'); b.type = 'button'; b.className = 'btn btn-ghost'; b.textContent = tr('Encerrar');
            b.setAttribute('aria-label', tr('Encerrar sessão em {d}', { d:s.device }));
            b.addEventListener('click', function(){
              b.disabled = true;
              API.revokeSession(s.id).then(function(){
                row.classList.add('leaving');
                setTimeout(function(){ row.remove(); revokeAll.hidden = !$('.session:not(:first-child)', sessEl); say('Sessão encerrada'); }, 300);
              });
            });
            row.appendChild(b);
          }
          sessEl.appendChild(row);
        });
        revokeAll.hidden = list.length < 2;
      }
      revokeAll.addEventListener('click', function(){
        revokeAll.disabled = true;
        API.revokeOthers().then(function(){ return API.getSessions(); }).then(function(l){ renderSessions(l); say('Outras sessões encerradas'); revokeAll.disabled = false; });
      });

      /* ================= Menu lateral, busca e atalhos ================= */
      var stEl = $('#st'), tabs = $$('.st-tab'), panes = $$('.st-pane'), stQ = $('#st-q'), stNone = $('#st-none');
      var PANE_KEY = 'ecoclick_settings_pane';
      function norm(x){ return String(x || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }
      function runSearch(){
        var q = norm(stQ.value.trim()), any = false;
        stEl.classList.toggle('is-searching', !!q);
        $$('.st-item').forEach(function(it){ var row = $('.st-row, .st-link', it); it.hidden = !!q && norm((it.getAttribute('data-search') || '') + ' ' + (row ? row.textContent : '')).indexOf(q) === -1; });
        $$('.st-group').forEach(function(g){ g.hidden = !!q && !$('.st-item:not([hidden])', g); });
        panes.forEach(function(p){ p.hidden = !!q && !$('.st-item:not([hidden])', p); if(q && !p.hidden) any = true; });
        stNone.hidden = !q || any;
      }
      function showPane(id){
        if(!document.getElementById('pane-' + id)) id = 'geral';
        tabs.forEach(function(t){ if(t.getAttribute('data-pane') === id) t.setAttribute('aria-current', 'page'); else t.removeAttribute('aria-current'); });
        panes.forEach(function(p){ p.classList.toggle('is-active', p.getAttribute('data-pane') === id); });
        try{ sessionStorage.setItem(PANE_KEY, id); }catch(e){}
        if(stQ.value){ stQ.value = ''; runSearch(); }
      }
      tabs.forEach(function(t){ t.addEventListener('click', function(){ showPane(t.getAttribute('data-pane')); }); });
      stQ.addEventListener('input', runSearch);
      stQ.addEventListener('keydown', function(e){ if(e.key === 'Escape' && stQ.value){ stQ.value = ''; runSearch(); } });
      $('#st-close').addEventListener('click', function(){ EcoApp.showView('dashboard', true); });
      $$('[data-go-profile]').forEach(function(b){ b.addEventListener('click', function(){ EcoApp.openProfile(b.getAttribute('data-go-profile')); }); });
      $$('[data-go-dash]').forEach(function(b){ b.addEventListener('click', function(){ EcoApp.goTo(b.getAttribute('data-go-dash')); }); });
      $('#st-edit-profile').addEventListener('click', function(){ EcoApp.openProfile('manage'); });

      function readJSON(k, d){ try{ var v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; }catch(e){ return d; } }
      function renderHeader(){
        var p = readJSON('ecoclick_profile', {}), su = readJSON('ecoclick_current_user', {}) || {}, acc = state.account || {};
        var name = p.name || su.name || '', email = acc.email || su.email || '';
        var shown = name || tr('Usuário EcoClick');
        $('#st-name').textContent = shown; $('#st-email').textContent = email || tr('Não informado');
        var img = $('#st-av-img'), ini = $('#st-av-ini');
        if(p.avatar){ img.src = p.avatar; img.hidden = false; ini.textContent = ''; }
        else { img.hidden = true; img.removeAttribute('src'); ini.textContent = shown.split(/\s+/).filter(Boolean).slice(0, 2).map(function(w){ return w.charAt(0).toUpperCase(); }).join(''); }
      }

      $('#st-export').addEventListener('click', function(){
        function save(data){
          var blob = new Blob([JSON.stringify(data, null, 2)], { type:'application/json' });
          var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'ecoclick-meus-dados.json';
          document.body.appendChild(a); a.click(); a.remove();
          setTimeout(function(){ URL.revokeObjectURL(a.href); }, 1500);
          say('Dados exportados');
        }
        if(BE()){ window.EcoBackend.exportData().then(save).catch(function(){ say('Não foi possível exportar agora. Tente novamente.', true); }); return; }
        save({
          exportadoEm: new Date().toISOString(),
          perfil: readJSON('ecoclick_profile', {}), configuracoes: readStore(),
          agendamentos: readJSON('ecoclick_appointments', []), notificacoes: readJSON('ecoclick_notifications', [])
        });
      });
      $('#form-delete').addEventListener('submit', function(e){
        e.preventDefault(); var f = e.target, inp = $('#in-delete'); clearErrors(f);
        if(inp.value.trim().toUpperCase() !== 'EXCLUIR') return fail(f, 'del', inp, 'Digite EXCLUIR para confirmar.');
        var btn = $('[type="submit"]', f); btn.disabled = true;
        API.deleteAccount().then(function(){
          say('Conta excluída');
          setTimeout(function(){ var lg = document.getElementById('logout-link'); if(lg) lg.click(); }, 800);
        });
      });

      /* ================= Inicialização ================= */
      API.getSettings().then(function(s){
        state = s;
        $$('[data-notif]').forEach(function(b){ setSwitch(b, state.notifications[b.getAttribute('data-notif')]); });
        $$('[data-pref]').forEach(function(b){ setSwitch(b, state.preferences[b.getAttribute('data-pref')]); });
        $('#sel-lang').value = EcoI18n.lang;
        applyPrefs(); renderAccount(); renderHeader();
        var saved = ''; try{ saved = sessionStorage.getItem(PANE_KEY) || ''; }catch(e){}
        if(saved) showPane(saved);
      });
      API.getSessions().then(renderSessions);
      document.addEventListener('ecoclick:account-changed', function(){
        var a = readStore().account; if(!a.email) a.email = state.account.email; state.account = a; renderAccount(); renderHeader();
      });
      document.addEventListener('ecoclick:view-change', function(e){ if(e.detail && e.detail.view === 'settings') renderHeader(); });
      document.addEventListener('ecoclick:lang-change', function(){
        $('#sel-lang').value = EcoI18n.lang;
        renderAccount(); renderHeader(); renderSessions(lastSessions); runSearch();
        $$('[data-open]').forEach(function(b){ b.textContent = b.getAttribute('aria-expanded') === 'true' ? tr('Fechar') : tr(b.getAttribute('data-label') || 'Alterar'); });
        $$('.field-err').forEach(function(e){ e.textContent = ''; });
        $$('form:not(#form-delete) [type="submit"]').forEach(function(b){ if(!b.disabled) b.textContent = tr('Salvar'); });
      });
    })();
  