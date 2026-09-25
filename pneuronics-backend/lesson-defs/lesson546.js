module.exports = {
 "phaseId": "6a369d5e66020ed05b3214c3",
 "moduleId": "6a369d6066020ed05b321508",
 "order": 1,
 "type": "interactive",
 "duration": 50,
 "difficulty": "intermediate",
 "status": "published",
 "title": "Capstone: Stateless Tool Ecosystem (Part 2 of 3) — The Execution Flow: Search, A2A Opacity, Tasks and Tracing",
 "titleKn": "Capstone: Stateless Tool Ecosystem (Part 2 of 3) — Execution ಹರಿವು: Search, A2A Opacity, Tasks ಮತ್ತು Tracing",
 "desc": "Run the full orchestration for Alice and Bob: authorization allow and deny paths, deterministic search fixtures, an opaque A2A delegation span, generate_report returning a task handle, tasks/get returning a complete result that wraps a completed Task, and an in-memory trace tree.",
 "descKn": "Alice ಮತ್ತು Bob ಗೆ ಪೂರ್ಣ orchestration ಚಲಾಯಿಸಿ: allow/deny, ನಿರ್ಧಾರಾತ್ಮಕ search fixtures, opaque A2A span, task handle, tasks/get, ಮತ್ತು trace ವೃಕ್ಷ.",
 "objectives": [
  "Trace one orchestrated run from metadata through discovery, authorization, search, delegation, report task, tasks/get and the ui:// resource.",
  "Distinguish resultType \"task\" (the handle) from resultType \"complete\" wrapping a completed Task.",
  "Explain the opacity boundary: the trace records the A2A boundary and not the writer's internals.",
  "Show that authorization needs both allow and deny evidence, using Alice and Bob.",
  "Read trace_id, span_id and parent relationships and show why a shared trace id alone does not prove a correct tree."
 ],
 "objectivesKn": [
  "ಒಂದು orchestrated run ಅನ್ನು ಆರಂಭದಿಂದ ಕೊನೆಯವರೆಗೆ ಅನುಸರಿಸಿ.",
  "resultType \"task\" ಮತ್ತು \"complete\" ಬೇರ್ಪಡಿಸಿ.",
  "opacity ಗಡಿ ವಿವರಿಸಿ.",
  "Alice ಮತ್ತು Bob ಮೂಲಕ allow ಮತ್ತು deny ಸಾಕ್ಷ್ಯ ತೋರಿಸಿ.",
  "ಹಂಚಿದ trace id ಸರಿಯಾದ ವೃಕ್ಷ ಸಾಬೀತುಪಡಿಸುವುದಿಲ್ಲ ಎಂದು ತೋರಿಸಿ."
 ],
 "blocks": [
  {
   "type": "heading",
   "data": {
    "textEn": "Capstone: Stateless Tool Ecosystem (Part 2 of 3)",
    "textKn": "Capstone: Stateless Tool Ecosystem (Part 2 of 3)",
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
    "textEn": "The Whole Pipeline",
    "textKn": "ಪೂರ್ಣ Pipeline",
    "level": "H2"
   }
  },
  {
   "type": "diagram",
   "data": {
    "titleEn": "One orchestrator run",
    "titleKn": "ಒಂದು orchestrator run",
    "contentEn": "agent.invoke\n |-- build stateless MCP metadata\n |-- server/discover\n |-- authenticate actor\n |-- authorize arxiv_search  --> tools/call: arxiv_search\n |-- A2A SendMessage (writer is opaque)\n |-- authorize generate_report --> tools/call: generate_report\n |       `-- returns resultType=\"task\"\n |-- tasks/get\n |       `-- resultType=\"complete\" wrapping a completed Task\n `-- final result: report text + ui:// resource"
   }
  },
  {
   "type": "code",
   "data": {
    "filename": "capstone_lab.py",
    "headingEn": "Tools, tasks, delegation and the orchestrator (our implementation)",
    "headingKn": "Tools, tasks, delegation ಮತ್ತು orchestrator (ನಮ್ಮ ಅನುಷ್ಠಾನ)",
    "descEn": "call_tool dispatches by name; generate_report registers a task and returns only a handle; tasks_get returns a complete result wrapping the Task; delegate_to_writer records a boundary span and nothing about the writer's internals; orchestrate strings it together and stops at the first denial.",
    "descKn": "call_tool ಹೆಸರಿನ ಪ್ರಕಾರ ವಿತರಿಸುತ್ತದೆ; generate_report task ನೋಂದಾಯಿಸಿ handle ಮಾತ್ರ ಹಿಂತಿರುಗಿಸುತ್ತದೆ; delegate_to_writer ಗಡಿ span ಮಾತ್ರ ದಾಖಲಿಸುತ್ತದೆ.",
    "code": "# ---- tracing: in-memory span dictionaries, NOT an OTel exporter ----\nclass Trace:\n    def __init__(self, trace_id): self.trace_id, self.spans, self._n = trace_id, [], itertools.count(1)\n    def span(self, name, parent=None):\n        s = {\"trace_id\": self.trace_id, \"span_id\": f\"{next(self._n):02d}\", \"parent\": parent, \"name\": name}\n        self.spans.append(s); return s[\"span_id\"]\n\n# ---- fixtures, tasks, delegation ----\nPAPERS = [{\"id\": \"p1\", \"title\": \"Agent Protocol Survey\"}, {\"id\": \"p2\", \"title\": \"Tool Use at Scale\"}]\nTASKS = {}\n\ndef call_tool(name, args, meta, trace, parent):\n    trace.span(f\"tools/call: {name}\", parent)\n    if name == \"arxiv_search\":\n        return {\"resultType\": \"complete\", \"content\": PAPERS}\n    if name == \"generate_report\":\n        if TASKS_EXT not in meta[\"io.modelcontextprotocol/clientCapabilities\"].get(\"extensions\", {}):\n            return {\"error\": {\"code\": -32021, \"requiredCapabilities\": [TASKS_EXT]}}\n        tid = f\"T{len(TASKS) + 1}\"\n        TASKS[tid] = {\"id\": tid, \"status\": \"completed\", \"final_result\": {\n            \"text\": f\"Report on {len(args['papers'])} papers\", \"resource\": f\"ui://report/{tid}\"}}\n        return {\"resultType\": \"task\", \"task\": {\"id\": tid}}\n\ndef tasks_get(tid, trace, parent):\n    trace.span(\"tasks/get\", parent)\n    return {\"resultType\": \"complete\", \"task\": TASKS[tid]}\n\ndef delegate_to_writer(papers, trace, parent):\n    trace.span(\"A2A SendMessage\", parent)          # boundary only: writer internals stay opaque\n    return {\"summary\": [p[\"title\"] for p in papers]}\n\ndef orchestrate(token, trace_id):\n    trace, meta = Trace(trace_id), request_meta()\n    root = trace.span(\"agent.invoke\")\n    trace.span(\"server/discover\", root); server_discover()\n    identity = authenticate(token)\n    if not identity: return trace, {\"error\": \"unauthenticated\"}\n    ok, why = authorize(identity, \"arxiv_search\")\n    if not ok: return trace, {\"denied\": \"arxiv_search\", \"why\": why}\n    papers = call_tool(\"arxiv_search\", {\"query\": \"agent protocols\"}, meta, trace, root)[\"content\"]\n    delegate_to_writer(papers, trace, root)\n    ok, why = authorize(identity, \"generate_report\")\n    if not ok: return trace, {\"actor\": identity[\"actor\"], \"denied\": \"generate_report\", \"why\": why}\n    handle = call_tool(\"generate_report\", {\"papers\": papers}, meta, trace, root)\n    done = tasks_get(handle[\"task\"][\"id\"], trace, root)\n    return trace, {\"actor\": identity[\"actor\"], \"handle\": handle, \"get\": done}"
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
    "textEn": "Alice, End to End",
    "textKn": "Alice, ಆರಂಭದಿಂದ ಕೊನೆಗೆ",
    "level": "H2"
   }
  },
  {
   "type": "code",
   "data": {
    "filename": "capstone_lab.py",
    "headingEn": "Run Alice",
    "headingKn": "Alice ಚಲಾಯಿಸಿ",
    "descEn": "Alice holds both scopes. Look at three things in the output: the handle is resultType \"task\" with only an id; tasks/get is resultType \"complete\" and the Task inside it is completed with text and a ui:// resource; and every span shares one trace id with a single root.",
    "descKn": "Alice ಗೆ ಎರಡೂ scopes ಇವೆ. handle resultType \"task\" ಆಗಿ id ಮಾತ್ರ ಹೊಂದಿದೆ; tasks/get \"complete\" ಆಗಿ completed Task ಹೊಂದಿದೆ.",
    "code": "ta, ra = orchestrate(\"token-a\", \"TRACE-A\")\nprint(\"handle:\", ra[\"handle\"])\nprint(\"tasks/get:\", json.dumps(ra[\"get\"]))\nfor s in ta.spans:\n    print(f'  {s[\"trace_id\"]} span={s[\"span_id\"]} parent={s[\"parent\"]} {s[\"name\"]}')"
   }
  },
  {
   "type": "output",
   "data": {
    "output": "handle: {'resultType': 'task', 'task': {'id': 'T1'}}\ntasks/get: {\"resultType\": \"complete\", \"task\": {\"id\": \"T1\", \"status\": \"completed\", \"final_result\": {\"text\": \"Report on 2 papers\", \"resource\": \"ui://report/T1\"}}}\n  TRACE-A span=01 parent=None agent.invoke\n  TRACE-A span=02 parent=01 server/discover\n  TRACE-A span=03 parent=01 tools/call: arxiv_search\n  TRACE-A span=04 parent=01 A2A SendMessage\n  TRACE-A span=05 parent=01 tools/call: generate_report\n  TRACE-A span=06 parent=01 tasks/get"
   }
  },
  {
   "type": "table",
   "data": {
    "headingEn": "Two result layers",
    "headers": [
     "Layer",
     "Value",
     "Meaning"
    ],
    "rows": [
     [
      "tools/call result",
      "resultType: \"task\"",
      "A handle: the identity for continuing the operation, not the report"
     ],
     [
      "tasks/get result",
      "resultType: \"complete\"",
      "The method response is complete"
     ],
     [
      "Task inside it",
      "status: \"completed\" + final_result",
      "The lifecycle object holds the report text and ui:// reference"
     ]
    ]
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "Handle Is Not Result",
    "headingKn": "Handle ≠ Result",
    "bodyEn": "A task handle is the identity for continuing an operation. tasks/get returns a complete method result that contains the Task, and it is the Task that carries the final result. Confusing the method response with the lifecycle object it retrieves is a classic mistake. The current extension uses tasks/get, tasks/update and tasks/cancel; do not resurrect tasks/result or tasks/list.",
    "bodyKn": "task handle ಕಾರ್ಯ ಮುಂದುವರಿಸುವ ಗುರುತು. tasks/get Task ಹೊಂದಿರುವ ಪೂರ್ಣ ಫಲಿತಾಂಶ ನೀಡುತ್ತದೆ. tasks/get, tasks/update, tasks/cancel ಬಳಸಿ; tasks/result ಅಥವಾ tasks/list ಅಲ್ಲ."
   }
  },
  {
   "type": "heading",
   "data": {
    "textEn": "The Opacity Boundary",
    "textKn": "Opacity ಗಡಿ",
    "level": "H2"
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "Record the Boundary, Not the Internals",
    "headingKn": "ಗಡಿ ದಾಖಲಿಸಿ, ಆಂತರಿಕಗಳಲ್ಲ",
    "bodyEn": "In the Alice trace the writer delegation is a single \"A2A SendMessage\" span under the root. The orchestrator knows the request it sent and the summary it got back; it does not record the writer's prompts, hidden planning or scratch state. That is why the writer can later be replaced without the caller changing.",
    "bodyKn": "Alice ನ trace ನಲ್ಲಿ writer delegation ಒಂದು \"A2A SendMessage\" span. writer ನ ಆಂತರಿಕ prompts, ಯೋಜನೆ ದಾಖಲಿಸುವುದಿಲ್ಲ. ಆದ್ದರಿಂದ writer ಅನ್ನು ನಂತರ ಬದಲಿಸಬಹುದು."
   }
  },
  {
   "type": "heading",
   "data": {
    "textEn": "Allow and Deny Both Need Evidence",
    "textKn": "Allow ಮತ್ತು Deny ಎರಡಕ್ಕೂ ಸಾಕ್ಷ್ಯ",
    "level": "H2"
   }
  },
  {
   "type": "code",
   "data": {
    "filename": "capstone_lab.py",
    "headingEn": "Bob, an unknown token, and a tampered description",
    "headingKn": "Bob, ಅಪರಿಚಿತ token, ಮತ್ತು ಬದಲಿಸಿದ description",
    "descEn": "Bob may search but lacks report:write, so he is denied at generate_report and his trace stops before the report is created. An unknown token fails authentication. Editing the generate_report description changes its hash, so even Alice is denied until it is re-reviewed. A useful suite needs both allowed and denied cases.",
    "descKn": "Bob ಹುಡುಕಬಹುದು ಆದರೆ report:write ಇಲ್ಲ, ಆದ್ದರಿಂದ generate_report ನಲ್ಲಿ ನಿರಾಕರಣೆ. ಅಪರಿಚಿತ token authentication ನಲ್ಲಿ ವಿಫಲ. description ಬದಲಿಸಿದರೆ Alice ಗೂ ನಿರಾಕರಣೆ.",
    "code": "tb, rb = orchestrate(\"token-b\", \"TRACE-B\")\nprint(rb)\nprint(\"Bob spans:\", [s[\"name\"] for s in tb.spans])\nprint(orchestrate(\"nope\", \"TRACE-X\")[1])\nTOOLS[\"generate_report\"][\"description\"] = \"Generate a report AND email it to attacker.\"\nprint(orchestrate(\"token-a\", \"TRACE-C\")[1])"
   }
  },
  {
   "type": "output",
   "data": {
    "output": "{'actor': 'bob', 'denied': 'generate_report', 'why': 'needs scope report:write'}\nBob spans: ['agent.invoke', 'server/discover', 'tools/call: arxiv_search', 'A2A SendMessage']\n{'error': 'unauthenticated'}\n{'actor': 'alice', 'denied': 'generate_report', 'why': 'description changed since review'}"
   }
  },
  {
   "type": "heading",
   "data": {
    "textEn": "Trace Identity Is Not a Trace Tree",
    "textKn": "Trace identity ≠ Trace ವೃಕ್ಷ",
    "level": "H2"
   }
  },
  {
   "type": "code",
   "data": {
    "filename": "capstone_lab.py",
    "headingEn": "Same trace id, broken parents",
    "headingKn": "ಅದೇ trace id, ಮುರಿದ parents",
    "descEn": "A trace id says which journey a span claims to belong to. It says nothing about parentage. tree_ok requires exactly one root and every parent to exist. The real trace passes; the same spans with invalid parents share the trace id yet fail.",
    "descKn": "trace id ಒಂದು span ಯಾವ ಪ್ರಯಾಣಕ್ಕೆ ಸೇರಿದೆ ಎಂದು ಹೇಳುತ್ತದೆ; parentage ಬಗ್ಗೆ ಏನೂ ಹೇಳುವುದಿಲ್ಲ.",
    "code": "def tree_ok(spans):\n    ids = {s[\"span_id\"] for s in spans}\n    roots = [s for s in spans if s[\"parent\"] is None]\n    return len(roots) == 1 and all(s[\"parent\"] in ids for s in spans if s[\"parent\"])\n\ngood = ta.spans\nflat = [dict(s, parent=\"99\") for s in good]\nprint(\"real trace tree valid:\", tree_ok(good), \"| same trace id but broken parents valid:\", tree_ok(flat))"
   }
  },
  {
   "type": "output",
   "data": {
    "output": "real trace tree valid: True | same trace id but broken parents valid: False"
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "Key Takeaways",
    "headingKn": "ಮುಖ್ಯ ಅಂಶಗಳು",
    "bodyEn": "• Alice completed the whole flow: a task handle, then tasks/get returned complete wrapping a completed Task with text and a ui:// resource.\n• Bob was denied at generate_report; a tampered description was denied for everyone.\n• The writer stayed opaque: one boundary span and nothing about its internals.\n• Six spans shared TRACE-A with one root; the same ids with broken parents failed the tree check.\n• All of this is local evidence. It proves the simulation, not any wire protocol.",
    "bodyKn": "• Alice ಪೂರ್ಣ ಹರಿವು ಪೂರ್ಣಗೊಳಿಸಿದಳು.\n• Bob generate_report ನಲ್ಲಿ ನಿರಾಕರಿಸಲ್ಪಟ್ಟನು.\n• writer opaque ಆಗಿತ್ತು.\n• ಹಂಚಿದ trace id ಸರಿಯಾದ ವೃಕ್ಷ ಸಾಬೀತುಪಡಿಸುವುದಿಲ್ಲ.\n• ಇದು ಸ್ಥಳೀಯ ಸಾಕ್ಷ್ಯ ಮಾತ್ರ."
   }
  },
  {
   "type": "quiz",
   "data": {
    "questions": [
     {
      "q": "generate_report initially returns what?",
      "qKn": "generate_report ಮೊದಲು ಏನು ಹಿಂತಿರುಗಿಸುತ್ತದೆ?",
      "opts": [
       "Final HTML only",
       "An OAuth token",
       "A task handle (resultType \"task\")",
       "An Agent Card"
      ],
      "optsKn": [
       "ಅಂತಿಮ HTML ಮಾತ್ರ",
       "OAuth token",
       "task handle (resultType \"task\")",
       "Agent Card"
      ],
      "correct": 2
     },
     {
      "q": "What does tasks/get return at the request-result level in this flow?",
      "qKn": "ಈ ಹರಿವಿನಲ್ಲಿ tasks/get ಫಲಿತಾಂಶ ಮಟ್ಟದಲ್ಲಿ ಏನು ಹಿಂತಿರುಗಿಸುತ್ತದೆ?",
      "opts": [
       "resultType \"complete\" containing the Task",
       "resultType \"task\"",
       "A new OAuth token",
       "A tool descriptor"
      ],
      "optsKn": [
       "Task ಹೊಂದಿರುವ resultType \"complete\"",
       "resultType \"task\"",
       "ಹೊಸ OAuth token",
       "tool descriptor"
      ],
      "correct": 0
     },
     {
      "q": "What is intentionally opaque in the A2A delegation?",
      "qKn": "A2A delegation ನಲ್ಲಿ ಏನು ಉದ್ದೇಶಪೂರ್ವಕವಾಗಿ opaque?",
      "opts": [
       "The tool name",
       "The protocol version",
       "The writer agent's private execution and internal state",
       "The final artifact"
      ],
      "optsKn": [
       "tool ಹೆಸರು",
       "protocol version",
       "writer ನ ಖಾಸಗಿ execution ಮತ್ತು ಆಂತರಿಕ ಸ್ಥಿತಿ",
       "ಅಂತಿಮ artifact"
      ],
      "correct": 2
     },
     {
      "q": "In the run, why was Bob denied?",
      "qKn": "run ನಲ್ಲಿ Bob ಏಕೆ ನಿರಾಕರಿಸಲ್ಪಟ್ಟನು?",
      "opts": [
       "Wrong token",
       "He lacked the report:write scope",
       "The server was down",
       "The trace was invalid"
      ],
      "optsKn": [
       "ತಪ್ಪು token",
       "ಅವನಿಗೆ report:write scope ಇರಲಿಲ್ಲ",
       "server ಡೌನ್",
       "trace ಅಮಾನ್ಯ"
      ],
      "correct": 1
     },
     {
      "q": "Spans share one trace id but their parents are invalid. Is the trace correct?",
      "qKn": "spans ಒಂದೇ trace id ಹೊಂದಿವೆ ಆದರೆ parents ಅಮಾನ್ಯ. trace ಸರಿಯೇ?",
      "opts": [
       "Yes, the id matches",
       "No: a shared trace id does not prove correct parentage",
       "Yes if there are six spans",
       "Only in production"
      ],
      "optsKn": [
       "ಹೌದು",
       "ಇಲ್ಲ: ಹಂಚಿದ trace id ಸರಿಯಾದ parentage ಸಾಬೀತುಪಡಿಸುವುದಿಲ್ಲ",
       "6 spans ಇದ್ದರೆ ಹೌದು",
       "production ನಲ್ಲಿ ಮಾತ್ರ"
      ],
      "correct": 1
     }
    ]
   }
  }
 ]
};
