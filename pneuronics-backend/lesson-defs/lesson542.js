module.exports = {
 "phaseId": "6a369d5e66020ed05b3214c3",
 "moduleId": "6a369d6066020ed05b321505",
 "order": 0,
 "type": "interactive",
 "duration": 40,
 "difficulty": "intermediate",
 "status": "published",
 "title": "Agent Skills: Portable Contract and Runtime Boundary (Part 1 of 3) — What a Skill Is and Is Not",
 "titleKn": "Agent Skills: Portable Contract ಮತ್ತು Runtime Boundary (Part 1 of 3) — Skill ಎಂದರೇನು ಮತ್ತು ಏನಲ್ಲ",
 "desc": "An Agent Skill is a directory whose entry point is SKILL.md, not a saved prompt. Learn the package anatomy, the portable core versus host-specific runtime extensions, and how a skill differs from a prompt, repository instructions, an MCP tool, a hook, a subagent and a plugin.",
 "descKn": "Agent Skill ಎಂದರೆ SKILL.md ಪ್ರವೇಶ ಬಿಂದುವಿರುವ ಡೈರೆಕ್ಟರಿ, ಉಳಿಸಿದ prompt ಅಲ್ಲ. Package ರಚನೆ, portable core vs host-ನಿರ್ದಿಷ್ಟ runtime extensions, ಮತ್ತು skill ಇತರ ಪರಿಕಲ್ಪನೆಗಳಿಂದ ಹೇಗೆ ಭಿನ್ನ ಎಂದು ತಿಳಿಯಿರಿ.",
 "objectives": [
  "Define an Agent Skill as a complete directory package and explain why SKILL.md alone is not the deployable unit.",
  "Distinguish a skill from a prompt, repository instructions, an MCP tool, a hook, a subagent and a plugin.",
  "Separate the portable core (name, description and optional fields) from host-specific runtime extensions.",
  "Explain why frontmatter is executable metadata and why syntax validity is not package integrity.",
  "Read a real SKILL.md and identify its trigger, knowledge, deterministic operation, decision, artifact and safety boundary."
 ],
 "objectivesKn": [
  "Agent Skill ಅನ್ನು ಸಂಪೂರ್ಣ ಡೈರೆಕ್ಟರಿ package ಎಂದು ವ್ಯಾಖ್ಯಾನಿಸಿ.",
  "skill ಅನ್ನು prompt, repository instructions, MCP tool, hook, subagent, plugin ಗಳಿಂದ ಪ್ರತ್ಯೇಕಿಸಿ.",
  "portable core ಅನ್ನು host-ನಿರ್ದಿಷ್ಟ runtime extensions ಇಂದ ಬೇರ್ಪಡಿಸಿ.",
  "frontmatter ಏಕೆ ಕಾರ್ಯಗತ metadata ಎಂದು ವಿವರಿಸಿ.",
  "ನಿಜ SKILL.md ಓದಿ ಅದರ ಭಾಗಗಳನ್ನು ಗುರುತಿಸಿ."
 ],
 "blocks": [
  {
   "type": "heading",
   "data": {
    "textEn": "Agent Skills: Portable Contract and Runtime Boundary (Part 1 of 3)",
    "textKn": "Agent Skills: Portable Contract and Runtime Boundary (Part 1 of 3)",
    "level": "H1"
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "Lesson Info",
    "headingKn": "Lesson ಮಾಹಿತಿ",
    "bodyEn": "• Type: Build · Language: Python (stdlib only) · Time: ~40 minutes · Part 1 of 3. The source lesson describes its main.py but does not include its code, so every program in this module is our own teaching implementation, labelled as such, and every output shown was genuinely produced by running it.",
    "bodyKn": "• Type: Build · Language: Python (stdlib only) · Time: ~40 ನಿಮಿಷಗಳು · Part 1 of 3. ಮೂಲ ಪಾಠ main.py ಕೋಡ್ ಒಳಗೊಂಡಿಲ್ಲ, ಆದ್ದರಿಂದ ಈ module ನ ಕಾರ್ಯಕ್ರಮಗಳು ನಮ್ಮದೇ ಬೋಧನಾ ಅನುಷ್ಠಾನಗಳು; ತೋರಿಸಿದ ಎಲ್ಲಾ outputs ನಿಜ run ಗಳಿಂದ."
   }
  },
  {
   "type": "heading",
   "data": {
    "textEn": "The Problem with a Giant Prompt",
    "textKn": "ದೊಡ್ಡ Prompt ನ ಸಮಸ್ಯೆ",
    "level": "H2"
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "A Repeatable Process Needs a Package",
    "headingKn": "ಪುನರಾವರ್ತಿತ ಪ್ರಕ್ರಿಯೆಗೆ Package ಬೇಕು",
    "bodyEn": "Suppose your team releases software the same way every time: find merged changes, read migration notes, update the changelog, run packaging, produce a checklist. Pasting those instructions into a prompt each time gives you no stable identity, no discovery rule, no resource boundary, no testable structure and no explicit handling of scripts and files. An Agent Skill packages that reusable procedure.",
    "bodyKn": "ತಂಡ ಪ್ರತಿ ಬಾರಿ ಒಂದೇ ರೀತಿ ಸಾಫ್ಟ್‌ವೇರ್ release ಮಾಡುತ್ತದೆ ಎಂದುಕೊಳ್ಳಿ. ಸೂಚನೆಗಳನ್ನು ಪ್ರತಿ ಬಾರಿ prompt ಗೆ ಅಂಟಿಸಿದರೆ ಸ್ಥಿರ ಗುರುತು, discovery ನಿಯಮ, resource ಗಡಿ ಇರುವುದಿಲ್ಲ. Agent Skill ಆ ಮರುಬಳಕೆ ವಿಧಾನವನ್ನು package ಮಾಡುತ್ತದೆ."
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "The Definition",
    "headingKn": "ವ್ಯಾಖ್ಯಾನ",
    "bodyEn": "An Agent Skill is a directory whose entry point is SKILL.md. The directory may also hold references, scripts and assets. So Skill is not SKILL.md alone; the skill is the complete directory. If SKILL.md says \"Read references/release-policy.md\" and that file was never shipped, the package is broken even though the Markdown parses perfectly.",
    "bodyKn": "Agent Skill ಎಂದರೆ SKILL.md ಪ್ರವೇಶ ಬಿಂದುವಿರುವ ಡೈರೆಕ್ಟರಿ; references, scripts, assets ಸಹ ಇರಬಹುದು. ಆದ್ದರಿಂದ Skill ≠ SKILL.md ಮಾತ್ರ; ಇಡೀ ಡೈರೆಕ್ಟರಿ skill."
   }
  },
  {
   "type": "diagram",
   "data": {
    "titleEn": "Anatomy of a skill package",
    "titleKn": "Skill package ರಚನೆ",
    "contentEn": "release-readiness/\n|-- SKILL.md            <- entry point: frontmatter + procedure\n|-- references/\n|   |-- release-policy.md\n|   `-- changelog-format.md\n|-- scripts/\n|   `-- inspect_release.py   <- deterministic helper\n`-- assets/\n    `-- release-checklist.md <- output template"
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
      "Agent skill",
      "Discoverable directory with procedural instructions and optional resources"
     ],
     [
      "Portable core",
      "The contract shared through the Agent Skills specification"
     ],
     [
      "Runtime extension",
      "Host-specific configuration that needs a compatible runtime"
     ],
     [
      "Activation",
      "The skill body enters model-visible context"
     ],
     [
      "Skill dependency",
      "Runtime-mediated invocation of another skill"
     ],
     [
      "Tool contract",
      "The complete operational contract around a capability"
     ]
    ]
   }
  },
  {
   "type": "heading",
   "data": {
    "textEn": "A Skill Is Not Any of These",
    "textKn": "Skill ಇವುಗಳಲ್ಲ",
    "level": "H2"
   }
  },
  {
   "type": "table",
   "data": {
    "headingEn": "Skill versus neighbouring concepts",
    "headers": [
     "Concept",
     "Answers",
     "Example"
    ],
    "rows": [
     [
      "Prompt",
      "What should happen in this one interaction?",
      "\"Review this release now.\""
     ],
     [
      "Repository instructions",
      "What are the rules of this environment?",
      "Use Python 3.13; never edit generated/"
     ],
     [
      "MCP tool",
      "What operation can the application perform?",
      "get_release(version=\"3.2.0\")"
     ],
     [
      "Hook",
      "What must happen whenever an event fires?",
      "Security check after every tool call"
     ],
     [
      "Subagent",
      "Who gets delegated work with separate context?",
      "A security-audit worker"
     ],
     [
      "Plugin",
      "How is broader functionality distributed?",
      "A bundle of skills, tools and more"
     ],
     [
      "Agent Skill",
      "How should the agent approach this class of work?",
      "The release-readiness procedure"
     ]
    ]
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "Procedure Versus Capability",
    "headingKn": "Procedure vs Capability",
    "bodyEn": "The skill provides procedure; the tool provides capability. Writing \"Use the get_release tool\" inside a skill does not create that tool. The host still has to expose and authorize it. Likewise repository rules still constrain an activated skill: a generic refactoring skill cannot override a rule forbidding edits to generated files.",
    "bodyKn": "skill procedure ನೀಡುತ್ತದೆ; tool capability ನೀಡುತ್ತದೆ. skill ನಲ್ಲಿ \"get_release tool ಬಳಸಿ\" ಎಂದು ಬರೆದರೆ ಆ tool ಸೃಷ್ಟಿಯಾಗುವುದಿಲ್ಲ. host ಅದನ್ನು ಒದಗಿಸಿ ಅಧಿಕೃತಗೊಳಿಸಬೇಕು."
   }
  },
  {
   "type": "heading",
   "data": {
    "textEn": "The Portable Core",
    "textKn": "Portable Core",
    "level": "H2"
   }
  },
  {
   "type": "code",
   "data": {
    "filename": "SKILL.md",
    "headingEn": "A minimal valid SKILL.md",
    "headingKn": "ಕನಿಷ್ಠ ಮಾನ್ಯ SKILL.md",
    "descEn": "Two frontmatter fields are required. name is the stable identity and must match the parent directory; description is documentation and routing metadata, so it should say WHAT the skill does and WHEN it applies. This is the exact text our validator accepts in Part 3.",
    "descKn": "ಎರಡು frontmatter fields ಕಡ್ಡಾಯ. name ಸ್ಥಿರ ಗುರುತು ಮತ್ತು ಪೋಷಕ ಡೈರೆಕ್ಟರಿಗೆ ಹೊಂದಬೇಕು; description ದಾಖಲೆ ಮತ್ತು routing metadata, ಆದ್ದರಿಂದ ಏನು ಮತ್ತು ಯಾವಾಗ ಎಂದು ಹೇಳಬೇಕು.",
    "code": "---\nname: release-readiness\ndescription: Inspect a release candidate when the user asks whether a version is ready to publish.\nlicense: MIT\n---\n\n# Release readiness\n\n1. Read references/release-policy.md.\n2. Run python3 scripts/inspect_release.py --format json.\n3. Stop if the report contains a blocking failure."
   }
  },
  {
   "type": "output",
   "data": {
    "output": "(file content: no program output)"
   }
  },
  {
   "type": "table",
   "data": {
    "headingEn": "Portable optional fields",
    "headers": [
     "Field",
     "Purpose"
    ],
    "rows": [
     [
      "license",
      "Package licensing"
     ],
     [
      "compatibility",
      "Environmental requirements"
     ],
     [
      "metadata",
      "String-valued extension information"
     ],
     [
      "allowed-tools",
      "Suggested pre-approved tools; experimental and host-dependent"
     ]
    ]
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "Good Description, Bad Description",
    "headingKn": "ಒಳ್ಳೆಯ ಮತ್ತು ಕೆಟ್ಟ Description",
    "bodyEn": "\"Helps with releases.\" tells the runtime nothing. \"Inspect a release candidate when the user asks whether a version is ready to publish.\" says WHAT (inspect a candidate) and WHEN (asked whether a version is ready). The catalog exposes only name and description, so this sentence decides whether the skill is ever selected.",
    "bodyKn": "\"Helps with releases.\" runtime ಗೆ ಏನನ್ನೂ ಹೇಳುವುದಿಲ್ಲ. ಎರಡನೆಯದು ಏನು ಮತ್ತು ಯಾವಾಗ ಎಂದು ಹೇಳುತ್ತದೆ. catalog name ಮತ್ತು description ಮಾತ್ರ ತೋರಿಸುವುದರಿಂದ ಆ ವಾಕ್ಯವೇ ಆಯ್ಕೆ ನಿರ್ಧರಿಸುತ್ತದೆ."
   }
  },
  {
   "type": "heading",
   "data": {
    "textEn": "Runtime Extensions",
    "textKn": "Runtime Extensions",
    "level": "H2"
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "Extra Frontmatter Is Not Automatically Standard",
    "headingKn": "ಹೆಚ್ಚುವರಿ Frontmatter ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಮಾನದಂಡ ಅಲ್ಲ",
    "bodyEn": "One host may support fields such as model, effort, hooks or agent. These are runtime extensions, not portable Agent Skills features. A runtime meeting an extension it does not understand may ignore it, reject it or preserve it, without implementing its meaning. So the portable workflow must stay meaningful without assuming every host understands every extension.",
    "bodyKn": "ಒಂದು host model, effort, hooks, agent ಮುಂತಾದ fields ಬೆಂಬಲಿಸಬಹುದು. ಇವು runtime extensions, portable features ಅಲ್ಲ. ಅರ್ಥವಾಗದ extension ಅನ್ನು runtime ನಿರ್ಲಕ್ಷಿಸಬಹುದು, ತಿರಸ್ಕರಿಸಬಹುದು ಅಥವಾ ಉಳಿಸಬಹುದು."
   }
  },
  {
   "type": "diagram",
   "data": {
    "titleEn": "Portable core with host adapters",
    "titleKn": "Host adapters ಜೊತೆ portable core",
    "contentEn": "              SKILL.md\n                 |\n           PORTABLE CORE   <- means the same everywhere\n        +--------+--------+\n        |        |        |\n     Host A   Host B   Host C\n      ext      ext      ext     <- meaning depends on the adapter"
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "Frontmatter Is Executable Metadata",
    "headingKn": "Frontmatter ಕಾರ್ಯಗತ Metadata",
    "bodyEn": "It is easy to call frontmatter \"just metadata\", but it acts before the body is loaded. A malformed name can break discovery. A vague description can misroute requests. An invocation flag can remove a skill from the catalog. A tool allowance can change permission behaviour. A context setting can move execution into another session. Treat it like configuration code.",
    "bodyKn": "frontmatter ಅನ್ನು \"ಕೇವಲ metadata\" ಎನ್ನುವುದು ಸುಲಭ, ಆದರೆ ಅದು body ಲೋಡ್ ಆಗುವ ಮೊದಲೇ ಕೆಲಸ ಮಾಡುತ್ತದೆ. ಅದನ್ನು configuration code ನಂತೆ ಪರಿಗಣಿಸಿ."
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "Syntax Validity Is Not Package Integrity",
    "headingKn": "Syntax ಮಾನ್ಯತೆ ≠ Package ಸಮಗ್ರತೆ",
    "bodyEn": "A SKILL.md can parse perfectly and still be operationally invalid if it points at a reference or script that was never shipped. This is why the deployable unit is the directory. Part 3 builds a validator for the entry file, and it is honest about that limit: it checks the contract of SKILL.md, not the presence of every file it mentions.",
    "bodyKn": "SKILL.md ಸರಿಯಾಗಿ parse ಆದರೂ ಹಂಚದ reference ಅಥವಾ script ಗೆ ಸೂಚಿಸಿದರೆ ಕಾರ್ಯತಃ ಅಮಾನ್ಯ. Part 3 ರ validator SKILL.md ಒಪ್ಪಂದ ಪರಿಶೀಲಿಸುತ್ತದೆ, ಅದು ಉಲ್ಲೇಖಿಸುವ ಪ್ರತಿ ಫೈಲ್ ಇದೆಯೇ ಎಂದಲ್ಲ."
   }
  },
  {
   "type": "heading",
   "data": {
    "textEn": "Reading a Real Procedure",
    "textKn": "ನಿಜ Procedure ಓದುವುದು",
    "level": "H2"
   }
  },
  {
   "type": "code",
   "data": {
    "filename": "SKILL.md",
    "headingEn": "The body carries six kinds of information",
    "headingKn": "Body ಆರು ಬಗೆಯ ಮಾಹಿತಿ ಹೊಂದಿದೆ",
    "descEn": "Read the numbered procedure: it has a trigger (a release candidate), knowledge (release-policy.md), a deterministic operation (inspect_release.py), a decision (blocking failure?), an artifact (the checklist) and a safety boundary (ask before publishing). That is far richer than a saved prompt.",
    "descKn": "ಸಂಖ್ಯೆಯ procedure ಓದಿ: trigger, knowledge, deterministic operation, decision, artifact, safety boundary. ಇದು ಉಳಿಸಿದ prompt ಗಿಂತ ಹೆಚ್ಚು ಶ್ರೀಮಂತ.",
    "code": "# Release readiness\n\nUse this workflow for a release candidate, not for ordinary development builds.\n\n1. Read `references/release-policy.md`.\n2. Run `python3 scripts/inspect_release.py --format json`.\n3. Stop if the report contains a blocking failure.\n4. Produce the checklist from `assets/release-checklist.md`.\n5. Ask for approval before any publish or tag action."
   }
  },
  {
   "type": "output",
   "data": {
    "output": "(file content: no program output)"
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "Key Takeaways",
    "headingKn": "ಮುಖ್ಯ ಅಂಶಗಳು",
    "bodyEn": "• A skill is a complete directory whose entry point is SKILL.md; it is not a saved prompt.\n• Skill answers \"how should the agent approach this class of work\"; tools answer \"what can be done\"; hooks answer \"what must happen on an event\"; subagents answer \"who does delegated work\".\n• name and description are the two required portable fields; name matches the directory; description is routing metadata.\n• Runtime extensions belong behind an explicit adapter and are never assumed portable.\n• Frontmatter acts like configuration, and syntax validity is not package integrity.",
    "bodyKn": "• skill ಎಂದರೆ SKILL.md ಪ್ರವೇಶ ಬಿಂದುವಿರುವ ಸಂಪೂರ್ಣ ಡೈರೆಕ್ಟರಿ.\n• skill = ಹೇಗೆ; tool = ಏನು ಮಾಡಬಹುದು; hook = ಘಟನೆಯ ಮೇಲೆ ಏನಾಗಬೇಕು; subagent = ಯಾರು.\n• name ಮತ್ತು description ಕಡ್ಡಾಯ.\n• runtime extensions ಸ್ಪಷ್ಟ adapter ಹಿಂದೆ ಇರಬೇಕು.\n• frontmatter configuration ನಂತೆ."
   }
  },
  {
   "type": "quiz",
   "data": {
    "questions": [
     {
      "q": "What is the deployable unit of an Agent Skill?",
      "qKn": "Agent Skill ನ ನಿಯೋಜನಾ ಘಟಕ ಯಾವುದು?",
      "opts": [
       "Only SKILL.md",
       "The complete skill directory",
       "Only the YAML frontmatter",
       "The MCP server"
      ],
      "optsKn": [
       "SKILL.md ಮಾತ್ರ",
       "ಸಂಪೂರ್ಣ skill ಡೈರೆಕ್ಟರಿ",
       "YAML frontmatter ಮಾತ್ರ",
       "MCP server"
      ],
      "correct": 1
     },
     {
      "q": "Which two frontmatter fields are required?",
      "qKn": "ಯಾವ ಎರಡು frontmatter fields ಕಡ್ಡಾಯ?",
      "opts": [
       "name and description",
       "name and model",
       "description and hooks",
       "model and effort"
      ],
      "optsKn": [
       "name ಮತ್ತು description",
       "name ಮತ್ತು model",
       "description ಮತ್ತು hooks",
       "model ಮತ್ತು effort"
      ],
      "correct": 0
     },
     {
      "q": "What is the main difference between a skill and an MCP tool?",
      "qKn": "skill ಮತ್ತು MCP tool ನಡುವಿನ ಮುಖ್ಯ ವ್ಯತ್ಯಾಸ?",
      "opts": [
       "Skills are remote, tools are local",
       "Skills provide procedure; tools provide capability",
       "They are identical",
       "Skills bypass tool permissions"
      ],
      "optsKn": [
       "skills remote, tools local",
       "skills procedure ನೀಡುತ್ತವೆ; tools capability",
       "ಎರಡೂ ಒಂದೇ",
       "skills tool ಅನುಮತಿ ದಾಟುತ್ತವೆ"
      ],
      "correct": 1
     },
     {
      "q": "A host supports model, effort and hooks as extra skill config. How should they be treated?",
      "qKn": "host model, effort, hooks ಬೆಂಬಲಿಸಿದರೆ ಅವನ್ನು ಹೇಗೆ ಪರಿಗಣಿಸಬೇಕು?",
      "opts": [
       "Mandatory portable fields",
       "Runtime extensions",
       "Tool schemas",
       "Learned skills"
      ],
      "optsKn": [
       "ಕಡ್ಡಾಯ portable fields",
       "Runtime extensions",
       "Tool schemas",
       "ಕಲಿತ skills"
      ],
      "correct": 1
     },
     {
      "q": "Does a perfectly parsing SKILL.md prove the package works?",
      "qKn": "ಸರಿಯಾಗಿ parse ಆಗುವ SKILL.md package ಕೆಲಸ ಮಾಡುತ್ತದೆ ಎಂದು ಸಾಬೀತುಪಡಿಸುತ್ತದೆಯೇ?",
      "opts": [
       "Yes",
       "No: it may reference files that were never shipped",
       "Yes if the name is short",
       "Only on Linux"
      ],
      "optsKn": [
       "ಹೌದು",
       "ಇಲ್ಲ: ಹಂಚದ ಫೈಲ್‌ಗಳನ್ನು ಉಲ್ಲೇಖಿಸಬಹುದು",
       "name ಚಿಕ್ಕದಾದರೆ ಹೌದು",
       "Linux ನಲ್ಲಿ ಮಾತ್ರ"
      ],
      "correct": 1
     }
    ]
   }
  }
 ]
};
