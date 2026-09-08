(() => {
  'use strict';
  const links=[
    ['ChatGPT','https://chatgpt.com/','CHATGPT'],
    ['Grok','https://grok.com/','GROK'],
    ['Gemini','https://gemini.google.com/?hl=pt-BR','GEMINI']
  ];
  const css=`.game-ai-links{margin-top:12px;border-top:1px solid #30415f;padding-top:12px}.game-ai-links-title{font-size:11px;font-weight:1000;color:#fff;margin-bottom:8px}.game-ai-links-sub{font-size:9px;color:#9eb1d0;margin-bottom:8px}.game-ai-links-row{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px}.game-ai-link{display:block;text-align:center;text-decoration:none;border:1px solid #405476;border-radius:10px;background:#0b1427;color:#dce6ff;padding:9px 6px;font-size:10px;font-weight:1000}.game-ai-link:hover{border-color:#62e6ff;background:#14233d;color:#fff}.game-xp-note{margin:10px 0 0;padding:10px;border:1px solid #4b6728;border-radius:10px;background:#18220f;color:#d8ff55;font-size:10px;line-height:1.45;font-weight:900}.game-xp-note b{color:#fff}@media(max-width:560px){.game-ai-links-row{grid-template-columns:1fr}}`;
  const style=document.createElement('style');style.id='futuro-ai-links-ui';style.textContent=css;document.head.appendChild(style);
  function mount(card){if(card.querySelector('.game-ai-links'))return;card.querySelector('.game-style-row')?.remove();const actions=card.querySelector('.game-prompt-actions');if(!actions)return;const ai=document.createElement('div');ai.className='game-ai-links';ai.innerHTML='<div class="game-ai-links-title">IAS INDICADAS PARA CRIAÇÃO</div><div class="game-ai-links-sub">Abra uma das ferramentas, cole o prompt e gere a imagem no estilo oficial FUTUROLOGIO.</div><div class="game-ai-links-row">'+links.map(x=>`<a class="game-ai-link" href="${x[1]}" target="_blank" rel="noopener noreferrer">${x[2]}</a>`).join('')+'</div>';actions.insertAdjacentElement('afterend',ai);if(!card.querySelector('.game-xp-note')){const note=document.createElement('div');note.className='game-xp-note';note.innerHTML='GANHE XP: <b>crie a imagem em uma IA, faça o upload aqui e receba +5 XP</b> por upload válido, respeitando os limites e as regras do FUTUROLOGIO.';ai.insertAdjacentElement('afterend',note)}}
  function scan(){document.querySelectorAll('.game-prompt-card').forEach(mount)}
  const obs=new MutationObserver(scan);obs.observe(document.body,{childList:true,subtree:true});scan();
})();
