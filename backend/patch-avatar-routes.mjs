import fs from 'node:fs';
const file='backend/worker.js';
let s=fs.readFileSync(file,'utf8');
s=s.replace("'access-control-allow-methods','GET,POST,OPTIONS'","'access-control-allow-methods','GET,POST,PUT,DELETE,OPTIONS'");
const avatarMarker='// FUTUROLOGIO_AVATAR_ROUTES_V1';
if(!s.includes(avatarMarker)){
const block=`
${avatarMarker}
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
}
const profileMarker='// FUTUROLOGIO_PROFILE_SETTINGS_V1';
if(!s.includes(profileMarker)){
const block=`
${profileMarker}
if(path==='/api/profile-settings'&&request.method==='GET'){
  if(!session)return json({ok:false,error:'Não autenticado'},401);
  const u=await user(env.DB,session.sub); if(!u)return json({ok:false,error:'Usuário não encontrado'},404);
  return json({ok:true,profile:{id:u.id,username:u.username,email:u.email,sex:u.sex||'',age:u.age==null?'':Number(u.age),address:u.address||'',bio:u.bio||'',avatar:u.avatar||'',profile_photo_url:u.profile_photo_key?url.origin+'/api/profile-image/'+encodeURIComponent(u.id):null}});
}
if(path==='/api/profile-settings'&&request.method==='POST'){
  if(!session)return json({ok:false,error:'Não autenticado'},401);
  const u=await user(env.DB,session.sub); if(!u)return json({ok:false,error:'Usuário não encontrado'},404);
  const b=await body(request),username=String(b.username??u.username).trim(),sex=String(b.sex??u.sex??'').trim(),ageRaw=b.age===null||b.age===undefined||b.age===''?'':Number(b.age),address=String(b.address??u.address??'').trim(),bio=String(b.bio??u.bio??'').trim();
  if(!/^[a-zA-Z0-9_]{3,40}$/.test(username))return json({ok:false,error:'Nome de usuário inválido. Use 3 a 40 caracteres: letras, números ou _.'},400);
  if(ageRaw!==''&&(!Number.isInteger(ageRaw)||ageRaw<13||ageRaw>120))return json({ok:false,error:'Idade inválida. Informe uma idade entre 13 e 120 anos.'},400);
  if(sex&&!['masculino','feminino','outro','nao_informar'].includes(sex))return json({ok:false,error:'Opção de sexo inválida.'},400);
  if(address.length>300)return json({ok:false,error:'Endereço muito longo.'},400); if(bio.length>300)return json({ok:false,error:'Biografia muito longa.'},400);
  const clash=await env.DB.prepare('SELECT id FROM USERS WHERE username=? AND id<>?').bind(username,u.id).first(); if(clash)return json({ok:false,error:'Nome de usuário já está em uso.'},409);
  await env.DB.prepare('UPDATE USERS SET username=?,sex=?,age=?,address=?,bio=?,updated_at=CURRENT_TIMESTAMP WHERE id=?').bind(username,sex,ageRaw===''?null:ageRaw,address,bio,u.id).run();
  const v=await user(env.DB,u.id); return json({ok:true,user:pub(v,await allowance(env.DB,v)),profile:{id:v.id,username:v.username,email:v.email,sex:v.sex||'',age:v.age==null?'':Number(v.age),address:v.address||'',bio:v.bio||'',avatar:v.avatar||'',profile_photo_url:v.profile_photo_key?url.origin+'/api/profile-image/'+encodeURIComponent(v.id):null}});
}
if(path==='/api/profile-image'&&request.method==='POST'){
  if(!session)return json({ok:false,error:'Não autenticado'},401); if(!env.IMAGES)return json({ok:false,error:'Armazenamento de imagens indisponível.'},503);
  const form=await request.formData(),file=form.get('image'); if(!file||typeof file.arrayBuffer!=='function')return json({ok:false,error:'Imagem inválida.'},400);
  const type=String(file.type||'').toLowerCase(); if(!['image/jpeg','image/png','image/webp','image/gif'].includes(type))return json({ok:false,error:'Use JPG, PNG, WebP ou GIF.'},400); if(file.size>5*1024*1024)return json({ok:false,error:'A foto de perfil deve ter no máximo 5 MB.'},413);
  const u=await user(env.DB,session.sub); if(!u)return json({ok:false,error:'Usuário não encontrado'},404); const ext=({'image/jpeg':'jpg','image/png':'png','image/webp':'webp','image/gif':'gif'})[type]; const key='profiles/'+u.id+'/'+crypto.randomUUID()+'.'+ext;
  await env.IMAGES.put(key,file,{httpMetadata:{contentType:type,cacheControl:'public,max-age=31536000,immutable'}}); if(u.profile_photo_key)await env.IMAGES.delete(u.profile_photo_key); await env.DB.prepare('UPDATE USERS SET profile_photo_key=?,profile_photo_content_type=?,updated_at=CURRENT_TIMESTAMP WHERE id=?').bind(key,type,u.id).run();
  return json({ok:true,profile_photo_url:url.origin+'/api/profile-image/'+encodeURIComponent(u.id)});
}
if(path==='/api/profile-image/delete'&&request.method==='POST'){
  if(!session)return json({ok:false,error:'Não autenticado'},401); const u=await user(env.DB,session.sub); if(!u)return json({ok:false,error:'Usuário não encontrado'},404); if(u.profile_photo_key&&env.IMAGES)await env.IMAGES.delete(u.profile_photo_key); await env.DB.prepare('UPDATE USERS SET profile_photo_key=NULL,profile_photo_content_type=NULL,updated_at=CURRENT_TIMESTAMP WHERE id=?').bind(u.id).run(); return json({ok:true});
}
if(path.startsWith('/api/profile-image/')&&request.method==='GET'){
  if(!env.IMAGES)return new Response('Not configured',{status:503}); const id=decodeURIComponent(path.split('/').pop()||''); const u=await env.DB.prepare('SELECT profile_photo_key FROM USERS WHERE id=?').bind(id).first(); if(!u?.profile_photo_key)return new Response('Not found',{status:404}); const object=await env.IMAGES.get(u.profile_photo_key); if(!object)return new Response('Not found',{status:404}); const headers=new Headers(); object.writeHttpMetadata(headers); headers.set('cache-control','public,max-age=31536000,immutable'); headers.set('access-control-allow-origin','*'); return new Response(object.body,{headers});
}
`;
const marker='const session=await auth(request,env);'; const at=s.indexOf(marker); if(at<0)throw new Error('Session marker not found'); const insertAt=at+marker.length; s=s.slice(0,insertAt)+block+s.slice(insertAt);
}
fs.writeFileSync(file,s); console.log('Avatar/profile routes patched.');
