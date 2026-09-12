(()=>{'use strict';if(window.__FUTURO_PRODUCT_UI_FIX_V1)return;window.__FUTURO_PRODUCT_UI_FIX_V1=true;if(!/\/criar(?:\.html)?\/?$/i.test(location.pathname))return;
const PLACE='A Futurologio ainda não tem dinheiro suficiente para implementar a criação automática de imagens. Crie sua imagem com o prompt no botão abaixo e faça o upload aqui.';
const STAMP='Corra para registrar essa patente antes que alguém roube nossa invenção.';
function words(s){return String(s||'').replace(/\s+/g,' ').trim()}function score(s){const t=words(s);if(!t)return 1;return Math.max(8,Math.min(220,t.length))}
function product(){return window.FUTUROLOGIO_CURRENT_PRODUCT||{}}
function reality(){
  const p=product();
  const real=p.realTech||p.real||document.getElementById('real')?.textContent;
  const spec=p.specTech||p.spec||document.getElementById('spec')?.textContent;
  const imp=p.inventedTech||p.impossible||p.imp||document.getElementById('imp')?.textContent;
  let a=score(real),b=score(spec),c=score(imp),t=a+b+c||1;
  let ra=Math.round(a/t*100),rs=Math.round(b/t*100),ri=100-ra-rs;
  if(ri<0){ri=0;rs=100-ra}
  const rEl=document.getElementById('r'),sEl=document.getElementById('s'),iEl=document.getElementById('i'),txt=document.getElementById('reality');
  if(rEl)rEl.style.width=ra+'%';if(sEl)sEl.style.width=rs+'%';if(iEl)iEl.style.width=ri+'%';
  if(txt)txt.innerHTML='<b style="color:#8de8ff">'+ra+'%</b> tecnologias reais · <b style="color:#c7a7ff">'+rs+'%</b> especulativas · <b style="color:#ff7770">'+ri+'%</b> inventadas';
  let legend=document.getElementById('realityLegend');
  const host=txt?.parentElement;
  if(host&&!legend){legend=document.createElement('div');legend.id='realityLegend';legend.style.cssText='display:flex;gap:10px;flex-wrap:wrap;margin-top:8px;font-size:11px;color:#9aa3b8';host.appendChild(legend)}
  if(legend)legend.innerHTML='<span>■ real '+ra+'%</span><span>■ especulativa '+rs+'%</span><span>■ inventada '+ri+'%</span>';
}
function placeholder(){const ph=document.querySelector('.game-image-placeholder span, .game-image-placeholder div, .game-image-placeholder');
  const box=document.querySelector('.game-image-placeholder');
  if(!box)return;
  if(document.querySelector('.game-image-card img'))return;
  box.innerHTML='<div><strong style="color:#d8ff55">VISUALIZAÇÃO DA INVENÇÃO</strong><span style="display:block;margin-top:8px;color:#c9d0e0;line-height:1.5">'+PLACE+'</span></div>';
}
function stamp(){const s=document.querySelector('.stamp b');if(s)s.textContent=STAMP;const extra=document.querySelector('.stamp');if(extra){const nodes=[...extra.childNodes].filter(n=>n.nodeType===3);nodes.forEach(n=>{if(/Registre|patente|roubem/i.test(n.textContent||''))n.textContent='';});}}
function flow(){const card=document.querySelector('.game-image-card');if(!card)return;let d=document.getElementById('futuroImageFlow');
  if(!d){d=document.createElement('div');d.id='futuroImageFlow';d.style.cssText='margin:10px 0 0;padding:14px;border:1px solid #2a3148;border-radius:14px;background:#101522;color:#c9d0e0;font-size:13px;line-height:1.45';card.insertAdjacentElement('afterend',d)}
  if(d.dataset.ready==='1')return;
  d.dataset.ready='1';
  d.innerHTML='<b style="color:#d8ff55">Como gerar a imagem</b><p style="margin:8px 0 10px">'+PLACE+'</p><button type="button" id="copyPromptBtn" style="background:#d8ff55;color:#111;border:0;border-radius:10px;padding:10px 14px;font-weight:950;cursor:pointer">COPIAR PROMPT</button><div id="aiLinks" style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:12px"></div>';
  d.querySelector('#copyPromptBtn').onclick=async()=>{const t=window.FUTUROLOGIO_IMAGE_PROMPT?.()||document.getElementById('futuroPromptText')?.value||'';try{await navigator.clipboard.writeText(t);d.querySelector('#copyPromptBtn').textContent='PROMPT COPIADO'}catch{prompt('Copie o prompt:',t)}};
  const links=[
    {n:'ChatGPT',h:'https://chatgpt.com/',bg:'#10a37f',c:'#fff'},
    {n:'Leonardo',h:'https://app.leonardo.ai/',bg:'#6d28d9',c:'#fff'},
    {n:'Grok',h:'https://grok.com/',bg:'#111',c:'#d8ff55'},
    {n:'Gemini',h:'https://gemini.google.com/app',bg:'#4285f4',c:'#fff'}
  ];
  const wrap=d.querySelector('#aiLinks');
  wrap.innerHTML=links.map(x=>'<a href="'+x.h+'" target="_blank" rel="noopener" style="display:flex;align-items:center;justify-content:center;min-height:40px;border-radius:10px;font-weight:900;text-decoration:none;background:'+x.bg+';color:'+x.c+'">'+x.n+'</a>').join('');
}
function tick(){const r=document.getElementById('result');if(!r||r.classList.contains('hidden'))return;reality();placeholder();stamp();flow()}
setInterval(tick,600);setTimeout(tick,200)})();
