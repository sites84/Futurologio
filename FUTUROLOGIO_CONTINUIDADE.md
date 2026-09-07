# FUTUROLOGIO™ — PONTO DE CONTINUIDADE

> Documento de retomada para novos chats. Atualizado em 2026-09-07.

## 1. Identidade do projeto

**FUTUROLOGIO™** = “Museu de coisas que nunca existiram”. É uma rede social/museu de invenções inexistentes, com perfil individual, criação de produtos, catálogo, curtidas, comentários, compartilhamentos, XP, níveis, medalhas e planos.

Repositório: `sites84/Futurologio`
Branch principal: `main`
Site: `https://sites84.github.io/Futurologio/`
Worker: `https://motor-invencoes.edsonfernandesvet.workers.dev`

## 2. Regra central de invenções

Tecnologias existentes podem ser usadas como base, mas o produto final precisa fazer algo que não existe hoje.

Pipeline desejado:
`GERADOR → VALIDADOR → DUPLICATE CHECK → APPROVED / DISCARD → SAVE`

A biblioteca não deve criar “o mesmo produto com pequena variação”. Se uma família semântica já existe, não criar uma variante disfarçada.

Estratégia de escala aprovada: biblioteca de produtos de alta qualidade + validador semântico, em vez de combinações cartesianas artificiais.

## 3. Categorias oficiais — 26

1. Casa
2. Comida & Cozinha
3. Transporte
4. Moda
5. Animais
6. Tecnologia
7. Mente & Comportamento
8. Meio Ambiente
9. Escola & Trabalho
10. Espaço
11. Sem sentido
12. Tecnologia do futuro
13. Indústria
14. Esportes
15. Entretenimento
16. Dinheiro & Negócios
17. Cidade
18. Agricultura
19. Viagem
20. Comunicação
21. Energia
22. Tempo & Clima
23. Objetos pessoais
24. Lazer
25. Museu
26. Bizarro ou Nojento

O botão público principal deve ser exatamente: **CRIAR MEU PRODUTO**.
Não usar “Surpresa Total”.

## 4. Catálogo atual

Existem **139 produtos** nos lotes atuais:
- Biblioteca 1: 84 produtos
- Biblioteca 2: 55 produtos
- Total: 139
- Duplicatas exatas de título entre os dois lotes: 0

O catálogo estruturado está em `catalog.json` e o `index.html` ainda contém o catálogo incorporado para o frontend.

O catálogo foi sincronizado para o D1 durante o workflow de deploy. O último workflow relevante teve sucesso, incluindo a etapa `Seed 139-product catalog from frontend`.

Os produtos de catálogo não devem ser confundidos com criações pessoais dos usuários. `INVENTIONS` funciona como registro central; `USER_INVENTIONS` registra quem criou/usou aquela invenção.

## 5. Frontend atual

Arquivos principais:
- `index.html`
- `catalog.json`
- `frontend/auth-gate.js`
- `frontend/social.js`
- `frontend/profile-panel.js`
- `frontend/auth-social-bridge.js`

O frontend já foi corrigido para:
- carregar o catálogo;
- usar as 26 categorias oficiais;
- impedir repetição local de famílias/produtos;
- exigir autenticação para criação social/backend;
- reservar a criação via `/api/consume-creation`;
- registrar a criação via `/api/record-creation`;
- guardar/montar o ID D1 da invenção para ações sociais;
- integrar perfil/social com o Worker.

Antes de novas alterações, verificar os arquivos atuais no GitHub em vez de confiar em versões antigas do chat.

## 6. Backend atual

Arquivos principais:
- `backend/worker.js`
- `backend/roles.js`
- `backend/schema.sql`
- `backend/migrations/0001_social.sql`
- `backend/migrations/0002_auth.sql`
- `backend/seed.sql`
- `backend/wrangler.toml`
- `.github/workflows/deploy-worker.yml`
- `.github/workflows/validate-backend.yml`

D1:
- nome: `futurologio`
- binding: `DB`
- database_id atual: `da4de59f-2f02-434c-a10f-d9d1a5262e95`

O Worker usa `SESSION_SECRET` como secret e o workflow preserva o secret existente ou gera um novo quando necessário.

## 7. Schema social

`0001_social.sql` cria:
- USERS
- INVENTIONS
- USER_INVENTIONS
- COMMENTS
- LIKES
- SHARES
- XP_EVENTS
- BADGES
- USER_BADGES
- SUBSCRIPTIONS
- CREDIT_PURCHASES

Também existem índices para usuário, comentários, compartilhamentos, XP e categoria.

`0002_auth.sql` foi corrigido para não recriar `password_hash`, pois essa coluna já é criada por `0001_social.sql`.

## 8. Autenticação

Cadastro normal:
- username
- email
- password

Senha armazenada com PBKDF2-SHA-256 no Worker.

Login: `/api/auth/login`
Cadastro: `/api/auth/register`
Sessão: Bearer token assinado com HMAC usando `SESSION_SECRET`.
Perfil atual: `/api/me` e `/api/profile`.

Google Sign-In:
- rota backend `/api/auth/google` já existe;
- backend valida `id_token` com Google tokeninfo;
- `GOOGLE_CLIENT_ID` é opcional no workflow neste momento;
- ainda falta configurar o Client ID do projeto Google para o Sign-In real no frontend/backend.

Não pedir ao usuário para colar tokens secretos no chat.

## 9. Planos e limites

Valores definidos pelo projeto:
- Free: 3 criações/dia
- Basic: 5 criações/dia
- Advanced: 10 criações/dia

Além da franquia diária, existem créditos extras compráveis em quantidade escolhida pelo usuário.

Créditos pagos são separados de XP.

Ainda faltam pagamentos reais/checkout e mecanismo de confirmação de compra.

## 10. XP

Configuração atual em `backend/roles.js`:
- criação: 10 XP
- curtida: 2 XP
- comentário: 3 XP
- compartilhamento: 2 XP

Esses valores são provisórios e podem ser ajustados posteriormente.

Limites diários de XP social:
- curtidas que geram XP: 5/dia
- comentários que geram XP: 5/dia
- compartilhamentos que geram XP: 10/dia

O usuário pode continuar curtindo/comentando/compartilhando depois do limite; simplesmente não ganha XP adicional por essas ações.

Anti-abuso atual:
- XP de curtida não é concedido novamente para a mesma referência pelo mesmo usuário;
- XP de compartilhamento não é concedido novamente para a mesma referência pelo mesmo usuário;
- comentários têm limite diário de XP;
- compartilhamentos têm limite diário de XP e controle de repetição por plataforma/invenção no mesmo dia.

Plataformas de compartilhamento desejadas:
- WhatsApp
- Facebook
- X
- Instagram
- Threads
- Copiar link
- compartilhamento nativo/outros quando disponível

## 11. Níveis, cargos e medalhas

Fórmula atual provisória:
`level = floor(xp / 100) + 1`

Cargos principais a cada 5 níveis:
- 1 Curioso Iniciante
- 5 Criança Curiosa
- 10 Inventor Aprendiz
- 15 Mestre Inventor
- 20 Cientista do Absurdo
- 25 Mestre do Futuro
- 30 Visionário
- 35 General da Invenção
- 40 Criador do Impossível
- 45 Arquiteto do Universo
- 50 Criador do Universo

A cada 5 níveis há medalha. O backend possui `medalLevels()`.

Avatar evolutivo atual é um placeholder visual por nível; depois devem ser criados avatares/acessórios reais.

## 12. Badges atuais

Seed atual:
- FIRST_CREATION — Primeira Invenção
- TEN_CREATIONS — Dez Invenções
- FIFTY_CREATIONS — Cinquenta Invenções
- FIRST_LIKE — Primeira Curtida
- HUNDRED_LIKES_RECEIVED — Cem Curtidas
- FIRST_COMMENT — Primeiro Comentário
- FIFTY_COMMENTS — Cinquenta Comentários
- FIRST_SHARE — Primeiro Compartilhamento
- FIFTY_SHARES — Cinquenta Compartilhamentos
- CATEGORY_EXPLORER — Explorador de Categorias
- MULTICATEGORY_CREATOR — Criador Multicategoria
- BIZARRO_EXPLORER — Explorador do Bizarro

## 13. Fluxo de criação que precisa ser fechado/testado

Fluxo-alvo:
1. usuário abre site;
2. seleciona categoria;
3. clica `CRIAR MEU PRODUTO`;
4. autenticação é exigida;
5. backend reserva uma criação com `/api/consume-creation`;
6. frontend seleciona/exibe produto;
7. `/api/record-creation` registra a invenção e vincula ao usuário;
8. criação gera XP;
9. badges são avaliados;
10. perfil é atualizado;
11. usuário pode curtir, comentar e compartilhar;
12. ações sociais atualizam XP respeitando limites;
13. perfil mostra nível, XP, medalhas, estatísticas e criações.

Essa cadeia deve ser testada ponta a ponta antes de avançar para pagamentos ou refinamentos visuais.

## 14. Pontos técnicos que ainda precisam de verificação/correção

1. Fazer teste real do fluxo criação → D1 → XP → perfil.
2. Fazer teste real de like/comment/share com ID numérico D1.
3. Verificar que `frontend/auth-gate.js` salva corretamente o ID D1 retornado por `record-creation`.
4. Verificar que `frontend/social.js` não usa IDs locais de catálogo nas chamadas sociais.
5. Verificar export de `medalLevels` em `roles.js` (o Worker importa essa função).
6. Corrigir/confirmar badge `HUNDRED_LIKES_RECEIVED`: ele deve ser concedido ao dono da invenção que recebeu 100 curtidas, não ao usuário que apenas executou uma ação de XP.
7. Testar limites Free/Basic/Advanced e créditos extras.
8. Testar rollover/reset diário.
9. Testar cadastro/login em navegador real.
10. Finalizar Google Sign-In quando houver Client ID.
11. Implementar compras/assinaturas reais depois que o fluxo básico estiver estável.
12. Implementar perfis públicos e avatares reais.
13. Implementar validador semântico global para impedir invenções idênticas/variações.
14. Melhorar o workflow de deploy para não criar automaticamente outro D1 caso `futurologio` não seja encontrado; o ideal é falhar claramente.

## 15. Regras de conteúdo do produto

Cada produto deve ter, em princípio:
- nome
- subtítulo
- NÃO EXISTE
- prontidão tecnológica
- ano estimado
- patente
- O que é?
- Tecnologias existentes hoje
- Tecnologias especulativas
- Tecnologias inventadas
- Como seria construído?
- Usos recomendados
- Perigos e limitações
- Resultado dos testes
- Curiosidade
- Índice de realidade

As três camadas tecnológicas devem permanecer separadas:
- existentes hoje = ciência/tecnologia real atual;
- especulativas = extrapolação hipotética baseada em ciência real;
- inventadas = ficção do FUTUROLOGIO, explicitamente inexistente.

O texto deve ser curto o suficiente para não ficar cansativo. “O que é?” é a parte mais importante e deve explicar o que o produto realmente faz.

## 16. Histórico importante

Foram abandonadas abordagens que geravam milhares de variações artificiais por combinação de palavras. O projeto deve privilegiar invenções semanticamente distintas e de qualidade.

O sistema de família local foi usado para impedir que, por exemplo, uma família como VENTOCOFRE ou NUVICIDA aparecesse novamente com pequenas alterações.

## 17. Segurança operacional

O usuário possui secrets no GitHub para Cloudflare:
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

Nunca expor ou solicitar novamente o valor do token no chat.

## 18. Último deploy conhecido

Workflow: `Deploy FUTUROLOGIO Worker`
Último deploy verificado: sucesso.
O workflow executou com sucesso:
- checkout
- secrets check
- Wrangler
- resolução do D1
- migrations
- seed de badges
- seed dos 139 produtos
- preservação do SESSION_SECRET
- deploy do Worker
- verificação live da API

## 19. Próxima tarefa prioritária

**Não começar por Google ou pagamentos.**

Primeiro fechar e testar completamente:
`CADASTRO → CRIAR → RESERVAR CRÉDITO → REGISTRAR INVENÇÃO → XP → BADGE → PERFIL → LIKE → COMENTÁRIO → SHARE`.

Depois corrigir qualquer falha encontrada e só então avançar para:
1. Google Sign-In;
2. perfis públicos;
3. catálogo social completo;
4. validador semântico;
5. planos/pagamentos/créditos;
6. refinamento visual e avatares.

## 20. Como retomar em outro chat

Mensagem recomendada:

> “Continuar o FUTUROLOGIO pelo arquivo FUTUROLOGIO_CONTINUIDADE.md do repositório sites84/Futurologio. Primeiro verifique o estado atual no GitHub e continue pela próxima tarefa prioritária. Não me peça para repetir decisões já registradas; só pare se houver algo que realmente não possa ser resolvido.”

Ao retomar, sempre consultar o repositório atual antes de assumir que o estado do código é o mesmo descrito aqui.
