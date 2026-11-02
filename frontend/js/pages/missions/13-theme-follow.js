
(function(){
  /* segue o tema e as preferências do site (claro/escuro/sistema, alto contraste, menos movimento) */
  function apply(){
    function G(k){try{var v=localStorage.getItem(k);if(v!=null)return v}catch(e){}var o=window.__ECO||{};return o[k]==null?null:o[k]}
    var r=document.documentElement, ch='light', p={};
    try{ var t=G("ecoclick_theme"); if(t==="dark"||t==="system") ch=t; }catch(e){}
    try{ p=(JSON.parse(G("ecoclick_settings")||"{}").preferences)||{}; }catch(e){}
    var dark = ch==="dark" || (ch==="system" && window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches);
    r.setAttribute("data-theme", dark?"dark":"light");
    r.classList.toggle("high-contrast", !!p.highContrast);
    r.classList.toggle("reduce-motion", !!p.reduceMotion);
  }
  apply();
  window.addEventListener("storage", apply);
  try{ var mq=matchMedia("(prefers-color-scheme: dark)"); if(mq.addEventListener) mq.addEventListener("change", apply); }catch(e){}
  var lg=document.getElementById("logout-link");
  if(lg) lg.addEventListener("click", function(e){ e.preventDefault(); try{ window.EcoBackend.logout().then(function(){ window.EcoNav("home"); }); }catch(err){ window.EcoNav("home"); } });
})();
