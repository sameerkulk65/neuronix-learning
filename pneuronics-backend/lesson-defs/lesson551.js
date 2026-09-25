module.exports = {
 "phaseId": "6a369d5e66020ed05b3214c3",
 "moduleId": "6ab6d18eb7119db96ad77966",
 "order": 0,
 "type": "interactive",
 "duration": 45,
 "difficulty": "intermediate",
 "status": "published",
 "title": "Skill Invocation and Routing (Part 1 of 3) — Actors, Lifecycle, Policy and the Human/Model Matrix",
 "titleKn": "Skill Invocation ಮತ್ತು Routing (Part 1 of 3) — Actors, Lifecycle, Policy ಮತ್ತು Human/Model Matrix",
 "desc": "A skill exists, but who may invoke it, how is it selected, and when should the router deliberately select nothing? Learn the five invocation channels, the discovered-to-completed lifecycle, why one invocable flag fails, the human/model 2x2 matrix and the difference between explicit and implicit invocation.",
 "descKn": "skill ಇದೆ, ಆದರೆ ಯಾರು ಅದನ್ನು ಕರೆಯಬಹುದು, ಹೇಗೆ ಆಯ್ಕೆಯಾಗುತ್ತದೆ, ಮತ್ತು router ಯಾವಾಗ ಉದ್ದೇಶಪೂರ್ವಕವಾಗಿ ಏನನ್ನೂ ಆರಿಸಬಾರದು?",
 "objectives": [
  "Name the invocation actors (human, model, application, skill, harness) and explain why they carry different authority.",
  "Order the lifecycle stages discovered, eligible, selected, activated, executing, completed and explain why skill_used = True hides failures.",
  "Model InvocationPolicy as independent actor dimensions and build the human/model 2x2 matrix.",
  "Contrast explicit (identity-first) and implicit (description-first) invocation and show that explicit invocation still passes policy.",
  "Separate the four decision outcomes: selected, denied, abstained and not_found."
 ],
 "objectivesKn": [
  "invocation actors ಹೆಸರಿಸಿ, ಅವುಗಳ ಅಧಿಕಾರ ಬೇರೆ ಏಕೆ ಎಂದು ವಿವರಿಸಿ.",
  "lifecycle ಹಂತಗಳ ಕ್ರಮ ತಿಳಿಸಿ.",
  "InvocationPolicy ಅನ್ನು ಸ್ವತಂತ್ರ ಆಯಾಮಗಳಾಗಿ ಮಾದರಿ ಮಾಡಿ, 2x2 ಮ್ಯಾಟ್ರಿಕ್ಸ್ ನಿರ್ಮಿಸಿ.",
  "explicit ಮತ್ತು implicit ವ್ಯತ್ಯಾಸ ತೋರಿಸಿ.",
  "selected, denied, abstained, not_found ಬೇರ್ಪಡಿಸಿ."
 ],
 "blocks": [
  {
   "type": "heading",
   "data": {
    "textEn": "Skill Invocation and Routing (Part 1 of 3)",
    "textKn": "Skill Invocation and Routing (Part 1 of 3)",
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
    "textEn": "The Central Principle",
    "textKn": "ಕೇಂದ್ರ ತತ್ವ",
    "level": "H2"
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "Invocation Is an Authority Decision Followed by a Relevance Decision",
    "headingKn": "Invocation = ಅಧಿಕಾರ ನಿರ್ಧಾರ, ನಂತರ ಪ್ರಸ್ತುತತೆ ನಿರ್ಧಾರ",
    "bodyEn": "A skill being installed does not mean a user can invoke it, a model can select it, an application can activate it, or its tools may execute. These are separate decisions. Two failure stories show why. A vague description (\"Helps with databases\") makes the model select database-migration for \"What is database normalization?\" and propose a schema change for a question that only needed an explanation. And a skill can be excellent but still be one whose false positive is too costly to let a model pick automatically.",
    "bodyKn": "skill ಇನ್‌ಸ್ಟಾಲ್ ಆಗಿದೆ ಎಂದರೆ ಬಳಕೆದಾರ ಕರೆಯಬಹುದು, ಮಾದರಿ ಆರಿಸಬಹುದು ಎಂದಲ್ಲ. ಇವು ಬೇರೆ ಬೇರೆ ನಿರ್ಧಾರಗಳು."
   }
  },
  {
   "type": "heading",
   "data": {
    "textEn": "Five Invocation Channels",
    "textKn": "ಐದು Invocation ಮಾರ್ಗಗಳು",
    "level": "H2"
   }
  },
  {
   "type": "table",
   "data": {
    "headingEn": "Who starts the lifecycle",
    "headers": [
     "Actor",
     "Typical invocation",
     "Note"
    ],
    "rows": [
     [
      "Human",
      "Names or selects the skill",
      "Explicit; still subject to policy"
     ],
     [
      "Model / agent",
      "Chooses a skill from catalog metadata",
      "Implicit; needs eligibility and relevance"
     ],
     [
      "Application",
      "Runtime code activates a known skill",
      "A UI button already knows the workflow; couples to a host API"
     ],
     [
      "Another skill",
      "Requests a dependency",
      "A bounded edge with a depth limit"
     ],
     [
      "Evaluation harness",
      "Activates the exact skill for a test",
      "Can bypass the very policy you meant to study"
     ]
    ]
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "The Harness Can Hide a Routing Bug",
    "headingKn": "Harness routing ದೋಷ ಮರೆಮಾಡಬಹುದು",
    "bodyEn": "If production policy denies the model this skill but your evaluation calls activate(\"release-readiness\") directly, the skill can pass every test while the real routing policy is never exercised. Skill correctness and routing correctness must be tested separately.",
    "bodyKn": "production policy ಮಾದರಿಗೆ ನಿರಾಕರಿಸಿದರೂ evaluation ನೇರ activate ಮಾಡಿದರೆ skill ಪಾಸ್ ಆಗಬಹುದು, ಆದರೆ routing ಪರೀಕ್ಷೆಯೇ ಆಗಿಲ್ಲ."
   }
  },
  {
   "type": "heading",
   "data": {
    "textEn": "Why One invocable Flag Fails",
    "textKn": "ಒಂದು invocable Flag ಏಕೆ ವಿಫಲ",
    "level": "H2"
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "Five Different Questions",
    "headingKn": "ಐದು ಬೇರೆ ಪ್ರಶ್ನೆಗಳು",
    "bodyEn": "invocable = False could mean hide it from the user's menu, or stop the model choosing it automatically, or block applications, or block other skills, or block tools. \"The user can see it\", \"the model can select it\", \"the application can preload it\" and \"tools inside it can execute\" are separate facts. So policy becomes independent dimensions, one per actor.",
    "bodyKn": "invocable = False ಎಂದರೆ ಮೆನು ಮರೆಮಾಡುವುದೇ, ಮಾದರಿ ಆರಿಸುವುದನ್ನು ತಡೆಯುವುದೇ? ಪ್ರತಿ actor ಗೆ ಒಂದು ಸ್ವತಂತ್ರ ಆಯಾಮ ಬೇಕು."
   }
  },
  {
   "type": "code",
   "data": {
    "filename": "invocation_lab.py",
    "headingEn": "Actor, InvocationPolicy, SkillMetadata, InvocationRequest, InvocationDecision",
    "headingKn": "Actor, InvocationPolicy, SkillMetadata, InvocationRequest, InvocationDecision",
    "descEn": "Our data model. Actor is an enum, so a typo cannot silently become a valid actor. InvocationPolicy has one Boolean per actor plus an exact-name allowlist. SkillMetadata keeps identity (name), routing (description and terms) and authority (policy) apart, with host extensions in their own field. The decision object records status, skill, reason, score, eligible and blocked skills and where the policy came from.",
    "descKn": "Actor enum, ಆದ್ದರಿಂದ ಟೈಪೋ ಮಾನ್ಯ actor ಆಗುವುದಿಲ್ಲ. policy ಪ್ರತಿ actor ಗೆ ಒಂದು Boolean. SkillMetadata ಗುರುತು, routing ಮತ್ತು ಅಧಿಕಾರ ಬೇರ್ಪಡಿಸುತ್ತದೆ.",
    "code": "import json, re\nfrom dataclasses import dataclass, field\nfrom enum import Enum\nfrom typing import Any, Mapping, Optional, Sequence\n\nclass Actor(str, Enum):\n    HUMAN = \"human\"; MODEL = \"model\"; AUTONOMOUS_AGENT = \"autonomous_agent\"\n    APPLICATION = \"application\"; SKILL = \"skill\"; HARNESS = \"harness\"\n\n@dataclass(frozen=True)\nclass InvocationPolicy:\n    human: bool = True\n    model: bool = True\n    autonomous_agent: bool = True\n    application: bool = True\n    skill: bool = False\n    harness: bool = True\n    exact_name_allowlist: Mapping[Actor, frozenset] = field(default_factory=dict)\n\n    def allows_actor(self, actor):\n        return {Actor.HUMAN: self.human, Actor.MODEL: self.model, Actor.AUTONOMOUS_AGENT: self.autonomous_agent,\n                Actor.APPLICATION: self.application, Actor.SKILL: self.skill, Actor.HARNESS: self.harness}[actor]\n\n    def allows_exact_name(self, actor, name):\n        allowed = self.exact_name_allowlist.get(actor)\n        return True if allowed is None else name in allowed\n\n@dataclass(frozen=True)\nclass SkillMetadata:\n    name: str\n    description: str\n    positive_terms: tuple = ()\n    negative_terms: tuple = ()\n    policy: InvocationPolicy = field(default_factory=InvocationPolicy)\n    host_extensions: Mapping[str, Any] = field(default_factory=dict)\n\n@dataclass(frozen=True)\nclass InvocationRequest:\n    actor: Actor\n    text: str\n    explicit_skill: Optional[str] = None\n    threshold: float = 0.40\n    ambiguity_margin: float = 0.10\n\n@dataclass(frozen=True)\nclass InvocationDecision:\n    status: str\n    selected_skill: Optional[str]\n    reason: str\n    score: Optional[float] = None\n    eligible_skills: tuple = ()\n    blocked_skills: tuple = ()\n    ranked_candidates: tuple = ()\n    policy_source: Optional[str] = None"
   }
  },
  {
   "type": "output",
   "data": {
    "output": "(definitions only: no output yet)"
   }
  },
  {
   "type": "heading",
   "data": {
    "textEn": "The Human/Model 2x2",
    "textKn": "Human/Model 2x2",
    "level": "H2"
   }
  },
  {
   "type": "code",
   "data": {
    "filename": "invocation_lab.py",
    "headingEn": "build_invocation_matrix",
    "headingKn": "build_invocation_matrix",
    "descEn": "Human visibility and model eligibility are independent, giving four modes. Human-only (human allow, model deny) is the right home for a high-impact skill whose false positives cost more than the convenience of automatic selection.",
    "descKn": "human ಮತ್ತು model ಸ್ವತಂತ್ರ, ನಾಲ್ಕು ಮೋಡ್‌ಗಳು. ಹೆಚ್ಚು ಪರಿಣಾಮದ skill ಗೆ human-only ಸೂಕ್ತ.",
    "code": "def build_invocation_matrix(policy):\n    mode = (\"shared\" if policy.human and policy.model else \"human-only\" if policy.human else\n            \"model-only\" if policy.model else \"disabled-or-application-only\")\n    return {\"human\": \"allow\" if policy.human else \"deny\", \"model\": \"allow\" if policy.model else \"deny\", \"mode\": mode}\n\nfor label, p in [(\"shared\", InvocationPolicy()), (\"human-only\", InvocationPolicy(model=False)),\n                 (\"model-only\", InvocationPolicy(human=False)), (\"neither\", InvocationPolicy(human=False, model=False))]:\n    print(f\"  {label:<10} -> {build_invocation_matrix(p)}\")"
   }
  },
  {
   "type": "output",
   "data": {
    "output": "shared     -> {'human': 'allow', 'model': 'allow', 'mode': 'shared'}\n  human-only -> {'human': 'allow', 'model': 'deny', 'mode': 'human-only'}\n  model-only -> {'human': 'deny', 'model': 'allow', 'mode': 'model-only'}\n  neither    -> {'human': 'deny', 'model': 'deny', 'mode': 'disabled-or-application-only'}"
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "Routing Quality Does Not Replace Authority Design",
    "headingKn": "Routing ಗುಣಮಟ್ಟ ಅಧಿಕಾರ ವಿನ್ಯಾಸವನ್ನು ಬದಲಿಸುವುದಿಲ್ಲ",
    "bodyEn": "Policy limits who may request a skill; the description limits when it is relevant. A good description does not make automatic selection safe for production-database-cleanup. A strong system needs both layers.",
    "bodyKn": "policy ಯಾರು ಕೇಳಬಹುದು ಎಂದು ಮಿತಗೊಳಿಸುತ್ತದೆ; description ಯಾವಾಗ ಪ್ರಸ್ತುತ ಎಂದು. ಎರಡೂ ಪದರಗಳು ಬೇಕು."
   }
  },
  {
   "type": "heading",
   "data": {
    "textEn": "The Lifecycle",
    "textKn": "Lifecycle",
    "level": "H2"
   }
  },
  {
   "type": "diagram",
   "data": {
    "titleEn": "Discovered is not used",
    "titleKn": "Discovered ≠ used",
    "contentEn": "Discovered   the package exists in a configured scope\n     |\nEligible     policy permits THIS actor to request it\n     |\nSelected     it was actually chosen (explicit name or router)\n     |\nActivated    its instructions entered the working context\n     |\nExecuting    the work is being performed\n     |\nCompleted    the intended process finished and was verified\n\nA single flag such as skill_used = True cannot say WHICH stage failed."
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "Airport Gate Analogy",
    "headingKn": "ವಿಮಾನ ನಿಲ್ದಾಣದ ಗೇಟ್ ಹೋಲಿಕೆ",
    "bodyEn": "Knowing Gate 12 exists (discovered) does not mean you may use it (eligible). Being allowed to use it does not make it your gate (selected). It being your gate does not mean you have boarded (activated), and boarding starting does not mean the flight completed.",
    "bodyKn": "Gate 12 ಇದೆ ಎಂದು ತಿಳಿದರೆ ನೀವು ಬಳಸಬಹುದು ಎಂದಲ್ಲ."
   }
  },
  {
   "type": "heading",
   "data": {
    "textEn": "Explicit and Implicit Invocation",
    "textKn": "Explicit ಮತ್ತು Implicit Invocation",
    "level": "H2"
   }
  },
  {
   "type": "table",
   "data": {
    "headingEn": "Identity-first versus description-first",
    "headers": [
     "",
     "Explicit",
     "Implicit"
    ],
    "rows": [
     [
      "Who supplies identity",
      "The actor names the skill",
      "The router infers it"
     ],
     [
      "Main question",
      "Is that exact skill available and permitted?",
      "Which eligible skill, if any, best matches?"
     ],
     [
      "Uses descriptions",
      "No",
      "Yes, heavily"
     ],
     [
      "Still passes policy",
      "Yes",
      "Yes, before ranking"
     ]
    ]
   }
  },
  {
   "type": "code",
   "data": {
    "filename": "invocation_lab.py",
    "headingEn": "route_explicit",
    "headingKn": "route_explicit",
    "descEn": "Explicit invocation never compares descriptions. It finds the name, checks the actor against policy, then checks the exact-name allowlist. Naming a skill supplies identity, not authority.",
    "descKn": "explicit invocation descriptions ಹೋಲಿಸುವುದಿಲ್ಲ. ಹೆಸರು ಗುರುತು ನೀಡುತ್ತದೆ, ಅಧಿಕಾರವಲ್ಲ.",
    "code": "def route_explicit(skills, request, adapter):\n    skill = next((s for s in skills if s.name == request.explicit_skill), None)\n    if skill is None:\n        return InvocationDecision(\"not_found\", None, f\"explicit skill {request.explicit_skill!r} was not discovered\")\n    ok, src = adapter.actor_allowed(skill, request.actor)\n    if not ok:\n        return InvocationDecision(\"denied\", None, f\"{request.actor.value} is not eligible to invoke {skill.name}\", blocked_skills=(skill.name,), policy_source=src)\n    ok2, src2 = adapter.exact_name_allowed(skill, request.actor)\n    if not ok2:\n        return InvocationDecision(\"denied\", None, f\"{skill.name} is outside the exact-name allowlist for {request.actor.value}\", blocked_skills=(skill.name,), policy_source=src2)\n    return InvocationDecision(\"selected\", skill.name, \"explicit identity resolved and policy permits invocation\", eligible_skills=(skill.name,), policy_source=src)"
   }
  },
  {
   "type": "output",
   "data": {
    "output": "(definitions only: no output yet)"
   }
  },
  {
   "type": "heading",
   "data": {
    "textEn": "Four Outcomes",
    "textKn": "ನಾಲ್ಕು ಫಲಿತಾಂಶಗಳು",
    "level": "H2"
   }
  },
  {
   "type": "code",
   "data": {
    "filename": "invocation_lab.py",
    "headingEn": "Selected, not_found, and the policy that governed them",
    "headingKn": "Selected, not_found, ಮತ್ತು ಅವನ್ನು ನಿಯಂತ್ರಿಸಿದ policy",
    "descEn": "The same catalog and adapter give an explicit human selection with its policy source, and a request for a skill that does not exist. Not found is not denied and not abstained: the router must not quietly substitute a similar-sounding skill for a name the user typed.",
    "descKn": "ಅದೇ catalog ಮಾನವ explicit ಆಯ್ಕೆ ಮತ್ತು ಅಸ್ತಿತ್ವದಲ್ಲಿಲ್ಲದ skill ಗೆ ಕೋರಿಕೆ ನೀಡುತ್ತದೆ. not found ≠ denied ≠ abstained.",
    "code": "skills, core, ext = catalog(), CorePolicyAdapter(), ExtensionPolicyAdapter()\nshow(\"explicit human\", route_request(skills, InvocationRequest(Actor.HUMAN, \"Use release-readiness for version 2.4.0.\", \"release-readiness\"), core))\nshow(\"explicit, unknown skill\", route_request(skills, InvocationRequest(Actor.HUMAN, \"Use quantum-release-validator.\", \"quantum-release-validator\"), core))"
   }
  },
  {
   "type": "output",
   "data": {
    "output": "--- explicit human ---\nstatus: selected | skill: release-readiness | score: None | source: core-policy\nreason: explicit identity resolved and policy permits invocation\neligible: release-readiness\n--- explicit, unknown skill ---\nstatus: not_found | skill: None | score: None | source: None\nreason: explicit skill 'quantum-release-validator' was not discovered"
   }
  },
  {
   "type": "table",
   "data": {
    "headingEn": "The four outcomes",
    "headers": [
     "Status",
     "Meaning",
     "Example"
    ],
    "rows": [
     [
      "selected",
      "A skill was chosen and is eligible",
      "Explicit human invocation, or a clear implicit match"
     ],
     [
      "denied",
      "The skill exists but policy forbids this actor",
      "A model naming a human-only skill"
     ],
     [
      "abstained",
      "No eligible skill is relevant enough",
      "Explain rotary position embeddings"
     ],
     [
      "not_found",
      "An explicit name matches nothing discovered",
      "Use quantum-release-validator"
     ]
    ]
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "Key Takeaways",
    "headingKn": "ಮುಖ್ಯ ಅಂಶಗಳು",
    "bodyEn": "• Invocation is authority first, relevance second; discovered, eligible, selected, activated, executing and completed are separate stages.\n• Actors carry different authority; one invocable flag cannot express that, so policy has one dimension per actor.\n• The human/model matrix has four modes; we printed shared, human-only, model-only and disabled-or-application-only from real policy objects.\n• Explicit invocation is identity-first and still passes policy; implicit is description-first.\n• selected, denied, abstained and not_found are four distinct outcomes; abstaining is a valid result.",
    "bodyKn": "• ಅಧಿಕಾರ ಮೊದಲು, ಪ್ರಸ್ತುತತೆ ನಂತರ.\n• ಪ್ರತಿ actor ಗೆ ಒಂದು ಆಯಾಮ.\n• ನಾಲ್ಕು ಮೋಡ್‌ಗಳ ಮ್ಯಾಟ್ರಿಕ್ಸ್.\n• explicit ಗುರುತು-ಮೊದಲು, implicit description-ಮೊದಲು.\n• ನಾಲ್ಕು ಫಲಿತಾಂಶಗಳು."
   }
  },
  {
   "type": "quiz",
   "data": {
    "questions": [
     {
      "q": "A model strongly matches a skill, but policy disables model invocation. What should happen?",
      "qKn": "ಮಾದರಿ ಒಂದು skill ಗೆ ಬಲವಾಗಿ ಹೊಂದುತ್ತದೆ, ಆದರೆ policy ಮಾದರಿ invocation ನಿಷ್ಕ್ರಿಯಗೊಳಿಸಿದೆ. ಏನಾಗಬೇಕು?",
      "opts": [
       "Select it because relevance overrides policy",
       "Select it and ask permission afterward",
       "Remove it from the model's eligible candidate set before ranking",
       "Delete the skill"
      ],
      "optsKn": [
       "ಪ್ರಸ್ತುತತೆ ಮೀರಿಸುತ್ತದೆ, ಆರಿಸಿ",
       "ಆರಿಸಿ ನಂತರ ಅನುಮತಿ ಕೇಳಿ",
       "ranking ಮೊದಲು ಮಾದರಿಯ ಅರ್ಹ ಅಭ್ಯರ್ಥಿಗಳಿಂದ ತೆಗೆಯಿರಿ",
       "skill ಅಳಿಸಿ"
      ],
      "correct": 2
     },
     {
      "q": "Which best describes explicit invocation?",
      "qKn": "explicit invocation ಅನ್ನು ಯಾವುದು ಉತ್ತಮವಾಗಿ ವಿವರಿಸುತ್ತದೆ?",
      "opts": [
       "The router picks the highest score",
       "An actor supplies the skill identity directly, but policy still applies",
       "It bypasses eligibility",
       "The whole body is compared to every request"
      ],
      "optsKn": [
       "router ಅತ್ಯಧಿಕ score ಆರಿಸುತ್ತದೆ",
       "actor ಗುರುತು ನೀಡುತ್ತದೆ, policy ಇನ್ನೂ ಅನ್ವಯ",
       "eligibility ದಾಟುತ್ತದೆ",
       "ಪೂರ್ಣ body ಹೋಲಿಸಲಾಗುತ್ತದೆ"
      ],
      "correct": 1
     },
     {
      "q": "Human can invoke = true, model can invoke = false. What is this?",
      "qKn": "human = true, model = false. ಇದು ಏನು?",
      "opts": [
       "Model-only",
       "Application-only",
       "Human-only",
       "Unrestricted"
      ],
      "optsKn": [
       "Model-only",
       "Application-only",
       "Human-only",
       "ನಿರ್ಬಂಧವಿಲ್ಲ"
      ],
      "correct": 2
     },
     {
      "q": "An explicit request names a skill that was never discovered. Which status fits?",
      "qKn": "ಪತ್ತೆಯಾಗದ skill ಅನ್ನು explicit ಕೋರಿಕೆ ಹೆಸರಿಸಿದೆ. ಯಾವ status?",
      "opts": [
       "selected",
       "denied",
       "abstained",
       "not_found"
      ],
      "optsKn": [
       "selected",
       "denied",
       "abstained",
       "not_found"
      ],
      "correct": 3
     },
     {
      "q": "Why can an evaluation harness give false comfort?",
      "qKn": "evaluation harness ಸುಳ್ಳು ಸಮಾಧಾನ ಏಕೆ ನೀಡಬಹುದು?",
      "opts": [
       "It is too slow",
       "It may activate the skill directly and bypass the production routing policy being studied",
       "It cannot run Python",
       "It changes the description"
      ],
      "optsKn": [
       "ಅದು ನಿಧಾನ",
       "ನೇರ activate ಮಾಡಿ production routing policy ದಾಟಬಹುದು",
       "Python ಚಲಾಯಿಸಲಾರದು",
       "description ಬದಲಿಸುತ್ತದೆ"
      ],
      "correct": 1
     }
    ]
   }
  }
 ]
};
