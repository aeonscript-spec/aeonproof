# Security Policy

AeonProof deals with cryptographic proofs of authenticity. Security reports are taken seriously.

## Reporting

**Do not open a public issue for vulnerabilities.** Instead:

- GitHub Private Vulnerability Reporting: https://github.com/aeonscript-spec/aeonproof/security/advisories/new
- Email: `security@aeonscript.org` *(mailbox setup in progress — interim: mmdrame2017+aeonproof-security@gmail.com)*

We acknowledge within **72 hours** and aim for an initial assessment within **7 days**.

## In scope

- Flaws letting a tampered file pass as ✅ verified.
- Signature forgery / verification bypass.
- Canonicalization ambiguities that break signature determinism.
- Merkle-anchoring flaws that would let registry history be rewritten.
- Perceptual-hash collisions that misclassify altered content as legitimate.

## Out of scope (by design, documented)

- The system does not prove a registered original is *truthful* (see [spec §10](spec/SPEC-PROOF-RECORD-v0.1.md)). Registering a fake as "original" is a trust-model limitation, not a vulnerability — mitigated by trusted registrars.
- Third-party browser / dependency issues unrelated to AeonProof.

## Note on the demo

The public demo runs entirely in the browser and stores keys/records in `localStorage` for demonstration only. It is **not** a production key-management system. Do not register sensitive originals in the public demo expecting production-grade custody.
