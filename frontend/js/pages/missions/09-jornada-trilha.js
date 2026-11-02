
/* =========================================================
   EcoClick — Jornada do Reciclador (trilha isométrica)
   Etapas em placas isométricas ligadas por um caminho tracejado,
   num mapa verde-azulado com curvas de nível. Sem emojis.
   Carregado antes do script.js (usa `state`, `BADGE_DEFS` e os
   helpers de missão só quando as funções são chamadas).
   ========================================================= */
/* três níveis (trilhas); concluir um libera o próximo e o último libera o selo */
const JTRAILS = [
  {key:"jornada",  n:1, name:"Lixo eletrônico",   sub:"Entenda e descarte direito"},
  {key:"jornada2", n:2, name:"Pilhas e baterias", sub:"Riscos, cuidados e entrega"},
  {key:"jornada3", n:3, name:"Hábito consciente", sub:"Reduzir, reutilizar e reciclar"},
];
let journeySel = null;     // etapa escolhida pelo usuário (null = a etapa atual)
let journeyLevel = null;   // nível em exibição (null = o nível atual)
const jChain = (key)=> state.missions.filter(m=>m.chain===key).sort((a,b)=>a.order-b.order);
const jLevelDone = (key)=>{ const c=jChain(key); return c.length>0 && c.every(m=>m.status==="done"); };
const jLevelOpen = (n)=> n===1 || jLevelDone(JTRAILS[n-2].key);
function jCurrentLevel(){ const t = JTRAILS.find(t=>!jLevelDone(t.key)); return t ? t.n : JTRAILS.length; }
const jLevel = ()=> journeyLevel || jCurrentLevel();
function jLayout(n){
  const compact = window.matchMedia("(max-width:560px)").matches;     // celular: mais espaço entre as etapas
  const X = [175,420], step = compact ? 230 : 180, nodes = [];
  for(let i=0;i<n;i++) nodes.push([X[i%2], 150+i*step]);
  const fin = [300, nodes[n-1][1] + (compact ? 220 : 195)];
  return { W:600, H:fin[1]+135, nodes, final:fin };
}
try{ window.matchMedia("(max-width:560px)").addEventListener("change", ()=>{ try{ renderJourney(); }catch(e){} }); }catch(e){}

/* ---------- ícones de cada etapa (caixa 24×24) ---------- */
const J_GLYPHS = {
  1:`<path d="M4 5.5C6.5 4.5 9.5 4.8 12 6.5 14.5 4.8 17.5 4.5 20 5.5V18C17.5 17 14.5 17.3 12 19 9.5 17.3 6.5 17 4 18Z"/><path d="M12 6.5V19"/>`,
  2:`<rect x="6.5" y="3" width="11" height="18" rx="2.5"/><path d="M9.5 9l1.2 1.2L13 8M9.5 14l1.2 1.2L13 13M14.5 9.8h1.5M14.5 14.8h1.5"/>`,
  3:`<path d="M12 21s-6.5-5.6-6.5-11.2a6.5 6.5 0 0 1 13 0C18.5 15.4 12 21 12 21z"/><circle cx="12" cy="9.8" r="2.3"/>`,
  4:`<path d="M5 7.5h14M7.2 7.5l1 12.5h7.6l1-12.5M9.8 7.5V4.5h4.4v3"/><path d="M12 11.5v5M9.8 14h4.4"/>`,
  5:`<path d="M12 3.8l2.5 5.2 5.7.8-4.1 4 1 5.7L12 16.8l-5.1 2.7 1-5.7-4.1-4 5.7-.8z"/>`,
};
const J_CHECK = `<path d="M6 12.5l4.2 4.2L18.5 7.5" stroke-width="3.4"/>`;
const J_LOCK  = (c)=>`<rect x="5.5" y="10.5" width="13" height="9.5" rx="2.6" fill="${c}" stroke="none"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" stroke-width="2.2"/>`;

/* cores do ícone por estado (sobre a placa isométrica) */
const J_INK = { done:"#0e6a46", active:"#ffffff", locked:"rgba(255,255,255,.62)" };
function jInner(kind, i){
  if(kind==="done")  return J_CHECK;
  if(kind==="locked") return J_LOCK(J_INK.locked);
  return J_GLYPHS[i+1] || J_GLYPHS[5];
}
function jFlat(kind, i){             // ícone solto (listas)
  const c = kind==="active" ? "#fff" : "currentColor";
  return `<svg viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${kind==="locked" ? J_LOCK(c) : jInner(kind,i)}</svg>`;
}

/* ---------- degradês das placas ---------- */
(function injectJourneyDefs(){
  document.body.insertAdjacentHTML("afterbegin", `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>
    <linearGradient id="jt-done" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f6fffa"/><stop offset="1" stop-color="#a9efcb"/></linearGradient>
    <linearGradient id="jt-active" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#a6fbe7"/><stop offset="1" stop-color="#1fc9a2"/></linearGradient>
    <linearGradient id="jt-locked" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3f8e7b"/><stop offset="1" stop-color="#2d7262"/></linearGradient>
    <linearGradient id="jt-prize" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d9fff0"/><stop offset="1" stop-color="#5fe0b4"/></linearGradient>
    <radialGradient id="jt-glow" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#7dffdc" stop-opacity=".75"/><stop offset="1" stop-color="#7dffdc" stop-opacity="0"/></radialGradient>
  </defs></svg>`);
})();

/* ---------- placa isométrica (SVG 120×100) ---------- */
const ISO = "matrix(.866 .5 -.866 .5 0 0)";
const J_SIDE = { done:"#4fc596", active:"#0f9f80", locked:"#1d5649", prize:"#2eb98c" };
function jTile(kind, i){
  const side = J_SIDE[kind], top = `url(#jt-${kind})`;
  const glyph = kind==="prize" ? "" : `<ellipse cx="60" cy="52" rx="15" ry="6" fill="rgba(0,40,30,.18)"/>
    <g transform="translate(60 40) scale(1.55) translate(-12 -12)" fill="none" stroke="${J_INK[kind]}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${jInner(kind,i)}</g>`;
  let ext = ""; for(let k=9;k>=1;k--) ext += `<g transform="translate(60 ${46+k*1.7})"><g transform="${ISO}"><rect x="-30" y="-30" width="60" height="60" rx="13" fill="${side}"/></g></g>`;
  const glow = kind==="active" ? `<ellipse cx="60" cy="82" rx="56" ry="17" fill="url(#jt-glow)"/>` : "";
  const pulse = kind==="active" ? `<g transform="translate(60 46) ${ISO}"><rect class="jt-pulse" x="-38" y="-38" width="76" height="76" rx="18" fill="none" stroke="#c4fff1" stroke-width="2.6"/></g>` : "";
  const sel = `<g transform="translate(60 46) ${ISO}"><rect class="jt-sel" x="-39" y="-39" width="78" height="78" rx="19" fill="none" stroke="#fff" stroke-width="2.6" stroke-dasharray="6 5"/></g>`;
  return `<svg class="jtile" viewBox="0 0 120 100" aria-hidden="true">${glow}${pulse}${ext}
    <g transform="translate(60 46) ${ISO}"><rect x="-30" y="-30" width="60" height="60" rx="13" fill="${top}" stroke="rgba(255,255,255,.7)" stroke-width="1.2"/></g>${glyph}${sel}</svg>`;
}

/* ---------- fundo do mapa: curvas de nível, folhas e brilhos ---------- */
function jScene(){
  const leaf = (x,y,r,s=1)=>`<path d="M0 0C10-14 28-16 40-8C34 8 14 14 0 0Z" transform="translate(${x} ${y}) rotate(${r}) scale(${s})"/>`;
  const spark = (x,y,s=1)=>`<path d="M0-10Q1.5-1.5 10 0Q1.5 1.5 0 10Q-1.5 1.5-10 0Q-1.5-1.5 0-10Z" transform="translate(${x} ${y}) scale(${s})"/>`;
  return `<g fill="rgba(255,255,255,.035)" stroke="rgba(255,255,255,.1)" stroke-width="2">
      <path d="M-40 250C60 150 190 170 250 250S410 330 330 430S50 450-40 360Z"/>
      <path d="M640 120C540 70 440 120 430 190S520 290 640 270Z"/>
      <path d="M-40 640C60 590 190 610 250 690S210 820 100 840S-40 780-40 700Z"/>
      <path d="M640 560C540 520 450 580 470 660S590 780 640 750Z"/>
      <path d="M-40 980C80 930 220 960 300 1040S380 1180 120 1190L-40 1190Z"/>
    </g>
    <g fill="none" stroke="rgba(255,255,255,.07)" stroke-width="1.6">
      <path d="M-20 270C70 190 180 205 235 270S380 340 318 420"/><path d="M-20 660C60 625 170 640 225 700"/><path d="M620 140C550 105 470 140 462 190"/><path d="M620 580C555 550 480 595 495 655"/>
    </g>
    <g fill="rgba(255,255,255,.14)">${leaf(40,70,-20,.9)}${leaf(520,470,200,.8)}${leaf(80,590,-30,.7)}${leaf(530,880,160,.9)}${leaf(60,1000,-10,.8)}${leaf(500,1150,190,.7)}</g>
    <g fill="rgba(255,255,255,.22)">${spark(520,60,.9)}${spark(75,420,.6)}${spark(545,400,.7)}${spark(50,800,.8)}${spark(550,1000,.7)}${spark(235,940,.6)}${spark(380,1130,.8)}</g>`;
}

/* ---------- caminho tracejado entre as etapas ---------- */
function jRoad(a,b){ const my=(a[1]+b[1])/2; return `M${a[0]} ${a[1]+22}C${a[0]} ${my} ${b[0]} ${my} ${b[0]} ${b[1]+22}`; }
function jPath(chain, L){
  const pts = [...L.nodes, L.final];
  let out = "";
  for(let i=0;i<pts.length-1;i++){
    const d = jRoad(pts[i], pts[i+1]), isDone = chain[i] && chain[i].status==="done";
    out += isDone
      ? `<path d="${d}" stroke="#9bf7d2" stroke-width="5" stroke-linecap="round" opacity=".95"/>`
      : `<path d="${d}" stroke="#fff" stroke-opacity=".55" stroke-width="4" stroke-linecap="round" stroke-dasharray="1 13"/>`;
  }
  return `<g fill="none">${out}</g>`;
}

/* ---------- estado de cada etapa ---------- */
function jState(m){ return m.status==="done" ? "done" : (m.status==="active" ? "active" : "locked"); }
/* ---------- estado e requisitos da Jornada (sempre a partir dos dados reais das missões) ---------- */
const journeyDone = ()=> JTRAILS.every(t=>jLevelDone(t.key));
const journeyBadgeOn = ()=> journeyDone() && state.badges.some(b=>b.id==="s2" && b.unlocked);   // o selo só vale com a jornada realmente concluída
function jLabel(m){ return m.status==="done" ? "Concluída" : (m.status==="active" ? (m.progress>0 ? "Em andamento" : "Disponível") : "Bloqueada"); }
function jShortLock(m, lvl){ return m.order>1 ? `Bloqueada · falta a etapa ${m.order-1}` : `Bloqueada · falta o Nível ${lvl-1}`; }
function jLockReason(m, lvl){
  if(lvl>1 && !jLevelOpen(lvl)){
    const pc = jChain(JTRAILS[lvl-2].key), d = pc.filter(x=>x.status==="done").length;
    return `Falta concluir o Nível ${lvl-1} (${d} de ${pc.length} etapas feitas). Depois, conclua as etapas deste nível em ordem.`;
  }
  const prev = jChain(m.chain).find(x=>x.order===m.order-1);
  if(!prev) return "Falta concluir a etapa anterior.";
  const how = prev.status==="active" ? `em andamento, ${prev.progress} de ${prev.goal}` : "ainda bloqueada";
  return `Falta concluir a etapa ${prev.order}: “${prev.title}” (${how}).`;
}
function jCompleteBanner(){
  const on = journeyBadgeOn();
  return `<div class="j-complete" role="status"><b>Jornada do Reciclador concluída</b><span>${on ? "Você completou os 3 níveis e conquistou o selo Primeiro Ciclo." : "Você completou os 3 níveis. O selo Primeiro Ciclo está sendo liberado."}</span></div>`;
}
/* Garante a ordem: uma etapa só fica disponível ou concluída se a anterior (e o nível anterior) estiver concluída.
   Corrige estados salvos fora de ordem sem apagar histórico: as recompensas já pagas continuam em rewardLog. */
function validateJourney(){
  let changed = false, open = true;
  JTRAILS.forEach(t=>{
    const chain = jChain(t.key);
    let ok = open;
    chain.forEach(m=>{
      if(!ok){
        if(m.status!=="locked"){ m.status = "locked"; m.progress = 0; delete m.cats; changed = true; }
        return;
      }
      if(m.status==="done") return;
      if(m.status==="locked"){ activateMission(m); changed = true; if(m.status==="done") return; }
      ok = false;
    });
    open = chain.length>0 && chain.every(m=>m.status==="done");
  });
  return changed;
}
function jSelected(chain){
  if(journeySel==="final") return "final";
  if(journeySel && chain.some(m=>m.id===journeySel)) return journeySel;
  const cur = chain.find(m=>m.status==="active");
  return cur ? cur.id : (chain.every(m=>m.status==="done") ? "final" : chain[0].id);
}
function jCta(m){ return m.progress>0 ? "CONTINUAR" : "COMEÇAR"; }
const J_CHECK_ICON = `<svg class="jb-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>`;

/* ---------- emblema do próximo nível (porta de passagem) ---------- */
/* Texto dentro do SVG encolhe junto com o desenho; por isso cada tamanho tem sua versão:
   detail = "NÍVEL n" (≥ 12 px reais), map = só o número grande, mini = seta sem texto */
function jGateArt(nextN, variant){
  let inner;
  if(variant==="mini"){
    inner = `<path d="M-13 9 0 -5 13 9M-13 -4 0 -18 13 -4" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`;
  }else if(variant==="map"){
    inner = `<text y="16" text-anchor="middle" font-family="'Plus Jakarta Sans',sans-serif" font-weight="800" font-size="46" fill="#fff">${nextN}</text>`;
  }else{
    inner = `<text y="-13" text-anchor="middle" font-family="'Plus Jakarta Sans',sans-serif" font-weight="800" font-size="11.5" letter-spacing="1.4" fill="#c4f7e3">NÍVEL</text>
    <text y="21" text-anchor="middle" font-family="'Plus Jakarta Sans',sans-serif" font-weight="800" font-size="30" fill="#fff">${nextN}</text>`;
  }
  return badgeArt({id: nextN===2 ? "s2" : "s3", tier:"iniciante", name:`Nível ${nextN}`}, {inner, stars: nextN-1});
}

/* ---------- painel de detalhes ---------- */
function jDetail(chain, sel, lvl){
  const total = chain.length, done = chain.filter(m=>m.status==="done").length, pct = Math.round(done/total*100);
  const trail = JTRAILS[lvl-1], isLast = lvl===JTRAILS.length, levelDone = jLevelDone(trail.key);
  if(sel==="final"){
    if(!isLast){
      const nxt = JTRAILS[lvl];
      return `<div class="jd-card final ${levelDone?"on":""}">
        <div class="jd-top"><span class="jd-step">Próximo nível</span><span class="jd-state ${levelDone?"done":"locked"}">${levelDone?"Liberado":"Bloqueado"}</span></div>
        <div class="jd-emblem">${jGateArt(nxt.n)}</div>
        <h3>Nível ${nxt.n} · ${nxt.name}</h3>
        <p>${levelDone ? "Você concluiu este nível e liberou o próximo. Continue sua jornada!" : `Conclua as ${total} etapas deste nível para liberar o Nível ${nxt.n}.`}</p>
        <div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div>
        <div class="mission-bottom"><span class="prog-text">${done} de ${total} etapas concluídas</span>${levelDone ? `<button class="btn btn-primary" data-jlevel="${nxt.n}">Ir para o Nível ${nxt.n}</button>` : ""}</div>
      </div>`;
    }
    const def = BADGE_DEFS.find(d=>d.id==="s2");
    const got = journeyBadgeOn();
    return `<div class="jd-card final ${got?"on":""}">
      <div class="jd-top"><span class="jd-step">Prêmio final</span><span class="jd-state ${got?"done":"locked"}">${got?"Conquistado":"Bloqueado"}</span></div>
      <div class="jd-emblem">${badgeArt(def)}</div>
      <h3>Selo ${def.name}</h3>
      <p>${got ? "Você concluiu os 3 níveis da Jornada e conquistou este selo. Parabéns!" : "Conclua os 3 níveis da Jornada do Reciclador para conquistar este selo."}</p>
      <div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div>
      <div class="mission-bottom"><span class="prog-text">${done} de ${total} etapas deste nível</span></div>
    </div>`;
  }
  const m = chain.find(x=>x.id===sel), i = chain.indexOf(m), st = jState(m);
  const stLabel = jLabel(m);
  const lockMsg = st==="locked" ? `<p class="jd-lock">${jLockReason(m, lvl)}</p>` : "";
  return `<div class="jd-card ${st}" data-mission-card="${m.id}">
    <div class="jd-top"><span class="jd-step">Nível ${lvl} · Etapa ${m.order} de ${total}</span><span class="jd-state ${st} ${st==="active" && !(m.progress>0) ? "avail" : ""}">${stLabel}</span></div>
    <div class="jd-tile">${jTile(st, i)}</div>
    <h3>${m.title}</h3>
    <p>${m.desc}</p>${lockMsg}
    <div class="pts-stack row"><span class="pts-pill">+${m.xp} XP</span><span class="pts-pill eco">+${m.pts} pts</span></div>
    <div class="bar-track"><div class="bar-fill" style="width:${st==="locked"?0:missionProgressPct(m)}%"></div></div>
    <div class="mission-bottom"><span class="prog-text">${missionProgLabel(m)}</span>${missionActionHtml(m)}</div>
  </div>`;
}

/* ---------- lista de todas as etapas do nível ---------- */
function jSteps(chain, sel, lvl){
  const isLast = lvl===JTRAILS.length;
  const rows = chain.map((m,i)=>`<button class="jd-row ${jState(m)} ${sel===m.id?"sel":""}" data-jnode="${m.id}"><span class="jd-dot">${jFlat(jState(m),i)}</span><span class="jd-rt"><small>Etapa ${m.order} · ${jLabel(m)}</small><b>${m.title}</b></span></button>`).join("");
  const prize = `<button class="jd-row prize ${sel==="final"?"sel":""}" data-jnode="final"><span class="jd-dot">${jFlat("active",4)}</span><span class="jd-rt"><small>${isLast?"Prêmio final":"Próximo nível"}</small><b>${isLast?"Selo Primeiro Ciclo":`Nível ${lvl+1} · ${JTRAILS[lvl].name}`}</b></span></button>`;
  return `<div class="jd-steps">${rows}${prize}</div>`;
}

/* ---------- seletor de níveis ---------- */
function jLevelTabs(lvl){
  return `<div class="jlevels" role="tablist" aria-label="Níveis da Jornada">${JTRAILS.map(t=>{
    const c = jChain(t.key), d = c.filter(m=>m.status==="done").length, done = jLevelDone(t.key), open = jLevelOpen(t.n);
    const icon = done ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>`
               : (open ? `<b>${t.n}</b>` : `<svg viewBox="0 0 24 24" fill="currentColor"><rect x="5.5" y="10.5" width="13" height="9.5" rx="2.6"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>`);
    return `<button class="jlevel ${t.n===lvl?"on":""} ${done?"done":(open?"open":"locked")}" role="tab" aria-selected="${t.n===lvl}" data-jlevel="${t.n}">
      <span class="jl-ico">${icon}</span><span class="jl-txt"><small>Nível ${t.n}</small><b>${t.name}</b></span><span class="jl-prog">${d}/${c.length}</span></button>`;
  }).join("")}</div>`;
}

/* ---------- tela completa da Jornada ---------- */
function renderJourney(){
  const host = document.getElementById("journeyTrail");
  const lvl = jLevel(), trail = JTRAILS[lvl-1], chain = jChain(trail.key);
  if(!chain.length){ host.innerHTML = `<p class="empty-note">A trilha ainda não está disponível.</p>`; return; }
  const L = jLayout(chain.length), isLast = lvl===JTRAILS.length, open = jLevelOpen(lvl);
  const sel = jSelected(chain), total = chain.length;
  const done = chain.filter(m=>m.status==="done").length, pct = Math.round(done/total*100);
  const cur = chain.find(m=>m.status==="active"), allDone = done===total;
  const pos = (p)=>`--x:${(p[0]/L.W*100).toFixed(2)};--y:${(p[1]/L.H*100).toFixed(2)};z-index:${Math.round(p[1]/10)}`;

  const nodes = chain.map((m,i)=>{
    const st = jState(m), p = L.nodes[i], side = p[0] < L.W/2 ? "r" : "l";
    const tag = st==="active" ? `<span class="jn-tag">${jCta(m)}</span>` : "";
    const meta = st==="done" ? "Concluída" : (st==="active" ? (m.progress>0 ? `Em andamento · ${missionProgLabel(m)}` : "Disponível") : jShortLock(m, lvl));
    return `<button class="jnode ${st} ${sel===m.id?"sel":""}" style="${pos(p)}" data-jnode="${m.id}" aria-label="Etapa ${m.order}: ${m.title}">${tag}${jTile(st,i)}</button>
      <div class="jlabel ${side} ${st}" style="${pos(p)}"><small>Etapa ${m.order}</small><b>${m.title}</b><span>${meta}</span></div>`;
  }).join("");

  const finalOn = isLast ? journeyBadgeOn() : allDone;
  const emblem = isLast ? badgeArt(BADGE_DEFS.find(d=>d.id==="s2")) : jGateArt(lvl+1, "map");
  const finalLabel = isLast ? "Prêmio final: selo Primeiro Ciclo" : `Próximo nível: Nível ${lvl+1}`;
  const finalNode = `<button class="jfinal ${finalOn?"on":""} ${sel==="final"?"sel":""}" style="${pos(L.final)}" data-jnode="final" aria-label="${finalLabel}">
      <span class="jf-glow"></span><span class="jf-emblem">${emblem}</span>${jTile("prize",0)}</button>`;

  const headTitle = !open ? "Nível bloqueado" : (allDone ? `${J_CHECK_ICON}${isLast && journeyDone() ? "Jornada concluída" : "Nível concluído"}` : `Nível ${lvl} · Etapa ${cur ? cur.order : "—"} de ${total}`);
  host.innerHTML = `${jLevelTabs(lvl)}${journeyDone() ? jCompleteBanner() : ""}<div class="jboard">
    <div class="jmap-card">
      <div class="jb-head">
        <div><span class="kicker">${trail.sub}</span><b>${headTitle}</b></div>
        <div class="jb-prog"><div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div><span>${done}/${total}</span></div>
      </div>
      <div class="trail-map ${open?"":"closed"}" id="trailMap" style="aspect-ratio:${L.W}/${L.H}">
        <svg class="trail-scene" viewBox="0 0 ${L.W} ${L.H}" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${jScene()}${jPath(chain, L)}</svg>
        ${nodes}${finalNode}
      </div>
    </div>
    <aside class="jdetail" id="jDetail">${jDetail(chain, sel, lvl)}${jSteps(chain, sel, lvl)}</aside>
  </div>`;
}

/* ---------- prévia na tela de Início ---------- */
function renderHomeJourney(){
  const box = document.getElementById("homeJourney");
  const lvl = jCurrentLevel(), trail = JTRAILS[lvl-1], chain = jChain(trail.key);
  if(!chain.length){ box.innerHTML = `<p class="empty-note">A trilha ainda não está disponível.</p>`; return; }
  const isLast = lvl===JTRAILS.length, total = chain.length, done = chain.filter(m=>m.status==="done").length, pct = Math.round(done/total*100);
  const current = chain.find(m=>m.status==="active"), allDone = done===total;
  const n = chain.length, xs = chain.map((_,i)=> n>1 ? 10 + i*(56/(n-1)) : 40), ys = chain.map((_,i)=> i%2 ? 38 : 62), fx = 90, fy = 60;
  const pts = [...xs.map((x,i)=>[x*10, ys[i]*1.76+10]), [fx*10, fy*1.76+10]];   // viewBox 1000 × 176
  let road = "";
  for(let i=0;i<pts.length-1;i++){
    const a=pts[i], b=pts[i+1], mx=(a[0]+b[0])/2, d=`M${a[0]} ${a[1]}C${mx} ${a[1]} ${mx} ${b[1]} ${b[0]} ${b[1]}`;
    const isDone = chain[i] && chain[i].status==="done";
    road += isDone ? `<path d="${d}" stroke="#9bf7d2" stroke-width="5" vector-effect="non-scaling-stroke"/>` : `<path d="${d}" stroke="#fff" stroke-opacity=".55" stroke-width="4" stroke-dasharray="1 12" vector-effect="non-scaling-stroke"/>`;
  }
  const nodes = chain.map((m,i)=>{
    const st = jState(m), tag = st==="active" ? `<span class="jn-tag" aria-hidden="true">${jCta(m)}</span>` : "";
    return `<button class="jnode mini ${st}" style="--x:${xs[i].toFixed(1)};--y:${ys[i]}" data-jgoto="${m.id}" aria-label="Etapa ${m.order}: ${m.title}">${tag}${jTile(st,i)}</button>`;
  }).join("");
  const on = isLast ? journeyBadgeOn() : allDone;
  const emblem = isLast ? badgeArt(BADGE_DEFS.find(d=>d.id==="s2")) : jGateArt(lvl+1, "mini");
  const fin = `<button class="jfinal mini ${on?"on":""}" style="--x:${fx};--y:${fy}" data-jgoto="final" aria-label="${isLast?"Prêmio final":"Próximo nível"}"><span class="jf-glow"></span><span class="jf-emblem">${emblem}</span>${jTile("prize",0)}</button>`;
  const now = current
    ? `<small>Nível ${lvl} de ${JTRAILS.length} · Próxima etapa</small><h3>${current.title}</h3><p>${current.desc}</p>`
    : (allDone && isLast ? `<small>Jornada completa</small><h3>Você concluiu os 3 níveis</h3><p>O selo Primeiro Ciclo é seu. Continue ganhando XP com as missões.</p>`
                         : `<small>Nível ${lvl} de ${JTRAILS.length}</small><h3>Nível concluído</h3><p>Abra a Jornada para seguir para o próximo nível.</p>`);
  box.innerHTML = `<div class="mini-trail"><svg viewBox="0 0 1000 176" preserveAspectRatio="none" aria-hidden="true"><g fill="none" stroke-linecap="round">${road}</g></svg>${nodes}${fin}</div>
    <div class="jr-now">${now}<div class="jr-foot"><div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div><span>${done} de ${total} etapas · Nível ${lvl}</span></div></div>`;
}

