import fs from 'node:fs';
const file='backend/worker.js';
let s=fs.readFileSync(file,'utf8');
if(s.includes("path.startsWith('/api/comments/')&&request.method==='DELETE'")){console.log('Comment routes already present.');process.exit(0)}
const marker="if(path==='/api/health')return json({ok:true,service:'FUTUROLOGIO™ social API',version:'1.5'});";
if(!s.includes(marker))throw new Error('Health route marker not found');
const routes=`
if(path.startsWith('/api/inventions/')&&path.endsWith('/comments')&&request.method==='GET'){const inventionId=Number(path.split('/')[3]);if(!Number.isInteger(inventionId)||inventionId<1)return json({ok:false,error:'Invenção inválida.'},400);const rows=await env.DB.prepare("SELECT c.id,c.user_id,c.invention_id,c.text,c.created_at,c.parent_id,u.username,u.avatar FROM COMMENTS c JOIN USERS u ON u.id=c.user_id WHERE c.invention_id=? ORDER BY c.created_at ASC,c.id ASC").bind(inventionId).all();return json({ok:true,comments:rows.results||[]})}
if(path.startsWith('/api/comments/')&&path.endsWith('/reply')&&request.method==='POST'){const au=await auth(request,env);if(!au)return json({ok:false,error:'Sessão necessária.'},401);const parentId=Number(path.split('/')[3]);if(!Number.isInteger(parentId)||parentId<1)return json({ok:false,error:'Comentário inválido.'},400);const parent=await env.DB.prepare('SELECT id,invention_id FROM COMMENTS WHERE id=?').bind(parentId).first();if(!parent)return json({ok:false,error:'Comentário não encontrado.'},404);const b=await body(request),text=String(b.text||'').trim().slice(0,500);if(!text)return json({ok:false,error:'Escreva uma resposta.'},400);await env.DB.prepare('INSERT INTO COMMENTS(user_id,invention_id,text,parent_id) VALUES(?,?,?,?)').bind(au.sub,parent.invention_id,text,parent.id).run();const u=await user(env.DB,au.sub);if(u)try{await awardBadges(env.DB,u.id)}catch{}return json({ok:true})}
if(path.startsWith('/api/comments/')&&request.method==='DELETE'){const au=await auth(request,env);if(!au)return json({ok:false,error:'Sessão necessária.'},401);const commentId=Number(path.split('/')[3]);if(!Number.isInteger(commentId)||commentId<1)return json({ok:false,error:'Comentário inválido.'},400);const c=await env.DB.prepare('SELECT id,user_id FROM COMMENTS WHERE id=?').bind(commentId).first();if(!c)return json({ok:false,error:'Comentário não encontrado.'},404);if(String(c.user_id)!==String(au.sub))return json({ok:false,error:'Você só pode apagar o seu próprio comentário.'},403);await env.DB.prepare('DELETE FROM COMMENTS WHERE id=? OR parent_id=?').bind(commentId,commentId).run();return json({ok:true})}
`;
s=s.replace(marker,marker+routes);
fs.writeFileSync(file,s);
console.log('Comment listing, reply and owner-only delete routes patched.');
