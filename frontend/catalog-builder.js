(()=>{'use strict';
const REQUIRED=['what','realTech','specTech','inventedTech','build','uses','dangers','curiosity','tests'];
const MIN={what:160,realTech:45,specTech:45,inventedTech:45,build:45,uses:30,dangers:40,curiosity:70,tests:70};
const CAT={'CASA & VIDA DOMÉSTICA':'Casa','TRABALHO & ESCRITÓRIO':'Escola & Trabalho','TRANSPORTE & TRÂNSITO':'Transporte','RELACIONAMENTOS & FAMÍLIA':'Mente & Comportamento','TECNOLOGIA & FUTURO':'Tecnologia do futuro','COMIDA & RESTAURANTES':'Comida & Cozinha','EDUCAÇÃO & FACULDADE':'Escola & Trabalho','DINHEIRO & CONSUMISMO':'Dinheiro & Negócios','SOCIEDADE & BUROCRACIA':'Cidade','ACADEMIA & ESPORTE':'Esportes','LAZER & ENTRETENIMENTO':'Entretenimento','VIZINHANÇA & CONVIVÊNCIA':'Cidade','ANIMAIS & PETS':'Animais','VIAGENS & TURISMO':'Viagem'};
const $=id=>document.getElementById(id);const text=v=>Array.isArray(v)?v.map(text).join(' '):v&&typeof v==='object'?Object.values(v).map(text).join(' '):String(v??'').trim();const norm=v=>text(v).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^\w\s]/g,' ').replace(/\s+/g,' ').trim();
function unwrap(v){if(Array.isArray(v))return v;if(v&&Array.isArray(v.products))return v.products;if(v&&Array.isArray(v.produtos))return v.produtos;if(v&&typeof v==='object')return [v];throw Error('Formato JSON não reconhecido.');}
function clean(p,i){const q={...p};q.id=text(q.id);q.name=text(q.name||q.nome);const rawCat=text(q.category||q.categoria);q.category=CAT[rawCat]||rawCat;return q;}
function validate(p){const e=[];if(!p.name)e.push('name ausente');if(!p.category)e.push('category ausente');for(const f of REQUIRED)if(text(p[f]).length<MIN[f])e.push(`${f} curto`);return e;}
function nextId(used){let n=0;for(const id of used){const m=/^produto-(\d+)$/i.exec(String(id));if(m)n=Math.max(n,Number(m[1]));}return n+1;}
let result=[];
function convert(){
 let incoming;try{const raw=JSON.parse($('input').value.trim());incoming=unwrap(raw).map((p,i)=>clean(p,i+1));}catch(e){$('report').textContent='ERRO: '+e.message;return;}
 const base=Array.isArray(window.FUTUROLOGIO_PRODUCTS)?window.FUTUROLOGIO_PRODUCTS.map(p=>({...p})):[];
 const ids=new Set(base.map(p=>String(p.id||'')));const names=new Set(base.map(p=>norm(p.name)));const whats=new Set(base.map(p=>norm(p.what)));const errors=[];const duplicates=[];const added=[];const out=[...base];let seq=nextId(ids);
 for(const p of incoming){
   const e=validate(p);if(e.length){errors.push(`${p.id||'(sem id)'}: ${e.join(', ')}`);continue;}
   const n=norm(p.name),w=norm(p.what);if((p.id&&ids.has(String(p.id)))||names.has(n)||whats.has(w)){duplicates.push(p.name||p.id||'(sem nome)');continue;}
   if(!p.id){do{p.id=`produto-${seq++}`}while(ids.has(p.id));}
   else if(ids.has(String(p.id))){duplicates.push(p.name||p.id);continue;}
   ids.add(String(p.id));names.add(n);whats.add(w);out.push(p);added.push(p);
 }
 result=out;render({base:base.length,incoming:incoming.length,added:added.length,duplicates:duplicates.length,rejected:errors.length,errors,duplicates,added});
}
function render(s){const lines=[`CATÁLOGO MESTRE: ${s.base} produtos`,`LOTE RECEBIDO: ${s.incoming}`,`NOVOS PRODUTOS: ${s.added}`,`DUPLICADOS IGNORADOS: ${s.duplicates}`,`REJEITADOS: ${s.rejected}`,`TOTAL GERADO: ${result.length}`,''];if(s.added)lines.push('IDs atribuídos:',...s.added.map(p=>`• ${p.id} — ${p.name}`),'');if(s.rejected)lines.push('Erros:',...s.errors.slice(0,80),'');if(s.duplicates)lines.push('Duplicados:',...s.duplicates.slice(0,80),'');lines.push('Pronto para baixar ou copiar o catalog.json.');$('report').textContent=lines.join('\n');$('download').disabled=!result.length;$('copy').disabled=!result.length;}
function status(){const n=Array.isArray(window.FUTUROLOGIO_PRODUCTS)?window.FUTUROLOGIO_PRODUCTS.length:0;$('report').textContent=`Catálogo mestre carregado: ${n} produtos.\nCole um lote JSON e clique em CONVERTER E VALIDAR.`;}
function download(){if(!result.length)return;const b=new Blob([JSON.stringify(result,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='catalog.json';document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500);}
$('convert').onclick=convert;$('download').onclick=download;$('copy').onclick=async()=>{if(!result.length)return;try{await navigator.clipboard.writeText(JSON.stringify(result,null,2));$('report').textContent+='\n\nJSON copiado para a área de transferência.';}catch(e){$('report').textContent+='\n\nNão foi possível copiar automaticamente: '+e.message;}};window.addEventListener('futuro-catalog-ready',status);setTimeout(status,1500);
})();