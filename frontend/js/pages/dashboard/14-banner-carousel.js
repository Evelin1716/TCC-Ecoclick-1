
    // Banner/carrossel de destaques: troca automática com transição suave
    // (deslize lateral contínuo, sem fade), setas laterais e pontinhos clicáveis.
    (function(){
      var root = document.getElementById('promo');
      if(!root) return;
      var slides = Array.prototype.slice.call(root.querySelectorAll('.promo-slide'));
      var dots = Array.prototype.slice.call(root.querySelectorAll('.promo-dots button'));
      var banner = root.querySelector('.promo-banner');
      var INTERVAL = 5500, SHIFT = 100;
      var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
      var cur = 0, timer = null, hovering = false;

      function go(i, dir){
        i = (i + slides.length) % slides.length;
        if(i === cur) return;
        var out = slides[cur], inn = slides[i];
        var shift = SHIFT * dir;
        // posiciona o slide que entra no lado de origem, sem transição
        inn.style.transition = 'none';
        inn.style.transform = 'translateX(' + shift + '%)';
        void inn.offsetWidth;
        inn.style.transition = '';
        inn.style.transform = '';
        inn.classList.add('active');
        inn.removeAttribute('aria-hidden'); inn.removeAttribute('inert');
        // o slide que sai desliza para o lado oposto
        out.style.transform = 'translateX(' + (-shift) + '%)';
        out.classList.remove('active');
        out.setAttribute('aria-hidden', 'true'); out.setAttribute('inert', '');
        setTimeout(function(){
          if(out !== slides[cur]){
            out.style.transition = 'none'; out.style.transform = '';
            void out.offsetWidth; out.style.transition = '';
          }
        }, 900);
        dots[cur].classList.remove('active');
        dots[i].classList.add('active');
        cur = i;
      }
      function next(){ go(cur + 1, 1); }
      function prev(){ go(cur - 1, -1); }

      function start(){ stop(); timer = setInterval(function(){ if(!hovering && !document.hidden) next(); }, INTERVAL); }
      function stop(){ if(timer){ clearInterval(timer); timer = null; } }

      root.querySelector('.promo-arrow.next').addEventListener('click', function(){ next(); start(); });
      root.querySelector('.promo-arrow.prev').addEventListener('click', function(){ prev(); start(); });
      dots.forEach(function(d, i){
        d.addEventListener('click', function(){ go(i, i > cur ? 1 : -1); start(); });
      });

      banner.addEventListener('mouseenter', function(){ hovering = true; });
      banner.addEventListener('mouseleave', function(){ hovering = false; });

      // swipe no celular
      var x0 = null;
      banner.addEventListener('touchstart', function(e){ x0 = e.touches[0].clientX; }, {passive:true});
      banner.addEventListener('touchend', function(e){
        if(x0 === null) return;
        var d = e.changedTouches[0].clientX - x0; x0 = null;
        if(d < -40){ next(); start(); } else if(d > 40){ prev(); start(); }
      });

      start();
    })();
  