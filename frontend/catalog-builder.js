(()=>{'use strict';
const REQUIRED=['what','realTech','specTech','inventedTech','build','uses','dangers','curiosity','tests'];
const MIN={what:160,realTech:45,specTech:45,inventedTech:45,build:45,uses:30,dangers:40,curiosity:70,tests:70};
const CAT={'CASA & VIDA DOMÉSTICA':'Casa','TRABALHO & ESCRITÓRIO':'Escola & Trabalho','TRANSPORTE & TRÂNSITO':'Transporte','RELACIONAMENTOS & FAMÍLIA':'Mente & Comportamento','TECNOLOGIA & FUTURO':'Tecnologia do futuro','COMIDA & RESTAURANTES':'Comida & Cozinha','EDUCAÇÃO & FACULDADE':'Escola & Trabalho','DINHEIRO & CONSUMISMO':'Dinheiro & Negócios','SOCIEDADE & BUROCRACIA':'Cidade','ACADEMIA & ESPORTE':'Esportes','LAZER & ENTRETENIMENTO':'Entretenimento','VIZINHANÇA & CONVIVÊNCIA':'Cidade','ANIMAIS & PETS':'Animais','VIAGENS & TURISMO':'Viagem'};
const LABELS={
name:['nome do produto','nome da invenção','nome da invencao','nome','produto','invenção','invencao','título','titulo'],
category:['categoria','category'],
what:['o que é','o que e','descrição do produto','descricao do produto','descrição','descricao','como funciona','funcionamento'],
realTech:['tecnologias existentes hoje','tecnologias existentes atualmente','tecnologias existentes','tecnologia existente hoje','tecnologia existente','tecnologia real utilizada','tecnologia real','tecnologias reais','princípio real','principio real','princípios reais','principios reais'],
specTech:['especificações técnicas','especificacoes tecnicas','especificação técnica','especificacao tecnica','especificações do produto','especificacoes do produto','tecnologia específica','tecnologia especifica','tecnologia específica utilizada','tecnologia especifica utilizada','especificações','especificacoes'],
inventedTech:['tecnologias especulativas','tecnologia especulativa','tecnologias inventadas','tecnologia inventada','tecnologias fictícias','tecnologias ficticias','tecnologia fictícia','tecnologia ficticia','tecnologia inventada para o produto','tecnologia que ainda não existe','tecnologia que ainda nao existe','tecnologia futura','tecnologias futuras'],
build:['como construir','como seria construído','como seria construido','como é construído','como e construido','como seria feito','como fabricar','como montar','construção','construcao','materiais','fabricação','fabricacao'],
uses:['usos recomendados','usos','uso','para que serve','aplicações','aplicacoes','aplicação','aplicacao'],
dangers:['perigos e limitações','perigos e limitacoes','perigos','perigo','riscos e limitações','riscos e limitacoes','riscos e perigos','riscos','limitações','limitacoes'],
curiosity:['curiosidades','curiosidade'],
tests:['resultado dos testes','resultados dos testes','resultado de testes','resultados de testes','testes realizados','testes e resultados','teste e resultado','protocolo de teste','protocolo de testes','testes','teste']
};
const $=id=>document.getElementById(id);
const text=v=>Array.isArray(v)?v.map(text).join(' '):v&&typeof v==='object'?Object.values(v).map(text).join(' '):String(v??'').trim();
const norm=v=>text(v).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^\w\s]/g,' ').replace(/\s+/g,' ').trim();
function unwrap(v){if(Array.isArray(v))return v;if(v&&Array.isArray(v.products))return v.products;if(v&&Array.isArray(v.produtos))return v.produtos;if(v&&typeof v==='object')return [v];throw Error('Formato não reconhecido.');}
function clean(p){const q={...p};q.id=text(q.id);q.name=text(q.name||q.nome||q.titulo||q.título);const rawCat=text(q.category||q.categoria);q.category=CAT[rawCat]||rawCat;return q;}
function validate(p){const e=[];if(!p.name)e.push('nome ausente');if(!p.category)e.push('categoria ausente');for(const f of REQUIRED)if(text(p[f]).length<MIN[f])e.push(`${f} curto`);return e;}
function nextId(used){let n=0;for(const id of used){const m=/^produto-(\d+)$/i.exec(String(id));if(m)n=Math.max(n,Number(m[1]));}return n+1;}
function strip(s){return String(s||'').replace(/<[^>]+>/g,' ').replace(/[*_`]/g,'').replace(/^\s*(?:[-–—•>]\s*)+/,'').replace(/^\s*#+\s*/,'').trim();}
function labelKey(line){
 let s=strip(line).replace(/[:：]\s*$/,'').trim();
 if(!s)return null;
 const n=norm(s);
 for(const [key,alts] of Object.entries(LABELS))for(const a of alts){const na=norm(a);if(n===na||n.startsWith(na+' '))return key;}
 // Aceita variações naturais de títulos produzidos pelo ChatGPT.
 if(/^(tecnologias?|princ[ií]pios?)\s+(existentes?|reais?)(\s+hoje|\s+atualmente)?$/.test(n))return'realTech';
 if(/^(especifica(c|ç)(o|õ)es?|tecnologia)\s+(t(e|é)cnicas?|espec[ií]fica(s)?)(\s+utilizada(s)?)?$/.test(n))return'specTech';
 if(/^(tecnologias?|tecnologia)\s+(especulativa(s)?|inventada(s)?|fict[ií]cia(s)?)$/.test(n))return'inventedTech';
 if(/^(resultado(s)?|protocolo)\s+(dos?\s+)?testes?$/.test(n)||/^(testes?|teste)\s+(realizados?|e resultados?)$/.test(n))return'tests';
 if(/^(curiosidades?|fatos?\s+curiosos?)$/.test(n))return'curiosity';
 return null;
}
function productHeading(line){
 const s=strip(line);
 let m=s.match(/^(?:produto\s*)?(\d+)\s*[.)\-:–—]\s*(.+)$/i);
 if(!m)m=s.match(/^(?:produto\s+)?(\d+)\s+(.+)$/i);
 return m?strip(m[2]):null;
}
function parseBlock(block,headingName){
 const lines=block.replace(/\r/g,'').split('\n');const p={};if(headingName)p.name=headingName;let current=null;
 for(const original of lines){
  const line=original.trim();if(!line)continue;
  const key=labelKey(line);
  if(key){
   const cleaned=strip(line);const idx=cleaned.search(/[:：]/);const value=idx>=0?cleaned.slice(idx+1).trim():'';
   if(key==='name'){if(value)p.name=value;}else{current=key;if(value)p[key]=value;}
   continue;
  }
  if(current){const add=strip(line);if(add)p[current]=(p[current]?p[current]+' ':'')+add;}
 }
 if(!p.name){const first=lines.map(strip).find(Boolean);if(first)p.name=first;}
 if(!p.category)p.category='Tecnologia do futuro';
 if(!text(p.specTech)&&text(p.realTech))p.specTech=`Especificação técnica baseada nas tecnologias existentes descritas: ${p.realTech}`;
 if(!text(p.inventedTech)&&text(p.specTech)&&/especulativ|inventad|fict[ií]ci/i.test(text(p.specTech)))p.inventedTech=p.specTech;
 return p;
}
function rawToProducts(raw){
 const lines=raw.replace(/\r/g,'').split('\n');const chunks=[];let cur=[];let heading=null;
 for(const line of lines){const h=productHeading(line.trim());if(h){if(cur.length||heading)chunks.push({heading,lines:cur});cur=[];heading=h;}else cur.push(line);}
 if(cur.length||heading)chunks.push({heading,lines:cur});
 return chunks.map(c=>parseBlock(c.lines.join('\n'),c.heading)).filter(p=>p.name||p.what);
}
function parseInput(){const raw=$('input').value.trim();if(!raw)throw Error('Cole o texto das invenções.');try{return unwrap(JSON.parse(raw)).map(clean);}catch(_){return rawToProducts(raw).map(clean);}}
let result=[];
function convert(){let incoming;try{incoming=parseInput();}catch(e){$('report').textContent='ERRO: '+e.message;return;}const base=Array.isArray(window.FUTUROLOGIO_PRODUCTS)?window.FUTUROLOGIO_PRODUCTS.map(p=>({...p})):[];const ids=new Set(base.map(p=>String(p.id||'')));const names=new Set(base.map(p=>norm(p.name)));const whats=new Set(base.map(p=>norm(p.what)));const errors=[];const duplicates=[];const added=[];const out=[...base];let seq=nextId(ids);for(const p0 of incoming){const p=clean(p0);const e=validate(p);if(e.length){errors.push(`${p.name||'(sem nome)'}: ${e.join(', ')}`);continue;}const n=norm(p.name),w=norm(p.what);if((p.id&&ids.has(String(p.id)))||names.has(n)||whats.has(w)){duplicates.push(p.name||p.id||'(sem nome)');continue;}if(!p.id){do{p.id=`produto-${seq++}`}while(ids.has(p.id));}ids.add(String(p.id));names.add(n);whats.add(w);out.push(p);added.push(p);}result=out;render({base:base.length,incoming:incoming.length,added:added.length,duplicates:duplicates.length,rejected:errors.length,errors,duplicates,added});}
function render(s){const lines=[`CATÁLOGO MESTRE: ${s.base} produtos`,`TEXTO RECEBIDO: ${s.incoming} produtos identificados`,`NOVOS PRODUTOS: ${s.added}`,`DUPLICADOS IGNORADOS: ${s.duplicates}`,`REJEITADOS: ${s.rejected}`,`TOTAL GERADO: ${result.length}`,''];if(s.added)lines.push('IDs atribuídos:',...s.added.map(p=>`• ${p.id} — ${p.name}`),'');if(s.rejected)lines.push('Erros:',...s.errors.slice(0,80),'');if(s.duplicates)lines.push('Duplicados:',...s.duplicates.slice(0,80),'');lines.push('Pronto para baixar ou copiar o catalog.json.');$('report').textContent=lines.join('\n');$('download').disabled=!result.length;$('copy').disabled=!result.length;}
function status(){const n=Array.isArray(window.FUTUROLOGIO_PRODUCTS)?window.FUTUROLOGIO_PRODUCTS.length:0;$('report').textContent=`Catálogo mestre carregado: ${n} produtos.\nCole o texto bruto das invenções e clique em CONVERTER E VALIDAR.`;}
function download(){if(!result.length)return;const b=new Blob([JSON.stringify(result,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='catalog.json';document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500);}
$('convert').onclick=convert;$('download').onclick=download;$('copy').onclick=async()=>{if(!result.length)return;try{await navigator.clipboard.writeText(JSON.stringify(result,null,2));$('report').textContent+='\n\nJSON copiado para a área de transferência.';}catch(e){$('report').textContent+='\n\nNão foi possível copiar automaticamente: '+e.message;}};window.addEventListener('futuro-catalog-ready',status);setTimeout(status,1500);
})();