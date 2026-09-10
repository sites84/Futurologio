(()=>{
'use strict';
if(window.__FUTURO_RECENT_FIX)return;
window.__FUTURO_RECENT_FIX=true;
const API='https://motor-invencoes.edsonfernandesvet.workers.dev';
let data=[],shown=4,rendering=false;
const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
function normalize(x,catalog){const p=catalog.find(v=>String(v.id)===String(x.source_id));return {...x,catalog_id:p?.id||x.source_id||'',name:p?.name||x.name,category:p?.category||x.category}}
function card(raw,catalog){const x=normalize(raw,catalog),href='./criar.html?db_invention='+encodeURIComponent(x.id)+(x.catalog_id?'&invention='+encodeURIComponent(x.catalog_id):'');const image=x.image_url?'<img loading="lazy" src="'+esc(x.image_url)+'" alt="'+esc(x.name)+'">':'<div class="thumb empty">Imagem ainda não enviada</div>';return '<article class="item" data-recent-id="'+Number(x.id||0)+'" onclick="location.href=\''+href+'\'"><div class="thumb">'+image+'</div><div class="item-body"><h3>'+esc(x.name)+'</h3><div class="meta">'+esc(x.category)+' · por '+esc(x.username||'criador')+'</div><div class="stats"><span>♥ '+Number(x.likes||0)+'</span><span>💬 '+Number(x.comments||0)+'</span></div></div></article>'}
function render(catalog){const feed=document.getElementById('recentFeed'),more=document.getElementById('moreBtn');if(!feed)return;rendering=true;feed.dataset.futuroRecent='1';const items=data.slice(0,shown);feed.innerHTML=items.length?items.map(x=>card(x,catalog)).join(''):'<div class="empty-state">Ainda não há criações globais registradas.</div>';if(more){more.hidden=shown>=data.length||!data.length;more.onclick=()=>{shown=Math.min(shown+4,data.length);render(catalog)}}rendering=false}
async function init(){try{const catalog=await fetch('./catalog.json?recentfix=1').then(r=>r.json()).catch(()=>[]);const r=await fetch(API+'/api/explore?mode=recent&limit=24',{cache:'no-store'});if(!r.ok)throw new Error();const d=await r.json();data=(d.items||[]).slice().sort((a,b)=>Number(b.id||0)-Number(a.id||0));if(document.getElementById('recentFeed')){render(catalog);observe(catalog)}}catch{}}
function observe(catalog){const feed=document.getElementById('recentFeed');if(!feed)return;new MutationObserver(()=>{if(rendering)return;const expected=data.slice(0,shown).map(x=>String(x.id));const actual=[...feed.querySelectorAll('[data-recent-id]')].map(x=>x.dataset.recentId);if(expected.length!==actual.length||expected.some((v,i)=>v!==actual[i]))setTimeout(()=>render(catalog),0)}).observe(feed,{childList:true,subtree:true});}
init();
})();
