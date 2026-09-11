(()=>{
'use strict';
if(window.__FUTURO_COMMENT_FIX_V1)return;
window.__FUTURO_COMMENT_FIX_V1=true;
const fix=()=>{
  const input=document.getElementById('ftCommentInput'),btn=document.getElementById('ftCommentBtn');
  if(input){input.setAttribute('autocomplete','off');input.setAttribute('enterkeyhint','send');input.style.webkitUserSelect='text';input.style.userSelect='text';input.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();btn?.click()}}, {passive:false});}
  if(btn){btn.type='button';btn.setAttribute('type','button');}
  const row=input?.closest('.ft-comment-row');if(row){const form=row.closest('form');if(form){form.addEventListener('submit',e=>e.preventDefault(),{capture:true});form.noValidate=true;}}
};
new MutationObserver(fix).observe(document.body,{childList:true,subtree:true});
fix();
})();
