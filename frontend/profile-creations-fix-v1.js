(()=>{'use strict';if(window.__FUTURO_PROFILE_CREATIONS_FIX)return;window.__FUTURO_PROFILE_CREATIONS_FIX=true;if(!/profile(?:\.html)?$/i.test(location.pathname))return;if(new URLSearchParams(location.search).has('user'))return;
const API='https://motor-invencoes.edsonfernandesvet.workers.dev',TK='futuro_auth_token';const token=()=>localStorage.getItem(TK)||'';
const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const imageSrc=v=>{v=String(v||'').trim();if(!v)return '';let key='';try{key=localStorage.getItem('futuro_img_version_'+v)||''}catch{}return key?v+(v.includes('?')?'&':'?')+'futuro_img='+encodeURIComponent(key):v};
function card(x){const href='./criar.html?db_invention='+encodeURIComponent(x.id)+(x.source_id?'&invention='+encodeURIComponent(x.source_id):'');return '<a class="pv2-card" href="'+href+'">'+(x.image_url?'<img loading="lazy" decoding="async" src="'+esc(imageSrc(x.image_url))+'" alt="'+esc(x.name)+'">':'<div class="pv2-empty">SEM FOTO</div>')+'<div><b>'+esc(x.name)+'</b><small>'+esc(x.category||'')+'</small></div></a>'}
async function fill(){const grid=document.querySelector('.pv2-creations');if(!grid||!token())return;
  let items=[];
  try{const r=await fetch(API+'/api/my-inventions?limit=50&_='+Date.now(),{headers:{Authorization:'Bearer '+token()},cache:'no-store'});if(r.ok){const d=await r.json();items=d.items||[]}}catch{}
  if(!items.length){try{const me=JSON.parse(localStorage.getItem('futuro_social_user')||'null');const r=await fetch(API+'/api/recent-creations?limit=200&_='+Date.now(),{cache:'no-store'});const d=await r.json();const uid=String(me?.id||'');items=(d.items||[]).filter(x=>String(x.user_id||'')===uid||String(x.username||'').toLowerCase()===String(me?.username||'').toLowerCase())}catch{}}
  if(!items.length)return;
  const signature=items.map(x=>x.id+':'+(x.image_url||'')).join(',');
  if(grid.dataset.imageSignature===signature)return;
  grid.dataset.imageSignature=signature;grid.innerHTML=items.map(card).join('');
}
setTimeout(fill,700);setInterval(fill,5000)})();
