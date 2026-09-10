# FUTUROLOGIO™ — CONTEXTO DE CONTINUIDADE

**Data:** 10/09/2026  
**Objetivo:** arquivo de passagem para continuar o projeto em um novo chat sem perder contexto.

## 1. Regra principal para o próximo chat

O projeto é **FUTUROLOGIO™**, no repositório `sites84/Futurologio`.

O usuário quer continuidade autônoma e precisa que o próximo chat leia este arquivo antes de propor mudanças. **Não repetir perguntas já respondidas neste documento.**

**Importante:** não alterar código sem o usuário pedir. Evitar regressões nas partes que já foram confirmadas como funcionando.

---

## 2. Estado atual do projeto

- Frontend: GitHub Pages, repositório `sites84/Futurologio`.
- Backend: Cloudflare Worker `motor-invencoes`.
- Worker: `https://motor-invencoes.edsonfernandesvet.workers.dev`
- Banco: Cloudflare D1 **`futurologio`**.
- R2: bucket **`futurologio-images`**.
- O bucket R2 deve permanecer existente/configurado; somente os objetos foram removidos.
- Catálogo oficial: **139 produtos / 26 categorias**.
- Catálogo é mantido no frontend; não apagar o catálogo ao fazer reset de dados.

---

## 3. RESET DE DADOS — CONCLUÍDO EM 10/09/2026

O usuário pediu deixar o sistema como se estivesse iniciando agora, sem mexer no código.

### D1
Foi executado com sucesso no Console do D1 `futurologio`:

```sql
DELETE FROM USER_BADGES;
DELETE FROM XP_EVENTS;
DELETE FROM LIKES;
DELETE FROM COMMENTS;
DELETE FROM SHARES;
DELETE FROM INVENTION_VIEWS;
DELETE FROM USER_INVENTIONS;
DELETE FROM INVENTION_OWNERS;
DELETE FROM SUBSCRIPTIONS;
DELETE FROM CREDIT_PURCHASES;
DELETE FROM AVATAR_PROFILES;
DELETE FROM INVENTIONS;
DELETE FROM SITE_VISITS;
DELETE FROM USERS;

DELETE FROM sqlite_sequence
WHERE name IN (
  'INVENTIONS',
  'COMMENTS',
  'SHARES',
  'XP_EVENTS',
  'INVENTION_VIEWS',
  'SUBSCRIPTIONS',
  'CREDIT_PURCHASES',
  'SITE_VISITS'
);
```

O Cloudflare Console confirmou **“This query successfully executed.”**

Também foi criado um bookmark/Time Travel point antes da limpeza. O bookmark exibido foi:

`00000072-00000000-000050e2-157552f68791d6164d743beb95025de`

### R2
No bucket `futurologio-images`, foram apagadas as duas pastas/prefixos:

- `inventions/`
- `profiles/`

A Cloudflare confirmou **“2 folders were successfully deleted.”** e passou a mostrar **“Your bucket is ready. Add files to get started.”**

### Resultado
O ambiente de dados está limpo:

- usuários/perfis: zerados
- invenções criadas: zeradas
- owners: zerados
- likes: zerados
- comentários: zerados
- shares: zerados
- visualizações: zeradas
- XP events: zerados
- badges dos usuários: zerados
- assinaturas: zeradas
- créditos comprados: zerados
- visitas do site: zeradas
- fotos de invenções no R2: zeradas
- fotos de perfil no R2: zeradas
- bucket R2: preservado
- código: **não foi alterado para fazer o reset**
- catálogo oficial: preservado

**Não fazer outro reset agora.**

---

## 4. Arquitetura e decisões importantes

### Catálogo
- 139 produtos.
- 26 categorias.
- Lote 1 = 84; Lote 2 = 55.
- Não reintroduzir produtos antigos, variantes artificiais ou inventar produtos fora do catálogo.
- Preservar textos completos.

### Criação
Fluxo desejado:

`cadastro → criação → reserva/consumo → D1 → XP → badge → perfil → like → comentário → share`

Planos:
- Free: 3 criações/dia
- Basic: 5/dia
- Advanced: 10/dia
- créditos extras

XP:
- criação: +10
- upload de foto: +5
- like: +2
- comentário: +3
- share: +2
- 100 XP por nível
- limites diários de XP: likes 5, comentários 5, shares 10, uploads 10
- depois do limite diário, a ação continua, mas sem XP

### Níveis/cargos
- 1: Curioso Iniciante
- 5: Criança Curiosa
- 10: Inventor Aprendiz
- 15: Mestre Inventor
- 20: Cientista do Absurdo
- 25: Mestre do Futuro
- 30: Visionário
- 35: General da Invenção
- 40: Criador do Impossível
- 45: Arquiteto do Universo
- 50: Criador do Universo

Fórmula atual:

```js
levelFromXp(xp) {
  return Math.max(1, Math.floor(Math.max(0, xp) / 100) + 1);
}
```

### Unicidade global
Uma criação exata não deve ser atribuída a usuários diferentes.

Tabela canônica:
`INVENTION_OWNERS`

Migrações relevantes:
- `0003_unique_invention_owner.sql`
- `0004_cleanup_duplicate_creation_owners.sql`

Não reverter essa regra.

---

## 5. Autenticação

`frontend/auth-gate.js`:
- API base aponta para o Worker.
- localStorage:
  - `futuro_auth_token`
  - `futuro_social_user`
  - `futuro_db_invention_ids`
- `canCreate()` usa autenticação Bearer.
- `recordCreated()` usa autenticação Bearer.
- `window.FUTUROLOGIO_AFTER_CREATE = recordCreated`.
- `window.FUTUROLOGIO_DB_ID_FOR = productId => Number(map()[productId] || 0)`.

Bug antigo de criação voltar para login foi corrigido porque `canCreate()`/`recordCreated()` passaram a usar fetch autenticado.

Commit associado ao fix original:
`846ad2e7e9f494aa46f523d98920d0db7ea9b829`

---

## 6. Fotos — NÃO MEXER SEM PEDIDO EXPLÍCITO

O usuário confirmou explicitamente que o sistema de fotos está funcionando:

> “As fotos estão funcionando agora. Dá pra fazer o upload e apagar elas.”

Arquitetura:
- R2: `futurologio-images`
- upload: `POST /api/invention-image`
- delete: `DELETE /api/invention-image/:id`
- leitura: `GET /api/invention-image/:id`
- máximo de upload de invenção: 8 MB
- chave R2: `inventions/<id>/<uuid>.<ext>`
- fotos de perfil usam `profiles/<user id>/<uuid>.<ext>`

Arquivos frontend relacionados:
- `frontend/final-ui-stability.js`
- `frontend/creation-actions-v4.js`

**Não alterar esses fluxos sem solicitação específica.**

---

## 7. Compartilhamento — NÃO MEXER

O usuário disse explicitamente:

> “O botão de compartilhar está perfeito, não mude nada nele”

O share atual é um único botão:

`↗ COMPARTILHAR INVENÇÃO`

Ele abre o compartilhamento nativo móvel diretamente, tenta anexar a imagem quando disponível e usa o link público como fallback.

Arquivo principal:
- `frontend/share-fix.js`

Commit relevante:
`349c3d7e425a35f6b26300eb8bade179ad9f363e`

Preview público dinâmico:
- `backend/patch-share-preview.mjs`
- commit: `985d800e4ca8cbed154146577dcf92e2bdc0f162`

**Não alterar o botão/share sem pedido explícito.**

---

## 8. Feed de últimas criações

Houve uma reescrita completa porque as criações estavam aparecendo em ordem aleatória.

Implementação atual:
- removido `frontend/recent-feed-fix.js`
- criado `frontend/recent-creations-v2.js`
- endpoint backend dedicado: `/api/recent-creations`
- endpoint ordena por `i.id DESC`
- limite até 200
- `my-inventions` também usa `i.id DESC`

A homepage deve mostrar as criações mais recentes primeiro.

Não reintroduzir a lógica antiga.

---

## 9. Perfil

Foi criada página própria:
- `profile.html`

Scripts atuais:
- `frontend/profile-nav-v2.js`
- `frontend/profile-page-v2.js`

O perfil deve mostrar:
- foto
- username
- nível
- cargo/role
- XP
- progresso
- estatísticas
- criações recentes
- configurações do perfil somente na página de perfil

O perfil não deve voltar para dentro de `criar.html`.

---

## 10. Avatar — REMOVIDO

O usuário decidiu abandonar o projeto de avatar:

> “Esquece o avatar pode retirar ele do site, vou continuar melhorando o que já tínhamos antes do avatar, quem sabe no chatgpt 7 você consiga fazer”

`avatar.html` foi removido.

A migração histórica `0008_avatar_profiles` pode permanecer no histórico/schema; não reintroduzir a feature visual sem pedido.

---

## 11. Onboarding / som / gamificação

`frontend/welcome-and-sound.js` atualmente deve cuidar apenas de:
- onboarding de primeiro cadastro
- explicação de XP
- som de criação
- mensagem de categoria esgotada

Mensagem de categoria esgotada:
> “Por hoje esta categoria esgotou as ideias. Escolha outra categoria ou tente de novo amanhã.”

XP popup:
- `frontend/gamification-events.js`
- detecta aumento de nível e novos badges
- mostra recompensa quando aplicável
- medalhas a cada 5 níveis

Badge especial `HUNDRED_LIKES_RECEIVED` pertence ao dono da invenção quando ela chega a 100 likes; não premiar automaticamente o usuário que curte.

---

## 12. Imagens geradas por IA

FUTUROLOGIO não gera a imagem internamente.

Fluxo:
1. site gera o prompt
2. usuário copia o prompt
3. usuário usa IA de sua escolha
4. usuário faz upload no site

Destinos:
- ChatGPT: `https://chatgpt.com/`
- Grok: `https://grok.com/`
- Gemini: `https://gemini.google.com/?hl=pt-BR`

Estilo oficial do prompt é genérico, sem copiar IP específico:

> “satirical magazine illustration style meets cyberpunk aesthetic, grotesque extreme caricature, hyper-realistic cartoon gross-up, with unsettling rich details, but the main character has a creepy, extreme manic expressions while using the product. Greasy and sweaty skin, dilated pores, popping bloodshot eyes, crooked teeth visible through a giant manic grin, dripping sweat beads. High-tech futuristic cyberpunk design, glowing neon LED lights, holographic displays showing statistics, sleek polished materials, fiber optic cables, cinematic lighting, deep shadows, chaotic and extremely funny composition, 16:9 aspect ratio.”

A imagem deve:
- ser engraçada
- mostrar o produto funcionando
- conter nome do produto
- conter marca FUTUROLOGIO
- ser horizontal 16:9
- alvo 1024×576
- manter margens de segurança

---

## 13. Banco / schema

Principais tabelas:
- `USERS`
- `INVENTIONS`
- `USER_INVENTIONS`
- `INVENTION_OWNERS`
- `INVENTION_VIEWS`
- `COMMENTS`
- `LIKES`
- `SHARES`
- `XP_EVENTS`
- `BADGES`
- `USER_BADGES`
- `SUBSCRIPTIONS`
- `CREDIT_PURCHASES`
- `SITE_VISITS`
- `AVATAR_PROFILES` (histórica)

O schema oficial está em:
`backend/schema.sql`

---

## 14. Admin / analytics

Admin:
`https://sites84.github.io/Futurologio/admin.html`

Tester histórico:
`edsonfernandesvet@gmail.com`

**Atenção:** o reset de 10/09/2026 apagou todos os usuários, inclusive o usuário tester. Portanto, o admin/tester precisará ser recriado pelo fluxo normal caso seja necessário testar recursos administrativos novamente.

Analytics:
- `SITE_VISITS`
- endpoint `POST /api/visit`
- endpoint `GET /api/admin/stats`

A página inicial registra visitas.

---

## 15. O que NÃO fazer no próximo chat

1. Não fazer novo reset do D1/R2.
2. Não alterar o catálogo oficial.
3. Não mexer no sistema de upload/apagar fotos sem pedido.
4. Não mexer no botão de compartilhar sem pedido.
5. Não reintroduzir avatar.
6. Não reintroduzir `recent-feed-fix.js` ou lógica antiga de feed.
7. Não colocar novamente o perfil dentro de `criar.html`.
8. Não inventar acesso direto ao Cloudflare se a ferramenta não estiver disponível.
9. Não afirmar que algo foi implantado sem verificar commit/deploy.
10. Não criar endpoint temporário de reset.

---

## 16. Próximo passo recomendado

Após abrir um novo chat, diga algo como:

> “Leia `docs/CHAT_HANDOFF_2026-09-10.md` no repositório `sites84/Futurologio` e continue o projeto a partir desse estado. Não repita o que já foi resolvido.”

O novo chat deve usar este arquivo como fonte de contexto inicial e consultar o código atual do repositório antes de alterar qualquer coisa.
