(()=>{
 const API='https://motor-invencoes.edsonfernandesvet.workers.dev';
 const token=()=>localStorage.getItem('futuro_auth_token')||'';
 async function load(){
  const el=document.querySelector('.profile'); if(!el||!token())return;
  try{
   const r=await fetch(API+'/api/profile',{headers:{Authorization:'Bearer '+token()}}); if(!r.ok)return;
   const d=await r.json(),p=d.profile;if(!p)return;
   const level=Number(p.level||1), xp=Number(p.xp||0), current=(level-1)*100, next=level*100, pct=Math.max(0,Math.min(100,Math.round((xp-current)/100*100)));
   const medal=p.medal?'<span class="gm-medal">MEDALHA DO NÍVEL '+level+'</span>':'';
   const badges=(p.badges||[]).map(b=>'<span class="gm-badge" title="'+esc(b.description||'')+'">'+esc(b.name)+'</span>').join('')||'<span class="gm-empty">Nenhuma medalha especial ainda.</span>';
   el.innerHTML='<div class="gm-head"><div class="gm-avatar">'+avatar(level)+'</div><div><div class="gm-user">@'+esc(p.username)+'</div><div class="gm-role">'+esc(p.role)+'</div>'+medal+'</div></div><div class="gm-xp"><div><b>Nível '+level+'</b><span>'+xp+' XP</span></div><div class="gm-bar"><i style="width:'+pct+'%"></i></div><small>'+Math.max(0,next-xp)+' XP para o próximo nível</small></div><div class="gm-stats"><div><b>'+p.creations+'</b><small>criações</small></div><div><b>'+p.categories+'</b><small>categorias</small></div><div><b>'+p.likes+'</b><small>curtidas</small></div><div><b>'+p.comments+'</b><small>comentários</small></div><div><b>'+p.shares+'</b><small>compartilhamentos</small></div><div><b>'+p.likesReceived+'</b><small>curtidas recebidas</small></div></div><h3 class="gm-title">Medalhas</h3><div class="gm-badges">'+badges+'</div><div class="gm-plan"><b>'+esc(p.plan||'free').toUpperCase()+'</b> · '+p.allowance.remaining+' criações restantes hoje</div>';
  }catch(e){}
 }
 function avatar(l){if(l>=50)return '◉';if(l>=40)return '♛';if(l>=30)return '★';if(l>=20)return '◆';if(l>=10)return '✦';if(l>=5)return '●';return '○'}
 function esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
 const style=document.createElement('style');style.textContent='.gm-head{display:flex;gap:16px;align-items:center;margin-bottom:20px}.gm-avatar{width:72px;height:72px;border:2px solid #171717;border-radius:50%;display:grid;place-items:center;background:#d8ff55;font-size:36px;font-weight:900;box-shadow:4px 4px 0 #171717}.gm-user{font-size:20px;font-weight:950}.gm-role{color:#6f6b63;font-weight:800;margin:3px 0 7px}.gm-medal{display:inline-block;border:1px solid #171717;border-radius:99px;padding:4px 8px;font-size:10px;font-weight:900;background:#fff0a8}.gm-xp{border:1.5px solid #171717;border-radius:14px;padding:14px;margin-bottom:14px}.gm-xp>div:first-child{display:flex;justify-content:space-between}.gm-bar{height:12px;border:1px solid #171717;border-radius:99px;overflow:hidden;margin:9px 0 5px}.gm-bar i{display:block;height:100%;background:#d8ff55}.gm-xp small{color:#6f6b63}.gm-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.gm-stats div{border:1px solid #ded8ca;border-radius:12px;padding:11px;background:white}.gm-stats b,.gm-stats small{display:block}.gm-stats small{color:#6f6b63;font-size:11px}.gm-title{margin:20px 0 8px}.gm-badges{display:flex;gap:8px;flex-wrap:wrap}.gm-badge{border:1px solid #171717;border-radius:99px;padding:7px 10px;background:#fff0a8;font-size:11px;font-weight:900}.gm-empty{color:#6f6b63;font-size:12px}.gm-plan{margin-top:16px;padding:10px;border-top:1px solid #ded8ca;color:#6f6b63;font-size:12px}@media(max-width:760px){.gm-stats{grid-template-columns:repeat(2,1fr)}}';document.head.appendChild(style);
 load();setInterval(load,15000);
})();
