(() => {
  'use strict';
  const API='https://motor-invencoes.edsonfernandesvet.workers.dev';
  const esc=s=>String(s??'').replace(/[&<>\"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[m]));
  const mediaUrl=v=>{const s=String(v||'').trim();return s?(s.startsWith('http://')||s.startsWith('https://')?s:API+(s.startsWith('/')?s:'/'+s)):''};
  async function openCreator(card){const r=await fetch(API+'/api/invention/'+encodeURIComponent(card.dataset.dbId));if(!r.ok)return;const d=await r.json();if(d.user?.id)location.href='?profile='+encodeURIComponent(d.user.id)}
  async function load(){
    const id=new URLSearchParams(location.search).get('profile');if(!id)return;
    try{
      const r=await fetch(API+'/api/explore?mode=recent&limit=24');if(!r.ok)return;
      const d=await r.json();
      const items=(d.items||[]).filter(x=>String(x.user_id)===String(id));
      const name=items[0]?.username||'Criador FUTUROLOGIO';
      const likes=items.reduce((a,x)=>a+Number(x.likes||0),0);
      const box=document.createElement('section');box.className='ft-public-profile';
      box.innerHTML=`<div class="ft-public-head"><div><div class="ft-explore-kicker">PERFIL DO CRIADOR</div><h2>@${esc(name)}</h2><p>${items.length} invenções públicas encontradas · ${likes} curtidas acumuladas</p></div><button class="ft-explore-tab" onclick="history.back()">← Voltar</button></div><div class="ft-explore-grid">${items.length?items.map(x=>{const src=mediaUrl(x.image_url);return `<article class="ft-explore-card" data-db-id="${x.id}"><div class="ft-explore-img">${src?`<img src="${esc(src)}" alt="${esc(x.name)}">`:'IMAGEM AINDA NÃO ENVIADA'}</div><div class="ft-explore-body"><span class="ft-explore-cat">${esc(x.category)}</span><div class="ft-explore-name">${esc(x.name)}</div><div class="ft-explore-meta"><span>♥ <b>${x.likes||0}</b></span><span>✎ <b>${x.comments||0}</b></span></div></div></article>`}).join(''):'<div class="ft-explore-empty">Este criador ainda não possui invenções entre as 24 mais recentes. As criações continuam acessíveis pela galeria.</div>'}</div>`;
      document.querySelector('main')?.prepend(box);
      box.querySelectorAll('.ft-explore-card').forEach(c=>c.onclick=()=>location.href='?db_invention='+encodeURIComponent(c.dataset.dbId));
      document.getElementById('ftExplore')?.remove();
      document.querySelector('.result')?.classList.add('hidden');
      document.querySelector('.panel:not(.profile)')?.classList.add('hidden');
    }catch{}
  }
  const css=document.createElement('style');css.textContent='.ft-public-profile{max-width:1120px;margin:26px auto;padding:0 20px}.ft-public-head{display:flex;justify-content:space-between;align-items:end;gap:12px;margin-bottom:16px}.ft-public-head h2{margin:4px 0;color:#fff;font-size:30px}.ft-public-head p{margin:0;color:#9aa7c2;font-size:11px}';document.head.appendChild(css);
  const t=setInterval(()=>{if(document.querySelector('main')){clearInterval(t);load()}},100);
})();
