
    // Botão "Ver código": mostra o HTML-fonte da página dentro de um modal.
    (function(){
      var openBtn = document.getElementById('view-code-btn');
      var modal = document.getElementById('code-modal');
      var closeBtn = document.getElementById('close-code-btn');
      var copyBtn = document.getElementById('copy-code-btn');
      var output = document.getElementById('code-output');

      // captura o HTML atual da página (estrutura completa) uma única vez
      var sourceCode = '<!DOCTYPE html>\n' + document.documentElement.outerHTML;
      output.textContent = sourceCode;

      function open(){ modal.hidden = false; }
      function close(){ modal.hidden = true; }

      openBtn.addEventListener('click', open);
      closeBtn.addEventListener('click', close);
      modal.addEventListener('click', function(e){
        if(e.target === modal) close();
      });
      document.addEventListener('keydown', function(e){
        if(e.key === 'Escape' && !modal.hidden) close();
      });

      copyBtn.addEventListener('click', function(){
        var restore = function(){ copyBtn.textContent = 'Copiar'; };
        try{
          navigator.clipboard.writeText(sourceCode).then(function(){
            copyBtn.textContent = 'Copiado!';
            setTimeout(restore, 1500);
          }).catch(function(){
            copyBtn.textContent = 'Selecione e copie';
            setTimeout(restore, 1500);
          });
        }catch(err){
          copyBtn.textContent = 'Selecione e copie';
          setTimeout(restore, 1500);
        }
      });
    })();
  