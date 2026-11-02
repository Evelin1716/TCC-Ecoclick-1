
/* ---------------- Armazenamento ---------------- */

/* Ponto único de leitura e gravação do estado.
   - Hoje: localStorage, uma chave por usuário (window.ECOCLICK_USER_ID, definido pelo site depois do login).
   - Com API: o site define window.EcoClickStorage = { load(), save(estado) } antes deste script.
       load() precisa devolver o estado (ou null) de forma síncrona, por exemplo o JSON já embutido na página pelo servidor;
       save() pode enviar ao servidor em segundo plano (fetch/PUT). Nada além deste bloco precisa mudar. */
const Store = (function(){
  const host = window.EcoClickStorage;
  const userId = String(window.ECOCLICK_USER_ID || "local");
  const key = "ecoclick:gamificacao:v5:" + userId;
  const custom = host && typeof host.load === "function" && typeof host.save === "function";
  return {
    key,
    load(){
      if(custom){ try{ return host.load() || null; }catch(e){ return null; } }
      try{ const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : null; }catch(e){ return null; }
    },
    save(st){
      if(custom){ try{ host.save(st); }catch(e){} return; }
      try{ localStorage.setItem(key, JSON.stringify(st)); }catch(e){}
    },
    clear(){ try{ localStorage.removeItem(key); }catch(e){} },
  };
})();

/* =========================================================
   Regras centrais de XP, limites e níveis (única fonte da verdade).
   Todo XP do site passa por aqui: limite diário, limite em qualquer janela de 7 dias e XP por nível.
   ========================================================= */
const XP_RULES = Object.freeze({ dailyCap:180, weeklyCap:1260, windowDays:7, perLevel:1260 });
/* Relógio que não anda para trás: se a data do aparelho voltar, o site segue usando o maior horário já visto.
   Isso impede reabrir limites e missões voltando a data. (Adiantar a data só se resolve com um servidor.) */
let CLOCK_FLOOR = 0;
function nowTs(){ return Math.max(Date.now(), CLOCK_FLOOR); }
function dayAdd(iso, n){ const d = new Date(iso + "T12:00:00"); d.setDate(d.getDate() + n); return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0"); }
const fmtN = (n)=> Number(n).toLocaleString("pt-BR");
const isoBR = (iso)=> iso.slice(8,10)+"/"+iso.slice(5,7);
/* Histórico de recompensas: uma linha por conclusão paga. É também a base dos limites de XP.
   Linhas com legacy:true só marcam o que já tinha sido pago antes deste controle existir (xp 0). */
const rewardRows = ()=> Array.isArray(state.rewardLog) ? state.rewardLog : [];
function xpSum(from, to){ return rewardRows().reduce((s,e)=> (e.d>=from && e.d<=to) ? s + (e.xp||0) : s, 0); }
function xpStatus(){
  const today = todayISO();
  const day = xpSum(today, today), week = xpSum(dayAdd(today, 1 - XP_RULES.windowDays), today);
  const dayLeft = Math.max(0, XP_RULES.dailyCap - day), weekLeft = Math.max(0, XP_RULES.weeklyCap - week);
  return { day, week, dayLeft, weekLeft, available: Math.min(dayLeft, weekLeft) };
}
/* primeiro dia futuro em que volta a haver limite livre (a janela de 7 dias anda um dia por vez) */
function xpFreeAgain(){
  const today = todayISO();
  for(let k=1; k<=XP_RULES.windowDays+1; k++){
    const d = dayAdd(today, k);
    if(XP_RULES.weeklyCap - xpSum(dayAdd(d, 1 - XP_RULES.windowDays), d) > 0) return d;
  }
  return null;
}
function limitNote(){
  const s = xpStatus(); if(s.available>0) return "";
  const again = xpFreeAgain();
  const when = (s.dayLeft===0 && s.weekLeft>0) ? "amanhã" : (again ? "a partir de " + isoBR(again) : "em breve");
  const why = s.weekLeft===0 ? `o limite de ${fmtN(XP_RULES.weeklyCap)} XP em 7 dias` : `o limite de ${XP_RULES.dailyCap} XP de hoje`;
  return `Você atingiu ${why}. Pode continuar registrando itens, mas não recebe XP adicional até haver limite disponível (${when}).`;
}
function xpMeterHtml(){
  const s = xpStatus(), note = limitNote();
  return `<p class="period-note xp-meter">XP hoje: <b>${s.day}/${XP_RULES.dailyCap}</b> · XP nos últimos 7 dias: <b>${fmtN(s.week)}/${fmtN(XP_RULES.weeklyCap)}</b></p>${note ? `<p class="limit-note" role="status">${note}</p>` : ""}`;
}
const MASCOT_PHRASES = [
  "Vamos reciclar hoje? Cada item conta!",
  "Você está indo muito bem, continue assim!",
  "Já pensou em descartar aquele eletrônico parado na gaveta?",
  "Sua sequência está ótima, não deixe ela quebrar hoje!",
  "Falta pouco para o próximo nível!",
];

const LEVEL_TITLES = {
  1:"Aprendiz da Reciclagem", 2:"Explorador Verde", 3:"Reciclador Dedicado", 4:"Protetor da Natureza",
  5:"Guardião Eletrônico", 6:"Especialista em Sustentabilidade", 7:"Defensor do Planeta", 8:"Agente da Transformação",
  9:"Mestre da Reciclagem", 10:"Embaixador da Sustentabilidade", 11:"Lenda Ecológica", 12:"Lenda do Planeta"
};
/* acima do nível 12 continua valendo o título do último nível */
function levelTitle(lvl){ return LEVEL_TITLES[Math.min(12, Math.max(1, Math.floor(Number(lvl)) || 1))]; }

/* Emblema de cada nível: o mesmo desenho do carrossel de níveis da aba Meu progresso */
const LVL_EMB = {
  of:["b","b","s","s","g","g","p","p","p","d","d","d"],
  rim:{ b:["#f0b678","#b5712f"], s:["#eef2f6","#a3afbd"], g:["#fbe08a","#d0a032"], p:["#c9f2e8","#3f9f8c"], d:["#cfe6ff","#5b86d6"] },
  stars:{ b:1, s:2, g:3, p:4, d:5 },
  icon:["cap","compass","bin","tree","phone","bulb","shield","butterfly","medal","globe","leaf","crown"],
  path:{
    cap:"M12 5L2.5 10 12 15l9.5-5zM6.5 12.4V16c0 1.4 2.5 3 5.5 3s5.5-1.6 5.5-3v-3.6M21.5 10v5.5",
    compass:"M12 3a9 9 0 100 18 9 9 0 000-18zM15.5 8.5l-2 5-5 2 2-5z",
    bin:"M4.5 7h15M9.5 7V4.8h5V7M6.5 7l1 13h9l1-13M9.5 16.5c0-3 2-5 5-5 0 3-2 5-5 5zM9.5 16.5l2-2",
    tree:"M12 3l-6 8h3l-4 6h14l-4-6h3zM12 17v4",
    phone:"M9 2.5h6a2 2 0 012 2v15a2 2 0 01-2 2H9a2 2 0 01-2-2v-15a2 2 0 012-2zM10.5 18.5h3M9.8 11.4l1.7 1.7 3-3.4",
    bulb:"M9 18h6M10 21h4M12 2.8a6 6 0 00-3.6 10.8c.7.6 1.1 1.3 1.1 2.2V17h5v-1.2c0-.9.4-1.6 1.1-2.2A6 6 0 0012 2.8z",
    shield:"M12 3l7.5 3v5.5c0 4.6-3.1 8-7.5 9.5-4.4-1.5-7.5-4.9-7.5-9.5V6zM8.8 12l2.3 2.3 4.2-4.6",
    butterfly:"M11.3 12.2C10.6 7.6 7.4 3.6 4 4 1.4 4.4 1.6 9.4 5 11.9 6.9 13.2 9.5 13.2 11.3 12.2zM12.7 12.2c.7-4.6 3.9-8.6 7.3-8.2 2.6.4 2.4 5.4-1 7.9-1.9 1.3-4.5 1.3-6.3.3zM11.3 14.2C9.4 13.9 6.4 14.7 5.8 17.2c-.5 2.4 2 3.9 4 2.8 1.4-.8 1.5-3.4 1.5-5.8zM12.7 14.2c1.9-.3 4.9.5 5.5 3 .5 2.4-2 3.9-4 2.8-1.4-.8-1.5-3.4-1.5-5.8zM12 10v9.5M12 10 10.4 7.2M12 10l1.6-2.8",
    medal:"M12 3a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM8.6 13.5L7 21l5-3 5 3-1.6-7.5",
    globe:"M12 3a9 9 0 100 18 9 9 0 000-18zM3 12h18M12 3c3 2.8 3 15.2 0 18M12 3c-3 2.8-3 15.2 0 18",
    leaf:"M5 19C5 10 10 5 19 5c0 9-5 14-14 14zM5 19c3-4.2 6.2-7 10.5-8.6",
    crown:"M3.5 18.5h17M4 18.5L3 7.5l5 4 4-6 4 6 5-4-1 11"
  }
};
function levelEmblem(level){
  const n = Math.min(12, Math.max(1, Math.floor(Number(level)) || 1)), tier = LVL_EMB.of[n-1];
  const c = LVL_EMB.rim[tier], stars = LVL_EMB.stars[tier], id = "lvle" + n;
  const bw = Math.max(54, 18*stars), bx = 56 - bw/2;
  return `<svg viewBox="0 0 112 140" aria-hidden="true"><defs><linearGradient id="${id}o" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c[0]}"/><stop offset="1" stop-color="${c[1]}"/></linearGradient><linearGradient id="${id}i" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1f6b4f"/><stop offset="1" stop-color="#124433"/></linearGradient></defs>
  <polygon points="56,2 106,31 106,89 56,118 6,89 6,31" fill="url(#${id}o)"/>
  <polygon points="56,17 93,38 93,82 56,103 19,82 19,38" fill="url(#${id}i)" stroke="rgba(255,255,255,.28)" stroke-width="2"/>
  <g transform="translate(36 40) scale(1.67)" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="${LVL_EMB.path[LVL_EMB.icon[n-1]]}"/></g>
  <rect x="${bx}" y="118" width="${bw}" height="18" rx="9" fill="${c[1]}"/><text x="56" y="131" text-anchor="middle" font-size="11" font-weight="800" fill="#fff" letter-spacing="2">${"★".repeat(stars)}</text></svg>`;
}

/* ---------------- Selos (10 no total) ---------------- */
const BADGE_TIERS = {
  iniciante:    { label:"Iniciante",     range:"níveis 1 a 3" },
  intermediario:{ label:"Intermediário", range:"níveis 4 a 7" },
  avancado:     { label:"Avançado",      range:"nível 8 em diante" },
};
const BADGE_DEFS = [
  {id:"s1",  tier:"iniciante",     name:"Eco Iniciante",        desc:"Concluir a primeira missão.",
    check:s=>(s.user.missionsDone||0)>=1 || s.missions.some(m=>m.status==="done")},
  {id:"s2", recheck:true,  tier:"iniciante",     name:"Primeiro Ciclo",       desc:"Concluir os 3 níveis da Jornada do Reciclador.",
    check:s=>{ const c=s.missions.filter(m=>(m.chain||"").startsWith("jornada")); return c.length>0 && c.every(m=>m.status==="done"); }},
  {id:"s3",  tier:"iniciante",     name:"Curioso Verde",        desc:"Concluir 3 conteúdos (artigos ou quizzes).",
    check:s=>s.readArticles.length>=3},
  {id:"s4",  tier:"intermediario", name:"Reciclador Fiel",      desc:"Manter 7 dias seguidos de sequência.",
    check:s=>Math.max(s.user.streak, s.user.streakRecord)>=7},
  {id:"s5", recheck:true,  tier:"intermediario", name:"Guardião Eletrônico",  desc:"Entregar um eletrônico em um ponto de coleta.",
    check:s=>{ const m=s.missions.find(x=>x.id==="j4"); return !!m && m.status==="done"; }},
  {id:"s6",  tier:"intermediario", name:"Convidador",           desc:"Convidar um amigo para o EcoClick.",
    check:s=>s.invited.length>=1},
  {id:"s7",  tier:"intermediario", name:"Dez em Ação",          desc:"Concluir 10 missões diferentes (renovações não contam de novo).",
    check:s=>(s.user.doneIds||[]).length>=10},
  {id:"s8",  tier:"avancado",      name:"Sequência de Ferro",   desc:"Manter 30 dias seguidos de sequência.",
    check:s=>Math.max(s.user.streak, s.user.streakRecord)>=30},
  {id:"s9",  tier:"avancado",      name:"No Pódio",             desc:"Chegar ao top 3 do ranking global.",
    check:s=>s.ranking.length>0 && rankPosOf(s)<=3},
  {id:"s10", recheck:true, tier:"avancado",      name:"Lenda do EcoClick",    desc:"Conquistar os outros 9 selos.",
    check:s=>BADGE_DEFS.filter(d=>d.id!=="s10").every(d=>{ const b=s.badges.find(x=>x.id===d.id); return !!b && b.unlocked; })},
];
function freshBadges(){ return BADGE_DEFS.map(d=>({id:d.id, unlocked:false})); }

function demoState(){
  return {
    user: { name:"João Silva", level:3, xp:1250, xpToNext:1600, totalXp:1250, streak:7, streakRecord:11, lastActive:yesterdayISO(), referralCode:"joao-482" },
    points: 620,
    impact: { kg:18.5, actions:37 },
    readArticles: [],
    invited: [],
    badges: freshBadges(),
    missions: [
      {id:"j1", chain:"jornada", order:1, cat:"sequencia", title:"Descubra o que é lixo eletrônico", desc:"Leia o guia rápido sobre e-lixo.", pts:60, xp:10, progress:1, goal:1, status:"done"},
      {id:"j2", chain:"jornada", order:2, cat:"sequencia", title:"Identifique 3 eletrônicos em casa", desc:"Registre 3 itens que você possui.", pts:80, xp:15, progress:2, goal:3, status:"active"},
      {id:"j3", chain:"jornada", order:3, cat:"sequencia", title:"Descubra onde descartá-los", desc:"Leia o guia de pontos de coleta.", pts:60, xp:10, progress:0, goal:1, status:"locked"},
      {id:"j4", chain:"jornada", order:4, cat:"sequencia", title:"Entregue um deles no ponto de coleta", desc:"Entregue um eletrônico em um ponto de coleta, com comprovante.", pts:200, xp:40, progress:0, goal:1, status:"locked"},
      {id:"j5", chain:"jornada", order:5, cat:"sequencia", title:"Complete o desafio educativo", desc:"Finalize o quiz da jornada.", pts:100, xp:20, progress:0, goal:1, status:"locked"},

      {id:"k1", chain:"jornada2", order:1, cat:"sequencia", title:"Entenda os riscos das pilhas", desc:"Leia por que pilhas e baterias exigem cuidado.", pts:60, xp:10, progress:0, goal:1, status:"locked"},
      {id:"k2", chain:"jornada2", order:2, cat:"sequencia", title:"Separe 3 pilhas usadas", desc:"Separe 3 pilhas ou baterias usadas, prontas para levar ao ponto de coleta.", pts:80, xp:15, progress:0, goal:3, status:"locked"},
      {id:"k3", chain:"jornada2", order:3, cat:"sequencia", title:"Guarde com segurança", desc:"Leia como armazenar pilhas até a entrega.", pts:60, xp:10, progress:0, goal:1, status:"locked"},
      {id:"k4", chain:"jornada2", order:4, cat:"sequencia", title:"Entregue pilhas ou baterias", desc:"Entregue pilhas ou baterias em um ponto de coleta, com comprovante.", pts:200, xp:40, progress:0, goal:1, status:"locked"},
      {id:"k5", chain:"jornada2", order:5, cat:"sequencia", title:"Quiz de pilhas e baterias", desc:"Finalize o quiz do nível 2.", pts:100, xp:20, progress:0, goal:1, status:"locked"},

      {id:"l1", chain:"jornada3", order:1, cat:"sequencia", title:"Antes de reciclar, reduza", desc:"Leia sobre os 5 Rs do consumo consciente.", pts:60, xp:10, progress:0, goal:1, status:"locked"},
      {id:"l2", chain:"jornada3", order:2, cat:"sequencia", title:"Dê uma segunda vida", desc:"Leia sobre conserto, doação e reuso.", pts:60, xp:10, progress:0, goal:1, status:"locked"},
      {id:"l3", chain:"jornada3", order:3, cat:"sequencia", title:"Entregue 5 itens", desc:"Entregue 5 itens em pontos de coleta, com comprovante.", pts:350, xp:45, progress:0, goal:5, status:"locked"},
      {id:"l4", chain:"jornada3", order:4, cat:"sequencia", title:"Quiz dos 5 Rs", desc:"Finalize o quiz do nível 3.", pts:80, xp:15, progress:0, goal:1, status:"locked"},
      {id:"l5", chain:"jornada3", order:5, cat:"sequencia", title:"Desafio final do reciclador", desc:"Conclua o quiz final e ganhe o selo.", pts:150, xp:25, progress:0, goal:1, status:"locked"},

      {id:"d1", cat:"diarias", title:"Conheça um ponto de coleta", desc:"Leia sobre pontos de coleta perto de você.", pts:20, xp:5, progress:0, goal:1, status:"active"},
      {id:"d2", cat:"diarias", title:"Identifique um eletrônico", desc:"Identifique um eletrônico parado que você tem em casa.", pts:20, xp:5, progress:1, goal:1, status:"done"},
      {id:"d3", cat:"diarias", title:"Separe um resíduo eletrônico", desc:"Separe um eletrônico para descarte, pronto para levar ao ponto de coleta.", pts:30, xp:10, progress:0, goal:1, status:"active"},
      {id:"d4", cat:"diarias", title:"Separe uma pilha ou bateria", desc:"Separe uma pilha ou bateria usada, pronta para levar ao ponto de coleta.", pts:30, xp:10, progress:0, goal:1, status:"active"},
      {id:"d5", cat:"diarias", title:"Aprenda sobre reciclagem", desc:"Leia uma dica ou artigo do site.", pts:20, xp:5, progress:0, goal:1, status:"active"},
      {id:"d6", cat:"diarias", title:"Dica do dia: cabos e carregadores", desc:"Leia a dica do dia e confirme a leitura.", pts:20, xp:5, progress:0, goal:1, status:"active"},

      {id:"w1", cat:"semanais", title:"Entregue 3 itens na semana", desc:"Entregue 3 itens em pontos de coleta nesta semana, com comprovante.", pts:200, xp:30, progress:1, goal:3, status:"active"},
      {id:"w2", cat:"semanais", title:"Leia 5 conteúdos", desc:"Leia textos educativos do EcoClick.", pts:130, xp:20, progress:2, goal:5, status:"active"},
      {id:"w3", cat:"semanais", title:"Entregue 1 pilha ou bateria na semana", desc:"Entregue pilhas ou baterias em um ponto de coleta nesta semana, com comprovante.", pts:120, xp:20, progress:0, goal:1, status:"active"},
      {id:"w4", cat:"semanais", title:"Quiz da semana", desc:"Acerte todas as perguntas do quiz semanal.", pts:100, xp:15, progress:0, goal:1, status:"active"},
      {id:"m1", cat:"mensais", title:"Entregue 10 itens no mês", desc:"Entregue 10 itens em pontos de coleta neste mês, com comprovante.", pts:500, xp:40, progress:0, goal:10, status:"active"},

      {id:"m2", cat:"mensais", title:"Entregue 5 eletrônicos no mês", desc:"Entregue 5 eletrônicos em pontos de coleta neste mês, com comprovante.", pts:450, xp:50, progress:1, goal:5, status:"active"},
      {id:"m3", cat:"mensais", title:"Entregue 1 pilha ou bateria", desc:"Entregue pilhas ou baterias em um ponto de coleta neste mês, com comprovante.", pts:150, xp:20, progress:0, goal:1, status:"active"},
      {id:"m4", cat:"mensais", title:"Entregue 2 categorias diferentes", desc:"Entregue itens de 2 categorias distintas (eletrônico, eletrodoméstico ou bateria), com comprovante.", pts:250, xp:35, progress:1, goal:2, status:"active"},
      {id:"m5", cat:"mensais", title:"Entregue um celular no mês", desc:"Entregue um celular antigo em um ponto de coleta neste mês, com comprovante.", pts:200, xp:25, progress:0, goal:1, status:"active"},

      {id:"c1", cat:"consciencia", title:"Compartilhe conhecimento", desc:"Leia um conteúdo e compartilhe com alguém.", pts:50, xp:10, progress:0, goal:1, status:"active"},
      {id:"c4", cat:"consciencia", title:"Espalhe a dica das pilhas", desc:"Leia a dica sobre pilhas e baterias e compartilhe com alguém.", pts:60, xp:10, progress:0, goal:1, status:"active"},
      {id:"c2", cat:"consciencia", title:"Convide um amigo", desc:"Compartilhe seu link e confirme com o usuário de quem você convidou.", pts:120, xp:20, progress:0, goal:1, status:"active"},
      {id:"c3", cat:"consciencia", title:"Mobilize sua turma", desc:"Convide até 3 colegas para participar.", pts:250, xp:35, progress:0, goal:3, status:"active"},

      {id:"e1", cat:"educativas", title:"Aprendiz da Reciclagem", desc:"Leia 3 conteúdos educativos.", pts:90, xp:15, progress:1, goal:3, status:"active"},
      {id:"e2", cat:"educativas", title:"Você sabe onde descartar?", desc:"Acerte 5 perguntas sobre descarte.", pts:100, xp:15, progress:0, goal:5, status:"active"},
      {id:"e3", cat:"educativas", title:"Especialista em baterias", desc:"Complete o quiz de baterias.", pts:130, xp:20, progress:0, goal:1, status:"active"},
      {id:"e4", cat:"educativas", title:"Mito ou verdade?", desc:"Responda perguntas sobre lixo eletrônico.", pts:70, xp:10, progress:0, goal:1, status:"active"},
      {id:"e7", cat:"educativas", title:"Seus dados no aparelho antigo", desc:"Acerte o quiz sobre como proteger seus dados antes de descartar.", pts:120, xp:15, progress:0, goal:1, status:"active"},
      {id:"e8", cat:"educativas", title:"Logística reversa", desc:"Acerte o quiz sobre o caminho de volta dos produtos usados.", pts:120, xp:15, progress:0, goal:1, status:"active"},
      {id:"e5", cat:"educativas", title:"Detetive eletrônico", desc:"Identifique quais objetos podem ser reciclados.", pts:110, xp:20, progress:0, goal:1, status:"locked-level", minLevel:4},
      {id:"e6", cat:"educativas", title:"Desafio do descarte", desc:"Escolha o destino correto para diferentes resíduos.", pts:120, xp:20, progress:0, goal:1, status:"locked-level", minLevel:5},

      {id:"t1", cat:"turtly", title:"A Turtly precisa de ajuda!", desc:"Encontrei uma bateria velha! Descubra onde ela deve ser descartada.", pts:120, xp:20, progress:0, goal:1, status:"active"},
      {id:"t2", cat:"turtly", title:"Missão: Armário Limpo", desc:"Separe do armário um eletrônico, um eletrodoméstico e uma pilha ou bateria que você não usa mais.", pts:300, xp:45, progress:1, goal:3, status:"active"},
      {id:"t3", cat:"turtly", title:"A Turtly e o celular antigo", desc:"A Turtly achou um celular na gaveta! Ajude-a a dar o destino certo.", pts:150, xp:20, progress:0, goal:1, status:"active"},
      {id:"t4", cat:"turtly", title:"Caça aos carregadores", desc:"Separe 3 carregadores ou cabos que você não usa mais.", pts:250, xp:30, progress:0, goal:3, status:"active"},
    ],
    // concorrentes do ranking global; a posição do usuário é calculada pelo XP total dele
    ranking: [
      {name:"Marina Alves", xp:2600},
      {name:"Rafael Costa", xp:2300},
      {name:"Bia Fernandes", xp:2000},
      {name:"Pedro Lima", xp:1180},
    ],
    history: [
      {date:"22/09/2026", item:"Celular antigo", cat:"Eletrônico", kg:"0,3 kg", pts:100},
      {date:"18/09/2026", item:"Pilhas (4un)", cat:"Bateria", kg:"0,1 kg", pts:40},
      {date:"10/09/2026", item:"Liquidificador", cat:"Eletrodoméstico", kg:"1,8 kg", pts:120},
      {date:"02/09/2026", item:"Cabos e carregadores", cat:"Eletrônico", kg:"0,4 kg", pts:60},
      {date:"25/08/2026", item:"Rádio antigo", cat:"Eletrônico", kg:"1,1 kg", pts:90},
    ]
  };
}

function newReferralCode(){ return "eco-" + Math.random().toString(36).slice(2,7); }
/* Estado de um usuário novo: nível 1, nada concluído, sem histórico e sem ranking inventado. */
function emptyState(){
  const d = demoState();
  const missions = d.missions.map(m=>{
    const x = Object.assign({}, m, { progress: 0 });
    if(m.status==="locked-level") return x;
    if(m.chain) x.status = (m.chain==="jornada" && m.order===1) ? "active" : "locked";   // trilha: abre a 1ª etapa; o resto destrava em ordem
    else x.status = "active";
    return x;
  });
  return {
    user: { name:"", level:1, xp:0, xpToNext:XP_RULES.perLevel, totalXp:0, streak:0, streakRecord:0, lastActive:null, referralCode:newReferralCode(), missionsDone:0, doneIds:[] },
    periods: periodKeys(), reads: { day:[], week:[] }, quizTries: {}, rewardLog: [],
    points: 0, impact: { kg:0, actions:0 }, readArticles: [], invited: [], badges: freshBadges(),
    missions, ranking: [], history: []
  };
}
const freshState = ()=> emptyState();

/* ---------------- Reinício por período: diárias (todo dia), semanais (segunda-feira), mensais (dia 1º) ---------------- */
const PERIOD_CATS = { diarias:"day", semanais:"week", mensais:"month" };
const PERIOD_NOTE = {
  diarias:"Estas missões renovam todo dia, à meia-noite.",
  semanais:"Estas missões renovam toda segunda-feira.",
  mensais:"Estas missões renovam no dia 1º de cada mês.",
};
function weekStartISO(d){ const x = new Date(d.getTime()); x.setHours(12,0,0,0); x.setDate(x.getDate() - ((x.getDay()+6)%7)); return isoOf(x); }   // segunda-feira
function periodKeys(){ const now = new Date(nowTs()); return { day: isoOf(now), week: weekStartISO(now), month: isoOf(now).slice(0,7) }; }
function periodKeyAt(cat, ts){
  const kind = PERIOD_CATS[cat]; if(!kind) return "";
  const d = new Date(ts || 0);
  return kind==="day" ? isoOf(d) : (kind==="week" ? weekStartISO(d) : isoOf(d).slice(0,7));
}
const periodKeyFor = (m)=> periodKeyAt(m.cat, nowTs());
function renewText(cat){
  if(cat==="diarias") return "renova amanhã";
  if(cat==="semanais") return "renova na segunda-feira";
  return `renova em 1º de ${H_MONTHS[(new Date().getMonth()+1)%12]}`;
}
/* Zera as missões do período que virou. Devolve true se algo mudou. */
function rolloverPeriods(){
  const now = periodKeys();
  if(!state.periods){            // estado antigo, sem registro de período: usa o último dia ativo como referência
    const la = state.user.lastActive;
    state.periods = la ? { day:la, week:weekStartISO(new Date(la+"T12:00:00")), month:la.slice(0,7) } : now;
  }
  if(!state.reads) state.reads = { day:[], week:[] };
  let changed = false;
  ["day","week","month"].forEach(k=>{
    if(state.periods[k]===now[k]) return;
    if(state.periods[k] > now[k]) return;        // a data do aparelho voltou: não reinicia missões de novo
    state.periods[k] = now[k]; changed = true;
    const cat = Object.keys(PERIOD_CATS).find(c=>PERIOD_CATS[c]===k);
    state.missions.filter(m=>m.cat===cat).forEach(m=>{
      m.progress = 0; delete m.cats;
      m.status = (m.minLevel && state.user.level < m.minLevel) ? "locked-level" : "active";
    });
    if(k==="day") state.reads.day = [];
    if(k==="week") state.reads.week = [];
  });
  return changed;
}

let state = load();
function load(){
  try{
    const parsed = Store.load();
    if(parsed && parsed.user){
      CLOCK_FLOOR = Math.max(0, Number(parsed.clockFloor)||0);
      if(!parsed.readArticles) parsed.readArticles = [];
      if(!parsed.invited) parsed.invited = [];
      if(parsed.user.lastActive===undefined) parsed.user.lastActive = null;
      if(parsed.user.totalXp==null) parsed.user.totalXp = parsed.user.xp;
      /* nível e XP do nível passam a vir só do XP total, com 1.260 XP por nível */
      parsed.user.totalXp = Math.max(0, Number(parsed.user.totalXp)||0);
      parsed.user.level = Math.floor(parsed.user.totalXp / XP_RULES.perLevel) + 1;
      parsed.user.xp = parsed.user.totalXp % XP_RULES.perLevel;
      parsed.user.xpToNext = XP_RULES.perLevel;
      parsed.ranking = freshState().ranking;
      parsed.impact = { kg: (parsed.impact||{}).kg || 0, actions: (parsed.impact||{}).actions || 0 };
      delete parsed.rankingHistory;
      const validIds = new Set(emptyState().missions.map(m=>m.id));
      parsed.missions = parsed.missions.filter(m=>validIds.has(m.id));          // tira missões que deixaram de existir
      emptyState().missions.forEach(d=>{ if(!parsed.missions.some(m=>m.id===d.id)) parsed.missions.push(d); });
      /* textos, XP e metas vêm sempre da definição atual; só progresso e status ficam do usuário */
      const defs = new Map(emptyState().missions.map(d=>[d.id, d]));
      parsed.missions.forEach(m=>{ const d = defs.get(m.id); if(!d) return; ["title","desc","pts","xp","goal","unit","cat","chain","order","minLevel"].forEach(k=>{ if(d[k]===undefined) delete m[k]; else m[k] = d[k]; }); });
      /* com 1.260 XP por nível, missões de nível mais alto voltam a ficar bloqueadas se o nível recalculado for menor */
      parsed.missions.forEach(m=>{ if(m.minLevel && parsed.user.level < m.minLevel && m.status==="active" && !(m.progress>0)) m.status = "locked-level"; });
      /* convites antigos eram só texto: viram objetos, sem repetir o mesmo usuário */
      parsed.invited = (parsed.invited||[]).map(x=> typeof x==="string" ? { username:normHandle(x), t:0, validated:false } : x)
        .filter((x,i,a)=> x && x.username && a.findIndex(y=>y.username===x.username)===i);
      if(parsed.user.missionsDone===undefined) parsed.user.missionsDone = parsed.missions.filter(m=>m.status==="done").length;
      if(!Array.isArray(parsed.user.doneIds)) parsed.user.doneIds = parsed.missions.filter(m=>m.status==="done").map(m=>m.id);
      if(!parsed.reads) parsed.reads = { day:[], week:[] };
      if(!parsed.quizTries) parsed.quizTries = {};
      if(!Array.isArray(parsed.badges) || parsed.badges.length!==BADGE_DEFS.length || !parsed.badges.some(b=>b.id==="s1")) parsed.badges = freshBadges();
      /* histórico de recompensas: estados antigos não tinham. Aproveita o controle de limites antigo
         e marca o que já foi pago, para nada ser pago de novo. */
      if(!Array.isArray(parsed.rewardLog)){
        parsed.rewardLog = [];
        const led = parsed.xpLedger || {}, add = (id, d, xp)=>{ if(xp>0 && typeof d==="string") parsed.rewardLog.push({ key:"migracao|"+id, id:"migracao", title:"XP anterior ao novo controle", cat:"migracao", per:d, d:d.length===7 ? d+"-01" : d, t:0, base:xp, xp, pts:0, legacy:true }); };
        const dd = led["d-dia"], ds = led["d-sem"], ss = led["s-sem"];
        if(dd) add("dia", dd.k, dd.xp);
        if(ds) add("dsem", ds.k, ds.xp - ((dd && weekStartISO(new Date(dd.k+"T12:00:00"))===ds.k) ? dd.xp : 0));
        if(ss) add("ssem", ss.k, ss.xp);
        parsed.missions.forEach(m=>{
          if(m.status!=="done") return;
          const kind = PERIOD_CATS[m.cat], per = kind ? ((parsed.periods||{})[kind] || periodKeys()[kind]) : "unica";
          parsed.rewardLog.push({ key:m.id+"|"+per, id:m.id, title:m.title, cat:m.cat, per, d:"0000-00-00", t:0, base:0, xp:0, pts:0, legacy:true });
        });
      }
      delete parsed.xpLedger;
      return parsed;
    }
  }catch(e){}
  return freshState();
}
function save(){ CLOCK_FLOOR = Math.max(CLOCK_FLOOR, Date.now()); state.clockFloor = CLOCK_FLOOR; Store.save(state); }

/* Os selos liberam por faixa: o Intermediário só abre com todos os do Iniciante,
   e o Avançado só abre com todos os do Intermediário. */
const BADGE_TIER_ORDER = ["iniciante","intermediario","avancado"];
function badgeTierOpen(tier){
  const i = BADGE_TIER_ORDER.indexOf(tier);
  if(i<=0) return true;
  const prev = BADGE_TIER_ORDER[i-1];
  return BADGE_DEFS.filter(d=>d.tier===prev).every(d=>{ const b=state.badges.find(x=>x.id===d.id); return !!b && b.unlocked; });
}
/* Confere as condições e libera os selos conquistados. "silent" evita aviso (usado ao abrir o site). */
function evaluateBadges(silent){
  const got = [];
  let changed = true, guard = 0;
  while(changed && guard++ < 8){
    changed = false;
    BADGE_DEFS.forEach(def=>{
      const b = state.badges.find(x=>x.id===def.id);
      if(!b) return;
      const open = badgeTierOpen(def.tier);
      if(b.unlocked && (!open || (def.recheck && !def.check(state)))){ b.unlocked = false; changed = true; }
      else if(!b.unlocked && open && def.check(state)){ b.unlocked = true; got.push(def); changed = true; }
    });
  }
  const finalGot = got.filter(d=>state.badges.find(x=>x.id===d.id).unlocked);
  save();
  if(finalGot.length && !silent) setTimeout(()=>{ showToast(`Novo selo: ${finalGot.map(d=>d.name).join(", ")}`); launchConfetti(); }, 1800);
}
rolloverPeriods();
refreshStreak();
evaluateBadges(true);

/* ---------------- Navegação ---------------- */
const views = ["inicio","missoes","jornada","historico"];
/* Rola até uma seção da tela de Início e a destaca por um instante.
   Se a rolagem suave não rodar (alguns celulares e visualizadores), usa a rolagem direta. */
function jumpTo(id){
  const t = document.getElementById(id);
  if(!t) return;
  const bar = document.querySelector(".topbar");
  const offset = (bar ? bar.getBoundingClientRect().height : 0) + 14;
  const y = Math.max(0, t.getBoundingClientRect().top + window.pageYOffset - offset);
  try{ window.scrollTo({top:y, behavior:"smooth"}); }catch(err){ window.scrollTo(0,y); }
  setTimeout(()=>{ if(Math.abs(window.pageYOffset - y) > 8){ window.scrollTo(0,y); } }, 900);
  t.classList.remove("sec-flash"); void t.offsetWidth; t.classList.add("sec-flash");
  setTimeout(()=>t.classList.remove("sec-flash"), 1700);
}
let currentView = "inicio";
const VIEW_TITLES = { inicio:"Início", missoes:"Missões", jornada:"Jornada do Reciclador", historico:"Histórico" };
function viewFromHash(){
  const m = (location.hash||"").match(/^#\/?([a-z]+)/);
  return m && views.includes(m[1]) ? m[1] : "inicio";
}
/* Cada tela tem sua rota (#/missoes, #/jornada, #/historico); o Voltar do navegador percorre as telas visitadas */
function gotoView(name, opts){
  opts = opts || {};
  if(!views.includes(name)) name = "inicio";
  views.forEach(v=>document.getElementById("view-"+v).classList.toggle("active", v===name));
  currentView = name;
  document.title = "EcoClick — " + VIEW_TITLES[name];
  if(!opts.fromHash){
    const h = (name==="inicio" && !location.hash) ? "" : "#/"+name;
    if(h && location.hash!==h) location.hash = h;
  }
  window.scrollTo({top:0});
  try{ document.querySelector(".topbar").scrollIntoView({block:"start"}); }catch(e){}
  if(!opts.noFocus){ const t = document.getElementById("conteudo"); if(t) t.focus({preventScroll:true}); }   // leitores de tela recomeçam do conteúdo novo
}
window.addEventListener("hashchange", ()=>{
  const v = viewFromHash();
  if(v!==currentView) gotoView(v, {fromHash:true});
  if(location.hash && !/^#\/(inicio|missoes|jornada|historico)$/.test(location.hash)){      // endereço inválido: corrige sem criar outra entrada no histórico
    try{ history.replaceState(null, "", "#/"+v); }catch(e){}
  }
});

/* Botão "Registrar um item" dos estados vazios: abre o registro da primeira missão de identificação disponível */
function openFirstRegister(){
  const ok = (m)=> m.status==="active" && REGISTER_META[m.id];
  const m = state.missions.find(x=>ok(x) && (REG_STAGE[x.id]||"identificado")==="identificado") || state.missions.find(ok);
  const any = m || state.missions.find(x=>REGISTER_META[x.id] && x.status==="done" && (REG_STAGE[x.id]||"identificado")==="identificado");
  if(any) openRegisterModal(any.id); else gotoView("missoes");
}

/* ---------------- Histórico: apagar e desfazer ---------------- */
function newHistoryId(){ return "h" + Date.now().toString(36) + Math.random().toString(36).slice(2,7); }
function ensureHistoryIds(){
  if(!Array.isArray(state.history)) state.history = [];
  state.history.forEach(h=>{
    if(!h.id) h.id = newHistoryId();
    /* registros antigos tinham peso fixo em texto ("0,3 kg") e nenhum status de entrega */
    if(h.kgEst===undefined){ const v = parseKg(h.kg); h.kgEst = v>0 ? v : null; h.kgMin = null; h.kgMax = null; }
    delete h.kg;
    if(!h.status) h.status = "identificado";
    if(h.proof===undefined) h.proof = null;
    if(!(h.qty>=1)) h.qty = 1;
    if(h.counted===undefined) h.counted = 1;
  });
}
const isDelivered = (h)=> h.status==="entregue" && !!(h.proof && h.proof.code);
/* impacto calculado a partir dos registros: estimativa de peso ≠ peso reciclado */
function impactSummary(){
  const o = { items:0, estKg:0, noWeight:0, delivered:0, deliveredKg:0, separated:0, identified:0 };
  state.history.forEach(h=>{
    const q = h.qty || 1, kg = h.kgEst || 0;           // peso e contagem consideram a quantidade de cada registro
    o.items += q; o.estKg += kg;
    if(h.kgEst==null) o.noWeight += q;
    if(isDelivered(h)){ o.delivered += q; o.deliveredKg += kg; }
    else if(h.status==="separado") o.separated += q;
    else o.identified += q;
  });
  o.estKg = Math.round(o.estKg*100)/100; o.deliveredKg = Math.round(o.deliveredKg*100)/100;
  return o;
}
ensureHistoryIds();

/* Aviso com Desfazer: fica 15 s, pausa enquanto o mouse/foco estiver nele e pode ser dispensado.
   Atalho Ctrl/Cmd+Z; para teclado, o foco vai para o botão e volta à lista depois. */
let undoTimer, undoHandler = null, undoReturnFocus = false;
const UNDO_MS = 15000;
function armUndoTimer(ms){
  clearTimeout(undoTimer);
  undoTimer = setTimeout(()=>{
    const t = document.getElementById("undoToast");
    if(t.matches(":hover, :focus-within")) return armUndoTimer(5000);   // não some enquanto a pessoa está usando
    hideUndoToast();
  }, ms);
}
function showUndoToast(msg, onUndo, opts){
  const t = document.getElementById("undoToast");
  document.getElementById("undoToastMsg").textContent = msg;
  undoHandler = onUndo;
  undoReturnFocus = !!(opts && opts.focus);
  t.classList.add("show");
  armUndoTimer(UNDO_MS);
  if(undoReturnFocus) setTimeout(()=>document.getElementById("undoToastBtn").focus(), 60);
}
function focusAfterUndoToast(){
  const next = document.querySelector("#view-historico .hl-del");
  if(next && next.getClientRects().length) next.focus({preventScroll:true});
}
function hideUndoToast(opts){
  clearTimeout(undoTimer); undoHandler = null;
  const t = document.getElementById("undoToast");
  const wantFocus = t.contains(document.activeElement) || undoReturnFocus;
  t.classList.remove("show");
  undoReturnFocus = false;
  if(wantFocus && !(opts && opts.skipFocus)) focusAfterUndoToast();
  return wantFocus;
}
function runUndo(){
  const fn = undoHandler; if(!fn) return;
  const wantFocus = hideUndoToast({skipFocus:true});
  fn();                                            // redesenha a lista; só depois devolvemos o foco
  if(wantFocus) focusAfterUndoToast();
}
document.getElementById("undoToastBtn").addEventListener("click", runUndo);
document.getElementById("undoToastClose").addEventListener("click", hideUndoToast);
document.addEventListener("keydown", e=>{
  if((e.ctrlKey||e.metaKey) && !e.shiftKey && e.key.toLowerCase()==="z" && undoHandler
     && document.getElementById("undoToast").classList.contains("show")
     && !/^(INPUT|TEXTAREA|SELECT)$/.test((document.activeElement||{}).tagName||"")){
    e.preventDefault(); runUndo();
  }
});

function refreshAfterHistoryChange(missionId){
  save(); renderAll();
  /* se a janela de registro está aberta, redesenha para o progresso não ficar desatualizado */
  const open = document.getElementById("activityBackdrop").classList.contains("open");
  if(open && missionId && document.getElementById("submitRegister")) openRegisterModal(missionId);
}

/* O progresso das missões de registro é sempre recalculado a partir dos registros que existem (e do período atual).
   Assim, apagar ou restaurar um registro nunca deixa o progresso errado. */
function recomputeRegisterProgress(){
  const ready = [];
  state.missions.forEach(m=>{
    const rule = REG_RULES[m.id];
    if(!rule || m.status!=="active") return;
    const per = periodKeyFor(m), cats = [];
    let n = 0;
    state.history.forEach(e=>{
      const adv = Array.isArray(e.adv) ? e.adv : (e.missionId ? [{ id:e.missionId, n:e.counted ?? 1 }] : []);
      adv.forEach(a=>{
        if(a.id!==m.id) return;
        const ap = (a.per===undefined || a.per===null) ? periodKeyAt(m.cat, e.t) : a.per;
        if(ap!==per) return;                                  // registro de outro período
        n += a.n;
        if(a.cat && !cats.includes(a.cat)) cats.push(a.cat);
      });
    });
    m.progress = Math.min(m.goal, n);
    if(rule.distinct) m.cats = cats;
    if(m.progress >= m.goal) ready.push(m);
  });
  ready.forEach(finalizeMissionCompletion);      // a recompensa continua paga uma única vez (veja grantReward)
}
/* Apagar um registro:
   - missões ainda em andamento têm o progresso recalculado sem ele;
   - missões já concluídas continuam concluídas e a recompensa recebida é mantida (e registrada em rewardLog),
     mas não pode ser recebida de novo registrando o mesmo item outra vez. */
function removeHistoryEntry(id, opts){
  const idx = state.history.findIndex(h=>h.id===id);
  if(idx<0) return;
  const entry = state.history[idx];
  const keptDone = (entry.adv||[]).some(a=>{ const mm = state.missions.find(x=>x.id===a.id); return mm && mm.status==="done"; });
  state.history.splice(idx,1);
  recomputeRegisterProgress();
  refreshAfterHistoryChange(entry.missionId);
  const kept = keptDone ? " As recompensas já recebidas foram mantidas." : "";
  if(opts && opts.undoable===false){ showToast("Registro desfeito." + kept); return; }
  showUndoToast(`Registro apagado: ${entry.item}.${kept}`, ()=>{
    if(state.history.some(h=>h.id===entry.id)) return;
    state.history.splice(Math.min(idx, state.history.length), 0, entry);
    recomputeRegisterProgress();
    refreshAfterHistoryChange(entry.missionId);
    showToast("Registro restaurado");
  }, {focus: !!(opts && opts.focusUndo)});
}

/* ---------------- Toast + confete ---------------- */
let toastTimer;
function showToast(msg){
  const t = document.getElementById("toast");
  t.textContent = msg; t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>t.classList.remove("show"), 2400);
}
const CONFETTI_COLORS = ["#4CAF50","#1CADE4","#FFC107","#FF5C5C","#A560E8"];
function launchConfetti(){
  if(window.EcoFX && !EcoFX.motionOK()) return;
  for(let i=0;i<26;i++){
    const piece = document.createElement("div");
    piece.className = "confetti-piece";
    piece.style.left = Math.random()*100 + "vw";
    piece.style.background = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
    piece.style.animationDuration = (1.6 + Math.random()*1.2) + "s";
    piece.style.opacity = "0.9";
    document.body.appendChild(piece);
    setTimeout(()=>piece.remove(), 3200);
  }
}

/* ---------------- Cabeçalho ---------------- */
function renderHeader(){
  const u = state.user;
  if(!u.name && window.ECOCLICK_USER_NAME) u.name = window.ECOCLICK_USER_NAME;
  const first = (u.name||"").trim().split(" ")[0];
  document.getElementById("greetingName").textContent = first ? `Olá, ${first}!` : "Olá!";
  document.getElementById("chipName").textContent = u.name || "Minha conta";
  document.getElementById("chipLevel").textContent = `Nível ${u.level}`;
  const av = document.getElementById("avatarInitial");
  if(first) av.textContent = first.charAt(0).toUpperCase(); else av.innerHTML = uiIcon("user");
  
  
  const sh = document.getElementById("streakHero"); if(sh) sh.textContent = u.streak;
  /* a frase fica estável enquanto o contexto não muda (evita o texto "pular" a cada atualização) e combina com o momento do usuário */
  const fresh = !state.history.length && !state.missions.some(m=>m.status==="done");
  const ctx = `${fresh}|${u.streak>=2}|${u.xp/u.xpToNext>=.6}`;
  if(mascotCtx!==ctx){
    mascotCtx = ctx;
    const pool = fresh ? [MASCOT_PHRASES[0], MASCOT_PHRASES[2]]
      : MASCOT_PHRASES.filter((_,i)=> !(i===3 && u.streak<2) && !(i===4 && u.xp/u.xpToNext<.6));
    mascotText = pool[Math.floor(Math.random()*pool.length)];
  }
  document.getElementById("mascotPhrase").textContent = mascotText;
}
let mascotCtx = "", mascotText = MASCOT_PHRASES[0];

function renderStats(){
  const u = state.user, sm = impactSummary();
  const items = [
    {ico:"coins",  tone:"mint",  num:state.points.toLocaleString("pt-BR"), label:"EcoPontos (moeda)"},
    {ico:"target", tone:"sky",   num:u.missionsDone||0, label:"Missões concluídas"},
    {ico:"flame",  tone:"aqua",  num:`${u.streak} ${u.streak===1?"dia":"dias"}`, label:"Sequência atual", chip: u.streakRecord>0 ? `recorde ${u.streakRecord}` : undefined},
    {ico:"globe",  tone:"indigo", num: sm.items ? `≈ ${hF(sm.estKg)} kg` : "0 kg", label:"Peso estimado registrado", chip: sm.items ? `entregue ${hF(sm.deliveredKg)} kg` : undefined},
  ];
  document.getElementById("statRow").innerHTML = items.map(it=>`
    <div class="stat-shell ${it.tone}"><div class="stat-ico">${statIcon(it.ico)}</div><div class="stat-num">${it.num}</div><div class="stat-label">${it.label}</div>${it.chip?`<span class="stat-chip">${it.chip}</span>`:""}</div>`).join("");
}

/* ---------------- Missões: dados e helpers ---------------- */
const CAT_LABELS = { diarias:"Diárias", semanais:"Semanais", mensais:"Mensais", consciencia:"Conscientização", educativas:"Educativas", turtly:"Especiais da Turtly" };
const TAB_ORDER = ["diarias","semanais","mensais","consciencia","educativas","turtly"];
function missionProgressPct(m){ return Math.min(100, Math.round((m.progress / m.goal) * 100)); }

const CONTENT_LIBRARY = {
  j1:{ type:"article", tag:"Eletrônicos", title:"O que é lixo eletrônico?", teaser:"Entenda por que aparelhos não podem ir para o lixo comum.", missionId:"j1",
    paragraphs:["Lixo eletrônico é o conjunto de equipamentos elétricos ou eletrônicos descartados, incluindo aparelhos, cabos, carregadores, periféricos e componentes.",
    "Esses materiais não devem ser tratados como lixo comum. O descarte adequado permite encaminhar componentes para processos de reutilização, recuperação e reciclagem.",
    "Antes de descartar um aparelho, verifique se ele pode ser reparado, reutilizado ou doado. Quando não houver essa possibilidade, procure um ponto de recebimento adequado."],
    callout:"Missão: entender o problema antes de decidir o destino de um eletrônico." },
  j3:{ type:"article", tag:"Reciclagem", title:"Onde descartar seus eletrônicos", teaser:"Um guia rápido de pontos de coleta e logística reversa.", missionId:"j3",
    paragraphs:["A maioria das cidades tem ecopontos, cooperativas de reciclagem e lojas parceiras que recebem eletrônicos fora de uso gratuitamente.",
    "Fabricantes e grandes redes de varejo também mantêm pontos de logística reversa para celulares, pilhas e pequenos aparelhos.",
    "Antes de sair de casa, separe os itens por tipo (pilhas, cabos, aparelhos) — isso agiliza o recebimento no ponto de coleta."],
    callout:"Missão: identifique ao menos um ponto de coleta perto de você antes de seguir para a próxima etapa da jornada." },
  d1:{ type:"article", tag:"Reciclagem", title:"Conheça um ponto de coleta", teaser:"O que esperar de um ecoponto e como ele funciona.", missionId:"d1",
    paragraphs:["Pontos de coleta são locais preparados para receber eletrônicos, pilhas e baterias com segurança, evitando contaminação do solo e da água.",
    "Muitos supermercados, escolas e órgãos públicos mantêm coletores fixos — vale conferir o mais próximo da sua rotina.",
    "Ao visitar um ponto de coleta, observe quais categorias de resíduos ele aceita, já que nem todos recebem os mesmos tipos de material."],
    callout:"Missão: você concluiu a leitura sobre pontos de coleta." },
  c1:{ type:"article", tag:"Conscientização", title:"Compartilhe conhecimento", teaser:"Pequenas conversas que ajudam a mudar hábitos.", missionId:"c1",
    paragraphs:["Um dos jeitos mais simples de multiplicar o impacto do descarte correto é compartilhar o que você aprendeu.",
    "Conte para alguém próximo o que é lixo eletrônico e por que ele não deve ir para o lixo comum — pequenas conversas mudam hábitos."],
    needsShare:true,
    callout:"Missão: depois de ler, compartilhe este conteúdo com alguém usando o botão abaixo." },
  "art-agua":{ type:"article", tag:"Meio ambiente", title:"O custo da água na fabricação de eletrônicos", teaser:"Quanta água é usada para produzir um único smartphone.",
    paragraphs:["A fabricação de componentes eletrônicos consome grandes volumes de água, usada em etapas como a limpeza de chips e placas.",
    "Reduzir o descarte prematuro de aparelhos — e prolongar sua vida útil — ajuda a diminuir essa demanda por recursos naturais.",
    "Reparar antes de substituir é uma das formas mais simples de reduzir esse impacto no dia a dia."],
    callout:"Dica: aparelhos usados por mais tempo reduzem a necessidade de fabricar novas unidades." },
  "art-metais":{ type:"article", tag:"Reciclagem", title:"Metais preciosos escondidos no seu celular", teaser:"Ouro, prata e cobre presentes em pequenas quantidades.",
    paragraphs:["Aparelhos eletrônicos contêm pequenas quantidades de metais como ouro, prata, cobre e paládio em suas placas de circuito.",
    "A reciclagem correta permite recuperar esses materiais e reintroduzi-los na cadeia produtiva, reduzindo a necessidade de mineração.",
    "Por isso, cada eletrônico levado a um ponto de coleta representa também um recurso mineral que pode ser reaproveitado."],
    callout:"Curiosidade: uma tonelada de placas de celular pode conter mais ouro que uma tonelada de minério bruto." },
  "art-consumo":{ type:"article", tag:"Conscientização", title:"Consumo consciente antes de comprar de novo", teaser:"Perguntas simples antes de trocar de aparelho.",
    paragraphs:["Antes de substituir um aparelho, vale perguntar: ele pode ser consertado? Alguém próximo precisaria dele?",
    "O consumo consciente não significa deixar de comprar, mas escolher com mais cuidado o que realmente é necessário.",
    "Doar ou vender um equipamento funcional evita que ele vire lixo eletrônico antes da hora."],
    callout:"Dica: um aparelho revisado e doado ainda pode ter anos de vida útil pela frente." },
  "art-co2":{ type:"article", tag:"Meio ambiente", title:"Lixo eletrônico e emissões de carbono", teaser:"Como o descarte incorreto também pesa no clima.",
    paragraphs:["A produção de eletrônicos é intensiva em energia, e boa parte dela ainda vem de fontes que emitem gases de efeito estufa.",
    "Quando um aparelho é reciclado corretamente, materiais recuperados podem substituir matéria-prima virgem, reduzindo emissões.",
    "Prolongar a vida útil dos equipamentos é uma das formas mais diretas de reduzir a pegada de carbono do setor eletrônico."],
    callout:"Dica: revisar e manter aparelhos por mais tempo é tão importante quanto reciclá-los no fim da vida útil." },
  j5:{ type:"quiz", tag:"Quiz", title:"Desafio educativo", teaser:"O quiz final da Jornada do Reciclador.", missionId:"j5",
    questions:[
      {q:"Qual atitude deve ser considerada antes de descartar um eletrônico que ainda funciona?", options:["Jogá-lo no lixo comum","Reparar, reutilizar ou doar","Queimá-lo","Misturá-lo com resíduos orgânicos"], answer:1},
      {q:"Por que é importante procurar um ponto de recebimento adequado?", options:["Para evitar qualquer tipo de separação","Porque todo eletrônico deve ir para o lixo comum","Para encaminhar o resíduo conforme sua categoria e destinação","Para aumentar o volume de resíduos"], answer:2},
      {q:"Qual item pode fazer parte do lixo eletrônico?", options:["Cabo de carregador","Casca de banana","Areia","Folha seca"], answer:0}
    ]},
  k1:{ type:"article", tag:"Pilhas e baterias", title:"Por que pilhas e baterias são perigosas", teaser:"Entenda o que há dentro delas e por que o lixo comum não é o destino.", missionId:"k1",
    paragraphs:["Pilhas e baterias guardam metais e substâncias químicas, como níquel, lítio, cádmio, chumbo e, em modelos mais antigos, mercúrio. Enquanto estão lacradas, o risco é baixo; o problema começa quando elas se rompem.",
    "No lixo comum, a carcaça se corrói com o tempo e esses materiais podem chegar ao solo e à água, prejudicando plantas, animais e pessoas.",
    "Baterias de lítio, como as de celulares e fones, também podem esquentar ou pegar fogo se forem amassadas ou furadas, inclusive dentro do caminhão de lixo.",
    "Por isso a legislação brasileira prevê a logística reversa: quem fabrica, importa e vende pilhas e baterias deve ter uma forma de receber de volta as usadas."],
    callout:"Missão: guarde esta ideia — pilha e bateria usadas não vão para o lixo comum." },
  k3:{ type:"article", tag:"Pilhas e baterias", title:"Como guardar pilhas usadas com segurança", teaser:"Um passo a passo simples para armazenar até levar ao ponto de coleta.", missionId:"k3",
    paragraphs:["Escolha um pote com tampa, de plástico ou de vidro, e deixe-o em um lugar seco e fresco, longe do sol, de fontes de calor e do alcance de crianças e animais.",
    "Não deixe pilhas e baterias soltas junto de objetos metálicos, como chaves e moedas, porque o contato entre os polos pode causar aquecimento.",
    "Em baterias maiores, como as de celulares e notebooks, cubra os polos com fita isolante. Se a bateria estiver inchada, com vazamento ou muito quente, pare de usar e leve ao ponto de coleta o quanto antes, sem apertar nem abrir.",
    "Quando o pote estiver cheio, leve tudo ao ponto de coleta mais próximo. Muitos supermercados, lojas de eletrônicos e ecopontos recebem pilhas e baterias."],
    callout:"Missão: monte o seu pote de pilhas usadas e escolha o ponto de coleta para entregá-las." },
  k5:{ type:"quiz", tag:"Quiz", title:"Quiz de pilhas e baterias", teaser:"Teste o que você aprendeu sobre pilhas e baterias.", missionId:"k5",
    questions:[
      {q:"Por que pilhas e baterias não devem ir para o lixo comum?", options:["Porque podem liberar metais e substâncias que contaminam solo e água","Porque são muito pequenas","Porque não têm nenhum valor","Porque pesam muito"], answer:0},
      {q:"Qual é um jeito seguro de guardar pilhas usadas até a entrega?", options:["Soltas no bolso, junto com chaves","Em um pote com tampa, em local seco e fresco","Expostas ao sol, na janela","Dentro do forno"], answer:1},
      {q:"O que fazer com uma bateria inchada ou que esquenta demais?", options:["Perfurar para liberar o ar","Continuar carregando normalmente","Parar de usar e levar a um ponto de coleta","Jogar no fogo"], answer:2}
    ]},
  l1:{ type:"article", tag:"Hábito consciente", title:"Antes de reciclar, reduza", teaser:"Os 5 Rs ajudam a gerar menos resíduo desde a compra.", missionId:"l1",
    paragraphs:["A reciclagem é importante, mas é só a última etapa de uma lista conhecida como os 5 Rs: repensar, recusar, reduzir, reutilizar e reciclar.",
    "Repensar e recusar significa perguntar se você realmente precisa de algo novo e dizer não ao que é desnecessário, como embalagens e brindes que logo viram lixo.",
    "Reduzir é comprar apenas o necessário e escolher produtos duráveis. Um eletrônico que dura mais anos gera menos resíduo e ainda economiza dinheiro.",
    "Reutilizar vem antes de reciclar: consertar, doar ou dar outro uso a um objeto evita o consumo de novos materiais e de energia."],
    callout:"Missão: na próxima vez que pensar em comprar algo novo, pergunte se dá para consertar, emprestar ou reutilizar." },
  l2:{ type:"article", tag:"Hábito consciente", title:"Uma segunda vida para seus eletrônicos", teaser:"Conserto, doação e reaproveitamento: o que fazer antes de descartar.", missionId:"l2",
    paragraphs:["Muitos eletrônicos são descartados com defeitos simples. Uma assistência técnica pode trocar uma bateria, uma tela ou um cabo por bem menos do que custa um aparelho novo.",
    "Se o aparelho ainda funciona, a doação para familiares, escolas, projetos sociais e ONGs prolonga a vida útil dele e ajuda quem precisa.",
    "Antes de doar ou descartar um celular, computador ou tablet, faça backup do que for importante, saia das suas contas e restaure o aparelho para o padrão de fábrica, para proteger seus dados.",
    "Quando não houver mais conserto nem uso, aí sim o destino é a reciclagem em um ponto de coleta adequado."],
    callout:"Missão: escolha um eletrônico parado em casa e decida: consertar, doar ou reciclar?" },
  l4:{ type:"quiz", tag:"Quiz", title:"Quiz dos 5 Rs", teaser:"Descubra se você domina a ordem dos 5 Rs e o reuso.", missionId:"l4",
    questions:[
      {q:"O que significa o princípio de reduzir?", options:["Comprar só o necessário e escolher produtos duráveis","Comprar mais para ter estoque","Trocar de aparelho todo ano","Guardar tudo sem uso"], answer:0},
      {q:"Qual destas ações vem antes da reciclagem?", options:["Triturar o produto","Consertar ou doar o item","Misturar com o lixo comum","Enterrar"], answer:1},
      {q:"Qual destes é um dos 5 Rs?", options:["Revender sempre","Reutilizar","Reclamar","Rasgar"], answer:1}
    ]},
  l5:{ type:"quiz", tag:"Quiz", title:"Desafio final do reciclador", teaser:"O quiz que fecha a Jornada do Reciclador.", missionId:"l5",
    questions:[
      {q:"Onde deve ser entregue um celular antigo sem conserto?", options:["No lixo comum","Em um ponto de coleta de eletrônicos","No ralo","Em uma fogueira"], answer:1},
      {q:"Antes de doar um celular, o que é recomendado?", options:["Entregar sem apagar nada","Fazer backup, sair das contas e restaurar o padrão de fábrica","Quebrar a tela","Remover só o chip"], answer:1},
      {q:"Por que pilhas usadas precisam de descarte correto?", options:["Podem liberar substâncias que contaminam solo e água","Ocupam pouco espaço","São feitas só de papel","Apodrecem rápido"], answer:0},
      {q:"Qual atitude reduz mais resíduo no longo prazo?", options:["Trocar o aparelho sempre que sai um modelo novo","Usar o aparelho por mais tempo e consertá-lo quando preciso","Comprar vários e guardar","Descartar assim que arranha"], answer:1}
    ]},
  e2:{ type:"quiz", tag:"Quiz", title:"Você sabe onde descartar?", teaser:"5 perguntas rápidas sobre descarte correto.", missionId:"e2",
    questions:[
      {q:"Um celular antigo deve ser tratado como:", options:["Resíduo eletrônico","Resíduo orgânico","Rejeito de banheiro","Resíduo de jardinagem"], answer:0},
      {q:"Antes de levar um eletrônico a um ponto de coleta, é útil:", options:["Verificar as orientações do local","Misturá-lo ao lixo comum","Quebrá-lo em casa","Retirar peças sem orientação"], answer:0},
      {q:"Se um aparelho ainda funciona, uma alternativa ao descarte é:", options:["Reutilização ou doação","Enterrar","Queimar","Misturar com resíduos orgânicos"], answer:0},
      {q:"Cabos e carregadores usados entram no universo de:", options:["Eletrônicos","Resíduos orgânicos","Resíduos de construção","Resíduos de jardinagem"], answer:0},
      {q:"A finalidade de um ponto de recebimento é:", options:["Receber materiais conforme sua destinação","Misturar todos os resíduos","Eliminar a necessidade de triagem","Transformar qualquer item em lixo comum"], answer:0}
    ]},
  e3:{ type:"quiz", tag:"Quiz", title:"Especialista em baterias", teaser:"Teste o que você sabe sobre pilhas e baterias.", missionId:"e3",
    questions:[
      {q:"Qual é uma atitude adequada com pilhas e baterias usadas?", options:["Procurar um ponto de recebimento adequado","Jogar no vaso sanitário","Queimar","Deixar soltas junto a restos de comida"], answer:0},
      {q:"Qual cuidado vale para baterias de lítio, como as de celulares e fones?", options:["Não amassar nem furar, pois podem esquentar ou pegar fogo","Abrir para ver o que tem dentro","Deixar no sol para secar","Guardar soltas junto de chaves e moedas"], answer:0},
      {q:"A bateria de um celular está inchada. O que fazer?", options:["Parar de usar e levar a um ponto de coleta, sem apertar nem abrir","Apertar para desinchar","Continuar carregando normalmente","Jogar no lixo comum"], answer:0},
      {q:"Como guardar pilhas usadas até levá-las ao ponto de coleta?", options:["Em um pote com tampa, em lugar seco e fresco","Soltas no bolso, com chaves","Na janela, ao sol","Perto do fogão"], answer:0},
      {q:"Na logística reversa, quem deve ter uma forma de receber de volta pilhas e baterias usadas?", options:["Quem fabrica, importa e vende","Somente quem compra","Ninguém","Apenas quem recicla em casa"], answer:0}
    ]},
  e4:{ type:"quiz", tag:"Quiz", title:"Mito ou verdade?", teaser:"Separe fatos de mitos sobre lixo eletrônico.", missionId:"e4",
    questions:[
      {q:"Todo eletrônico deve ser descartado no lixo comum.", options:["Mito","Verdade"], answer:0},
      {q:"Um aparelho que ainda funciona pode ser reutilizado ou doado.", options:["Verdade","Mito"], answer:0},
      {q:"É importante observar as orientações do local de recebimento.", options:["Verdade","Mito"], answer:0}
    ]},
  e5:{ type:"quiz", tag:"Quiz", title:"Detetive eletrônico", teaser:"Identifique o que é (e o que não é) e-lixo.", missionId:"e5",
    questions:[
      {q:"Qual destes é um resíduo eletrônico?", options:["Fone de ouvido","Casca de fruta","Folha seca","Papel de cozinha"], answer:0},
      {q:"Qual destes também pode fazer parte do descarte eletrônico?", options:["Carregador","Restos de comida","Folhas","Terra"], answer:0},
      {q:"Qual destes NÃO é resíduo eletrônico?", options:["Garrafa de vidro","Controle remoto","Cabo USB","Carregador de celular"], answer:0},
      {q:"Um ventilador quebrado deve ser tratado como:", options:["Resíduo eletroeletrônico, que vai a um ponto de coleta","Resíduo orgânico","Resíduo de jardinagem","Lixo comum, sem cuidados"], answer:0}
    ]},
  e6:{ type:"quiz", tag:"Quiz", title:"Desafio do descarte", teaser:"Escolha o destino certo em situações do dia a dia.", missionId:"e6",
    questions:[
      {q:"Você encontrou um celular antigo. Qual é a próxima atitude?", options:["Procurar orientação e ponto de recebimento","Jogar no lixo comum","Queimar","Enterrar"], answer:0},
      {q:"Você tem um aparelho funcionando que não usa. O que pode fazer?", options:["Avaliar reutilização ou doação","Quebrá-lo","Misturá-lo com orgânicos","Abandoná-lo"], answer:0},
      {q:"Suas pilhas acabaram. Para onde levá-las?", options:["A um ponto de coleta de pilhas e baterias","Ao lixo comum","À pia da cozinha","À composteira"], answer:0},
      {q:"Seu notebook antigo tem dados pessoais. Antes de doar ou descartar, o ideal é:", options:["Fazer backup e restaurar o padrão de fábrica","Entregar sem apagar nada","Quebrar a tela e jogar fora","Deixar as contas conectadas"], answer:0}
    ]},
  d6:{ type:"article", tag:"Eletrônicos", title:"Cabos e carregadores também são lixo eletrônico", teaser:"Aquele cabo esquecido na gaveta tem destino certo.", missionId:"d6",
    paragraphs:["Cabos, carregadores e fones fazem parte do lixo eletrônico, mesmo sendo pequenos. Eles têm cobre, plástico e outros materiais que podem ser recuperados na reciclagem.",
    "No lixo comum, esses itens se misturam a outros resíduos e perdem a chance de reaproveitamento. Em um ponto de coleta, o material segue para separação e reciclagem.",
    "Antes de descartar, confira se o cabo ainda funciona: um carregador em bom estado pode ser doado ou reutilizado por outra pessoa."],
    callout:"Missão: lembre que cabos e carregadores sem uso também têm destino certo." },
  c4:{ type:"article", tag:"Pilhas e baterias", title:"Compartilhe a dica das pilhas", teaser:"Uma conversa pode evitar que pilhas vão para o lixo comum.", missionId:"c4",
    paragraphs:["Muita gente ainda joga pilhas e baterias no lixo comum por não saber que existe um destino certo para elas.",
    "Pilhas e baterias usadas devem ser levadas a um ponto de coleta. Muitos supermercados, lojas de eletrônicos e ecopontos recebem esse material.",
    "Contar isso a um amigo ou familiar é um jeito simples de multiplicar o efeito do seu descarte correto."],
    needsShare:true,
    callout:"Missão: depois de ler, compartilhe este conteúdo com alguém usando o botão abaixo." },
  "art-dados":{ type:"article", tag:"Segurança", title:"Apague seus dados antes de descartar", teaser:"Como proteger suas informações ao se desfazer de um aparelho.",
    paragraphs:["Celulares, tablets e computadores guardam fotos, mensagens, senhas e dados de contas. Se o aparelho for doado ou descartado sem cuidado, essas informações podem ficar acessíveis a outras pessoas.",
    "Faça backup do que for importante, saia das suas contas e restaure o aparelho para o padrão de fábrica.",
    "Se houver cartão de memória ou chip, retire antes de entregar. Depois disso, doe o aparelho se ele ainda funcionar ou leve-o a um ponto de coleta."],
    callout:"Dica: faça o backup e saia das contas antes de restaurar o padrão de fábrica." },
  "art-logistica":{ type:"article", tag:"Reciclagem", title:"Logística reversa: o caminho de volta", teaser:"Quem fabrica e vende também tem responsabilidade pelo descarte.",
    paragraphs:["Logística reversa é o sistema que leva produtos usados de volta a quem os fabricou, importou ou vendeu, para que tenham um destino adequado.",
    "No Brasil, ela é prevista em lei para produtos como pilhas, baterias e eletroeletrônicos.",
    "Para o consumidor, isso significa que existem pontos de recebimento em lojas, redes de varejo e ecopontos. Quanto mais gente usa esses pontos, mais materiais voltam para a cadeia produtiva em vez de acabar em aterros."],
    callout:"Dica: ao comprar um aparelho novo, pergunte à loja como ela recebe o antigo." },
  e7:{ type:"quiz", tag:"Quiz", title:"Seus dados no aparelho antigo", teaser:"Teste o que você sabe sobre proteger seus dados antes de descartar.", missionId:"e7",
    questions:[
      {q:"O que fazer antes de doar ou descartar um celular?", options:["Fazer backup, sair das contas e restaurar o padrão de fábrica","Entregar sem apagar nada","Apenas trocar a capinha","Deixar logado para o próximo dono"], answer:0},
      {q:"Por que apagar os dados é importante?", options:["Para evitar que fotos, mensagens e senhas fiquem acessíveis a outras pessoas","Para o aparelho ficar mais leve","Porque o ponto de coleta exige fotos do aparelho","Não é importante"], answer:0},
      {q:"O que vale conferir antes de entregar o aparelho?", options:["Se há cartão de memória ou chip para retirar","Se a caixa original está limpa","Se a bateria está cheia","Nada"], answer:0},
      {q:"Um celular que ainda funciona, depois de apagado, pode ser:", options:["Doado ou reutilizado","Jogado no lixo comum","Queimado","Enterrado"], answer:0}
    ]},
  e8:{ type:"quiz", tag:"Quiz", title:"Logística reversa", teaser:"Descubra se você entendeu o caminho de volta dos produtos usados.", missionId:"e8",
    questions:[
      {q:"O que é logística reversa?", options:["Sistema que leva produtos usados de volta a quem fabrica, importa ou vende","Um jeito de comprar mais barato","O transporte do lixo comum","Uma forma de queimar resíduos"], answer:0},
      {q:"Quem deve ter uma forma de receber de volta pilhas e baterias usadas?", options:["Fabricantes, importadores e comerciantes","Somente o consumidor","Ninguém","Apenas quem recicla em casa"], answer:0},
      {q:"Onde o consumidor pode entregar eletrônicos usados?", options:["Em pontos de recebimento, como ecopontos e lojas parceiras","No lixo comum","No ralo","Em terrenos baldios"], answer:0},
      {q:"Qual é um benefício da logística reversa?", options:["Materiais voltam para a cadeia produtiva em vez de irem para aterros","Mais resíduos nas ruas","Mais mineração","Nenhum"], answer:0}
    ]},
  w4:{ type:"quiz", tag:"Quiz", title:"Quiz da semana", teaser:"Cinco perguntas para revisar o que você aprendeu.", missionId:"w4",
    questions:[
      {q:"Um carregador de celular sem uso é:", options:["Resíduo eletrônico","Resíduo orgânico","Resíduo de jardinagem","Lixo comum sem cuidados"], answer:0},
      {q:"O que fazer com uma bateria de lítio inchada?", options:["Parar de usar e levar a um ponto de coleta, sem apertar nem abrir","Furar para soltar o ar","Continuar carregando","Guardar perto do fogão"], answer:0},
      {q:"Antes de descartar um aparelho que ainda funciona, o ideal é:", options:["Avaliar conserto, doação ou reuso","Quebrá-lo","Queimá-lo","Enterrá-lo"], answer:0},
      {q:"Qual destes NÃO é um dos 5 Rs?", options:["Rasgar","Reduzir","Reutilizar","Reciclar"], answer:0},
      {q:"Um ponto de coleta serve para:", options:["Receber resíduos para destinação adequada","Misturar todos os tipos de lixo","Guardar aparelhos quebrados em casa","Vender eletrônicos usados"], answer:0}
    ]},
  t3:{ type:"quiz", tag:"Quiz", title:"A Turtly e o celular antigo", teaser:"Ajude a Turtly a dar o destino certo a um celular antigo.", missionId:"t3",
    questions:[
      {q:"A Turtly achou um celular antigo na gaveta. O que ela deve fazer primeiro?", options:["Fazer backup, sair das contas e restaurar o padrão de fábrica","Jogar no lixo comum","Quebrar a tela","Enterrar no jardim"], answer:0},
      {q:"O celular não liga mais e não tem conserto. Para onde ele deve ir?", options:["Para um ponto de coleta de eletrônicos","Para o lixo comum","Para o ralo","Para a composteira"], answer:0},
      {q:"E se o celular ainda funcionar?", options:["Pode ser doado ou reutilizado","Deve ser queimado","Deve ser enterrado","Deve ser quebrado"], answer:0}
    ]},
  t1:{ type:"quiz", tag:"Quiz", title:"Ajude a Turtly", teaser:"Descubra onde a bateria que a Turtly encontrou deve ir.", missionId:"t1",
    questions:[
      {q:"A Turtly encontrou uma bateria velha. Para onde ela deve levar?", options:["Um ponto de coleta de pilhas e baterias","O lixo comum","O ralo do banheiro","A horta"], answer:0},
      {q:"Por que baterias não podem ir no lixo comum?", options:["Podem vazar substâncias que contaminam solo e água","Porque são pesadas","Porque são pequenas","Porque não têm valor"], answer:0},
      {q:"Onde a Turtly pode guardar a bateria até a entrega?", options:["Em um pote com tampa, em lugar seco, longe do sol","Perto do fogão","Solta na bolsa, com chaves e moedas","Ao sol, na janela"], answer:0},
      {q:"A bateria da Turtly está inchada. O que ela deve fazer?", options:["Parar de usar e levar ao ponto de coleta, sem apertar nem abrir","Furar para soltar o ar","Continuar usando","Colocar no fogo"], answer:0}
    ]}
};
const READING_MISSIONS = ["d5","e1","w2"];

/* Missões de leitura: abrem um artigo real da aba Conteúdos (Dashboard). Quem lê lá recebe um "recibo" de leitura,
   que esta página converte em progresso ao abrir. As de compartilhar (c1 e c4) continuam como antes. */
const CONTEUDOS_READING = READING_MISSIONS.concat(["j1","j3","d1","d6","k1","k3","l1","l2"]);
const READ_MISSION_KEY = "ecoclick_read_mission", READ_RECEIPTS_KEY = "ecoclick_read_receipts";
function startConteudosReading(id){
  const mm = state.missions.find(x=>x.id===id);
  if(!mm || mm.status!=="active") return;
  const ctx = { missionId:id, title:mm.title, desc:mm.desc, user:String(window.ECOCLICK_USER_ID || "local"), at:Date.now() };
  try{ localStorage.setItem(READ_MISSION_KEY, JSON.stringify(ctx)); }
  catch(e){ showToast("Não foi possível abrir os conteúdos agora. Tente de novo."); return; }
  if(typeof window.EcoNav === "function") window.EcoNav("dash_conteudos");
  else showToast("Abra a aba Conteúdos para ler um artigo.");
}
/* Aplica uma leitura feita na aba Conteúdos. Mesmas regras de antes: a missão aberta conclui; as missões "leia N conteúdos"
   somam 1 (diária: 1 por conteúdo a cada dia; semanal: 1 por semana; as demais, só a 1ª vez). */
function applyConteudoRead(articleId, missionId){
  const contentId = "eco:" + articleId;
  const snap = ()=> state.missions.map(x=>x.id+":"+x.progress+":"+x.status).join("|");
  const before = snap();
  recordActivity();
  if(!state.reads) state.reads = { day:[], week:[] };
  const R = state.reads, firstEver = !state.readArticles.includes(contentId);
  const target = state.missions.find(x=>x.id===missionId);
  if(target && target.status==="active" && !READING_MISSIONS.includes(target.id)){ target.progress = target.goal; finalizeMissionCompletion(target); }
  READING_MISSIONS.forEach(rid=>{
    const rm = state.missions.find(x=>x.id===rid);
    if(!rm || rm.status!=="active") return;
    const counts = rm.cat==="diarias" ? !R.day.includes(contentId) : (rm.cat==="semanais" ? !R.week.includes(contentId) : firstEver);
    if(!counts) return;
    rm.progress = Math.min(rm.goal, rm.progress + 1);
    if(rm.progress >= rm.goal) finalizeMissionCompletion(rm);
  });
  if(firstEver) state.readArticles.push(contentId);
  if(!R.day.includes(contentId)) R.day.push(contentId);
  if(!R.week.includes(contentId)) R.week.push(contentId);
  const changed = snap() !== before;
  if(!changed) showToast("Esse artigo já contou neste período. Leia outro artigo para avançar na missão.");
  return changed;
}
/* Lê os recibos deixados pela aba Conteúdos (só os desta conta) e aplica uma única vez cada um. Nunca derruba a página. */
function consumeReadReceipts(){
  try{
    const list = JSON.parse(localStorage.getItem(READ_RECEIPTS_KEY) || "[]");
    if(!Array.isArray(list) || !list.length) return;
    const me = String(window.ECOCLICK_USER_ID || "local");
    const mine = list.filter(r=>r && r.user===me && typeof r.articleId==="string");
    if(!mine.length) return;
    if(!Array.isArray(state.doneReceipts)) state.doneReceipts = [];
    mine.forEach(r=>{
      if(r.id && state.doneReceipts.includes(r.id)) return;
      if(r.id){ state.doneReceipts.push(r.id); if(state.doneReceipts.length > 100) state.doneReceipts.shift(); }
      applyConteudoRead(r.articleId, r.missionId);
    });
    save();
    const rest = list.filter(r=>!(r && r.user===me));
    try{ if(rest.length) localStorage.setItem(READ_RECEIPTS_KEY, JSON.stringify(rest)); else localStorage.removeItem(READ_RECEIPTS_KEY); }catch(e){}
  }catch(e){}
}

/* Textos de cada missão de registro: rotulo = pergunta do seletor; hint = explicação; placeholder = exemplo para "Outro item" */
const REGISTER_META = {
  j2:{ label:"Eletrônico que você identificou", placeholder:"Ex: Carregador de notebook", hint:"Identifique os eletrônicos parados em casa, um tipo por vez. Se forem iguais, use a quantidade." },
  j4:{ label:"Eletrônico entregue", placeholder:"Ex: Celular antigo", hint:"Entregue o eletrônico em um ponto de coleta e informe o comprovante." },
  d2:{ label:"Eletrônico identificado", placeholder:"Ex: Controle remoto sem uso", hint:"Identifique um eletrônico parado que você tem em casa." },
  d3:{ label:"Item separado para descarte", placeholder:"Ex: Fone de ouvido quebrado", hint:"Separe um eletrônico e deixe pronto para levar ao ponto de coleta." },
  w1:{ label:"Item entregue", placeholder:"Ex: Mouse antigo", hint:"Entregue os itens desta semana em pontos de coleta. Cada entrega precisa de comprovante." },
  m2:{ label:"Eletrônico entregue", placeholder:"Ex: Roteador antigo", hint:"Entregue eletrônicos em pontos de coleta neste mês, com comprovante." },
  m3:{ label:"Pilha ou bateria entregue", placeholder:"Ex: Pilhas AA (4un)", hint:"Entregue pilhas ou baterias em um ponto de coleta, com comprovante." },
  m4:{ label:"Item entregue", placeholder:"Ex: Liquidificador", hint:"Cada categoria conta uma vez: eletrônico, eletrodoméstico ou bateria." },
  k2:{ label:"Pilha ou bateria separada", placeholder:"Ex: Pilhas AA", hint:"Separe as pilhas e baterias usadas para levar ao ponto de coleta." },
  k4:{ label:"Pilha ou bateria entregue", placeholder:"Ex: Pilhas AA (4un)", hint:"Entregue pilhas ou baterias em um ponto de coleta, com comprovante." },
  l3:{ label:"Item entregue", placeholder:"Ex: Carregador antigo", hint:"Entregue itens em pontos de coleta, com comprovante." },
  d4:{ label:"Pilha ou bateria separada", placeholder:"Ex: Pilhas AAA", hint:"Separe uma pilha ou bateria usada e deixe pronta para levar ao ponto de coleta." },
  w3:{ label:"Pilha ou bateria entregue", placeholder:"Ex: Pilhas AA (4un)", hint:"Entregue pilhas ou baterias em um ponto de coleta nesta semana. Cada entrega precisa de comprovante." },
  m1:{ label:"Item entregue", placeholder:"Ex: Cabo HDMI", hint:"Entregue itens em pontos de coleta neste mês. Cada entrega precisa de comprovante." },
  m5:{ label:"Celular entregue", placeholder:"Ex: Celular antigo", hint:"Entregue um celular antigo em um ponto de coleta, com comprovante." },
  t4:{ label:"Carregador separado", placeholder:"Ex: Carregador de celular", hint:"Separe carregadores e cabos parados em casa e deixe prontos para levar ao ponto de coleta." },
  t2:{ label:"Item separado do armário", placeholder:"Ex: Tablet antigo", hint:"Separe um eletrônico, um eletrodoméstico e uma pilha ou bateria. Cada categoria conta uma vez." },
};

const INVITE_META = {
  c2:{ hint:"Copie o link de convite e envie para um amigo. Ele acessa e cria a própria conta — você não terá acesso à conta dele. Depois, confirme digitando o nome de usuário de quem você convidou. Cada usuário conta uma vez.", usernameLabel:"Nome de usuário de quem você convidou", placeholder:"Ex: @maria.eco" },
  c3:{ hint:"Copie o link e envie para os colegas. Cada um cria a própria conta. Confirme cada convite digitando o nome de usuário — até 3 pessoas diferentes. Cada usuário conta uma vez.", usernameLabel:"Nome de usuário do colega convidado", placeholder:"Ex: @pedro.reciclagem" },
};

/* ---------------- Acessórios (desbloqueados, não comprados) ---------------- */
function pad2(n){ return String(n).padStart(2,"0"); }
function isoOf(d){ return d.getFullYear()+"-"+pad2(d.getMonth()+1)+"-"+pad2(d.getDate()); }
function todayISO(){ return isoOf(new Date(nowTs())); }
function yesterdayISO(){ const d=new Date(nowTs()); d.setDate(d.getDate()-1); return isoOf(d); }
function daysBetween(a,b){ return Math.round((new Date(b+"T12:00:00") - new Date(a+"T12:00:00"))/86400000); }
/* Sequência: sobe 1 por dia em que o usuário faz algo (registrar, concluir missão ou ler) e zera se ficar um dia sem atividade. */
function recordActivity(){
  const u = state.user, today = todayISO();
  if(u.lastActive === today) return;
  u.streak = (u.lastActive && daysBetween(u.lastActive, today)===1) ? u.streak + 1 : 1;
  u.streakRecord = Math.max(u.streakRecord, u.streak);
  u.lastActive = today;
}
function refreshStreak(){
  const u = state.user;
  if(u.lastActive && daysBetween(u.lastActive, todayISO()) > 1) u.streak = 0;
}
/* Ranking global: posição do usuário pelo XP total, comparado aos demais. */
function rankPosOf(s){ return 1 + s.ranking.filter(r=>r.xp > s.user.totalXp).length; }
function parseKg(txt){ return parseFloat(String(txt).replace(",",".").replace(/[^\d.]/g,"")) || 0; }
const fmtKg1 = (v)=> v.toLocaleString("pt-BR",{minimumFractionDigits:1, maximumFractionDigits:1});
function todayBR(){ const d=new Date(nowTs()); return String(d.getDate()).padStart(2,"0")+"/"+String(d.getMonth()+1).padStart(2,"0")+"/"+d.getFullYear(); }

/* ---------------- Cartão de missão (ação + progresso) ---------------- */
function missionActionHtml(m){
  const isDone = m.status==="done";
  const isLocked = m.status==="locked" || m.status==="locked-level";
  if(isDone) return `<button class="btn btn-done" disabled>Concluída</button>`;
  if(isLocked) return `<button class="btn btn-ghost" disabled>${m.status==="locked-level"?`Nível ${m.minLevel}+`:"Bloqueada"}</button>`;
  if(CONTEUDOS_READING.includes(m.id)) return `<button class="btn btn-primary" data-mission-action="${m.id}">${m.progress>0?"Continuar leitura":(READING_MISSIONS.includes(m.id)?"Escolher artigo":"Ler artigo")}</button>`;
  if(READING_MISSIONS.includes(m.id)) return `<button class="btn btn-primary" data-mission-action="${m.id}">${m.progress>0?"Continuar leitura":"Escolher conteúdo"}</button>`;
  if(CONTENT_LIBRARY[m.id]) return `<button class="btn btn-primary" data-mission-action="${m.id}">${m.progress>0?"Continuar":"Abrir atividade"}</button>`;
  if(INVITE_META[m.id]) return `<button class="btn btn-primary" data-mission-action="${m.id}">${m.progress>0?"Continuar convites":"Convidar"}</button>`;
  if(REGISTER_META[m.id]){ const lab = STAGE_ACTION[REG_STAGE[m.id]||"identificado"]; return `<button class="btn btn-primary" data-mission-action="${m.id}">${m.progress>0?lab[1]:lab[0]}</button>`; }
  return `<button class="btn btn-ghost" disabled>Em breve</button>`;
}
function missionProgLabel(m){
  if(m.status==="done" && PERIOD_CATS[m.cat]) return `Concluída · ${renewText(m.cat)}`;
  if(m.status==="locked") return "Bloqueada até a missão anterior";
  if(m.status==="locked-level") return `Desbloqueia no nível ${m.minLevel}`;
  const unit = m.unit||"";
  return `${m.progress}${unit} de ${m.goal}${unit}`;
}
/* Condições para concluir cada missão, escritas em linguagem simples */
function missionReqText(m){
  const out = [], rule = REG_RULES[m.id];
  if(rule){
    out.push(acceptText(rule));
    if(rule.distinct) out.push(`Precisa de ${m.goal} categorias diferentes: dois itens da mesma categoria contam uma vez.`);
    const stage = REG_STAGE[m.id];
    if(stage==="entregue") out.push("Exige ponto de coleta e código do comprovante.");
    else if(stage==="separado") out.push("O item precisa estar separado, pronto para levar ao ponto de coleta.");
    if(m.chain && !rule.retro) out.push("Só vale registro feito depois que esta etapa abrir.");
  }else if(CONTEUDOS_READING.includes(m.id)){
    out.push("Leia um artigo da aba Conteúdos até o final, ficando na página pelo tempo mínimo de leitura." + (READING_MISSIONS.includes(m.id) ? " Só artigos contam, e cada artigo vale uma vez no período." : ""));
  }else if(READING_MISSIONS.includes(m.id)){
    out.push(`Só artigos contam (quizzes não). Cada conteúdo vale uma vez no período. Leia até o final do texto, com tempo mínimo de leitura (a partir de ${READ_MIN_SECONDS} s, conforme o tamanho).`);
  }else if(CONTENT_LIBRARY[m.id]){
    const c = CONTENT_LIBRARY[m.id];
    out.push(c.type==="quiz" ? `Acerte todas as ${c.questions.length} perguntas (até ${QUIZ_MAX_TRIES} tentativas por dia).`
           : (c.needsShare ? `Leia o texto até o final (mínimo de ${readGateInfo(c).seconds} s) e compartilhe com alguém.` : `Leia o texto até o final (mínimo de ${readGateInfo(c).seconds} s) e confirme a leitura.`));
  }else if(INVITE_META[m.id]){
    out.push("Cada pessoa convidada conta uma vez; confirme o nome de usuário dela.");
  }
  return out.join(" ");
}
function missionCardHtml(m){
  const isDone = m.status==="done";
  const isLocked = m.status==="locked" || m.status==="locked-level";
  const pct = missionProgressPct(m);
  const r = rewardShown(m), capped = !isDone && r.xp < m.xp;
  const req = (isLocked && m.chain) ? "" : missionReqText(m);
  return `<div class="mission-card ${isDone?'done':''}" data-mission-card="${m.id}">
      <div class="mission-top">
        <div><h3>${m.title}</h3><p>${m.desc}${m.rewardItem?` · <em>Recompensa: ${m.rewardItem}</em>`:""}</p></div>
        <div class="pts-stack"><span class="pts-pill ${capped?"capped":""}" ${capped?`title="Limite de XP: concluir agora rende só ${r.xp} XP"`:""}>+${r.xp} XP${capped?" (limite)":""}</span><span class="pts-pill eco">+${r.pts} pts</span></div>
      </div>
      ${req ? `<p class="mission-req">${req}</p>` : ""}
      <div class="bar-track"><div class="bar-fill" style="width:${isLocked?0:pct}%"></div></div>
      <div class="mission-bottom"><span class="prog-text">${missionProgLabel(m)}</span>${missionActionHtml(m)}</div>
    </div>`;
}
function pulseMissionCard(id){
  document.querySelectorAll(`[data-mission-card="${id}"]`).forEach(card=>{
    card.classList.remove("just-updated"); void card.offsetWidth; card.classList.add("just-updated");
  });
}

/* ---------------- Nível e XP ---------------- */
function checkLevelUp(){
  const need = XP_RULES.perLevel;                 // todo nível exige 1.260 XP (1 semana no limite máximo)
  state.user.xpToNext = need;
  let leveledUp=false;
  while(state.user.xp >= need){
    state.user.xp -= need;
    state.user.level += 1;
    leveledUp = true;
  }
  if(leveledUp){
    showToast(`Você subiu para o nível ${state.user.level}: ${levelTitle(state.user.level)}!`);
    launchConfetti();
    unlockLevelGated();
  }
}
function unlockLevelGated(){
  state.missions.forEach(m=>{
    if(m.status==="locked-level" && m.minLevel<=state.user.level) activateMission(m);
  });
}
function nextUnlockText(){
  const nextLvl = state.user.level+1;
  const miss = state.missions.filter(m=>m.minLevel===nextLvl).map(m=>m.title);
  const parts = [];
  if(miss.length) parts.push(`missões: ${miss.join(", ")}`);
  return parts.length ? `Ao chegar no nível ${nextLvl}, você desbloqueia ${parts.join(" · ")}.` : "";
}

/* Quando uma missão de registro abre (próxima etapa da Jornada), os registros que o usuário já fez e que ela aceita contam na hora. */
function retroCredit(m){
  const rule = REG_RULES[m.id]; if(!rule || !rule.retro) return 0;    // só as missões que aceitam histórico de forma explícita
  let gained = 0;
  [...state.history].reverse().forEach(e=>{                     // do mais antigo ao mais novo
    if(m.progress >= m.goal) return;
    if((e.adv||[]).some(a=>a.id===m.id)) return;
    if((STAGE_RANK[e.status]||1) < rule.min || !regRuleOk(rule, e)) return;
    let n;
    if(rule.distinct){ m.cats = m.cats || []; if(m.cats.includes(e.cat)) return; m.cats.push(e.cat); n = 1; }
    else n = Math.min(e.qty || 1, m.goal - m.progress);
    if(n<=0) return;
    m.progress += n; gained += n;
    if(!Array.isArray(e.adv)) e.adv = [];
    e.adv.push({ id:m.id, n, per:periodKeyFor(m), cat: rule.distinct ? e.cat : undefined, retro:true });
    e.pts = (e.pts||0) + Math.round(m.pts / m.goal) * n;
  });
  return gained;
}
function activateMission(m){
  if(!m || (m.status!=="locked" && m.status!=="locked-level")) return;
  m.status = "active";
  const gained = retroCredit(m);
  if(gained>0 && m.progress < m.goal) setTimeout(()=>showToast(`Seus registros anteriores contaram para "${m.title}": ${m.progress}/${m.goal}.`), 1700);
  if(m.progress >= m.goal) finalizeMissionCompletion(m);
}

/* ---------------- Concessão de XP e pontos ----------------
   Única porta de entrada: toda missão, de qualquer categoria, é paga por grantReward().
   - o XP concedido nunca passa do que ainda cabe no dia (180) e em qualquer janela de 7 dias (1.260);
   - o que passa do limite é descartado: não fica guardado para depois;
   - os pontos (EcoPontos) seguem a mesma proporção do XP concedido;
   - cada missão só é paga uma vez por período (única para as da Jornada, educativas etc.). */
const rewardKey = (m)=> m.id + "|" + (PERIOD_CATS[m.cat] ? periodKeyFor(m) : "unica");
const rewardFor = (m)=> rewardRows().find(e=>e.key===rewardKey(m));
function grantXp(base){
  const st = xpStatus();
  const xp = Math.max(0, Math.min(base, st.available));
  if(xp>0){ state.user.xp += xp; state.user.totalXp += xp; }
  return { xp, limited: xp < base };
}
function grantReward(m){
  const key = rewardKey(m);
  if(rewardRows().some(e=>e.key===key)) return { dup:true, xp:0, pts:0, limited:false };
  const base = (m.xp!==undefined ? m.xp : m.pts);
  const g = grantXp(base);
  const pts = base ? Math.round(m.pts * g.xp / base) : m.pts;
  state.points += pts;
  if(!Array.isArray(state.rewardLog)) state.rewardLog = [];
  state.rewardLog.push({ key, id:m.id, title:m.title, cat:m.cat, per:key.split("|")[1], d:todayISO(), t:nowTs(), base, xp:g.xp, pts, limited:g.limited });
  return { dup:false, xp:g.xp, pts, limited:g.limited };
}
/* o que a missão rende se for concluída agora (igual ao que grantReward concede) */
function rewardShown(m){
  const paid = rewardFor(m);
  if(m.status==="done") return (paid && !paid.legacy) ? { xp:paid.xp, pts:paid.pts } : { xp:m.xp, pts:m.pts };
  if(paid) return { xp:0, pts:0 };
  const x = Math.min(m.xp, xpStatus().available);
  return { xp:x, pts: m.xp ? Math.round(m.pts * x / m.xp) : m.pts };
}

function finalizeMissionCompletion(m){
  if(!m || m.status==="done") return;            // conclusão já processada: nada é pago de novo (clique duplo, repetição)
  recordActivity();
  m.status = "done";
  const r = grantReward(m);
  if(!r.dup) state.user.missionsDone = (state.user.missionsDone||0) + 1;
  if(!Array.isArray(state.user.doneIds)) state.user.doneIds = [];
  if(!state.user.doneIds.includes(m.id)) state.user.doneIds.push(m.id);          // missões diferentes já concluídas (renovações não repetem)
  const st = xpStatus();
  let msg;
  if(r.dup) msg = `Missão concluída. A recompensa de “${m.title}” já tinha sido recebida.`;
  else if(r.xp===0) msg = `Missão concluída, mas o limite de XP ${st.dayLeft===0 ? "de hoje" : "dos últimos 7 dias"} já foi atingido: nenhum XP concedido${r.pts ? ` · +${r.pts} pts` : ""}. Você pode continuar registrando itens.`;
  else msg = `Missão concluída! +${r.xp} XP · +${r.pts} pts${r.limited ? " (limitado pelo teto de XP; o restante não é guardado)" : ""}${m.rewardItem ? " · "+m.rewardItem : ""}`;
  showToast(msg);
  launchConfetti();
  if(m.chain){
    const next = state.missions.find(x=>x.chain===m.chain && x.order===m.order+1);
    if(next){
      activateMission(next);
    }else{
      const idx = JTRAILS.findIndex(t=>t.key===m.chain);          // fim do nível: libera o próximo
      if(idx>=0 && idx<JTRAILS.length-1){
        const first = state.missions.find(x=>x.chain===JTRAILS[idx+1].key && x.order===1);
        activateMission(first);
        setTimeout(()=>showToast(`Nível ${idx+2} liberado: ${JTRAILS[idx+1].name}`), 1200);
      }
    }
    const lv = JTRAILS.findIndex(t=>t.key===m.chain);
    if(lv>=0){ journeySel = null; journeyLevel = lv+1; }
  }
  checkLevelUp();
}
function onContentCompleted(contentId){
  const item = CONTENT_LIBRARY[contentId];
  if(!item) return;
  recordActivity();
  /* a conclusão só vale para a missão a que o conteúdo pertence */
  if(item.missionId){
    const m = state.missions.find(x=>x.id===item.missionId);
    if(m && m.status==="active"){ m.progress = m.goal; finalizeMissionCompletion(m); }
  }
  /* missões de leitura: só ARTIGOS contam (um quiz concluído não soma leitura).
     A diária conta 1 leitura por conteúdo a cada dia, a semanal 1 por semana; as demais, só a 1ª vez. */
  if(!state.reads) state.reads = { day:[], week:[] };
  const R = state.reads, firstEver = !state.readArticles.includes(contentId);
  if(item.type==="article"){
    READING_MISSIONS.forEach(rid=>{
      const rm = state.missions.find(x=>x.id===rid);
      if(!rm || rm.status!=="active") return;
      const counts = rm.cat==="diarias" ? !R.day.includes(contentId) : (rm.cat==="semanais" ? !R.week.includes(contentId) : firstEver);
      if(!counts) return;
      rm.progress = Math.min(rm.goal, rm.progress + 1);
      if(rm.progress >= rm.goal) finalizeMissionCompletion(rm);
    });
  }
  if(firstEver) state.readArticles.push(contentId);          // o selo Curioso Verde conta artigos e quizzes
  if(!R.day.includes(contentId)) R.day.push(contentId);
  if(!R.week.includes(contentId)) R.week.push(contentId);
  save(); renderAll();
  if(item.missionId) pulseMissionCard(item.missionId);
}
function openMissionAction(id){
  const m = state.missions.find(x=>x.id===id);
  if(!m || m.status!=="active") return;
  if(CONTEUDOS_READING.includes(id)){ startConteudosReading(id); return; }
  if(READING_MISSIONS.includes(id)){ openReadingChooser(id); return; }
  if(CONTENT_LIBRARY[id]){ openModalWithContent(id); return; }
  if(INVITE_META[id]){ openInviteModal(id); return; }
  if(REGISTER_META[id]){ openRegisterModal(id); return; }
  showToast("Esta missão ainda não está disponível.");
}

/* ---------------- Missões (tab) ---------------- */
let activeMissionTab = "diarias";
function renderMissionTabs(){
  document.getElementById("missionTabs").innerHTML = TAB_ORDER.map(cat=>{
    const on = cat===activeMissionTab;
    return `<button type="button" class="tab ${on?'active':''}" data-tab="${cat}" role="tab" id="mtab-${cat}" aria-selected="${on}" aria-controls="missionList" tabindex="${on?0:-1}">${CAT_LABELS[cat]}</button>`;
  }).join("");
  document.getElementById("missionList").setAttribute("aria-labelledby", "mtab-"+activeMissionTab);
}
/* setas, Home e End trocam de aba (padrão WAI-ARIA); o foco acompanha a aba ativa */
document.getElementById("missionTabs").addEventListener("keydown", e=>{
  const keys = ["ArrowLeft","ArrowRight","Home","End"];
  if(!keys.includes(e.key)) return;
  e.preventDefault();
  let i = TAB_ORDER.indexOf(activeMissionTab);
  if(e.key==="ArrowRight") i = (i+1) % TAB_ORDER.length;
  else if(e.key==="ArrowLeft") i = (i-1+TAB_ORDER.length) % TAB_ORDER.length;
  else if(e.key==="Home") i = 0; else i = TAB_ORDER.length-1;
  activeMissionTab = TAB_ORDER[i];
  renderMissionTabs(); renderMissionList();
  document.getElementById("mtab-"+activeMissionTab).focus();
});
function renderMissionList(){
  const list = state.missions.filter(m=>m.cat===activeMissionTab);
  const note = (PERIOD_NOTE[activeMissionTab] ? `<p class="period-note">${PERIOD_NOTE[activeMissionTab]}</p>` : "") + xpMeterHtml();
  document.getElementById("missionList").innerHTML = note + (list.map(missionCardHtml).join("") || `<p class="empty-note">Nenhuma missão nesta categoria ainda.</p>`);
}
/* Curadoria do "Em destaque": o próximo passo da Jornada, a missão mais perto de acabar, a melhor do dia, a melhor do mês,
   o desafio da semana e a da Turtly, nessa ordem, sem repetir, até 4. O que faltar completa pelo maior XP. */
function pickHighlights(){
  const act = state.missions.filter(m=>m.status==="active");
  const out = [], used = new Set();
  const take = (m, reason)=>{ if(m && !used.has(m.id) && out.length<4){ used.add(m.id); out.push({m, reason}); } };
  const byXp = (a,b)=> b.xp-a.xp;
  take(act.filter(m=>m.chain).sort((a,b)=> a.chain<b.chain?-1 : a.chain>b.chain?1 : a.order-b.order)[0], "Próximo passo da Jornada");
  take(act.filter(m=>!m.chain && m.progress>0 && m.progress/m.goal>=.5).sort((a,b)=> b.progress/b.goal - a.progress/a.goal || byXp(a,b))[0], "Quase lá");
  take(act.filter(m=>m.cat==="diarias").sort(byXp)[0], "Missão do dia");
  take(act.filter(m=>m.cat==="mensais").sort(byXp)[0], "Maior recompensa do mês");
  take(act.filter(m=>m.cat==="semanais").sort(byXp)[0], "Desafio da semana");
  take(act.filter(m=>m.cat==="turtly").sort(byXp)[0], "Desafio da Turtly");
  act.filter(m=>!m.chain).sort(byXp).forEach(m=>take(m, "Em alta"));
  return out;
}
function renderHighlightMissions(){
  const picks = pickHighlights();
  document.getElementById("highlightMissions").innerHTML = picks.map(({m,reason})=>
    missionCardHtml(m).replace('<div class="mission-top">', `<span class="feat-tag">${reason}</span><div class="mission-top">`)).join("")
    || `<p class="empty-note">Você concluiu todas as missões em destaque. Confira novas em "Missões".</p>`;
}

/* ---------------- Painel de nível / selos ---------------- */
const UNLOCK_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9.500" rx="2.600" fill="#fff" stroke="none"/><path d="M8 11V7.500a4 4 0 0 1 7.700-1.500"/></svg>`;
function renderLevelPanel(){
  const u = state.user;
  const pct = Math.min(100, Math.round((u.xp / u.xpToNext) * 100));
  document.getElementById("lvlOrbHome").innerHTML = levelEmblem(u.level);
  document.getElementById("lvlTagHome").textContent = `NÍVEL ${u.level}`;
  document.getElementById("lvlTitleHome").textContent = levelTitle(u.level);
  document.getElementById("lvlNextHome").textContent = `Faltam ${fmtN(Math.max(0,u.xpToNext - u.xp))} XP para o nível ${u.level+1}`;
  document.getElementById("xpNowHome").textContent = `${u.xp.toLocaleString("pt-BR")} XP`;
  document.getElementById("xpMaxHome").textContent = `${u.xpToNext.toLocaleString("pt-BR")} XP`;
  document.getElementById("xpFillHome").style.width = pct+"%"; if(window.EcoFX) EcoFX.growGlow(document.getElementById("xpFillHome"), pct);
  const limEl = document.getElementById("xpLimitsHome");
  if(limEl){ const s = xpStatus(), ln = limitNote(); limEl.innerHTML = `<span>XP hoje <b>${s.day}/${XP_RULES.dailyCap}</b></span><span>Últimos 7 dias <b>${fmtN(s.week)}/${fmtN(XP_RULES.weeklyCap)}</b></span>` + (ln ? `<p class="limit-note" role="status">${ln}</p>` : `<p class="xp-pace">Cada nível exige ${fmtN(XP_RULES.perLevel)} XP. Com o limite de ${fmtN(XP_RULES.weeklyCap)} XP em 7 dias, são pelo menos ${Math.ceil(XP_RULES.perLevel / XP_RULES.dailyCap)} dias por nível.</p>`); }
  const done = state.missions.filter(m=>m.status==="done").length;
  const lastDone = [...state.missions].reverse().find(m=>m.status==="done");
  const chip = (ico, text)=>`<div class="lvl-chip"><i>${statIcon(ico)}</i><span>${text}</span></div>`;
  document.getElementById("recentLineHome").innerHTML =
    (lastDone ? chip("medal", lastDone.title) : "") +
    chip("flame", u.streak>0 ? `Sequência de ${u.streak} ${u.streak===1?"dia":"dias"}` : "Faça algo hoje para iniciar a sequência") +
    chip("target", `${done} ${done===1?"missão concluída":"missões concluídas"}`) +
    (state.ranking.length ? chip("trophy", `${rankPosOf(state)}º lugar no ranking (demonstrativo)`) : "");
  const next = nextUnlockText();
  document.getElementById("nextUnlockHome").innerHTML = next ? `<i>${UNLOCK_ICON}</i><span>${next}</span>` : "";
}
const LOCK_CHIP = `<span class="lock-chip"><svg viewBox="0 0 16 16" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round"><rect x="3" y="7" width="10" height="7" rx="2" fill="#fff" stroke="none"/><path d="M5.2 7V5.2a2.8 2.8 0 0 1 5.6 0V7"/></svg></span>`;
function renderBadges(){
  const unlockedIds = new Set(state.badges.filter(b=>b.unlocked).map(b=>b.id));
  document.getElementById("badgeCount").textContent = `${unlockedIds.size} de ${BADGE_DEFS.length}`;
  document.getElementById("badgeGridHome").innerHTML = BADGE_TIER_ORDER.map((key,ti)=>{
    const t = BADGE_TIERS[key], list = BADGE_DEFS.filter(d=>d.tier===key), open = badgeTierOpen(key);
    const gate = open ? "" : `<span class="tier-gate">Conquiste todos os selos do nível ${BADGE_TIERS[BADGE_TIER_ORDER[ti-1]].label} para liberar</span>`;
    return `<div class="badge-tier ${key} ${open?"":"closed"}"><span class="tier-label">${t.label}<em>${t.range}</em>${gate}</span><div class="badge-row">${list.map(d=>{
      const on = unlockedIds.has(d.id);
      return `<div class="badge ${on?"unlocked":"locked"}" title="${d.name}: ${d.desc}${open?"":" (libera depois do nível anterior)"}"><div class="badge-art">${badgeArt(d)}${on?"":LOCK_CHIP}</div><b>${d.name}</b><span class="badge-state">${on?"Conquistado":(open?"Bloqueado":"Aguardando nível")}</span></div>`;
    }).join("")}</div></div>`;
  }).join("");
  const next = BADGE_DEFS.find(d=>!unlockedIds.has(d.id) && badgeTierOpen(d.tier));
  document.getElementById("badgeNext").innerHTML = next
    ? `<b>Próximo selo:</b> ${next.name} — ${next.desc}`
    : `<b>Coleção completa!</b> Você conquistou todos os selos.`;
}

/* ---------------- Início: prévias de cada área ---------------- */
/* ---------------- Modal genérico ---------------- */
let modalReturnFocus = null;
const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
function modalEl(){ return document.querySelector("#activityBackdrop .activity-modal"); }
function openModalBackdrop(){
  const backdrop = document.getElementById("activityBackdrop");
  if(!backdrop.classList.contains("open")) modalReturnFocus = document.activeElement;
  backdrop.classList.add("open"); backdrop.setAttribute("aria-hidden","false");
  const app = document.querySelector(".app"); if(app) app.inert = true;      // o resto da página fica fora do alcance do teclado e do leitor de tela
  const m = modalEl(); if(m) m.focus({preventScroll:true});                   // o foco vai para dentro da janela
}
function closeActivity(){
  stopReadGate();
  const backdrop = document.getElementById("activityBackdrop");
  backdrop.classList.remove("open"); backdrop.setAttribute("aria-hidden","true");
  const app = document.querySelector(".app"); if(app) app.inert = false;
  const back = modalReturnFocus; modalReturnFocus = null;
  if(back && document.contains(back) && back.focus){ back.focus({preventScroll:true}); }
  else { const main = document.querySelector("main"); if(main){ main.setAttribute("tabindex","-1"); main.focus({preventScroll:true}); } }
}
/* Esc fecha a janela e Tab fica preso dentro dela */
document.addEventListener("keydown", e=>{
  const backdrop = document.getElementById("activityBackdrop");
  if(!backdrop.classList.contains("open")) return;
  if(e.key==="Escape"){ e.preventDefault(); closeActivity(); return; }
  if(e.key!=="Tab") return;
  const m = modalEl();
  const items = [...m.querySelectorAll(FOCUSABLE)].filter(el=>el.offsetParent!==null);
  if(!items.length){ e.preventDefault(); m.focus(); return; }
  const first = items[0], last = items[items.length-1], active = document.activeElement;
  if(e.shiftKey && (active===first || active===m)){ e.preventDefault(); last.focus(); }
  else if(!e.shiftKey && active===last){ e.preventDefault(); first.focus(); }
});
document.getElementById("activityClose").addEventListener("click",closeActivity);
document.getElementById("activityBackdrop").addEventListener("click",e=>{if(e.target.id==="activityBackdrop")closeActivity();});

const QUIZ_MAX_TRIES = 3;
function shuffledIdx(n){
  const a = Array.from({length:n}, (_,i)=>i);
  for(let i=n-1;i>0;i--){ const j = Math.floor(Math.random()*(i+1)); [a[i],a[j]] = [a[j],a[i]]; }
  return a;
}
function quizTriesLeft(id){
  const t = (state.quizTries || {})[id];
  return (!t || t.d!==todayISO()) ? QUIZ_MAX_TRIES : Math.max(0, QUIZ_MAX_TRIES - t.n);
}
function quizUseTry(id){
  if(!state.quizTries) state.quizTries = {};
  const today = todayISO();
  if(!state.quizTries[id] || state.quizTries[id].d!==today) state.quizTries[id] = { d:today, n:0 };
  state.quizTries[id].n++;
}
/* ---------------- Leitura de artigos: tempo mínimo + chegar ao fim do texto ----------------
   O botão de concluir só libera depois que (1) a pessoa ficou na leitura pelo tempo mínimo, contando só
   enquanto a aba está visível e a janela aberta, e (2) chegou ao final do texto. Ajuste aqui os tempos. */
var READ_MIN_SECONDS = 20;          // piso, em segundos, para qualquer artigo
var READ_SECONDS_PER_WORD = 0.3;    // ~200 palavras por minuto: textos maiores pedem mais tempo
var readGateTimer = null;
function readGateInfo(item){
  const text = (item.paragraphs || []).join(" ") + " " + (item.callout || "");
  const words = text.replace(/<[^>]*>/g, " ").trim().split(/\s+/).filter(Boolean).length;
  return { words, seconds: Math.max(READ_MIN_SECONDS, Math.ceil(words * READ_SECONDS_PER_WORD)) };
}
function stopReadGate(){ if(readGateTimer){ clearInterval(readGateTimer); readGateTimer = null; } }
function renderContentBody(contentId, ctx){
  const item = CONTENT_LIBRARY[contentId];
  stopReadGate();
  document.getElementById("activityEyebrow").textContent = item.tag;
  document.getElementById("activityTitle").textContent = item.title;
  const body = document.getElementById("activityBody");
  if(item.type==="article"){
    const share = !!item.needsShare;
    const need = readGateInfo(item).seconds;
    const fromMission = (ctx && ctx.fromMission) || "";
    body.innerHTML = `<div class="read-gate" id="readGate">
        <div class="read-gate-top"><span id="readGateLabel">Leia com atenção: faltam ${need} s</span><span class="read-gate-time" id="readGateTime">0 / ${need} s</span></div>
        <div class="read-gate-bar" id="readGateBar" role="progressbar" aria-label="Tempo de leitura" aria-valuemin="0" aria-valuemax="${need}" aria-valuenow="0"><i id="readGateFill"></i></div>
      </div>
      <div class="article-body">${item.paragraphs.map(p=>`<p>${p}</p>`).join("")}<div class="article-callout">${item.callout}</div></div>
      <div class="read-end" id="readEnd" aria-hidden="true"></div>
      ${share ? `<div class="share-step"><p class="reg-hint" style="margin:0 0 10px">Para concluir a missão, compartilhe este conteúdo com alguém.</p><button type="button" class="btn btn-outline btn-block" id="shareBtn">Compartilhar com alguém</button><div class="invite-note" id="shareNote" role="status" aria-live="polite" style="margin-top:10px"></div></div>` : ""}
      <ul class="read-check" aria-label="Condições para concluir">
        <li id="chkTime">Ficar na leitura por pelo menos ${need} s</li>
        <li id="chkEnd">Chegar ao final do texto</li>
        ${share ? `<li id="chkShare">Compartilhar com alguém</li>` : ""}
      </ul>
      <p class="sr-only" id="readLive" role="status" aria-live="polite"></p>
      <div class="modal-footer">${fromMission ? `<button type="button" class="btn btn-outline" id="readBack">Escolher outro conteúdo</button>` : ""}<button class="btn btn-primary" data-finish-content="${contentId}" disabled>${share?"Concluir missão":"Concluir leitura"}</button></div>`;
    const finish = body.querySelector("[data-finish-content]");
    const byId = id => document.getElementById(id);
    const fill = byId("readGateFill"), bar = byId("readGateBar"), label = byId("readGateLabel"), timeEl = byId("readGateTime");
    const live = byId("readLive"), endEl = byId("readEnd"), chkTime = byId("chkTime"), chkEnd = byId("chkEnd"), chkShare = byId("chkShare");
    let activeMs = 0, last = performance.now(), born = last, openedOnce = false;
    let timeOk = false, endOk = false, shared = !share, ready = false;
    /* o fim do texto conta quando o marcador final entra na área visível da janela */
    function endVisible(){
      const mo = modalEl();
      if(!mo || !endEl || !endEl.isConnected) return false;
      return endEl.getBoundingClientRect().bottom <= mo.getBoundingClientRect().bottom + 1;
    }
    function update(){
      const shown = Math.min(need, Math.floor(activeMs / 1000));
      timeOk = activeMs >= need * 1000;
      timeEl.textContent = shown + " / " + need + " s";
      fill.style.width = Math.min(100, activeMs / (need * 1000) * 100).toFixed(1) + "%";
      bar.setAttribute("aria-valuenow", String(shown));
      chkTime.classList.toggle("ok", timeOk);
      chkEnd.classList.toggle("ok", endOk);
      if(chkShare) chkShare.classList.toggle("ok", shared);
      label.textContent = !timeOk ? "Leia com atenção: faltam " + (need - shown) + " s"
        : !endOk ? "Tempo mínimo cumprido. Role até o final do texto."
        : !shared ? "Leitura concluída. Falta compartilhar com alguém."
        : "Leitura concluída. Você já pode finalizar.";
      const can = timeOk && endOk && shared;
      if(!finish.dataset.busy) finish.disabled = !can;
      if(can && !ready){ ready = true; live.textContent = "Leitura concluída. O botão para finalizar está liberado."; }
    }
    function tick(){
      if(!finish.isConnected){ stopReadGate(); return; }               // a leitura foi trocada por outra tela
      const now = performance.now(), dt = Math.min(now - last, 1000); last = now;
      const bd = document.getElementById("activityBackdrop");
      if(bd.classList.contains("open")) openedOnce = true;
      else { if(openedOnce || now - born > 5000) stopReadGate(); return; }   // janela fechada: encerra; ao reabrir, recomeça
      if(!document.hidden){                                              // aba em segundo plano não conta tempo
        activeMs += dt;
        if(!endOk && endVisible()) endOk = true;
      }
      update();
    }
    finish.addEventListener("click",()=>{
      if(finish.disabled || finish.dataset.busy) return;
      if(!(timeOk && endOk && shared)) return;                          // conferência final, mesmo que o botão seja habilitado à força
      finish.dataset.busy = "1"; stopReadGate(); onContentCompleted(contentId); closeActivity();
    });
    const backBtn = byId("readBack");
    if(backBtn) backBtn.addEventListener("click",()=>{ stopReadGate(); openReadingChooser(fromMission); });
    update();
    readGateTimer = setInterval(tick, 250);
    if(share){
      const note = document.getElementById("shareNote");
      const text = `${item.title}: ${item.teaser}`, url = `https://ecoclick.app/convite/${state.user.referralCode}`;
      document.getElementById("shareBtn").addEventListener("click", async ()=>{
        let ok = false, native = false;
        if(navigator.share){
          try{ await navigator.share({ title:item.title, text, url }); ok = true; native = true; }
          catch(e){ if(e && e.name==="AbortError"){ note.classList.add("is-err"); note.textContent = "Compartilhamento cancelado. Tente de novo."; return; } }
        }
        if(!ok){
          try{ await navigator.clipboard.writeText(`${text} ${url}`); ok = true; note.classList.remove("is-err"); note.textContent = "Texto copiado. Cole em uma conversa ou rede social e depois conclua a missão."; }
          catch(e){ note.classList.add("is-err"); note.textContent = "Não foi possível copiar. Envie este texto a alguém: " + text; ok = true; }
        }
        if(native){ note.classList.remove("is-err"); note.textContent = "Compartilhado! Agora é só concluir a missão."; }
        if(ok){ shared = true; update(); }
      });
    }
    return;
  }
  const left = quizTriesLeft(contentId);
  const msg = ctx && ctx.msg ? ctx.msg : "";
  if(left<=0){
    body.innerHTML = `<div class="quiz-result" id="quizResult" role="status" tabindex="-1" style="margin:0">${msg || `Você usou as ${QUIZ_MAX_TRIES} tentativas de hoje neste quiz.`} Releia os conteúdos sobre o tema e volte amanhã.</div>`;
    return;
  }
  const wrong = (ctx && ctx.wrong) || [];
  body.innerHTML = `<div class="quiz-result" id="quizResult" role="status" tabindex="-1" style="margin:0 0 15px"${msg ? "" : " hidden"}>${msg}</div>
    <div class="quiz-list">${item.questions.map((q,i)=>`
      <div class="quiz-question" data-q="${i}"><p>${i+1}. ${q.q}</p>${wrong.includes(i) ? `<span class="quiz-flag">Revise esta pergunta</span>` : ""}<div class="quiz-options">${shuffledIdx(q.options.length).map(j=>`<button type="button" class="quiz-option" data-q="${i}" data-a="${j}" aria-pressed="false">${q.options[j]}</button>`).join("")}</div></div>`).join("")}</div>
    <p class="reg-hint" style="margin-top:14px">Você tem ${left} ${left===1?"tentativa":"tentativas"} hoje neste quiz. As alternativas mudam de ordem a cada tentativa.</p>
    <div class="modal-footer"><button class="btn btn-primary" id="submitQuiz">Ver resultado</button></div>`;
  body.querySelectorAll(".quiz-option").forEach(btn=>btn.addEventListener("click",()=>{
    body.querySelectorAll(`.quiz-option[data-q="${btn.dataset.q}"]`).forEach(x=>{ x.classList.remove("selected"); x.setAttribute("aria-pressed","false"); });
    btn.classList.add("selected"); btn.setAttribute("aria-pressed","true");
  }));
  document.getElementById("submitQuiz").addEventListener("click",()=>{
    const result = document.getElementById("quizResult");
    const answers = item.questions.map((q,i)=>{
      const selected = body.querySelector(`.quiz-option[data-q="${i}"].selected`);
      return selected ? Number(selected.dataset.a) : -1;
    });
    if(answers.includes(-1)){                                 // pergunta sem resposta não gasta tentativa
      result.hidden = false; result.className = "quiz-result"; result.style.margin = "0 0 15px";
      result.textContent = "Responda todas as perguntas antes de ver o resultado.";
      result.focus(); return;
    }
    const wrongIdx = answers.map((a,i)=> a===item.questions[i].answer ? -1 : i).filter(i=>i>=0);
    const score = item.questions.length - wrongIdx.length;
    quizUseTry(contentId); save();
    if(!wrongIdx.length){
      result.hidden = false; result.className = "quiz-result"; result.style.margin = "0 0 15px";
      result.textContent = `Tudo certo: ${score}/${item.questions.length}. Missão concluída!`;
      body.querySelectorAll(".quiz-option").forEach(o=>{ o.disabled = true; if(o.classList.contains("selected")) o.classList.add("correct"); });
      document.getElementById("submitQuiz").disabled = true;
      onContentCompleted(contentId);
      setTimeout(closeActivity,900);
    }else{
      /* não mostra a resposta certa: marca só as perguntas erradas e sorteia a ordem de novo */
      const l = quizTriesLeft(contentId);
      const m2 = `Você acertou ${score}/${item.questions.length}. ` + (l>0 ? `Revise o conteúdo e tente de novo: restam ${l} ${l===1?"tentativa":"tentativas"} hoje.` : `Suas ${QUIZ_MAX_TRIES} tentativas de hoje acabaram.`);
      renderContentBody(contentId, { wrong: wrongIdx, msg: m2 });
      const r2 = document.getElementById("quizResult"); if(r2) r2.focus();
    }
  });
}
function openModalWithContent(contentId, ctx){ renderContentBody(contentId, ctx); openModalBackdrop(); }

function openReadingChooser(missionId){
  const m = state.missions.find(x=>x.id===missionId);
  const free = ([,it])=>{ const mm = it.missionId && state.missions.find(x=>x.id===it.missionId); return !(mm && (mm.status==="locked" || mm.status==="locked-level")); };
  const R = state.reads || { day:[], week:[] };
  const seen = (m && m.cat==="diarias") ? R.day : ((m && m.cat==="semanais") ? R.week : state.readArticles);
  const unread = Object.entries(CONTENT_LIBRARY).filter(([id,it])=>it.type==="article" && !seen.includes(id)).filter(free);
  const pool = unread.length ? unread : Object.entries(CONTENT_LIBRARY).filter(([,it])=>it.type==="article").filter(free);
  const picks = pool.slice(0,2);
  document.getElementById("activityEyebrow").textContent = "Conteúdo recomendado";
  document.getElementById("activityTitle").textContent = m ? m.title : "Escolha uma leitura";
  const body = document.getElementById("activityBody");
  body.innerHTML = `
    <p class="reg-hint">${m ? m.desc : ""} ${unread.length ? "Escolha um dos dois conteúdos abaixo. Para a leitura valer, leia até o final do texto e fique na página pelo tempo mínimo indicado." : "Você já leu todos os conteúdos deste período; reler não soma progresso."}</p>
    <div class="recommend-grid">
      ${picks.map(([id,it])=>`<div class="recommend-card"><span class="tag-cat">${it.tag}</span><h4>${it.title}</h4><p>${it.teaser}</p><p class="read-meta">Leitura mínima: ${readGateInfo(it).seconds} s</p><button class="btn btn-primary btn-block" data-open-content="${id}" data-from-mission="${missionId}">Ler agora</button></div>`).join("")}
    </div>`;
  openModalBackdrop();
}

/* Pesos são ESTIMATIVAS por faixa de tamanho (kg). "Não sei" registra o item sem peso. */
const NO_SIZE = { id:"x", label:"Não sei informar", min:null, max:null };
const OTHER_SIZES = [
  { id:"s", label:"Pequeno", hint:"até ~300 g · ex.: controle, fone", min:0.05, max:0.3 },
  { id:"m", label:"Médio",   hint:"300 g a 1 kg · ex.: roteador, teclado", min:0.3, max:1 },
  { id:"l", label:"Grande",  hint:"1 a 3 kg · ex.: impressora compacta", min:1, max:3 },
];
const REG_ITEMS = [
  {id:"phone",   name:"Celular",        cat:"Eletrônico",      icon:"phone",   tone:"sky",
    sizes:[{id:"s",label:"Compacto / de teclado",min:0.08,max:0.15},{id:"m",label:"Smartphone",min:0.15,max:0.25},{id:"l",label:"Tablet ou aparelho grande",min:0.3,max:0.7}]},
  {id:"battery", name:"Pilhas",         cat:"Bateria",         icon:"battery", tone:"mint",
    sizes:[{id:"s",label:"1 a 4 pilhas pequenas (AA/AAA)",min:0.02,max:0.1},{id:"m",label:"Várias pilhas ou bateria média",min:0.1,max:0.3},{id:"l",label:"Bateria grande (notebook, power bank)",min:0.3,max:0.8}]},
  {id:"cable",   name:"Carregador",     cat:"Eletrônico",      icon:"cable",   tone:"aqua",
    sizes:[{id:"s",label:"1 cabo ou carregador de celular",min:0.05,max:0.15},{id:"m",label:"Carregador de notebook",min:0.3,max:0.6},{id:"l",label:"Vários cabos e carregadores",min:0.3,max:0.8}]},
  {id:"radio",   name:"Rádio",          cat:"Eletrônico",      icon:"radio",   tone:"indigo",
    sizes:[{id:"s",label:"Pequeno / de bolso",min:0.2,max:0.5},{id:"m",label:"Rádio ou caixa de som média",min:0.5,max:1.5},{id:"l",label:"Aparelho de som grande",min:1.5,max:4}]},
  {id:"blender", name:"Liquidificador", cat:"Eletrodoméstico", icon:"blender", tone:"sky",
    sizes:[{id:"s",label:"Pequeno (mixer, ferro de passar)",min:0.5,max:1.2},{id:"m",label:"Médio (liquidificador)",min:1.2,max:2.5},{id:"l",label:"Grande (batedeira, ventilador)",min:2,max:5}]},
  {id:"other",   name:"Outro item",     cat:"Eletrônico",      icon:"recycle", tone:"mint", sub:"Digite o nome", sizes:OTHER_SIZES},
];
/* em que etapa está o item que cada missão pede: só "entregue" (com comprovante) conta como reciclado */
const REG_STAGE = { j2:"identificado", d2:"identificado", d3:"separado", d4:"separado", k2:"separado", t2:"separado", t4:"separado",
  j4:"entregue", k4:"entregue", m1:"entregue", m2:"entregue", m3:"entregue", m4:"entregue", m5:"entregue", w1:"entregue", w3:"entregue", l3:"entregue" };
/* Mesmos três verbos em todo o site: identificar, separar, entregar */
const STAGE_VERB    = { identificado:"Identificar item", separado:"Separar item", entregue:"Entregar item" };
const STAGE_CONFIRM = { identificado:"Confirmar identificação", separado:"Confirmar separação", entregue:"Confirmar entrega" };
const STAGE_DONE    = { identificado:"Item identificado", separado:"Item separado", entregue:"Entrega registrada" };
const STAGE_ACTION  = { identificado:["Identificar item","Continuar identificação"], separado:["Separar item","Continuar separação"], entregue:["Entregar item","Continuar entrega"] };
/* sem limite diário de registros; só evita toque duplo acidental (mesmo item, mesma missão, em poucos segundos) */
const REG_LIMITS = { dupWindowMs:3000 };
const REG_CHECK = `<i class="ro-check"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5.500 12.500l4.500 4.500L18.500 7.500"/></svg></i>`;
const sizeRange = (z)=> z.min==null ? "sem peso estimado" : `≈ ${hF(z.min)}–${hF(z.max)} kg`;
const normCode = (t)=> String(t).trim().toUpperCase().replace(/\s+/g," ");


/* Uma mesma entrega/registro vale para todas as missões que ela cumpre (sem registrar o item de novo para cada uma).
   min = etapa mínima (1 identificado, 2 separado, 3 entregue); items = tipo de item aceito; distinct = conta categorias diferentes */
const STAGE_RANK = { identificado:1, separado:2, entregue:3 };
/* Categorias oficiais do sistema: as mesmas do seletor de itens e do histórico */
const ALL_CATS = ["Eletrônico","Eletrodoméstico","Bateria"];
/* min = etapa mínima (1 identificado, 2 separado, 3 entregue)
   items = categorias aceitas: "eletronico" (eletrônicos e eletrodomésticos), "bateria" (só pilhas e baterias) ou "any" (as três)
   ids = (opcional) só estes itens do seletor, ex.: ["phone"] para uma missão que exige celular
   distinct = conta categorias diferentes, não unidades
   retro = registros feitos antes de a missão abrir também contam; sem isso, só vale registro feito com a missão aberta */
const REG_RULES = {
  j2:{min:1, items:"eletronico", retro:true}, d2:{min:1, items:"eletronico"},
  d3:{min:2, items:"eletronico"}, k2:{min:2, items:"bateria", retro:true}, t2:{min:2, items:"any", distinct:true},
  j4:{min:3, items:"eletronico"}, m2:{min:3, items:"eletronico"},
  k4:{min:3, items:"bateria"}, m3:{min:3, items:"bateria"}, m4:{min:3, items:"any", distinct:true},
  w1:{min:3, items:"any"}, l3:{min:3, items:"any"},
  d4:{min:2, items:"bateria"}, w3:{min:3, items:"bateria"}, m1:{min:3, items:"any"},
  m5:{min:3, items:"eletronico", ids:["phone"]}, t4:{min:2, items:"eletronico", ids:["cable"]},
};
const ruleCats = (rule)=> rule.cats || (rule.items==="bateria" ? ["Bateria"] : (rule.items==="eletronico" ? ["Eletrônico","Eletrodoméstico"] : ALL_CATS));
function guessItemId(name){
  const n = String(name||"").toLowerCase();
  if(/celular|smartphone|telefone/.test(n)) return "phone";
  if(/pilha|bateria/.test(n)) return "battery";
  if(/liquidificador|batedeira|ventilador|torradeira|ferro/.test(n)) return "blender";
  if(/cabo|carregador/.test(n)) return "cable";
  if(/r[áa]dio|caixa de som/.test(n)) return "radio";
  return "other";
}
const entryItemId = (e)=> e.itemId || guessItemId(e.item);
/* Confere se um registro vale para a missão: categoria real do item, item específico (quando a regra pede)
   e, se houver limite, peso por unidade. */
function regRuleOk(rule, entry){
  if(!rule) return true;
  if(!ruleCats(rule).includes(entry.cat)) return false;
  if(rule.ids && !rule.ids.includes(entryItemId(entry))) return false;
  if(rule.maxKg!=null){
    const q = entry.qty || 1, unit = entry.kgMax!=null ? entry.kgMax/q : null;     // "Não sei" não prova que o item é pequeno
    if(unit==null || unit > rule.maxKg + 1e-6) return false;
  }
  return true;
}
/* Quais itens do seletor a missão oferece */
function regItemOk(rule, it){
  const cats = it.id==="other" ? ALL_CATS : [it.cat];
  if(!cats.some(c=>ruleCats(rule).includes(c))) return false;
  if(rule.ids && !rule.ids.includes(it.id)) return false;
  return rule.maxKg==null || it.sizes.some(z=>z.max<=rule.maxKg);
}
function acceptText(rule){
  const t = rule.ids ? `Aceita somente: ${rule.ids.map(id=>((REG_ITEMS.find(i=>i.id===id)||{name:id}).name).toLowerCase()).join(", ")}.`
          : rule.items==="bateria" ? "Aceita somente pilhas e baterias."
          : rule.items==="eletronico" ? "Aceita eletrônicos e eletrodomésticos (pilhas e baterias não valem aqui)."
          : "Aceita itens de qualquer categoria.";
  if(rule.maxKg==null) return t;
  const kg = Math.round(rule.maxKg*1000);
  return rule.items==="any" ? `Aceita só itens pequenos, de até ${kg} g.` : `${t} Só itens de até ${kg} g.`;
}
/* Nome digitado em "Outro item": a categoria escolhida manda; o texto só passa por uma conferência básica */
function otherNameProblem(name, cat){
  const n = String(name||"").trim();
  if(n.length<3 || !/[a-zà-ú]{2}/i.test(n)) return "Digite o nome do item, com pelo menos 3 letras.";
  if(cat!=="Bateria" && /\b(pilhas?|baterias?)\b/i.test(n)) return "Pilhas e baterias devem ser registradas na categoria Bateria.";
  return "";
}
/* Comprovante de entrega: formato do código, ponto de coleta e reaproveitamento.
   Sem servidor isto não prova a entrega física: só barra registros claramente inválidos ou repetidos. */
function proofProblem(point, code, name, sizeLabel, ignoreId){
  const p = String(point||"").trim(), c = normCode(code);
  if(p.length<3 || !/[a-zà-ú]{3}/i.test(p)) return "Informe o nome do ponto de coleta onde você entregou o item.";
  if(!/^[A-Z0-9][A-Z0-9\-\/. ]{3,39}$/.test(c)) return "O código do comprovante deve ter de 4 a 40 caracteres: letras, números, espaço, hífen, barra ou ponto.";
  if(!/\d/.test(c)) return "O código do comprovante precisa ter pelo menos um número.";
  const flat = c.replace(/[^A-Z0-9]/g,"");
  if(/^(.)\1+$/.test(flat) || ["1234","12345","123456","1234567","12345678","123456789","TESTE","TEST"].includes(flat)) return "Esse código não parece um comprovante real. Confira o número impresso no recibo.";
  const others = state.history.filter(h=>h.id!==ignoreId && h.proof && h.proof.code===c);
  if(others.some(h=>String(h.proof.point||"").trim().toLowerCase()!==p.toLowerCase())) return "Esse comprovante já foi usado em outro ponto de coleta.";
  if(others.some(h=>String(h.item).toLowerCase()===String(name).toLowerCase() && h.size===sizeLabel)) return "Esse item já foi registrado com esse comprovante. Para itens iguais, use a quantidade.";
  return "";
}
/* Se o site definir window.EcoClickProofs = { verify(codigo, ponto) } (Promise de true ou { ok:false, reason }),
   a entrega só é aceita depois da confirmação do servidor. Sem isso, o registro fica com validated:false. */
async function proofVerify(p){
  const hook = window.EcoClickProofs;
  if(hook && typeof hook.verify==="function"){
    try{
      const r = await hook.verify(p.code, p.point);
      return (r===true || (r && r.ok)) ? { ok:true, validated:true } : { ok:false, reason:(r && r.reason) || "Não encontramos esse comprovante no ponto de coleta informado." };
    }catch(e){ return { ok:false, reason:"Não foi possível confirmar o comprovante agora. Tente de novo em instantes." }; }
  }
  return { ok:true, validated:false };
}
/* Avança todas as missões ativas que o registro cumpre ao passar da etapa `fromRank` para a atual.
   Guarda em entry.adv o que foi creditado (para recalcular depois). Quem conclui é o chamador. */
function applyEntryToMissions(entry, fromRank){
  const toRank = STAGE_RANK[entry.status] || 1;
  if(!Array.isArray(entry.adv)) entry.adv = [];
  const touched = [];
  state.missions.forEach(m=>{
    const rule = REG_RULES[m.id];
    if(!rule || m.status!=="active") return;
    if(!(fromRank < rule.min && rule.min <= toRank)) return;
    if(!regRuleOk(rule, entry)) return;
    if(entry.adv.some(a=>a.id===m.id && a.per===periodKeyFor(m))) return;       // a mesma unidade não conta duas vezes na mesma missão
    let n;
    if(rule.distinct){
      m.cats = m.cats || [];
      if(m.cats.includes(entry.cat)) return;
      m.cats.push(entry.cat); n = 1;
    }else{
      n = Math.min(entry.qty || 1, Math.max(0, m.goal - m.progress));
    }
    if(n<=0) return;
    m.progress += n;
    entry.adv.push({ id:m.id, n, per:periodKeyFor(m), cat: rule.distinct ? entry.cat : undefined });
    entry.pts = (entry.pts||0) + Math.round(m.pts / m.goal) * n;
    touched.push(m);
  });
  return touched;
}

function openRegisterModal(missionId){
  const m = state.missions.find(x=>x.id===missionId);
  if(!m) return;
  const stage = REG_STAGE[missionId] || "identificado";
  const rule = REG_RULES[missionId] || { min:1, items:"any" };
  const meta = REGISTER_META[missionId] || { label:"Qual item você vai registrar?", hint:"", placeholder:"" };
  const regItems = REG_ITEMS.filter(it=>regItemOk(rule, it));
  const otherCats = ALL_CATS.filter(c=>ruleCats(rule).includes(c));
  const sizeOpts = (it)=> [...it.sizes.filter(z=>rule.maxKg==null || z.max<=rule.maxKg), ...(rule.maxKg==null ? [NO_SIZE] : [])];
  const regId = newHistoryId();                      // identificador único desta tentativa: só pode ser contabilizado uma vez
  document.getElementById("activityEyebrow").textContent = STAGE_VERB[stage];
  document.getElementById("activityTitle").textContent = m.title;
  const unit = m.unit || "";
  const dots = m.goal<=6 ? `<div class="reg-dots">${Array.from({length:m.goal},(_,i)=>`<i class="${i<m.progress?"on":""}"></i>`).join("")}</div>`
                         : `<div class="bar-track reg-bar"><div class="bar-fill" style="width:${Math.round(m.progress/m.goal*100)}%"></div></div>`;
  const lastEntry = state.history.find(h=>h.missionId===missionId && (!Array.isArray(h.adv) || h.adv.every(a=>a.id!==missionId || a.per===undefined || a.per===periodKeyFor(m))));
  const lastProof = (state.history.find(h=>h.proof && h.proof.code) || {}).proof;   // uma entrega pode ter vários itens
  const lim = limitNote();
  const body = document.getElementById("activityBody");
  body.innerHTML = `
    <div class="reg-top">${dots}<span>${m.progress}${unit} de ${m.goal}${unit}</span></div>
    ${lim ? `<p class="limit-note" role="status" style="margin:0 0 12px">${lim}</p>` : ""}
    ${rule.distinct ? `<p class="reg-hint">Cada categoria conta uma vez. Já contadas: ${(m.cats||[]).length ? m.cats.join(", ") : "nenhuma"}.</p>` : ""}
    <p class="reg-hint" style="margin:0 0 12px">${meta.hint} <b>${acceptText(rule)}</b>${m.chain && !rule.retro ? " Só vale registro feito agora, com esta etapa aberta." : ""}</p>
    <p class="reg-q">${meta.label}</p>
    <div class="reg-grid">${regItems.map(it=>`<button type="button" class="reg-opt ro-${it.tone}" data-reg="${it.id}" aria-pressed="false">
        ${REG_CHECK}<span class="ro-ico">${itemIcon(it.icon)}</span><b>${it.name}</b><small>${it.sub || it.cat}</small></button>`).join("")}</div>
    <div class="reg-other" id="regOther" hidden>
      <input type="text" id="regInput" maxlength="60" placeholder="Nome do item${meta.placeholder ? ". "+meta.placeholder.replace(/^Ex:\s*/i,"Ex.: ") : ""}" autocomplete="off">
      <p class="reg-q reg-q2" style="margin-top:12px">Categoria do item</p>
      <div class="reg-sizes" id="regOtherCats" role="group" aria-label="Categoria do item">${otherCats.map(c=>`<button type="button" class="reg-size" data-ocat="${c}" aria-pressed="false">${c}</button>`).join("")}</div>
    </div>
    <div id="regSizeWrap" hidden>
      <p class="reg-q reg-q2">Qual o tamanho aproximado?</p>
      <div class="reg-sizes" id="regSizes"></div>
      <p class="reg-hint" style="margin:10px 0 0">O peso é só uma estimativa por faixa de tamanho. Se não souber, escolha “Não sei” e o item fica sem peso.</p>
    </div>
    <div id="regQtyWrap" hidden>
      <p class="reg-q reg-q2">Quantos itens iguais?</p>
      <div class="reg-qty" role="group" aria-label="Quantidade de itens">
        <button type="button" class="qty-btn" id="regQtyMinus" aria-label="Diminuir quantidade">−</button>
        <input type="number" id="regQty" inputmode="numeric" min="1" max="99" step="1" value="1" aria-label="Quantidade de itens iguais">
        <button type="button" class="qty-btn" id="regQtyPlus" aria-label="Aumentar quantidade">+</button>
      </div>
      <p class="reg-hint" id="regQtyHint" aria-live="polite" style="margin:10px 0 0"></p>
    </div>
    <div class="reg-proof" id="regProof" hidden>
      <p class="reg-hint" style="margin:0">Para contar como <b>entregue</b>, informe onde você deixou o item e o código do comprovante. Se entregou vários itens de uma vez, use o mesmo comprovante em todos. Sem ele, o registro não conta como reciclado.</p>
      <input type="text" id="regPoint" maxlength="60" placeholder="Ponto de coleta (ex.: Ecoponto do bairro)" autocomplete="off">
      <input type="text" id="regCode" maxlength="40" placeholder="Código ou nº do comprovante" autocomplete="off">
      ${lastProof ? `<button type="button" class="reg-undo" id="regSameProof" style="margin-top:2px">Usar o mesmo comprovante da última entrega</button>` : ""}
    </div>
    ${lastEntry ? `<button type="button" class="reg-undo" id="regUndo">↶ Desfazer último registro: ${lastEntry.qty>1 ? lastEntry.qty+"× " : ""}${hEsc(lastEntry.item)}</button>` : ""}
    <p class="reg-hint reg-foot">Registre quantos itens quiser: o limite de XP nunca bloqueia um registro. Um registro vale para todas as missões que ele cumpre. Os pesos são estimativas.</p>
    <div class="invite-note" id="regMsg" role="alert" aria-live="assertive"></div>
    <div class="modal-footer"><button class="btn btn-primary btn-block" id="submitRegister" disabled>${STAGE_CONFIRM[stage]}</button></div>`;
  const other = document.getElementById("regOther"), input = document.getElementById("regInput"), btn = document.getElementById("submitRegister");
  const sizeWrap = document.getElementById("regSizeWrap"), sizesEl = document.getElementById("regSizes");
  const proof = document.getElementById("regProof"), point = document.getElementById("regPoint"), code = document.getElementById("regCode");
  const qtyWrap = document.getElementById("regQtyWrap"), qtyEl = document.getElementById("regQty"), qtyHint = document.getElementById("regQtyHint");
  const msgEl = document.getElementById("regMsg");
  let picked = null, size = null, busy = false, otherCat = null;
  const fail = (txt)=>{ msgEl.textContent = txt; msgEl.classList.add("is-err"); };
  const clearMsg = ()=>{ msgEl.textContent = ""; msgEl.classList.remove("is-err"); };
  const qtyVal = ()=>{ const n = Number(qtyEl.value); return Number.isInteger(n) && n>=1 && n<=99 ? n : NaN; };
  const qtyInfo = ()=>{
    const q = qtyVal();
    if(isNaN(q)){ qtyHint.textContent = "Informe uma quantidade de 1 a 99."; return; }
    const parts = [];
    if(size && size.min!=null) parts.push(`Peso total estimado: ≈ ${hF(size.min*q)}–${hF(size.max*q)} kg.`);
    else if(size) parts.push("Sem peso estimado.");
    const rest = Math.max(0, m.goal - m.progress);
    if(!rule.distinct && q>rest) parts.push(`Esta missão conta mais ${rest} ${rest===1?"item":"itens"}; os demais ficam só no histórico.`);
    if(stage==="entregue" && q>1) parts.push("Todos usam o mesmo comprovante.");
    qtyHint.textContent = parts.join(" ");
  };
  const refresh = ()=>{
    const okName = !picked || picked.id!=="other" || (input.value.trim().length>0 && !!otherCat);
    const okProof = stage!=="entregue" || (point.value.trim().length>=3 && normCode(code.value).length>=4);
    btn.disabled = busy || !(picked && size && okName && okProof && !isNaN(qtyVal()));
    qtyInfo();
  };
  const markCat = ()=> body.querySelectorAll("[data-ocat]").forEach(o=>{ const on = o.dataset.ocat===otherCat; o.classList.toggle("on", on); o.setAttribute("aria-pressed", on); });
  const stepQty = (d)=>{ const cur = isNaN(qtyVal()) ? 1 : qtyVal(); qtyEl.value = Math.min(99, Math.max(1, cur + d)); refresh(); };
  document.getElementById("regQtyMinus").addEventListener("click", ()=>stepQty(-1));
  document.getElementById("regQtyPlus").addEventListener("click", ()=>stepQty(1));
  qtyEl.addEventListener("input", refresh);
  body.querySelectorAll("[data-ocat]").forEach(b=>b.addEventListener("click", ()=>{ otherCat = b.dataset.ocat; markCat(); clearMsg(); refresh(); }));
  body.querySelectorAll(".reg-opt").forEach(el=>el.addEventListener("click", ()=>{
    picked = REG_ITEMS.find(x=>x.id===el.dataset.reg); size = null; clearMsg();
    body.querySelectorAll(".reg-opt").forEach(o=>{ const on = o===el; o.classList.toggle("on", on); o.setAttribute("aria-pressed", on); });
    other.hidden = picked.id!=="other";
    otherCat = (picked.id==="other" && otherCats.length===1) ? otherCats[0] : null;
    markCat();
    sizesEl.innerHTML = sizeOpts(picked).map(z=>`<button type="button" class="reg-size" data-size="${z.id}" aria-pressed="false">${z.label}<small>${z.hint ? z.hint+" · " : ""}${sizeRange(z)}</small></button>`).join("");
    sizesEl.querySelectorAll(".reg-size").forEach(sb=>sb.addEventListener("click", ()=>{
      size = sizeOpts(picked).find(z=>z.id===sb.dataset.size);
      sizesEl.querySelectorAll(".reg-size").forEach(o=>{ const on=o===sb; o.classList.toggle("on",on); o.setAttribute("aria-pressed",on); });
      refresh();
    }));
    sizeWrap.hidden = false; qtyWrap.hidden = false;
    proof.hidden = stage!=="entregue";
    if(picked.id==="other") input.focus();
    refresh();
  }));
  [input, point, code].forEach(el=>el.addEventListener("input", ()=>{ clearMsg(); refresh(); }));
  const sameBtn = document.getElementById("regSameProof");
  if(sameBtn) sameBtn.addEventListener("click", ()=>{ point.value = lastProof.point; code.value = lastProof.code; refresh(); });
  const submit = async ()=>{
    if(btn.disabled || busy) return;
    busy = true; btn.disabled = true; clearMsg();          // trava já no primeiro clique: duplo clique não registra duas vezes
    let ok = false;
    try{
      const mission = state.missions.find(x=>x.id===missionId);
      if(!mission || mission.status==="locked" || mission.status==="locked-level") return fail("Esta missão ainda não está disponível para registro.");
      const wasDone = mission.status==="done";           // missão já concluída: o registro continua livre, só vai para o histórico e para outras missões abertas
      if(state.history.some(h=>h.id===regId)) return fail("Esse registro já foi contabilizado.");
      const cat = picked.id==="other" ? otherCat : picked.cat;
      const name = picked.id==="other" ? input.value.trim() : picked.name;
      /* o item precisa ser compatível com o objetivo da missão: confere a categoria real, não o que a tela mostra */
      if(!cat || !ruleCats(rule).includes(cat) || (rule.ids && !rule.ids.includes(picked.id))) return fail(`Item incompatível com esta missão. ${acceptText(rule)}`);
      if(picked.id==="other"){ const np = otherNameProblem(name, cat); if(np) return fail(np); }
      const qty = qtyVal(); if(isNaN(qty)) return fail("Informe uma quantidade de 1 a 99.");
      if(rule.maxKg!=null && !(size.max!=null && size.max<=rule.maxKg+1e-6)) return fail("Esse tamanho não vale para esta missão.");
      const fp = [missionId, picked.id, size.id, name.toLowerCase(), qty].join("|");
      if(state.history.some(h=>h.fp===fp && nowTs()-h.t < REG_LIMITS.dupWindowMs)) return fail("Toque duplo detectado. Aguarde um instante e confira o histórico.");
      if(rule.distinct && !wasDone && (mission.cats||[]).includes(cat)) return fail("Essa categoria já foi contada. Escolha um item de outra categoria.");
      let proofData = null, validated = false;
      if(stage==="entregue"){
        const pp = proofProblem(point.value, code.value, name, size.label);
        if(pp) return fail(pp);
        proofData = { point: point.value.trim(), code: normCode(code.value) };
        const v = await proofVerify(proofData);
        if(!v.ok) return fail(v.reason);
        validated = !!v.validated;
        if(state.history.some(h=>h.id===regId) || (mission.status!=="active" && !wasDone)) return fail("O estado da missão mudou enquanto confirmávamos. Confira o histórico e tente de novo.");
      }
      recordActivity();
      const r3 = (v)=> Math.round(v*1000)/1000;
      const entry = { id: regId, missionId, t: nowTs(), fp, date: todayBR(), item: name, itemId: picked.id, cat, size: size.label,
        qty, counted: 0,
        kgMin: size.min==null ? null : r3(size.min*qty), kgMax: size.max==null ? null : r3(size.max*qty),
        kgEst: size.min==null ? null : r3(((size.min+size.max)/2)*qty),
        status: stage, proof: proofData, validated, pts: 0, adv: [] };
      state.history.unshift(entry);
      ok = true;
      const touched = applyEntryToMissions(entry, 0);          // o mesmo registro avança todas as missões que ele cumpre
      const own = entry.adv.find(a=>a.id===missionId);
      entry.counted = own ? own.n : 0;
      const others = touched.filter(t=>t.id!==missionId).map(t=>t.title);
      touched.filter(t=>t.progress>=t.goal).forEach(finalizeMissionCompletion);
      save(); renderAll(); touched.forEach(t=>pulseMissionCard(t.id));
      const also = others.length ? `Também contou para: ${others.join(", ")}.` : "";
      const noCount = own ? "" : "Este registro ficou só no histórico: não somou para esta missão.";
      if(wasDone){
        closeActivity();
        showUndoToast(`${STAGE_DONE[stage]}: ${qty>1?qty+"× ":""}${name}. ${also || "Ficou no histórico; esta missão já estava concluída."}`.replace(/\s+/g," ").trim(), ()=>removeHistoryEntry(entry.id, {undoable:false}));
      }else if(mission.status==="done"){
        closeActivity();
        if(also) setTimeout(()=>showToast(also), 2200);
      }else{
        showUndoToast(`${STAGE_DONE[stage]}: ${qty>1?qty+"× ":""}${name}. ${noCount} ${also}`.replace(/\s+/g," ").trim(), ()=>removeHistoryEntry(entry.id, {undoable:false}));
        openRegisterModal(missionId);
      }
    }finally{
      if(!ok){ busy = false; refresh(); }
    }
  };
  const undoBtn = document.getElementById("regUndo");
  if(undoBtn) undoBtn.addEventListener("click", ()=>{ hideUndoToast(); removeHistoryEntry(lastEntry.id, {undoable:false}); });
  btn.addEventListener("click", submit);
  input.addEventListener("keydown", e=>{ if(e.key==="Enter") submit(); });
  openModalBackdrop();
}

/* Atualizar um registro antigo: identificado → separado → entregue (com comprovante) */
function openStatusModal(id){
  const h = state.history.find(x=>x.id===id);
  if(!h || h.status==="entregue") return;
  document.getElementById("activityEyebrow").textContent = "Atualizar registro";
  document.getElementById("activityTitle").textContent = h.item;
  const opts = [
    ...(h.status==="identificado" ? [{v:"separado", t:"Separei para descarte", s:"Guardado, pronto para levar"}] : []),
    {v:"entregue", t:"Entreguei em um ponto de coleta", s:"Exige o comprovante"},
  ];
  const body = document.getElementById("activityBody");
  body.innerHTML = `
    <p class="reg-hint">Status atual: <b>${H_STATUS[h.status]}</b>. Só itens entregues, com comprovante informado, contam como reciclados.</p>
    <div class="reg-sizes" id="stOpts">${opts.map(o=>`<button type="button" class="reg-size" data-st="${o.v}" aria-pressed="false">${o.t}<small>${o.s}</small></button>`).join("")}</div>
    <div class="reg-proof" id="stProof" hidden>
      <input type="text" id="stPoint" maxlength="60" placeholder="Ponto de coleta (ex.: Ecoponto do bairro)" autocomplete="off">
      <input type="text" id="stCode" maxlength="40" placeholder="Código ou nº do comprovante" autocomplete="off">
    </div>
    <div class="invite-note" id="stMsg" role="alert" aria-live="assertive"></div>
    <div class="modal-footer"><button class="btn btn-primary btn-block" id="stSubmit" disabled>Salvar</button></div>`;
  const proof = document.getElementById("stProof"), point = document.getElementById("stPoint"), code = document.getElementById("stCode"), btn = document.getElementById("stSubmit"), msgEl = document.getElementById("stMsg");
  let v = null, busy = false;
  const fail = (t)=>{ msgEl.textContent = t; msgEl.classList.add("is-err"); };
  const refresh = ()=>{ btn.disabled = busy || !v || (v==="entregue" && !(point.value.trim().length>=3 && normCode(code.value).length>=4)); };
  body.querySelectorAll("[data-st]").forEach(el=>el.addEventListener("click", ()=>{
    v = el.dataset.st; msgEl.textContent = "";
    body.querySelectorAll("[data-st]").forEach(o=>{ const on=o===el; o.classList.toggle("on",on); o.setAttribute("aria-pressed",on); });
    proof.hidden = v!=="entregue"; refresh();
  }));
  [point, code].forEach(el=>el.addEventListener("input", ()=>{ msgEl.textContent = ""; refresh(); }));
  btn.addEventListener("click", async ()=>{
    if(btn.disabled || busy) return;
    busy = true; btn.disabled = true; msgEl.textContent = "";
    let done = false;
    try{
      const cur = state.history.find(x=>x.id===id); if(!cur || cur.status==="entregue") return;
      const fromRank = STAGE_RANK[cur.status] || 1;
      let proofData = null, validated = false;
      if(v==="entregue"){
        const pp = proofProblem(point.value, code.value, cur.item, cur.size, cur.id);
        if(pp) return fail(pp);
        proofData = { point: point.value.trim(), code: normCode(code.value) };
        const vr = await proofVerify(proofData);
        if(!vr.ok) return fail(vr.reason);
        validated = !!vr.validated;
        if(cur.status==="entregue") return;
      }
      done = true;
      if(v==="entregue"){ cur.status = "entregue"; cur.proof = proofData; cur.validated = validated; }
      else{ cur.status = "separado"; }
      recordActivity();
      const touched = applyEntryToMissions(cur, fromRank);      // a nova etapa também conta para as missões que a pedem
      touched.filter(t=>t.progress>=t.goal).forEach(finalizeMissionCompletion);
      save(); renderAll(); touched.forEach(t=>pulseMissionCard(t.id)); closeActivity();
      const base = v==="entregue" ? "Entrega registrada com comprovante" : "Marcado como separado para descarte";
      showToast(touched.length ? `${base}. Contou para: ${touched.map(t=>t.title).join(", ")}.` : `${base}. Não somou para nenhuma missão aberta.`);
    }finally{
      if(!done){ busy = false; refresh(); }
    }
  });
  openModalBackdrop();
}

/* Convites: cada usuário vale uma vez, o formato do nome é conferido e ninguém convida a si mesmo.
   Um convite avança todas as missões de convite abertas (Convide um amigo e Mobilize sua turma).
   Provar que a conta existe exige o servidor: o site pode definir window.EcoClickInvites = { verify(usuario, codigoDeConvite) }
   (Promise de true, ou { ok:false, reason }). Sem isso, o convite fica gravado com validated:false para conferência posterior. */
const HANDLE_RE = /^[a-z0-9._]{3,30}$/;
function normHandle(t){ return String(t||"").trim().replace(/^@+/,"").toLowerCase(); }
function inviteList(){ return (state.invited||[]).filter(x=>x && x.username); }
function inviteCheck(raw){
  const h = normHandle(raw);
  if(!h) return { ok:false, reason:"Digite o nome de usuário de quem você convidou." };
  const own = [state.user.username, state.user.referralCode, String(state.user.name||"").trim().replace(/\s+/g,".")].map(normHandle).filter(Boolean);
  if(own.includes(h)) return { ok:false, reason:"Você não pode convidar a si mesmo." };
  if(!HANDLE_RE.test(h)) return { ok:false, reason:"Use de 3 a 30 caracteres: letras, números, ponto ou sublinhado, sem espaços." };
  if(inviteList().some(i=>i.username===h)) return { ok:false, reason:"Esse usuário já foi contado. Convide outra pessoa." };
  return { ok:true, handle:h };
}
async function inviteVerify(handle){
  const hook = window.EcoClickInvites;
  if(hook && typeof hook.verify==="function"){
    try{
      const r = await hook.verify(handle, state.user.referralCode);
      return (r===true || (r && r.ok)) ? { ok:true, validated:true } : { ok:false, reason:(r && r.reason) || "Não encontramos esse usuário cadastrado pelo seu link." };
    }catch(e){ return { ok:false, reason:"Não foi possível confirmar agora. Tente de novo em instantes." }; }
  }
  return { ok:true, validated:false };
}
function openInviteModal(missionId){
  const m = state.missions.find(x=>x.id===missionId);
  if(!m) return;
  const meta = INVITE_META[missionId];
  const link = `https://ecoclick.app/convite/${state.user.referralCode}`;
  document.getElementById("activityEyebrow").textContent = "Convidar amigo";
  document.getElementById("activityTitle").textContent = m.title;
  const list = inviteList();
  const body = document.getElementById("activityBody");
  body.innerHTML = `
    <p class="reg-hint">${meta.hint}</p>
    <div class="invite-step"><input type="text" id="inviteLink" value="${link}" readonly aria-label="Link de convite"></div>
    <button class="btn btn-outline btn-block" id="copyLinkBtn" style="margin-bottom:16px;">Copiar link de convite</button>
    <div class="reg-field"><label for="inviteUsername">${meta.usernameLabel}</label><input type="text" id="inviteUsername" placeholder="${meta.placeholder}" maxlength="31" autocomplete="off" disabled></div>
    <div class="invite-note" id="inviteNote" role="status" aria-live="polite">Copie o link primeiro para liberar a confirmação.</div>
    ${list.length ? `<p class="reg-hint" style="margin:10px 0 0">Já contados: ${list.map(i=>"@"+hEsc(i.username)).join(", ")}.</p>` : ""}
    <div class="reg-progress">Progresso: ${m.progress} de ${m.goal}</div>
    <div class="modal-footer"><button class="btn btn-primary" id="submitInvite" disabled>Confirmar convite</button></div>`;
  const linkInput = document.getElementById("inviteLink"), input = document.getElementById("inviteUsername"), btn = document.getElementById("submitInvite"), note = document.getElementById("inviteNote");
  const setNote = (txt, err)=>{ note.textContent = txt; note.classList.toggle("is-err", !!err); };
  linkInput.addEventListener("click", ()=>linkInput.select());
  let linkCopied = false, busy = false;
  document.getElementById("copyLinkBtn").addEventListener("click", async ()=>{
    linkInput.select();
    try{ await navigator.clipboard.writeText(link); showToast("Link copiado!"); }
    catch(e){ showToast("Selecione e copie o link acima."); }
    linkCopied = true; input.disabled = false; btn.disabled = false;
    setNote("Link copiado! Envie para seu amigo e, quando ele criar a conta dele, digite o nome de usuário dele abaixo.");
  });
  const submit = async ()=>{
    if(!linkCopied || busy) return;
    const chk = inviteCheck(input.value);
    if(!chk.ok){ setNote(chk.reason, true); input.focus(); return; }
    busy = true; btn.disabled = true; setNote("Confirmando…");
    const v = await inviteVerify(chk.handle);
    busy = false; btn.disabled = false;
    if(!v.ok){ setNote(v.reason, true); input.focus(); return; }
    const again = inviteCheck(chk.handle);                       // reconfere: nada mudou enquanto aguardava o servidor
    if(!again.ok){ setNote(again.reason, true); return; }
    const targets = state.missions.filter(x=>INVITE_META[x.id] && x.status==="active");
    if(!targets.length) return;
    state.invited.push({ username: chk.handle, t: nowTs(), validated: !!v.validated });
    recordActivity();
    targets.forEach(t=>{ t.progress = Math.min(t.goal, t.progress + 1); });
    targets.filter(t=>t.progress>=t.goal).forEach(finalizeMissionCompletion);
    save(); renderAll(); targets.forEach(t=>pulseMissionCard(t.id));
    const mission = state.missions.find(x=>x.id===missionId);
    const others = targets.filter(t=>t.id!==missionId).map(t=>t.title);
    const msg = `${v.validated ? "Convite confirmado" : "Convite registrado (a confirmação da conta depende do servidor)"}: @${chk.handle}.${others.length ? " Também contou para: "+others.join(", ")+"." : ""}`;
    if(mission.status==="done"){ closeActivity(); setTimeout(()=>showToast(msg), 1800); }
    else{ showToast(msg); openInviteModal(missionId); }
  };
  btn.addEventListener("click", submit);
  input.addEventListener("keydown", e=>{ if(e.key==="Enter") submit(); });
  openModalBackdrop();
}

/* ---------------- Delegação de eventos ---------------- */
document.addEventListener("click", (e)=>{
  const regFirst = e.target.closest("[data-register-first]");
  if(regFirst){ openFirstRegister(); return; }
  const gotoBtn = e.target.closest("[data-goto]");
  if(gotoBtn){ gotoView(gotoBtn.dataset.goto); return; }
  const scrollBtn = e.target.closest("[data-scroll]");
  if(scrollBtn){ jumpTo(scrollBtn.dataset.scroll); return; }
  const tabBtn = e.target.closest("#missionTabs .tab");
  if(tabBtn){ activeMissionTab = tabBtn.dataset.tab; renderMissionTabs(); renderMissionList(); return; }
  const advBtn = e.target.closest("[data-hadv]");
  if(advBtn){ openStatusModal(advBtn.dataset.hadv); return; }
  const delBtn = e.target.closest("[data-hdel]");
  if(delBtn){ removeHistoryEntry(delBtn.dataset.hdel, {focusUndo: e.detail===0}); return; }
  const hfBtn = e.target.closest("[data-hfilter]");
  if(hfBtn){ histFilter = hfBtn.dataset.hfilter; renderHistory(); return; }
  const jnode = e.target.closest("[data-jnode]");
  if(jnode){
    journeySel = jnode.dataset.jnode; renderJourney();
    if(window.innerWidth<=980) document.getElementById("jDetail").scrollIntoView({behavior:"smooth", block:"center"});
    return;
  }
  const jlv = e.target.closest("[data-jlevel]");
  if(jlv){ journeyLevel = Number(jlv.dataset.jlevel); journeySel = null; renderJourney(); return; }
  const jgo = e.target.closest("[data-jgoto]");
  if(jgo){
    journeySel = jgo.dataset.jgoto;
    const mm = state.missions.find(x=>x.id===journeySel), lv = mm ? JTRAILS.findIndex(t=>t.key===mm.chain)+1 : jCurrentLevel();
    journeyLevel = lv || jCurrentLevel();
    gotoView("jornada"); renderJourney(); return;
  }
  const missionActionBtn = e.target.closest("[data-mission-action]");
  if(missionActionBtn){ openMissionAction(missionActionBtn.dataset.missionAction); return; }
  const openContentBtn = e.target.closest("[data-open-content]");
  if(openContentBtn){ openModalWithContent(openContentBtn.dataset.openContent, { fromMission: openContentBtn.dataset.fromMission || "" }); return; }
});

/* ---------------- Render geral ---------------- */
function renderAll(){
  if(validateJourney()) save();
  evaluateBadges();
  renderHeader();
  renderStats();
  renderHighlightMissions();
  renderLevelPanel();
  renderBadges();
  renderMissionTabs();
  renderMissionList();
  renderJourney();
  renderHistory();
  renderHomeJourney();
  renderHomeHistory();
}
consumeReadReceipts();
unlockLevelGated();
renderAll();

/* confere a virada de dia/semana/mês com o site aberto (meia-noite) e ao voltar para a aba */
function checkPeriods(){
  if(rolloverPeriods()){ refreshStreak(); save(); renderAll(); showToast("Novas missões disponíveis!"); }
}
setInterval(checkPeriods, 60000);
document.addEventListener("visibilitychange", ()=>{ if(!document.hidden) checkPeriods(); });
window.addEventListener("focus", checkPeriods);

/* ---------------- Tema claro / escuro ---------------- */
function currentTheme(){ return document.documentElement.getAttribute("data-theme")==="dark" ? "dark" : "light"; }
function applyTheme(theme, save){
  document.documentElement.setAttribute("data-theme", theme);
  if(save){ try{ localStorage.setItem("ecoclick_theme", theme); }catch(e){} }
  const btn = document.getElementById("themeToggle");
  if(btn){
    const dark = theme==="dark";
    btn.setAttribute("aria-pressed", String(dark));
    btn.setAttribute("aria-label", dark ? "Mudar para o tema claro" : "Mudar para o tema escuro");
    btn.title = dark ? "Tema claro" : "Tema escuro";
    btn.querySelector(".ico").innerHTML = uiIcon(dark ? "sun" : "moon");
  }
  const meta = document.querySelector('meta[name="theme-color"]');
  if(meta) meta.setAttribute("content", theme==="dark" ? "#0d1612" : "#fbfaf7");
}
(function initTheme(){
  applyTheme(currentTheme(), false);
  const btn = document.getElementById("themeToggle");
  if(btn) btn.addEventListener("click", ()=>applyTheme(currentTheme()==="dark" ? "light" : "dark", true));
  // se o usuário nunca escolheu, acompanha o tema do aparelho
  try{
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const follow = ()=>{ let saved=null; try{ saved = localStorage.getItem("ecoclick_theme"); }catch(e){} if(!saved||saved==="system") applyTheme(mq.matches ? "dark" : "light", false); };
    if(mq.addEventListener) mq.addEventListener("change", follow);
  }catch(e){}
})();

/* ---------------- Acessibilidade: barras de progresso e link de pular ---------------- */
function enhanceProgressBars(){
  const txt = (el)=> (el && el.textContent || "").replace(/\s+/g," ").trim();
  document.querySelectorAll(".bar-fill, .xp-fill").forEach(fill=>{
    const track = fill.parentElement; if(!track) return;
    const pct = Math.max(0, Math.min(100, Math.round(parseFloat(fill.style.width) || 0)));
    let label = "Progresso", vtext = "";
    if(fill.id==="xpFillHome"){ label = "Progresso de XP até o próximo nível"; vtext = `${txt(document.getElementById("xpNowHome"))} de ${txt(document.getElementById("xpMaxHome"))}`; }
    else if(track.closest("#activityBody")){ label = "Progresso da missão"; vtext = txt(track.closest("#activityBody").querySelector(".reg-top span")); }
    else if(track.closest(".jr-foot")){ label = "Progresso da Jornada do Reciclador"; vtext = txt(track.parentElement.querySelector("span")); }
    else if(track.closest(".jb-prog")){ label = "Progresso do nível"; vtext = txt(track.parentElement.querySelector("span")); }
    else {
      const card = track.closest(".mission-card, .jd-card, .jmission, section, div[class*='card']") || track.parentElement;
      const h = card && card.querySelector("h3, h2, .jd-step");
      if(h) label = "Progresso: " + txt(h);
      const pt = track.parentElement.querySelector(".prog-text");
      vtext = txt(pt);
    }
    track.setAttribute("role","progressbar");
    track.setAttribute("aria-label", label);
    track.setAttribute("aria-valuemin","0"); track.setAttribute("aria-valuemax","100"); track.setAttribute("aria-valuenow", String(pct));
    track.setAttribute("aria-valuetext", vtext ? `${vtext} (${pct}%)` : `${pct}%`);
  });
  document.querySelectorAll(".reg-dots").forEach(d=>d.setAttribute("aria-hidden","true"));   // o texto ao lado já informa o progresso
}
(function(){
  const _renderAll = renderAll;
  renderAll = function(){ _renderAll.apply(this, arguments); enhanceProgressBars(); };
  let raf = 0;
  new MutationObserver(()=>{ cancelAnimationFrame(raf); raf = requestAnimationFrame(enhanceProgressBars); })
    .observe(document.body, {childList:true, subtree:true});
  enhanceProgressBars();
  gotoView(window.EcoStart || viewFromHash(), {fromHash:true, noFocus:true});          // abre direto na tela indicada pela URL
  document.getElementById("skipLink").addEventListener("click", e=>{
    e.preventDefault();
    const t = document.getElementById("conteudo");
    t.focus({preventScroll:true}); t.scrollIntoView({block:"start"});
  });
})();

