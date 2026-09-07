(() => {
  const API='https://motor-invencoes.edsonfernandesvet.workers.dev';
  const token=()=>localStorage.getItem('futuro_auth_token')||'';
  const oldFetch=window.fetch.bind(window);
  async function call(path,opts={}){
    const headers=Object.assign({'content-type':'application/json'},opts.headers||{});
    if(token())headers.Authorization='Bearer '+token();
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
  function dbId(p){return Number(window.FUTUROLOGIO_DB_ID_FOR?.(p?.id)||0)}
  function status(t){const e=document.getElementById('socialStatus');if(e)e.textContent=t}
  async function act(p,kind,body){const id=dbId(p);if(!id){status('Registrando a invenção…');await new Promise(r=>setTimeout(r,250));}const finalId=dbId(p);if(!finalId){status('Aguarde o registro da invenção para interagir.');return null}return call('/api/inventions/'+finalId+'/'+kind,{method:'POST',body:body?JSON.stringify(body):undefined})}
  function shareText(p){return p.name+' — '+(p.what||'')+'\nFUTUROLOGIO™'}
  async function share(p,platform,url){
    try{const d=await act(p,'share',{platform});if(d){status('Compartilhamento registrado'+(d.xp?.granted?' · +'+d.xp.granted+' XP':''));return true}}catch(e){status(e.message);return false}
  }
  function box(){
    const result=document.getElementById('result');if(!result||result.classList.contains('hidden')||document.getElementById('socialActions'))return;
    const panel=result.querySelector('.panel');if(!panel)return;
    const el=document.createElement('div');el.id='socialActions';el.style='margin-top:18px;border-top:2px solid #171717;padding-top:16px;display:flex;gap:8px;flex-wrap:wrap';
    el.innerHTML='<button class="secondary" id="likeAction">Curtir</button><button class="secondary" id="commentAction">Comentar</button><button class="secondary" id="shareAction">Compartilhar</button><span id="socialStatus" style="align-self:center;font-size:12px;color:#6f6b63"></span><div id="shareMenu" style="display:none;width:100%;gap:6px;flex-wrap:wrap"></div>';
    panel.appendChild(el);
    $('likeAction').onclick=async()=>{const p=current();if(!p)return;try{const d=await act(p,'like');if(d)status((d.liked?'Curtido':'Curtida removida')+(d.xp?.granted?' · +'+d.xp.granted+' XP':''))}catch(e){status(e.message)}};
    $('commentAction').onclick=async()=>{const p=current();if(!p)return;const text=prompt('Escreva seu comentário:');if(!text||!text.trim())return;try{const d=await act(p,'comment',{text:text.trim()});if(d)status('Comentário publicado'+(d.xp?.granted?' · +'+d.xp.granted+' XP':''))}catch(e){status(e.message)}};
    $('shareAction').onclick=()=>{const m=$('shareMenu');m.style.display=m.style.display==='none'?'flex':'none'};
    const menu=$('shareMenu');
    const p=current();const text=shareText(p||{name:'FUTUROLOGIO™',what:''});const encoded=encodeURIComponent(text);const page=encodeURIComponent(location.href);
    const items=[['WhatsApp',()=>{window.open('https://wa.me/?text='+encoded,'_blank','noopener');return share(p,'whatsapp')}],['Facebook',()=>{window.open('https://www.facebook.com/sharer/sharer.php?u='+page,'_blank','noopener');return share(p,'facebook')}],['X',()=>{window.open('https://twitter.com/intent/tweet?text='+encoded+'&url='+page,'_blank','noopener');return share(p,'x')}],['Instagram',async()=>{try{await navigator.clipboard.writeText(text)}catch(e){}status('Texto copiado. Abra o Instagram para publicar.');return share(p,'instagram')}],['Threads',()=>{window.open('https://www.threads.net/intent/post?text='+encoded,'_blank','noopener');return share(p,'threads')}],['Copiar link',async()=>{try{await navigator.clipboard.writeText(location.href)}catch(e){}return share(p,'copy')},],['Compartilhar…',async()=>{if(navigator.share){try{await navigator.share({title:p?.name||'FUTUROLOGIO™',text,url:location.href});return share(p,'native')}catch(e){return}}return share(p,'native')}]];
    items.forEach(([label,fn])=>{const b=document.createElement('button');b.className='secondary';b.textContent=label;b.onclick=fn;menu.appendChild(b)});
  }
  function $(id){return document.getElementById(id)}
  const obs=new MutationObserver(()=>box());obs.observe(document.body,{subtree:true,attributes:true,attributeFilter:['class']});
  setTimeout(box,700);
})();
