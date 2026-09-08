(() => {
  'use strict';
  const API='https://motor-invencoes.edsonfernandesvet.workers.dev';
  async function load(){const id=new URLSearchParams(location.search).get('db_invention');if(!id)return;try{const r=await fetch(API+'/api/invention/'+encodeURIComponent(id));if(!r.ok)return;const d=await r.json();const list=window.FUTUROLOGIO_PRODUCTS||window.PRODUCTS||[];let p=d.source_id!=null?list.find(x=>String(x.id)===String(d.source_id)):null;if(!p){const data=d.data||{};p={id:d.source_id||('db-'+d.id),name:d.name,category:d.category,what:data.what||d.concept||'',realTech:data.realTech||'',specTech:data.specTech||'',inventedTech:data.inventedTech||'',build:data.build||'',uses:data.uses||'',dangers:data.dangers||'',test:data.test||'',curiosity:data.curiosity||'',readiness:data.readiness||'',year:data.year||'',patent:data.patent||''};}if(typeof window.show==='function'){window.show(p);window.FUTUROLOGIO_DB_ID_FOR=()=>Number(d.id);return}const name=document.getElementById('name');if(name)name.textContent=d.name}catch{}}
  const timer=setInterval(()=>{if(window.FUTUROLOGIO_PRODUCTS||window.PRODUCTS){clearInterval(timer);load()}},100);
})();
