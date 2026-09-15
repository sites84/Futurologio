import fs from 'node:fs';

const file='backend/worker.js';
let s=fs.readFileSync(file,'utf8');

if(!s.includes("url.searchParams.get('mode')==='top'")){
  const re=/const mode=url\.searchParams\.get\('mode'\)==='week'\?'week':'recent'/;
  if(!re.test(s))throw new Error('Explore mode marker not found in worker.js');
  s=s.replace(re,"const mode=url.searchParams.get('mode')==='week'?'week':url.searchParams.get('mode')==='top'?'top':'recent'");
}

if(!s.includes("mode==='top'?'likes DESC,i.created_at DESC'")){
  const re=/order=mode==='week'\?.{1,220}:'i\.created_at DESC'/;
  if(!re.test(s))throw new Error('Explore order marker not found in worker.js');
  s=s.replace(re,"order=mode==='week'?`${week} DESC,i.created_at DESC`:mode==='top'?'likes DESC,i.created_at DESC':'i.created_at DESC'");
}

fs.writeFileSync(file,s);
console.log('Global likes ranking patched: mode=top now orders all inventions by total likes.');
