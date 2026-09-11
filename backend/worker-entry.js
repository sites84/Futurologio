import app from './worker.js';

const IMPORT_KEY='F3-9f4f1e7b6d2c8a5e4b1d7c3f9a6e2b8d5c1f7a3e9d4b6c2f8a1e5d7c3b9f6';
const TOTAL_PARTS=16;
const json=(d,s=200)=>new Response(JSON.stringify(d),{status:s,headers:{'content-type':'application/json;charset=utf-8','access-control-allow-origin':'*','access-control-allow-headers':'content-type, authorization','access-control-allow-methods':'GET,POST,OPTIONS'}});

async function decodeCatalog(encoded){
  const bytes=Uint8Array.from(atob(encoded),c=>c.charCodeAt(0));
  const stream=new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
  return JSON.parse(await new Response(stream).text());
}

async function ensureTables(db){
  await db.batch([
    db.prepare('CREATE TABLE IF NOT EXISTS FUTUROLOGIO_CATALOG_LOTE3_IMPORT(part INTEGER PRIMARY KEY,data TEXT NOT NULL)'),
    db.prepare('CREATE TABLE IF NOT EXISTS FUTUROLOGIO_CATALOG_LOTE3(id TEXT PRIMARY KEY,name TEXT NOT NULL,payload TEXT NOT NULL)')
  ]);
}

async function importPart(request,env){
  const url=new URL(request.url);
  if(url.searchParams.get('key')!==IMPORT_KEY)return json({ok:false,error:'forbidden'},403);
  const part=Number(url.searchParams.get('part'));
  const data=String(url.searchParams.get('data')||'').replace(/\s+/g,'');
  if(!Number.isInteger(part)||part<1||part>TOTAL_PARTS||!data)return json({ok:false,error:'part/data inválido'},400);
  await ensureTables(env.DB);
  await env.DB.prepare('INSERT OR REPLACE INTO FUTUROLOGIO_CATALOG_LOTE3_IMPORT(part,data) VALUES(?,?)').bind(part,data).run();
  const count=Number((await env.DB.prepare('SELECT COUNT(*) n FROM FUTUROLOGIO_CATALOG_LOTE3_IMPORT').first())?.n||0);
  if(count<TOTAL_PARTS)return json({ok:true,stored:part,parts:count,total:TOTAL_PARTS});
  const rows=await env.DB.prepare('SELECT part,data FROM FUTUROLOGIO_CATALOG_LOTE3_IMPORT ORDER BY part').all();
  if((rows.results||[]).length!==TOTAL_PARTS)return json({ok:false,error:'chunks incompletos'},409);
  const encoded=rows.results.map(r=>r.data).join('');
  const items=await decodeCatalog(encoded);
  if(!Array.isArray(items)||items.length!==95)throw new Error('Biblioteca 3 inválida: '+(Array.isArray(items)?items.length:'não-array'));
  const ids=new Set(items.map(p=>String(p.id))),names=new Set(items.map(p=>String(p.name)));
  if(ids.size!==95||names.size!==95)throw new Error('Biblioteca 3 possui IDs/títulos duplicados');
  for(let i=0;i<items.length;i++){if(String(items[i].id)!==`lote3-${String(i+1).padStart(3,'0')}`)throw new Error('ID inválido em '+i);}
  const stmts=[env.DB.prepare('DELETE FROM FUTUROLOGIO_CATALOG_LOTE3')];
  for(const p of items)stmts.push(env.DB.prepare('INSERT INTO FUTUROLOGIO_CATALOG_LOTE3(id,name,payload) VALUES(?,?,?)').bind(String(p.id),String(p.name),JSON.stringify(p)));
  await env.DB.batch(stmts);
  return json({ok:true,ready:true,count:95});
}

async function getCatalog(env){
  await ensureTables(env.DB);
  const rows=await env.DB.prepare('SELECT payload FROM FUTUROLOGIO_CATALOG_LOTE3 ORDER BY id').all();
  const items=(rows.results||[]).map(r=>JSON.parse(r.payload));
  return json({ok:true,count:items.length,items});
}

export default {async fetch(request,env,ctx){
  if(request.method==='OPTIONS')return json({ok:true});
  const path=new URL(request.url).pathname;
  try{
    if(path==='/api/catalog-lote3-import'&&request.method==='GET')return await importPart(request,env);
    if(path==='/api/catalog-lote3'&&request.method==='GET')return await getCatalog(env);
    return app.fetch(request,env,ctx);
  }catch(e){return json({ok:false,error:String(e?.message||e)},500)}
}};
