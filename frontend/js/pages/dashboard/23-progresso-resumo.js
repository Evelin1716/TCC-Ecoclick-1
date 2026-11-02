
    // Meu progresso (grade 2 × 2): usa só dados que já existem no Dashboard — missões, histórico de descartes e agendamentos salvos.
    // Nada é inventado: sem dados, cada bloco mostra o estado vazio.
    (function(){
      var root = document.getElementById('progresso-side'); if(!root) return;
      var I = window.EcoI18n || { lang:'pt-BR', t:function(k, v){ return v ? k.replace(/\{(\w+)\}/g, function(m, x){ return v[x] != null ? v[x] : m; }) : k; }, fmtHour:function(h){ return h; } };
      function tr(k, v){ return I.t(k, v); }
      function lang(){ return I.lang || 'pt-BR'; }
      function $(id){ return document.getElementById(id); }
      function el(tag, cls, text){ var n = document.createElement(tag); if(cls) n.className = cls; if(text != null) n.textContent = text; return n; }
      function svg(path){ var w = el('span'); w.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true">' + path + '</svg>'; return w.firstChild; }
      var ICON = {
        box:  '<path d="M4 7h16v13H4z"/><path d="M4 7l2-4h12l2 4"/><path d="M10 12h4"/>',
        cal:  '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M8 3v4M16 3v4M3 10h18"/>',
        goal: '<circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.5 2.5L16 9.5"/>'
      };
      var PERIOD = 'week';

      /* ---------- leitura dos dados existentes ---------- */
      var MISSIONS = [
        { name:'Reciclar eletrônicos',        done:true,  prog:'60/100' },
        { name:'Visitar um ponto de coleta',  done:true,  prog:'90/100' },
        { name:'Convidar um amigo',           done:false, prog:'0/100'  },
        { name:'Registrar 5 descartes',       done:false, prog:'0/100'  }
      ];
      var HISTORY = [];
      function readMissions(){
        return MISSIONS.map(function(m){
          var x = m.prog.match(/(\d+)\s*\/\s*(\d+)/);
          return { name:tr(m.name), done:m.done, doing:!m.done && !!x && +x[1] > 0, prog:m.prog, deadline:m.deadline || '' };
        });
      }
      function parseISO(str){ var m = (str || '').match(/^(\d{4})-(\d{2})-(\d{2})/); return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null; }
      function readHistory(){
        return HISTORY.map(function(h){ return { type:'history', date:parseISO(h.date), cat:tr(h.cat), point:tr(h.point), done:h.done }; });
      }
      function readAppts(){
        var list = [];
        try{ list = JSON.parse(localStorage.getItem('ecoclick_appointments') || '[]') || []; }catch(e){}
        return list.filter(function(a){ return a && a.status !== 'cancelled' && parseISO(a.date); }).map(function(a){
          return { type:'appt', date:parseISO(a.date), time:a.time || '', cat:a.material || '', point:a.pointName || '', done:a.status === 'completed' };
        });
      }
      function disposals(){ return readHistory().concat(readAppts()); }

      /* ---------- formatação ---------- */
      function fmtDate(d){
        try{ return new Intl.DateTimeFormat(lang(), { day:'2-digit', month:'2-digit', year:'numeric' }).format(d); }
        catch(e){ return d.toLocaleDateString(); }
      }
      function cap(s){ s = String(s).replace('.', ''); return s.charAt(0).toUpperCase() + s.slice(1); }
      function shortName(d, opt){
        try{ return cap(new Intl.DateTimeFormat(lang(), opt).format(d)); }catch(e){ return ''; }
      }
      function joinParts(a, b){ return [a, b].filter(Boolean).join(' · '); }

      /* ---------- 1 · Meu progresso ---------- */
      function renderProgress(ms){
        var total = ms.length;
        var nDone = ms.filter(function(m){ return m.done; }).length;
        var nDoing = ms.filter(function(m){ return m.doing; }).length;
        var nTodo = total - nDone - nDoing;
        var pct = total ? Math.round(nDone / total * 100) : 0;
        var C = 2 * Math.PI * 58, fill = $('mp-ring-fill');
        fill.style.strokeDasharray = C;
        fill.style.strokeDashoffset = C * (1 - pct / 100);
        $('mp-pct').textContent = pct + '%';
        $('mp-ring').setAttribute('aria-label', tr('{p}% de progresso geral', { p:pct }));
        $('mp-n-done').textContent = nDone; $('mp-n-doing').textContent = nDoing; $('mp-n-todo').textContent = nTodo;
        var t, s;
        if(!total){ t = 'Suas missões aparecerão aqui.'; s = ''; }
        else if(pct === 100){ t = 'Parabéns!'; s = 'Todas as missões concluídas.'; }
        else if(pct > 0){ t = 'Você está indo bem!'; s = 'Continue assim.'; }
        else { t = 'Vamos começar?'; s = 'Conclua sua primeira missão.'; }
        $('mp-note-t').textContent = tr(t); $('mp-note-s').textContent = s ? tr(s) : '';
      }

      /* ---------- 2 · Atividades recentes ---------- */
      function renderActivities(ms){
        var ul = $('mp-acts'); ul.innerHTML = '';
        var ev = disposals().sort(function(a, b){ return b.date - a.date; });
        var items = ev.map(function(e){
          if(e.type === 'appt' && !e.done) return { ico:'cal', pending:false, title:tr('Você agendou um descarte'), sub:joinParts(e.cat, e.point), date:fmtDate(e.date) + (e.time ? ' · ' + I.fmtHour(e.time) : '') };
          return { ico:'box', pending:!e.done, title: e.done ? tr('Você concluiu um descarte') : tr('Descarte pendente'), sub:joinParts(e.cat, e.point), date:fmtDate(e.date) };
        });
        ms.filter(function(m){ return m.done; }).forEach(function(m){
          items.push({ ico:'goal', pending:false, title:tr('Você concluiu uma missão'), sub:m.name, date:'' });
        });
        items = items.slice(0, 4);
        if(!items.length){ ul.appendChild(el('li', 'mp-none', tr('Nenhuma atividade ainda.'))); return; }
        items.forEach(function(it){
          var li = el('li', 'mp-act');
          var ic = el('span', 'mp-ico' + (it.pending ? ' pending' : '')); ic.appendChild(svg(ICON[it.ico]));
          var tx = el('div', 'mp-act-t'); tx.appendChild(el('strong', '', it.title)); tx.appendChild(el('span', '', it.sub));
          li.appendChild(ic); li.appendChild(tx);
          if(it.date) li.appendChild(el('span', 'mp-act-d', it.date));
          ul.appendChild(li);
        });
      }

      /* ---------- 3 · Evolução dos descartes ---------- */
      function buckets(){
        var now = new Date(), out = [], i;
        if(PERIOD === 'week'){
          var dow = (now.getDay() + 6) % 7;                         // segunda = 0
          var mon = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dow);
          for(i = 0; i < 7; i++){
            var d = new Date(mon.getFullYear(), mon.getMonth(), mon.getDate() + i);
            out.push({ key:d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate(), label:shortName(d, { weekday:'short' }), now: i === dow });
          }
        } else {
          for(i = 5; i >= 0; i--){
            var m = new Date(now.getFullYear(), now.getMonth() - i, 1);
            out.push({ key:m.getFullYear() + '-' + m.getMonth(), label:shortName(m, { month:'short' }), now: i === 0 });
          }
        }
        return out;
      }
      function keyOf(d){ return PERIOD === 'week' ? d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate() : d.getFullYear() + '-' + d.getMonth(); }
      function renderChart(){
        var bs = buckets(), ev = disposals(), idx = {}, total = 0, done = 0;
        bs.forEach(function(b, i){ idx[b.key] = i; b.n = 0; });
        ev.forEach(function(e){
          var i = idx[keyOf(e.date)]; if(i == null) return;
          bs[i].n++; total++; if(e.done) done++;
        });
        var max = bs.reduce(function(m, b){ return Math.max(m, b.n); }, 0);
        var top = Math.max(4, Math.ceil(max * 1.25)); if(top % 2) top++;
        var y = $('mp-y'), bars = $('mp-bars'), x = $('mp-x');
        y.innerHTML = ''; bars.innerHTML = ''; x.innerHTML = '';
        [top, top / 2, 0].forEach(function(v){ y.appendChild(el('span', '', v)); });
        bs.forEach(function(b){
          var bar = el('div', 'mp-bar' + (b.now ? ' now' : '') + (b.n ? '' : ' zero'));
          bar.style.setProperty('--h', (b.n / top * 100) + '%');
          bar.title = b.label + ': ' + b.n;
          bar.appendChild(el('b', '', b.n)); bar.appendChild(el('i'));
          bars.appendChild(bar);
          x.appendChild(el('span', '', b.label));
        });
        var empty = el('p', 'mp-empty', tr('Nenhum descarte neste período.')); empty.hidden = total > 0; bars.appendChild(empty);
        $('mp-total').textContent = total; $('mp-done').textContent = done;
        $('mp-plot').setAttribute('aria-label', tr('Descartes por período') + ': ' + bs.map(function(b){ return b.label + ' ' + b.n; }).join(', '));
        var sel = $('mp-period');
        sel.options[0].textContent = tr('Semanal'); sel.options[1].textContent = tr('Mensal');
      }

      /* ---------- 4 · Missões e conquistas ---------- */
      function renderMissions(ms){
        var ul = $('mp-missions'); ul.innerHTML = '';
        var nDone = ms.filter(function(m){ return m.done; }).length;
        $('mp-mis-count').textContent = tr('{n}/{t} concluídas', { n:nDone, t:ms.length });
        if(!ms.length){ ul.appendChild(el('li', 'mp-none', tr('Nenhuma missão ainda.'))); return; }
        ms.slice(0, 5).forEach(function(m){
          var li = el('li', 'mp-mis' + (m.done ? ' done' : ''));
          var ck = el('span', 'mp-check'); if(m.done) ck.appendChild(svg('<path d="M5 12l4 4 10-10"/>'));
          var tx = el('div', 'mp-mis-t'); tx.appendChild(el('strong', '', m.name));
          var sub = joinParts(m.deadline ? tr('Prazo: {d}', { d:m.deadline }) : '', m.prog);
          if(sub) tx.appendChild(el('span', '', sub));
          var st = m.done ? 'done' : (m.doing ? 'doing' : '');
          var bd = el('span', 'mp-badge ' + st, tr(m.done ? 'Concluída' : (m.doing ? 'Em andamento' : 'Pendente')));
          li.appendChild(ck); li.appendChild(tx); li.appendChild(bd);
          ul.appendChild(li);
        });
      }

      function render(){
        var ms = readMissions();
        renderProgress(ms); renderActivities(ms); renderChart(); renderMissions(ms);
      }

      $('mp-period').addEventListener('change', function(){ PERIOD = this.value; renderChart(); });
      var all = $('mp-acts-all');
      all.addEventListener('click', function(e){ var h = all.getAttribute('data-href'); if(h) window.location.href = h; e.preventDefault(); });

      document.addEventListener('ecoclick:lang-change', render);
      document.addEventListener('ecoclick:view-change', function(){ setTimeout(render, 60); });
      window.addEventListener('storage', render);
      window.addEventListener('focus', render);
      var done = $('done-text');                                     // novo agendamento confirmado → atualiza atividades e gráfico
      if(done && window.MutationObserver) new MutationObserver(render).observe(done, { childList:true, characterData:true, subtree:true });
      render();
    })();
  