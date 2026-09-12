import fs from 'node:fs';

const file='backend/worker.js';
let s=fs.readFileSync(file,'utf8');
const TESTER_EMAIL='edsonfernandesvet@gmail.com';
const isTesterSource="const TESTER_EMAIL='edsonfernandesvet@gmail.com';const isTester=u=>String(u?.email||'').trim().toLowerCase()===TESTER_EMAIL;";

const unlimitedAllowance="async function allowance(db,u){if(isTester(u))return {used:0,base:null,credits:0,remaining:null,unlimited:true};const d=today();let used=Number(u.daily_creations||0);if(u.daily_creation_date!==d){used=0;await db.prepare('UPDATE USERS SET daily_creations=0,daily_creation_date=? WHERE id=?').bind(d,u.id).run()}const base=PLAN_LIMITS[u.plan]??PLAN_LIMITS.free;return {used,base,credits:Number(u.extra_credits||0),remaining:Math.max(0,base-used)+Number(u.extra_credits||0)}}";
const allowancePattern=/async function allowance\(db,u\)\{.*?\}\nfunction pub/s;
if(!allowancePattern.test(s))throw new Error('allowance function not found');
s=s.replace(allowancePattern,unlimitedAllowance+'\nfunction pub');

const testerReturn="if(isTester(u)){const a=await allowance(env.DB,u);return json({ok:true,charged:0,source:'tester',allowance:a,credits:null,user:pub(u,a)})}";
const userLookup="const u=await user(env.DB,au.sub);if(!u)return json({ok:false,error:'Usuário não encontrado.'},404);";
if(!s.includes(testerReturn)){
  const creditMarker="/* CREDIT_CONSUME_V2 */if(path==='/api/consume-creation'&&request.method==='POST'){";
  if(s.includes(creditMarker)){
    const markerWithUser=creditMarker+userLookup;
    if(!s.includes(markerWithUser))throw new Error('CREDIT_CONSUME_V2 user lookup marker not found');
    s=s.replace(markerWithUser,markerWithUser+testerReturn);
  }else{
    const legacyMarker="/* DAILY_CREDIT_CONSUME */if(path==='/api/consume-creation'&&request.method==='POST'){";
    if(s.includes(legacyMarker)){
      s=s.replace(legacyMarker,legacyMarker+userLookup+testerReturn);
      s=s.replace(userLookup+testerReturn+userLookup,userLookup+testerReturn);
    }else{
      const consume="if(path==='/api/consume-creation'&&request.method==='POST'){";
      if(!s.includes(consume))throw new Error('consume-creation route not found');
      s=s.replace(consume,consume+userLookup+testerReturn);
    }
  }
}

if(!s.includes(isTesterSource))throw new Error('tester identity marker missing');
fs.writeFileSync(file,s);
console.log('Tester account configured with unlimited creation credits.');
