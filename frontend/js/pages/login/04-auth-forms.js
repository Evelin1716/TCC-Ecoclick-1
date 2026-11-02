
(function(){
  var forms = document.querySelectorAll('.form');
  var texts = {
    login:  { t:'Bem-vindo de volta!', s:'Simplifique seu descarte e aumente seu impacto com o <strong>EcoClick</strong>. Comece grátis.' },
    signup: { t:'Crie sua conta', s:'Junte-se ao <strong>EcoClick</strong> e comece a transformar seu impacto.' }
  };
  var current = 'login';
  function setTab(n){
    current = n;
    forms.forEach(function(f){ f.classList.toggle('active', f.dataset.form === n); });
    document.getElementById('h').textContent = texts[n].t;
    document.getElementById('s').innerHTML = texts[n].s;
    document.getElementById('sw-login').style.display = n === 'login' ? '' : 'none';
    document.getElementById('sw-signup').style.display = n === 'signup' ? '' : 'none';
    forms.forEach(clearMsg);
  }
  document.querySelectorAll('[data-to]').forEach(function(b){ b.addEventListener('click', function(){ setTab(b.dataset.to); }); });
  document.querySelectorAll('[data-eye]').forEach(function(b){
    b.addEventListener('click', function(){ var i = document.getElementById(b.dataset.eye); i.type = i.type === 'password' ? 'text' : 'password'; });
  });
  if(window.EcoStart === 'signup') setTab('signup');

  function activeForm(){ return document.querySelector('.form.active'); }
  function showMsg(f, m){ var e = f.querySelector('.msg'); e.textContent = m; e.style.display = 'block'; e.setAttribute('role', 'alert'); if(window.EcoFX) EcoFX.shake(e); }
  function clearMsg(f){ var e = f.querySelector('.msg'); if(e) e.style.display = 'none'; }
  document.querySelectorAll('[data-social]').forEach(function(b){
    b.addEventListener('click', function(){ showMsg(activeForm(), 'Entrar com ' + b.dataset.social + ' ainda não está disponível. Use e-mail e senha.'); });
  });
  document.querySelector('[data-forgot]').addEventListener('click', function(e){
    e.preventDefault(); var f = activeForm(), em = (document.getElementById('login-email').value || '').trim().toLowerCase();
    if(em.indexOf('@') < 1){ showMsg(f, 'Digite seu e-mail no campo acima e toque em “Esqueceu a senha?” de novo.'); document.getElementById('login-email').focus(); return; }
    ask('reset', { email: em }, f);
  });
  document.querySelectorAll('[data-policy]').forEach(function(a){
    a.addEventListener('click', function(e){ e.preventDefault(); e.stopPropagation();
      try{ window.open(top.location.href.split('#')[0] + '#/' + a.getAttribute('data-policy'), '_blank', 'noopener'); }catch(x){ try{ parent.postMessage({ ecoNav: a.getAttribute('data-policy') === 'termos' ? 'terms' : 'privacy' }, '*'); }catch(y){} } });
  });
  var cbx = document.getElementById('signup-consent'); if(cbx) cbx.addEventListener('change', function(){ cbx.removeAttribute('aria-invalid'); });

  /* contas guardadas em localStorage; o site as sincroniza com o banco de dados */
  /* conta e sessão ficam no site principal; esta tela só envia os dados por mensagem */
  var signup = document.querySelector('[data-form="signup"]'), login = document.querySelector('[data-form="login"]'), pend = {};
  window.addEventListener('message', function(e){
    var r = e.data && e.data.ecoAuthRes; if(!r) return;
    var cb = pend[r.id]; delete pend[r.id]; if(cb) cb(r);
  });
  function ask(op, data, form){
    var id = Math.random().toString(36).slice(2), btn = form.querySelector('button[type="submit"]');
    if(btn){ btn.disabled = true; if(window.EcoFX) EcoFX.busy(btn, true); }
    var t = setTimeout(function(){ delete pend[id]; if(btn){ btn.disabled = false; if(window.EcoFX) EcoFX.busy(btn, false); } showMsg(form, 'Não foi possível concluir agora. Tente novamente.'); }, 20000);
    pend[id] = function(r){ clearTimeout(t); if(btn){ btn.disabled = false; if(window.EcoFX) EcoFX.busy(btn, false); } if(!r.ok || r.msg) showMsg(form, r.msg); };
    data.op = op; data.id = id;
    try{ parent.postMessage({ ecoAuth: data }, '*'); }catch(err){ clearTimeout(t); if(btn){ btn.disabled = false; if(window.EcoFX) EcoFX.busy(btn, false); } showMsg(form, 'Não foi possível concluir agora. Tente novamente.'); }
  }
  ['signup-name','signup-email','signup-pass','login-email','login-pass'].forEach(function(id){ var f = document.getElementById(id); if(f) f.addEventListener('input', function(){ f.removeAttribute('aria-invalid'); }); });
  signup.addEventListener('submit', function(e){
    e.preventDefault(); clearMsg(signup);
    var name = document.getElementById('signup-name').value.trim();
    var email = document.getElementById('signup-email').value.trim().toLowerCase();
    var pass = document.getElementById('signup-pass').value;
    var bad = function(id, on){ var f = document.getElementById(id); if(f) f.setAttribute('aria-invalid', on ? 'true' : 'false'); return on; };
    var eN = bad('signup-name', !name), eE = bad('signup-email', !email), eP = bad('signup-pass', !pass);
    if(eN || eE || eP){ showMsg(signup, 'Preencha nome, e-mail e senha para criar sua conta.'); return; }
    if(bad('signup-email', !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))){ showMsg(signup, 'Informe um e-mail válido, como nome@email.com.'); return; }
    if(bad('signup-pass', pass.length < 8)){ showMsg(signup, 'Use uma senha com pelo menos 8 caracteres.'); return; }
    var cb = document.getElementById('signup-consent');
    if(!cb.checked){ cb.setAttribute('aria-invalid', 'true'); showMsg(signup, 'Para criar a conta, aceite a Política de Privacidade e os Termos de uso.'); return; }
    ask('signup', { name: name, email: email, pass: pass, consent: true }, signup);
  });
  login.addEventListener('submit', function(e){
    e.preventDefault(); clearMsg(login);
    var email = document.getElementById('login-email').value.trim().toLowerCase();
    var pass = document.getElementById('login-pass').value;
    var le = document.getElementById('login-email'), lp = document.getElementById('login-pass');
    le.setAttribute('aria-invalid', String(!email)); lp.setAttribute('aria-invalid', String(!pass));
    if(!email || !pass){ showMsg(login, 'Informe e-mail e senha.'); return; }
    ask('login', { email: email, pass: pass }, login);
  });

})();
