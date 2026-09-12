import fs from 'node:fs';

const file='backend/worker.js';
let s=fs.readFileSync(file,'utf8');

const xpGate="if((type==='like'||type==='share')&&refType&&refId){";
if(s.includes(xpGate) && !s.includes("if((type==='like'||type==='share'||type==='upload')&&refType&&refId)")){
  s=s.replace(xpGate,"if((type==='like'||type==='share'||type==='upload')&&refType&&refId){");
}

const ownerMarker="if(path==='/api/public-profile'&&request.method==='GET')";
if(!s.includes("path==='/api/public-invention'&&request.method==='GET'")){
  const route=`if(path==='/api/public-invention'&&request.method==='GET'){const id=String(url.searchParams.get('id')||'').trim();if(!id)return json({ok:false,error:'Invenção não informada'},400);const row=await env.DB.prepare('SELECT i.id,o.user_id,u.username,u.avatar FROM INVENTIONS i JOIN INVENTION_OWNERS o ON o.invention_id=i.id JOIN USERS u ON u.id=o.user_id WHERE i.id=? ORDER BY o.created_at ASC LIMIT 1').bind(id).first();if(!row)return json({ok:false,error:'Invenção não encontrada'},404);return json({ok:true,invention:{id:row.id,creator_id:row.user_id,username:row.username,avatar:row.avatar}})}\n`;
  if(!s.includes(ownerMarker))throw new Error('Public profile route marker not found');
  s=s.replace(ownerMarker,route+ownerMarker);
}

const publicMarker="if(path==='/api/profile'&&request.method==='GET')";
if(!s.includes("path==='/api/public-profile'&&request.method==='GET'")){
  const route=`if(path==='/api/public-profile'&&request.method==='GET'){const id=String(url.searchParams.get('user')||'').trim();if(!id)return json({ok:false,error:'Usuário não informado'},400);const u=await user(env.DB,id);if(!u)return json({ok:false,error:'Usuário não encontrado'},404);const q=async sql=>Number((await env.DB.prepare(sql).bind(u.id).first())?.n||0);const badges=await env.DB.prepare('SELECT b.code,b.name,b.description,ub.earned_at FROM USER_BADGES ub JOIN BADGES b ON b.id=ub.badge_id WHERE ub.user_id=? ORDER BY ub.earned_at DESC').bind(u.id).all();const rows=await env.DB.prepare(\`SELECT i.id,i.name,i.category,i.data,i.image_key,(SELECT COUNT(*) FROM LIKES l WHERE l.invention_id=i.id) likes,(SELECT COUNT(*) FROM COMMENTS c WHERE c.invention_id=i.id) comments FROM INVENTIONS i JOIN INVENTION_OWNERS o ON o.invention_id=i.id WHERE o.user_id=? ORDER BY i.id DESC LIMIT 24\`).bind(u.id).all();const items=(rows.results||[]).map(r=>{let d={};try{d=JSON.parse(r.data||'{}')}catch{};return {...r,source_id:d.source_id||null,image_url:r.image_key?\`\${url.origin}/api/invention-image/\${r.id}\`:null}});return json({ok:true,profile:{id:u.id,username:u.username,avatar:u.avatar,...roleData(Number(u.xp||0)),creations:await q('SELECT COUNT(*) n FROM USER_INVENTIONS WHERE user_id=?'),uploads:await q(\"SELECT COUNT(*) n FROM XP_EVENTS WHERE user_id=? AND event_type='upload'\"),likesReceived:await q('SELECT COUNT(*) n FROM LIKES l JOIN USER_INVENTIONS ui ON ui.invention_id=l.invention_id WHERE ui.user_id=?'),comments:await q('SELECT COUNT(*) n FROM COMMENTS WHERE user_id=?'),shares:await q('SELECT COUNT(*) n FROM SHARES WHERE user_id=?'),badges:badges.results||[]},items})}\n`;
  if(!s.includes(publicMarker))throw new Error('Profile route marker not found');
  s=s.replace(publicMarker,route+publicMarker);
}

const exploreMarker="if(path==='/api/explore'&&request.method==='GET')";
if(!s.includes("path==='/api/leaderboard'&&request.method==='GET'")){
  const route=`if(path==='/api/leaderboard'&&request.method==='GET'){const limit=Math.min(5,Math.max(1,Number(url.searchParams.get('limit')||5)));const rows=await env.DB.prepare(\`SELECT u.id,u.username,u.avatar,u.xp,(SELECT COUNT(*) FROM USER_INVENTIONS ui WHERE ui.user_id=u.id) creations,(SELECT COUNT(*) FROM LIKES l JOIN USER_INVENTIONS ui ON ui.invention_id=l.invention_id WHERE ui.user_id=u.id) likes_received FROM USERS u ORDER BY creations DESC,u.xp DESC,u.created_at ASC LIMIT ?\`).bind(limit).all();return json({ok:true,items:(rows.results||[]).map(r=>({...r,...roleData(Number(r.xp||0))}))})}\n`;
  if(!s.includes(exploreMarker))throw new Error('Explore route marker not found');
  s=s.replace(exploreMarker,route+exploreMarker);
}

const oldMode="const mode=url.searchParams.get('mode')==='week'?'week':'recent',userFilter=url.searchParams.get('user')||''";
if(s.includes(oldMode) && !s.includes("requestedMode=url.searchParams.get('mode')||'recent'")){
  s=s.replace(oldMode,"const requestedMode=url.searchParams.get('mode')||'recent',mode=requestedMode==='week'?'week':requestedMode==='top'?'top':'recent',userFilter=url.searchParams.get('user')||''");
  s=s.replace("order=mode==='week'?`${week} DESC,i.created_at DESC`:'i.id DESC';","order=mode==='week'?`${week} DESC,i.created_at DESC`:mode==='top'?'likes DESC,i.id DESC':'i.id DESC';");
}

fs.writeFileSync(file,s);
console.log('Social ownership/profile/leaderboard/XP upgrades patched into deployment copy.');
