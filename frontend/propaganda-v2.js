(()=>{
'use strict';
if(window.__FUTUROLOGIO_PROPAGANDA_V2)return;
window.__FUTUROLOGIO_PROPAGANDA_V2=true;
const $=id=>document.getElementById(id);
const clean=s=>String(s||'').replace(/\s+/g,' ').trim();
function text(p){
 const name=clean(p?.name)||'esta invenção';
 const cat=clean(p?.category);
 const desc=clean(p?.what||p?.description||p?.funcao||'');
 const subject=(desc.match(/(?:Um|Uma|O|A)\s+([^,.]+)/i)?.[1]||name.replace(/^O\s+/i,'')).trim();
 const verbs=name.toUpperCase();
 let opening='';
 if(/DETECTOR|MONITOR|MEDIDOR|CONTADOR|AVALIADOR|CALIBRADOR/.test(verbs)) opening=`A FUTUROLOGIO™ decidiu medir aquilo que seres humanos normalmente preferem fingir que não está acontecendo: ${subject.toLowerCase()}.`;
 else if(/TRADUTOR|CORRETOR|RECUPERADOR|NEUTRALIZADOR|SUPRESSOR|SILENCIADOR|ABSORVEDOR|EXTINTOR/.test(verbs)) opening=`Depois de constatar que ${subject.toLowerCase()} continuava atrapalhando a civilização, o Departamento de Soluções Desnecessárias da FUTUROLOGIO™ resolveu interferir.`;
 else if(/BLOQUEADOR|CANCELADOR|DESLIGADOR|QUEBRADOR|INTERCEPTOR|CORTADOR/.test(verbs)) opening=`A FUTUROLOGIO™ identificou um comportamento que insistia em acontecer e tomou a única decisão tecnicamente defensável: instalar um dispositivo para impedir.`;
 else if(/SIMULADOR|GERADOR|AMPLIFICADOR|KIT|ESPELHO|PULSEIRA|COLAR/.test(verbs)) opening=`Os pesquisadores da FUTUROLOGIO™ olharam para ${subject.toLowerCase()} e fizeram a pergunta que nenhuma empresa responsável faria: “e se transformássemos isso em tecnologia?”`;
 else opening=`A engenharia convencional tentou ignorar ${subject.toLowerCase()}. A FUTUROLOGIO™ preferiu transformá-lo em produto.`;
 const middle=desc?` Projetado especificamente para ${desc.charAt(0).toLowerCase()+desc.slice(1).replace(/[.!?]+$/,'')}, o sistema foi submetido a testes rigorosos, decisões questionáveis e pelo menos uma reunião que deveria ter sido um e-mail.`:` Projetado para a função declarada no próprio nome, o sistema passou por testes rigorosos e decisões questionáveis da equipe de engenharia.`;
 const ending=cat?` Resultado: uma solução de alta tecnologia para um problema da categoria “${cat}” que a humanidade conseguiu sobreviver sem resolver até agora.`:` Resultado: uma solução de alta tecnologia para um problema que a humanidade conseguiu sobreviver sem resolver até agora.`;
 return opening+middle+ending;
}
function render(){
 const result=$('result'),nameEl=$('name'),anchor=$('what')?.closest('.card');
 if(!result||result.classList.contains('hidden')||!nameEl||!anchor)return;
 const p=window.FUTUROLOGIO_CURRENT_PRODUCT||window.FUTUROLOGIO_PRODUCTS?.find(x=>clean(x.name)===clean(nameEl.textContent));
 if(!p)return;
 let box=$('futuroPropagandaBox');
 if(!box){box=document.createElement('div');box.id='futuroPropagandaBox';box.className='card';box.style.cssText='margin:20px 0 12px;background:#d8ff55;border:2px solid #171717;border-radius:15px;padding:17px;box-shadow:4px 4px 0 #171717';box.innerHTML='<div style="font-size:10px;font-weight:950;letter-spacing:.12em;text-transform:uppercase;margin-bottom:7px">PUBLICIDADE INSTITUCIONAL // FUTUROLOGIO™</div><p id="futuroPropagandaText" style="margin:0;font-size:15px;line-height:1.55;font-weight:750"></p>';anchor.parentElement.insertBefore(box,anchor)}
 $('futuroPropagandaText').textContent=text(p);
}
render();setInterval(render,500);
})();