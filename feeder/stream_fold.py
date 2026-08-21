#!/usr/bin/env python3
# stream_fold — the feeder path: stream a model's weights from a URL (or path) by
# byte-range, fold each tensor down the scale on the GPU, and hash straight to a
# content address (CID). The model never lands on disk — it flows URL -> fold ->
# CID through a small window. Pipelined: FWHT rotations, same-width batching,
# trits packed 5/byte on the GPU, hashing on a background thread. No floor — the
# residual is the next scale; K is the fidelity dial.
#
#   python stream_fold.py <url-or-path.safetensors> [-K 8] [--out DIR]
#
# --out DIR writes a forkable artifact (deterministic, 3 files):
#   result.json  model + CID + params/throughput/shards (the report)
#   meta.json    group layout, tensor->rows map, K, seed base, per-scale scales(f16 b64)
#   trits        the concatenated packed trit payload (the bulk; CID hashes THIS)
# Together they reconstruct/walk the fold; seeds are regenerable (manual_seed(7+k)).
import sys, os, time, json, struct, hashlib, base64, threading, queue, urllib.request
import numpy as np, torch
from collections import defaultdict

def reader(src):
    """returns read(start,end_inclusive)->bytes. URL uses HTTP Range; path seeks."""
    if src.startswith("http"):
        def rd(a, b):
            req = urllib.request.Request(src, headers={"Range": f"bytes={a}-{b}"})
            return urllib.request.urlopen(req, timeout=60).read()
        return rd
    f = open(src, "rb")
    def rd(a, b): f.seek(a); return f.read(b - a + 1)
    return rd


def resolve_shards(src):
    """single .safetensors -> [src]; a HF repo/base -> all shards from the index."""
    if src.endswith(".safetensors"):
        return [src]
    base = src.rstrip("/")
    root = base + "/resolve/main/" if "huggingface.co" in base else base + "/"
    for idx in (root + "model.safetensors.index.json",):
        try:
            j = json.loads(urllib.request.urlopen(idx, timeout=30).read())
            shards = sorted(set(j["weight_map"].values()))
            return [root + s for s in shards]
        except Exception:
            pass
    return [root + "model.safetensors"]

def fwht(x):                                          # orthonormal, self-inverse
    M, n = x.shape; h = 1
    while h < n:
        x = x.view(M, n // (2 * h), 2, h); a = x[:, :, 0, :]; b = x[:, :, 1, :]
        x = torch.stack([a + b, a - b], dim=2).reshape(M, n); h *= 2
    return x * (n ** -0.5)

def main(src, K=8, dev="cuda", out=None):
    shards = resolve_shards(src)
    print(f"  {len(shards)} shard(s) to stream")
    sources = []                                       # (rd, base, key, info) across all shards
    dtypes = defaultdict(int)
    for u in shards:
        rd = reader(u); hlen = struct.unpack("<Q", rd(0, 7))[0]
        hdr = json.loads(rd(8, 8 + hlen - 1)); b = 8 + hlen
        for k, v in hdr.items():
            if k != "__metadata__" and v["dtype"] in ("F32", "F16", "BF16"):
                sources.append((rd, b, k, v)); dtypes[v["dtype"]] += 1
    SG = {}
    def signs(k, D):
        if (k, D) not in SG:
            g = torch.Generator(device=dev).manual_seed(7 + k)
            SG[(k, D)] = (torch.randint(0, 2, (D,), generator=g, device=dev) * 2 - 1).float()
        return SG[(k, D)]
    def pack(t):                                      # trits {-1,0,1} -> base-3, 5/byte, on GPU
        flat = (t + 1).to(torch.uint8).reshape(-1); pad = (-flat.numel()) % 5
        if pad: flat = torch.cat([flat, torch.zeros(pad, dtype=torch.uint8, device=dev)])
        q = flat.view(-1, 5).long()
        return (q[:, 0]*81 + q[:, 1]*27 + q[:, 2]*9 + q[:, 3]*3 + q[:, 4]).to(torch.uint8)

    # optional artifact sink: hash the trit payload AND (if out) stream it to a file
    trit_fh = None
    if out:
        os.makedirs(out, exist_ok=True)
        trit_fh = open(os.path.join(out, "trits"), "wb")
    Q = queue.Queue(maxsize=6); H = hashlib.sha256(); trit_bytes = [0]
    def hasher():
        while True:
            b = Q.get()
            if b is None: Q.task_done(); break
            H.update(b)
            if trit_fh: trit_fh.write(b)
            trit_bytes[0] += len(b); Q.task_done()
    th = threading.Thread(target=hasher); th.start()

    T0 = time.time(); groups = defaultdict(list); total = 0; t_read = 0
    for rd, b, key, info in sources:
        if len(info["shape"]) < 2: continue
        s, e = info["data_offsets"]; t0 = time.time(); raw = rd(b + s, b + e - 1); t_read += time.time() - t0
        if info["dtype"] == "BF16":
            arr = (np.frombuffer(raw, np.uint16).astype(np.uint32) << 16).view(np.float32)
        else:
            arr = np.frombuffer(raw, {"F32": np.float32, "F16": np.float16}[info["dtype"]]).astype(np.float32)
        M = int(np.prod(info["shape"][:-1])); D = info["shape"][-1]; Dp = 1 << (D - 1).bit_length()
        groups[Dp].append((torch.from_numpy(arr.reshape(M, D).copy()), D, key, list(info["shape"]))); total += M * D
    t_desc = 0; folded = 0; meta_groups = []
    for Dp, items in groups.items():
        rows = sum(it[0].shape[0] for it in items); Wt = torch.zeros(rows, Dp, device=dev); off = 0
        layout = []
        for w, D, key, shape in items:
            layout.append({"key": key, "shape": shape, "row0": off, "rows": w.shape[0], "D": D})
            Wt[off:off + w.shape[0], :D] = w.to(dev); off += w.shape[0]
        trit0 = trit_bytes[0]; scales_k = []
        t0 = time.time(); R = Wt.clone(); recon = torch.zeros_like(Wt)
        for k in range(K):
            sg = signs(k, Dp); Rr = fwht(R * sg); s = Rr.abs().mean(1, keepdim=True) + 1e-9
            t = (Rr / s).round().clamp(-1, 1); Q.put(pack(t).cpu().numpy().tobytes())
            recon += fwht(t * s) * sg; R = Wt - recon; folded += rows * Dp * np.log2(3) / 8
            if out: scales_k.append(s.reshape(-1).to(torch.float16).cpu().numpy().tobytes())
        torch.cuda.synchronize(); t_desc += time.time() - t0
        if out:
            Q.join()  # flush this group's trit bytes so trit_bytes[0] is exact
            meta_groups.append({"Dp": Dp, "rows": rows, "K": K, "tensors": layout,
                                "trit_byte0": trit0, "trit_bytes": trit_bytes[0] - trit0,
                                "scales_f16_b64": [base64.b64encode(x).decode() for x in scales_k]})
    Q.put(None); th.join(); wall = time.time() - T0
    if trit_fh: trit_fh.close()
    cid = "bafkrei" + hashlib.sha256(H.digest()).hexdigest()[:52]   # raw-CIDv1-style tag over the fold
    report = {"model": src, "cid": cid, "K": K, "params_M": round(total/1e6, 1),
              "trits_MB": round(folded/1e6, 1), "trit_payload_bytes": trit_bytes[0],
              "wall_s": round(wall, 2), "read_s": round(t_read, 2), "descend_s": round(t_desc, 2),
              "params_per_s_M": round(total/wall/1e6, 1), "shards": len(shards), "dtypes": dict(dtypes)}
    print(f"folded {total/1e6:.0f}M params (K={K}) -> {folded/1e6:.0f}MB trits")
    print(f"  wall {wall:.2f}s (read {t_read:.2f}s | descend {t_desc:.2f}s)  ·  {total/wall/1e6:.0f}M params/s end-to-end")
    print(f"  CID  {cid}")
    if out:
        json.dump({"cid": cid, "seed_base": 7, "groups": meta_groups}, open(os.path.join(out, "meta.json"), "w"))
        json.dump(report, open(os.path.join(out, "result.json"), "w"))
        print(f"  artifact -> {out}/  (result.json, meta.json, trits[{trit_bytes[0]} bytes])")
    return cid

if __name__ == "__main__":
    src = sys.argv[1]; K = 8; out = None
    if "-K" in sys.argv: K = int(sys.argv[sys.argv.index("-K") + 1])
    if "--out" in sys.argv: out = sys.argv[sys.argv.index("--out") + 1]
    main(src, K, out=out)
