(()=>{'use strict';if(window.__FUTURO_CATALOG_UNION_V4)return;window.__FUTURO_CATALOG_UNION_V4=true;
const CATS=['Casa','Comida & Cozinha','Transporte','Moda','Animais','Tecnologia','Mente & Comportamento','Meio Ambiente','Escola & Trabalho','Espaço','Sem sentido','Tecnologia do futuro','Indústria','Esportes','Entretenimento','Dinheiro & Negócios','Cidade','Agricultura','Viagem','Comunicação','Energia','Tempo & Clima','Objetos pessoais','Lazer','Museu','Bizarro ou Nojento'];
const MAP={'Relacionamento':'Mente & Comportamento','Trabalho':'Escola & Trabalho','Escritório':'Escola & Trabalho','Escola':'Escola & Trabalho','Saúde':'Casa','Banheiro':'Casa','Quarto':'Casa','Cozinha':'Comida & Cozinha','Pets':'Animais','Condomínio':'Cidade'};
const VOL1B64=Array.from({length:6},(_,i)=>`./catalog-vol1-${String(i+1).padStart(2,'0')}.b64`);
const EXTRA_B64=['./catalog-lote3.b64','./catalog-lote18.b64','./catalog-lote19.b64'];
const EXTRAS=['./catalog-lote3.json','./catalog-lote4.json','./catalog-lote5.json','./catalog-lote6.json','./catalog-lote7.json','./catalog-lote8.json','./catalog-lote9.json','./catalog-lote10.json','./catalog-lote11.json','./catalog-lote12.json','./catalog-lote13.json','./catalog-lote14.json','./catalog-lote15.json','./catalog-lote16.json','./catalog-lote16-02.json','./catalog-lote16-03.json','./catalog-lote16-04.json','./catalog-lote16-05.json','./catalog-lote16-06.json','./catalog-lote16-07.json','./catalog-lote17.json','./catalog-lote17-02.json','./catalog-lote17-03.json','./catalog-lote17-04.json'];
const PARTS=['./catalog-lote2-01a.b64','./catalog-lote2-01b.b64'];
const FILES=Array.from({length:18},(_,i)=>`./catalog-lote2-${String(i+2).padStart(2,'0')}.b64`);
const REQUIRED=['what','realTech','specTech','inventedTech','build','uses','dangers','curiosity','tests'];
const MIN={what:160,realTech:45,specTech:45,inventedTech:45,build:45,uses:30,dangers:40,curiosity:70,tests:70};
function txt(v){if(Array.isArray(v))return v.map(txt).join(' ');if(v&&typeof v==='object')return Object.values(v).map(txt).join(' ');return String(v||'').trim()}
function norm(v){return txt(v).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^\w\s]/g,' ').replace(/\s+/g,' ').trim()}
function normCat(c){c=txt(c);if(CATS.includes(c))return c;return MAP[c]||c||'Sem sentido'}
function valid(x){if(!x||!txt(x.id)||!txt(x.name)||!txt(x.category))return false;for(const f of REQUIRED){const s=txt(x[f]);if(s.length<MIN[f])return false;const n=norm(s);if(n.includes('nao informado no lote')||n.includes('todo')||n.includes('tbd'))return false;if(/\b(?:como seria construido|usos recomendados|perigos e limitacoes|curiosidades|resultado dos testes)\s*:/i.test(s))return false}return true}
function clean(list){return (list||[]).filter(valid).map(x=>{const q={...x};for(const f of REQUIRED)q[f]=txt(q[f]).replace(/------------------------------/g,'').trim();q.category=normCat(q.category);return q})}
function score(p){return txt(p.what).length+txt(p.inventedTech).length}
function merge(additions){const old=Array.isArray(window.FUTUROLOGIO_PRODUCTS)?window.FUTUROLOGIO_PRODUCTS.slice():[];const map=new Map(old.map(x=>[String(x.id),x]));let added=0;
for(const item of clean(additions)){const id=String(item.id||'');if(!id)continue;const prev=map.get(id);if(!prev){map.set(id,item);added++;}else if(score(item)>score(prev)+40){map.set(id,{...prev,...item});}}
const out=[];const ids=new Set(),names=new Set(),whats=new Set();
for(const p of map.values()){const id=String(p.id),name=norm(p.name),what=norm(p.what);if(ids.has(id)||names.has(name)||whats.has(what))continue;ids.add(id);names.add(name);whats.add(what);out.push(p)}
window.FUTUROLOGIO_PRODUCTS=out;
window.FUTUROLOGIO_CATALOG_UNION_COUNT=out.length;
return added}
function b64bytes(s){const bin=atob(String(s||'').replace(/\s+/g,''));const a=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)a[i]=bin.charCodeAt(i);return a}
async function decode(s){const ds=new DecompressionStream('gzip');const stream=new Blob([b64bytes(s)]).stream().pipeThrough(ds);return JSON.parse(await new Response(stream).text())}
async function loadJson(f){try{const r=await fetch(f,{cache:'no-store'});if(!r.ok)return [];const d=await r.json();return Array.isArray(d)?d:[]}catch{return []}}
async function loadB64File(f){try{const t=await fetch(f,{cache:'no-store'}).then(r=>r.ok?r.text():'');if(!t)return [];return await decode(t)||[]}catch{return []}}
async function loadB64Join(files){try{const parts=await Promise.all(files.map(f=>fetch(f,{cache:'no-store'}).then(r=>r.ok?r.text():'')));if(!parts.every(Boolean))return [];return await decode(parts.join(''))||[]}catch{return []}}
async function loadLote2(){const out=[];try{const first=await Promise.all(PARTS.map(f=>fetch(f,{cache:'no-store'}).then(r=>r.ok?r.text():'')));if(first.every(Boolean)){try{out.push(...(await decode(first.join(''))||[]))}catch{}}}catch{}
for(const f of FILES){try{const t=await fetch(f,{cache:'no-store'}).then(r=>r.ok?r.text():'');if(!t)continue;out.push(...(await decode(t)||[]))}catch{}}
return out}
async function load(){const extras=(await Promise.all(EXTRAS.map(loadJson))).flat();const extraB64=(await Promise.all(EXTRA_B64.map(loadB64File))).flat();const vol1=await loadB64Join(VOL1B64);const lote2=await loadLote2();const added=merge(extras.concat(extraB64,vol1,lote2));window.FUTUROLOGIO_CATALOG_LOTE2_READY=true;console.log('FUTUROLOGIO catalogo validado: +'+added+' extras, total '+(window.FUTUROLOGIO_PRODUCTS||[]).length);setInterval(()=>merge(extras.concat(extraB64,vol1,lote2)),1500)}load()})();
