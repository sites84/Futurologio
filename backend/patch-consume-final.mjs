import fs from 'node:fs';
const file='backend/worker.js';
let s=fs.readFileSync(file,'utf8');
const marker="if(path==='/api/consume-creation'&&request.method==='POST')";
if(!s.includes(marker))throw new Error('consume-creation route not found');
if(!s.includes('FINAL_CONSUME_CREDIT_V1')){
 const route="/* FINAL_CONSUME_CREDIT_V1 */if(path==='/api/consume-creation'&&request.method==='POST'){const au=await auth(request,env);if(!au)return json({ok:false,error:'Sessão necessária.'},401);const u=await user(env.DB,au.sub);if(!u)return json({ok:false,error:'Usuário não encontrado.'},404);if(isTester(u)){const a=await allowance(env.DB,u);return json({ok:true,charged:0,source:'tester',allowance:a,credits:null,user:pub(u,a)})}const d=today();let used=Number(u.daily_creations||0),extra=Number(u.extra_credits||0);if(u.daily_creation_date!==d){used=0;extra=0;await env.DB.prepare('UPDATE USERS SET daily_creations=0,extra_credits=0,daily_creation_date=? WHERE id=?').bind(d,u.id).run()}let source='daily';if(used<1){const r=await env.DB.prepare('UPDATE USERS SET daily_creations=daily_creations+1,updated_at=CURRENT_TIMESTAMP WHERE id=? AND daily_creation_date=? AND daily_creations<1').bind(u.id,d).run();if(Number(r?.meta?.changes||0)!==1)return json({ok:false,error:'Não foi possível reservar seu crédito. Tente novamente.'},409)}else if(extra>0){const r=await env.DB.prepare('UPDATE USERS SET extra_credits=extra_credits-1,updated_at=CURRENT_TIMESTAMP WHERE id=? AND extra_credits>0').bind(u.id).run();if(Number(r?.meta?.changes||0)!==1)return json({ok:false,error:'Você não tem créditos disponíveis hoje.'},429);source='extra'}else return json({ok:false,error:'Você ficou sem créditos. Complete as missões para ganhar mais créditos.'},429);const fresh=await user(env.DB,u.id),a=await allowance(env.DB,fresh);return json({ok:true,charged:1,source,allowance:a,credits:a.remaining,user:pub(fresh,a)})}\n";
 s=s.replace(marker,route+marker);
 fs.writeFileSync(file,s);
}
console.log('Final consume credit route applied.');
