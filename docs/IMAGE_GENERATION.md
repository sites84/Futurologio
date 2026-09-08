# Imagens das invenções — arquitetura reservada

## Objetivo

Cada invenção deve poder ter um render visual gerado automaticamente, sem obrigar o usuário a escrever prompt.

O frontend já possui um espaço reservado no resultado da invenção. O catálogo também pode receber futuramente `image_url` sem quebrar os campos existentes.

## Fluxo planejado

1. O usuário cria uma invenção normalmente.
2. O sistema monta automaticamente um prompt visual a partir de `name`, `what`, `build`, `realTech`, `specTech`, `inventedTech` e `category`.
3. O Worker verifica se a invenção já possui imagem.
4. Se não possuir, cria o render uma única vez e grava a referência da imagem.
5. O frontend mostra o render no cartão `VISUALIZAÇÃO DA INVENÇÃO`.
6. Compartilhamento e perfil podem reutilizar a mesma imagem, evitando gerar novamente.

## Opção recomendada inicialmente

**Cloudflare Workers AI + FLUX.1 Schnell**, porque o FUTUROLOGIO já usa Cloudflare Workers. A documentação atual informa suporte ao modelo `@cf/black-forest-labs/flux-1-schnell`; o custo publicado é por tile/step e o Workers AI possui uma franquia diária gratuita de 10.000 neurons. Isso permite começar com um limite diário baixo e previsível.

## Alternativas

- **Replicate + FLUX**: simples para prototipação e cobrança por imagem. Há modelos oficiais com preços baixos por imagem.
- **OpenAI GPT Image**: excelente qualidade e integração simples, mas deve ser reservado para planos pagos ou renders premium para controlar custo.

## Controle de custo

A geração não deve acontecer em cada visualização. Deve existir cache por invenção/fingerprint, limite diário por usuário e fallback para o placeholder quando a geração estiver indisponível.

Sugestão de produto:

- Free: imagem simples, sujeita a limite global.
- Basic: mais gerações.
- Advanced: render prioritário e opção de regenerar.
- Administrador/tester: ilimitado para testes.

## Armazenamento

Não armazenar a imagem binária dentro do D1. D1 deve guardar somente metadados/referência. A imagem deve ficar em R2 ou em armazenamento equivalente, com URL/CDN estável.

## Segurança

A chave do provedor nunca deve ir para o navegador. A chamada deve passar pelo Worker autenticado. O prompt deve ser construído no servidor a partir dos dados da invenção.
