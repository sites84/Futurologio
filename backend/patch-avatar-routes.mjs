import fs from 'node:fs';
const file='backend/worker.js';
let s=fs.readFileSync(file,'utf8');
const marker='// FUTUROLOGIO_AVATAR_ROUTES_V1';
if(s.includes(marker)){console.log('Avatar routes already patched.');process.exit(0)}
s=s.replace("'access-control-allow-methods','GET,POST,OPTIONS'","'access-control-allow-methods','GET,POST,PUT,DELETE,OPTIONS'");
const block=`
${marker}
if(path==='/api/avatar'&&request.method==='GET'){
  const u=await auth(request,env); if(!u)return json({error:'Sessão necessária.'},401);
  const row=await env.DB.prepare('SELECT sex,config,created_at,updated_at FROM AVATAR_PROFILES WHERE user_id=?').bind(u.sub).first();
  if(!row)return json({ok:true,avatar:null});
  let config={}; try{config=JSON.parse(row.config||'{}')}catch{}
  return json({ok:true,avatar:{sex:row.sex,config,created_at:row.created_at,updated_at:row.updated_at}});
}
if(path==='/api/avatar'&&request.method==='PUT'){
  const u=await auth(request,env); if(!u)return json({error:'Sessão necessária.'},401);
  const b=await body(request),sex=String(b.sex||'').trim().toLowerCase();
  if(!['masculino','feminino'].includes(sex))return json({error:'Sexo do avatar inválido.'},400);
  const config=b.config;
  if(!config||typeof config!=='object'||Array.isArray(config))return json({error:'Configuração do avatar inválida.'},400);
  const clean={version:1,body:{},face:{},hair:{},style:{}};
  const copy=(src,dst,keys)=>{for(const k of keys){const n=Number(src?.[k]);if(Number.isFinite(n))dst[k]=Math.max(0,Math.min(1,n))}};
  copy(config.body,clean.body,['height','width','shoulders','muscle','leg','arm']);
  copy(config.face,clean.face,['head','jaw','eyes','nose','mouth']);
  if(typeof config.hair?.style==='string')clean.hair.style=config.hair.style.slice(0,40);
  if(typeof config.hair?.color==='string'&&/^#[0-9a-f]{6}$/i.test(config.hair.color))clean.hair.color=config.hair.color;
  if(typeof config.style?.skin==='string'&&/^#[0-9a-f]{6}$/i.test(config.style.skin))clean.style.skin=config.style.skin;
  const payload=JSON.stringify(clean);
  if(payload.length>12000)return json({error:'Configuração do avatar muito grande.'},413);
  await env.DB.prepare('INSERT INTO AVATAR_PROFILES(user_id,sex,config) VALUES(?,?,?) ON CONFLICT(user_id) DO UPDATE SET sex=excluded.sex,config=excluded.config,updated_at=CURRENT_TIMESTAMP').bind(u.sub,sex,payload).run();
  return json({ok:true,avatar:{sex,config:clean}});
}
`;
const needle="if(path==='/api/health')return json({ok:true,service:'FUTUROLOGIO™ social API',version:'1.5'});";
if(!s.includes(needle))throw new Error('Health route marker not found');
s=s.replace(needle,block+'\n'+needle);
fs.writeFileSync(file,s);console.log('Avatar routes patched.');
