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
  async function authFetch(url,init={}){const headers={...(init.headers||{})};const t=token();if(t)headers.Authorization='Bearer '+t;return oldFetch(url,{...init,headers})}
  window.fetch=async(...args)=>{let [input,init]=args;const url=typeof input==='string'?input:(input&&input.url)||'';if(url.startsWith(API)&&token()){init={...(init||{}),headers:{...((init&&init.headers)||{}),Authorization:'Bearer '+token()}}}return oldFetch(input,init)};
  function openAuth(mode='register'){
    let modal=$('ftGateModal');
    if(!modal){
      modal=document.createElement('div');modal.id='ftGateModal';
      modal.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.62);display:flex;align-items:center;justify-content:center;padding:18px;z-index:10001';
      modal.innerHTML=`<style>
        #ftGateModal .ft-gate-box{width:min(440px,100%);background:#fffdf8;color:#171717;border:2px solid #171717;border-radius:20px;padding:22px;box-shadow:7px 7px 0 #171717}
        #ftGateModal .ft-gate-box h2{margin:0 0 7px;color:#171717!important;font-size:26px}
        #ftGateModal .ft-gate-box p{color:#6f6b63!important;font-size:13px;line-height:1.45}
        #ftGateModal .ft-gate-field{display:block;margin:0 0 9px}
        #ftGateModal .ft-gate-field label{display:block!important;color:#171717!important;font-size:12px!important;font-weight:900!important;margin-bottom:5px!important;opacity:1!important}
        #ftGateModal .ft-gate-field input{box-sizing:border-box;width:100%;height:48px;background:#fff!important;color:#171717!important;border:1.5px solid #171717!important;border-radius:10px;padding:11px 13px;margin:0!important;font:inherit;font-size:16px;outline:none;opacity:1!important;-webkit-text-fill-color:#171717}
        #ftGateModal .ft-gate-field input::placeholder{color:#777!important;opacity:1!important}
        #ftGateModal .ft-gate-field input:focus{border-color:#171717!important;box-shadow:0 0 0 2px #d8ff55}
        #ftGateModal .ft-gate-actions{display:flex;gap:8px}
        #ftGateModal button{font:inherit;cursor:pointer;color:#171717!important;opacity:1!important}
        #ftGateModal .ft-gate-primary{flex:1;background:#d8ff55!important;border:1.5px solid #171717;border-radius:11px;padding:12px;font-weight:900}
        #ftGateModal .ft-gate-secondary{flex:1;background:#fff!important;border:1.5px solid #171717;border-radius:11px;padding:12px;font-weight:900}
        #ftGateModal #ftGateSwitch{width:100%;margin-top:8px;background:#fff!important;border:1.5px solid #171717;border-radius:11px;padding:10px;font-weight:800}
        #ftGateModal #ftGateStatus{color:#171717!important;font-size:11px;margin-top:10px;padding:8px;border:1px solid #ded8ca;border-radius:9px;background:#fff}
      </style><div class="ft-gate-box">
        <h2 id="ftGateTitle">Crie sua conta</h2>
        <p id="ftGateIntro">Para criar invenções, primeiro registre seu perfil.</p>
        <div class="ft-gate-field"><label for="ftGateUser">Nome de usuário</label><input id="ftGateUser" autocomplete="username" maxlength="40" placeholder="Digite seu nome de usuário"></div>
        <div class="ft-gate-field"><label for="ftGateEmail">E-mail</label><input id="ftGateEmail" type="email" autocomplete="email" placeholder="Digite seu e-mail"></div>
        <div class="ft-gate-field"><label for="ftGatePass">Senha</label><input id="ftGatePass" type="password" autocomplete="new-password" placeholder="Digite sua senha (mínimo de 8 caracteres)"></div>
        <div class="ft-gate-field" id="ftGatePass2Wrap"><label for="ftGatePass2">Confirmar senha</label><input id="ftGatePass2" type="password" autocomplete="new-password" placeholder="Digite novamente sua senha"></div>
        <div class="ft-gate-actions"><button id="ftGateSubmit" class="ft-gate-primary">Criar conta</button><button id="ftGateClose" class="ft-gate-secondary">Cancelar</button></div>
        <button id="ftGateSwitch">Já tenho conta</button>
        <div id="ftGateStatus"></div>
      </div>`;
      document.body.appendChild(modal);
      $('ftGateClose').onclick=()=>modal.remove();
      $('ftGateSwitch').onclick=()=>openAuth(modal.dataset.mode==='register'?'login':'register');
      $('ftGateSubmit').onclick=submitAuth;
    }
    modal.dataset.mode=mode;const reg=mode==='register';
    $('ftGateTitle').textContent=reg?'Crie sua conta':'Entrar no FUTUROLOGIO™';
    $('ftGateIntro').textContent=reg?'Para criar invenções, primeiro registre seu perfil.':'Entre para continuar criando e acessar seu progresso.';
    $('ftGateSubmit').textContent=reg?'Criar conta':'Entrar';
    $('ftGateSwitch').textContent=reg?'Já tenho conta':'Criar uma conta';
    $('ftGatePass').autocomplete=reg?'new-password':'current-password';
    $('ftGatePass').placeholder=reg?'Digite sua senha (mínimo de 8 caracteres)':'Digite sua senha';
    $('ftGatePass2Wrap').style.display=reg?'block':'none';
    $('ftGateStatus').textContent='';modal.style.display='flex';
  }
  window.openAuth=openAuth;
  async function submitAuth(){
    if(busy)return;busy=true;const mode=$('ftGateModal').dataset.mode,username=$('ftGateUser').value.trim(),email=$('ftGateEmail').value.trim(),password=$('ftGatePass').value,pass2=$('ftGatePass2').value,status=$('ftGateStatus');
    if(mode==='register'&&password!==pass2){status.textContent='As senhas não coincidem.';busy=false;return}status.textContent='Salvando seu perfil…';
    try{const r=await oldFetch(API+'/api/auth/'+(mode==='register'?'register':'login'),{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({username,email,password})});const d=await r.json();if(!r.ok)throw new Error(d.error||'Não foi possível concluir.');setSession(d);$('ftGateModal').remove();location.reload()}catch(e){status.textContent=e.message||'Não foi possível concluir.'}finally{busy=false}
  }
  async function canCreate(){
    if(!token()||!user()){openAuth('register');return false}
    const selected=$('selectedCat')?.textContent?.trim(),used=JSON.parse(localStorage.getItem('futuro_used_v3')||'[]'),products=window.FUTUROLOGIO_PRODUCTS||[];
    if(selected&&products.length&&!products.some(p=>p.category===selected&&!used.includes(p.id))){alert('Essa categoria já mostrou todos os produtos disponíveis. Escolha outra categoria.');return false}
    try{const r=await authFetch(API+'/api/consume-creation',{method:'POST',headers:{'content-type':'application/json'}}),d=await r.json();if(!r.ok){if(r.status===401){clearSession();openAuth('login');return false}alert(d.error||'Seu limite diário de criações foi atingido.');return false}const u=user();if(u&&d.allowance){u.allowance=d.allowance;localStorage.setItem(USER_KEY,JSON.stringify(u))}return true}catch(e){alert('Não foi possível validar sua conta no servidor. A criação permanece bloqueada.');return false}
  }
  async function recordCreated(product){
    if(!product||!token())return;
    try{const r=await authFetch(API+'/api/record-creation',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({id:product.id,name:product.name,category:product.category,what:product.what,realTech:product.realTech,specTech:product.specTech,inventedTech:product.inventedTech,build:product.build,uses:product.uses,dangers:product.dangers||product.danger,test:product.test||product.tests,curiosity:product.curiosity,readiness:product.readiness,year:product.year,patent:product.patent})});const d=await r.json();if(!r.ok){alert(d.error||'A invenção foi exibida, mas não foi registrada no seu perfil.');return}if(d.invention?.id){const id=Number(d.invention.id),m=map();m[product.id]=id;localStorage.setItem(MAP_KEY,JSON.stringify(m));product.__dbId=id;window.FUTUROLOGIO_CURRENT_PRODUCT=product;window.FUTUROLOGIO_CURRENT_DB_ID=id}if(d.user)localStorage.setItem(USER_KEY,JSON.stringify(d.user))}catch(e){alert('A invenção foi exibida, mas não foi possível registrá-la no seu perfil agora.')}
  }
  window.FUTUROLOGIO_AFTER_CREATE=recordCreated;
  window.FUTUROLOGIO_DB_ID_FOR=productId=>Number(map()[productId]||0);
  function install(){const create=$('createBtn'),another=$('anotherBtn');if(!create)return;create.onclick=async()=>{if(await canCreate())window.newInvention()};if(another)another.onclick=async()=>{if(await canCreate())window.newInvention()};const login=$('ftLoginBtn');if(login&&!login.dataset.gateBound){login.dataset.gateBound='1';login.onclick=()=>user()?(clearSession(),location.reload()):openAuth('register')}}
  function mountCreationAccount(){
    if(!$('createBtn'))return;
    const nav=document.querySelector('header nav');
    if(nav&&!$('ftAccountBtn')){
      const b=document.createElement('button');b.id='ftAccountBtn';b.type='button';b.textContent=token()&&user()?'MEU PERFIL':'ENTRAR';b.style.cssText='margin-left:auto;border:1.5px solid #171717;background:#fff;border-radius:10px;padding:9px 13px;font:inherit;font-weight:900;cursor:pointer;color:#171717';
      b.onclick=()=>{if(!token()||!user()){openAuth('register');return}document.querySelector('.profile')?.scrollIntoView({behavior:'smooth',block:'start'})};
      nav.appendChild(b);
    }else if($('ftAccountBtn'))$('ftAccountBtn').textContent=token()&&user()?'MEU PERFIL':'ENTRAR';
    if(token()&&!document.getElementById('futuro-gamification-loader')){
      const s=document.createElement('script');s.id='futuro-gamification-loader';s.src='./frontend/gamification.js?v=20260909b';document.body.appendChild(s);
    }
  }
  const timer=setInterval(()=>{if($('createBtn')){clearInterval(timer);install();mountCreationAccount();const path=location.pathname;const isCreatePage=/\/criar(?:\.html)?\/?$/.test(path);const q=new URLSearchParams(location.search);if(isCreatePage&&!token()&&!q.has('db_invention')&&!q.has('invention'))setTimeout(()=>openAuth('register'),120)}},50);
  setInterval(mountCreationAccount,2000);
})();
