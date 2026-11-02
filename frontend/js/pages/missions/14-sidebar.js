
(function(){
  var B=document.body,side=document.querySelector('.eco-side');if(!side)return;
  var cb=document.getElementById('collapse-btn'),logo=document.getElementById('logo-btn'),mt=document.getElementById('eco-menu'),bd=document.getElementById('eco-backdrop');
  var tip=document.createElement('div');tip.className='side-tooltip';document.body.appendChild(tip);
  function wide(){return window.innerWidth>860;}
  function showTip(el,text,always){if(!wide())return;if(!always&&!B.classList.contains('eco-collapsed'))return;var r=el.getBoundingClientRect();tip.textContent=typeof text==='function'?text():text;tip.style.top=(r.top+r.height/2)+'px';tip.style.left=(r.right+12)+'px';tip.classList.add('show');}
  function hideTip(){tip.classList.remove('show');}
  function bindTip(el,text,always){['mouseenter','focus'].forEach(function(ev){el.addEventListener(ev,function(){showTip(el,text,always);});});['mouseleave','blur'].forEach(function(ev){el.addEventListener(ev,hideTip);});}
  side.querySelectorAll('.eco-nav a').forEach(function(l){var lab=l.querySelector('.nav-label');bindTip(l,function(){return lab?lab.textContent.trim():'';});});
  bindTip(logo,'Abrir barra lateral');
  cb.addEventListener('mouseenter',function(){showTip(cb,'Fechar barra lateral',true);});cb.addEventListener('mouseleave',hideTip);
  function setCollapsed(c){B.classList.toggle('eco-collapsed',c);cb.setAttribute('aria-expanded',String(!c));if(c)logo.setAttribute('aria-label','Abrir barra lateral');else logo.removeAttribute('aria-label');hideTip();try{localStorage.setItem('ecoclick_sidebar_collapsed',c?'1':'0');}catch(e){}}
  cb.addEventListener('click',function(){setCollapsed(!B.classList.contains('eco-collapsed'));});
  logo.addEventListener('click',function(){if(B.classList.contains('eco-collapsed'))setCollapsed(false);});
  B.classList.add('eco-notrans');
  try{if(localStorage.getItem('ecoclick_sidebar_collapsed')==='1')setCollapsed(true);}catch(e){}
  requestAnimationFrame(function(){requestAnimationFrame(function(){B.classList.remove('eco-notrans');});});
  function setDrawer(o){B.classList.toggle('eco-drawer',o);mt.setAttribute('aria-expanded',String(o));mt.setAttribute('aria-label',o?'Fechar menu':'Abrir menu');}
  mt.addEventListener('click',function(){setDrawer(!B.classList.contains('eco-drawer'));});
  bd.addEventListener('click',function(){setDrawer(false);});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')setDrawer(false);});
  window.addEventListener('resize',function(){if(wide())setDrawer(false);});
})();
