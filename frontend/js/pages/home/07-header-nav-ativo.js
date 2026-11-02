
    // Navegação dinâmica do header: identifica qual seção está em destaque
    // enquanto o usuário rola a página e ativa o botão correspondente do menu.
    (function(){
      var navLinks = document.querySelectorAll('nav a[href^="#"]');
      if(!navLinks.length) return;
      var sections = Array.prototype.slice.call(navLinks).map(function(link){
        return document.querySelector(link.getAttribute('href'));
      }).filter(Boolean);

      function setActive(id){
        navLinks.forEach(function(link){
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }

      if(!('IntersectionObserver' in window) || !sections.length){
        return;
      }

      // considera a seção "em destaque" quando cruza uma faixa logo abaixo do
      // header fixo — evita que a seção mude assim que só uma borda aparece
      var observer = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if(entry.isIntersecting){
            setActive(entry.target.id);
          }
        });
      }, { rootMargin: '-96px 0px -70% 0px', threshold: 0 });

      sections.forEach(function(section){ observer.observe(section); });

      // estado inicial (topo da página, antes de qualquer rolagem)
      setActive(sections[0].id);
    })();
  