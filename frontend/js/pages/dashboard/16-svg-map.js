
/* ===== EcoSvgMap — mapa de Salvador em SVG próprio (sem tiles, sem biblioteca, funciona offline) ===== */
(function(){
var D = {"COAST":[[-12.88,-38.306],[-12.91,-38.317],[-12.925,-38.328],[-12.939,-38.339],[-12.95,-38.345],[-12.958,-38.352],[-12.9615,-38.368],[-12.9625,-38.383],[-12.965,-38.395],[-12.973,-38.408],[-12.983,-38.419],[-12.991,-38.431],[-12.999,-38.443],[-13.005,-38.456],[-13.008,-38.47],[-13.011,-38.485],[-13.014,-38.499],[-13.012,-38.511],[-13.013,-38.525],[-13.012,-38.534],[-13.003,-38.536],[-12.99,-38.529],[-12.985,-38.525],[-12.974,-38.52],[-12.968,-38.518],[-12.95,-38.513],[-12.94,-38.515],[-12.927,-38.521],[-12.919,-38.519],[-12.912,-38.509],[-12.902,-38.5],[-12.88,-38.495],[-12.855,-38.493],[-12.835,-38.485],[-12.815,-38.478],[-12.798,-38.47],[-12.8,-38.44],[-12.825,-38.4],[-12.86,-38.36]],"ISLAND":[[-12.848,-38.55],[-12.846,-38.56],[-12.855,-38.568],[-12.864,-38.562],[-12.862,-38.551],[-12.854,-38.547]],"ROADS":[["Av. Paralela",[[-12.979,-38.455],[-12.955,-38.426],[-12.935,-38.398],[-12.918,-38.36],[-12.909,-38.336]],3],["BR-324",[[-12.966,-38.476],[-12.94,-38.462],[-12.915,-38.452],[-12.89,-38.443],[-12.865,-38.425],[-12.83,-38.405],[-12.803,-38.42]],3],["Av. Bonocô",[[-12.976,-38.487],[-12.966,-38.476]],4],["Av. Vasco da Gama",[[-13.005,-38.499],[-12.995,-38.492],[-12.976,-38.487]],3],["Av. ACM",[[-12.994,-38.477],[-12.985,-38.466],[-12.979,-38.456]],4],["Orla (Av. Otávio Mangabeira)",[[-13.01,-38.485],[-12.999,-38.443],[-12.983,-38.419],[-12.962,-38.394],[-12.957,-38.366],[-12.947,-38.346],[-12.93,-38.332]],3],["Av. Afrânio Peixoto (Suburbana)",[[-12.93,-38.496],[-12.906,-38.489],[-12.883,-38.488],[-12.856,-38.481],[-12.835,-38.472]],3],["Av. Jequitaia",[[-12.974,-38.513],[-12.956,-38.507],[-12.94,-38.5],[-12.933,-38.496]],4],["Av. Sete de Setembro",[[-12.975,-38.512],[-12.984,-38.518],[-12.997,-38.523],[-13.006,-38.53]],4]],"BAIRROS":[["Barra",-13.01,-38.533,1],["Ondina",-13.002,-38.51,2],["Rio Vermelho",-13.01,-38.49,1],["Pituba",-12.994,-38.447,1],["Itaigara",-12.993,-38.454,2],["Caminho das Árvores",-12.983,-38.457,3],["Brotas",-12.985,-38.49,1],["Cabula",-12.956,-38.46,1],["Liberdade",-12.937,-38.483,1],["Centro",-12.974,-38.513,1],["Pelourinho",-12.971,-38.51,2],["Comércio",-12.968,-38.513,2],["Itapuã",-12.946,-38.36,1],["Stella Maris",-12.942,-38.345,2],["Piatã",-12.956,-38.393,2],["Pituaçu",-12.962,-38.415,2],["Boca do Rio",-12.98,-38.425,1],["Imbuí",-12.97,-38.425,2],["Costa Azul",-12.999,-38.465,2],["Federação",-12.998,-38.5,2],["Graça",-12.998,-38.52,2],["Vitória",-12.998,-38.524,2],["Campo Grande",-12.989,-38.525,2],["Nazaré",-12.981,-38.504,2],["Pernambués",-12.958,-38.478,2],["Sussuarana",-12.927,-38.448,2],["Cajazeiras",-12.897,-38.4,1],["Paripe",-12.825,-38.464,1],["Periperi",-12.857,-38.474,2],["Plataforma",-12.896,-38.489,2],["Ribeira",-12.915,-38.496,2],["Bonfim",-12.917,-38.506,2],["Mussurunga",-12.913,-38.364,2],["São Cristóvão",-12.92,-38.335,2],["Patamares",-12.95,-38.385,2],["Armação",-12.979,-38.423,3],["Massaranduba",-12.929,-38.492,3],["Lobato",-12.905,-38.48,3],["Narandiba",-12.948,-38.44,3],["Alto da Terezinha",-12.888,-38.483,3],["Itacaranha",-12.893,-38.478,3],["Ilha Amarela",-12.915,-38.48,3],["Santa Teresa",-12.976,-38.487,3],["Águas Claras",-12.905,-38.433,3],["Pirajá",-12.887,-38.446,1],["Acesso Norte",-12.962,-38.457,3],["Aeroporto",-12.912,-38.338,3],["Calçada",-12.935,-38.496,3],["Mares",-12.944,-38.49,3],["Boa Viagem",-12.93,-38.511,3],["Monte Serrat",-12.921,-38.515,3],["Lapa",-12.976,-38.511,3],["Garcia",-12.993,-38.52,3],["Engenho Velho de Brotas",-12.992,-38.496,3],["Amaralina",-13.004,-38.478,3],["Pau da Lima",-12.937,-38.454,3],["São Marcos",-12.94,-38.43,3],["Valéria",-12.878,-38.442,3],["Fazenda Coutos",-12.833,-38.44,3],["Canela",-12.993,-38.512,3],["Barris",-12.983,-38.509,3],["Dois de Julho",-12.988,-38.512,3],["Saúde",-12.964,-38.503,3],["Santo Antônio Além do Carmo",-12.969,-38.507,3],["Barbalho",-12.965,-38.5,3],["Soledade",-12.96,-38.496,3],["Nordeste de Amaralina",-13.0,-38.478,3],["Stiep",-12.985,-38.448,3],["Placaford",-12.968,-38.398,3],["IAPI",-12.949,-38.49,3],["Cosme de Farias",-12.978,-38.499,3],["Matatu",-12.989,-38.49,3],["Chame-Chame",-13.004,-38.508,3],["Vale das Pedrinhas",-12.999,-38.472,3],["Santa Cruz",-12.998,-38.475,3],["Doron",-12.952,-38.455,3],["Sete de Abril",-12.954,-38.47,3],["Tancredo Neves",-12.97,-38.462,3],["Arenoso",-12.956,-38.453,3],["Mata Escura",-12.94,-38.478,3],["Nova Brasília",-12.925,-38.469,3],["Castelo Branco",-12.905,-38.418,3],["Nova Constituinte",-12.87,-38.46,3],["São Rafael",-12.929,-38.404,3],["Bairro da Paz",-12.944,-38.4,3],["Santa Luzia",-12.91,-38.49,3],["Alto do Cabrito",-12.9,-38.484,3],["Fazenda Grande do Retiro",-12.95,-38.48,3],["Retiro",-12.946,-38.483,3],["Cabula VI",-12.948,-38.454,3],["Jaguaribe",-12.98,-38.405,3],["Praia do Flamengo",-12.927,-38.33,3]],"AGUAS":[["Baía de Todos os Santos",-12.93,-38.57],["Oceano Atlântico",-13.045,-38.43]],"ILHAS":[["Ilha de Bom Jesus dos Passos",-12.856,-38.556]]};
var K = 900, NS = 'http://www.w3.org/2000/svg';
function proj(la, ln){ return [(ln + 38.62) * 0.9745 * K, (-12.76 - la) * K]; }
function esc(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
function kmd(a, b){ var r = Math.PI / 180, x = Math.sin((b[0] - a[0]) * r / 2), y = Math.sin((b[1] - a[1]) * r / 2); return 12742 * Math.asin(Math.sqrt(x * x + Math.cos(a[0] * r) * Math.cos(b[0] * r) * y * y)); }
function pathOf(P){ return 'M' + P.map(function(p){ var q = proj(p[0], p[1]); return q[0].toFixed(1) + ' ' + q[1].toFixed(1); }).join('L') + 'Z'; }
function clip(P, a, b, c){ var out = []; for(var i = 0; i < P.length; i++){ var p = P[i], q = P[(i + 1) % P.length], dp = a * p[0] + b * p[1] - c, dq = a * q[0] + b * q[1] - c;
  if(dp <= 0) out.push(p); if((dp < 0 && dq > 0) || (dp > 0 && dq < 0)){ var t = dp / (dp - dq); out.push([p[0] + t * (q[0] - p[0]), p[1] + t * (q[1] - p[1])]); } } return out; }
function bairroDe(la, ln){ var best = null, bd = 1e9; D.BAIRROS.forEach(function(b){ var d = kmd([la, ln], [b[1], b[2]]); if(d < bd){ bd = d; best = b[0]; } }); return best; }
var PIN = 'M0 0C-9-12-12-17-12-22A12 12 0 1 1 12-22C12-17 9-12 0 0Z';

window.EcoSvgMap = function(host, o){
  o = o || {};
  host.classList.add('svgmap');
  host.innerHTML = '<svg class="svgm-svg" xmlns="' + NS + '" role="group" aria-label="' + esc(o.label || 'Mapa') + '"><g class="svgm-g"><path class="svgm-land"></path><g class="svgm-cells"></g><g class="svgm-roads"></g></g><g class="svgm-over" aria-hidden="true"><g class="lbl-g"></g><g class="fx-g"></g></g><g class="svgm-pins"></g></svg>' +
    '<div class="svgm-zoom"><button type="button" data-z="in" aria-label="' + esc(o.zoomIn || 'Aproximar') + '" title="' + esc(o.zoomIn || 'Aproximar') + '">+</button><button type="button" data-z="out" aria-label="' + esc(o.zoomOut || 'Afastar') + '" title="' + esc(o.zoomOut || 'Afastar') + '">−</button><button type="button" data-z="all" class="all" aria-label="' + esc(o.reset || 'Ver Salvador') + '" title="' + esc(o.reset || 'Ver Salvador') + '">SSA</button></div>' +
    '<div class="svgm-tip" hidden></div><div class="svgm-note">Mapa offline · posições aproximadas</div>';
  var svg = host.querySelector('.svgm-svg'), gEl = svg.querySelector('.svgm-g'), over = svg.querySelector('.svgm-over'), gp = svg.querySelector('.svgm-pins'), tip = host.querySelector('.svgm-tip');
  lblG = over.querySelector('.lbl-g'); fixG = over.querySelector('.fx-g');
  var z = 1, tx = 0, ty = 0, cw = 600, ch = 500, pins = {}, vis = null, sel = null, me = null, foco = null, lastFit = null;
  var plan = { z:null }, planAt = 0, settleT = 0, moving = false, mvT = 0, tgt = null, tickOn = false, lastTick = 0, fixKey = '', lblG, fixG;
  var pend = false, animId = 0, inercia = 0, ptrs = {}, arrastou = false, ini = null, pinch0 = null, vel = { x:0, y:0, px:0, py:0, t:0 }, lastTap = { t:0, x:0, y:0 };

  /* ---- base: costa, bairros (células) e avenidas ---- */
  var landd = pathOf(D.COAST) + pathOf(D.ISLAND);
  svg.querySelector('.svgm-land').setAttribute('d', landd);
  (function(){
    var S = D.BAIRROS.map(function(b){ return proj(b[1], b[2]); }), cs = D.COAST.map(function(p){ return proj(p[0], p[1]); });
    var xs = cs.map(function(q){ return q[0]; }), ys = cs.map(function(q){ return q[1]; });
    var x0 = Math.min.apply(null, xs) - 40, x1 = Math.max.apply(null, xs) + 40, y0 = Math.min.apply(null, ys) - 40, y1 = Math.max.apply(null, ys) + 40, cel = '';
    S.forEach(function(si, i){ var P = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
      for(var j = 0; j < S.length && P.length; j++){ if(j === i) continue; var sj = S[j]; P = clip(P, sj[0] - si[0], sj[1] - si[1], (sj[0] * sj[0] + sj[1] * sj[1] - si[0] * si[0] - si[1] * si[1]) / 2); }
      if(P.length > 2) cel += '<path class="cel" data-b="' + esc(D.BAIRROS[i][0]) + '" d="M' + P.map(function(p){ return p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join('L') + 'Z"/>'; });
    svg.querySelector('.svgm-cells').innerHTML = '<g>' + cel + '</g><path class="svgm-sea" fill-rule="evenodd" d="M' + (x0 - 80) + ' ' + (y0 - 80) + 'H' + (x1 + 80) + 'V' + (y1 + 80) + 'H' + (x0 - 80) + 'Z' + landd + '"/><path class="svgm-coast" d="' + landd + '"/>';
    var r = ''; D.ROADS.forEach(function(rd){ var d = 'M' + rd[1].map(function(p){ var q = proj(p[0], p[1]); return q[0].toFixed(1) + ' ' + q[1].toFixed(1); }).join('L'); r += '<path class="roadc" d="' + d + '"/><path class="road" d="' + d + '"/>'; });
    svg.querySelector('.svgm-roads').innerHTML = r;
    var q0 = Math.min.apply(null, xs), q1 = Math.max.apply(null, xs), w0 = Math.min.apply(null, ys), w1 = Math.max.apply(null, ys);
    LB = { x0:q0, x1:q1, y0:w0, y1:w1 };
  })();
  var LB;
  var cov = {}, celEls = {};
  (function(){ var ps = svg.querySelectorAll('.svgm-cells .cel'); for(var i = 0; i < ps.length; i++) celEls[ps[i].getAttribute('data-b')] = ps[i]; })();
  function lvl(n){ return n >= 3 ? 3 : (n || 0); }
  function paint(nome){ var k = Object.keys(celEls); for(var i = 0; i < k.length; i++){ var e = celEls[k[i]], c = 'cel c' + lvl(cov[k[i]]) + (nome && k[i] === nome ? ' foco' : ''); if(e.getAttribute('class') !== c) e.setAttribute('class', c); }
    if(nome && celEls[nome] && celEls[nome].parentNode) celEls[nome].parentNode.appendChild(celEls[nome]); }
  paint(null);
  function setFoco(nome){ foco = nome; plan.z = null; paint(nome); }
  function setCoverage(m){ cov = m || {}; paint(foco); }
  function bairroCenter(n){ for(var i = 0; i < D.BAIRROS.length; i++) if(D.BAIRROS[i][0] === n) return [D.BAIRROS[i][1], D.BAIRROS[i][2]]; return null; }
  function focusBairro(n, pts, maxZ){ var c = bairroCenter(n); if(!c) return; setFoco(n); var arr = [c].concat(pts || []); fit(arr, { padT:100, padB:160, padL:50, padR:60, maxZ:maxZ || 8 }); }

  /* ---- vista ---- */
  function medir(){ var r = host.getBoundingClientRect(); cw = r.width || cw; ch = r.height || ch; }
  function limitar(){ var m = 90, l = tx + LB.x0 * z, r = tx + LB.x1 * z, t = ty + LB.y0 * z, b = ty + LB.y1 * z;
    if(r < m) tx += m - r; if(l > cw - m) tx -= l - (cw - m); if(b < m) ty += m - b; if(t > ch - m) ty -= t - (ch - m); }
  function tela(la, ln){ var q = proj(la, ln); return [tx + q[0] * z, ty + q[1] * z]; }
  function aplicar(){ if(pend) return; pend = true; requestAnimationFrame(function(){ pend = false; limitar(); gEl.setAttribute('transform', 'translate(' + tx + ' ' + ty + ') scale(' + z + ')'); mover(); render(); }); }
  function mover(){ if(!moving){ moving = true; host.classList.add('moving'); } clearTimeout(mvT); mvT = setTimeout(function(){ moving = false; host.classList.remove('moving'); if(plan.z !== z) plan.z = null; render(); }, 170); }
  function suave(nz, ntx, nty){ tgt = { z:nz, x:ntx, y:nty }; if(reduce()){ z = nz; tx = ntx; ty = nty; tgt = null; aplicar(); return; } if(!tickOn){ tickOn = true; lastTick = performance.now(); requestAnimationFrame(tick); } }
  function tick(){ if(!tgt){ tickOn = false; return; } var n = performance.now(), dt = Math.min(48, Math.max(1, n - lastTick)); lastTick = n; var a = 1 - Math.exp(-dt / 62);
    z += (tgt.z - z) * a; tx += (tgt.x - tx) * a; ty += (tgt.y - ty) * a;
    if(Math.abs(tgt.z - z) < tgt.z * 0.0008 && Math.abs(tgt.x - tx) < 0.25 && Math.abs(tgt.y - ty) < 0.25){ z = tgt.z; tx = tgt.x; ty = tgt.y; tgt = null; }
    aplicar(); if(tgt) requestAnimationFrame(tick); else tickOn = false; }
  var reduce = function(){ return window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.classList.contains('reduce-motion'); };
  function animarPara(nz, ntx, nty){ inercia++; tgt = null; var z0 = z, x0 = tx, y0 = ty, t0 = null, id = ++animId;
    if(reduce()){ z = nz; tx = ntx; ty = nty; aplicar(); return; }
    (function passo(ts){ if(id !== animId) return; if(t0 === null) t0 = ts; var k = Math.min(1, (ts - t0) / 600), e = 1 - Math.pow(1 - k, 3);
      z = z0 + (nz - z0) * e; tx = x0 + (ntx - x0) * e; ty = y0 + (nty - y0) * e; aplicar(); if(k < 1) requestAnimationFrame(passo); })(performance.now());
  }
  var started = false;
  function fit(pts, op){
    op = op || {}; lastFit = [pts, op]; medir();
    var pT = op.padT == null ? 72 : op.padT, pB = op.padB == null ? 40 : op.padB, pL = op.padL == null ? 40 : op.padL, pR = op.padR == null ? 40 : op.padR;
    var qs = pts.map(function(p){ return proj(p[0], p[1]); }), xs = qs.map(function(q){ return q[0]; }), ys = qs.map(function(q){ return q[1]; });
    var x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs), y0 = Math.min.apply(null, ys), y1 = Math.max.apply(null, ys);
    var w = Math.max(40, cw - pL - pR), h = Math.max(40, ch - pT - pB), bw = Math.max(x1 - x0, 3), bh = Math.max(y1 - y0, 3);
    var nz = Math.max(0.5, Math.min(w / bw, h / bh, op.maxZ || 6));
    var ntx = pL + w / 2 - (x0 + x1) / 2 * nz, nty = pT + h / 2 - (y0 + y1) / 2 * nz;
    if(started && !op.now) animarPara(nz, ntx, nty); else { z = nz; tx = ntx; ty = nty; aplicar(); }
  }
  function all(){ fit(D.COAST.map(function(p){ return [p[0], p[1]]; }), { maxZ:6 }); }
  function zoomEm(mx, my, nz, suave){ nz = Math.max(0.5, Math.min(14, nz)); var ntx = mx - (mx - tx) * (nz / z), nty = my - (my - ty) * (nz / z); if(suave) animarPara(nz, ntx, nty); else { z = nz; tx = ntx; ty = nty; aplicar(); } }
  function parar(){ animId++; inercia++; tgt = null; }

  /* ---- desenho ---- */
  function buildPlan(){
    var oo = '', caixas = [];
    function livre(x, y, w){ for(var i = 0; i < caixas.length; i++){ var c = caixas[i]; if(x < c[0] + c[2] && x + w > c[0] && Math.abs(y - c[1]) < 13) return false; } caixas.push([x, y, w]); return true; }
    function W(la, ln){ var q = proj(la, ln); return [q[0] * z, q[1] * z]; }
    D.AGUAS.forEach(function(a){ var t = W(a[1], a[2]); oo += '<text class="agua" x="' + t[0].toFixed(1) + '" y="' + t[1].toFixed(1) + '" text-anchor="middle">' + esc(a[0]) + '</text>'; });
    D.ILHAS.forEach(function(a){ var t = W(a[1], a[2]); if(z >= 2) oo += '<text class="lbl" x="' + (t[0] + 16).toFixed(1) + '" y="' + (t[1] - 14).toFixed(1) + '">' + esc(a[0]) + '</text>'; });
    D.ROADS.forEach(function(rd){ if(z < rd[2]) return; var m = rd[1][Math.floor(rd[1].length / 2)], t = W(m[0], m[1]); if(livre(t[0] - 40, t[1] - 6, rd[0].length * 5.6)) oo += '<text class="rua" x="' + t[0].toFixed(1) + '" y="' + (t[1] - 6).toFixed(1) + '" text-anchor="middle">' + esc(rd[0]) + '</text>'; });
    var lim = { 1:1.0, 2:2.4, 3:4.2 };
    D.BAIRROS.forEach(function(b){ if(z < lim[b[3]]) return; var t = W(b[1], b[2]); if(b[0] !== foco && !livre(t[0] + 5, t[1] + 4, b[0].length * 6.8)) return;
      oo += '<circle class="capdot" cx="' + t[0].toFixed(1) + '" cy="' + t[1].toFixed(1) + '" r="' + (b[3] === 1 ? 3 : 2) + '"/><text class="lbl' + (b[3] === 1 ? ' cid' : '') + (b[0] === foco ? ' foco' : '') + '" x="' + (t[0] + 5).toFixed(1) + '" y="' + (t[1] + 4).toFixed(1) + '">' + esc(b[0]) + '</text>'; });
    lblG.innerHTML = oo; plan.z = z; planAt = performance.now();
  }
  function render(){
    var now = performance.now(), dz = plan.z === null ? 1 : Math.abs(z - plan.z) / plan.z;
    if(plan.z === null || (dz > 0.0015 && (!moving || now - planAt > 260))) buildPlan();
    else if(dz > 0.0015 && !settleT) settleT = setTimeout(function(){ settleT = 0; aplicar(); }, 110);
    lblG.setAttribute('transform', 'translate(' + tx.toFixed(2) + ' ' + ty.toFixed(2) + ') scale(' + (z / plan.z).toFixed(4) + ')');
    var fk = z.toFixed(3) + '|' + cw + '|' + ch;
    if(fk !== fixKey){ fixKey = fk; var mpp = 111320 / (K * z), nice = [100, 200, 500, 1000, 2000, 5000, 10000], bm = nice[0]; for(var i = 0; i < nice.length; i++) if(nice[i] / mpp <= 110) bm = nice[i];
      var bw = bm / mpp, sy = ch - 34, oo = '';
      oo += '<path d="M14 ' + (sy - 5) + 'V' + sy + 'H' + (14 + bw) + 'V' + (sy - 5) + '" fill="none" stroke="var(--text-heading)" stroke-width="2"/><text class="esc" x="14" y="' + (sy - 9) + '">' + (bm >= 1000 ? (bm / 1000) + ' km' : bm + ' m') + '</text>';
      oo += '<g transform="translate(' + (cw - 24) + ' 26)"><path d="M0-14L6 6L0 2L-6 6Z" fill="var(--text-heading)"/><text class="esc" y="20" text-anchor="middle">N</text></g>';
      fixG.innerHTML = oo; }
    Object.keys(pins).forEach(function(id){ var p = pins[id], on = !vis || vis[id], t = tela(p.lat, p.lng);
      p.el.style.display = on ? '' : 'none'; if(on) p.el.setAttribute('transform', 'translate(' + t[0].toFixed(1) + ' ' + t[1].toFixed(1) + ') scale(' + (id === sel ? 1.1 : 0.85) + ')'); });
    if(me){ var u = tela(me.lat, me.lng); me.el.setAttribute('transform', 'translate(' + u[0].toFixed(1) + ' ' + u[1].toFixed(1) + ')'); }
  }

  /* ---- marcadores ---- */
  function hideTip(){ tip.hidden = true; }
  function showTip(id){ var p = pins[id]; if(!p || p.el.style.display === 'none') return; var t = tela(p.lat, p.lng); tip.textContent = p.name; tip.hidden = false;
    tip.style.left = Math.max(8, Math.min(cw - tip.offsetWidth - 8, t[0] - tip.offsetWidth / 2)) + 'px'; tip.style.top = Math.max(8, t[1] - 46 - tip.offsetHeight / 2) + 'px'; }
  svg.querySelector('.svgm-cells').addEventListener('click', function(e){ if(arrastou) return; var c = e.target.closest && e.target.closest('.cel'); if(c && o.onBairro) o.onBairro(c.getAttribute('data-b')); });
  gp.addEventListener('click', function(e){ if(arrastou) return; var g = e.target.closest('.svgm-pin'); if(g && o.onPick) o.onPick(g.getAttribute('data-id')); });
  gp.addEventListener('keydown', function(e){ var g = e.target.closest && e.target.closest('.svgm-pin'); if(g && (e.key === 'Enter' || e.key === ' ')){ e.preventDefault(); if(o.onPick) o.onPick(g.getAttribute('data-id')); } });
  gp.addEventListener('pointerover', function(e){ var g = e.target.closest('.svgm-pin'); if(g && e.pointerType === 'mouse') showTip(g.getAttribute('data-id')); });
  gp.addEventListener('pointerout', hideTip); gp.addEventListener('focusin', function(e){ var g = e.target.closest('.svgm-pin'); if(g) showTip(g.getAttribute('data-id')); }); gp.addEventListener('focusout', hideTip);
  function add(id, name, la, ln){
    if(pins[id]){ move(id, la, ln); return; }
    var g = document.createElementNS(NS, 'g'); g.setAttribute('class', 'svgm-pin'); g.setAttribute('data-id', id); g.setAttribute('tabindex', '0'); g.setAttribute('role', 'button'); g.setAttribute('aria-label', name);
    g.innerHTML = '<path class="body" d="' + PIN + '"/><circle cy="-22" r="4.5" class="dot"/>'; gp.appendChild(g); pins[id] = { el:g, name:name, lat:la, lng:ln, bairro:(o.bairroOf ? o.bairroOf(id) : null) }; aplicar();
  }
  function move(id, la, ln){ var p = pins[id]; if(p){ p.lat = la; p.lng = ln; aplicar(); } }
  function remove(id){ var p = pins[id]; if(p){ if(p.el.parentNode) p.el.parentNode.removeChild(p.el); delete pins[id]; } if(sel === id) setSelected(null); }
  function setVisible(ids){ vis = {}; (ids || []).forEach(function(i){ vis[i] = 1; }); aplicar(); }
  function setSelected(id){
    var prev = sel; sel = id && pins[id] ? id : null;
    Object.keys(pins).forEach(function(k){ pins[k].el.classList.toggle('sel', k === sel); });
    if(sel){ gp.appendChild(pins[sel].el); if(me) gp.appendChild(me.el); }
    if(sel) setFoco(pins[sel].bairro || bairroDe(pins[sel].lat, pins[sel].lng)); else if(prev) setFoco(null); if(prev !== sel) hideTip(); aplicar();
  }
  function setMe(la, ln){
    if(!me){ var g = document.createElementNS(NS, 'g'); g.setAttribute('class', 'svgm-me'); g.setAttribute('aria-hidden', 'true'); g.innerHTML = '<circle class="ring" r="12"/><circle class="core" r="7"/>'; gp.insertBefore(g, gp.firstChild); me = { el:g }; }
    me.lat = la; me.lng = ln; me.el.classList.remove('pulse'); void me.el.getBoundingClientRect(); me.el.classList.add('pulse'); aplicar();
  }
  function flyTo(la, ln, minZ){ medir(); parar(); var nz = Math.max(z, minZ || 4.5), q = proj(la, ln); animarPara(nz, cw / 2 - q[0] * nz, ch / 2 + 16 - q[1] * nz); }

  /* ---- interação: arrastar, pinça, roda e toque duplo ---- */
  function dist2(){ var k = Object.keys(ptrs); if(k.length < 2) return null; var a = ptrs[k[0]], b = ptrs[k[1]]; return { d:Math.max(1, Math.hypot(a.x - b.x, a.y - b.y)), cx:(a.x + b.x) / 2, cy:(a.y + b.y) / 2, z:z, tx:tx, ty:ty }; }
  host.addEventListener('pointerdown', function(e){
    if(e.target.closest('.svgm-zoom,.map-tools,.geo-ask,.geo-msg,.map-empty')) return;
    parar(); hideTip(); ptrs[e.pointerId] = { x:e.clientX, y:e.clientY }; arrastou = false; ini = { tx:tx, ty:ty, x:e.clientX, y:e.clientY }; vel = { x:0, y:0, px:e.clientX, py:e.clientY, t:performance.now() };
    if(Object.keys(ptrs).length === 2){ pinch0 = dist2(); arrastou = true; }
  });
  window.addEventListener('pointermove', function(e){
    if(!ptrs[e.pointerId]) return; ptrs[e.pointerId] = { x:e.clientX, y:e.clientY };
    var n = Object.keys(ptrs).length, r = host.getBoundingClientRect();
    if(n >= 2 && pinch0){ var c = dist2(), nz = Math.max(0.5, Math.min(14, pinch0.z * c.d / pinch0.d)), k = nz / pinch0.z;
      suave(nz, (c.cx - r.left) - (pinch0.cx - r.left - pinch0.tx) * k, (c.cy - r.top) - (pinch0.cy - r.top - pinch0.ty) * k); arrastou = true; return; }
    if(n === 1 && ini){ var dx = e.clientX - ini.x, dy = e.clientY - ini.y; if(Math.abs(dx) + Math.abs(dy) > 6) arrastou = true;
      if(arrastou){ var ag = performance.now(), dt = Math.max(1, ag - vel.t); vel.x = 0.8 * vel.x + 0.2 * ((e.clientX - vel.px) / dt); vel.y = 0.8 * vel.y + 0.2 * ((e.clientY - vel.py) / dt); vel.px = e.clientX; vel.py = e.clientY; vel.t = ag; tx = ini.tx + dx; ty = ini.ty + dy; aplicar(); } }
  });
  function soltar(e){
    var tinha = ptrs[e.pointerId]; delete ptrs[e.pointerId]; pinch0 = null; var k = Object.keys(ptrs);
    if(k.length === 1){ var p = ptrs[k[0]]; ini = { tx:tx, ty:ty, x:p.x, y:p.y }; return; }
    if(!tinha || k.length) return;
    if(arrastou){ if(performance.now() - vel.t < 80 && Math.hypot(vel.x, vel.y) > 0.25 && !reduce()){ var id = ++inercia, vx = vel.x, vy = vel.y;
      (function passo(){ if(id !== inercia) return; tx += vx * 16; ty += vy * 16; vx *= 0.92; vy *= 0.92; aplicar(); if(Math.hypot(vx, vy) > 0.03) requestAnimationFrame(passo); })(); }
    } else if(e.type === 'pointerup' && host.contains(e.target) && !e.target.closest('.svgm-pin,.svgm-zoom,.map-tools,.geo-ask,.geo-msg,.map-empty')){
      var ag = performance.now(), r = host.getBoundingClientRect();
      if(ag - lastTap.t < 320 && Math.hypot(e.clientX - lastTap.x, e.clientY - lastTap.y) < 30){ zoomEm(e.clientX - r.left, e.clientY - r.top, z * 2, true); lastTap.t = 0; } else lastTap = { t:ag, x:e.clientX, y:e.clientY };
    }
  }
  window.addEventListener('pointerup', soltar); window.addEventListener('pointercancel', soltar);
  host.addEventListener('wheel', function(e){ e.preventDefault(); animId++; inercia++; var r = host.getBoundingClientRect(), b = tgt || { z:z, x:tx, y:ty }, nz = Math.max(0.5, Math.min(14, b.z * Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0018)))), mx = e.clientX - r.left, my = e.clientY - r.top; suave(nz, mx - (mx - b.x) * (nz / b.z), my - (my - b.y) * (nz / b.z)); }, { passive:false });
  ['gesturestart', 'gesturechange', 'gestureend'].forEach(function(n){ host.addEventListener(n, function(e){ e.preventDefault(); }); });
  host.querySelector('.svgm-zoom').addEventListener('click', function(e){ var b = e.target.closest('button'); if(!b) return; medir(); parar();
    var k = b.getAttribute('data-z'); if(k === 'all'){ setFoco(null); all(); if(o.onReset) o.onReset(); } else zoomEm(cw / 2, ch / 2, z * (k === 'in' ? 1.6 : 1 / 1.6), true); });
  function resize(){ var antes = cw; medir(); if(antes < 50 && cw >= 50 && lastFit) fit(lastFit[0], { padT:lastFit[1].padT, padB:lastFit[1].padB, padL:lastFit[1].padL, padR:lastFit[1].padR, maxZ:lastFit[1].maxZ, now:true }); else aplicar(); }
  if(window.ResizeObserver) new ResizeObserver(resize).observe(host); else window.addEventListener('resize', resize);
  medir(); all(); started = true;
  return { add:add, move:move, remove:remove, setVisible:setVisible, setSelected:setSelected, setMe:setMe, fit:fit, flyTo:flyTo, resize:resize, setCoverage:setCoverage, focusBairro:focusBairro, bairroCenter:bairroCenter, bairroDe:bairroDe, setFoco:setFoco, bairros:function(){ return D.BAIRROS.map(function(b){ return b[0]; }); } };
};
})();

  