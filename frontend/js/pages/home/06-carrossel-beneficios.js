
    // Carrossel de benefícios: loop infinito e bidirecional.
    // "Próximo": desliza para a esquerda; ao fim da transição, o primeiro
    // card é movido (via DOM) para o final e a posição volta a 0 sem
    // transição — por isso nunca "acaba".
    // "Anterior": o último card é movido para o início e a trilha é
    // posicionada instantaneamente um passo à esquerda (sem transição,
    // imperceptível); em seguida anima-se de volta a 0, revelando o card
    // deslizando a partir da esquerda.
    document.querySelectorAll('[data-benefit-carousel]').forEach(function(carousel){
      var track = carousel.querySelector('.benefit-track');
      var prevBtn = carousel.querySelector('.benefit-arrow.prev');
      var nextBtn = carousel.querySelector('.benefit-arrow.next');
      var dotsWrap = carousel.parentElement.querySelector('.benefit-dots');
      var dots = dotsWrap ? dotsWrap.querySelectorAll('span') : [];
      var total = track.children.length;
      var current = 0;
      var isAnimating = false;
      var TRANSITION = 'transform .6s ease-in-out';

      function step(){
        var first = track.children[0];
        var gap = parseFloat(getComputedStyle(track).gap) || 0;
        return first.getBoundingClientRect().width + gap;
      }

      function updateDots(){
        dots.forEach(function(d, i){ d.classList.toggle('active', i === current); });
      }

      function next(){
        if(isAnimating) return;
        isAnimating = true;
        current = (current + 1) % total;
        track.style.transition = TRANSITION;
        track.style.transform = 'translateX(-' + step() + 'px)';
        updateDots();
      }

      function prev(){
        if(isAnimating) return;
        isAnimating = true;
        current = (current - 1 + total) % total;
        var distance = step();
        // move o último card para o início e reposiciona sem transição
        track.style.transition = 'none';
        track.insertBefore(track.children[track.children.length - 1], track.children[0]);
        track.style.transform = 'translateX(-' + distance + 'px)';
        void track.offsetHeight; // força reflow
        // anima de volta a 0, revelando o card pela esquerda
        track.style.transition = TRANSITION;
        track.style.transform = 'translateX(0)';
        updateDots();
      }

      track.addEventListener('transitionend', function(){
        // se a trilha terminou deslocada para a esquerda (fluxo do "next"),
        // reorganiza o DOM e volta à posição 0 sem transição
        var computed = getComputedStyle(track).transform;
        if(computed && computed !== 'none'){
          var translateX = new DOMMatrix(computed).m41;
          if(translateX < -1){
            track.style.transition = 'none';
            track.appendChild(track.children[0]);
            track.style.transform = 'translateX(0)';
            void track.offsetHeight;
          }
        }
        isAnimating = false;
      });

      nextBtn.addEventListener('click', next);
      prevBtn.addEventListener('click', prev);

      // bolinhas clicáveis: vão até o card escolhido pelo caminho mais curto
      function goTo(i){
        var diff = (i - current + total) % total; if(!diff) return;
        var dir = diff <= total / 2 ? 1 : -1, steps = dir === 1 ? diff : total - diff;
        (function run(){ if(steps <= 0) return; if(isAnimating){ setTimeout(run, 60); return; } steps--; if(dir === 1) next(); else prev(); setTimeout(run, 60); })();
      }
      dots.forEach(function(d, i){
        d.setAttribute('role', 'button'); d.setAttribute('tabindex', '0'); d.setAttribute('aria-label', 'Ir para o benefício ' + (i + 1));
        d.addEventListener('click', function(){ goTo(i); });
        d.addEventListener('keydown', function(e){ if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); goTo(i); } });
      });

      // swipe (toque) no mobile
      var startX = null;
      track.addEventListener('touchstart', function(e){ startX = e.touches[0].clientX; }, {passive:true});
      track.addEventListener('touchend', function(e){
        if(startX === null) return;
        var diff = e.changedTouches[0].clientX - startX;
        if(diff < -40) next();
        else if(diff > 40) prev();
        startX = null;
      });

      // recalcula a posição corretamente em resize
      window.addEventListener('resize', function(){
        track.style.transition = 'none';
        track.style.transform = 'translateX(0)';
      });
    });
  