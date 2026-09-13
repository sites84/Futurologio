#!/usr/bin/env python3
import base64, gzip, json, re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'catalog.json'
REPORT = ROOT / 'catalog-master-migration-report.json'
FIELDS = ['what','realTech','specTech','inventedTech','build','uses','dangers','curiosity','tests']
MIN = {'what':160,'realTech':45,'specTech':45,'inventedTech':45,'build':45,'uses':30,'dangers':40,'curiosity':70,'tests':70}
BAD = ('nao informado no lote','todo','tbd')

def text(v):
    if isinstance(v,list): return ' '.join(text(x) for x in v)
    if isinstance(v,dict): return ' '.join(text(x) for x in v.values())
    return str(v or '').strip()

def norm(v):
    return re.sub(r'\s+',' ',re.sub(r'[^\w\s]',' ',text(v).lower())).strip()

def nid(v):
    m=re.search(r'(?:^|[-_])(\d+)$',text(v))
    return int(m.group(1)) if m else 10**9

def valid(p):
    if not isinstance(p,dict) or not text(p.get('id')) or not text(p.get('name')) or not text(p.get('category')): return False
    for f in FIELDS:
        s=text(p.get(f))
        if len(s)<MIN[f] or any(x in norm(s) for x in BAD): return False
    return True

def load_json(p):
    try:
        d=json.loads(p.read_text(encoding='utf-8'))
        return d if isinstance(d,list) else []
    except Exception: return []

def load_b64_text(raw):
    d=base64.b64decode(re.sub(r'\s+','',raw))
    try: d=gzip.decompress(d)
    except OSError: pass
    x=json.loads(d.decode('utf-8'))
    return x if isinstance(x,list) else []

def gather():
    records=[]; sources=[]
    paths=list(ROOT.glob('catalog-*.json'))+list((ROOT/'frontend').glob('catalog-*.json'))
    for p in sorted(set(paths)):
        a=load_json(p)
        if a: records += a; sources.append(str(p.relative_to(ROOT)))
    a=load_json(ROOT/'catalog.json')
    if a: records += a; sources.append('catalog.json')
    groups=[[ROOT/f'catalog-vol1-{i:02d}.b64' for i in range(1,7)], [ROOT/'catalog-lote2-01a.b64',ROOT/'catalog-lote2-01b.b64']]
    groups += [[ROOT/f'catalog-lote2-{i:02d}.b64'] for i in range(2,20)]
    groups += [[ROOT/x] for x in ('catalog-lote3.b64','catalog-lote18.b64','catalog-lote19.b64')]
    for g in groups:
        if not all(p.exists() for p in g): continue
        try:
            a=load_b64_text(''.join(p.read_text(encoding='utf-8') for p in g))
            if a: records += a; sources += [str(p.relative_to(ROOT)) for p in g]
        except Exception: pass
    return records,sorted(set(sources))

def main():
    raw,sources=gather(); rejected=[]; by_id={}
    for p in raw:
        if not valid(p):
            rejected.append({'id':text(p.get('id')) if isinstance(p,dict) else '', 'name':text(p.get('name')) if isinstance(p,dict) else '', 'reason':'quality'})
            continue
        q=dict(p)
        for f in FIELDS: q[f]=text(q.get(f)).replace('------------------------------','').strip()
        q['name']=text(q.get('name')); q['category']=text(q.get('category'))
        sid=text(q.get('id'))
        if sid not in by_id: by_id[sid]=q
        elif len(text(q.get('what')))+len(text(q.get('inventedTech'))) > len(text(by_id[sid].get('what')))+len(text(by_id[sid].get('inventedTech'))): by_id[sid]=q
    final=[]; names=set(); whats=set()
    for p in sorted(by_id.values(),key=lambda x:(nid(x.get('id')),text(x.get('id')))):
        n=norm(p.get('name')); w=norm(p.get('what'))
        if n in names or w in whats:
            rejected.append({'id':text(p.get('id')),'name':text(p.get('name')),'reason':'duplicate-name-or-what'}); continue
        names.add(n); whats.add(w); final.append(p)
    OUT.write_text(json.dumps(final,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    report={'raw_records_seen':len(raw),'final_records':len(final),'removed_records':len(rejected),'source_files_seen':sources,'id_range':[nid(final[0]['id']),nid(final[-1]['id'])] if final else []}
    REPORT.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps(report,ensure_ascii=False))

if __name__=='__main__': main()
