(()=>{
'use strict';
const API='https://motor-invencoes.edsonfernandesvet.workers.dev';
let id=localStorage.getItem('futuro_visitor_id');
if(!id){id=crypto.randomUUID();localStorage.setItem('futuro_visitor_id',id)}
try{navigator.sendBeacon?.(API+'/api/visit',new Blob([JSON.stringify({visitor_id:id,page:location.pathname})],{type:'application/json'}))||fetch(API+'/api/visit',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({visitor_id:id,page:location.pathname}),keepalive:true})}catch{}
if(!document.getElementById('futuroGamificationEvents')){const s=document.createElement('script');s.id='futuroGamificationEvents';s.src='./frontend/gamification-events.js?v=20260910b';document.head.appendChild(s)}
})();
