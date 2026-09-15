import fs from 'node:fs';

const file='backend/worker.js';
let s=fs.readFileSync(file,'utf8');

if(!s.includes("mode==='top'")){
  const re=/const mode=[\s\S]*?;const rows=await env\.DB\.prepare/;
  if(!re.test(s))throw new Error('Explore declaration marker not found in worker.js');
  const replacement="const mode=url.searchParams.get('mode')==='week'?'week':url.searchParams.get('mode')==='top'?'top':'recent',userFilter=url.searchParams.get('user')||'',limit=Math.min(24,Math.max(1,Number(url.searchParams.get('limit')||12))),week=\"(SELECT COUNT(*) FROM LIKES wl WHERE wl.invention_id=i.id AND wl.created_at>=datetime('now','-6 days'))\",where=(userFilter?`WHERE o.user_id='${userFilter.replaceAll(\"'\",\"''\")}'`:'')+(mode==='week'?(userFilter?' AND ':'WHERE ')+`${week}>0`:''),order=mode==='week'?`${week} DESC,i.created_at DESC`:mode==='top'?'likes DESC,i.created_at DESC':'i.created_at DESC';const rows=await env.DB.prepare";
  s=s.replace(re,replacement);
}

fs.writeFileSync(file,s);
console.log('Global likes ranking patched: mode=top now orders all inventions by total likes.');
