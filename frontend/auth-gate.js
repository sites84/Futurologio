(() => {
  'use strict';
  const API='https://motor-invencoes.edsonfernandesvet.workers.dev';
  const TOKEN_KEY='futuro_auth_token', USER_KEY='futuro_social_user', MAP_KEY='futuro_db_invention_ids';
  let busy=false;
  const $=id=>document.getElementById(id);
  function token(){return localStorage.getItem(TOKEN_KEY)||''}
  function user(){try{return JSON.parse(localStorage.getItem(USER_KEY)||'null')}catch{return null}}
  function map(){try{return JSON.parse(localStorage.getItem(MAP_KEY)||'{}')}catch{return {}}}
  function setSession(data){if(data.token)localStorage.setItem(TOKEN_KEY,data.token);if(data.user)localStorage.setItem(USER_KEY,JSON.stringify(data.user));}
  function clearSession(){localStorage.removeItem(TOKEN_KEY);localStorage.removeItem(USER_KEY)}
  const oldFetch=window.fetch;
  window.fetch=async(...args)=>{let [input,init]=args;const url=typeof input==='string'?input:(input&&input.url)||'';if(url.startsWith(API)&&token()){init={...(init||{}),headers:{...((init&&init.headers)||{}),Authorization:'Bearer '+token()}}}return oldFetch(input,init)};
  function openAuth(mode='register'){
    let modal=$('ftGateModal'); if(!modal){
      modal=document.createElement('div');modal.id='ftGateModal';modal.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;padding:18px;z-index:10001';
      modal.innerHTML=`<div style="width:min(440px,100%);background:#fffdf8;border:2px solid #171717;border-radius:20px;padding:22px;box-shadow:7px 7px 0 #171717"><h2 id="ftGateTitle" style="margin:0 0 7px">Crie sua conta</h2><p id="ftGateIntro" style="color:#6f6b63;font-size:13px;line-height:1.45">Para criar invenções, primeiro registre seu perfil.</p><label style="font-size:11px;font-weight:900">Nome de usuário</label><input id="ftGateUser" autocomplete="username" maxlength="40" style="width:100%;border:1.5px solid #171717;border-radius:10px;padding:11px;margin:5px 0 9px;font:inherit"><div><label style="font-size:11px;font-weight:900">E-mail</label><input id="ftGateEmail" type="email" autocomplete="email" style="width:100%;border:1.5px solid #171717;border-radius:10px;padding:11px;margin:5px 0 9px;font:inherit"></div><div><label style="font-size:11px;font-weight:900">Senha</label><input id="ftGatePass" type="password" autocomplete="new-password" placeholder="mínimo de 8 caracteres" style="width:100%;border:1.5px solid #171717;border-radius:10px;padding:11px;margin:5px 0 9px;font:inherit"></div><div id="ftGatePass2Wrap"><label style="font-size:11px;font-weight:900">Confirmar senha</label><input id="ftGatePass2" type="password" autocomplete="new-password" style="width:100%;border:1.5px solid #171717;border-radius:10px;padding:11px;margin:5px 0 9px;font:inherit"></div><div style="display:flex;gap:8px"><button id="ftGateSubmit" style="flex:1;background:#d8ff55;color:#171717;border:1.5px solid #171717;padding:12px;border-radius:11px;font-weight:900">Criar conta</button><button id="ftGateClose" style="flex:1;background:white;color:#171717;border:1.5px solid #171717;padding:12px;border-radius:11px;font-weight:900">Cancelar</button></div><button id="ftGateSwitch" style="width:100%;margin-top:8px;background:white;color:#171717;border:1.5px solid #171717;padding:10px;border-radius:11px;font-weight:800">Já tenho conta</button><div id="ftGateStatus" style="font-size:11px;margin-top:10px;padding:8px;border:1px solid #ded8ca;border-radius:9px;background:#fff"></div></div>`;
      document.body.appendChild(modal); $('ftGateClose').onclick=()=>modal.remove(); $('ftGateSwitch').onclick=()=>openAuth(modal.dataset.mode==='register'?'login':'register'); $('ftGateSubmit').onclick=submitAuth;
    }
    modal.dataset.mode=mode; const reg=mode==='register'; $('ftGateTitle').textContent=reg?'Crie sua conta':'Entrar no FUTUROLOGIO™'; $('ftGateIntro').textContent=reg?'Para criar invenções, primeiro registre seu perfil.':'Entre para continuar criando e acessar seu progresso.'; $('ftGateSubmit').textContent=reg?'Criar conta':'Entrar'; $('ftGateSwitch').textContent=reg?'Já tenho conta':'Criar uma conta'; $('ftGatePass').autocomplete=reg?'new-password':'current-password'; $('ftGatePass2Wrap').style.display=reg?'block':'none'; $('ftGateStatus').textContent=''; modal.style.display='flex';
  }
  async function submitAuth(){
    if(busy)return; busy=true; const mode=$('ftGateModal').dataset.mode; const username=$('ftGateUser').value.trim(); const email=$('ftGateEmail').value.trim(); const password=$('ftGatePass').value; const pass2=$('ftGatePass2').value; const status=$('ftGateStatus');
    if(mode==='register'&&password!==pass2){status.textContent='As senhas não coincidem.';busy=false;return} status.textContent='Salvando seu perfil…';
    try{const r=await oldFetch(API+'/api/auth/'+(mode==='register'?'register':'login'),{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({username,email,password})});const d=await r.json();if(!r.ok)throw new Error(d.error||'Não foi possível concluir.');setSession(d);$('ftGateModal').remove();location.reload();}catch(e){status.textContent=e.message||'Não foi possível concluir.'}finally{busy=false}
  }
  async function canCreate(){
    if(!token()||!user()){openAuth('register');return false}
    try{
      const r=await oldFetch(API+'/api/consume-creation',{method:'POST',headers:{'content-type':'application/json'}});
      const d=await r.json();
      if(!r.ok){if(r.status===401){clearSession();openAuth('login');return false}alert(d.error||'Seu limite diário de criações foi atingido.');return false}
      const u=user(); if(u&&d.allowance){u.allowance=d.allowance;localStorage.setItem(USER_KEY,JSON.stringify(u));}
      return true;
    }catch(e){alert('Não foi possível validar sua conta no servidor. A criação permanece bloqueada.');return false}
  }
  async function recordCreated(product){
    if(!product||!token())return;
    try{
      const r=await oldFetch(API+'/api/record-creation',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({id:product.id,name:product.name,category:product.category,what:product.what,realTech:product.realTech,specTech:product.specTech,inventedTech:product.inventedTech,build:product.build,uses:product.uses,dangers:product.dangers||product.danger,test:product.test,curiosity:product.curiosity,readiness:product.readiness,year:product.year,patent:product.patent})});
      const d=await r.json();
      if(!r.ok){alert(d.error||'A invenção foi exibida, mas não foi registrada no seu perfil.');return;}
      if(d.invention?.id){const m=map();m[product.id]=Number(d.invention.id);localStorage.setItem(MAP_KEY,JSON.stringify(m));}
      if(d.user){localStorage.setItem(USER_KEY,JSON.stringify(d.user));}
    }catch(e){alert('A invenção foi exibida, mas não foi possível registrá-la no seu perfil agora.');}
  }
  window.FUTUROLOGIO_AFTER_CREATE=recordCreated;
  window.FUTUROLOGIO_DB_ID_FOR=productId=>Number(map()[productId]||0);
  function install(){
    const create=$('createBtn'),another=$('anotherBtn'); if(!create)return;
    create.onclick=async()=>{if(await canCreate())window.newInvention()};
    if(another)another.onclick=async()=>{if(await canCreate())window.newInvention()};
    const login=$('ftLoginBtn'); if(login&&!login.dataset.gateBound){login.dataset.gateBound='1';login.onclick=()=>user()? (clearSession(),location.reload()):openAuth('register');}
  }
  const timer=setInterval(()=>{if($('createBtn')){clearInterval(timer);install()}},50);
})();
