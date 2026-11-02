
/* =========================================================
   EcoClick — arte dos ícones e emblemas (SVG)
   Estilo: medalhão com anel dourado, folhas de louro, fita verde
   e selo de estrelas; ícones brilhantes em degradê.
   Carregado antes do script.js.
   ========================================================= */
const TURTLY_SRC = "../assets/images/missions-44b07af46d.png";

/* ---------- degradês compartilhados (ficam no documento, referenciados por url(#id)) ---------- */
const BADGE_BG = {
  s1:["#8bd99a","#2f9a5a"], s2:["#2f9a74","#0f4a39"], s3:["#4d8fd6","#173f78"], s4:["#2f9a7c","#0f4a3b"],
  s5:["#3a77b8","#0d2b55"], s6:["#ffb09c","#e8695a"], s7:["#34b39d","#0e6556"], s8:["#58bb74","#1b6b3f"],
  s9:["#34a08c","#0e5547"], s10:["#3c9d72","#124a36"],
};
(function injectDefs(){
  const bg = Object.entries(BADGE_BG).map(([id,[a,b]])=>
    `<radialGradient id="bg-${id}" cx="35%" cy="28%" r="85%"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></radialGradient>`).join("");
  document.body.insertAdjacentHTML("afterbegin", `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>
    <linearGradient id="g-gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff2a8"/><stop offset=".5" stop-color="#f6c640"/><stop offset="1" stop-color="#d28f16"/></linearGradient>
    <linearGradient id="g-ring" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffe98f"/><stop offset=".5" stop-color="#eaaa22"/><stop offset="1" stop-color="#b57a0c"/></linearGradient>
    <linearGradient id="g-ring2" x1="1" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#fff0a0"/><stop offset="1" stop-color="#e6a91f"/></linearGradient>
    <linearGradient id="g-rib" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#46b886"/><stop offset=".55" stop-color="#1f8a63"/><stop offset="1" stop-color="#136247"/></linearGradient>
    <linearGradient id="g-leaf" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7ad879"/><stop offset="1" stop-color="#2a8f47"/></linearGradient>
    <linearGradient id="g-flame" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ff7a1a"/><stop offset=".6" stop-color="#ffb31f"/><stop offset="1" stop-color="#ffe066"/></linearGradient>
    <linearGradient id="g-flame2" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ffc21f"/><stop offset="1" stop-color="#fff6b8"/></linearGradient>
    <radialGradient id="g-coin" cx="35%" cy="30%" r="80%"><stop offset="0" stop-color="#fff7bd"/><stop offset=".55" stop-color="#f9c93a"/><stop offset="1" stop-color="#d6921a"/></radialGradient>
    <radialGradient id="g-globe" cx="35%" cy="28%" r="85%"><stop offset="0" stop-color="#8fd8ff"/><stop offset=".6" stop-color="#2f86e0"/><stop offset="1" stop-color="#1b55b8"/></radialGradient>
    <linearGradient id="g-fist" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8be08a"/><stop offset="1" stop-color="#2f9a4d"/></linearGradient>
    <linearGradient id="g-screen" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9fe0ff"/><stop offset="1" stop-color="#3a86e0"/></linearGradient>
    <linearGradient id="g-green2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#86e290"/><stop offset="1" stop-color="#2f9a4d"/></linearGradient>
    <radialGradient id="bg-head" cx="40%" cy="30%" r="80%"><stop offset="0" stop-color="#f6ffee"/><stop offset="1" stop-color="#bfe5c6"/></radialGradient>
    <clipPath id="cp-head" clipPathUnits="userSpaceOnUse"><circle cx="0" cy="0" r="28"/></clipPath>
    ${bg}
  </defs></svg>`);
})();

/* ---------- ícones de interface (traço único, caixa 24×24) ---------- */
const UI_ICONS = {
  phone:`<rect x="7" y="2.500" width="10" height="19" rx="2.500"/><path d="M11 18.500h2"/>`,
  battery:`<rect x="8" y="5" width="8" height="16" rx="2"/><path d="M10.500 3h3M12.800 9l-2 4h3l-1.600 4"/>`,
  plug:`<path d="M9 2v5M15 2v5M6 7h12v4a6 6 0 0 1-12 0zM12 17v5"/>`,
  cable:`<path d="M9 2v5M15 2v5M6 7h12v4a6 6 0 0 1-12 0zM12 17v5"/>`,
  radio:`<rect x="3" y="8" width="18" height="12" rx="2.500"/><circle cx="9" cy="14" r="3"/><path d="M15 12h3M15 15h3M8 8l8-5"/>`,
  blender:`<path d="M7 3h10l-1.500 11h-7zM6 3h12"/><path d="M6 14h12v5a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2z"/>`,
  recycle:`<path d="M21 12a9 9 0 0 1-15.500 6.200L3 16M3 12a9 9 0 0 1 15.500-6.200L21 8M21 3v5h-5M3 21v-5h5"/>`,
  coins:`<ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v6c0 1.700 3.600 3 8 3s8-1.300 8-3V6M4 12v6c0 1.700 3.600 3 8 3s8-1.300 8-3v-6"/>`,
  target:`<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.200"/>`,
  flame:`<path d="M12 3c1 3.500 5.500 5.500 5.500 10.500a5.500 5.500 0 0 1-11 0c0-2.200 1-3.700 2.200-4.800.2 1.600 1 2.300 2 2.300-.4-3 .3-5.300 1.300-8z"/>`,
  globe:`<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>`,
  list:`<rect x="6" y="4" width="12" height="17" rx="2"/><path d="M9 4V3h6v1M9 10h6M9 14h6M9 18h3"/>`,
  trash:`<path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/>`,
  medal:`<circle cx="12" cy="9" r="6"/><path d="M8.500 14 7 22l5-3 5 3-1.500-8"/>`,
  trophy:`<path d="M8 4h8v6a4 4 0 0 1-8 0zM8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 14v4M8 21h8M9.500 18h5"/>`,
  bell:`<path d="M6 16v-5a6 6 0 0 1 12 0v5l2 2H4zM10 21a2 2 0 0 0 4 0"/>`,
  map:`<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2zM9 4v14M15 6v14"/>`,
  sun:`<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.900 4.900l1.400 1.400M17.700 17.700l1.400 1.400M2 12h2M20 12h2M4.900 19.100l1.400-1.400M17.700 6.300l1.400-1.400"/>`,
  moon:`<path d="M20 14.500A8.500 8.500 0 1 1 9.500 4a7 7 0 0 0 10.500 10.500z"/>`,
  user:`<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.400 3.600-8 8-8s8 3.600 8 8"/>`,
};
function uiIcon(name){
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.800" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${UI_ICONS[name] || UI_ICONS.recycle}</svg>`;
}
const statIcon = uiIcon;
const itemIcon = uiIcon;

const HEAD_ART = `<g clip-path="url(#cp-head)"><circle r="29" fill="url(#bg-head)"/>
  <svg x="-25" y="-26" width="50" height="50" viewBox="100 -8 270 240"><image href="${TURTLY_SRC}" width="460" height="727"/></svg></g>`;
/* ---------- ícones centrais dos emblemas: traço único, sem cores de desenho animado (coordenadas -24 a 24) ---------- */
const ACC = "rgba(155,247,210,.28)";   // preenchimento de destaque, o mesmo em todos os selos
const BADGE_ICONS = {
  /* Eco Iniciante: broto */
  s1:`<path d="M0 22V-1"/><path d="M0 9C-12 9-19 2-19-9c11 0 19 5 19 18Z" fill="${ACC}"/><path d="M0 0C0-12 8-20 20-20c0 12-8 20-20 20Z" fill="${ACC}"/>`,
  /* Primeiro Ciclo: setas de reciclagem */
  s2:`<g transform="scale(1.8) translate(-12 -12)" stroke-width="1.7">${UI_ICONS.recycle}</g>`,
  /* Curioso Verde: livro aberto */
  s3:`<path d="M0-13C-6-18-15-19-22-16V15C-15 12-6 13 0 18 6 13 15 12 22 15V-16C15-19 6-18 0-13Z" fill="${ACC}"/><path d="M0-13V18"/>`,
  /* Reciclador Fiel: chama (sequência) */
  s4:`<g transform="scale(1.9) translate(-12 -11.5)" stroke-width="1.6">${UI_ICONS.flame}</g>`,
  /* Guardião Eletrônico: chip */
  s5:`<rect x="-12" y="-12" width="24" height="24" rx="5" fill="${ACC}"/><rect x="-5.500" y="-5.500" width="11" height="11" rx="2"/><path d="M-6-12v-8M6-12v-8M-6 12v8M6 12v8M-12-6h-8M-12 6h-8M12-6h8M12 6h8"/>`,
  /* Convidador: pessoa com "+" */
  s6:`<circle cx="-5" cy="-9" r="7" fill="${ACC}"/><path d="M-19 19c0-8 6-13 14-13s14 5 14 13"/><path d="M15-14v12M9-8h12"/>`,
  /* Dez em Ação: alvo com flecha */
  s7:`<circle r="19" /><circle r="11" fill="${ACC}"/><circle r="2.800" fill="#fff" stroke="none"/><path d="M3-3 20-20M13-20h7v7"/>`,
  /* Sequência de Ferro: raio */
  s8:`<path d="M6-23-12 3H-1L-6 23 13-5H1Z" fill="${ACC}"/>`,
  /* No Pódio: pódio com estrela */
  s9:`<path d="M-23 22V6h14v16M-9 22V-5h18v27M9 22V11h14v11M-25 22h50"/><path d="${starPath(0,-16,8.500)}" fill="#fff" stroke="none"/>`,
  /* Lenda do EcoClick: estrela */
  s10:`<path d="${starPath(0,1,23)}" fill="${ACC}"/>`,
};

/* ---------- emblema completo ---------- */
function leafPath(){ return "M0 0C4-5 13-6 19 0C13 6 4 5 0 0Z"; }
function laurelSide(){
  let out = "";
  for(let i=0;i<7;i++){
    const a = (104 + i*22) * Math.PI/180;       // do pé da coroa até o alto
    const x = 60 + 42*Math.cos(a), y = 62 + 42*Math.sin(a);
    const rot = (a*180/Math.PI) + 90 - 28;       // acompanha o círculo, abrindo para fora
    out += `<path d="${leafPath()}" transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot.toFixed(1)}) scale(${(1.25 - i*.03).toFixed(2)})" fill="url(#g-leaf)" stroke="#14603a" stroke-width="1" stroke-linejoin="round"/>`;
  }
  return out;
}
function starPath(cx, cy, r){
  let p = "";
  for(let i=0;i<10;i++){
    const rad = i%2===0 ? r : r*.45, ang = -Math.PI/2 + i*Math.PI/5;
    p += (i?"L":"M") + (cx + rad*Math.cos(ang)).toFixed(2) + " " + (cy + rad*Math.sin(ang)).toFixed(2);
  }
  return p + "Z";
}
/* Emblema hexagonal: aro na cor do nível (bronze, prata, ouro), face verde, ícone de traço e plaquinha com as estrelas do nível */
const TIER_STYLE = {
  iniciante:     { hi:"#dba46b", lo:"#9a622c" },
  intermediario: { hi:"#d8dfe7", lo:"#8794a3" },
  avancado:      { hi:"#f4d062", lo:"#b0800f" },
};
let badgeUid = 0;   // id único por desenho: degradês com o mesmo id quebram quando o primeiro está numa tela escondida
function badgeArt(def, opts){
  opts = opts || {};
  const uid = ++badgeUid;
  const tier = TIER_STYLE[def.tier] ? def.tier : "iniciante", T = TIER_STYLE[tier];
  const stars = opts.stars || {iniciante:1, intermediario:2, avancado:3}[tier] || 1;
  const crown = def.id==="s9" || def.id==="s10";
  const hex = (r)=> [-90,-30,30,90,150,210].map(a=>`${(60 + r*Math.cos(a*Math.PI/180)).toFixed(1)},${(62 + r*Math.sin(a*Math.PI/180)).toFixed(1)}`).join(" ");
  const starX = Array.from({length:stars}, (_,i)=> 60 + (i-(stars-1)/2)*13);
  const icon = opts.inner !== undefined ? opts.inner
    : `<g fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">${BADGE_ICONS[def.id] || ""}</g>`;
  return `<svg class="badge-svg" viewBox="0 0 120 144" role="img" aria-label="${def.name}">
    <defs>
      <linearGradient id="bdc-${uid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4d062"/><stop offset="1" stop-color="#b0800f"/></linearGradient>
      <linearGradient id="bdr-${uid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${T.hi}"/><stop offset="1" stop-color="${T.lo}"/></linearGradient>
      <linearGradient id="bdf-${uid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2d6f58"/><stop offset="1" stop-color="#143a2e"/></linearGradient>
    </defs>
    <polygon points="${hex(50)}" fill="url(#bdr-${uid})" stroke="url(#bdr-${uid})" stroke-width="8" stroke-linejoin="round"/>
    <polygon points="${hex(41)}" fill="url(#bdf-${uid})" stroke="${T.lo}" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="${hex(35.5)}" fill="none" stroke="#fff" stroke-opacity=".16" stroke-width="1.200" stroke-linejoin="round"/>
    <g transform="translate(60 62)">${icon}</g>
    ${crown ? `<path d="M45 14 41 3l10 6 9-9 9 9 10-6-4 11z" fill="url(#bdc-${uid})" stroke="#b0800f" stroke-width="1.400" stroke-linejoin="round"/>` : ""}
    <rect x="30" y="114" width="60" height="21" rx="10.500" fill="${T.lo}" stroke="#fff" stroke-opacity=".4" stroke-width="1"/>
    ${starX.map(x=>`<path d="${starPath(x,124.500,4.800)}" fill="#fff6d6"/>`).join("")}
  </svg>`;
}

/* ---------- ícones inseridos por atributo (data-ico) ---------- */
function fillIcons(root){ (root||document).querySelectorAll("[data-ico]").forEach(el=>{ el.innerHTML = uiIcon(el.dataset.ico); }); }
fillIcons();

