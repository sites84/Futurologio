INSERT OR IGNORE INTO BADGES(code,name,description,requirement) VALUES
('FIRST_CREATION','Primeira Invenção','Criou sua primeira invenção no FUTUROLOGIO.','1 criação'),
('TEN_CREATIONS','Dez Invenções','Chegou a dez invenções criadas.','10 criações'),
('FIFTY_CREATIONS','Cinquenta Invenções','Chegou a cinquenta invenções criadas.','50 criações'),
('FIRST_LIKE','Primeira Curtida','Curtiu uma invenção pela primeira vez.','1 curtida'),
('HUNDRED_LIKES_RECEIVED','Cem Curtidas','Recebeu cem curtidas em suas invenções.','100 curtidas recebidas'),
('FIRST_COMMENT','Primeiro Comentário','Comentou em uma invenção pela primeira vez.','1 comentário'),
('FIFTY_COMMENTS','Cinquenta Comentários','Fez cinquenta comentários.','50 comentários'),
('FIRST_SHARE','Primeiro Compartilhamento','Compartilhou uma invenção pela primeira vez.','1 compartilhamento'),
('FIFTY_SHARES','Cinquenta Compartilhamentos','Compartilhou cinquenta vezes.','50 compartilhamentos'),
('CATEGORY_EXPLORER','Explorador de Categorias','Criou invenções em dez categorias diferentes.','10 categorias'),
('MULTICATEGORY_CREATOR','Criador Multicategoria','Criou invenções em vinte categorias diferentes.','20 categorias'),
('BIZARRO_EXPLORER','Explorador do Bizarro','Criou uma invenção na categoria Bizarro ou Nojento.','1 criação na categoria Bizarro ou Nojento');

-- Catálogo inicial: 139 invenções pré-construídas.
INSERT OR IGNORE INTO INVENTIONS(slug,name,category,concept,fingerprint,data) VALUES
('alarme-de-recaida-de-ex-lote1-001','ALARME DE RECAÍDA DE EX','Mente & Comportamento','Um sensor adesivo transparente, aplicado diretamente no polegar, que detecta quando o usuário está prestes a cometer a humilhação digital de mandar mensagem para o ex na madrugada. Ao identificar o padrão de digitação trêmulo e o nível de álcool no suor da pele, o adesivo bloqueia o teclado do celular e dispara um choque estático leve, seguido pelo áudio da risada de deboche dos seus amigos.','e4c6b6a11f31e4e0c3a2d5b5dce4d4d72e4d5e7d9f3f5b0e1c3a1a8e6b6d0b5f', '{"source_id":"lote1-001"}');
