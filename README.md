# AeonProof

**A proof vault for the age of fakes.** Cryptography detects tampering; DNA archives the proof for centuries.

🌐 **[proof.aeonscript.org](https://proof.aeonscript.org)** · 🔬 [Live demo](https://proof.aeonscript.org/demo.html) · 📜 [Spec](spec/SPEC-PROOF-RECORD-v0.1.md) · 🧬 Built on [AeonScript](https://aeonscript.org)

---

## What

AeonProof lets a creator register an original media file (audio, video, image, document) and produce a compact, signed, timestamped **proof record** that:

1. **Detects any later modification** — exact, bit-level (SHA-256).
2. **Distinguishes tampering from legitimate re-encoding** — perceptual hashing.
3. **Proves who registered it and when** — Ed25519 signature + timestamp.
4. **Is archived in DNA** via AeonScript — century-scale, offline, physically immutable.

It does **not** detect deepfakes by inspecting content. It flips the problem: instead of chasing fakes, it certifies originals at the source, with an incontestable proof of priority.

## Why DNA

A digital registry can be hacked, rewritten, or lost when the company dies. DNA, synthesized and distributed across physical vaults, is **physically immutable** (you can't edit a molecule), **offline** (immune to cyberattack), **energy-free**, and lasts for centuries. One DNA capsule anchors millions of proofs via a Merkle root.

> **Cryptography detects. DNA archives.**

## The four verdicts

| Verdict | Meaning |
|---|---|
| ✅ Original verified | Bit-for-bit identical to a registered original |
| 🟡 Same content, re-encoded | Perceptually identical; bytes differ (compression/format) |
| 🔴 Content altered | Derived from an original but content modified — tampering |
| ⚪ Not registered | No matching record; no claim made |

## Honest limits

AeonProof proves *"registered as an original by X at time T, and whether your file matches."* It does **not** prove the registered original is itself truthful. Evidentiary power comes from **trusted registrars** (newsrooms, courts, notaries). See the [spec §10](spec/SPEC-PROOF-RECORD-v0.1.md).

## Positioning

Not a competitor to C2PA (creation-time provenance) or blockchain (medium-term anchoring). AeonProof is the **deep-time layer** — the offline, millennium-scale backstop that survives the collapse of any digital infrastructure.

## Repository

```
aeonproof/
├── index.html        landing / pitch page
├── demo.html         interactive demo (real Ed25519, runs 100% in-browser)
├── MANIFESTO.md      the "why"
├── spec/
│   └── SPEC-PROOF-RECORD-v0.1.md
└── README.md
```

## Status

v0.1 — early draft. Spec + demo + presentation done. Production perceptual hashes (PDQ, Chromaprint, TMK+PDQF), real DNA Merkle anchoring, and trusted-registrar identities are on the roadmap.

## License

- Code : **MIT**
- Spec & docs : **CC-BY-SA 4.0**
