// Identificador público de autoria usado pelas telas da comunidade (mesmo cálculo do frontend: FNV-1a do e-mail).
// Não é segredo: serve só para marcar "este post/curtida é meu". A autoria real é sempre decidida pelo servidor.
module.exports = function userKey(email) {
  let h = 2166136261;
  const em = String(email || '').toLowerCase();
  for (let i = 0; i < em.length; i++) {
    h ^= em.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return 'u' + h.toString(36);
};
