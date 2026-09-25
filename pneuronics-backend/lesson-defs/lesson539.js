const phaseId = '6a369d5e66020ed05b3214c3';
const moduleId = '6a369d6066020ed05b321502'; // Module 270: LLM Routing Layer

const H1 = (en, kn) => ({ type: 'heading', data: { textEn: en, textKn: kn || en, level: 'H1' } });
const H2 = (en, kn) => ({ type: 'heading', data: { textEn: en, textKn: kn || en, level: 'H2' } });
const C = (he, hk, be, bk) => ({ type: 'concept', data: { headingEn: he, headingKn: hk, bodyEn: be, bodyKn: bk } });
const CODE = (file, he, hk, de, dk, code) => ({ type: 'code', data: { filename: file, headingEn: he, headingKn: hk, descEn: de, descKn: dk, code } });
const OUT = (o) => ({ type: 'output', data: { output: o } });
const TBL = (he, headers, rows) => ({ type: 'table', data: { headingEn: he, headers, rows } });
const DIA = (te, tk, ce) => ({ type: 'diagram', data: { titleEn: te, titleKn: tk, contentEn: ce } });

const ROUTER = `import re

ROUTES = {
    "our_smart_model": ["provider_a/smart-model", "provider_b/smart-model", "provider_c/smart-model"],
    "fast_model":      ["provider_a/fast-model", "provider_b/fast-model"],
    "coding_model":    ["provider_c/code-model", "provider_a/smart-model"],
}

OUTAGES = {}
CALL_LOG = []

def call_provider(provider, model, messages):
    CALL_LOG.append(f"{provider}/{model}")
    if provider in OUTAGES:
        return {"status": OUTAGES[provider], "error": "simulated failure"}
    return {"status": 200, "content": f"Response from {provider}/{model}", "input_tokens": 100, "output_tokens": 25}

def route_request_v1(request):
    routes = ROUTES[request["model"]]
    route = routes[0]
    provider, model = route.split("/", 1)
    return call_provider(provider, model, request["messages"])`;

module.exports = {
  phaseId,
  moduleId,
  order: 0,
  type: 'interactive',
  duration: 45,
  difficulty: 'intermediate',
  status: 'published',
  title: 'LLM Routing Layer — LiteLLM, OpenRouter, Portkey (Part 1 of 3) — Gateway Foundations, Aliases, and Routes',
  titleKn: 'LLM Routing Layer — LiteLLM, OpenRouter, Portkey (Part 1 of 3) — Gateway Foundations, Aliases, ಮತ್ತು Routes',
  desc: 'Build the core of an LLM routing gateway in plain Python: model aliases, a ROUTES table, provider/model resolution and provider stubs -- then prove with real output why a router that only ever uses routes[0] cannot survive a provider outage.',
  descKn: 'ಸರಳ Python ನಲ್ಲಿ LLM routing gateway ನ ಮೂಲ ನಿರ್ಮಿಸಿ: model aliases, ROUTES ಕೋಷ್ಟಕ, provider/model resolution, provider stubs -- ಮತ್ತು routes[0] ಮಾತ್ರ ಬಳಸುವ router provider outage ಬದುಕಲಾರದು ಎಂದು ನಿಜ output ಮೂಲಕ ಸಾಬೀತುಪಡಿಸಿ.',
  objectives: [
    'Explain why application code should talk to one routing gateway instead of coupling itself to every LLM provider SDK.',
    'Distinguish a model alias (our_smart_model) from a concrete route (provider_a/smart-model) and from a provider, and explain who owns each.',
    'Genuinely build a ROUTES table and resolve an alias into an ordered chain of provider/model routes, splitting each route safely with split("/", 1).',
    'Explain what "OpenAI-compatible" means for a gateway and why it does not limit the gateway to OpenAI.',
    'Genuinely demonstrate, with a simulated 503, that a router built on routes[0] has no failover, and show that changing ROUTES changes which provider serves a request without touching application code.',
  ],
  objectivesKn: [
    'application code ಪ್ರತಿ LLM provider SDK ಗೆ ತನ್ನನ್ನು ಜೋಡಿಸಿಕೊಳ್ಳುವ ಬದಲು ಒಂದೇ routing gateway ಜೊತೆ ಏಕೆ ಮಾತನಾಡಬೇಕು ಎಂದು ವಿವರಿಸಿ.',
    'model alias, concrete route ಮತ್ತು provider ಗಳನ್ನು ಪ್ರತ್ಯೇಕಿಸಿ ಮತ್ತು ಪ್ರತಿಯೊಂದನ್ನು ಯಾರು ಹೊಂದಿದ್ದಾರೆ ಎಂದು ವಿವರಿಸಿ.',
    'ROUTES ಕೋಷ್ಟಕ ನಿರ್ಮಿಸಿ, alias ಅನ್ನು ಕ್ರಮಬದ್ಧ provider/model routes ಸರಪಳಿಯಾಗಿ ಪರಿಹರಿಸಿ.',
    'gateway ಗೆ "OpenAI-compatible" ಎಂದರೇನು ಮತ್ತು ಅದು ಗೇಟ್‌ವೇಯನ್ನು OpenAI ಗೆ ಮಿತಗೊಳಿಸುವುದಿಲ್ಲ ಏಕೆ ಎಂದು ವಿವರಿಸಿ.',
    'ಅನುಕರಿತ 503 ಮೂಲಕ routes[0] ಆಧಾರಿತ router ಗೆ failover ಇಲ್ಲ ಎಂದು ಪ್ರದರ್ಶಿಸಿ.',
  ],
  blocks: [
    H1('LLM Routing Layer — LiteLLM, OpenRouter, Portkey (Part 1 of 3)'),
    C('Lesson Info', 'Lesson ಮಾಹಿತಿ',
      '• Type: Build · Language: Python (stdlib only) · Prerequisites: Module 266 (MCP Gateways) · Time: ~45 minutes · Part 1 of 3. Every provider here is a simulated stub, so the routing behaviour is deterministic and testable; no real API keys are used.',
      '• Type: Build · Language: Python (stdlib only) · Prerequisites: Module 266 · Time: ~45 ನಿಮಿಷಗಳು · Part 1 of 3. ಇಲ್ಲಿನ ಪ್ರತಿ provider ಅನುಕರಿತ stub, ಆದ್ದರಿಂದ routing ವರ್ತನೆ ನಿರ್ಧಾರಾತ್ಮಕ.'),

    H2('The Core Problem', 'ಮೂಲ ಸಮಸ್ಯೆ'),
    C('Direct Provider Calls Couple Your App to One Vendor', 'ನೇರ Provider Calls ನಿಮ್ಮ App ಅನ್ನು ಒಂದು Vendor ಗೆ ಬಂಧಿಸುತ್ತವೆ',
      'If application code calls one provider directly, it knows that provider\'s SDK, model names, retry rules and error shapes. When that provider has an outage, or you find a cheaper model for simple work, every application has to change. The fix is a routing gateway: one intermediary that applications talk to, and that alone knows about the providers behind it.',
      'application code ನೇರವಾಗಿ ಒಂದು provider ಅನ್ನು ಕರೆದರೆ, ಅದು ಆ provider ನ SDK, model ಹೆಸರುಗಳು, retry ನಿಯಮಗಳು ತಿಳಿದಿರುತ್ತದೆ. ಆ provider ಗೆ outage ಆದಾಗ ಪ್ರತಿ application ಬದಲಾಗಬೇಕು. ಪರಿಹಾರ: routing gateway.'),
    TBL('Five reasons to route', ['Requirement', 'What routing provides'], [
      ['Cost', 'Send simple work to a cheaper model'],
      ['Failover', 'Switch provider after failures'],
      ['Latency', 'Pick models that fit an SLA'],
      ['Compliance', 'Route workloads by region or policy'],
      ['Experimentation', 'Split traffic across models'],
    ]),
    C('Separation of Concerns', 'ಕಾಳಜಿಗಳ ಪ್ರತ್ಯೇಕತೆ',
      'The application answers "what task do I want performed?". The gateway answers "which provider and model should perform it right now?". Retry logic, cost logic, redaction, rate limits and fallback all live in the gateway instead of being copied into every app.',
      'application "ಯಾವ ಕೆಲಸ ಆಗಬೇಕು?" ಎಂದು ಉತ್ತರಿಸುತ್ತದೆ. gateway "ಈಗ ಯಾವ provider ಮತ್ತು model ಇದನ್ನು ನಿರ್ವಹಿಸಬೇಕು?" ಎಂದು ಉತ್ತರಿಸುತ್ತದೆ.'),
    DIA('Application to gateway to providers', 'Application ಇಂದ gateway ಮೂಲಕ providers ಗೆ',
      'Application  --(one OpenAI-shaped request)-->  ROUTING GATEWAY  --> Provider A\n                                                            |--> Provider B\n                                                            \\--> Provider C\n\nThe app never names a provider. The gateway owns provider translation, routing, retry/fallback, cost tracking, guardrails and rate limits.'),

    H2('OpenAI-Compatible Does Not Mean OpenAI-Only', 'OpenAI-Compatible ಎಂದರೆ OpenAI-Only ಅಲ್ಲ'),
    C('One Familiar Request Shape', 'ಒಂದು ಪರಿಚಿತ Request ಆಕಾರ',
      'The gateway exposes a surface modelled on POST /v1/chat/completions: a request with a "model" field and a "messages" list. That is only the API surface. Inside, the router translates the common request into whatever Anthropic, Google or any other provider expects. The compatibility is an abstraction boundary, not a limit on which providers can sit behind it.',
      'gateway POST /v1/chat/completions ಮಾದರಿಯ ಮೇಲ್ಮೈ ಒದಗಿಸುತ್ತದೆ: "model" field ಮತ್ತು "messages" ಪಟ್ಟಿ. ಇದು API ಮೇಲ್ಮೈ ಮಾತ್ರ. ಒಳಗೆ router ಸಾಮಾನ್ಯ request ಅನ್ನು ಪ್ರತಿ provider ಗೆ ಬೇಕಾದ ರೂಪಕ್ಕೆ ಅನುವಾದಿಸುತ್ತದೆ.'),

    H2('Aliases, Routes and Providers', 'Aliases, Routes ಮತ್ತು Providers'),
    C('Three Names, Three Owners', 'ಮೂರು ಹೆಸರುಗಳು, ಮೂರು ಮಾಲೀಕರು',
      'Alias: "our_smart_model" is a logical name owned by YOUR architecture. Concrete route: "provider_a/smart-model" is provider/model, owned by provider infrastructure. Provider: "provider_a" is the vendor. The application asks for the alias; the router resolves it to a concrete route; an adapter calls the provider.',
      'Alias: "our_smart_model" ನಿಮ್ಮ ವಾಸ್ತುಶಿಲ್ಪ ಹೊಂದಿರುವ ತಾರ್ಕಿಕ ಹೆಸರು. Concrete route: "provider_a/smart-model" provider ಮೂಲಸೌಕರ್ಯ ಹೊಂದಿದೆ. Provider: "provider_a" vendor.'),
    TBL('Alias vs concrete route vs provider', ['Term', 'Example', 'Owned by'], [
      ['Model alias', 'our_smart_model', 'Your application architecture'],
      ['Concrete route', 'provider_a/smart-model', 'Provider infrastructure'],
      ['Provider', 'provider_a', 'The vendor'],
    ]),

    H2('Genuinely Building the Routing Table', 'ROUTES ಕೋಷ್ಟಕವನ್ನು ನಿಜವಾಗಿ ನಿರ್ಮಿಸುವುದು'),
    CODE('router.py', 'ROUTES, a provider stub and the first router', 'ROUTES, provider stub ಮತ್ತು ಮೊದಲ router',
      'ROUTES maps each alias to an ORDERED list of concrete routes, so it carries both the alias and the priority. call_provider() is a stub that either answers 200 or returns a failure status we control through OUTAGES -- which is what makes routing behaviour testable.',
      'ROUTES ಪ್ರತಿ alias ಅನ್ನು ಕ್ರಮಬದ್ಧ concrete routes ಪಟ್ಟಿಗೆ ನಕ್ಷೆ ಮಾಡುತ್ತದೆ. call_provider() 200 ಅಥವಾ OUTAGES ಮೂಲಕ ನಿಯಂತ್ರಿಸುವ ವೈಫಲ್ಯ status ಹಿಂತಿರುಗಿಸುವ stub.',
      ROUTER),
    OUT('(definitions only: no output yet)'),

    CODE('router.py', 'Every alias and its first choice', 'ಪ್ರತಿ alias ಮತ್ತು ಅದರ ಮೊದಲ ಆಯ್ಕೆ',
      'Index 0 is the preferred route; the rest are the fallbacks the router will use in Part 2.',
      'Index 0 ಆದ್ಯತೆಯ route; ಉಳಿದವು Part 2 ರಲ್ಲಿ ಬಳಸುವ fallbacks.',
      'for alias, routes in ROUTES.items():\n    print(alias, "->", routes[0], "| fallbacks:", routes[1:])'),
    OUT("our_smart_model -> provider_a/smart-model | fallbacks: ['provider_b/smart-model', 'provider_c/smart-model']\nfast_model -> provider_a/fast-model | fallbacks: ['provider_b/fast-model']\ncoding_model -> provider_c/code-model | fallbacks: ['provider_a/smart-model']"),

    C('Why Order Matters', 'ಕ್ರಮ ಏಕೆ ಮುಖ್ಯ',
      'The list order IS the routing policy for static-priority routing: position 0 is tried first, position 1 is the first fallback, and so on. No ranking algorithm is needed; the data structure carries the policy.',
      'static-priority routing ಗೆ ಪಟ್ಟಿಯ ಕ್ರಮವೇ routing policy: position 0 ಮೊದಲು ಪ್ರಯತ್ನಿಸಲ್ಪಡುತ್ತದೆ, position 1 ಮೊದಲ fallback.'),

    H2('Resolving a Route into Provider and Model', 'Route ಅನ್ನು Provider ಮತ್ತು Model ಆಗಿ ಪರಿಹರಿಸುವುದು'),
    CODE('router.py', 'Splitting provider/model safely with split("/", 1)', 'split("/", 1) ಮೂಲಕ provider/model ಸುರಕ್ಷಿತವಾಗಿ ವಿಭಜಿಸುವುದು',
      'The maxsplit of 1 matters: it splits only at the FIRST slash, so a model name that itself contains a slash (an org/model style name) stays intact instead of being torn apart.',
      'maxsplit 1 ಮುಖ್ಯ: ಇದು ಮೊದಲ slash ನಲ್ಲಿ ಮಾತ್ರ ವಿಭಜಿಸುತ್ತದೆ, ಆದ್ದರಿಂದ ತನ್ನೊಳಗೇ slash ಇರುವ model ಹೆಸರು ಹಾಗೇ ಉಳಿಯುತ್ತದೆ.',
      'for route in ["openai/gpt-4o", "anthropic/claude-3-5-sonnet", "google/gemini-1.5-pro"]:\n    provider, model = route.split("/", 1)\n    print(route, "->", provider, "|", model)\n\nprint("provider_x/org/model-1".split("/", 1))'),
    OUT("openai/gpt-4o -> openai | gpt-4o\nanthropic/claude-3-5-sonnet -> anthropic | claude-3-5-sonnet\ngoogle/gemini-1.5-pro -> google | gemini-1.5-pro\n['provider_x', 'org/model-1']"),

    H2('The Provider Adapter Boundary', 'Provider Adapter ಗಡಿ'),
    C('The Router Orchestrates; the Adapter Translates', 'Router ಸಂಯೋಜಿಸುತ್ತದೆ; Adapter ಅನುವಾದಿಸುತ್ತದೆ',
      'The router should not contain if provider == "openai" ... elif provider == "anthropic" ... scattered everywhere. Provider-specific behaviour lives behind one function, call_provider(provider, model, messages). The router asks "which provider?"; the adapter answers "how do I call it?". In this lesson the adapter is a stub, which lets us script exact success and failure.',
      'router ಎಲ್ಲೆಡೆ if provider == "openai" ... elif ... ಹೊಂದಿರಬಾರದು. provider-ನಿರ್ದಿಷ್ಟ ವರ್ತನೆ call_provider() ಹಿಂದೆ ಇರುತ್ತದೆ.'),
    CODE('router.py', 'A healthy provider and a failing provider', 'ಆರೋಗ್ಯಕರ provider ಮತ್ತು ವಿಫಲ provider',
      'The stub returns a normalized dictionary. Setting OUTAGES makes the same call return a 503.',
      'stub ಸಾಮಾನ್ಯೀಕರಿಸಿದ dictionary ಹಿಂತಿರುಗಿಸುತ್ತದೆ. OUTAGES ಹೊಂದಿಸಿದರೆ ಅದೇ call 503 ಹಿಂತಿರುಗಿಸುತ್ತದೆ.',
      'msgs = [{"role": "user", "content": "hi"}]\nprint(call_provider("provider_a", "smart-model", msgs))\nOUTAGES["provider_a"] = 503\nprint(call_provider("provider_a", "smart-model", msgs))'),
    OUT("{'status': 200, 'content': 'Response from provider_a/smart-model', 'input_tokens': 100, 'output_tokens': 25}\n{'status': 503, 'error': 'simulated failure'}"),

    H2('Why routes[0] Is Not Enough', 'routes[0] ಸಾಕಾಗದಿರುವುದು ಏಕೆ'),
    CODE('router.py', 'The naive router meets an outage', 'ಸರಳ router outage ಎದುರಿಸುತ್ತದೆ',
      'route_request_v1 always uses routes[0]. With provider_a down, the request fails even though two other providers are configured and healthy -- and the log shows they were never even tried.',
      'route_request_v1 ಯಾವಾಗಲೂ routes[0] ಬಳಸುತ್ತದೆ. provider_a ಡೌನ್ ಆದಾಗ, ಇನ್ನೆರಡು ಆರೋಗ್ಯಕರ providers ಇದ್ದರೂ request ವಿಫಲವಾಗುತ್ತದೆ.',
      'OUTAGES.clear(); CALL_LOG.clear()\nOUTAGES["provider_a"] = 503\nrequest = {"model": "our_smart_model", "messages": [{"role": "user", "content": "Explain routing gateways."}]}\nresult = route_request_v1(request)\nprint("result:", result, "| providers called:", CALL_LOG)'),
    OUT("result: {'status': 503, 'error': 'simulated failure'} | providers called: ['provider_a/smart-model']"),
    C('What This Output Proves', 'ಈ Output ಏನು ಸಾಬೀತುಪಡಿಸುತ್ತದೆ',
      'Only provider_a was called and its 503 was handed straight back to the user. The fallbacks in ROUTES were dead data. The single change route = routes[0] to a loop over routes is what Part 2 builds, and it is what turns a proxy into a failover gateway.',
      'provider_a ಮಾತ್ರ ಕರೆಯಲ್ಪಟ್ಟಿತು ಮತ್ತು ಅದರ 503 ನೇರವಾಗಿ ಬಳಕೆದಾರರಿಗೆ ಹಿಂತಿರುಗಿತು. ROUTES ನ fallbacks ನಿಷ್ಪ್ರಯೋಜಕ ಡೇಟಾ ಆಗಿದ್ದವು.'),

    H2('The Power of the Alias', 'Alias ನ ಶಕ್ತಿ'),
    CODE('router.py', 'Change the preferred model without touching application code', 'application code ಮುಟ್ಟದೇ ಆದ್ಯತೆಯ model ಬದಲಿಸುವುದು',
      'The request is byte-for-byte identical before and after. Only the gateway configuration changed, and the provider that served it changed with it.',
      'request ಮೊದಲು ಮತ್ತು ನಂತರ ಒಂದೇ ಆಗಿದೆ. gateway ಸಂರಚನೆ ಮಾತ್ರ ಬದಲಾಯಿತು.',
      'OUTAGES.clear(); CALL_LOG.clear()\nrequest = {"model": "our_smart_model", "messages": [{"role": "user", "content": "Explain routing gateways."}]}\nr1 = route_request_v1(request)\nprint("asked for:", request["model"], "| served by:", CALL_LOG[-1])\n\nROUTES["our_smart_model"] = ["provider_b/smart-model", "provider_a/smart-model"]\nr2 = route_request_v1(request)\nprint("same request now served by:", CALL_LOG[-1])'),
    OUT("asked for: our_smart_model | served by: provider_a/smart-model\nsame request now served by: provider_b/smart-model"),
    CODE('router.py', 'An alias the gateway does not know', 'gateway ಗೆ ತಿಳಿಯದ alias',
      'An unknown alias must fail loudly rather than being silently routed somewhere.',
      'ತಿಳಿಯದ alias ಮೌನವಾಗಿ ಎಲ್ಲೋ ರೂಟ್ ಆಗುವ ಬದಲು ಸ್ಪಷ್ಟವಾಗಿ ವಿಫಲವಾಗಬೇಕು.',
      'try:\n    route_request_v1({"model": "no_such_alias", "messages": []})\nexcept KeyError as e:\n    print("KeyError:", e)'),
    OUT("KeyError: 'no_such_alias'"),

    H2('LiteLLM, OpenRouter and Portkey', 'LiteLLM, OpenRouter ಮತ್ತು Portkey'),
    TBL('Three operating models for a routing gateway', ['Approach', 'Idea', 'Choose it when'], [
      ['LiteLLM (self-hosted)', 'You run the gateway', 'You need control of infrastructure, credentials and the data path'],
      ['OpenRouter (managed)', 'A hosted aggregator routes for you', 'You want minimal gateway operations'],
      ['Portkey (production gateway)', 'Routing plus observability, guardrails and budgets', 'You need extensive operational controls'],
    ]),
    C('Choose by Constraint, Not by Name', 'ಹೆಸರಿನ ಆಧಾರದಲ್ಲಿ ಅಲ್ಲ, ನಿರ್ಬಂಧದ ಆಧಾರದಲ್ಲಿ ಆರಿಸಿ',
      'The lesson is not asking you to memorize a winner. Ask who operates the gateway, who owns provider credentials, where request data may travel, what observability and guardrails you need, and how much infrastructure your team can run. The product follows the constraints.',
      'ಯಾರು gateway ನಿರ್ವಹಿಸುತ್ತಾರೆ, provider credentials ಯಾರ ಬಳಿ ಇವೆ, request ಡೇಟಾ ಎಲ್ಲಿಗೆ ಹೋಗಬಹುದು ಎಂದು ಕೇಳಿ. ಉತ್ಪನ್ನ ನಿರ್ಬಂಧಗಳನ್ನು ಅನುಸರಿಸುತ್ತದೆ.'),

    C('Key Takeaways', 'ಮುಖ್ಯ ಅಂಶಗಳು',
      '• A routing gateway removes provider coupling: applications send one OpenAI-shaped request and name an alias.\n• Alias, concrete route and provider are three different things with three different owners.\n• We genuinely built ROUTES, resolved routes with split("/", 1) (including a model name that contains a slash), and used a provider stub to script success and failure.\n• We genuinely proved a routes[0] router hands a provider outage straight to the user while healthy fallbacks sit unused.\n• We genuinely showed that changing ROUTES changes the serving provider with zero change to the request.\n• LiteLLM, OpenRouter and Portkey are different operating models; choose by ownership, data-path and control requirements.',
      '• routing gateway provider ಬಂಧನ ತೆಗೆದುಹಾಕುತ್ತದೆ.\n• Alias, concrete route ಮತ್ತು provider ಮೂರು ವಿಭಿನ್ನ ವಿಷಯಗಳು.\n• ROUTES ನಿರ್ಮಿಸಿ split("/", 1) ಬಳಸಿದ್ದೇವೆ.\n• routes[0] router provider outage ಅನ್ನು ನೇರವಾಗಿ ಬಳಕೆದಾರರಿಗೆ ಕೊಡುತ್ತದೆ ಎಂದು ಸಾಬೀತುಪಡಿಸಿದ್ದೇವೆ.\n• ROUTES ಬದಲಿಸಿದರೆ request ಬದಲಾಗದೇ ಸೇವೆ ಸಲ್ಲಿಸುವ provider ಬದಲಾಗುತ್ತದೆ.'),

    { type: 'quiz', data: { questions: [
      { q: 'What problem does a routing gateway solve compared with calling each provider directly?', qKn: 'ಪ್ರತಿ provider ಅನ್ನು ನೇರವಾಗಿ ಕರೆಯುವುದಕ್ಕೆ ಹೋಲಿಸಿದರೆ routing gateway ಯಾವ ಸಮಸ್ಯೆ ಪರಿಹರಿಸುತ್ತದೆ?',
        opts: ['It makes models faster', 'It removes provider coupling and centralizes routing, fallback, cost and guardrail logic', 'It replaces authentication', 'It stores prompts forever'],
        optsKn: ['ಇದು models ವೇಗವಾಗಿಸುತ್ತದೆ', 'ಇದು provider ಬಂಧನ ತೆಗೆದು routing, fallback, cost, guardrail logic ಕೇಂದ್ರೀಕರಿಸುತ್ತದೆ', 'ಇದು authentication ಬದಲಾಯಿಸುತ್ತದೆ', 'ಇದು prompts ಶಾಶ್ವತವಾಗಿ ಸಂಗ್ರಹಿಸುತ್ತದೆ'], correct: 1 },
      { q: 'What is the difference between "our_smart_model" and "provider_a/smart-model"?', qKn: '"our_smart_model" ಮತ್ತು "provider_a/smart-model" ನಡುವಿನ ವ್ಯತ್ಯಾಸ ಏನು?',
        opts: ['None, they are synonyms', 'The first is a logical alias owned by your architecture; the second is a concrete provider/model route', 'The first is a provider; the second is an alias', 'The first is only used for embeddings'],
        optsKn: ['ಯಾವುದೂ ಇಲ್ಲ', 'ಮೊದಲನೆಯದು ನಿಮ್ಮ ವಾಸ್ತುಶಿಲ್ಪದ ತಾರ್ಕಿಕ alias; ಎರಡನೆಯದು concrete provider/model route', 'ಮೊದಲನೆಯದು provider', 'ಮೊದಲನೆಯದು embeddings ಗಾಗಿ ಮಾತ್ರ'], correct: 1 },
      { q: 'Why is an OpenAI-compatible gateway still able to call Anthropic or Gemini?', qKn: 'OpenAI-compatible gateway Anthropic ಅಥವಾ Gemini ಅನ್ನು ಇನ್ನೂ ಕರೆಯಬಲ್ಲದು ಏಕೆ?',
        opts: ['Because it secretly uses only OpenAI', 'Because compatibility describes the API surface; the router translates the common request for each provider', 'Because Anthropic copies OpenAI', 'Because aliases are encrypted'],
        optsKn: ['ಇದು ರಹಸ್ಯವಾಗಿ OpenAI ಮಾತ್ರ ಬಳಸುತ್ತದೆ', 'ಹೊಂದಾಣಿಕೆ API ಮೇಲ್ಮೈಯನ್ನು ವಿವರಿಸುತ್ತದೆ; router ಪ್ರತಿ provider ಗೆ ಸಾಮಾನ್ಯ request ಅನುವಾದಿಸುತ್ತದೆ', 'Anthropic OpenAI ಅನ್ನು ನಕಲು ಮಾಡುತ್ತದೆ', 'aliases ಎನ್‌ಕ್ರಿಪ್ಟ್ ಆಗಿವೆ'], correct: 1 },
      { q: 'In the genuine run, route_request_v1 hit a 503 from provider_a. Which providers were called?', qKn: 'ನಿಜ run ನಲ್ಲಿ, route_request_v1 provider_a ಇಂದ 503 ಪಡೆಯಿತು. ಯಾವ providers ಕರೆಯಲ್ಪಟ್ಟವು?',
        opts: ['All three', 'provider_a and provider_b', 'Only provider_a', 'None'],
        optsKn: ['ಮೂರೂ', 'provider_a ಮತ್ತು provider_b', 'provider_a ಮಾತ್ರ', 'ಯಾವುದೂ ಇಲ್ಲ'], correct: 2 },
      { q: 'Why does route.split("/", 1) use a maxsplit of 1?', qKn: 'route.split("/", 1) maxsplit 1 ಏಕೆ ಬಳಸುತ್ತದೆ?',
        opts: ['To make it faster', 'So a model name that itself contains a slash is not torn apart', 'Because providers never have slashes', 'To remove the provider name'],
        optsKn: ['ವೇಗಕ್ಕಾಗಿ', 'ತನ್ನೊಳಗೇ slash ಇರುವ model ಹೆಸರು ಹರಿದು ಹೋಗದಂತೆ', 'providers ಗೆ slash ಇರುವುದಿಲ್ಲ', 'provider ಹೆಸರು ತೆಗೆಯಲು'], correct: 1 },
    ] } },
  ],
};
