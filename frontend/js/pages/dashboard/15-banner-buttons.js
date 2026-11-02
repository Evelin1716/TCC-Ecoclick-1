
    // Botões dos banners: levam às mesmas abas do menu lateral
    document.addEventListener('click', function(e){
      var b = e.target.closest && e.target.closest('[data-banner-go]'); if(!b) return;
      e.preventDefault();
      var go = b.getAttribute('data-banner-go');
      function side(k){ var l = document.querySelector('.side-nav a[data-nav="' + k + '"]'); if(l) l.click(); }
      if(go === 'materiais') side('materiais');
      else if(go === 'conteudos') side('conteudos');
      else if(go === 'coleta'){ side('coleta'); setTimeout(function(){ var c = document.getElementById('coleta-card'); if(c) c.scrollIntoView({ behavior:'smooth', block:'start' }); }, 60); }
      else if(go === 'jornada'){ if(window.EcoNav) window.EcoNav('missions'); }
      else if(go === 'comunidade'){ if(window.EcoNav) window.EcoNav('community'); }
    });
  