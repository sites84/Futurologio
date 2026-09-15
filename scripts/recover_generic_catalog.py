#!/usr/bin/env python3
import base64, gzip, json, re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CATALOG = ROOT / 'catalog.json'
REPORT = ROOT / 'catalog-generic-recovery-report.json'
SQL = ROOT / 'backend' / 'catalog_generic_repair.sql'
GENERIC_MARKERS = [
    'Produto físico satírico criado para transformar uma situação cotidiana em uma invenção exagerada',
    'Sensores, mecanismo, controlador simples e alimentação segura.',
    'Sensores futuros e controle adaptativo, sempre em objeto físico.',
    'Protocolo fictício que transforma rotina banal em reação mecânica cômica.',
    'Carcaça resistente, módulos mecânicos, sensores protegidos e manutenção simples.',
    'Objeto de humor e demonstração para situações cotidianas.',
]
FIELDS = ['what','realTech','specTech','inventedTech','build','uses','dangers','curiosity','tests','readiness','year','patent']

def norm(v):
    return re.sub(r'\s+', ' ', str(v or '').strip()).casefold()

def is_generic(p):
    if not isinstance(p, dict): return False
    vals = [norm(p.get(k)) for k in FIELDS]
    return any(norm(m) in vals[0] for m in GENERIC_MARKERS) or (
        norm(p.get('realTech')) == norm(GENERIC_MARKERS[1]) and
        norm(p.get('specTech')) == norm(GENERIC_MARKERS[2]) and
        norm(p.get('inventedTech')) == norm(GENERIC_MARKERS[3])
    )

def score(p):
    return sum(len(str(p.get(k) or '')) for k in FIELDS) + len(str(p.get('name') or ''))

def decode_blob(raw):
    raw = re.sub(r'\s+', '', raw)
    try:
        data = base64.b64decode(raw)
        try: data = gzip.decompress(data)
        except OSError: pass
        obj = json.loads(data.decode('utf-8'))
        if isinstance(obj, dict): obj = [obj]
        return obj if isinstance(obj, list) else []
    except Exception:
        return []

def load_json(path):
    try:
        obj=json.loads(path.read_text(encoding='utf-8'))
        if isinstance(obj, dict): obj=[obj]
        return obj if isinstance(obj,list) else []
    except Exception:
        return []

def gather():
    records=[]
    for p in ROOT.glob('*.b64'):
        records.extend(decode_blob(p.read_text(encoding='utf-8')))
    groups=[]
    v1=[ROOT/f'catalog-vol1-{i:02d}.b64' for i in range(1,7)]
    if all(p.exists() for p in v1): groups.append(v1)
    for g in groups:
        records.extend(decode_blob(''.join(p.read_text(encoding='utf-8') for p in g)))
    for p in (ROOT/'frontend').glob('catalog-*.json'):
        records.extend(load_json(p))
    return records

def sql_quote(s):
    return str(s or '').replace("'", "''")

def main():
    catalog=load_json(CATALOG)
    generic=[p for p in catalog if is_generic(p)]
    sources=gather()
    by_name={}; by_id={}
    for p in sources:
        if not isinstance(p,dict): continue
        pid=norm(p.get('id'))
        if pid and (pid not in by_id or score(p)>score(by_id[pid])): by_id[pid]=p
        n=norm(p.get('name'))
        if n and (n not in by_name or score(p)>score(by_name[n])): by_name[n]=p
    recovered=[]; missing=[]
    for p in generic:
        pid=norm(p.get('id')); n=norm(p.get('name'))
        c=by_id.get(pid) or by_name.get(n)
        if c and not is_generic(c) and len(str(c.get('what') or ''))>120:
            q=dict(p)
            for f in FIELDS:
                if f in c and c.get(f) not in (None,''): q[f]=c.get(f)
            q['id']=p.get('id'); q['name']=c.get('name') or p.get('name'); q['category']=c.get('category') or p.get('category')
            recovered.append(q)
        else:
            missing.append({'id':p.get('id'),'name':p.get('name')})
    recovered_ids={p['id'] for p in recovered}
    final=[next((r for r in recovered if r['id']==p.get('id')),p) for p in catalog]
    CATALOG.write_text(json.dumps(final,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')

    repair_sources={}
    for p in sources:
        if not isinstance(p,dict): continue
        pid=norm(p.get('id'))
        if pid.startswith('produto-') and pid.rsplit('-',1)[1].isdigit() and 160 <= int(pid.rsplit('-',1)[1]) <= 175:
            if not is_generic(p) and len(str(p.get('what') or ''))>120:
                if pid not in repair_sources or score(p)>score(repair_sources[pid]): repair_sources[pid]=p
    for p in recovered: repair_sources[norm(p.get('id'))]=p

    stmts=[]
    generic_text='Produto físico satírico criado para transformar uma situação cotidiana em uma invenção exagerada'
    for p in repair_sources.values():
        data={'source_id':p.get('id'),'what':p.get('what',''),'realTech':p.get('realTech',''),'specTech':p.get('specTech',''),'inventedTech':p.get('inventedTech',''),'build':p.get('build',''),'uses':p.get('uses',''),'dangers':p.get('dangers',''),'test':p.get('test',p.get('tests','')),'curiosity':p.get('curiosity',''),'readiness':p.get('readiness',''),'year':p.get('year',''),'patent':p.get('patent','')}
        js=json.dumps(data,ensure_ascii=False,separators=(',',':'))
        sid=sql_quote(p.get('id')); name=sql_quote(p.get('name')); cat=sql_quote(p.get('category')); concept=sql_quote(p.get('what'))
        condition="(instr(COALESCE(json_extract(data,'$.what'),''),'%s')>0 OR instr(COALESCE(concept,''),'%s')>0)" % (sql_quote(generic_text),sql_quote(generic_text))
        stmts.append("UPDATE INVENTIONS SET name='%s', category='%s', concept='%s', data='%s' WHERE json_extract(data,'$.source_id')='%s' AND %s;" % (name,cat,concept,sql_quote(js),sid,condition))
    SQL.write_text('-- Generated by recover_generic_catalog.py\n'+'\n'.join(stmts)+'\n',encoding='utf-8')
    report={'catalog_records':len(catalog),'generic_detected':len(generic),'recovered':len(recovered),'recovered_ids':sorted(recovered_ids),'missing':missing,'source_records_scanned':len(sources),'repair_sql_statements':len(stmts),'repair_source_ids':sorted(repair_sources)}
    REPORT.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps(report,ensure_ascii=False))

if __name__=='__main__': main()
