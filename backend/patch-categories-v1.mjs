import fs from 'node:fs';

const file='backend/worker.js';
let s=fs.readFileSync(file,'utf8');
const canonical=['Agricultura','Animais','Bizarro ou Nojento','Casa','Cidade','Comida & Cozinha','Comunicação','Dinheiro & Negócios','Educação','Energia','Entretenimento','Escola & Trabalho','Esportes','Espaço','Indústria','Lazer','Meio Ambiente','Mente & Comportamento','Moda','Museu','Objetos pessoais','Sem sentido','Tecnologia','Tecnologia do futuro','Tempo & Clima','Transporte','Viagem'];
const line="const CATEGORIES=";
const start=s.indexOf(line);
if(start<0)throw new Error('CATEGORIES declaration not found');
const end=s.indexOf(';',start);
if(end<0)throw new Error('CATEGORIES terminator not found');
s=s.slice(0,start)+`const CATEGORIES=${JSON.stringify(canonical)};`+s.slice(end+1);
fs.writeFileSync(file,s);
console.log('Canonical alphabetical categories installed.');
