(()=>{
'use strict';
if(window.__FUTUROLOGIO_SHARE_FIX)return;
window.__FUTUROLOGIO_SHARE_FIX=true;
const API='https://motor-invencoes.edsonfernandesvet.workers.dev';
const token=()=>localStorage.getItem('futuro_auth_token')||'';
function loadRewards(){if(document.getElementById('futuroGamificationEvents'))return;const s=document.createElement('script');s.id='futuroGamificationEvents';s.src='./frontend/gamification-events.js?v=20260910b';document.head.appendChild(s)}
loadRewards();
function product(){return window.FUTUROLOGIO_CURRENT_PRODUCT||null}
function dbId(){const q=new URLSearchParams(location.search).get('db_invention');if(q&&/^\d+$/.test(q))return Number(q);const p=product();try{return Number(p?.__dbId||window.FUTUROLOGIO_CURRENT_DB_ID||window.FUTUROLOGIO_DB_ID_FOR?.(p?.id)||0)}catch{return Number(p?.__dbId||0)}}
function shareUrl(){const id=dbId();return id?API+'/share/'+id:location.href}
function productData(){const p=product()||{};const name=p.name||document.getElementById('name')?.textContent?.trim()||'Invenção FUTUROLOGIO™';const raw=p.what||p.concept||document.getElementById('what')?.textContent||'';const desc=String(raw).replace(/\s+/g,' ').trim();return {name,desc:desc.length>180?desc.slice(0,177)+'...':desc}}
function slug(s){return String(s||'produto').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,50)||'produto'}
function logShare(){const id=dbId();if(!id||!token())return;try{fetch(API+'/api/inventions/'+id+'/share',{method:'POST',headers:{Authorization:'Bearer '+token(),'content-type':'application/json'},body:'{}',keepalive:true})}catch{}}
async function getImageFile(id,name){if(!id)return null;try{const r=await fetch(API+'/api/invention-image/'+id,{cache:'no-store'});if(!r.ok)return null;const blob=await r.blob();if(!blob.type.startsWith('image/'))return null;const ext=blob.type==='image/png'?'png':blob.type==='image/webp'?'webp':'jpg';return new File([blob],'futurologio-'+slug(name)+'.'+ext,{type:blob.type,lastModified:Date.now()})}catch{return null}}
async function nativeShare(){const id=dbId(),u=shareUrl(),d=productData(),title=d.name+' — FUTUROLOGIO™',cta='Crie seu produto absurdo você também!';const text=[title,d.desc,cta,u].filter(Boolean).join('\n\n');if(!navigator.share){await copy(u);return}try{let file=null;if(id)file=await getImageFile(id,d.name);if(file&&navigator.canShare?.({files:[file]})){await navigator.share({title,text,files:[file]})}else{await navigator.share({title,text,url:u})}logShare()}catch(e){if(e?.name!=='AbortError')await copy(u)}}
function css(){if(document.getElementById('shareFixCss'))return;const s=document.createElement('style');s.id='shareFixCss';s.textContent='.share-fix{margin-top:15px}.share-fix-button{display:inline-flex;align-items:center;justify-content:center;gap:8px;background:#d8ff55;color:#171717;border:2px solid #171717;border-radius:12px;padding:13px 17px;font:900 14px/1 system-ui,sans-serif;cursor:pointer;box-shadow:3px 3px 0 #171717}.share-fix-button:active{transform:translate(2px,2px);box-shadow:1px 1px 0 #171717}.share-fix-note{display:block;margin-top:8px;font-size:11px;color:#6f6b63}';document.head.appendChild(s)}
function make(){css();const result=document.getElementById('result');if(!result||result.classList.contains('hidden'))return;let box=document.getElementById('shareFix');if(!box){const old=document.getElementById('shareBtn');box=document.createElement('div');box.id='shareFix';box.className='share-fix';box.innerHTML='<button type="button" class="share-fix-button">↗ COMPARTILHAR INVENÇÃO</button><span class="share-fix-note">A foto da invenção será anexada quando disponível. O link leva diretamente ao produto.</span>';if(old)old.replaceWith(box);else{const anchor=result.querySelector('.stamp')||result.lastElementChild;anchor?.insertAdjacentElement('beforebegin',box)}box.querySelector('button').onclick=nativeShare}}
function copy(u){return navigator.clipboard?.writeText(u).then(()=>alert('Link da invenção copiado.')).catch(()=>prompt('Copie o link da invenção:',u))}
function tick(){make()}setTimeout(tick,500);setTimeout(tick,1200);setInterval(tick,1500)
})();
