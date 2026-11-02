
(function(){
  var host = document.getElementById('rw-host'), tpl = document.getElementById('rw-tpl'); if(!host || !tpl) return;
  var root = host.attachShadow({ mode:'open' }); root.appendChild(tpl.content.cloneNode(true));
  var $ = function(id){ return root.getElementById(id); };

const STAR = '<svg width="18" height="18"><use href="#star"/></svg>';
const REWARDS = [
 {id:'garrafa',name:'Garrafa personalizada',desc:'Garrafa reutilizável com a identidade visual sustentável do EcoClick.',cost:500,glow:'#2f7d66',
  art:''},
 {id:'broches',name:'Broches',desc:'Broches decorativos com símbolos de reciclagem e a tartaruga mascote.',cost:300,glow:'#3b63b5',
  art:''},
 {id:'album',name:'Álbum de figurinhas',desc:'Álbum colecionável ilustrado com a tartaruga mascote.',cost:400,glow:'#8a6f2c',
  art:''},
 {id:'fone',name:'Fone de ouvido personalizado',desc:'Fone com detalhes verdes e folhas inspirados em sustentabilidade.',cost:1200,glow:'#355c9c',
  art:''},
 {id:'tabuleiro',name:'Jogo de tabuleiro',desc:'Jogo educativo sobre reciclagem e preservação ambiental.',cost:800,glow:'#7a5a2c',
  art:''},
 {id:'adesivos',name:'Cartela de adesivos',desc:'Adesivos variados com a tartaruga mascote e elementos da natureza.',cost:200,glow:'#2f7d66',
  art:''}
];
REWARDS.splice(5,0,
 {id:'chaveiro',name:'Chaveiro',desc:'Chaveiro acrílico da tartaruga mascote, com argola e pingente de folha.',cost:250,glow:'#2f7d66',art:''},
 {id:'ursinho',name:'Ursinho de pelúcia de tartaruga',desc:'Tartaruga de pelúcia macia para abraçar e colecionar.',cost:1500,glow:'#2f7d66',art:''}
);
const PHOTOS = {adesivos:'../assets/images/dashboard-0d6d2d06bd.webp',garrafa:'../assets/images/dashboard-0381098e66.webp',broches:'../assets/images/dashboard-b0baf95cfb.webp',album:'../assets/images/dashboard-231175bb74.webp',fone:'../assets/images/dashboard-a270e7bb74.webp',tabuleiro:'../assets/images/dashboard-e1aacfc296.webp',chaveiro:'../assets/images/dashboard-f1f7627685.webp',ursinho:'../assets/images/dashboard-1b207f3815.webp'};
REWARDS.forEach(r => { if (PHOTOS[r.id]) { r.photo = true; r.art = `<img src="${PHOTOS[r.id]}" alt="${r.name}" decoding="async">`; } });
function readBal(){ try{ var p = JSON.parse(localStorage.getItem('ecoclick_profile') || '{}') || {}; return typeof p.points === 'number' ? p.points : 0; }catch(e){ return 0; } }
let balance = readBal(), current = null, qty = 1, busy = false, opener = null;
const fmt = n => n.toLocaleString('pt-BR');
const norm = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
const art = (r,i) => `<div class="fl" style="--d:${(i*.7)%3}s">${r.art}</div>`;

function renderBalance(){ $('balance').textContent = fmt(balance); }
function renderGrid(){
  const term = norm($('q').value);
  const list = REWARDS.filter(r => norm(r.name).includes(term));
  $('grid').innerHTML = list.map((r,i) => `
    <article class="card"><div class="art${r.photo?' photo':''}" style="--glow:${r.glow}">${art(r,REWARDS.indexOf(r))}</div>
      <div class="body">
        <span class="cost">${STAR}${fmt(r.cost)} pontos</span>
        <h2>${r.name}</h2><p>${r.desc}</p>
        <button class="btn primary" data-id="${r.id}" type="button">Resgatar</button>
      </div></article>`).join('');
  $('empty').hidden = list.length > 0;
}
function openModal(id, btn){
  current = REWARDS.find(r => r.id === id); qty = 1; opener = btn;
  $('mImg').className = 'art' + (current.photo ? ' photo' : ''); $('mImg').style.setProperty('--glow', current.glow);
  $('mImg').innerHTML = art(current, REWARDS.indexOf(current));
  $('mTitle').textContent = current.name; $('mDesc').textContent = current.desc;
  $('mUnit').innerHTML = `${STAR} ${fmt(current.cost)}`;
  setMsg(''); updateModal();
  $('overlay').classList.add('open'); $('confirm').focus();
}
function closeModal(){
  if (busy) return;
  $('overlay').classList.remove('open'); current = null;
  if (opener) opener.focus();
}
function setMsg(t, cls=''){ const m=$('msg'); m.textContent=t; m.className='msg '+cls; }
function updateModal(){
  const total = current.cost * qty;
  $('qty').textContent = qty;
  $('mTotal').innerHTML = `${STAR} ${fmt(total)}`;
  $('mBal').innerHTML = `${STAR} ${fmt(balance)}`;
  $('totalRow').classList.toggle('short', total > balance);
  $('minus').disabled = qty <= 1 || busy; $('plus').disabled = qty >= 10 || busy;
  $('cancel').disabled = busy;
}
/* Ponto de integração: troque por uma chamada real ao servidor. */
function processRedeem(reward, quantity){
  try{
    if(window.EcoBackend && window.EcoBackend.on){
      return window.EcoBackend.redeem(reward.id, quantity).then(function(r){
        if(r.balance != null) balance = r.balance;
        if(r.ok){ persist(reward, quantity, r.total); try{ window.EcoBackend.refresh(); }catch(e){} return { ok:true, total:r.total }; }
        return { ok:false, total:r.total || reward.cost * quantity, msg:r.msg };
      });
    }
  }catch(e){}
  return new Promise(resolve => setTimeout(() => {
    const total = reward.cost * quantity;
    if (total > balance) return resolve({ok:false, total});
    balance -= total; persist(reward, quantity, total); resolve({ok:true, total});
  }, 700));
}
async function confirmRedeem(){
  if (busy || !current) return;
  const total = current.cost * qty;
  if (total > balance){
    setMsg(`Saldo insuficiente: faltam ${fmt(total - balance)} pontos. Reduza a quantidade ou escolha outro item.`, 'err'); return;
  }
  busy = true; $('confirm').disabled = true; $('confirm').textContent = 'Processando...';
  setMsg(''); updateModal();
  const name = current.name, q = qty;
  const res = await processRedeem(current, qty);
  busy = false; $('confirm').disabled = false; $('confirm').textContent = 'Confirmar resgate';
  if (res.ok){
    renderBalance(); closeModal();
    toast(`Resgate concluído: ${q}× ${name}. Você usou ${fmt(res.total)} pontos.`);
  } else {
    updateModal(); setMsg(res.msg || 'Saldo insuficiente. Nenhum ponto foi descontado.', 'err');
  }
}
let tt;
function toast(t){ const el=$('toast'); el.textContent=t; el.classList.add('show'); clearTimeout(tt); tt=setTimeout(()=>el.classList.remove('show'),4200); }
$('grid').addEventListener('click', e => { const b=e.target.closest('button[data-id]'); if(b) openModal(b.dataset.id, b); });
$('q').addEventListener('input', renderGrid);
$('plus').onclick = () => { if(qty<10){qty++; setMsg(''); updateModal();} };
$('minus').onclick = () => { if(qty>1){qty--; setMsg(''); updateModal();} };
$('confirm').onclick = confirmRedeem;
$('cancel').onclick = closeModal;
$('overlay').addEventListener('click', e => { if(e.target.id==='overlay') closeModal(); });
document.addEventListener('keydown', e => { if(e.key==='Escape' && $('overlay').classList.contains('open')) closeModal(); });
function lj(k,d){ try{ var v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; }catch(e){ return d; } }
function sj(k,v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} }
function persist(reward, quantity, total){
  var p = lj('ecoclick_profile', {}); p.points = balance; sj('ecoclick_profile', p);
  var at = new Date().toISOString();
  var l = lj('ecoclick_redemptions', []); l.unshift({ id:'rs_' + Date.now().toString(36), rewardId:reward.id, name:reward.name, qty:quantity, total:total, at:at }); sj('ecoclick_redemptions', l);
  var n = lj('ecoclick_notifications', []); n.unshift({ id:'n' + Date.now().toString(36), type:'reward', title:'Resgate concluído', text:quantity + '× ' + reward.name + ' resgatado por ' + fmt(total) + ' pontos.', createdAt:at, read:false }); sj('ecoclick_notifications', n);
  try{ window.EcoDB && window.EcoDB.flush && window.EcoDB.flush(); }catch(e){}
  document.dispatchEvent(new CustomEvent('ecoclick:points-changed'));
}
function sync(){ const b = readBal(); if (b !== balance){ balance = b; renderBalance(); } }
window.addEventListener('focus', sync);
document.addEventListener('ecoclick:points-changed', sync);
document.addEventListener('ecoclick:view-change', e => { if (e.detail && e.detail.view === 'recompensas') sync(); });
renderBalance(); renderGrid();

})();
