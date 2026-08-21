#!/usr/bin/env python3
# stream_fold — the feeder path: stream a model's weights from a URL (or path) by
# byte-range, fold each tensor down the scale on the GPU, and hash straight to a
# content address (CID). The model never lands on disk OR in bulk RAM — each tensor
# flows download -> fold -> trits and is released before the next, so memory is
# bounded by a small in-flight window, not the model size. Downloads run in a
# parallel prefetch pool because HF throttles per-connection (~3x with 4 conns).
# No floor — the residual is the next scale; K is the fidelity dial.
#
#   python stream_fold.py <url-or-path.safetensors|HF-repo> [-K 8] [--out DIR]
#                         [--workers 8] [--cap-gb 6]
#
# --out DIR writes a forkable artifact (result.json, meta.json, trits) that
# unfold.py reconstructs + verifies against the CID. Folds are per-tensor and
# in deterministic source order, so the CID is stable.
import sys, os, time, json, struct, hashlib, base64, threading, queue, math, urllib.request
import numpy as np, torch
from collections import defaultdict, deque
from concurrent.futures import ThreadPoolExecutor

def reader(src):
    """returns read(start,end_inclusive)->bytes. URL uses HTTP Range; path seeks (thread-safe: reopen)."""
    if src.startswith("http"):
        def rd(a, b):
            req = urllib.request.Request(src, headers={"Range": f"bytes={a}-{b}"})
            return urllib.request.urlopen(req, timeout=120).read()
        return rd
    def rd(a, b):                                      # reopen per read so it's thread-safe
        with open(src, "rb") as f: f.seek(a); return f.read(b - a + 1)
    return rd

def resolve_shards(src):
    """single .safetensors -> [src]; a HF repo/base -> all shards from the index."""
    if src.endswith(".safetensors"):
        return [src]
    base = src.rstrip("/")
    root = base + "/resolve/main/" if "huggingface.co" in base else base + "/"
    idx = root + "model.safetensors.index.json"
    try:
        raw = urllib.request.urlopen(idx, timeout=30).read() if idx.startswith("http") else open(idx, "rb").read()
        j = json.loads(raw)
        return [root + s for s in sorted(set(j["weight_map"].values()))]
    except Exception:
        pass
    return [root + "model.safetensors"]

def fwht(x):                                          # orthonormal, self-inverse
    M, n = x.shape; h = 1
    while h < n:
        x = x.view(M, n // (2 * h), 2, h); a = x[:, :, 0, :]; b = x[:, :, 1, :]
        x = torch.stack([a + b, a - b], dim=2).reshape(M, n); h *= 2
    return x * (n ** -0.5)

def decode(raw, dt):
    if dt == "BF16":
        return (np.frombuffer(raw, np.uint16).astype(np.uint32) << 16).view(np.float32)
    return np.frombuffer(raw, {"F32": np.float32, "F16": np.float16}[dt]).astype(np.float32)

def main(src, K=8, dev="cuda", out=None, workers=8, cap_gb=6, elcap=48_000_000, shard_lo=0, shard_hi=None):
    allshards = resolve_shards(src)
    shards = allshards[shard_lo:shard_hi if shard_hi is not None else len(allshards)]
    print(f"  {len(shards)}/{len(allshards)} shard(s) [range {shard_lo}:{shard_hi}]; workers={workers}, cap={cap_gb}GB", flush=True)
    srcs = []; dtypes = defaultdict(int)               # (rd, base, key, info) in deterministic order
    for u in shards:
        rd = reader(u); hlen = struct.unpack("<Q", rd(0, 7))[0]
        hdr = json.loads(rd(8, 8 + hlen - 1)); b = 8 + hlen
        for k, v in sorted(hdr.items()):
            if k != "__metadata__" and v["dtype"] in ("F32", "F16", "BF16"):
                dtypes[v["dtype"]] += 1
                if len(v["shape"]) >= 2: srcs.append((rd, b, k, v))

    SG = {}
    def signs(k, D):
        if (k, D) not in SG:
            g = torch.Generator(device=dev).manual_seed(7 + k)
            SG[(k, D)] = (torch.randint(0, 2, (D,), generator=g, device=dev) * 2 - 1).float()
        return SG[(k, D)]
    def pack(t):                                       # trits {-1,0,1} -> base-3, 5/byte, on GPU
        flat = (t + 1).to(torch.uint8).reshape(-1); pad = (-flat.numel()) % 5
        if pad: flat = torch.cat([flat, torch.zeros(pad, dtype=torch.uint8, device=dev)])
        q = flat.view(-1, 5).long()
        return (q[:, 0]*81 + q[:, 1]*27 + q[:, 2]*9 + q[:, 3]*3 + q[:, 4]).to(torch.uint8)

    if out: os.makedirs(out, exist_ok=True)
    trit_fh = open(os.path.join(out, "trits"), "wb") if out else None
    Q = queue.Queue(maxsize=8); H = hashlib.sha256()
    def hasher():
        while True:
            b = Q.get()
            if b is None: Q.task_done(); break
            H.update(b)
            if trit_fh: trit_fh.write(b)
            Q.task_done()
    th = threading.Thread(target=hasher); th.start()

    # parallel prefetch: submit downloads ahead in order, byte-bounded in-flight window
    CAP = cap_gb * 1024**3
    def fetch(item):
        rd, b, key, info = item; s, e = info["data_offsets"]; return key, info, rd(b + s, b + e - 1)
    ex = ThreadPoolExecutor(max_workers=workers)
    it = iter(srcs); futs = deque(); inflight = [0]
    def size_of(info): s, e = info["data_offsets"]; return e - s
    def top_up():
        while True:
            try: item = next(it)
            except StopIteration: return
            futs.append((ex.submit(fetch, item), size_of(item[3])))
            inflight[0] += size_of(item[3])
            if inflight[0] >= CAP or len(futs) >= workers * 2: return
    top_up()

    T0 = time.time(); meta_groups = []; total = 0; folded = 0; trit_off = 0; nfold = 0
    while futs:
        fut, sz = futs.popleft(); inflight[0] -= sz; top_up()
        key, info, raw = fut.result()
        arr = decode(raw, info["dtype"]); del raw
        shape = info["shape"]; M = int(np.prod(shape[:-1])); D = shape[-1]; Dp = 1 << (D - 1).bit_length()
        arrM = arr.reshape(M, D); del arr; total += M * D
        rc = max(1, elcap // Dp)                        # row-chunk so a huge tensor fits VRAM (fold is per-row)
        for r0 in range(0, M, rc):
            r1 = min(M, r0 + rc); rows = r1 - r0
            W = torch.zeros(rows, Dp, device=dev)
            W[:, :D] = torch.from_numpy(arrM[r0:r1].copy()).to(dev)
            trit0 = trit_off; scales_k = []
            R = W.clone(); recon = torch.zeros_like(W)
            for k in range(K):
                sg = signs(k, Dp); Rr = fwht(R * sg); s = Rr.abs().mean(1, keepdim=True) + 1e-9
                t = (Rr / s).round().clamp(-1, 1); pb = pack(t).cpu().numpy().tobytes()
                Q.put(pb); trit_off += len(pb)
                recon += fwht(t * s) * sg; R = W - recon; folded += rows * Dp * math.log2(3) / 8
                if out: scales_k.append(s.reshape(-1).to(torch.float16).cpu().numpy().tobytes())
            if out:
                meta_groups.append({"Dp": Dp, "rows": rows, "K": K,
                                    "tensors": [{"key": key, "shape": shape, "row0": r0, "rows": rows, "D": D}],
                                    "trit_byte0": trit0, "trit_bytes": trit_off - trit0,
                                    "scales_f16_b64": [base64.b64encode(x).decode() for x in scales_k]})
            del W, R, recon
        nfold += 1
        if nfold % 100 == 0:
            dt = time.time() - T0
            print(f"  [{nfold}/{len(srcs)}] {total/1e6:.0f}M params, {total/dt/1e6:.0f}M/s, inflight {inflight[0]/1e9:.1f}GB", flush=True)
    Q.put(None); th.join(); ex.shutdown(); wall = time.time() - T0
    if trit_fh: trit_fh.close()
    cid = "bafkrei" + hashlib.sha256(H.digest()).hexdigest()[:52]
    report = {"model": src, "cid": cid, "K": K, "params_M": round(total/1e6, 1),
              "trits_MB": round(folded/1e6, 1), "trit_payload_bytes": trit_off, "tensors": nfold,
              "wall_s": round(wall, 2), "params_per_s_M": round(total/wall/1e6, 1),
              "shards": len(shards), "shard_lo": shard_lo, "shard_hi": shard_hi,
              "total_shards": len(allshards), "dtypes": dict(dtypes)}
    print(f"folded {total/1e6:.0f}M params (K={K}, {nfold} tensors) -> {folded/1e6:.0f}MB trits", flush=True)
    print(f"  wall {wall:.1f}s  ·  {total/wall/1e6:.0f}M params/s end-to-end", flush=True)
    print(f"  CID  {cid}", flush=True)
    if out:
        json.dump({"cid": cid, "seed_base": 7, "groups": meta_groups}, open(os.path.join(out, "meta.json"), "w"))
        json.dump(report, open(os.path.join(out, "result.json"), "w"))
        print(f"  artifact -> {out}/ (result.json, meta.json, trits[{trit_off} bytes])", flush=True)
    return cid

if __name__ == "__main__":
    src = sys.argv[1]; K = 8; out = None; workers = 8; cap = 6
    if "-K" in sys.argv: K = int(sys.argv[sys.argv.index("-K") + 1])
    if "--out" in sys.argv: out = sys.argv[sys.argv.index("--out") + 1]
    if "--workers" in sys.argv: workers = int(sys.argv[sys.argv.index("--workers") + 1])
    if "--cap-gb" in sys.argv: cap = int(sys.argv[sys.argv.index("--cap-gb") + 1])
    lo = int(sys.argv[sys.argv.index("--shard-lo") + 1]) if "--shard-lo" in sys.argv else 0
    hi = int(sys.argv[sys.argv.index("--shard-hi") + 1]) if "--shard-hi" in sys.argv else None
    main(src, K, out=out, workers=workers, cap_gb=cap, shard_lo=lo, shard_hi=hi)
