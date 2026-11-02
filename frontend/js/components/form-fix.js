/* Garante o disparo do evento "submit" (botão e Enter) mesmo em visualizadores que bloqueiam o envio nativo,
   e encaminha cliques de "sair" para o módulo de autenticação (main.js). */
(function formFix(){
  function fire(f){ var ev; try{ ev = new Event('submit', { bubbles:true, cancelable:true }); }catch(e){ ev = document.createEvent('Event'); ev.initEvent('submit', true, true); } f.dispatchEvent(ev); }
  document.addEventListener('click', function(e){
    var b = e.target && e.target.closest && e.target.closest('button,input'); if(!b || b.disabled) return;
    var f = b.form || b.closest('form'); if(!f) return;
    var t = (b.getAttribute('type') || (b.tagName === 'BUTTON' ? 'submit' : '')).toLowerCase(); if(t !== 'submit') return;
    e.preventDefault(); fire(f);
  }, true);
  document.addEventListener('click', function(e){
    var o = e.target && e.target.closest && e.target.closest('#logout-link,#logout,#ecoOut,.eco-out');
    if(o){ try{ parent.postMessage({ ecoAuth: { op: 'logout', id: 'x' } }, '*'); }catch(x){} }
  }, true);
  document.addEventListener('keydown', function(e){
    if(e.key !== 'Enter' || e.isComposing) return;
    var t = e.target; if(!t || t.tagName !== 'INPUT') return;
    if(['button','submit','checkbox','radio','file','reset'].indexOf((t.type || '').toLowerCase()) >= 0) return;
    var f = t.form; if(!f) return; e.preventDefault(); fire(f);
  }, true);
})();
