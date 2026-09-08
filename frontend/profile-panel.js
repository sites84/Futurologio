(() => {
  'use strict';
  const API='https://motor-invencoes.edsonfernandesvet.workers.dev';
  const TOKEN='futuro_auth_token';
  const $=id=>document.getElementById(id);
  const esc=s=>String(s??'').replace(/[&<>\"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[m]));
  async function loadProfile(){
    const token=localStorage.getItem(TOKEN)||'';
    if(!token)return null;
    const r=await fetch(API+'/api/profile',{headers:{Authorization:'Bearer '+token}});
    if(!r.ok)return null;
    const d=await r.json(); return d.profile||null;
  }
  function render(p){
    const box=$('ftRealProfile'); if(!box)return;
    if(!p){box.innerHTML='<div class="ft-rp-visitor"><b>Seu perfil começa aqui.</b><span>Cadastre-se para registrar invenções, ganhar XP e evoluir de cargo.</span></div>';return;}
    const medal=p.level>=5&&p.level%5===0?'🏅 Medalha do nível '+p.level:'Próxima medalha: nível '+(Math.floor(p.level/5)+1)*5;
    const badges=(p.badges||[]).map(b=>'<span>'+esc(b.name)+'</span>').join('')||'<span>Nenhuma conquista ainda</span>';
    box.innerHTML='<div class="ft-rp-card"><div class="ft-rp-head"><div class="ft-rp-avatar">'+esc((p.username||'C').slice(0,2).toUpperCase())+'</div><div><h2>'+esc(p.username)+'</h2><b>'+esc(p.role||'Curioso Iniciante')+'</b><small>Nível '+p.level+' · '+p.xp+' XP</small></div></div><div class="ft-rp-grid"><div><b>'+p.creations+'</b><small>criações</small></div><div><b>'+p.categories+'</b><small>categorias</small></div><div><b>'+p.likes+'</b><small>curtidas</small></div><div><b>'+p.comments+'</b><small>comentários</small></div><div><b>'+p.shares+'</b><small>compartilhamentos</small></div><div><b>'+p.likesReceived+'</b><small>recebidas</small></div></div><div class="ft-rp-medal">'+medal+'</div><div class="ft-rp-badges">'+badges+'</div></div>';
  }
  function mount(){
    if($('ftRealProfile'))return;
    const section=document.createElement('section');section.id='ftRealProfile';section.className='ft-real-profile';
    section.innerHTML='<div class="ft-rp-loading">Carregando perfil…</div>';
    const target=document.querySelector('main')||document.body; target.appendChild(section);
    loadProfile().then(render).catch(()=>render(null));
  }
  const style=document.createElement('style');style.textContent='.ft-real-profile{max-width:1080px;margin:16px auto;padding:0 20px}.ft-rp-card{background:var(--paper,#fffdf8);color:#171717;border:2px solid var(--ink,#171717);border-radius:18px;padding:18px;box-shadow:5px 5px 0 var(--ink,#171717)}.ft-rp-card h2,.ft-rp-card b,.ft-rp-card small{color:#171717}.ft-rp-head{display:flex;gap:12px;align-items:center}.ft-rp-avatar{width:58px;height:58px;border:2px solid var(--ink,#171717);border-radius:50%;display:grid;place-items:center;background:var(--lime,#d8ff55);font-weight:950;font-size:20px;color:#171717}.ft-rp-head h2{margin:0 0 2px}.ft-rp-head b,.ft-rp-head small{display:block}.ft-rp-head small{color:#6f6b63!important;margin-top:3px}.ft-rp-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:7px;margin-top:15px}.ft-rp-grid div{border:1px solid var(--ink,#171717);border-radius:10px;padding:8px;text-align:center;background:white;color:#171717}.ft-rp-grid b,.ft-rp-grid small{display:block;color:#171717}.ft-rp-grid b{font-size:17px}.ft-rp-grid small{font-size:9px;color:#6f6b63!important}.ft-rp-medal{margin-top:12px;font-weight:900;color:#171717}.ft-rp-badges{display:flex;flex-wrap:wrap;gap:6px;margin-top:9px}.ft-rp-badges span{border:1px solid var(--ink,#171717);border-radius:99px;padding:4px 7px;background:white;color:#171717;font-size:10px}.ft-rp-visitor,.ft-rp-loading{border:1.5px dashed var(--ink,#171717);border-radius:14px;padding:15px;background:var(--paper,#fffdf8);color:#171717}.ft-rp-visitor b,.ft-rp-visitor span{display:block;color:#171717}.ft-rp-visitor span{font-size:12px;color:#6f6b63!important;margin-top:4px}@media(max-width:760px){.ft-real-profile{padding:0 12px}.ft-rp-grid{grid-template-columns:repeat(3,1fr)}}';document.head.appendChild(style);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();
