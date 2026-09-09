import fs from 'node:fs';

const file='backend/worker.js';
let source=fs.readFileSync(file,'utf8');
if(source.includes("path==='/api/admin/stats'")){
  console.log('Admin routes already present.');
  process.exit(0);
}
const marker="if(path==='/api/health')return json({ok:true,service:'FUTUROLOGIO™ social API',version:'1.5'});";
if(!source.includes(marker)) throw new Error('Admin patch marker not found in worker.js');
const routes=`if(path==='/api/visit'&&request.method==='POST'){try{const b=await body(request),vid=String(b.visitor_id||'').trim().slice(0,100),page=String(b.page||'/').slice(0,200);if(vid)await env.DB.prepare('INSERT INTO SITE_VISITS(visitor_id,page,created_at) VALUES(?,?,CURRENT_TIMESTAMP)').bind(vid,page).run();return json({ok:true})}catch{return json({ok:true})}}\nif(path==='/api/admin/stats'&&request.method==='GET'){const au=await auth(request,env);if(!au)return json({error:'Sessão necessária.'},401);const admin=await user(env.DB,au.sub);if(!admin||!isTester(admin))return json({error:'Acesso administrativo negado.'},403);const count=async(sql,...args)=>{const st=env.DB.prepare(sql);const row=args.length?await st.bind(...args).first():await st.first();return Number(row?.n||0)};const recent=await env.DB.prepare('SELECT username,email,created_at FROM USERS ORDER BY created_at DESC LIMIT 20').all();return json({ok:true,stats:{users:await count('SELECT COUNT(*) n FROM USERS'),other_users:await count('SELECT COUNT(*) n FROM USERS WHERE lower(email)<>lower(?)',TESTER_EMAIL),creations:await count('SELECT COUNT(*) n FROM INVENTIONS'),likes:await count('SELECT COUNT(*) n FROM LIKES'),comments:await count('SELECT COUNT(*) n FROM COMMENTS'),shares:await count('SELECT COUNT(*) n FROM SHARES'),uploads:await count(\"SELECT COUNT(*) n FROM XP_EVENTS WHERE event_type='upload'\"),unique_visitors:await count('SELECT COUNT(DISTINCT visitor_id) n FROM SITE_VISITS'),visits:await count('SELECT COUNT(*) n FROM SITE_VISITS')},users:recent.results||[]})}`;
source=source.replace(marker,marker+'\n'+routes);
fs.writeFileSync(file,source);
console.log('Admin routes patched into deployment copy.');
