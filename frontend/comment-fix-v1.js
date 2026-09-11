(()=>{
'use strict';
if(window.__FUTURO_COMMENT_FIX_V2)return;
window.__FUTURO_COMMENT_FIX_V2=true;
const fix=()=>{
  const input=document.getElementById('futuroFinalComment')||document.getElementById('ftCommentInput');
  const btn=document.getElementById('futuroFinalCommentBtn')||document.getElementById('ftCommentBtn');
  if(input&&!input.dataset.commentFixBound){
    input.dataset.commentFixBound='1';
    input.type='text';
    input.setAttribute('autocomplete','off');
    input.setAttribute('autocorrect','on');
    input.setAttribute('autocapitalize','sentences');
    input.setAttribute('spellcheck','true');
    input.setAttribute('enterkeyhint','send');
    input.setAttribute('inputmode','text');
    input.addEventListener('keydown',e=>{e.stopPropagation();if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();btn?.click()}},{passive:false});
    input.addEventListener('click',e=>e.stopPropagation(),true);
    input.addEventListener('pointerdown',e=>e.stopPropagation(),true);
    input.addEventListener('pointerup',e=>e.stopPropagation(),true);
    input.addEventListener('touchstart',e=>e.stopPropagation(),{passive:true,capture:true});
    input.addEventListener('touchend',e=>e.stopPropagation(),{passive:true,capture:true});
  }
  if(btn){
    btn.type='button';btn.setAttribute('type','button');
    if(!btn.dataset.commentFixBound){
      btn.dataset.commentFixBound='1';
      ['click','pointerdown','pointerup','touchstart','touchend'].forEach(t=>btn.addEventListener(t,e=>e.stopPropagation(),{capture:true,passive:t.startsWith('touch')}));
    }
  }
  const row=input?.closest('.ft-comment-row');
  if(row&&!row.dataset.commentFixBound){
    row.dataset.commentFixBound='1';
    ['click','pointerdown','pointerup','touchstart','touchend'].forEach(t=>row.addEventListener(t,e=>e.stopPropagation(),{capture:true,passive:t.startsWith('touch')}));
    const form=row.closest('form');
    if(form){form.addEventListener('submit',e=>e.preventDefault(),{capture:true});form.noValidate=true;}
  }
};
new MutationObserver(fix).observe(document.body,{childList:true,subtree:true});
fix();
})();
