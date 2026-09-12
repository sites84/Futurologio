(() => {
  'use strict';
  const API='https://motor-invencoes.edsonfernandesvet.workers.dev';
  const CLIENT_ID='939334121296-31dq7odt6c6d0lqh3qdf8rodvic8phql.apps.googleusercontent.com';
  const $=id=>document.getElementById(id);
  let gisReady=false;

  function addButton(){
    const modal=$('ftGateModal');
    if(!modal||$('ftGoogleBtn'))return;
    const actions=$('ftGateSubmit')?.parentElement;
    if(!actions)return;
    const wrap=document.createElement('div');
    wrap.id='ftGoogleBtn';
    wrap.style.cssText='width:100%;margin-top:10px';
    wrap.innerHTML='<div id="ftGoogleOfficial" style="display:flex;justify-content:center;margin-bottom:8px"></div><button type="button" id="ftGooglePick" style="width:100%;background:#d8ff55;border:0;border-radius:11px;padding:11px;font:inherit;font-weight:900;cursor:pointer;color:#111">Continuar com Google — escolher conta</button>';
    actions.parentElement.insertBefore(wrap,$('ftGateStatus'));
    $('ftGooglePick').onclick=googleLogin;
    renderOfficial();
  }

  function hideAnother(){const b=$('anotherBtn');if(b)b.style.display='none'}
  function setStatus(msg){const s=$('ftGateStatus');if(s)s.textContent=msg||''}

  async function finish(credential){
    if(!credential)throw new Error('O Google não devolveu a conta.');
    const r=await fetch(API+'/api/auth/google',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({id_token:credential})});
    const d=await r.json();
    if(!r.ok)throw new Error(d.error||'Não foi possível entrar com Google.');
    if(d.token)localStorage.setItem('futuro_auth_token',d.token);
    if(d.user)localStorage.setItem('futuro_social_user',JSON.stringify(d.user));
    $('ftGateModal')?.remove();location.reload();
  }

  function initGIS(cb){
    window.google.accounts.id.initialize({
      client_id:CLIENT_ID,
      callback:r=>cb(r.credential),
      auto_select:false,
      cancel_on_tap_outside:true,
      itp_support:true,
      use_fedcm_for_prompt:false,
      context:'signin'
    });
    try{window.google.accounts.id.disableAutoSelect()}catch{}
  }

  function renderOfficial(){
    const host=$('ftGoogleOfficial');
    if(!host||!window.google?.accounts?.id)return;
    host.innerHTML='';
    initGIS(async cred=>{try{await finish(cred)}catch(e){setStatus(e.message)}});
    window.google.accounts.id.renderButton(host,{
      type:'standard',
      theme:'filled_black',
      size:'large',
      text:'continue_with',
      shape:'rectangular',
      logo_alignment:'left',
      width:320
    });
  }

  async function googleLogin(){
    setStatus('Abrindo a lista de contas do Google…');
    try{
      await loadGIS();
      initGIS(async cred=>{try{await finish(cred)}catch(e){setStatus(e.message)}});
      const credential=await new Promise((resolve,reject)=>{
        let done=false;
        const finishP=(fn,v)=>{if(done)return;done=true;fn(v)};
        window.google.accounts.id.initialize({
          client_id:CLIENT_ID,
          auto_select:false,
          cancel_on_tap_outside:false,
          itp_support:true,
          use_fedcm_for_prompt:false,
          callback:r=>finishP(resolve,r.credential)
        });
        try{window.google.accounts.id.disableAutoSelect()}catch{}
        if(window.google.accounts.oauth2?.initTokenClient){
          const client=window.google.accounts.oauth2.initTokenClient({
            client_id:CLIENT_ID,
            scope:'openid email profile',
            prompt:'select_account',
            callback:()=>{}
          });
        }
        window.google.accounts.id.prompt(n=>{
          if(n.isNotDisplayed()||n.isSkippedMoment()||n.isDismissedMoment()){
            renderOfficial();
            const url='https://accounts.google.com/o/oauth2/v2/auth?'+new URLSearchParams({
              client_id:CLIENT_ID,
              redirect_uri:location.origin+location.pathname,
              response_type:'id_token',
              scope:'openid email profile',
              prompt:'select_account',
              nonce:String(Date.now()),
            });
            const w=window.open(url,'_blank','width=480,height=720');
            if(!w)finishP(reject,new Error('Permita o pop-up do Google e escolha a conta.'));
          }
        });
        setTimeout(()=>finishP(reject,new Error('Use o botão preto do Google acima para escolher a conta.')),20000);
      });
      await finish(credential);
    }catch(e){setStatus(e.message||'Não foi possível entrar com Google. Use o botão preto para escolher a conta.');renderOfficial()}
  }

  function loadGIS(){return new Promise((resolve,reject)=>{if(window.google?.accounts?.id){gisReady=true;return resolve()}const s=document.createElement('script');s.src='https://accounts.google.com/gsi/client';s.async=true;s.defer=true;s.onload=()=>{gisReady=true;resolve();renderOfficial()};s.onerror=()=>reject(new Error('Não foi possível carregar o Google.'));document.head.appendChild(s)})}

  loadGIS().catch(()=>{});
  const timer=setInterval(()=>{if($('ftGateModal')){addButton();if(gisReady)renderOfficial()}hideAnother()},200);
  setTimeout(()=>clearInterval(timer),30000);
  new MutationObserver(()=>{if($('ftGateModal')){addButton();if(gisReady)renderOfficial()}hideAnother()}).observe(document.documentElement,{childList:true,subtree:true});
})();
