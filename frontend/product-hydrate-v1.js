(()=>{'use strict';if(window.__FUTURO_PRODUCT_HYDRATE_V1)return;window.__FUTURO_PRODUCT_HYDRATE_V1=true;const API='https://motor-invencoes.edsonfernandesvet.workers.dev';const $=id=>document.getElementById(id);function q(){return new URLSearchParams(location.search)}function setText(id,v){const el=$(id);if(el)el.textContent=v==null?'':String(v)}function fill(p){const result=$('result');if(!result)return;result.classList.remove('hidden');
  setText('name',p.name);setText('subtitle',p.category||'');setText('intro',p.what||p.concept||'');
  setText('what',p.what||p.concept||'');setText('real',p.realTech||'');setText('spec',p.specTech||'');setText('imp',p.inventedTech||'');
  setText('build',p.build||'');setText('uses',p.uses||'');setText('danger',p.dangers||'');setText('test',p.test||'');setText('curiosity',p.curiosity||'');
  setText('readiness',p.readiness||'—');setText('year',p.year||'—');setText('patent',p.patent||'—');
  window.FUTUROLOGIO_CURRENT_PRODUCT=p;window.FUTUROLOGIO_CURRENT_DB_ID=p.__dbId||p.id;
  window.FUTUROLOGIO_REFRESH_PROMPT?.();
}
function mapApi(d){const data=d.data&&typeof d.data==='object'?d.data:{};let parsed=data;if(typeof d.data==='string'){try{parsed=JSON.parse(d.data)}catch{parsed={}}}return {
  id:parsed.source_id||d.source_id||('db-'+d.id),
  name:d.name,category:d.category,concept:d.concept,
  what:parsed.what||d.concept,realTech:parsed.realTech,specTech:parsed.specTech,inventedTech:parsed.inventedTech,
  build:parsed.build,uses:parsed.uses,dangers:parsed.dangers,test:parsed.test,curiosity:parsed.curiosity,
  readiness:parsed.readiness,year:parsed.year,patent:parsed.patent,
  image_url:d.image_url,__dbId:d.id,user_id:d.user?.id,username:d.user?.username
}}
async function fromApi(id){const r=await fetch(API+'/api/invention/'+id+'?_='+Date.now(),{cache:'no-store'});if(!r.ok)throw new Error('not found');const d=await r.json();if(!d||(!d.ok&&!d.id&&!d.name))throw new Error('empty');return mapApi(d)}
async function fromCatalog(code){const list=Array.isArray(window.FUTUROLOGIO_PRODUCTS)?window.FUTUROLOGIO_PRODUCTS:[];return list.find(x=>String(x.id)===String(code))||null}
async function boot(){const qs=q();const db=Number(qs.get('db_invention')||qs.get('id')||0);const code=qs.get('invention')||'';if(!db&&!code)return;
  try{if(db){fill(await fromApi(db));return}if(code){let p=await fromCatalog(code);if(!p){await new Promise(r=>setTimeout(r,800));p=await fromCatalog(code)}if(p){fill({...p,__dbId:window.FUTUROLOGIO_CURRENT_DB_ID});return}}}catch(e){console.warn('hydrate',e)}}
boot();setTimeout(boot,600);setTimeout(boot,1600)})();
