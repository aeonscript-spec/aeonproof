# Contribuer à AeonProof

Merci de votre intérêt. AeonProof est un projet ouvert — la confiance dans la vérité ne devrait appartenir à personne.

---

## Démarrer en 2 minutes

1. Lire le [MANIFESTO](MANIFESTO.md) (le pourquoi) puis la [spec](spec/SPEC-PROOF-RECORD-v0.1.md) (le comment).
2. Essayer le [démo](https://proof.aeonscript.org/demo.html) : enregistrer un fichier, le modifier, re-vérifier.
3. Faire tourner le contrôle local : `node tools/ci-check.js`.

---

## Cinq façons de contribuer

### 1. Développeur (crypto, JS, Rust, Python…)
**Effort minimum utile** : 1 PR corrigeant une faute dans la spec ou le démo.
- Implémenter le vérificateur AeonProof dans un autre langage.
- Brancher les **vrais hash perceptuels** (PDQ images, Chromaprint audio, TMK+PDQF vidéo) à la place des approximations du démo.
- Construire l'**ancrage Merkle → ADN** (via AeonScript) du registre.

### 2. Cryptographe / chercheur sécurité
**Effort minimum utile** : 1 commentaire en Discussion sur une faiblesse de la spec.
- Auditer la canonicalisation (JCS), le schéma de signature, le modèle de menace (§10).
- Proposer un profil de signature post-quantique (ML-DSA / SLH-DSA).
- Challenger : peut-on faire passer un fichier altéré pour ✅ vérifié ?

### 3. Institution de confiance (média, tribunal, notaire, archive)
**Effort minimum utile** : nous dire ce qu'il vous faudrait pour adopter.
- Le modèle d'**enregistreur de confiance** (§10) ne vaut que par vous. Vos exigences façonnent la v0.2.

### 4. Connecteur / réseau
**Effort minimum utile** : une mise en relation.
- Présenter AeonProof à une rédaction, une fac, une fondation, un journaliste tech.

### 5. Traducteur
- Traduire le MANIFESTO ou la page de présentation dans votre langue → `translations/<langue>/`.

---

## Règles communes

- **Discussions** : questions, idées, débats de design → [Discussions](https://github.com/aeonscript-spec/aeonproof/discussions).
- **Issues** : bugs et tâches précises (templates fournis).
- **Sécurité** : ne JAMAIS ouvrir d'issue publique pour une vulnérabilité → voir [SECURITY](.github/SECURITY.md).
- **Code de conduite** : [Contributor Covenant](CODE_OF_CONDUCT.md).

### Workflow
1. Fork + branche depuis `main`.
2. `node tools/ci-check.js` doit passer.
3. **Jamais** de clé privée ou secret commité.
4. Si vous touchez à la crypto : signature/vérification doivent toujours round-tripper.
5. PR avec le template.

---

## Licence

Code : **MIT**. Spec & docs : **CC-BY-SA 4.0**. Pas de CLA — soumettre une PR vaut acceptation.

Merci de bâtir un socle de confiance pour l'ère des faux.
