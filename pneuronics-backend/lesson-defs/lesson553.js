module.exports = {
 "phaseId": "6a369d5e66020ed05b3214c3",
 "moduleId": "6ab6d18eb7119db96ad77966",
 "order": 2,
 "type": "interactive",
 "duration": 55,
 "difficulty": "advanced",
 "status": "published",
 "title": "Skill Invocation and Routing (Part 3 of 3) — The Full Router, Policy Adapters and the Invocation Contract",
 "titleKn": "Skill Invocation ಮತ್ತು Routing (Part 3 of 3) — ಪೂರ್ಣ Router, Policy Adapters ಮತ್ತು Invocation Contract",
 "desc": "Assemble and run the whole router: core versus extension policy adapters, exact-name allowlists, actor-specific decisions for the same skill, explicit and implicit paths in one route_request, and the invocation contract that documents actors, arguments, ambiguity, missing dependencies and durable state.",
 "descKn": "ಪೂರ್ಣ router ಅನ್ನು ಜೋಡಿಸಿ ಚಲಾಯಿಸಿ: core vs extension policy adapters, allowlists, actor-ನಿರ್ದಿಷ್ಟ ನಿರ್ಧಾರಗಳು, ಮತ್ತು invocation contract.",
 "objectives": [
  "Explain why the router depends on a PolicyAdapter interface rather than raw host metadata.",
  "Show that a core adapter ignores host extensions while an extension adapter honours only explicitly recognised fields, with a recorded policy source.",
  "Run the same skill through model, application and harness actors and read the different decisions.",
  "Use an exact-name allowlist as a second, layered authorization check.",
  "Write an invocation contract as design documentation for adapters and tests, without presenting it as SKILL.md standard frontmatter."
 ],
 "objectivesKn": [
  "router PolicyAdapter ಮೇಲೆ ಏಕೆ ಅವಲಂಬಿಸುತ್ತದೆ ಎಂದು ವಿವರಿಸಿ.",
  "core adapter extensions ನಿರ್ಲಕ್ಷಿಸುತ್ತದೆ ಎಂದು ತೋರಿಸಿ.",
  "ಅದೇ skill ಅನ್ನು ಬೇರೆ actors ಮೂಲಕ ಓದಿ.",
  "exact-name allowlist ಬಳಸಿ.",
  "invocation contract ಬರೆಯಿರಿ."
 ],
 "blocks": [
  {
   "type": "heading",
   "data": {
    "textEn": "Skill Invocation and Routing (Part 3 of 3)",
    "textKn": "Skill Invocation and Routing (Part 3 of 3)",
    "level": "H1"
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "Lesson Info",
    "headingKn": "Lesson ಮಾಹಿತಿ",
    "bodyEn": "• Type: Build · Language: Python (stdlib only) · Time: ~45 minutes. The source names its main.py components (Actor, SkillMetadata, InvocationPolicy, InvocationRequest, InvocationDecision, two policy adapters, build_invocation_matrix, route_request) but does not include the code. Everything here is our own teaching implementation, and every output was genuinely produced by running it. The scorer is a deterministic lexical stand-in for what production routers usually do with a model; its weights and thresholds are our teaching choices.",
    "bodyKn": "• Type: Build · Language: Python (stdlib only) · Time: ~45 ನಿಮಿಷಗಳು. ಮೂಲ ಪಾಠ main.py ಘಟಕಗಳನ್ನು ಹೆಸರಿಸುತ್ತದೆ ಆದರೆ ಕೋಡ್ ಒಳಗೊಂಡಿಲ್ಲ. ಇಲ್ಲಿರುವುದೆಲ್ಲ ನಮ್ಮದೇ ಬೋಧನಾ ಅನುಷ್ಠಾನ; ಎಲ್ಲಾ outputs ನಿಜ run ಗಳಿಂದ. scorer ನಿರ್ಧಾರಾತ್ಮಕ ಲೆಕ್ಸಿಕಲ್ ಬದಲಿ; ತೂಕ ಮತ್ತು ಮಿತಿಗಳು ನಮ್ಮ ಬೋಧನಾ ಆಯ್ಕೆಗಳು."
   }
  },
  {
   "type": "heading",
   "data": {
    "textEn": "The Architecture",
    "textKn": "ವಾಸ್ತುಶಿಲ್ಪ",
    "level": "H2"
   }
  },
  {
   "type": "diagram",
   "data": {
    "titleEn": "One entry point, two paths",
    "titleKn": "ಒಂದು ಪ್ರವೇಶ, ಎರಡು ಮಾರ್ಗಗಳು",
    "contentEn": "InvocationRequest(actor, text, explicit_skill?)\n        |\n   route_request\n     /        \\\n explicit      implicit\n identity      eligible set (policy adapter)\n policy        relevance -> rank -> threshold -> margin\n allowlist          |\n     \\            /\n      InvocationDecision (status, skill, reason, score,\n                          eligible, blocked, ranking, policy source)\n\nRouting and execution stay separate: selected -> activated -> argument binding -> execution -> completion check."
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "The Router Asks the Adapter, Not the Metadata",
    "headingKn": "Router adapter ಅನ್ನು ಕೇಳುತ್ತದೆ, metadata ಅಲ್ಲ",
    "bodyEn": "The router should not contain if metadata[\"some-host-field\"]. It asks adapter.actor_allowed(skill, actor) and adapter.exact_name_allowed(skill, actor). Each host can then encode policy its own way while the router depends on a stable conceptual interface. Unknown runtime fields are never silently promoted to universal semantics.",
    "bodyKn": "router ನಲ್ಲಿ if metadata[\"host-field\"] ಇರಬಾರದು. ಅದು adapter ಅನ್ನು ಕೇಳುತ್ತದೆ."
   }
  },
  {
   "type": "code",
   "data": {
    "filename": "invocation_lab.py",
    "headingEn": "CorePolicyAdapter and ExtensionPolicyAdapter",
    "headingKn": "CorePolicyAdapter ಮತ್ತು ExtensionPolicyAdapter",
    "descEn": "The core adapter uses only application-supplied policy. The extension adapter starts from core policy and then honours three explicitly recognised host fields: user-invocable (blocks humans), disable-model-invocation and allow_implicit_invocation (block model and autonomous agent). It returns the policy source, so a denial is traceable. Which fields count is a per-host decision; these three are our examples.",
    "descKn": "core adapter application-ಒದಗಿಸಿದ policy ಮಾತ್ರ ಬಳಸುತ್ತದೆ. extension adapter ಮೂರು ಸ್ಪಷ್ಟವಾಗಿ ಗುರುತಿಸಿದ host ಕ್ಷೇತ್ರಗಳನ್ನು ಗೌರವಿಸುತ್ತದೆ ಮತ್ತು policy ಮೂಲವನ್ನು ಹಿಂತಿರುಗಿಸುತ್ತದೆ.",
    "code": "class CorePolicyAdapter:\n    def actor_allowed(self, skill, actor):\n        return skill.policy.allows_actor(actor), \"core-policy\"\n    def exact_name_allowed(self, skill, actor):\n        return skill.policy.allows_exact_name(actor, skill.name), \"core-exact-name-policy\"\n\nclass ExtensionPolicyAdapter(CorePolicyAdapter):\n    RECOGNIZED = frozenset({\"user-invocable\", \"disable-model-invocation\", \"allow_implicit_invocation\"})\n    def actor_allowed(self, skill, actor):\n        ok, src = super().actor_allowed(skill, actor)\n        if not ok: return False, src\n        ext, modelish = skill.host_extensions, actor in {Actor.MODEL, Actor.AUTONOMOUS_AGENT}\n        if actor == Actor.HUMAN and ext.get(\"user-invocable\") is False: return False, \"extension:user-invocable\"\n        if modelish and ext.get(\"disable-model-invocation\") is True: return False, \"extension:disable-model-invocation\"\n        if modelish and ext.get(\"allow_implicit_invocation\") is False: return False, \"extension:allow_implicit_invocation\"\n        return True, \"extension:no-blocking-field\""
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
    "filename": "invocation_lab.py",
    "headingEn": "The same skill under both adapters",
    "headingKn": "ಎರಡೂ adapters ನಲ್ಲಿ ಅದೇ skill",
    "descEn": "incident-triage allows models in its core policy but carries a host extension disabling model invocation. The core adapter allows it (it does not interpret the extension); the extension adapter denies the model and names the extension as the source, while still allowing a human. That is exactly the difference between portable policy and host semantics.",
    "descKn": "core adapter extension ಅರ್ಥೈಸುವುದಿಲ್ಲ, ಆದ್ದರಿಂದ ಅನುಮತಿಸುತ್ತದೆ; extension adapter ಮಾದರಿಯನ್ನು ನಿರಾಕರಿಸುತ್ತದೆ ಆದರೆ ಮಾನವನಿಗೆ ಅನುಮತಿಸುತ್ತದೆ.",
    "code": "print(\"  core:     \", core.actor_allowed(incident[0], Actor.MODEL))\nprint(\"  extension:\", ext.actor_allowed(incident[0], Actor.MODEL))\nprint(\"  extension, human on same skill:\", ext.actor_allowed(incident[0], Actor.HUMAN))"
   }
  },
  {
   "type": "output",
   "data": {
    "output": "core:      (True, 'core-policy')\n  extension: (False, 'extension:disable-model-invocation')\n  extension, human on same skill: (True, 'extension:no-blocking-field')"
   }
  },
  {
   "type": "heading",
   "data": {
    "textEn": "Same Skill, Different Actor",
    "textKn": "ಅದೇ Skill, ಬೇರೆ Actor",
    "level": "H2"
   }
  },
  {
   "type": "code",
   "data": {
    "filename": "invocation_lab.py",
    "headingEn": "security-change-review for an application and for a model",
    "headingKn": "application ಮತ್ತು model ಗಾಗಿ security-change-review",
    "descEn": "This skill denies models but allows applications and other skills. Explicit application invocation is selected; explicit model invocation is denied with the policy source named. A single invocable flag could not express this.",
    "descKn": "ಈ skill ಮಾದರಿಗೆ ನಿರಾಕರಿಸುತ್ತದೆ ಆದರೆ application ಗೆ ಅನುಮತಿಸುತ್ತದೆ. ಒಂದು invocable flag ಇದನ್ನು ವ್ಯಕ್ತಪಡಿಸಲಾರದು.",
    "code": "show(\"application explicit\", route_request(skills, InvocationRequest(Actor.APPLICATION, \"Run the dependency security review.\", \"security-change-review\"), ext))\nshow(\"model explicit\", route_request(skills, InvocationRequest(Actor.MODEL, \"Run the dependency security review.\", \"security-change-review\"), ext))"
   }
  },
  {
   "type": "output",
   "data": {
    "output": "--- application explicit ---\nstatus: selected | skill: security-change-review | score: None | source: extension:no-blocking-field\nreason: explicit identity resolved and policy permits invocation\neligible: security-change-review\n--- model explicit ---\nstatus: denied | skill: None | score: None | source: core-policy\nreason: model is not eligible to invoke security-change-review\nblocked: security-change-review"
   }
  },
  {
   "type": "heading",
   "data": {
    "textEn": "Layered Authorization: Exact-Name Allowlists",
    "textKn": "ಪದರ ಅಧಿಕಾರ: Exact-Name Allowlists",
    "level": "H2"
   }
  },
  {
   "type": "code",
   "data": {
    "filename": "invocation_lab.py",
    "headingEn": "An application allowed in general, but only for named skills",
    "headingKn": "ಸಾಮಾನ್ಯವಾಗಿ ಅನುಮತಿ, ಆದರೆ ಹೆಸರಿಸಿದ skills ಗೆ ಮಾತ್ರ",
    "descEn": "The policy allows the application actor, but its allowlist lists only other-skill. Actor policy passes and the exact-name check still denies, with core-exact-name-policy recorded as the source. Two questions, two layers: may this actor use this skill, and is this exact name permitted for the actor.",
    "descKn": "actor policy ಅನುಮತಿಸುತ್ತದೆ ಆದರೆ allowlist ನಿರಾಕರಿಸುತ್ತದೆ. ಎರಡು ಪ್ರಶ್ನೆಗಳು, ಎರಡು ಪದರಗಳು.",
    "code": "restricted = [SkillMetadata(\"release-readiness\", \"desc\", policy=InvocationPolicy(exact_name_allowlist={Actor.APPLICATION: frozenset({\"other-skill\"})}))]\nshow(\"application outside allowlist\", route_request(restricted, InvocationRequest(Actor.APPLICATION, \"x\", \"release-readiness\"), core))"
   }
  },
  {
   "type": "output",
   "data": {
    "output": "--- application outside allowlist ---\nstatus: denied | skill: None | score: None | source: core-exact-name-policy\nreason: release-readiness is outside the exact-name allowlist for application\nblocked: release-readiness"
   }
  },
  {
   "type": "heading",
   "data": {
    "textEn": "The Invocation Contract",
    "textKn": "Invocation Contract",
    "level": "H2"
   }
  },
  {
   "type": "code",
   "data": {
    "filename": "invocation-contract.yaml",
    "headingEn": "A design document, not standard frontmatter",
    "headingKn": "ವಿನ್ಯಾಸ ದಾಖಲೆ, ಮಾನದಂಡ frontmatter ಅಲ್ಲ",
    "descEn": "This contract answers who, which identity, what input, what if ambiguous, what if a dependency is missing, where state survives and how deep composition may go. publish: fixed_false is stronger than a default. It is design documentation for adapters and tests; it must not be treated as standardised SKILL.md frontmatter unless a specification adopts it, and each host may encode the same conceptual policy differently.",
    "descKn": "ಈ contract ಯಾರು, ಯಾವ ಗುರುತು, ಯಾವ input, ಅಸ್ಪಷ್ಟ/ಕಾಣೆಯಾದರೆ ಏನು, state ಎಲ್ಲಿ ಎಂದು ಉತ್ತರಿಸುತ್ತದೆ. ಇದು ಮಾನದಂಡ frontmatter ಅಲ್ಲ.",
    "code": "actors:\n  human: allow\n  model: deny\n  application: allow\n  skill: deny\n\nexplicit_name: release-readiness\n\narguments:\n  candidate: required\n  publish: fixed_false\n\nambiguity: ask_user\nmissing_dependency: stop\n\ncontext:\n  durable_state: artifacts/release-readiness.json\n  max_composition_depth: 2"
   }
  },
  {
   "type": "output",
   "data": {
    "output": "(design document: no program output)"
   }
  },
  {
   "type": "table",
   "data": {
    "headingEn": "Four kinds of test, kept separate",
    "headers": [
     "Test",
     "Question"
    ],
    "rows": [
     [
      "Behaviour",
      "Does the skill do its job once selected?"
     ],
     [
      "Routing",
      "Does the router select, abstain and handle near misses correctly?"
     ],
     [
      "Policy",
      "Does each actor get the right decision from the matrix and adapters?"
     ],
     [
      "Composition",
      "Are depth limits and cycles enforced?"
     ]
    ]
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "Key Takeaways",
    "headingKn": "ಮುಖ್ಯ ಅಂಶಗಳು",
    "bodyEn": "• route_request is a small dispatcher: an explicit name goes to route_explicit, otherwise to route_implicit; the complexity lives in named components.\n• Under the extension adapter a host-disabled skill denied the model with source extension:disable-model-invocation while still allowing a human; the core adapter allowed the model because it does not interpret that field.\n• The same security-change-review skill was selected for an application and denied for a model.\n• An allowlist added a second denial after actor policy passed.\n• The invocation contract is design documentation, not standard frontmatter.\n• Keep behaviour, routing, policy and composition tests separate. The lexical scorer here is a teaching stand-in, not evidence about a production model router.",
    "bodyKn": "• route_request ಚಿಕ್ಕ dispatcher.\n• extension adapter ಮಾದರಿ ನಿರಾಕರಿಸಿತು, ಮಾನವನಿಗೆ ಅನುಮತಿಸಿತು.\n• ಅದೇ skill application ಗೆ ಆಯ್ಕೆ, ಮಾದರಿಗೆ ನಿರಾಕರಣೆ.\n• allowlist ಎರಡನೇ ನಿರಾಕರಣೆ.\n• contract ವಿನ್ಯಾಸ ದಾಖಲೆ.\n• ನಾಲ್ಕು ಪರೀಕ್ಷೆಗಳು ಪ್ರತ್ಯೇಕ."
   }
  },
  {
   "type": "quiz",
   "data": {
    "questions": [
     {
      "q": "Why does the router call an adapter instead of reading host metadata fields directly?",
      "qKn": "router host metadata ಕ್ಷೇತ್ರಗಳನ್ನು ನೇರ ಓದದೆ adapter ಅನ್ನು ಏಕೆ ಕರೆಯುತ್ತದೆ?",
      "opts": [
       "Adapters are faster",
       "It keeps the router on a stable interface so runtime conventions are not silently promoted to universal semantics",
       "Metadata cannot be read",
       "It removes the need for policy"
      ],
      "optsKn": [
       "adapters ವೇಗ",
       "router ಸ್ಥಿರ ಇಂಟರ್ಫೇಸ್‌ನಲ್ಲಿರುತ್ತದೆ; runtime ಸಂಪ್ರದಾಯ ಸಾರ್ವತ್ರಿಕವಾಗುವುದಿಲ್ಲ",
       "metadata ಓದಲಾಗದು",
       "policy ಬೇಡ"
      ],
      "correct": 1
     },
     {
      "q": "In the run, the core adapter allowed the model on incident-triage but the extension adapter denied it. Why?",
      "qKn": "run ನಲ್ಲಿ core adapter ಮಾದರಿಗೆ ಅನುಮತಿಸಿತು, extension adapter ನಿರಾಕರಿಸಿತು. ಏಕೆ?",
      "opts": [
       "The score differed",
       "Only the extension adapter recognises disable-model-invocation",
       "The human was blocked",
       "A bug"
      ],
      "optsKn": [
       "score ಬೇರೆ",
       "extension adapter ಮಾತ್ರ disable-model-invocation ಗುರುತಿಸುತ್ತದೆ",
       "ಮಾನವ ನಿರ್ಬಂಧಿತ",
       "ದೋಷ"
      ],
      "correct": 1
     },
     {
      "q": "An application is allowed by actor policy but the skill is missing from its allowlist. What is the result?",
      "qKn": "actor policy application ಗೆ ಅನುಮತಿಸಿದೆ ಆದರೆ allowlist ನಲ್ಲಿ skill ಇಲ್ಲ. ಫಲಿತಾಂಶ?",
      "opts": [
       "selected",
       "denied by the exact-name policy",
       "abstained",
       "not_found"
      ],
      "optsKn": [
       "selected",
       "exact-name policy ಯಿಂದ denied",
       "abstained",
       "not_found"
      ],
      "correct": 1
     },
     {
      "q": "Should the invocation contract be treated as standard SKILL.md frontmatter?",
      "qKn": "invocation contract ಅನ್ನು ಮಾನದಂಡ SKILL.md frontmatter ಎಂದು ಪರಿಗಣಿಸಬೇಕೇ?",
      "opts": [
       "Yes always",
       "No: it is design documentation for adapters and tests unless a specification adopts it",
       "Only in Python",
       "Only for models"
      ],
      "optsKn": [
       "ಯಾವಾಗಲೂ",
       "ಇಲ್ಲ: specification ಅಳವಡಿಸುವವರೆಗೆ adapters ಮತ್ತು ಪರೀಕ್ಷೆಗಳ ವಿನ್ಯಾಸ ದಾಖಲೆ",
       "Python ನಲ್ಲಿ ಮಾತ್ರ",
       "ಮಾದರಿಗೆ ಮಾತ್ರ"
      ],
      "correct": 1
     },
     {
      "q": "Why keep behaviour, routing, policy and composition tests separate?",
      "qKn": "behaviour, routing, policy, composition ಪರೀಕ್ಷೆಗಳು ಪ್ರತ್ಯೇಕ ಏಕೆ?",
      "opts": [
       "To lengthen the suite",
       "So one passing layer cannot hide another broken layer",
       "Frameworks require it",
       "It removes near misses"
      ],
      "optsKn": [
       "ಸೂಟ್ ಉದ್ದಗೊಳಿಸಲು",
       "ಒಂದು ಪಾಸ್ ಪದರ ಇನ್ನೊಂದು ಮುರಿದ ಪದರ ಮರೆಮಾಡಬಾರದು",
       "frameworks ಗೆ ಅಗತ್ಯ",
       "near misses ತೆಗೆಯುತ್ತದೆ"
      ],
      "correct": 1
     }
    ]
   }
  }
 ]
};
