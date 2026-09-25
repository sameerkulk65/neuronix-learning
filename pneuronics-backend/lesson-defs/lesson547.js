module.exports = {
 "phaseId": "6a369d5e66020ed05b3214c3",
 "moduleId": "6a369d6066020ed05b321508",
 "order": 2,
 "type": "interactive",
 "duration": 50,
 "difficulty": "advanced",
 "status": "published",
 "title": "Capstone: Stateless Tool Ecosystem (Part 3 of 3) — Integration Evidence, Production Promotion and What a Green Run Proves",
 "titleKn": "Capstone: Stateless Tool Ecosystem (Part 3 of 3) — Integration Evidence, Production Promotion ಮತ್ತು ಹಸಿರು Run ಏನು ಸಾಬೀತುಪಡಿಸುತ್ತದೆ",
 "desc": "Decide what a local run actually proves and what each production boundary needs as evidence. Learn the evidence ladder, the simulation-to-production map, why skills cannot sandbox themselves, the eight-step promotion path and the test pyramid, using the results of our own simulation.",
 "descKn": "ಸ್ಥಳೀಯ run ವಾಸ್ತವವಾಗಿ ಏನು ಸಾಬೀತುಪಡಿಸುತ್ತದೆ ಮತ್ತು ಪ್ರತಿ production ಗಡಿಗೆ ಯಾವ ಸಾಕ್ಷ್ಯ ಬೇಕು ಎಂದು ನಿರ್ಧರಿಸಿ.",
 "objectives": [
  "Order the evidence ladder from \"function returned\" to \"receiver produced the expected artifact\".",
  "Explain why an in-memory span list is not exported telemetry and what receiver-side evidence would prove.",
  "Map every simulated layer to its production replacement and the evidence that replaces it.",
  "Explain why a skill is procedure, not transport, policy or a sandbox, and what a runtime adapter does.",
  "Describe staged promotion, one boundary at a time, and why lower-level policy tests must be kept."
 ],
 "objectivesKn": [
  "ಸಾಕ್ಷ್ಯದ ಏಣಿಯನ್ನು ಕ್ರಮವಾಗಿ ಹೇಳಿ.",
  "in-memory span ಪಟ್ಟಿ ರಫ್ತು ಮಾಡಿದ telemetry ಅಲ್ಲ ಎಂದು ವಿವರಿಸಿ.",
  "ಪ್ರತಿ ಅನುಕರಿತ ಪದರವನ್ನು production ಬದಲಿಗೆ ನಕ್ಷೆ ಮಾಡಿ.",
  "skill procedure ಎಂದು, transport ಅಲ್ಲ ಎಂದು ವಿವರಿಸಿ.",
  "ಹಂತ ಹಂತದ promotion ವಿವರಿಸಿ."
 ],
 "blocks": [
  {
   "type": "heading",
   "data": {
    "textEn": "Capstone: Stateless Tool Ecosystem (Part 3 of 3)",
    "textKn": "Capstone: Stateless Tool Ecosystem (Part 3 of 3)",
    "level": "H1"
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "Lesson Info",
    "headingKn": "Lesson ಮಾಹಿತಿ",
    "bodyEn": "• Type: Build · Language: Python (stdlib only) · Time: ~45 minutes. IMPORTANT: this is an in-process, protocol-shaped simulation. The source lesson describes its main.py but does not include the code, so the program below is our own teaching implementation. It opens no transport, contacts no arXiv, does no OAuth, calls no A2A server, renders no MCP App and exports no telemetry. Every output shown was produced by genuinely running it.",
    "bodyKn": "• Type: Build · Language: Python (stdlib only) · Time: ~45 ನಿಮಿಷಗಳು. ಗಮನಿಸಿ: ಇದು in-process, protocol-ಆಕಾರದ ಅನುಕರಣೆ. ಮೂಲ ಪಾಠ main.py ಕೋಡ್ ಒಳಗೊಂಡಿಲ್ಲ, ಆದ್ದರಿಂದ ಈ ಕಾರ್ಯಕ್ರಮ ನಮ್ಮದೇ ಬೋಧನಾ ಅನುಷ್ಠಾನ. ಇದು ಯಾವುದೇ transport, OAuth, A2A server, ಬ್ರೌಸರ್ ಅಥವಾ telemetry export ಮಾಡುವುದಿಲ್ಲ. ತೋರಿಸಿದ ಎಲ್ಲಾ outputs ನಿಜ run ಗಳಿಂದ."
   }
  },
  {
   "type": "heading",
   "data": {
    "textEn": "What Did the Program Actually Prove?",
    "textKn": "ಪ್ರೋಗ್ರಾಂ ವಾಸ್ತವವಾಗಿ ಏನು ಸಾಬೀತುಪಡಿಸಿತು?",
    "level": "H2"
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "A Green Run Validates the Simulation Only",
    "headingKn": "ಹಸಿರು Run ಅನುಕರಣೆಯನ್ನು ಮಾತ್ರ ಮಾನ್ಯಗೊಳಿಸುತ್ತದೆ",
    "bodyEn": "Discovery worked, Alice was authorized, Bob was denied, papers came back, the writer delegation completed, the report task completed, a ui:// resource was built and spans were recorded. Tempting conclusion: our production ecosystem works. The right conclusion is narrower, because everything ran in one Python process with no transport, no OAuth, no A2A server, no browser and no exporter.",
    "bodyKn": "ಎಲ್ಲವೂ ಕೆಲಸ ಮಾಡಿತು. ಆದರೆ ಎಲ್ಲವೂ ಒಂದು Python ಪ್ರಕ್ರಿಯೆಯಲ್ಲಿ ನಡೆಯಿತು: transport, OAuth, A2A server, ಬ್ರೌಸರ್, exporter ಇಲ್ಲ. ಸರಿಯಾದ ತೀರ್ಮಾನ ಕಿರಿದು."
   }
  },
  {
   "type": "code",
   "data": {
    "filename": "capstone_lab.py",
    "headingEn": "State exactly what this run supports",
    "headingKn": "ಈ run ಏನನ್ನು ಬೆಂಬಲಿಸುತ್ತದೆ ಎಂದು ನಿಖರವಾಗಿ ಹೇಳಿ",
    "descEn": "The lab ends by printing the claims a local run can and cannot support. Only local orchestration is supported; every wire-level claim is marked NOT proven. This is not a defect in the lesson; it is the lesson.",
    "descKn": "ಸ್ಥಳೀಯ run ಬೆಂಬಲಿಸುವ ಮತ್ತು ಬೆಂಬಲಿಸದ ಹೇಳಿಕೆಗಳನ್ನು lab ಮುದ್ರಿಸುತ್ತದೆ. ಸ್ಥಳೀಯ orchestration ಮಾತ್ರ ಬೆಂಬಲಿತ.",
    "code": "claims = {\"local orchestration\": True, \"MCP transport interoperability\": False, \"OAuth exchange\": False,\n          \"A2A network interoperability\": False, \"collector ingestion\": False, \"browser rendering\": False, \"sandbox isolation\": False}\nfor k, v in claims.items():\n    print(f\"  {k}: {'supported by this run' if v else 'NOT proven'}\")"
   }
  },
  {
   "type": "output",
   "data": {
    "output": "local orchestration: supported by this run\n  MCP transport interoperability: NOT proven\n  OAuth exchange: NOT proven\n  A2A network interoperability: NOT proven\n  collector ingestion: NOT proven\n  browser rendering: NOT proven\n  sandbox isolation: NOT proven"
   }
  },
  {
   "type": "heading",
   "data": {
    "textEn": "The Evidence Ladder",
    "textKn": "ಸಾಕ್ಷ್ಯದ ಏಣಿ",
    "level": "H2"
   }
  },
  {
   "type": "table",
   "data": {
    "headingEn": "Stronger claims need stronger evidence",
    "headers": [
     "Level",
     "Evidence",
     "Supports"
    ],
    "rows": [
     [
      "1",
      "A function returned",
      "Something happened in our program"
     ],
     [
      "2",
      "A local assertion passed",
      "Local logic behaves as expected"
     ],
     [
      "3",
      "A serialized request was observed",
      "The request was shaped correctly"
     ],
     [
      "4",
      "A real transport was crossed",
      "The bytes actually travelled"
     ],
     [
      "5",
      "The receiver observed the request",
      "The other side really got it"
     ],
     [
      "6",
      "The receiver produced the expected artifact",
      "The boundary works end to end"
     ]
    ]
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "Sender-Side Assertions Are Weak",
    "headingKn": "ಕಳುಹಿಸುವವರ ಬದಿಯ ಹೇಳಿಕೆಗಳು ದುರ್ಬಲ",
    "bodyEn": "\"Trace exported successfully\" printed by the sender does not prove a collector received it. \"Called the A2A writer\" does not prove an A2A server saw a SendMessage. Real evidence pairs the client transcript with a receiver-side observation.",
    "bodyKn": "ಕಳುಹಿಸುವವರು \"ರಫ್ತು ಯಶಸ್ವಿ\" ಎಂದು ಮುದ್ರಿಸಿದರೆ collector ಸ್ವೀಕರಿಸಿತು ಎಂದು ಅರ್ಥವಲ್ಲ. ಸ್ವೀಕರಿಸುವ ಬದಿಯ ವೀಕ್ಷಣೆ ಬೇಕು."
   }
  },
  {
   "type": "heading",
   "data": {
    "textEn": "Simulation to Production",
    "textKn": "Simulation ಇಂದ Production ಗೆ",
    "level": "H2"
   }
  },
  {
   "type": "table",
   "data": {
    "headingEn": "The handoff map",
    "headers": [
     "Layer",
     "Local capstone",
     "Production replacement",
     "Evidence that replaces it"
    ],
    "rows": [
     [
      "Discovery",
      "server_discover() + static TOOLS",
      "server/discover + tools/list",
      "Real request/response transcript, schema validation"
     ],
     [
      "Authentication",
      "Token dictionary",
      "OAuth with resource validation",
      "Valid allowed; wrong audience, expired and missing-scope denied"
     ],
     [
      "Authorization",
      "Scope membership",
      "Gateway bound to actor, tool, target and tenant",
      "Allow and deny audit cases"
     ],
     [
      "Search",
      "Static fixtures",
      "Search API or MCP server",
      "Source provenance, ranking, errors"
     ],
     [
      "Tasks",
      "Local handle and dict",
      "Durable task store: get, update, cancel, TTL, restart recovery",
      "State-transition, input, cancellation, recovery tests"
     ],
     [
      "Delegation",
      "Nested A2A-shaped span",
      "A2A client + Agent Card + SendMessage",
      "Contract, timeout, retry and opacity tests"
     ],
     [
      "App",
      "HTML string + ui://",
      "MCP App SDK + app.callServerTool",
      "CSP, permission, tool-call and browser tests"
     ],
     [
      "Telemetry",
      "Span dictionaries",
      "OTel SDK, exporter, collector",
      "Receiver-side trace arrival and parentage assertions"
     ],
     [
      "Sandbox",
      "None",
      "Host-enforced isolation",
      "Filesystem, process, network and credential limit tests"
     ]
    ]
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "Durability Is What a Task Dictionary Lacks",
    "headingKn": "Task dictionary ಗೆ ಇಲ್ಲದ್ದು durability",
    "bodyEn": "If a server crashes and restarts, a local dictionary loses the task, while a durable implementation defines recovery behaviour. Production Tasks also need input_required with tasks/update, cancellation, TTL expiry and timeouts. A task-shaped dictionary is not the Tasks extension.",
    "bodyKn": "server ಕ್ರ್ಯಾಶ್ ಆಗಿ ಮರುಪ್ರಾರಂಭವಾದರೆ local dictionary task ಕಳೆದುಕೊಳ್ಳುತ್ತದೆ. ಉತ್ಪಾದನೆಯಲ್ಲಿ durable store ಬೇಕು."
   }
  },
  {
   "type": "heading",
   "data": {
    "textEn": "Skills Are Procedure, Not Transport",
    "textKn": "Skills Procedure, Transport ಅಲ್ಲ",
    "level": "H2"
   }
  },
  {
   "type": "diagram",
   "data": {
    "titleEn": "Keep the roles separate",
    "titleKn": "ಪಾತ್ರಗಳನ್ನು ಬೇರ್ಪಡಿಸಿ",
    "contentEn": "Repository instructions   (rules of this environment)\n        |\nAgent Skill              (portable procedure)\n        |\nHost runtime: invocation policy, permission policy, context\n        |\n   MCP adapter        A2A adapter     <- runtime adapters\n        |                 |\n        +--------+--------+\n                 v\n        sandboxed executor"
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "A Skill Cannot Sandbox Itself",
    "headingKn": "Skill ತನ್ನನ್ನು ತಾನೇ sandbox ಮಾಡಲಾರದು",
    "bodyEn": "A skill line saying \"do not access files outside /workspace\" is an instruction. A sandbox is the runtime actually preventing access outside /workspace. The runtime adapter is what turns \"search for papers\" into a real call: which server, which credentials, which permissions, which context, which transport. Procedure is not enforcement.",
    "bodyKn": "\"/workspace ಹೊರಗೆ ಫೈಲ್ ಪ್ರವೇಶಿಸಬೇಡಿ\" ಒಂದು ಸೂಚನೆ. sandbox ಎಂದರೆ runtime ಅದನ್ನು ವಾಸ್ತವವಾಗಿ ತಡೆಯುವುದು."
   }
  },
  {
   "type": "heading",
   "data": {
    "textEn": "Promote One Boundary at a Time",
    "textKn": "ಒಂದು ಗಡಿಯನ್ನು ಒಮ್ಮೆ ಪ್ರಚಾರ ಮಾಡಿ",
    "level": "H2"
   }
  },
  {
   "type": "table",
   "data": {
    "headingEn": "The eight-step production path",
    "headers": [
     "Step",
     "Promote",
     "Then prove"
    ],
    "rows": [
     [
      "1",
      "Real server/discover and tools/list",
      "Wire transcript"
     ],
     [
      "2",
      "Authorization server and protected-resource validation",
      "Allow and deny cases"
     ],
     [
      "3",
      "Real Tasks: get, update, cancel, timeout, TTL, restart recovery",
      "State and recovery tests"
     ],
     [
      "4",
      "Real A2A client, Agent Card, message sending",
      "Contract, timeout, opacity tests"
     ],
     [
      "5",
      "Official MCP App SDK and app.callServerTool",
      "Browser, CSP and permission tests"
     ],
     [
      "6",
      "OTel export to a test collector",
      "Receiver-side parentage assertions"
     ],
     [
      "7",
      "Sandboxed tool and script execution",
      "Isolation tests"
     ],
     [
      "8",
      "Complete directory skill bundle and release gate",
      "Release evidence"
     ]
    ]
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "Replace One, Test One, Keep the Rest",
    "headingKn": "ಒಂದನ್ನು ಬದಲಿಸಿ, ಒಂದನ್ನು ಪರೀಕ್ಷಿಸಿ, ಉಳಿದದ್ದನ್ನು ಇರಿಸಿ",
    "bodyEn": "Replace everything at once and a failure could be OAuth, serialization, a tool schema, A2A, task recovery, the collector or browser CSP: too many variables. Swap one boundary, add an integration test that proves it was crossed, and keep the earlier policy tests. Real OAuth does not make the local authorization-policy tests obsolete, and real A2A does not make delegation contract tests obsolete.",
    "bodyKn": "ಎಲ್ಲವನ್ನೂ ಒಮ್ಮೆ ಬದಲಿಸಿದರೆ ವೈಫಲ್ಯ ಎಲ್ಲಿ ಎಂದು ತಿಳಿಯುವುದಿಲ್ಲ. ಒಂದು ಗಡಿ ಬದಲಿಸಿ, ಸಾಕ್ಷ್ಯ ಪರೀಕ್ಷಿಸಿ, ಹಳೆಯ policy ಪರೀಕ್ಷೆಗಳನ್ನು ಇರಿಸಿ."
   }
  },
  {
   "type": "diagram",
   "data": {
    "titleEn": "Test pyramid",
    "titleKn": "ಪರೀಕ್ಷಾ ಪಿರಮಿಡ್",
    "contentEn": "        /\\\n       /E2E\\\n      /------\\\n     /Integration\\    <- one per promoted boundary\n    /------------\\\n   / Policy / unit \\   <- keep these after promotion\n  /----------------\\"
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "Course Catalog Metadata Is an Adapter",
    "headingKn": "Course catalog metadata ಒಂದು adapter",
    "bodyEn": "The lesson notes its flat course artifact keeps version, phase, lesson and tags as top-level keys because the course's minimal frontmatter parser reads only top-level keys; nesting them under metadata would leave them empty. A portable skill may have an optional string-valued metadata map, but that does not make the portable schema interchangeable with this repository's catalog format. Portable contract is not the local adapter.",
    "bodyKn": "ಈ course ನ minimal parser top-level keys ಮಾತ್ರ ಓದುತ್ತದೆ. portable contract ≠ ಸ್ಥಳೀಯ adapter."
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "Key Takeaways",
    "headingKn": "ಮುಖ್ಯ ಅಂಶಗಳು",
    "bodyEn": "• Our run supported local orchestration only; MCP transport, OAuth, A2A network, collector ingestion, browser rendering and sandboxing were all marked NOT proven.\n• Evidence has levels; the strongest pairs a client transcript with a receiver-side observation and the expected artifact.\n• An in-memory span list is not exported telemetry, and a task dictionary is not a durable Tasks store.\n• Skills are procedure; runtime adapters, policy and sandboxes do the enforcing.\n• Promote one boundary at a time, add an integration test for each, and keep the lower-level policy tests.",
    "bodyKn": "• ನಮ್ಮ run ಸ್ಥಳೀಯ orchestration ಮಾತ್ರ ಬೆಂಬಲಿಸಿತು.\n• ಸಾಕ್ಷ್ಯಕ್ಕೆ ಹಂತಗಳಿವೆ.\n• in-memory span ಪಟ್ಟಿ ರಫ್ತು ಮಾಡಿದ telemetry ಅಲ್ಲ.\n• skills procedure; adapters ಜಾರಿಗೊಳಿಸುತ್ತವೆ.\n• ಒಂದೊಂದು ಗಡಿ ಪ್ರಚಾರ ಮಾಡಿ."
   }
  },
  {
   "type": "quiz",
   "data": {
    "questions": [
     {
      "q": "A local program records an A2A SendMessage span. What does that alone prove?",
      "qKn": "ಸ್ಥಳೀಯ ಪ್ರೋಗ್ರಾಂ A2A SendMessage span ದಾಖಲಿಸುತ್ತದೆ. ಅದು ಮಾತ್ರ ಏನು ಸಾಬೀತುಪಡಿಸುತ್ತದೆ?",
      "opts": [
       "A remote A2A server received the request",
       "The local simulation recorded that delegation boundary",
       "OAuth succeeded",
       "The writer's private execution was inspected"
      ],
      "optsKn": [
       "ದೂರದ A2A server ಸ್ವೀಕರಿಸಿತು",
       "ಸ್ಥಳೀಯ ಅನುಕರಣೆ ಆ ಗಡಿ ದಾಖಲಿಸಿತು",
       "OAuth ಯಶಸ್ವಿ",
       "writer ನ ಖಾಸಗಿ execution ಪರಿಶೀಲಿಸಲಾಯಿತು"
      ],
      "correct": 1
     },
     {
      "q": "Which evidence is strongest for telemetry integration?",
      "qKn": "telemetry ಏಕೀಕರಣಕ್ಕೆ ಯಾವ ಸಾಕ್ಷ್ಯ ಬಲಿಷ್ಠ?",
      "opts": [
       "export() was called",
       "A collector received the span with correct parentage",
       "A list of spans exists",
       "The trace id is shared"
      ],
      "optsKn": [
       "export() ಕರೆಯಲಾಯಿತು",
       "collector ಸರಿಯಾದ parentage ಜೊತೆ span ಸ್ವೀಕರಿಸಿತು",
       "spans ಪಟ್ಟಿ ಇದೆ",
       "trace id ಹಂಚಲಾಗಿದೆ"
      ],
      "correct": 1
     },
     {
      "q": "Why promote one boundary at a time?",
      "qKn": "ಒಂದು ಗಡಿಯನ್ನು ಒಮ್ಮೆ ಏಕೆ ಪ್ರಚಾರ ಮಾಡಬೇಕು?",
      "opts": [
       "It is slower and therefore safer by definition",
       "When one thing changes, a failure can be attributed to that boundary",
       "Skills require it",
       "It removes the need for tests"
      ],
      "optsKn": [
       "ಅದು ನಿಧಾನ",
       "ಒಂದು ಬದಲಾದಾಗ ವೈಫಲ್ಯವನ್ನು ಆ ಗಡಿಗೆ ಆರೋಪಿಸಬಹುದು",
       "skills ಗೆ ಅಗತ್ಯ",
       "ಪರೀಕ್ಷೆ ಬೇಕಿಲ್ಲ"
      ],
      "correct": 1
     },
     {
      "q": "A skill says \"do not read files outside /workspace\". What is that?",
      "qKn": "\"/workspace ಹೊರಗೆ ಫೈಲ್ ಓದಬೇಡಿ\" ಎಂದು skill ಹೇಳುತ್ತದೆ. ಇದು ಏನು?",
      "opts": [
       "A sandbox",
       "An instruction, not enforcement",
       "An OAuth scope",
       "A trace span"
      ],
      "optsKn": [
       "sandbox",
       "ಸೂಚನೆ, ಜಾರಿಗೊಳಿಸುವಿಕೆ ಅಲ್ಲ",
       "OAuth scope",
       "trace span"
      ],
      "correct": 1
     },
     {
      "q": "After real OAuth is added, what should happen to the local authorization-policy tests?",
      "qKn": "ನಿಜ OAuth ಸೇರಿಸಿದ ನಂತರ ಸ್ಥಳೀಯ authorization-policy ಪರೀಕ್ಷೆಗಳಿಗೆ ಏನಾಗಬೇಕು?",
      "opts": [
       "Delete them",
       "Keep them and add an integration test for the new boundary",
       "Only run them in production",
       "Replace them with prompts"
      ],
      "optsKn": [
       "ಅಳಿಸಿ",
       "ಉಳಿಸಿ ಮತ್ತು ಹೊಸ ಗಡಿಗೆ integration test ಸೇರಿಸಿ",
       "production ನಲ್ಲಿ ಮಾತ್ರ ಚಲಾಯಿಸಿ",
       "prompts ನಿಂದ ಬದಲಿಸಿ"
      ],
      "correct": 1
     }
    ]
   }
  }
 ]
};
