
    (function(){
      // navegação da sidebar: o item clicado fica ativo; itens cujas seções já
      // existem no Dashboard rolam suavemente até elas
      var tr = EcoI18n.t;
      var navLinks = document.querySelectorAll('.side-nav:not(.side-foot) a');
      var viewDash = document.getElementById('view-dashboard'), viewSet = document.getElementById('view-settings');
      var settingsLink = document.getElementById('settings-link');
      var viewProfile = document.getElementById('view-profile'), appEl = document.querySelector('.app');
      function showView(name, push){
        var EXTRA = ['articles', 'article', 'recompensas', 'progress', 'agenda'];
        var s = name === 'settings', pr = name === 'profile', ar = EXTRA.indexOf(name) >= 0;
        viewDash.hidden = s || pr || ar; viewSet.hidden = !s; viewProfile.hidden = !pr;
        EXTRA.forEach(function(n){ document.getElementById('view-' + n).hidden = name !== n; });
        var key = { dashboard:'coleta', articles:'conteudos', article:'conteudos', recompensas:'recompensas', progress:'progresso', agenda:'coleta' }[name];
        if(name === 'progress'){ var __pf = document.getElementById('prog-frame'), __ok = false; try{ __pf.srcdoc = window.parent.PAGES.progress; __ok = !!__pf.srcdoc; }catch(err){} if(!__ok){ try{ parent.postMessage({ ecoGetPage:'progress' }, '*'); }catch(err2){} } }
        navLinks.forEach(function(l){ var on = !!key && l.getAttribute('data-nav') === key; l.classList.toggle('active', on); if(on) l.setAttribute('aria-current', 'page'); else l.removeAttribute('aria-current'); });
        appEl.setAttribute('data-view', name);
        settingsLink.classList.toggle('active', s);
        if(s){ settingsLink.setAttribute('aria-current', 'page'); } else settingsLink.removeAttribute('aria-current');
        if(s || pr) navLinks.forEach(function(l){ l.classList.remove('active'); });
        if(push){ try{ history.replaceState(null, '', s ? '#configuracoes' : pr ? '#perfil' : location.pathname + location.search); }catch(err){} }
        window.scrollTo(0, 0);
        document.dispatchEvent(new CustomEvent('ecoclick:view-change', { detail:{ view:name } }));
      }
      function viewFromHash(){ return location.hash === '#configuracoes' ? 'settings' : location.hash === '#perfil' ? 'profile' : 'dashboard'; }
      function goTo(id){
        var was = viewDash.hidden; if(was) showView('dashboard', true);
        var el = document.getElementById(id);
        if(el) setTimeout(function(){ el.scrollIntoView({ behavior:'smooth', block:'start' }); }, was ? 60 : 0);
      }
      window.EcoApp = window.EcoApp || {}; EcoApp.showView = showView; EcoApp.goTo = goTo;
      settingsLink.addEventListener('click', function(e){ e.preventDefault(); showView('settings', true); });
      window.addEventListener('hashchange', function(){ showView(viewFromHash(), false); });
      window.addEventListener('message', function(e){
        if(e.source === window.parent && e.data && e.data.ecoPage && e.data.ecoPage.name === 'progress' && typeof e.data.ecoPage.html === 'string'){ var __pp = document.getElementById('prog-frame'); if(__pp) __pp.srcdoc = e.data.ecoPage.html; return; }
        var pf = document.getElementById('prog-frame'); if(!pf || e.source !== pf.contentWindow || !e.data) return;
        if(e.data.ecoH) pf.style.height = Math.max(420, e.data.ecoH) + 'px';
        else if(e.data.ecoNav) parent.postMessage(e.data, '*');
      });
      /*fix-startview*/ var __sv = window.EcoStartView || viewFromHash();
      if(__sv && __sv !== 'dashboard'){ showView(__sv, false); var __fire = function(){ document.dispatchEvent(new CustomEvent('ecoclick:view-change', { detail:{ view:__sv } })); }; if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', __fire); else __fire(); }

      navLinks.forEach(function(link){
        link.addEventListener('click', function(e){
          e.preventDefault();
          var nv = link.getAttribute('data-nav');
          if(nv){ showView({ coleta:'dashboard', conteudos:'articles', recompensas:'recompensas', progresso:'progress' }[nv], true); return; }
          var fromSettings = viewDash.hidden;
          if(fromSettings) showView('dashboard', true);
          navLinks.forEach(function(l){ l.classList.remove('active'); });
          link.classList.add('active');
          var targetId = link.getAttribute('data-scroll');
          var target = targetId ? document.getElementById(targetId) : null;
          if(target){ setTimeout(function(){ target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, fromSettings ? 60 : 0); }
        });
      });

      // sidebar recolhível (expandida ⇄ só ícones) + tooltips
      var app = document.querySelector('.app');
      var collapseBtn = document.getElementById('collapse-btn');

      var tip = document.createElement('div');
      tip.className = 'side-tooltip';
      document.body.appendChild(tip);
      function showTip(el, text, always){
        if(!always && !app.classList.contains('collapsed')) return;
        var r = el.getBoundingClientRect();
        tip.textContent = typeof text === 'function' ? text() : text;
        tip.style.top = (r.top + r.height / 2) + 'px';
        tip.style.left = (r.right + 12) + 'px';
        tip.classList.add('show');
      }
      function hideTip(){ tip.classList.remove('show'); }

      navLinks.forEach(function(link){
        var label = link.querySelector('.nav-label');
        var text = function(){ return label ? label.textContent.trim() : ''; };
        link.addEventListener('mouseenter', function(){ showTip(link, text); });
        link.addEventListener('focus', function(){ showTip(link, text); });
        link.addEventListener('mouseleave', hideTip);
        link.addEventListener('blur', hideTip);
      });
      document.querySelectorAll('.side-foot a').forEach(function(link){
        var text = function(){ return link.querySelector('.nav-label').textContent.trim(); };
        link.addEventListener('mouseenter', function(){ showTip(link, text); });
        link.addEventListener('focus', function(){ showTip(link, text); });
        link.addEventListener('mouseleave', hideTip);
        link.addEventListener('blur', hideTip);
      });
      // menu lateral no mobile (gaveta)
      var menuToggle = document.getElementById('menu-toggle');
      var backdrop = document.getElementById('drawer-backdrop');
      function setDrawer(open){
        app.classList.toggle('drawer-open', open);
        menuToggle.setAttribute('aria-expanded', String(open));
        menuToggle.setAttribute('aria-label', open ? tr('Fechar menu') : tr('Abrir menu'));
      }
      menuToggle.addEventListener('click', function(){ setDrawer(!app.classList.contains('drawer-open')); });
      backdrop.addEventListener('click', function(){ setDrawer(false); });
      document.addEventListener('keydown', function(e){ if(e.key === 'Escape') setDrawer(false); });
      document.querySelectorAll('.sidebar a').forEach(function(a){ a.addEventListener('click', function(){ setDrawer(false); }); });
      window.addEventListener('resize', function(){ if(window.innerWidth > 860) setDrawer(false); });

      collapseBtn.addEventListener('mouseenter', function(){ showTip(collapseBtn, function(){ return tr('Fechar barra lateral'); }, true); });
      collapseBtn.addEventListener('mouseleave', hideTip);

      // menus do topo (notificações/conta) são tratados no módulo próprio; aqui só pedimos para fechá-los
      function closeNotif(){ document.dispatchEvent(new CustomEvent('ecoclick:close-menus')); }

      // logo: com a sidebar recolhida vira o botão "Abrir barra lateral" (hover)
      var logoLink = document.querySelector('.sidebar .logo-text');
      logoLink.addEventListener('mouseenter', function(){ showTip(logoLink, function(){ return tr('Abrir barra lateral'); }); });
      logoLink.addEventListener('focus', function(){ showTip(logoLink, function(){ return tr('Abrir barra lateral'); }); });
      logoLink.addEventListener('mouseleave', hideTip);
      logoLink.addEventListener('blur', hideTip);
      logoLink.addEventListener('click', function(){
        // só abre a sidebar quando ela está recolhida; nunca navega
        if(app.classList.contains('collapsed')) setCollapsed(false);
      });

      function setCollapsed(collapsed){
        app.classList.toggle('collapsed', collapsed);
        collapseBtn.setAttribute('aria-expanded', String(!collapsed));
        collapseBtn.setAttribute('aria-label', tr('Fechar barra lateral'));
        if(collapsed){ logoLink.setAttribute('aria-label', tr('Abrir barra lateral')); }
        else { logoLink.removeAttribute('aria-label'); }
        hideTip();
        closeNotif();
        try{ localStorage.setItem('ecoclick_sidebar_collapsed', collapsed ? '1' : '0'); }catch(err){}
      }
      collapseBtn.addEventListener('click', function(){
        setCollapsed(!app.classList.contains('collapsed'));
      });
      try{
        if(localStorage.getItem('ecoclick_sidebar_collapsed') === '1') setCollapsed(true);
      }catch(err){}

      // sugestões animadas do campo de busca do Dashboard
      // -> lista fácil de editar/expandir no futuro
      var SEARCH_SUGGESTIONS = [
        'O que você deseja descartar?',
        'Procure por celulares',
        'Procure por computadores',
        'Procure por carregadores',
        'Procure por pilhas e baterias',
        'Encontre um ponto de coleta'
      ];
      (function(){
        var input = document.getElementById('dashboard-search');
        var suggestEl = document.getElementById('search-suggest');
        if(!input || !suggestEl || !SEARCH_SUGGESTIONS.length) return;

        var index = 0;
        var rotateTimer = null;
        var swapTimer = null;

        function render(text){ suggestEl.textContent = tr(text); }
        render(SEARCH_SUGGESTIONS[0]);
        document.addEventListener('ecoclick:lang-change', function(){ render(SEARCH_SUGGESTIONS[index]); });

        function swapTo(nextIndex){
          suggestEl.classList.add('out');
          swapTimer = setTimeout(function(){
            index = nextIndex;
            render(SEARCH_SUGGESTIONS[index]);
            // força reflow para reiniciar a transição de entrada
            void suggestEl.offsetWidth;
            suggestEl.classList.remove('out');
          }, 400);
        }

        function startRotation(){
          stopRotation();
          suggestEl.classList.add('show');
          rotateTimer = setInterval(function(){
            swapTo((index + 1) % SEARCH_SUGGESTIONS.length);
          }, 2800);
        }
        function stopRotation(){
          if(rotateTimer){ clearInterval(rotateTimer); rotateTimer = null; }
          if(swapTimer){ clearTimeout(swapTimer); swapTimer = null; }
        }
        function hideSuggestion(){
          stopRotation();
          suggestEl.classList.remove('show');
          suggestEl.classList.add('out');
        }
        function resumeSuggestion(){
          if(input.value.length > 0) return;
          suggestEl.classList.remove('out');
          startRotation();
        }

        input.addEventListener('input', function(){
          if(input.value.length > 0){ hideSuggestion(); }
          else { resumeSuggestion(); }
        });
        input.addEventListener('blur', function(){
          if(input.value.length === 0) resumeSuggestion();
        });

        // inicia assim que a página carrega (campo começa vazio)
        resumeSuggestion();
      })();

      var logout = document.getElementById('logout-link');
      if(logout){
        logout.addEventListener('click', function(e){
          e.preventDefault();
          try{ localStorage.removeItem('ecoclick_current_user'); }catch(err){}
          window.EcoNav('home');
        });
      }
    })();
  