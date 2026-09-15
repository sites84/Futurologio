import fs from 'node:fs';

const file='backend/worker.js';
let source=fs.readFileSync(file,'utf8');

const marker="const url=new URL(request.url),path=url.pathname;try{";
if(!source.includes(marker)) throw new Error('Worker fetch marker not found.');
if(source.includes('__ADMIN_STATS_ROUTE_V2__')){
  console.log('Admin stats route v2 already present.');
  process.exit(0);
}

const route=`/* __ADMIN_STATS_ROUTE_V2__ */
if(path==='/api/admin/stats'&&request.method==='GET'){
  const au=await auth(request,env);
  if(!au)return json({error:'Sessão necessária.'},401);
  const admin=await user(env.DB,au.sub);
  if(!admin||!isTester(admin))return json({error:'Acesso administrativo negado.'},403);
  const count=async(sql,...args)=>{const st=env.DB.prepare(sql);const row=args.length?await st.bind(...args).first():await st.first();return Number(row?.n||0)};
  const recent=await env.DB.prepare('SELECT username,email,created_at FROM USERS ORDER BY created_at DESC LIMIT 50').all();
  return json({ok:true,stats:{users:await count('SELECT COUNT(*) n FROM USERS'),other_users:await count('SELECT COUNT(*) n FROM USERS WHERE lower(email)<>lower(?)',TESTER_EMAIL),registered_products:await count('SELECT COUNT(*) n FROM INVENTIONS'),user_creations:await count('SELECT COUNT(*) n FROM USER_INVENTIONS'),creations:await count('SELECT COUNT(*) n FROM USER_INVENTIONS'),catalog_invented:await count("SELECT COUNT(DISTINCT json_extract(i.data,'$.source_id')) n FROM INVENTIONS i WHERE json_extract(i.data,'$.source_id') IS NOT NULL AND EXISTS(SELECT 1 FROM USER_INVENTIONS ui WHERE ui.invention_id=i.id)"),likes:await count('SELECT COUNT(*) n FROM LIKES'),comments:await count('SELECT COUNT(*) n FROM COMMENTS'),shares:await count('SELECT COUNT(*) n FROM SHARES'),uploads:await count("SELECT COUNT(*) n FROM XP_EVENTS WHERE event_type='upload'"),unique_visitors:await count('SELECT COUNT(DISTINCT visitor_id) n FROM SITE_VISITS'),visits:await count('SELECT COUNT(*) n FROM SITE_VISITS'),views:await count('SELECT COUNT(*) n FROM INVENTION_VIEWS')},users:recent.results||[]});
}
`;
source=source.replace(marker,marker+'\n'+route);
fs.writeFileSync(file,source);
if(!source.includes('__ADMIN_STATS_ROUTE_V2__'))throw new Error('Admin stats route v2 insertion failed.');
console.log('Admin stats route v2 forced into Worker entrypoint.');
