(() => {
  'use strict';
  if (window.__FUTUROLOGIO_FINAL_UI) return;
  window.__FUTUROLOGIO_FINAL_UI = true;

  const API='https://motor-invencoes.edsonfernandesvet.workers.dev';
  const TOKEN_KEY='futuro_auth_token', USER_KEY='futuro_social_user', MAP_KEY='futuro_db_invention_ids';
  const token=()=>localStorage.getItem(TOKEN_KEY)||'';
  const user=()=>{try{return JSON.parse(localStorage.getItem(USER_KEY)||'null')}catch{return null}};
  const dbMap=()=>{try{return JSON.parse(localStorage.getItem(MAP_KEY)||'{}')}catch{return {}}};
  const name=()=>document.getElementById('name')?.textContent?.trim()||'';
  const products=()=>window.FUTUROLOGIO_PRODUCTS||[];
  const same=(a,b)=>String(a||'').trim()===String(b||'').trim();

  function currentProduct(){
    const n=name(), c=window.FUTUROLOGIO_CURRENT_PRODUCT;
    if(c&&(!n||same(c.name,n))) return c;
    return n?products().find(p=>same(p.name,n))||null:null;
  }
  function currentDbId(p){
    const c=window.FUTUROLOGIO_CURRENT_PRODUCT;
    if(c&&p&&same(c.name,p.name)&&Number(c.__dbId)) return Number(c.__dbId);
    if(c&&p&&same(c.name,p.name)&&Number(window.FUTUROLOGIO_CURRENT_DB_ID)) return Number(window.FUTUROLOGIO_CURRENT_DB_ID);
    try{const x=p&&window.FUTUROLOGIO_DB_ID_FOR?.(p.id);if(x)return Number(x)}catch{}
    return p?Number(dbMap()[p.id]||0):0;
  }
  function media(v){const s=String(v||'').trim();return s?(s.startsWith('http://')||s.startsWith('https://')?s:API+(s.startsWith('/')?s:'/'+s)):''}
  function clearDirectQuery(){try{const u=new URL(location.href);if(u.searchParams.has('db_invention')){u.searchParams.delete('db_invention');history.replaceState(null,'',u.pathname+(u.searchParams.toString()?'?'+u.searchParams.toString():'')+u.hash)}}catch{}}

  const css=document.createElement('style');css.id='futuro-final-ui-css';css.textContent=`
    .game-image-card:after{display:none!important;content:none!important}
    .futuro-final-image-actions{display:flex;flex-direction:column;align-items:center;gap:7px;margin-top:12px}.futuro-final-image-actions button{border:1.5px solid #fff;border-radius:10px;background:#d8ff55;color:#091007;padding:10px 14px;font-size:11px;font-weight:1000;cursor:pointer}.futuro-final-image-actions button:disabled{opacity:.55;cursor:wait}.futuro-final-upload-status{font-size:10px;line-height:1.4;color:#9eb1d0;text-align:center}.futuro-final-upload-status.ok{color:#d8ff55}.futuro-final-upload-status.err{color:#ff8da7}
    .futuro-final-image-missing{aspect-ratio:16/9;border-radius:10px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:22px;background:radial-gradient(circle at 50% 40%,#24395c,#0b1120 68%);color:#9eb1d0;border:1px dashed #3b537a}.futuro-final-image-missing strong{display:block;color:#d8ff55;font-size:15px;margin-bottom:6px}.futuro-final-image-missing span{font-size:11px;line-height:1.5}
    .futuro-final-fullscreen{position:fixed;inset:0;z-index:100000;background:rgba(2,5,12,.97);display:none;align-items:center;justify-content:center;padding:20px}.futuro-final-fullscreen.open{display:flex}.futuro-final-fullscreen img{max-width:96vw;max-height:92vh;width:auto;height:auto;object-fit:contain;border-radius:10px}.futuro-final-fullscreen button{position:absolute;right:16px;top:14px;width:44px;height:44px;border:1px solid #6b82ab;border-radius:50%;background:#101a2e;color:#fff;font-size:26px;cursor:pointer}
    #result .ft-social.futuro-final-social{display:none!important;margin-top:16px;border-top:1.5px solid #30415f;padding-top:14px}#result .ft-social.futuro-final-social.ft-share-open{display:block!important}#result .futuro-final-social h3{margin:0 0 10px;color:#fff;font-size:15px}#result .futuro-final-social .ft-social-row{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px}#result .futuro-final-social .ft-btn{display:flex;align-items:center;justify-content:center;gap:7px;min-height:44px;border:1px solid transparent;border-radius:10px;color:#fff;font-size:11px;font-weight:1000;cursor:pointer}.futuro-final-social svg{width:19px;height:19px;flex:none}.futuro-final-social [data-platform="whatsapp"]{background:#25D366}.futuro-final-social [data-platform="facebook"]{background:#1877F2}.futuro-final-social [data-platform="x"]{background:#000}.futuro-final-social [data-platform="instagram"]{background:linear-gradient(135deg,#833AB4,#E1306C,#FCAF45)}.futuro-final-social [data-platform="threads"]{background:#111}.futuro-final-social [data-platform="copy"]{background:#405476}.futuro-final-social [data-platform="native"]{background:#d8ff55;color:#091007}.futuro-final-social .ft-comment-row{display:flex;gap:7px;margin-top:12px}.futuro-final-social .ft-comment-row input{flex:1;min-width:0;border:1.5px solid #405476;border-radius:10px;padding:9px;background:#070d19;color:#fff}.futuro-final-social .ft-comment{font-size:11px;margin-top:7px;padding:6px 9px;background:#fff;color:#171717;border-left:3px solid #171717}@media(max-width:700px){#result .futuro-final-social .ft-social-row{grid-template-columns:repeat(2,minmax(0,1fr))}}
  `;document.head.appendChild(css);

  const ICONS={
    whatsapp:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path fill="currentColor" d="M8.4 8.2c.3-.4.8-.5 1.1-.2l1.1 1c.3.3.3.7.1 1l-.4.8c.7 1.2 1.7 2.1 2.9 2.7l.8-.5c.3-.2.8-.1 1.1.2l1 1.1c.3.3.2.8-.2 1.1-.5.5-1.2.7-1.9.6-3.3-.5-6-2.7-7-5.8-.2-.7-.1-1.4.5-2z"/></svg>',
    facebook:'<svg viewBox="0 0 24 24"><path fill="currentColor" d="M14 21v-8h2.8l.4-3H14V8.1c0-.9.3-1.5 1.6-1.5h1.8V4a22 22 0 0 0-2.6-.1c-2.6 0-4.3 1.5-4.3 4.2V10H8v3h2.5v8H14Z"/></svg>',
    x:'<svg viewBox="0 0 24 24"><path fill="currentColor" d="M5 4h3.6l4 5.4L17.2 4h1.9l-5.6 6.6L19.6 20H16l-4.1-5.8L7 20H5l5.9-6.9L5 4Zm3.3 1.7H7.1l9.4 12.6h1.2L8.3 5.7Z"/></svg>',
    instagram:'<svg viewBox="0 0 24 24"><rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4.1" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.5" cy="6.6" r="1.2" fill="currentColor"/></svg>',
    threads:'<svg viewBox="0 0 24 24"><path d="M17.9 9.5c-.4-3.3-2.6-5.1-6.1-5.1-3.7 0-6.2 2.3-6.2 6.4 0 4.9 2.7 7.8 6.8 7.8 3.2 0 5.2-1.7 5.2-4.4 0-2.4-1.8-4-4.4-4-2.1 0-3.5 1-3.5 2.7 0 1.2 1 2 2.4 2 2.5 0 4-1.8 4-4.5 0-4.1-2.5-6.4-6.2-6.4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
  };

  function fullscreen(src,alt){let o=document.getElementById('futuroFinalFullscreen');if(!o){o=document.createElement('div');o.id='futuroFinalFullscreen';o.className='futuro-final-fullscreen';o.innerHTML='<button type="button" aria-label="Fechar">×</button><img alt="">';document.body.appendChild(o);o.onclick=e=>{if(e.target===o||e.target.tagName==='BUTTON')o.classList.remove('open')};document.addEventListener('keydown',e=>{if(e.key==='Escape')o.classList.remove('open')})}const img=o.querySelector('img');img.src=src;img.alt=alt||'Imagem da invenção';o.classList.add('open')}

  function uploadControls(card,hasImage,inside){
    const holder=inside?(card.querySelector('.futuro-final-image-missing')||card):card;
    let box=holder.querySelector('.futuro-final-image-actions');
    if(!box){box=document.createElement('div');box.className='futuro-final-image-actions';const input=document.createElement('input');input.type='file';input.accept='image/jpeg,image/png,image/webp,image/gif';input.hidden=true;const b=document.createElement('button');b.type='button';const s=document.createElement('div');s.className='futuro-final-upload-status';b.onclick=()=>{if(!user()){window.openAuth?.('register');return}input.click()};input.onchange=()=>{const f=input.files?.[0];input.value='';sendImage(f,b,s)};box.append(b,input,s);holder.appendChild(box)}
    box.querySelector('button').textContent=hasImage?'Trocar imagem':'Enviar minha imagem';
  }
  async function sendImage(file,button,status){
    if(!file)return;const p=currentProduct(),id=currentDbId(p);if(!id){status.textContent='Esta invenção ainda não foi registrada no servidor.';status.className='futuro-final-upload-status err';return}
    if(!/^image\/(jpeg|png|webp|gif)$/i.test(file.type)){status.textContent='Use JPG, PNG, WebP ou GIF.';status.className='futuro-final-upload-status err';return}
    if(file.size>8*1024*1024){status.textContent='A imagem deve ter no máximo 8 MB.';status.className='futuro-final-upload-status err';return}
    button.disabled=true;status.textContent='ENVIANDO IMAGEM…';status.className='futuro-final-upload-status';
    try{const fd=new FormData();fd.append('image',file,file.name||'invention-image');fd.append('invention_id',String(id));const r=await fetch(API+'/api/invention-image',{method:'POST',headers:{Authorization:'Bearer '+token()},body:fd});const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.error||'Não foi possível enviar a imagem.');if(p){p.image_url=media(d.image_url||API+'/api/invention-image/'+id);p.__dbId=id}window.FUTUROLOGIO_CURRENT_PRODUCT=p;window.FUTUROLOGIO_CURRENT_DB_ID=id;status.textContent='IMAGEM SALVA. +5 XP POR UPLOAD VÁLIDO.';status.className='futuro-final-upload-status ok';render(true)}catch(e){status.textContent=e.message||'Falha no upload.';status.className='futuro-final-upload-status err'}finally{button.disabled=false}
  }

  async function loadImageFor(id){try{const r=await fetch(API+'/api/invention/'+encodeURIComponent(id));if(!r.ok)return '';const d=await r.json();return media(d.image_url)}catch{return ''}}
  let renderKey='';
  async function render(force){
    const card=document.querySelector('.game-image-card');if(!card)return;const p=currentProduct();if(!p)return;const id=currentDbId(p),key=String(p.id)+'|'+String(id)+'|'+name();if(!force&&key===renderKey)return;renderKey=key;
    card.querySelectorAll(':scope > img,.futuro-final-image-actions').forEach(x=>x.remove());let body=card.querySelector('.game-image-placeholder,.futuro-final-image-missing');if(!body){body=document.createElement('div');card.prepend(body)}body.className='game-image-placeholder';body.innerHTML='<div><strong>VISUALIZAÇÃO DA INVENÇÃO</strong><span>Crie a imagem na IA de sua preferência usando o prompt abaixo e envie o arquivo aqui.<br>O FUTUROLOGIO não gera a imagem automaticamente.</span></div>';card.classList.remove('has-image');
    let src=media(p.image_url||p.imageUrl||p.image);if(!src&&id)src=await loadImageFor(id);if(currentProduct()?.id!==p.id)return;
    if(src){p.image_url=src;const img=document.createElement('img');img.alt=p.name||'Imagem da invenção';img.src=src;img.onclick=()=>fullscreen(img.currentSrc||img.src,img.alt);body.replaceWith(img);card.classList.add('has-image');const meta=card.querySelector('.game-image-meta b');if(meta)meta.textContent='CLIQUE PARA AMPLIAR';uploadControls(card,true,false)}else{body.className='futuro-final-image-missing';body.innerHTML='<div><strong>IMAGEM AINDA NÃO ENVIADA</strong><span>Esta invenção ainda não possui uma foto.</span></div>';uploadControls(card,false,true);const meta=card.querySelector('.game-image-meta b');if(meta)meta.textContent='AGUARDANDO UPLOAD'}
  }

  function socialPanel(){
    const result=document.getElementById('result');if(!result||result.classList.contains('hidden'))return null;let box=result.querySelector('.futuro-final-social');if(box)return box;const stamp=result.querySelector('.stamp');if(!stamp)return null;box=document.createElement('div');box.className='ft-social futuro-final-social';box.innerHTML='<h3>Compartilhar esta invenção</h3><div class="ft-social-row"><button class="ft-btn" data-platform="whatsapp">'+ICONS.whatsapp+'<span>WhatsApp</span></button><button class="ft-btn" data-platform="facebook">'+ICONS.facebook+'<span>Facebook</span></button><button class="ft-btn" data-platform="x">'+ICONS.x+'<span>X</span></button><button class="ft-btn" data-platform="instagram">'+ICONS.instagram+'<span>Instagram</span></button><button class="ft-btn" data-platform="threads">'+ICONS.threads+'<span>Threads</span></button><button class="ft-btn" data-platform="copy">Copiar link</button><button class="ft-btn" data-platform="native">Compartilhar</button></div><div class="ft-comment-row"><input id="futuroFinalComment" maxlength="500" placeholder="Comente nesta invenção…"><button class="ft-btn" id="futuroFinalCommentBtn">Comentar</button></div><div id="futuroFinalComments"></div>';
    stamp.parentNode.insertBefore(box,stamp);
    box.querySelectorAll('[data-platform]').forEach(b=>b.onclick=()=>share(b.dataset.platform));
    box.querySelector('#futuroFinalCommentBtn').onclick=comment;
    return box;
  }
  async function share(platform){
    if(!user()){window.openAuth?.('register');return}const p=currentProduct(),id=currentDbId(p);if(!id){alert('Esta invenção ainda não foi registrada no servidor.');return}const catalogId=p?.id||'',url=location.origin+location.pathname+'?invention='+encodeURIComponent(catalogId)+'&db_invention='+encodeURIComponent(id),text=(p?.name||'Invenção')+' — uma invenção que não existe. FUTUROLOGIO™';let target='';if(platform==='whatsapp')target='https://wa.me/?text='+encodeURIComponent(text+' '+url);else if(platform==='facebook')target='https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(url);else if(platform==='x')target='https://twitter.com/intent/tweet?text='+encodeURIComponent(text)+'&url='+encodeURIComponent(url);else if(platform==='instagram'){try{await navigator.clipboard.writeText(text+' '+url)}catch{}alert('Texto e link copiados. Cole no Instagram.');target='https://www.instagram.com/'}else if(platform==='threads')target='https://www.threads.net/intent/post?text='+encodeURIComponent(text+' '+url);else if(platform==='copy'){try{await navigator.clipboard.writeText(url);alert('Link copiado.')}catch{prompt('Copie o link:',url)}}else if(platform==='native'&&navigator.share){try{await navigator.share({title:p?.name||'FUTUROLOGIO™',text,url})}catch{return}}else if(platform==='native'){try{await navigator.clipboard.writeText(url);alert('Link copiado.')}catch{prompt('Copie o link:',url)}}if(target)window.open(target,'_blank','noopener,noreferrer');try{await fetch(API+'/api/inventions/'+id+'/share',{method:'POST',headers:{'content-type':'application/json',Authorization:'Bearer '+token()},body:JSON.stringify({platform})})}catch{}}
  async function comment(){if(!user()){window.openAuth?.('register');return}const p=currentProduct(),id=currentDbId(p),input=document.getElementById('futuroFinalComment'),text=input?.value.trim();if(!id||!text)return;try{const r=await fetch(API+'/api/inventions/'+id+'/comment',{method:'POST',headers:{'content-type':'application/json',Authorization:'Bearer '+token()},body:JSON.stringify({text})}),d=await r.json();if(!r.ok)throw new Error(d.error||'Não foi possível comentar');const c=document.createElement('div');c.className='ft-comment';c.textContent=(user()?.username||'Você')+': '+(d.comment?.text||text);document.getElementById('futuroFinalComments')?.prepend(c);input.value=''}catch(e){alert(e.message)}}

  function bindShare(){const b=document.getElementById('shareBtn');if(!b||b.dataset.finalSocial)return;b.dataset.finalSocial='1';b.onclick=e=>{e.preventDefault();e.stopImmediatePropagation();const box=socialPanel();if(box){box.classList.add('ft-share-open');box.scrollIntoView({behavior:'smooth',block:'center')}}}}

  function wrapShow(){
    if(window.__FUTUROLOGIO_FINAL_SHOW_WRAPPED||typeof window.show!=='function')return;
    const original=window.show;window.show=function(p){
      const oldName=name();if(!p?.__dbId)clearDirectQuery();
      window.FUTUROLOGIO_CURRENT_PRODUCT=p||null;window.FUTUROLOGIO_CURRENT_DB_ID=Number(p?.__dbId||0);renderKey='';
      const card=document.querySelector('.game-image-card');if(card){card.querySelectorAll(':scope > img,.futuro-final-image-actions').forEach(x=>x.remove());const body=card.querySelector('.futuro-image-placeholder,.game-image-placeholder,.futuro-final-image-missing');if(body){body.className='game-image-placeholder';body.innerHTML='<div><strong>VISUALIZAÇÃO DA INVENÇÃO</strong><span>Crie a imagem na IA de sua preferência usando o prompt abaixo e envie o arquivo aqui.<br>O FUTUROLOGIO não gera a imagem automaticamente.</span></div>'}};
      const oldSocial=document.querySelector('#result .futuro-final-social');oldSocial?.remove();original(p);setTimeout(()=>{render(true);bindShare();socialPanel()},30);setTimeout(()=>render(true),350);
    };window.__FUTUROLOGIO_FINAL_SHOW_WRAPPED=true;
  }

  const nameNode=document.getElementById('name');if(nameNode)new MutationObserver(()=>{renderKey='';document.querySelector('#result .futuro-final-social')?.remove();setTimeout(()=>{wrapShow();render(true);bindShare()},30)}).observe(nameNode,{childList:true,characterData:true,subtree:true});
  const cardObs=new MutationObserver(()=>{const p=currentProduct();if(p&&document.querySelector('.game-image-card'))setTimeout(()=>render(false),20)});cardObs.observe(document.body,{childList:true,subtree:true});
  const timer=setInterval(()=>{wrapShow();bindShare();const p=currentProduct();if(p&&document.querySelector('.game-image-card'))render(false)},80);setTimeout(()=>{clearInterval(timer);wrapShow();bindShare();socialPanel();render(true)},1500);
})();
