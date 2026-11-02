
    // Pontos de coleta próximos — mapa offline de Salvador (SVG próprio), busca, painel de
    // informações e agendamento de descarte.
    //
    // ATENÇÃO (dados): o projeto não possuía cadastro de pontos (só 3 marcadores decorativos). Os registros
    // abaixo são DE EXEMPLO, posicionados em bairros reais de Salvador; nomes, endereços, materiais e horários
    // devem ser substituídos pelo cadastro real. Toda a leitura/escrita passa pelo objeto EcoClickAPI.
    (function(){
  var tr = EcoI18n.t, TZ = 'America/Bahia';
  var $ = function(id){ return document.getElementById(id); };
  var card = $('coleta-map-card'); if(!card) return;
  function rj(k, d){ try{ var v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; }catch(e){ return d; } }
  function wj(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} }
  function el(tag, cls, text){ var e = document.createElement(tag); if(cls) e.className = cls; if(text != null) e.textContent = text; return e; }
  function norm(t){ return String(t).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase(); }
  function pad(n){ return (n < 10 ? '0' : '') + n; }

  /* ============ Dados verificáveis dos pontos ============
     Somente o que consta nas fontes abaixo. O que a fonte não informa fica como "pendente de verificação". */
  var SRC = {
    secti: { t:'Bahia Notícias — Secti instala novo ponto de coleta de resíduos eletrônicos e baterias em Salvador', u:'https://www.bahianoticias.com.br/noticia/280884-secti-instala-novo-ponto-de-coleta-de-residuos-eletronicos-e-baterias-em-salvador' },
    metro: { t:'BNews — Junho Verde: Metrô de Salvador intensifica campanha de descarte de lixo eletrônico nas estações (08/06/2026)', u:'https://www.bnews.com.br/noticias/salvador/junho-verde-metro-bahia-intensifica-campanha-de-descarte-de-lixo-eletronico-nas-estacoes-em-salvador-confira.html' },
    prints:{ t:'Pesquisa na internet (Google)', u:'' },
    limpurb:{ t:'Limpurb — Ecopontos de Salvador (endereço e horário)', u:'https://limpurb.salvador.ba.gov.br/ecoponto/' },
    bshop:{ t:'Brasil Shoppings — Salvador Shopping (endereço, telefone e horário do shopping)', u:'https://www.brasil-shoppings.com.br/centros-comerciais/bahia-shoppings/cidade-salvador/salvador-shopping' },
    acba:{ t:'Associação Comercial da Bahia — Veja onde descartar lixo eletrônico em Salvador', u:'https://www.acbahia.com.br/veja-onde-descartar-lixo-eletronico-em-salvador' },
    ilista:{ t:'iLista — Recicle Logística Reversa de Eletroeletrônicos (telefone)', u:'https://ilista.com.br/empresa/recicle/perfil' },
    shop:  { t:'BNews — Poluição tecnológica: empresas instalam pontos de coleta para lixo eletrônico em Salvador (13/07/2021)', u:'https://www.bnews.com.br/noticias/meio-ambiente/314312-poluicao-tecnologica-empresas-instalam-pontos-de-coleta-para-lixo-eletronico-em-salvador-assista.html' }
  };
  var MAT = { cel:'Celulares e tablets', nb:'Notebooks e computadores', pil:'Pilhas e baterias', cab:'Carregadores e cabos', eld:'Pequenos eletrodomésticos' };
  var PREP = {};
  PREP[MAT.cel] = ['Faça backup e apague seus dados (restaure o padrão de fábrica).', 'Saia das contas vinculadas (Google/Apple) e remova chip e cartão de memória.'];
  PREP[MAT.nb]  = ['Faça backup e apague seus arquivos e senhas.', 'Remova pendrives, discos externos e mídias.'];
  PREP[MAT.pil] = ['Não perfure, amasse nem abra pilhas e baterias.', 'Cubra os polos de baterias de lítio com fita isolante.', 'Bateria estufada, vazando ou quente: não leve junto com os outros itens; peça orientação ao ponto antes.'];
  PREP[MAT.cab] = ['Separe cabos e carregadores soltos em um saco ou caixa.'];
  PREP[MAT.eld] = ['Esvazie e limpe o aparelho; retire pilhas ou baterias, se houver.', 'Confirme com o ponto se o tamanho do aparelho é aceito.'];
  var METRO_MATS = [MAT.pil, MAT.cel, MAT.nb, MAT.cab];
  var METRO_NOTE = 'Segundo a fonte: pilhas, baterias e equipamentos eletrônicos de pequeno e médio porte, como celulares, tablets, notebooks, carregadores e cabos.';
  function metro(id, nome, bairro){ return { id:id, name:'Estação ' + nome + ' (Metrô)', kind:'Coletor Green Eletron na estação', operator:'CCR Metrô Bahia + Green Eletron', neighborhood:bairro, address:null,
    geoQ:'Estação ' + nome + ', Metrô de Salvador', materials:METRO_MATS, matNote:METRO_NOTE, hours:[], src:['metro'], v:{ address:false, materials:true, hours:false, phone:false } }; }
  var PRINTS = { prints:true };
  function P(id, name, kind, operator, o){ o = o || {}; return { id:id, name:name, kind:kind, operator:operator || name, neighborhood:o.bairro || null, bairro:o.bairro || null,
    address:o.address || null, geoQ:o.geoQ || (name + ', Salvador, Bahia'), geoApprox:!!o.seed, materials:o.mats || [], matNote:o.note || 'A pesquisa não detalha os itens aceitos.',
    pendingNote:o.pend || 'Dados vindos de pesquisa na internet: confirme com o local se o serviço está ativo e o horário antes de ir.', hours:[], src:['prints'],
    v:{ address:!!o.num, materials:!!(o.mats && o.mats.length), hours:false, phone:false } }; }
  var POINTS = [
    P('mrx', 'Lixo Eletrônico MRX', 'Coleta gratuita de eletrônicos', null, { bairro:'Boca do Rio', address:'Rua Jaime Loureiro, 87 — Boca do Rio, Salvador – BA', num:1, geoQ:'Rua Jaime Loureiro 87, Boca do Rio, Salvador', seed:1,
      note:'Segundo a pesquisa: coleta gratuita de diversos tipos de eletrônicos.' }),
    P('wbs', 'WBS — Coleta Gratuita Lixo Eletrônico', 'Serviço de coleta de lixo eletrônico', 'WBS', { bairro:'Boca do Rio', address:'Rua Lúcio Manoel da Hora — Boca do Rio, Salvador – BA (número não informado)', geoQ:'Rua Lúcio Manoel da Hora, Boca do Rio, Salvador', seed:1,
      mats:[MAT.nb, MAT.cel, MAT.eld], note:'Segundo a pesquisa: TVs, computadores, celulares e outros aparelhos que vão à tomada.' }),
    P('recicle-logistica', 'Recicle Logística Reversa de Eletrônicos', 'Centro de Reciclagem', null, { bairro:'Amaralina', address:'Rua Guanabara, 03 — Amaralina, Salvador – BA', num:1, geoQ:'Rua Guanabara 3, Amaralina, Salvador', seed:1,
      note:'Segundo a pesquisa: coleta gratuita (exceto linha branca), com emissão de certificado.' }),
    P('ecoponto-itaigara', 'Ecoponto Itaigara', 'Serviço de gerenciamento de descartes', null, { bairro:'Itaigara', address:'Rua Wanderley Pinho — Itaigara, Salvador – BA (número não informado)', geoQ:'Rua Wanderley Pinho, Itaigara, Salvador', seed:1,
      note:'Segundo a pesquisa: recebe materiais recicláveis e equipamentos eletroeletrônicos.' }),
    P('salvador-shopping', 'Salvador Shopping — Ecoponto', 'Ecoponto em shopping', 'Salvador Shopping', { bairro:'Caminho das Árvores', address:'Salvador Shopping, Piso G2 (ao lado da Magazine Luiza)', geoQ:'Salvador Shopping, Salvador, Bahia', seed:1,
      mats:[MAT.pil], note:'Segundo a pesquisa: descarte de resíduos eletrônicos, pilhas e baterias.' }),
    P('salvador-reciclagem', 'Salvador Reciclagem', 'Centro de Reciclagem', null, { address:'Av. Jorge Amado, Salvador – BA (número completo não informado)', geoQ:'Avenida Jorge Amado, Salvador, Bahia',
      note:'Serviço informado: reciclagem de produtos eletrônicos.' }),
    P('big-logistica', 'Big Logística Reversa de Eletrônicos', 'Centro de Reciclagem', null, { address:'R. do Norte, 64 — Salvador – BA', num:1, geoQ:'Rua do Norte 64, Salvador, Bahia',
      note:'Serviço informado: coleta, transporte e destinação final de resíduos eletroeletrônicos.' }),
    P('eco-coleta', 'ECO Coleta de Lixo Eletrônico', 'Ponto de coleta seletiva', null, { address:'R. Silveira Martins, 346 — Salvador – BA', num:1, geoQ:'Rua Silveira Martins 346, Salvador, Bahia',
      pend:'Na pesquisa aparece como "fechado temporariamente". Confirme com o local antes de ir.' }),
    P('recicla-salvador', 'Recicla Salvador', 'Centro de Reciclagem', null, { address:'R. Édson Saldanha, Salvador – BA (número completo não informado)', geoQ:'Rua Édson Saldanha, Salvador, Bahia',
      note:'Serviço informado: reciclagem de lixo eletrônico.' }),
    P('cooperativa-santos-titara', 'Cooperativa de Coleta Seletiva', 'Ponto de coleta seletiva', null, { address:'R. Santos Titara, 22 — Salvador – BA', num:1, geoQ:'Rua Santos Titara 22, Salvador, Bahia',
      note:'A pesquisa a lista como ponto de coleta seletiva e não informa se recebe eletrônicos.', pend:'Nome cortado na pesquisa. Confirme se aceita eletrônicos antes de ir.' }),
    P('residuos-log', 'Resíduos Log Lixo Eletrônico', 'Centro de Reciclagem', null, { address:'Av. Edgard Santos, Salvador – BA (número completo não informado)', geoQ:'Avenida Edgard Santos, Salvador, Bahia' }),
    P('jj-lixo-eletronico', 'JJ Lixo Eletrônico', 'Centro de Reciclagem', null, { address:'Baixa dos Sapateiros, Salvador – BA (número não informado)', geoQ:'Baixa dos Sapateiros, Salvador, Bahia' }),
    P('sucatex', 'Sucatex do Brasil', 'Serviço de gerenciamento de descartes', null, { address:'R. do Afeganistão, 10 — Salvador – BA', num:1, geoQ:'Rua do Afeganistão 10, Salvador, Bahia' }),
    P('sos-coleta', 'SOS Coleta de Eletrodomésticos', 'Serviço de coleta de lixo', null, { address:'Edifício Lucaia, Salvador – BA (endereço completo não informado)', geoQ:'Edifício Lucaia, Salvador, Bahia',
      note:'Serviço informado: remoção e descarte de lixo eletrônico.', pend:'Nome e endereço aparecem cortados na pesquisa. Confirme com o local antes de ir.' }),
    P('descarte-doacao-sucata', 'Descarte Doação Coleta Sucata', 'Centro de Reciclagem', null, { address:'Rua das Mangueiras, Salvador – BA (número não informado)', geoQ:'Rua das Mangueiras, Salvador, Bahia',
      pend:'Nome cortado na pesquisa. Confirme com o local antes de ir.' }),
    P('brasil-entulho', 'Brasil Entulho', 'Empresa de coleta de entulho', null, { address:'R. Homero Pires, Salvador – BA (número não informado)', geoQ:'Rua Homero Pires, Salvador, Bahia',
      note:'Serviço informado: remoção e descarte de lixo eletrônico.' })
  ];
  function find(id){ return POINTS.filter(function(p){ return p.id === id; })[0]; }

  var SEG08 = 'No Google: fechado no momento da consulta; reabre na segunda-feira às 08:00.';
  var EXTRA = {
    'mrx': { hoursNote:SEG08, hoursShort:'Abre seg. 08:00' },
    'wbs': { hoursNote:'No Google: aberto no dia da consulta, fechando às 19:00.', hoursShort:'Fecha 19:00 (no Google)' },
    'recicle-logistica': { phone:'(71) 8735-4096', phoneNote:'Telefone de um diretório online (ilista); pode estar desatualizado.', hoursNote:SEG08, hoursShort:'Abre seg. 08:00', src:['prints', 'ilista'] },
    'ecoponto-itaigara': { address:'Rua Wanderley de Pinho, s/n (no Waze consta nº 760) — Itaigara, Salvador – BA. Acesso pela Av. ACM, atrás do Hiper Posto BR.',
      phone:'156', phoneNote:'Central de atendimento da Prefeitura de Salvador (não é número exclusivo do ecoponto).',
      hours:[{ days:[1, 2, 3, 4, 5, 6], open:'07:00', close:'19:00', label:'Seg–Sáb' }, { days:[0], open:'08:00', close:'12:00', label:'Dom' }], hoursShort:'Seg–Sáb 07–19h · Dom 08–12h', src:['prints', 'limpurb'],
      pendingNote:'O site da Limpurb lista entulho, recicláveis, volumosos e poda; a pesquisa cita também eletroeletrônicos. Confirme antes de levar eletrônicos.', v:{ address:true, materials:false, hours:true, phone:true } },
    'salvador-shopping': { address:'Av. Tancredo Neves, 3133 — Caminho das Árvores, Salvador – BA, CEP 41820-021. Ecoponto no Piso G2, ao lado da Magazine Luiza.',
      phone:'(71) 3417-6000', phoneNote:'Telefone do shopping.',
      hours:[{ days:[1, 2, 3, 4, 5, 6], open:'09:00', close:'22:00', label:'Seg–Sáb' }, { days:[0], open:'13:00', close:'21:00', label:'Dom' }], hoursNote:'Horário do shopping; confirme o horário do ecoponto.', hoursShort:'Shopping: seg–sáb 09–22h', src:['prints', 'bshop'], v:{ address:true, materials:true, hours:true, phone:true } },
    'salvador-reciclagem': { hoursNote:SEG08, hoursShort:'Abre seg. 08:00' },
    'big-logistica': { hoursNote:SEG08, hoursShort:'Abre seg. 08:00' },
    'eco-coleta': { hoursNote:'No Google: fechado temporariamente.', hoursShort:'Fechado temporariamente' },
    'recicla-salvador': { hoursNote:SEG08, hoursShort:'Abre seg. 08:00' },
    'cooperativa-santos-titara': { hoursNote:'No Google: fechado no momento da consulta; reabre na segunda-feira às 07:00.', hoursShort:'Abre seg. 07:00' },
    'residuos-log': { hoursNote:SEG08, hoursShort:'Abre seg. 08:00' },
    'jj-lixo-eletronico': { bairro:'Nazaré', neighborhood:'Nazaré', address:'Rua Jogo do Carneiro, 54 — Nazaré, Salvador – BA (Baixa dos Sapateiros). Endereço de reportagem; no Google aparece "Baixa dos Sapateiros".', geoQ:'Rua Jogo do Carneiro 54, Salvador, Bahia', geoApprox:true,
      phone:'(62) 3549-7688', phoneNote:'Número com DDD 62 (Goiânia), indicado em reportagem como a matriz da empresa. Outro número publicado em 2014: (71) 3241-1463.',
      hoursNote:SEG08, hoursShort:'Abre seg. 08:00', src:['prints', 'acba'], v:{ address:true, materials:false, hours:false, phone:true } },
    'sucatex': { hoursNote:'No Google: aberto no dia da consulta, fechando às 19:00.', hoursShort:'Fecha 19:00 (no Google)' },
    'sos-coleta': { hoursNote:'No Google: fechado no momento da consulta; reabre na segunda-feira às 09:00.', hoursShort:'Abre seg. 09:00' },
    'descarte-doacao-sucata': { hoursNote:'No Google: fechado no momento da consulta; reabre na segunda-feira às 09:00.', hoursShort:'Abre seg. 09:00' },
    'brasil-entulho': { hoursNote:'No Google: aberto no dia da consulta, fechando às 00:00.', hoursShort:'Fecha 00:00 (no Google)' }
  };
  POINTS.forEach(function(p){ var x = EXTRA[p.id]; if(x) Object.keys(x).forEach(function(k){ p[k] = x[k]; }); });
  var IN_SSA = function(la, ln){ return la > -13.1 && la < -12.75 && ln > -38.7 && ln < -38.25; };

  /* Posições iniciais (aproximadas) tiradas do mapa offline do EcoClick: o ponto aparece no mapa mesmo sem internet.
     Coordenadas do banco (Supabase) ou geocodificadas e confirmadas têm prioridade sobre estas. */
  var SEED = { 'jj-lixo-eletronico':[-12.9805, -38.5045], 'mrx':[-12.981, -38.4265], 'wbs':[-12.9795, -38.4225], 'recicle-logistica':[-13.004, -38.478], 'ecoponto-itaigara':[-12.993, -38.454], 'salvador-shopping':[-12.983, -38.457] };

  /* ============ Localização dos pontos no mapa (OpenStreetMap / Nominatim, com cache) ============ */
  var GKEY = 'ecoclick_geocache_v1', gcache = rj(GKEY, {}), gq = [], gbusy = false, ready = false;
  function setGeo(pt, h, fromCache){
    pt.lat = +h.lat; pt.lng = +(h.lng != null ? h.lng : h.lon);
    pt.geo = { label:h.label || h.display_name || '', url:h.url || (h.osm_type ? 'https://www.openstreetmap.org/' + h.osm_type + '/' + h.osm_id : '') };
    if(!fromCache){ gcache[pt.id] = { lat:pt.lat, lng:pt.lng, label:pt.geo.label, url:pt.geo.url, at:Date.now() }; wj(GKEY, gcache); }
    if(!ready) return;
    addMarker(pt); refreshAll(true);
  }
  function geocodeNext(){
    if(gbusy || !gq.length) return; gbusy = true;
    var pt = gq.shift();
    var url = 'https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=br&accept-language=pt-BR&viewbox=-38.7,-12.75,-38.25,-13.1&bounded=1&q=' + encodeURIComponent(pt.geoQ);
    var done = function(){ setTimeout(function(){ gbusy = false; geocodeNext(); }, 1100); };   // política do Nominatim: 1 requisição/s
    try{
      fetch(url, { headers:{ 'Accept':'application/json' }, signal:(window.AbortController ? (function(){ var c = new AbortController(); setTimeout(function(){ c.abort(); }, 7000); return c.signal; })() : undefined) }).then(function(r){ return r.ok ? r.json() : []; }).then(function(a){
        var h = a && a[0]; if(h && IN_SSA(+h.lat, +h.lon)) setGeo(pt, h, false);
      }).catch(function(){}).then(done);
    }catch(e){ done(); }
  }
  /* ===== Pontos vindos do banco (Supabase): posição, materiais e horários já prontos ===== */ var DBK = 'eco_points_db_v1', DBC = {}; try{ DBC = (parent !== window && parent.ECO_CONFIG) || window.ECO_CONFIG || {}; }catch(e){ DBC = window.ECO_CONFIG || {}; } function applyDb(rows){ if(!Array.isArray(rows) || !rows.length) return; var ids = {}; rows.forEach(function(r){ ids[r.id] = 1; var pt = find(r.id), isNew = !pt; if(isNew){ pt = { id:r.id }; POINTS.push(pt); } var moved = pt.lat !== r.lat || pt.lng !== r.lng; pt.name = r.name; pt.kind = r.kind; pt.operator = r.operator; pt.neighborhood = r.neighborhood; pt.address = r.address; pt.geoQ = r.geoQ; pt.geoApprox = !!r.geoApprox; pt.materials = r.materials || []; pt.matNote = r.matNote; pt.pendingNote = r.pendingNote; pt.hours = r.hours || []; pt.src = r.src || []; pt.v = r.v || {}; if(r.lat != null && r.lng != null && IN_SSA(+r.lat, +r.lng)){ pt.lat = +r.lat; pt.lng = +r.lng; pt.geoDb = true; pt.geo = { label:r.geoLabel || '', url:r.geoUrl || '' }; gq = gq.filter(function(q){ return q.id !== pt.id; }); if(ready && markers[pt.id] && moved) map.move(pt.id, pt.lat, pt.lng); } else if(isNew) gq.push(pt); }); POINTS.slice().forEach(function(pt){ if(!ids[pt.id]){ if(markers[pt.id]){ map.remove(pt.id); delete markers[pt.id]; } POINTS.splice(POINTS.indexOf(pt), 1); } }); if(ready){ applyFilter(); visibleIds.forEach(function(id){ var p = find(id); if(p) addMarker(p); }); refreshAll(true); geocodeNext(); } } function loadDb(){ if(!window.EcoApi || !window.fetch) return; EcoApi.get('/points').then(function(rows){ if(Array.isArray(rows) && rows.length){ try{ localStorage.setItem(DBK, JSON.stringify({ at:Date.now(), rows:rows })); }catch(e){} applyDb(rows); } }).catch(function(){}); } try{ var dbSnap = JSON.parse(localStorage.getItem(DBK) || 'null'); if(dbSnap && dbSnap.rows) applyDb(dbSnap.rows); }catch(e){} loadDb(); setInterval(loadDb, 600000); document.addEventListener('visibilitychange', function(){ if(document.visibilityState === 'visible') loadDb(); }); POINTS.forEach(function(pt){ if(pt.geoDb) return; var c = gcache[pt.id]; if(c && IN_SSA(c.lat, c.lng)) setGeo(pt, c, true); else if(SEED[pt.id]){ pt.geoApprox = true; setGeo(pt, { lat:SEED[pt.id][0], lng:SEED[pt.id][1], label:'Posição aproximada no mapa offline do EcoClick', url:'' }, true); } else gq.push(pt); });

  /* ============ Datas ============ */
  var WD = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  function nowBA(){ return new Date(new Date().toLocaleString('en-US', { timeZone:TZ })); }
  function isoDate(d){ return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function addDays(d, n){ var x = new Date(d.getTime()); x.setDate(x.getDate() + n); return x; }
  function dtOf(a){ var p = a.date.split('-'), h = (a.time || '00:00').split(':'); return new Date(+p[0], +p[1] - 1, +p[2], +h[0], +h[1]); }
  function dayLabel(date){
    var p = date.split('-'), d = new Date(+p[0], +p[1] - 1, +p[2]), n = nowBA();
    var diff = Math.round((d - new Date(n.getFullYear(), n.getMonth(), n.getDate())) / 864e5);
    if(diff === 0) return 'Hoje'; if(diff === 1) return 'Amanhã';
    return WD[d.getDay()] + ' ' + pad(d.getDate()) + '/' + pad(d.getMonth() + 1);
  }
  function longDate(date){ var p = date.split('-'), d = new Date(+p[0], +p[1] - 1, +p[2]); return WD[d.getDay()] + ', ' + pad(d.getDate()) + '/' + pad(d.getMonth() + 1) + '/' + d.getFullYear(); }
  function hoursFor(pt, dow){ for(var i = 0; i < pt.hours.length; i++){ var h = pt.hours[i]; if(h.days.indexOf(dow) !== -1) return h.closed ? null : h; } return null; }
  function toMin(s){ var p = s.split(':'); return +p[0] * 60 + +p[1]; }
  function openState(pt){   // null = horário não verificado
    if(!pt.hours.length) return null;
    var n = nowBA(), h = hoursFor(pt, n.getDay()), m = n.getHours() * 60 + n.getMinutes();
    return !!(h && m >= toMin(h.open) && m < toMin(h.close));
  }
  function mapPref(k){ try{ return !!((JSON.parse(localStorage.getItem('ecoclick_settings') || '{}').preferences) || {})[k]; }catch(e){ return false; } }

  /* ============ Usuário ============ */
  function G(k){ try{ var v = localStorage.getItem(k); if(v != null) return v; }catch(e){} var o = window.__ECO || {}; return o[k] == null ? null : o[k]; }
  function getUser(){
    var u = null, p = null;
    try{ u = JSON.parse(G('ecoclick_current_user')); }catch(e){}
    try{ p = JSON.parse(G('ecoclick_profile')); }catch(e){}
    var name = (p && p.name) || (u && u.name) || '', email = (p && p.email) || (u && u.email) || '';
    return { name:String(name).trim(), email:String(email).trim() };
  }

  /* ============ Distância e localização do usuário ============ */
  var ME = { lat:null, lng:null, known:false };
  function rad(x){ return x * Math.PI / 180; }
  function km(a, b){
    var dLat = rad(b.lat - a.lat), dLng = rad(b.lng - a.lng);
    var s = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return 6371 * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
  }
  function fmtDist(k){ return k < 1 ? Math.max(10, Math.round(k * 100) * 10) + ' m' : k.toFixed(1).replace('.', ',') + ' km'; }
  function distOf(pt){ return (ME.known && pt.lat != null) ? km(ME, pt) : null; }

  /* ============ Favoritos ============ */
  function favs(){ var l = rj('ecoclick_fav_points', []); return Array.isArray(l) ? l : []; }
  function isFav(id){ return favs().indexOf(id) > -1; }
  function toggleFav(id){ var l = favs(), i = l.indexOf(id); if(i < 0) l.push(id); else l.splice(i, 1); wj('ecoclick_fav_points', l); renderDash(); return i < 0; }

  /* ============ Mapa (SVG próprio, offline: sem tiles e sem biblioteca externa) ============ */
  var search = $('coleta-search'), none = $('coleta-none');
  var markers = {}, selected = null, visibleIds = [];
  var map = EcoSvgMap($('coleta-map'), { bairroOf:function(id){ var p = find(id); return p ? p.bairro : null; }, onBairro:function(n){ openBairro(n, false); }, onReset:function(){ closeBairro(); }, label:tr('Mapa de Salvador com pontos de coleta'), zoomIn:tr('Aumentar zoom'), zoomOut:tr('Diminuir zoom'), reset:tr('Ver Salvador'), onPick:function(id){ select(id); } });
  function located(){ return POINTS.filter(function(p){ return p.lat != null; }); }
  function fit(ids){
    if(!map) return;
    var pts = POINTS.filter(function(p){ return ids.indexOf(p.id) !== -1 && p.lat != null; }).map(function(p){ return [p.lat, p.lng]; });
    if(ME.known) pts.push([ME.lat, ME.lng]);
    if(!pts.length) return;
    map.fit(pts, { padT:72, padB:40, padL:40, padR:56, maxZ:pts.length > 1 ? 6 : 5 });
  }
  function addMarker(pt){
    if(!map || markers[pt.id] || pt.lat == null) return;
    markers[pt.id] = 1; map.add(pt.id, pt.name, pt.lat, pt.lng); map.setVisible(visibleIds); if(selected === pt.id) map.setSelected(pt.id);
  }


  /* ============ Bairros: cobertura, zoom por busca, aviso do ponto mais próximo ============ */
  var BNAMES = map ? map.bairros() : [], BNORM = {}; BNAMES.forEach(function(n){ BNORM[norm(n)] = n; });
  var bl = $('bairro-list'); if(bl) BNAMES.slice().sort(function(a, b){ return a.localeCompare(b, 'pt-BR'); }).forEach(function(n){ var o = document.createElement('option'); o.value = n; bl.appendChild(o); });
  var bcard = $('bairro-card'), bask = $('bairro-ask'), askBairro = null, lastBq = null;
  function bairroOfPt(pt){ if(pt.bairro) return pt.bairro; return (map && pt.lat != null) ? map.bairroDe(pt.lat, pt.lng) : null; }
  function pointsIn(n){ return POINTS.filter(function(p){ return p.lat != null && bairroOfPt(p) === n; }); }
  function computeCoverage(){
    if(!map) return;
    var m = {}; POINTS.forEach(function(p){ if(p.lat == null) return; var b = bairroOfPt(p); if(b) m[b] = (m[b] || 0) + 1; });
    map.setCoverage(m);
    var c = [0, 0, 0, 0]; BNAMES.forEach(function(n){ c[Math.min(3, m[n] || 0)]++; });
    var lg = $('cov-list'); if(lg){ lg.textContent = ''; [['c0', 'Sem ponto cadastrado', c[0]], ['c1', '1 ponto', c[1]], ['c2', '2 pontos', c[2]], ['c3', '3 ou mais pontos', c[3]]].forEach(function(r){ var li = el('li'), i = el('i', r[0]); li.appendChild(i); li.appendChild(el('span', '', r[1] + ' · ' + r[2] + (r[2] === 1 ? ' bairro' : ' bairros'))); lg.appendChild(li); }); }
    var pend = POINTS.filter(function(p){ return p.lat == null; }).length;
    var sub = $('cov-sub'); if(sub){ sub.textContent = pend ? pend + ' ponto(s) aguardando localização no mapa.' : ''; sub.hidden = !pend; }
    if(!bcard.hidden && bcard.getAttribute('data-b')) openBairro(bcard.getAttribute('data-b'), true);
  }
  function nearestTo(n){
    var c = map.bairroCenter(n); if(!c) return null; var best = null, bd = Infinity;
    POINTS.forEach(function(p){ if(p.lat == null) return; var d = km({ lat:c[0], lng:c[1] }, p); if(d < bd){ bd = d; best = p; } });
    return best ? { pt:best, km:bd } : null;
  }
  function goNearest(n){
    var r = nearestTo(n); bask.hidden = true;
    if(!r){ geoMsg.hidden = false; geoMsg.textContent = 'Ainda não há pontos com localização no mapa.'; return; }
    geoMsg.hidden = false; geoMsg.textContent = 'Ponto mais próximo de ' + n + ': ' + r.pt.name + ' (' + fmtDist(r.km) + ' em linha reta).';
    setTimeout(function(){ geoMsg.hidden = true; }, 6000);
    select(r.pt.id);
  }
  function closeBairro(){ bcard.hidden = true; bcard.removeAttribute('data-b'); bask.hidden = true; if(map) map.setFoco(null); }
  function openBairro(n, keepView){
    if(!map) return; var pts = pointsIn(n); askBairro = n;
    bcard.setAttribute('data-b', n); bcard.textContent = '';
    var x = el('button', 'bc-x', '×'); x.type = 'button'; x.setAttribute('aria-label', 'Fechar'); x.addEventListener('click', closeBairro); bcard.appendChild(x);
    bcard.appendChild(el('h4', '', n));
    if(pts.length){
      bcard.appendChild(el('p', 'bc-sub', pts.length + (pts.length === 1 ? ' ponto de coleta neste bairro' : ' pontos de coleta neste bairro')));
      var ul = el('ul'); pts.forEach(function(p){ var li = el('li'), b = el('button'); b.type = 'button'; b.appendChild(document.createTextNode(p.name)); b.appendChild(el('small', '', p.kind)); if(p.address) b.appendChild(el('small', '', p.address)); b.appendChild(el('small', '', (p.phone ? '☎ ' + p.phone : '☎ não informado') + ' · ' + (p.hoursShort || 'horário não informado'))); b.addEventListener('click', function(){ select(p.id); }); li.appendChild(b); ul.appendChild(li); }); bcard.appendChild(ul);
    } else {
      bcard.appendChild(el('span', 'bc-badge', 'Sem ponto cadastrado'));
      bcard.appendChild(el('p', 'bc-sub', 'Ainda não há ponto de coleta cadastrado em ' + n + '.'));
      var nb = nearestTo(n);
      if(nb){ var b2 = el('button', 'bc-near', 'Ver o mais próximo: ' + nb.pt.name + ' (' + fmtDist(nb.km) + ')'); b2.type = 'button'; b2.addEventListener('click', function(){ goNearest(n); }); bcard.appendChild(b2); }
    }
    bcard.hidden = false;
    if(!keepView){ map.focusBairro(n, pts.map(function(p){ return [p.lat, p.lng]; }), pts.length ? 8 : 6.5); }
  }
  function goBairro(n){
    lastBq = n; geoMsg.hidden = true; openBairro(n, false);
    if(pointsIn(n).length){ bask.hidden = true; }
    else { $('ba-text').textContent = 'Não há ponto de coleta nesse bairro, deseja observar o mais próximo?'; bask.hidden = false; try{ $('ba-yes').focus({ preventScroll:true }); }catch(e){} }
  }
  $('ba-yes').addEventListener('click', function(){ if(askBairro) goNearest(askBairro); else bask.hidden = true; });
  $('ba-later').addEventListener('click', function(){ bask.hidden = true; });
  function uniquePrefix(q){ if(q.length < 3) return null; var m = BNAMES.filter(function(n){ return norm(n).indexOf(q) === 0; }); return m.length === 1 ? m[0] : null; }

  /* ============ Troca de views do painel ============ */
  var ORDER = ['empty', 'info', 'schedule', 'done'], views = {}, current = 'empty';
  Array.prototype.forEach.call(document.querySelectorAll('#coleta-panel .cview'), function(v){ views[v.getAttribute('data-view')] = v; });
  function showView(name, focusEl){
    current = name; var idx = ORDER.indexOf(name);
    ORDER.forEach(function(k, i){
      var v = views[k], on = k === name;
      v.classList.toggle('is-active', on); v.classList.toggle('is-before', !on && i < idx);
      if(on) v.removeAttribute('inert'); else v.setAttribute('inert', '');
      if(on) v.scrollTop = 0;
    });
    if(focusEl) try{ focusEl.focus({ preventScroll:true }); }catch(e){ focusEl.focus(); }
  }

  /* ============ Filtros ============ */
  var F = { mats:[], dist:0, open:mapPref('onlyOpen'), fav:false };
  function matchPoint(pt, q){
    if(F.mats.length && !F.mats.every(function(m){ return pt.materials.indexOf(m) > -1; })) return false;
    if(F.open && openState(pt) !== true) return false;
    if(F.fav && !isFav(pt.id)) return false;
    if(F.dist){ var d = distOf(pt); if(d == null || d > F.dist) return false; }
    if(q){ var hay = norm([pt.name, pt.neighborhood || '', pt.address || '', pt.kind, pt.operator, pt.materials.join(' ')].join(' ')); if(hay.indexOf(q) === -1) return false; }
    return true;
  }
  function applyFilter(){
    var q = norm(search.value.trim()); if(BNORM[q]) q = ''; visibleIds = POINTS.filter(function(pt){ return matchPoint(pt, q); }).map(function(p){ return p.id; });
    computeCoverage();
    if(map) map.setVisible(visibleIds);
    none.hidden = visibleIds.length > 0;
    if(selected && visibleIds.indexOf(selected) === -1){ selected = null; if(current !== 'empty') showView('empty'); }
    renderFilters(); renderList();
    return visibleIds;
  }
  function renderFilters(){
    var box = $('cf-mats'); box.textContent = '';
    Object.keys(MAT).forEach(function(k){
      var b = el('button', 'cf-chip' + (F.mats.indexOf(MAT[k]) > -1 ? ' on' : ''), MAT[k]); b.type = 'button'; b.setAttribute('aria-pressed', String(F.mats.indexOf(MAT[k]) > -1));
      b.addEventListener('click', function(){ var i = F.mats.indexOf(MAT[k]); if(i < 0) F.mats.push(MAT[k]); else F.mats.splice(i, 1); applyFilter(); if(visibleIds.length) fit(visibleIds); });
      box.appendChild(b);
    });
    $('cf-dist').value = String(F.dist);
    $('cf-open').classList.toggle('on', F.open); $('cf-open').setAttribute('aria-pressed', String(F.open));
    $('cf-fav').classList.toggle('on', F.fav); $('cf-fav').setAttribute('aria-pressed', String(F.fav));
    var any = F.mats.length || F.dist || F.open || F.fav || search.value.trim();
    $('cf-clear').hidden = !any;
    var notes = [];
    if(F.dist && !ME.known) notes.push('Para filtrar por distância, permita o acesso à sua localização (botão ◎ no mapa).');
    if(F.open) notes.push('"Abertos agora" só considera pontos com horário verificado. Nenhum dos pontos atuais informou horário.');
    var hiddenPending = F.mats.length ? POINTS.filter(function(p){ return !p.materials.length; }).length : 0;
    if(hiddenPending) notes.push(hiddenPending + ' ponto(s) sem lista de materiais confirmada não aparecem com este filtro.');
    var n = $('cf-note'); n.hidden = !notes.length; n.textContent = notes.join(' ');
    $('cf-dist').disabled = false;
  }
  function renderList(){
    var ul = $('coleta-list'); ul.textContent = '';
    var vis = visibleIds.map(find).filter(Boolean);
    vis.sort(function(a, b){ var da = distOf(a), db = distOf(b); if(da != null && db != null) return da - db; if(da != null) return -1; if(db != null) return 1; return POINTS.indexOf(a) - POINTS.indexOf(b); });
    $('cl-sub').textContent = vis.length ? (vis.length + (vis.length === 1 ? ' ponto' : ' pontos') + ' · selecione um para ver os detalhes') : 'Nenhum ponto encontrado com os filtros atuais.';
    var rec = F.mats.length ? vis.filter(function(p){ return p.lat != null || true; }).slice(0, 1) : [];
    vis.forEach(function(pt, i){
      var li = el('li'), b = el('button', 'cl-item' + (pt.id === selected ? ' on' : '')); b.type = 'button';
      var main = el('span', 'cl-main'); main.appendChild(el('strong', '', (isFav(pt.id) ? '★ ' : '') + pt.name));
      main.appendChild(el('small', '', pt.neighborhood || pt.kind));
      if(pt.address) main.appendChild(el('small', 'cl-addr', pt.address.split(' — ')[0].replace(/ \(.*$/, '') + (pt.address.indexOf(' — ') > -1 ? ' — ' + pt.address.split(' — ')[1].split('.')[0].replace(/ \(.*$/, '') : '')));
      main.appendChild(el('small', 'cl-ph', (pt.phone ? '☎ ' + pt.phone : '☎ não informado') + ' · ' + (pt.hoursShort || 'horário não informado')));
      var side = el('span', 'cl-side'), d = distOf(pt);
      side.appendChild(el('span', 'cl-d', d != null ? fmtDist(d) : (pt.lat == null ? 'local no mapa pendente' : '')));
      if(F.mats.length && i === 0) side.appendChild(el('span', 'cl-rec', 'Recomendado'));
      b.appendChild(main); b.appendChild(side); b.addEventListener('click', function(){ select(pt.id); }); li.appendChild(b); ul.appendChild(li);
    });
  }
  function refreshAll(fromGeo){ applyFilter(); if(fromGeo && !selected && map && visibleIds.length && located().length <= POINTS.length) fit(visibleIds); if(selected && current === 'info') fillInfo(find(selected)); }
  var bqT = null;
  search.addEventListener('input', function(){
    var q = norm(search.value.trim()), v = applyFilter(), bq = BNORM[q]; clearTimeout(bqT);
    if(bq){ if(bq !== lastBq) bqT = setTimeout(function(){ goBairro(bq); }, 250); return; }
    lastBq = null; if(!bcard.hidden && !selected) closeBairro(); if(search.value.trim()) fit(v);
  });
  search.addEventListener('keydown', function(e){ if(e.key === 'Enter'){ e.preventDefault(); clearTimeout(bqT);
    var q = norm(search.value.trim()), v = applyFilter(), bq = BNORM[q] || (!v.length ? uniquePrefix(q) : null);
    if(bq){ if(norm(search.value.trim()) !== norm(bq)) search.value = bq; applyFilter(); goBairro(bq); return; }
    if(v.length === 1) select(v[0]); else fit(v); } });
  $('cf-dist').addEventListener('change', function(){ F.dist = +this.value; applyFilter(); fit(visibleIds); });
  $('cf-open').addEventListener('click', function(){ F.open = !F.open; applyFilter(); });
  $('cf-fav').addEventListener('click', function(){ F.fav = !F.fav; applyFilter(); });
  $('cf-clear').addEventListener('click', function(){ F = { mats:[], dist:0, open:false, fav:false }; search.value = ''; lastBq = null; closeBairro(); applyFilter(); fit(visibleIds); });
  $('coleta-all').addEventListener('click', function(){ F = { mats:[], dist:0, open:false, fav:false }; search.value = ''; lastBq = null; closeBairro(); select(null); applyFilter(); fit(visibleIds); });

  /* ============ Informações do ponto ============ */
  function flag(txt, ok){ return el('span', 'ci-flag ' + (ok ? 'ok' : 'pend'), txt); }
  function fillInfo(pt){
    $('coleta-name').textContent = pt.name;
    var st = $('coleta-status'), os = openState(pt);
    st.textContent = os === null ? 'Horário a confirmar' : (os ? 'Aberto agora' : 'Fechado'); st.classList.toggle('is-closed', os === false); st.classList.toggle('is-pending', os === null);
    $('ci-op').textContent = pt.kind + ' · ' + pt.operator;
    var d = distOf(pt); $('coleta-dist').textContent = d != null ? fmtDist(d) + ' de você (em linha reta)' : (pt.lat == null ? 'Local no mapa ainda não confirmado' : 'Distância indisponível — permita sua localização');
    $('coleta-address').textContent = pt.address || 'Endereço completo pendente de verificação';
    var fl = $('ci-flags'); fl.textContent = '';
    fl.appendChild(flag(pt.v.address ? 'Endereço informado na fonte' : 'Endereço pendente', pt.v.address));
    fl.appendChild(flag(pt.v.materials ? 'Materiais informados na fonte' : 'Materiais pendentes', pt.v.materials));
    fl.appendChild(flag(pt.hours.length ? 'Horário informado' : (pt.hoursNote ? 'Horário parcial' : 'Horário pendente'), !!pt.hours.length)); fl.appendChild(flag(pt.phone ? 'Telefone informado' : 'Telefone pendente', !!pt.phone));
    fl.appendChild(flag(pt.lat != null ? 'Posição: ' + (pt.geo && pt.geo.url ? 'OpenStreetMap' : 'mapa offline') + (pt.geoApprox ? ' (aproximada)' : '') : 'Posição no mapa pendente', pt.lat != null));
    var pn = $('ci-pend'); pn.hidden = !pt.pendingNote; pn.textContent = pt.pendingNote || '';
    var chips = $('coleta-materials'); chips.textContent = '';
    if(pt.materials.length) pt.materials.forEach(function(m){ chips.appendChild(el('span', '', m)); }); else chips.appendChild(el('span', 'is-pend', 'Lista de materiais pendente de verificação'));
    $('ci-restr').textContent = pt.matNote + ' Restrições (tamanho, quantidade): não informadas na fonte.';
    var hrs = $('coleta-hours'); hrs.textContent = '';
    if(pt.hours.length) pt.hours.forEach(function(h){ var row = el('div'); row.appendChild(el('dt', '', h.label)); row.appendChild(el('dd', '', h.closed ? 'Fechado' : h.open + '–' + h.close)); hrs.appendChild(row); });
    if(pt.hoursNote) hrs.appendChild(el('p', 'ci-small', pt.hoursNote));
    if(!pt.hours.length && !pt.hoursNote) hrs.appendChild(el('p', 'ci-small', 'Horário de funcionamento não informado pela fonte. Confirme com o local antes de ir.'));
    var ph = $('ci-phone'); ph.textContent = ''; var call = $('coleta-call');
    if(pt.phone){ var a = el('a', 'ci-tel', pt.phone); a.href = 'tel:' + pt.phone.replace(/[^\d+]/g, ''); ph.appendChild(el('b', '', 'Telefone: ')); ph.appendChild(a); if(pt.phoneNote) ph.appendChild(el('span', 'ci-ph-note', ' — ' + pt.phoneNote));
      call.hidden = false; call.href = a.href; call.textContent = 'Ligar para ' + pt.phone; }
    else { ph.textContent = 'Telefone não informado nas fontes consultadas. Confirme o contato diretamente com o local.'; call.hidden = true; }
    var prep = $('ci-prep'); prep.textContent = ''; var seen = {};
    (pt.materials.length ? pt.materials : Object.keys(PREP).map(function(k){ return k; })).forEach(function(m){ (PREP[m] || []).forEach(function(t){ if(!seen[t]){ seen[t] = 1; prep.appendChild(el('li', '', t)); } }); });
    var src = $('ci-src'); src.textContent = '';
    pt.src.forEach(function(k){ var li = el('li'); if(SRC[k].u){ var a = el('a', '', SRC[k].t); a.href = SRC[k].u; a.target = '_blank'; a.rel = 'noopener'; li.appendChild(a); } else li.textContent = SRC[k].t; src.appendChild(li); });
    if(pt.geo && pt.geo.url){ var li = el('li'), a = el('a', '', 'Posição no mapa: OpenStreetMap — ' + (pt.geo.label || 'registro')); a.href = pt.geo.url; a.target = '_blank'; a.rel = 'noopener'; li.appendChild(a); src.appendChild(li); }
    var fv = $('coleta-fav'), on = isFav(pt.id); fv.classList.toggle('on', on); fv.setAttribute('aria-pressed', String(on)); fv.setAttribute('aria-label', on ? 'Remover dos favoritos' : 'Salvar como favorito');
    fillRating(pt);
  }
  function select(id){
    if(map) map.setSelected(id);
    selected = id; resetSchedule();
    var pt = id ? find(id) : null;
    if(!pt){ showView('empty'); renderList(); return; }
    fillInfo(pt); showView('info'); renderList();
    if(map && pt.lat != null) map.flyTo(pt.lat, pt.lng, 4.5);
  }
  $('info-back').addEventListener('click', function(){ select(null); });
  $('coleta-fav').addEventListener('click', function(){ var pt = find(selected); if(!pt) return; toggleFav(pt.id); fillInfo(pt); renderList(); if(F.fav) applyFilter(); });

  /* ============ Permissão de localização ============ */
  var ask = $('geo-ask'), geoMsg = $('geo-msg');
  function placeMe(la, ln){
    ME.lat = la; ME.lng = ln; ME.known = true;
    if(map) map.setMe(la, ln);
    geoMsg.hidden = true; applyFilter();
    var best = null, bd = Infinity; POINTS.forEach(function(p){ var d = distOf(p); if(d != null && d < bd){ bd = d; best = p; } });
    if(best) select(best.id); else fit(visibleIds);
  }
  function requestGeo(){
    ask.hidden = true;
    if(!navigator.geolocation){ geoMsg.hidden = false; geoMsg.textContent = 'Seu navegador não permite localização. As distâncias não serão exibidas.'; return; }
    navigator.geolocation.getCurrentPosition(function(pos){
      var la = pos.coords.latitude, ln = pos.coords.longitude;
      if(IN_SSA(la, ln)) placeMe(la, ln); else { geoMsg.hidden = false; geoMsg.textContent = 'Sua localização está fora de Salvador, então não calculamos distâncias.'; }
    }, function(err){
      geoMsg.hidden = false;
      geoMsg.textContent = err && err.code === 1 ? 'Permissão de localização negada. As distâncias não serão exibidas.' : 'Não foi possível obter sua localização agora. As distâncias não serão exibidas.';
    }, { timeout:8000, maximumAge:60000 });
  }
  $('coleta-locate').addEventListener('click', function(){ if(ME.known){ placeMe(ME.lat, ME.lng); return; } geoMsg.hidden = true; ask.hidden = false; $('geo-yes').focus(); });
  $('geo-yes').addEventListener('click', requestGeo);
  $('geo-no').addEventListener('click', function(){ ask.hidden = true; });

  /* ============ Notificações e agendamentos (dados do usuário) ============ */
  function notify(type, title, text){
    try{ if(window.EcoApp && EcoApp.notify) EcoApp.notify({ id:'n_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5), type:type, title:title, text:text, createdAt:new Date().toISOString(), read:false }); }catch(e){}
  }
  function normAppt(a){
    if(!a || !a.id || !a.date) return null;
    if(!a.materials) a.materials = a.material ? [a.material] : [];
    if(a.status === 'confirmed') a.status = 'planned';
    if(!a.history) a.history = [{ at:a.createdAt || new Date().toISOString(), ev:'Plano registrado' }];
    return a;
  }
  function readA(){ var l = rj('ecoclick_appointments', []); return (Array.isArray(l) ? l : []).map(normAppt).filter(Boolean); }
  function saveA(l){ wj('ecoclick_appointments', l); renderDash(); }
  function code(list){ var AL = '23456789ABCDEFGHJKMNPQRSTUVWXYZ', c; do{ c = 'ECO-'; for(var i = 0; i < 6; i++) c += AL.charAt(Math.floor(Math.random() * AL.length)); }while(list.some(function(a){ return a.code === c; })); return c; }
  function pointOf(a){ return find(a.pointId) || { id:a.pointId, name:a.pointName || 'Ponto de coleta', address:a.address || '' }; }

  /* ============ Planejar descarte ============ */
  var S = { materials:[], qty:'', date:null, time:'', note:'', step:'form' };
  var elMat = $('sched-materials'), elDays = $('sched-days'), elErr = $('sched-error'), btnOk = $('sched-confirm'), btnEdit = $('sched-edit');
  function chip(label, selected, onClick, role){ var b = el('button', 'chip' + (selected ? ' is-selected' : ''), label); b.type = 'button'; b.setAttribute('role', role || 'radio'); b.setAttribute('aria-checked', String(!!selected)); b.addEventListener('click', onClick); return b; }
  function resetSchedule(){
    S = { materials:[], qty:'', date:null, time:'', note:'', step:'form', editId:null };
    ['sched-qty', 'sched-time', 'sched-note-in', 'sched-name', 'sched-email'].forEach(function(i){ $(i).value = ''; $(i).removeAttribute('aria-invalid'); });
    elErr.textContent = ''; $('sched-review').hidden = true; $('sched-fields').hidden = false; btnOk.textContent = 'Revisar plano'; btnOk.disabled = false; btnEdit.hidden = true;
    elMat.textContent = elDays.textContent = '';
  }
  function renderMaterials(pt){
    elMat.textContent = '';
    var list = pt.materials.length ? pt.materials : [];
    if(!list.length){ elMat.appendChild(el('p', 'sched-note', 'Este ponto ainda não tem lista de materiais confirmada. Confirme com o local antes de planejar o descarte.')); return; }
    list.forEach(function(m){ elMat.appendChild(chip(m, S.materials.indexOf(m) > -1, function(){ var i = S.materials.indexOf(m); if(i < 0) S.materials.push(m); else S.materials.splice(i, 1); renderMaterials(pt); }, 'checkbox')); });
  }
  function renderDays(){
    elDays.textContent = ''; var base = nowBA();
    for(var i = 0; i < 7; i++){ (function(d){ elDays.appendChild(chip(dayLabel(d), S.date === d, function(){ S.date = d; renderDays(); })); })(isoDate(addDays(base, i))); }
  }
  function openSchedule(pt, existing){
    resetSchedule();
    $('sched-point').textContent = pt.name + (pt.neighborhood ? ' · ' + pt.neighborhood : '');
    var u = getUser(), who = $('sched-who'), hasId = u.name.length >= 2 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(u.email);
    who.hidden = !hasId; $('sched-user').hidden = hasId;
    if(hasId){ who.textContent = ''; who.appendChild(el('span', '', 'Em nome de ')); who.appendChild(el('b', '', u.name)); who.appendChild(el('span', '', ' · ' + u.email)); }
    else{ $('sched-name').value = u.name; $('sched-email').value = u.email; }
    if(existing){ S.editId = existing.id; S.materials = existing.materials.slice(); S.qty = existing.qty || ''; S.date = existing.date; S.time = existing.time; S.note = existing.note || ''; $('sched-qty').value = S.qty; $('sched-time').value = S.time; $('sched-note-in').value = S.note; }
    $('sched-title').textContent = existing ? 'Reagendar plano' : 'Planejar descarte';
    renderMaterials(pt); renderDays(); showView('schedule', $('sched-back'));
  }
  function collect(pt){
    var u = getUser(), hasId = !$('sched-user').hidden === false;
    var name = $('sched-user').hidden ? u.name : $('sched-name').value.trim(), email = $('sched-user').hidden ? u.email : $('sched-email').value.trim(), err = '';
    S.qty = $('sched-qty').value.trim(); S.time = $('sched-time').value; S.note = $('sched-note-in').value.trim().slice(0, 200);
    ['sched-name', 'sched-email', 'sched-qty', 'sched-time'].forEach(function(i){ $(i).removeAttribute('aria-invalid'); });
    if(!$('sched-user').hidden && name.length < 2){ err = 'Informe seu nome.'; $('sched-name').setAttribute('aria-invalid', 'true'); }
    else if(!$('sched-user').hidden && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){ err = 'Informe um e-mail válido.'; $('sched-email').setAttribute('aria-invalid', 'true'); }
    else if(!pt.materials.length) err = 'Este ponto ainda não tem materiais confirmados. Confirme com o local antes de planejar.';
    else if(!S.materials.length) err = 'Escolha ao menos um material.';
    else if(!/^\d{1,3}$/.test(S.qty) || +S.qty < 1){ err = 'Informe a quantidade estimada de itens (1 a 999).'; $('sched-qty').setAttribute('aria-invalid', 'true'); }
    else if(!S.date) err = 'Escolha o dia.';
    else if(!S.time){ err = 'Informe o horário em que pretende ir.'; $('sched-time').setAttribute('aria-invalid', 'true'); }
    else if(dtOf({ date:S.date, time:S.time }) <= nowBA()){ err = 'Escolha um horário que ainda não passou.'; $('sched-time').setAttribute('aria-invalid', 'true'); }
    else if(readA().some(function(a){ return a.id !== S.editId && a.pointId === pt.id && a.date === S.date && a.time === S.time && (a.status === 'planned' || a.status === 'pending_validation'); })) err = 'Você já tem um plano para este ponto neste mesmo horário.';
    elErr.textContent = err; return err ? null : { name:name, email:email };
  }
  function buildReview(pt, who){
    var r = $('sched-review'); r.textContent = '';
    var rows = [['Ponto', pt.name], ['Endereço', pt.address || 'Endereço pendente de verificação'], ['Quando', longDate(S.date) + ' às ' + S.time], ['Materiais', S.materials.join(', ')], ['Quantidade estimada', S.qty + (+S.qty === 1 ? ' item' : ' itens')], ['Em nome de', who.name + ' · ' + who.email]];
    if(S.note) rows.push(['Observação', S.note]);
    var dl = el('dl', 'rv-list'); rows.forEach(function(x){ var d = el('div'); d.appendChild(el('dt', '', x[0])); d.appendChild(el('dd', '', x[1])); dl.appendChild(d); }); r.appendChild(dl);
    r.appendChild(el('p', 'sched-disc', 'Este é um plano registrado no EcoClick, e não uma reserva. O ponto não informou agendamento: o recebimento depende do horário de funcionamento do local. O descarte só conta para pontos depois de validado.'));
    var pr = el('ul', 'ci-prep'); S.materials.forEach(function(m){ (PREP[m] || []).forEach(function(t){ pr.appendChild(el('li', '', t)); }); });
    if(pr.children.length){ r.appendChild(el('div', 'coleta-label', 'Antes de sair de casa')); r.appendChild(pr); }
    r.hidden = false; $('sched-fields').hidden = true; btnEdit.hidden = false; btnOk.textContent = S.editId ? 'Confirmar nova data' : 'Confirmar plano'; S.step = 'review'; S.who = who; r.scrollIntoView({ block:'nearest' });
  }
  $('coleta-details').addEventListener('click', function(){ var pt = find(selected); if(pt) openSchedule(pt); });
  $('sched-back').addEventListener('click', function(){ if(S.editId){ showView('info'); return; } showView('info', $('coleta-details')); });
  btnEdit.addEventListener('click', function(){ S.step = 'form'; $('sched-review').hidden = true; $('sched-fields').hidden = false; btnEdit.hidden = true; btnOk.textContent = 'Revisar plano'; });
  btnOk.addEventListener('click', function(){
    var pt = find(selected); if(!pt) return;
    if(S.step === 'form'){ var who = collect(pt); if(who) buildReview(pt, who); return; }
    var who2 = collect(pt) || S.who; if(!who2) return;
    var list = readA(), now = new Date().toISOString(), rec;
    if(S.editId){
      rec = list.filter(function(a){ return a.id === S.editId; })[0]; if(!rec) return;
      rec.date = S.date; rec.time = S.time; rec.qty = S.qty; rec.materials = S.materials.slice(); rec.material = rec.materials.join(', '); rec.note = S.note; rec.reminded = false;
      rec.history.push({ at:now, ev:'Reagendado para ' + longDate(S.date) + ' às ' + S.time });
      saveA(list); notify('appointment', 'Plano reagendado', pt.name + ': ' + longDate(S.date) + ' às ' + S.time + '.');
    } else {
      rec = { id:'ag_' + Date.now().toString(36), code:code(list), kind:'plan', status:'planned', pointId:pt.id, pointName:pt.name, address:pt.address || '', user:who2,
        materials:S.materials.slice(), material:S.materials.join(', '), qty:S.qty, note:S.note, date:S.date, time:S.time, timezone:TZ, createdAt:now, history:[{ at:now, ev:'Plano registrado' }] };
      list.push(rec); saveA(list);
      notify('appointment', 'Plano de descarte registrado', pt.name + ': ' + longDate(S.date) + ' às ' + S.time + ' (código ' + rec.code + ').');
    }
    document.dispatchEvent(new CustomEvent('ecoclick:appointment-created', { detail:rec }));
    var t = $('done-text'); t.textContent = ''; t.appendChild(el('b', '', rec.materials.join(', '))); t.appendChild(document.createTextNode(' em ')); t.appendChild(el('b', '', pt.name));
    t.appendChild(document.createTextNode(' — ' + longDate(rec.date) + ' às ' + rec.time + '. Código: ')); t.appendChild(el('b', 'done-code', rec.code)); t.appendChild(document.createTextNode('. Plano salvo em Meus agendamentos.'));
    showView('done', $('done-agenda'));
  });
  $('done-close').addEventListener('click', function(){ select(selected); });
  $('done-agenda').addEventListener('click', function(){ openAgenda(); });

  /* ============ Avaliação e problemas ============ */
  function reviews(){ var r = rj('ecoclick_point_reviews', {}); return r && typeof r === 'object' ? r : {}; }
  function reports(){ var r = rj('ecoclick_point_reports', []); return Array.isArray(r) ? r : []; }
  function moderate(t){ t = String(t || '').trim(); if(t.length > 240) return 'O comentário passa de 240 caracteres.'; if(/(https?:\/\/|www\.|@\w+\.\w)/i.test(t)) return 'Não inclua links ou e-mails no comentário.'; if(/(.)\1{7,}/.test(t)) return 'Evite repetir o mesmo caractere muitas vezes.'; return ''; }
  function hasExperience(pid){ return readA().some(function(a){ return a.pointId === pid && (a.status === 'pending_validation' || a.status === 'completed'); }); }
  function fillRating(pt){
    var box = $('ci-rate'); box.textContent = '';
    var mine = reviews()[pt.id], okExp = hasExperience(pt.id);
    box.appendChild(el('div', 'coleta-label', 'Avaliação e problemas'));
    if(!okExp){ box.appendChild(el('p', 'ci-small', 'Você poderá avaliar este ponto depois de registrar um descarte aqui, para manter as avaliações confiáveis. Ainda não há avaliações públicas: elas dependem do serviço de avaliações do EcoClick.')); }
    else {
      var stars = el('div', 'rt-stars'), val = mine ? mine.stars : 0;
      for(var i = 1; i <= 5; i++){ (function(n){ var b = el('button', 'rt-star' + (n <= val ? ' on' : ''), '★'); b.type = 'button'; b.setAttribute('aria-label', n + ' de 5'); b.addEventListener('click', function(){ val = n; Array.prototype.forEach.call(stars.children, function(c, k){ c.classList.toggle('on', k < n); }); }); stars.appendChild(b); })(i); }
      var ta = el('textarea', 'rt-text'); ta.maxLength = 240; ta.placeholder = 'Comentário (opcional)'; ta.value = mine ? mine.comment : '';
      var send = el('button', 'sched-confirm', mine ? 'Atualizar minha avaliação' : 'Enviar avaliação'); send.type = 'button'; var msg = el('p', 'ci-small');
      send.addEventListener('click', function(){ if(!val){ msg.textContent = 'Escolha de 1 a 5 estrelas.'; return; } var m = moderate(ta.value); if(m){ msg.textContent = m; return; }
        var r = reviews(); r[pt.id] = { stars:val, comment:ta.value.trim(), at:new Date().toISOString() }; wj('ecoclick_point_reviews', r); msg.textContent = 'Avaliação salva. Cada pessoa tem uma avaliação por ponto.'; send.textContent = 'Atualizar minha avaliação'; });
      box.appendChild(stars); box.appendChild(ta); box.appendChild(send); box.appendChild(msg);
    }
    var rp = el('details', 'rt-report'), sm = el('summary', '', 'Relatar problema neste ponto');
    var sel = el('select'); ['Ponto fechado ou inexistente', 'Coletor cheio ou danificado', 'Informação incorreta', 'Outro'].forEach(function(o){ sel.appendChild(el('option', '', o)); });
    var tx = el('textarea', 'rt-text'); tx.maxLength = 240; tx.placeholder = 'Descreva o que aconteceu';
    var sb = el('button', 'sched-confirm', 'Enviar relato'); sb.type = 'button'; var m2 = el('p', 'ci-small');
    sb.addEventListener('click', function(){ var m = moderate(tx.value); if(m){ m2.textContent = m; return; } if(tx.value.trim().length < 5){ m2.textContent = 'Descreva o problema com pelo menos 5 caracteres.'; return; }
      var l = reports(), day = new Date().toISOString().slice(0, 10);
      if(l.some(function(x){ return x.pointId === pt.id && x.type === sel.value && x.at.slice(0, 10) === day; })){ m2.textContent = 'Você já enviou este tipo de relato hoje.'; return; }
      l.push({ pointId:pt.id, type:sel.value, text:tx.value.trim(), at:new Date().toISOString() }); wj('ecoclick_point_reports', l); tx.value = ''; m2.textContent = 'Obrigado! O relato foi registrado para análise.'; });
    rp.appendChild(sm); rp.appendChild(sel); rp.appendChild(tx); rp.appendChild(sb); rp.appendChild(m2); box.appendChild(rp);
  }

  /* ============ Meus agendamentos (página independente) ============ */
  var TAB = 'up', openId = null, mode = null;
  var ST_TXT = { planned:'Planejado', pending_validation:'Aguardando validação', completed:'Concluído', cancelled:'Cancelado' };
  function openAgenda(tab, id){ if(typeof tab === 'string') TAB = tab; openId = id || null; mode = null; if(window.EcoApp) EcoApp.showView('agenda', true); }
  function bucket(a){ return a.status === 'cancelled' ? 'canc' : a.status === 'completed' ? 'done' : 'up'; }
  function setHist(a, ev){ a.history.push({ at:new Date().toISOString(), ev:ev }); }
  function fmtTs(iso){ try{ return new Intl.DateTimeFormat('pt-BR', { dateStyle:'short', timeStyle:'short' }).format(new Date(iso)); }catch(e){ return iso; } }
  function renderAgenda(){
    var list = readA(), counts = { up:0, done:0, canc:0 };
    list.forEach(function(a){ counts[bucket(a)]++; });
    ['up', 'done', 'canc'].forEach(function(k){ $('ag-n-' + k).textContent = counts[k]; });
    Array.prototype.forEach.call(document.querySelectorAll('[data-atab]'), function(b){ var on = b.getAttribute('data-atab') === TAB; b.setAttribute('aria-selected', String(on)); b.classList.toggle('on', on); });
    var ul = $('ag-list'); ul.textContent = '';
    var items = list.filter(function(a){ return bucket(a) === TAB; }).sort(function(a, b){ return TAB === 'up' ? dtOf(a) - dtOf(b) : dtOf(b) - dtOf(a); });
    var em = $('ag-empty'); em.hidden = items.length > 0;
    em.textContent = TAB === 'up' ? 'Você ainda não tem planos de descarte. Escolha um ponto no mapa e toque em "Planejar descarte".' : TAB === 'done' ? 'Nenhum descarte validado ainda. Depois de registrar um descarte, ele aguarda a validação antes de contar para seus pontos.' : 'Nenhum plano cancelado.';
    items.forEach(function(a){ ul.appendChild(agendaCard(a)); });
  }
  function agendaCard(a){
    var pt = pointOf(a), li = el('li', 'ag-card' + (openId === a.id ? ' open' : ''));
    var head = el('button', 'ag-head-btn'); head.type = 'button'; head.setAttribute('aria-expanded', String(openId === a.id));
    var main = el('span', 'ag-main'); main.appendChild(el('strong', '', pt.name)); main.appendChild(el('small', '', longDate(a.date) + ' às ' + a.time + ' · ' + a.materials.join(', ') + ' · ' + a.qty + (+a.qty === 1 ? ' item' : ' itens')));
    var past = a.status === 'planned' && dtOf(a) < nowBA();
    var badge = el('span', 'ag-badge ' + a.status, ST_TXT[a.status] || a.status); head.appendChild(main); head.appendChild(badge);
    head.addEventListener('click', function(){ openId = openId === a.id ? null : a.id; mode = null; renderAgenda(); });
    li.appendChild(head);
    if(openId !== a.id) return li;
    var body = el('div', 'ag-body');
    if(past) body.appendChild(el('p', 'ag-warn', 'A data planejada já passou. Registre o descarte, se você foi ao ponto, ou reagende.'));
    var dl = el('dl', 'rv-list');
    [['Código do comprovante', a.code || '—'], ['Endereço', pt.address || 'Endereço pendente de verificação'], ['Em nome de', (a.user && a.user.name ? a.user.name + ' · ' + a.user.email : '—')], ['Observação', a.note || '—'], ['Tipo', 'Plano de descarte (sem reserva no ponto)']].forEach(function(x){ var d = el('div'); d.appendChild(el('dt', '', x[0])); d.appendChild(el('dd', x[0] === 'Código do comprovante' ? 'done-code' : '', x[1])); dl.appendChild(d); });
    body.appendChild(dl);
    if(a.status === 'planned' || a.status === 'pending_validation'){
      body.appendChild(el('div', 'coleta-label', 'Checklist de preparação'));
      var ck = rj('ecoclick_ckl_' + a.id, {}), ul = el('ul', 'ag-ck'), idx = 0;
      a.materials.forEach(function(m){ (PREP[m] || []).forEach(function(t){ var k = 'i' + idx++, li2 = el('li'), lb = el('label'), cb = el('input'); cb.type = 'checkbox'; cb.checked = !!ck[k];
        cb.addEventListener('change', function(){ ck[k] = cb.checked; wj('ecoclick_ckl_' + a.id, ck); }); lb.appendChild(cb); lb.appendChild(el('span', '', t)); li2.appendChild(lb); ul.appendChild(li2); }); });
      if(ul.children.length) body.appendChild(ul);
    }
    var h = el('ul', 'ag-hist'); a.history.slice().reverse().forEach(function(x){ h.appendChild(el('li', '', fmtTs(x.at) + ' — ' + x.ev)); }); body.appendChild(el('div', 'coleta-label', 'Histórico')); body.appendChild(h);
    var act = el('div', 'ag-actions');
    function btn(txt, cls, fn){ var b = el('button', cls || 'ag-btn', txt); b.type = 'button'; b.addEventListener('click', fn); act.appendChild(b); return b; }
    btn('Ver no mapa', 'ag-btn', function(){ if(window.EcoApp) EcoApp.showView('dashboard', true); setTimeout(function(){ if(find(a.pointId)){ F = { mats:[], dist:0, open:false, fav:false }; search.value = ''; applyFilter(); select(a.pointId); } var c = $('coleta-card'); if(c) c.scrollIntoView({ behavior:'smooth', block:'start' }); }, 120); });
    if(a.status === 'planned'){
      btn('Reagendar', 'ag-btn', function(){ mode = mode === 'resch' ? null : 'resch'; renderAgenda(); });
      btn('Cancelar', 'ag-btn danger', function(){ mode = mode === 'cancel' ? null : 'cancel'; renderAgenda(); });
      if(dtOf(a).toDateString() <= nowBA().toDateString() || dtOf(a) <= nowBA()) btn('Registrar descarte', 'ag-btn primary', function(){ mode = mode === 'reg' ? null : 'reg'; renderAgenda(); });
    }
    body.appendChild(act);
    if(mode === 'cancel' && a.status === 'planned'){
      var c = el('div', 'ag-confirm'); c.appendChild(el('p', '', 'Cancelar este plano? Nenhum ponto é afetado, pois não havia reserva.'));
      var y = el('button', 'ag-btn danger', 'Sim, cancelar'); y.type = 'button'; y.addEventListener('click', function(){ var l = readA(), r = l.filter(function(x){ return x.id === a.id; })[0]; if(!r) return; r.status = 'cancelled'; setHist(r, 'Plano cancelado'); saveA(l); notify('appointment', 'Plano cancelado', pointOf(r).name + ': ' + longDate(r.date) + ' às ' + r.time + '.'); mode = null; TAB = 'canc'; renderAgenda(); });
      c.appendChild(y); body.appendChild(c);
    }
    if(mode === 'resch' && a.status === 'planned'){
      var rf = el('div', 'ag-confirm'), nd = a.date, days = el('div', 'chips chips--days'), tm = el('input'); tm.type = 'time'; tm.value = a.time; tm.className = 'ag-time';
      var draw = function(){ days.textContent = ''; for(var i = 0; i < 7; i++){ (function(d){ days.appendChild(chip(dayLabel(d), nd === d, function(){ nd = d; draw(); })); })(isoDate(addDays(nowBA(), i))); } };
      draw(); rf.appendChild(el('p', '', 'Escolha o novo dia e horário:')); rf.appendChild(days); rf.appendChild(tm); var m = el('p', 'ci-small');
      var ok = el('button', 'ag-btn primary', 'Salvar nova data'); ok.type = 'button';
      ok.addEventListener('click', function(){ if(!tm.value){ m.textContent = 'Informe o horário.'; return; } if(dtOf({ date:nd, time:tm.value }) <= nowBA()){ m.textContent = 'Escolha um horário que ainda não passou.'; return; }
        var l = readA(), r = l.filter(function(x){ return x.id === a.id; })[0]; if(!r) return;
        if(l.some(function(x){ return x.id !== r.id && x.pointId === r.pointId && x.date === nd && x.time === tm.value && (x.status === 'planned' || x.status === 'pending_validation'); })){ m.textContent = 'Você já tem um plano neste ponto e horário.'; return; }
        r.date = nd; r.time = tm.value; r.reminded = false; setHist(r, 'Reagendado para ' + longDate(nd) + ' às ' + tm.value); saveA(l); notify('appointment', 'Plano reagendado', pointOf(r).name + ': ' + longDate(nd) + ' às ' + tm.value + '.'); mode = null; renderAgenda(); });
      rf.appendChild(ok); rf.appendChild(m); body.appendChild(rf);
    }
    if(mode === 'reg' && a.status === 'planned'){
      var g = el('div', 'ag-confirm'); g.appendChild(el('p', '', 'Confirma que você levou os itens ao ponto? O descarte ficará aguardando validação e só então contará para seus pontos. Registrar não gera pontos por si só.'));
      var yy = el('button', 'ag-btn primary', 'Registrar descarte'); yy.type = 'button';
      yy.addEventListener('click', function(){ var l = readA(), r = l.filter(function(x){ return x.id === a.id; })[0]; if(!r || r.status !== 'planned') return; r.status = 'pending_validation'; r.disposal = { registeredAt:new Date().toISOString(), validated:false }; setHist(r, 'Descarte registrado — aguardando validação'); saveA(l);
        var lg = rj('ecoclick_disposal_ledger', {}); if(!lg[r.id]) lg[r.id] = { status:'pending_validation', credited:false, at:new Date().toISOString() }; wj('ecoclick_disposal_ledger', lg);
        notify('appointment', 'Descarte registrado', pointOf(r).name + ': aguardando validação. Os pontos só são creditados depois dela.'); mode = null; renderAgenda(); });
      g.appendChild(yy); body.appendChild(g);
    }
    if(a.status === 'pending_validation') body.appendChild(el('p', 'ag-warn', 'Aguardando validação do descarte. Pontos, histórico e indicadores de impacto só são atualizados depois dela, e uma única vez por descarte.'));
    li.appendChild(body); return li;
  }
  Array.prototype.forEach.call(document.querySelectorAll('[data-atab]'), function(b){ b.addEventListener('click', function(){ TAB = b.getAttribute('data-atab'); openId = null; mode = null; renderAgenda(); }); });
  $('ag-map').addEventListener('click', function(){ if(window.EcoApp) EcoApp.showView('dashboard', true); });
  $('coleta-agenda').addEventListener('click', function(){ openAgenda(); });
  Array.prototype.forEach.call(document.querySelectorAll('[data-go-agenda]'), function(b){ b.addEventListener('click', function(){ openAgenda(); }); });
  document.addEventListener('ecoclick:view-change', function(e){ if(e.detail && e.detail.view === 'agenda') renderAgenda(); if(e.detail && e.detail.view === 'dashboard') renderDash(); });
  window.EcoApp = window.EcoApp || {};
  /* Gancho para o serviço de validação (ponto/backend). Só ele deve chamar: credita uma única vez por descarte. */
  EcoApp.validateDisposal = function(id, info){
    var l = readA(), r = l.filter(function(x){ return x.id === id; })[0], lg = rj('ecoclick_disposal_ledger', {});
    if(!r || r.status !== 'pending_validation' || (lg[id] && lg[id].credited) || !info || !(info.points > 0)) return false;
    r.status = 'completed'; r.disposal.validated = true; setHist(r, 'Descarte validado'); saveA(l);
    lg[id] = { status:'completed', credited:true, points:info.points, at:new Date().toISOString() }; wj('ecoclick_disposal_ledger', lg);
    var p = rj('ecoclick_profile', {}); p.points = (+p.points || 0) + info.points; wj('ecoclick_profile', p);
    notify('reward', 'Descarte validado', '+' + info.points + ' pontos creditados.'); document.dispatchEvent(new CustomEvent('ecoclick:disposal-validated', { detail:{ id:id, points:info.points } })); return true;
  };
  /* Lembretes: somente para planos reais que acontecem nas próximas 24 h */
  function checkReminders(){
    var l = readA(), ch = false, now = nowBA();
    l.forEach(function(a){ if(a.status !== 'planned' || a.reminded) return; var diff = dtOf(a) - now; if(diff > 0 && diff <= 864e5){ a.reminded = true; ch = true; setHist(a, 'Lembrete enviado'); notify('reminder', 'Lembrete de descarte', pointOf(a).name + ': ' + dayLabel(a.date).toLowerCase() + ' às ' + a.time + '.'); } });
    if(ch) saveA(l);
  }
  setTimeout(checkReminders, 1800); setInterval(checkReminders, 60000);


  /* ============ Painel de descarte (abaixo do mapa): números e ações reais ============ */
  var CK_COL = ['t1', 't2', 't3', 't4', 't5'];
  var MICO = {}; MICO[MAT.cel] = '<rect x="7" y="3" width="10" height="18" rx="2.5"/><path d="M11 18h2"/>'; MICO[MAT.nb] = '<rect x="5" y="5" width="14" height="10" rx="2"/><path d="M3 19h18"/>';
  MICO[MAT.pil] = '<rect x="3" y="8" width="15" height="8" rx="2"/><path d="M21 11v2M8 10v4M12 10v4"/>'; MICO[MAT.cab] = '<path d="M9 3v5M15 3v5M7 8h10v3a5 5 0 0 1-10 0zM12 16v5"/>'; MICO[MAT.eld] = '<path d="M13 3L5 14h6l-1 7 8-11h-6z"/>';
  function relTime(a){ var m = Math.round((dtOf(a) - nowBA()) / 6e4), r = new Intl.RelativeTimeFormat('pt-BR', { numeric:'auto' }); if(Math.abs(m) < 60) return r.format(m, 'minute'); var h = Math.round(m / 60); if(Math.abs(h) < 24) return r.format(h, 'hour'); return r.format(Math.round(h / 24), 'day'); }
  function ckStats(a){ var ck = rj('ecoclick_ckl_' + a.id, {}), tot = 0, dn = 0, i = 0; a.materials.forEach(function(m){ (PREP[m] || []).forEach(function(){ tot++; if(ck['i' + i]) dn++; i++; }); }); return { tot:tot, dn:dn }; }
  function goMap(){ var c = $('coleta-card'); if(c) c.scrollIntoView({ behavior:'smooth', block:'start' }); }
  function svgI(p){ return '<svg viewBox="0 0 24 24" aria-hidden="true">' + p + '</svg>'; }
  var DI = { cal:'<rect x="3.5" y="5" width="17" height="15" rx="3"/><path d="M8 3v4M16 3v4M3.5 10h17"/>', clock:'<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>', box:'<path d="M4 8l8-4 8 4v8l-8 4-8-4z"/><path d="M4 8l8 4 8-4M12 12v8"/>', hour:'<path d="M7 3h10M7 21h10M8 3c0 5 8 5 8 9s-8 4-8 9"/>', star:'<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.8 6.8 19.6l1-5.8L3.5 9.7l5.9-.8z"/>', x:'<circle cx="12" cy="12" r="8.5"/><path d="M9 9l6 6M15 9l-6 6"/>' };
  var EXP = '<path d="M8 16L16 8M9 8h7v7"/>';
  function renderDash(){
    var cardsBox = $('cs-cards'); if(!cardsBox) return;
    var list = readA(), now = nowBA();
    var planned = list.filter(function(a){ return a.status === 'planned'; }), pend = list.filter(function(a){ return a.status === 'pending_validation'; });
    var done = list.filter(function(a){ return a.status === 'completed'; }), canc = list.filter(function(a){ return a.status === 'cancelled'; });
    var upc = planned.slice().sort(function(a, b){ return dtOf(a) - dtOf(b); });
    var week = planned.filter(function(a){ var d = dtOf(a) - now; return d > 0 && d <= 7 * 864e5; }).length;
    var items = planned.reduce(function(n, a){ return n + (+a.qty || 0); }, 0);
    var nxt = upc.filter(function(a){ return dtOf(a) > now; })[0];
    var CSO = window.__csOpen = window.__csOpen || {};
    function dRow(l, v){ var r = el('div', 'cs-dr'); r.appendChild(el('span', '', l)); r.appendChild(el('b', '', v)); return r; }
    function dBtn(label, fn){ var b = el('button', 'cs-dbtn', label); b.type = 'button'; b.addEventListener('click', fn); return b; }
    function dNote(t){ return el('p', 'cs-dn', t); }
    function qtyTxt(a){ return a.qty ? a.qty + (+a.qty === 1 ? ' item' : ' itens') : 'Quantidade não informada'; }
    function planLi(a, extra){
      var li = el('li'), pt = pointOf(a), m = (a.materials || []).join(', ');
      li.appendChild(el('b', '', dayLabel(a.date) + ' ' + a.time + ' · ' + pt.name));
      li.appendChild(el('span', '', qtyTxt(a) + (m ? ' · ' + m : '')));
      if(extra) li.appendChild(el('span', '', extra));
      return li;
    }
    function dList(arr, extraFn){ var ul = el('ul', 'cs-dl'); arr.forEach(function(a){ ul.appendChild(planLi(a, extraFn && extraFn(a))); }); return ul; }
    var favList = favs().map(function(id){ return find(id); }).filter(Boolean);
    var cards = [
      { t:'t1', i:'cal', title:'Planos ativos', val:planned.length, cap:week + (week === 1 ? ' plano' : ' planos') + ' nos próximos 7 dias',
        det:function(){
          if(!upc.length) return [dNote('Nenhum plano ativo. Escolha um ponto de coleta no mapa e planeje um descarte.')];
          var n = [dList(upc.slice(0, 5))];
          if(upc.length > 5) n.push(dNote('+ ' + (upc.length - 5) + (upc.length - 5 === 1 ? ' plano' : ' planos') + ' na agenda.'));
          n.push(dBtn('Ver agenda completa', function(){ openAgenda('up'); })); return n;
        } },
      { t:'t2', i:'clock', title:'Próximo descarte', val:nxt ? dayLabel(nxt.date) + ' ' + nxt.time : '—', cap:nxt ? pointOf(nxt).name : 'Nenhum plano futuro',
        det:function(){
          if(!nxt) return [dNote('Nenhum plano futuro. Quando você planejar um descarte, os detalhes aparecem aqui.')];
          var pt = pointOf(nxt), ck = ckStats(nxt), n = [dRow('Data', longDate(nxt.date) + ' às ' + nxt.time), dRow('Local', pt.name)];
          if(pt.address) n.push(dRow('Endereço', pt.address));
          n.push(dRow('Materiais', (nxt.materials || []).join(', ') || '—')); n.push(dRow('Itens', qtyTxt(nxt)));
          if(nxt.code) n.push(dRow('Código', nxt.code));
          if(ck.tot) n.push(dRow('Preparação', ck.dn + ' de ' + ck.tot + ' passos'));
          n.push(dBtn('Abrir na agenda', function(){ openAgenda('up', nxt.id); })); return n;
        } },
      { t:'t3', i:'box', title:'Itens planejados', val:items, cap:'em ' + planned.length + (planned.length === 1 ? ' plano ativo' : ' planos ativos'),
        det:function(){
          if(!planned.length) return [dNote('Nenhum item planejado ainda.')];
          var by = {}; planned.forEach(function(a){ (a.materials || []).forEach(function(m){ by[m] = (by[m] || 0) + 1; }); });
          var n = [dRow('Total de itens', String(items)), dRow('Planos ativos', String(planned.length))];
          Object.keys(by).forEach(function(m){ n.push(dRow(m, by[m] + (by[m] === 1 ? ' plano' : ' planos'))); });
          n.push(dBtn('Ver planos por material', function(){ var v = $('cs-var'); if(v) v.scrollIntoView({ behavior:'smooth', block:'center' }); })); return n;
        } },
      { t:'t4', i:'hour', title:'Aguardando validação', val:pend.length, cap:'só contam depois de validados',
        det:function(){
          if(!pend.length) return [dNote('Nada aguardando validação. Os descartes só contam depois que a equipe do ponto de coleta valida, uma única vez por descarte.')];
          return [dList(pend), dNote('Só contam depois que a equipe do ponto de coleta valida o descarte.'), dBtn('Abrir na agenda', function(){ openAgenda('up', pend[0].id); })];
        } },
      { t:'t5', i:'star', title:'Pontos favoritos', val:favs().length, cap:'salvos para consultar depois',
        det:function(){
          if(!favList.length) return [dNote('Nenhum ponto favorito ainda. Salve pontos no mapa para encontrá-los aqui.')];
          var ul = el('ul', 'cs-dl'); favList.forEach(function(p){ var li = el('li'); li.appendChild(el('b', '', p.name)); li.appendChild(el('span', '', [p.neighborhood, p.address].filter(Boolean).join(' · '))); ul.appendChild(li); });
          return [ul, dBtn('Ver no mapa', function(){ F.fav = true; applyFilter(); goMap(); })];
        } },
      { t:'t6', i:'x', title:'Cancelados', val:canc.length, cap:canc.length === 1 ? 'plano cancelado' : 'planos cancelados',
        det:function(){
          if(!canc.length) return [dNote('Nenhum plano cancelado.')];
          return [dList(canc.slice(0, 5), function(a){ var h = a.history && a.history[a.history.length - 1]; return h ? 'Atualizado em ' + fmtTs(h.at) : ''; }), dBtn('Ver cancelados', function(){ openAgenda('canc'); })];
        } }
    ];
    cardsBox.textContent = '';
    cards.forEach(function(c, idx){
      var open = !!CSO[c.title];
      var a = el('article', 'cs-card ' + c.t + (open ? ' is-open' : '')), top = el('div', 'cs-card-top'), l = el('div'), sq = el('span', 'cs-sq'); sq.innerHTML = svgI(DI[c.i]); l.appendChild(sq); l.appendChild(el('span', '', c.title));
      var did = 'cs-det-' + idx;
      var ex = el('button', 'cs-exp'); ex.type = 'button'; ex.setAttribute('aria-expanded', String(open)); ex.setAttribute('aria-controls', did); ex.setAttribute('aria-label', (open ? 'Recolher: ' : 'Expandir: ') + c.title); ex.innerHTML = svgI(EXP);
      top.appendChild(l); top.appendChild(ex); a.appendChild(top);
      var cv = el('div', /[^\d]/.test(String(c.val)) ? 'cs-val txt' : 'cs-val', String(c.val)); cv.setAttribute('data-fxk', c.title); a.appendChild(cv); a.appendChild(el('div', 'cs-cap', c.cap));
      var det = el('div', 'cs-det'), inner = el('div'), body = el('div', 'cs-det-in'); det.id = did; det.setAttribute('role', 'region'); det.setAttribute('aria-label', 'Detalhes: ' + c.title);
      c.det().forEach(function(n){ body.appendChild(n); }); inner.appendChild(body); det.appendChild(inner); a.appendChild(det);
      ex.addEventListener('click', function(){
        var o = !a.classList.contains('is-open'); a.classList.toggle('is-open', o); CSO[c.title] = o;
        ex.setAttribute('aria-expanded', String(o)); ex.setAttribute('aria-label', (o ? 'Recolher: ' : 'Expandir: ') + c.title);
      });
      cardsBox.appendChild(a);
    });
    if(window.EcoFX) EcoFX.countAll(cardsBox);
    /* planos por material */
    var vl = $('cs-var-list'); vl.textContent = '';
    var tot = { pl:0, pe:0, dn:0 };
    var vt = el('div', 'vt'); vt.setAttribute('role', 'table'); vt.setAttribute('aria-label', 'Planos por material');
    var vh = el('div', 'vt-h'); vh.setAttribute('role', 'row'); ['Material', 'Planej.', 'Em valid.', 'Validados', 'Itens'].forEach(function(t, n){ var c = el('span', '', t); c.setAttribute('role', 'columnheader'); if(n === 2) c.title = 'Em validação'; if(n === 1) c.title = 'Planejados'; vh.appendChild(c); }); vt.appendChild(vh);
    var sumIt = 0;
    function vrow(name, ico, vals, cls){
      var r = el('div', 'vt-r' + (cls ? ' ' + cls : '')); r.setAttribute('role', 'row');
      var n = el('span', 'vt-n'); n.setAttribute('role', 'rowheader');
      if(ico){ var sq = el('span', 'cs-sq'); sq.innerHTML = svgI(ico); n.appendChild(sq); }
      n.appendChild(el('span', '', name)); r.appendChild(n);
      ['Planejados', 'Em validação', 'Validados', 'Itens'].forEach(function(l, q){ var c = el('b', vals[q] ? '' : 'z', String(vals[q])); c.setAttribute('data-l', l); c.setAttribute('role', 'cell'); r.appendChild(c); });
      return r;
    }
    Object.keys(MAT).forEach(function(k){
      var m = MAT[k], has = function(a){ return a.materials.indexOf(m) > -1; };
      var pl = planned.filter(has).length, pe = pend.filter(has).length, dn = done.filter(has).length, it = planned.concat(pend, done).filter(has).reduce(function(n, a){ return n + (+a.qty || 0); }, 0);
      tot.pl += pl; tot.pe += pe; tot.dn += dn; sumIt += it;
      vt.appendChild(vrow(m, MICO[m], [pl, pe, dn, it]));
    });
    vt.appendChild(vrow('Total', null, [tot.pl, tot.pe, tot.dn, sumIt], 'vt-t'));
    vl.appendChild(vt);
    $('cs-var-sub').textContent = tot.pl + tot.pe + tot.dn ? (Math.round(tot.dn / (tot.pl + tot.pe + tot.dn) * 100) + '% validado') : 'sem planos ainda';
    /* próximos agendamentos + preparação */
    var ul = $('cs-next-list'), em = $('cs-next-empty'); ul.textContent = '';
    var cs = upc.reduce(function(o, a){ var c = ckStats(a); o.t += c.tot; o.d += c.dn; return o; }, { t:0, d:0 }), prog = cs.t ? Math.round(cs.d / cs.t * 100) : 0;
    $('cs-prog-val').textContent = prog + '%'; $('cs-fill').style.width = prog + '%'; $('cs-track').setAttribute('aria-valuenow', String(prog));
    $('cs-prog-hint').textContent = upc.length ? cs.d + ' de ' + cs.t + ' passos do checklist concluídos nos planos ativos.' : 'Sem planos ativos: nada para preparar.';
    var u = getUser();
    var NXT = window.__nxt = window.__nxt || { all:false, n:0 }; NXT.n = upc.length; if(upc.length <= 3) NXT.all = false;
    (NXT.all ? upc : upc.slice(0, 3)).forEach(function(a){
      var pt = pointOf(a), li = el('li'), b = el('button', 'nx'); b.type = 'button';
      var av = el('span', 'nx-av', (u.name || '?').split(/\s+/).map(function(x){ return x[0]; }).slice(0, 2).join('').toUpperCase());
      var main = el('span', 'nx-main'); main.appendChild(el('span', 'nx-t', 'Levar ' + a.materials.slice(0, 2).join(' + ') + (a.materials.length > 2 ? ' +' + (a.materials.length - 2) : '') + ' — ' + pt.name));
      var c = ckStats(a); main.appendChild(el('span', 'nx-s', longDate(a.date) + ' às ' + a.time + ' · ' + relTime(a) + (c.tot ? ' · preparo ' + c.dn + '/' + c.tot : '')));
      var tag = el('span', 'nx-tag', a.materials[0]); var ix = Object.keys(MAT).map(function(k){ return MAT[k]; }).indexOf(a.materials[0]); tag.style.setProperty('--c', ['#85cfb0', '#7ea8e8', '#97e6d2', '#e3b869', '#9db8c0'][Math.max(0, ix)]);
      b.appendChild(av); b.appendChild(main); b.appendChild(tag); b.addEventListener('click', function(){ openAgenda('up', a.id); }); li.appendChild(b); ul.appendChild(li);
    });
    em.hidden = upc.length > 0; em.textContent = 'Nenhum plano de descarte ativo. Toque em + para agendar rapidamente ou escolha um ponto no mapa.';
    var moreN = upc.length > 3, all1 = $('cs-all'), all2 = $('cs-all2');
    all1.textContent = moreN ? (NXT.all ? 'Mostrar menos' : 'Ver todos os agendamentos (' + upc.length + ') →') : 'Ver todos os agendamentos →';
    if(moreN) all1.setAttribute('aria-expanded', String(NXT.all)); else all1.removeAttribute('aria-expanded');
    all2.hidden = !(moreN && NXT.all);
    $('cs-all').hidden = !list.length;
    if(!$('cs-quick').hidden) renderQuickBits();
  }
  /* agendamento rápido (+) */
  var QS = { date:null, mats:[] };
  function planError(pt, d, u){
    if(!(u.name.length >= 2 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(u.email))) return 'Complete seu nome e e-mail no perfil para registrar um plano.';
    if(!pt.materials.length) return 'Este ponto ainda não tem materiais confirmados. Confirme com o local antes de planejar.';
    if(!d.mats.length) return 'Escolha ao menos um material.';
    if(!/^\d{1,3}$/.test(d.qty) || +d.qty < 1) return 'Informe a quantidade estimada de itens (1 a 999).';
    if(!d.date) return 'Escolha o dia.';
    if(!d.time) return 'Informe o horário em que pretende ir.';
    if(dtOf({ date:d.date, time:d.time }) <= nowBA()) return 'Escolha um horário que ainda não passou.';
    if(readA().some(function(a){ return a.pointId === pt.id && a.date === d.date && a.time === d.time && (a.status === 'planned' || a.status === 'pending_validation'); })) return 'Você já tem um plano para este ponto neste mesmo horário.';
    return '';
  }
  function savePlan(pt, d, u){
    var list = readA(), now = new Date().toISOString();
    var rec = { id:'ag_' + Date.now().toString(36), code:code(list), kind:'plan', status:'planned', pointId:pt.id, pointName:pt.name, address:pt.address || '', user:{ name:u.name, email:u.email },
      materials:d.mats.slice(), material:d.mats.join(', '), qty:d.qty, note:'', date:d.date, time:d.time, timezone:TZ, createdAt:now, history:[{ at:now, ev:'Plano registrado' }] };
    list.push(rec); saveA(list);
    notify('appointment', 'Plano de descarte registrado', pt.name + ': ' + longDate(d.date) + ' às ' + d.time + ' (código ' + rec.code + ').');
    document.dispatchEvent(new CustomEvent('ecoclick:appointment-created', { detail:rec })); return rec;
  }
  function renderQuickBits(){
    var pt = find($('cq-point').value), box = $('cq-mats'), days = $('cq-days'); box.textContent = days.textContent = '';
    if(pt){
      if(!pt.materials.length) box.appendChild(el('p', 'sched-note', 'Este ponto ainda não tem lista de materiais confirmada.'));
      QS.mats = QS.mats.filter(function(m){ return pt.materials.indexOf(m) > -1; });
      pt.materials.forEach(function(m){ box.appendChild(chip(m, QS.mats.indexOf(m) > -1, function(){ var i = QS.mats.indexOf(m); if(i < 0) QS.mats.push(m); else QS.mats.splice(i, 1); renderQuickBits(); }, 'checkbox')); });
    }
    var base = nowBA(); for(var i = 0; i < 7; i++){ (function(d){ days.appendChild(chip(dayLabel(d), QS.date === d, function(){ QS.date = d; renderQuickBits(); })); })(isoDate(addDays(base, i))); }
    var u = getUser(), w = $('cq-who'); w.textContent = ''; if(u.name){ w.appendChild(document.createTextNode('Em nome de ')); w.appendChild(el('b', '', u.name)); w.appendChild(document.createTextNode(u.email ? ' · ' + u.email : '')); }
  }
  function openQuick(on){
    var fm = $('cs-quick'); fm.hidden = !on; $('cs-plus').classList.toggle('on', on); $('cs-plus').setAttribute('aria-expanded', String(on));
    if(!on) return;
    var sel = $('cq-point'); if(!sel.options.length) POINTS.forEach(function(p){ var o = document.createElement('option'); o.value = p.id; o.textContent = p.name + (p.materials.length ? '' : ' (materiais pendentes)'); sel.appendChild(o); });
    if(selected) sel.value = selected; $('cq-msg').textContent = ''; $('cq-msg').className = 'cq-msg'; renderQuickBits(); fm.scrollIntoView({ block:'nearest', behavior:'smooth' });
  }
  $('cs-plus').addEventListener('click', function(){ openQuick($('cs-quick').hidden); });
  $('cq-cancel').addEventListener('click', function(){ openQuick(false); });
  $('cq-point').addEventListener('change', function(){ QS.mats = []; renderQuickBits(); });
  $('cs-all').addEventListener('click', function(){ var N = window.__nxt; if(N && N.n > 3){ N.all = !N.all; renderDash(); } else openAgenda(); });
$('cs-all2').addEventListener('click', function(){ openAgenda(); });
  $('cs-quick').addEventListener('submit', function(e){
    e.preventDefault(); var pt = find($('cq-point').value), msg = $('cq-msg'); if(!pt) return;
    var d = { mats:QS.mats.slice(), qty:$('cq-qty').value.trim(), date:QS.date, time:$('cq-time').value }, u = getUser(), err = planError(pt, d, u);
    $('cq-qty').setAttribute('aria-invalid', String(/quantidade/i.test(err))); $('cq-time').setAttribute('aria-invalid', String(/horário/i.test(err)));
    if(err){ msg.className = 'cq-msg'; msg.textContent = err; return; }
    var rec = savePlan(pt, d, u); msg.className = 'cq-msg ok'; msg.textContent = 'Plano registrado! Código ' + rec.code + '. Ele já aparece na lista abaixo.'; if(window.EcoFX){ EcoFX.check($('cq-save'), 'Registrado'); EcoFX.burst($('cq-save')); }
    QS = { date:null, mats:[] }; $('cq-qty').value = ''; $('cq-time').value = ''; renderQuickBits();
  });
  document.addEventListener('ecoclick:appointment-created', function(){ renderDash();
    setTimeout(function(){ if(!window.EcoFX) return; var i = document.querySelector('.done-wrap .done-ico'); if(i && i.offsetParent){ EcoFX.pop(i); EcoFX.burst(i); } var c = document.querySelector('.cs-card.t1'); if(c) EcoFX.glow(c); }, 160); });
  window.addEventListener('storage', function(){ renderDash(); });
  setInterval(renderDash, 60000);

  /* ============ Início ============ */
  document.addEventListener('ecoclick:prefs-change', function(){ F.open = mapPref('onlyOpen'); applyFilter(); });
  try{ if($('coleta-map-card').offsetWidth < 520) $('cov-legend').removeAttribute('open'); }catch(e){}
  ready = true; renderDash(); applyFilter();
  /*fix-prefill*/ try{ if(window.EcoPrefill){ search.value = String(window.EcoPrefill); window.EcoPrefill = ''; applyFilter(); } }catch(e){}
  if(map){ visibleIds.forEach(function(id){ addMarker(find(id)); }); fit(visibleIds); }
  geocodeNext();
  if(mapPref('autoLocate')) setTimeout(requestGeo, 700);
  window.EcoColeta = { points:POINTS, select:select };
})();
  