#!/usr/bin/env python3
# manifest — parallel folds, merged. When a model is folded shard-split across N
# instances, each produces a part artifact (its own CID over its trit stream).
# build_manifest ties them into ONE content-addressed object: a root CID = hash
# over the ordered list of part (cid, bytes, shard range) — a Merkle-style root,
# the same DAG shape IPFS uses. No need to re-hash the (multi-TB) trit payload.
# unfold_manifest reconstructs the whole model: verify each part's CID, unfold it,
# union the tensors (shards partition tensors, so parts never overlap).
import sys, os, json, hashlib, glob

def _cid(b): return "bafkrei" + hashlib.sha256(hashlib.sha256(b).digest()).hexdigest()[:52]

def build_manifest(model, K, parts):
    """parts: list of {result: <result.json dict>, prefix: <gcs/dir prefix>} — one per instance.
    Returns the manifest dict with a deterministic root_cid."""
    ps = sorted(parts, key=lambda p: p["result"].get("shard_lo", 0))
    entries = []
    for p in ps:
        r = p["result"]
        entries.append({"prefix": p["prefix"], "cid": r["cid"],
                        "shard_lo": r.get("shard_lo", 0), "shard_hi": r.get("shard_hi"),
                        "params_M": r.get("params_M"), "tensors": r.get("tensors"),
                        "trit_bytes": r["trit_payload_bytes"]})
    # root over the ordered (cid, trit_bytes, shard_lo) triples — content address of the whole
    spine = json.dumps([[e["cid"], e["trit_bytes"], e["shard_lo"]] for e in entries]).encode()
    return {"model": model, "K": K, "root_cid": _cid(spine), "parts": entries,
            "params_M": round(sum(e["params_M"] or 0 for e in entries), 1),
            "tensors": sum(e["tensors"] or 0 for e in entries)}

def unfold_manifest(local_dir, dev=None):
    """local_dir holds manifest.json + one subdir per part (named by its prefix basename),
    each with meta.json + trits (or trits.part.*). Returns {key: np.ndarray} for the whole model."""
    from unfold import unfold
    man = json.load(open(os.path.join(local_dir, "manifest.json")))
    tensors = {}
    for e in man["parts"]:
        pdir = os.path.join(local_dir, os.path.basename(e["prefix"].rstrip("/")))
        meta = json.load(open(os.path.join(pdir, "meta.json")))
        if meta["cid"] != e["cid"]:
            raise ValueError(f"part {e['prefix']} CID mismatch: {meta['cid']} != {e['cid']}")
        part = unfold(pdir, dev=dev)                      # unfold verifies trit payload vs part CID too
        tensors.update(part)                              # shards partition tensors → no clobber
    return tensors

if __name__ == "__main__":
    # merge: build_manifest from a dir of part-*/result.json, write manifest.json
    d = sys.argv[1]
    parts = [{"result": json.load(open(f)), "prefix": os.path.dirname(f)}
             for f in sorted(glob.glob(os.path.join(d, "part-*/result.json")))]
    man = build_manifest(parts[0]["result"]["model"], parts[0]["result"]["K"], parts)
    json.dump(man, open(os.path.join(d, "manifest.json"), "w"), indent=1)
    print(f"manifest: {len(man['parts'])} parts, {man['params_M']}M params, root {man['root_cid']}")
