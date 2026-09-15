import fs from 'node:fs';

const file='backend/worker.js';
let s=fs.readFileSync(file,'utf8');

const start=s.indexOf("if(path==='/api/auth/google'&&request.method==='POST')");
const end=s.indexOf("if(path==='/api/explore'&&request.method==='GET')",start);
if(start<0||end<0)throw new Error('Google route boundaries not found in worker.js');
let route=s.slice(start,end);

if(!route.includes('let newUser=false;')){
  const marker="let u=await env.DB.prepare('SELECT * FROM USERS WHERE google_id=?').bind(gid).first();if(!u&&email)u=await env.DB.prepare('SELECT * FROM USERS WHERE email=?').bind(email).first();";
  const replacement="let newUser=false;let u=await env.DB.prepare('SELECT * FROM USERS WHERE google_id=?').bind(gid).first();if(!u&&email)u=await env.DB.prepare('SELECT * FROM USERS WHERE email=?').bind(email).first();";
  if(!route.includes(marker))throw new Error('Google user marker not found in route');
  route=route.replace(marker,replacement);
}

if(!route.includes('if(!u){newUser=true;')){
  const marker="if(!u){let un=name.replace(/[^a-zA-Z0-9_]+/g,'').slice(0,20)||'criador',base=un,n=1;while(await env.DB.prepare('SELECT id FROM USERS WHERE username=?').bind(un).first())un=base+(n++);const idv=uid();await env.DB.prepare('INSERT INTO USERS(id,username,email,google_id,avatar,xp,level,plan,daily_creations,daily_creation_date,extra_credits) VALUES(?,?,?,?,?,?,?,?,?,?,?)').bind(idv,un,email,gid,g.picture||null,0,1,'free',0,today(),0).run();u=await user(env.DB,idv)}";
  const replacement=marker.replace("if(!u){","if(!u){newUser=true;");
  if(!route.includes(marker))throw new Error('Google creation block not found in route');
  route=route.replace(marker,replacement);
}

const responseMarker="return json({ok:true,token:await token(u.id,env),user:pub(u,await allowance(env.DB,u))})}";
const responseReplacement="return json({ok:true,new_user:newUser,token:await token(u.id,env),user:pub(u,await allowance(env.DB,u))})}";
if(route.includes(responseMarker))route=route.replace(responseMarker,responseReplacement);
else if(!route.includes('new_user:newUser'))throw new Error('Google response marker not found in route');

s=s.slice(0,start)+route+s.slice(end);
fs.writeFileSync(file,s);
console.log('Google authentication now reports whether the account was newly created.');
