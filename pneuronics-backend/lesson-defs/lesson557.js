module.exports = {
 "phaseId": "6a369d5e66020ed05b3214c3",
 "moduleId": "6ab6d18eb7119db96ad77968",
 "order": 0,
 "type": "interactive",
 "duration": 50,
 "difficulty": "intermediate",
 "status": "published",
 "title": "Skill Evals, Packaging, and Portability (Part 1 of 3) — Workflow Contracts, Package Structure and Trigger Routing",
 "titleKn": "Skill Evals, Packaging, ಮತ್ತು Portability (Part 1 of 3) — Workflow Contracts, Package Structure ಮತ್ತು Trigger Routing",
 "desc": "A skill is finished when its package survives linting, routes on the right requests, improves a measured task, stays inside policy and degrades honestly on another host. Learn the six evaluation layers, define the workflow first, lint the package, and measure trigger routing with precision, recall, F1, accuracy and near misses.",
 "descKn": "skill ಪೂರ್ಣಗೊಂಡಿದೆ ಎಂದರೆ package lint ಪಾಸ್, ಸರಿಯಾದ ಕೋರಿಕೆಗಳಿಗೆ routing, ಅಳೆದ ಸುಧಾರಣೆ, policy ಒಳಗೆ, ಮತ್ತು ಬೇರೆ host ನಲ್ಲಿ ಪ್ರಾಮಾಣಿಕ ಅವನತಿ. ಆರು ಪದರಗಳು, workflow ಮೊದಲು, lint, trigger ಮಾಪನ.",
 "objectives": [
  "Explain why one successful demo does not make a skill reliable and name the six evaluation layers.",
  "Define a workflow (trigger boundary, evidence, decisions, deterministic operations, artifact) before writing the skill, and separate model judgment from deterministic code.",
  "Lint a package for structure with stable issue codes before spending any model calls.",
  "Build labelled trigger cases (positive, paraphrased, clear negative, near miss, competing skill, adversarial) and compute the confusion matrix.",
  "Compute precision, recall, F1 and accuracy, report raw counts, and explain why accuracy alone can mislead."
 ],
 "objectivesKn": [
  "ಒಂದು demo ಯಶಸ್ವಿ ಎಂದರೆ skill ವಿಶ್ವಾಸಾರ್ಹ ಎಂದಲ್ಲ ಎಂದು ವಿವರಿಸಿ; ಆರು ಪದರ ಹೆಸರಿಸಿ.",
  "skill ಬರೆಯುವ ಮೊದಲು workflow ವ್ಯಾಖ್ಯಾನಿಸಿ.",
  "ಸ್ಥಿರ issue ಕೋಡ್‌ಗಳೊಂದಿಗೆ package lint ಮಾಡಿ.",
  "ಲೇಬಲ್ ಮಾಡಿದ trigger ಪ್ರಕರಣಗಳು ನಿರ್ಮಿಸಿ.",
  "precision, recall, F1, accuracy ಲೆಕ್ಕ ಹಾಕಿ."
 ],
 "blocks": [
  {
   "type": "heading",
   "data": {
    "textEn": "Skill Evals, Packaging, and Portability (Part 1 of 3)",
    "textKn": "Skill Evals, Packaging, and Portability (Part 1 of 3)",
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
    "textEn": "Why One Demo Proves Little",
    "textKn": "ಒಂದು Demo ಸ್ವಲ್ಪವೇ ಸಾಬೀತುಪಡಿಸುತ್ತದೆ",
    "level": "H2"
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "What Goes Wrong After the Demo",
    "headingKn": "Demo ನಂತರ ಏನು ತಪ್ಪಾಗುತ್ತದೆ",
    "bodyEn": "Unfamiliar wording causes a missed activation. A nearby request causes a false activation. A script fails on an edge case. An installer omits references. A runtime ignores a capability. Repeated runs behave differently. \"Can version 3.1.0 ship?\" working once tells you none of this. A skill is a software package that must be evaluated, not a Markdown prompt that merely looks correct.",
    "bodyKn": "ಅಪರಿಚಿತ ಪದ ಬಳಕೆ activation ತಪ್ಪಿಸುತ್ತದೆ; ಸಮೀಪದ ಕೋರಿಕೆ ತಪ್ಪು activation ಮಾಡುತ್ತದೆ; installer references ಬಿಡುತ್ತದೆ. skill ಒಂದು ಸಾಫ್ಟ್‌ವೇರ್ package."
   }
  },
  {
   "type": "diagram",
   "data": {
    "titleEn": "Six independent layers, one release gate",
    "titleKn": "ಆರು ಸ್ವತಂತ್ರ ಪದರಗಳು, ಒಂದು release gate",
    "contentEn": "1 Package structure      static lint, no model needed\n2 Trigger routing        selects, abstains, confuses?\n3 Artifact behavior      does the chosen skill produce the contract, better than baseline?\n4 Script correctness     deterministic helpers tested like software\n5 Safety and authority   stays inside the authority it was given\n6 Packaging/portability  survives installation and host differences\n            |\n       RELEASE GATE      every mandatory layer must pass: passing one cannot compensate for failing another"
   }
  },
  {
   "type": "table",
   "data": {
    "headingEn": "Key terms",
    "headers": [
     "Term",
     "Meaning"
    ],
    "rows": [
     [
      "Trigger eval",
      "Measures selection, abstention and confusion at the routing boundary"
     ],
     [
      "Behavior eval",
      "After activation, does the skill do the task?"
     ],
     [
      "Baseline",
      "Same model, tools and task with no skill; compared with the same with the skill"
     ],
     [
      "Artifact contract",
      "The observable, independently checkable output that proves completion"
     ],
     [
      "Capability matrix",
      "Per-capability host support: supported, adapted, degraded or unsupported"
     ],
     [
      "Release gate",
      "Independent thresholds combined without averaging away hard failures"
     ],
     [
      "Silent degradation",
      "A host loses required behaviour without saying so"
     ]
    ]
   }
  },
  {
   "type": "heading",
   "data": {
    "textEn": "Define the Workflow First",
    "textKn": "ಮೊದಲು Workflow ವ್ಯಾಖ್ಯಾನಿಸಿ",
    "level": "H2"
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "Scope by Workflow, Not Topic",
    "headingKn": "ವಿಷಯದ ಬದಲು Workflow ಆಧಾರಿತ",
    "bodyEn": "\"Create a Kubernetes skill\" contains countless workflows. \"Diagnose why one deployment is not Available, collect evidence without changing the cluster, and produce a ranked incident report\" has a trigger boundary, an evidence sequence, judgment points, scriptable operations, a defined artifact and a read-only safety boundary, so it can be evaluated. Work from the observable contract inward: artifact contract, verification, evidence tools, decision map, references, entry body, description, adapters, evals, package.",
    "bodyKn": "\"Kubernetes skill\" ಅಸ್ಪಷ್ಟ. ನಿರ್ದಿಷ್ಟ workflow ಮೌಲ್ಯಮಾಪನ ಮಾಡಬಹುದು. ಗಮನಿಸಬಹುದಾದ ಒಪ್ಪಂದದಿಂದ ಒಳಗೆ ಕೆಲಸ ಮಾಡಿ."
   }
  },
  {
   "type": "table",
   "data": {
    "headingEn": "Judgment versus deterministic work",
    "headers": [
     "Use the model for",
     "Use code for"
    ],
    "rows": [
     [
      "Classifying the request",
      "Parsing files"
     ],
     [
      "Resolving ambiguity",
      "Counting and hashing"
     ],
     [
      "Prioritizing findings",
      "Schema and path validation"
     ],
     [
      "Interpreting and synthesizing evidence",
      "Typed API operations"
     ]
    ]
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "Do Not Ask a Model to Hash 500 Files",
    "headingKn": "ಮಾದರಿಯನ್ನು 500 ಫೈಲ್ hash ಮಾಡಲು ಕೇಳಬೇಡಿ",
    "bodyEn": "Model judgment classifies and later synthesizes; deterministic code parses, hashes, validates and counts in between. Deterministic operations can then be unit-tested on their own, which Part 2 does.",
    "bodyKn": "ಮಾದರಿ ವರ್ಗೀಕರಿಸಿ ಸಂಶ್ಲೇಷಿಸುತ್ತದೆ; ಕೋಡ್ ಪಾರ್ಸ್, hash, ಮಾನ್ಯತೆ ಮಾಡುತ್ತದೆ."
   }
  },
  {
   "type": "heading",
   "data": {
    "textEn": "Layer 1: Package Structure",
    "textKn": "Layer 1: Package Structure",
    "level": "H2"
   }
  },
  {
   "type": "code",
   "data": {
    "filename": "eval_lab.py",
    "headingEn": "lint_package with stable issue codes",
    "headingKn": "ಸ್ಥಿರ issue ಕೋಡ್‌ಗಳೊಂದಿಗೆ lint_package",
    "descEn": "Static checks need no model: the root exists and is a directory, SKILL.md exists and is a regular file, and the body has an Output contract section and a Failure behavior section. Stable E_ codes let CI tell errors from warnings. Cheap deterministic checks run first so expensive model calls are not spent on a package that is structurally broken.",
    "descKn": "static ಪರಿಶೀಲನೆಗೆ ಮಾದರಿ ಬೇಡ. ಸ್ಥಿರ E_ ಕೋಡ್‌ಗಳು CI ಗೆ ಸಹಾಯ. ಸರಳ ಪರಿಶೀಲನೆ ಮೊದಲು.",
    "code": "@dataclass\nclass LintIssue:\n    code: str\n    message: str\n    path: str | None = None\n\ndef lint_package(root: Path) -> list:\n    issues = []\n    if not root.exists(): return [LintIssue(\"E_ROOT_MISSING\", \"Package root does not exist.\", str(root))]\n    if not root.is_dir(): return [LintIssue(\"E_ROOT_NOT_DIRECTORY\", \"Package root must be a directory.\", str(root))]\n    skill = root / \"SKILL.md\"\n    if not skill.exists(): return [LintIssue(\"E_SKILL_MISSING\", \"SKILL.md is required at package root.\", str(skill))]\n    if not skill.is_file(): return [LintIssue(\"E_SKILL_NOT_FILE\", \"SKILL.md must be a regular file.\", str(skill))]\n    text = skill.read_text(encoding=\"utf-8\")\n    if \"## Output contract\" not in text: issues.append(LintIssue(\"E_OUTPUT_CONTRACT\", \"Missing ## Output contract section.\", str(skill)))\n    if \"## Failure behavior\" not in text: issues.append(LintIssue(\"E_FAILURE_BEHAVIOR\", \"Missing ## Failure behavior section.\", str(skill)))\n    return issues"
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
    "headingEn": "Lint a good package and two broken ones",
    "headingKn": "ಒಂದು ಒಳ್ಳೆಯ ಮತ್ತು ಎರಡು ಮುರಿದ package lint ಮಾಡಿ",
    "descEn": "The good package has the required sections. The second has frontmatter but neither section, so both codes appear. The third path does not exist at all, so linting stops at E_ROOT_MISSING. The lint output is evidence a CI job could assert on.",
    "descKn": "ಒಳ್ಳೆಯ package ಗೆ ಅಗತ್ಯ ವಿಭಾಗಗಳಿವೆ. ಎರಡನೆಯದಕ್ಕೆ ಇಲ್ಲ, ಮೂರನೆಯದು ಅಸ್ತಿತ್ವದಲ್ಲೇ ಇಲ್ಲ.",
    "code": "print(\"  good package:\", [i.code for i in lint_package(root)] or \"no issues\")\nprint(\"  package missing sections:\", [i.code for i in lint_package(bad)])\nprint(\"  no SKILL.md:\", [i.code for i in lint_package(Path(t) / \"empty-dir-that-does-not-exist\")])"
   }
  },
  {
   "type": "output",
   "data": {
    "output": "good package: no issues\n  package missing sections: ['E_OUTPUT_CONTRACT', 'E_FAILURE_BEHAVIOR']\n  no SKILL.md: ['E_ROOT_MISSING']"
   }
  },
  {
   "type": "heading",
   "data": {
    "textEn": "Layer 2: Trigger Routing",
    "textKn": "Layer 2: Trigger Routing",
    "level": "H2"
   }
  },
  {
   "type": "table",
   "data": {
    "headingEn": "Six kinds of trigger case",
    "headers": [
     "Category",
     "Example",
     "Should the skill trigger?"
    ],
    "rows": [
     [
      "positive",
      "Can version 3.1.0 ship?",
      "Yes"
     ],
     [
      "paraphrased-positive",
      "Audit this tag before we publish it.",
      "Yes: same intent, different words"
     ],
     [
      "clear-negative",
      "Explain batch normalization.",
      "No: catches gross over-routing"
     ],
     [
      "near-miss",
      "Why did the package build fail?",
      "No: shares vocabulary, different intent"
     ],
     [
      "competing-skill",
      "Draft the release notes.",
      "No: belongs to a neighbouring skill"
     ],
     [
      "adversarial",
      "Do not run release readiness. Explain this traceback.",
      "No: names the skill in order to reject it"
     ]
    ]
   }
  },
  {
   "type": "code",
   "data": {
    "filename": "eval_lab.py",
    "headingEn": "Cases, a router interface, and observations",
    "headingKn": "ಪ್ರಕರಣಗಳು, router ಇಂಟರ್ಫೇಸ್, ಮತ್ತು observations",
    "descEn": "A router is anything that maps a prompt to True or False, so the evaluator works with any implementation. evaluate_triggers only records what happened (expected versus predicted) and leaves metrics to another function, keeping execution and measurement separate. The teaching_router below is a deterministic keyword stand-in for understanding the harness, not a claim about a production router.",
    "descKn": "router = prompt ಇಂದ True/False. evaluate_triggers ಏನಾಯಿತು ಎಂದು ದಾಖಲಿಸುತ್ತದೆ; metrics ಬೇರೆ. teaching_router ಬೋಧನಾ ಬದಲಿ.",
    "code": "@dataclass\nclass TriggerCase:\n    case_id: str\n    prompt: str\n    should_trigger: bool\n    category: str\n\n@dataclass\nclass TriggerObservation:\n    case_id: str\n    category: str\n    expected: bool\n    predicted: bool\n\n@dataclass\nclass ClassificationMetrics:\n    true_positives: int\n    false_positives: int\n    false_negatives: int\n    true_negatives: int\n    precision: float\n    recall: float\n    f1: float\n    accuracy: float\n\nRouter = Callable[[str], bool]\n\nTRIGGER_CASES = [\n    TriggerCase(\"p1\", \"Can version 3.1.0 ship?\", True, \"positive\"),\n    TriggerCase(\"p2\", \"Audit this tag before we publish it.\", True, \"paraphrased-positive\"),\n    TriggerCase(\"p3\", \"Check whether this candidate is safe to release.\", True, \"paraphrased-positive\"),\n    TriggerCase(\"n1\", \"Explain batch normalization.\", False, \"clear-negative\"),\n    TriggerCase(\"n2\", \"Why did the package build fail?\", False, \"near-miss\"),\n    TriggerCase(\"n3\", \"Draft the release notes.\", False, \"competing-skill\"),\n    TriggerCase(\"n4\", \"Do not run release readiness. Explain this traceback.\", False, \"adversarial\"),\n]\n\ndef teaching_router(prompt):\n    text = prompt.lower()\n    positive = (\"can version\", \"ship\", \"before we publish\", \"candidate\", \"safe to release\", \"release readiness\")\n    negative = (\"do not run release readiness\", \"batch normalization\", \"release notes\", \"stack trace\", \"traceback\")\n    if any(s in text for s in negative): return False\n    return any(s in text for s in positive)\n\ndef keyword_router(prompt):\n    \"\"\"A deliberately naive router: any release-ish word triggers.\"\"\"\n    return any(w in prompt.lower() for w in (\"release\", \"package\", \"build\", \"version\", \"publish\", \"ship\"))\n\ndef evaluate_triggers(cases, router):\n    return [TriggerObservation(c.case_id, c.category, c.should_trigger, router(c.prompt)) for c in cases]"
   }
  },
  {
   "type": "output",
   "data": {
    "output": "(definitions only: no output yet)"
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "Confusion Matrix Vocabulary",
    "headingKn": "Confusion Matrix ಪದಕೋಶ",
    "bodyEn": "True positive: should trigger and did. False positive: should not trigger but did (over-triggering). False negative: should trigger but did not (under-triggering). True negative: correctly abstained. Abstention quality matters: a router is not good merely because it selects things.",
    "bodyKn": "TP: ಆಗಬೇಕಿತ್ತು ಆಯಿತು; FP: ಆಗಬಾರದಿತ್ತು ಆಯಿತು; FN: ಆಗಬೇಕಿತ್ತು ಆಗಲಿಲ್ಲ; TN: ಸರಿಯಾಗಿ ತ್ಯಜಿಸಿತು."
   }
  },
  {
   "type": "code",
   "data": {
    "filename": "eval_lab.py",
    "headingEn": "classification_metrics keeps counts and ratios",
    "headingKn": "classification_metrics ಎಣಿಕೆ ಮತ್ತು ಅನುಪಾತ ಎರಡನ್ನೂ ಇರಿಸುತ್ತದೆ",
    "descEn": "precision = TP / (TP + FP): of the activations, how many were right. recall = TP / (TP + FN): of the cases that should activate, how many were caught. F1 balances them. accuracy = (TP + TN) / total. Raw counts stay alongside the ratios because 10/10 and 100/100 are both 100% but are very different amounts of evidence.",
    "descKn": "precision = TP/(TP+FP); recall = TP/(TP+FN); F1 ಸಮತೋಲನ; accuracy = (TP+TN)/ಒಟ್ಟು. ಎಣಿಕೆ ಉಳಿಸಿ.",
    "code": "def classification_metrics(obs):\n    tp = sum(1 for o in obs if o.expected and o.predicted); fp = sum(1 for o in obs if not o.expected and o.predicted)\n    fn = sum(1 for o in obs if o.expected and not o.predicted); tn = sum(1 for o in obs if not o.expected and not o.predicted)\n    precision = tp / (tp + fp) if tp + fp else 0.0\n    recall = tp / (tp + fn) if tp + fn else 0.0\n    f1 = 2 * precision * recall / (precision + recall) if precision + recall else 0.0\n    total = tp + fp + fn + tn\n    return ClassificationMetrics(tp, fp, fn, tn, round(precision, 4), round(recall, 4), round(f1, 4), round((tp + tn) / total if total else 0.0, 4))\n\ndef count_near_miss_false_positives(obs):\n    return sum(1 for o in obs if o.category == \"near-miss\" and o.expected is False and o.predicted is True)"
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
    "headingEn": "Two routers, the same seven cases",
    "headingKn": "ಎರಡು routers, ಅದೇ ಏಳು ಪ್ರಕರಣಗಳು",
    "descEn": "The teaching router gets all seven right (precision 1.0, recall 1.0). A naive router that fires on any release-ish word gets the three positives and the clear negative right, but false-fires on the near miss, the competing skill and the adversarial case: precision 0.5, recall still 1.0, accuracy 0.5714. Notice recall alone (1.0) would have hidden the problem, and note the seven cases are far too few for a real claim.",
    "descKn": "ಬೋಧನಾ router ಎಲ್ಲಾ ಏಳನ್ನು ಸರಿಯಾಗಿ ಪಡೆಯುತ್ತದೆ. ಸರಳ keyword router near miss, competing skill, adversarial ನಲ್ಲಿ ತಪ್ಪಾಗಿ ಚಲಿಸುತ್ತದೆ: precision 0.5. ಕೇವಲ ಏಳು ಪ್ರಕರಣ ನಿಜ ಹೇಳಿಕೆಗೆ ಬಹಳ ಕಡಿಮೆ.",
    "code": "def teaching_router(prompt):\n    text = prompt.lower()\n    positive = (\"can version\", \"ship\", \"before we publish\", \"candidate\", \"safe to release\", \"release readiness\")\n    negative = (\"do not run release readiness\", \"batch normalization\", \"release notes\", \"stack trace\", \"traceback\")\n    if any(s in text for s in negative): return False\n    return any(s in text for s in positive)\n\ndef keyword_router(prompt):\n    \"\"\"A deliberately naive router: any release-ish word triggers.\"\"\"\n    return any(w in prompt.lower() for w in (\"release\", \"package\", \"build\", \"version\", \"publish\", \"ship\"))\n\nobs = evaluate_triggers(TRIGGER_CASES, teaching_router)\nprint_obs(obs)\nprint(json.dumps(classification_metrics(obs).__dict__))\nobs_naive = evaluate_triggers(TRIGGER_CASES, keyword_router)\nprint_obs(obs_naive)\nprint(json.dumps(classification_metrics(obs_naive).__dict__), \"| near-miss false positives:\", count_near_miss_false_positives(obs_naive))"
   }
  },
  {
   "type": "output",
   "data": {
    "output": "teaching router:\n  p1  positive              expected=True  predicted=True  PASS\n  p2  paraphrased-positive  expected=True  predicted=True  PASS\n  p3  paraphrased-positive  expected=True  predicted=True  PASS\n  n1  clear-negative        expected=False predicted=False PASS\n  n2  near-miss             expected=False predicted=False PASS\n  n3  competing-skill       expected=False predicted=False PASS\n  n4  adversarial           expected=False predicted=False PASS\n  {\"true_positives\": 3, \"false_positives\": 0, \"false_negatives\": 0, \"true_negatives\": 4, \"precision\": 1.0, \"recall\": 1.0, \"f1\": 1.0, \"accuracy\": 1.0}\n  naive keyword router (any release-ish word):\n  p1  positive              expected=True  predicted=True  PASS\n  p2  paraphrased-positive  expected=True  predicted=True  PASS\n  p3  paraphrased-positive  expected=True  predicted=True  PASS\n  n1  clear-negative        expected=False predicted=False PASS\n  n2  near-miss             expected=False predicted=True  FAIL\n  n3  competing-skill       expected=False predicted=True  FAIL\n  n4  adversarial           expected=False predicted=True  FAIL\n  {\"true_positives\": 3, \"false_positives\": 3, \"false_negatives\": 0, \"true_negatives\": 1, \"precision\": 0.5, \"recall\": 1.0, \"f1\": 0.6667, \"accuracy\": 0.5714} | near-miss false positives: 1"
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "Accuracy Can Hide a Router That Never Fires",
    "headingKn": "Accuracy ಎಂದಿಗೂ ಚಲಿಸದ Router ಅನ್ನು ಮರೆಮಾಡಬಹುದು",
    "bodyEn": "With 1000 requests where 990 should not trigger and 10 should, a router that always says False scores 99% accuracy and 0% recall. Report all four numbers and the counts.",
    "bodyKn": "1000 ಕೋರಿಕೆಗಳಲ್ಲಿ 990 ಚಲಿಸಬಾರದು; ಯಾವಾಗಲೂ False ಹೇಳುವ router 99% accuracy, 0% recall."
   }
  },
  {
   "type": "code",
   "data": {
    "filename": "eval_lab.py",
    "headingEn": "The skewed set",
    "headingKn": "ಓರೆಯಾದ ಸೆಟ್",
    "descEn": "Constructed on purpose: 990 correct negatives and 10 missed positives. Accuracy 0.99, recall 0.0, F1 0.0.",
    "descKn": "ಉದ್ದೇಶಪೂರ್ವಕವಾಗಿ ರಚಿಸಲಾಗಿದೆ: accuracy 0.99, recall 0.0.",
    "code": "skew = [TriggerObservation(f\"n{i}\", \"clear-negative\", False, False) for i in range(990)] + [TriggerObservation(f\"p{i}\", \"positive\", True, False) for i in range(10)]\nm = classification_metrics(skew)\nprint(f\"  accuracy={m.accuracy} recall={m.recall} f1={m.f1}\")"
   }
  },
  {
   "type": "output",
   "data": {
    "output": "accuracy=0.99 recall=0.0 f1=0.0"
   }
  },
  {
   "type": "heading",
   "data": {
    "textEn": "Do Not Overfit the Description",
    "textKn": "Description ಅನ್ನು Overfit ಮಾಡಬೇಡಿ",
    "level": "H2"
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "Development, Validation and Held-Out Sets",
    "headingKn": "Development, Validation, Held-Out ಸೆಟ್‌ಗಳು",
    "bodyEn": "Split routing cases into development (used while editing the description), validation (does the change generalize?) and held-out (final independent evidence). Otherwise you patch each failing prompt into the description (\"audit this tag before publishing\", then \"prior to deployment\", then...) and end up memorizing the test set instead of learning a boundary. Trigger metrics from a lexical simulator also cannot prove production routing quality, which depends on the actual model, catalog serialization, competing skills and policy of the target runtime.",
    "bodyKn": "development, validation, held-out ಸೆಟ್‌ಗಳಾಗಿ ವಿಭಜಿಸಿ. ಇಲ್ಲದಿದ್ದರೆ test ಸೆಟ್ ಅನ್ನು ಕಂಠಪಾಠ ಮಾಡುತ್ತೀರಿ. simulator ಮಾಪನ production ಗೆ ಪುರಾವೆ ಅಲ್ಲ."
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "Key Takeaways",
    "headingKn": "ಮುಖ್ಯ ಅಂಶಗಳು",
    "bodyEn": "• Six independent layers feed one gate; passing one never substitutes for another.\n• Define the workflow, the artifact contract and the judgment/code split before polishing prose.\n• We genuinely linted three packages: the good one had no issues, the broken one reported E_OUTPUT_CONTRACT and E_FAILURE_BEHAVIOR, and the missing one E_ROOT_MISSING.\n• Same seven cases, two routers: teaching router 7/7; naive keyword router precision 0.5, recall 1.0, accuracy 0.5714 with 1 near-miss false positive.\n• A router that never fires scored accuracy 0.99 with recall 0.0. Keep counts, keep near misses, keep held-out data, and test the real runtime.",
    "bodyKn": "• ಆರು ಸ್ವತಂತ್ರ ಪದರಗಳು, ಒಂದು gate.\n• ಮೊದಲು workflow ಮತ್ತು artifact ಒಪ್ಪಂದ.\n• ಮೂರು packages lint ಮಾಡಿದೆವು.\n• ಎರಡು routers: 7/7 vs precision 0.5.\n• accuracy 0.99 ಆದರೆ recall 0.0 ಸಾಧ್ಯ."
   }
  },
  {
   "type": "quiz",
   "data": {
    "questions": [
     {
      "q": "What is the primary purpose of a trigger eval?",
      "qKn": "trigger eval ನ ಮುಖ್ಯ ಉದ್ದೇಶ?",
      "opts": [
       "Test whether Python scripts compile",
       "Measure selection, abstention and routing confusion",
       "Compare file hashes",
       "Verify the final artifact schema"
      ],
      "optsKn": [
       "Python scripts compile ಆಗುತ್ತವೆಯೇ",
       "ಆಯ್ಕೆ, ತ್ಯಾಗ, routing ಗೊಂದಲ ಅಳೆಯುವುದು",
       "hash ಹೋಲಿಕೆ",
       "artifact schema ಪರಿಶೀಲನೆ"
      ],
      "correct": 1
     },
     {
      "q": "TP = 8, FP = 2. What is precision?",
      "qKn": "TP = 8, FP = 2. precision ಎಷ್ಟು?",
      "opts": [
       "0.20",
       "0.80",
       "1.00",
       "Cannot be calculated"
      ],
      "optsKn": [
       "0.20",
       "0.80",
       "1.00",
       "ಲೆಕ್ಕ ಹಾಕಲಾಗದು"
      ],
      "correct": 1
     },
     {
      "q": "Why are near-miss negatives especially useful?",
      "qKn": "near-miss negatives ಏಕೆ ವಿಶೇಷವಾಗಿ ಉಪಯುಕ್ತ?",
      "opts": [
       "They make the dataset larger",
       "They test whether the router can tell the intended workflow from neighbouring requests",
       "They replace positive cases",
       "They prove script correctness"
      ],
      "optsKn": [
       "ಡೇಟಾಸೆಟ್ ದೊಡ್ಡದಾಗಿಸುತ್ತವೆ",
       "ಉದ್ದೇಶಿತ workflow ಅನ್ನು ಸಮೀಪದ ಕೋರಿಕೆಗಳಿಂದ ಪ್ರತ್ಯೇಕಿಸಬಹುದೇ ಎಂದು ಪರೀಕ್ಷಿಸುತ್ತವೆ",
       "positive ಬದಲಿಸುತ್ತವೆ",
       "script ಸರಿ ಎಂದು ಸಾಬೀತು"
      ],
      "correct": 1
     },
     {
      "q": "Why implement hashing and schema validation in code rather than asking the model?",
      "qKn": "hashing ಮತ್ತು schema ಪರಿಶೀಲನೆಯನ್ನು ಮಾದರಿಗೆ ಬದಲು ಕೋಡ್‌ನಲ್ಲಿ ಏಕೆ?",
      "opts": [
       "Models cannot produce text",
       "Deterministic code is repeatable and its invariants are independently testable",
       "Python solves routing",
       "Scripts remove the need for judgment"
      ],
      "optsKn": [
       "ಮಾದರಿ ಪಠ್ಯ ನೀಡಲಾರದು",
       "ನಿರ್ಧಾರಾತ್ಮಕ ಕೋಡ್ ಪುನರಾವರ್ತನೀಯ, ಸ್ವತಂತ್ರವಾಗಿ ಪರೀಕ್ಷಿಸಬಹುದು",
       "Python routing ಪರಿಹರಿಸುತ್ತದೆ",
       "scripts judgment ತೆಗೆಯುತ್ತವೆ"
      ],
      "correct": 1
     },
     {
      "q": "A skill achieves precision 1.0 and recall 1.0 on its cases. Is it production-ready?",
      "qKn": "skill ತನ್ನ ಪ್ರಕರಣಗಳಲ್ಲಿ precision 1.0, recall 1.0 ಪಡೆಯುತ್ತದೆ. production-ಸಿದ್ಧವೇ?",
      "opts": [
       "Yes",
       "Yes if F1 is 1.0 too",
       "No: it is only routing evidence for the evaluated cases",
       "Yes if SKILL.md exists"
      ],
      "optsKn": [
       "ಹೌದು",
       "F1 1.0 ಆದರೆ ಹೌದು",
       "ಇಲ್ಲ: ಮೌಲ್ಯಮಾಪಿತ ಪ್ರಕರಣಗಳ routing ಸಾಕ್ಷ್ಯ ಮಾತ್ರ",
       "SKILL.md ಇದ್ದರೆ ಹೌದು"
      ],
      "correct": 2
     }
    ]
   }
  }
 ]
};
