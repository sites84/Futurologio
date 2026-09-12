(()=>{'use strict';if(window.__FUTURO_CATALOG_UNION_V1)return;window.__FUTURO_CATALOG_UNION_V1=true;
const CATS=['Casa','Comida & Cozinha','Transporte','Moda','Animais','Tecnologia','Mente & Comportamento','Meio Ambiente','Escola & Trabalho','Espaço','Sem sentido','Tecnologia do futuro','Indústria','Esportes','Entretenimento','Dinheiro & Negócios','Cidade','Agricultura','Viagem','Comunicação','Energia','Tempo & Clima','Objetos pessoais','Lazer','Museu','Bizarro ou Nojento'];
const MAP={'Natureza & Meio Ambiente':'Meio Ambiente','RELACIONAMENTOS':'Mente & Comportamento','Relacionamentos':'Mente & Comportamento','TRABALHO E ESCRITÓRIO':'Escola & Trabalho','SAÚDE E CORPO':'Casa','Saúde & Corpo':'Casa','Saúde & Bem-estar':'Casa','CASA E FAMÍLIA':'Casa','Casa & Família':'Casa','Casa & Cotidiano':'Casa','REDES SOCIAIS':'Comunicação','TRÂNSITO E TRANSPORTE':'Transporte','Trânsito & Transporte':'Transporte','MODA E APARÊNCIA':'Moda','FINANÇAS PESSOAIS':'Dinheiro & Negócios','Dinheiro & Consumo':'Dinheiro & Negócios','PARENTALIDADE':'Casa','MORTE, LUTO E ENVELHECIMENTO':'Mente & Comportamento','Viagens & Lazer':'Viagem','Lazer & Entretenimento':'Lazer'};
const EXTRAS=['./catalog-lote3.json','./catalog-lote4.json','./catalog-lote5.json','./catalog-lote6.json','./catalog-lote7.json','./catalog-lote8.json','./catalog-lote9.json','./catalog-lote10.json','./catalog-lote11.json','./catalog-lote12.json','./catalog-lote13.json','./catalog-lote14.json','./catalog-lote15.json','./catalog-lote16.json','./catalog-lote16-02.json','./catalog-lote16-03.json','./catalog-lote16-04.json','./catalog-lote16-05.json','./catalog-lote16-06.json','./catalog-lote16-07.json','./catalog-lote17.json','./catalog-lote17-02.json','./catalog-lote17-03.json','./catalog-lote17-04.json'];
const PARTS=['./catalog-lote2-01a.b64','./catalog-lote2-01b.b64'];
const FILES=Array.from({length:18},(_,i)=>`./catalog-lote2-${String(i+2).padStart(2,'0')}.b64`);
function normCat(c){c=String(c||'').trim();if(CATS.includes(c))return c;return MAP[c]||'Sem sentido'}
function clean(list){return (list||[]).filter(x=>x&&(x.id||x.name)).map(x=>({...x,category:normCat(x.category)}))}
function merge(additions){const old=Array.isArray(window.FUTUROLOGIO_PRODUCTS)?window.FUTUROLOGIO_PRODUCTS:[];const ids=new Set(old.map(x=>String(x.id)));const extra=clean(additions).filter(x=>!ids.has(String(x.id)));window.FUTUROLOGIO_PRODUCTS=old.concat(extra);window.FUTUROLOGIO_CATALOG_UNION_COUNT=(window.FUTUROLOGIO_PRODUCTS||[]).length;return extra.length}
function b64bytes(s){const bin=atob(String(s||'').replace(/\s+/g,''));const a=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)a[i]=bin.charCodeAt(i);return a}
async function decode(s){const ds=new DecompressionStream('gzip');const stream=new Blob([b64bytes(s)]).stream().pipeThrough(ds);return JSON.parse(await new Response(stream).text())}
async function loadJson(f){try{const r=await fetch(f,{cache:'no-store'});if(!r.ok)return [];const d=await r.json();return Array.isArray(d)?d:[]}catch{return []}}
async function loadLote2(){const out=[];try{const first=await Promise.all(PARTS.map(f=>fetch(f,{cache:'no-store'}).then(r=>r.ok?r.text():'')));if(first.every(Boolean)){try{out.push(...(await decode(first.join(''))||[]))}catch{}}}catch{}
for(const f of FILES){try{const t=await fetch(f,{cache:'no-store'}).then(r=>r.ok?r.text():'');if(!t)continue;out.push(...(await decode(t)||[]))}catch{}}
return out}
async function load(){const extras=(await Promise.all(EXTRAS.map(loadJson))).flat();
const lote2=await loadLote2();
const added=merge(extras.concat(lote2));
window.FUTUROLOGIO_CATALOG_LOTE2_READY=true;
console.log('FUTUROLOGIO catalogo unificado: +'+added+' extras, total '+(window.FUTUROLOGIO_PRODUCTS||[]).length);
setInterval(()=>merge(extras.concat(lote2)),1500)}
load()})();
