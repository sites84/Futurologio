# FUTUROLOGIO — CONTEXTO DE CONTINUIDADE DO PROJETO

> **Arquivo de continuidade para o próximo chat.** Leia este arquivo antes de fazer qualquer alteração no projeto.
>
> **Regra principal do usuário:** quando for solicitada uma implementação, implementar diretamente no repositório. Não parar para explicar o que será feito. Só interromper se houver um bloqueio real que não possa ser resolvido sozinho. Antes de informar que uma tarefa terminou, verificar o código e os workflows/deploys quando aplicável.

## 1. Projeto

- Projeto: **FUTUROLOGIO**
- Conceito: **“Museu de coisas que nunca existiram”**.
- Site: https://sites84.github.io/Futurologio/
- Repositório: `sites84/Futurologio`
- Branch principal: `main`
- Worker/API: `https://motor-invencoes.edsonfernandesvet.workers.dev`
- O projeto é uma plataforma social de invenções fictícias/bizarras, com criação, catálogo, perfis, curtidas, comentários, compartilhamento, XP, níveis, medalhas, créditos e planos.

## 2. Regra de trabalho obrigatória

O usuário prefere **implementação e verificação**, não explicações intermediárias.

Quando o usuário pedir uma alteração:
1. localizar o código atual no GitHub;
2. fazer a alteração diretamente;
3. preservar as funcionalidades existentes;
4. validar o código;
5. verificar o workflow/deploy correspondente;
6. somente então informar que terminou.

Não dizer “não consegui” por problemas que possam ser corrigidos autonomamente. Se houver erro, corrigir e testar novamente.

### Aviso sobre encerramento/duração do chat
O usuário pediu para ser avisado antes de o chat acabar por limite de duração. **Não há um mecanismo confiável disponível para prever exatamente quando a sessão/conversa atingirá esse limite.** Portanto, não prometer um aviso exato. A solução prática é manter este arquivo de continuidade atualizado sempre que houver uma etapa importante do projeto, para que um novo chat possa continuar daqui.

## 3. Arquivo que NÃO deve ser alterado

### `frontend/creation-prompt-v2.js`

O usuário determinou explicitamente:
> “Tudo certo nesta parte do prompt, não mexa mais”.

**Não modificar este arquivo**, salvo se o usuário pedir explicitamente.

## 4. Estado atual do catálogo

Catálogo oficial/base:
- Biblioteca 1: 84 produtos
- Biblioteca 2: 55 produtos
- Base original: **139 produtos**
- Não há títulos duplicados na base original.

Lotes adicionais:
- `lote3-001` a `lote3-080`: 80 produtos criados em lotes anteriores do chat.
- `lote3-081` a `lote3-130`: 50 produtos do DOCX Vol. 2.
- `lote3-131` a `lote3-180`: 50 produtos da **Biblioteca Futurologio 4**.

Total pretendido:
**139 + 80 + 50 + 50 = 319 produtos.**

Arquivo de origem da Biblioteca 4 usado anteriormente:
`/mnt/data/b4/Biblioteca futurologio 4.docx`

Esse DOCX contém 50 invenções, com campos ricos como:
- what
- realTech
- specTech
- inventedTech
- build
- uses
- dangers
- curiosity
- tests

O catálogo da Biblioteca 4 foi estruturado em `catalog-lote17.json`.

### Loader do catálogo
`frontend/catalog-lote2-loader.js`

- carrega os JSONs suplementares;
- usa limiar de prontidão `additions.length >= 164`;
- deve continuar tratando os produtos suplementares sem quebrar o catálogo original.

### Colisão conhecida de IDs
`catalog-lote8.json` e `catalog-lote9.json` possuem colisões nos IDs 029–036. A lógica de deduplicação/ordem existente deve ser preservada e revisada se o catálogo voltar a apresentar problemas.

### Contagem administrativa
A contagem correta deve considerar os JSONs simples do catálogo e deduplicar IDs.

Arquivos relevantes:
- `catalog.json`
- `catalog-lote3.json` até `catalog-lote9.json`
- `catalog-lote11.json` até `catalog-lote17.json`
- `catalog-lote16-02.json` até `catalog-lote16-07.json`

**Não contar o arquivo comprimido do lote 2 separadamente**, porque `catalog.json` já contém a base original/Biblioteca 2.

## 5. Correção recente: perfil do criador da invenção

Problema relatado pelo usuário:
> Ao clicar em “Ver perfil” na página de um produto, estava indo para o próprio perfil do usuário logado em vez do perfil do criador daquela invenção.

Correções feitas:

### `frontend/recent-creations-v2.js`
Os links das invenções agora carregam o ID do criador quando disponível:
`&creator=<x.user_id>`

Último commit dessa alteração:
`bfa575652517bfebb862377c78c3b22830911596`

Content SHA:
`eecaf815b443e8004fb130ec8f162037f8d07710`

### `frontend/home-upgrades-v1.js`
Os links de invenções/ranking também carregam:
`&creator=<x.user_id>`

Os botões de perfil do ranking também usam o usuário correto.

Último commit dessa alteração:
`d4144c030a95920e3185f5e0233e8c6ee077e278`

Content SHA:
`fa917e2015cacd5f117204cc05207d2eb0ecfb5a`

### `frontend/product-social-v1.js`
A resolução do criador foi reforçada. A ordem atual procura:
1. parâmetro `creator` da URL;
2. `d.user_id`;
3. `d.creator_id`;
4. `d.author_id`;
5. `d.owner_id`;
6. `d.owner_user_id`;
7. `d.created_by`;
8. IDs dentro de objetos `user`, `creator`, `author`, `owner`;
9. campos equivalentes do produto;
10. fallback em `/api/recent-creations?limit=200`, procurando a invenção pelo ID.

O botão gerado é:
`Ver perfil de @...`

e aponta para:
`profile.html?user=<creatorId>`

Último commit:
`1f5fa99067e13a89c450cf41272403f944a36394`

Content SHA:
`3555c18d8141539ef038b3c1dafb6974c0744f00`

### Validação/deploy dessa correção
- Workflow **Validate frontend**: run `34701174980` — sucesso.
- Workflow **pages build and deployment**: run `34701174293` — build/deploy com sucesso.

### Possível ponto futuro
Se o erro de perfil voltar somente em produtos antigos, compartilhados ou acessados por uma origem diferente dos cards já corrigidos, verificar a resposta do endpoint `/api/inventions/:id`. O backend deve idealmente sempre devolver o ID do criador (`user_id` ou equivalente), em vez de depender do fallback de recentes.

## 6. Comentários e social

### Página principal
`index.html` carrega:
- `frontend/auth-gate.js`
- `frontend/recent-creations-v2.js`
- `frontend/home-social.js`
- outros módulos da home.

`frontend/home-social.js` publica comentários em:
`POST /api/inventions/:id/comment`
com bearer token.

### Problema de rerender dos comentários
`frontend/recent-creations-v2.js` antes rerenderizava os cards a cada 3 segundos, destruindo o formulário de comentário e causando problemas especialmente no teclado/mobile.

Correção feita no commit:
`9560675820b1bad7af3ec1cd4d6774f835e00b7d`

A lógica passou a evitar rerender quando a assinatura dos dados não mudou, atualizando somente o necessário.

### Produto
`frontend/product-social-v1.js` é carregado em `criar.html`.

A autenticação/comentários foi ajustada para evitar loop de login/logout:
- `requireLogin()` abre login quando necessário;
- `handle401()` usa `window.openAuth?.('login')`;
- **não deve limpar a sessão automaticamente ao receber 401**.

Endpoints usados:
- `POST /api/inventions/:id/comment`
- `POST /api/inventions/:id/like`

## 7. Ranking “Mais curtidas”

Regra definida pelo usuário:
> A sessão de mais curtidas deve mostrar somente quatro produtos inicialmente e o botão “Mostrar mais” abaixo.

Arquivo:
`frontend/home-upgrades-v1.js`

Estado atual:
- `shown = 4`
- mostra 4 inicialmente;
- cada clique em “Mostrar mais” acrescenta mais 4;
- botão desaparece quando não há mais itens.

Endpoint atualmente usado:
`/api/explore?mode=top&limit=24`

**Importante:** se o usuário posteriormente exigir explicitamente “mais curtidas da semana”, alterar `mode=top` para `mode=week`, mantendo a paginação visual de 4 em 4.

## 8. Créditos, missões e conta de teste

Arquivos principais:
- `frontend/credits-v2.js`
- `frontend/gamification.js`
- `frontend/gamification-events.js`
- `frontend/gamification-alerts-v1.js` (verificar o estado real antes de assumir funcionalidades)
- `backend/patch-credits-routes.mjs`
- `backend/patch-tester-unlimited.mjs`
- `backend/patch-auth-robust.mjs`

Rotas de créditos adicionadas por `patch-credits-routes.mjs`:
- `GET /api/credit-status`
- `POST /api/claim-credit-mission`

Missões atuais:
- criar: 3
- curtir: 10
- comentar: 5
- compartilhar: 3

Cada missão recompensa 5 créditos.

### Conta de teste
`edsonfernandesvet@gmail.com`

Essa conta deve ter créditos ilimitados e não deve consumir créditos ao criar invenções.

### Correção importante dos patches
`patch-tester-unlimited.mjs` anteriormente gerava conflito de `const u` com o patch de créditos. Foi corrigido.

Estado desejado atual:
- `patch-credits-routes.mjs` contém o bypass da conta de teste na rota de consumo;
- `patch-tester-unlimited.mjs` ficou responsável apenas pelo allowance/unlimited e não injeta uma segunda rota de consumo;
- `patch-auth-robust.mjs` melhora a leitura de tokens base64/base64url.

O deploy do backend foi corrigido e validado após esses problemas.

## 9. Backend / Worker

Arquivo principal:
`backend/worker.js`

É um arquivo grande e deve ser alterado com cuidado.

Worker de produção:
`https://motor-invencoes.edsonfernandesvet.workers.dev`

Ao alterar backend:
1. validar sintaxe;
2. rodar workflow de validação/deploy;
3. verificar os jobs até estarem concluídos;
4. só então informar que terminou.

Não declarar um deploy concluído enquanto o workflow ainda estiver `queued`, `in_progress` ou equivalente.

## 10. Administração

Arquivo:
`admin-v2.html`

Commit que separou corretamente:
- **Produtos no catálogo**
- **Criações** dos usuários D1

Commit:
`37cd86cbcacd9aae8b3752ca0ec66730eb324835`

Houve anteriormente um commit problemático de contagem:
`3096dd6fc7e9e9bf93a39ad8b896d7a3f031a7ac`

Não repetir a lógica que contava arquivos comprimidos ou usava template incorreto. A contagem deve deduplicar IDs dos JSONs válidos.

## 11. Gamificação

O projeto possui sistema de:
- XP
- níveis
- medalhas/badges
- eventos de gamificação
- créditos
- missões

O usuário já reclamou anteriormente de:
- créditos não aparecendo;
- missões não funcionando;
- ausência de tela/alerta de medalha ou subida de nível.

Se voltar a aparecer qualquer desses problemas, **inspecionar o estado real dos arquivos atuais antes de assumir que a funcionalidade está correta**. Em especial, verificar se `gamification.js` está reconstruindo o DOM do perfil e apagando elementos adicionados por `credits-v2.js` ou alertas.

## 12. Arquivos frontend relevantes

- `index.html`
- `criar.html`
- `produto.html`
- `profile.html`
- `admin-v2.html`
- `frontend/auth-gate.js`
- `frontend/recent-creations-v2.js`
- `frontend/home-social.js`
- `frontend/home-upgrades-v1.js`
- `frontend/product-social-v1.js`
- `frontend/profile-public-v1.js`
- `frontend/profile-page-v2.js`
- `frontend/credits-v2.js`
- `frontend/gamification.js`
- `frontend/gamification-events.js`
- `frontend/gamification-alerts-v1.js`
- `frontend/catalog-lote2-loader.js`

## 13. Perfis públicos

`profile.html` carrega:
- `frontend/profile-public-v1.js`
- `frontend/profile-page-v2.js`

`profile-public-v1.js` trata URLs com:
`?user=<id>`

e consulta:
`/api/profile/public?user_id=<id>`

`profile-page-v2.js` possui o guard:
`window.__FUTURO_PROFILE_PAGE_V2`

Não remover esse mecanismo sem necessidade.

## 14. Histórico de erros importantes já corrigidos

### Loop de login/logout
Causa: tratamento de 401 que limpava a sessão.

Correção: `handle401()` abre o login sem apagar a sessão automaticamente.

### Comentário quebrando no celular
Causa: rerender periódico dos cards.

Correção: evitar rerender quando os dados não mudaram.

### Perfil do criador abrindo o próprio perfil
Causa: links de produto não carregavam o ID do criador e o produto social acabava usando o usuário atual como referência.

Correção: passar `creator` nos links + resolução robusta do criador no produto.

### Ranking mostrando 24 de uma vez
O usuário rejeitou essa implementação.

Estado correto: 4 inicialmente + “Mostrar mais” acrescentando 4.

### Patch de créditos quebrando por variável duplicada
Causa: `const u` duplicado entre patches.

Correção: consolidar o bypass da conta de teste na rota de consumo e simplificar o patch tester.

### Patch de créditos com sintaxe incorreta
Houve erro anterior relacionado a uma construção `m missions`.

Foi corrigido e o backend foi posteriormente validado/deployado.

## 15. Procedimento para continuar em um novo chat

Primeiro ler este arquivo:
`FUTUROLOGIO_CONTEXTO_PROJETO.md`

Depois:
1. verificar o estado atual da branch `main`;
2. buscar os arquivos diretamente no GitHub antes de alterar;
3. não confiar somente em versões antigas do contexto do chat;
4. preservar as regras acima;
5. se o usuário pedir uma implementação, executar imediatamente;
6. validar e verificar o deploy antes de responder “concluído”.

## 16. Último estado conhecido

A última tarefa concluída foi a correção do direcionamento do botão **“Ver perfil”** para o criador correto da invenção.

Último commit principal dessa correção:
`1f5fa99067e13a89c450cf41272403f944a36394`

Também foram feitas as correções complementares nos links de invenção:
- `bfa575652517bfebb862377c78c3b22830911596`
- `d4144c030a95920e3185f5e0233e8c6ee077e278`

Frontend validation e GitHub Pages deployment dessa etapa foram concluídos com sucesso.

## 17. Próxima tarefa

**Não existe uma próxima implementação definida neste arquivo.**

Quando o usuário iniciar o próximo chat e pedir uma nova alteração, usar este documento como ponto de partida e verificar o código atual antes da implementação.

---

**FIM DO CONTEXTO DE CONTINUIDADE — FUTUROLOGIO**
