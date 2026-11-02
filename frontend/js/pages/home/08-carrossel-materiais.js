
    // Carrossel contínuo e infinito de materiais (efeito "coverflow").
    // A trilha contém a sequência de 3 cards repetida 4x; a cada quadro a
    // posição avança da direita para a esquerda e, ao completar exatamente
    // a largura de UM ciclo (3 cards), subtraímos essa largura da posição —
    // como o conteúdo se repete a cada ciclo, o "reinício" é matematicamente
    // idêntico ao instante anterior: não há salto nem costura perceptível.
    // A cada quadro também recalculamos, para cada card, a distância até o
    // centro visual do carrossel e aplicamos uma escala proporcional
    // (maior e com mais sombra perto do centro, menor e discreto nas
    // laterais) — por isso o destaque muda suavemente, nunca "pula".
    document.querySelectorAll('[data-materials-carousel]').forEach(function(root){
      var track = root.querySelector('.materials-track');
      var items = Array.prototype.slice.call(track.children);
      var UNIQUE = 4; // cards únicos por ciclo (Celulares / Computadores / Cabos / Eletrodomésticos)
      var position = 0;
      var inView = true, running = true, paused = false, userPaused = (document.documentElement.classList.contains('reduce-motion') || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)), hov = false, target = null;
      var lastTime = null;

      function cardStep(){
        var gap = parseFloat(getComputedStyle(track).gap) || 0;
        return items[0].getBoundingClientRect().width + gap;
      }

      function updateScales(){
        var rootRect = root.getBoundingClientRect();
        var centerX = rootRect.left + rootRect.width / 2;
        var falloff = cardStep() * 1.15;
        items.forEach(function(item){
          var r = item.getBoundingClientRect();
          var itemCenter = r.left + r.width / 2;
          var t = Math.min(Math.abs(itemCenter - centerX) / falloff, 1);
          var eased = t * t * (3 - 2 * t); // smoothstep: transição gradual, sem "pulo"
          var scale = 1.1 - eased * (1.1 - 0.87); // 1.10 no centro → 0.87 nas laterais
          item.style.transform = 'scale(' + scale.toFixed(3) + ')';
          var img = item.querySelector('.material-image');
          if(img){
            img.style.boxShadow = '0 18px 32px -18px rgba(0,0,0,' + (0.12 + (1 - eased) * 0.33).toFixed(2) + ')';
            img.style.borderColor = eased < 0.3 ? 'var(--eco-green)' : 'var(--box-light)';
          }
        });
      }

      function tick(timestamp){
        if(lastTime === null) lastTime = timestamp;
        var delta = (timestamp - lastTime) / 1000;
        lastTime = timestamp;

        var step = cardStep(), cycle = step * UNIQUE;
        if(!(paused || userPaused || hov || document.hidden)){
          position += (step / 8) * delta; // ~8s por card
        }
        if(target !== null){
          position += (target - position) * Math.min(1, delta * 7);
          if(Math.abs(target - position) < .6){ position = target; target = null; }
        }
        if(position >= cycle){ position -= cycle; if(target !== null) target -= cycle; } // reinício imperceptível
        if(position < 0){ position += cycle; if(target !== null) target += cycle; }
        track.style.transform = 'translateX(-' + position.toFixed(2) + 'px)';
        updateScales();
        if(inView && !document.hidden) requestAnimationFrame(tick); else running = false;
      }
      function wake(){ if(!running && inView && !document.hidden){ running = true; lastTime = null; requestAnimationFrame(tick); } }
      document.addEventListener('visibilitychange', wake);
      if('IntersectionObserver' in window) new IntersectionObserver(function(es){ inView = es[0].isIntersecting; wake(); }, {rootMargin:'120px'}).observe(root);

      // controles: anterior / próximo. O movimento pausa com mouse, foco ou toque.
      var ctl = document.createElement('div'); ctl.className = 'mc-controls'; ctl.setAttribute('role', 'group'); ctl.setAttribute('aria-label', 'Controles do carrossel de materiais');
      var ICON = { prev:'<path d="M15 5l-7 7 7 7"/>', next:'<path d="M9 5l7 7-7 7"/>', pause:'<path d="M9 5v14M15 5v14"/>', play:'<path d="M7 4l13 8-13 8z"/>' };
      function mk(k, label){ var b = document.createElement('button'); b.type = 'button'; b.className = 'mc-btn'; b.setAttribute('aria-label', label); b.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true">' + ICON[k] + '</svg>'; ctl.appendChild(b); return b; }
      var bPrev = mk('prev', 'Material anterior'), bNext = mk('next', 'Próximo material');
      function nudge(dir){ var s = cardStep(); if(userPaused && !(window.EcoFX && EcoFX.motionOK())){ position += dir * s; target = null; } else target = (target !== null ? target : position) + dir * s; }
      bPrev.addEventListener('click', function(){ nudge(-1); }); bNext.addEventListener('click', function(){ nudge(1); });
      root.insertAdjacentElement('afterend', ctl);
      var stl = document.createElement('style'); stl.textContent = '.mc-controls{display:flex;justify-content:center;gap:10px;margin-top:14px}.mc-btn{width:40px;height:40px;border-radius:50%;border:1.5px solid var(--box-light);background:var(--bg-2);color:var(--text-heading);display:grid;place-items:center;cursor:pointer;transition:border-color .2s,background .2s,translate .15s}.mc-btn:hover{border-color:var(--eco-green);translate:0 -1px}.mc-btn svg{width:17px;height:17px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}.mc-btn[aria-pressed="true"] svg{fill:currentColor}@media (pointer:coarse){footer a{display:inline-block;padding:9px 0}}'; document.head.appendChild(stl);
      root.addEventListener('mouseenter', function(){ hov = true; }); root.addEventListener('mouseleave', function(){ hov = false; });
      root.addEventListener('focusin', function(){ hov = true; }); root.addEventListener('focusout', function(){ hov = false; });
      var tmr; root.addEventListener('touchstart', function(){ hov = true; clearTimeout(tmr); }, {passive:true}); root.addEventListener('touchend', function(){ tmr = setTimeout(function(){ hov = false; }, 1600); }, {passive:true});

      window.addEventListener('resize', function(){
        position = 0;
        track.style.transform = 'translateX(0)';
      });

      requestAnimationFrame(tick);
    });
  