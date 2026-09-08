(() => {
  'use strict';
  const css = `
  :root{--game-bg:#080b16;--game-panel:#10172a;--game-panel-2:#151e35;--game-ink:#f7f8ff;--game-muted:#9aa7c2;--game-lime:#d8ff55;--game-cyan:#62e6ff;--game-pink:#ff62c6;--game-gold:#ffd34e;--game-line:#2a3858;--game-shadow:0 14px 0 #050710,0 18px 35px rgba(0,0,0,.28)}
  body.game-mode{background:radial-gradient(circle at 50% -10%,#26375d 0,#10172a 30%,#080b16 72%);color:var(--game-ink);min-height:100vh;background-attachment:fixed}
  body.game-mode:before{content:"";position:fixed;inset:0;pointer-events:none;opacity:.18;background-image:linear-gradient(rgba(98,230,255,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(98,230,255,.08) 1px,transparent 1px);background-size:34px 34px;mask-image:linear-gradient(to bottom,#000,transparent 85%);z-index:-1}
  .game-mode header{background:rgba(8,11,22,.88);border-bottom:2px solid var(--game-cyan);box-shadow:0 4px 22px rgba(98,230,255,.12);backdrop-filter:blur(12px)}
  .game-mode .logo{color:white;text-shadow:0 0 18px rgba(98,230,255,.45);letter-spacing:.02em}.game-mode .logo span{background:var(--game-pink);color:#160b19;border-color:#fff;box-shadow:3px 3px 0 #fff}
  .game-mode main{max-width:1120px}.game-mode .hero{padding:48px 0 34px}.game-mode .kicker{color:var(--game-cyan);letter-spacing:.2em}.game-mode .hero h1{color:white;text-shadow:0 5px 0 #29365b,0 0 28px rgba(98,230,255,.18)}.game-mode .hero p{color:var(--game-muted)}
  .game-mode .panel{background:linear-gradient(145deg,var(--game-panel),var(--game-panel-2));border:2px solid var(--game-line);border-radius:18px;box-shadow:var(--game-shadow);color:var(--game-ink);position:relative;overflow:hidden}.game-mode .panel:before{content:"";position:absolute;left:0;top:0;width:100%;height:3px;background:linear-gradient(90deg,var(--game-cyan),var(--game-pink),var(--game-lime))}.game-mode .panel h2{color:white}.game-mode .panel>p{color:var(--game-muted)}
  .game-mode .cat{background:#0c1324;color:#dce5ff;border-color:var(--game-line);box-shadow:0 4px 0 #070b15;transition:transform .15s,box-shadow .15s,border-color .15s,background .15s}.game-mode .cat:hover{background:#17243e;border-color:var(--game-cyan);transform:translateY(-2px);box-shadow:0 6px 0 #070b15}.game-mode .cat.selected{background:linear-gradient(135deg,var(--game-lime),#a7db39);color:#081006;border-color:white;box-shadow:0 5px 0 #6d8e25}
  .game-mode .selected-label{color:var(--game-muted)}.game-mode .selected-label strong{color:var(--game-cyan)}
  .game-mode .create{background:linear-gradient(90deg,var(--game-pink),#ff8bdf 48%,var(--game-cyan));color:#090b15;border-color:white;box-shadow:0 7px 0 #080b16,0 0 28px rgba(255,98,198,.18);text-transform:uppercase;letter-spacing:.06em;transition:transform .12s,box-shadow .12s}.game-mode .create:hover{transform:translateY(-2px);box-shadow:0 9px 0 #080b16,0 0 34px rgba(98,230,255,.22)}.game-mode .create:active{transform:translateY(3px);box-shadow:0 3px 0 #080b16}
  .game-mode .result .panel{border-color:#3a4d79}.game-mode .tag{background:var(--game-pink);border-color:white;color:#170914;box-shadow:3px 3px 0 #050710}.game-mode .result h2{color:white;text-shadow:0 4px 0 #263456}.game-mode .sub{color:var(--game-cyan)}.game-mode .intro{color:#e8ecf8}.game-mode .fact,.game-mode .card{background:#0b1222;border-color:var(--game-line);color:#edf2ff}.game-mode .fact small{color:var(--game-muted)}.game-mode .fact b{color:white}.game-mode .science{background:linear-gradient(145deg,#0c2030,#0b1222)}.game-mode .spec{background:linear-gradient(145deg,#1d1530,#0b1222)}.game-mode .impossible{background:linear-gradient(145deg,#2b1427,#0b1222)}.game-mode .techItem{background:#111b30;border-color:#2a3858}.game-mode .techItem p{color:#aebbd2}.game-mode .science .techLabel{background:#163c4b;color:var(--game-cyan);border-color:#2b7185}.game-mode .spec .techLabel{background:#34204c;color:#e1a8ff;border-color:#714f8e}
  .game-mode .meter{background:#070b15;border-color:#415173}.game-mode .share{position:sticky;bottom:12px;padding:10px;background:rgba(8,11,22,.82);border:1px solid var(--game-line);border-radius:14px;backdrop-filter:blur(10px);z-index:5}.game-mode .primary{background:var(--game-lime);color:#091007;border-color:white;box-shadow:0 4px 0 #617d20}.game-mode .secondary{background:#101a2e;color:white;border-color:#4b5f86}.game-mode .stamp{border-color:#4b5f86;background:#0b1222;color:#c8d3e9}.game-mode .stamp b{color:var(--game-gold);text-shadow:0 0 12px rgba(255,211,78,.2)}.game-mode .history span{background:#101a2e;color:#dce5ff;border-color:#30415f}.game-mode footer{color:#6f7e9d}
  .game-image-card{margin:0 0 18px;border:2px solid #30415f;border-radius:16px;background:linear-gradient(145deg,#080e1d,#141e35);padding:10px;position:relative;overflow:hidden}.game-image-card:after{content:"VISUAL // PROTÓTIPO";position:absolute;right:12px;top:12px;font-size:9px;font-weight:1000;letter-spacing:.12em;color:#62e6ff;background:#07101e;border:1px solid #34506e;border-radius:99px;padding:5px 8px}.game-image-card img{display:block;width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:10px;background:radial-gradient(circle,#24395c,#0b1120 70%)}.game-image-placeholder{aspect-ratio:16/9;border-radius:10px;display:grid;place-items:center;text-align:center;padding:24px;background:radial-gradient(circle at 50% 40%,#24395c,#0b1120 68%);color:#9eb1d0;border:1px dashed #3b537a}.game-image-placeholder strong{display:block;color:#d8ff55;font-size:15px;margin-bottom:6px}.game-image-placeholder span{font-size:12px;line-height:1.5}.game-image-meta{display:flex;justify-content:space-between;gap:10px;margin:9px 2px 0;color:#7f91af;font-size:10px;text-transform:uppercase;letter-spacing:.08em;font-weight:900}.game-image-meta b{color:#62e6ff}
  @media(max-width:760px){.game-mode .panel{box-shadow:0 9px 0 #050710,0 14px 28px rgba(0,0,0,.24)}.game-mode .hero{padding-top:34px}.game-mode .hero h1{font-size:clamp(48px,15vw,72px)}}`;
  const style=document.createElement('style');style.id='futuro-game-ui';style.textContent=css;document.head.appendChild(style);document.body.classList.add('game-mode');

  function currentProduct(){
    const name=document.getElementById('name')?.textContent?.trim();
    if(!name||!Array.isArray(window.FUTUROLOGIO_PRODUCTS))return null;
    return window.FUTUROLOGIO_PRODUCTS.find(p=>p.name===name)||null;
  }
  function ensureImageCard(){
    const result=document.getElementById('result');
    const panel=result?.querySelector('.panel');
    if(!panel||panel.querySelector('.game-image-card'))return;
    const card=document.createElement('div');card.className='game-image-card';
    card.innerHTML='<div class="game-image-placeholder"><div><strong>VISUALIZAÇÃO DA INVENÇÃO</strong><span>A imagem do produto será criada automaticamente por IA.<br>O espaço já está reservado para o render oficial.</span></div></div><div class="game-image-meta"><span>RENDER DO PRODUTO</span><b>IA // EM BREVE</b></div>';
    const tag=panel.querySelector('.tag');tag?.insertAdjacentElement('afterend',card);
  }
  function refreshImageCard(){
    ensureImageCard();
    const card=document.querySelector('.game-image-card');if(!card)return;
    const p=currentProduct();if(!p)return;
    const src=p.image_url||p.imageUrl||p.image;
    const ph=card.querySelector('.game-image-placeholder');
    if(src){ph.innerHTML='<img alt="'+String(p.name).replace(/"/g,'&quot;')+'" src="'+String(src).replace(/"/g,'&quot;')+'">';card.querySelector('.game-image-meta b').textContent='RENDER DISPONÍVEL'}
  }
  const name=document.getElementById('name');
  if(name)new MutationObserver(refreshImageCard).observe(name,{childList:true,characterData:true,subtree:true});
  document.addEventListener('DOMContentLoaded',refreshImageCard);
  setTimeout(refreshImageCard,500);
})();
