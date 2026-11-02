
    // Meus conteúdos: seta lateral para avançar/voltar e link "Ver todos" preparado para o destino futuro
    (function(){
      var row = document.getElementById('content-row'); if(!row) return;
      var rail = row.parentNode, prev = rail.querySelector('.cc-arrow.prev'), next = rail.querySelector('.cc-arrow.next');
      function step(){ var c = row.querySelector('.content-card'); return c ? c.getBoundingClientRect().width + 18 : 240; }
      function update(){
        var max = row.scrollWidth - row.clientWidth;
        prev.hidden = max <= 2 || row.scrollLeft <= 2;
        next.hidden = max <= 2 || row.scrollLeft >= max - 2;
      }
      prev.addEventListener('click', function(){ row.scrollBy({ left:-step() }); });
      next.addEventListener('click', function(){ row.scrollBy({ left:step() }); });
      row.addEventListener('scroll', update, { passive:true });
      window.addEventListener('resize', update);
      document.addEventListener('ecoclick:view-change', function(){ setTimeout(update, 80); });
      update();
      // defina data-href="..." no link quando a página de conteúdos existir
      var all = document.getElementById('conteudos-all');
      all.addEventListener('click', function(e){ var h = all.getAttribute('data-href'); if(h){ window.location.href = h; } e.preventDefault(); });
    })();
  