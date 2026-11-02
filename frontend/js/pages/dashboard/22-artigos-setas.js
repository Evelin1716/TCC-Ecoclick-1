
    // Artigos e conteúdos: setas laterais (ficam esmaecidas quando não há para onde rolar) e link "Ver todos" preparado
    (function(){
      var rail = document.querySelector('#artigos [data-rail]'); if(!rail) return;
      var row = rail.querySelector('.content-row'), prev = rail.querySelector('.cc-arrow.prev'), next = rail.querySelector('.cc-arrow.next');
      function step(){ var c = row.querySelector('.content-card'); return c ? c.getBoundingClientRect().width + (parseFloat(getComputedStyle(row).columnGap) || 18) : 240; }
      function update(){
        var max = row.scrollWidth - row.clientWidth;
        prev.disabled = row.scrollLeft <= 2;
        next.disabled = max <= 2 || row.scrollLeft >= max - 2;
      }
      prev.addEventListener('click', function(){ row.scrollBy({ left:-step() }); });
      next.addEventListener('click', function(){ row.scrollBy({ left:step() }); });
      row.addEventListener('scroll', update, { passive:true });
      window.addEventListener('resize', update);
      document.addEventListener('ecoclick:view-change', function(){ setTimeout(update, 80); });
      update();
      // defina data-href="..." no link quando a página completa de conteúdos existir
      var all = document.getElementById('artigos-all');
      all.addEventListener('click', function(e){ var h = all.getAttribute('data-href'); if(h) window.location.href = h; e.preventDefault(); });
    })();
  