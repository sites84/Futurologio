#!/usr/bin/env python3
import base64
import difflib
import gzip
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "catalog.json"
REPORT = ROOT / "catalog-cleanup-report.json"

FIELDS = ["what", "realTech", "specTech", "inventedTech", "build", "uses", "dangers", "curiosity", "tests"]
MIN_LEN = {
    "what": 160,
    "realTech": 45,
    "specTech": 45,
    "inventedTech": 45,
    "build": 45,
    "uses": 30,
    "dangers": 40,
    "curiosity": 70,
    "tests": 70,
}

BAD_MARKERS = [
    "não informado no lote",
    "nao informado no lote",
    "TODO",
    "TBD",
]


def text(v):
    if isinstance(v, list):
        return " ".join(text(x) for x in v)
    if isinstance(v, dict):
        return " ".join(text(x) for x in v.values())
    return str(v or "").strip()


def norm(v):
    s = text(v).lower()
    s = re.sub(r"[-–—]+", " ", s)
    s = re.sub(r"[^\w\s]", " ", s, flags=re.UNICODE)
    s = re.sub(r"\s+", " ", s).strip()
    return s


def numeric_id(v):
    m = re.search(r"(?:^|[-_])(\d+)$", str(v or ""))
    return int(m.group(1)) if m else 10**9


def load_json_file(path):
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
        return data if isinstance(data, list) else []
    except Exception:
        return []


def decode_gzip_b64(path_or_text):
    try:
        raw = path_or_text
        if isinstance(path_or_text, Path):
            raw = path_or_text.read_text(encoding="utf-8")
        raw = re.sub(r"\s+", "", raw)
        data = base64.b64decode(raw)
        try:
            data = gzip.decompress(data)
        except OSError:
            pass
        parsed = json.loads(data.decode("utf-8"))
        return parsed if isinstance(parsed, list) else []
    except Exception:
        return []


def gather_sources():
    records = []
    source_files = []
    # Canonical catalog plus all JSON lot files.
    for p in sorted(ROOT.glob("catalog-*.json")):
        arr = load_json_file(p)
        if arr:
            records.extend(arr)
            source_files.append(str(p.relative_to(ROOT)))
    arr = load_json_file(ROOT / "catalog.json")
    if arr:
        records.extend(arr)
        source_files.append("catalog.json")

    # Files that are deliberately split/packed in the browser loader.
    groups = [
        [ROOT / f"catalog-vol1-{i:02d}.b64" for i in range(1, 7)],
        [ROOT / "catalog-lote2-01a.b64", ROOT / "catalog-lote2-01b.b64"],
    ]
    for i in range(2, 20):
        groups.append([ROOT / f"catalog-lote2-{i:02d}.b64"])
    for name in ("catalog-lote3.b64", "catalog-lote18.b64", "catalog-lote19.b64"):
        groups.append([ROOT / name])

    for group in groups:
        if not all(p.exists() for p in group):
            continue
        try:
            joined = "".join(p.read_text(encoding="utf-8") for p in group)
            arr = decode_gzip_b64(joined)
            if arr:
                records.extend(arr)
                source_files.extend(str(p.relative_to(ROOT)) for p in group)
        except Exception:
            pass
    return records, sorted(set(source_files))


def quality_reason(p):
    if not isinstance(p, dict):
        return "record-not-object"
    if not text(p.get("id")) or not text(p.get("name")) or not text(p.get("category")):
        return "missing-identity"
    for f in FIELDS:
        s = text(p.get(f))
        if len(s) < MIN_LEN[f]:
            return f"incomplete-{f}"
        n = norm(s)
        if any(marker in n for marker in BAD_MARKERS):
            return f"placeholder-{f}"
    # A frequent malformed pattern in broken generated records: a whole next section
    # was accidentally appended to a field and the actual following fields are empty.
    for f in FIELDS:
        s = text(p.get(f))
        if re.search(r"\b(?:como seria construído|usos recomendados|perigos e limitações|curiosidades|resultado dos testes)\s*:", s, re.I):
            return f"section-splice-{f}"
    return None


def clean_record(p):
    q = dict(p)
    for f in FIELDS:
        q[f] = text(q.get(f)).replace("------------------------------", "").strip()
    q["name"] = text(q.get("name"))
    q["category"] = text(q.get("category"))
    return q


def main():
    raw, sources = gather_sources()
    # Preserve first occurrence by numeric ID/name; all later duplicates are discarded.
    raw_count = len(raw)
    seen_ids = set()
    candidates = []
    rejected = []
    for p in raw:
        reason = quality_reason(p)
        if reason:
            rejected.append({"id": text(p.get("id")), "name": text(p.get("name")), "reason": reason})
            continue
        q = clean_record(p)
        sid = text(q.get("id"))
        if sid in seen_ids:
            continue
        seen_ids.add(sid)
        candidates.append(q)

    # Exact duplicate name / description: keep the earliest catalog item.
    kept = []
    seen_names = {}
    seen_what = {}
    duplicate_groups = []
    for p in sorted(candidates, key=lambda x: (numeric_id(x.get("id")), text(x.get("id")))):
        kn = norm(p.get("name"))
        kw = norm(p.get("what"))
        duplicate_of = None
        if kn and kn in seen_names:
            duplicate_of = seen_names[kn]
        elif kw and kw in seen_what:
            duplicate_of = seen_what[kw]
        if duplicate_of:
            duplicate_groups.append({"removed": text(p.get("id")), "kept": duplicate_of, "reason": "exact-duplicate-name-or-what"})
            rejected.append({"id": text(p.get("id")), "name": text(p.get("name")), "reason": "duplicate-name-or-what", "kept": duplicate_of})
            continue
        if kn:
            seen_names[kn] = text(p.get("id"))
        if kw:
            seen_what[kw] = text(p.get("id"))
        kept.append(p)

    # Catch obvious copied templates: a section value repeated verbatim across 3+ products.
    # Only remove a product when at least two substantial sections are identical to other
    # products; this avoids deleting legitimate products that happen to share one phrase.
    for f in FIELDS:
        freq = {}
        for p in kept:
            n = norm(p.get(f))
            if n and len(n) >= MIN_LEN[f]:
                freq[n] = freq.get(n, 0) + 1
        for p in kept:
            p.setdefault("_template_hits", 0)
            if norm(p.get(f)) in freq and freq[norm(p.get(f))] >= 3:
                p["_template_hits"] += 1

    final = []
    for p in kept:
        hits = p.pop("_template_hits", 0)
        if hits >= 2:
            rejected.append({"id": text(p.get("id")), "name": text(p.get("name")), "reason": "generic-repeated-template", "repeated_sections": hits})
        else:
            final.append(p)

    final.sort(key=lambda x: (numeric_id(x.get("id")), text(x.get("id"))))
    OUT.write_text(json.dumps(final, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    report = {
        "raw_records_seen": raw_count,
        "quality_valid_before_duplicates": len(candidates),
        "final_records": len(final),
        "removed_records": len(rejected),
        "source_files_seen": sources,
        "removed": rejected,
        "duplicate_groups": duplicate_groups,
        "id_range": [numeric_id(final[0]["id"]), numeric_id(final[-1]["id"])] if final else [],
    }
    REPORT.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({k: report[k] for k in ("raw_records_seen", "quality_valid_before_duplicates", "final_records", "removed_records")}, ensure_ascii=False))


if __name__ == "__main__":
    main()
