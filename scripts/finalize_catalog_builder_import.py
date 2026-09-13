#!/usr/bin/env python3
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'catalog.json'
IMPORT = ROOT / 'frontend/catalog-builder-import-193-196.json'
REPORT = ROOT / 'catalog-master-migration-report.json'

def main():
    catalog = json.loads(OUT.read_text(encoding='utf-8'))
    incoming = json.loads(IMPORT.read_text(encoding='utf-8'))
    by_id = {str(p.get('id')): p for p in catalog if isinstance(p, dict) and p.get('id')}
    for p in incoming:
        pid = str(p.get('id'))
        if pid in {'produto-193', 'produto-194', 'produto-195', 'produto-196'}:
            by_id[pid] = p
    # Keep the established canonical records for 188-190.
    for p in catalog:
        pid = str(p.get('id'))
        if pid in {'produto-188', 'produto-189', 'produto-190'}:
            by_id[pid] = p
    def key(p):
        pid = str(p.get('id',''))
        try: n = int(pid.rsplit('-', 1)[1])
        except Exception: n = 10**9
        return (n, pid)
    final = sorted(by_id.values(), key=key)
    OUT.write_text(json.dumps(final, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    report = json.loads(REPORT.read_text(encoding='utf-8')) if REPORT.exists() else {}
    report.update({'final_records': len(final), 'new_id_range': [156, 196], 'missing_new_ids': [i for i in range(156,197) if f'produto-{i}' not in by_id]})
    REPORT.write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(json.dumps({'final_records': len(final), 'missing_new_ids': report['missing_new_ids']}))

if __name__ == '__main__': main()
