(()=>{
'use strict';
if(window.__FUTUROLOGIO_PROPAGANDA_V1)return;
window.__FUTUROLOGIO_PROPAGANDA_V1=true;
const $=id=>document.getElementById(id);
function text(p){
 const name=String(p?.name||'esta invenção').trim(),cat=String(p?.category||'').trim();
 const seed=[...name].reduce((a,c)=>((a*31+c.charCodeAt(0))>>>0),cat.length*97);
 const a=['Só as Indústrias FUTUROLOGIO™ teriam a coragem científica de olhar para uma necessidade completamente discutível e concluir: “isso precisa de um produto imediatamente.”','Depois de anos pesquisando problemas que ninguém pediu para resolver, o Departamento de Soluções Desnecessárias da FUTUROLOGIO™ finalmente apresenta uma resposta para este produto.','Os pesquisadores da FUTUROLOGIO™ descobriram que a humanidade poderia viver perfeitamente sem este produto. Foi exatamente por isso que decidiram fabricá-lo.','A engenharia convencional perguntou “por quê?”. A FUTUROLOGIO™ perguntou “e se fizéssemos mesmo assim?”. O resultado atende pelo nome deste produto.'];
 const b=['Testado em condições rigorosamente questionáveis, ele promete acrescentar uma quantidade cientificamente difícil de justificar à sua rotina.','Sua eficiência foi avaliada por especialistas altamente qualificados em parecerem convencidos durante reuniões que poderiam ter sido um e-mail.','A diretoria garante que o investimento em pesquisa foi absolutamente necessário, embora ninguém do financeiro tenha conseguido explicar para quê.','Após uma sequência de testes, simulações e decisões ruins, a equipe declarou o produto “pronto para complicar a vida do consumidor”.'];
 const c=['É a prova de que inovação não precisa melhorar o mundo; às vezes basta tornar o cotidiano mais estranho.','Porque esperar que a vida resolva seus próprios problemas quando uma equipe inteira pode inventar outro problema para vender junto?','Não prometemos que você precisava disso. Prometemos apenas que, depois de conhecer a invenção, será difícil explicar por que ela não existia antes.','Uma conquista tecnológica cuja principal aplicação é permitir que você conte esta história e seja imediatamente desacreditado.'];
 return a[seed%a.length]+' '+b[(seed>>>3)%b.length]+' '+c[(seed>>>6)%c.length]+(cat?' Área de especialização: '+cat+'.':'');
}
function render(){
 const result=$('result'),nameEl=$('name'),anchor=$('what')?.closest('.card');
 if(!result||result.classList.contains('hidden')||!nameEl||!anchor)return;
 const p=window.FUTUROLOGIO_CURRENT_PRODUCT||window.FUTUROLOGIO_PRODUCTS?.find(x=>String(x.name).trim()===nameEl.textContent.trim());
 if(!p)return;
 let box=$('futuroPropagandaBox');
 if(!box){box=document.createElement('div');box.id='futuroPropagandaBox';box.className='card';box.style.cssText='margin:20px 0 12px;background:#d8ff55;border:2px solid #171717;border-radius:15px;padding:17px;box-shadow:4px 4px 0 #171717';box.innerHTML='<div style="font-size:10px;font-weight:950;letter-spacing:.12em;text-transform:uppercase;margin-bottom:7px">PUBLICIDADE INSTITUCIONAL // FUTUROLOGIO™</div><p id="futuroPropagandaText" style="margin:0;font-size:15px;line-height:1.55;font-weight:750"></p>';anchor.parentElement.insertBefore(box,anchor)}
 $('futuroPropagandaText').textContent=text(p);
}
render();setInterval(render,500);
})();