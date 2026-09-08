(() => {
  'use strict';

  const API='https://motor-invencoes.edsonfernandesvet.workers.dev';
  const TOKEN_KEY='futuro_auth_token';
  const USER_KEY='futuro_social_user';
  const token=()=>localStorage.getItem(TOKEN_KEY)||'';
  const user=()=>{try{return JSON.parse(localStorage.getItem(USER_KEY)||'null')}catch{return null}};

  function visibleName(){return document.getElementById('name')?.textContent?.trim()||''}
  function currentProduct(){
    const name=visibleName();
    const list=window.FUTUROLOGIO_PRODUCTS||[];
    const catalog=name?list.find(p=>String(p.name).trim()===name):null;
    if(catalog)return catalog;
    const current=window.FUTUROLOGIO_CURRENT_PRODUCT;
    return current&&(!name||String(current.name).trim()===name)?current:null;
  }
  function currentDbId(){
    const p=currentProduct();
    const current=window.FUTUROLOGIO_CURRENT_PRODUCT;
    const same=current&&(!visibleName()||String(current.name).trim()===visibleName());
    if(same&&Number(window.FUTUROLOGIO_CURRENT_DB_ID))return Number(window.FUTUROLOGIO_CURRENT_DB_ID);
    if(same&&p?.__dbId)return Number(p.__dbId);
    try{const id=p&&window.FUTUROLOGIO_DB_ID_FOR?.(p.id);if(id)return Number(id)}catch{}
    if(same){try{const q=new URLSearchParams(location.search).get('db_invention');if(q)return Number(q)}catch{}}
    return 0;
  }
  function hasKnownMissing(card,id){return String(card?.dataset.imageMissingId||'')===String(id||'')}
  function imageUrl(p,card){
    const raw=p?.image_url||p?.imageUrl||p?.image||'';
    if(raw&&/^https?:\/\//i.test(raw))return raw;
    const id=currentDbId();
    if(id&&!hasKnownMissing(card,id))return `${API}/api/invention-image/${id}`;
    return '';
  }

  const icons={
    whatsapp:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8.3 7.8c.3-.4.8-.5 1.2-.2l1.2 1c.3.2.4.7.2 1l-.5.8c.7 1.2 1.7 2.2 3 2.8l.8-.5c.4-.2.8-.1 1 .2l1 1.1c.3.4.2.9-.2 1.2-.6.5-1.4.8-2.1.7-3.4-.5-6.2-2.8-7.3-6-.3-.8-.1-1.5.7-2.1Z" fill="currentColor"/></svg>',
    facebook:'<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M13.7 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5h1.7V4a21 21 0 0 0-2.5-.1c-2.5 0-4.2 1.5-4.2 4.2V10H8v3h2.3v8h3.4Z"/></svg>',
    x:'<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5 4h3.5l4 5.4L17 4h2l-5.6 6.5L19.5 20H16l-4.2-5.7L7 20H5l5.8-6.8L5 4Zm3.3 1.7H7.1l9.5 12.6h1.2L8.3 5.7Z"/></svg>',
    instagram:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4.1" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.6" cy="6.6" r="1.2" fill="currentColor"/></svg>',
    threads:'<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M17.8 9.3c-.6-3.2-2.6-4.9-5.9-4.9-3.8 0-6.2 2.4-6.2 6.6 0 5.2 2.8 7.7 6.8 7.7 3.2 0 5.2-1.7 5.2-4.4 0-2.5-1.8-4.1-4.5-4.1-2.1 0-3.4 1-3.4 2.6 0 1.2 1 2 2.4 2 2.5 0 4-1.9 4-4.6 0-4.1-2.5-6.5-6.3-6.5"/></svg>'
  };

  const style=document.createElement('style');style.id='futuro-product-visual-social';style.textContent=`
    .futuro-image-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:9px}.futuro-image-action{border:1.5px solid #405476;border-radius:10px;background:#0b1427;color:#dce6ff;padding:9px 12px;font-size:10px;font-weight:1000;cursor:pointer;text-transform:uppercase;letter-spacing:.04em}.futuro-image-action.primary{background:#d8ff55;color:#091007;border-color:#fff}.futuro-image-action:hover{border-color:#62e6ff;transform:translateY(-1px)}
    .game-image-card.has-image img{cursor:zoom-in}.futuro-image-error{display:grid;place-items:center;min-height:180px;border:1px dashed #6b4560;border-radius:10px;background:radial-gradient(circle at 50% 40%,#2a1831,#0b1120 68%);color:#aebbd2;text-align:center;padding:24px}.futuro-image-error strong{display:block;color:#d8ff55;margin-bottom:6px;font-size:15px}.futuro-image-error span{font-size:11px;line-height:1.5}
    .futuro-fullscreen{position:fixed;inset:0;background:rgba(2,5,12,.96);z-index:99999;display:none;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(8px)}.futuro-fullscreen.open{display:flex}.futuro-fullscreen img{max-width:96vw;max-height:90vh;width:auto;height:auto;object-fit:contain;border-radius:10px;box-shadow:0 0 0 2px #30415f,0 20px 70px rgba(0,0,0,.65)}.futuro-fullscreen-close{position:absolute;right:18px;top:16px;width:44px;height:44px;border:1px solid #58709b;border-radius:50%;background:#101a2e;color:#fff;font-size:25px;cursor:pointer}
    .ft-social{display:none!important}.ft-social.ft-share-open{display:block!important}.ft-social .ft-social-row{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px}.ft-social .ft-social-row .ft-btn[data-platform]{display:flex;align-items:center;justify-content:center;gap:7px;min-height:42px;color:#fff;border-color:transparent;font-weight:1000}.ft-social .ft-social-row .ft-btn[data-platform] svg{width:19px;height:19px;flex:none}.ft-social .ft-btn[data-platform="whatsapp"]{background:#25D366!important}.ft-social .ft-btn[data-platform="facebook"]{background:#1877F2!important}.ft-social .ft-btn[data-platform="x"]{background:#000!important}.ft-social .ft-btn[data-platform="instagram"]{background:linear-gradient(135deg,#833AB4,#E1306C,#FCAF45)!important}.ft-social .ft-btn[data-platform="threads"]{background:#111!important}.ft-social .ft-btn[data-platform="copy"]{background:#405476!important}.ft-social .ft-btn[data-platform="native"]{background:#d8ff55!important;color:#091007!important}@media(max-width:700px){.ft-social .ft-social-row{grid-template-columns:repeat(2,minmax(0,1fr))}.ft-social .ft-social-row .ft-btn[data-platform="native"]{grid-column:1/-1}}
  `;document.head.appendChild(style);

  function fullscreen(src,alt){let o=document.getElementById('futuroImageFullscreen');if(!o){o=document.createElement('div');o.id='futuroImageFullscreen';o.className='futuro-fullscreen';o.innerHTML='<button class="futuro-fullscreen-close" aria-label="Fechar imagem">×</button><img alt="">';document.body.appendChild(o);o.addEventListener('click',e=>{if(e.target===o||e.target.classList.contains('futuro-fullscreen-close'))o.classList.remove('open')});document.addEventListener('keydown',e=>{if(e.key==='Escape')o.classList.remove('open')})}const img=o.querySelector('img');img.src=src;img.alt=alt||'Imagem da invenção';o.classList.add('open')}

  async function upload(file,button,status){
    if(!file)return;const id=currentDbId();
    if(!id){status.textContent='Esta invenção ainda não foi registrada no servidor.';status.className='game-upload-status err';return}
    if(!user()){if(window.openAuth)window.openAuth('register');else alert('Entre ou cadastre-se para enviar uma imagem.');return}
    if(!/^image\/(jpeg|png|webp|gif)$/i.test(file.type)){status.textContent='Use JPG, PNG, WebP ou GIF.';status.className='game-upload-status err';return}
    if(file.size>8*1024*1024){status.textContent='A imagem deve ter no máximo 8 MB.';status.className='game-upload-status err';return}
    button.disabled=true;status.textContent='ENVIANDO IMAGEM…';status.className='game-upload-status';
    try{const fd=new FormData();fd.append('image',file,file.name);fd.append('invention_id',String(id));const r=await fetch(`${API}/api/invention-image`,{method:'POST',headers:{Authorization:'Bearer '+token()},body:fd});const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.error||'Não foi possível enviar a imagem.');const p=currentProduct();if(p){p.image_url=d.image_url||`${API}/api/invention-image/${id}`;p.imageUrl=p.image_url}const card=document.querySelector('.game-image-card');if(card)delete card.dataset.imageMissingId;status.textContent='IMAGEM SALVA. +5 XP POR UPLOAD VÁLIDO.';status.className='game-upload-status ok';renderImageCard(true)}catch(e){status.textContent=e.message||'Falha no upload.';status.className='game-upload-status err'}finally{button.disabled=false}
  }

  function addUploadControls(card,hasImage){
    let actions=card.querySelector('.futuro-image-actions');
    if(!actions){actions=document.createElement('div');actions.className='futuro-image-actions';const input=document.createElement('input');input.type='file';input.accept='image/jpeg,image/png,image/webp,image/gif';input.hidden=true;const button=document.createElement('button');button.type='button';button.className='futuro-image-action primary';const status=document.createElement('div');status.className='game-upload-status';button.onclick=()=>input.click();input.onchange=()=>{const f=input.files?.[0];input.value='';upload(f,button,status)};actions.append(button,input,status);card.appendChild(actions)}
    actions.querySelector('button').textContent=hasImage?'Trocar imagem':'Enviar minha imagem';
  }

  function showMissing(card,p){
    card.classList.remove('has-image');let img=card.querySelector('img');if(img)img.remove();let err=card.querySelector('.futuro-image-error');if(!err){err=document.createElement('div');err.className='futuro-image-error';err.innerHTML='<div><strong>IMAGEM AINDA NÃO DISPONÍVEL</strong><span>Envie uma imagem para esta invenção ou troque a imagem salva.</span></div>';const ph=card.querySelector('.game-image-placeholder');if(ph)ph.replaceWith(err);else card.insertBefore(err,card.firstChild)}addUploadControls(card,false)
  }

  function renderImageCard(force){
    const card=document.querySelector('.game-image-card');if(!card)return;const p=currentProduct();if(!p)return;const id=currentDbId();const src=imageUrl(p,card);const existing=card.querySelector('img');
    if(src&&(!existing||force||existing.dataset.src!==src)){
      const img=existing||document.createElement('img');img.alt=p.name||'Imagem da invenção';img.dataset.src=src;img.onload=()=>{card.dataset.imageMissingId='';card.classList.add('has-image');addUploadControls(card,true)};img.onerror=()=>{if(id)card.dataset.imageMissingId=String(id);showMissing(card,p)};img.src=src;
      if(!existing){const ph=card.querySelector('.game-image-placeholder,.futuro-image-error');if(ph)ph.replaceWith(img)}card.classList.add('has-image');img.onclick=()=>fullscreen(img.currentSrc||img.src,img.alt);const meta=card.querySelector('.game-image-meta b');if(meta)meta.textContent='CLIQUE PARA AMPLIAR';addUploadControls(card,true)
    }else if(!src){showMissing(card,p)}else if(existing){existing.onclick=()=>fullscreen(existing.currentSrc||existing.src,existing.alt);addUploadControls(card,true)}
  }

  function enhanceShare(){const btn=document.getElementById('shareBtn');if(!btn||btn.dataset.visualSocial)return;btn.dataset.visualSocial='1';btn.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();const social=document.querySelector('#result .ft-social');if(!social)return;social.classList.add('ft-share-open');social.scrollIntoView({behavior:'smooth',block:'center'})},true)}
  function decorateSocial(){const social=document.querySelector('#result .ft-social');if(!social)return;const labels={whatsapp:'WhatsApp',facebook:'Facebook',x:'X',instagram:'Instagram',threads:'Threads'};Object.entries(labels).forEach(([platform,label])=>{const b=social.querySelector(`[data-platform="${platform}"]`);if(b&&!b.querySelector('svg'))b.innerHTML=icons[platform]+'<span>'+label+'</span>')})}
  function scan(){renderImageCard(false);enhanceShare();decorateSocial()}
  const obs=new MutationObserver(()=>setTimeout(scan,40));obs.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});scan();
})();
