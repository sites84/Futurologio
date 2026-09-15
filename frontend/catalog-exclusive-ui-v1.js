(()=>{'use strict';
if(window.__FUTURO_CATALOG_EXCLUSIVE_UI_V1)return;window.__FUTURO_CATALOG_EXCLUSIVE_UI_V1=true;
const API='https://motor-invencoes.edsonfernandesvet.workers.dev';
const removeClaimed=claimed=>{
  const set=new Set((claimed||[]).map(String));
  if(!Array.isArray(window.FUTUROLOGIO_PRODUCTS))return;
  window.FUTUROLOGIO_PRODUCTS=window.FUTUROLOGIO_PRODUCTS.filter(p=>!set.has(String(p?.id)));
  window.FUTUROLOGIO_CATALOG_UNION_COUNT=window.FUTUROLOGIO_PRODUCTS.length;
  window.dispatchEvent(new Event('futuro-catalog-ready'));
};
const refresh=async()=>{try{const r=await fetch(API+'/api/catalog-available?ts='+Date.now(),{cache:'no-store'});if(!r.ok)return;const d=await r.json();if(d?.ok)removeClaimed(d.claimed||[])}catch{}};
const originalFetch=window.fetch.bind(window);
window.fetch=async(...args)=>{
  const req=args[0];
  const url=typeof req==='string'?req:(req?.url||'');
  const method=(typeof req==='string'?(args[1]?.method||'GET'):req?.method||'GET').toUpperCase();
  let sourceId='';
  if(method==='POST'&&url.includes('/api/catalog-invention')){
    try{const raw=typeof req==='string'?args[1]?.body:req?.clone?await req.clone().text():'';const b=typeof raw==='string'?JSON.parse(raw):{};sourceId=String(b.source_id||'')}catch{}
  }
  const response=await originalFetch(...args);
  if(sourceId){
    try{const d=await response.clone().json();
      if(response.ok&&d?.ok){removeClaimed([sourceId]);}
      else if(response.status===409&&d?.code==='CATALOG_ALREADY_CLAIMED'){
        removeClaimed([sourceId]);
        setTimeout(()=>alert('Este produto já foi criado por outro usuário e acabou de sair do catálogo.'),0);
      }
    }catch{}
  }
  return response;
};
refresh();
setInterval(refresh,10000);
})();
