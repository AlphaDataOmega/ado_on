#!/usr/bin/env python3
# stream_fold — the feeder path: stream a model's weights from a URL (or path) by
# byte-range, fold each tensor down the scale on the GPU, and hash straight to a
# content address (CID). The model never lands on disk — it flows URL -> fold ->
# CID through a small window. Pipelined: FWHT rotations, same-width batching,
# trits packed 5/byte on the GPU, hashing on a background thread. No floor — the
# residual is the next scale; K is the fidelity dial.
#
#   python stream_fold.py <url-or-path.safetensors> [-K 8]
import sys, time, json, struct, hashlib, threading, queue, urllib.request
import numpy as np, torch
from collections import defaultdict

def reader(src):
    """returns (read(start,end_inclusive)->bytes, size). URL uses HTTP Range; path seeks."""
    if src.startswith("http"):
        def rd(a, b):
            req = urllib.request.Request(src, headers={"Range": f"bytes={a}-{b}"})
            return urllib.request.urlopen(req, timeout=60).read()
        return rd
    f = open(src, "rb")
    def rd(a, b): f.seek(a); return f.read(b - a + 1)
    return rd

def fwht(x):                                          # orthonormal, self-inverse
    M, n = x.shape; h = 1
    while h < n:
        x = x.view(M, n // (2 * h), 2, h); a = x[:, :, 0, :]; b = x[:, :, 1, :]
        x = torch.stack([a + b, a - b], dim=2).reshape(M, n); h *= 2
    return x * (n ** -0.5)

def main(src, K=8, dev="cuda"):
    rd = reader(src)
    hlen = struct.unpack("<Q", rd(0, 7))[0]
    header = json.loads(rd(8, 8 + hlen - 1)); base = 8 + hlen
    tensors = [(k, v) for k, v in header.items() if k != "__metadata__" and v["dtype"] in ("F32", "F16", "BF16")]
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
    Q = queue.Queue(maxsize=6); H = hashlib.sha256()
    def hasher():
        while True:
            b = Q.get()
            if b is None: Q.task_done(); break
            H.update(b); Q.task_done()
    th = threading.Thread(target=hasher); th.start()

    T0 = time.time(); groups = defaultdict(list); total = 0; t_read = 0
    for _, info in tensors:
        if len(info["shape"]) < 2: continue
        s, e = info["data_offsets"]; t0 = time.time(); raw = rd(base + s, base + e - 1); t_read += time.time() - t0
        if info["dtype"] == "BF16":
            arr = (np.frombuffer(raw, np.uint16).astype(np.uint32) << 16).view(np.float32)
        else:
            arr = np.frombuffer(raw, {"F32": np.float32, "F16": np.float16}[info["dtype"]]).astype(np.float32)
        M = int(np.prod(info["shape"][:-1])); D = info["shape"][-1]; Dp = 1 << (D - 1).bit_length()
        groups[Dp].append((torch.from_numpy(arr.reshape(M, D).copy()), D)); total += M * D
    t_desc = 0; folded = 0
    for Dp, items in groups.items():
        rows = sum(it[0].shape[0] for it in items); Wt = torch.zeros(rows, Dp, device=dev); off = 0
        for w, D in items: Wt[off:off + w.shape[0], :D] = w.to(dev); off += w.shape[0]
        t0 = time.time(); R = Wt.clone(); recon = torch.zeros_like(Wt)
        for k in range(K):
            sg = signs(k, Dp); Rr = fwht(R * sg); s = Rr.abs().mean(1, keepdim=True) + 1e-9
            t = (Rr / s).round().clamp(-1, 1); Q.put(pack(t).cpu().numpy().tobytes())
            recon += fwht(t * s) * sg; R = Wt - recon; folded += rows * Dp * np.log2(3) / 8
        torch.cuda.synchronize(); t_desc += time.time() - t0
    Q.put(None); th.join(); wall = time.time() - T0
    cid = "bafkrei" + hashlib.sha256(H.digest()).hexdigest()[:52]   # raw-CIDv1-style tag over the fold
    print(f"folded {total/1e6:.0f}M params (K={K}) -> {folded/1e6:.0f}MB trits")
    print(f"  wall {wall:.2f}s (read {t_read:.2f}s | descend {t_desc:.2f}s)  ·  {total/wall/1e6:.0f}M params/s end-to-end")
    print(f"  CID  {cid}")
    print(f"  (no disk landing: {'URL range-read' if src.startswith('http') else 'local range-read'} -> GPU fold -> hash)")
    return cid

if __name__ == "__main__":
    src = sys.argv[1]; K = 8
    if "-K" in sys.argv: K = int(sys.argv[sys.argv.index("-K") + 1])
    main(src, K)
