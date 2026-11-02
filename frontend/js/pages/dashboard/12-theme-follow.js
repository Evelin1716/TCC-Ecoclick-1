
    // tema: acompanha a escolha feita em Configurações (mesma aba ao voltar, ou outra aba aberta) com transição suave
    (function(){
      var root = document.documentElement, timer;
      function stored(){ try{ return localStorage.getItem('ecoclick_theme') === 'dark' ? 'dark' : 'light'; }catch(e){ return 'light'; } }
      function prefs(){
        try{
          var p = (JSON.parse(localStorage.getItem('ecoclick_settings') || '{}').preferences) || {};
          root.classList.toggle('reduce-motion', !!p.reduceMotion);
          root.classList.toggle('high-contrast', !!p.highContrast);
        }catch(e){}
      }
      function sync(animate){
        var th = stored();
        if(root.getAttribute('data-theme') !== th){
          if(animate){ root.classList.add('theme-anim'); clearTimeout(timer); timer = setTimeout(function(){ root.classList.remove('theme-anim'); }, 500); }
          root.setAttribute('data-theme', th);
          document.dispatchEvent(new CustomEvent('ecoclick:theme-change', { detail:{ theme:th } }));
        }
        prefs();
      }
      window.addEventListener('storage', function(e){
        if(!e.key || e.key === 'ecoclick_theme' || e.key === 'ecoclick_settings') sync(true);
        if(!e.key || e.key === 'ecoclick_settings'){ var l = EcoI18n.stored(); if(l !== EcoI18n.lang) EcoI18n.setLang(l); }
      });
      window.addEventListener('pageshow', function(){ sync(false); });
    })();
  