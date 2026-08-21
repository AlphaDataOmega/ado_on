#!/usr/bin/env python3
# unfold — reconstruct model weights from a stream_fold artifact (meta.json + trits).
# The inverse of the descent: W ≈ Σ_k fwht(t_k · s_k) · sign_k, seeds regenerated
# from meta.seed_base. Verifies the trit payload against the CID (tamper-evident).
#
#   python unfold.py <artifact_dir>            # reconstruct + verify, report per-tensor RMSE
#   from unfold import unfold; tensors = unfold("dir")   # {key: np.ndarray}
import sys, os, json, base64, hashlib, numpy as np, torch

def fwht(x):                                          # orthonormal, self-inverse
    M, n = x.shape; h = 1
    while h < n:
        x = x.view(M, n // (2 * h), 2, h); a = x[:, :, 0, :]; b = x[:, :, 1, :]
        x = torch.stack([a + b, a - b], dim=2).reshape(M, n); h *= 2
    return x * (n ** -0.5)

def _unpack(b, n, Dp, dev):                           # base-3 5/byte -> trits {-1,0,1}, first n*Dp
    a = np.frombuffer(b, np.uint8).astype(np.int64); out = np.zeros((a.size, 5), np.int64)
    for i in range(5): out[:, 4 - i] = a % 3; a //= 3
    return torch.tensor(out.reshape(-1)[:n * Dp] - 1, dtype=torch.float32, device=dev).view(n, Dp)

def unfold(art, dev=None, verify=True):
    dev = dev or ("cuda" if torch.cuda.is_available() else "cpu")
    meta = json.load(open(os.path.join(art, "meta.json")))
    tp = os.path.join(art, "trits")
    if os.path.exists(tp):
        trits = open(tp, "rb").read()
    else:                                             # reassemble streamed parts (remote artifact)
        parts = sorted(f for f in os.listdir(art) if f.startswith("trits.part."))
        trits = b"".join(open(os.path.join(art, p), "rb").read() for p in parts)
    if verify:
        cid = "bafkrei" + hashlib.sha256(hashlib.sha256(trits).digest()).hexdigest()[:52]
        if cid != meta["cid"]:
            raise ValueError(f"CID mismatch — artifact tampered: {cid} != {meta['cid']}")
    def signs(k, D):
        g = torch.Generator(device=dev).manual_seed(meta["seed_base"] + k)
        return (torch.randint(0, 2, (D,), generator=g, device=dev) * 2 - 1).float()
    out = {}; shapes = {}
    for g in meta["groups"]:
        Dp, rows, K = g["Dp"], g["rows"], g["K"]
        seg = trits[g["trit_byte0"]:g["trit_byte0"] + g["trit_bytes"]]; per = g["trit_bytes"] // K
        W = torch.zeros(rows, Dp, device=dev)
        for k in range(K):
            t = _unpack(seg[k * per:(k + 1) * per], rows, Dp, dev)
            s = torch.tensor(np.frombuffer(base64.b64decode(g["scales_f16_b64"][k]), np.float16).astype(np.float32),
                             device=dev).view(rows, 1)
            W += fwht(t * s) * signs(k, Dp)
        for t in g["tensors"]:                            # accumulate row-chunks into the full (M,D) tensor
            key, shape, D = t["key"], t["shape"], t["D"]; M = int(np.prod(shape[:-1]))
            if key not in out: out[key] = np.zeros((M, D), np.float32); shapes[key] = shape
            out[key][t["row0"]:t["row0"] + t["rows"]] = W[:t["rows"], :D].cpu().numpy()
    return {k: v.reshape(shapes[k]) for k, v in out.items()}

if __name__ == "__main__":
    art = sys.argv[1]; tensors = unfold(art)
    print(f"unfolded {len(tensors)} tensors from {art}/ (CID verified)")
    for k, v in list(tensors.items())[:6]:
        print(f"  {k:32s} {list(v.shape)}  std {v.std():.3f}")
