(()=>{
'use strict';
if(window.__FUTURO_COMMENT_FIX_V2_REAL)return;
window.__FUTURO_COMMENT_FIX_V2_REAL=true;
const API='https://motor-invencoes.edsonfernandesvet.workers.dev';
const TK='futuro_auth_token',UK='futuro_social_user',MAP='futuro_db_invention_ids';
const token=()=>localStorage.getItem(TK)||'';
const user=()=>{try{return JSON.parse(localStorage.getItem(UK)||'null')}catch{return null}};
const map=()=>{try{return JSON.parse(localStorage.getItem(MAP)||'{}')}catch{return {}}};
const product=()=>window.FUTUROLOGIO_CURRENT_PRODUCT||null;
function dbId(){const p=product();if(Number(window.FUTUROLOGIO_CURRENT_DB_ID))return Number(window.FUTUROLOGIO_CURRENT_DB_ID);if(p&&Number(p.__dbId))return Number(p.__dbId);return p?Number(map()[p.id]||0):0}
function stop(e){e.stopPropagation();e.stopImmediatePropagation()}
function install(){
 const input=document.getElementById('futuroFinalComment');
 const btn=document.getElementById('futuroFinalCommentBtn');
 if(!input||!btn)return;
 if(!input.dataset.v2bound){
  input.dataset.v2bound='1';
  ['pointerdown','pointerup','touchstart','touchend','mousedown','mouseup','click'].forEach(t=>input.addEventListener(t,stop,true));
  input.addEventListener('keydown',e=>{stop(e);if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send()}},{capture:true});
  input.addEventListener('input',e=>e.stopPropagation(),true);
 }
 if(!btn.dataset.v2bound){
  btn.dataset.v2bound='1';
  ['pointerdown','pointerup','touchstart','touchend','mousedown','mouseup','click'].forEach(t=>btn.addEventListener(t,stop,true));
  btn.addEventListener('click',e=>{stop(e);send()},{capture:true});
 }
 const row=input.closest('.ft-comment-row');
 if(row&&!row.dataset.v2bound){row.dataset.v2bound='1';['pointerdown','pointerup','touchstart','touchend','mousedown','mouseup','click'].forEach(t=>row.addEventListener(t,stop,true));}
}
let busy=false;
async function send(){
 if(busy)return;
 const input=document.getElementById('futuroFinalComment'),btn=document.getElementById('futuroFinalCommentBtn');
 if(!input||!btn)return;
 const u=user(),t=token();
 if(!u||!t){window.openAuth?.('login');return}
 const text=input.value.trim();if(!text){setTimeout(()=>input.focus(),0);return}
 const id=dbId();if(!id){alert('Não foi possível identificar esta invenção. Gere a invenção novamente.');return}
 busy=true;btn.disabled=true;btn.textContent='Enviando…';
 try{
  const r=await fetch(API+'/api/inventions/'+encodeURIComponent(id)+'/comment',{method:'POST',headers:{'content-type':'application/json','authorization':'Bearer '+t},body:JSON.stringify({text})});
  let d={};try{d=await r.json()}catch{}
  if(!r.ok)throw Error(d.error||'Não foi possível comentar.');
  input.value='';
  const list=document.getElementById('futuroFinalComments');
  if(list){const div=document.createElement('div');div.className='ft-comment';const name=String(u.username||'Você');div.textContent=name+': '+text;list.prepend(div)}
  window.FUTUROLOGIO_CHECK_REWARDS?.();
 }catch(e){alert(e.message||'Não foi possível comentar.');}
 finally{busy=false;btn.disabled=false;btn.textContent='Comentar';setTimeout(()=>input.focus(),0)}
}
new MutationObserver(install).observe(document.body,{childList:true,subtree:true});
install();
})();
