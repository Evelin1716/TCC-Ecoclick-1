/* Página "Materiais aceitos": lista os materiais cadastrados no banco, com orientações de preparo antes do descarte. */
(function () {
  var box = document.getElementById('lista'), state = document.getElementById('estado');
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  EcoApi.get('/materials').then(function (r) {
    var items = (r && r.items) || [];
    if (!items.length) { state.textContent = 'Nenhum material cadastrado ainda.'; return; }
    state.remove();
    items.forEach(function (m) {
      var c = el('article', 'card'); c.appendChild(el('h2', null, m.name));
      var tips = Array.isArray(m.prepTips) ? m.prepTips : [];
      if (tips.length) { var ul = el('ul'); tips.forEach(function (t) { ul.appendChild(el('li', null, t)); }); c.appendChild(ul); }
      else c.appendChild(el('p', 'state', 'Sem orientações cadastradas.'));
      box.appendChild(c);
    });
  }, function () { state.textContent = 'Não foi possível carregar os materiais agora. Verifique se o servidor está ligado.'; });
})();
