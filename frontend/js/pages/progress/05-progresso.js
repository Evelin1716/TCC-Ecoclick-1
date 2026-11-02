
/* ---------- i18n: [pt, es, en] ---------- */
const LANGS=['pt','es','en'], LOC={pt:'pt-BR',es:'es',en:'en'};
const D={
nav_home:['Início','Inicio','Home'],nav_points:['Pontos de coleta','Puntos de recolección','Collection points'],
nav_progress:['Meu progresso','Mi progreso','My progress'],nav_missions:['Minha jornada','Mi jornada','My journey'],nav_about:['Sobre nós','Sobre nosotros','About us'],logout:['Sair','Salir','Log out'],
days:['dias','días','days'],level:['Nível','Nivel','Level'],
hello:['Olá, {n}!','¡Hola, {n}!','Hello, {n}!'],
hello_sub:['Continue transformando pequenas atitudes em um grande impacto.','Sigue convirtiendo pequeñas acciones en un gran impacto.','Keep turning small actions into a big impact.'],
hero_tag:['Pequenos gestos, grandes mudanças','Pequeños gestos, grandes cambios','Small gestures, big changes'],
hero_title:['Comece sua sequência hoje!','¡Empieza tu racha hoy!','Start your streak today!'],
hero_text:['Descarte seus eletrônicos, suba de nível e acompanhe o impacto que você gera.','Recicla tus electrónicos, sube de nivel y sigue el impacto que generas.','Recycle your electronics, level up and track the impact you make.'],
btn_chart:['Ver meu gráfico →','Ver mi gráfico →','See my chart →'],btn_profile:['Abrir perfil','Abrir perfil','Open profile'],
streak_row:['dias seguidos','días seguidos','day streak'],
lvl_name:['Consciente','Consciente','Aware'],xp_left:['Faltam {n} XP para o nível {l}','Faltan {n} XP para el nivel {l}','{n} XP to level {l}'],
goal_title:['Meta de reciclagem','Meta de reciclaje','Recycling goal'],
goal_items:['itens nas últimas 2 semanas','artículos en las últimas 2 semanas','items in the last 2 weeks'],
goal_left:['Faltam {n}% para bater sua meta de {g} itens em 2 semanas.','Faltan {n}% para alcanzar tu meta de {g} artículos en 2 semanas.','{n}% left to hit your goal of {g} items in 2 weeks.'],
goal_start:['Registre seus descartes em Minha jornada para avançar rumo à meta de {g} itens em 2 semanas.','Registra tus reciclajes en Mi jornada para avanzar hacia la meta de {g} artículos en 2 semanas.','Log your recycling in My journey to progress toward your goal of {g} items in 2 weeks.'],
goal_done:['Meta batida! Você chegou a {g} itens em 2 semanas.','¡Meta lograda! Llegaste a {g} artículos en 2 semanas.','Goal reached! You hit {g} items in 2 weeks.'],
trees_title:['Árvores preservadas','Árboles preservados','Trees preserved'],trees_n:['{n} árvores','{n} árboles','{n} trees'],tree_1:['{n} árvore','{n} árbol','{n} tree'],
trees_text:['Estimativa de impacto ambiental gerado pelos seus descartes.','Estimación del impacto ambiental de tus descartes.','Estimated environmental impact of your recycling.'],
streak_title:['Sequência','Racha','Streak'],
streak_text:['Continue descartando para manter o fogo aceso!','¡Sigue reciclando para mantener la llama!','Keep recycling to keep the flame alive!'],
chart_title:['Meu histórico de descarte','Mi historial de reciclaje','My recycling history'],
chart_sub:['Itens eletrônicos por mês','Artículos electrónicos por mes','E-waste items per month'],
bars:['Barras','Barras','Bars'],line:['Linha','Línea','Line'],
growth:['Quando você registrar descartes, o crescimento mês a mês aparece aqui.','Cuando registres reciclajes, el crecimiento mes a mes aparecerá aquí.','Once you log recycling, your month-by-month growth will show up here.'],
growth_up:['Você aumentou em {p}% a quantidade de itens registrados em relação ao mês anterior.','Aumentaste un {p}% la cantidad de artículos registrados respecto al mes anterior.','You increased the number of items you logged by {p}% compared with last month.'],
growth_all:['Total de itens registrados neste ano: {n}.','Total de artículos registrados este año: {n}.','Total items logged this year: {n}.'],
hint:['Toque ou passe o mouse nos meses para ver detalhes','Toca o pasa el ratón por los meses para ver detalles','Tap or hover the months to see details'],
sel_month:['Mês selecionado','Mes seleccionado','Selected month'],items_unit:['itens','artículos','items'],
of_total:['do total do período','del total del período','of the period total'],
first:['Primeiro mês registrado','Primer mes registrado','First recorded month'],vsprev:['vs. mês anterior','vs. mes anterior','vs. previous month'],
mon:[['Janeiro','Fevereiro','Março','Abril','Maio'],['Enero','Febrero','Marzo','Abril','Mayo'],['January','February','March','April','May']],
active:['Conta ativa','Cuenta activa','Active account'],since:['Membro desde {d}','Miembro desde {d}','Member since {d}'],
personal:['Dados pessoais','Datos personales','Personal data'],
f_name:['Nome completo','Nombre completo','Full name'],f_email:['E-mail','Correo electrónico','Email'],f_phone:['Telefone','Teléfono','Phone'],
f_city:['Cidade / Estado','Ciudad / Estado','City / State'],f_birth:['Data de nascimento','Fecha de nacimiento','Date of birth'],
edit_all:['Editar dados pessoais','Editar datos personales','Edit personal data'],save:['Salvar','Guardar','Save'],cancel:['Cancelar','Cancelar','Cancel'],
security:['Segurança','Seguridad','Security'],pw_t:['Alterar senha','Cambiar contraseña','Change password'],
pw_d:['Atualize sua senha para manter sua conta protegida.','Actualiza tu contraseña para mantener tu cuenta protegida.','Update your password to keep your account protected.'],
pw_btn:['Trocar senha','Cambiar contraseña','Change password'],pw_cur:['Senha atual','Contraseña actual','Current password'],
pw_new:['Nova senha (mín. 8 caracteres)','Nueva contraseña (mín. 8 caracteres)','New password (min. 8 characters)'],
pw_conf:['Confirmar nova senha','Confirmar nueva contraseña','Confirm new password'],
pw_err:['As senhas não conferem ou são curtas demais.','Las contraseñas no coinciden o son muy cortas.',"Passwords don't match or are too short."],
pw_ok:['Senha atualizada!','¡Contraseña actualizada!','Password updated!'],
tfa_t:['Verificação em duas etapas','Verificación en dos pasos','Two-step verification'],
tfa_d:['Adicione uma camada extra de segurança à sua conta.','Añade una capa extra de seguridad a tu cuenta.','Add an extra layer of security to your account.'],
prot1:['Conta protegida','Cuenta protegida','Account protected'],prot0:['Ative o 2FA para proteger ainda mais','Activa el 2FA para más protección','Enable 2FA for extra protection'],
settings:['Configurações','Configuración','Settings'],appearance:['Aparência','Apariencia','Appearance'],
theme:['Tema','Tema','Theme'],theme_l:['Claro','Claro','Light'],theme_d:['Escuro','Oscuro','Dark'],lang:['Idioma','Idioma','Language'],
notif:['Notificações','Notificaciones','Notifications'],
n1:['Novos pontos de coleta','Nuevos puntos de recolección','New collection points'],n2:['Lembretes de descarte','Recordatorios de reciclaje','Recycling reminders'],
n3:['Atualizações de pedidos','Actualizaciones de pedidos','Order updates'],n4:['Mensagens de sustentabilidade','Mensajes de sostenibilidad','Sustainability messages'],
privacy:['Privacidade','Privacidad','Privacy'],p1:['Perfil público','Perfil público','Public profile'],
p2:['Compartilhamento de dados','Compartir datos','Data sharing'],p3:['Aparecer no ranking','Aparecer en el ranking','Show in ranking'],
history:['Histórico da conta','Historial de la cuenta','Account history'],
hist_all:['Ver histórico completo','Ver historial completo','View full history'],hist_less:['Ocultar histórico','Ocultar historial','Hide history'],
ev1:['Recompensa resgatada','Recompensa canjeada','Reward redeemed'],ev2:['Pedido de coleta criado','Solicitud de recolección creada','Collection request created'],
ev3:['Acesso realizado','Inicio de sesión','Signed in'],ev4:['Chamado de suporte aberto','Ticket de soporte abierto','Support ticket opened'],
ev5:['Descarte registrado','Reciclaje registrado','Recycling logged'],ev6:['Notebook antigo coletado','Portátil antiguo recogido','Old laptop collected'],
ev7:['Celular entregue em ponto de coleta','Móvil entregado en punto de recolección','Phone dropped at a collection point'],
ev8:['Fone de ouvido descartado','Auriculares reciclados','Headphones recycled'],
saved:['Alterações salvas!','¡Cambios guardados!','Changes saved!'],site:['Disponível no site completo','Disponible en el sitio completo',"Available on the full site"],
menu_toggle:['Abrir ou fechar menu','Abrir o cerrar menú','Open or close menu'],
photo:['Alterar foto de perfil','Cambiar foto de perfil','Change profile photo'],
mark_all:['Marcar todas como lidas','Marcar todas como leídas','Mark all as read'],
all_read:['Todas as notificações foram marcadas como lidas.','Todas las notificaciones se marcaron como leídas.','All notifications marked as read.'],
notif_empty:['Você não tem notificações.','No tienes notificaciones.','You have no notifications.'],
notif_note:['Notificações geradas pela própria interface a partir dos dados exibidos. Ainda não há integração com um servidor de notificações.','Notificaciones generadas por la propia interfaz a partir de los datos mostrados. Aún no hay integración con un servidor de notificaciones.','Notifications generated by the interface itself from the data shown. There is no notification server integration yet.'],
nt_goal_t:['Meta de reciclagem','Meta de reciclaje','Recycling goal'],
nt_goal_m:['Faltam apenas 12% para bater sua meta de 45 dias.','Solo falta un 12% para tu meta de 45 días.','Only 12% left to hit your 45-day goal.'],
nt_xp_t:['Próximo nível','Próximo nivel','Next level'],nt_xp_m:['Faltam {n} XP para o nível {l}.','Faltan {n} XP para el nivel {l}.','{n} XP to level {l}.'],
nt_streak_t:['Sequência ativa','Racha activa','Active streak'],
nt_streak_m:['Você está há 7 dias seguidos reciclando.','Llevas 7 días seguidos reciclando.',"You're on a 7-day recycling streak."],
nt_prof_t:['Perfil atualizado','Perfil actualizado','Profile updated'],
nt_prof_m:['Suas informações pessoais foram salvas.','Tus datos personales se guardaron.','Your personal information was saved.'],
nt_tfa1_t:['Verificação em duas etapas ativada','Verificación en dos pasos activada','Two-step verification enabled'],
nt_tfa1_m:['O autenticador foi configurado neste dispositivo.','La app autenticadora se configuró en este dispositivo.','The authenticator was set up on this device.'],
nt_tfa0_t:['Verificação em duas etapas desativada','Verificación en dos pasos desactivada','Two-step verification disabled'],
nt_tfa0_m:['O autenticador foi removido deste dispositivo.','La app autenticadora se quitó de este dispositivo.','The authenticator was removed from this device.'],
ev_profile:['Dados pessoais atualizados','Datos personales actualizados','Personal data updated'],
ev_photo:['Foto de perfil alterada','Foto de perfil cambiada','Profile photo changed'],
ev_tfa_on:['Verificação em duas etapas ativada','Verificación en dos pasos activada','Two-step verification enabled'],
ev_tfa_off:['Verificação em duas etapas desativada','Verificación en dos pasos desactivada','Two-step verification disabled'],
hist_empty:['Nenhuma atividade registrada ainda.','Aún no hay actividad registrada.','No activity recorded yet.'],
hist_note:['Registro das ações feitas neste dispositivo.','Registro de las acciones hechas en este dispositivo.','Log of actions made on this device.'],
err_name:['Informe nome e sobrenome (mín. 5 caracteres).','Indica nombre y apellido (mín. 5 caracteres).','Enter first and last name (min. 5 characters).'],
err_email:['Informe um e-mail válido.','Indica un correo válido.','Enter a valid email.'],
err_phone:['Informe um telefone válido com DDD (10 a 13 dígitos).','Indica un teléfono válido (10 a 13 dígitos).','Enter a valid phone number (10 to 13 digits).'],
err_city:['Informe cidade e estado (ex.: Salvador, BA).','Indica ciudad y estado (ej.: Salvador, BA).','Enter city and state (e.g. Salvador, BA).'],
err_birth:['Informe uma data válida no formato dd/mm/aaaa.','Indica una fecha válida con formato dd/mm/aaaa.','Enter a valid date as dd/mm/yyyy.'],
birth_ph:['dd/mm/aaaa','dd/mm/aaaa','dd/mm/yyyy'],
tfa_btn_on:['Ativar','Activar','Enable'],tfa_btn_off:['Desativar','Desactivar','Disable'],
tfa_setup_t:['Configurar verificação em duas etapas','Configurar verificación en dos pasos','Set up two-step verification'],
tfa_setup_d:['No app autenticador (Google Authenticator, Authy…), adicione uma conta manualmente com esta chave e digite o código de 6 dígitos gerado.','En tu app autenticadora (Google Authenticator, Authy…), añade una cuenta manualmente con esta clave e introduce el código de 6 dígitos generado.','In your authenticator app (Google Authenticator, Authy…), add an account manually with this key and enter the 6-digit code it generates.'],
tfa_key:['Chave secreta','Clave secreta','Secret key'],tfa_code:['Código de 6 dígitos','Código de 6 dígitos','6-digit code'],
tfa_bad:['Código inválido. Confira o app e a hora do aparelho.','Código inválido. Revisa la app y la hora del dispositivo.','Invalid code. Check the app and your device clock.'],
tfa_enabled:['Verificação em duas etapas ativada.','Verificación en dos pasos activada.','Two-step verification enabled.'],
tfa_disabled:['Verificação em duas etapas desativada.','Verificación en dos pasos desactivada.','Two-step verification disabled.'],
tfa_off_t:['Desativar verificação em duas etapas','Desactivar verificación en dos pasos','Disable two-step verification'],
tfa_off_d:['Digite o código atual do app autenticador para confirmar.','Introduce el código actual de la app autenticadora para confirmar.','Enter the current code from your authenticator app to confirm.'],
tfa_unsup:['Este navegador não oferece a criptografia necessária (requer HTTPS).','Este navegador no ofrece el cifrado necesario (requiere HTTPS).','This browser lacks the required cryptography (HTTPS needed).'],
prot1:['Autenticador configurado neste dispositivo','Autenticador configurado en este dispositivo','Authenticator set up on this device'],
prot0:['Verificação em duas etapas desativada','Verificación en dos pasos desactivada','Two-step verification is off'],
tfa_note:['A conferência do código acontece neste navegador. Exigir o código no login e guardar a chave com segurança dependem de um servidor de autenticação, ainda não integrado.','La verificación del código ocurre en este navegador. Exigir el código al iniciar sesión y guardar la clave de forma segura depende de un servidor de autenticación, aún no integrado.','Code checking happens in this browser. Requiring the code at sign-in and storing the key securely depend on an authentication server, not integrated yet.'],
pw_info:['Este projeto ainda não tem servidor de autenticação: a senha não pode ser alterada de fato aqui.','Este proyecto aún no tiene servidor de autenticación: la contraseña no puede cambiarse realmente aquí.','This project has no authentication server yet: the password cannot actually be changed here.'],
pw_pending:['Campos validados, mas a senha não foi alterada: falta o servidor de autenticação.','Campos validados, pero la contraseña no se cambió: falta el servidor de autenticación.',"Fields validated, but the password was not changed: the authentication server is missing."],
prot1:['Conta protegida','Cuenta protegida','Account protected'],
prot0:['Ative o 2FA para proteger ainda mais','Activa el 2FA para más protección','Enable 2FA for extra protection'],
photo_add:['Adicionar foto','Añadir foto','Add photo'],photo_change:['Alterar foto','Cambiar foto','Change photo'],
photo_rm:['Remover foto','Quitar foto','Remove photo'],
photo_ok:['Foto atualizada!','¡Foto actualizada!','Photo updated!'],photo_rm_ok:['Foto removida.','Foto quitada.','Photo removed.'],
photo_err:['Escolha uma imagem válida (até 8 MB).','Elige una imagen válida (hasta 8 MB).','Choose a valid image (up to 8 MB).'],
nonew:['Você não tem novas notificações.','No tienes notificaciones nuevas.',"You have no new notifications."],
nav_profile:['Perfil','Perfil','Profile'],
history:['Itens descartados','Artículos reciclados','Items recycled'],
flt_all:['Todos','Todos','All'],cat_appl:['Eletrodoméstico','Electrodoméstico','Appliance'],cat_elec:['Eletrônico','Electrónico','Electronics'],cat_batt:['Bateria','Batería','Battery'],
item_one:['item','artículo','item'],
it_blender:['Liquidificador','Licuadora','Blender'],it_radio:['Rádio','Radio','Radio'],it_phone:['Celular','Teléfono móvil','Phone'],
it_toaster:['Torradeira','Tostadora','Toaster'],it_headset:['Fone de ouvido','Auriculares','Headphones'],it_keyboard:['Teclado','Teclado','Keyboard'],
it_battery:['Bateria','Batería','Battery'],it_laptop:['Notebook','Portátil','Laptop'],
unread_0:['Tudo em dia','Todo al día','All caught up'],unread_1:['1 não lida','1 sin leer','1 unread'],
unread_n:['{n} não lidas','{n} sin leer','{n} unread'],
nt_photo_t:['Foto de perfil atualizada','Foto de perfil actualizada','Profile photo updated'],
nt_photo_m:['Sua nova foto já aparece no seu perfil.','Tu nueva foto ya aparece en tu perfil.',"Your new photo now shows on your profile."],
history:['Histórico da conta','Historial de la cuenta','Account history'],
ev_photo_rm:['Foto de perfil removida','Foto de perfil quitada','Profile photo removed'],
ev_lang:['Idioma alterado','Idioma cambiado','Language changed'],
ev_theme:['Tema alterado','Tema cambiado','Theme changed'],
act_point_selected:['Ponto de coleta selecionado','Punto de recolección seleccionado','Collection point selected'],
act_pickup_scheduled:['Descarte agendado','Reciclaje programado','Recycling scheduled'],
act_recycling_done:['Descarte realizado','Reciclaje realizado','Recycling completed'],
act_reward_redeemed:['Recompensa resgatada','Recompensa canjeada','Reward redeemed'],
act_points_earned:['Pontos ganhos','Puntos ganados','Points earned'],
act_challenge_done:['Desafio concluído','Desafío completado','Challenge completed'],
act_support_opened:['Chamado de suporte aberto','Ticket de soporte abierto','Support ticket opened'],
act_pickup_cancelled:['Agendamento cancelado','Programación cancelada','Scheduling cancelled'],
act_level_up:['Novo nível alcançado','Nuevo nivel alcanzado','New level reached'],
act_login:['Acesso à conta','Acceso a la cuenta','Signed in'],
sched_for:['para','para','for'],
hist_empty:['Nenhuma atividade registrada ainda. As ações que você fizer no site aparecerão aqui.','Aún no hay actividad registrada. Las acciones que hagas en el sitio aparecerán aquí.','No activity recorded yet. Actions you take on the site will show up here.'],
hist_note:['Somente atividades realizadas por você no site.','Solo actividades que realizaste en el sitio.',"Only activities you carried out on the site."],
dm_level:['Nível 4','Nivel 4','Level 4'],
dm_ticket:['Dúvida sobre coleta','Duda sobre recolección','Question about pickup'],
dm_challenge:['Semana verde','Semana verde','Green week'],
dm_stickers:['Pacote de adesivos','Paquete de pegatinas','Sticker pack'],
lv_eyebrow:['Níveis','Niveles','Levels'],
lv_title:['Sua jornada no EcoClick','Tu recorrido en EcoClick','Your journey on EcoClick'],
lv_unlocked:['Nível desbloqueado','Nivel desbloqueado','Level unlocked'],
lv_activities:['Ver atividades','Ver actividades','View activities'],
lv_rewards:['Recompensas','Recompensas','Rewards'],
lv_acts:['Atividades para progredir','Actividades para avanzar','Activities to progress'],
lv_open_note:['Você já desbloqueou este nível. Veja as atividades e as recompensas dele.','Ya desbloqueaste este nivel. Mira sus actividades y recompensas.','You have already unlocked this level. Here are its activities and rewards.'],
lv_locked_note:['Estas atividades levam você até este nível.','Estas actividades te llevan hasta este nivel.','These activities take you to this level.'],
rw_title:['Título exclusivo','Título exclusivo','Exclusive title'],
close:['Fechar','Cerrar','Close'],prev:['Anterior','Anterior','Previous'],next:['Próximo','Siguiente','Next'],
mo_title:['Mês a mês','Mes a mes','Month by month']
};

/* ---------- estado (persistido por visitante, com try/catch) ---------- */
const KEY='ecoclick_state_v2';
const prefersDark=matchMedia('(prefers-color-scheme: dark)').matches;
let S={lang:'pt',theme:prefersDark?'dark':'light',avatar:'',
  p:{name:'Marina Alves Ribeiro',email:'marina.alves@email.com',phone:'(71) 99123-4567',city:'Salvador, BA',birth:'08/04/1993'},
  pref:{tfa:false,n1:true,n2:true,n3:false,n4:true,p1:false,p2:false,p3:true}};
function readStore(){
  try{const v=localStorage.getItem(KEY); if(v) return JSON.parse(v);}catch(e){}
  try{if(window.name.indexOf(KEY+'=')===0) return JSON.parse(window.name.slice(KEY.length+1));}catch(e){}
  return null;
}
{const r=readStore(); if(r) S={...S,...r,p:{...S.p,...r.p},pref:{...S.pref,...r.pref}};}
if(!S.tfaChosen) S.pref.tfa=false;   // só vale 2FA ligado se o próprio usuário escolheu
try{
  const th=localStorage.getItem('ecoclick_theme');
  if(th==='dark'||th==='light') S.theme=th; else if(th==='system') S.theme=prefersDark?'dark':'light';
  const lg=((JSON.parse(localStorage.getItem('ecoclick_settings')||'{}').preferences)||{}).language;
  if(lg) S.lang=lg==='en'?'en':(lg==='es'?'es':'pt');
  const cu=JSON.parse(localStorage.getItem('ecoclick_current_user')||'null');
  if(cu && S.p.name==='Marina Alves Ribeiro'){ S.p.name=cu.name||S.p.name; S.p.email=cu.email||''; S.p.phone=''; S.p.city=''; S.p.birth=''; }
}catch(e){}
const save=()=>{const j=JSON.stringify(S);try{localStorage.setItem(KEY,j)}catch(e){}
  try{localStorage.setItem('ecoclick_theme',S.theme); const raw=localStorage.getItem('ecoclick_settings'); if(raw){const st=JSON.parse(raw); st.preferences=st.preferences||{}; st.preferences.language=LOC[S.lang]; localStorage.setItem('ecoclick_settings',JSON.stringify(st));}}catch(e){} try{window.name=KEY+'='+j}catch(e){}};
const fmtD=iso=>new Date(iso+'T12:00:00').toLocaleDateString(LOC[S.lang]);
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const L=()=>LANGS.indexOf(S.lang);
const t=k=>D[k][L()];
const first=()=>S.p.name.trim().split(' ')[0];
/* "Membro desde": data em que a conta entrou (registrada no login/cadastro, por e-mail) */
function sinceISO(){
  let em=''; try{ em=String((JSON.parse(localStorage.getItem('ecoclick_current_user')||'null')||{}).email||'').toLowerCase(); }catch(e){}
  try{ const m=JSON.parse(localStorage.getItem('ecoclick_since')||'{}')||{}; if(em&&m[em]) return m[em]; }catch(e){}
  S.sinceMap=S.sinceMap||{}; const k=em||'local';
  if(!S.sinceMap[k]){ S.sinceMap[k]=new Date().toISOString(); save(); }
  return S.sinceMap[k];
}
function sinceStr(){ const d=new Date(sinceISO()); return isNaN(d.getTime())?'':d.toLocaleDateString(LOC[S.lang]); }
const months=()=>D.mon[L()];

/* ---------- aplicar idioma / tema ---------- */
function applyLang(){
  document.documentElement.lang=LOC[S.lang];
  $$('[data-i]').forEach(e=>e.textContent=t(e.dataset.i));
  $$('[data-ia]').forEach(e=>{e.setAttribute('aria-label',t(e.dataset.ia));e.title=t(e.dataset.ia);});
  $('#hello').textContent=t('hello').replace('{n}',first());
  $('#streakTop').textContent='0 '+t('days');
  $('#streakBig').innerHTML='0 <small>'+t('days')+'</small>';
  $('#trees').textContent=treesTxt(); renderGoal(); $('[data-i=growth]').textContent=growthTxt();
  $('[data-i=since]').textContent=t('since').replace('{d}',sinceStr());
  $('#meName').textContent=S.p.name.split(' ').slice(0,2).join(' ');
  $('#meLvl').textContent=t('level')+' '+RL.level;
  $('#pName').textContent=S.p.name;
  $$('#langSeg button').forEach(b=>b.classList.toggle('on',b.dataset.l===S.lang));
  renderFields(); renderProt(); renderChart(true); renderDetail(); renderPhotoBtns(); renderHist(); renderNotifs(); renderLevels(); renderMonths();
}
function applyTheme(){
  document.documentElement.dataset.theme=S.theme;
  $$('#themeSeg button').forEach(b=>b.classList.toggle('on',b.dataset.t===S.theme));
}
function setAvatar(){
  const ini=first()[0]||'?';
  ['#avTop','#avBig'].forEach(s=>{const e=$(s);e.style.backgroundImage=S.avatar?`url(${S.avatar})`:'';e.textContent=S.avatar?'':ini;});
  renderPhotoBtns();
}

/* ---------- navegação ---------- */
function go(v,scroll){
  $$('.view').forEach(e=>e.classList.toggle('on',e.id==='v-'+v));
  $$('.side a[data-go]').forEach(a=>a.classList.toggle('on',a.dataset.go===v));
  $('#meBtn').classList.toggle('on',v==='profile');
  closeSide(); window.scrollTo({top:0,behavior:'smooth'});
  if(v==='progress'){ animateBars(); renderChart(true); requestAnimationFrame(()=>{Object.values(CAR).forEach(c=>c.upd&&c.upd());posMonths();}); }
  try{ if(history.replaceState) history.replaceState(null,'','#'+v); }catch(e){}
}
const openSide=()=>{$('#side').classList.add('open');$('#backdrop').classList.add('open')};
const closeSide=()=>{$('#side').classList.remove('open');$('#backdrop').classList.remove('open')};
document.addEventListener('click',e=>{
  const g=e.target.closest('[data-go]'); if(g){e.preventDefault();go(g.dataset.go);}
  const s=e.target.closest('[data-site]'); if(s){e.preventDefault();closeSide();toast(t('site'));}
});
$('#burger').onclick=openSide; $('#backdrop').onclick=closeSide;
$('#toChart').onclick=()=>$('#chartSec').scrollIntoView({behavior:'smooth',block:'center'});

function animateBars(){ $$('[data-w]').forEach(e=>{e.style.width='0';requestAnimationFrame(()=>requestAnimationFrame(()=>e.style.width=e.dataset.w))}); }

/* ---------- gráfico (dados originais preservados) ---------- */
/* ---------- dados reais: lidos do mesmo estado salvo pela aba Minha jornada (histórico de itens registrados) ---------- */
const GOAL_ITEMS=10, ITEMS_PER_TREE=5;   // meta: itens a cada 2 semanas · 1 árvore (estimada) a cada 5 itens registrados
function readJourney(){
  const r={YEAR:Array(12).fill(0),last14:0,total:0}, now=Date.now(), y=new Date(now).getFullYear(), from=now-14*864e5;
  try{
    let cu=null; try{ cu=JSON.parse(localStorage.getItem('ecoclick_current_user')||'null'); }catch(e){}
    const st=JSON.parse(localStorage.getItem('ecoclick:gamificacao:v5:'+String((cu&&cu.email)||'local'))||'null');
    (st&&Array.isArray(st.history)?st.history:[]).forEach(h=>{
      const q=Math.max(1,Math.floor(Number(h&&h.qty))||1); let ts=Number(h&&h.t);
      if(!(ts>0)){ const m=/^(\d{2})\/(\d{2})\/(\d{4})$/.exec(String((h&&h.date)||'')); ts=m?new Date(+m[3],+m[2]-1,+m[1],12).getTime():NaN; }
      if(!(ts>0)) return;
      r.total+=q; if(ts>=from) r.last14+=q;
      const d=new Date(ts); if(d.getFullYear()===y) r.YEAR[d.getMonth()]+=q;
    });
  }catch(e){}
  return r;
}
const REAL=readJourney(), YEAR=REAL.YEAR, CUR_M=new Date().getMonth();
const OFF=Math.min(7,Math.max(0,CUR_M-4));          // o gráfico mostra 5 meses, terminando no mês atual
const DATA=YEAR.slice(OFF,OFF+5);
function niceTop(v){ const st=[1,2,5,10,20,25,50,100,200,250,500,1000,2000,5000]; return 4*(st.find(x=>x*4>=v)||Math.ceil(v/4)); }
const CMAX=niceTop(Math.max(0,...DATA));            // escala do eixo vertical acompanha os dados
function deltaOf(i){                                 // variação do mês i em relação ao anterior
  if(i===0) return {c:'up',x:t('first')};
  const v=YEAR[i], p=YEAR[i-1];
  if(p>0){ const d=Math.round((v-p)/p*100); return {c:d>=0?'up':'dn',x:`${d>=0?'▲ +':'▼ '}${d}% ${t('vsprev')}`}; }
  if(v>0) return {c:'up',x:YEAR.slice(0,i).some(n=>n>0)?`▲ +${v} ${t('items_unit')} ${t('vsprev')}`:t('first')};
  return {c:'up',x:`▲ +0% ${t('vsprev')}`};
}
function treesTxt(){ const n=Math.floor(REAL.total/ITEMS_PER_TREE); return t(n===1?'tree_1':'trees_n').replace('{n}',n); }
function renderGoal(){
  const n=REAL.last14, p=Math.min(100,Math.round(n/GOAL_ITEMS*100)), b=$('#goalBar');
  $('#goalN').textContent=n; b.dataset.w=p+'%'; b.style.width=p+'%';
  $('[data-i=goal_left]').textContent=(n===0?t('goal_start'):p>=100?t('goal_done'):t('goal_left').replace('{n}',100-p)).replace('{g}',GOAL_ITEMS);
}
function growthTxt(){
  const tot=YEAR.reduce((a,b)=>a+b,0), c=YEAR[CUR_M], p=CUR_M?YEAR[CUR_M-1]:0;
  if(!tot) return t('growth');
  return (p>0&&c>p)?t('growth_up').replace('{p}',Math.round((c-p)/p*100)):t('growth_all').replace('{n}',tot);
}
let mode='bars', sel=CUR_M;
function renderChart(replay){
  const W=600,H=280,pl=34,pr=10,pt=18,pb=34,max=CMAX,iw=W-pl-pr,ih=H-pt-pb,step=iw/5;
  const X=i=>pl+step*(i+.5), Y=v=>pt+ih*(1-v/max), M=DATA.map((v,i)=>monthName(OFF+i));
  let s=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${t('chart_title')}"><defs>
   <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--g1)"/><stop offset="1" stop-color="var(--g2)"/></linearGradient>
   <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--blue2)" stop-opacity=".28"/><stop offset="1" stop-color="var(--blue2)" stop-opacity="0"/></linearGradient></defs>`;
  [0,1,2,3,4].map(k=>k*CMAX/4).forEach(g=>s+=`<line class="gl" x1="${pl}" x2="${W-pr}" y1="${Y(g)}" y2="${Y(g)}"/><text class="ax" x="${pl-8}" y="${Y(g)+4}" text-anchor="end">${g}</text>`);
  const pts=DATA.map((v,i)=>`${X(i)},${Y(v)}`);
  if(mode==='bars'){
    DATA.forEach((v,i)=>s+=`<rect class="cbar" data-idx="${i}" x="${X(i)-24}" y="${Y(v)}" width="48" height="${ih*v/max}" rx="12" style="animation-delay:${replay?i*90:0}ms"/>`);
    s+=`<path class="tr" id="lp" d="M${pts.join(' L')}"/>`;
    DATA.forEach((v,i)=>s+=`<circle class="pt" data-idx="${i}" cx="${X(i)}" cy="${Y(v)}" r="4.5"/>`);
  }else{
    s+=`<path class="ar" d="M${X(0)},${Y(0)} L${pts.join(' L')} L${X(4)},${Y(0)}Z"/><path class="lp" id="lp" d="M${pts.join(' L')}"/>`;
    DATA.forEach((v,i)=>s+=`<circle class="pt" data-idx="${i}" cx="${X(i)}" cy="${Y(v)}" r="5.5"/>`);
  }
  DATA.forEach((v,i)=>s+=`<text class="ax" x="${X(i)}" y="${H-10}" text-anchor="middle">${M[i].slice(0,3)}</text>`);
  DATA.forEach((v,i)=>s+=`<rect class="hit" data-idx="${i}" x="${X(i)-step/2}" y="0" width="${step}" height="${H}"/>`);
  $('#chart').innerHTML=s+'</svg>';
  const p=$('#lp');
  if(p&&replay){const len=p.getTotalLength();p.style.strokeDasharray=mode==='line'?len:'2 7';
    if(mode==='line'){p.style.strokeDashoffset=len;p.getBoundingClientRect();p.style.transition='stroke-dashoffset 1.3s ease .2s';p.style.strokeDashoffset=0;}}
  paintSel();
}
function paintSel(h){ $$('#chart .cbar,#chart .pt').forEach(e=>{const i=+e.dataset.idx;e.classList.toggle('sel',i+OFF===sel);e.classList.toggle('hov',i===h);}); $('#chart').classList.toggle('nosel',sel<OFF||sel>=OFF+DATA.length); }
function renderDetail(){
  const v=YEAR[sel], tot=YEAR.reduce((a,b)=>a+b,0);
  $('#dMonth').textContent=monthName(sel); $('#dVal').textContent=v;
  $('#dDelta').textContent=deltaOf(sel).x;
  const sh=tot?Math.round(v/tot*100):0; $('#dShare').textContent=sh+'%'; $('#dBar').style.width=sh+'%';
}
const tip=$('#tip');
$('#chart').addEventListener('mousemove',e=>{
  const h=e.target.closest('.hit'); if(!h){tip.classList.remove('show');paintSel();return;}
  const i=+h.dataset.idx, W=$('#chart svg').getBoundingClientRect(), r=h.getBoundingClientRect(), c=$('.cwrap').getBoundingClientRect();
  const vb=600/W.width, yv=(18+(280-52)*(1-DATA[i]/CMAX))/vb;
  tip.textContent=`${monthName(OFF+i)} · ${DATA[i]} ${t('items_unit')}`;
  tip.style.left=(r.left+r.width/2-c.left)+'px'; tip.style.top=(yv-6)+'px'; tip.classList.add('show'); paintSel(i);
});
$('#chart').addEventListener('mouseleave',()=>{tip.classList.remove('show');paintSel();});
$('#chart').addEventListener('click',e=>{const h=e.target.closest('.hit'); if(!h)return; sel=OFF+(+h.dataset.idx); paintSel(sel); renderDetail(); markMonths(); revealMonth();});
$('#seg').addEventListener('click',e=>{const b=e.target.closest('button'); if(!b)return; mode=b.dataset.m;
  $$('#seg button').forEach(x=>x.classList.toggle('on',x===b)); renderChart(true);});

/* ---------- perfil: campos, modal, senha, foto ---------- */
const FIELDS=[['name','f_name'],['email','f_email'],['phone','f_phone'],['city','f_city'],['birth','f_birth']];
const VAL={
 name:v=>v.trim().length>=5&&v.trim().split(/\s+/).length>=2,
 email:v=>/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()),
 phone:v=>{const d=v.replace(/\D/g,'');return d.length>=10&&d.length<=13},
 city:v=>v.trim().length>=3,
 birth:v=>{const m=v.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);if(!m)return false;const d=+m[1],mo=+m[2],y=+m[3],dt=new Date(y,mo-1,d);return dt.getFullYear()===y&&dt.getMonth()===mo-1&&dt.getDate()===d&&dt<=new Date()&&y>=1900}
};
function renderFields(){
  $('#fields').innerHTML=FIELDS.map(([k,l])=>`<div class="row2"><div><small>${t(l)}</small><div class="v">${S.p[k].replace(/</g,'&lt;')}</div></div><button class="ib" data-edit="${k}" aria-label="${t('edit_all')}"><svg class="ic"><use href="#i-pencil"/></svg></button></div>`).join('');
}
$('#fields').addEventListener('click',e=>{const b=e.target.closest('[data-edit]'); if(b) editData([b.dataset.edit]);});
$('#editAll').onclick=()=>editData(FIELDS.map(f=>f[0]));
function editData(keys){
  openModal(t('personal'),keys.map(k=>({id:k,label:t(FIELDS.find(f=>f[0]===k)[1]),value:S.p[k],type:'text',ph:k==='birth'?t('birth_ph'):''})),vals=>{
    for(const k of keys){ if(!VAL[k](vals[k])) return t('err_'+k); }
    keys.forEach(k=>S.p[k]=vals[k].trim()); save(); setAvatar(); pushNotif('nt_prof'); applyLang(); toast('✓ '+t('saved'));
  });
}
$('#pwBtn').onclick=()=>openModal(t('pw_t'),[{id:'a',label:t('pw_cur'),type:'password'},{id:'b',label:t('pw_new'),type:'password'},{id:'c',label:t('pw_conf'),type:'password'}],v=>{
  if(!v.a||v.b.length<8||v.b!==v.c) return t('pw_err'); toast(t('pw_pending'));
},'<p class="hint" style="margin:0 0 4px">'+t('pw_info')+'</p>');
let onSave=null;
function openModal(title,fields,cb,note){
  $('#mT').textContent=title; $('#mE').textContent=''; onSave=cb;
  $('#mB').innerHTML=(note||'')+fields.map(f=>`<label>${f.label}<input id="m_${f.id}" type="${f.type}" placeholder="${f.ph||''}" autocomplete="off" value="${(f.value||'').replace(/"/g,'&quot;')}"></label>`).join('');
  $('#mC').textContent=t('cancel'); $('#mS').textContent=t('save'); $('#mS').dataset.ids=fields.map(f=>f.id).join(',');
  $('#mS').style.display=cb?'':'none'; $('#mC').textContent=cb?t('cancel'):t('close');
  $('#ov').classList.add('open'); setTimeout(()=>$('#mB input')&&$('#mB input').focus(),50);
}
const closeModal=()=>$('#ov').classList.remove('open');
$('#mC').onclick=closeModal; $('#ov').addEventListener('mousedown',e=>{if(e.target.id==='ov')closeModal()});
$('#mS').onclick=async()=>{if(!onSave)return closeModal(); const v={}; $('#mS').dataset.ids.split(',').forEach(i=>v[i]=$('#m_'+i).value);
  const err=await onSave(v); if(err){$('#mE').textContent=err;return;} closeModal();};
$('#mB').addEventListener('keydown',e=>{if(e.key==='Enter')$('#mS').click();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeModal();$('#npanel').classList.remove('open');}});
$('#file').onchange=e=>{const f=e.target.files[0]; e.target.value=''; if(!f)return;
  if(!/^image\//.test(f.type)||f.size>8*1024*1024) return toast(t('photo_err'));
  const r=new FileReader();
  r.onload=()=>{const img=new Image();
    img.onerror=()=>toast(t('photo_err'));
    img.onload=()=>{const c=document.createElement('canvas'),z=240;c.width=c.height=z;const x=c.getContext('2d'),m=Math.min(img.width,img.height);
      x.drawImage(img,(img.width-m)/2,(img.height-m)/2,m,m,0,0,z,z);S.avatar=c.toDataURL('image/jpeg',.85);save();setAvatar();pushNotif('nt_photo');toast('✓ '+t('photo_ok'));};
    img.src=r.result;};
  r.readAsDataURL(f);};
$('#rmPhoto').onclick=()=>{S.avatar='';save();setAvatar();toast('✓ '+t('photo_rm_ok'));};

/* ---------- preferências, tema, idioma, histórico ---------- */
function renderProt(){ $('#prot').textContent=S.pref.tfa?t('prot1'):t('prot0'); }
function renderPhotoBtns(){ $('#photoBtn').textContent=S.avatar?t('photo_change'):t('photo_add'); $('#rmPhoto').style.display=S.avatar?'':'none'; }
/* ---------- histórico da conta: SOMENTE as 10 atividades permitidas ----------
   O site registra cada ação no instante em que ela é confirmada (ex.: depois da resposta do servidor):
     EcoClickHistory.log('reward_redeemed', {id:'rw-123', name:'Pacote de adesivos', points:80});
     window.dispatchEvent(new CustomEvent('ecoclick:activity',{detail:{type:'point_selected',name:'Ecoponto Centro'}}));
     (ecoclickActivityQueue.push({...}) também funciona, mesmo antes desta página carregar)
   Campos: id (opcional, evita repetir o mesmo evento), name, place, points, when (data agendada), ts (quando ocorreu; padrão = agora).
   Obrigatórios: point_selected→name|place · pickup_scheduled→name|place|when · recycling_done→name ·
                 points_earned→points · reward_redeemed→name · challenge_done→name.
   Tipos fora da lista, eventos incompletos e duplicados são recusados (a função devolve false). */
const ACT={   // [ícone, cor do fundo suave, cor do traço]
  point_selected:['pin','#8ab4f0','#2d5fa4'],pickup_scheduled:['cal','#9aa5e6','#4a55a8'],recycling_done:['recycle','#7fd3ae','#2f7a68'],
  points_earned:['star','#f0c75e','#a8761a'],reward_redeemed:['gift','#e9c27a','#a8761a'],challenge_done:['trophy','#f0b45a','#b0660f'],
  support_opened:['chat','#9aa5e6','#4a55a8'],pickup_cancelled:['calx','#e9a8a0','#c9473f'],level_up:['rocket','#7fd3ae','#2f7a68'],login:['key','#8ab4f0','#2d5fa4']};
const HI={
  pin:'<path d="M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  cal:'<rect x="4" y="5" width="16" height="16" rx="3"/><path d="M8 3v4M16 3v4M4 10h16M8.5 14h.01M12 14h.01M15.5 14h.01M8.5 17.5h.01M12 17.5h.01"/>',
  calx:'<rect x="4" y="5" width="16" height="16" rx="3"/><path d="M8 3v4M16 3v4M4 10h16M10 13.5l4 4M14 13.5l-4 4"/>',
  recycle:'<path d="M20 12a8 8 0 01-14 5.3M4 12a8 8 0 0114-5.3M18 3v4h-4M6 21v-4h4"/>',
  star:'<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
  gift:'<path d="M20 12v9H4v-9M3 8h18v4H3zM12 21V8M12 8H8.5a2.5 2.5 0 110-5C11 3 12 8 12 8zM12 8h3.5a2.5 2.5 0 100-5C13 3 12 8 12 8z"/>',
  trophy:'<path d="M8 4h8v5a4 4 0 01-8 0V4zM8 6H5v1a3 3 0 003 3M16 6h3v1a3 3 0 01-3 3M12 13v4M9 21h6M10 17h4"/>',
  chat:'<path d="M5 5h14a1 1 0 011 1v9a1 1 0 01-1 1H10l-5 4V6a1 1 0 011-1zM9 10.5h.01M12 10.5h.01M15 10.5h.01"/>',
  rocket:'<path d="M12 3c3 2 5 5 5 9l-2 3H9l-2-3c0-4 2-7 5-9z"/><circle cx="12" cy="9.5" r="1.6"/><path d="M7 13l-3 3v3l4-2M17 13l3 3v3l-4-2M10 18l2 3 2-3"/>',
  key:'<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M16 7l3 3M14 9l2 2"/>'};
const hiSvg=k=>`<svg viewBox="0 0 24 24" aria-hidden="true">${HI[k]}</svg>`;
const REQ={point_selected:['name','place'],pickup_scheduled:['name','place','when'],recycling_done:['name'],
  points_earned:['points'],reward_redeemed:['name'],challenge_done:['name']};
let hAll=false;
const esc=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const toTs=v=>{const n=typeof v==='number'?v:Date.parse(v);return Number.isFinite(n)?n:null;};
const sameD=(a,b)=>['name','place','points','when'].every(f=>(a&&a[f])===(b&&b[f]));
const isDup=(a,b)=>a.k===b.k&&(a.id!=null&&b.id!=null?a.id===b.id:sameD(a.d,b.d)&&Math.abs(a.ts-b.ts)<10000);
function cleanLog(list){                       // só tipos permitidos, sem repetidos
  const out=[]; [...list].filter(x=>x&&ACT[x.k]&&Number.isFinite(x.ts)).sort((a,b)=>b.ts-a.ts).forEach(x=>{if(!out.some(y=>isDup(y,x)))out.push(x);});
  return out.slice(0,200);
}
function hostLog(type,p){
  if(!ACT[type]){console.warn('EcoClickHistory: tipo não permitido:',type);return false;}
  p=p||{}; const d={}, str=v=>typeof v==='string'&&v.trim()?v.trim().slice(0,120):null;
  if(str(p.name))d.name=str(p.name); if(str(p.place))d.place=str(p.place);
  if(Number.isFinite(+p.points)&&+p.points>0)d.points=Math.round(+p.points);
  if(toTs(p.when)!==null)d.when=toTs(p.when);
  const need=REQ[type];
  if(need&&!need.some(f=>d[f]!==undefined)){console.warn('EcoClickHistory: faltam dados para',type,'→',need.join(' | '));return false;}
  const e={k:type,d,ts:toTs(p.ts)||Date.now()};
  if(p.id!==undefined&&p.id!==null&&String(p.id).trim())e.id=String(p.id).trim().slice(0,80);
  if(S.log.some(x=>isDup(x,e)))return false;   // já registrado
  S.log=cleanLog([e,...S.log]); save(); renderHist(); return true;
}
window.EcoClickHistory={log:hostLog,types:Object.keys(ACT)};
window.addEventListener('ecoclick:activity',e=>{const d=e.detail||{};hostLog(d.type,d);});
function drainQueue(){                         // eventos enviados antes desta página carregar
  const q=Array.isArray(window.ecoclickActivityQueue)?window.ecoclickActivityQueue.splice(0):[];
  window.ecoclickActivityQueue=window.ecoclickActivityQueue||[]; window.ecoclickActivityQueue.length=0;
  window.ecoclickActivityQueue.push=d=>{if(d)hostLog(d.type,d);return 1;};
  q.forEach(d=>d&&hostLog(d.type,d));
}
const actLabel=k=>t('act_'+k);
function actDetail(x){
  const d=x.d&&typeof x.d==='object'?x.d:{}, a=[];
  if(d.name)a.push(esc(d.name)); if(d.place)a.push(esc(d.place));
  if(d.when)a.push(t('sched_for')+' '+fmtDT(d.when));
  if(x.k==='reward_redeemed'&&d.points)a.push(d.points.toLocaleString(LOC[S.lang])+' pts');
  return a.join(' · ');
}
/* REGISTROS DE DEMONSTRAÇÃO (apenas para mostrar o design; datas ilustrativas; nunca são gravados no histórico real).
   Aparecem só enquanto não existir nenhuma atividade real. Ao integrar ao site, use SHOW_DEMO=false. */
const SHOW_DEMO=false;
const DEMO=[];
function renderHist(){
  const real=[...S.log].sort((a,b)=>b.ts-a.ts), demo=SHOW_DEMO&&!real.length;
  const l=demo?[...DEMO].sort((a,b)=>b.ts-a.ts):real, v=(demo||hAll)?l:l.slice(0,5);
  $('#hList').classList.toggle('empty',!l.length);
  $('#hList').innerHTML=l.length?v.map((x,n)=>{
    const [ic,c,ink]=ACT[x.k], y=x.demo&&x.d.nk?{...x,d:{...x.d,name:t(x.d.nk)}}:x, det=actDetail(y), pts=x.k==='points_earned'&&x.d&&x.d.points;
    return `<div class="tli"><div class="node" style="--c:${c};--k:${ink};animation-delay:${n*60}ms">${hiSvg(ic)}</div><div class="tcard" style="--c:${c};animation-delay:${n*60}ms"><h4>${actLabel(x.k)}</h4><div class="meta">${det?`<span>${det}</span>`:''}<span>${fmtDT(x.ts)}</span></div>${pts?`<div class="coin"><i></i>+${pts.toLocaleString(LOC[S.lang])} pts</div>`:''}</div></div>`;}).join('')
    :`<div class="hint">${t('hist_empty')}</div>`;
  $('#moreBtn').style.display=(!demo&&l.length>5)?'':'none'; $('#moreBtn').textContent=hAll?t('hist_less'):t('hist_all');
}

/* ---------- carrossel (níveis e meses): passagem suave, avanço automático com o mouse por cima ---------- */
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches, CAR={};
function carInit(id){
  const car=$('#'+id+'Car'), track=$('#'+id+'Track'), st=CAR[id]||(CAR[id]={dir:1,timer:null,bound:false});
  const cards=()=>[...track.children];
  const step=()=>{const c=cards();return c.length>1?c[1].offsetLeft-c[0].offsetLeft:car.clientWidth;};
  const atEnd=()=>car.scrollWidth>car.clientWidth+3&&car.scrollLeft>=car.scrollWidth-car.clientWidth-3, atStart=()=>car.scrollLeft<=3;
  const idx=()=>Math.max(0,Math.min(cards().length-1,Math.round(car.scrollLeft/step())));
  const go=i=>{const c=cards(); i=Math.max(0,Math.min(c.length-1,i)); car.scrollTo({left:c[i].offsetLeft-c[0].offsetLeft,behavior:RM?'auto':'smooth'});};
  const upd=()=>{const c=cards(); if(!c.length)return; const i=atEnd()?c.length-1:idx();
    c.forEach((e,k)=>e.classList.toggle('act',k===i)); $$('#'+id+'Dots button').forEach((d,k)=>d.classList.toggle('on',k===i));};
  st.upd=upd; st.go=go; st.idx=idx; st.atEnd=atEnd; st.atStart=atStart;
  $('#'+id+'Dots').innerHTML=cards().map((_,k)=>`<button data-k="${k}" aria-label="${k+1}"></button>`).join('');
  if(!st.bound){
    st.bound=true;
    const stop=()=>{clearInterval(st.timer);st.timer=null;};
    const start=()=>{ if(RM||st.timer)return; st.timer=setInterval(()=>{
      if($('#ov').classList.contains('open')||!car.offsetParent)return;
      if(st.atEnd())st.dir=-1; else if(st.atStart())st.dir=1;
      st.go(st.idx()+st.dir);},2600); };
    car.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')start();});
    car.addEventListener('pointerleave',stop);
    car.addEventListener('scroll',()=>{cancelAnimationFrame(st.raf);st.raf=requestAnimationFrame(st.upd);},{passive:true});
    $('#'+id+'Prev').onclick=()=>{st.go(st.idx()-1);};
    $('#'+id+'Next').onclick=()=>{if(!st.atEnd())st.go(st.idx()+1);};
    $('#'+id+'Dots').addEventListener('click',e=>{const b=e.target.closest('[data-k]');if(b)st.go(+b.dataset.k);});
    addEventListener('resize',()=>st.upd());
  }
  upd();
}

/* ---------- níveis ---------- */
const P3=x=>x.split('|')[L()];
const LV_MAX=12;
/* nível e XP reais: lidos do mesmo estado salvo pela aba Minha jornada (1.260 XP por nível) */
function realLevel(){
  const per=1260;
  try{
    let cu=null; try{ cu=JSON.parse(localStorage.getItem('ecoclick_current_user')||'null'); }catch(e){}
    const st=JSON.parse(localStorage.getItem('ecoclick:gamificacao:v5:'+String((cu&&cu.email)||'local'))||'null'), u=st&&st.user;
    if(u){
      let lvl, xp, need=per;
      if(u.totalXp!==undefined&&u.totalXp!==null&&isFinite(Number(u.totalXp))){ const tx=Math.max(0,Number(u.totalXp)); lvl=Math.floor(tx/per)+1; xp=tx%per; }
      else { lvl=Math.max(1,Math.floor(Number(u.level))||1); xp=Math.max(0,Number(u.xp)||0); need=Number(u.xpToNext)>0?Number(u.xpToNext):per; }
      return { level:lvl, pct:Math.min(99,Math.round(xp/need*100)), left:Math.max(1,need-xp) };
    }
  }catch(e){}
  return { level:1, pct:0, left:per };
}
const RL=realLevel(), CUR=Math.min(RL.level,LV_MAX), PROG=Array.from({length:LV_MAX},(_,i)=>RL.level>i+1?100:(RL.level===i+1?RL.pct:0));
const xpFill=s=>s.replace('{n}',RL.left.toLocaleString(LOC[S.lang])).replace('{l}',RL.level+1);
const LV=[
 {n:'Aprendiz da Reciclagem|Aprendiz del Reciclaje|Recycling Apprentice',tier:'b',ic:'cap',
  d:'Complete o cadastro, conheça o que pode ser descartado, explore o mapa de coleta e registre seu primeiro item.|Completa el registro, conoce qué se puede reciclar, explora el mapa de recolección y registra tu primer artículo.|Finish your sign-up, learn what can be recycled, explore the collection map and log your first item.',
  a:['Completar o cadastro e personalizar o perfil.|Completar el registro y personalizar el perfil.|Complete your sign-up and personalize your profile.',
     'Conhecer os tipos de lixo eletrônico aceitos.|Conocer los tipos de residuos electrónicos aceptados.|Learn which types of e-waste are accepted.',
     'Explorar o mapa de pontos de coleta.|Explorar el mapa de puntos de recolección.|Explore the collection points map.',
     'Acessar o guia básico de descarte correto.|Acceder a la guía básica de reciclaje correcto.|Open the basic guide to proper disposal.',
     'Registrar o primeiro item eletrônico.|Registrar el primer artículo electrónico.|Log your first electronic item.'],
  r:[['🏅','Primeiro emblema do EcoClick|Primera insignia de EcoClick|First EcoClick badge'],
     ['🛍️','Acesso à loja de recompensas com pontos|Acceso a la tienda de recompensas con puntos|Access to the points rewards store']]},
 {n:'Explorador Verde|Explorador Verde|Green Explorer',tier:'b',ic:'compass',
  d:'Registre novos itens, consulte pontos de coleta, conclua missões introdutórias e explore a coleção educativa.|Registra nuevos artículos, consulta puntos de recolección, completa misiones introductorias y explora la colección educativa.|Log new items, check collection points, complete introductory missions and explore the educational collection.',
  a:['Registrar novos itens eletrônicos.|Registrar nuevos artículos electrónicos.|Log new electronic items.',
     'Consultar diferentes pontos de coleta.|Consultar distintos puntos de recolección.|Check different collection points.',
     'Concluir missões introdutórias.|Completar misiones introductorias.|Complete introductory missions.',
     'Acessar a coleção educativa sobre lixo eletrônico.|Acceder a la colección educativa sobre residuos electrónicos.|Open the educational collection on e-waste.',
     'Aprender sobre os materiais presentes nos eletrônicos.|Aprender sobre los materiales presentes en los electrónicos.|Learn about the materials inside electronics.'],
  r:[['🖼️','Moldura de perfil com folhas|Marco de perfil con hojas|Leaf profile frame'],
     ['📊','Primeiro cartão de impacto ambiental com os itens registrados|Primera tarjeta de impacto ambiental con los artículos registrados|First environmental impact card with your logged items']]},
 {n:'Reciclador Dedicado|Reciclador Dedicado|Dedicated Recycler',tier:'s',ic:'bin',
  d:'Registre descartes com frequência, conclua missões de reciclagem, explore a economia circular e acompanhe seu histórico.|Registra reciclajes con frecuencia, completa misiones de reciclaje, explora la economía circular y sigue tu historial.|Log recycling regularly, complete recycling missions, explore the circular economy and follow your history.',
  a:['Registrar descartes com frequência.|Registrar reciclajes con frecuencia.|Log your recycling regularly.',
     'Concluir missões de reciclagem.|Completar misiones de reciclaje.|Complete recycling missions.',
     'Consultar o guia de descarte correto de eletrônicos.|Consultar la guía de descarte correcto de electrónicos.|Read the guide to proper electronics disposal.',
     'Explorar a coleção sobre economia circular.|Explorar la colección sobre economía circular.|Explore the circular economy collection.',
     'Acompanhar o próprio histórico de participação.|Seguir tu propio historial de participación.|Follow your own participation history.'],
  r:[['🏞️','Fundos de perfil com paisagens naturais|Fondos de perfil con paisajes naturales|Profile backgrounds with natural landscapes'],
     ['♻️','Emblemas exclusivos de reciclagem|Insignias exclusivas de reciclaje|Exclusive recycling badges'],
     ['📊','Cartão de impacto com missões concluídas e categorias de eletrônicos registradas|Tarjeta de impacto con misiones completadas y categorías de electrónicos registradas|Impact card with completed missions and logged electronics categories']]},
 {n:'Protetor da Natureza|Protector de la Naturaleza|Nature Protector',tier:'s',ic:'tree',
  d:'Conclua missões educativas, aprenda sobre oceanos, biodiversidade e consumo consciente e mantenha o histórico em dia.|Completa misiones educativas, aprende sobre océanos, biodiversidad y consumo consciente y mantén el historial al día.|Complete learning missions, discover oceans, biodiversity and mindful consumption, and keep your history up to date.',
  a:['Concluir missões educativas de sustentabilidade.|Completar misiones educativas de sostenibilidad.|Complete sustainability learning missions.',
     'Acessar conteúdos sobre preservação dos oceanos.|Acceder a contenidos sobre conservación de los océanos.|Read content about ocean conservation.',
     'Explorar a coleção sobre biodiversidade.|Explorar la colección sobre biodiversidad.|Explore the biodiversity collection.',
     'Consultar materiais sobre consumo consciente.|Consultar materiales sobre consumo consciente.|Check materials on mindful consumption.',
     'Manter o histórico de descartes atualizado.|Mantener actualizado el historial de reciclaje.|Keep your recycling history up to date.'],
  r:[['🖼️','Novas molduras e fundos temáticos|Nuevos marcos y fondos temáticos|New themed frames and backgrounds'],
     ['✨','Efeitos visuais discretos para o perfil|Efectos visuales discretos para el perfil|Subtle visual effects for your profile'],
     ['📊','Cartão de impacto com a evolução da participação ao longo do tempo|Tarjeta de impacto con la evolución de tu participación en el tiempo|Impact card showing your participation over time']]},
 {n:'Guardião Eletrônico|Guardián Electrónico|Electronic Guardian',tier:'g',ic:'phone',
  d:'Encare missões mais complexas, estude os ODS, aprofunde o descarte responsável e continue registrando.|Afronta misiones más complejas, estudia los ODS, profundiza en el descarte responsable y sigue registrando.|Take on more complex missions, study the SDGs, deepen responsible disposal and keep logging.',
  a:['Concluir missões de maior complexidade.|Completar misiones de mayor complejidad.|Complete more complex missions.',
     'Explorar guias sobre pontos de coleta e reciclagem.|Explorar guías sobre puntos de recolección y reciclaje.|Explore guides on collection points and recycling.',
     'Acessar materiais sobre os Objetivos de Desenvolvimento Sustentável (ODS).|Acceder a materiales sobre los Objetivos de Desarrollo Sostenible (ODS).|Read materials on the Sustainable Development Goals (SDGs).',
     'Aprofundar os conhecimentos sobre descarte responsável.|Profundizar tus conocimientos sobre descarte responsable.|Deepen your knowledge of responsible disposal.',
     'Continuar registrando descartes e acompanhando os resultados.|Seguir registrando reciclajes y revisando los resultados.|Keep logging your recycling and tracking the results.'],
  r:[['🏅','Emblemas especiais de sustentabilidade|Insignias especiales de sostenibilidad|Special sustainability badges'],
     ['🎗️','Faixa exclusiva para o perfil|Banda exclusiva para el perfil|Exclusive profile ribbon'],
     ['🏞️','Fundos temáticos avançados|Fondos temáticos avanzados|Advanced themed backgrounds'],
     ['📊','Cartão de impacto com estatísticas ampliadas|Tarjeta de impacto con estadísticas ampliadas|Impact card with expanded statistics']]},
 {n:'Especialista em Sustentabilidade|Especialista en Sostenibilidad|Sustainability Specialist',tier:'g',ic:'bulb',
  d:'Complete missões avançadas, explore todas as coleções e mantenha uma participação consistente e compartilhável.|Completa misiones avanzadas, explora todas las colecciones y mantén una participación constante y compartible.|Complete advanced missions, explore every collection and keep a consistent, shareable participation.',
  a:['Completar missões avançadas disponíveis na plataforma.|Completar las misiones avanzadas disponibles en la plataforma.|Complete the advanced missions available on the platform.',
     'Explorar todas as coleções educativas.|Explorar todas las colecciones educativas.|Explore all educational collections.',
     'Consultar conteúdos sobre economia circular, biodiversidade e ODS.|Consultar contenidos sobre economía circular, biodiversidad y ODS.|Read content on circular economy, biodiversity and SDGs.',
     'Manter uma participação consistente no registro de descartes.|Mantener una participación constante en el registro de reciclajes.|Stay consistent in logging your recycling.',
     'Acompanhar e compartilhar o histórico de impacto ambiental.|Seguir y compartir el historial de impacto ambiental.|Track and share your environmental impact history.'],
  r:[['👑','Moldura premium e fundo exclusivo|Marco premium y fondo exclusivo|Premium frame and exclusive background'],
     ['🏆','Emblema especial de especialista|Insignia especial de especialista|Special specialist badge'],
     ['✨','Efeitos visuais exclusivos|Efectos visuales exclusivos|Exclusive visual effects'],
     ['🎗️','Faixa de destaque para o perfil|Banda destacada para el perfil|Highlight ribbon for your profile'],
     ['🗺️','Cartão especial de trajetória no EcoClick|Tarjeta especial de trayectoria en EcoClick|Special EcoClick journey card']]},
 {n:'Defensor do Planeta|Defensor del Planeta|Planet Defender',tier:'p',ic:'shield',
  d:'Assuma missões desafiadoras, estude as mudanças climáticas e incentive outras pessoas a descartar do jeito certo.|Asume misiones desafiantes, estudia el cambio climático e incentiva a otras personas a reciclar de la forma correcta.|Take on challenging missions, study climate change and encourage other people to dispose of things the right way.',
  a:['Concluir missões desafiadoras com regularidade.|Completar misiones desafiantes con regularidad.|Complete challenging missions regularly.',
     'Acessar conteúdos sobre mudanças climáticas e eletrônicos.|Acceder a contenidos sobre cambio climático y electrónicos.|Read content about climate change and electronics.',
     'Manter uma frequência constante de descartes registrados.|Mantener una frecuencia constante de reciclajes registrados.|Keep a steady pace of logged disposals.',
     'Convidar amigos e familiares para o EcoClick.|Invitar a amigos y familiares a EcoClick.|Invite friends and family to EcoClick.',
     'Acompanhar o impacto ambiental dos seus descartes.|Seguir el impacto ambiental de tus reciclajes.|Track the environmental impact of your disposals.'],
  r:[['🏅','Emblemas especiais de defesa do planeta|Insignias especiales de defensa del planeta|Special planet-defense badges'],
     ['🖼️','Molduras de perfil exclusivas|Marcos de perfil exclusivos|Exclusive profile frames'],
     ['📊','Cartão de impacto com o histórico de defesa do planeta|Tarjeta de impacto con el historial de defensa del planeta|Impact card with your planet-defense history']]},
 {n:'Agente da Transformação|Agente de la Transformación|Change Agent',tier:'p',ic:'butterfly',
  d:'Transforme hábitos em resultados: conclua missões avançadas, compartilhe o que aprendeu e mantenha descartes constantes.|Transforma hábitos en resultados: completa misiones avanzadas, comparte lo que aprendiste y mantén reciclajes constantes.|Turn habits into results: complete advanced missions, share what you have learned and keep your disposals steady.',
  a:['Concluir missões avançadas de sustentabilidade.|Completar misiones avanzadas de sostenibilidad.|Complete advanced sustainability missions.',
     'Compartilhar conteúdos educativos com outras pessoas.|Compartir contenidos educativos con otras personas.|Share educational content with other people.',
     'Manter descartes constantes ao longo dos meses.|Mantener reciclajes constantes a lo largo de los meses.|Keep your disposals steady over the months.',
     'Explorar a comunidade e trocar experiências com outras pessoas.|Explorar la comunidad e intercambiar experiencias con otras personas.|Explore the community and swap experiences with other people.',
     'Revisar o histórico e o impacto dos seus descartes.|Revisar el historial y el impacto de tus reciclajes.|Review the history and impact of your disposals.'],
  r:[['🎗️','Faixa de transformação para o perfil|Banda de transformación para el perfil|Transformation ribbon for your profile'],
     ['🏞️','Fundos temáticos exclusivos|Fondos temáticos exclusivos|Exclusive themed backgrounds'],
     ['✨','Efeitos visuais de destaque para o perfil|Efectos visuales destacados para el perfil|Standout visual effects for your profile']]},
 {n:'Mestre da Reciclagem|Maestro del Reciclaje|Recycling Master',tier:'p',ic:'medal',
  d:'Domine o descarte correto: registre diferentes tipos de eletrônicos, acompanhe os resultados e mantenha uma rotina consistente.|Domina el descarte correcto: registra distintos tipos de electrónicos, sigue los resultados y mantén una rutina constante.|Master proper disposal: log different types of electronics, follow the results and keep a consistent routine.',
  a:['Registrar descartes de diferentes categorias de eletrônicos.|Registrar reciclajes de distintas categorías de electrónicos.|Log disposals across different electronics categories.',
     'Concluir missões de reciclagem de alta dificuldade.|Completar misiones de reciclaje de alta dificultad.|Complete high-difficulty recycling missions.',
     'Aprofundar os conhecimentos sobre economia circular.|Profundizar tus conocimientos sobre economía circular.|Deepen your knowledge of the circular economy.',
     'Manter a rotina de descartes por semanas seguidas.|Mantener la rutina de reciclajes durante semanas seguidas.|Keep your disposal routine going for weeks in a row.',
     'Ajudar outras pessoas a descartar corretamente.|Ayudar a otras personas a reciclar correctamente.|Help other people dispose of things correctly.'],
  r:[['♻️','Emblemas de mestre da reciclagem|Insignias de maestro del reciclaje|Recycling master badges'],
     ['🏅','Emblema especial de mestre|Insignia especial de maestro|Special master badge'],
     ['📊','Cartão de impacto com todas as categorias recicladas|Tarjeta de impacto con todas las categorías recicladas|Impact card with every recycled category']]},
 {n:'Embaixador da Sustentabilidade|Embajador de la Sostenibilidad|Sustainability Ambassador',tier:'d',ic:'globe',
  d:'Seja referência: represente o EcoClick, inspire sua comunidade e mantenha um histórico de impacto que vale compartilhar.|Sé una referencia: representa a EcoClick, inspira a tu comunidad y mantén un historial de impacto que vale la pena compartir.|Be a reference: represent EcoClick, inspire your community and keep an impact history worth sharing.',
  a:['Inspirar a comunidade compartilhando sua trajetória.|Inspirar a la comunidad compartiendo tu trayectoria.|Inspire the community by sharing your journey.',
     'Concluir missões especiais de longo prazo.|Completar misiones especiales de largo plazo.|Complete long-term special missions.',
     'Aprofundar os estudos sobre os ODS e a economia circular.|Profundizar el estudio de los ODS y la economía circular.|Go deeper into the SDGs and the circular economy.',
     'Manter descartes consistentes por meses seguidos.|Mantener reciclajes constantes durante meses seguidos.|Keep your disposals consistent for months on end.',
     'Compartilhar seu histórico de impacto ambiental.|Compartir tu historial de impacto ambiental.|Share your environmental impact history.'],
  r:[['👑','Moldura de embaixador para o perfil|Marco de embajador para el perfil|Ambassador frame for your profile'],
     ['🎗️','Faixa de embaixador da sustentabilidade|Banda de embajador de la sostenibilidad|Sustainability ambassador ribbon'],
     ['🗺️','Cartão de trajetória com todo o seu impacto|Tarjeta de trayectoria con todo tu impacto|Journey card with all your impact']]},
 {n:'Lenda Ecológica|Leyenda Ecológica|Ecological Legend',tier:'d',ic:'leaf',
  d:'Entre para a história do EcoClick: mantenha uma participação exemplar, conclua os desafios mais difíceis e inspire quem está chegando.|Entra en la historia de EcoClick: mantén una participación ejemplar, completa los desafíos más difíciles e inspira a quien está llegando.|Make EcoClick history: keep up an exemplary participation, complete the hardest challenges and inspire newcomers.',
  a:['Concluir os desafios mais difíceis da plataforma.|Completar los desafíos más difíciles de la plataforma.|Complete the hardest challenges on the platform.',
     'Manter uma participação exemplar por longos períodos.|Mantener una participación ejemplar durante largos períodos.|Keep up an exemplary participation over long stretches.',
     'Ler todos os conteúdos educativos disponíveis.|Leer todos los contenidos educativos disponibles.|Read all the educational content available.',
     'Apoiar quem está começando no EcoClick.|Apoyar a quien está empezando en EcoClick.|Support people who are just starting on EcoClick.',
     'Acompanhar a evolução do seu impacto ambiental.|Seguir la evolución de tu impacto ambiental.|Follow how your environmental impact evolves.'],
  r:[['🏆','Emblema lendário de sustentabilidade|Insignia legendaria de sostenibilidad|Legendary sustainability badge'],
     ['✨','Efeitos visuais lendários para o perfil|Efectos visuales legendarios para el perfil|Legendary visual effects for your profile'],
     ['👑','Moldura lendária e fundo exclusivo|Marco legendario y fondo exclusivo|Legendary frame and exclusive background']]},
 {n:'Lenda do Planeta|Leyenda del Planeta|Planet Legend',tier:'d',ic:'crown',
  d:'O nível máximo do EcoClick: reconhecimento para quem faz do descarte correto um hábito para a vida toda.|El nivel máximo de EcoClick: reconocimiento para quien convierte el reciclaje correcto en un hábito para toda la vida.|The top level on EcoClick: recognition for people who make proper disposal a lifelong habit.',
  a:['Completar todas as missões e desafios disponíveis.|Completar todas las misiones y desafíos disponibles.|Complete every mission and challenge available.',
     'Manter descartes e participação constantes.|Mantener reciclajes y participación constantes.|Keep your disposals and participation steady.',
     'Conquistar todos os selos do EcoClick.|Conseguir todos los sellos de EcoClick.|Earn every EcoClick badge.',
     'Continuar inspirando outras pessoas a reciclar.|Seguir inspirando a otras personas a reciclar.|Keep inspiring other people to recycle.',
     'Acompanhar o impacto total acumulado do seu histórico.|Seguir el impacto total acumulado de tu historial.|Track the total impact built up in your history.'],
  r:[['👑','Moldura suprema e fundo exclusivo|Marco supremo y fondo exclusivo|Supreme frame and exclusive background'],
     ['🏆','Emblema especial de nível máximo|Insignia especial de nivel máximo|Special max-level badge'],
     ['🗺️','Cartão especial da jornada completa no EcoClick|Tarjeta especial del recorrido completo en EcoClick|Special card of your full EcoClick journey']]}
];
const TIER={b:['#f0b678','#b5712f'],s:['#eef2f6','#a3afbd'],g:['#fbe08a','#d0a032'],p:['#c9f2e8','#3f9f8c'],d:['#cfe6ff','#5b86d6']}, STARS={b:1,s:2,g:3,p:4,d:5};
const IC={cap:'M12 5L2.5 10 12 15l9.5-5zM6.5 12.4V16c0 1.4 2.5 3 5.5 3s5.5-1.6 5.5-3v-3.6M21.5 10v5.5',
  compass:'M12 3a9 9 0 100 18 9 9 0 000-18zM15.5 8.5l-2 5-5 2 2-5z',
  bin:'M4.5 7h15M9.5 7V4.8h5V7M6.5 7l1 13h9l1-13M9.5 16.5c0-3 2-5 5-5 0 3-2 5-5 5zM9.5 16.5l2-2',
  tree:'M12 3l-6 8h3l-4 6h14l-4-6h3zM12 17v4',
  phone:'M9 2.5h6a2 2 0 012 2v15a2 2 0 01-2 2H9a2 2 0 01-2-2v-15a2 2 0 012-2zM10.5 18.5h3M9.8 11.4l1.7 1.7 3-3.4',
  bulb:'M9 18h6M10 21h4M12 2.8a6 6 0 00-3.6 10.8c.7.6 1.1 1.3 1.1 2.2V17h5v-1.2c0-.9.4-1.6 1.1-2.2A6 6 0 0012 2.8z',
  shield:'M12 3l7.5 3v5.5c0 4.6-3.1 8-7.5 9.5-4.4-1.5-7.5-4.9-7.5-9.5V6zM8.8 12l2.3 2.3 4.2-4.6',
  butterfly:'M11.3 12.2C10.6 7.6 7.4 3.6 4 4 1.4 4.4 1.6 9.4 5 11.9 6.9 13.2 9.5 13.2 11.3 12.2zM12.7 12.2c.7-4.6 3.9-8.6 7.3-8.2 2.6.4 2.4 5.4-1 7.9-1.9 1.3-4.5 1.3-6.3.3zM11.3 14.2C9.4 13.9 6.4 14.7 5.8 17.2c-.5 2.4 2 3.9 4 2.8 1.4-.8 1.5-3.4 1.5-5.8zM12.7 14.2c1.9-.3 4.9.5 5.5 3 .5 2.4-2 3.9-4 2.8-1.4-.8-1.5-3.4-1.5-5.8zM12 10v9.5M12 10 10.4 7.2M12 10l1.6-2.8',
  medal:'M12 3a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM8.6 13.5L7 21l5-3 5 3-1.6-7.5',
  globe:'M12 3a9 9 0 100 18 9 9 0 000-18zM3 12h18M12 3c3 2.8 3 15.2 0 18M12 3c-3 2.8-3 15.2 0 18',
  leaf:'M5 19C5 10 10 5 19 5c0 9-5 14-14 14zM5 19c3-4.2 6.2-7 10.5-8.6',
  crown:'M3.5 18.5h17M4 18.5L3 7.5l5 4 4-6 4 6 5-4-1 11'};
function badge(i,lv,locked){            // emblema hexagonal (estilo "Selos e emblemas")
  const [c1,c2]=TIER[lv.tier], id='lb'+i, bw=Math.max(54,18*STARS[lv.tier]), bx=56-bw/2;
  const out=locked?['#dfe1e0','#b5b9b8']:[c1,c2], inn=locked?['#a3a7a6','#8c908f']:['#1f6b4f','#124433'], ic=locked?'rgba(255,255,255,.78)':'#fff';
  return `<svg viewBox="0 0 112 140" aria-hidden="true"><defs><linearGradient id="${id}o" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${out[0]}"/><stop offset="1" stop-color="${out[1]}"/></linearGradient><linearGradient id="${id}i" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${inn[0]}"/><stop offset="1" stop-color="${inn[1]}"/></linearGradient></defs>
  <polygon points="56,2 106,31 106,89 56,118 6,89 6,31" fill="url(#${id}o)"/>
  <polygon points="56,17 93,38 93,82 56,103 19,82 19,38" fill="url(#${id}i)" stroke="rgba(255,255,255,.28)" stroke-width="2"/>
  <g transform="translate(36 40) scale(1.67)" fill="none" stroke="${ic}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="${IC[lv.ic]}"/></g>
  ${locked?`<circle cx="90" cy="92" r="15" fill="#1d5d46"/><g transform="translate(81 83) scale(.75)" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round"><rect x="4" y="11" width="16" height="10" rx="2" fill="#fff"/><path d="M8 11V8a4 4 0 018 0v3"/></g>`:''}
  <rect x="${bx}" y="118" width="${bw}" height="18" rx="9" fill="${locked?'#c6c9c8':c2}"/><text x="56" y="131" text-anchor="middle" font-size="11" font-weight="800" fill="#fff" letter-spacing="2">${'★'.repeat(STARS[lv.tier])}</text></svg>`;
}
const RWI={'🏷️':'<path d="M3 12V4h8l9 9-8 8z"/><circle cx="7.5" cy="8.5" r="1.3"/>','🏅':'<circle cx="12" cy="9" r="5"/><path d="M8.5 13.5L7 21l5-3 5 3-1.5-7.5"/>','🛍️':'<path d="M5 8h14l-1 12H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>','🖼️':'<rect x="3.5" y="4.5" width="17" height="15" rx="2.5"/><circle cx="9" cy="10" r="1.6"/><path d="M4 17l5-5 4 4 3-3 4 4"/>','📊':'<path d="M5 20V10M12 20V4M19 20v-7"/>','🏞️':'<path d="M3 18l6-9 4 6 3-4 5 7z"/><circle cx="17" cy="7" r="1.6"/>','♻️':'<path d="M12 21c-5 0-8-3.5-8-8 0-4.5 3-8 8-10 5 2 8 5.5 8 10 0 4.5-3 8-8 8z"/><path d="M12 21V9"/>','✨':'<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>','🎗️':'<path d="M8 3h8l1 6-5 4-5-4z"/><path d="M10 13l-2 8 4-2.5 4 2.5-2-8"/>','👑':'<path d="M3.5 18h17M4 18L3 7l5 4 4-6 4 6 5-4-1 11"/>','🏆':'<path d="M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M7 6H4v2a3 3 0 0 0 3 3M17 6h3v2a3 3 0 0 1-3 3M12 14v4M8 21h8"/>','🗺️':'<path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z"/><path d="M9 4v14M15 6v14"/>'};
const rwIcon=e=>RWI[e]?'<svg viewBox="0 0 24 24" aria-hidden="true">'+RWI[e]+'</svg>':'';
const lvRewards=lv=>[['🏷️',t('rw_title')+': '+P3(lv.n)],...lv.r.map(([e,x])=>[e,P3(x)])];
function renderLevels(){
  $('#lvTrack').innerHTML=LV.map((lv,i)=>{
    const locked=i+1>CUR, p=PROG[i];
    return `<article class="lvc ${locked?'locked':'open'}"><div class="lvc-b">${badge(i,lv,locked)}</div><div class="lvc-body"><div class="lvc-eye">${t('level')} ${i+1}</div><h3>${esc(P3(lv.n))}</h3><p class="lvc-d">${esc(P3(lv.d))}</p><div class="lvc-rt">${t('lv_rewards')}</div><ul class="lvc-rw">${lvRewards(lv).map(([e,x])=>`<li><span>${rwIcon(e)}</span>${esc(x)}</li>`).join('')}</ul><div class="lvc-pg"><div class="trk"><i data-w="${p}%" style="width:${p}%"></i></div><b>${p}%</b></div>${(!locked&&p<100)?`<div class="lvc-xp">${xpFill(t('xp_left'))}</div>`:''}<button class="btn lvb ${locked?'':'ok'}" data-lvb="${i}">${t(locked?'lv_activities':'lv_unlocked')}</button></div></article>`;}).join('');
  carInit('lv');
}
function openLevel(i){
  const lv=LV[i];
  openModal(t('level')+' '+(i+1)+' · '+P3(lv.n),[],null,`<p class="hint" style="margin:0 0 4px">${t(i+1>CUR?'lv_locked_note':'lv_open_note')}</p><div class="lvm-t">${t('lv_acts')}</div><ol class="lvm">${lv.a.map(x=>`<li>${esc(P3(x))}</li>`).join('')}</ol><div class="lvm-t">${t('lv_rewards')}</div><ul class="lvm rw">${lvRewards(lv).map(([e,x])=>`<li><span>${rwIcon(e)}</span>${esc(x)}</li>`).join('')}</ul>`);
}
$('#lvTrack').addEventListener('click',e=>{const b=e.target.closest('[data-lvb]'); if(b)openLevel(+b.dataset.lvb);});

/* ---------- cards dos meses (jan–dez do ano atual, dados reais) ---------- */
const capF=x=>x.charAt(0).toUpperCase()+x.slice(1);
const monthName=i=>capF(new Date(2026,i,15).toLocaleDateString(LOC[S.lang],{month:'long'}));
function markMonths(){ $$('#moTrack .moc').forEach((c,k)=>{c.classList.toggle('sel',k===sel);c.setAttribute('aria-pressed',k===sel);}); }
function renderMonths(){
  const mx=Math.max(...YEAR)||1;
  $('#moTrack').innerHTML=YEAR.map((v,i)=>{
    const dl=deltaOf(i);
    const chip=`<span class="dl ${dl.c}">${dl.x}</span>`;
    return `<button type="button" class="moc" data-mi="${i}"><div class="mh"><h4>${monthName(i)}</h4></div><div class="mv">${v}<small>${t('items_unit')}</small></div>${chip}<div class="mini"><i style="width:${Math.round(v/mx*100)}%"></i></div></button>`;}).join('');
  carInit('mo'); markMonths(); requestAnimationFrame(posMonths);
}
function posMonths(){                              // abre o carrossel já mostrando o mês selecionado (uma vez)
  const car=$('#moCar'), c=[...$('#moTrack').children]; if(!c.length||!car.clientWidth||CAR.mo.done)return;
  CAR.mo.done=1; car.scrollTo({left:c[sel].offsetLeft-c[0].offsetLeft,behavior:'instant'});
}
function revealMonth(){                           // ao escolher o mês pelo gráfico, traz o card correspondente para a área visível
  const car=$('#moCar'), c=$('#moTrack').children[sel]; if(!c)return;
  const a=c.getBoundingClientRect(), k=car.getBoundingClientRect(); if(a.left<k.left||a.right>k.right)CAR.mo.go(sel);
}
$('#moTrack').addEventListener('click',e=>{
  const b=e.target.closest('[data-mi]'); if(!b)return;
  sel=+b.dataset.mi; paintSel(); renderDetail(); markMonths();
  const dc=$('.card.detail'), r=dc.getBoundingClientRect();
  if(r.top<0||r.bottom>innerHeight)dc.scrollIntoView({behavior:RM?'auto':'smooth',block:'nearest'});
});

/* ---------- central de notificações (estrutura local; sem servidor) ---------- */
const fmtDT=ts=>new Date(ts).toLocaleString(LOC[S.lang],{dateStyle:'short',timeStyle:'short'});
function pushNotif(k){S.notifs.unshift({id:Date.now()+Math.random(),k,ts:Date.now(),read:false});S.notifs=S.notifs.slice(0,30);save();renderNotifs();}
function renderNotifs(){
  const un=S.notifs.filter(n=>!n.read).length;
  $('#bellDot').style.display=un?'block':'none';
  $('#nSub').textContent=un===0?t('unread_0'):un===1?t('unread_1'):t('unread_n').replace('{n}',un);
  $('#markAll').textContent=t('mark_all'); $('#markAll').disabled=!un;
  const l=[...S.notifs].sort((a,b)=>b.ts-a.ts);
  $('#nlist').innerHTML=l.length?l.map(n=>`<button class="ni ${n.read?'':'unread'}" data-nid="${n.id}"><span class="nd"></span><span><b>${t(n.k+'_t')}</b><p>${n.k==='nt_xp'?xpFill(t(n.k+'_m')):t(n.k+'_m')}</p><small>${fmtDT(n.ts)}</small></span></button>`).join(''):`<div class="hint">${t('notif_empty')}</div>`;
}
$('#bellBtn').onclick=e=>{e.stopPropagation();const o=$('#npanel').classList.toggle('open');$('#bellBtn').setAttribute('aria-expanded',o);};
$('#npanel').addEventListener('click',e=>{e.stopPropagation();const b=e.target.closest('[data-nid]');
  if(b){const n=S.notifs.find(x=>String(x.id)===b.dataset.nid);if(n&&!n.read){n.read=true;save();renderNotifs();}}});
$('#markAll').onclick=()=>{S.notifs.forEach(n=>n.read=true);save();renderNotifs();toast('✓ '+t('all_read'));};
document.addEventListener('click',()=>{$('#npanel').classList.remove('open');$('#bellBtn').setAttribute('aria-expanded','false');});
$$('[data-pref]').forEach(i=>{i.checked=!!S.pref[i.dataset.pref];
  i.onchange=()=>{S.pref[i.dataset.pref]=i.checked;if(i.dataset.pref==='tfa')S.tfaChosen=true;save();renderProt();};});
$('#themeSeg').addEventListener('click',e=>{const b=e.target.closest('button');if(!b||b.dataset.t===S.theme)return;S.theme=b.dataset.t;save();applyTheme();});
$('#langSeg').addEventListener('click',e=>{const b=e.target.closest('button');if(!b||b.dataset.l===S.lang)return;S.lang=b.dataset.l;save();applyLang();});
$('#moreBtn').onclick=()=>{hAll=!hAll;renderHist();};
let tt; function toast(m){const e=$('#toast');e.textContent=m;e.classList.add('show');clearTimeout(tt);tt=setTimeout(()=>e.classList.remove('show'),2200);}

/* ---------- init ---------- */
S.log=Array.isArray(S.log)?cleanLog(S.log):[]; save();
if(!Array.isArray(S.notifs)) S.notifs=[];
/* começa sem notificações; remove as de exemplo que versões anteriores gravaram neste navegador */
S.notifs=S.notifs.filter(n=>['nt_goal','nt_xp','nt_streak'].indexOf(n.k)<0); save();
applyTheme(); setAvatar(); applyLang();
drainQueue();
go(location.hash==='#profile'?'profile':'progress');
