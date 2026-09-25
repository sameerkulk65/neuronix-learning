"""Skill release evaluator: the lesson's six layers in one runnable program.
Structure follows the pasted lesson's code; fixtures, thresholds and demo data are ours.
The routers are deterministic teaching stand-ins, NOT evidence about a production model router."""
from __future__ import annotations
import hashlib, hmac, json, tempfile
from dataclasses import dataclass, field
from pathlib import Path
from typing import Callable

# ---------------- Layer 1: package structure ----------------
@dataclass
class LintIssue:
    code: str
    message: str
    path: str | None = None

def lint_package(root: Path) -> list:
    issues = []
    if not root.exists(): return [LintIssue("E_ROOT_MISSING", "Package root does not exist.", str(root))]
    if not root.is_dir(): return [LintIssue("E_ROOT_NOT_DIRECTORY", "Package root must be a directory.", str(root))]
    skill = root / "SKILL.md"
    if not skill.exists(): return [LintIssue("E_SKILL_MISSING", "SKILL.md is required at package root.", str(skill))]
    if not skill.is_file(): return [LintIssue("E_SKILL_NOT_FILE", "SKILL.md must be a regular file.", str(skill))]
    text = skill.read_text(encoding="utf-8")
    if "## Output contract" not in text: issues.append(LintIssue("E_OUTPUT_CONTRACT", "Missing ## Output contract section.", str(skill)))
    if "## Failure behavior" not in text: issues.append(LintIssue("E_FAILURE_BEHAVIOR", "Missing ## Failure behavior section.", str(skill)))
    return issues

# ---------------- Layer 2: trigger routing ----------------
@dataclass
class TriggerCase:
    case_id: str
    prompt: str
    should_trigger: bool
    category: str

@dataclass
class TriggerObservation:
    case_id: str
    category: str
    expected: bool
    predicted: bool

@dataclass
class ClassificationMetrics:
    true_positives: int
    false_positives: int
    false_negatives: int
    true_negatives: int
    precision: float
    recall: float
    f1: float
    accuracy: float

Router = Callable[[str], bool]

TRIGGER_CASES = [
    TriggerCase("p1", "Can version 3.1.0 ship?", True, "positive"),
    TriggerCase("p2", "Audit this tag before we publish it.", True, "paraphrased-positive"),
    TriggerCase("p3", "Check whether this candidate is safe to release.", True, "paraphrased-positive"),
    TriggerCase("n1", "Explain batch normalization.", False, "clear-negative"),
    TriggerCase("n2", "Why did the package build fail?", False, "near-miss"),
    TriggerCase("n3", "Draft the release notes.", False, "competing-skill"),
    TriggerCase("n4", "Do not run release readiness. Explain this traceback.", False, "adversarial"),
]

def teaching_router(prompt):
    text = prompt.lower()
    positive = ("can version", "ship", "before we publish", "candidate", "safe to release", "release readiness")
    negative = ("do not run release readiness", "batch normalization", "release notes", "stack trace", "traceback")
    if any(s in text for s in negative): return False
    return any(s in text for s in positive)

def keyword_router(prompt):
    """A deliberately naive router: any release-ish word triggers."""
    return any(w in prompt.lower() for w in ("release", "package", "build", "version", "publish", "ship"))

def evaluate_triggers(cases, router):
    return [TriggerObservation(c.case_id, c.category, c.should_trigger, router(c.prompt)) for c in cases]

def classification_metrics(obs):
    tp = sum(1 for o in obs if o.expected and o.predicted); fp = sum(1 for o in obs if not o.expected and o.predicted)
    fn = sum(1 for o in obs if o.expected and not o.predicted); tn = sum(1 for o in obs if not o.expected and not o.predicted)
    precision = tp / (tp + fp) if tp + fp else 0.0
    recall = tp / (tp + fn) if tp + fn else 0.0
    f1 = 2 * precision * recall / (precision + recall) if precision + recall else 0.0
    total = tp + fp + fn + tn
    return ClassificationMetrics(tp, fp, fn, tn, round(precision, 4), round(recall, 4), round(f1, 4), round((tp + tn) / total if total else 0.0, 4))

def count_near_miss_false_positives(obs):
    return sum(1 for o in obs if o.category == "near-miss" and o.expected is False and o.predicted is True)

# ---------------- Layer 3: artifact behavior ----------------
@dataclass
class ArtifactContract:
    artifact_name: str
    required_fields: tuple
    allowed_recommendations: tuple
    evidence_required_for_each_check: bool
    publish_side_effect_allowed: bool

@dataclass
class ArtifactEvaluation:
    passed: bool
    errors: list

@dataclass
class BehaviorRun:
    task_id: str
    condition: str
    run_number: int
    artifact_passed: bool
    tool_calls: int
    elapsed_seconds: float

@dataclass
class BehaviorComparison:
    task_id: str
    baseline_pass_rate: float
    treatment_pass_rate: float
    delta: float
    regressed: bool

RELEASE_CONTRACT = ArtifactContract("release-readiness.json", ("candidate", "source_revision", "checks", "blocking_findings", "recommendation"),
                                    ("ready", "blocked", "needs-review"), True, False)

def evaluate_artifact(artifact, contract):
    errors = [f"Missing required field: {f}" for f in contract.required_fields if f not in artifact]
    rec = artifact.get("recommendation")
    if rec is not None and rec not in contract.allowed_recommendations: errors.append(f"Invalid recommendation: {rec}")
    checks = artifact.get("checks", [])
    if not isinstance(checks, list): errors.append("Field 'checks' must be a list."); checks = []
    if contract.evidence_required_for_each_check:
        for i, c in enumerate(checks):
            if not isinstance(c, dict): errors.append(f"Check {i} must be an object."); continue
            if not c.get("evidence"): errors.append(f"Check {i} has no evidence.")
    return ArtifactEvaluation(not errors, errors)

def repeated_run_rate(runs):
    return sum(1 for r in runs if r.artifact_passed) / len(runs) if runs else 0.0

def compare_behavior(task_id, baseline, treatment):
    b, t = repeated_run_rate(baseline), repeated_run_rate(treatment)
    return BehaviorComparison(task_id, round(b, 4), round(t, 4), round(t - b, 4), t < b)

# ---------------- Layers 4 and 5: scripts and safety ----------------
@dataclass
class EvidenceCheck:
    name: str
    passed: bool
    source: str
    details: str = ""

@dataclass
class EvidenceSummary:
    passed: bool
    total: int
    passed_count: int
    failed: list

@dataclass
class SafetyCheck:
    name: str
    passed: bool
    control_type: str
    source: str
    details: str = ""

ALLOWED_CONTROL_TYPES = {"instruction-only", "tool-policy", "approval", "sandbox", "verification"}

def evaluate_evidence_checks(checks):
    failed = [c.name for c in checks if not c.passed]
    return EvidenceSummary(not failed, len(checks), sum(1 for c in checks if c.passed), failed)

def evaluate_safety_checks(checks):
    failed, ok = [], 0
    for c in checks:
        if c.control_type not in ALLOWED_CONTROL_TYPES: failed.append(f"{c.name}: unknown control type"); continue
        if not c.passed: failed.append(c.name); continue
        ok += 1
    return EvidenceSummary(not failed, len(checks), ok, failed)

def evidence_pass_rate(s):
    return s.passed_count / s.total if s.total else 0.0

# ---------------- Layer 6: packaging and portability ----------------
RESERVED_MANIFEST_PATH = "assets/manifest.json"

def sha256_file(path):
    d = hashlib.sha256()
    with path.open("rb") as h:
        for chunk in iter(lambda: h.read(1024 * 1024), b""): d.update(chunk)
    return "sha256:" + d.hexdigest()

@dataclass
class PackageManifest:
    manifest_version: int
    algorithm: str
    name: str
    version: str
    source_revision: str
    files: dict
    required_capabilities: tuple
    optional_capabilities: tuple

def build_manifest(root, *, name, version, source_revision, required_capabilities, optional_capabilities):
    files = {}
    for p in sorted(root.rglob("*")):
        if not p.is_file(): continue
        rel = p.relative_to(root).as_posix()
        if rel == RESERVED_MANIFEST_PATH: continue
        files[rel] = sha256_file(p)
    return PackageManifest(1, "sha256", name, version, source_revision, files, required_capabilities, optional_capabilities)

@dataclass
class ManifestVerification:
    passed: bool
    missing_files: list
    changed_files: list
    unexpected_files: list

def verify_manifest(root, manifest):
    actual = {p.relative_to(root).as_posix() for p in root.rglob("*") if p.is_file() and p.relative_to(root).as_posix() != RESERVED_MANIFEST_PATH}
    missing, changed = [], []
    for rel, digest in manifest.files.items():
        p = root / rel
        if not p.is_file(): missing.append(rel); continue
        if not hmac.compare_digest(sha256_file(p), digest): changed.append(rel)
    unexpected = sorted(actual - set(manifest.files))
    return ManifestVerification(not (missing or changed or unexpected), sorted(missing), sorted(changed), unexpected)

@dataclass
class HostCapabilities:
    host_name: str
    capabilities: frozenset
    adapters: dict
    fallbacks: dict

@dataclass
class CapabilityResult:
    capability: str
    status: str
    detail: str

def evaluate_host_capability(host, capability, *, required):
    if capability in host.capabilities: return CapabilityResult(capability, "supported", "native")
    if capability in host.adapters: return CapabilityResult(capability, "adapted", host.adapters[capability])
    if capability in host.fallbacks: return CapabilityResult(capability, "degraded", host.fallbacks[capability])
    return CapabilityResult(capability, "unsupported", "required capability missing" if required else "optional capability unavailable")

def portability_matrix(manifest, hosts):
    return {h.host_name: [evaluate_host_capability(h, c, required=True) for c in manifest.required_capabilities] +
                         [evaluate_host_capability(h, c, required=False) for c in manifest.optional_capabilities] for h in hosts}

def portability_required_capabilities_pass(manifest, matrix):
    required = set(manifest.required_capabilities)
    return not any(r.capability in required and r.status == "unsupported" for results in matrix.values() for r in results)

# ---------------- provenance, evidence root, attestation ----------------
def canonical_json_bytes(value):
    return json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode("utf-8")

def sha256_object(value):
    return "sha256:" + hashlib.sha256(canonical_json_bytes(value)).hexdigest()

def build_evidence_root(**sections):
    return sha256_object(sections)

@dataclass
class AttestationValidation:
    passed: bool
    errors: list

def validate_attestation(*, attestation_bytes, evidence_root, trusted_attestation_sha256):
    errors = []
    actual = "sha256:" + hashlib.sha256(attestation_bytes).hexdigest()
    if not hmac.compare_digest(actual, trusted_attestation_sha256): errors.append("Attestation byte digest does not match trusted expected digest.")
    try: payload = json.loads(attestation_bytes.decode("utf-8"))
    except (UnicodeDecodeError, json.JSONDecodeError): return AttestationValidation(False, errors + ["Attestation is not valid UTF-8 JSON."])
    if payload.get("attestationVersion") != 1: errors.append("Unsupported attestationVersion.")
    if payload.get("evidenceRoot") != evidence_root: errors.append("Attestation evidenceRoot mismatch.")
    return AttestationValidation(not errors, errors)

# ---------------- the release gate ----------------
@dataclass
class ReleaseGatePolicy:
    structure_errors_max: int = 0
    routing_precision_min: float = 0.95
    routing_recall_min: float = 0.90
    near_miss_false_positives_max: int = 1
    behavior_pass_rate_min: float = 0.90
    no_regression_vs_baseline: bool = True
    scripts_must_pass: bool = True
    safety_pass_rate_min: float = 1.0
    installed_tree_must_match_manifest: bool = True

@dataclass
class LayerResult:
    name: str
    passed: bool
    details: dict

@dataclass
class ReleaseReport:
    layers: list
    checks_passed: bool
    fixture_passed: bool
    local_evidence_ready: bool
    trust_anchor_valid: bool
    production_ready: bool
    passed: bool

@dataclass
class ReleaseGateInputs:
    lint_issues: list
    trigger_observations: list
    trigger_metrics: ClassificationMetrics
    behavior_comparison: BehaviorComparison
    treatment_pass_rate: float
    script_summary: EvidenceSummary
    safety_summary: EvidenceSummary
    manifest_verification: ManifestVerification
    portability: dict
    manifest: PackageManifest
    local_evidence_ready: bool
    trust_anchor_valid: bool

def run_release_gate(i, p):
    nm = count_near_miss_false_positives(i.trigger_observations)
    safety_rate = evidence_pass_rate(i.safety_summary)
    behavior = i.treatment_pass_rate >= p.behavior_pass_rate_min and not (p.no_regression_vs_baseline and i.behavior_comparison.regressed)
    layers = [
        LayerResult("structure", len(i.lint_issues) <= p.structure_errors_max, {"issue_count": len(i.lint_issues)}),
        LayerResult("routing", i.trigger_metrics.precision >= p.routing_precision_min and i.trigger_metrics.recall >= p.routing_recall_min and nm <= p.near_miss_false_positives_max,
                    {"precision": i.trigger_metrics.precision, "recall": i.trigger_metrics.recall, "near_miss_false_positives": nm}),
        LayerResult("behavior", behavior, {"treatment": i.treatment_pass_rate, "baseline": i.behavior_comparison.baseline_pass_rate, "regressed": i.behavior_comparison.regressed}),
        LayerResult("scripts", i.script_summary.passed if p.scripts_must_pass else True, {"passed": i.script_summary.passed_count, "total": i.script_summary.total}),
        LayerResult("safety", safety_rate >= p.safety_pass_rate_min, {"pass_rate": safety_rate, "failed": i.safety_summary.failed}),
        LayerResult("portability", portability_required_capabilities_pass(i.manifest, i.portability), {"hosts": list(i.portability)}),
        LayerResult("package", i.manifest_verification.passed if p.installed_tree_must_match_manifest else True,
                    {"missing": i.manifest_verification.missing_files, "changed": i.manifest_verification.changed_files, "unexpected": i.manifest_verification.unexpected_files}),
    ]
    checks = all(l.passed for l in layers)
    prod = checks and i.local_evidence_ready and i.trust_anchor_valid
    return ReleaseReport(layers, checks, checks, i.local_evidence_ready, i.trust_anchor_valid, prod, prod)

def print_obs(obs):
    for o in obs: print(f"  {o.case_id:<3} {o.category:<21} expected={o.expected!s:<5} predicted={o.predicted!s:<5} {'PASS' if o.expected == o.predicted else 'FAIL'}")

GOOD_ARTIFACT = {"candidate": "3.1.0", "source_revision": "abc123",
                 "checks": [{"name": "unit-tests", "passed": True, "evidence": "evidence/unit-tests.json"},
                            {"name": "security-scan", "passed": True, "evidence": "evidence/security-scan.json"}],
                 "blocking_findings": [], "recommendation": "ready"}
BAD_ARTIFACT = {"candidate": "3.1.0", "checks": [{"name": "unit-tests", "passed": True}], "blocking_findings": [], "recommendation": "ship-it"}

def runs(task, cond, results):
    return [BehaviorRun(task, cond, n + 1, ok, 8, 2.5) for n, ok in enumerate(results)]

GOOD_SKILL = "---\nname: release-readiness\ndescription: Inspect a release candidate.\n---\n\n# Release readiness\n\n## Output contract\nrelease-readiness.json\n\n## Failure behavior\nStop if the revision cannot be determined.\n"

if __name__ == "__main__":
    print("=== 1. layer 1: package structure ===")
    with tempfile.TemporaryDirectory() as t:
        root = Path(t) / "release-readiness"; (root / "references").mkdir(parents=True); (root / "scripts").mkdir(); (root / "assets").mkdir()
        (root / "SKILL.md").write_text(GOOD_SKILL, encoding="utf-8")
        (root / "references" / "release-policy.md").write_text("Policy: tests must pass.", encoding="utf-8")
        (root / "scripts" / "inspect_release.py").write_text("print('inspect')\n", encoding="utf-8")
        print("  good package:", [i.code for i in lint_package(root)] or "no issues")
        bad = Path(t) / "bad"; bad.mkdir(); (bad / "SKILL.md").write_text("---\nname: bad\n---\n# Bad\n", encoding="utf-8")
        print("  package missing sections:", [i.code for i in lint_package(bad)])
        print("  no SKILL.md:", [i.code for i in lint_package(Path(t) / "empty-dir-that-does-not-exist")])
        print("=== 2. layer 2: trigger routing ===")
        print("  teaching router:")
        obs = evaluate_triggers(TRIGGER_CASES, teaching_router); print_obs(obs)
        print(" ", json.dumps(classification_metrics(obs).__dict__))
        print("  naive keyword router (any release-ish word):")
        obs_naive = evaluate_triggers(TRIGGER_CASES, keyword_router); print_obs(obs_naive)
        print(" ", json.dumps(classification_metrics(obs_naive).__dict__), "| near-miss false positives:", count_near_miss_false_positives(obs_naive))
        print("=== 3. accuracy hides a router that never fires ===")
        skew = [TriggerObservation(f"n{i}", "clear-negative", False, False) for i in range(990)] + [TriggerObservation(f"p{i}", "positive", True, False) for i in range(10)]
        m = classification_metrics(skew); print(f"  accuracy={m.accuracy} recall={m.recall} f1={m.f1}")
        print("=== 4. layer 3: artifact contract ===")
        print("  good:", evaluate_artifact(GOOD_ARTIFACT, RELEASE_CONTRACT))
        print("  bad: ", evaluate_artifact(BAD_ARTIFACT, RELEASE_CONTRACT))
        print("=== 5. baseline versus treatment ===")
        base, treat = runs("release-3.1.0", "baseline", [True, False, False]), runs("release-3.1.0", "treatment", [True, True, True])
        print("  ", compare_behavior("release-3.1.0", base, treat))
        a_b, a_t = runs("A", "baseline", [True] * 5), runs("A", "treatment", [True, True, True, True, False])
        b_b, b_t = runs("B", "baseline", [True, False, False, False, False]), runs("B", "treatment", [True] * 5)
        a, bb = compare_behavior("task-A", a_b, a_t), compare_behavior("task-B", b_b, b_t)
        print("  per task:", a.task_id, a.baseline_pass_rate, "->", a.treatment_pass_rate, "regressed:", a.regressed, "|", bb.task_id, bb.baseline_pass_rate, "->", bb.treatment_pass_rate, "regressed:", bb.regressed)
        pooled = compare_behavior("pooled", a_b + b_b, a_t + b_t)
        print("  pooled:", "baseline", pooled.baseline_pass_rate, "treatment", pooled.treatment_pass_rate, "regressed:", pooled.regressed, "(the average hides task-A)")
        print("=== 6. layers 4 and 5: script and safety evidence ===")
        script_checks = [EvidenceCheck(n, True, f"tests/test_inspect.py::test_{n}") for n in ("normal", "empty", "malformed", "unicode", "repeat")]
        print("  scripts:", evaluate_evidence_checks(script_checks))
        safety = [SafetyCheck("reject-out-of-scope-action", True, "instruction-only", "safety/out_of_scope.json"),
                  SafetyCheck("block-path-escape", True, "sandbox", "safety/path_escape.json"),
                  SafetyCheck("block-unapproved-publish", True, "approval", "safety/publish_without_approval.json"),
                  SafetyCheck("reject-undeclared-network", True, "tool-policy", "safety/network_destination.json")]
        print("  safety:", evaluate_safety_checks(safety))
        for c in safety: print(f"    {c.name} -> control: {c.control_type}")
        one_fail = safety[:3] + [SafetyCheck("block-unapproved-publish-2", False, "approval", "safety/x.json")]
        s = evaluate_safety_checks(one_fail); print(f"  one hard failure: pass rate {evidence_pass_rate(s)} -> failed {s.failed}")
        print("=== 7. layer 6: manifest and installed-tree verification ===")
        manifest = build_manifest(root, name="release-readiness", version="1.2.0", source_revision="abc123",
                                  required_capabilities=("filesystem.read", "process.run"), optional_capabilities=("model_implicit_invocation",))
        print("  files:", {k: v[:19] + "..." for k, v in manifest.files.items()})
        print("  clean install:", verify_manifest(root, manifest))
        (root / "references" / "release-policy.md").write_text("Policy: tests may fail.", encoding="utf-8")
        (root / "scripts" / "old_script.py").write_text("stale", encoding="utf-8")
        (root / "assets" / "manifest.json").write_text("{}", encoding="utf-8")
        (root / "scripts" / "inspect_release.py").unlink()
        print("  after drift (changed policy, stale script, missing script):", verify_manifest(root, manifest))
        print("=== 8. layer 6: host capability matrix ===")
        hosts = [HostCapabilities("host-a", frozenset({"filesystem.read", "process.run", "model_implicit_invocation"}), {}, {}),
                 HostCapabilities("host-b", frozenset({"filesystem.read"}), {"process.run": "external-process-adapter"}, {"model_implicit_invocation": "activate explicitly"}),
                 HostCapabilities("host-c", frozenset({"filesystem.read"}), {}, {})]
        matrix = portability_matrix(manifest, hosts)
        for h, results in matrix.items(): print(f"  {h}:", [(r.capability, r.status) for r in results])
        print("  required capabilities satisfied on every host:", portability_required_capabilities_pass(manifest, matrix))
        print("=== 9. evidence root and why local hashes are not trust ===")
        sections = dict(trigger=[o.__dict__ for o in obs], artifact=GOOD_ARTIFACT, script=[c.__dict__ for c in script_checks], safety=[c.__dict__ for c in safety],
                        hosts={h: [r.__dict__ for r in rs] for h, rs in matrix.items()}, manifest=manifest.__dict__)
        root1 = build_evidence_root(**sections)
        print("  evidenceRoot:", root1[:30] + "...")
        tampered = dict(sections, artifact=dict(GOOD_ARTIFACT, recommendation="blocked"))
        root2 = build_evidence_root(**tampered)
        print("  edit any evidence -> root changes:", root1 != root2)
        attest = canonical_json_bytes({"attestationVersion": 1, "evidenceRoot": root1})
        trusted = "sha256:" + hashlib.sha256(attest).hexdigest()       # in real life this arrives OUT OF BAND
        print("  genuine bundle vs trusted digest:", validate_attestation(attestation_bytes=attest, evidence_root=root1, trusted_attestation_sha256=trusted))
        forged = canonical_json_bytes({"attestationVersion": 1, "evidenceRoot": root2})
        print("  attacker edits evidence AND recomputes root AND rewrites attestation:")
        print("    local consistency check passes:", json.loads(forged)["evidenceRoot"] == root2)
        print("    against the trusted out-of-band digest:", validate_attestation(attestation_bytes=forged, evidence_root=root2, trusted_attestation_sha256=trusted))
        print("=== 10. the release gate: fixture, local evidence, production ===")
        with tempfile.TemporaryDirectory() as t2:
            r2 = Path(t2) / "release-readiness"; (r2 / "references").mkdir(parents=True); (r2 / "scripts").mkdir()
            (r2 / "SKILL.md").write_text(GOOD_SKILL, encoding="utf-8"); (r2 / "references" / "release-policy.md").write_text("ok", encoding="utf-8"); (r2 / "scripts" / "inspect_release.py").write_text("ok", encoding="utf-8")
            man2 = build_manifest(r2, name="release-readiness", version="1.2.0", source_revision="abc123", required_capabilities=("filesystem.read", "process.run"), optional_capabilities=("model_implicit_invocation",))
            ok_hosts = portability_matrix(man2, hosts[:2])
            def gate(local, trust, safety_checks=safety, lint=None, router_obs=obs):
                return run_release_gate(ReleaseGateInputs(lint if lint is not None else lint_package(r2), router_obs, classification_metrics(router_obs), compare_behavior("t", base, treat), 1.0,
                                                          evaluate_evidence_checks(script_checks), evaluate_safety_checks(safety_checks), verify_manifest(r2, man2), ok_hosts, man2, local, trust), ReleaseGatePolicy())
            def line(label, rep): print(f"  {label:<44} checksPassed={rep.checks_passed} fixturePassed={rep.fixture_passed} localEvidenceReady={rep.local_evidence_ready} trustAnchorValid={rep.trust_anchor_valid} productionReady={rep.production_ready} passed={rep.passed}")
            line("all layers pass, no evidence, no trust", gate(False, False))
            line("all layers pass, local evidence, no trust", gate(True, False))
            line("all layers pass, local evidence, trust anchor", gate(True, True))
            r_bad = gate(True, True, safety_checks=one_fail)
            line("one safety case fails (others perfect)", r_bad)
            print("   failing layers:", [l.name for l in r_bad.layers if not l.passed])
            r_naive = gate(True, True, router_obs=obs_naive)
            print("   naive keyword router failing layers:", [l.name for l in r_naive.layers if not l.passed], "->", [l.details for l in r_naive.layers if l.name == "routing"][0])
