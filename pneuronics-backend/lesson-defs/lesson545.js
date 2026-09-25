module.exports = {
 "phaseId": "6a369d5e66020ed05b3214c3",
 "moduleId": "6a369d6066020ed05b321508",
 "order": 0,
 "type": "interactive",
 "duration": 45,
 "difficulty": "intermediate",
 "status": "published",
 "title": "Capstone: Stateless Tool Ecosystem (Part 1 of 3) — Boundaries, Stateless MCP Metadata, Discovery and Gateway Policy",
 "titleKn": "Capstone: Stateless Tool Ecosystem (Part 1 of 3) — Boundaries, Stateless MCP Metadata, Discovery ಮತ್ತು Gateway Policy",
 "desc": "Wire tools, stateless MCP, Tasks, authorization, A2A delegation, MCP Apps and tracing into one research-and-report workflow while keeping every boundary explicit. Build the first half of a protocol-shaped simulation and see what it does and does not prove.",
 "descKn": "tools, stateless MCP, Tasks, authorization, A2A, MCP Apps ಮತ್ತು tracing ಅನ್ನು ಒಂದು research-and-report ವರ್ಕ್‌ಫ್ಲೋಗೆ ಜೋಡಿಸಿ, ಪ್ರತಿ ಗಡಿಯನ್ನು ಸ್ಪಷ್ಟವಾಗಿ ಇರಿಸಿ. protocol-ಆಕಾರದ ಅನುಕರಣೆಯ ಮೊದಲ ಅರ್ಧ ನಿರ್ಮಿಸಿ.",
 "objectives": [
  "Explain the capstone as staged integration of explicit boundaries rather than \"everything works together\".",
  "Distinguish a protocol-shaped simulation from a protocol implementation.",
  "Build stateless MCP request metadata and a simulated server/discover, and explain why each request carries its own context.",
  "Separate discovery, authentication and authorization, and implement scope-based gateway policy with description pinning.",
  "Show that the Tasks capability must be advertised in the same request that may receive a task handle."
 ],
 "objectivesKn": [
  "capstone ಅನ್ನು ಸ್ಪಷ್ಟ ಗಡಿಗಳ ಹಂತ ಹಂತದ ಏಕೀಕರಣ ಎಂದು ವಿವರಿಸಿ.",
  "protocol-ಆಕಾರದ ಅನುಕರಣೆ ಮತ್ತು protocol ಅನುಷ್ಠಾನ ಪ್ರತ್ಯೇಕಿಸಿ.",
  "stateless MCP request metadata ಮತ್ತು server/discover ಅನುಕರಣೆ ನಿರ್ಮಿಸಿ.",
  "discovery, authentication, authorization ಬೇರ್ಪಡಿಸಿ; scope ಆಧಾರಿತ gateway policy ಅನುಷ್ಠಾನಿಸಿ.",
  "Tasks capability ಅನ್ನು ಅದೇ request ನಲ್ಲಿ ಘೋಷಿಸಬೇಕು ಎಂದು ತೋರಿಸಿ."
 ],
 "blocks": [
  {
   "type": "heading",
   "data": {
    "textEn": "Capstone: Stateless Tool Ecosystem (Part 1 of 3)",
    "textKn": "Capstone: Stateless Tool Ecosystem (Part 1 of 3)",
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
    "textEn": "What Are We Building?",
    "textKn": "ನಾವು ಏನು ನಿರ್ಮಿಸುತ್ತಿದ್ದೇವೆ?",
    "level": "H2"
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "One Request, Many Contracts",
    "headingKn": "ಒಂದು Request, ಹಲವು ಒಪ್ಪಂದಗಳು",
    "bodyEn": "A user asks: find papers about agent protocols, summarize them, and generate a report. That sounds like one operation but hides many contracts: model-facing tool schemas, stateless MCP request metadata, authorization, long-running operations, delegation, host-to-app communication, tracing and reusable procedures. The capstone tests whether you can connect them while keeping every boundary explicit.",
    "bodyKn": "ಬಳಕೆದಾರ ಕೇಳುತ್ತಾರೆ: ಏಜೆಂಟ್ protocols ಬಗ್ಗೆ papers ಹುಡುಕಿ, ಸಾರಾಂಶ ಮಾಡಿ, ವರದಿ ರಚಿಸಿ. ಇದು ಒಂದು ಕೆಲಸದಂತೆ ಕಂಡರೂ ಹಲವು ಒಪ್ಪಂದಗಳನ್ನು ಮರೆಮಾಡುತ್ತದೆ."
   }
  },
  {
   "type": "diagram",
   "data": {
    "titleEn": "The research-and-report ecosystem",
    "titleKn": "Research-and-report ecosystem",
    "contentEn": "User\n  |\n  v\nAgent / Orchestrator --> Authorization Gateway (actor + scope + tool)\n  |\n  v\nResearch MCP Server\n  |-- arxiv_search tool\n  |-- generate_report tool --> task handle --> tasks/get\n  |-- A2A SendMessage --> Writer Agent (opaque internals)\n  v\nui:// report resource\n\nTelemetry spans observe every boundary."
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
      "Capstone",
      "A staged integration whose simulated and live boundaries stay explicit"
     ],
     [
      "Protocol-shaped simulation",
      "Data and control flow that look like the protocol, without proving the wire protocol"
     ],
     [
      "Tasks extension",
      "A lifecycle for durable asynchronous work"
     ],
     [
      "Opacity boundary",
      "The caller sees the declared interface and artifacts, not private reasoning or state"
     ],
     [
      "Runtime adapter",
      "Host code mapping a portable procedure to discovery, invocation, tools, policy and context"
     ],
     [
      "Integration evidence",
      "A transcript, artifact or receiver-side observation proving the real boundary was crossed"
     ]
    ]
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "Protocol-Shaped Is Not Protocol-Compliant",
    "headingKn": "Protocol-ಆಕಾರ ≠ Protocol-ಅನುಸರಣೆ",
    "bodyEn": "A Python function returning a dictionary that resembles a server/discover result is not an MCP exchange. No client serialized a request, no transport carried it, no server answered. Protocol-shaped data is not protocol compliance. We simulate first because it lets us verify orchestration logic without HTTP, OAuth, SSE, timeouts, retries and exporters all failing at once.",
    "bodyKn": "server/discover ಫಲಿತಾಂಶದಂತೆ ಕಾಣುವ dictionary ಹಿಂತಿರುಗಿಸುವ Python function MCP ವಿನಿಮಯ ಅಲ್ಲ. ಮೊದಲು ಅನುಕರಿಸುವುದರಿಂದ orchestration ತರ್ಕವನ್ನು ಪರಿಶೀಲಿಸಬಹುದು."
   }
  },
  {
   "type": "heading",
   "data": {
    "textEn": "Stateless MCP: Context Travels With the Request",
    "textKn": "Stateless MCP: Context request ಜೊತೆ ಪ್ರಯಾಣಿಸುತ್ತದೆ",
    "level": "H2"
   }
  },
  {
   "type": "code",
   "data": {
    "filename": "capstone_lab.py",
    "headingEn": "Stateless request metadata and simulated server/discover",
    "headingKn": "Stateless request metadata ಮತ್ತು ಅನುಕರಿತ server/discover",
    "descEn": "In the stateless model the protocol version, the client capabilities and the client identity accompany every request in _meta instead of depending on an earlier initialization. server_discover() simulates server/discover with a direct call. Our own code, real output.",
    "descKn": "stateless ಮಾದರಿಯಲ್ಲಿ protocol version, client capabilities ಮತ್ತು client identity ಪ್ರತಿ request ಜೊತೆ _meta ನಲ್ಲಿ ಬರುತ್ತವೆ.",
    "code": "import hashlib, json, itertools\n\nPROTOCOL = \"2026-07-28\"\nTASKS_EXT = \"io.modelcontextprotocol/tasks\"\n\ndef request_meta(with_tasks=True):\n    caps = {\"extensions\": {TASKS_EXT: {}}} if with_tasks else {}\n    return {\"io.modelcontextprotocol/protocolVersion\": PROTOCOL,\n            \"io.modelcontextprotocol/clientCapabilities\": caps,\n            \"io.modelcontextprotocol/clientInfo\": {\"name\": \"capstone-client\", \"version\": \"1.0.0\"}}\n\nprint(json.dumps(request_meta(), indent=1))\nprint(json.dumps(server_discover(), indent=1))"
   }
  },
  {
   "type": "output",
   "data": {
    "output": "{\n \"io.modelcontextprotocol/protocolVersion\": \"2026-07-28\",\n \"io.modelcontextprotocol/clientCapabilities\": {\n  \"extensions\": {\n   \"io.modelcontextprotocol/tasks\": {}\n  }\n },\n \"io.modelcontextprotocol/clientInfo\": {\n  \"name\": \"capstone-client\",\n  \"version\": \"1.0.0\"\n }\n}\n{\n \"versions\": [\n  \"2026-07-28\"\n ],\n \"serverInfo\": {\n  \"name\": \"research-server\",\n  \"version\": \"1.0\"\n },\n \"capabilities\": {\n  \"tools\": {},\n  \"extensions\": {\n   \"io.modelcontextprotocol/tasks\": {}\n  }\n }\n}"
   }
  },
  {
   "type": "table",
   "data": {
    "headingEn": "What each metadata field answers",
    "headers": [
     "Field",
     "Question"
    ],
    "rows": [
     [
      "protocolVersion",
      "Which protocol revision should interpret this request?"
     ],
     [
      "clientCapabilities",
      "What can the client understand (for example the Tasks extension)?"
     ],
     [
      "clientInfo",
      "Which client implementation is calling?"
     ]
    ]
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "Discovery Is Not Authorization",
    "headingKn": "Discovery ≠ Authorization",
    "bodyEn": "Discovery answers \"what exists?\" and authorization answers \"may this actor use it?\". Seeing generate_report in the catalog says nothing about whether Alice or Bob may call it. Keep them as separate steps so that a listed tool is never mistaken for a permitted tool.",
    "bodyKn": "discovery \"ಏನಿದೆ?\" ಎಂದು ಉತ್ತರಿಸುತ್ತದೆ; authorization \"ಈ ನಟ ಬಳಸಬಹುದೇ?\" ಎಂದು. ಪಟ್ಟಿಯಲ್ಲಿರುವ tool ಅನ್ನು ಅನುಮತಿಸಿದ tool ಎಂದು ತಪ್ಪಾಗಿ ಭಾವಿಸಬೇಡಿ."
   }
  },
  {
   "type": "heading",
   "data": {
    "textEn": "Authentication, Then Authorization",
    "textKn": "Authentication, ನಂತರ Authorization",
    "level": "H2"
   }
  },
  {
   "type": "code",
   "data": {
    "filename": "capstone_lab.py",
    "headingEn": "Static catalog, description pinning, tokens and scope policy",
    "headingKn": "ಸ್ಥಿರ ಕ್ಯಾಟಲಾಗ್, description pinning, tokens ಮತ್ತು scope policy",
    "descEn": "TOKENS is a static dictionary standing in for OAuth. authenticate() only answers who you are. authorize() then checks that the tool description still matches its reviewed hash and that the actor holds the required scope. This is a teaching subset: real production needs an authorization server, audience and resource binding, RBAC, credential isolation and a sandbox.",
    "descKn": "TOKENS OAuth ಬದಲಿಗೆ ಸ್ಥಿರ dictionary. authenticate() ನೀವು ಯಾರು ಎಂದು ಮಾತ್ರ ಹೇಳುತ್ತದೆ. authorize() description hash ಮತ್ತು ಅಗತ್ಯ scope ಪರಿಶೀಲಿಸುತ್ತದೆ.",
    "code": "# ---- catalog + description pinning ----\nTOOLS = {\n    \"arxiv_search\": {\"description\": \"Search paper fixtures by query.\", \"scope\": \"research:read\"},\n    \"generate_report\": {\"description\": \"Generate a report from papers (long-running).\", \"scope\": \"report:write\"},\n}\ndef desc_hash(name): return hashlib.sha256(TOOLS[name][\"description\"].encode()).hexdigest()[:12]\nPINNED = {n: desc_hash(n) for n in TOOLS}\n\ndef server_discover():\n    return {\"versions\": [PROTOCOL], \"serverInfo\": {\"name\": \"research-server\", \"version\": \"1.0\"},\n            \"capabilities\": {\"tools\": {}, \"extensions\": {TASKS_EXT: {}}}}\n\n# ---- authentication (static, NOT OAuth) and authorization ----\nTOKENS = {\"token-a\": {\"actor\": \"alice\", \"scopes\": {\"research:read\", \"report:write\"}},\n          \"token-b\": {\"actor\": \"bob\", \"scopes\": {\"research:read\"}}}\ndef authenticate(token): return TOKENS.get(token)\ndef authorize(identity, tool):\n    if desc_hash(tool) != PINNED[tool]:\n        return False, \"description changed since review\"\n    need = TOOLS[tool][\"scope\"]\n    return (need in identity[\"scopes\"]), f\"needs scope {need}\""
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
    "headingEn": "Why Pin Tool Descriptions",
    "headingKn": "Tool descriptions ಅನ್ನು ಏಕೆ pin ಮಾಡಬೇಕು",
    "bodyEn": "A tool description is not just documentation: a malicious edit can steer model routing. Pinning a reviewed hash means a changed description fails authorization until it is reviewed again. Part 2 tampers with one description and shows the rejection.",
    "bodyKn": "tool description ಕೇವಲ ದಾಖಲೆ ಅಲ್ಲ: ದುರುದ್ದೇಶದ ಬದಲಾವಣೆ ಮಾದರಿಯ routing ಅನ್ನು ತಿರುಗಿಸಬಹುದು. Part 2 ಒಂದು description ಅನ್ನು ಬದಲಿಸಿ ತಿರಸ್ಕಾರ ತೋರಿಸುತ್ತದೆ."
   }
  },
  {
   "type": "heading",
   "data": {
    "textEn": "Why the Tasks Capability Must Be Advertised",
    "textKn": "Tasks capability ಏಕೆ ಘೋಷಿಸಬೇಕು",
    "level": "H2"
   }
  },
  {
   "type": "code",
   "data": {
    "filename": "capstone_lab.py",
    "headingEn": "generate_report without the Tasks capability",
    "headingKn": "Tasks capability ಇಲ್ಲದ generate_report",
    "descEn": "generate_report is long-running, so the server wants to answer with a task handle. It may only do that when the same request advertised the Tasks extension. Without it we return error -32021 carrying requiredCapabilities, as this lesson describes.",
    "descKn": "generate_report ದೀರ್ಘಕಾಲದ್ದು, ಆದ್ದರಿಂದ task handle ನೀಡಬಯಸುತ್ತದೆ. ಅದೇ request ನಲ್ಲಿ Tasks extension ಘೋಷಿಸಿದರೆ ಮಾತ್ರ ಸಾಧ್ಯ.",
    "code": "def call_tool(name, args, meta, trace, parent):\n    trace.span(f\"tools/call: {name}\", parent)\n    if name == \"arxiv_search\":\n        return {\"resultType\": \"complete\", \"content\": PAPERS}\n    if name == \"generate_report\":\n        if TASKS_EXT not in meta[\"io.modelcontextprotocol/clientCapabilities\"].get(\"extensions\", {}):\n            return {\"error\": {\"code\": -32021, \"requiredCapabilities\": [TASKS_EXT]}}\n        tid = f\"T{len(TASKS) + 1}\"\n        TASKS[tid] = {\"id\": tid, \"status\": \"completed\", \"final_result\": {\n            \"text\": f\"Report on {len(args['papers'])} papers\", \"resource\": f\"ui://report/{tid}\"}}\n        return {\"resultType\": \"task\", \"task\": {\"id\": tid}}\n\nprint(call_tool(\"generate_report\", {\"papers\": PAPERS}, request_meta(with_tasks=False), Trace(\"T\"), None))"
   }
  },
  {
   "type": "output",
   "data": {
    "output": "{'error': {'code': -32021, 'requiredCapabilities': ['io.modelcontextprotocol/tasks']}}"
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "Capability Negotiation at the Request Boundary",
    "headingKn": "Request ಗಡಿಯಲ್ಲಿ Capability ಮಾತುಕತೆ",
    "bodyEn": "The check happens on each request, not from remembered connection state. That is what stateless means: everything needed to interpret the request is inside it.",
    "bodyKn": "ಪ್ರತಿ request ನಲ್ಲೇ ಪರಿಶೀಲನೆ ನಡೆಯುತ್ತದೆ. stateless ಎಂದರೆ ಇದೇ."
   }
  },
  {
   "type": "heading",
   "data": {
    "textEn": "Integration Evidence Comes Later",
    "textKn": "Integration Evidence ನಂತರ",
    "level": "H2"
   }
  },
  {
   "type": "table",
   "data": {
    "headingEn": "What can a returned dictionary prove?",
    "headers": [
     "Observation",
     "Supports the claim"
    ],
    "rows": [
     [
      "server_discover() returned the expected data",
      "Local discovery logic behaves as expected"
     ],
     [
      "A local A2A span exists",
      "The delegation boundary was modelled"
     ],
     [
      "An in-memory span exists",
      "Local trace data was constructed"
     ],
     [
      "Collector shows the span (receiver side)",
      "Telemetry export actually worked"
     ]
    ]
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "Key Takeaways",
    "headingKn": "ಮುಖ್ಯ ಅಂಶಗಳು",
    "bodyEn": "• A capstone integrates boundaries and keeps simulated versus live explicit.\n• Protocol-shaped data is not protocol compliance.\n• Stateless MCP puts protocol version, client capabilities and client identity in each request.\n• Discovery, authentication and authorization are three separate steps.\n• We genuinely ran server_discover and saw the Tasks extension advertised, and we saw error -32021 when a request lacked the Tasks capability.",
    "bodyKn": "• capstone ಗಡಿಗಳನ್ನು ಸಂಯೋಜಿಸುತ್ತದೆ.\n• Protocol-ಆಕಾರ ≠ ಅನುಸರಣೆ.\n• Stateless MCP ಪ್ರತಿ request ನಲ್ಲಿ context ಹೊಂದಿದೆ.\n• Discovery, authentication, authorization ಮೂರು ಬೇರೆ ಹಂತಗಳು."
   }
  },
  {
   "type": "quiz",
   "data": {
    "questions": [
     {
      "q": "server_discover() returns a correct-looking dictionary. What has been proven?",
      "qKn": "server_discover() ಸರಿಯಾಗಿ ಕಾಣುವ dictionary ಹಿಂತಿರುಗಿಸುತ್ತದೆ. ಏನು ಸಾಬೀತಾಯಿತು?",
      "opts": [
       "Full MCP interoperability",
       "OAuth compatibility",
       "Local discovery logic behaves as expected",
       "A remote MCP server was contacted"
      ],
      "optsKn": [
       "ಪೂರ್ಣ MCP ಹೊಂದಾಣಿಕೆ",
       "OAuth ಹೊಂದಾಣಿಕೆ",
       "ಸ್ಥಳೀಯ discovery ತರ್ಕ ನಿರೀಕ್ಷೆಯಂತೆ",
       "ದೂರದ MCP server ಸಂಪರ್ಕಿಸಲಾಯಿತು"
      ],
      "correct": 2
     },
     {
      "q": "Why does each stateless MCP request carry _meta?",
      "qKn": "ಪ್ರತಿ stateless MCP request _meta ಏಕೆ ಹೊಂದಿದೆ?",
      "opts": [
       "To make JSON larger",
       "So interpretation does not depend on an earlier protocol session",
       "To replace tool schemas",
       "To store chain-of-thought"
      ],
      "optsKn": [
       "JSON ದೊಡ್ಡದಾಗಿಸಲು",
       "ವ್ಯಾಖ್ಯಾನ ಹಿಂದಿನ ಸೆಷನ್ ಮೇಲೆ ಅವಲಂಬಿಸದಿರಲು",
       "tool schemas ಬದಲಿಸಲು",
       "chain-of-thought ಸಂಗ್ರಹಿಸಲು"
      ],
      "correct": 1
     },
     {
      "q": "Discovery lists generate_report. Does that mean Bob may call it?",
      "qKn": "Discovery generate_report ಪಟ್ಟಿ ಮಾಡುತ್ತದೆ. Bob ಕರೆಯಬಹುದೇ?",
      "opts": [
       "Yes",
       "No: discovery says what exists; authorization decides who may use it"
      ],
      "optsKn": [
       "ಹೌದು",
       "ಇಲ್ಲ: discovery ಏನಿದೆ ಎನ್ನುತ್ತದೆ; authorization ಯಾರು ಬಳಸಬಹುದು ಎನ್ನುತ್ತದೆ"
      ],
      "correct": 1
     },
     {
      "q": "What did the run return when generate_report was called without the Tasks capability?",
      "qKn": "Tasks capability ಇಲ್ಲದೆ generate_report ಕರೆದಾಗ run ಏನು ಹಿಂತಿರುಗಿಸಿತು?",
      "opts": [
       "A task handle",
       "A final report",
       "Error -32021 with requiredCapabilities",
       "Nothing"
      ],
      "optsKn": [
       "task handle",
       "ಅಂತಿಮ ವರದಿ",
       "requiredCapabilities ಜೊತೆ error -32021",
       "ಏನೂ ಇಲ್ಲ"
      ],
      "correct": 2
     },
     {
      "q": "Why pin a hash of each tool description?",
      "qKn": "ಪ್ರತಿ tool description ನ hash ಏಕೆ pin ಮಾಡಬೇಕು?",
      "opts": [
       "Descriptions are decorative",
       "A changed description can steer model routing, so it should fail until re-reviewed",
       "To speed up search",
       "To replace scopes"
      ],
      "optsKn": [
       "descriptions ಅಲಂಕಾರ",
       "ಬದಲಾದ description ಮಾದರಿಯ routing ತಿರುಗಿಸಬಹುದು",
       "ಹುಡುಕಾಟ ವೇಗಕ್ಕೆ",
       "scopes ಬದಲಿಸಲು"
      ],
      "correct": 1
     }
    ]
   }
  }
 ]
};
