import fs from 'node:fs';

const file='backend/worker.js';
let s=fs.readFileSync(file,'utf8');

const exploreNeedle="(SELECT COUNT(*) FROM COMMENTS c WHERE c.invention_id=i.id) comments,${week} week_likes";
if(s.includes(exploreNeedle) && !s.includes('invention_views')){
  s=s.replace(exploreNeedle,"(SELECT COUNT(*) FROM COMMENTS c WHERE c.invention_id=i.id) comments,(SELECT COUNT(*) FROM INVENTION_VIEWS v WHERE v.invention_id=i.id) views,${week} week_likes");
}

const marker="const dm=path.match(/^\\/api\\/inventions\\/(\\d+)$/);";
if(!s.includes("path.match(/^\\/api\\/inventions\\/(\\d+)\\/view$/)")){
  const route=`if(path.match(/^\\/api\\/inventions\\/(\\d+)\\/view$/)&&request.method==='POST'){const m=path.match(/^\\/api\\/inventions\\/(\\d+)\\/view$/),iid=Number(m[1]);if(!Number.isInteger(iid)||iid<1)return json({ok:false,error:'Invenção inválida'},400);if(!(await env.DB.prepare('SELECT id FROM INVENTIONS WHERE id=?').bind(iid).first()))return json({ok:false,error:'Invenção não encontrada'},404);const b=await body(request),visitor=String(b.visitor_id||'').trim().slice(0,120)||'anonymous';const recent=await env.DB.prepare(\"SELECT id FROM INVENTION_VIEWS WHERE invention_id=? AND visitor_id=? AND created_at>=datetime('now','-30 minutes') LIMIT 1\").bind(iid,visitor).first();if(!recent)await env.DB.prepare('INSERT INTO INVENTION_VIEWS(invention_id,visitor_id) VALUES(?,?)').bind(iid,visitor).run();const n=await env.DB.prepare('SELECT COUNT(*) n FROM INVENTION_VIEWS WHERE invention_id=?').bind(iid).first();return json({ok:true,viewed:!recent,views:Number(n?.n||0)})}\n`;
  s=s.replace(marker,route+marker);
}

if(!s.includes("const views=await env.DB.prepare('SELECT COUNT(*) n FROM INVENTION_VIEWS WHERE invention_id=?')")){
  const old="const likes=await env.DB.prepare('SELECT COUNT(*) n FROM LIKES WHERE invention_id=?').bind(inv.id).first();const comments=";
  const neu="const likes=await env.DB.prepare('SELECT COUNT(*) n FROM LIKES WHERE invention_id=?').bind(inv.id).first();const views=await env.DB.prepare('SELECT COUNT(*) n FROM INVENTION_VIEWS WHERE invention_id=?').bind(inv.id).first();const comments=";
  s=s.replace(old,neu).replace("return json({ok:true,invention:inv,likes:Number(likes?.n||0),comments:comments.results||[]})","return json({ok:true,invention:inv,likes:Number(likes?.n||0),views:Number(views?.n||0),comments:comments.results||[]})");
}

fs.writeFileSync(file,s);
console.log('Views patch applied.');
