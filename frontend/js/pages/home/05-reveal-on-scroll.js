
    // Entrada suave das seções ao rolar a página.
    // Cada elemento observado anima UMA única vez (unobserve após aparecer).
    // Título, subtítulo, cards e mapa usam transition-delay (via classes
    // delay-1..4 ou estilo inline) para criar a sequência: título → conteúdo.
    (function(){
      var targets = document.querySelectorAll('.reveal, .reveal-sm, .pin-reveal, .steps-line');
      if(!('IntersectionObserver' in window)){
        targets.forEach(function(el){ el.classList.add('is-visible'); });
        return;
      }
      var observer = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if(entry.isIntersecting){
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
      targets.forEach(function(el){ observer.observe(el); });
    })();
  