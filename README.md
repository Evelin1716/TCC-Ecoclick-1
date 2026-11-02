# EcoClick (TCC)

Site de descarte correto de eletrônicos: pontos de coleta, agendamento, missões, recompensas, conteúdos e comunidade.

- **Frontend:** HTML, CSS e JavaScript puros (sem build), em `frontend/`.
- **Backend:** Node.js + Express, em `backend/`. Também serve o frontend.
- **Banco:** PostgreSQL com Prisma (`prisma/schema.prisma`).

> **Estado dos testes (leia antes de usar):** o frontend foi testado em navegador real (Chromium) contra um servidor de teste que imita a API.
> O backend Express + Prisma foi escrito e teve a **sintaxe verificada**, mas **ainda não foi executado contra um PostgreSQL real**
> (o ambiente onde foi gerado não tinha internet nem banco). Siga os passos abaixo e use a seção
> [Checklist da primeira execução](#checklist-da-primeira-execução) para validar na sua máquina.

## Pré-requisitos

- [Node.js](https://nodejs.org) 18.18 ou superior (`node -v`)
- [PostgreSQL](https://www.postgresql.org/download/) 14 ou superior, com um banco vazio criado (ex.: `ecoclick`)
- VS Code (extensão recomendada: *Prisma*)

## Instalação e execução

```bash
# 1. dependências (também gera o Prisma Client)
npm install

# 2. configuração
cp .env.example .env          # no Windows (PowerShell): copy .env.example .env
#    edite o .env: DATABASE_URL e JWT_SECRET são obrigatórios
#    gerar um JWT_SECRET:  node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"

# 3. tabelas e dados iniciais
npx prisma migrate dev --name init     # cria as tabelas
npm run db:seed                        # pontos, materiais, recompensas, conteúdos e missões

# 4. subir tudo
npm run dev                            # http://localhost:3000  (site + API)
```

Atalho para os passos 1 e 3: `npm run setup` (depois de criar o `.env`).

Abra **http://localhost:3000**. Verificação rápida da API: http://localhost:3000/api/health.

### Scripts (`npm run …`)

| Script | O que faz |
|---|---|
| `dev` | Servidor com reinício automático (nodemon) |
| `start` | Servidor para produção |
| `frontend` | Só o frontend em http://localhost:5500 (a API precisa estar rodando na porta 3000; o `.env` já libera essa origem) |
| `dev:all` | API e frontend separados ao mesmo tempo |
| `db:migrate` / `db:deploy` | Aplica migrações (desenvolvimento / produção) |
| `db:seed` | Carrega os catálogos iniciais (pode repetir sem duplicar) |
| `db:studio` | Interface visual do banco |
| `check` | Verificação estática: sintaxe, caminhos de HTML/CSS, links entre páginas, sementes |

## Estrutura

```text
TCC-Ecoclick/
├── frontend/
│   ├── index.html                 página inicial
│   ├── pages/                     login, cadastro, dashboard, perfil, configuracoes, pontos-coleta, agendamentos,
│   │                              materiais, jornada, missoes, progresso, recompensas, conteudos, comunidade,
│   │                              privacidade, termos (+ progresso-embed.html, usada dentro de "Meu progresso")
│   ├── css/  style.css · components.css · themes.css · components/ · pages/<página>/
│   ├── js/   config.js · api.js · main.js · page-context.js · components/ · pages/<página>/
│   └── assets/  images/ · icons/ · fonts/
├── backend/  server.js · app.js · routes/ · controllers/ · services/ · middlewares/ · config/ · utils/
├── prisma/   schema.prisma · seed.js · seed-data/*.json
├── scripts/check-project.js
├── package.json · .env.example · .gitignore · README.md
```

### Como as páginas se relacionam

O projeto original era um arquivo único com 7 páginas dentro de iframes. Agora cada tela é um arquivo próprio.
Várias páginas usam o mesmo painel (o "dashboard") abrindo direto em uma seção, definida por atributos `data-*` no `<html>`:

| Página | Conteúdo |
|---|---|
| `dashboard.html` | Painel principal |
| `perfil.html`, `configuracoes.html`, `agendamentos.html`, `progresso.html`, `recompensas.html`, `conteudos.html` | Painel aberto na seção correspondente |
| `pontos-coleta.html` | Painel rolado até o mapa de pontos |
| `jornada.html`, `missoes.html` | Página de jornada/missões, abrindo na tela "Jornada" ou "Missões" |
| `materiais.html` | **Nova.** Lista os materiais do banco e como prepará-los |

Os links entre páginas passam por `frontend/js/main.js` (tabela `ROUTES`). Páginas protegidas (`data-eco-protected`) redirecionam para o login e voltam à página pedida depois do acesso.

## Como os dados são salvos

- **Sessão:** cookie `httpOnly` com JWT (o JavaScript da página nunca vê o token). Senhas com bcrypt. Proteção contra CSRF por cabeçalho `X-Requested-With` + `SameSite=Lax`. Limite de tentativas em login/cadastro/recuperação.
- **Dados de interface** (configurações, favoritos, notificações, estado de missões/jornada, rascunhos…): as telas continuam lendo e gravando no `localStorage` como cache; `frontend/js/api.js` envia cada alteração ao servidor (tabela `AppData`) e recarrega do servidor ao abrir cada página, inclusive em outro aparelho.
- **Decididos só pelo servidor** (o navegador não consegue forjar): conta e senha, saldo de pontos (livro-razão `PointLedger`), validação de descartes, **horários lotados** (restrição única no banco), resgates de recompensas (transação com trava), autoria na comunidade.
- **Catálogos no banco:** pontos de coleta, materiais, recompensas, conteúdos e missões (`prisma/seed-data`, extraídos do código original).

## Pontos de coleta — dados a verificar

Os 16 pontos vêm de uma pesquisa na internet feita no projeto original e **não foram confirmados**: só 2 têm horário informado e as posições no mapa de 6 deles são aproximadas (`geoApprox`). Nenhum ponto, horário ou disponibilidade foi inventado. Antes de publicar, confirme cada ponto e atualize pelo Prisma Studio ou pela API de administrador (`POST/PATCH/DELETE /api/points`).
Quando um ponto não tem horário verificado, o servidor não restringe o dia/horário do agendamento (só impede dois agendamentos no mesmo horário).

## Papéis e validação de descartes

O usuário registra o descarte no site (fica "aguardando validação"). Os **pontos só entram depois que a equipe do ponto valida**:

1. Crie o usuário normalmente pelo site.
2. No Prisma Studio, mude `User.role` para `OPERATOR` e crie uma linha em `PointOperator` ligando o usuário ao ponto (ou use `ADMIN`, que valida qualquer ponto). Para criar o primeiro administrador, preencha `SEED_ADMIN_EMAIL` e `SEED_ADMIN_PASSWORD` no `.env` antes do seed.
3. Listar pendentes: `GET /api/appointments/pending`. Validar: `POST /api/appointments/:id/validate` com `{ "approve": true, "points": 40 }` (ou `"approve": false`).

Não existe, no código original, uma regra de quantos pontos vale cada item. Por isso quem valida informa os pontos. **Ainda não há tela para a equipe validar:** hoje isso é feito pela API (por exemplo com um cliente HTTP).

## API (resumo)

Todas as rotas começam com `/api`. Pedidos que alteram dados precisam do cabeçalho `X-Requested-With: EcoClick` (o frontend já envia).

| Área | Rotas |
|---|---|
| Conta | `POST /auth/signup` · `POST /auth/login` · `POST /auth/logout` · `GET /auth/me` · `POST /auth/logout-others` · `POST /auth/reset` · `POST /auth/reset/confirm` · `PATCH /me/email` · `PATCH /me/password` · `GET /me/export` · `DELETE /me` |
| Dados do usuário | `GET/PUT /appdata` |
| Catálogos (públicos) | `GET /points` · `GET /points/:id` · `GET /materials` · `GET /rewards` · `GET /missions` · `GET /contents` · `GET /contents/:id` |
| Pontos (admin) | `POST /points` · `PATCH /points/:id` · `DELETE /points/:id` (desativa) |
| Agendamentos | `GET /appointments` · `PUT /appointments/:id` · `GET /appointments/taken?pointId&date` · `GET /appointments/pending` · `POST /appointments/:id/validate` |
| Pontos e recompensas | `GET /progress/balance` · `GET /redemptions` · `POST /rewards/redeem` |
| Comunidade | `GET /community/:posts\|stories` · `GET/PUT/DELETE /community/:col/:id` |

## O que depende de configuração externa

- **PostgreSQL** e `DATABASE_URL`, `JWT_SECRET` no `.env` (obrigatórios).
- **Recuperação de senha por e-mail:** precisa de um servidor SMTP (`SMTP_*` no `.env`). Sem ele, em desenvolvimento, o link aparece no console do servidor.
- **HTTPS em produção:** use `COOKIE_SECURE=true` e coloque o app atrás de um proxy HTTPS.
- **Fontes (Google Fonts) e geocodificação de endereços (OpenStreetMap/Nominatim):** exigem internet no navegador; o site funciona sem elas, com fontes do sistema e posições já cadastradas.
- A pasta `frontend/assets/fonts` está vazia: o projeto original usava Google Fonts.

## Limitações conhecidas

- O **cálculo de XP, níveis, selos e progresso das missões roda no navegador** (como no projeto original) e é apenas guardado no servidor. Uma pessoa técnica pode alterá-lo no próprio navegador. Saldo de pontos e resgates não sofrem disso, porque só o servidor os controla. Mover as regras de XP para o servidor é o próximo passo natural.
- Os dados de conteúdo lidos (artigos lidos, favoritos) ficam em `AppData`; não há tabela de progresso por conteúdo.
- A lista "Sessões ativas" em Configurações mostra só o aparelho atual (o código original tinha exemplos fictícios, que não são exibidos com o servidor ligado). "Sair dos outros aparelhos" funciona de verdade.
- `missoes.html` e `jornada.html` agora exigem login (antes abriam sem login, mas sem salvar nada).
- Não há testes automatizados dentro do projeto; `npm run check` faz a verificação estática.

## Checklist da primeira execução

1. `npm install` termina sem erro e `npx prisma generate` roda.
2. `npx prisma migrate dev --name init` cria as tabelas; `npm run db:seed` mostra "16 pontos, 5 materiais, 8 recompensas, 8 conteúdos, 46 missões".
3. `npm run dev` abre sem erro de `.env`; http://localhost:3000/api/health responde `{"ok":true,…}`.
4. Em http://localhost:3000: criar conta → cai no dashboard → recarregar mantém o login.
5. Abrir `pontos-coleta.html`: o mapa lista os pontos vindos de `/api/points`.
6. Com duas contas, agendar o mesmo ponto/dia/horário: a segunda recebe "Horário lotado".
7. Sair e entrar de novo: favoritos, configurações e agendamentos voltam.
8. `npm run check` termina com "Tudo certo."

Se algo falhar nesse checklist, o erro estará no console do servidor (rotas e serviços em `backend/`).
