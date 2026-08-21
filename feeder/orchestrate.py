#!/usr/bin/env python3
# orchestrate — fold one model across N Vast instances in parallel. Each instance
# folds a contiguous shard range and pushes its part artifact to signed GCS URLs;
# afterward `manifest.py` (or --merge here) ties the parts into one root CID.
# Runs LOCALLY (needs gcloud auth + vastai CLI + VAST_API_KEY). Curl-free onstarts.
#
#   python3 orchestrate.py <model_url> <slug> [--parts 4] [--K 8] [--part-gb 30]
#                          [--trits-parts 8] [--disk 200] [--inet 800] [--merge]
#
# --merge (after all parts finish): pull the N result.json from GCS, build+upload
#   manifest.json with the root CID. Run it once the parts are done.
import sys, os, json, subprocess, urllib.request, math

SA = "ado-chamber@ado-earth.iam.gserviceaccount.com"
BUCKET = "gs://ado-feeder"; REGION = "us-central1"
IMAGE = "pytorch/pytorch:2.4.1-cuda12.1-cudnn9-runtime"
RAW = "https://raw.githubusercontent.com/AlphaDataOmega/ado_on/main/feeder/"
KEY = os.path.expanduser("~/.ssh/id_ed25519.pub")

def sh(cmd, env=None):
    return subprocess.run(cmd, shell=True, capture_output=True, text=True,
                          env={**os.environ, **(env or {})}).stdout.strip()

def sign(obj, ctype, hours=12):                          # impersonation/system-key signing caps at 12h
    for _ in range(5):                                   # retry transient failures; empty URL == crash on the box
        u = sh(f'gcloud storage sign-url "{BUCKET}/{obj}" --impersonate-service-account="{SA}" '
               f'--http-verb=PUT --region={REGION} --duration={hours}h '
               f'--headers="content-type={ctype}" --format="value(signed_url)"')
        if u.startswith("https://"): return u
    raise RuntimeError(f"sign-url failed for {obj} after 5 tries")

def shard_count(model):
    base = model.rstrip("/"); root = base + "/resolve/main/" if "huggingface.co" in base else base + "/"
    j = json.loads(urllib.request.urlopen(root + "model.safetensors.index.json", timeout=30).read())
    return len(set(j["weight_map"].values()))

def ranges(S, N):
    step = math.ceil(S / N)
    return [(i * step, min(S, (i + 1) * step)) for i in range(N) if i * step < S]

def onstart(model, urls_json):
    return f'''#!/bin/bash
exec >/root/fold.log 2>&1
set -x
echo "ADO_START $(date -u)"
cd /root
python3 - <<'PYX'
import urllib.request as U
for n in ("stream_fold","remote_fold","unfold"):
    open(n+".py","wb").write(U.urlopen("{RAW}"+n+".py",timeout=60).read())
print("scripts fetched")
PYX
cat > /root/urls.json <<'JSONX'
{urls_json}
JSONX
python3 remote_fold.py {json.dumps(model)} /root/urls.json && echo ADO_DONE || echo ADO_FAILED
python3 - <<'PYL'
import json,urllib.request as U
u=json.load(open("/root/urls.json"))["log"]; d=open("/root/fold.log","rb").read()
U.urlopen(U.Request(u,data=d,method="PUT",headers={{"Content-Type":"text/plain","Content-Length":str(len(d))}}),timeout=120)
PYL
'''

def pick_offer(disk, inet):
    # inet_up matters as much as inet_down: the folded trits (100s of GB) must be
    # PUSHED to GCS. Hosts with fast download but crippled upload silently strand a
    # completed fold. Require both.
    raw = sh(f"vastai search offers 'reliability>0.98 gpu_name=RTX_3090 num_gpus=1 "
             f"inet_down>{inet} inet_up>{inet} disk_space>{disk+20} rentable=true verified=true' -o 'dph+' --raw")
    d = json.loads(raw); return d[0]["id"] if d else None

def launch_part(model, slug, i, lo, hi, K, part_gb, trits_parts, disk, inet, workers=12):
    pre = f"folds/{slug}/part-{i}"
    urls = {"result": sign(f"{pre}/result.json", "application/json"),
            "meta": sign(f"{pre}/meta.json", "application/json"),
            "log": sign(f"{pre}/fold.log", "text/plain"),
            "part_bytes": part_gb * 1024**3, "workers": workers, "cap_gb": 8,
            "shard_lo": lo, "shard_hi": hi,
            "trits_parts": [sign(f"{pre}/trits.part.{j:02d}", "application/octet-stream") for j in range(trits_parts)]}
    os_sh = onstart(model, json.dumps(urls))
    p = f"/tmp/onstart_{slug}_{i}.sh"; open(p, "w").write(os_sh)
    offer = pick_offer(disk, inet)
    if not offer: print(f"  part {i}: NO OFFER"); return None
    out = sh(f"vastai create instance {offer} --image {IMAGE} --disk {disk} --onstart {p} --ssh --raw")
    try: cid = json.loads(out).get("new_contract")
    except Exception: print(f"  part {i}: launch parse fail: {out[:120]}"); return None
    sh(f'vastai attach ssh {cid} "{open(KEY).read().strip()}"')
    print(f"  part {i} shards[{lo}:{hi}] -> instance {cid} (offer {offer}) prefix {pre}")
    return {"i": i, "instance": cid, "prefix": f"{BUCKET}/{pre}", "shard_lo": lo, "shard_hi": hi}

def merge(model, slug, K):
    base = f"{BUCKET}/folds/{slug}"
    listing = sh(f"gcloud storage ls {base}/").splitlines()
    parts = []
    for line in listing:
        if line.rstrip("/").endswith(tuple(f"part-{i}" for i in range(64))):
            pre = line.rstrip("/")
            r = sh(f"gcloud storage cat {pre}/result.json")
            if r.startswith("{"): parts.append({"result": json.loads(r), "prefix": pre})
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    from manifest import build_manifest
    man = build_manifest(model, K, parts)
    mp = f"/tmp/manifest_{slug}.json"; json.dump(man, open(mp, "w"), indent=1)
    u = sign(f"folds/{slug}/manifest.json", "application/json")
    sh(f'curl -s -X PUT -H "content-type: application/json" --data-binary @{mp} "{u}"')
    print(f"manifest: {len(man['parts'])} parts, {man['params_M']}M params, root {man['root_cid']}")
    print(f"  -> {base}/manifest.json")
    return man

if __name__ == "__main__":
    model = sys.argv[1]; slug = sys.argv[2]
    def arg(name, d): return type(d)(sys.argv[sys.argv.index(name)+1]) if name in sys.argv else d
    K = arg("--K", 8); N = arg("--parts", 4); part_gb = arg("--part-gb", 30)
    tparts = arg("--trits-parts", 8); disk = arg("--disk", 200); inet = arg("--inet", 800)
    if "--merge" in sys.argv:
        merge(model, slug, K); sys.exit(0)
    S = shard_count(model); rs = ranges(S, N)
    print(f"{model}: {S} shards -> {len(rs)} parts {rs}")
    launched = [launch_part(model, slug, i, lo, hi, K, part_gb, tparts, disk, inet) for i, (lo, hi) in enumerate(rs)]
    json.dump([x for x in launched if x], open(f"/tmp/launched_{slug}.json", "w"))
    print(f"launched {len([x for x in launched if x])}/{len(rs)} parts; state -> /tmp/launched_{slug}.json")
