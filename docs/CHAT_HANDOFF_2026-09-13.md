# FUTUROLOGIO™ — CHAT HANDOFF
## Atualizado em 2026-09-13

Este arquivo existe para permitir que um novo chat continue o projeto sem repetir trabalho já concluído.

## 1. Projeto
- Repositório: `sites84/Futurologio`
- Branch principal: `main`
- Site público: `https://sites84.github.io/Futurologio/`
- Worker/API: `https://motor-invencoes.edsonfernandesvet.workers.dev`
- D1: `futurologio`
- R2: `futurologio-images`
- Produto/marca: FUTUROLOGIO™
- CTA principal: `CRIAR MEU PRODUTO`

## 2. Regra de continuidade
Antes de alterar qualquer coisa, leia este arquivo e depois inspecione no GitHub os arquivos/commits citados. Não repita correções já feitas.

O usuário prefere execução direta: faça a alteração, valide e só depois informe o que foi feito. Não fique narrando intenções de correção antes de executar.

Não altere o design da página inicial quando a solicitação for específica da página de criação/produto.

## 3. Catálogo
O arquivo mestre do catálogo é `catalog.json` na raiz do repositório.

Estado atual conhecido:
- 201 produtos no catálogo mestre.
- IDs 156–201 completos.
- IDs únicos.
- Produtos 193–196 foram importados do Builder.
- Produtos 197–201 também foram incorporados.
- Os produtos canônicos 188, 189 e 190 devem ser preservados exatamente:
  - 188 PEDAL DE URGÊNCIA FICTÍCIA™
  - 189 VÁLVULA DE RISO SECO™
  - 190 METRÔNOMO DE DESVIO™
- Produtos 193–196:
  - 193 BLOQUEADOR DE DESPEDIDA™
  - 194 FILTRO DE DEDADA TRAIDORA™
  - 195 GUILHOTINA CARBOIDRATO™
  - 196 RADAR DE LUTO ALHEIO™
- Produtos 197–201:
  - 197 CATAPULTA DE GRUPO DE FAMÍLIA™
  - 198 COLARINHO DE CENSURA ÍNTIMA™
  - 199 ESCUDO DE COREOGRAFIA SOCIAL™
  - 200 TALA DE PARALISIA DIGITAL NOTURNA™
  - 201 MARCA-PASSO DE CONCORDÂNCIA PSEUDO-INTELECTUAL™

Fontes/durabilidade do catálogo:
- `scripts/migrate_catalog_master.py`
- `frontend/catalog-builder-import-193-196.json`
- `frontend/catalog-builder-import-197.json`
- `frontend/catalog-builder-import-198.json`
- `frontend/catalog-builder-import-199.json`
- `frontend/catalog-builder-import-200.json`
- `frontend/catalog-builder-import-201.json`
- Workflow finalizador: `.github/workflows/catalog-builder-finalize-v2.yml`

O Builder aceita texto bruto, não apenas JSON:
- `catalog-builder.html`
- `frontend/catalog-builder.js`

O parser aceita JSON array, `{products:[]}`, `{produtos:[]}` e blocos de texto numerados. Os campos principais são `what`, `realTech`, `specTech`, `inventedTech`, `build`, `uses`, `dangers`, `curiosity`, `tests`.

## 4. Loader do catálogo
Arquivo principal:
- `frontend/catalog-master-loader.js`

Ele carrega `./catalog.json`, mapeia categorias, elimina IDs duplicados escolhendo o registro mais completo, define `window.FUTUROLOGIO_PRODUCTS` e sinaliza `futuro-catalog-ready`.

Arquivos/fluxos antigos de catálogo ainda podem existir, mas o master loader é a fonte ativa. Evitar criar novos loaders concorrentes.

## 5. Página de criação/produto
Página:
- `criar.html`

Scripts relevantes:
- `frontend/creation-catalog-v1.js`
- `frontend/creation-actions-v4.js`
- `frontend/creation-enhancements.js`
- `frontend/creation-prompt-v2.js`
- `frontend/product-ui-fix-v1.js`
- `frontend/catalog-upload-fix-v1.js`
- `frontend/product-social-v1.js`
- `frontend/auth-gate.js`

Comportamento já implementado:
- O modo criação usa produtos válidos do catálogo mestre.
- Em URL de produto com `db_invention`, `invention` ou `id`, a página não deve mostrar o modo de criação completo; mostra o produto e oferece link `Modo criação`.
- Na página do produto, a ordem desejada é: título → imagem, quando existir → descrição/detalhes → área de upload/troca → compartilhar/comentar/curtir → prompt.
- Se não houver imagem, não deve aparecer um placeholder na posição reservada logo após o título.
- A imagem do produto, quando existente, aparece imediatamente após o título.

## 6. Upload de imagem
Existe mais de uma implementação histórica de upload, então cuidado para não reintroduzir concorrência.

`frontend/catalog-upload-fix-v1.js` foi corrigido para atualizar a imagem visível imediatamente após o upload, sem exigir refresh.

Commit dessa correção:
- `450d65b2a545736a14925ea0eca44b0ecfa8bfb7`

A correção cria/atualiza o `<img>` no `.game-image-card` e usa cache-buster para impedir que o navegador mostre imagem antiga.

`frontend/creation-actions-v4.js` também possui upload/renderização própria. Se surgir novamente problema de imagem, investigar a interação entre essas duas implementações antes de criar uma terceira.

Backend:
- `backend/patch-catalog-upload-registration.mjs`
- rota `POST /api/catalog-invention`
- registra invenção de catálogo no backend quando necessário.

## 7. Social
`frontend/product-social-v1.js` implementa:
- Curtir
- Comentar
- Perfil do criador
- Lista/formulário de comentários

APIs principais:
- `GET /api/inventions/:id`
- `POST /api/inventions/:id/like`
- `POST /api/inventions/:id/comment`

Um bug anterior fazia comentário depender da existência de Share. Isso foi corrigido em:
- `2d0141922192394707df0110d1b0dbb4ff6925c2`

## 8. Prompt de geração de imagem
Arquivo:
- `frontend/creation-prompt-v2.js`

O prompt atual é deliberadamente rico e não minimalista. Requisitos atuais:
- imagem horizontal 16:9;
- uma única cena cinematográfica;
- produto é o protagonista;
- produto grande e funcionando fisicamente;
- mecanismo visível;
- causa → mecanismo → consequência absurda;
- humor negro/sátira/dark comedy obrigatório;
- reação caricata do personagem;
- riqueza visual controlada, sem virar caos;
- marca FUTUROLOGIO™ integrada ao produto;
- nome do produto integrado em placa/etiqueta;
- pelo menos três elementos textuais em português integrados naturalmente à cena;
- iluminação clara/cinematográfica;
- paleta com acid lime `#d8ff55`, off-white, steel gray, pele quente e pequenos acentos navy;
- proibido usar “Museu Lima”;
- proibido transformar em infográfico, catálogo, colagem, dashboard ou pôster cheio de texto.

O usuário havia pedido para voltar ao prompt antigo e depois pediu mais humor negro, mecanismo visível e riqueza visual. A versão atual incorpora essas exigências. Não simplificar novamente sem pedido explícito.

## 9. Caixa do prompt — estado mais recente
`frontend/creation-enhancements.js` cria a caixa:
- `futuroPromptCard`
- textarea `futuroPromptText`
- `COPIAR PROMPT`
- `ABRIR CHATGPT`
- `ABRIR GROK`
- `ABRIR GEMINI`
- `ABRIR LEONARDO IA`

A última alteração deste item foi feita no commit:
- `7b5f1ac6b4bafbe9fc6d60edd877a2ad0382f476`

O botão Leonardo foi solicitado para ficar junto dos botões GPT/Grok/Gemini e abrir o Leonardo em nova aba.

## 10. Builder de catálogo
Arquivos:
- `catalog-builder.html`
- `frontend/catalog-builder.js`

O usuário quer colar texto bruto das invenções e clicar em `CONVERTER E VALIDAR`; não quer precisar conhecer JSON.

O Builder gera uma cópia do catálogo mestre para download, mas não publica automaticamente no GitHub.

## 11. Histórico importante de commits
Alguns commits importantes para localizar decisões anteriores:
- `2470683e2ce2fdd8be369ec26590075dcf63809` — limpeza do catálogo.
- `d0126a02d0a20d35b20cfba1fbf292857c9c4b1f` — integração de 193–196.
- `d427eea9d96678de0ce4b8948a942c093a343bee` — catálogo mestre com 201 produtos.
- `450d65b2a545736a14925ea0eca44b0ecfa8bfb7` — imagem aparece imediatamente após upload.
- `2d0141922192394707df0110d1b0dbb4ff6925c2` — comentário independente do share.
- `ec988da6f7a1c47b9d7aa762771b860101b03e6a` — produto não mostra modo criação completo.
- `956f5930578089ab4382b5f10652ba2e8429bff4` / `322a5d3a2aff052ae9d620690b9e5003214e5c82` — imagem após título.
- `5fa32db12c1f5085b21d79cf0f25a0138b7c04ce` — prompt rico, mecanismo e humor negro.
- `7b5f1ac6b4bafbe9fc6d60edd877a2ad0382f476` — botão Leonardo IA.

## 12. O que NÃO fazer
- Não substituir `catalog.json` por uma fonte menor ou antiga.
- Não remover produtos já integrados.
- Não recriar IDs existentes.
- Não restaurar 188/189/190 com nomes errados.
- Não alterar a home sem solicitação.
- Não simplificar o prompt atual sem solicitação.
- Não criar mais um sistema paralelo de upload sem investigar os existentes.
- Não expor segredos, tokens ou credenciais.
- Não afirmar que algo está publicado/live sem verificar o estado real.

## 13. Próximo chat
Se o usuário abrir um novo chat, a primeira instrução deve ser ler:
`docs/CHAT_HANDOFF_2026-09-13.md`

e, em seguida, verificar no branch `main` os arquivos envolvidos na solicitação atual. O arquivo é o ponto de partida, não substitui a inspeção do código atual.
