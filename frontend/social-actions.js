(() => {
  const API='https://motor-invencoes.edsonfernandesvet.workers.dev';
  const token=()=>localStorage.getItem('futuro_auth_token')||'';
  const oldFetch=window.fetch.bind(window);
  async function call(path,opts={}){
    const headers=Object.assign({'content-type':'application/json'},opts.headers||{});
    if(token()) headers.Authorization='Bearer '+token();
    const r=await oldFetch(API+path,Object.assign({},opts,{headers}));
    let d={};try{d=await r.json()}catch(e){}
    if(!r.ok)throw new Error(d.error||'Não foi possível concluir a ação.');
    return d;
  }
  function current(){
    const ids=JSON.parse(localStorage.getItem('futuro_used_v3')||'[]');
    const id=ids[ids.length-1];
    return (window.FUTUROLOGIO_PRODUCTS||[]).find(p=>p.id===id)||null;
  }
  function box(){
    const result=document.getElementById('result');if(!result||document.getElementById('socialActions'))return;
    const el=document.createElement('div');el.id='socialActions';el.style='margin-top:18px;border-top:2px solid #171717;padding-top:16px;display:flex;gap:8px;flex-wrap:wrap';
    el.innerHTML='<button class="secondary" id="likeAction">Curtir</button><button class="secondary" id="commentAction">Comentar</button><button class="secondary" id="shareAction">Compartilhar</button><span id="socialStatus" style="align-self:center;font-size:12px;color:#6f6b63"></span>';
    result.querySelector('.panel').appendChild(el);
    document.getElementById('likeAction').onclick=async()=>{const p=current();if(!p)return;try{const d=await call('/api/inventions/'+encodeURIComponent(p.id)+'/like',{method:'POST'});status((d.liked?'Curtido':'Curtida removida')+(d.xp?.granted?' · +'+d.xp.granted+' XP':''))}catch(e){status(e.message)}};
    document.getElementById('commentAction').onclick=async()=>{const p=current();if(!p)return;const text=prompt('Escreva seu comentário:');if(!text||!text.trim())return;try{const d=await call('/api/inventions/'+encodeURIComponent(p.id)+'/comment',{method:'POST',body:JSON.stringify({text:text.trim()})});status('Comentário publicado'+(d.xp?.granted?' · +'+d.xp.granted+' XP':''))}catch(e){status(e.message)}};
    document.getElementById('shareAction').onclick=async()=>{const p=current();if(!p)return;const text=p.name+' — '+(p.what||'')+'\nFUTUROLOGIO™';try{await navigator.clipboard.writeText(text)}catch(e){}try{const d=await call('/api/inventions/'+encodeURIComponent(p.id)+'/share',{method:'POST',body:JSON.stringify({platform:'copy'})});status('Compartilhamento registrado'+(d.xp?.granted?' · +'+d.xp.granted+' XP':''))}catch(e){status(e.message)}};
    function status(t){document.getElementById('socialStatus').textContent=t}
  }
  const obs=new MutationObserver(()=>{if(!document.getElementById('result')?.classList.contains('hidden'))box()});obs.observe(document.body,{subtree:true,attributes:true,attributeFilter:['class']});
  setTimeout(box,500);
})();
