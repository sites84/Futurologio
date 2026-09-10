(() => {
  'use strict';
  const API='https://motor-invencoes.edsonfernandesvet.workers.dev';
  const CLIENT_ID='939334121296-31dq7odt6c6d0lqh3qdf8rodvic8phql.apps.googleusercontent.com';
  const $=id=>document.getElementById(id);
  function addButton(){
    const modal=$('ftGateModal');
    if(!modal||$('ftGoogleBtn'))return;
    const actions=$('ftGateSubmit')?.parentElement;
    if(!actions)return;
    const b=document.createElement('button');
    b.id='ftGoogleBtn'; b.type='button'; b.textContent='Continuar com Google';
    b.style.cssText='width:100%;margin-top:8px;background:#fff;border:1.5px solid #171717;border-radius:11px;padding:11px;font:inherit;font-weight:900;cursor:pointer;color:#171717';
    b.onclick=googleLogin;
    actions.parentElement.insertBefore(b,$('ftGateStatus'));
  }
  function hideAnother(){const b=$('anotherBtn');if(b)b.style.display='none'}
  function setStatus(msg){const s=$('ftGateStatus');if(s)s.textContent=msg||''}
  async function googleLogin(){
    setStatus('Abrindo login do Google…');
    try{
      await loadGIS();
      const credential=await new Promise((resolve,reject)=>{
        let done=false;
        const finish=(fn,v)=>{if(done)return;done=true;fn(v)};
        window.google.accounts.id.initialize({client_id:CLIENT_ID,callback:r=>finish(resolve,r.credential)});
        window.google.accounts.id.prompt(n=>{if(n.isNotDisplayed()||n.isSkippedMoment())finish(reject,new Error('O Google não abriu a janela de login.'))});
        setTimeout(()=>finish(reject,new Error('Tempo esgotado ao abrir o Google.')),60000);
      });
      const r=await fetch(API+'/api/auth/google',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({id_token:credential})});
      const d=await r.json();
      if(!r.ok)throw new Error(d.error||'Não foi possível entrar com Google.');
      if(d.token)localStorage.setItem('futuro_auth_token',d.token);
      if(d.user)localStorage.setItem('futuro_social_user',JSON.stringify(d.user));
      $('ftGateModal')?.remove();location.reload();
    }catch(e){setStatus(e.message||'Não foi possível entrar com Google.')}
  }
  function loadGIS(){return new Promise((resolve,reject)=>{if(window.google?.accounts?.id)return resolve();const s=document.createElement('script');s.src='https://accounts.google.com/gsi/client';s.async=true;s.defer=true;s.onload=resolve;s.onerror=()=>reject(new Error('Não foi possível carregar o Google.'));document.head.appendChild(s)})}
  const timer=setInterval(()=>{if($('ftGateModal'))addButton();hideAnother()},100);
  setTimeout(()=>clearInterval(timer),30000);
  new MutationObserver(()=>{if($('ftGateModal'))addButton();hideAnother()}).observe(document.documentElement,{childList:true,subtree:true});
})();
