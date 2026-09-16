#!/usr/bin/env python3
import base64, gzip, json, re, subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'catalog.json'
REPORT = ROOT / 'catalog-master-migration-report.json'
FIELDS = ['what','realTech','specTech','inventedTech','build','uses','dangers','curiosity','tests']
BASE_COMMIT = '5a7f2eb7718cf29436cc5361af25f134bfb2fcb9'

def text(v):
    if isinstance(v,list): return ' '.join(text(x) for x in v)
    if isinstance(v,dict): return ' '.join(text(x) for x in v.values())
    return str(v or '').strip()

def nid(v):
    m=re.search(r'(?:^|[-_])(\d+)$',text(v))
    return int(m.group(1)) if m else 10**9

def load_json(p):
    try:
        d=json.loads(p.read_text(encoding='utf-8'))
        if isinstance(d,list): return d
        if isinstance(d,dict) and d.get('id') and d.get('name'): return [d]
        return []
    except Exception: return []

def load_b64_text(raw):
    d=base64.b64decode(re.sub(r'\s+','',raw))
    try: d=gzip.decompress(d)
    except OSError: pass
    x=json.loads(d.decode('utf-8'))
    if isinstance(x,list): return x
    if isinstance(x,dict) and x.get('id') and x.get('name'): return [x]
    return []

def historical_base():
    try:
        raw=subprocess.check_output(['git','show',f'{BASE_COMMIT}:catalog.json'],cwd=ROOT,text=True)
        d=json.loads(raw)
        return d if isinstance(d,list) else []
    except Exception: return []

def gather_new():
    records=[]; sources=[]
    for p in sorted(set((ROOT/'frontend').glob('catalog-*.json'))):
        a=load_json(p)
        if a: records += a; sources.append(str(p.relative_to(ROOT)))
    groups=[[ROOT/f'catalog-vol1-{i:02d}.b64' for i in range(1,7)], [ROOT/'catalog-lote2-01a.b64',ROOT/'catalog-lote2-01b.b64']]
    groups += [[ROOT/f'catalog-lote2-{i:02d}.b64'] for i in range(2,20)]
    groups += [[ROOT/x] for x in ('catalog-lote3.b64','catalog-lote18.b64','catalog-lote19.b64')]
    groups += [[ROOT/'frontend/catalog-migration-156-159.b64']]
    groups += [[ROOT/'catalog-canonical-160-175.b64']]
    for g in groups:
        if not all(p.exists() for p in g): continue
        try:
            a=load_b64_text(''.join(p.read_text(encoding='utf-8') for p in g))
            if a: records += a; sources += [str(p.relative_to(ROOT)) for p in g]
        except Exception: pass
    return records,sorted(set(sources))

def score(p):
    return sum(len(text(p.get(f))) for f in FIELDS)+len(text(p.get('name')))+len(text(p.get('category')))

def selectable_id(sid):
    n=nid(sid)
    return (
        156 <= n <= 201
        or sid.startswith('lote4-')
        or (sid.startswith('produto-') and n >= 202)
        or sid.startswith('futurologio-')
    )

def main():
    base=historical_base(); new_records,sources=gather_new(); by_id={}
    for p in base:
        if isinstance(p,dict) and text(p.get('id')): by_id[text(p.get('id'))]=p
    candidates={}
    for p in new_records:
        if not isinstance(p,dict) or not text(p.get('id')) or not text(p.get('name')): continue
        sid=text(p.get('id'))
        if selectable_id(sid):
            if sid not in candidates or score(p)>score(candidates[sid]): candidates[sid]=p
    for sid,p in candidates.items(): by_id[sid]=p
    final=[]
    for p in sorted(by_id.values(),key=lambda x:(nid(x.get('id')),text(x.get('id')))):
        q=dict(p)
        for f in FIELDS: q[f]=text(q.get(f)).replace('------------------------------','').strip()
        q['name']=text(q.get('name')); q['category']=text(q.get('category'))
        final.append(q)
    OUT.write_text(json.dumps(final,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    ids=[str(x.get('id')) for x in final]
    new_ids=sorted(i for i in [nid(x.get('id')) for x in final] if 156<=i<=201)
    lote4_ids=sorted(x for x in ids if x.startswith('lote4-'))
    report={'base_records':len(base),'new_records_seen':len(new_records),'new_records_selected':len(candidates),'final_records':len(final),'new_id_range':[min(new_ids),max(new_ids)] if new_ids else [],'missing_new_ids':[i for i in range(156,202) if i not in set(new_ids)],'lote4_ids':lote4_ids,'source_files_seen':sources,'required_new_ids':['produto-202','futurologio-004','futurologio-006','futurologio-007','futurologio-008','futurologio-009','futurologio-010'],'missing_required_new_ids':[x for x in ['produto-202','futurologio-004','futurologio-006','futurologio-007','futurologio-008','futurologio-009','futurologio-010'] if x not in ids]}
    REPORT.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps(report,ensure_ascii=False))

if __name__=='__main__': main()
