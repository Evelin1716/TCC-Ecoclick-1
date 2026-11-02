
  (function(){
    var r = document.documentElement, t = 'light';
    try{
      var s = localStorage.getItem('ecoclick_theme');
      if(s === 'dark' || (s === 'system' && matchMedia('(prefers-color-scheme: dark)').matches)) t = 'dark';
      var p = (JSON.parse(localStorage.getItem('ecoclick_settings') || '{}').preferences) || {};
      if(p.reduceMotion) r.classList.add('reduce-motion');
    }catch(e){}
    r.setAttribute('data-theme', t);
  })();
