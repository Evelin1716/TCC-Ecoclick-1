
(function(){
  var root = document.getElementById('ch'); if(!root) return;
  var A = window.ECO_ARTICLES || [];
  var KEY = 'ecoclick_hub';
  var mem = null;
  function $(id){ return document.getElementById(id); }
  function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  function plain(s){ return String(s).replace(/\{\{|\}\}|\*\*/g,'').replace(/\[\[(.+?)\|.+?\]\]/g,'$1'); }
  function def(){ return { read:[], last:'', fav:[], later:[], days:{}, goal:3, quiz:{ best:-1, total:0 }, known:[], posts:[], notify:false }; }
  function load(){
    if(mem) return mem;
    var s = def();
    try{ var r = JSON.parse(localStorage.getItem(KEY) || 'null'); if(r && typeof r === 'object'){ for(var k in s) if(r[k] !== undefined) s[k] = r[k]; } }catch(e){}
    mem = s; return s;
  }
  function save(){ try{ localStorage.setItem(KEY, JSON.stringify(mem)); }catch(e){} }
  function find(id){ for(var i = 0; i < A.length; i++) if(A[i].id === id) return A[i]; return null; }
  function dkey(d){ var m = d.getMonth() + 1, dd = d.getDate(); return d.getFullYear() + '-' + (m < 10 ? '0' : '') + m + '-' + (dd < 10 ? '0' : '') + dd; }
  function mark(){ var s = load(); s.days[dkey(new Date())] = 1; }
  function has(list, id){ return list.indexOf(id) >= 0; }
  function toggle(list, id){ var i = list.indexOf(id); if(i >= 0) list.splice(i, 1); else list.push(id); }

  var ICO_FAV = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.600-7 10-7 10z"/></svg>';
  var ICO_LATER = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4h12v17l-6-4-6 4z"/></svg>';
  var ICO_BADGE = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="9" r="5"/><path d="M9 13.500L7.500 21l4.500-2.500 4.500 2.500L15 13.500"/></svg>';

  function acts(id){
    var s = load();
    return '<button type="button" class="ch-fav ch-act" data-act="fav" data-id="' + esc(id) + '" aria-pressed="' + has(s.fav, id) + '" aria-label="Favoritar">' + ICO_FAV + '</button>' +
           '<button type="button" class="ch-fav ch-act" data-act="later" data-id="' + esc(id) + '" aria-pressed="' + has(s.later, id) + '" aria-label="Estudar depois">' + ICO_LATER + '</button>';
  }
  function item(a){
    return '<div class="art-card ch-item" role="listitem" data-id="' + esc(a.id) + '"><div class="t"><span class="ch-chip">' + esc(a.category) + '</span><b style="margin-top:6px">' + esc(plain(a.title)) + '</b></div>' + acts(a.id) + '</div>';
  }
  function empty(msg, btn, go){
    return '<div class="ch-empty"><p>' + msg + '</p>' + (btn ? '<button type="button" class="ch-btn" data-go="' + go + '">' + btn + '</button>' : '') + '</div>';
  }

  function renderContinue(){
    var s = load(), a = s.last && find(s.last);
    $('ch-continue').innerHTML = a
      ? '<div class="ch-list"><div class="art-card ch-item" role="listitem" data-id="' + esc(a.id) + '"><div class="t"><span class="ch-chip">' + esc(a.category) + '</span><b style="margin-top:6px">' + esc(plain(a.title)) + '</b></div></div></div><p class="cap">Toque para retomar a leitura.</p>'
      : empty('Você ainda não abriu nenhum material. Comece por um artigo.', 'Ver artigos', 'ch-artigos');
  }
  function renderReco(){
    var s = load(), cats = [];
    s.read.concat(s.fav, s.later).forEach(function(id){ var a = find(id); if(a && cats.indexOf(a.category) < 0) cats.push(a.category); });
    var pool = A.filter(function(a){ return !has(s.read, a.id); });
    var pref = pool.filter(function(a){ return cats.indexOf(a.category) >= 0; });
    var list = (pref.length ? pref.concat(pool.filter(function(a){ return pref.indexOf(a) < 0; })) : pool).slice(0, 3);
    $('ch-reco').innerHTML = list.length
      ? '<div class="ch-list" role="list">' + list.map(item).join('') + '</div><p class="cap">' + (pref.length ? 'Com base nos assuntos que você abriu e salvou.' : 'Sugestões para começar. Elas mudam conforme você lê e salva materiais.') + '</p>'
      : empty('Você já leu todos os artigos disponíveis. Novos conteúdos aparecem aqui.');
  }
  function weekDays(){
    var d = new Date(), dow = (d.getDay() + 6) % 7, out = [], names = ['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'];
    for(var i = 0; i < 7; i++){ var x = new Date(d.getFullYear(), d.getMonth(), d.getDate() - dow + i); out.push({ n:names[i], d:x.getDate(), k:dkey(x), today:i === dow }); }
    return out;
  }
  function weekCount(){ var s = load(); return weekDays().filter(function(x){ return s.days[x.k]; }).length; }
  function renderGoals(){
    var s = load(), w = weekDays(), n = weekCount();
    $('ch-week').innerHTML = w.map(function(x){
      return '<div class="ch-day' + (s.days[x.k] ? ' on' : '') + (x.today ? ' today' : '') + '" role="listitem"><span>' + x.n + '</span><span class="ch-dot" aria-label="' + x.n + ' ' + x.d + (s.days[x.k] ? ', estudado' : '') + '">' + x.d + '</span></div>';
    }).join('');
    var g = $('ch-goal'); if(!g.options.length){ for(var i = 1; i <= 7; i++){ var o = document.createElement('option'); o.value = i; o.textContent = i + (i === 1 ? ' dia' : ' dias') + ' por semana'; g.appendChild(o); } }
    g.value = s.goal;
    var pct = Math.min(100, Math.round(n / s.goal * 100));
    $('ch-goal-t').textContent = n + ' de ' + s.goal + (n >= s.goal ? ' · meta concluída!' : '');
    var bar = $('ch-goal-bar'); bar.setAttribute('aria-valuenow', pct); bar.firstElementChild.style.width = pct + '%';
    var bs = [['Primeira leitura', s.read.length > 0], ['Meta semanal', n >= s.goal]];
    $('ch-badges').innerHTML = bs.map(function(b){ return '<span class="ch-badge' + (b[1] ? '' : ' lock') + '">' + ICO_BADGE + b[0] + (b[1] ? '' : ' (bloqueada)') + '</span>'; }).join('');
  }
  function ring(pct, label, sub){
    var c = 2 * Math.PI * 26, off = c * (1 - pct / 100);
    return '<div class="ch-ring"><svg viewBox="0 0 64 64" role="img" aria-label="' + label + ' ' + pct + '%"><circle class="bg" cx="32" cy="32" r="26"/><circle class="fg" cx="32" cy="32" r="26" stroke-dasharray="' + c.toFixed(1) + '" stroke-dashoffset="' + off.toFixed(1) + '"/></svg><div><b>' + pct + '%</b><span class="cap">' + label + '<br>' + sub + '</span></div></div>';
  }
  function row(l, v, pct){ return '<div class="ch-row"><b>' + l + '</b><span class="cap">' + v + '</span><div class="bar ch-bar" aria-hidden="true"><i style="width:' + pct + '%"></i></div></div>'; }
  function renderEvo(){
    var s = load(), nA = A.length || 1, r = s.read.filter(function(id){ return find(id); }).length;
    $('ch-rings').innerHTML = ring(Math.round(r / nA * 100), 'Artigos lidos', r + ' de ' + A.length);
    $('ch-evo').innerHTML = row('Dúvidas enviadas', String(s.posts.filter(function(p){ return p.mine; }).length), Math.min(100, s.posts.filter(function(p){ return p.mine; }).length * 20));
  }
  var tab = 'fav';
  function renderColl(){
    var s = load(), ids = s[tab], list = ids.map(find).filter(Boolean);
    $('ch-coll').setAttribute('aria-labelledby', 'ch-tab-' + tab);
    $('ch-coll').innerHTML = list.length ? '<div class="ch-list" role="list">' + list.map(item).join('') + '</div>'
      : empty(tab === 'fav' ? 'Você ainda não favoritou nada. Toque no coração de um material para guardá-lo aqui.' : 'Sua lista está vazia. Use o marcador para salvar um material para depois.');
    ['fav','later'].forEach(function(t){ $('ch-tab-' + t).setAttribute('aria-selected', String(t === tab)); });
  }
  function renderLists(){
    var tips = A.filter(function(a){ return ['Curiosidades','Desafios','Consumo consciente'].indexOf(a.category) >= 0; }).slice(0, 3);
    $('ch-tips').innerHTML = tips.length ? tips.map(function(a){ return '<div class="ch-card" style="padding:14px">' + item(a).replace('role="listitem"', 'role="listitem" style="border:0;padding:0;background:none"') + '<p class="cap">' + esc(a.description) + '</p></div>'; }).join('') : empty('Em breve.');
    var news = A.slice().sort(function(x, y){ return (y.date || '').localeCompare(x.date || ''); });
    if(!A.some(function(a){ return a.date; })) news = A.slice().reverse();
    news = news.slice(0, 3);
    $('ch-news').innerHTML = news.map(function(a){ return '<div class="ch-card" style="padding:14px">' + item(a).replace('role="listitem"', 'role="listitem" style="border:0;padding:0;background:none"') + '<p class="cap">' + esc(a.description) + '</p></div>'; }).join('');
    var sel = $('ch-qtopic'); if(!sel.options.length){ var g = document.createElement('option'); g.value = ''; g.textContent = 'Assunto geral'; sel.appendChild(g); A.forEach(function(a){ var o = document.createElement('option'); o.value = a.id; o.textContent = plain(a.title); sel.appendChild(o); }); }
  }
  /* ===== Dúvidas ===== */
  function renderPosts(){
    var s = load();
    $('ch-posts').innerHTML = s.posts.length ? s.posts.slice().reverse().map(function(p){
      var t = p.topic && find(p.topic);
      if(p.hidden) return '<div class="ch-q hid" role="listitem"><p>Conteúdo oculto, aguardando revisão da moderação.</p></div>';
      return '<div class="ch-q" role="listitem" data-pid="' + p.id + '"><span class="cap">' + (t ? esc(plain(t.title)) : 'Assunto geral') + ' · ' + esc(p.when) + '</span><p>' + esc(p.text) + '</p>' +
        (p.replies || []).map(function(r){ return '<p class="cap" style="border-left:3px solid var(--box-light);padding-left:10px">' + esc(r) + '</p>'; }).join('') +
        '<form class="ch-form ch-reply" novalidate style="flex-direction:row;gap:8px"><label class="ch-sr" for="rp' + p.id + '">Comentar</label><input id="rp' + p.id + '" maxlength="300" placeholder="Comentar" style="flex:1;min-width:0"><button type="submit" class="ch-btn ghost">Enviar</button></form>' +
        '<button type="button" class="ch-link ch-rep" style="align-self:flex-start">Denunciar</button></div>';
    }).join('') : empty('Ainda não há perguntas. Seja a primeira pessoa a participar.');
  }

  function renderAll(){ renderContinue(); renderReco(); renderGoals(); renderEvo(); renderColl(); renderLists(); renderPosts(); }

  /* ===== eventos ===== */
  function go(id){ var el = $(id); if(el){ el.scrollIntoView({ behavior:'smooth', block:'start' }); } }
  document.addEventListener('click', function(e){
    var c = e.target.closest && e.target.closest('.art-card[data-id]');
    if(c && !(e.target.closest && e.target.closest('.ch-act'))){
      var id = c.getAttribute('data-id'), s = load(); if(find(id)){ if(!has(s.read, id)) s.read.push(id); s.last = id; mark(); save(); setTimeout(renderAll, 50); }
    }
  }, true);
  document.addEventListener('click', function(e){
    var a = e.target.closest && e.target.closest('.ch-act'); if(!a) return;
    e.preventDefault(); e.stopPropagation();
    var s = load(), id = a.getAttribute('data-id'), t = a.getAttribute('data-act');
    toggle(t === 'fav' ? s.fav : s.later, id); save(); renderAll(); decorate();
  }, true);
  root.addEventListener('click', function(e){
    var t = e.target, b;
    if((b = t.closest('[data-go]'))){ e.preventDefault(); go(b.getAttribute('data-go')); return; }
    if((b = t.closest('[data-tab]'))){ tab = b.getAttribute('data-tab'); renderColl(); return; }
    if(t.closest('#ch-a11y')){ e.preventDefault(); if(window.EcoApp) EcoApp.showView('settings', true); return; }
    if((b = t.closest('.ch-rep'))){ var s4 = load(), pid = +b.closest('[data-pid]').getAttribute('data-pid'); s4.posts.forEach(function(p){ if(p.id === pid) p.hidden = true; }); save(); renderPosts(); return; }
  });
  root.addEventListener('submit', function(e){
    e.preventDefault(); var f = e.target, s = load();
    if(f.id === 'ch-qform'){
      var txt = $('ch-qtext').value.trim(), m = $('ch-qmsg');
      if(txt.length < 5){ m.textContent = 'Escreva pelo menos 5 caracteres.'; $('ch-qtext').setAttribute('aria-invalid', 'true'); return; }
      m.textContent = ''; $('ch-qtext').removeAttribute('aria-invalid');
      s.posts.push({ id:Date.now(), topic:$('ch-qtopic').value, text:txt, when:new Date().toLocaleDateString('pt-BR'), mine:true, replies:[] });
      $('ch-qtext').value = ''; mark(); save(); renderPosts(); renderEvo(); renderGoals(); return;
    }
    if(f.classList.contains('ch-reply')){
      var inp = f.querySelector('input'), v = inp.value.trim(); if(!v) return;
      var pid = +f.closest('[data-pid]').getAttribute('data-pid');
      s.posts.forEach(function(p){ if(p.id === pid){ (p.replies = p.replies || []).push(v); } }); mark(); save(); renderPosts(); renderGoals();
    }
  });
  $('ch-goal').addEventListener('change', function(){ var s = load(); s.goal = +this.value; save(); renderGoals(); });

  /* botões de favoritar/estudar depois também nos cards da lista de artigos */
  function decorate(){
    document.querySelectorAll('#art-grid .art-pcard').forEach(function(c){
      var id = c.getAttribute('data-id'), box = c.querySelector('.ch-acts');
      if(!box){ box = document.createElement('div'); box.className = 'ch-acts'; box.style.cssText = 'display:flex;gap:4px;margin-top:6px'; c.querySelector('.cc-body').appendChild(box); }
      box.innerHTML = acts(id);
    });
  }
  var grid = $('art-grid');
  if(grid && window.MutationObserver){ new MutationObserver(function(m){ var own = m.every(function(x){ return x.target.classList && x.target.classList.contains('ch-acts'); }); if(!own) decorate(); }).observe(grid, { childList:true }); }

  document.addEventListener('ecoclick:view-change', function(){ setTimeout(function(){ renderAll(); decorate(); }, 60); });
  window.addEventListener('storage', function(){ mem = null; renderAll(); });
  renderAll(); decorate();
})();
