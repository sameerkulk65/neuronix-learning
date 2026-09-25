module.exports = {
 "phaseId": "6a369d5e66020ed05b3214c3",
 "moduleId": "6ab6d18eb7119db96ad77965",
 "order": 1,
 "type": "interactive",
 "duration": 45,
 "difficulty": "intermediate",
 "status": "published",
 "title": "Skill Discovery and Progressive Disclosure (Part 2 of 3) — Catalog, SKILL.md and Branch-Specific Resources",
 "titleKn": "Skill Discovery ಮತ್ತು Progressive Disclosure (Part 2 of 3) — Catalog, SKILL.md ಮತ್ತು Branch-ನಿರ್ದಿಷ್ಟ Resources",
 "desc": "Context must be earned by task relevance. Learn the three disclosure levels, why SKILL.md should be a map and procedure, how branch conditions and a shallow reference graph keep loading selective, and why catalog cost and active-context cost are different budgets.",
 "descKn": "context ಅನ್ನು ಕಾರ್ಯ ಪ್ರಸ್ತುತತೆಯಿಂದ ಗಳಿಸಬೇಕು. ಮೂರು disclosure ಹಂತಗಳು, SKILL.md ನಕ್ಷೆಯಾಗಿ, branch ಷರತ್ತುಗಳು, ಮತ್ತು catalog vs active ವೆಚ್ಚ.",
 "objectives": [
  "State the three disclosure levels and the question each answers.",
  "Explain why the central workflow must stay in SKILL.md and why \"read the references\" is progressive confusion.",
  "Write branch conditions and a one-hop reference map with an observable load condition for every file.",
  "Record a skill.resource.loaded event with a reason, and use it to spot \"load everything just in case\".",
  "Distinguish catalog cost from active-context cost and show that a small catalog does not mean a small task context."
 ],
 "objectivesKn": [
  "ಮೂರು disclosure ಹಂತಗಳು ಮತ್ತು ಅವು ಉತ್ತರಿಸುವ ಪ್ರಶ್ನೆ ತಿಳಿಸಿ.",
  "ಕೇಂದ್ರ workflow SKILL.md ನಲ್ಲಿ ಏಕೆ ಇರಬೇಕು ಎಂದು ವಿವರಿಸಿ.",
  "branch ಷರತ್ತುಗಳು ಮತ್ತು ಒಂದು-ಹಾಪ್ ನಕ್ಷೆ ಬರೆಯಿರಿ.",
  "reason ಜೊತೆ skill.resource.loaded ಘಟನೆ ದಾಖಲಿಸಿ.",
  "catalog ವೆಚ್ಚ ಮತ್ತು active ವೆಚ್ಚ ಬೇರ್ಪಡಿಸಿ."
 ],
 "blocks": [
  {
   "type": "heading",
   "data": {
    "textEn": "Skill Discovery and Progressive Disclosure (Part 2 of 3)",
    "textKn": "Skill Discovery and Progressive Disclosure (Part 2 of 3)",
    "level": "H1"
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "Lesson Info",
    "headingKn": "Lesson ಮಾಹಿತಿ",
    "bodyEn": "• Type: Build · Language: Python (stdlib only) · Time: ~45 minutes. The source lesson describes its main.py but does not include the code, so the program here is our own teaching implementation of the same components (Scope, SkillCandidate, discover_scope, resolve_collisions, CatalogEntry, CatalogBudget, build_catalog, load_skill_body, validate_reference, load_reference). All outputs were produced by genuinely running it in temporary directories. Its limits (4000-char body, 2000-byte reference, the catalog budget) are our teaching numbers.",
    "bodyKn": "• Type: Build · Language: Python (stdlib only) · Time: ~45 ನಿಮಿಷಗಳು. ಮೂಲ ಪಾಠ main.py ಕೋಡ್ ಒಳಗೊಂಡಿಲ್ಲ; ಇಲ್ಲಿನ ಕಾರ್ಯಕ್ರಮ ಅದೇ ಘಟಕಗಳ ನಮ್ಮದೇ ಬೋಧನಾ ಅನುಷ್ಠಾನ. ಎಲ್ಲಾ outputs ತಾತ್ಕಾಲಿಕ ಡೈರೆಕ್ಟರಿಗಳಲ್ಲಿ ನಿಜವಾಗಿ ಚಲಾಯಿಸಿ ಪಡೆದವು. ಮಿತಿಗಳು ನಮ್ಮ ಬೋಧನಾ ಸಂಖ್ಯೆಗಳು."
   }
  },
  {
   "type": "heading",
   "data": {
    "textEn": "Three Levels of Context",
    "textKn": "ಮೂರು ಹಂತದ Context",
    "level": "H2"
   }
  },
  {
   "type": "table",
   "data": {
    "headingEn": "Progressive disclosure",
    "headers": [
     "Level",
     "What enters context",
     "Question it answers"
    ],
    "rows": [
     [
      "1: Catalog",
      "name + description",
      "Which skill should I use?"
     ],
     [
      "2: Body",
      "The SKILL.md body: workflow and decision map",
      "How should I perform this task?"
     ],
     [
      "3: Resources",
      "One branch-specific reference, script or asset",
      "What extra detail does this branch need?"
     ]
    ]
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "Context Admission Is Not Permission Escalation",
    "headingKn": "Context ಪ್ರವೇಶ ≠ ಅನುಮತಿ ಹೆಚ್ಚಳ",
    "bodyEn": "Progressive disclosure controls what information enters context. It does not by itself grant capabilities: a file under scripts/ is not automatically executable, and a file under references/ is not automatically loaded. The host still needs file access, execution tools, permissions and policy. The directory names references, scripts and assets are conventions, not capability declarations.",
    "bodyKn": "progressive disclosure context ಗೆ ಏನು ಬರುತ್ತದೆ ಎಂದು ನಿಯಂತ್ರಿಸುತ್ತದೆ, ಸಾಮರ್ಥ್ಯಗಳನ್ನು ನೀಡುವುದಿಲ್ಲ."
   }
  },
  {
   "type": "heading",
   "data": {
    "textEn": "Level 2: The Body Is a Map",
    "textKn": "Level 2: Body ಒಂದು ನಕ್ಷೆ",
    "level": "H2"
   }
  },
  {
   "type": "code",
   "data": {
    "filename": "discovery_lab.py",
    "headingEn": "Activating a skill: load_skill_body",
    "headingKn": "skill activate ಮಾಡುವುದು: load_skill_body",
    "descEn": "Activation moves from \"I know this skill exists\" to \"I am using this skill\". It reads only the selected skill's SKILL.md body. The body is the map and the procedure: a boundary, a default workflow, branch conditions with direct references, failure behaviour and output. It is not a giant encyclopedia and not a one-line \"go read another file\".",
    "descKn": "activation \"ಈ skill ಇದೆ\" ಇಂದ \"ಈ skill ಬಳಸುತ್ತಿದ್ದೇನೆ\" ಗೆ ಚಲಿಸುತ್ತದೆ. ಆಯ್ದ skill ನ SKILL.md body ಮಾತ್ರ ಓದುತ್ತದೆ.",
    "code": "def load_skill_body(entry):\n    meta, body = read_meta(Path(entry.path) / \"SKILL.md\")\n    return body\n\nbody = load_skill_body(entry)\nprint(body)"
   }
  },
  {
   "type": "output",
   "data": {
    "output": "1. Identify artifact type.\n2. For a Python package read references/python-release.md.\n3. For a container image read references/container-release.md."
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "Do Not Over-Split SKILL.md",
    "headingKn": "SKILL.md ಅನ್ನು ಅತಿಯಾಗಿ ವಿಭಜಿಸಬೇಡಿ",
    "bodyEn": "Moving the central workflow into references/workflow.md just to make SKILL.md short defeats Level 2: after activation the model would not know what to do, where to start, which branch matters or when to stop. Activation must provide enough context to begin correctly.",
    "bodyKn": "ಕೇಂದ್ರ workflow ಅನ್ನು ಬೇರೆ ಫೈಲ್‌ಗೆ ಸರಿಸಿದರೆ ಮಾದರಿಗೆ ಎಲ್ಲಿ ಪ್ರಾರಂಭಿಸಬೇಕು ಎಂದೇ ತಿಳಿಯದು."
   }
  },
  {
   "type": "heading",
   "data": {
    "textEn": "Branches and the Reference Graph",
    "textKn": "Branches ಮತ್ತು Reference Graph",
    "level": "H2"
   }
  },
  {
   "type": "table",
   "data": {
    "headingEn": "Good and bad load conditions",
    "headers": [
     "Instruction",
     "Verdict"
    ],
    "rows": [
     [
      "For a Python package, read references/python-release.md",
      "Good: observable condition, one file"
     ],
     [
      "For a container image, read references/container-release.md",
      "Good"
     ],
     [
      "If the release combines artifact types, read only the guides for those types",
      "Good"
     ],
     [
      "Read additional files as necessary",
      "Bad: vague, encourages loading everything"
     ],
     [
      "Read everything in references/",
      "Bad: no branching at all"
     ]
    ]
   }
  },
  {
   "type": "diagram",
   "data": {
    "titleEn": "Prefer a one-hop reference map",
    "titleKn": "ಒಂದು-ಹಾಪ್ ನಕ್ಷೆ ಆದ್ಯತೆ",
    "contentEn": "DEEP (risky)                      SHALLOW (preferred)\nSKILL.md                                    +-- python-release.md\n  -> python-release.md           SKILL.md ----+-- container-release.md\n     -> python-security.md                    +-- docs-release.md\n        -> signing.md                         `-- report-template.md\n\nA rule that lives four hops down may never reach context.\nCondition -> resource is also far easier to test."
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "References, Scripts, Assets",
    "headingKn": "References, Scripts, Assets",
    "bodyEn": "References carry prose and data the model reads. Scripts carry deterministic computation; the model may read one but running it needs a permitted tool. Assets are templates and inputs copied, filled or transformed into deliverables, and are not automatically authoritative instructions.",
    "bodyKn": "references = ಓದುವ ಮಾಹಿತಿ; scripts = ನಿರ್ಧಾರಾತ್ಮಕ ಗಣನೆ; assets = ಟೆಂಪ್ಲೇಟ್."
   }
  },
  {
   "type": "heading",
   "data": {
    "textEn": "Level 3, With a Reason",
    "textKn": "Reason ಜೊತೆ Level 3",
    "level": "H2"
   }
  },
  {
   "type": "code",
   "data": {
    "filename": "discovery_lab.py",
    "headingEn": "load_reference records a disclosure event",
    "headingKn": "load_reference ಒಂದು disclosure ಘಟನೆ ದಾಖಲಿಸುತ್ತದೆ",
    "descEn": "The repository contains pyproject.toml, so the Python branch is chosen and only python-release.md is read. The event records what, which skill, which resource, why and how many bytes. container-release.md was never loaded. Path safety inside load_reference is the subject of Part 3.",
    "descKn": "ರೆಪೊದಲ್ಲಿ pyproject.toml ಇದೆ, ಆದ್ದರಿಂದ Python branch; python-release.md ಮಾತ್ರ ಓದಲಾಗುತ್ತದೆ. ಘಟನೆ ಏಕೆ ಎಂದೂ ದಾಖಲಿಸುತ್ತದೆ.",
    "code": "events = []\ntext = load_reference(entry, \"references/python-release.md\", \"candidate contains pyproject.toml\", events)\nprint(\"  loaded:\", text)\nprint(\"  event:\", json.dumps(events[0]))\nprint(\"  container-release.md loaded?\", any(e[\"resource\"].endswith(\"container-release.md\") for e in events))"
   }
  },
  {
   "type": "output",
   "data": {
    "output": "loaded: Python release rules: build sdist and wheel, check twine.\n  event: {\"event\": \"skill.resource.loaded\", \"skill\": \"release-readiness\", \"resource\": \"references/python-release.md\", \"reason\": \"candidate contains pyproject.toml\", \"bytes\": 57}\n  container-release.md loaded? False"
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "Reasons Reveal \"Just in Case\" Loading",
    "headingKn": "\"ಸುಮ್ಮನೆ ಇರಲಿ\" ಲೋಡಿಂಗ್ ಬಹಿರಂಗ",
    "bodyEn": "If the log shows python-release.md with reason \"Python package\" and then container-release.md, docs-release.md and security.md with reasons like \"may be useful\" or \"just in case\", the decision map is failing and you have built progressive full-loading. The reason field is what makes selective loading auditable.",
    "bodyKn": "ಘಟನೆ ಲಾಗ್ ನಲ್ಲಿ \"ಉಪಯುಕ್ತವಾಗಬಹುದು\" ಎಂಬ reasons ಕಂಡರೆ decision map ವಿಫಲವಾಗಿದೆ."
   }
  },
  {
   "type": "heading",
   "data": {
    "textEn": "Two Different Budgets",
    "textKn": "ಎರಡು ಬೇರೆ ಬಜೆಟ್‌ಗಳು",
    "level": "H2"
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "catalog_cost = sum of c_i; active_cost = sum of b_j + sum of r_k",
    "headingKn": "catalog_cost = ∑c_i; active_cost = ∑b_j + ∑r_k",
    "bodyEn": "c_i is the serialized catalog cost of skill i; b_j is an activated body; r_k is a loaded resource. They are separate optimisation problems. A tiny catalog can front a 900-line body that says \"read every file in references/\", and a lean skill can hide behind a huge catalog of 2,000 verbose descriptions. Splitting files only saves context if the irrelevant branches genuinely stay unloaded.",
    "bodyKn": "c_i catalog ವೆಚ್ಚ; b_j activated body; r_k ಲೋಡ್ ಆದ resource. ಇವು ಬೇರೆ ಬೇರೆ ಸಮಸ್ಯೆಗಳು."
   }
  },
  {
   "type": "code",
   "data": {
    "filename": "discovery_lab.py",
    "headingEn": "Measure both, independently",
    "headingKn": "ಎರಡನ್ನೂ ಸ್ವತಂತ್ರವಾಗಿ ಅಳೆಯಿರಿ",
    "descEn": "The catalog cost is fixed by what was published; the active cost is what this task actually admitted. Loading every reference instead of one is the difference between the second and third numbers. In this tiny world the references are small, so treat the numbers as an illustration of the method, not as a saving claim.",
    "descKn": "catalog ವೆಚ್ಚ ಪ್ರಕಟಿಸಿದ್ದರಿಂದ ನಿರ್ಧರಿತ; active ವೆಚ್ಚ ಈ ಕಾರ್ಯ ಒಳಗೆ ಬಿಟ್ಟದ್ದು. ಸಂಖ್ಯೆಗಳು ವಿಧಾನದ ಉದಾಹರಣೆ ಮಾತ್ರ.",
    "code": "cat_cost = used_big\nactive = len(body) + len(text)\nloaded_all = len(body) + sum(len(p.read_text()) for p in (Path(entry.path) / \"references\").glob(\"*.md\"))\nprint(f\"  catalog chars: {cat_cost} | active chars (body + one reference): {active} | if every reference were loaded: {loaded_all}\")"
   }
  },
  {
   "type": "output",
   "data": {
    "output": "catalog chars: 513 | active chars (body + one reference): 205 | if every reference were loaded: 229"
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "Path Is Not Trust",
    "headingKn": "Path ≠ Trust",
    "bodyEn": "Even a correctly located and correctly selected python-release.md could contain misleading or malicious instructions. Disclosure answers \"should this enter context?\", not \"is it trustworthy?\". Part 3 shows what containment does and does not prove.",
    "bodyKn": "ಸರಿಯಾಗಿ ಆಯ್ಕೆಯಾದ ಫೈಲ್ ಸಹ ದಾರಿತಪ್ಪಿಸುವ ವಿಷಯ ಹೊಂದಿರಬಹುದು. Part 3 ಇದನ್ನು ತೋರಿಸುತ್ತದೆ."
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "Key Takeaways",
    "headingKn": "ಮುಖ್ಯ ಅಂಶಗಳು",
    "bodyEn": "• Level 1 routes, Level 2 tells the model how to begin, Level 3 supplies branch-specific detail.\n• The body is a map and procedure; every supporting file needs an observable load condition and ideally a one-hop link.\n• We genuinely activated one skill and loaded one reference with reason \"candidate contains pyproject.toml\"; container-release.md was never loaded.\n• Our numbers: catalog 513 chars, active 205 chars, and 229 chars if every reference were loaded. The world is tiny, so this shows how to measure, not that it saves much.\n• Disclosure controls admission to context, not authorization.",
    "bodyKn": "• Level 1 ದಾರಿ, Level 2 ಹೇಗೆ, Level 3 ವಿವರ.\n• body ನಕ್ಷೆ; ಪ್ರತಿ ಫೈಲ್‌ಗೆ ಷರತ್ತು.\n• ಒಂದು reference ಮಾತ್ರ ಲೋಡ್ ಆಯಿತು.\n• catalog vs active ವೆಚ್ಚ ಬೇರೆ.\n• disclosure ಅನುಮತಿ ಅಲ್ಲ."
   }
  },
  {
   "type": "quiz",
   "data": {
    "questions": [
     {
      "q": "What is Level 1 primarily for?",
      "qKn": "Level 1 ಪ್ರಮುಖವಾಗಿ ಏಕೆ?",
      "opts": [
       "Running scripts",
       "Routing to the appropriate skill",
       "Reading every reference",
       "Validating symlinks"
      ],
      "optsKn": [
       "scripts ಚಲಾಯಿಸಲು",
       "ಸೂಕ್ತ skill ಗೆ routing",
       "ಎಲ್ಲಾ references ಓದಲು",
       "symlinks ಮಾನ್ಯಗೊಳಿಸಲು"
      ],
      "correct": 1
     },
     {
      "q": "What should happen when a skill is activated?",
      "qKn": "skill activate ಆದಾಗ ಏನಾಗಬೇಕು?",
      "opts": [
       "Every installed skill is loaded",
       "Only assets are loaded",
       "Its SKILL.md body enters Level 2 context",
       "Every reference is loaded immediately"
      ],
      "optsKn": [
       "ಎಲ್ಲಾ skills ಲೋಡ್",
       "assets ಮಾತ್ರ",
       "ಅದರ SKILL.md body Level 2 ಗೆ",
       "ಎಲ್ಲಾ references ತಕ್ಷಣ"
      ],
      "correct": 2
     },
     {
      "q": "Which reference design shows progressive disclosure?",
      "qKn": "ಯಾವ reference ವಿನ್ಯಾಸ progressive disclosure ತೋರಿಸುತ್ತದೆ?",
      "opts": [
       "Read everything in references/",
       "Read extra files if useful",
       "For Python packages, read references/python-release.md",
       "Load all resources before determining the artifact type"
      ],
      "optsKn": [
       "references/ ನಲ್ಲಿರುವುದೆಲ್ಲ ಓದಿ",
       "ಉಪಯುಕ್ತವಾದರೆ ಹೆಚ್ಚುವರಿ ಓದಿ",
       "Python package ಗೆ references/python-release.md ಓದಿ",
       "artifact ಪ್ರಕಾರ ತಿಳಿಯುವ ಮೊದಲು ಎಲ್ಲಾ ಲೋಡ್"
      ],
      "correct": 2
     },
     {
      "q": "Why do catalog budget and active-context budget differ?",
      "qKn": "catalog ಮತ್ತು active-context ಬಜೆಟ್ ಬೇರೆ ಏಕೆ?",
      "opts": [
       "Catalog entries are not text",
       "The catalog pays for published routing metadata; active context pays for activated bodies and disclosed resources",
       "Active skills use no context",
       "References are free"
      ],
      "optsKn": [
       "catalog entries ಪಠ್ಯ ಅಲ್ಲ",
       "catalog ಪ್ರಕಟಿತ routing metadata ಗೆ; active context bodies ಮತ್ತು resources ಗೆ",
       "active skills context ಬಳಸುವುದಿಲ್ಲ",
       "references ಉಚಿತ"
      ],
      "correct": 1
     },
     {
      "q": "In the run, why was python-release.md loaded and not container-release.md?",
      "qKn": "run ನಲ್ಲಿ python-release.md ಏಕೆ ಲೋಡ್ ಆಯಿತು?",
      "opts": [
       "Alphabetical order",
       "The branch condition (pyproject.toml present) selected only the Python guide",
       "Random choice",
       "Container guides are always skipped"
      ],
      "optsKn": [
       "ವರ್ಣಮಾಲೆ ಕ್ರಮ",
       "branch ಷರತ್ತು Python ಮಾರ್ಗದರ್ಶಿ ಮಾತ್ರ ಆಯ್ಕೆ ಮಾಡಿತು",
       "ಯಾದೃಚ್ಛಿಕ",
       "container ಯಾವಾಗಲೂ ಬಿಡಲಾಗುತ್ತದೆ"
      ],
      "correct": 1
     }
    ]
   }
  }
 ]
};
