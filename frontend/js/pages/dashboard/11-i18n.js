
    // Idiomas (Português-BR · English · Español). As chaves são os textos originais em português;
    // para adicionar um idioma basta incluir mais um objeto em DICT e uma <option> em Configurações.
    (function(){
      var DICT = {
        en: {
          'Pontos de coleta':'Collection points','Materiais':'Materials','Meu progresso':'My progress','Procurar':'Search','Procurar nas configurações':'Search settings','Menu de configurações':'Settings menu','Geral':'General','Privacidade':'Privacy','Ajuda':'Help','Aparência':'Appearance','Sistema':'System','Movimento':'Motion','Reduz as animações e transições da interface.':'Reduces interface animations and transitions.','Reduzido':'Reduced','Idioma e região':'Language and region','Editar perfil':'Edit profile','Acesso':'Access','Seus dados':'Your data','Exportar meus dados':'Export my data','Baixe uma cópia dos seus dados do EcoClick em um arquivo.':'Download a copy of your EcoClick data as a file.','Baixar':'Download','Excluir conta':'Delete account','Remove seus dados deste navegador e encerra a sessão.':'Removes your data from this browser and signs you out.','Excluir':'Delete','Digite EXCLUIR para confirmar':'Type EXCLUIR to confirm','Digite EXCLUIR para confirmar.':'Type EXCLUIR to confirm.','Dados exportados':'Data exported','Conta excluída':'Account deleted','Avisos do EcoClick':'EcoClick alerts','Histórico':'History','Ver minhas notificações':'View my notifications','Abra a lista completa de avisos que você recebeu.':'Open the full list of alerts you received.','Mapa':'Map','Usar minha localização ao abrir o mapa':'Use my location when opening the map','Seleciona o ponto mais próximo assim que o mapa carrega.':'Selects the nearest point as soon as the map loads.','Mostrar apenas pontos abertos agora':'Show only points open now','Oculta do mapa os pontos fora do horário de funcionamento.':'Hides points outside opening hours from the map.','Atalhos':'Shortcuts','Ir para o mapa':'Go to the map','Veja os pontos de coleta próximos e agende seu descarte.':'See nearby collection points and schedule your disposal.','Meus agendamentos':'My appointments','Consulte e cancele os descartes que você marcou.':'Check and cancel the disposals you scheduled.','Documentos':'Documents','Sobre o EcoClick':'About EcoClick','Conheça o projeto e a proposta do EcoClick.':'Learn about the EcoClick project and its purpose.','Nenhum resultado para a busca.':'No results found.','Fechar configurações':'Close settings','Atividades recentes':'Recent activity','Ver todas':'View all','Evolução dos descartes':'Disposal trends','Missões e conquistas':'Missions and achievements','Progresso geral':'Overall progress','Concluídas':'Completed','Em andamento':'In progress','Não iniciadas':'Not started','Período':'Period','Total no período':'Total in period','Concluídos':'Completed','Você concluiu um descarte':'You completed a disposal','Descarte pendente':'Disposal pending','Você agendou um descarte':'You scheduled a disposal','Você concluiu uma missão':'You completed a mission','Nenhuma atividade ainda.':'No activity yet.','Nenhuma missão ainda.':'No missions yet.','Nenhum descarte neste período.':'No disposals in this period.','Semanal':'Weekly','Mensal':'Monthly','Concluída':'Completed','Prazo: {d}':'Due: {d}','{n}/{t} concluídas':'{n}/{t} completed','Você está indo bem!':'You’re doing great!','Continue assim.':'Keep it up.','Vamos começar?':'Shall we start?','Conclua sua primeira missão.':'Complete your first mission.','Parabéns!':'Congratulations!','Todas as missões concluídas.':'All missions completed.','Suas missões aparecerão aqui.':'Your missions will show up here.','{p}% de progresso geral':'{p}% overall progress','Descartes por período':'Disposals per period','Missões':'Missions','Minha jornada':'My journey',
          'Recompensas':'Rewards','Comunidade':'Community','Conteúdos':'Content','Configurações':'Settings','Sair':'Log out','Conta':'Account',
          'Fechar barra lateral':'Close sidebar','Abrir barra lateral':'Open sidebar','Abrir menu':'Open menu','Fechar menu':'Close menu',
          'Buscar':'Search','Notificações':'Notifications','Nenhuma notificação por aqui ainda.':'No notifications here yet.',
          'Meu perfil':'My profile','Destaques':'Highlights','Slide anterior':'Previous slide','Próximo slide':'Next slide',
          'Pontos de coleta próximos':'Nearby collection points',
          'Encontre um local para fazer seu próximo descarte.':'Find a place for your next disposal.',
          'Ver mais →':'See more →','O que você pode descartar?':'What can you dispose of?','Encontre informações sobre materiais que podem receber um destino adequado.':'Find information about materials that can be properly disposed of.','Celulares':'Mobile phones','Eletrônicos pessoais':'Personal electronics','Computadores':'Computers','Equipamentos de informática':'IT equipment','Cabos e carregadores':'Cables and chargers','Acessórios eletrônicos':'Electronic accessories','Acumule pontos a partir dos seus descartes e participe de benefícios.':'Earn points from your disposals and take part in benefits.','Nenhuma recompensa disponível por enquanto.':'No rewards available for now.','Juntos, o impacto cresce.':'Together, the impact grows.','O EcoClick conecta pessoas que acreditam que pequenas atitudes podem gerar mudanças. Participe da comunidade, compartilhe suas conquistas e acompanhe o impacto que construímos juntos.':'EcoClick connects people who believe small actions can make a difference. Join the community, share your achievements and follow the impact we build together.','Novidades da comunidade em breve.':'Community updates coming soon.','Ver mais':'See more','Ver todos →':'View all →','Ver todos':'View all',
          'Mapa de Salvador com pontos de coleta':'Map of Salvador with collection points',
          'Não foi possível carregar o mapa.':'The map could not be loaded.',
          'Verifique sua conexão com a internet e recarregue a página.':'Check your internet connection and reload the page.',
          'Buscar ponto ou material':'Search point or material','Buscar ponto de coleta ou material':'Search collection point or material',
          'Usar minha localização':'Use my location','Minha localização':'My location','Nenhum ponto encontrado.':'No points found.',
          'Selecione um ponto':'Select a point',
          'Toque em um marcador no mapa para ver distância, materiais aceitos e horários.':'Tap a marker on the map to see distance, accepted materials and hours.',
          'Materiais aceitos':'Accepted materials','Horário de funcionamento':'Opening hours','Agendar descarte →':'Schedule disposal →',
          '← Voltar':'← Back','Agendar descarte':'Schedule disposal','Nome':'Name','Seu nome':'Your name','voce@email.com':'you@email.com',
          'E-mail':'Email','Tipo de material':'Material type','Horários disponíveis':'Available times','Dia':'Day',
          'Confirmar agendamento':'Confirm appointment','Confirmando…':'Confirming…','Agendamento confirmado':'Appointment confirmed','Concluir':'Done',
          'Aumentar zoom':'Zoom in','Diminuir zoom':'Zoom out',
          'Aberto agora':'Open now','Fechado':'Closed','{d} de você':'{d} from you',
          'Hoje':'Today','Amanhã':'Tomorrow',
          'Dom':'Sun','Seg':'Mon','Ter':'Tue','Qua':'Wed','Qui':'Thu','Sex':'Fri','Sáb':'Sat',
          'Seg a sex':'Mon–Fri','Seg a sáb':'Mon–Sat','Sáb e dom':'Sat & Sun',
          'Celulares':'Phones','Cabos e carregadores':'Cables and chargers','Computadores':'Computers','Pilhas e baterias':'Batteries','Eletrodomésticos':'Appliances',
          'Carregando horários…':'Loading times…','Sem horários disponíveis nos próximos dias.':'No times available in the coming days.',
          'Não foi possível carregar os horários. Tente novamente.':'Could not load the times. Please try again.',
          'Informe seu nome.':'Enter your name.','Informe um e-mail válido.':'Enter a valid email.','Escolha o tipo de material.':'Choose the material type.',
          'Escolha um horário disponível.':'Choose an available time.','Esse horário acabou de ser reservado. Escolha outro.':'That time was just booked. Please choose another.',
          'Não foi possível confirmar. Tente novamente.':'Could not confirm. Please try again.',
          '{m} em {p} — {d} às {t}. Enviaremos a confirmação para {e}.':'{m} at {p} — {d} at {t}. We will send the confirmation to {e}.',
          'Missões (6)':'Missions (6)','4/6 concluídas':'4/6 completed','Reciclar eletrônicos':'Recycle electronics',
          'Visitar um ponto de coleta':'Visit a collection point','Convidar um amigo':'Invite a friend','Registrar 5 descartes':'Log 5 disposals',
          'Seus registros':'Your records','Celulares — Lote 3':'Phones — Batch 3','Computadores — Lote 2':'Computers — Batch 2',
          'Histórico de descartes':'Disposal history','Categoria':'Category','Ponto de coleta':'Collection point','Data':'Date','Comprovante':'Receipt','Status':'Status',
          'Pilhas':'Batteries','Zona Sul':'South Zone','Centro':'Downtown','Zona Norte':'North Zone','Baixar':'Download','Concluído':'Completed','Pendente':'Pending',
          'O que você deseja descartar?':'What will you discard?','Procure por celulares':'Search for phones','Procure por computadores':'Search for computers',
          'Procure por carregadores':'Search for chargers','Procure por pilhas e baterias':'Search for batteries','Encontre um ponto de coleta':'Find a collection point',
          /* configurações */
          'Gerencie sua conta, notificações, preferências e segurança.':'Manage your account, notifications, preferences and security.',
          'Buscar nas configurações':'Search settings','Seus dados de acesso e contato.':'Your login and contact details.',
          'Alterar':'Change','Fechar':'Close','Novo e-mail':'New email','Senha atual':'Current password','Confirme com sua senha':'Confirm with your password',
          'Cancelar':'Cancel','Salvar':'Save','Salvando…':'Saving…','Senha':'Password','Use ao menos 8 caracteres, com letras e números.':'Use at least 8 characters, with letters and numbers.',
          'Nova senha':'New password','Confirmar nova senha':'Confirm new password','Telefone':'Phone','Novo telefone':'New phone',
          'Escolha o que você quer receber.':'Choose what you want to receive.','Agendamentos':'Appointments',
          'Confirmações e lembretes dos seus descartes.':'Confirmations and reminders for your disposals.',
          'Novas missões e progresso das atuais.':'New missions and progress on current ones.',
          'Quando você ganhar ou puder resgatar prêmios.':'When you earn or can redeem rewards.','Novidades':'News',
          'Novos pontos de coleta, recursos e dicas.':'New collection points, features and tips.',
          'Notificações de agendamentos':'Appointment notifications','Notificações de missões':'Mission notifications',
          'Notificações de recompensas':'Reward notifications','Notificações de novidades':'News notifications',
          'Preferências':'Preferences','Idioma, acessibilidade e aparência.':'Language, accessibility and appearance.','Idioma':'Language',
          'Idioma da interface.':'Interface language.','Acessibilidade':'Accessibility','Reduzir animações':'Reduce animations',
          'Minimiza transições e movimentos na tela.':'Minimizes transitions and motion on screen.','Alto contraste':'High contrast',
          'Reforça textos e bordas para leitura mais fácil.':'Strengthens text and borders for easier reading.','Tema':'Theme',
          'Aparência do EcoClick neste navegador.':'EcoClick appearance in this browser.','☀️ Claro':'☀️ Light','🌙 Escuro':'🌙 Dark',
          'Privacidade e segurança':'Privacy and security','Sessões, política e termos.':'Sessions, policy and terms.','Sessões conectadas':'Connected sessions',
          'Encerrar as outras sessões':'End other sessions','Política de privacidade':'Privacy policy','Termos de uso':'Terms of use',
          'Nenhuma configuração encontrada.':'No settings found.',
          'Notificações ativadas':'Notifications on','Notificações desativadas':'Notifications off','Preferência salva':'Preference saved','Idioma salvo':'Language saved',
          'E-mail atualizado':'Email updated','Senha atualizada':'Password updated','Telefone atualizado':'Phone updated',
          'Não foi possível salvar. Tente novamente.':'Could not save. Please try again.','Sessão encerrada':'Session ended','Outras sessões encerradas':'Other sessions ended',
          'Informe sua senha atual.':'Enter your current password.','Use 8+ caracteres, com letras e números.':'Use 8+ characters, with letters and numbers.',
          'A nova senha deve ser diferente da atual.':'The new password must differ from the current one.','As senhas não coincidem.':'Passwords do not match.',
          'Informe um telefone com DDD.':'Enter a phone number with area code.',
          'Este dispositivo':'This device','Ativo agora':'Active now','há 2 horas':'2 hours ago','há 3 dias':'3 days ago','Encerrar':'End',
          'Encerrar sessão em {d}':'End session on {d}','Não informado':'Not provided','Não cadastrado':'Not registered',
          'Menu da conta':'Account menu','Membro EcoClick':'EcoClick member','Meu perfil →':'My profile →','Usuário EcoClick':'EcoClick user',
          'Não lidas: {n}':'Unread: {n}','Marcar todas como lidas':'Mark all as read','Agora':'Now',
          'Seu descarte de Celulares foi confirmado para amanhã, às 10:00.':'Your phone disposal is confirmed for tomorrow at 10:00.',
          'Lembrete de descarte':'Disposal reminder','Falta pouco! Seu descarte está marcado para amanhã às 10:00.':'Almost there! Your disposal is scheduled for tomorrow at 10:00.',
          'Missão disponível':'Mission available','Nova missão: Convidar um amigo. Ganhe pontos extras!':'New mission: Invite a friend. Earn extra points!',
          'Missão concluída':'Mission completed','Você concluiu “Visitar um ponto de coleta”. Parabéns!':'You completed “Visit a collection point”. Congratulations!',
          'Recompensa disponível':'Reward available','Você tem pontos suficientes para resgatar uma nova recompensa.':'You have enough points to redeem a new reward.',
          'Novidades do EcoClick':'EcoClick news','Novos pontos de coleta chegaram a Salvador. Confira no mapa!':'New collection points have arrived in Salvador. Check the map!',
          'Meu perfil':'My profile','Seus dados pessoais no EcoClick.':'Your personal details on EcoClick.','Editar perfil':'Edit profile','Nível':'Level','Pontos':'Points',
          'Faltam {n} pontos para o nível {m}':'{n} points to level {m}','Nível máximo alcançado':'Maximum level reached','Dados pessoais':'Personal details',
          'Nome completo':'Full name','Endereço':'Address','Rua, número, bairro, cidade':'Street, number, neighborhood, city','Alterar foto':'Change photo','Remover foto':'Remove photo',
          'Foto de perfil':'Profile photo','Perfil atualizado':'Profile updated','Informe um CPF válido.':'Enter a valid CPF.','Imagem inválida.':'Invalid image.',
          'Ainda não leu nossos artigos e conteúdos? Comece agora!':'Haven’t read our articles and content yet? Start now!','Descubra dicas, curiosidades e novas formas de contribuir para um futuro mais sustentável.':'Discover tips, curiosities and new ways to contribute to a more sustainable future.','Meus conteúdos':'My content','Conteúdos anteriores':'Previous content','Próximos conteúdos':'Next content','Semente':'Seed','Broto':'Sprout','Folha':'Leaf','Árvore':'Tree','Floresta':'Forest',
          'Perfil':'Profile',
          'Suporte':'Support',
          'Gerenciar perfil':'Manage profile',
          'Senha e segurança':'Password & security',
          'Sobre nós':'About us',
          'Central de ajuda':'Help center',
          'Claro':'Light',
          'Escuro':'Dark',
          '{n} próximos':'{n} upcoming',
          'Configurar preferências →':'Configure preferences →',
          'Idioma da plataforma.':'Platform language.',
          'Perguntas frequentes':'Frequently asked questions',
          'Mapa de pontos':'Points map',
          'Agendamento de descarte':'Disposal scheduling',
          'Missões e recompensas':'Missions and rewards',
          'Próximos':'Upcoming',
          'Anteriores':'Past',
          'Você ainda não tem agendamentos.':'You have no appointments yet.',
          'Confirmado':'Confirmed',
          'Cancelado':'Cancelled',
          'Material':'Material',
          'Horário':'Time',
          'Protocolo':'Reference',
          'Cancelar agendamento':'Cancel appointment',
          'Confirmar cancelamento':'Confirm cancellation',
          'Agendamento cancelado':'Appointment cancelled',
          'Olá, {n}':'Hello, {n}',
          'Olá!':'Hello!',
          'Impacto ambiental':'Environmental impact',
          'itens destinados corretamente':'items properly disposed of',
          'Próximo agendamento':'Next appointment',
          'Nenhum agendamento':'No appointments',
          'Ver agendamentos →':'View appointments →',
          'Ver perfil':'View profile',
          'pontos':'points',
          'Resumo':'Summary',
          'Editar perfil →':'Edit profile →',
          'Tire dúvidas e veja respostas rápidas sobre o EcoClick.':'Get quick answers to common questions about EcoClick.',
          'Abrir Central de ajuda →':'Open Help center →',
          'Segurança':'Security',
          'O EcoClick conecta pessoas a pontos de coleta de lixo eletrônico, para que o descarte correto seja simples e acessível.':'EcoClick connects people to e-waste collection points, making proper disposal simple and accessible.',
          'Encontre o ponto mais próximo no mapa, agende seu descarte, cumpra missões e ganhe recompensas por cuidar do planeta.':'Find the nearest point on the map, schedule your disposal, complete missions and earn rewards for caring for the planet.',
          'Nosso objetivo é reduzir o impacto do lixo eletrônico e construir uma comunidade mais sustentável, começando por Salvador.':'Our goal is to reduce the impact of electronic waste and build a more sustainable community, starting in Salvador.',
          'Como agendo um descarte?':'How do I schedule a disposal?',
          'No Dashboard, escolha um ponto no mapa, toque em “Agendar descarte →”, informe seus dados, o material e um horário disponível.':'On the Dashboard, pick a point on the map, tap “Schedule disposal →”, enter your details, the material and an available time.',
          'Quais materiais posso levar?':'Which materials can I bring?',
          'Cada ponto informa os materiais aceitos, como celulares, computadores, pilhas, baterias, cabos e eletrodomésticos. Confira no card do ponto.':'Each point lists the materials it accepts, such as phones, computers, batteries, cables and appliances. Check the point card.',
          'Como cancelo um agendamento?':'How do I cancel an appointment?',
          'Em Perfil, abra Agendamentos, selecione o agendamento e toque em “Cancelar agendamento”.':'In Profile, open Appointments, select the appointment and tap “Cancel appointment”.',
          'Como funcionam os pontos e os níveis?':'How do points and levels work?',
          'Você acumula pontos ao concluir descartes e missões e sobe de nível conforme sua pontuação.':'You earn points by completing disposals and missions and level up as your score grows.',
          'Como mudo o idioma ou o tema?':'How do I change the language or theme?',
          'Em Perfil, abra Idioma ou Tema. A escolha fica salva neste navegador.':'In Profile, open Language or Theme. Your choice is saved in this browser.'
        },
        es: {
          'Pontos de coleta':'Puntos de recogida','Materiais':'Materiales','Meu progresso':'Mi progreso','Procurar':'Buscar','Procurar nas configurações':'Buscar en configuración','Menu de configurações':'Menú de configuración','Geral':'General','Privacidade':'Privacidad','Ajuda':'Ayuda','Aparência':'Apariencia','Sistema':'Sistema','Movimento':'Movimiento','Reduz as animações e transições da interface.':'Reduce las animaciones y transiciones de la interfaz.','Reduzido':'Reducido','Idioma e região':'Idioma y región','Editar perfil':'Editar perfil','Acesso':'Acceso','Seus dados':'Tus datos','Exportar meus dados':'Exportar mis datos','Baixe uma cópia dos seus dados do EcoClick em um arquivo.':'Descarga una copia de tus datos de EcoClick en un archivo.','Baixar':'Descargar','Excluir conta':'Eliminar cuenta','Remove seus dados deste navegador e encerra a sessão.':'Elimina tus datos de este navegador y cierra la sesión.','Excluir':'Eliminar','Digite EXCLUIR para confirmar':'Escribe EXCLUIR para confirmar','Digite EXCLUIR para confirmar.':'Escribe EXCLUIR para confirmar.','Dados exportados':'Datos exportados','Conta excluída':'Cuenta eliminada','Avisos do EcoClick':'Avisos de EcoClick','Histórico':'Historial','Ver minhas notificações':'Ver mis notificaciones','Abra a lista completa de avisos que você recebeu.':'Abre la lista completa de avisos que recibiste.','Mapa':'Mapa','Usar minha localização ao abrir o mapa':'Usar mi ubicación al abrir el mapa','Seleciona o ponto mais próximo assim que o mapa carrega.':'Selecciona el punto más cercano al cargar el mapa.','Mostrar apenas pontos abertos agora':'Mostrar solo puntos abiertos ahora','Oculta do mapa os pontos fora do horário de funcionamento.':'Oculta del mapa los puntos fuera del horario de atención.','Atalhos':'Atajos','Ir para o mapa':'Ir al mapa','Veja os pontos de coleta próximos e agende seu descarte.':'Mira los puntos de recolección cercanos y agenda tu descarte.','Meus agendamentos':'Mis agendamientos','Consulte e cancele os descartes que você marcou.':'Consulta y cancela los descartes que agendaste.','Documentos':'Documentos','Sobre o EcoClick':'Sobre EcoClick','Conheça o projeto e a proposta do EcoClick.':'Conoce el proyecto y la propuesta de EcoClick.','Nenhum resultado para a busca.':'Sin resultados para la búsqueda.','Fechar configurações':'Cerrar configuración','Atividades recentes':'Actividad reciente','Ver todas':'Ver todas','Evolução dos descartes':'Evolución de los descartes','Missões e conquistas':'Misiones y logros','Progresso geral':'Progreso general','Concluídas':'Completadas','Em andamento':'En curso','Não iniciadas':'Sin iniciar','Período':'Período','Total no período':'Total en el período','Concluídos':'Completados','Você concluiu um descarte':'Completaste un descarte','Descarte pendente':'Descarte pendiente','Você agendou um descarte':'Agendaste un descarte','Você concluiu uma missão':'Completaste una misión','Nenhuma atividade ainda.':'Aún no hay actividad.','Nenhuma missão ainda.':'Aún no hay misiones.','Nenhum descarte neste período.':'Ningún descarte en este período.','Semanal':'Semanal','Mensal':'Mensual','Concluída':'Completada','Prazo: {d}':'Plazo: {d}','{n}/{t} concluídas':'{n}/{t} completadas','Você está indo bem!':'¡Vas muy bien!','Continue assim.':'Sigue así.','Vamos começar?':'¿Empezamos?','Conclua sua primeira missão.':'Completa tu primera misión.','Parabéns!':'¡Felicidades!','Todas as missões concluídas.':'Todas las misiones completadas.','Suas missões aparecerão aqui.':'Tus misiones aparecerán aquí.','{p}% de progresso geral':'{p}% de progreso general','Descartes por período':'Descartes por período','Missões':'Misiones','Minha jornada':'Mi jornada',
          'Recompensas':'Recompensas','Comunidade':'Comunidad','Conteúdos':'Contenidos','Configurações':'Configuración','Sair':'Salir','Conta':'Cuenta',
          'Fechar barra lateral':'Cerrar barra lateral','Abrir barra lateral':'Abrir barra lateral','Abrir menu':'Abrir menú','Fechar menu':'Cerrar menú',
          'Buscar':'Buscar','Notificações':'Notificaciones','Nenhuma notificação por aqui ainda.':'Aún no hay notificaciones.',
          'Meu perfil':'Mi perfil','Destaques':'Destacados','Slide anterior':'Diapositiva anterior','Próximo slide':'Siguiente diapositiva',
          'Pontos de coleta próximos':'Puntos de recogida cercanos',
          'Encontre um local para fazer seu próximo descarte.':'Encuentra un lugar para tu próximo descarte.',
          'Ver mais →':'Ver más →','O que você pode descartar?':'¿Qué puedes descartar?','Encontre informações sobre materiais que podem receber um destino adequado.':'Encuentra información sobre materiales que pueden recibir un destino adecuado.','Celulares':'Celulares','Eletrônicos pessoais':'Electrónicos personales','Computadores':'Computadoras','Equipamentos de informática':'Equipos informáticos','Cabos e carregadores':'Cables y cargadores','Acessórios eletrônicos':'Accesorios electrónicos','Acumule pontos a partir dos seus descartes e participe de benefícios.':'Acumula puntos con tus descartes y participa de beneficios.','Nenhuma recompensa disponível por enquanto.':'No hay recompensas disponibles por ahora.','Juntos, o impacto cresce.':'Juntos, el impacto crece.','O EcoClick conecta pessoas que acreditam que pequenas atitudes podem gerar mudanças. Participe da comunidade, compartilhe suas conquistas e acompanhe o impacto que construímos juntos.':'EcoClick conecta a personas que creen que las pequeñas acciones pueden generar cambios. Participa en la comunidad, comparte tus logros y sigue el impacto que construimos juntos.','Novidades da comunidade em breve.':'Novedades de la comunidad próximamente.','Ver mais':'Ver más','Ver todos →':'Ver todos →','Ver todos':'Ver todos',
          'Mapa de Salvador com pontos de coleta':'Mapa de Salvador con puntos de recogida',
          'Não foi possível carregar o mapa.':'No se pudo cargar el mapa.',
          'Verifique sua conexão com a internet e recarregue a página.':'Revisa tu conexión a internet y recarga la página.',
          'Buscar ponto ou material':'Buscar punto o material','Buscar ponto de coleta ou material':'Buscar punto de recogida o material',
          'Usar minha localização':'Usar mi ubicación','Minha localização':'Mi ubicación','Nenhum ponto encontrado.':'No se encontraron puntos.',
          'Selecione um ponto':'Selecciona un punto',
          'Toque em um marcador no mapa para ver distância, materiais aceitos e horários.':'Toca un marcador en el mapa para ver la distancia, los materiales aceptados y los horarios.',
          'Materiais aceitos':'Materiales aceptados','Horário de funcionamento':'Horario de atención','Agendar descarte →':'Agendar descarte →',
          '← Voltar':'← Volver','Agendar descarte':'Agendar descarte','Nome':'Nombre','Seu nome':'Tu nombre','voce@email.com':'tu@correo.com',
          'E-mail':'Correo electrónico','Tipo de material':'Tipo de material','Horários disponíveis':'Horarios disponibles','Dia':'Día',
          'Confirmar agendamento':'Confirmar agendamiento','Confirmando…':'Confirmando…','Agendamento confirmado':'Agendamiento confirmado','Concluir':'Listo',
          'Aumentar zoom':'Acercar','Diminuir zoom':'Alejar',
          'Aberto agora':'Abierto ahora','Fechado':'Cerrado','{d} de você':'a {d} de ti',
          'Hoje':'Hoy','Amanhã':'Mañana',
          'Dom':'Dom','Seg':'Lun','Ter':'Mar','Qua':'Mié','Qui':'Jue','Sex':'Vie','Sáb':'Sáb',
          'Seg a sex':'Lun a vie','Seg a sáb':'Lun a sáb','Sáb e dom':'Sáb y dom',
          'Celulares':'Celulares','Cabos e carregadores':'Cables y cargadores','Computadores':'Computadoras','Pilhas e baterias':'Pilas y baterías','Eletrodomésticos':'Electrodomésticos',
          'Carregando horários…':'Cargando horarios…','Sem horários disponíveis nos próximos dias.':'No hay horarios disponibles en los próximos días.',
          'Não foi possível carregar os horários. Tente novamente.':'No se pudieron cargar los horarios. Inténtalo de nuevo.',
          'Informe seu nome.':'Ingresa tu nombre.','Informe um e-mail válido.':'Ingresa un correo válido.','Escolha o tipo de material.':'Elige el tipo de material.',
          'Escolha um horário disponível.':'Elige un horario disponible.','Esse horário acabou de ser reservado. Escolha outro.':'Ese horario acaba de ser reservado. Elige otro.',
          'Não foi possível confirmar. Tente novamente.':'No se pudo confirmar. Inténtalo de nuevo.',
          '{m} em {p} — {d} às {t}. Enviaremos a confirmação para {e}.':'{m} en {p} — {d} a las {t}. Enviaremos la confirmación a {e}.',
          'Missões (6)':'Misiones (6)','4/6 concluídas':'4/6 completadas','Reciclar eletrônicos':'Reciclar electrónicos',
          'Visitar um ponto de coleta':'Visitar un punto de recogida','Convidar um amigo':'Invitar a un amigo','Registrar 5 descartes':'Registrar 5 descartes',
          'Seus registros':'Tus registros','Celulares — Lote 3':'Celulares — Lote 3','Computadores — Lote 2':'Computadoras — Lote 2',
          'Histórico de descartes':'Historial de descartes','Categoria':'Categoría','Ponto de coleta':'Punto de recogida','Data':'Fecha','Comprovante':'Comprobante','Status':'Estado',
          'Pilhas':'Pilas','Zona Sul':'Zona Sur','Centro':'Centro','Zona Norte':'Zona Norte','Baixar':'Descargar','Concluído':'Completado','Pendente':'Pendiente',
          'O que você deseja descartar?':'¿Qué quieres descartar?','Procure por celulares':'Busca celulares','Procure por computadores':'Busca computadoras',
          'Procure por carregadores':'Busca cargadores','Procure por pilhas e baterias':'Busca pilas y baterías','Encontre um ponto de coleta':'Encuentra un punto de recogida',
          'Gerencie sua conta, notificações, preferências e segurança.':'Gestiona tu cuenta, notificaciones, preferencias y seguridad.',
          'Buscar nas configurações':'Buscar en configuración','Seus dados de acesso e contato.':'Tus datos de acceso y contacto.',
          'Alterar':'Cambiar','Fechar':'Cerrar','Novo e-mail':'Nuevo correo','Senha atual':'Contraseña actual','Confirme com sua senha':'Confirma con tu contraseña',
          'Cancelar':'Cancelar','Salvar':'Guardar','Salvando…':'Guardando…','Senha':'Contraseña','Use ao menos 8 caracteres, com letras e números.':'Usa al menos 8 caracteres, con letras y números.',
          'Nova senha':'Nueva contraseña','Confirmar nova senha':'Confirmar nueva contraseña','Telefone':'Teléfono','Novo telefone':'Nuevo teléfono',
          'Escolha o que você quer receber.':'Elige qué quieres recibir.','Agendamentos':'Agendamientos',
          'Confirmações e lembretes dos seus descartes.':'Confirmaciones y recordatorios de tus descartes.',
          'Novas missões e progresso das atuais.':'Nuevas misiones y progreso de las actuales.',
          'Quando você ganhar ou puder resgatar prêmios.':'Cuando ganes o puedas canjear premios.','Novidades':'Novedades',
          'Novos pontos de coleta, recursos e dicas.':'Nuevos puntos de recogida, funciones y consejos.',
          'Notificações de agendamentos':'Notificaciones de agendamientos','Notificações de missões':'Notificaciones de misiones',
          'Notificações de recompensas':'Notificaciones de recompensas','Notificações de novidades':'Notificaciones de novedades',
          'Preferências':'Preferencias','Idioma, acessibilidade e aparência.':'Idioma, accesibilidad y apariencia.','Idioma':'Idioma',
          'Idioma da interface.':'Idioma de la interfaz.','Acessibilidade':'Accesibilidad','Reduzir animações':'Reducir animaciones',
          'Minimiza transições e movimentos na tela.':'Minimiza transiciones y movimientos en pantalla.','Alto contraste':'Alto contraste',
          'Reforça textos e bordas para leitura mais fácil.':'Refuerza textos y bordes para leer más fácilmente.','Tema':'Tema',
          'Aparência do EcoClick neste navegador.':'Apariencia de EcoClick en este navegador.','☀️ Claro':'☀️ Claro','🌙 Escuro':'🌙 Oscuro',
          'Privacidade e segurança':'Privacidad y seguridad','Sessões, política e termos.':'Sesiones, política y términos.','Sessões conectadas':'Sesiones conectadas',
          'Encerrar as outras sessões':'Cerrar las otras sesiones','Política de privacidade':'Política de privacidad','Termos de uso':'Términos de uso',
          'Nenhuma configuração encontrada.':'No se encontró ninguna configuración.',
          'Notificações ativadas':'Notificaciones activadas','Notificações desativadas':'Notificaciones desactivadas','Preferência salva':'Preferencia guardada','Idioma salvo':'Idioma guardado',
          'E-mail atualizado':'Correo actualizado','Senha atualizada':'Contraseña actualizada','Telefone atualizado':'Teléfono actualizado',
          'Não foi possível salvar. Tente novamente.':'No se pudo guardar. Inténtalo de nuevo.','Sessão encerrada':'Sesión cerrada','Outras sessões encerradas':'Otras sesiones cerradas',
          'Informe sua senha atual.':'Ingresa tu contraseña actual.','Use 8+ caracteres, com letras e números.':'Usa 8+ caracteres, con letras y números.',
          'A nova senha deve ser diferente da atual.':'La nueva contraseña debe ser distinta de la actual.','As senhas não coincidem.':'Las contraseñas no coinciden.',
          'Informe um telefone com DDD.':'Ingresa un teléfono con código de área.',
          'Este dispositivo':'Este dispositivo','Ativo agora':'Activo ahora','há 2 horas':'hace 2 horas','há 3 dias':'hace 3 días','Encerrar':'Cerrar',
          'Encerrar sessão em {d}':'Cerrar sesión en {d}','Não informado':'No informado','Não cadastrado':'No registrado',
          'Menu da conta':'Menú de la cuenta','Membro EcoClick':'Miembro EcoClick','Meu perfil →':'Mi perfil →','Usuário EcoClick':'Usuario EcoClick',
          'Não lidas: {n}':'Sin leer: {n}','Marcar todas como lidas':'Marcar todas como leídas','Agora':'Ahora',
          'Seu descarte de Celulares foi confirmado para amanhã, às 10:00.':'Tu descarte de celulares quedó confirmado para mañana a las 10:00.',
          'Lembrete de descarte':'Recordatorio de descarte','Falta pouco! Seu descarte está marcado para amanhã às 10:00.':'¡Falta poco! Tu descarte está programado para mañana a las 10:00.',
          'Missão disponível':'Misión disponible','Nova missão: Convidar um amigo. Ganhe pontos extras!':'Nueva misión: Invitar a un amigo. ¡Gana puntos extra!',
          'Missão concluída':'Misión completada','Você concluiu “Visitar um ponto de coleta”. Parabéns!':'Completaste “Visitar un punto de recogida”. ¡Felicidades!',
          'Recompensa disponível':'Recompensa disponible','Você tem pontos suficientes para resgatar uma nova recompensa.':'Tienes puntos suficientes para canjear una nueva recompensa.',
          'Novidades do EcoClick':'Novedades de EcoClick','Novos pontos de coleta chegaram a Salvador. Confira no mapa!':'Llegaron nuevos puntos de recogida a Salvador. ¡Míralos en el mapa!',
          'Meu perfil':'Mi perfil','Seus dados pessoais no EcoClick.':'Tus datos personales en EcoClick.','Editar perfil':'Editar perfil','Nível':'Nivel','Pontos':'Puntos',
          'Faltam {n} pontos para o nível {m}':'Faltan {n} puntos para el nivel {m}','Nível máximo alcançado':'Nivel máximo alcanzado','Dados pessoais':'Datos personales',
          'Nome completo':'Nombre completo','Endereço':'Dirección','Rua, número, bairro, cidade':'Calle, número, barrio, ciudad','Alterar foto':'Cambiar foto','Remover foto':'Quitar foto',
          'Foto de perfil':'Foto de perfil','Perfil atualizado':'Perfil actualizado','Informe um CPF válido.':'Ingresa un CPF válido.','Imagem inválida.':'Imagen no válida.',
          'Ainda não leu nossos artigos e conteúdos? Comece agora!':'¿Aún no leíste nuestros artículos y contenidos? ¡Empieza ahora!','Descubra dicas, curiosidades e novas formas de contribuir para um futuro mais sustentável.':'Descubre consejos, curiosidades y nuevas formas de contribuir a un futuro más sostenible.','Meus conteúdos':'Mis contenidos','Conteúdos anteriores':'Contenidos anteriores','Próximos conteúdos':'Próximos contenidos','Semente':'Semilla','Broto':'Brote','Folha':'Hoja','Árvore':'Árbol','Floresta':'Bosque',
          'Perfil':'Perfil',
          'Suporte':'Soporte',
          'Gerenciar perfil':'Administrar perfil',
          'Senha e segurança':'Contraseña y seguridad',
          'Sobre nós':'Sobre nosotros',
          'Central de ajuda':'Centro de ayuda',
          'Claro':'Claro',
          'Escuro':'Oscuro',
          '{n} próximos':'{n} próximos',
          'Configurar preferências →':'Configurar preferencias →',
          'Idioma da plataforma.':'Idioma de la plataforma.',
          'Perguntas frequentes':'Preguntas frecuentes',
          'Mapa de pontos':'Mapa de puntos',
          'Agendamento de descarte':'Agendamiento de descarte',
          'Missões e recompensas':'Misiones y recompensas',
          'Próximos':'Próximos',
          'Anteriores':'Anteriores',
          'Você ainda não tem agendamentos.':'Aún no tienes agendamientos.',
          'Confirmado':'Confirmado',
          'Cancelado':'Cancelado',
          'Material':'Material',
          'Horário':'Horario',
          'Protocolo':'Protocolo',
          'Cancelar agendamento':'Cancelar agendamiento',
          'Confirmar cancelamento':'Confirmar cancelación',
          'Agendamento cancelado':'Agendamiento cancelado',
          'Olá, {n}':'Hola, {n}',
          'Olá!':'¡Hola!',
          'Impacto ambiental':'Impacto ambiental',
          'itens destinados corretamente':'artículos desechados correctamente',
          'Próximo agendamento':'Próximo agendamiento',
          'Nenhum agendamento':'Sin agendamientos',
          'Ver agendamentos →':'Ver agendamientos →',
          'Ver perfil':'Ver perfil',
          'pontos':'puntos',
          'Resumo':'Resumen',
          'Editar perfil →':'Editar perfil →',
          'Tire dúvidas e veja respostas rápidas sobre o EcoClick.':'Resuelve dudas y mira respuestas rápidas sobre EcoClick.',
          'Abrir Central de ajuda →':'Abrir Centro de ayuda →',
          'Segurança':'Seguridad',
          'O EcoClick conecta pessoas a pontos de coleta de lixo eletrônico, para que o descarte correto seja simples e acessível.':'EcoClick conecta a las personas con puntos de recogida de residuos electrónicos, para que el descarte correcto sea simple y accesible.',
          'Encontre o ponto mais próximo no mapa, agende seu descarte, cumpra missões e ganhe recompensas por cuidar do planeta.':'Encuentra el punto más cercano en el mapa, agenda tu descarte, cumple misiones y gana recompensas por cuidar el planeta.',
          'Nosso objetivo é reduzir o impacto do lixo eletrônico e construir uma comunidade mais sustentável, começando por Salvador.':'Nuestro objetivo es reducir el impacto de los residuos electrónicos y construir una comunidad más sostenible, empezando por Salvador.',
          'Como agendo um descarte?':'¿Cómo agendo un descarte?',
          'No Dashboard, escolha um ponto no mapa, toque em “Agendar descarte →”, informe seus dados, o material e um horário disponível.':'En el Dashboard, elige un punto en el mapa, toca “Agendar descarte →”, ingresa tus datos, el material y un horario disponible.',
          'Quais materiais posso levar?':'¿Qué materiales puedo llevar?',
          'Cada ponto informa os materiais aceitos, como celulares, computadores, pilhas, baterias, cabos e eletrodomésticos. Confira no card do ponto.':'Cada punto indica los materiales aceptados, como celulares, computadoras, pilas, baterías, cables y electrodomésticos. Revisa la tarjeta del punto.',
          'Como cancelo um agendamento?':'¿Cómo cancelo un agendamiento?',
          'Em Perfil, abra Agendamentos, selecione o agendamento e toque em “Cancelar agendamento”.':'En Perfil, abre Agendamientos, selecciona el agendamiento y toca “Cancelar agendamiento”.',
          'Como funcionam os pontos e os níveis?':'¿Cómo funcionan los puntos y los niveles?',
          'Você acumula pontos ao concluir descartes e missões e sobe de nível conforme sua pontuação.':'Acumulas puntos al completar descartes y misiones y subes de nivel según tu puntuación.',
          'Como mudo o idioma ou o tema?':'¿Cómo cambio el idioma o el tema?',
          'Em Perfil, abra Idioma ou Tema. A escolha fica salva neste navegador.':'En Perfil, abre Idioma o Tema. Tu elección queda guardada en este navegador.'
        }
      };
      var RULES = [
        [/^Slide (\d+) de (\d+)$/, { en:'Slide $1 of $2', es:'Diapositiva $1 de $2' }],
        [/^Ir para o slide (\d+)$/, { en:'Go to slide $1', es:'Ir a la diapositiva $1' }],
        [/^Ponto de coleta (\d+)$/, { en:'Collection point $1', es:'Punto de recogida $1' }]
      ];
      var LANGS = ['pt-BR', 'en', 'es'];
      var lang = 'pt-BR';

      function t(key, vars){
        var out = key;
        if(lang !== 'pt-BR'){
          var d = DICT[lang];
          if(d && d[key] != null) out = d[key];
          else for(var i = 0; i < RULES.length; i++){ if(RULES[i][0].test(key)){ out = key.replace(RULES[i][0], RULES[i][1][lang]); break; } }
        }
        if(vars) out = out.replace(/\{(\w+)\}/g, function(m, k){ return vars[k] != null ? vars[k] : m; });
        return out;
      }
      function fmtHour(hhmm){
        var p = hhmm.split(':'), h = +p[0], m = p[1];
        if(lang === 'en'){ var ap = h >= 12 ? 'PM' : 'AM', h12 = h % 12 || 12; return h12 + (m === '00' ? '' : ':' + m) + ' ' + ap; }
        if(lang === 'es') return h + ':' + m;
        return h + 'h' + (m === '00' ? '' : m);
      }
      function fmtRange(a, b){
        if(lang === 'en') return fmtHour(a) + ' – ' + fmtHour(b);
        if(lang === 'es') return fmtHour(a) + ' a ' + fmtHour(b);
        return fmtHour(a) + ' às ' + fmtHour(b);
      }

      var ATTRS = ['placeholder', 'aria-label', 'title'];
      function applyDom(){
        var w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null), n, nodes = [];
        while((n = w.nextNode())) nodes.push(n);
        nodes.forEach(function(node){
          var p = node.parentNode; if(!p) return;
          var tag = p.nodeName; if(tag === 'SCRIPT' || tag === 'STYLE' || tag === 'OPTION' || tag === 'TEXTAREA') return;
          if(p.closest && p.closest('[data-no-i18n]')) return;
          if(node.__src === undefined) node.__src = node.nodeValue;
          var m = node.__src.match(/^(\s*)([\s\S]*?)(\s*)$/);
          if(!m[2]) return;
          node.nodeValue = m[1] + t(m[2]) + m[3];
        });
        Array.prototype.forEach.call(document.querySelectorAll('[placeholder],[aria-label],[title]'), function(el){
          if(el.closest('.svgmap')) return;
          el.__o = el.__o || {};
          ATTRS.forEach(function(a){
            if(!el.hasAttribute(a)) return;
            if(!(a in el.__o)) el.__o[a] = el.getAttribute(a);
            el.setAttribute(a, t(el.__o[a]));
          });
        });
      }
      function stored(){
        try{ var l = JSON.parse(localStorage.getItem('ecoclick_settings') || '{}').preferences.language; return LANGS.indexOf(l) !== -1 ? l : 'pt-BR'; }
        catch(e){ return 'pt-BR'; }
      }
      function setLang(l){
        if(LANGS.indexOf(l) === -1) l = 'pt-BR';
        lang = l;
        document.documentElement.setAttribute('lang', l);
        applyDom();
        document.dispatchEvent(new CustomEvent('ecoclick:lang-change', { detail:{ lang:l } }));
      }
      window.EcoI18n = {
        t:t, setLang:setLang, stored:stored, fmtHour:fmtHour, fmtRange:fmtRange,
        get lang(){ return lang; }
      };
      lang = stored();
      document.documentElement.setAttribute('lang', lang);
      if(lang !== 'pt-BR') applyDom();
    })();
  