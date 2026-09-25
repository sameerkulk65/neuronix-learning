module.exports = {
 "phaseId": "6a369d5e66020ed05b3214c3",
 "moduleId": "6ab6d18eb7119db96ad77968",
 "order": 1,
 "type": "interactive",
 "duration": 55,
 "difficulty": "advanced",
 "status": "published",
 "title": "Skill Evals, Packaging, and Portability (Part 2 of 3) — Behavior Evals, Baselines, Script Correctness and Safety",
 "titleKn": "Skill Evals, Packaging, ಮತ್ತು Portability (Part 2 of 3) — Behavior Evals, Baselines, Script Correctness ಮತ್ತು Safety",
 "desc": "After the right skill activates, did it perform the task, measurably better than no skill, and stay inside its authority? Build an artifact contract validator, compare baseline and treatment per task, test scripts independently, and record which kind of control actually prevented each unsafe action.",
 "descKn": "ಸರಿಯಾದ skill activate ಆದ ನಂತರ ಕೆಲಸ ಮಾಡಿತೇ, skill ಇಲ್ಲದ್ದಕ್ಕಿಂತ ಉತ್ತಮವಾಗಿ, ಮತ್ತು ಅಧಿಕಾರದ ಒಳಗೆ? artifact contract, baseline ಹೋಲಿಕೆ, scripts ಪರೀಕ್ಷೆ, control ಪ್ರಕಾರ ದಾಖಲೆ.",
 "objectives": [
  "Turn \"produce a good report\" into an artifact contract whose properties are independently checkable.",
  "Distinguish structural, domain and judgment validation of an artifact.",
  "Compare baseline and treatment with identical conditions, per task, and report regressions that a pooled average hides.",
  "Test deterministic scripts as ordinary software and keep their evidence separate.",
  "Record whether each safety result came from an instruction, tool policy, approval, sandbox or verification, and treat safety as a hard gate."
 ],
 "objectivesKn": [
  "artifact contract ನಿರ್ಮಿಸಿ.",
  "structural, domain, judgment validation ಬೇರ್ಪಡಿಸಿ.",
  "baseline vs treatment ಅನ್ನು ಪ್ರತಿ ಕಾರ್ಯಕ್ಕೆ ಹೋಲಿಸಿ.",
  "scripts ಅನ್ನು ಸ್ವತಂತ್ರವಾಗಿ ಪರೀಕ್ಷಿಸಿ.",
  "ಸುರಕ್ಷತೆ control ಪ್ರಕಾರ ದಾಖಲಿಸಿ."
 ],
 "blocks": [
  {
   "type": "heading",
   "data": {
    "textEn": "Skill Evals, Packaging, and Portability (Part 2 of 3)",
    "textKn": "Skill Evals, Packaging, and Portability (Part 2 of 3)",
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
    "textEn": "Layer 3: Artifact Behavior",
    "textKn": "Layer 3: Artifact Behavior",
    "level": "H2"
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "Routing Was Correct, Behavior Was Not",
    "headingKn": "Routing ಸರಿ, Behavior ತಪ್ಪು",
    "bodyEn": "Precision 0.98 and recall 0.96 are excellent, and then the correct skill returns {\"recommendation\": \"ready\"} with no candidate, no source revision, no checks and no evidence. Correct routing is not correct execution. A behavior fixture pins the inputs, environment assumptions, tool boundaries, expected artifact path, deterministic checks, rubric items, budgets and expected failure behaviour so the experiment is repeatable.",
    "bodyKn": "routing ಸರಿ ಆದರೂ artifact ಗೆ candidate, revision, checks, evidence ಇಲ್ಲ. ಸರಿಯಾದ routing ≠ ಸರಿಯಾದ execution."
   }
  },
  {
   "type": "code",
   "data": {
    "filename": "eval_lab.py",
    "headingEn": "ArtifactContract and evaluate_artifact",
    "headingKn": "ArtifactContract ಮತ್ತು evaluate_artifact",
    "descEn": "The vague requirement \"produce a useful report\" becomes independently checkable properties: five required fields, a closed vocabulary for the recommendation, evidence on every check, and publishing not being a side effect of an evaluator. The validator reports each failure separately rather than a single \"invalid\".",
    "descKn": "\"ಉಪಯುಕ್ತ ವರದಿ\" ಸ್ವತಂತ್ರವಾಗಿ ಪರಿಶೀಲಿಸಬಹುದಾದ ಗುಣಗಳಾಗುತ್ತದೆ: ಐದು ಕಡ್ಡಾಯ ಕ್ಷೇತ್ರ, ಸೀಮಿತ ಶಬ್ದಕೋಶ, ಪ್ರತಿ check ಗೆ evidence.",
    "code": "# ---------------- Layer 3: artifact behavior ----------------\n@dataclass\nclass ArtifactContract:\n    artifact_name: str\n    required_fields: tuple\n    allowed_recommendations: tuple\n    evidence_required_for_each_check: bool\n    publish_side_effect_allowed: bool\n\n@dataclass\nclass ArtifactEvaluation:\n    passed: bool\n    errors: list\n\n@dataclass\nclass BehaviorRun:\n    task_id: str\n    condition: str\n    run_number: int\n    artifact_passed: bool\n    tool_calls: int\n    elapsed_seconds: float\n\n@dataclass\nclass BehaviorComparison:\n    task_id: str\n    baseline_pass_rate: float\n    treatment_pass_rate: float\n    delta: float\n    regressed: bool\n\nRELEASE_CONTRACT = ArtifactContract(\"release-readiness.json\", (\"candidate\", \"source_revision\", \"checks\", \"blocking_findings\", \"recommendation\"),\n                                    (\"ready\", \"blocked\", \"needs-review\"), True, False)\n\ndef evaluate_artifact(artifact, contract):\n    errors = [f\"Missing required field: {f}\" for f in contract.required_fields if f not in artifact]\n    rec = artifact.get(\"recommendation\")\n    if rec is not None and rec not in contract.allowed_recommendations: errors.append(f\"Invalid recommendation: {rec}\")\n    checks = artifact.get(\"checks\", [])\n    if not isinstance(checks, list): errors.append(\"Field 'checks' must be a list.\"); checks = []\n    if contract.evidence_required_for_each_check:\n        for i, c in enumerate(checks):\n            if not isinstance(c, dict): errors.append(f\"Check {i} must be an object.\"); continue\n            if not c.get(\"evidence\"): errors.append(f\"Check {i} has no evidence.\")\n    return ArtifactEvaluation(not errors, errors)"
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
    "headingEn": "A good artifact and a bad one",
    "headingKn": "ಒಳ್ಳೆಯ ಮತ್ತು ಕೆಟ್ಟ artifact",
    "descEn": "The bad artifact is missing source_revision, uses the invalid recommendation \"ship-it\" and has a check with no evidence. All three are reported.",
    "descKn": "ಕೆಟ್ಟ artifact ನಲ್ಲಿ source_revision ಇಲ್ಲ, \"ship-it\" ಅಮಾನ್ಯ, ಒಂದು check ಗೆ evidence ಇಲ್ಲ.",
    "code": "GOOD_ARTIFACT = {\"candidate\": \"3.1.0\", \"source_revision\": \"abc123\",\n                 \"checks\": [{\"name\": \"unit-tests\", \"passed\": True, \"evidence\": \"evidence/unit-tests.json\"},\n                            {\"name\": \"security-scan\", \"passed\": True, \"evidence\": \"evidence/security-scan.json\"}],\n                 \"blocking_findings\": [], \"recommendation\": \"ready\"}\nBAD_ARTIFACT = {\"candidate\": \"3.1.0\", \"checks\": [{\"name\": \"unit-tests\", \"passed\": True}], \"blocking_findings\": [], \"recommendation\": \"ship-it\"}\n\nprint(\"  good:\", evaluate_artifact(GOOD_ARTIFACT, RELEASE_CONTRACT))\nprint(\"  bad: \", evaluate_artifact(BAD_ARTIFACT, RELEASE_CONTRACT))"
   }
  },
  {
   "type": "output",
   "data": {
    "output": "good: ArtifactEvaluation(passed=True, errors=[])\n  bad:  ArtifactEvaluation(passed=False, errors=['Missing required field: source_revision', 'Invalid recommendation: ship-it', 'Check 0 has no evidence.'])"
   }
  },
  {
   "type": "table",
   "data": {
    "headingEn": "Three layers of artifact validation",
    "headers": [
     "Kind",
     "Checks",
     "Mechanism"
    ],
    "rows": [
     [
      "Structural",
      "Fields, types, allowed values",
      "Code (this validator)"
     ],
     [
      "Domain",
      "The revision is real, the evidence path exists, the candidate matches",
      "Code with fixtures"
     ],
     [
      "Judgment",
      "The recommendation follows from the evidence",
      "Human or calibrated judgment"
     ]
    ]
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "A Structurally Perfect Artifact Can Be Wrong",
    "headingKn": "ರಚನಾತ್ಮಕವಾಗಿ ಪರಿಪೂರ್ಣ artifact ತಪ್ಪಾಗಿರಬಹುದು",
    "bodyEn": "evidence: \"evidence/not-real.json\" satisfies the structural check and points at nothing. An artifact with ready and no failing checks passes the schema even while the repository has failing tests. The contract is necessary, not sufficient.",
    "bodyKn": "\"evidence/not-real.json\" ರಚನಾತ್ಮಕ ಪರಿಶೀಲನೆ ಪಾಸ್ ಆಗುತ್ತದೆ ಆದರೆ ಯಾವುದಕ್ಕೂ ಸೂಚಿಸುವುದಿಲ್ಲ."
   }
  },
  {
   "type": "heading",
   "data": {
    "textEn": "Baseline Versus Treatment",
    "textKn": "Baseline vs Treatment",
    "level": "H2"
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "An Experiment, Not an Anecdote",
    "headingKn": "ಪ್ರಯೋಗ, ಕಥೆ ಅಲ್ಲ",
    "bodyEn": "A skill that passes 9 of 10 runs is not necessarily good: the same model without the skill might pass 10 of 10. Baseline is same model, same tools, same task, no skill; treatment is the same with the skill. Hold the model, sampling policy, tools, fixtures and budgets constant so a difference can be attributed to the skill, and give both conditions the same assertions. Keep each run's record, because aggregates guide comparison but traces guide repair.",
    "bodyKn": "skill ಇಲ್ಲದ ಅದೇ ಮಾದರಿ 10/10 ಪಾಸ್ ಆದರೆ 9/10 ಒಳ್ಳೆಯದಲ್ಲ. ಎಲ್ಲವನ್ನೂ ಸ್ಥಿರ ಇರಿಸಿ, ಒಂದೇ assertions."
   }
  },
  {
   "type": "code",
   "data": {
    "filename": "eval_lab.py",
    "headingEn": "Per-run records, pass rates and comparison",
    "headingKn": "ಪ್ರತಿ run ದಾಖಲೆ, pass rates ಮತ್ತು ಹೋಲಿಕೆ",
    "descEn": "A BehaviorRun keeps the run number so a 60% rate is never separated from which runs failed. repeated_run_rate is k / n. compare_behavior reports baseline, treatment, the delta and whether treatment regressed.",
    "descKn": "BehaviorRun run ಸಂಖ್ಯೆ ಇರಿಸುತ್ತದೆ. repeated_run_rate = k/n. compare_behavior regression ವರದಿ ಮಾಡುತ್ತದೆ.",
    "code": "def repeated_run_rate(runs):\n    return sum(1 for r in runs if r.artifact_passed) / len(runs) if runs else 0.0\n\ndef compare_behavior(task_id, baseline, treatment):\n    b, t = repeated_run_rate(baseline), repeated_run_rate(treatment)\n    return BehaviorComparison(task_id, round(b, 4), round(t, 4), round(t - b, 4), t < b)\n\nbase, treat = runs(\"release-3.1.0\", \"baseline\", [True, False, False]), runs(\"release-3.1.0\", \"treatment\", [True, True, True])\nprint(compare_behavior(\"release-3.1.0\", base, treat))"
   }
  },
  {
   "type": "code",
   "data": {
    "filename": "eval_lab.py",
    "headingEn": "Per task, not only pooled",
    "headingKn": "ಪ್ರತಿ ಕಾರ್ಯಕ್ಕೆ, ಕೇವಲ ಒಟ್ಟು ಅಲ್ಲ",
    "descEn": "Task A goes from 5/5 to 4/5 while task B goes from 1/5 to 5/5. The pooled numbers (baseline 0.6, treatment 0.9) look like a clear win and report no regression. Only the per-task comparison shows task A regressed. Report regressions even when the average improves. (These are constructed run lists to show the arithmetic, not results from a real agent.)",
    "descKn": "A: 5/5 → 4/5, B: 1/5 → 5/5. ಒಟ್ಟು ಸ್ಪಷ್ಟ ಗೆಲುವಿನಂತೆ ಕಾಣುತ್ತದೆ; ಪ್ರತಿ ಕಾರ್ಯ A ಹಿನ್ನಡೆ ತೋರಿಸುತ್ತದೆ. ಇವು ರಚಿತ ಪಟ್ಟಿಗಳು.",
    "code": "a_b, a_t = runs(\"A\", \"baseline\", [True] * 5), runs(\"A\", \"treatment\", [True, True, True, True, False])\nb_b, b_t = runs(\"B\", \"baseline\", [True, False, False, False, False]), runs(\"B\", \"treatment\", [True] * 5)\na, bb = compare_behavior(\"task-A\", a_b, a_t), compare_behavior(\"task-B\", b_b, b_t)\nprint(\"  per task:\", a.task_id, a.baseline_pass_rate, \"->\", a.treatment_pass_rate, \"regressed:\", a.regressed, \"|\", bb.task_id, bb.baseline_pass_rate, \"->\", bb.treatment_pass_rate, \"regressed:\", bb.regressed)\npooled = compare_behavior(\"pooled\", a_b + b_b, a_t + b_t)\nprint(\"  pooled:\", \"baseline\", pooled.baseline_pass_rate, \"treatment\", pooled.treatment_pass_rate, \"regressed:\", pooled.regressed, \"(the average hides task-A)\")"
   }
  },
  {
   "type": "output",
   "data": {
    "output": "BehaviorComparison(task_id='release-3.1.0', baseline_pass_rate=0.3333, treatment_pass_rate=1.0, delta=0.6667, regressed=False)\n  per task: task-A 1.0 -> 0.8 regressed: True | task-B 0.2 -> 1.0 regressed: False\n  pooled: baseline 0.6 treatment 0.9 regressed: False (the average hides task-A)"
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "Efficiency Comes After Correctness",
    "headingKn": "Efficiency Correctness ನಂತರ",
    "bodyEn": "Four tool calls at 60% correct is not better than ten tool calls at 100%. Optimizing for fewer calls or tokens can just mean skipping checks. The order is correctness, scope and safety, completeness, then efficiency.",
    "bodyKn": "4 ಕರೆಗಳಲ್ಲಿ 60% ಸರಿ, 10 ಕರೆಗಳಲ್ಲಿ 100% ಗಿಂತ ಉತ್ತಮವಲ್ಲ."
   }
  },
  {
   "type": "heading",
   "data": {
    "textEn": "Layers 4 and 5: Scripts and Safety",
    "textKn": "Layers 4 ಮತ್ತು 5: Scripts ಮತ್ತು Safety",
    "level": "H2"
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "Test Scripts Like Software, Outside Model Runs",
    "headingKn": "Scripts ಅನ್ನು ಸಾಫ್ಟ್‌ವೇರ್‌ನಂತೆ ಪರೀಕ್ಷಿಸಿ",
    "bodyEn": "\"The model called the script and the report looked fine\" is weak evidence. Cover normal, empty, malformed and Unicode input, whitespace and path edge cases, repeated execution, timeout, dependency failure, partial previous output, output-size limits, dry-run and structured error and exit behaviour. Use fixed fixtures for unit tests, live-network integration tests behind an explicit flag, and separate the plan from the commit for side-effecting scripts. An operation that is not naturally idempotent needs an idempotency record or duplicate detection.",
    "bodyKn": "\"ಮಾದರಿ script ಕರೆಯಿತು, ವರದಿ ಸರಿ ಕಂಡಿತು\" ದುರ್ಬಲ ಸಾಕ್ಷ್ಯ. ಸಾಮಾನ್ಯ, ಖಾಲಿ, ವಿಕೃತ, Unicode, ಪುನರಾವರ್ತನೆ ಒಳಗೊಳ್ಳಿ."
   }
  },
  {
   "type": "code",
   "data": {
    "filename": "eval_lab.py",
    "headingEn": "Evidence checks and safety checks with control types",
    "headingKn": "Evidence checks ಮತ್ತು control ಪ್ರಕಾರದ safety checks",
    "descEn": "Script evidence is a list of named checks with a source. Safety checks add a control_type: instruction-only, tool-policy, approval, sandbox or verification. All four safety checks here pass, but they do not give the same assurance. A pass that came from a sentence in SKILL.md is instruction-only and must not be described as enforced containment. (The check records are constructed demo data, not results from real runs.)",
    "descKn": "script ಸಾಕ್ಷ್ಯ ಹೆಸರಿಸಿದ checks + ಮೂಲ. safety checks ಗೆ control_type ಸೇರಿದೆ. ಎಲ್ಲವೂ ಪಾಸ್ ಆದರೂ ಭರವಸೆ ಬೇರೆ. ದಾಖಲೆಗಳು ರಚಿತ demo ಡೇಟಾ.",
    "code": "# ---------------- Layers 4 and 5: scripts and safety ----------------\n@dataclass\nclass EvidenceCheck:\n    name: str\n    passed: bool\n    source: str\n    details: str = \"\"\n\n@dataclass\nclass EvidenceSummary:\n    passed: bool\n    total: int\n    passed_count: int\n    failed: list\n\n@dataclass\nclass SafetyCheck:\n    name: str\n    passed: bool\n    control_type: str\n    source: str\n    details: str = \"\"\n\nALLOWED_CONTROL_TYPES = {\"instruction-only\", \"tool-policy\", \"approval\", \"sandbox\", \"verification\"}\n\ndef evaluate_evidence_checks(checks):\n    failed = [c.name for c in checks if not c.passed]\n    return EvidenceSummary(not failed, len(checks), sum(1 for c in checks if c.passed), failed)\n\ndef evaluate_safety_checks(checks):\n    failed, ok = [], 0\n    for c in checks:\n        if c.control_type not in ALLOWED_CONTROL_TYPES: failed.append(f\"{c.name}: unknown control type\"); continue\n        if not c.passed: failed.append(c.name); continue\n        ok += 1\n    return EvidenceSummary(not failed, len(checks), ok, failed)\n\ndef evidence_pass_rate(s):\n    return s.passed_count / s.total if s.total else 0.0\n\nscript_checks = [EvidenceCheck(n, True, f\"tests/test_inspect.py::test_{n}\") for n in (\"normal\", \"empty\", \"malformed\", \"unicode\", \"repeat\")]\nprint(\"  scripts:\", evaluate_evidence_checks(script_checks))\nsafety = [SafetyCheck(\"reject-out-of-scope-action\", True, \"instruction-only\", \"safety/out_of_scope.json\"),\n          SafetyCheck(\"block-path-escape\", True, \"sandbox\", \"safety/path_escape.json\"),\n          SafetyCheck(\"block-unapproved-publish\", True, \"approval\", \"safety/publish_without_approval.json\"),\n          SafetyCheck(\"reject-undeclared-network\", True, \"tool-policy\", \"safety/network_destination.json\")]\nprint(\"  safety:\", evaluate_safety_checks(safety))\nfor c in safety: print(f\"    {c.name} -> control: {c.control_type}\")"
   }
  },
  {
   "type": "output",
   "data": {
    "output": "scripts: EvidenceSummary(passed=True, total=5, passed_count=5, failed=[])\n  safety: EvidenceSummary(passed=True, total=4, passed_count=4, failed=[])\n    reject-out-of-scope-action -> control: instruction-only\n    block-path-escape -> control: sandbox\n    block-unapproved-publish -> control: approval\n    reject-undeclared-network -> control: tool-policy\n  one hard failure: pass rate 0.75 -> failed ['block-unapproved-publish-2']"
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "Safety Is a Hard Gate",
    "headingKn": "Safety ಕಠಿಣ Gate",
    "bodyEn": "The last line of the output shows 3 of 4 required safety cases passing gives a pass rate of 0.75. If the failing case is \"publishes without approval\", 99 other passes do not matter. Required safety cases should demand a 100% pass rate. The cases to include: an out-of-scope request, malicious instructions inside reference data, path and symlink escape, an undeclared network destination, an ambient credential requirement, a destructive action without approval, oversized output or an infinite process, a skill-to-skill cycle and a resume that could duplicate side effects.",
    "bodyKn": "4 ರಲ್ಲಿ 3 ಪಾಸ್ = 0.75. ಅನುಮೋದನೆ ಇಲ್ಲದೆ publish ವಿಫಲವಾದರೆ ಉಳಿದ 99 ಪಾಸ್ ಮುಖ್ಯವಲ್ಲ. ಅಗತ್ಯ safety 100%."
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "Key Takeaways",
    "headingKn": "ಮುಖ್ಯ ಅಂಶಗಳು",
    "bodyEn": "• An artifact contract turns \"useful\" into checkable properties; our validator reported source_revision missing, \"ship-it\" invalid and a check with no evidence in one run.\n• Structural validity is not domain or judgment validity.\n• Compare baseline and treatment per task: on constructed data task A regressed 1.0 to 0.8 while the pooled rates rose from 0.6 to 0.9 with no regression flag.\n• Test scripts independently; record the control type behind each safety pass (instruction-only, tool-policy, approval, sandbox, verification).\n• Safety is a hard gate: 3 of 4 (0.75) is a failure. Run lists and check records here are constructed to demonstrate the mechanics.",
    "bodyKn": "• artifact contract \"ಉಪಯುಕ್ತ\" ಅನ್ನು ಪರಿಶೀಲಿಸಬಹುದಾದ ಗುಣಗಳಾಗಿಸುತ್ತದೆ.\n• ರಚನೆ ≠ domain/judgment.\n• ಪ್ರತಿ ಕಾರ್ಯಕ್ಕೆ ಹೋಲಿಸಿ.\n• control ಪ್ರಕಾರ ದಾಖಲಿಸಿ.\n• safety ಕಠಿಣ gate."
   }
  },
  {
   "type": "quiz",
   "data": {
    "questions": [
     {
      "q": "Why should baseline and treatment use the same artifact assertions?",
      "qKn": "baseline ಮತ್ತು treatment ಒಂದೇ artifact assertions ಏಕೆ ಬಳಸಬೇಕು?",
      "opts": [
       "To reduce runtime cost",
       "To eliminate trigger testing",
       "To measure whether the skill improves the task under comparable evaluation",
       "To let treatment redefine success"
      ],
      "optsKn": [
       "ವೆಚ್ಚ ಕಡಿಮೆ ಮಾಡಲು",
       "trigger ಪರೀಕ್ಷೆ ತೆಗೆಯಲು",
       "ಹೋಲಿಸಬಹುದಾದ ಮೌಲ್ಯಮಾಪನದಲ್ಲಿ skill ಸುಧಾರಿಸುತ್ತದೆಯೇ ಎಂದು ಅಳೆಯಲು",
       "treatment ಯಶಸ್ಸನ್ನು ಮರುವ್ಯಾಖ್ಯಾನಿಸಲು"
      ],
      "correct": 2
     },
     {
      "q": "Baseline pass rate 0.90, treatment 0.80. What should the evaluator report?",
      "qKn": "baseline 0.90, treatment 0.80. evaluator ಏನು ವರದಿ ಮಾಡಬೇಕು?",
      "opts": [
       "Improvement",
       "Regression",
       "Routing failure",
       "Package corruption"
      ],
      "optsKn": [
       "ಸುಧಾರಣೆ",
       "ಹಿನ್ನಡೆ",
       "routing ವೈಫಲ್ಯ",
       "package ಭ್ರಷ್ಟ"
      ],
      "correct": 1
     },
     {
      "q": "A skill refuses to publish only because SKILL.md says not to. What kind of control is that?",
      "qKn": "SKILL.md ಹೇಳಿದ್ದರಿಂದ ಮಾತ್ರ skill publish ನಿರಾಕರಿಸುತ್ತದೆ. ಇದು ಯಾವ ರೀತಿಯ control?",
      "opts": [
       "Sandbox",
       "Approval enforcement",
       "Tool policy",
       "Instruction-only"
      ],
      "optsKn": [
       "Sandbox",
       "Approval ಜಾರಿ",
       "Tool policy",
       "Instruction-only"
      ],
      "correct": 3
     },
     {
      "q": "In the run, task A regressed but the pooled rate rose. What does that teach?",
      "qKn": "run ನಲ್ಲಿ task A ಹಿನ್ನಡೆ ಆದರೆ ಒಟ್ಟು ದರ ಹೆಚ್ಚಿತು. ಇದು ಏನು ಕಲಿಸುತ್ತದೆ?",
      "opts": [
       "Pooled averages are enough",
       "Compare per task and report regressions even when the average improves",
       "Task A is irrelevant",
       "Regressions do not matter if the mean rises"
      ],
      "optsKn": [
       "ಒಟ್ಟು ಸರಾಸರಿ ಸಾಕು",
       "ಪ್ರತಿ ಕಾರ್ಯಕ್ಕೆ ಹೋಲಿಸಿ; ಸರಾಸರಿ ಸುಧಾರಿಸಿದರೂ ಹಿನ್ನಡೆ ವರದಿ ಮಾಡಿ",
       "A ಅಪ್ರಸ್ತುತ",
       "ಸರಾಸರಿ ಏರಿದರೆ ಹಿನ್ನಡೆ ಮುಖ್ಯವಲ್ಲ"
      ],
      "correct": 1
     },
     {
      "q": "Why test scripts separately from model runs?",
      "qKn": "scripts ಅನ್ನು ಮಾದರಿ runs ಗಿಂತ ಪ್ರತ್ಯೇಕವಾಗಿ ಏಕೆ ಪರೀಕ್ಷಿಸಬೇಕು?",
      "opts": [
       "Scripts cannot run in skills",
       "Script correctness is an independent software property needing normal, malformed, repeated, edge and failure fixtures",
       "It removes behavior evaluation",
       "It proves portability"
      ],
      "optsKn": [
       "scripts skills ನಲ್ಲಿ ಚಲಿಸಲಾರವು",
       "script ಸರಿಯಾಗಿರುವುದು ಸ್ವತಂತ್ರ ಸಾಫ್ಟ್‌ವೇರ್ ಗುಣ",
       "behavior ಮೌಲ್ಯಮಾಪನ ತೆಗೆಯುತ್ತದೆ",
       "portability ಸಾಬೀತು"
      ],
      "correct": 1
     }
    ]
   }
  }
 ]
};
