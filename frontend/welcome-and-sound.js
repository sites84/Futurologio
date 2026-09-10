(()=>{
'use strict';
if(window.__FUTURO_WELCOME_SOUND)return;
window.__FUTURO_WELCOME_SOUND=true;
const SHOW_KEY='futuro_show_welcome_v1';
function playCreationSound(){
  try{
    const AC=window.AudioContext||window.webkitAudioContext;
    if(!AC)return;
    const ctx=new AC();
    const now=ctx.currentTime;
    const notes=[{f:220,t:0,d:.10},{f:330,t:.07,d:.11},{f:494,t:.15,d:.12},{f:740,t:.24,d:.20}];
    notes.forEach(n=>{
      const o=ctx.createOscillator(),g=ctx.createGain();
      o.type='triangle';o.frequency.setValueAtTime(n.f,now+n.t);
      g.gain.setValueAtTime(.0001,now+n.t);
      g.gain.exponentialRampToValueAtTime(.14,now+n.t+.018);
      g.gain.exponentialRampToValueAtTime(.0001,now+n.t+n.d);
      o.connect(g);g.connect(ctx.destination);o.start(now+n.t);o.stop(now+n.t+n.d+.02);
    });
    setTimeout(()=>ctx.close().catch(()=>{}),700);
  }catch{}
}
function installCreationSound(){
  const fn=window.newInvention;
  if(typeof fn!=='function'||fn.__futuroCreationSound)return;
  const wrapped=function(...args){playCreationSound();return fn.apply(this,args)};
  wrapped.__futuroCreationSound=true;
  window.newInvention=wrapped;
}
function welcomeModal(){
  if(document.getElementById('futuroWelcomeModal'))return;
  const o=document.createElement('div');o.id='futuroWelcomeModal';o.style.cssText='position:fixed;inset:0;z-index:10050;background:rgba(0,0,0,.72);display:flex;align-items:center;justify-content:center;padding:18px;overflow:auto';
  o.innerHTML=`<style>
    #futuroWelcomeModal .fw-box{width:min(720px,100%);max-height:92vh;overflow:auto;background:#fffdf8;color:#171717;border:2px solid #171717;border-radius:22px;padding:28px;box-shadow:8px 8px 0 #171717}
    #futuroWelcomeModal .fw-kicker{display:inline-block;background:#d8ff55;border:1px solid #171717;border-radius:999px;padding:5px 9px;font-size:10px;font-weight:1000;letter-spacing:.08em;text-transform:uppercase}
    #futuroWelcomeModal h2{margin:12px 0 10px;font-size:clamp(30px,6vw,48px);letter-spacing:-.05em;line-height:.92}
    #futuroWelcomeModal p{margin:0 0 12px;color:#45413b;font-size:15px;line-height:1.65}
    #futuroWelcomeModal .fw-note{border:1.5px solid #171717;border-radius:14px;background:#f5f2ea;padding:13px 14px;font-size:13px;line-height:1.55;margin:16px 0}
    #futuroWelcomeModal button{width:100%;background:#171717;color:#fff;border:2px solid #171717;border-radius:12px;padding:13px 16px;font:inherit;font-weight:950;cursor:pointer}
  </style><div class="fw-box"><span class="fw-kicker">Bem-vindo ao FUTUROLOGIO™</span><h2>Um lugar onde tudo pode ser criado.</h2><p>Aqui, tudo mesmo. Uma ideia pode nos levar a um novo patamar da humanidade — ou, com um pequeno erro de projeto, ajudar a destruir a raça humana.</p><div class="fw-note"><b>Mas fique tranquilo:</b> 99,9999999% do que criamos aqui é apenas diversão. O objetivo é explorar ideias impossíveis, absurdas, geniais e completamente bizarras — e ver até onde a imaginação consegue chegar.</div><p>Explore as criações dos outros inventores, curta as ideias mais absurdas, descubra novas categorias e depois crie as suas próprias invenções.</p><p>Escolha uma categoria, aperte o botão e deixe o FUTUROLOGIO fazer o resto.</p><button type="button" id="futuroWelcomeClose">ENTRAR NO FUTURO</button></div>`;
  document.body.appendChild(o);
  o.querySelector('#futuroWelcomeClose').onclick=()=>o.remove();
}
function showWelcome(){
  if(localStorage.getItem(SHOW_KEY)!=='1')return;
  localStorage.removeItem(SHOW_KEY);
  setTimeout(welcomeModal,180);
}
function watchRegister(){
  const modal=document.getElementById('ftGateModal'),btn=document.getElementById('ftGateSubmit');
  if(!modal||!btn||btn.dataset.welcomeWrapped)return;
  btn.dataset.welcomeWrapped='1';
  btn.addEventListener('click',()=>{
    if(modal.dataset.mode!=='register')return;
    localStorage.setItem(SHOW_KEY,'1');
    setTimeout(()=>{if(document.getElementById('ftGateModal'))localStorage.removeItem(SHOW_KEY)},15000);
  },true);
}
showWelcome();
setInterval(()=>{installCreationSound();watchRegister()},150);
})();
