
  /* tema salvo nas Configurações do EcoClick (mesma chave do Dashboard) — aplicado antes da página aparecer */
  (function(){
    var r = document.documentElement;
    function read(){
      var t = 'light';
      try{
        if(localStorage.getItem('ecoclick_theme') === 'dark') t = 'dark';
        var p = (JSON.parse(localStorage.getItem('ecoclick_settings') || '{}').preferences) || {};
        r.classList.toggle('reduce-motion', !!p.reduceMotion);
        r.classList.toggle('high-contrast', !!p.highContrast);
      }catch(e){}
      return t;
    }
    function apply(){ var t = read(); if(r.getAttribute('data-theme') !== t) r.setAttribute('data-theme', t); }
    apply();
    window.EcoHomeTheme = { apply:apply };
    window.addEventListener('storage', function(e){ if(!e.key || e.key === 'ecoclick_theme' || e.key === 'ecoclick_settings') apply(); });
    window.addEventListener('focus', apply);
    document.addEventListener('visibilitychange', function(){ if(!document.hidden) apply(); });
    window.addEventListener('pageshow', apply);
  })();
