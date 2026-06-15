# AeonProof — Proof Record Format Specification

**Version** : 0.1 (draft)
**Date** : June 2026
**Status** : Draft — not yet normative
**License** : CC-BY-SA 4.0
**Built on** : [AeonScript](https://aeonscript.org) v0.1

---

## 0. Conventions

- **MUST**, **MUST NOT**, **SHOULD**, **MAY** follow [RFC 2119](https://www.rfc-editor.org/rfc/rfc2119).
- All hashes are written `algo:hexvalue` (e.g. `sha256:e3b0c4…`).
- All timestamps are RFC 3339 UTC (`2026-06-13T14:00:00Z`).
- JSON examples are pretty-printed for readability; the *canonical* form used for signing is defined in §3.

---

## 1. Overview

AeonProof is a **content-registration and integrity-anchoring format**. It lets a creator register an original media file (audio, video, image, document) and produce a compact, signed, timestamped **proof record** that:

1. **Detects any later modification** of the file — exact, bit-level.
2. **Detects content tampering** while tolerating legitimate re-encoding (compression, format change) — perceptual.
3. **Proves who registered it and when** — signature + timestamp.
4. Is **archived in DNA** via AeonScript for century-scale, tamper-proof, offline preservation.

### 1.1 What AeonProof is NOT

AeonProof proves *"this file was registered as an original by identity X at time T, and here is whether your file matches it."* It does **NOT** prove that the registered original is itself truthful (e.g. not a staged scene or a deepfake registered first). It is a **provenance and integrity** system, not a truth oracle. Its strength comes from combination with **trusted registrars** (newsrooms, courts, notaries) — see §10.

### 1.2 Relationship to AeonScript

AeonProof is an **L7 application format** (per the AeonScript layered model). A proof record is the *payload* of an AeonScript block:

```
┌─────────────────────────────────────────┐
│ AeonScript block                          │
│  L5 tag: TYPE=application/vnd.aeonproof+json │
│  payload: the proof record (this spec)    │
│  L4: Reed-Solomon · L1: A/C/G/T encoding  │
└─────────────────────────────────────────┘
```

AeonScript handles **storage, error correction, self-description, and DNA encoding**. AeonProof defines **what the proof record contains**. Clean separation of concerns.

---

## 2. The proof record

A proof record is a JSON object with the following structure. Mandatory fields are marked **(M)**.

```json
{
  "aeonproof": "0.1",
  "work": {
    "title": "Interview — témoin oculaire, Dakar",
    "media_type": "video/mp4",
    "size_bytes": 48210432,
    "created_claimed": "2026-06-13T09:12:00Z"
  },
  "hashes": {
    "exact": "sha256:9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
    "perceptual": {
      "algo": "pdq",
      "value": "f8f0e1c3..."
    }
  },
  "registrant": {
    "id": "did:key:z6Mk…",
    "pubkey": "ed25519:3b6a27bcceb6a42d62a3a8d02a6f0d73…"
  },
  "timestamp": {
    "claimed": "2026-06-13T09:15:30Z",
    "anchor": { "type": "rfc3161", "token": "MIIE…" }
  },
  "prev": "sha256:1a2b3c…",
  "signature": {
    "alg": "ed25519",
    "value": "5d41402abc4b2a76b9719d911017c592…"
  }
}
```

### 2.1 Field definitions

| Field | Req | Type | Meaning |
|---|---|---|---|
| `aeonproof` | **M** | string | Spec version. v0.1 → `"0.1"`. |
| `work.title` | | string | Human-readable title. |
| `work.media_type` | **M** | string | MIME type of the registered file. |
| `work.size_bytes` | **M** | integer | Exact byte length of the original. |
| `work.created_claimed` | | RFC3339 | When the author says it was captured. |
| `hashes.exact` | **M** | hash | SHA-256 of the **raw original bytes**. Detects any change. |
| `hashes.perceptual` | | object | Content fingerprint (see §4). Omitted for non-perceptual types. |
| `hashes.perceptual.algo` | | string | `pdq` · `tmk+pdqf` · `chromaprint` · `text-norm` (see §4). |
| `hashes.perceptual.value` | | string | The fingerprint value. |
| `registrant.id` | **M** | string | Identity of the registrant — a `did:key`, an email, or an org ID. |
| `registrant.pubkey` | **M** | string | Public key used to verify `signature`. `ed25519:…`. |
| `timestamp.claimed` | **M** | RFC3339 | When the record was created. |
| `timestamp.anchor` | | object | Optional trusted-time proof (§6). |
| `prev` | | hash | SHA-256 of the previous proof record (forms an append-only chain, §7). |
| `signature` | **M** | object | Signature over the canonical record (§5). |

---

## 3. Canonical serialization

The `signature` is computed over a **deterministic byte representation** of the record. Without a canonical form, two semantically identical records could serialize differently and break verification.

A conformant implementation **MUST** use **JCS — JSON Canonicalization Scheme ([RFC 8785](https://www.rfc-editor.org/rfc/rfc8785))**: keys sorted lexicographically, no insignificant whitespace, UTF-8, canonical number formatting.

The bytes that are signed are the JCS serialization of the record **with the `signature` field removed**.

```
to_sign = JCS( record without "signature" )
```

---

## 4. Content hashing

### 4.1 Exact hash (mandatory)

`hashes.exact` **MUST** be `sha256:` of the raw original file bytes. This is the integrity anchor: a single changed bit changes the hash entirely.

### 4.2 Perceptual hash (recommended for media)

Exact hashing flags legitimate re-encoding (a video re-compressed by a platform changes every byte). To distinguish *"content tampered"* from *"merely re-encoded"*, AeonProof records a **perceptual hash** appropriate to the media type. Implementations **SHOULD** use these established, openly-specified algorithms — do **not** invent new ones:

| Media | Algorithm | Notes |
|---|---|---|
| Image | **PDQ** (`pdq`) | Facebook's open perceptual hash; 256-bit; Hamming-distance comparison. |
| Video | **TMK+PDQF** (`tmk+pdqf`) | Facebook's video matching; robust to re-encoding/resolution change. |
| Audio | **Chromaprint** (`chromaprint`) | AcoustID's fingerprint; robust to transcoding/bitrate change. |
| Text | **`text-norm`** | SHA-256 of whitespace/encoding-normalized text. (True perceptual text matching — paraphrase detection — is out of scope for v0.1.) |

Comparison uses the algorithm's native distance metric (Hamming for PDQ/TMK, the Chromaprint distance for audio) against a published threshold. Thresholds are profile-defined and listed in `spec/thresholds.md` (to be written).

---

## 5. Identity and signatures

### 5.1 Signature scheme

v0.1 mandates **Ed25519** (`alg: "ed25519"`) — compact (64-byte signatures, 32-byte keys), fast, and widely implemented. Other schemes (e.g. post-quantum ML-DSA) **MAY** be added as profiles in v0.2.

### 5.2 Signing

```
to_sign   = JCS(record without "signature")
signature = Ed25519_sign(registrant_private_key, to_sign)
record.signature = { "alg": "ed25519", "value": hex(signature) }
```

### 5.3 Verifying

```
claimed_sig = record.signature.value
to_verify   = JCS(record without "signature")
valid       = Ed25519_verify(record.registrant.pubkey, to_verify, claimed_sig)
```

A record whose signature does not verify **MUST** be treated as invalid and rejected — never as merely "unverified".

---

## 6. Timestamping

### 6.1 Claimed timestamp (mandatory)

`timestamp.claimed` is the registrant's self-asserted time. Alone, it is **not trustworthy** (anyone can claim any time).

### 6.2 Anchored timestamp (recommended)

For real evidentiary value, `timestamp.anchor` **SHOULD** carry a proof from a trusted source:

| Anchor type | Standard | Property |
|---|---|---|
| `rfc3161` | [RFC 3161](https://www.rfc-editor.org/rfc/rfc3161) | Trusted Timestamping Authority token. |
| `opentimestamps` | OpenTimestamps | Bitcoin-anchored proof of existence. |
| `aeonproof-batch` | this spec, §7 | Inclusion in a DNA-archived Merkle batch. |

An anchored timestamp proves the record existed **no later than** the anchor time — which is what matters against back-dating fraud.

---

## 7. Batching and Merkle anchoring (the DNA cold tier)

Synthesizing DNA per record would be absurd. Instead, the registry **batches** records and archives only a tiny **Merkle root** in DNA.

### 7.1 Construction

1. Collect N proof records in a batch period (e.g. one month).
2. Leaf `i` = `sha256(JCS(record_i))`.
3. Build a binary Merkle tree (SHA-256) → 32-byte **root**.
4. Each record stores its **Merkle path** (the log₂(N) sibling hashes) → field `batch.path`.
5. The batch header `{ root, period, count, prev_root }` is encoded as an **AeonScript block** (`TYPE=application/vnd.aeonproof-batch+json`) and synthesized into DNA, distributed to multiple physical vaults.

### 7.2 Why this is efficient and powerful

- One DNA snapshot (a few hundred bytes for the root + header) anchors **millions** of records.
- Verifying a record against the DNA-archived root needs only its `batch.path` — log₂(N) hashes.
- The DNA root is **physically immutable**: the registry's history cannot be silently rewritten, because the root that commits to it is frozen in molecules across several jurisdictions.
- `prev_root` chains batches → the entire registry forms one tamper-evident timeline.

> This is the heart of AeonProof: cryptography does the *detection* (cheap, instant, digital), DNA does the *anchoring* (immutable, offline, century-scale). Each tool where it is strongest.

---

## 8. The AeonScript envelope

A proof record is stored as the payload of an AeonScript block:

```
|AEONSCRIPT=0.1;L1=L1-4;L4=rs255-223;TYPE=application/vnd.aeonproof+json;LEN=<n>;ID=<record-id>;CHECKSUM=sha256:…|<canonical proof record bytes>
```

- `TYPE` declares the AeonProof content type, so any AeonScript decoder knows it holds a proof record.
- `ID` is a stable record identifier (e.g. `sha256` of the canonical record, truncated).
- The AeonScript `CHECKSUM` provides a redundant integrity check on top of the record's own signature.

Batch headers use `TYPE=application/vnd.aeonproof-batch+json`.

---

## 9. Verification procedure

Given a **suspect file** and access to the registry (hot tier) and/or a DNA-archived batch root (cold tier):

```
1. Compute exact = sha256(suspect_file_bytes)
2. Look up exact in the registry.
   → match found  → ✅ ORIGINAL VERIFIED (byte-identical to a registered original)
3. If no exact match, compute the perceptual hash of the suspect file.
   Search registered records of the same media_type for a perceptual match
   within the published threshold.
   → match found  → 🟡 SAME CONTENT, RE-ENCODED (legitimate transformation)
   → near-miss above threshold → 🔴 CONTENT ALTERED (tampering detected)
4. No match at all → ⚪ NOT REGISTERED (no claim can be made)
5. For any match: verify the record's signature (§5) and timestamp anchor (§6),
   and — for high assurance — verify the record's Merkle path against the
   DNA-archived batch root (§7).
```

### 9.1 The four verdicts

| Verdict | Meaning |
|---|---|
| ✅ **Original verified** | Bit-for-bit identical to a registered original. |
| 🟡 **Same content, re-encoded** | Perceptually identical; bytes differ (compression/format). |
| 🔴 **Content altered** | Perceptual distance exceeds threshold — the content was modified. |
| ⚪ **Not registered** | No matching record; the system makes no claim. |

---

## 10. Threat model — what it proves, what it doesn't

### Proves
- **Integrity** : whether a file changed since registration (exact hash).
- **Content tampering** vs legitimate re-encoding (perceptual hash).
- **Provenance** : who registered it (signature) and no-later-than when (anchor).
- **Registry immutability** : the registry's history cannot be silently rewritten (DNA Merkle root).

### Does NOT prove
- That the registered original is *truthful* (someone could register a deepfake first).
- Authorship in the legal sense (only control of a key at registration time).
- Anything about *unregistered* files.

### Mitigation: trusted registrars
Evidentiary power comes from **who** registers. A record registered by a newsroom's verified key, a court, or a notary — who attest to capture conditions — carries the weight of that institution. AeonProof provides the cryptographic and archival rails; institutions provide the trust. This is identical to how all provenance systems (including C2PA) ultimately work.

---

## 11. Open questions for v0.2

1. Post-quantum signature profile (ML-DSA / SLH-DSA) alongside Ed25519.
2. Standardized perceptual thresholds per media type (`spec/thresholds.md`).
3. Revocation: how does a registrant retract a record? (Append-only + revocation records.)
4. Privacy: should the registry support **private** proofs (commit to a hash without revealing the work)? Likely yes, via commitment schemes.
5. Multi-registrant co-signing (e.g. two journalists co-attest).
6. A transparency-log format (Certificate-Transparency-style) for the hot tier.
7. Perceptual text matching (near-duplicate / paraphrase) — research needed.

---

## 12. Worked example

**Register** a 48 MB video:

1. `exact = sha256(video_bytes)` → `sha256:9f86d0…`
2. `perceptual = TMK+PDQF(video)` → `tmk+pdqf:f8f0e1…`
3. Build the record (§2), JCS-canonicalize without `signature`, sign with Ed25519.
4. Wrap as an AeonScript block:
   ```
   |AEONSCRIPT=0.1;L1=L1-4;L4=rs255-223;TYPE=application/vnd.aeonproof+json;LEN=412;ID=9f86d0…;CHECKSUM=sha256:…|{…proof record…}
   ```
5. Add the leaf to the current month's Merkle batch.
6. End of month: the batch root → AeonScript block → synthesized to DNA → distributed to vaults.

**Verify** a suspect clip later:

1. `sha256(suspect)` → no exact match.
2. `TMK+PDQF(suspect)` → matches the registered video within threshold → 🟡 **same content, re-encoded** (it was the platform's compression).
3. Signature verifies, timestamp anchored, Merkle path checks against the DNA root → full chain of trust intact.

---

*This is a living draft. Review, critique, and pull requests welcome once published. The format is designed to be implementable in a weekend and verifiable for a millennium.*
