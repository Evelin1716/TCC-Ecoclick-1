
(function(){
  var LKEY='ecoclick_community_posts',SKEY='ecoclick_community_saves',FKEY='ecoclick_community_follows',TKEY='ecoclick_community_stories',XKEY='ecoclick_community_topics';
  var TOPICS=[
    {id:'all',n:'Todos os temas',c:'var(--tone-1)',i:'<circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M16 5.2a3 3 0 0 1 0 5.6"/>'},
    {id:'descarte',n:'Descarte',c:'var(--tone-2)',i:'<path d="M17 2l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14M7 22l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>'},
    {id:'duvidas',n:'Dúvidas',c:'var(--tone-3)',i:'<circle cx="12" cy="12" r="9"/><path d="M9.6 9.6a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1.1.9-1.1 1.7M12 16.8h.01"/>'},
    {id:'conquistas',n:'Conquistas',c:'var(--tone-4)',i:'<path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3l-5.5 2.9 1-6.2L3 9.6l6.2-.9z"/>'},
    {id:'ideias',n:'Ideias',c:'var(--tone-5)',i:'<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>'},
    {id:'pilhas',n:'Pilhas e baterias',c:'var(--tone-6)',i:'<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>'},
    {id:'reuso',n:'Reuso e conserto',c:'var(--tone-7)',i:'<path d="M14.7 6.3a4 4 0 0 0-5.4 5.2L3 17.8 6.200 21l6.300-6.300a4 4 0 0 0 5.200-5.400l-2.600 2.600-2.400-.6-.6-2.400z"/>'}
  ];
  var ICO={"file": "<path d=\"M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z\"/><path d=\"M14 3v5h5\"/>", "img": "<rect x=\"3\" y=\"4\" width=\"18\" height=\"16\" rx=\"3\"/><circle cx=\"9\" cy=\"10\" r=\"1.8\"/><path d=\"M21 16l-5-5-8 8\"/>", "pin": "<path d=\"M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z\"/><circle cx=\"12\" cy=\"10\" r=\"2.4\"/>", "globe": "<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18\"/>", "smile": "<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M8.5 14.2a4.2 4.2 0 0 0 7 0M9 9.6h.01M15 9.6h.01\"/>"};
  function svg(k){return '<svg viewBox="0 0 24 24">'+ICO[k]+'</svg>'}
  function G(k){try{var v=localStorage.getItem(k);if(v!=null)return v}catch(e){}var o=window.__ECO||{};return o[k]==null?null:o[k]}
  var $=function(i){return document.getElementById(i)};
  var memS=[],memF=[],memT=[],pendImg='',pendDoc=null,busy=false,sugAll=false,onlyMine=false,curStory='';
  var shared=false,posts=loadLocal(),stories=loadSt(),topic='all',tab='new',query='',openC={};
  var IMG_OK=/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+\/=]+$/;
  var MIMES={pdf:'application/pdf',txt:'text/plain',csv:'text/csv',doc:'application/msword',docx:'application/vnd.openxmlformats-officedocument.wordprocessingml.document',xls:'application/vnd.ms-excel',xlsx:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',ppt:'application/vnd.ms-powerpoint',pptx:'application/vnd.openxmlformats-officedocument.presentationml.presentation',odt:'application/vnd.oasis.opendocument.text'};
  var COLORS=['#6366f1','#10b981','#3b82f6','#e8890c','#a855f7','#ef4444','#ec4899'];
  var EMOJIS=['😀','😊','😍','🥰','😎','🤩','😂','🙌','👏','👍','💚','🌱','♻️','🌍','🌳','🔋','📱','💡','⭐','🎉','🙏','💪','🔥','✨'];

  function lj(k){try{var l=JSON.parse(localStorage.getItem(k)||'[]');return Array.isArray(l)?l:[]}catch(e){return null}}
  function loadLocal(){return lj(LKEY)||[]}
  function saveLocal(){try{localStorage.setItem(LKEY,JSON.stringify(posts))}catch(e){return false}}
  function loadSt(){return lj(TKEY)||[]}
  function saveSt(){try{localStorage.setItem(TKEY,JSON.stringify(stories))}catch(e){return false}}
  function saves(){return lj(SKEY)||memS}
  function setSaves(l){memS=l;try{localStorage.setItem(SKEY,JSON.stringify(l))}catch(e){}}
  function tfollows(){return lj(XKEY)||memT}
  function setTfollows(l){memT=l;try{localStorage.setItem(XKEY,JSON.stringify(l))}catch(e){}}
  function follows(){return lj(FKEY)||memF}
  function setFollows(l){memF=l;try{localStorage.setItem(FKEY,JSON.stringify(l))}catch(e){}}
  function me(){try{var u=JSON.parse(G('ecoclick_current_user'));return u&&u.email?u:null}catch(e){return null}}
  function key(u){var h=2166136261,s=String(u.email).toLowerCase();for(var i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)>>>0}return 'u'+h.toString(36)}
  function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
  function ini(n){var w=String(n||'').trim().split(/\s+/).filter(Boolean);return w.length?(w[0][0]+(w.length>1?w[w.length-1][0]:'')).toUpperCase():'E'}
  function tname(id){for(var i=0;i<TOPICS.length;i++)if(TOPICS[i].id===id)return TOPICS[i].n;return ''}
  function colorOf(id){var h=0,s=String(id);for(var i=0;i<s.length;i++)h+=s.charCodeAt(i);var n=h%7+1;return '--c:var(--tone-'+n+');--f:var(--tf-'+n+')'}
  function ago(t){var s=Math.max(0,(Date.now()-t)/1000),r=new Intl.RelativeTimeFormat('pt-BR',{numeric:'auto'});
    if(s<60)return 'agora';if(s<3600)return r.format(-Math.round(s/60),'minute');if(s<86400)return r.format(-Math.round(s/3600),'hour');return r.format(-Math.round(s/86400),'day')}
  var toastT;function say(m){var t=$('toast');t.textContent=m;t.classList.add('show');clearTimeout(toastT);toastT=setTimeout(function(){t.classList.remove('show')},2600)}
  function find(id){for(var i=0;i<posts.length;i++)if(posts[i].id===id)return posts[i]}
  function toggle(arr,v){var i=arr.indexOf(v);if(i<0)arr.push(v);else arr.splice(i,1)}
  function kb(n){return n<1024?n+' B':Math.round(n/1024)+' KB'}
  function docOk(f){if(!f||!f.name||!f.data)return false;var m=/^data:([a-z0-9.+\/-]+);base64,[A-Za-z0-9+\/=]+$/i.exec(f.data);if(!m)return false;for(var k in MIMES)if(MIMES[k]===m[1])return true;return false}

  /* ---- banco: posts e stories compartilhados (ponte com o site principal); sem banco, usa o navegador ---- */
  var rid=0,pend={};
  window.addEventListener('message',function(e){var r=e.data&&e.data.ecoDbRes;if(!r)return;var cb=pend[r.id];delete pend[r.id];if(cb)cb(r)});
  function rpc(op,a){return new Promise(function(res){var id=++rid,t=setTimeout(function(){delete pend[id];res({ok:false})},5000);
    pend[id]=function(r){clearTimeout(t);res(r)};try{parent.postMessage({ecoDb:{id:id,op:op,a:a||{}}},'*')}catch(x){clearTimeout(t);delete pend[id];res({ok:false})}})}
  function valid(p){if(!(p&&p.id&&Array.isArray(p.likes)&&Array.isArray(p.comments)))return false;if(p.img&&!IMG_OK.test(p.img))p.img='';if(p.file&&!docOk(p.file))p.file=null;return true}
  function refresh(){
    if(!shared){posts=loadLocal();stories=loadSt();render();return Promise.resolve()}
    return Promise.all([rpc('list'),rpc('list',{col:'stories'})]).then(function(r){
      if(r[0].ok&&Array.isArray(r[0].posts))posts=r[0].posts.filter(valid);
      if(r[1].ok&&Array.isArray(r[1].posts))stories=r[1].posts;render()})}
  function mutate(id,fn){
    if(!shared){var p=find(id);if(p){fn(p);saveLocal();render()}return}
    rpc('get',{id:id}).then(function(r){
      if(!r.ok||!r.post){say('Este post não está mais disponível');refresh();return}
      var p=r.post;fn(p);return rpc('set',{id:id,post:p}).then(function(w){if(!w.ok)say('Não foi possível salvar agora');refresh()})})}
  function note(){$('note').textContent=shared?'Os posts são compartilhados com quem usa o EcoClick.':'Seus posts ficam salvos neste navegador.'}

  /* ---- login ---- */
  function requireLogin(msg){
    if(me())return true;
    $('m-p').textContent=msg||'Faça login ou crie sua conta para participar da comunidade.';
    $('modal').classList.add('open');$('m-in').focus();return false;
  }
  $('m-in').onclick=function(){window.EcoNav('login')};$('m-up').onclick=function(){window.EcoNav('signup')};
  $('m-x').onclick=function(){$('modal').classList.remove('open')};
  $('modal').addEventListener('click',function(e){if(e.target===this)this.classList.remove('open')});
  function openLb(src){$('lb-img').src=src;$('lb').classList.add('open')}
  function closeLb(){$('lb').classList.remove('open');$('lb-img').removeAttribute('src')}
  $('lb').addEventListener('click',closeLb);
  document.addEventListener('keydown',function(e){if(e.key==='Escape'){closeLb();closeStory();$('emo-pop').hidden=true;$('modal').classList.remove('open');$('app').classList.remove('open')}});

  /* ---- cabeçalho / sessão ---- */
  function renderUser(){
    var u=me(),a=$('actions');
    a.innerHTML='<button class="btn btn-primary" id="newp">Novo post</button>'+(u?'<span class="chip-user"><span class="av">'+esc(ini(u.name||u.email))+'</span><span>'+esc((u.name||u.email).split(' ')[0])+'</span></span>':'<button class="btn btn-dark" id="signin">Entrar</button>');
    $('newp').onclick=openEditor;if(!u)$('signin').onclick=function(){window.EcoNav('login')};
    $('foot').hidden=!u;$('cmp-av').textContent=u?ini(u.name||u.email):'E';
  }
  $('logout').addEventListener('click',function(){try{localStorage.removeItem('ecoclick_current_user')}catch(e){}});

  /* ---- temas ---- */
  function renderTopics(){
    $('topics').innerHTML=TOPICS.map(function(t,k){return '<button data-id="'+t.id+'" class="'+(t.id===topic?'on':'')+'" style="--i:'+k+';--c:'+t.c+';--f:var(--tf-'+(k+1)+')"><span class="dot"><svg viewBox="0 0 24 24">'+t.i+'</svg></span><span>'+t.n+'</span></button>'}).join('');
    $('e-topic').innerHTML=TOPICS.slice(1).map(function(t){return '<option value="'+t.id+'">'+t.n+'</option>'}).join('');
    if(topic!=='all')$('e-topic').value=topic;
  }
  function setTopic(id){topic=id;var bs=$('topics').children;for(var q=0;q<bs.length;q++)bs[q].classList.toggle('on',bs[q].dataset.id===id);if(id!=='all')$('e-topic').value=id;render()}
  $('topics').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;setTopic(b.dataset.id);$('app').classList.remove('open')});
  $('tabs').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;tab=b.dataset.t;
    Array.prototype.forEach.call($('tabs').children,function(x){x.classList.toggle('on',x===b)});render()});
  $('q').addEventListener('input',function(){query=this.value.trim().toLowerCase();render()});
  $('menu').onclick=function(){$('app').classList.toggle('open')};$('bd').onclick=function(){$('app').classList.remove('open')};

  /* ---- compositor ---- */
  function openEditor(){if(!requireLogin('Entre na sua conta para publicar na comunidade.'))return;$('editor').scrollIntoView({behavior:'smooth',block:'center'});$('e-body').focus()}
  function err(m){$('e-err').textContent=m||''}
  function grow(){var t=$('e-body');t.style.height='auto';t.style.height=Math.min(170,t.scrollHeight)+'px'}
  $('e-body').addEventListener('input',grow);
  $('e-body').addEventListener('keydown',function(e){if(e.key==='Enter'&&(e.ctrlKey||e.metaKey)){e.preventDefault();$('e-send').click()}});
  $('editor').addEventListener('focusin',function(e){if(!me()&&e.target.closest('textarea,input,select')){e.target.blur();requireLogin('Entre na sua conta para publicar na comunidade.')}});
  $('emo-pop').innerHTML=EMOJIS.map(function(m){return '<button type="button" data-e="'+m+'">'+m+'</button>'}).join('');
  $('e-emo').onclick=function(e){e.stopPropagation();if(!requireLogin('Entre na sua conta para publicar na comunidade.'))return;$('emo-pop').hidden=!$('emo-pop').hidden};
  $('emo-pop').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;var t=$('e-body'),s=t.selectionStart==null?t.value.length:t.selectionStart,en=t.selectionEnd==null?s:t.selectionEnd;
    t.value=t.value.slice(0,s)+b.dataset.e+t.value.slice(en);t.focus();t.selectionStart=t.selectionEnd=s+b.dataset.e.length;grow();$('emo-pop').hidden=true});
  document.addEventListener('click',function(e){if(!e.target.closest('.emo-wrap'))$('emo-pop').hidden=true});

  function renderChips(){
    $('e-chips').innerHTML=pendDoc?'<span class="chip">'+svg('file')+'<span>'+esc(pendDoc.name)+'</span><small>'+kb(pendDoc.size)+'</small><button type="button" id="e-docx" aria-label="Remover arquivo">×</button></span>':'';
    var x=$('e-docx');if(x)x.onclick=function(){pendDoc=null;renderChips()};
    $('e-fileb').classList.toggle('on',!!pendDoc);$('e-add').classList.toggle('on',!!pendImg);
  }
  function clearPhoto(){pendImg='';$('e-prev').classList.remove('on');$('e-img').removeAttribute('src');$('e-file').value='';renderChips()}
  function resetEditor(){$('editor').reset();$('e-body').style.height='auto';err('');pendDoc=null;clearPhoto();$('e-locrow').hidden=true;$('e-locb').classList.remove('on');if(topic!=='all')$('e-topic').value=topic}
  function shrink(img,max){var sizes=[1280,1024,800,640],qs=[.82,.72,.62,.5];
    for(var i=0;i<sizes.length;i++){var k=Math.min(1,sizes[i]/Math.max(img.width,img.height)),c=document.createElement('canvas');
      c.width=Math.max(1,Math.round(img.width*k));c.height=Math.max(1,Math.round(img.height*k));
      var x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(img,0,0,c.width,c.height);
      for(var j=0;j<qs.length;j++){var d=c.toDataURL('image/jpeg',qs[j]);if(d.length<=max)return d}}
    return ''}
  function loadImage(file,max,ok,bad){
    if(!/^image\//.test(file.type)){bad('Escolha um arquivo de imagem.');return}
    if(file.size>10*1024*1024){bad('A imagem é grande demais (máximo 10 MB).');return}
    var rd=new FileReader();rd.onerror=function(){bad('Não foi possível ler a imagem.')};
    rd.onload=function(){var im=new Image();im.onerror=function(){bad('Não foi possível abrir essa imagem. Tente outra.')};
      im.onload=function(){var d=shrink(im,max);if(!d||!IMG_OK.test(d)){bad('Não foi possível reduzir essa imagem. Tente outra.');return}ok(d)};im.src=rd.result};
    rd.readAsDataURL(file)}
  $('e-add').onclick=function(){if(requireLogin('Entre na sua conta para publicar na comunidade.'))$('e-file').click()};
  $('e-rm').onclick=clearPhoto;
  $('e-file').addEventListener('change',function(){var fl=this.files&&this.files[0];if(!fl)return;err('');busy=true;
    loadImage(fl,pendDoc?140000:190000,function(d){busy=false;pendImg=d;$('e-img').src=d;$('e-prev').classList.add('on');renderChips()},function(m){busy=false;err(m);clearPhoto()})});
  $('e-fileb').onclick=function(){if(requireLogin('Entre na sua conta para publicar na comunidade.'))$('e-doc').click()};
  $('e-doc').addEventListener('change',function(){var fl=this.files&&this.files[0];this.value='';if(!fl)return;err('');
    var ext=(fl.name.split('.').pop()||'').toLowerCase();
    if(!MIMES[ext]){err('Tipo de arquivo não permitido. Use PDF, Word, Excel, PowerPoint, TXT ou CSV.');return}
    if(fl.size>60*1024){err('O arquivo é grande demais (máximo 60 KB).');return}
    busy=true;var rd=new FileReader();rd.onerror=function(){busy=false;err('Não foi possível ler o arquivo.')};
    rd.onload=function(){busy=false;var b64=String(rd.result).split(',')[1]||'',data='data:'+MIMES[ext]+';base64,'+b64;
      if(pendImg&&pendImg.length+data.length>225000){err('Foto e arquivo juntos passam do limite. Remova a foto ou use um arquivo menor.');return}
      pendDoc={name:fl.name.slice(0,60),size:fl.size,data:data};renderChips()};
    rd.readAsDataURL(fl)});
  $('e-locb').onclick=function(){if(!requireLogin('Entre na sua conta para publicar na comunidade.'))return;var r=$('e-locrow');r.hidden=!r.hidden;$('e-locb').classList.toggle('on',!r.hidden);if(!r.hidden)$('e-loc').focus();else $('e-loc').value=''};
  $('e-locx').onclick=function(){$('e-loc').value='';$('e-locrow').hidden=true;$('e-locb').classList.remove('on')};
  $('editor').addEventListener('submit',function(e){
    e.preventDefault();var u=me();if(!u){requireLogin();return}
    if(busy){err('Aguarde o anexo ficar pronto.');return}
    var body=$('e-body').value.trim();
    if(body.length<3&&!pendImg&&!pendDoc){err('Escreva um pouco mais ou adicione uma foto ou arquivo para publicar.');return}
    var p={id:Date.now().toString(36)+Math.random().toString(36).slice(2,6),uid:key(u),name:u.name||u.email.split('@')[0],topic:$('e-topic').value,title:'',body:body,img:pendImg,file:pendDoc,loc:$('e-loc').value.trim().slice(0,60),vis:$('e-vis').value,at:Date.now(),likes:[],comments:[]};
    posts.unshift(p);resetEditor();render();
    if(shared)rpc('set',{id:p.id,post:p}).then(function(w){say(w.ok?'Post publicado!':'Não foi possível publicar agora');if(!w.ok)refresh()});
    else{say(saveLocal()===false?'Publicado, mas o navegador não tem espaço para guardar os anexos':'Post publicado!')}
  });

  /* ---- feed ---- */
  function score(p,k){return k==='pop'?p.likes.length*2+p.comments.length:p.comments.length*2+p.likes.length}
  function visible(p){if(p.vis!=='followers')return true;var u=me();if(!u)return false;return p.uid===key(u)||p.uid===u.email||follows().indexOf(p.uid)>-1}
  function card(p){
    var u=me(),k=u?key(u):'',liked=u&&p.likes.indexOf(k)>-1,saved=saves().indexOf(p.id)>-1,mine=u&&(p.uid===k||p.uid===u.email);
    var cm=p.comments.map(function(c){return '<div class="cm"><span class="av">'+esc(ini(c.name))+'</span><div><b>'+esc(c.name)+'</b><small>'+ago(c.at)+'</small><p>'+esc(c.body)+'</p></div></div>'}).join('');
    var meta=ago(p.at)+(p.loc?' · <span class="meta">'+svg('pin')+esc(p.loc)+'</span>':'')+(p.vis==='followers'?' · <span class="meta">'+svg('globe')+'Seguidores</span>':'');
    return '<article class="card post" data-id="'+p.id+'"><div class="ph"><span class="av">'+esc(ini(p.name))+'</span><div><b>'+esc(p.name)+'</b><span>'+meta+'</span></div><span class="tag">'+esc(tname(p.topic))+'</span></div>'+
      (p.title?'<h3>'+esc(p.title)+'</h3>':'')+(p.body?'<p class="body">'+esc(p.body)+'</p>':'')+
      (p.img&&IMG_OK.test(p.img)?'<button type="button" class="pimg-btn" data-a="zoom" aria-label="Ampliar foto"><img class="pimg" loading="lazy" decoding="async" alt="Foto compartilhada por '+esc(p.name)+'" src="'+p.img+'"></button>':'')+
      (p.file&&docOk(p.file)?'<a class="fchip" download="'+esc(p.file.name)+'" href="'+p.file.data+'">'+svg('file')+'<span>'+esc(p.file.name)+'</span><small>'+kb(p.file.size||0)+'</small></a>':'')+
      '<div class="pf"><button data-a="like" class="'+(liked?'on':'')+'" aria-label="Curtir"><svg viewBox="0 0 24 24"><path d="M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.800-8 11-8 11z"/></svg>'+p.likes.length+'</button>'+
      '<button data-a="cm" aria-label="Comentários"><svg viewBox="0 0 24 24"><path d="M21 12a8 8 0 0 1-11.800 7L3 21l2-5.500A8 8 0 1 1 21 12z"/></svg>'+p.comments.length+'</button>'+
      '<button data-a="save" class="'+(saved?'on':'')+'" aria-label="Salvar"><svg viewBox="0 0 24 24"><path d="M6 4h12v17l-6-4-6 4z"/></svg></button>'+
      '<button data-a="share" aria-label="Compartilhar"><svg viewBox="0 0 24 24"><path d="M4 12v7h16v-7M12 3v12M8 7l4-4 4 4"/></svg></button><span class="sp"></span>'+
      (mine?'<button class="del" data-a="del">Excluir</button>':'')+'</div>'+
      '<div class="comments'+(openC[p.id]?' open':'')+'">'+cm+'<form class="reply" data-id="'+p.id+'" novalidate><input placeholder="Escreva um comentário…" aria-label="Comentário" maxlength="500"><button class="btn btn-primary" type="submit">Enviar</button></form></div></article>';
  }

  /* ---- coluna da direita: stories, sugestões, recomendações ---- */
  function liveStories(){var cut=Date.now()-864e5;return stories.filter(function(s){return s&&s.id&&s.name&&s.at>cut&&IMG_OK.test(s.img||'')}).sort(function(a,b){return b.at-a.at}).slice(0,10)}
  function renderStories(){
    var h='<button type="button" class="story add" id="st-add" aria-label="Adicionar story"><span class="pl">+</span>Seu story</button>';
    liveStories().forEach(function(s){var rc=Object.keys(s.reacts||{}).reduce(function(n,k){return n+((s.reacts[k]||[]).length)},0);h+='<button type="button" class="story" data-st="'+esc(s.id)+'" aria-label="Story de '+esc(s.name)+'"><img alt="" loading="lazy" src="'+s.img+'">'+(rc?'<span class="rc">❤ '+rc+'</span>':'')+'<span class="who"><span class="av">'+esc(ini(s.name))+'</span>'+esc(String(s.name).split(' ')[0])+'</span></button>'});
    $('stories').innerHTML=h}
  $('stories').addEventListener('click',function(e){
    if(e.target.closest('#st-add')){if(requireLogin('Entre na sua conta para publicar um story.'))$('st-file').click();return}
    var b=e.target.closest('[data-st]');if(!b)return;openStory(b.dataset.st)});
  $('st-file').addEventListener('change',function(){var fl=this.files&&this.files[0];this.value='';if(!fl)return;var u=me();if(!u)return;say('Preparando o story…');
    loadImage(fl,190000,function(d){var s={id:Date.now().toString(36)+Math.random().toString(36).slice(2,5),uid:key(u),name:u.name||u.email.split('@')[0],img:d,at:Date.now()};
      stories.unshift(s);renderStories();
      if(shared)rpc('set',{col:'stories',id:s.id,post:s}).then(function(w){say(w.ok?'Story publicado por 24 horas!':'Não foi possível publicar o story');if(!w.ok)refresh()});
      else say(saveSt()===false?'Story publicado, mas o navegador não tem espaço para guardá-lo':'Story publicado por 24 horas!')},function(m){say(m)})});
  /* ---- visualizador de story: reagir e excluir ---- */
  var REACTS=['❤️','👏','🌱','🔥','😮'];
  function storyById(id){for(var i=0;i<stories.length;i++)if(stories[i].id===id)return stories[i]}
  function openStory(id){curStory=id;showStory();if(curStory)$('sv').classList.add('open')}
  function closeStory(){curStory='';$('sv').classList.remove('open');$('sv-img').removeAttribute('src')}
  function showStory(){
    var s=storyById(curStory);if(!s||!IMG_OK.test(s.img||'')){closeStory();return}
    var u=me(),k=u?key(u):'',r=s.reacts||{},d=$('sv-del');
    $('sv-av').textContent=ini(s.name);$('sv-name').textContent=s.name;$('sv-time').textContent=ago(s.at);
    if($('sv-img').getAttribute('src')!==s.img)$('sv-img').src=s.img;
    $('sv-react').innerHTML=REACTS.map(function(e){var a=r[e]||[];return '<button type="button" class="rx'+(u&&a.indexOf(k)>-1?' on':'')+'" data-r="'+e+'" aria-label="Reagir com '+e+'">'+e+(a.length?'<span>'+a.length+'</span>':'')+'</button>'}).join('');
    d.hidden=!(u&&(s.uid===k||s.uid===u.email));if(!d.dataset.arm)d.textContent='Excluir story'}
  function applyReact(s,e,k){s.reacts=s.reacts||{};var had=(s.reacts[e]||[]).indexOf(k)>-1;
    REACTS.forEach(function(x){s.reacts[x]=(s.reacts[x]||[]).filter(function(v){return v!==k})});
    if(!had)s.reacts[e]=(s.reacts[e]||[]).concat([k])}
  $('sv-react').addEventListener('click',function(ev){
    var b=ev.target.closest('[data-r]');if(!b)return;
    if(!requireLogin('Entre na sua conta para reagir aos stories.'))return;
    var u=me(),k=key(u),id=curStory,e=b.dataset.r,s=storyById(id);if(!s)return;
    applyReact(s,e,k);showStory();renderStories();
    if(shared)rpc('get',{col:'stories',id:id}).then(function(r){if(!r.ok||!r.post){refresh();return}var p=r.post;applyReact(p,e,k);
      return rpc('set',{col:'stories',id:id,post:p}).then(function(w){if(!w.ok)say('Não foi possível reagir agora');refresh()})});
    else saveSt()});
  $('sv-del').onclick=function(){
    var s=storyById(curStory),u=me();if(!s||!u||!armed(this,'Excluir story'))return;
    var id=s.id;stories=stories.filter(function(x){return x.id!==id});closeStory();renderStories();renderSugs();
    if(shared)rpc('del',{col:'stories',id:id}).then(function(w){say(w.ok?'Story excluído':'Não foi possível excluir');if(!w.ok)refresh()});
    else{saveSt();say('Story excluído')}};
  $('sv-x').onclick=closeStory;$('sv').addEventListener('click',function(e){if(e.target===this)closeStory()});
  function people(){
    var m={},u=me(),k=u?key(u):'';
    function add(id,n){if(id&&n&&id!==k&&(!u||id!==u.email)&&!m[id])m[id]=n}
    posts.forEach(function(p){add(p.uid,p.name);p.comments.forEach(function(c){add(c.uid,c.name)})});
    liveStories().forEach(function(s){add(s.uid,s.name)});
    var f=follows();return Object.keys(m).map(function(id){return {id:id,name:m[id],on:f.indexOf(id)>-1}}).sort(function(a,b){return a.on-b.on})}
  function renderSugs(){
    var l=people(),sh=sugAll?l:l.slice(0,3);
    $('sugs').innerHTML=sh.length?sh.map(function(p){return '<div class="sug"><span class="av" style="'+colorOf(p.id)+'">'+esc(ini(p.name))+'</span><div><b>'+esc(p.name)+'</b><span class="m">Na comunidade</span></div><button type="button" class="fol'+(p.on?' on':'')+'" data-f="'+esc(p.id)+'">'+(p.on?'Seguindo':'Seguir')+'</button></div>'}).join(''):'<p class="mut">Quando mais pessoas participarem, as sugestões aparecem aqui.</p>';
    $('seeall').hidden=l.length<=3;$('seeall').textContent=sugAll?'Ver menos':'Ver todos'}
  $('sugs').addEventListener('click',function(e){var b=e.target.closest('[data-f]');if(!b)return;if(!requireLogin('Entre na sua conta para seguir pessoas.'))return;
    var l=follows().slice();toggle(l,b.dataset.f);setFollows(l);render()});
  $('seeall').onclick=function(){sugAll=!sugAll;renderSugs()};
  function renderRecs(){
    var tf=tfollows(),cnt={};posts.filter(visible).forEach(function(p){cnt[p.topic]=(cnt[p.topic]||0)+1});
    var l=TOPICS.slice(1).map(function(t,i){return {t:t,i:i}}).sort(function(x,y){return (tf.indexOf(y.t.id)>-1)-(tf.indexOf(x.t.id)>-1)||x.i-y.i});
    $('recs').innerHTML=l.map(function(x){var t=x.t,f=tf.indexOf(t.id)>-1,n=cnt[t.id]||0;
      return '<div class="recw"><button type="button" class="rec'+(t.id===topic?' on':'')+'" data-rec="'+t.id+'" style="--c:'+t.c+'" title="'+esc(t.n)+' · '+n+' posts"><svg viewBox="0 0 24 24">'+t.i+'</svg>'+esc(t.n)+'<span class="cnt">'+n+(n===1?' post':' posts')+'</span></button>'+
      '<button type="button" class="fav'+(f?' on':'')+'" data-fav="'+t.id+'" aria-pressed="'+f+'" aria-label="'+(f?'Deixar de seguir ':'Seguir ')+esc(t.n)+'"><svg viewBox="0 0 24 24"><path d="M12 3.500l2.600 5.400 5.900.8-4.300 4.100 1 5.800L12 16.800 6.800 19.600l1-5.800L3.500 9.700l5.900-.8z"/></svg></button></div>'}).join('');
    $('mine').classList.toggle('on',onlyMine);$('mine').textContent=onlyMine?'Todos os temas':'Meus temas'}
  $('recs').addEventListener('click',function(e){
    var fv=e.target.closest('[data-fav]');
    if(fv){if(!requireLogin('Entre na sua conta para seguir temas.'))return;var l=tfollows().slice();toggle(l,fv.dataset.fav);setTfollows(l);say(l.indexOf(fv.dataset.fav)>-1?'Você segue este tema':'Tema removido de Meus temas');render();return}
    var b=e.target.closest('[data-rec]');if(!b)return;setTopic(topic===b.dataset.rec?'all':b.dataset.rec)});
  $('mine').onclick=function(){if(!onlyMine&&!tfollows().length){say('Toque na estrela de um tema para segui-lo');return}onlyMine=!onlyMine;render()};

  function render(){
    var list=posts.filter(function(p){return visible(p)&&(!onlyMine||tfollows().indexOf(p.topic)>-1)&&(topic==='all'||p.topic===topic)&&(!query||((p.title||'')+' '+(p.body||'')+' '+p.name+' '+(p.loc||'')).toLowerCase().indexOf(query)>-1)});
    list.sort(function(a,b){return tab==='new'?b.at-a.at:(score(b,tab)-score(a,tab))||(b.at-a.at)});
    var filtered=topic!=='all'||query||onlyMine;
    $('feed').innerHTML=list.length?list.map(card).join(''):
      '<div class="card empty"><svg viewBox="0 0 24 24"><path d="M12 21v-8"/><path d="M12 13c0-4 2.500-6.500 7-7 0 4.500-2.500 7-7 7z"/><path d="M12 15c0-3-2-5-5.500-5.300C6.500 13 8.500 15 12 15z"/></svg>'+
      (filtered?'<h2>Nenhum post encontrado</h2><p>Tente outro tema ou outra busca.</p>':'<h2>Seja a primeira pessoa a compartilhar uma ideia!</h2><p>A comunidade ainda está vazia. Conte o que você já descartou, tire uma dúvida ou mostre uma foto.</p><button class="btn btn-primary" id="first">Criar o primeiro post</button>')+'</div>';
    var f=$('first');if(f)f.onclick=openEditor;
    var hot=posts.filter(visible).sort(function(a,b){return score(b,'pop')-score(a,'pop')}).filter(function(p){return score(p,'pop')>0}).slice(0,3);
    $('hot').innerHTML=hot.length?hot.map(function(p){return '<button class="hot" data-hot="'+p.id+'">'+esc(p.title||(p.body||'Foto').slice(0,60))+'<small>'+p.likes.length+' curtidas · '+p.comments.length+' comentários</small></button>'}).join(''):'<p class="mut">Os posts mais curtidos e comentados aparecem aqui.</p>';
    renderStories();renderSugs();renderRecs();if(curStory)showStory();
  }
  $('hot').addEventListener('click',function(e){var b=e.target.closest('[data-hot]');if(!b)return;topic='all';query='';$('q').value='';renderTopics();render();
    var el=document.querySelector('[data-id="'+b.dataset.hot+'"]');if(el)el.scrollIntoView({behavior:'smooth',block:'center'})});
  function armed(b,label){label=label||'Excluir';if(b.dataset.arm)return true;b.dataset.arm='1';b.textContent='Confirmar exclusão';setTimeout(function(){if(b.isConnected){delete b.dataset.arm;b.textContent=label}},4000);return false}
  $('feed').addEventListener('click',function(e){
    var b=e.target.closest('button[data-a]');if(!b)return;var el=b.closest('.post'),p=find(el.dataset.id),a=b.dataset.a,u=me();if(!p)return;
    if(window.EcoFX&&(a==='like'||a==='save')){var pid=el.dataset.id;setTimeout(function(){var nb=document.querySelector('.post[data-id="'+pid+'"] [data-a="'+a+'"]');if(nb&&nb.classList.contains('on'))EcoFX.pop(nb.querySelector('svg')||nb)},60)}
    if(a==='like'){if(!requireLogin('Entre na sua conta para curtir posts.'))return;var k=key(u);mutate(p.id,function(x){toggle(x.likes,k)})}
    else if(a==='save'){if(!requireLogin('Entre na sua conta para salvar posts.'))return;var l=saves();toggle(l,p.id);setSaves(l);render();say(l.indexOf(p.id)>-1?'Post salvo':'Post removido dos salvos')}
    else if(a==='cm'){openC[p.id]=!openC[p.id];el.querySelector('.comments').classList.toggle('open',openC[p.id]);if(openC[p.id])el.querySelector('.reply input').focus()}
    else if(a==='zoom'){if(p.img&&IMG_OK.test(p.img))openLb(p.img)}
    else if(a==='share'){var t=(p.title?p.title+' — ':'')+(p.body||'Foto na comunidade EcoClick').slice(0,120);try{navigator.clipboard.writeText(t).then(function(){say('Texto copiado')},function(){say('Não foi possível copiar')})}catch(x){say('Não foi possível copiar')}}
    else if(a==='del'){if(u&&armed(b)){
      posts=posts.filter(function(x){return x!==p});render();
      if(shared)rpc('del',{id:p.id}).then(function(w){say(w.ok?'Post excluído':'Não foi possível excluir');if(!w.ok)refresh()});
      else{saveLocal();say('Post excluído')}}}
  });
  $('feed').addEventListener('focusin',function(e){if(e.target.closest('.reply')&&!me()){e.target.blur();requireLogin('Entre na sua conta para comentar nos posts.')}});
  $('feed').addEventListener('submit',function(e){
    e.preventDefault();var f=e.target,p=find(f.dataset.id),u=me();if(!p)return;if(!u){requireLogin('Entre na sua conta para comentar nos posts.');return}
    var v=f.querySelector('input').value.trim();if(!v)return;openC[p.id]=true;
    mutate(p.id,function(x){x.comments.push({id:Date.now().toString(36),name:u.name||u.email.split('@')[0],uid:key(u),body:v,at:Date.now()})});
  });
  window.addEventListener('storage',function(){if(!shared){posts=loadLocal();stories=loadSt()}renderUser();render()});
  window.addEventListener('pageshow',renderUser);
  renderTopics();renderUser();render();renderChips();
  setTimeout(function(){$('topics').classList.remove('intro')},1800);
  rpc('list').then(function(r){if(r.ok&&Array.isArray(r.posts)){shared=true;posts=r.posts.filter(valid);note();
    rpc('list',{col:'stories'}).then(function(s){if(s.ok&&Array.isArray(s.posts))stories=s.posts;render()});render();
    setInterval(function(){if(!document.hidden)refresh()},20000)}});
})();

