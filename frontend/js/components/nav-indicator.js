
(function(){
  function make(nav, itemSel, bar, delay){
    if(!nav) return;
    var pill = document.createElement('span'); pill.className = 'nav-pill no-anim' + (bar ? ' bar' : ''); pill.setAttribute('aria-hidden', 'true');
    nav.insertBefore(pill, nav.firstChild);
    function move(anim){
      var a = nav.querySelector(itemSel);
      if(!a || !nav.classList.contains('has-pill')){ return; }
      if(!anim) pill.classList.add('no-anim');
      pill.style.width = a.offsetWidth + 'px'; pill.style.height = a.offsetHeight + 'px';
      pill.style.transform = 'translate(' + a.offsetLeft + 'px,' + a.offsetTop + 'px)';
      pill.classList.add('ready');
      if(!anim){ void pill.offsetWidth; pill.classList.remove('no-anim'); }
    }
    function arm(){ nav.classList.add('has-pill'); move(false); }
    if(delay) setTimeout(arm, delay); else arm();
    new MutationObserver(function(ms){ if(ms.some(function(m){ return m.target !== pill; })) move(true); }).observe(nav, { attributes:true, attributeFilter:['class'], subtree:true });
    if(window.ResizeObserver) new ResizeObserver(function(){ move(false); }).observe(nav);
    window.addEventListener('resize', function(){ move(false); });
    window.addEventListener('load', function(){ move(false); });
    var sb = nav.closest('.sidebar'); if(sb) sb.addEventListener('transitionend', function(e){ if(e.propertyName === 'flex-basis' || e.propertyName === 'transform') move(false); });
    if(document.fonts && document.fonts.ready) document.fonts.ready.then(function(){ move(false); });
  }
  make(document.querySelector('.side-nav:not(.side-foot)'), 'a.active', true, 0);
  make(document.getElementById('topics'), 'button.on', false, 1500);
})();
