
/* =========================================================
   EcoClick — Histórico de reciclagem
   Linha do tempo por mês, ícone e cor por material, resumo no topo
   e filtros por categoria. Também gera a prévia da tela de Início.
   Carregado antes do script.js (usa `state` só quando é chamado).
   ========================================================= */
const H_MONTHS = ["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"];
const H_TONES  = { "Eletrônico":"blue", "Bateria":"aqua", "Eletrodoméstico":"indigo" };   // as demais categorias usam "green"
let histFilter = "all";

const hTone = (cat)=> H_TONES[cat] || "green";
function hIcon(h){
  const n = h.item.toLowerCase();
  if(/celular|smartphone|telefone/.test(n)) return "phone";
  if(/pilha|bateria/.test(n)) return "battery";
  if(/liquidificador|batedeira|ventilador|torradeira|ferro/.test(n)) return "blender";
  if(/cabo|carregador/.test(n)) return "cable";
  if(/r[áa]dio|caixa de som|som\b/.test(n)) return "radio";
  return ({ "Bateria":"battery", "Eletrodoméstico":"blender" })[h.cat] || "recycle";
}
function hParse(h){
  const [d,m,y] = h.date.split("/").map(Number);
  return { d, m, y, key:y*100+m, sortKey:y*10000+m*100+d, kgNum: h.kgEst || 0 };
}
const hF = (v)=> v.toLocaleString("pt-BR",{minimumFractionDigits:1, maximumFractionDigits:2});
const hEsc = (t)=> String(t).replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const H_STATUS = { identificado:"Identificado", separado:"Separado para descarte", entregue:"Entregue c/ comprovante" };
/* o peso é sempre uma estimativa por faixa de tamanho; sem informação, o item fica sem peso */
function hWeight(h){
  if(h.kgEst==null) return "peso não estimado";
  if(h.kgMin!=null && h.kgMax!=null && h.kgMin!==h.kgMax) return `≈\u00a0${hF(h.kgMin)}–${hF(h.kgMax)}\u00a0kg`;
  return `≈\u00a0${hF(h.kgEst)}\u00a0kg`;
}
const hDay = (h)=> `${h.d} de ${H_MONTHS[h.m-1]}`;

function hAll(){ return state.history.map(h=>({...h, ...hParse(h)})).sort((a,b)=>b.sortKey-a.sortKey); }

/* ---------- tela completa (lista simples agrupada por mês) ---------- */
function renderHistory(){
  const all = hAll();
  const stats = document.getElementById("histStats"), filters = document.getElementById("histFilters"), tl = document.getElementById("histTimeline");

  if(!all.length){
    stats.innerHTML = ""; stats.style.display = "none"; filters.innerHTML = ""; const n0=document.getElementById("histNote"); if(n0) n0.textContent = "";
    tl.innerHTML = `<div class="hist-empty"><img src="${TURTLY_SRC}" alt=""><h3>Você ainda não registrou nenhum item</h3><p>Registre um eletrônico e acompanhe aqui o status e o peso estimado de cada item.</p><button type="button" class="btn btn-primary" data-register-first>Registrar um item</button></div>`;
    return;
  }

  /* resumo: tudo é estimativa; só entrega com comprovante conta como reciclado */
  const im = impactSummary();
  stats.style.display = "";
  stats.innerHTML = `<div><b>${im.items}</b><span>${im.items===1?"item registrado":"itens registrados"}</span></div><div><b>≈ ${hF(im.estKg)} kg</b><span>peso estimado</span></div><div><b>${im.delivered}</b><span>entregues com comprovante</span></div>`;
  const note = document.getElementById("histNote");
  if(note) note.textContent = "Os pesos são estimativas por faixa de tamanho, não medições. Só itens entregues em um ponto de coleta, com comprovante informado, contam como reciclados."
    + (im.noWeight ? ` ${im.noWeight} ${im.noWeight===1?"item está":"itens estão"} sem peso estimado.` : "");

  /* filtros por categoria (uma única linha) */
  const cats = [...new Set(all.map(h=>h.cat))];
  if(histFilter!=="all" && !cats.includes(histFilter)) histFilter = "all";
  filters.innerHTML = [["all","Todos"], ...cats.map(c=>[c,c])].map(([v,l])=>
    `<button class="hf-pill ${histFilter===v?"on":""}" data-hfilter="${v}" aria-pressed="${histFilter===v}">${l}</button>`).join("");

  /* lista agrupada por mês */
  const list = all.filter(h=>histFilter==="all" || h.cat===histFilter);
  const groups = [];
  list.forEach(h=>{ let g = groups.find(x=>x.key===h.key); if(!g){ g = {key:h.key, m:h.m, y:h.y, items:[]}; groups.push(g); } g.items.push(h); });
  tl.innerHTML = groups.map(g=>{
    const pts = g.items.reduce((s,h)=>s+(h.qty||1),0), name = H_MONTHS[g.m-1][0].toUpperCase()+H_MONTHS[g.m-1].slice(1);
    return `<div class="hl-group"><div class="hl-head"><h3>${name} de ${g.y}</h3><span>${pts} ${pts===1?"item":"itens"} no mês</span></div>
      <div class="hl-card">${g.items.map(h=>`<div class="hl-row tone-${hTone(h.cat)}">
        <span class="hl-ico">${itemIcon(hIcon(h))}</span>
        <div class="hl-txt"><b>${hEsc(h.item)}${h.qty>1 ? ` <em class="hl-qty">×${h.qty}</em>` : ""}</b><span>${hDay(h)} · ${h.qty>1 ? h.qty+" unidades · " : ""}${hWeight(h)}</span>
          <div class="hl-stline"><i class="hl-status st-${h.status}">${H_STATUS[h.status]||H_STATUS.identificado}</i>${h.status!=="entregue" ? `<button type="button" class="hl-adv" data-hadv="${h.id}">Atualizar status</button>` : ""}</div></div>
        <button type="button" class="hl-del" data-hdel="${h.id}" aria-label="Apagar registro: ${hEsc(h.item)}" title="Apagar registro">${uiIcon("trash")}</button></div>`).join("")}</div></div>`;
  }).join("");
}

/* ---------- prévia na tela de Início (3 mais recentes) ---------- */
function renderHomeHistory(){
  const last = hAll().slice(0,3);
  document.getElementById("homeHistory").innerHTML = last.length
    ? `<div class="hs-cards">${last.map(h=>`<div class="hs-card tone-${hTone(h.cat)}">
        <div class="hs-ico">${itemIcon(hIcon(h))}</div>
        <div class="hs-txt"><b>${hEsc(h.item)}${h.qty>1 ? ` <em class="hl-qty">×${h.qty}</em>` : ""}</b><span>${hDay(h)} · ${hWeight(h)}</span></div></div>`).join("")}</div>`
    : `<div class="hist-empty home"><h3>Você ainda não registrou nenhum item</h3><p>Seus registros aparecem aqui, com status e peso estimado.</p><button type="button" class="btn btn-primary" data-register-first>Registrar um item</button></div>`;
}

