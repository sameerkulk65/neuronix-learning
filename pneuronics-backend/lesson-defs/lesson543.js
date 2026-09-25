module.exports = {
 "phaseId": "6a369d5e66020ed05b3214c3",
 "moduleId": "6a369d6066020ed05b321505",
 "order": 1,
 "type": "interactive",
 "duration": 45,
 "difficulty": "intermediate",
 "status": "published",
 "title": "Agent Skills: Portable Contract and Runtime Boundary (Part 2 of 3) — Lifecycle, Dependencies, Tool Contracts and Verification",
 "titleKn": "Agent Skills: Portable Contract ಮತ್ತು Runtime Boundary (Part 2 of 3) — Lifecycle, Dependencies, Tool Contracts ಮತ್ತು Verification",
 "desc": "Follow a skill through the runtime: discovery, validation, cataloging, selection, activation, progressive disclosure, execution and verification. Learn why discovered, selected, activated, authorized, executed and verified are six different claims, and how to debug with them.",
 "descKn": "skill ಅನ್ನು runtime ಮೂಲಕ ಅನುಸರಿಸಿ: discovery ಇಂದ verification ವರೆಗೆ. discovered, selected, activated, authorized, executed, verified ಆರು ವಿಭಿನ್ನ ಹೇಳಿಕೆಗಳು ಎಂದು ತಿಳಿಯಿರಿ.",
 "objectives": [
  "Order the eight lifecycle stages and explain why validation precedes cataloging.",
  "Explain that activation means the body entered model-visible context and nothing more.",
  "Describe progressive disclosure and why the catalog exposes only name and description.",
  "Explain why naming a tool in a skill neither creates nor authorizes it, and list the parts of a tool contract.",
  "Model a skill dependency as a runtime-mediated invocation edge with an explicit missing-dependency behaviour, and use the lifecycle as a debugging framework."
 ],
 "objectivesKn": [
  "ಎಂಟು lifecycle ಹಂತಗಳ ಕ್ರಮ ತಿಳಿಸಿ.",
  "activation ಎಂದರೆ body model-visible context ಗೆ ಬಂದಿದೆ ಎಂದು ಮಾತ್ರ ಎಂದು ವಿವರಿಸಿ.",
  "progressive disclosure ಮತ್ತು catalog ಕೇವಲ name, description ತೋರಿಸುವ ಕಾರಣ ವಿವರಿಸಿ.",
  "tool ಹೆಸರಿಸಿದರೆ ಅದು ಸೃಷ್ಟಿ/ಅಧಿಕೃತ ಆಗುವುದಿಲ್ಲ ಎಂದು ವಿವರಿಸಿ.",
  "skill dependency ಅನ್ನು runtime-mediated ಸಂಪರ್ಕವಾಗಿ ರೂಪಿಸಿ, lifecycle ಅನ್ನು debugging ಗೆ ಬಳಸಿ."
 ],
 "blocks": [
  {
   "type": "heading",
   "data": {
    "textEn": "Agent Skills: Portable Contract and Runtime Boundary (Part 2 of 3)",
    "textKn": "Agent Skills: Portable Contract and Runtime Boundary (Part 2 of 3)",
    "level": "H1"
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "Lesson Info",
    "headingKn": "Lesson ಮಾಹಿತಿ",
    "bodyEn": "• Type: Build · Language: Python (stdlib only) · Prerequisites: Part 1 · Time: ~45 minutes · Part 2 of 3. The lifecycle-state and chooser outputs below were produced by running our own teaching lab (skill_lab.py, shown in full in Part 3).",
    "bodyKn": "• Type: Build · Language: Python (stdlib only) · Prerequisites: Part 1 · Time: ~45 ನಿಮಿಷಗಳು. ಕೆಳಗಿನ outputs ನಮ್ಮದೇ ಬೋಧನಾ lab (skill_lab.py) ಚಲಾಯಿಸಿ ಪಡೆದವು."
   }
  },
  {
   "type": "heading",
   "data": {
    "textEn": "Eight Stages, Six Different Claims",
    "textKn": "ಎಂಟು ಹಂತಗಳು, ಆರು ವಿಭಿನ್ನ ಹೇಳಿಕೆಗಳು",
    "level": "H2"
   }
  },
  {
   "type": "diagram",
   "data": {
    "titleEn": "The lifecycle",
    "titleKn": "Lifecycle",
    "contentEn": "1 Discovery      find packages in configured locations\n2 Validation     check the contract before advertising\n3 Cataloging     expose compact name + description\n4 Selection      explicit or implicit\n5 Activation     SKILL.md body enters model context\n6 Disclosure     read references/assets only when a branch needs them\n7 Execution      through host tools, under host permission + isolation\n8 Verification   check the artifact independently of the model's claim"
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "Discovered ≠ Selected ≠ Activated ≠ Authorized ≠ Executed ≠ Verified",
    "headingKn": "ಆರು ಬೇರೆ ಬೇರೆ ಹೇಳಿಕೆಗಳು",
    "bodyEn": "Each stage has its own failure modes and its own evidence. \"The skill was activated\" means the body entered context. \"The helper script executed\" needs a script path, argv, cwd and exit code. \"The artifact is correct\" needs independent verification. Keeping these apart is what lets you localize a failure.",
    "bodyKn": "ಪ್ರತಿ ಹಂತಕ್ಕೂ ತನ್ನದೇ ವೈಫಲ್ಯ ಮತ್ತು ಸಾಕ್ಷ್ಯ ಇವೆ. ಇವನ್ನು ಬೇರ್ಪಡಿಸುವುದರಿಂದ ವೈಫಲ್ಯ ಎಲ್ಲಿ ಎಂದು ಗುರುತಿಸಬಹುದು."
   }
  },
  {
   "type": "code",
   "data": {
    "filename": "skill_lab.py",
    "headingEn": "Tracking the stage a skill actually reached",
    "headingKn": "skill ವಾಸ್ತವವಾಗಿ ತಲುಪಿದ ಹಂತ ಟ್ರ್ಯಾಕ್ ಮಾಡುವುದು",
    "descEn": "A tiny stage tracker (our own code). A skill merely found on disk has reached only \"discovered\". The second case is the important one: activated, yet nothing executed because running Python was not permitted. There is no contradiction in that state.",
    "descKn": "ಸಣ್ಣ ಹಂತ tracker (ನಮ್ಮದೇ ಕೋಡ್). ಡಿಸ್ಕ್‌ನಲ್ಲಿ ಸಿಕ್ಕ skill \"discovered\" ಮಾತ್ರ. ಎರಡನೆಯದು ಮುಖ್ಯ: activated ಆದರೂ Python ಅನುಮತಿ ಇಲ್ಲದ್ದರಿಂದ ಏನೂ execute ಆಗಿಲ್ಲ.",
    "code": "STAGES = [\"discovered\", \"validated\", \"cataloged\", \"selected\", \"activated\", \"executed\", \"verified\"]\n\ndef lifecycle(reached):\n    return {s: (s in reached) for s in STAGES}\n\nprint(\"found on disk only:\", lifecycle({\"discovered\"}))\nprint(\"activated but script not permitted:\", lifecycle({\"discovered\", \"validated\", \"cataloged\", \"selected\", \"activated\"}))"
   }
  },
  {
   "type": "output",
   "data": {
    "output": "found on disk only: {'discovered': True, 'validated': False, 'cataloged': False, 'selected': False, 'activated': False, 'executed': False, 'verified': False}\nactivated but script not permitted: {'discovered': True, 'validated': True, 'cataloged': True, 'selected': True, 'activated': True, 'executed': False, 'verified': False}"
   }
  },
  {
   "type": "heading",
   "data": {
    "textEn": "Validate Before You Advertise",
    "textKn": "ಪ್ರಚಾರ ಮಾಡುವ ಮೊದಲು ಮಾನ್ಯಗೊಳಿಸಿ",
    "level": "H2"
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "Why Validation Precedes the Catalog",
    "headingKn": "ಕ್ಯಾಟಲಾಗ್ ಮೊದಲು ಮಾನ್ಯತೆ ಏಕೆ",
    "bodyEn": "If a runtime published everything it scanned, the model could select a skill and only then discover malformed metadata. The correct order is discovery, validation, then catalog, so malformed or unsafe packages are rejected before they reach the model's routing surface. Do not advertise an artifact before checking the contract that makes the advertisement meaningful.",
    "bodyKn": "runtime ಸ್ಕ್ಯಾನ್ ಮಾಡಿದ್ದೆಲ್ಲವನ್ನೂ ಪ್ರಕಟಿಸಿದರೆ ಮಾದರಿ skill ಆರಿಸಿದ ನಂತರವೇ ದೋಷ ಪತ್ತೆಯಾಗುತ್ತದೆ. ಸರಿಯಾದ ಕ್ರಮ: discovery, validation, catalog."
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "The Catalog Is Small on Purpose",
    "headingKn": "ಕ್ಯಾಟಲಾಗ್ ಉದ್ದೇಶಪೂರ್ವಕವಾಗಿ ಚಿಕ್ಕದು",
    "bodyEn": "The catalog exposes compact name and description only. With 500 skills installed you must not put 500 complete SKILL.md files into context for every request. Selection picks a relevant skill; activation then admits its body; disclosure reads a reference or asset only when the current branch needs it (an NPM release reads npm-release.md, not mobile-release.md).",
    "bodyKn": "500 skills ಇದ್ದರೆ ಪ್ರತಿ request ಗೆ 500 ಪೂರ್ಣ SKILL.md context ಗೆ ಹಾಕಬಾರದು. selection ಆರಿಸುತ್ತದೆ, activation body ಸೇರಿಸುತ್ತದೆ, disclosure ಅಗತ್ಯವಿದ್ದಾಗ ಮಾತ್ರ references ಓದುತ್ತದೆ."
   }
  },
  {
   "type": "diagram",
   "data": {
    "titleEn": "Progressive disclosure",
    "titleKn": "Progressive disclosure",
    "contentEn": "CATALOG (name + description)   <- always small\n        |\n     selected?\n     no -> stays unloaded\n     yes -> ACTIVATE -> SKILL.md body\n                         |\n                package type?\n                NPM -> references/npm-release.md\n                Python -> references/python-release.md   <- only the needed branch"
   }
  },
  {
   "type": "heading",
   "data": {
    "textEn": "Execution Belongs to the Host",
    "textKn": "Execution host ಗೆ ಸೇರಿದೆ",
    "level": "H2"
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "Naming a Tool Does Not Authorize It",
    "headingKn": "Tool ಹೆಸರಿಸುವುದು ಅಧಿಕಾರ ನೀಡುವುದಿಲ್ಲ",
    "bodyEn": "A skill line such as \"Delete all old release artifacts\" does not grant delete permission, and \"Use the production deployment tool\" does not create deploy_production(). The host owns the capability registry. The skill requests, the host evaluates: allowed means execute, denied means stop or fall back. A skill should provide a fallback or fail clearly when a required tool is unavailable.",
    "bodyKn": "\"ಹಳೆಯ artifacts ಅಳಿಸಿ\" ಎಂಬ ಸಾಲು ಅಳಿಸುವ ಅನುಮತಿ ನೀಡುವುದಿಲ್ಲ. capability registry host ಗೆ ಸೇರಿದ್ದು. skill ಕೇಳುತ್ತದೆ, host ಮೌಲ್ಯಮಾಪನ ಮಾಡುತ್ತದೆ."
   }
  },
  {
   "type": "table",
   "data": {
    "headingEn": "Anatomy of a tool contract",
    "headers": [
     "Part",
     "Question it answers"
    ],
    "rows": [
     [
      "Inputs",
      "What arguments are accepted?"
     ],
     [
      "Outputs",
      "What does success return?"
     ],
     [
      "Permissions",
      "Who may invoke it?"
     ],
     [
      "Side effects",
      "What changes externally?"
     ],
     [
      "Errors",
      "How can it fail?"
     ],
     [
      "Evidence",
      "How do we prove what actually happened?"
     ]
    ]
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "A Fluent Report Is Not Evidence",
    "headingKn": "ನಿರರ್ಗಳ ವರದಿ ಸಾಕ್ಷ್ಯ ಅಲ್ಲ",
    "bodyEn": "\"The validator ran successfully\" is a claim. Evidence is the resolved script path, the resolved target path, the working directory, the exact argv and the exit code. Exit code 0 proves something narrower still: the process completed according to its own contract. The artifact it produced may still need independent verification.",
    "bodyKn": "\"validator ಯಶಸ್ವಿಯಾಗಿ ಚಲಿಸಿತು\" ಒಂದು ಹೇಳಿಕೆ. ಸಾಕ್ಷ್ಯ = script path, target path, cwd, argv, exit code."
   }
  },
  {
   "type": "table",
   "data": {
    "headingEn": "Three claims, three kinds of evidence",
    "headers": [
     "Claim",
     "Evidence"
    ],
    "rows": [
     [
      "The skill was activated",
      "The skill body entered context"
     ],
     [
      "The helper script executed",
      "Script path + argv + cwd + exit code"
     ],
     [
      "The artifact is correct",
      "Independent verification of the artifact"
     ]
    ]
   }
  },
  {
   "type": "heading",
   "data": {
    "textEn": "Dependencies Are Runtime-Mediated",
    "textKn": "Dependencies Runtime-ಮಧ್ಯಸ್ಥಿಕೆ",
    "level": "H2"
   }
  },
  {
   "type": "code",
   "data": {
    "filename": "SKILL.md",
    "headingEn": "An explicit dependency with a failure rule",
    "headingKn": "ವೈಫಲ್ಯ ನಿಯಮವಿರುವ ಸ್ಪಷ್ಟ dependency",
    "descEn": "One skill directs the agent to invoke another; this is not a language-level import. The line states the condition, the input and output, and what to do when the dependency is missing: stop and report it rather than improvising the other skill.",
    "descKn": "ಒಂದು skill ಇನ್ನೊಂದನ್ನು ಕರೆಯಲು ಸೂಚಿಸುತ್ತದೆ; ಇದು import ಅಲ್ಲ. ಷರತ್ತು, input/output, ಮತ್ತು ಕಾಣೆಯಾದರೆ ಏನು ಮಾಡಬೇಕು ಎಂದು ಹೇಳುತ್ತದೆ.",
    "code": "After producing the candidate changelog, invoke the `release-risk-review` skill.\nPass the candidate path and require a blocking or non-blocking verdict.\nIf that skill is unavailable, stop and report the missing dependency."
   }
  },
  {
   "type": "output",
   "data": {
    "output": "(file content: no program output)"
   }
  },
  {
   "type": "diagram",
   "data": {
    "titleEn": "Why mediation matters",
    "titleKn": "ಮಧ್ಯಸ್ಥಿಕೆ ಏಕೆ ಮುಖ್ಯ",
    "contentEn": "Skill A --requests--> RUNTIME --> discover B\n                              --> eligibility\n                              --> permission policy\n                              --> activate B, manage context\n                                    |\n                                 Skill B\n\nA silent import would let B bypass discovery, policy, permissions and context controls."
   }
  },
  {
   "type": "heading",
   "data": {
    "textEn": "Choosing the Right Primitive",
    "textKn": "ಸರಿಯಾದ Primitive ಆರಿಸುವುದು",
    "level": "H2"
   }
  },
  {
   "type": "table",
   "data": {
    "headingEn": "Decision card",
    "headers": [
     "Need",
     "Likely primitive"
    ],
    "rows": [
     [
      "Reusable model judgment across several steps",
      "Skill"
     ],
     [
      "Must happen whenever an event fires",
      "Hook / application code"
     ],
     [
      "External typed capability",
      "Tool / MCP server"
     ],
     [
      "Isolated context, state or ownership",
      "Subagent"
     ],
     [
      "Guidance specific to one repository",
      "Repository instructions"
     ],
     [
      "One interaction is enough",
      "Prompt"
     ]
    ]
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "One Workflow, Several Primitives",
    "headingKn": "ಒಂದು ವರ್ಕ್‌ಫ್ಲೋ, ಹಲವು Primitives",
    "bodyEn": "\"Every time a PR is opened, fetch its data, apply our reusable review method, and send high-risk changes to an isolated security reviewer\" needs a hook (must happen every time), a tool (typed PR data), a skill (reusable review procedure) and a subagent (isolated security review). Part 3 runs exactly this case through a chooser.",
    "bodyKn": "ಒಂದು ವರ್ಕ್‌ಫ್ಲೋಗೆ hook, tool, skill, subagent ನಾಲ್ಕೂ ಬೇಕಾಗಬಹುದು. Part 3 ಇದನ್ನೇ chooser ಮೂಲಕ ಚಲಾಯಿಸುತ್ತದೆ."
   }
  },
  {
   "type": "heading",
   "data": {
    "textEn": "Lifecycle as a Debugging Framework",
    "textKn": "Debugging ಚೌಕಟ್ಟಾಗಿ Lifecycle",
    "level": "H2"
   }
  },
  {
   "type": "table",
   "data": {
    "headingEn": "Localize the failure",
    "headers": [
     "Stages that passed",
     "First failing stage",
     "Likely cause"
    ],
    "rows": [
     [
      "Discovery, validation, catalog",
      "Selection",
      "Routing or description problem"
     ],
     [
      "Discovery",
      "Validation",
      "Package contract problem"
     ],
     [
      "Through activation",
      "Execution",
      "Capability, permission, path or execution problem"
     ],
     [
      "Through execution",
      "Verification",
      "Artifact is wrong even though the process succeeded"
     ]
    ]
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "Activated Is Not Authorized, Permitted Is Not Correct",
    "headingKn": "Activated ≠ Authorized; Permitted ≠ Correct",
    "bodyEn": "An activated skill that says \"Publish version 3.2\" may still be blocked by an approval requirement or denied outright. And a permitted, successful tool call can still produce a wrong or incomplete result. Repository rules and the user's request also constrain the skill: it does not become the highest authority merely because it was activated.",
    "bodyKn": "activated skill \"3.2 publish ಮಾಡಿ\" ಎಂದರೂ host ನಿರಾಕರಿಸಬಹುದು. ಅನುಮತಿಸಿದ ಯಶಸ್ವಿ tool call ಸಹ ತಪ್ಪು ಫಲಿತಾಂಶ ನೀಡಬಹುದು."
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "Key Takeaways",
    "headingKn": "ಮುಖ್ಯ ಅಂಶಗಳು",
    "bodyEn": "• The lifecycle is discover, validate, catalog, select, activate, disclose, execute, verify.\n• We genuinely ran a stage tracker: a skill \"found on disk only\" had every stage False except discovered, and an \"activated but script not permitted\" skill had activated True and executed False.\n• Validate before you advertise; keep the catalog to name + description; disclose resources by branch.\n• Naming a tool does not create or authorize it; a tool contract covers inputs, outputs, permissions, side effects, errors and evidence.\n• Dependencies are runtime-mediated edges with an explicit missing-dependency rule.\n• Choose the primitive by need: skill, hook, tool, subagent, repository instructions or prompt.",
    "bodyKn": "• lifecycle: discover, validate, catalog, select, activate, disclose, execute, verify.\n• ನಿಜ stage tracker ಚಲಾಯಿಸಿದ್ದೇವೆ.\n• ಪ್ರಚಾರ ಮಾಡುವ ಮೊದಲು ಮಾನ್ಯಗೊಳಿಸಿ.\n• tool ಹೆಸರಿಸುವುದು ಅಧಿಕಾರ ನೀಡುವುದಿಲ್ಲ.\n• dependencies runtime-mediated.\n• ಅಗತ್ಯದ ಆಧಾರದಲ್ಲಿ primitive ಆರಿಸಿ."
   }
  },
  {
   "type": "quiz",
   "data": {
    "questions": [
     {
      "q": "A runtime finds release-readiness/ on disk. Has the skill been activated?",
      "qKn": "runtime ಡಿಸ್ಕ್‌ನಲ್ಲಿ release-readiness/ ಕಂಡುಕೊಂಡಿದೆ. skill activate ಆಗಿದೆಯೇ?",
      "opts": [
       "Yes",
       "No: discovery only finds a candidate package"
      ],
      "optsKn": [
       "ಹೌದು",
       "ಇಲ್ಲ: discovery ಅಭ್ಯರ್ಥಿ package ಮಾತ್ರ ಕಂಡುಹಿಡಿಯುತ್ತದೆ"
      ],
      "correct": 1
     },
     {
      "q": "What does activation mean?",
      "qKn": "activation ಎಂದರೇನು?",
      "opts": [
       "Every script ran successfully",
       "The skill body entered model-visible context",
       "The skill passed verification",
       "Every named tool became authorized"
      ],
      "optsKn": [
       "ಪ್ರತಿ script ಯಶಸ್ವಿ",
       "skill body model-visible context ಗೆ ಬಂದಿದೆ",
       "skill verification ಪಾಸ್",
       "ಹೆಸರಿಸಿದ ಪ್ರತಿ tool ಅಧಿಕೃತ"
      ],
      "correct": 1
     },
     {
      "q": "A skill says \"Use deploy_production\". Does that create or authorize the tool?",
      "qKn": "\"deploy_production ಬಳಸಿ\" ಎಂದು skill ಹೇಳಿದರೆ ಆ tool ಸೃಷ್ಟಿ/ಅಧಿಕೃತ ಆಗುತ್ತದೆಯೇ?",
      "opts": [
       "Yes",
       "No: the host owns the capability registry and permission boundary"
      ],
      "optsKn": [
       "ಹೌದು",
       "ಇಲ್ಲ: host capability registry ಹೊಂದಿದೆ"
      ],
      "correct": 1
     },
     {
      "q": "Skill A needs Skill B. What is the correct model?",
      "qKn": "Skill A ಗೆ Skill B ಬೇಕು. ಸರಿಯಾದ ಮಾದರಿ?",
      "opts": [
       "Python-style import",
       "Runtime-mediated invocation",
       "Copy B into A's frontmatter",
       "Assume B exists"
      ],
      "optsKn": [
       "Python ಮಾದರಿ import",
       "Runtime-mediated invocation",
       "B ಅನ್ನು A ನ frontmatter ಗೆ ನಕಲಿಸಿ",
       "B ಇದೆ ಎಂದು ಊಹಿಸಿ"
      ],
      "correct": 1
     },
     {
      "q": "A script exits 0. Does that alone prove the final artifact is correct?",
      "qKn": "script 0 ನೊಂದಿಗೆ ನಿರ್ಗಮಿಸಿದರೆ ಅಂತಿಮ artifact ಸರಿ ಎಂದು ಸಾಬೀತಾಗುತ್ತದೆಯೇ?",
      "opts": [
       "Yes",
       "No: execution evidence and artifact verification are separate"
      ],
      "optsKn": [
       "ಹೌದು",
       "ಇಲ್ಲ: execution ಸಾಕ್ಷ್ಯ ಮತ್ತು artifact verification ಬೇರೆ"
      ],
      "correct": 1
     }
    ]
   }
  }
 ]
};
