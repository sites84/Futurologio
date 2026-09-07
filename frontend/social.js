(() => {
  'use strict';

  const API = 'https://motor-invencoes.edsonfernandesvet.workers.dev';
  const GOOGLE_CLIENT_ID = window.FUTUROLOGIO_GOOGLE_CLIENT_ID || '';
  const state = {
    user: null,
    currentId: null,
    liked: false,
    comments: [],
    shareXp: 0
  };

  const css = `
    .ft-social-bar{max-width:1080px;margin:0 auto;padding:12px 20px;border-bottom:1.5px solid var(--ink);display:flex;align-items:center;justify-content:space-between;gap:10px;background:#fffdf8}
    .ft-account{display:flex;align-items:center;gap:9px;min-width:0}.ft-avatar{width:34px;height:34px;border:1.5px solid var(--ink);border-radius:50%;display:grid;place-items:center;background:var(--lime);font-weight:950;flex:none}.ft-user{min-width:0}.ft-user b{display:block;font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ft-user span{display:block;font-size:10px;color:var(--muted)}
    .ft-actions{display:flex;gap:7px;flex-wrap:wrap;justify-content:flex-end}.ft-btn{border:1.5px solid var(--ink);background:white;border-radius:10px;padding:8px 10px;font-weight:850;font-size:12px;cursor:pointer}.ft-btn.dark{background:var(--ink);color:white}.ft-btn.lime{background:var(--lime)}
    .ft-profile{max-width:1080px;margin:15px auto 0;padding:0 20px;display:none}.ft-profile.open{display:block}.ft-profile-card{background:var(--paper);border:2px solid var(--ink);border-radius:18px;padding:16px;box-shadow:4px 4px 0 var(--ink);display:grid;grid-template-columns:auto 1fr auto;gap:14px;align-items:center}.ft-big-avatar{width:62px;height:62px;border:2px solid var(--ink);border-radius:50%;display:grid;place-items:center;background:var(--lime);font-size:26px;font-weight:950}.ft-stats{display:flex;gap:12px;flex-wrap:wrap}.ft-stat{border:1px solid var(--ink);border-radius:10px;padding:7px 10px;background:#fff;font-size:11px}.ft-stat b{display:block;font-size:16px}.ft-note{font-size:11px;color:var(--muted);margin-top:8px}
    .ft-social{margin-top:16px;border-top:1.5px solid var(--line);padding-top:14px}.ft-social h3{margin:0 0 9px;font-size:14px}.ft-social-row{display:flex;gap:7px;flex-wrap:wrap}.ft-share{font-size:11px;padding:8px 9px}.ft-like.on{background:var(--red);color:white}.ft-comments{margin-top:13px}.ft-comment-row{display:flex;gap:7px}.ft-comment-row input{flex:1;min-width:0;border:1.5px solid var(--ink);border-radius:10px;padding:9px;font:inherit;font-size:12px;background:white}.ft-comment{font-size:11px;border-left:3px solid var(--ink);padding:6px 9px;margin-top:7px;background:#fff}.ft-xp{display:inline-block;margin-left:5px;font-size:10px;font-weight:950;background:var(--lime);border:1px solid var(--ink);padding:2px 5px;border-radius:99px}
    .ft-modal{position:fixed;inset:0;background:rgba(0,0,0,.48);display:none;align-items:center;justify-content:center;padding:20px;z-index:9999}.ft-modal.open{display:flex}.ft-modal-card{width:min(430px,100%);background:var(--paper);border:2px solid var(--ink);border-radius:20px;padding:22px;box-shadow:7px 7px 0 var(--ink)}.ft-modal-card h2{margin:0 0 7px}.ft-modal-card p{color:var(--muted);font-size:13px;line-height:1.5}.ft-input{width:100%;border:1.5px solid var(--ink);border-radius:10px;padding:11px;margin:5px 0 9px;font:inherit}.ft-modal-actions{display:flex;gap:8px;margin-top:8px}.ft-modal-actions>*{flex:1}.ft-google{background:white!important;color:var(--ink)!important}.ft-status{font-size:11px;margin-top:10px;padding:8px;border:1px solid var(--line);border-radius:9px;background:#fff}.ft-badges{display:flex;gap:5px;flex-wrap:wrap;margin-top:9px}.ft-badge{font-size:10px;border:1px solid var(--ink);border-radius:99px;padding:4px 7px;background:#fff}
    @media(max-width:760px){.ft-social-bar{padding:10px 12px}.ft-profile{padding:0 12px}.ft-profile-card{grid-template-columns:auto 1fr}.ft-profile-card .ft-actions{grid-column:1/-1;justify-content:flex-start}}
  `;
  const style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);

  function initials(name){return (name||'C').trim().split(/\s+/).slice(0,2).map(x=>x[0]).join('').toUpperCase()||'C'}
  function getLocal(){try{return JSON.parse(localStorage.getItem('futuro_social_user')||'null')}catch{return null}}
  function saveLocal(u){localStorage.setItem('futuro_social_user',JSON.stringify(u))}
  function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}

  function mount(){
    const header=document.querySelector('header');
    if(!header) return;
    const bar=document.createElement('div'); bar.className='ft-social-bar'; bar.id='ftSocialBar';
    bar.innerHTML=`<div class="ft-account"><div class="ft-avatar" id="ftAvatar">C</div><div class="ft-user"><b id="ftUser">Visitante</b><span id="ftRole">Entre para salvar seu progresso</span></div></div><div class="ft-actions"><button class="ft-btn" id="ftProfileBtn">Meu perfil</button><button class="ft-btn dark" id="ftLoginBtn">Entrar / cadastrar</button></div>`;
    header.appendChild(bar);

    const prof=document.createElement('section'); prof.className='ft-profile'; prof.id='ftProfile';
    prof.innerHTML=`<div class="ft-profile-card"><div class="ft-big-avatar" id="ftBigAvatar">C</div><div><h3 style="margin:0 0 4px" id="ftProfileName">Visitante</h3><div class="ft-stats"><div class="ft-stat"><b id="ftXp">0</b>XP</div><div class="ft-stat"><b id="ftLevel">1</b>nível</div><div class="ft-stat"><b id="ftCreations">0</b>criações</div></div><div class="ft-badges" id="ftBadges"><span class="ft-badge">Sem medalha ainda</span></div><div class="ft-note">Medalhas a cada 5 níveis. Limites de XP social são controlados pelo sistema.</div></div><div class="ft-actions"><button class="ft-btn" id="ftCloseProfile">Fechar</button></div></div>`;
    header.insertAdjacentElement('afterend',prof);

    const modal=document.createElement('div'); modal.className='ft-modal'; modal.id='ftModal';
    modal.innerHTML=`<div class="ft-modal-card"><h2>Entrar no FUTUROLOGIO™</h2><p>Crie seu perfil para registrar invenções, ganhar XP, receber medalhas e interagir com outras criações.</p><label style="font-size:11px;font-weight:900">Nome de usuário</label><input class="ft-input" id="ftNameInput" maxlength="40" placeholder="Ex.: InventorDoCaos"><div class="ft-modal-actions"><button class="ft-btn lime" id="ftDemoLogin">Criar conta</button><button class="ft-btn" id="ftCloseModal">Cancelar</button></div><button class="ft-btn ft-google" id="ftGoogle" style="width:100%;margin-top:8px">Continuar com Google</button><div class="ft-status" id="ftAuthStatus">Google Sign-In fica ativo assim que o Client ID do projeto for configurado.</div></div>`;
    document.body.appendChild(modal);

    document.getElementById('ftLoginBtn').onclick=()=>modal.classList.add('open');
    document.getElementById('ftCloseModal').onclick=()=>modal.classList.remove('open');
    document.getElementById('ftProfileBtn').onclick=()=>prof.classList.toggle('open');
    document.getElementById('ftCloseProfile').onclick=()=>prof.classList.remove('open');
    document.getElementById('ftDemoLogin').onclick=()=>{document.getElementById('ftAuthStatus').textContent='O cadastro local foi desativado. Use o cadastro oficial para criar sua conta.';document.getElementById('ftLoginBtn')?.click()};
    document.getElementById('ftGoogle').onclick=()=>{document.getElementById('ftAuthStatus').textContent=GOOGLE_CLIENT_ID?'Inicializando Google Sign-In…':'Configuração pendente: falta o Google Client ID do projeto.'; if(GOOGLE_CLIENT_ID) loadGoogle();};

    state.user=getLocal(); renderUser(); attachResultObserver();
  }

  function renderUser(){
    const u=state.user;
    document.getElementById('ftAvatar').textContent=initials(u?.username);document.getElementById('ftBigAvatar').textContent=initials(u?.username);
    document.getElementById('ftUser').textContent=u?.username||'Visitante';document.getElementById('ftRole').textContent=u?`${u.role||'Curioso Iniciante'} · ${u.xp||0} XP`:'Entre para salvar seu progresso';
    document.getElementById('ftProfileName').textContent=u?.username||'Visitante';document.getElementById('ftXp').textContent=u?.xp||0;document.getElementById('ftLevel').textContent=u?.level||1;document.getElementById('ftCreations').textContent=u?.creations||0;
    document.getElementById('ftLoginBtn').textContent=u?'Sair':'Entrar / cadastrar';
    if(u){document.getElementById('ftLoginBtn').onclick=()=>{localStorage.removeItem('futuro_social_user');state.user=null;renderUser()};}
  }

  function loadGoogle(){
    if(window.google?.accounts?.id){initGoogle();return}
    const s=document.createElement('script');s.src='https://accounts.google.com/gsi/client';s.onload=initGoogle;document.head.appendChild(s);
  }
  function initGoogle(){
    if(!window.google?.accounts?.id) return;
    google.accounts.id.initialize({client_id:GOOGLE_CLIENT_ID,callback:async r=>{try{const res=await fetch(API+'/api/auth/google',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({id_token:r.credential})});const data=await res.json();if(data.user){state.user=data.user;saveLocal(data.user);document.getElementById('ftModal').classList.remove('open');renderUser();}}catch(e){document.getElementById('ftAuthStatus').textContent='Não foi possível concluir o login agora.';}}});
    google.accounts.id.prompt();
  }

  function attachResultObserver(){
    const result=document.getElementById('result'); if(!result) return;
    const obs=new MutationObserver(()=>{if(!result.classList.contains('hidden')) attachSocialToResult()});obs.observe(result,{attributes:true,attributeFilter:['class']});
  }

  function attachSocialToResult(){
    const result=document.getElementById('result'); if(result.querySelector('.ft-social')) return;
    const stamp=result.querySelector('.stamp'); if(!stamp) return;
    const box=document.createElement('div');box.className='ft-social';
    box.innerHTML=`<h3>Interação social</h3><div class="ft-social-row"><button class="ft-btn ft-like" id="ftLike">♡ Curtir <span class="ft-xp">XP</span></button><button class="ft-btn ft-share" data-platform="whatsapp">WhatsApp</button><button class="ft-btn ft-share" data-platform="facebook">Facebook</button><button class="ft-btn ft-share" data-platform="x">X</button><button class="ft-btn ft-share" data-platform="instagram">Instagram</button><button class="ft-btn ft-share" data-platform="threads">Threads</button><button class="ft-btn ft-share" data-platform="copy">Copiar link</button><button class="ft-btn ft-share" data-platform="native">Compartilhar</button></div><div class="ft-comments"><div class="ft-comment-row"><input id="ftCommentInput" maxlength="500" placeholder="Comente nesta invenção…"><button class="ft-btn lime" id="ftCommentBtn">Comentar</button></div><div id="ftCommentList"></div></div>`;
    stamp.parentNode.insertBefore(box,stamp);
    box.querySelector('#ftLike').onclick=()=>socialLike();
    box.querySelector('#ftCommentBtn').onclick=()=>socialComment();
    box.querySelectorAll('.ft-share').forEach(b=>b.onclick=()=>socialShare(b.dataset.platform));
    state.currentId=getCurrentId();
  }

  function getCurrentId(){const h=document.getElementById('stamp')?.textContent||'';const m=h.match(/Registro FUT-([^-]+)/);return m?m[1].toLowerCase():null}
  function ensureUser(){if(state.user)return true;document.getElementById('ftModal').classList.add('open');return false}
  async function api(path,options={}){const res=await fetch(API+path,{...options,headers:{'content-type':'application/json',...(options.headers||{})}});if(!res.ok)throw new Error('HTTP '+res.status);return res.json()}

  async function socialLike(){
    if(!ensureUser())return; const b=document.getElementById('ftLike'); state.liked=!state.liked;b.classList.toggle('on',state.liked);b.firstChild.textContent=state.liked?'♥ Descurtir ':'♡ Curtir ';
    try{const d=await api('/api/inventions/'+encodeURIComponent(state.currentId)+'/like',{method:'POST',body:JSON.stringify({})});if(d.user){state.user=d.user;saveLocal(d.user);renderUser()}}catch(e){if(state.user){state.user.xp=(state.user.xp||0)+(state.liked?2:0);saveLocal(state.user);renderUser()}}
  }
  async function socialComment(){
    if(!ensureUser())return;const input=document.getElementById('ftCommentInput');const text=input.value.trim();if(!text)return;
    addCommentLocal(text);input.value='';
    try{const d=await api('/api/inventions/'+encodeURIComponent(state.currentId)+'/comment',{method:'POST',body:JSON.stringify({text})});if(d.user){state.user=d.user;saveLocal(d.user);renderUser()}}catch(e){state.user.xp=(state.user.xp||0)+3;saveLocal(state.user);renderUser()}
  }
  function addCommentLocal(text){const list=document.getElementById('ftCommentList');const div=document.createElement('div');div.className='ft-comment';div.innerHTML='<b>'+esc(state.user?.username||'Você')+'</b>: '+esc(text);list.prepend(div)}
  async function socialShare(platform){
    if(!ensureUser())return;
    const name=document.getElementById('name')?.textContent||'Invenção FUTUROLOGIO™';const url=location.href.split('#')[0];const text=name+' — uma invenção que não existe. FUTUROLOGIO™';
    let target='';
    if(platform==='whatsapp')target='https://wa.me/?text='+encodeURIComponent(text+' '+url);
    else if(platform==='facebook')target='https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(url);
    else if(platform==='x')target='https://twitter.com/intent/tweet?text='+encodeURIComponent(text)+'&url='+encodeURIComponent(url);
    else if(platform==='instagram')target='https://www.instagram.com/';
    else if(platform==='threads')target='https://www.threads.net/intent/post?text='+encodeURIComponent(text+' '+url);
    else if(platform==='copy'){await navigator.clipboard?.writeText(url);alert('Link copiado.');}
    else if(platform==='native'&&navigator.share){await navigator.share({title:name,text,url})}
    else if(platform!=='copy')target=url;
    if(target)window.open(target,'_blank','noopener,noreferrer');
    try{const d=await api('/api/inventions/'+encodeURIComponent(state.currentId)+'/share',{method:'POST',body:JSON.stringify({platform})});if(d.user){state.user=d.user;saveLocal(d.user);renderUser()}}catch(e){state.shareXp++;if(state.shareXp<=10){state.user.xp=(state.user.xp||0)+2;saveLocal(state.user);renderUser()}}
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();
