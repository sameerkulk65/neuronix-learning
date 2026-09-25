module.exports = {
 "phaseId": "6a369d5e66020ed05b3214c3",
 "moduleId": "6ab6d18eb7119db96ad77966",
 "order": 1,
 "type": "interactive",
 "duration": 50,
 "difficulty": "advanced",
 "status": "published",
 "title": "Skill Invocation and Routing (Part 2 of 3) — Eligibility Before Ranking, Abstention, Arguments, Composition and Context",
 "titleKn": "Skill Invocation ಮತ್ತು Routing (Part 2 of 3) — Ranking ಮೊದಲು Eligibility, Abstention, Arguments, Composition ಮತ್ತು Context",
 "desc": "The hard cases: a blocked high-scoring skill, near misses, thresholds and ambiguity margins, arguments that must stay data, application invocation, bounded skill-to-skill composition with depth and cycle guards, and durable state so a resumed skill does not repeat external writes.",
 "descKn": "ಕಠಿಣ ಪ್ರಕರಣಗಳು: ನಿರ್ಬಂಧಿತ ಹೆಚ್ಚು-score skill, near misses, threshold, ambiguity margin, ಡೇಟಾ ಆಗಿರಬೇಕಾದ arguments, composition guards, ಮತ್ತು durable state.",
 "objectives": [
  "Explain why policy defines the candidate set and relevance ranks within it, and show the bug of ranking first.",
  "Design routing tests with positives, clear negatives and near misses, and apply threshold and margin rules with abstention.",
  "Keep user-controlled arguments as validated data, and contrast fixed versus default argument values.",
  "Model skill-to-skill invocation as a bounded edge with depth and cycle protection.",
  "Distinguish context from durable state and describe a safe resume contract with idempotency."
 ],
 "objectivesKn": [
  "policy candidate set ಅನ್ನು ವ್ಯಾಖ್ಯಾನಿಸುತ್ತದೆ ಎಂದು ವಿವರಿಸಿ.",
  "positives, negatives, near misses ಜೊತೆ ಪರೀಕ್ಷೆ ವಿನ್ಯಾಸಗೊಳಿಸಿ.",
  "arguments ಅನ್ನು ಡೇಟಾ ಆಗಿ ಇರಿಸಿ.",
  "composition ಅನ್ನು ಆಳ ಮತ್ತು ಚಕ್ರ ರಕ್ಷಣೆಯೊಂದಿಗೆ ಮಾದರಿ ಮಾಡಿ.",
  "context ಮತ್ತು durable state ಬೇರ್ಪಡಿಸಿ."
 ],
 "blocks": [
  {
   "type": "heading",
   "data": {
    "textEn": "Skill Invocation and Routing (Part 2 of 3)",
    "textKn": "Skill Invocation and Routing (Part 2 of 3)",
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
    "textEn": "Eligibility Before Ranking",
    "textKn": "Ranking ಮೊದಲು Eligibility",
    "level": "H2"
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "Policy Defines the Search Space",
    "headingKn": "Policy ಹುಡುಕಾಟ ವ್ಯಾಪ್ತಿ ನಿರ್ಧರಿಸುತ್ತದೆ",
    "bodyEn": "Let D be all discovered skills and E = { s in D : policy(s, actor) = allow }. Routing must compute the argmax of score over E, not over D followed by a policy check. Policy is not merely a veto on the final pick: it defines the candidate universe. Relevance stays relevance and policy stays policy, so changing a policy never changes what score(skill, request) means.",
    "bodyKn": "D ಎಲ್ಲಾ ಪತ್ತೆಯಾದ skills, E = policy ಅನುಮತಿಸಿದವು. argmax E ಮೇಲೆ, D ಮೇಲೆ ಅಲ್ಲ."
   }
  },
  {
   "type": "code",
   "data": {
    "filename": "invocation_lab.py",
    "headingEn": "The wrong order versus the correct order",
    "headingKn": "ತಪ್ಪು ಕ್ರಮ vs ಸರಿಯಾದ ಕ್ರಮ",
    "descEn": "incident-triage matches the request best (0.75) but a host extension forbids model invocation; incident-review is eligible and scores 0.2833. The wrong router ranks everything, picks incident-triage, is denied and stops with no answer. The correct router filters first. Note the two outcomes for the correct one: at threshold 0.30 the eligible runner-up is too weak so the result is abstained, not denied; at threshold 0.25 it is selected.",
    "descKn": "incident-triage ಅತ್ಯುತ್ತಮ (0.75) ಆದರೆ host extension ನಿಷೇಧಿಸಿದೆ. ತಪ್ಪು router denied ಆಗಿ ನಿಲ್ಲುತ್ತದೆ. ಸರಿಯಾದದು ಮೊದಲು ಫಿಲ್ಟರ್; 0.30 ನಲ್ಲಿ abstained, 0.25 ನಲ್ಲಿ selected.",
    "code": "def route_implicit(skills, request, adapter):\n    blocked_names = tuple(s.name for s in skills if not adapter.actor_allowed(s, request.actor)[0])\n    eligible = [s for s in skills if adapter.actor_allowed(s, request.actor)[0]]   # eligibility BEFORE ranking\n    names = tuple(s.name for s in eligible)\n    if not eligible:\n        return InvocationDecision(\"abstained\", None, \"no discovered skill is eligible for this actor\", blocked_skills=blocked_names)\n    scored = sorted(((s, relevance_score(s, request.text)) for s in eligible), key=lambda x: (x[1], x[0].name), reverse=True)\n    ranked = tuple((s.name, sc) for s, sc in scored)\n    best, best_score = scored[0]\n    if best_score < request.threshold:\n        return InvocationDecision(\"abstained\", None, \"best eligible candidate is below the activation threshold\", best_score, names, blocked_names, ranked)\n    if len(scored) > 1 and best_score - scored[1][1] < request.ambiguity_margin:\n        return InvocationDecision(\"abstained\", None, f\"ambiguous between {best.name} and {scored[1][0].name}\", best_score, names, blocked_names, ranked)\n    return InvocationDecision(\"selected\", best.name, \"strongest eligible candidate cleared threshold and ambiguity rules\", best_score, names, blocked_names, ranked)\n\ndef broken_rank_then_check(skills, request, adapter):\n    \"\"\"The WRONG order: rank everything, then check policy on the winner.\"\"\"\n    best = max(skills, key=lambda s: relevance_score(s, request.text))\n    ok, _ = adapter.actor_allowed(best, request.actor)\n    return best.name, (\"selected\" if ok else \"denied and STOPPED\")\n\nincident = [SkillMetadata(\"incident-triage\", \"Triage a production incident quickly and page the on-call engineer.\",\n                          (\"incident\", \"triage\", \"production\", \"page\"), (), InvocationPolicy(), {\"disable-model-invocation\": True}),\n            SkillMetadata(\"incident-review\", \"Review a finished incident and write a blameless summary.\",\n                          (\"incident\", \"review\", \"summary\"), (), InvocationPolicy())]\nq = InvocationRequest(Actor.MODEL, \"Triage this production incident.\", threshold=0.30)\nprint(\"  raw relevance ignoring policy:\", [(s.name, relevance_score(s, q.text)) for s in incident])\nprint(\"  wrong order (rank all, then check policy):\", broken_rank_then_check(incident, q, ext))\nshow(\"correct order (extension adapter)\", route_request(incident, q, ext))\nq2 = InvocationRequest(Actor.MODEL, \"Triage this production incident.\", threshold=0.25)\nshow(\"same request, threshold 0.25\", route_request(incident, q2, ext))"
   }
  },
  {
   "type": "output",
   "data": {
    "output": "raw relevance ignoring policy: [('incident-triage', 0.75), ('incident-review', 0.2833)]\n  wrong order (rank all, then check policy): ('incident-triage', 'denied and STOPPED')\n--- correct order (extension adapter) ---\nstatus: abstained | skill: None | score: 0.2833 | source: None\nreason: best eligible candidate is below the activation threshold\neligible: incident-review\nblocked: incident-triage\n  incident-review          0.2833\n--- same request, threshold 0.25 ---\nstatus: selected | skill: incident-review | score: 0.2833 | source: None\nreason: strongest eligible candidate cleared threshold and ambiguity rules\neligible: incident-review\nblocked: incident-triage\n  incident-review          0.2833"
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "Denied Is Not Abstained",
    "headingKn": "Denied ≠ Abstained",
    "bodyEn": "The abstained result here means \"no eligible skill is relevant enough\", which is very different from \"denied because incident-triage was blocked\". The blocked candidate stays visible in the blocked list for operators while the model only ever considers the eligible set.",
    "bodyKn": "abstained ಎಂದರೆ \"ಅರ್ಹ skill ಗಳಲ್ಲಿ ಸಾಕಷ್ಟು ಪ್ರಸ್ತುತ ಯಾವುದೂ ಇಲ್ಲ\"; denied ಅಲ್ಲ."
   }
  },
  {
   "type": "heading",
   "data": {
    "textEn": "Near Misses, Thresholds and Margins",
    "textKn": "Near Misses, Thresholds ಮತ್ತು Margins",
    "level": "H2"
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "Routing Is Classification With an Abstain Class",
    "headingKn": "Routing = Abstain ವರ್ಗ ಇರುವ ವರ್ಗೀಕರಣ",
    "bodyEn": "A normal classifier maps every input to one of A, B or C. Skill routing maps to A, B, C or nothing, because most arbitrary requests belong to no specialised skill. A forced router picks build-diagnostics at 0.07 for \"Write a haiku about the moon\" merely because 0.07 is the maximum. The maximum is not evidence. Add an absolute threshold T and a relative margin M between the top two.",
    "bodyKn": "ಹೆಚ್ಚಿನ ಕೋರಿಕೆಗಳು ಯಾವುದೇ ವಿಶೇಷ skill ಗೆ ಸೇರುವುದಿಲ್ಲ. ಗರಿಷ್ಠ ಸಾಕ್ಷ್ಯ ಅಲ್ಲ. ಮಿತಿ ಮತ್ತು ಅಂತರ ಸೇರಿಸಿ."
   }
  },
  {
   "type": "table",
   "data": {
    "headingEn": "A routing evaluation needs three kinds of case",
    "headers": [
     "Kind",
     "Example",
     "Tests"
    ],
    "rows": [
     [
      "Positive",
      "Is version 2.4.0 ready to publish?",
      "Recall: it triggers when it should"
     ],
     [
      "Clear negative",
      "Explain rotary position embeddings.",
      "Gross over-triggering"
     ],
     [
      "Near miss",
      "Why did today's package build fail?",
      "The real boundary: shared vocabulary, different intent"
     ]
    ]
   }
  },
  {
   "type": "code",
   "data": {
    "filename": "invocation_lab.py",
    "headingEn": "Scoring, and the demo catalog",
    "headingKn": "Scoring ಮತ್ತು demo catalog",
    "descEn": "A deterministic lexical scorer combines word overlap, positive trigger terms and a penalty for negative terms. The negative terms on release-readiness (failed, failure, feature) are what push the build-failure near miss away from it. The tokenizer keeps hyphenated words whole but strips a trailing period; an earlier version glued the period onto the last word and silently broke matching, a reminder that even toy routers need tests.",
    "descKn": "scorer word overlap, positive terms, ಮತ್ತು negative penalty ಸಂಯೋಜಿಸುತ್ತದೆ. ಹಿಂದಿನ ಆವೃತ್ತಿ ಕೊನೆಯ ಪದಕ್ಕೆ ಚುಕ್ಕೆ ಅಂಟಿಸಿ ಹೊಂದಾಣಿಕೆ ಮುರಿದಿತ್ತು.",
    "code": "def tokenize(text):\n    return tuple(re.findall(r\"[a-z0-9]+(?:[._-][a-z0-9]+)*\", text.lower()))\n\ndef relevance_score(skill, text):\n    req, desc = set(tokenize(text)), set(tokenize(skill.description))\n    if not req: return 0.0\n    overlap = len(req & desc) / len(req)\n    pos = sum(1 for t in skill.positive_terms if t in req) / max(1, len(skill.positive_terms))\n    neg = sum(1 for t in skill.negative_terms if t in req) / max(1, len(skill.negative_terms))\n    return round(max(0.0, min(1.0, 0.60 * overlap + 0.40 * pos - 0.60 * neg)), 4)\n\ndef catalog():\n    release = InvocationPolicy(skill=True)\n    build = InvocationPolicy(skill=False)\n    security = InvocationPolicy(model=False, autonomous_agent=False, skill=True)\n    return [\n        SkillMetadata(\"release-readiness\", \"Inspect an already prepared release candidate and produce a readiness report when a version, tag, package, or image is ready to publish.\",\n                      (\"release\", \"candidate\", \"publish\", \"version\"), (\"failed\", \"failure\", \"feature\"), release),\n        SkillMetadata(\"build-diagnostics\", \"Diagnose ordinary package build failures and CI build errors.\",\n                      (\"build\", \"failed\", \"failure\", \"ci\"), (\"publish\",), build),\n        SkillMetadata(\"security-change-review\", \"Review security implications of dependency and configuration changes.\",\n                      (\"security\", \"dependency\", \"risk\"), (), security, {\"disable-model-invocation\": True}),\n    ]"
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
    "headingEn": "Clear match, near miss and abstention",
    "headingKn": "ಸ್ಪಷ್ಟ ಹೊಂದಾಣಿಕೆ, near miss ಮತ್ತು abstention",
    "descEn": "The release request selects release-readiness (0.8143). The build-failure near miss selects build-diagnostics (0.2714) and the release skill scores 0.0857 because failure-related terms are negative evidence for it. The unrelated request scores 0.0 for both eligible skills and abstains. security-change-review is blocked for the model in all three.",
    "descKn": "release ಕೋರಿಕೆ release-readiness ಆರಿಸುತ್ತದೆ; near miss build-diagnostics ಆರಿಸುತ್ತದೆ; ಸಂಬಂಧವಿಲ್ಲದ್ದು abstain.",
    "code": "show(\"implicit model, clear match\", route_request(skills, InvocationRequest(Actor.MODEL, \"Is this release candidate ready to publish?\", threshold=0.35), core))\nshow(\"near miss\", route_request(skills, InvocationRequest(Actor.MODEL, \"Why did today's package build fail?\", threshold=0.25), core))\nshow(\"unrelated request\", route_request(skills, InvocationRequest(Actor.MODEL, \"Explain rotary position embeddings.\", threshold=0.25), core))"
   }
  },
  {
   "type": "output",
   "data": {
    "output": "--- implicit model, clear match ---\nstatus: selected | skill: release-readiness | score: 0.8143 | source: None\nreason: strongest eligible candidate cleared threshold and ambiguity rules\neligible: release-readiness, build-diagnostics\nblocked: security-change-review\n  release-readiness        0.8143\n  build-diagnostics        0.0000\n--- near miss ---\nstatus: selected | skill: build-diagnostics | score: 0.2714 | source: None\nreason: strongest eligible candidate cleared threshold and ambiguity rules\neligible: release-readiness, build-diagnostics\nblocked: security-change-review\n  build-diagnostics        0.2714\n  release-readiness        0.0857\n--- unrelated request ---\nstatus: abstained | skill: None | score: 0.0 | source: None\nreason: best eligible candidate is below the activation threshold\neligible: release-readiness, build-diagnostics\nblocked: security-change-review\n  release-readiness        0.0000\n  build-diagnostics        0.0000"
   }
  },
  {
   "type": "code",
   "data": {
    "filename": "invocation_lab.py",
    "headingEn": "Ambiguity margin",
    "headingKn": "Ambiguity margin",
    "descEn": "Two skills with identical descriptions both clear the threshold (0.925) but tie exactly, so the margin rule (0.10) refuses to guess and abstains, naming both. In a real system the right follow-up might be a clarifying question.",
    "descKn": "ಸಮಾನ description ಎರಡೂ ಮಿತಿ ದಾಟುತ್ತವೆ ಆದರೆ ಸಮ, ಆದ್ದರಿಂದ margin ನಿಯಮ abstain ಮಾಡುತ್ತದೆ.",
    "code": "twins = [SkillMetadata(\"release-readiness\", \"Check whether a deployment is safe to release\", (\"release\", \"safe\", \"deployment\")),\n         SkillMetadata(\"deployment-readiness\", \"Check whether a deployment is safe to release\", (\"release\", \"safe\", \"deployment\"))]\nshow(\"two near-identical skills\", route_request(twins, InvocationRequest(Actor.MODEL, \"Check whether this deployment is safe to release.\", threshold=0.3), core))"
   }
  },
  {
   "type": "output",
   "data": {
    "output": "--- two near-identical skills ---\nstatus: abstained | skill: None | score: 0.925 | source: None\nreason: ambiguous between release-readiness and deployment-readiness\neligible: release-readiness, deployment-readiness\n  release-readiness        0.9250\n  deployment-readiness     0.9250"
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "Descriptions Are the Routing Interface",
    "headingKn": "Descriptions routing ಇಂಟರ್ಫೇಸ್",
    "bodyEn": "A description should carry the capability, the output, a positive boundary (\"use when asked whether a version, tag or package is ready to publish\") and a negative boundary (\"do not use for ordinary build failures\"). Keyword stuffing raises false positives. Negative boundaries help, but they are a hypothesis until near-miss evals show the router actually obeys them.",
    "bodyKn": "description ನಲ್ಲಿ capability, output, ಧನಾತ್ಮಕ ಮತ್ತು ಋಣಾತ್ಮಕ ಗಡಿ ಇರಲಿ. near-miss ಪರೀಕ್ಷೆ ಇಲ್ಲದೆ ಅದು ಕೇವಲ ಊಹೆ."
   }
  },
  {
   "type": "heading",
   "data": {
    "textEn": "Arguments Are Data",
    "textKn": "Arguments ಡೇಟಾ",
    "level": "H2"
   }
  },
  {
   "type": "diagram",
   "data": {
    "titleEn": "Representation boundaries",
    "titleKn": "Representation ಗಡಿಗಳು",
    "contentEn": "user text -> host parser (syntax, quoting) -> bound arguments\n  -> skill validation (required, defaults, domain) -> typed tool input (schema)\n\nAt every step the value is DATA.\nNever: user text -> string concatenation -> shell command."
   }
  },
  {
   "type": "code",
   "data": {
    "filename": "invocation_lab.py",
    "headingEn": "Validate and bind; fixed versus default",
    "headingKn": "ಮಾನ್ಯಗೊಳಿಸಿ ಮತ್ತು ಬೈಂಡ್ ಮಾಡಿ; fixed vs default",
    "descEn": "candidate is required; publish is fixed to False, which is stronger than \"defaults to False\": a caller passing publish=True is rejected, not honoured. A hostile candidate string like \"v2.4.0; rm -rf important-directory\" is just one string value here; it becomes dangerous only if code later concatenates it into a shell command, which is why the safe path is an argument vector or a typed tool.",
    "descKn": "candidate ಕಡ್ಡಾಯ; publish fixed False, default ಗಿಂತ ಬಲಿಷ್ಠ. ಹಾನಿಕರ string ಕೇವಲ ಒಂದು ಡೇಟಾ ಮೌಲ್ಯ; ಶೆಲ್ ಗೆ ಜೋಡಿಸಿದರೆ ಮಾತ್ರ ಅಪಾಯ.",
    "code": "def bind_release_arguments(args):\n    if not str(args.get(\"candidate\", \"\")).strip(): raise ValueError(\"candidate is required\")\n    if args.get(\"publish\", False) is not False: raise ValueError(\"publish must remain false\")\n    return {\"candidate\": args[\"candidate\"].strip(), \"publish\": False}\n\nprint(\"  ok:\", bind_release_arguments({\"candidate\": \" v2.4.0 \"}))\nfor bad in ({\"candidate\": \"\"}, {\"candidate\": \"v2.4.0\", \"publish\": True}):\n    try: bind_release_arguments(bad)\n    except ValueError as e: print(f\"  {bad} -> ValueError: {e}\")\nprint(\"  a hostile string stays one data value:\", bind_release_arguments({\"candidate\": \"v2.4.0; rm -rf important-directory\"}))"
   }
  },
  {
   "type": "output",
   "data": {
    "output": "ok: {'candidate': 'v2.4.0', 'publish': False}\n  {'candidate': ''} -> ValueError: candidate is required\n  {'candidate': 'v2.4.0', 'publish': True} -> ValueError: publish must remain false\n  a hostile string stays one data value: {'candidate': 'v2.4.0; rm -rf important-directory', 'publish': False}"
   }
  },
  {
   "type": "heading",
   "data": {
    "textEn": "Application and Skill-to-Skill Invocation",
    "textKn": "Application ಮತ್ತು Skill-to-Skill Invocation",
    "level": "H2"
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "The Application Already Knows",
    "headingKn": "Application ಗೆ ಈಗಾಗಲೇ ತಿಳಿದಿದೆ",
    "bodyEn": "A [Review Pull Request] button already knows the workflow, so no semantic router is needed; the application requests the exact skill and policy still applies. That removes routing uncertainty but couples to a host activation API, so the portable package should not claim one runtime's function is universal. Keep the portable procedure separate from the host adapter.",
    "bodyKn": "ಬಟನ್ workflow ತಿಳಿದಿದೆ, ಆದ್ದರಿಂದ router ಬೇಡ. ಆದರೆ host API ಗೆ ಜೋಡಣೆ; portable ಪ್ಯಾಕೇಜ್ ಅದನ್ನು ಸಾರ್ವತ್ರಿಕ ಎನ್ನಬಾರದು."
   }
  },
  {
   "type": "code",
   "data": {
    "filename": "invocation_lab.py",
    "headingEn": "A bounded dependency edge with depth and cycle guards",
    "headingKn": "ಆಳ ಮತ್ತು ಚಕ್ರ ರಕ್ಷಣೆಯಿರುವ ಸೀಮಿತ dependency ಸಂಪರ್ಕ",
    "descEn": "Skill-to-skill invocation is a tool-like edge, not a paste of the other skill. It names the target, a bounded task, input artifacts, the expected result and max_depth. The guard blocks an exact cycle (A to B to A) and runaway depth, the skill analogue of recursion without a base case. Identity supplied is not authority granted: the child is still routed with Actor.SKILL.",
    "descKn": "skill-to-skill tool-ನಂತಹ ಸಂಪರ್ಕ. guard ಚಕ್ರ ಮತ್ತು ಅತಿ ಆಳ ತಡೆಯುತ್ತದೆ. ಗುರುತು ನೀಡಿದರೆ ಅಧಿಕಾರ ನೀಡಿದಂತಲ್ಲ.",
    "code": "@dataclass(frozen=True)\nclass SkillInvocation:\n    target_skill: str\n    task: str\n    inputs: tuple\n    expected: str\n    max_depth: int\n\ndef validate_composition(inv, path):\n    if len(path) >= inv.max_depth: return False, \"maximum composition depth reached\"\n    if inv.target_skill in path: return False, \"skill invocation cycle detected\"\n    return True, \"allowed\"\n\ninv = SkillInvocation(\"security-change-review\", \"Review dependency changes\", (\"artifacts/release.diff\",), \"risk-report.json\", 2)\nprint(\"  first hop:\", validate_composition(inv, [\"release-readiness\"]))\nprint(\"  cycle:    \", validate_composition(SkillInvocation(\"release-readiness\", \"t\", (), \"x\", 3), [\"release-readiness\", \"security-change-review\"]))\nprint(\"  too deep: \", validate_composition(inv, [\"a\", \"b\"]))"
   }
  },
  {
   "type": "output",
   "data": {
    "output": "first hop: (True, 'allowed')\n  cycle:     (False, 'skill invocation cycle detected')\n  too deep:  (False, 'maximum composition depth reached')"
   }
  },
  {
   "type": "heading",
   "data": {
    "textEn": "Context Is Not State",
    "textKn": "Context ≠ State",
    "level": "H2"
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "Design for Interruption",
    "headingKn": "ಅಡಚಣೆಗಾಗಿ ವಿನ್ಯಾಸಗೊಳಿಸಿ",
    "bodyEn": "After activation, what happens to a skill's instructions is host-specific: they may stay, be summarised at compaction, run only in a delegated context or reach a subagent without the parent history. So do not assume they persist. Store workflow state in a file or typed state, for example artifacts/release-readiness.json with the candidate commit, completed checks and any external-write idempotency keys. On resume: read the state, revalidate the candidate commit against the current repository, and never repeat an external write whose idempotency key is already recorded. This is a design contract; this lesson does not run a resume simulation.",
    "bodyKn": "activation ನಂತರ ಸೂಚನೆಗಳಿಗೆ ಏನಾಗುತ್ತದೆ ಎಂಬುದು host-ನಿರ್ದಿಷ್ಟ. ಸ್ಥಿತಿಯನ್ನು ಫೈಲ್‌ನಲ್ಲಿ ಇರಿಸಿ; ಮರು-ಪ್ರವೇಶದಲ್ಲಿ ಓದಿ, ಮರುಮಾನ್ಯಗೊಳಿಸಿ, idempotency ಪರಿಶೀಲಿಸಿ."
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "Key Takeaways",
    "headingKn": "ಮುಖ್ಯ ಅಂಶಗಳು",
    "bodyEn": "• Filter eligibility first. In our run the wrong order returned (incident-triage, denied and STOPPED); the correct order abstained at threshold 0.30 with the eligible runner-up at 0.2833 and selected it at 0.25.\n• Test positives, clear negatives and near misses: the build failure request selected build-diagnostics (0.2714) over release-readiness (0.0857); the unrelated request abstained.\n• Two identical skills tied at 0.925 and the margin rule abstained.\n• Arguments stay data: publish=True was rejected; a hostile string stayed a single value.\n• Composition needs a depth limit and cycle detection (both blocked in our run).\n• Context is not durable state; store state and use idempotency keys (design only here).",
    "bodyKn": "• ಮೊದಲು eligibility ಫಿಲ್ಟರ್.\n• positives, negatives, near misses ಪರೀಕ್ಷಿಸಿ.\n• ಸಮಾನ skills ಗೆ margin abstain.\n• arguments ಡೇಟಾ.\n• composition ಗೆ ಆಳ ಮತ್ತು ಚಕ್ರ ಪತ್ತೆ.\n• context ≠ durable state."
   }
  },
  {
   "type": "quiz",
   "data": {
    "questions": [
     {
      "q": "Why filter by eligibility before ranking?",
      "qKn": "ranking ಮೊದಲು eligibility ಫಿಲ್ಟರ್ ಏಕೆ?",
      "opts": [
       "To make ranking faster",
       "So a blocked high scorer cannot stop routing when an eligible candidate exists",
       "Because scores are secret",
       "To remove thresholds"
      ],
      "optsKn": [
       "ranking ವೇಗಕ್ಕೆ",
       "ನಿರ್ಬಂಧಿತ ಹೆಚ್ಚು-score ಅರ್ಹ ಅಭ್ಯರ್ಥಿ ಇರುವಾಗ routing ನಿಲ್ಲಿಸಬಾರದು",
       "scores ರಹಸ್ಯ",
       "thresholds ತೆಗೆಯಲು"
      ],
      "correct": 1
     },
     {
      "q": "The best eligible score is 0.38 and the threshold is 0.70. What is correct?",
      "qKn": "ಅತ್ಯುತ್ತಮ ಅರ್ಹ score 0.38, threshold 0.70. ಸರಿಯಾದದ್ದು?",
      "opts": [
       "Select it because it is the maximum",
       "Abstain",
       "Lower the threshold automatically",
       "Pick the safest sounding skill"
      ],
      "optsKn": [
       "ಗರಿಷ್ಠ ಆದ್ದರಿಂದ ಆರಿಸಿ",
       "Abstain",
       "threshold ಸ್ವಯಂ ಕಡಿಮೆ ಮಾಡಿ",
       "ಸುರಕ್ಷಿತ ಎನಿಸುವುದನ್ನು ಆರಿಸಿ"
      ],
      "correct": 1
     },
     {
      "q": "Two skills score 0.83 and 0.81 with a required margin of 0.10. What now?",
      "qKn": "ಎರಡು skills 0.83 ಮತ್ತು 0.81, ಅಗತ್ಯ margin 0.10. ಈಗ?",
      "opts": [
       "Select the first",
       "Abstain or ask for clarification",
       "Run both",
       "Delete one"
      ],
      "optsKn": [
       "ಮೊದಲನೆಯದನ್ನು ಆರಿಸಿ",
       "Abstain ಅಥವಾ ಸ್ಪಷ್ಟೀಕರಣ ಕೇಳಿ",
       "ಎರಡನ್ನೂ ಚಲಾಯಿಸಿ",
       "ಒಂದನ್ನು ಅಳಿಸಿ"
      ],
      "correct": 1
     },
     {
      "q": "Why is publish \"fixed false\" stronger than \"defaults to false\"?",
      "qKn": "publish \"fixed false\" \"defaults to false\" ಗಿಂತ ಬಲಿಷ್ಠ ಏಕೆ?",
      "opts": [
       "It is shorter",
       "A caller cannot change a fixed value through this workflow",
       "It is faster",
       "It changes the tool schema"
      ],
      "optsKn": [
       "ಚಿಕ್ಕದು",
       "ಕರೆದವರು fixed ಮೌಲ್ಯ ಬದಲಿಸಲಾರರು",
       "ವೇಗ",
       "tool schema ಬದಲಿಸುತ್ತದೆ"
      ],
      "correct": 1
     },
     {
      "q": "What does the composition guard stop?",
      "qKn": "composition guard ಏನನ್ನು ತಡೆಯುತ್ತದೆ?",
      "opts": [
       "Slow skills",
       "Exact cycles (A to B to A) and runaway depth",
       "Long descriptions",
       "Any second skill"
      ],
      "optsKn": [
       "ನಿಧಾನ skills",
       "ಚಕ್ರಗಳು (A→B→A) ಮತ್ತು ಅತಿ ಆಳ",
       "ಉದ್ದ descriptions",
       "ಎರಡನೇ ಯಾವುದೇ skill"
      ],
      "correct": 1
     }
    ]
   }
  }
 ]
};
