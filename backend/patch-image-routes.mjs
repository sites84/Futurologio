import fs from 'node:fs';

const file='backend/worker.js';
let source=fs.readFileSync(file,'utf8');
const marker="if(path==='/api/invention-image'&&request.method==='POST')";
if(!source.includes(marker)) throw new Error('Image upload route marker not found');
const route="if(path.startsWith('/api/invention-image/')&&request.method==='DELETE'){const u=await auth(request,env);if(!u)return json({error:'Sessão necessária.'},401);if(!env.IMAGES)return json({error:'Armazenamento de imagens indisponível.'},503);const inventionId=Number(path.split('/').pop());if(!Number.isInteger(inventionId)||inventionId<1)return json({error:'Invenção inválida.'},400);const owner=await env.DB.prepare('SELECT i.id,i.image_key FROM INVENTIONS i JOIN INVENTION_OWNERS o ON o.invention_id=i.id WHERE i.id=? AND o.user_id=?').bind(inventionId,u.sub).first();if(!owner)return json({error:'Você só pode apagar a foto de uma invenção sua.'},403);if(owner.image_key)await env.IMAGES.delete(owner.image_key);await env.DB.prepare(\"UPDATE INVENTIONS SET image_key=NULL,image_content_type=NULL,image_source=NULL WHERE id=?\").bind(inventionId).run();return json({ok:true,invention_id:inventionId});}\n";
if(!source.includes("request.method==='DELETE'")) source=source.replace(marker,route+marker);
source=source.replace("'access-control-allow-methods':'GET,POST,OPTIONS'","'access-control-allow-methods':'GET,POST,DELETE,OPTIONS'");
const imageHeaders="headers.set('cache-control','public,max-age=31536000,immutable');";
if(source.includes(imageHeaders)&&!source.includes("headers.set('access-control-allow-origin','*')"))source=source.replace(imageHeaders,imageHeaders+"headers.set('access-control-allow-origin','*');");
fs.writeFileSync(file,source);
console.log('Image delete route and public image CORS patched into deployment copy.');
