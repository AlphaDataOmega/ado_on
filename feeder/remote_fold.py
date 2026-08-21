#!/usr/bin/env python3
# remote_fold — runs on an ephemeral GPU box: fold a model with stream_fold, then
# push the forkable artifact to signed GCS PUT URLs. Curl-free (only python+torch,
# both in the pytorch image) — the slim image has no curl, so all net I/O is urllib.
# Trits stream to size-capped part URLs, so a multi-GB payload uploads a window at a
# time without landing a second copy on disk.
#   python3 remote_fold.py <model_url> <urls.json>
# urls.json = {"result":u, "meta":u, "log":u, "trits_parts":[u, ...]}
import sys, os, json, urllib.request as U
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import stream_fold

PART = 5 * 1024**3  # 5 GiB per uploaded part

class LimitReader:                      # hand urllib exactly `n` bytes from an open file
    def __init__(self, f, n): self.f = f; self.n = n
    def read(self, sz=-1):
        if self.n <= 0: return b""
        if sz is None or sz < 0: sz = self.n
        b = self.f.read(min(sz, self.n)); self.n -= len(b); return b

def put(url, path, ctype, offset=None, length=None, retries=3):
    for a in range(retries):
        try:
            if offset is None:
                data = open(path, "rb"); clen = os.path.getsize(path)
            else:
                f = open(path, "rb"); f.seek(offset); data = LimitReader(f, length); clen = length
            req = U.Request(url, data=data, method="PUT",
                            headers={"Content-Type": ctype, "Content-Length": str(clen)})
            return U.urlopen(req, timeout=1800).status
        except Exception as e:
            print(f"  put attempt {a+1} failed: {e}", flush=True)
    raise RuntimeError(f"PUT failed after {retries}: {path}")

def main(model, urls_path, K=8):
    urls = json.load(open(urls_path))
    global PART
    PART = int(urls.get("part_bytes", PART))
    sh = urls.get("shard_hi")
    stream_fold.main(model, K=K, out="/root/fold",
                     workers=int(urls.get("workers", 12)), cap_gb=int(urls.get("cap_gb", 8)),
                     shard_lo=int(urls.get("shard_lo", 0)), shard_hi=int(sh) if sh is not None else None)
    print("PUT result", put(urls["result"], "/root/fold/result.json", "application/json"), flush=True)
    print("PUT meta",   put(urls["meta"],   "/root/fold/meta.json",   "application/json"), flush=True)
    tp = "/root/fold/trits"; sz = os.path.getsize(tp); parts = urls["trits_parts"]
    n = (sz + PART - 1) // PART
    assert n <= len(parts), f"need {n} part URLs, have {len(parts)}"
    off = 0
    for i in range(n):
        ln = min(PART, sz - off)
        print(f"PUT trits.part.{i:02d} ({ln}B)", put(parts[i], tp, "application/octet-stream", off, ln), flush=True)
        off += ln
    cid = json.load(open("/root/fold/result.json"))["cid"]
    print(f"ARTIFACT_UPLOADED parts={n} cid={cid}", flush=True)

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
