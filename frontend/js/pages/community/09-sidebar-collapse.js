
(function(){
  var app=document.querySelector('.app'),side=document.querySelector('.sidebar');if(!app||!side)return;
  var cb=document.getElementById('collapse-btn'),logo=document.getElementById('logo-btn');
  var tip=document.createElement('div');tip.className='side-tooltip';document.body.appendChild(tip);
  function wide(){return window.innerWidth>860;}
  function showTip(el,text,always){if(!wide())return;if(!always&&!app.classList.contains('collapsed'))return;var r=el.getBoundingClientRect();tip.textContent=typeof text==='function'?text():text;tip.style.top=(r.top+r.height/2)+'px';tip.style.left=(r.right+12)+'px';tip.classList.add('show');}
  function hideTip(){tip.classList.remove('show');}
  function bindTip(el,text,always){['mouseenter','focus'].forEach(function(ev){el.addEventListener(ev,function(){showTip(el,text,always);});});['mouseleave','blur'].forEach(function(ev){el.addEventListener(ev,hideTip);});}
  side.querySelectorAll('.side-nav a').forEach(function(l){var lab=l.querySelector('.nav-label');bindTip(l,function(){return lab?lab.textContent.trim():'';});});
  bindTip(logo,'Abrir barra lateral');
  cb.addEventListener('mouseenter',function(){showTip(cb,'Fechar barra lateral',true);});cb.addEventListener('mouseleave',hideTip);
  function setCollapsed(c){app.classList.toggle('collapsed',c);cb.setAttribute('aria-expanded',String(!c));if(c)logo.setAttribute('aria-label','Abrir barra lateral');else logo.removeAttribute('aria-label');hideTip();try{localStorage.setItem('ecoclick_sidebar_collapsed',c?'1':'0');}catch(e){}}
  cb.addEventListener('click',function(){setCollapsed(!app.classList.contains('collapsed'));});
  logo.addEventListener('click',function(){if(app.classList.contains('collapsed'))setCollapsed(false);});
  document.body.classList.add('eco-notrans');
  try{if(localStorage.getItem('ecoclick_sidebar_collapsed')==='1')setCollapsed(true);}catch(e){}
  requestAnimationFrame(function(){requestAnimationFrame(function(){document.body.classList.remove('eco-notrans');});});
})();
