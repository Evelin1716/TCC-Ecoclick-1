
(function(){
  window.EcoScroll = true;
  function all(s){return document.querySelectorAll(s);}
  function nav(s,to){all(s).forEach(function(el){el.setAttribute('data-eco-nav',to);});}
  var u=null; try{u=JSON.parse(localStorage.getItem('ecoclick_current_user'));}catch(e){}
  var li=document.querySelector('.login-link'), su=document.querySelector('.btn-signup');
  if(li) li.setAttribute('data-eco-nav','login'); if(su) su.setAttribute('data-eco-nav','signup');
  nav('.btn-cta','signup');
  nav('.search-btn, .btn-elevate, .map-pin','dashboard');
  /*fix-homesearch*/ (function(){ var inp=document.querySelector('.search-bar input'), btn=document.querySelector('.search-btn'); if(!inp||!btn) return; var fromSearch=false, base=window.EcoNav;
    window.EcoNav=function(to){ var ev=window.event, hit=fromSearch||!!(ev&&ev.target&&ev.target.closest&&ev.target.closest('.search-btn')); var q=(hit&&to==='dashboard')?inp.value.trim():''; fromSearch=false; try{ parent.postMessage({ecoNav:to,q:q},'*'); }catch(e){ if(base) base(to); } };
    btn.addEventListener('click', function(){ fromSearch=true; }, true);
    inp.addEventListener('keydown', function(e){ if(e.key==='Enter'){ e.preventDefault(); btn.click(); } }); })();
  var anchors={'Início':'#inicio','Materiais':'#materiais','Pontos de coleta':'#pontos-de-coleta','Como funciona':'#como-funciona','Impacto':'#impacto','Comunidade':'#comunidade'};
  var other={'Recompensas':'dashboard','Central de ajuda':'dashboard','Perguntas frequentes':'dashboard','Contato':'dashboard','Privacidade':'privacy','Termos de uso':'terms'};
  all('a[href="#"]').forEach(function(a){
    if(a.closest('nav')||a.classList.contains('logo-text')) return;
    var t=a.textContent.trim();
    if(anchors[t]) a.setAttribute('href',anchors[t]); else if(other[t]) a.setAttribute('data-eco-nav',other[t]);
  });
})();
