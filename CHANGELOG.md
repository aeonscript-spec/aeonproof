# Changelog

Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Versioning: [SemVer](https://semver.org).

---

## [0.1.0] — 2026-06-15

Initial public release.

### Added — spec
- Proof record format ([SPEC-PROOF-RECORD-v0.1.md](spec/SPEC-PROOF-RECORD-v0.1.md)): exact + perceptual hashes, Ed25519 signature, timestamp, Merkle batching.
- Two-tier architecture: cryptographic detection (hot) + DNA Merkle anchoring via AeonScript (cold).
- Four verdicts (verified / re-encoded / altered / not registered).
- Honest threat model (§10): what it proves, what it doesn't, trusted-registrar mitigation.

### Added — demo
- In-browser verifier ([demo.html](demo.html)) with **real Ed25519** signatures (Web Crypto API), persisted keypair.
- Three modes: Text (norm perceptual), Image (aHash perceptual), File (audio/video/PDF, exact integrity).
- Live verdict that flips on a single-character change. 100% local, no data leaves the browser.

### Added — site & repo
- Landing / pitch page ([index.html](index.html)) at proof.aeonscript.org.
- MANIFESTO, README, dual licence (MIT + CC-BY-SA 4.0).
- CI (`tools/ci-check.js` + workflow), issue/PR templates, SECURITY policy.

### Known limitations (v0.2 targets)
- Perceptual hashes are demo-grade (aHash); production needs PDQ / Chromaprint / TMK+PDQF.
- DNA Merkle anchoring is specified but not yet physically synthesized.
- No trusted-registrar identity layer yet.
- Canonicalization uses sorted-key JSON (approx. of RFC 8785 JCS).

[0.1.0]: https://github.com/aeonscript-spec/aeonproof/releases/tag/v0.1.0
