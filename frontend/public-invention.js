(() => {
  'use strict';
  const API='https://motor-invencoes.edsonfernandesvet.workers.dev';
  const mediaUrl=v=>{const s=String(v||'').trim();return s?(s.startsWith('http://')||s.startsWith('https://')?s:API+(s.startsWith('/')?s:'/'+s)):''};
  function paintImage(id,p){
    const src=mediaUrl(p?.image_url||API+'/api/invention-image/'+id);if(!src)return;
    const started=Date.now();
    const timer=setInterval(()=>{
      const card=document.querySelector('.game-image-card');
      const ph=card?.querySelector('.game-image-placeholder');
      if(card&&ph){
        const name=String(p?.name||'Invenção').replace(/"/g,'&quot;');
        ph.innerHTML='<img alt="'+name+'" src="'+src.replace(/"/g,'&quot;')+'">';
        const meta=card.querySelector('.game-image-meta b');if(meta)meta.textContent='UPLOAD DISPONÍVEL';
        clearInterval(timer);return;
      }
      if(Date.now()-started>8000)clearInterval(timer);
    },100);
  }
  async function load(){
    const id=new URLSearchParams(location.search).get('db_invention');if(!id)return;
    try{
      const r=await fetch(API+'/api/invention/'+encodeURIComponent(id));if(!r.ok)throw new Error('Invenção não encontrada');
      const d=await r.json();
      const list=window.FUTUROLOGIO_PRODUCTS||window.PRODUCTS||[];
      let p=d.source_id!=null?list.find(x=>String(x.id)===String(d.source_id)):null;
      if(!p){
        const data=d.data||{};
        p={id:d.source_id||('db-'+d.id),name:d.name,category:d.category,subtitle:data.subtitle||'',what:data.what||d.concept||'',realTech:data.realTech||'',specTech:data.specTech||'',inventedTech:data.inventedTech||'',build:data.build||'',uses:data.uses||'',dangers:data.dangers||'',test:data.test||'',tests:data.test||'',curiosity:data.curiosity||'',readiness:data.readiness||'',year:data.year||'',patent:data.patent||''};
      }else p={...p};
      p.image_url=mediaUrl(d.image_url||p.image_url);
      window.FUTUROLOGIO_CURRENT_PRODUCT=p;
      window.FUTUROLOGIO_DB_ID_FOR=()=>Number(d.id);
      if(typeof window.show==='function'){
        window.show(p);
        paintImage(d.id,p);
        const result=document.getElementById('result');if(result)result.scrollIntoView({behavior:'smooth',block:'start'});
      }else throw new Error('Tela de invenção ainda não carregada');
    }catch(e){
      const msg=e?.message||'Não foi possível abrir esta invenção.';
      if(msg==='Tela de invenção ainda não carregada')return;
      console.warn('[FUTUROLOGIO] direct invention load failed',e);
    }
  }
  const start=Date.now();
  const timer=setInterval(()=>{
    if(typeof window.show==='function'||Date.now()-start>5000){clearInterval(timer);load()}
  },100);
})();
