
  /* tema e preferências salvos no navegador — aplicados antes da página aparecer */
  (function(){
    var r = document.documentElement, c = 'light';
    try{
      var s = localStorage.getItem('ecoclick_theme'); if(s === 'dark' || s === 'system') c = s;
      var p = (JSON.parse(localStorage.getItem('ecoclick_settings') || '{}').preferences) || {};
      if(p.reduceMotion) r.classList.add('reduce-motion');
      if(p.highContrast) r.classList.add('high-contrast');
    }catch(e){}
    var t = c === 'system' ? ((window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light') : c;
    r.setAttribute('data-theme', t); r.setAttribute('data-theme-choice', c);
  })();
