import fs from 'node:fs';

const file='backend/worker.js';
let s=fs.readFileSync(file,'utf8');

const old="async function auth(r,env){const h=r.headers.get('authorization')||'';if(!h.startsWith('Bearer '))return null;const [b,s]=h.slice(7).split('.');if(!b||!s||s!==await sign(b,env.SESSION_SECRET))return null;try{return JSON.parse(atob(b))}catch{return null}}";
const fresh="function b64json(v){const x=String(v||'').replace(/-/g,'+').replace(/_/g,'/');return atob(x+'='.repeat((4-x.length%4)%4))}\nasync function auth(r,env){const h=String(r.headers.get('authorization')||'').trim();if(!/^Bearer\\s+/i.test(h))return null;const raw=h.replace(/^Bearer\\s+/i,'').trim(),parts=raw.split('.');if(parts.length!==2)return null;const b=parts[0],sig=parts[1];if(!b||!sig)return null;try{if(sig!==await sign(b,env.SESSION_SECRET))return null;return JSON.parse(b64json(b))}catch{return null}}";
if(s.includes(old))s=s.replace(old,fresh);
else if(!s.includes('function b64json(v)'))throw new Error('Expected auth function not found');

fs.writeFileSync(file,s);
console.log('Robust Authorization/Bearer and base64url session parsing patched.');
