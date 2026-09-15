import fs from 'node:fs';

const file='backend/worker.js';
let s=fs.readFileSync(file,'utf8');

const old="const mode=url.searchParams.get('mode')==='week'?'week':'recent'";
const fresh="const mode=url.searchParams.get('mode')==='week'?'week':url.searchParams.get('mode')==='top'?'top':'recent'";
if(s.includes(old)) s=s.replace(old,fresh);
else if(!s.includes("url.searchParams.get('mode')==='top'")) throw new Error('Explore mode marker not found in worker.js');

const oldOrder="order=mode==='week'?`${week} DESC,i.created_at DESC`:'i.created_at DESC'";
const freshOrder="order=mode==='week'?`${week} DESC,i.created_at DESC`:mode==='top'?'likes DESC,i.created_at DESC':'i.created_at DESC'";
if(s.includes(oldOrder)) s=s.replace(oldOrder,freshOrder);
else if(!s.includes("mode==='top'?'likes DESC,i.created_at DESC'")) throw new Error('Explore order marker not found in worker.js');

fs.writeFileSync(file,s);
console.log('Global likes ranking patched: mode=top now orders all inventions by total likes.');
