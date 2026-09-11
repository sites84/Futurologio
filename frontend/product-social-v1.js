(()=>{
'use strict';
if(window.__FUTURO_PRODUCT_SOCIAL_V2)return;
window.__FUTURO_PRODUCT_SOCIAL_V2=true;
const API='https://motor-invencoes.edsonfernandesvet.workers.dev';
const TK='futuro_auth_token',UK='futuro_social_user',MAP='futuro_db_invention_ids';
const token=()=>localStorage.getItem(TK)||'';
const currentUser=()=>{try{return JSON.parse(localStorage.getItem(UK)||'null')}catch{return null}};
const product=()=>window.FUTUROLOGIO_CURRENT_PRODUCT||null;
const idMap=()=>{try{return JSON.parse(localStorage.getItem(MAP)||'{}')}catch{return {}}};
function dbId(){const p=product();return Number(window.FUTUROLOGIO_CURRENT_DB_ID)||Number(p?.__dbId)||Number(p?idMap()[p.id]:0)||0}
function clearSession(){localStorage.removeItem(TK);localStorage.removeItem(UK)}
function requireLogin(){if(!currentUser()||!token()){window.openAuth?.('login');return false}return true}
function handle401(){clearSession();window.openAuth?.('login')}
function key(id){const u=currentUser();return 'futuro_like_'+String(u?.id||u?.email||'guest')+'_'+id}
function likedLocal(id){return localStorage.getItem(key(id))==='1'}
function setLiked(id,v){if(v)localStorage.setItem(key(id),'1');else localStorage.removeItem(key(id))}
function esc(v){const d=document.createElement('div');d.textContent=String(v??'');return d.innerHTML}
function normalizeComments(d){let a=d?.comments||d?.data?.comments||[];if(!Array.isArray(a)&&a&&Array.isArray(a.results))a=a.results;return Array.isArray(a)?a:[]}
function commentText(c){return c?.text??c?.comment??c?.content??''}
function commentName(c){return c?.username??c?.user?.username??c?.author??'Usuário'}
function make(){
 const result=document.getElementById('result');if(!result||result.classList.contains('hidden'))return;
 const share=result.querySelector('.share');if(!share)return;
 let box=document.getElementById('futuroProductSocial');
 if(!box){box=document.createElement('section');box.id='futuroProductSocial';box.className='futuro-product-social';share.parentNode.insertBefore(box,share)}
 box.innerHTML=`<div class="fps-actions"><button type="button" id="fpsLike" class="fps-btn fps-like">Curtir <span id="fpsLikeCount">0</span></button><button type="button" id="fpsComment" class="fps-btn fps-comment">Comentar <span id="fpsCommentCount">0</span></button></div><div id="fpsComments" class="fps-comments"><div class="fps-comment-form"><input id="fpsCommentInput" maxlength="500" autocomplete="off" placeholder="Escreva um comentário…"><button type="button" id="fpsCommentSend">Enviar</button></div><div id="fpsCommentList"></div></div>`;
 box.querySelector('#fpsLike').onclick=toggleLike;
 box.querySelector('#fpsComment').onclick=()=>{const c=box.querySelector('#fpsComments');c.classList.toggle('open');if(c.classList.contains('open'))setTimeout(()=>box.querySelector('#fpsCommentInput')?.focus(),20)};
 box.querySelector('#fpsCommentSend').onclick=sendComment;
 box.querySelector('#fpsCommentInput').addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendComment()}});
 refresh();
}
async function refresh(){const id=dbId();if(!id)return;const b=document.getElementById('fpsLike');if(b){const like=likedLocal(id);b.classList.toggle('liked',like);b.setAttribute('aria-pressed',String(like))}
 try{const r=await fetch(API+'/api/inventions/'+encodeURIComponent(id),{cache:'no-store'});if(!r.ok)throw Object.assign(new Error('refresh'),{status:r.status});const d=await r.json();const now=likedLocal(id);if(b){b.classList.toggle('liked',now);b.setAttribute('aria-pressed',String(now))}const lc=document.getElementById('fpsLikeCount');if(lc)lc.textContent=Number(d.likes??0);const arr=normalizeComments(d);const cc=document.getElementById('fpsCommentCount');if(cc)cc.textContent=Number(d.comments??arr.length);renderComments(arr)}catch(e){if(e?.status===401)handle401()}
}
async function toggleLike(){if(!requireLogin())return;const id=dbId();if(!id)return;const b=document.getElementById('fpsLike');if(!b)return;const before=likedLocal(id);b.disabled=true;setLiked(id,!before);b.classList.toggle('liked',!before);b.setAttribute('aria-pressed',String(!before));try{const r=await fetch(API+'/api/inventions/'+encodeURIComponent(id)+'/like',{method:'POST',headers:{authorization:'Bearer '+token(),'content-type':'application/json'},body:'{}'});const d=await r.json().catch(()=>({}));if(r.status===401){handle401();throw Error('AUTH_HANDLED')}if(!r.ok)throw Error(d.error||'Não foi possível curtir.');const server=typeof d.liked==='boolean'?d.liked:!before;setLiked(id,server);b.classList.toggle('liked',server);b.setAttribute('aria-pressed',String(server));const lc=document.getElementById('fpsLikeCount');if(lc&&d.likes!=null)lc.textContent=Number(d.likes);window.FUTUROLOGIO_CHECK_REWARDS?.()}catch(e){if(e.message!=='AUTH_HANDLED'){setLiked(id,before);b.classList.toggle('liked',before);b.setAttribute('aria-pressed',String(before));if(e.message)alert(e.message)}}finally{b.disabled=false}}
async function sendComment(){if(!requireLogin())return;const id=dbId(),input=document.getElementById('fpsCommentInput'),btn=document.getElementById('fpsCommentSend');if(!id||!input||!btn)return;const text=input.value.trim();if(!text){input.focus();return}btn.disabled=true;btn.textContent='Enviando…';try{const r=await fetch(API+'/api/inventions/'+encodeURIComponent(id)+'/comment',{method:'POST',headers:{authorization:'Bearer '+token(),'content-type':'application/json'},body:JSON.stringify({text})});const d=await r.json().catch(()=>({}));if(r.status===401){handle401();throw Error('AUTH_HANDLED')}if(!r.ok)throw Error(d.error||'Não foi possível comentar.');input.value='';const list=document.getElementById('fpsCommentList');if(list){const c=d.comment||{text,username:currentUser()?.username||'Você'};list.insertAdjacentHTML('afterbegin',`<div class="fps-comment"><b>${esc(commentName(c))}</b><span>${esc(commentText(c)||text)}</span></div>`)}const cc=document.getElementById('fpsCommentCount');if(cc)cc.textContent=Number(cc.textContent||0)+1;window.FUTUROLOGIO_CHECK_REWARDS?.();setTimeout(()=>input.focus(),20)}catch(e){if(e.message!=='AUTH_HANDLED')alert(e.message||'Não foi possível comentar.')}finally{btn.disabled=false;btn.textContent='Enviar'}}
function renderComments(arr){const list=document.getElementById('fpsCommentList');if(!list)return;list.innerHTML=arr.map(c=>`<div class="fps-comment"><b>${esc(commentName(c))}</b><span>${esc(commentText(c))}</span></div>`).join('');const cc=document.getElementById('fpsCommentCount');if(cc)cc.textContent=arr.length}
const css=document.createElement('style');css.textContent=`.futuro-final-social .ft-comment-row,.futuro-final-social #futuroFinalComments{display:none!important}#futuroProductSocial{margin:15px 0 0;padding:14px 0 0;border-top:2px solid var(--ink)}.fps-actions{display:flex;gap:10px;flex-wrap:wrap}.fps-btn{border:1.5px solid var(--ink);border-radius:12px;padding:13px 18px;font-weight:900;cursor:pointer;background:#fff}.fps-like.liked{background:#ff5b55;color:#fff}.fps-comments{display:none;margin-top:12px;border:1.5px solid var(--ink);border-radius:14px;padding:12px;background:#fff}.fps-comments.open{display:block}.fps-comment-form{display:flex;gap:8px}.fps-comment-form input{flex:1;min-width:0;border:1.5px solid var(--ink);border-radius:10px;padding:11px;background:#fff;color:#171717;font:inherit}.fps-comment-form button{border:1.5px solid var(--ink);border-radius:10px;padding:10px 14px;background:#d8ff55;font-weight:900;cursor:pointer}.fps-comment{display:flex;flex-direction:column;gap:3px;margin-top:9px;padding:9px 10px;background:#f5f2ea;border-radius:9px}.fps-comment b{font-size:12px}.fps-comment span{font-size:13px;line-height:1.4;white-space:pre-wrap;overflow-wrap:anywhere}`;document.head.appendChild(css);
new MutationObserver(()=>{if(document.getElementById('result')&&!document.getElementById('futuroProductSocial'))make()}).observe(document.body,{childList:true,subtree:true});
let last='';setInterval(()=>{const n=document.getElementById('name')?.textContent?.trim()||'';if(n&&n!==last){last=n;setTimeout(make,50)}},500);setTimeout(make,300);
})();
