/* Lê os atributos data-* do <html> e prepara as variáveis globais que as telas já esperavam do antigo "shell".
   Deve rodar antes dos scripts de cada página (fica no <head>). */
(function () {
  var R = document.documentElement, d = R.dataset || {};
  if (d.fxReveal) window.__FXR = d.fxReveal;
  if (d.ecoStartView) window.EcoStartView = d.ecoStartView;   // dashboard: abre direto na seção indicada
  if (d.ecoStart) window.EcoStart = d.ecoStart;               // login: "signup"; jornada: tela inicial
  try {
    var u = JSON.parse(localStorage.getItem('ecoclick_current_user') || 'null') || {};
    window.ECOCLICK_USER_ID = u.email || 'local';             // chave do estado de missões/jornada por usuário
    window.ECOCLICK_USER_NAME = u.name || '';
  } catch (e) { window.ECOCLICK_USER_ID = 'local'; window.ECOCLICK_USER_NAME = ''; }
  try {                                                        // busca digitada na home -> dashboard
    var q = sessionStorage.getItem('eco_prefill');
    if (q && d.ecoPage === 'dashboard') { window.EcoPrefill = q; sessionStorage.removeItem('eco_prefill'); }
  } catch (e) {}
})();
