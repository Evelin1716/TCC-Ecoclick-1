/* EcoFX — camada de interações compartilhada (animações de entrada, contagens, feedback de clique, validação).
   O seletor dos blocos que "aparecem ao rolar" vem de <html data-fx-reveal="..."> (lido em page-context.js). */
(function ecoFx(){
  if(window.EcoFX) return;
  var R = document.documentElement, seen = {}, pend = [];
  function ok(){ return !(R.classList.contains('reduce-motion') || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)); }
  function anim(el, kf, o){ if(!ok() || !el || !el.animate) return null; try{ return el.animate(kf, o); }catch(e){ return null; } }
  function shake(el){ anim(el, [{translate:'0 0'},{translate:'-6px 0'},{translate:'5px 0'},{translate:'-3px 0'},{translate:'0 0'}], {duration:360, easing:'ease-out'}); }
  function pop(el){ anim(el, [{scale:1},{scale:1.06},{scale:1}], {duration:420, easing:'cubic-bezier(.2,.8,.3,1.2)'}); }
  function glow(el){ anim(el, [{boxShadow:'0 0 0 0 rgba(74,132,118,.5)'},{boxShadow:'0 0 0 12px rgba(74,132,118,0)'}], {duration:700, easing:'ease-out'}); }
  function busy(btn, on){ if(!btn) return; btn.classList.toggle('fx-busy', !!on); if(on) btn.setAttribute('aria-busy', 'true'); else btn.removeAttribute('aria-busy'); }
  function check(btn, label){ if(!btn) return; var t = btn.textContent; btn.textContent = '✓ ' + label; btn.classList.add('fx-ok'); pop(btn); setTimeout(function(){ btn.textContent = t; btn.classList.remove('fx-ok'); }, 1700); }
  function burst(el){
    if(!ok() || !el || !el.getBoundingClientRect) return; var r = el.getBoundingClientRect(); if(!r.width) return;
    var cx = r.left + r.width / 2, cy = r.top + r.height / 2, C = ['#4a8476','#85cfb0','#7ea8e8','#e3b869'];
    for(var i = 0; i < 12; i++){
      var p = document.createElement('i'), a = (Math.PI * 2 * i) / 12 + Math.random() * .5, d = 34 + Math.random() * 34;
      p.style.cssText = 'position:fixed;z-index:99999;pointer-events:none;left:' + cx + 'px;top:' + cy + 'px;width:7px;height:7px;margin:-3px;border-radius:50%;background:' + C[i % 4];
      document.body.appendChild(p);
      var an = p.animate([{transform:'translate(0,0) scale(1)',opacity:1},{transform:'translate(' + Math.cos(a) * d + 'px,' + Math.sin(a) * d + 'px) scale(.3)',opacity:0}], {duration:600 + Math.random() * 250, easing:'cubic-bezier(.2,.7,.3,1)'});
      an.onfinish = (function(n){ return function(){ n.remove(); }; })(p);
    }
  }
  /* observador único: revela blocos e dispara contagens quando entram na tela */
  var io = ('IntersectionObserver' in window) ? new IntersectionObserver(function(es){
    var k = 0;
    es.forEach(function(e){ if(e.isIntersecting){ io.unobserve(e.target); var f = e.target.__fx; if(f) f(k++); } });
  }, {threshold:.08, rootMargin:'0px 0px -6% 0px'}) : null;
  function whenVisible(el, fn){ if(!io){ fn(0); return; } el.__fx = fn; io.observe(el); }
  function show(el, i){
    el.style.setProperty('--fx-d', Math.min(i, 4) * 60 + 'ms'); el.classList.add('eco-fx-in');
    var done = function(){ el.classList.remove('eco-fx-pre', 'eco-fx-in'); el.style.removeProperty('--fx-d'); };
    el.addEventListener('transitionend', function f(ev){ if(ev.target === el && ev.propertyName === 'opacity'){ el.removeEventListener('transitionend', f); done(); } });
    setTimeout(done, 1200);
  }
  function reveal(sel){
    if(!sel || !io || !ok()) return;
    Array.prototype.forEach.call(document.querySelectorAll(sel), function(el){
      if(el.__fxr) return; el.__fxr = 1;
      var r = el.getBoundingClientRect(); if(r.height && r.top < innerHeight * .92 && r.bottom > 0) return;
      el.classList.add('eco-fx-pre'); pend.push(el); whenVisible(el, function(i){ show(el, i); });
    });
  }
  /* rede de segurança: nada fica escondido se o observador não disparar */
  setInterval(function(){ pend = pend.filter(function(el){ if(!el.classList.contains('eco-fx-pre') || el.classList.contains('eco-fx-in')) return false;
    if(el.offsetParent){ var r = el.getBoundingClientRect(); if(r.top < innerHeight && r.bottom > 0){ if(io) io.unobserve(el); show(el, 0); return false; } } return true; }); }, 1500);
  function tween(el, from, to, dur){
    var t0 = performance.now(); (function f(t){ var p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3); el.textContent = String(Math.round(from + (to - from) * e)); if(p < 1) requestAnimationFrame(f); })(t0);
  }
  function count(el){
    var key = el.getAttribute('data-fxk'), txt = (el.textContent || '').trim(); if(!/^\d+$/.test(txt)) return;
    var to = +txt, had = key != null && (key in seen), from = had ? seen[key] : 0;
    if(key != null) seen[key] = to;
    if(!ok() || (had && from === to)) return;
    el.textContent = String(from); var fin = false;
    whenVisible(el, function(){ fin = true; tween(el, from, to, 700); if(had) pop(el); });
    setTimeout(function(){ if(!fin) el.textContent = String(to); }, 2500);
  }
  function countAll(root){ Array.prototype.forEach.call((root || document).querySelectorAll('[data-fxk]'), count); }
  function growGlow(el, v){ if(!el) return; var p = +el.getAttribute('data-fxp'); el.setAttribute('data-fxp', v); if(p && v > p) glow(el.parentElement || el); }
  /* feedback de clique (WAAPI na propriedade "scale": não conflita com transform/transition das páginas) */
  var PR = 'button,a[href],[role=button],summary,.chip,[data-go],[data-eco-nav]';
  document.addEventListener('pointerdown', function(e){
    if(!ok() || (e.button > 0 && e.pointerType === 'mouse')) return;
    var t = e.target.closest && e.target.closest(PR); if(!t || t.disabled || t.hasAttribute('data-fx-off') || t.getAttribute('aria-disabled') === 'true') return;
    var r = t.getBoundingClientRect(); if(r.width > 520 || r.height > 200 || !t.animate) return;
    var a = t.animate([{scale:1},{scale:r.width > 200 ? .985 : .96}], {duration:90, easing:'ease-out', fill:'forwards'}), done = false;
    function up(){ if(done) return; done = true; a.reverse(); a.onfinish = function(){ a.cancel(); }; }
    window.addEventListener('pointerup', up, {once:true, capture:true}); window.addEventListener('pointercancel', up, {once:true, capture:true}); setTimeout(up, 1500);
  }, true);
  document.addEventListener('touchstart', function(){}, {passive:true}); /* habilita :active no iOS */
  /* validação: qualquer campo que passe a aria-invalid="true" balança uma vez */
  new MutationObserver(function(ms){ ms.forEach(function(m){ if(m.target.getAttribute('aria-invalid') === 'true' && m.oldValue !== 'true') shake(m.target); }); })
    .observe(document.documentElement, {subtree:true, attributes:true, attributeFilter:['aria-invalid'], attributeOldValue:true});
  window.EcoFX = {motionOK:ok, shake:shake, pop:pop, glow:glow, busy:busy, check:check, burst:burst, reveal:reveal, count:count, countAll:countAll, growGlow:growGlow};
  /* áreas de toque: em telas de toque, aumenta a zona clicável de controles pequenos sem mudar o visual */
  var hit = new WeakSet(), hitT = null, coarse = !!(window.matchMedia && matchMedia('(pointer:coarse)').matches);
  function free(c){ return !c || c === 'none' || c === 'normal'; }
  function hitAreas(){
    if(!coarse) return;
    Array.prototype.forEach.call(document.querySelectorAll('button,a[href],[role=button]'), function(el){
      if(hit.has(el)) return; var r = el.getBoundingClientRect(); if(!r.width || !r.height) return; hit.add(el);
      if(r.width >= 40 && r.height >= 40) return;
      var cls = free(getComputedStyle(el, '::before').content) ? 'fx-hit-b' : (free(getComputedStyle(el, '::after').content) ? 'fx-hit-a' : null); if(!cls) return;
      if(getComputedStyle(el).position === 'static') el.style.position = 'relative';
      el.style.setProperty('--fx-hx', Math.min(8, Math.max(0, (40 - r.width) / 2)) + 'px'); el.style.setProperty('--fx-hy', Math.min(8, Math.max(0, (40 - r.height) / 2)) + 'px'); el.classList.add(cls);
    });
  }
  function hitSoon(){ if(!coarse) return; clearTimeout(hitT); hitT = setTimeout(hitAreas, 400); }
  function skip(){
    if(document.querySelector('.skip-link,.fx-skip')) return;
    var m = document.querySelector('main,[role=main]'); if(!m) return;
    if(!m.id) m.id = 'fx-main'; if(!m.hasAttribute('tabindex')) m.setAttribute('tabindex', '-1');
    var a = document.createElement('a'); a.className = 'fx-skip'; a.href = '#' + m.id; a.textContent = 'Pular para o conteúdo';
    a.addEventListener('click', function(e){ e.preventDefault(); m.focus({preventScroll:false}); }); document.body.insertBefore(a, document.body.firstChild);
  }
  function boot(){ if(window.__FXR) reveal(window.__FXR); skip(); hitAreas(); }
  new MutationObserver(hitSoon).observe(document.documentElement, {childList:true, subtree:true});
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function(){ setTimeout(boot, 60); }); else setTimeout(boot, 60);
  document.addEventListener('ecoclick:view-change', function(){ setTimeout(boot, 80); });
  window.addEventListener('resize', hitSoon);
})();
