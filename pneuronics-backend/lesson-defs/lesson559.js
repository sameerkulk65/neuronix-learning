module.exports = {
 "phaseId": "6a369d5e66020ed05b3214c3",
 "moduleId": "6ab6d18eb7119db96ad77968",
 "order": 2,
 "type": "interactive",
 "duration": 55,
 "difficulty": "advanced",
 "status": "published",
 "title": "Skill Evals, Packaging, and Portability (Part 3 of 3) — Manifests, Portability, Evidence Roots and the Release Gate",
 "titleKn": "Skill Evals, Packaging, ಮತ್ತು Portability (Part 3 of 3) — Manifests, Portability, Evidence Roots ಮತ್ತು Release Gate",
 "desc": "Verify the installed tree against a SHA-256 manifest, model host support as a capability matrix that refuses silent degradation, bind all evidence into an evidenceRoot, see why local hashes are integrity but not trust, and combine the layers in a gate that separates fixturePassed, localEvidenceReady and productionReady.",
 "descKn": "installed tree ಅನ್ನು SHA-256 manifest ವಿರುದ್ಧ ಪರಿಶೀಲಿಸಿ, host ಬೆಂಬಲವನ್ನು capability matrix ಆಗಿ ಮಾದರಿ ಮಾಡಿ, evidenceRoot, ಸ್ಥಳೀಯ hash ಸಮಗ್ರತೆ ಆದರೆ ವಿಶ್ವಾಸ ಅಲ್ಲ, ಮತ್ತು release gate.",
 "objectives": [
  "Build and verify a manifest that hashes every file except itself, and detect missing, changed and unexpected files.",
  "Distinguish integrity (bytes match) from authenticity (who vouched) and explain why a manifest cannot hash itself.",
  "Build a host capability matrix with supported, adapted, degraded and unsupported outcomes and refuse silent degradation.",
  "Bind evidence with a canonical-JSON evidenceRoot and explain why an out-of-band trusted digest is needed.",
  "Run a layer-preserving release gate and explain checksPassed, fixturePassed, localEvidenceReady, trustAnchorValid, productionReady and passed."
 ],
 "objectivesKn": [
  "ತನ್ನನ್ನು ಬಿಟ್ಟು ಉಳಿದೆಲ್ಲವನ್ನೂ hash ಮಾಡುವ manifest ನಿರ್ಮಿಸಿ ಪರಿಶೀಲಿಸಿ.",
  "ಸಮಗ್ರತೆ ಮತ್ತು ಪ್ರಾಮಾಣಿಕತೆ ಬೇರ್ಪಡಿಸಿ.",
  "capability matrix ನಿರ್ಮಿಸಿ.",
  "evidenceRoot ಮತ್ತು ಹೊರಗಿನ ವಿಶ್ವಾಸ digest ವಿವರಿಸಿ.",
  "release gate ಚಲಾಯಿಸಿ."
 ],
 "blocks": [
  {
   "type": "heading",
   "data": {
    "textEn": "Skill Evals, Packaging, and Portability (Part 3 of 3)",
    "textKn": "Skill Evals, Packaging, and Portability (Part 3 of 3)",
    "level": "H1"
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "Lesson Info",
    "headingKn": "Lesson ಮಾಹಿತಿ",
    "bodyEn": "• Type: Build · Language: Python (stdlib only) · Time: ~50 minutes. This module builds one evaluator across six layers. The source lesson's code is the model for the data structures; the fixtures, thresholds and demo data are ours, and every output shown was genuinely produced by running the program in temporary directories. The routers are deterministic teaching stand-ins and prove nothing about a production model router. The source's real-host checkpoint (install into an actual agent host and probe it) was NOT performed here.",
    "bodyKn": "• Type: Build · Language: Python (stdlib only) · Time: ~50 ನಿಮಿಷಗಳು. ಈ module ಆರು ಪದರಗಳ ಒಂದು evaluator ನಿರ್ಮಿಸುತ್ತದೆ. ಡೇಟಾ ರಚನೆಗಳಿಗೆ ಮೂಲ ಪಾಠದ ಕೋಡ್ ಮಾದರಿ; fixtures, ಮಿತಿಗಳು, demo ಡೇಟಾ ನಮ್ಮವು. ಎಲ್ಲಾ outputs ನಿಜ run ಗಳಿಂದ. routers ಬೋಧನಾ ಬದಲಿಗಳು; production router ಬಗ್ಗೆ ಏನೂ ಸಾಬೀತುಪಡಿಸುವುದಿಲ್ಲ. ಮೂಲದ real-host checkpoint ಇಲ್ಲಿ ನಡೆಸಿಲ್ಲ."
   }
  },
  {
   "type": "heading",
   "data": {
    "textEn": "Layer 6: The Installed Tree Is What Runs",
    "textKn": "Layer 6: Installed Tree ಚಲಿಸುತ್ತದೆ",
    "level": "H2"
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "Source Success Is Not Installation Success",
    "headingKn": "Source ಯಶಸ್ಸು ≠ Installation ಯಶಸ್ಸು",
    "bodyEn": "Tests against the source tree can all pass while an installer copies only SKILL.md and scripts and drops references/release-policy.md. Installation can lose a file, flatten a directory, rewrite a name, leave a stale old file, change permissions or alter bytes. The complete directory is the release unit, so the installed copy needs its own validation: build a manifest from the source, install the complete tree, verify paths and hashes, discover the installed skill and run an installed-copy smoke test.",
    "bodyKn": "source ಪರೀಕ್ಷೆಗಳು ಪಾಸ್ ಆದರೂ installer references ಬಿಡಬಹುದು. ಇಡೀ ಡೈರೆಕ್ಟರಿ ಬಿಡುಗಡೆ ಘಟಕ; installed ನಕಲಿಗೂ ಪರಿಶೀಲನೆ ಬೇಕು."
   }
  },
  {
   "type": "code",
   "data": {
    "filename": "eval_lab.py",
    "headingEn": "sha256_file, build_manifest and verify_manifest",
    "headingKn": "sha256_file, build_manifest ಮತ್ತು verify_manifest",
    "descEn": "Files are hashed as raw bytes in 1 MiB chunks and keyed by canonical relative POSIX paths. The manifest deliberately excludes assets/manifest.json: a file cannot contain a stable hash of its own complete contents, because inserting the hash changes the bytes, which changes the hash. The verifier reports three failure classes separately: missing, changed and unexpected.",
    "descKn": "ಫೈಲ್‌ಗಳು ಕಚ್ಚಾ ಬೈಟ್‌ಗಳಾಗಿ hash ಆಗುತ್ತವೆ. manifest ತನ್ನನ್ನು hash ಮಾಡುವುದಿಲ್ಲ. ಮೂರು ವೈಫಲ್ಯ ವರ್ಗ: missing, changed, unexpected.",
    "code": "# ---------------- Layer 6: packaging and portability ----------------\nRESERVED_MANIFEST_PATH = \"assets/manifest.json\"\n\ndef sha256_file(path):\n    d = hashlib.sha256()\n    with path.open(\"rb\") as h:\n        for chunk in iter(lambda: h.read(1024 * 1024), b\"\"): d.update(chunk)\n    return \"sha256:\" + d.hexdigest()\n\n@dataclass\nclass PackageManifest:\n    manifest_version: int\n    algorithm: str\n    name: str\n    version: str\n    source_revision: str\n    files: dict\n    required_capabilities: tuple\n    optional_capabilities: tuple\n\ndef build_manifest(root, *, name, version, source_revision, required_capabilities, optional_capabilities):\n    files = {}\n    for p in sorted(root.rglob(\"*\")):\n        if not p.is_file(): continue\n        rel = p.relative_to(root).as_posix()\n        if rel == RESERVED_MANIFEST_PATH: continue\n        files[rel] = sha256_file(p)\n    return PackageManifest(1, \"sha256\", name, version, source_revision, files, required_capabilities, optional_capabilities)\n\n@dataclass\nclass ManifestVerification:\n    passed: bool\n    missing_files: list\n    changed_files: list\n    unexpected_files: list\n\ndef verify_manifest(root, manifest):\n    actual = {p.relative_to(root).as_posix() for p in root.rglob(\"*\") if p.is_file() and p.relative_to(root).as_posix() != RESERVED_MANIFEST_PATH}\n    missing, changed = [], []\n    for rel, digest in manifest.files.items():\n        p = root / rel\n        if not p.is_file(): missing.append(rel); continue\n        if not hmac.compare_digest(sha256_file(p), digest): changed.append(rel)\n    unexpected = sorted(actual - set(manifest.files))\n    return ManifestVerification(not (missing or changed or unexpected), sorted(missing), sorted(changed), unexpected)"
   }
  },
  {
   "type": "output",
   "data": {
    "output": "(definitions only: no output yet)"
   }
  },
  {
   "type": "code",
   "data": {
    "filename": "eval_lab.py",
    "headingEn": "A clean install, then drift",
    "headingKn": "ಸ್ವಚ್ಛ install, ನಂತರ drift",
    "descEn": "The clean tree matches its manifest. Then three things happen: the policy reference is edited, a stale script from an old version is left behind, and the inspection script goes missing. The verifier reports exactly one file in each class. The stale file is the upgrade problem: source tests for the new version pass while the installed copy still exposes obsolete behaviour.",
    "descKn": "ಸ್ವಚ್ಛ tree manifest ಗೆ ಹೊಂದುತ್ತದೆ. ನಂತರ ಒಂದು ಫೈಲ್ ಬದಲಾಯಿತು, ಹಳೆಯ script ಉಳಿಯಿತು, ಒಂದು script ಕಾಣೆಯಾಯಿತು. ಪ್ರತಿ ವರ್ಗಕ್ಕೆ ಒಂದು.",
    "code": "manifest = build_manifest(root, name=\"release-readiness\", version=\"1.2.0\", source_revision=\"abc123\",\n                          required_capabilities=(\"filesystem.read\", \"process.run\"), optional_capabilities=(\"model_implicit_invocation\",))\nprint(\"  clean install:\", verify_manifest(root, manifest))\n(root / \"references\" / \"release-policy.md\").write_text(\"Policy: tests may fail.\", encoding=\"utf-8\")\n(root / \"scripts\" / \"old_script.py\").write_text(\"stale\", encoding=\"utf-8\")\n(root / \"scripts\" / \"inspect_release.py\").unlink()\nprint(\"  after drift:\", verify_manifest(root, manifest))"
   }
  },
  {
   "type": "output",
   "data": {
    "output": "files: {'references/release-policy.md': 'sha256:302fc8fc706c...', 'scripts/inspect_release.py': 'sha256:f56bf51568aa...', 'SKILL.md': 'sha256:e15e593ce067...'}\n  clean install: ManifestVerification(passed=True, missing_files=[], changed_files=[], unexpected_files=[])\n  after drift (changed policy, stale script, missing script): ManifestVerification(passed=False, missing_files=['scripts/inspect_release.py'], changed_files=['references/release-policy.md'], unexpected_files=['scripts/old_script.py'])"
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "Integrity Is Not Authenticity",
    "headingKn": "ಸಮಗ್ರತೆ ≠ ಪ್ರಾಮಾಣಿಕತೆ",
    "bodyEn": "A hash says these bytes match those expected bytes. It does not say who produced the expected digest, and it does not say the bytes are harmless. Someone who can change both the file and the manifest can recompute the hash. Manifest authenticity must come from an outer trusted channel such as a signed release or a trusted registry record.",
    "bodyKn": "hash \"ಈ ಬೈಟ್‌ಗಳು ಆ ಬೈಟ್‌ಗಳಿಗೆ ಹೊಂದುತ್ತವೆ\" ಎನ್ನುತ್ತದೆ. ಯಾರು ಹೇಳಿದರು ಎಂದಲ್ಲ."
   }
  },
  {
   "type": "heading",
   "data": {
    "textEn": "The Capability Matrix",
    "textKn": "Capability Matrix",
    "level": "H2"
   }
  },
  {
   "type": "code",
   "data": {
    "filename": "eval_lab.py",
    "headingEn": "Host capabilities: supported, adapted, degraded, unsupported",
    "headingKn": "Host capabilities: supported, adapted, degraded, unsupported",
    "descEn": "The question is not \"does the host support skills?\" but which required and optional capabilities it provides. Each is classified as supported natively, supported through an adapter, degraded with a documented fallback, or unsupported. Host B runs process.run through an adapter and degrades implicit invocation to explicit activation, visibly. Host C cannot satisfy a required capability, so installation must not pretend otherwise.",
    "descKn": "ಪ್ರಶ್ನೆ \"host skills ಬೆಂಬಲಿಸುತ್ತದೆಯೇ\" ಅಲ್ಲ, ಯಾವ capabilities. Host B adapter ಮತ್ತು ಗೋಚರ ಅವನತಿ; Host C ಕಡ್ಡಾಯ capability ಗೆ ಅಸಮರ್ಥ.",
    "code": "@dataclass\nclass HostCapabilities:\n    host_name: str\n    capabilities: frozenset\n    adapters: dict\n    fallbacks: dict\n\n@dataclass\nclass CapabilityResult:\n    capability: str\n    status: str\n    detail: str\n\ndef evaluate_host_capability(host, capability, *, required):\n    if capability in host.capabilities: return CapabilityResult(capability, \"supported\", \"native\")\n    if capability in host.adapters: return CapabilityResult(capability, \"adapted\", host.adapters[capability])\n    if capability in host.fallbacks: return CapabilityResult(capability, \"degraded\", host.fallbacks[capability])\n    return CapabilityResult(capability, \"unsupported\", \"required capability missing\" if required else \"optional capability unavailable\")\n\ndef portability_matrix(manifest, hosts):\n    return {h.host_name: [evaluate_host_capability(h, c, required=True) for c in manifest.required_capabilities] +\n                         [evaluate_host_capability(h, c, required=False) for c in manifest.optional_capabilities] for h in hosts}\n\ndef portability_required_capabilities_pass(manifest, matrix):\n    required = set(manifest.required_capabilities)\n    return not any(r.capability in required and r.status == \"unsupported\" for results in matrix.values() for r in results)\n\nhosts = [HostCapabilities(\"host-a\", frozenset({\"filesystem.read\", \"process.run\", \"model_implicit_invocation\"}), {}, {}),\n         HostCapabilities(\"host-b\", frozenset({\"filesystem.read\"}), {\"process.run\": \"external-process-adapter\"}, {\"model_implicit_invocation\": \"activate explicitly\"}),\n         HostCapabilities(\"host-c\", frozenset({\"filesystem.read\"}), {}, {})]\nmatrix = portability_matrix(manifest, hosts)\nfor h, results in matrix.items(): print(f\"  {h}:\", [(r.capability, r.status) for r in results])\nprint(\"  required capabilities satisfied on every host:\", portability_required_capabilities_pass(manifest, matrix))"
   }
  },
  {
   "type": "output",
   "data": {
    "output": "host-a: [('filesystem.read', 'supported'), ('process.run', 'supported'), ('model_implicit_invocation', 'supported')]\n  host-b: [('filesystem.read', 'supported'), ('process.run', 'adapted'), ('model_implicit_invocation', 'degraded')]\n  host-c: [('filesystem.read', 'supported'), ('process.run', 'unsupported'), ('model_implicit_invocation', 'unsupported')]\n  required capabilities satisfied on every host: False"
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "Silent Degradation Is the Bug to Avoid",
    "headingKn": "Silent Degradation ತಪ್ಪಿಸಬೇಕಾದ ದೋಷ",
    "bodyEn": "A host that says \"installed successfully\" while quietly ignoring references, scripts or implicit routing has silently degraded. The honest report says references supported, scripts unsupported, implicit invocation unavailable, fallback explicit activation. These host results here are declared stand-ins: a capability claim needs its own test or a current official contract, and host behaviour changes over time.",
    "bodyKn": "\"ಯಶಸ್ವಿಯಾಗಿ ಇನ್‌ಸ್ಟಾಲ್\" ಎಂದು ಹೇಳಿ ಮೌನವಾಗಿ ಅವನತಿಯಾದರೆ ಅದು silent degradation. ಇವು ಘೋಷಿತ ಬದಲಿಗಳು."
   }
  },
  {
   "type": "heading",
   "data": {
    "textEn": "Evidence Root and Trust",
    "textKn": "Evidence Root ಮತ್ತು Trust",
    "level": "H2"
   }
  },
  {
   "type": "code",
   "data": {
    "filename": "eval_lab.py",
    "headingEn": "Canonical JSON, evidenceRoot and out-of-band attestation",
    "headingKn": "Canonical JSON, evidenceRoot ಮತ್ತು ಹೊರಗಿನ attestation",
    "descEn": "Structured evidence is serialized canonically (sorted keys, no whitespace) and hashed into one evidenceRoot, so changing any bound section changes the root. But a local hash only proves internal consistency: someone who controls the bundle can edit the evidence, recompute the root and rewrite the attestation, and every local check still passes. What breaks the forgery is the expected attestation digest, which must arrive from an out-of-band trusted policy, CI secret, signed release or registry decision. In this demo we simulate that channel by computing the trusted digest before the forgery, which is only a stand-in for a genuinely separate channel.",
    "descKn": "evidence ಅನ್ನು canonical ಆಗಿ serialize ಮಾಡಿ ಒಂದು evidenceRoot ಗೆ hash ಮಾಡಲಾಗುತ್ತದೆ. ಆದರೆ ಸ್ಥಳೀಯ hash ಆಂತರಿಕ ಸಂಗತತೆ ಮಾತ್ರ. ಹೊರಗಿನ ವಿಶ್ವಾಸಾರ್ಹ digest ಪ್ರತ್ಯೇಕ ಮಾರ್ಗದಿಂದ ಬರಬೇಕು; ಇಲ್ಲಿ ಅದನ್ನು ಅನುಕರಿಸಲಾಗಿದೆ.",
    "code": "# ---------------- provenance, evidence root, attestation ----------------\ndef canonical_json_bytes(value):\n    return json.dumps(value, sort_keys=True, separators=(\",\", \":\"), ensure_ascii=False).encode(\"utf-8\")\n\ndef sha256_object(value):\n    return \"sha256:\" + hashlib.sha256(canonical_json_bytes(value)).hexdigest()\n\ndef build_evidence_root(**sections):\n    return sha256_object(sections)\n\n@dataclass\nclass AttestationValidation:\n    passed: bool\n    errors: list\n\ndef validate_attestation(*, attestation_bytes, evidence_root, trusted_attestation_sha256):\n    errors = []\n    actual = \"sha256:\" + hashlib.sha256(attestation_bytes).hexdigest()\n    if not hmac.compare_digest(actual, trusted_attestation_sha256): errors.append(\"Attestation byte digest does not match trusted expected digest.\")\n    try: payload = json.loads(attestation_bytes.decode(\"utf-8\"))\n    except (UnicodeDecodeError, json.JSONDecodeError): return AttestationValidation(False, errors + [\"Attestation is not valid UTF-8 JSON.\"])\n    if payload.get(\"attestationVersion\") != 1: errors.append(\"Unsupported attestationVersion.\")\n    if payload.get(\"evidenceRoot\") != evidence_root: errors.append(\"Attestation evidenceRoot mismatch.\")\n    return AttestationValidation(not errors, errors)\n\nroot1 = build_evidence_root(**sections)\nroot2 = build_evidence_root(**tampered)\nprint(\"  edit any evidence -> root changes:\", root1 != root2)\nattest = canonical_json_bytes({\"attestationVersion\": 1, \"evidenceRoot\": root1})\ntrusted = \"sha256:\" + hashlib.sha256(attest).hexdigest()   # in real life this arrives OUT OF BAND\nprint(\"  genuine bundle vs trusted digest:\", validate_attestation(attestation_bytes=attest, evidence_root=root1, trusted_attestation_sha256=trusted))\nforged = canonical_json_bytes({\"attestationVersion\": 1, \"evidenceRoot\": root2})\nprint(\"    local consistency check passes:\", json.loads(forged)[\"evidenceRoot\"] == root2)\nprint(\"    against the trusted out-of-band digest:\", validate_attestation(attestation_bytes=forged, evidence_root=root2, trusted_attestation_sha256=trusted))"
   }
  },
  {
   "type": "output",
   "data": {
    "output": "evidenceRoot: sha256:7d6f1b9cf97b4fd7f188c6e...\n  edit any evidence -> root changes: True\n  genuine bundle vs trusted digest: AttestationValidation(passed=True, errors=[])\n  attacker edits evidence AND recomputes root AND rewrites attestation:\n    local consistency check passes: True\n    against the trusted out-of-band digest: AttestationValidation(passed=False, errors=['Attestation byte digest does not match trusted expected digest.'])"
   }
  },
  {
   "type": "heading",
   "data": {
    "textEn": "The Release Gate",
    "textKn": "Release Gate",
    "level": "H2"
   }
  },
  {
   "type": "code",
   "data": {
    "filename": "eval_lab.py",
    "headingEn": "ReleaseGatePolicy and run_release_gate",
    "headingKn": "ReleaseGatePolicy ಮತ್ತು run_release_gate",
    "descEn": "Thresholds are declared before looking at results (structure errors 0, precision at least 0.95, recall at least 0.90, at most 1 near-miss false positive, behavior at least 0.90 with no regression, scripts pass, safety 1.0, required capabilities not unsupported, installed tree matches manifest). Each layer produces its own LayerResult and the gate combines them with all(), never an average. passed follows productionReady, not fixturePassed.",
    "descKn": "ಮಿತಿಗಳನ್ನು ಫಲಿತಾಂಶ ನೋಡುವ ಮೊದಲೇ ಘೋಷಿಸಲಾಗುತ್ತದೆ. ಪ್ರತಿ ಪದರ ತನ್ನದೇ LayerResult; gate all() ಬಳಸುತ್ತದೆ, ಸರಾಸರಿ ಅಲ್ಲ. passed = productionReady.",
    "code": "@dataclass\nclass ReleaseGatePolicy:\n    structure_errors_max: int = 0\n    routing_precision_min: float = 0.95\n    routing_recall_min: float = 0.90\n    near_miss_false_positives_max: int = 1\n    behavior_pass_rate_min: float = 0.90\n    no_regression_vs_baseline: bool = True\n    scripts_must_pass: bool = True\n    safety_pass_rate_min: float = 1.0\n    installed_tree_must_match_manifest: bool = True\n\n@dataclass\nclass LayerResult:\n    name: str\n    passed: bool\n    details: dict\n\n@dataclass\nclass ReleaseReport:\n    layers: list\n    checks_passed: bool\n    fixture_passed: bool\n    local_evidence_ready: bool\n    trust_anchor_valid: bool\n    production_ready: bool\n    passed: bool\n\n@dataclass\nclass ReleaseGateInputs:\n    lint_issues: list\n    trigger_observations: list\n    trigger_metrics: ClassificationMetrics\n    behavior_comparison: BehaviorComparison\n    treatment_pass_rate: float\n    script_summary: EvidenceSummary\n    safety_summary: EvidenceSummary\n    manifest_verification: ManifestVerification\n    portability: dict\n    manifest: PackageManifest\n    local_evidence_ready: bool\n    trust_anchor_valid: bool\n\ndef run_release_gate(i, p):\n    nm = count_near_miss_false_positives(i.trigger_observations)\n    safety_rate = evidence_pass_rate(i.safety_summary)\n    behavior = i.treatment_pass_rate >= p.behavior_pass_rate_min and not (p.no_regression_vs_baseline and i.behavior_comparison.regressed)\n    layers = [\n        LayerResult(\"structure\", len(i.lint_issues) <= p.structure_errors_max, {\"issue_count\": len(i.lint_issues)}),\n        LayerResult(\"routing\", i.trigger_metrics.precision >= p.routing_precision_min and i.trigger_metrics.recall >= p.routing_recall_min and nm <= p.near_miss_false_positives_max,\n                    {\"precision\": i.trigger_metrics.precision, \"recall\": i.trigger_metrics.recall, \"near_miss_false_positives\": nm}),\n        LayerResult(\"behavior\", behavior, {\"treatment\": i.treatment_pass_rate, \"baseline\": i.behavior_comparison.baseline_pass_rate, \"regressed\": i.behavior_comparison.regressed}),\n        LayerResult(\"scripts\", i.script_summary.passed if p.scripts_must_pass else True, {\"passed\": i.script_summary.passed_count, \"total\": i.script_summary.total}),\n        LayerResult(\"safety\", safety_rate >= p.safety_pass_rate_min, {\"pass_rate\": safety_rate, \"failed\": i.safety_summary.failed}),\n        LayerResult(\"portability\", portability_required_capabilities_pass(i.manifest, i.portability), {\"hosts\": list(i.portability)}),\n        LayerResult(\"package\", i.manifest_verification.passed if p.installed_tree_must_match_manifest else True,\n                    {\"missing\": i.manifest_verification.missing_files, \"changed\": i.manifest_verification.changed_files, \"unexpected\": i.manifest_verification.unexpected_files}),\n    ]\n    checks = all(l.passed for l in layers)\n    prod = checks and i.local_evidence_ready and i.trust_anchor_valid\n    return ReleaseReport(layers, checks, checks, i.local_evidence_ready, i.trust_anchor_valid, prod, prod)"
   }
  },
  {
   "type": "output",
   "data": {
    "output": "(definitions only: no output yet)"
   }
  },
  {
   "type": "code",
   "data": {
    "filename": "eval_lab.py",
    "headingEn": "The same evidence, three readiness claims",
    "headingKn": "ಅದೇ ಸಾಕ್ಷ್ಯ, ಮೂರು ಸಿದ್ಧತೆ ಹೇಳಿಕೆಗಳು",
    "descEn": "All seven layers pass in every row, yet passed is False until both local evidence and an external trust anchor are present. In this demo local_evidence_ready and trust_anchor_valid are supplied as inputs to show the gate's logic; section 9 above shows how they would be derived. Then one failing safety case (with everything else perfect) fails the whole gate at the safety layer, and the naive keyword router fails the routing layer with precision 0.5.",
    "descKn": "ಎಲ್ಲಾ ಪದರ ಪಾಸ್, ಆದರೂ local evidence ಮತ್ತು trust anchor ಇಲ್ಲದೆ passed False. ಈ demo ನಲ್ಲಿ ಅವನ್ನು ಇನ್‌ಪುಟ್ ಆಗಿ ನೀಡಲಾಗಿದೆ. ಒಂದು safety ವೈಫಲ್ಯ ಇಡೀ gate ವಿಫಲ.",
    "code": "line(\"all layers pass, no evidence, no trust\", gate(False, False))\nline(\"all layers pass, local evidence, no trust\", gate(True, False))\nline(\"all layers pass, local evidence, trust anchor\", gate(True, True))\nr_bad = gate(True, True, safety_checks=one_fail)\nline(\"one safety case fails (others perfect)\", r_bad)\nprint(\"   failing layers:\", [l.name for l in r_bad.layers if not l.passed])\nr_naive = gate(True, True, router_obs=obs_naive)\nprint(\"   naive keyword router failing layers:\", [l.name for l in r_naive.layers if not l.passed])"
   }
  },
  {
   "type": "output",
   "data": {
    "output": "all layers pass, no evidence, no trust       checksPassed=True fixturePassed=True localEvidenceReady=False trustAnchorValid=False productionReady=False passed=False\n  all layers pass, local evidence, no trust    checksPassed=True fixturePassed=True localEvidenceReady=True trustAnchorValid=False productionReady=False passed=False\n  all layers pass, local evidence, trust anchor checksPassed=True fixturePassed=True localEvidenceReady=True trustAnchorValid=True productionReady=True passed=True\n  one safety case fails (others perfect)       checksPassed=False fixturePassed=False localEvidenceReady=True trustAnchorValid=True productionReady=False passed=False\n   failing layers: ['safety']\n   naive keyword router failing layers: ['routing'] -> {'precision': 0.5, 'recall': 1.0, 'near_miss_false_positives': 1}"
   }
  },
  {
   "type": "table",
   "data": {
    "headingEn": "Six different claims",
    "headers": [
     "Flag",
     "Claim"
    ],
    "rows": [
     [
      "checksPassed",
      "The deterministic evaluation checks passed"
     ],
     [
      "fixturePassed",
      "The declared fixture-mode evaluation passed"
     ],
     [
      "localEvidenceReady",
      "Captured evidence exists and its local integrity digests match"
     ],
     [
      "trustAnchorValid",
      "A trusted external attestation binds the evidenceRoot"
     ],
     [
      "productionReady",
      "Layers pass, local evidence is intact and the trust anchor is valid"
     ],
     [
      "passed",
      "The final release verdict; it follows productionReady"
     ]
    ]
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "Fix the Layer That Failed",
    "headingKn": "ವಿಫಲವಾದ ಪದರ ಸರಿಪಡಿಸಿ",
    "bodyEn": "Low routing recall points to the description or routing policy, not to script code. A behavior failure points to the body, references, tools or artifact contract. A script failure points to deterministic code. A safety failure points to authority, approval, sandbox or tool policy. A portability failure points to the adapter, fallback, installer or capability declaration. Adding prose to SKILL.md when the installer dropped references, or writing \"please do not inspect the home directory\" when the sandbox mounts it, repairs nothing.",
    "bodyKn": "routing ದೋಷ = description; behavior = body/references; script = ಕೋಡ್; safety = authority/sandbox; portability = adapter/installer."
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "The Real-Host Checkpoint Was Not Performed",
    "headingKn": "ನಿಜ-Host Checkpoint ನಡೆಸಿಲ್ಲ",
    "bodyEn": "A deterministic evaluator is not the final step. The source calls for installing the complete bundle into an actual host, then probing explicit invocation, implicit invocation, a near miss, reference access, script execution with evidence (resolved script path, target path, cwd, argv, exit code), approval behaviour, a second host or a declared fallback, upgrade and uninstall. Fields the host does not expose are marked unverified, never inferred from a fluent answer. None of that was done in this lesson, so the fixture results above are not a portability claim.",
    "bodyKn": "ನಿಜ host ನಲ್ಲಿ install ಮಾಡಿ ಪರೀಕ್ಷಿಸುವುದು ಮೂಲದ ಅಗತ್ಯ. ಇಲ್ಲಿ ನಡೆಸಿಲ್ಲ, ಆದ್ದರಿಂದ ಫಲಿತಾಂಶಗಳು portability ಹೇಳಿಕೆ ಅಲ್ಲ."
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "Key Takeaways",
    "headingKn": "ಮುಖ್ಯ ಅಂಶಗಳು",
    "bodyEn": "• The complete directory is the release unit: our drifted install reported one missing, one changed and one unexpected file against the manifest.\n• A manifest cannot hash itself; a hash is integrity, not authenticity.\n• Host support is a capability matrix: host B adapted process.run and degraded implicit invocation visibly; host C failed a required capability so required capabilities were not satisfied on every host.\n• We genuinely showed a forger who edits evidence, recomputes the root and rewrites the attestation still passes local consistency but fails against the trusted out-of-band digest (simulated channel).\n• The gate uses all(): safety at 0.75 failed the whole gate; all layers passing still gave passed False until local evidence and a trust anchor were present. Real-host testing was not done here.",
    "bodyKn": "• ಇಡೀ ಡೈರೆಕ್ಟರಿ ಬಿಡುಗಡೆ ಘಟಕ.\n• manifest ತನ್ನನ್ನು hash ಮಾಡಲಾರದು.\n• host ಬೆಂಬಲ capability matrix.\n• forger ಸ್ಥಳೀಯ ಪರಿಶೀಲನೆ ಪಾಸ್ ಆದರೂ ವಿಶ್ವಾಸಾರ್ಹ digest ನಲ್ಲಿ ವಿಫಲ.\n• gate all(); ನಿಜ host ಪರೀಕ್ಷೆ ನಡೆಸಿಲ್ಲ."
   }
  },
  {
   "type": "quiz",
   "data": {
    "questions": [
     {
      "q": "Why must a manifest not list its own hash?",
      "qKn": "manifest ತನ್ನದೇ hash ಪಟ್ಟಿ ಮಾಡಬಾರದು ಏಕೆ?",
      "opts": [
       "It is too large",
       "Inserting the hash changes the bytes, which changes the hash",
       "JSON forbids it",
       "It would be encrypted"
      ],
      "optsKn": [
       "ಬಹಳ ದೊಡ್ಡದು",
       "hash ಸೇರಿಸಿದರೆ ಬೈಟ್‌ಗಳು ಬದಲಾಗಿ hash ಬದಲಾಗುತ್ತದೆ",
       "JSON ನಿಷೇಧಿಸುತ್ತದೆ",
       "ಎನ್‌ಕ್ರಿಪ್ಟ್ ಆಗುತ್ತದೆ"
      ],
      "correct": 1
     },
     {
      "q": "Which is the best description of silent degradation?",
      "qKn": "silent degradation ಅನ್ನು ಯಾವುದು ಉತ್ತಮವಾಗಿ ವಿವರಿಸುತ್ತದೆ?",
      "opts": [
       "A host reporting a clear fallback",
       "A host losing required behaviour without clearly reporting it",
       "A slow install",
       "A signed release"
      ],
      "optsKn": [
       "ಸ್ಪಷ್ಟ fallback ವರದಿ",
       "ಕಡ್ಡಾಯ ವರ್ತನೆ ಕಳೆದುಕೊಂಡು ಸ್ಪಷ್ಟವಾಗಿ ವರದಿ ಮಾಡದಿರುವುದು",
       "ನಿಧಾನ install",
       "ಸಹಿ ಮಾಡಿದ ಬಿಡುಗಡೆ"
      ],
      "correct": 1
     },
     {
      "q": "Someone controls the bundle, edits the evidence, recomputes the evidenceRoot and rewrites the attestation. What stops a false production claim?",
      "qKn": "ಒಬ್ಬರು bundle ನಿಯಂತ್ರಿಸಿ evidence ಬದಲಿಸಿ evidenceRoot ಮರುಲೆಕ್ಕ ಹಾಕಿ attestation ಮರುಬರೆಯುತ್ತಾರೆ. ಸುಳ್ಳು production ಹೇಳಿಕೆ ಯಾವುದು ತಡೆಯುತ್ತದೆ?",
      "opts": [
       "Nothing",
       "The expected attestation digest arriving from an out-of-band trusted source",
       "A longer hash",
       "More local tests"
      ],
      "optsKn": [
       "ಏನೂ ಇಲ್ಲ",
       "ಹೊರಗಿನ ವಿಶ್ವಾಸಾರ್ಹ ಮೂಲದಿಂದ ಬರುವ ನಿರೀಕ್ಷಿತ attestation digest",
       "ಉದ್ದದ hash",
       "ಹೆಚ್ಚು ಸ್ಥಳೀಯ ಪರೀಕ್ಷೆ"
      ],
      "correct": 1
     },
     {
      "q": "All layers pass but there is no trust anchor. What is passed?",
      "qKn": "ಎಲ್ಲಾ ಪದರ ಪಾಸ್ ಆದರೆ trust anchor ಇಲ್ಲ. passed ಎಷ್ಟು?",
      "opts": [
       "True",
       "False: passed follows productionReady",
       "True if fixturePassed is True",
       "Undefined"
      ],
      "optsKn": [
       "True",
       "False: passed productionReady ಅನ್ನು ಅನುಸರಿಸುತ್ತದೆ",
       "fixturePassed True ಆದರೆ True",
       "ಅನಿರ್ದಿಷ್ಟ"
      ],
      "correct": 1
     },
     {
      "q": "The installer drops references/. Which repair addresses the failure?",
      "qKn": "installer references/ ಬಿಟ್ಟಿದೆ. ಯಾವ ಸರಿಪಡಿಕೆ ವೈಫಲ್ಯವನ್ನು ಪರಿಹರಿಸುತ್ತದೆ?",
      "opts": [
       "Add more explanation to SKILL.md",
       "Fix the installer or packaging and re-verify against the manifest",
       "Lower the routing threshold",
       "Rename the skill"
      ],
      "optsKn": [
       "SKILL.md ಗೆ ಹೆಚ್ಚು ವಿವರಣೆ",
       "installer/packaging ಸರಿಪಡಿಸಿ ಮತ್ತು manifest ವಿರುದ್ಧ ಮರುಪರಿಶೀಲಿಸಿ",
       "routing ಮಿತಿ ಕಡಿಮೆ ಮಾಡಿ",
       "skill ಹೆಸರು ಬದಲಿಸಿ"
      ],
      "correct": 1
     }
    ]
   }
  }
 ]
};
