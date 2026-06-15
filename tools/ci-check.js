#!/usr/bin/env node
// AeonProof CI check — static-site sanity gate.
// - syntax-checks the JS embedded in demo.html (compile-only, no execution)
// - verifies key content markers in index.html and demo.html
// - checks the CNAME and spec version are consistent
// Exits non-zero on any failure.

const fs = require("fs");
const vm = require("vm");
const path = require("path");

const root = path.resolve(__dirname, "..");
let failures = 0;
const ok = (m) => console.log("  ok   " + m);
const bad = (m) => { console.log("  FAIL " + m); failures++; };

function read(rel) {
  const p = path.join(root, rel);
  if (!fs.existsSync(p)) { bad(`missing file: ${rel}`); return null; }
  return fs.readFileSync(p, "utf8");
}

// 1) demo.html embedded JS must compile
console.log("[1] demo.html embedded script syntax");
const demo = read("demo.html");
if (demo) {
  const m = demo.match(/<script>([\s\S]*?)<\/script>/);
  if (!m) bad("no <script> block found in demo.html");
  else {
    try { new vm.Script(m[1]); ok(`script compiles (${m[1].length} chars)`); }
    catch (e) { bad("demo.html script syntax: " + e.message); }
  }
  // sanity: real crypto, not a stub left behind
  if (demo.includes('crypto.subtle.sign')) ok("uses real Web Crypto signing");
  else bad("demo.html no longer calls crypto.subtle.sign");
}

// 2) index.html content markers + balanced <section>
console.log("[2] index.html landing");
const index = read("index.html");
if (index) {
  index.includes("AeonProof") ? ok("contains 'AeonProof'") : bad("index.html missing 'AeonProof'");
  const open = (index.match(/<section/g) || []).length;
  const close = (index.match(/<\/section>/g) || []).length;
  open === close ? ok(`<section> balanced (${open})`) : bad(`<section> unbalanced: ${open} open / ${close} close`);
  index.includes("demo.html") ? ok("links to demo.html") : bad("index.html does not link to demo.html");
}

// 3) CNAME
console.log("[3] custom domain");
const cname = read("CNAME");
if (cname) {
  cname.trim() === "proof.aeonscript.org" ? ok("CNAME = proof.aeonscript.org") : bad(`unexpected CNAME: ${cname.trim()}`);
}

// 4) spec version consistency
console.log("[4] spec version consistency");
const spec = read("spec/SPEC-PROOF-RECORD-v0.1.md");
if (spec) {
  /Version\*\* *: *0\.1/.test(spec) || spec.includes("0.1") ? ok("spec declares v0.1") : bad("spec version marker not found");
}
if (demo && !demo.includes("AEONSCRIPT=0.1")) bad("demo.html no longer emits AEONSCRIPT=0.1 envelope");
else if (demo) ok("demo emits AeonScript v0.1 envelope");

console.log(failures === 0 ? "\nRESULT: all checks passed." : `\nRESULT: ${failures} failure(s).`);
process.exit(failures === 0 ? 0 : 1);
