/* Configuração do frontend — carregada antes de todos os outros scripts.
   apiUrl: endereço da API Express. Quando o frontend é servido pelo próprio backend (npm run dev / npm start),
   o padrão "/api" já funciona. Se você abrir o frontend por outro servidor (ex.: Live Server na porta 5500),
   a API é procurada em http://localhost:3000/api. Para mudar, edite apiUrl abaixo.
   NUNCA coloque chaves secretas aqui: este arquivo é público. */
window.ECO_CONFIG = Object.assign({
  apiUrl: (function () {
    var l = window.location;
    if (l.protocol === 'file:') return 'http://localhost:3000/api';
    if (l.port && l.port !== '3000' && /^(localhost|127\.0\.0\.1)$/.test(l.hostname)) return 'http://localhost:3000/api';
    return '/api';
  })(),
  policyVersion: '2026-10'
}, window.ECO_CONFIG || {});
