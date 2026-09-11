(()=>{
'use strict';
if(window.__FUTUROLOGIO_ACTIONS_V4)return;
window.__FUTUROLOGIO_ACTIONS_V4=true;
const API='https://motor-invencoes.edsonfernandesvet.workers.dev';
const TK='futuro_auth_token',MK='futuro_db_invention_ids';
const token=()=>localStorage.getItem(TK)||'';
const map=()=>{try{return JSON.parse(localStorage.getItem(MK)||'{}')}catch{return {}}};
const current=()=>window.FUTUROLOGIO_CURRENT_PRODUCT||null;
function dbId(){
 const q=new URLSearchParams(location.search).get('db_invention');
 if(q&&/^\d+$/.test(q))return Number(q);
 const p=current();
 return Number(p?.__dbId||window.FUTUROLOGIO_CURRENT_DB_ID||window.FUTUROLOGIO_DB_ID_FOR?.(p?.id)||map()[p?.id]||0);
}
const media=v=>{v=String(v||'').trim();return v?(v.startsWith('http')?v:API+(v.startsWith('/')?v:'/'+v)):''};
function css(){if(document.getElementById('v4css'))return;const s=document.createElement('style');s.id='v4css';s.textContent=`#v4Photo{margin:12px 0 18px;padding:14px;background:#0b1120;border:1px solid #30415f;border-radius:12px;color:#fff;text-align:center}#v4Photo .v4row{display:flex;gap:9px;justify-content:center;flex-wrap:wrap}#v4Photo button{border:1.5px solid #171717;border-radius:10px;padding:11px 15px;font-weight:950;cursor:pointer;background:#d8ff55;color:#091007}#v4Photo .danger{background:#ff5b55;color:#fff;border-color:#fff}.v4status{margin-top:9px;font-size:11px;color:#9eb1d0}.v4status.ok{color:#d8ff55}.v4status.err{color:#ff8da7}.v4full{position:fixed!important;inset:0!important;width:100vw!important;height:100vh!important;z-index:2147483647!important;background:rgba(0,0,0,.97);display:none;align-items:center;justify-content:center;padding:18px;overflow:hidden;overscroll-behavior:contain}.v4full.open{display:flex!important}.v4full img{display:block;max-width:96vw!important;max-height:92vh!important;width:auto!important;height:auto!important;object-fit:contain!important;margin:0!important}.v4full button{position:absolute;right:14px;top:12px;width:44px;height:44px;border-radius:50%;background:#101a2e;color:#fff;border:1px solid #7182a0;font-size:28px}.v4share{margin-top:14px}.v4share summary{display:inline-block;cursor:pointer;background:#d8ff55;color:#091007;border:1.5px solid #171717;border-radius:12px;padding:12px 15px;font-weight:950}.v4share .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:10px}.v4share a,.v4share button{display:flex;align-items:center;justify-content:center;min-height:42px;border:0;border-radius:10px;color:#fff;text-decoration:none;font-weight:900;cursor:pointer}.v4share .wa{background:#25d366}.v4share .fb{background:#1877f2}.v4share .x{background:#000}.v4share .th{background:#111}.v4share .ig{background:#d13b73}.v4share .copy{background:#405476}@media(max-width:650px){.v4share .grid{grid-template-columns:repeat(2,1fr)}}`;document.head.appendChild(s)}
function cleanOld(){['futuroUploadArea','futuroPhotoControls','photoActions','shareNative'].forEach(id=>document.getElementById(id)?.remove());document.querySelectorAll('.futuro-fix-upload,.futuro-final-image-actions').forEach(x=>x.remove());}
function full(src,alt){let o=document.getElementById('v4full');if(!o){o=document.createElement('div');o.id='v4full';o.className='v4full';o.innerHTML='<button type="button">×</button><img alt="">';document.body.appendChild(o);o.onclick=e=>{if(e.target===o||e.target.tagName==='BUTTON'){o.classList.remove('open');document.documentElement.style.overflow='';document.body.style.overflow=''}}}o.querySelector('img').src=src;o.querySelector('img').alt=alt||'';o.classList.add('open');document.documentElement.style.overflow='hidden';document.body.style.overflow='hidden'}
async function getImage(){const p=current(),n=dbId();if(p?.image_url)return media(p.image_url);if(!n)return '';try{const r=await fetch(API+'/api/invention/'+n,{cache:'no-store'});if(!r.ok)return '';return media((await r.json()).image_url)}catch{return ''}}
function controls(has){let box=document.getElementById('v4Photo');if(!box){const card=document.querySelector('.game-image-card');if(!card)return;box=document.createElement('div');box.id='v4Photo';card.insertAdjacentElement('afterend',box)}box.innerHTML='<div class="v4row"><button type="button" class="send">ENVIAR NOVA FOTO</button>'+(has?'<button type="button" class="danger del">APAGAR FOTO</button>':'')+'</div><input type="file" hidden accept="image/jpeg,image/png,image/webp,image/gif"><div class="v4status">'+(has?'Para substituir: apague a foto atual e depois envie outra.':'JPG, PNG, WebP ou GIF — máximo de 8 MB.')+'</div>';const input=box.querySelector('input'),st=box.querySelector('.v4status');box.querySelector('.send').onclick=()=>{if(!token()){window.openAuth?.('login');return}if(!dbId()){st.textContent='A invenção ainda não foi registrada. Aguarde e tente novamente.';st.className='v4status err';return}input.click()};input.onchange=()=>{const f=input.files?.[0];input.value='';if(f)upload(f,st)};box.querySelector('.del')?.addEventListener('click',()=>remove(st))}
async function upload(file,st){const n=dbId();if(!n||!token())return;if(!/^image\/(jpeg|png|webp|gif)$/i.test(file.type)){st.textContent='Formato inválido. Use JPG, PNG, WebP ou GIF.';st.className='v4status err';return}if(file.size>8*1024*1024){st.textContent='A imagem deve ter no máximo 8 MB.';st.className='v4status err';return}st.textContent='ENVIANDO…';st.className='v4status';try{const fd=new FormData();fd.append('image',file,file.name||'imagem');fd.append('invention_id',String(n));const r=await fetch(API+'/api/invention-image',{method:'POST',headers:{Authorization:'Bearer '+token()},body:fd});const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.error||('Falha no upload ('+r.status+').'));const p=current();if(p)p.image_url=media(d.image_url||('/api/invention-image/'+n));st.textContent='FOTO ENVIADA COM SUCESSO.';st.className='v4status ok';await render(true)}catch(e){st.textContent=e.message||'Falha no upload.';st.className='v4status err'}}
async function remove(st){const n=dbId();if(!n||!token())return;if(!confirm('Apagar a foto desta invenção?'))return;st.textContent='APAGANDO…';st.className='v4status';try{const r=await fetch(API+'/api/invention-image/'+n,{method:'DELETE',headers:{Authorization:'Bearer '+token()}});const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.error||('Falha ao apagar ('+r.status+').'));const p=current();if(p)delete p.image_url;st.textContent='FOTO APAGADA. Agora envie outra.';st.className='v4status ok';await render(true)}catch(e){st.textContent=e.message||'Falha ao apagar a foto.';st.className='v4status err'}}
function share(){const old=document.getElementById('shareBtn');if(!old)return;let box=document.getElementById('v4share');if(!box){box=document.createElement('details');box.id='v4share';box.className='v4share';old.replaceWith(box);box.innerHTML='<summary>↗ Compartilhar invenção</summary><div class="grid"><a class="wa" target="_blank" rel="noopener">WhatsApp</a><a class="fb" target="_blank" rel="noopener">Facebook</a><a class="x" target="_blank" rel="noopener">X</a><a class="th" target="_blank" rel="noopener">Threads</a><a class="ig" target="_blank" rel="noopener">Instagram</a><button class="copy" type="button">Copiar link</button></div>';box.querySelector('.copy').onclick=async()=>{const u=shareUrl();try{await navigator.clipboard.writeText(u);alert('Link copiado.')}catch{prompt('Copie o link:',u)}}}const u=shareUrl(),t=encodeURIComponent((current()?.name||'Invenção FUTUROLOGIO™')+' — uma invenção que não existe. FUTUROLOGIO™');box.querySelector('.wa').href='https://wa.me/?text='+t+'%20'+encodeURIComponent(u);box.querySelector('.fb').href='https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(u);box.querySelector('.x').href='https://twitter.com/intent/tweet?text='+t+'&url='+encodeURIComponent(u);box.querySelector('.th').href='https://www.threads.net/intent/post?text='+encodeURIComponent(t+' '+u);box.querySelector('.ig').href='https://www.instagram.com/'}
function shareUrl(){const n=dbId(),p=current();if(n){const u=new URL(location.href);u.searchParams.set('db_invention',String(n));if(p?.id)u.searchParams.set('invention',String(p.id));return u.toString()}return location.href}
function imagePrompt(){
 const p=current()||{};
 const name=String(p.name||document.getElementById('name')?.textContent||'NOME DO PRODUTO').trim();
 const desc=String(p.description||p.what||p.funcao||p.function||p.how_it_works||'').trim();
 return `Create a single horizontal 16:9 promotional illustration for the fictional futuristic product "${name}" from FUTUROLOGIO™.

Show the product clearly working in a chaotic, extremely funny and absurd situation. The product must be the absolute visual focus, fully visible, large, detailed, and immediately understandable. Show a main character actively using the product in an exaggerated ridiculous situation${desc?`, based on this product concept: ${desc}`:''}, surrounded by secondary characters reacting with shock, fear, disgust, confusion or exaggerated laughter.

VISUAL STYLE:
Satirical futuristic magazine advertisement mixed with gritty cyberpunk comic-book illustration and graphic-novel aesthetics. Grotesque extreme caricature, hyper-detailed cartoon rendering, exaggerated anatomy and facial expressions, unsettling but humorous details, dirty urban-futuristic atmosphere, dramatic perspective, dense composition and visual storytelling.

CHARACTERS:
The main character should have an extremely exaggerated manic expression: huge bloodshot eyes, dilated pupils, crooked teeth, enormous disturbing grin, sweaty greasy skin, visible pores, wrinkles, facial tension and dripping sweat. Secondary characters should have equally exaggerated reactions, with distorted faces, bulging eyes, open mouths, panic and disbelief.

PRODUCT DESIGN:
The fictional product must look like an absurd but believable piece of futuristic technology. Sleek polished materials, metallic surfaces, transparent components, glowing neon LEDs, holographic interfaces, fiber-optic cables, illuminated buttons, futuristic displays and intricate mechanical details. Make the product visually impressive and unmistakably functional.

ADVERTISING COMPOSITION:
Design the scene like an overloaded satirical magazine advertisement. Include the exact product name "${name}" prominently and clearly, plus the exact brand name "FUTUROLOGIO™". Add humorous Portuguese advertising slogans, warning signs, technical diagrams, holographic statistics, product feature panels, exaggerated labels, comic sound effects and small visual jokes integrated naturally into the environment.

COLOR AND LIGHTING:
Strong neon cyan, electric blue, magenta, hot pink and purple accents against dark industrial surroundings. Cinematic lighting, glowing neon reflections, deep shadows, dramatic rim lighting, volumetric light, atmospheric haze and strong contrast.

COMPOSITION:
Extremely detailed, visually chaotic but carefully organized. The main product occupies a prominent central or foreground position. The main character interacts directly with it. Secondary characters and environmental jokes fill the background without competing with the product. Keep the product, product name, FUTUROLOGIO™ logo and all important text safely inside the margins.

MOOD:
Absurd, grotesque, disturbing, ridiculous, satirical and extremely funny, as if a dystopian technology company created the world's most unnecessary invention.

IMPORTANT:
No photorealistic human photography.
No anime.
No minimalist design.
No generic stock-photo aesthetic.
No clean corporate advertising.
No realistic conventional product photography.
Use illustrated comic-book rendering throughout.
16:9 horizontal composition.`;
}
function sanitize(){const x=document.getElementById('futuroPromptText');if(!x)return;const prompt=imagePrompt();if(x.value!==prompt)x.value=prompt;x.textContent=prompt}
async function render(){const card=document.querySelector('.game-image-card'),p=current();if(!card||!p)return;cleanOld();const src=await getImage();if(current()!==p)return;card.querySelectorAll(':scope > img').forEach(x=>x.remove());let ph=card.querySelector('.game-image-placeholder');if(src){ph?.remove();const img=document.createElement('img');img.src=src+'?v='+Date.now();img.alt=p.name||'Imagem da invenção';img.style.cssText='width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:10px;cursor:zoom-in';img.onclick=()=>full(img.currentSrc||img.src,img.alt);card.prepend(img);card.querySelector('.game-image-meta b')?.replaceChildren(document.createTextNode('CLIQUE PARA AMPLIAR'));controls(true)}else{if(!ph){ph=document.createElement('div');card.prepend(ph)}ph.className='game-image-placeholder';ph.innerHTML='<div><strong>VISUALIZAÇÃO DA INVENÇÃO</strong><span>Crie a imagem na IA de sua preferência usando o prompt abaixo e envie o arquivo aqui.</span></div>';card.querySelector('.game-image-meta b')?.replaceChildren(document.createTextNode('AGUARDANDO IMAGEM'));controls(false)}sanitize();share()}
let last='';function tick(){const r=document.getElementById('result');if(!r||r.classList.contains('hidden'))return;const key=(document.getElementById('name')?.textContent||'')+'|'+dbId();if(key!==last){last=key;render()}else{sanitize();share()}}setTimeout(tick,700);setTimeout(tick,1500);setInterval(tick,1200);
css();
})();
