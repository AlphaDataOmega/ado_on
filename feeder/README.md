# feeder — stream a model URL → fold → CID

`stream_fold.py` streams a model's weights **by byte-range** from a URL (or path),
folds each tensor down the ADO scale on the GPU, and hashes **straight to a CID** —
the model never lands on disk. Pipelined (FWHT rotations, same-width batching,
trits packed 5/byte on-GPU, background hashing). **No floor** — the residual is the
next scale; `K` is the fidelity dial.

```bash
python feeder/stream_fold.py https://huggingface.co/<repo>/resolve/main/model.safetensors -K 8
python feeder/stream_fold.py ./model.safetensors            # local range-read
```

Measured single RTX 3090 (end-to-end, no disk): ~72M params/s → 7B ≈ 1.6 min,
70B ≈ 16 min, Kimi K3 2.8T ≈ 11 hr (≈1.3 hr on an 8-GPU Vast node; minutes for a
derivative via content-addressed tile dedup). Requires torch + a CUDA GPU.
