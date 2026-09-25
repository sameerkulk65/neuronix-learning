const phaseId = '6a369d5e66020ed05b3214c3';
const moduleId = '6a369d6066020ed05b321502'; // Module 270: LLM Routing Layer

const H1 = (en, kn) => ({ type: 'heading', data: { textEn: en, textKn: kn || en, level: 'H1' } });
const H2 = (en, kn) => ({ type: 'heading', data: { textEn: en, textKn: kn || en, level: 'H2' } });
const C = (he, hk, be, bk) => ({ type: 'concept', data: { headingEn: he, headingKn: hk, bodyEn: be, bodyKn: bk } });
const CODE = (file, he, hk, de, dk, code) => ({ type: 'code', data: { filename: file, headingEn: he, headingKn: hk, descEn: de, descKn: dk, code } });
const OUT = (o) => ({ type: 'output', data: { output: o } });
const TBL = (he, headers, rows) => ({ type: 'table', data: { headingEn: he, headers, rows } });

const ROUTER = `import re

SSN_PATTERN = re.compile(r"\\b\\d{3}-\\d{2}-\\d{4}\\b")

def redact_pii(text):
    return SSN_PATTERN.sub("[REDACTED]", text)

def redact_messages(messages):
    return [{"role": m["role"], "content": redact_pii(m["content"])} for m in messages]

PRICES = {
    "provider_a/smart-model": {"input": 0.000003, "output": 0.000015},
    "provider_b/smart-model": {"input": 0.000002, "output": 0.000010},
    "provider_c/smart-model": {"input": 0.000001, "output": 0.000008},
}

def calculate_cost(route, input_tokens, output_tokens):
    p = PRICES[route]
    return input_tokens * p["input"] + output_tokens * p["output"]

MAX_ATTEMPTS = 3

def route_request(request, max_attempts=MAX_ATTEMPTS):
    alias = request["model"]
    safe_messages = redact_messages(request["messages"])
    attempts = 0
    for route in ROUTES[alias]:
        if attempts >= max_attempts:
            break
        attempts += 1
        provider, model = route.split("/", 1)
        response = call_provider(provider, model, safe_messages)
        status = response["status"]
        if 500 <= status < 600:
            continue
        if 200 <= status < 300:
            cost = calculate_cost(route, response["input_tokens"], response["output_tokens"])
            return {"alias": alias, "provider": provider, "model": model,
                    "content": response["content"],
                    "input_tokens": response["input_tokens"],
                    "output_tokens": response["output_tokens"],
                    "attempts": attempts, "cost": round(cost, 8)}
        return response          # 4xx: do not blindly cascade
    raise RuntimeError("All providers failed")`;

module.exports = {
  phaseId,
  moduleId,
  order: 1,
  type: 'interactive',
  duration: 50,
  difficulty: 'intermediate',
  status: 'published',
  title: 'LLM Routing Layer — LiteLLM, OpenRouter, Portkey (Part 2 of 3) — Fallbacks, Retries, PII Redaction, and Cost Tracking',
  titleKn: 'LLM Routing Layer — LiteLLM, OpenRouter, Portkey (Part 2 of 3) — Fallbacks, Retries, PII Redaction, ಮತ್ತು Cost Tracking',
  desc: 'Turn the routes[0] proxy into a reliable gateway: a fallback loop that treats 5xx and 4xx differently, an attempt budget, PII redaction before any provider sees the prompt, and per-route cost tracking -- all verified with real runs.',
  descKn: 'routes[0] proxy ಅನ್ನು ವಿಶ್ವಾಸಾರ್ಹ gateway ಆಗಿ ಪರಿವರ್ತಿಸಿ: 5xx ಮತ್ತು 4xx ಗಳನ್ನು ಬೇರೆ ರೀತಿ ನಿರ್ವಹಿಸುವ fallback loop, attempt budget, provider ಗೆ ಮೊದಲು PII redaction, ಪ್ರತಿ route cost tracking -- ಎಲ್ಲವೂ ನಿಜ run ಗಳಿಂದ ಪರಿಶೀಲಿಸಲ್ಪಟ್ಟಿವೆ.',
  objectives: [
    'Genuinely build a fallback loop that walks the ROUTES chain and returns the first successful response.',
    'Explain why 5xx errors trigger a fallback but 4xx errors are returned to the caller instead of cascaded.',
    'Genuinely demonstrate that an attempt budget bounds the cascade, and that exhausting the chain raises a terminal error.',
    'Genuinely redact PII before any provider call, without mutating the caller\'s original request.',
    'Compute cost with the provider that actually served the request, and aggregate it by team, provider and alias.',
  ],
  objectivesKn: [
    'ROUTES ಸರಪಳಿಯ ಮೂಲಕ ಹೋಗಿ ಮೊದಲ ಯಶಸ್ವಿ ಪ್ರತಿಕ್ರಿಯೆ ಹಿಂತಿರುಗಿಸುವ fallback loop ನಿರ್ಮಿಸಿ.',
    '5xx fallback ಗೆ ಕಾರಣ ಆದರೆ 4xx ಕ್ಯಾಸ್ಕೇಡ್ ಆಗದೆ ಕರೆದವರಿಗೆ ಹಿಂತಿರುಗುತ್ತದೆ ಏಕೆ ಎಂದು ವಿವರಿಸಿ.',
    'attempt budget ಕ್ಯಾಸ್ಕೇಡ್ ಅನ್ನು ಮಿತಗೊಳಿಸುತ್ತದೆ ಎಂದು ಪ್ರದರ್ಶಿಸಿ.',
    'ಯಾವುದೇ provider ಕರೆಗೆ ಮೊದಲು PII ಅನ್ನು redact ಮಾಡಿ, ಮೂಲ request ಅನ್ನು ಬದಲಿಸದೆ.',
    'ವಾಸ್ತವವಾಗಿ ಸೇವೆ ನೀಡಿದ provider ನ ಬೆಲೆಯಲ್ಲಿ cost ಲೆಕ್ಕ ಹಾಕಿ ಮತ್ತು ತಂಡ, provider, alias ಪ್ರಕಾರ ಒಟ್ಟುಗೂಡಿಸಿ.',
  ],
  blocks: [
    H1('LLM Routing Layer — LiteLLM, OpenRouter, Portkey (Part 2 of 3)'),
    C('Lesson Info', 'Lesson ಮಾಹಿತಿ',
      '• Type: Build · Language: Python (stdlib only) · Prerequisites: Part 1 · Time: ~50 minutes · Part 2 of 3. Providers are simulated stubs, so every outage and price below is deterministic. All outputs shown were produced by genuinely running this code.',
      '• Type: Build · Language: Python (stdlib only) · Prerequisites: Part 1 · Time: ~50 ನಿಮಿಷಗಳು · Part 2 of 3. Providers ಅನುಕರಿತ stubs. ತೋರಿಸಿದ ಎಲ್ಲಾ outputs ಈ ಕೋಡ್ ಅನ್ನು ನಿಜವಾಗಿ ಚಲಾಯಿಸಿ ಪಡೆದವು.'),

    H2('The Fallback Loop', 'Fallback Loop'),
    C('From Proxy to Gateway', 'Proxy ಇಂದ Gateway ಗೆ',
      'Part 1 ended with a router that used only routes[0]. The reliability upgrade is one idea: iterate over the whole ROUTES chain, and stop at the first success. The same alias, the same request, but now a provider outage is absorbed inside the gateway instead of reaching the user.',
      'Part 1 routes[0] ಮಾತ್ರ ಬಳಸುವ router ನೊಂದಿಗೆ ಮುಗಿಯಿತು. ವಿಶ್ವಾಸಾರ್ಹತೆಯ ಸುಧಾರಣೆ: ಇಡೀ ROUTES ಸರಪಳಿಯ ಮೇಲೆ ಲೂಪ್ ಮಾಡಿ, ಮೊದಲ ಯಶಸ್ಸಿನಲ್ಲಿ ನಿಲ್ಲಿ.'),
    CODE('router.py', 'The complete fallback router', 'ಸಂಪೂರ್ಣ fallback router',
      'Read it once top to bottom: redact first, then walk the chain, treat 5xx as "try the next", 2xx as "normalize, price and return", and anything else as "hand it back". The attempts counter and MAX_ATTEMPTS are the budget.',
      'ಒಮ್ಮೆ ಮೇಲಿನಿಂದ ಕೆಳಗೆ ಓದಿ: ಮೊದಲು redact, ನಂತರ ಸರಪಳಿ, 5xx = ಮುಂದಿನದು, 2xx = ಸಾಮಾನ್ಯೀಕರಿಸಿ ಹಿಂತಿರುಗಿಸಿ, ಉಳಿದದ್ದು = ಹಿಂತಿರುಗಿಸಿ.',
      ROUTER),
    OUT('(definitions only: no output yet)'),

    CODE('router.py', 'A healthy request', 'ಆರೋಗ್ಯಕರ request',
      'With every provider healthy the first route serves the request in one attempt, and the response carries the cost of the route that served it.',
      'ಎಲ್ಲಾ providers ಆರೋಗ್ಯಕರ ಆದಾಗ ಮೊದಲ route ಒಂದೇ ಪ್ರಯತ್ನದಲ್ಲಿ ಸೇವೆ ನೀಡುತ್ತದೆ.',
      'reset()\nr = route_request(sample_request())\nprint(r)\nprint("providers called:", CALL_LOG)'),
    OUT("{'alias': 'our_smart_model', 'provider': 'provider_a', 'model': 'smart-model', 'content': 'Response from provider_a/smart-model', 'input_tokens': 100, 'output_tokens': 25, 'attempts': 1, 'cost': 0.000675}\nproviders called: ['provider_a/smart-model']"),

    CODE('router.py', 'Primary outage: 503, continue, next provider', 'ಪ್ರಾಥಮಿಕ outage: 503, continue, ಮುಂದಿನ provider',
      'provider_a returns 503, the loop hits continue, and provider_b serves the same request. The user never sees the failure. Note that attempts is 2 and the cost is provider_b\'s price.',
      'provider_a 503 ಹಿಂತಿರುಗಿಸುತ್ತದೆ, loop continue ಮಾಡುತ್ತದೆ, provider_b ಅದೇ request ಗೆ ಸೇವೆ ನೀಡುತ್ತದೆ.',
      'reset(); OUTAGES["provider_a"] = 503\nr = route_request(sample_request())\nprint("served by:", r["provider"], "| attempts:", r["attempts"], "| cost:", r["cost"])\nprint("providers called:", CALL_LOG)'),
    OUT("served by: provider_b | attempts: 2 | cost: 0.00045\nproviders called: ['provider_a/smart-model', 'provider_b/smart-model']"),

    CODE('router.py', 'Two outages, then every provider down', 'ಎರಡು outages, ನಂತರ ಎಲ್ಲಾ providers ಡೌನ್',
      'Two failed providers push the request to the third. If all three fail there is nothing left to try, so the gateway raises one clear terminal error rather than returning a misleading partial answer.',
      'ಎರಡು ವಿಫಲ providers request ಅನ್ನು ಮೂರನೆಯದಕ್ಕೆ ತಳ್ಳುತ್ತವೆ. ಮೂರೂ ವಿಫಲವಾದರೆ ಸ್ಪಷ್ಟ terminal error.',
      'reset(); OUTAGES["provider_a"] = 503; OUTAGES["provider_b"] = 503\nr = route_request(sample_request())\nprint("served by:", r["provider"], "| attempts:", r["attempts"], "| called:", CALL_LOG)\n\nreset()\nfor p in ("provider_a", "provider_b", "provider_c"):\n    OUTAGES[p] = 503\ntry:\n    route_request(sample_request())\nexcept RuntimeError as e:\n    print("RuntimeError:", e, "| called:", CALL_LOG)'),
    OUT("served by: provider_c | attempts: 3 | called: ['provider_a/smart-model', 'provider_b/smart-model', 'provider_c/smart-model']\nRuntimeError: All providers failed | called: ['provider_a/smart-model', 'provider_b/smart-model', 'provider_c/smart-model']"),

    H2('5xx Falls Back, 4xx Does Not', '5xx Fallback ಆಗುತ್ತದೆ, 4xx ಆಗುವುದಿಲ್ಲ'),
    TBL('Why the status class decides the action', ['Status', 'Meaning', 'Router action'], [
      ['5xx', 'The provider failed; the request may be fine', 'continue to the next route'],
      ['2xx', 'Success', 'normalize, price, return'],
      ['4xx', 'The request itself is wrong (bad input, auth)', 'return it; do not cascade'],
    ]),
    C('Do Not Blindly Cascade a 400', 'ಕ್ಷಮಿಸಲಾಗದ 400 ಅನ್ನು ಕುರುಡಾಗಿ ಕ್ಯಾಸ್ಕೇಡ್ ಮಾಡಬೇಡಿ',
      'A 400 means the request is malformed. Sending the same broken request to two more providers wastes money and latency and just produces three 400s. The caller needs the error so they can fix the request.',
      '400 ಎಂದರೆ request ತಪ್ಪು. ಅದೇ ತಪ್ಪು request ಅನ್ನು ಇನ್ನೂ ಎರಡು providers ಗೆ ಕಳುಹಿಸುವುದು ಹಣ ಮತ್ತು ಸಮಯ ವ್ಯರ್ಥ.'),
    CODE('router.py', 'A 400 stops the chain', '400 ಸರಪಳಿಯನ್ನು ನಿಲ್ಲಿಸುತ್ತದೆ',
      'provider_a answers 400. The router returns it immediately: only one provider was called.',
      'provider_a 400 ಉತ್ತರಿಸುತ್ತದೆ. router ತಕ್ಷಣ ಹಿಂತಿರುಗಿಸುತ್ತದೆ: ಒಂದೇ provider ಕರೆಯಲ್ಪಟ್ಟಿತು.',
      'reset(); OUTAGES["provider_a"] = 400\nr = route_request(sample_request())\nprint("returned:", r, "| providers called:", CALL_LOG)'),
    OUT("returned: {'status': 400, 'error': 'simulated failure'} | providers called: ['provider_a/smart-model']"),

    H2('The Attempt Budget', 'Attempt Budget'),
    C('Bound the Cascade', 'ಕ್ಯಾಸ್ಕೇಡ್ ಅನ್ನು ಮಿತಗೊಳಿಸಿ',
      'A long chain plus per-provider retries can multiply into many downstream calls for one user request. max_attempts caps total provider calls, protecting latency, cost and the providers themselves from a retry storm.',
      'ಉದ್ದ ಸರಪಳಿ ಮತ್ತು ಪ್ರತಿ provider retries ಒಂದು user request ಗೆ ಅನೇಕ downstream ಕರೆಗಳಾಗಬಹುದು. max_attempts ಒಟ್ಟು ಕರೆಗಳನ್ನು ಮಿತಗೊಳಿಸುತ್ತದೆ.'),
    CODE('router.py', 'The same outage, two different budgets', 'ಒಂದೇ outage, ಎರಡು ಬೇರೆ budgets',
      'With provider_a and provider_b down, a budget of 2 gives up before reaching healthy provider_c; a budget of 3 reaches it. The budget is a policy trade-off between availability and blast radius.',
      'provider_a ಮತ್ತು provider_b ಡೌನ್ ಆದಾಗ, budget 2 ಆರೋಗ್ಯಕರ provider_c ತಲುಪುವ ಮೊದಲು ಕೈಬಿಡುತ್ತದೆ; budget 3 ತಲುಪುತ್ತದೆ.',
      'for budget in (2, 3):\n    reset(); OUTAGES["provider_a"] = 503; OUTAGES["provider_b"] = 503\n    try:\n        r = route_request(sample_request(), max_attempts=budget)\n        print(f"budget={budget} ->", r["provider"], "| called:", CALL_LOG)\n    except RuntimeError as e:\n        print(f"budget={budget} ->", e, "| called:", CALL_LOG)'),
    OUT("budget=2 -> All providers failed | called: ['provider_a/smart-model', 'provider_b/smart-model']\nbudget=3 -> provider_c | called: ['provider_a/smart-model', 'provider_b/smart-model', 'provider_c/smart-model']"),
    CODE('router.py', 'Why retries multiply', 'Retries ಏಕೆ ಗುಣಿಸುತ್ತವೆ',
      'Five providers with three retries each can mean fifteen downstream attempts for one request. A global budget of three keeps it bounded.',
      'ಐದು providers, ಪ್ರತಿಯೊಂದಕ್ಕೆ ಮೂರು retries = ಒಂದು request ಗೆ ಹದಿನೈದು ಪ್ರಯತ್ನಗಳು.',
      'providers, retries = 5, 3\nprint(f"{providers} providers x {retries} retries each = {providers*retries} downstream attempts for ONE user request")\nprint("with a budget of 3:", ["A#1", "A#2", "A#3"])'),
    OUT("5 providers x 3 retries each = 15 downstream attempts for ONE user request\nwith a budget of 3: ['A#1', 'A#2', 'A#3']"),

    H2('PII Redaction Before Routing', 'Routing ಗೆ ಮೊದಲು PII Redaction'),
    C('Redact Once, at the Gateway', 'ಗೇಟ್‌ವೇಯಲ್ಲಿ ಒಮ್ಮೆ Redact ಮಾಡಿ',
      'Because every request passes through the gateway, it is the natural place for a privacy guardrail. Redacting before the first provider call means no provider, primary or fallback, ever receives the sensitive value. The redaction function builds new message dictionaries, so the caller\'s original request is untouched.',
      'ಪ್ರತಿ request gateway ಮೂಲಕ ಹಾದುಹೋಗುವುದರಿಂದ ಗೌಪ್ಯತೆ guardrail ಗೆ ಇದು ಸರಿಯಾದ ಸ್ಥಳ. ಮೊದಲ provider ಕರೆಗೆ ಮೊದಲು redact ಮಾಡಿದರೆ ಯಾವ provider ಗೂ ಸೂಕ್ಷ್ಮ ಮೌಲ್ಯ ತಲುಪುವುದಿಲ್ಲ.'),
    CODE('router.py', 'Redaction, its limits, and immutability', 'Redaction, ಅದರ ಮಿತಿಗಳು, ಮತ್ತು immutability',
      'The pattern matches the exact shape 3-2-4 digits. Look at the second line: near-miss shapes are deliberately left alone, which shows both the precision and the limitation of regex-based redaction.',
      'ಮಾದರಿ ನಿಖರವಾಗಿ 3-2-4 ಅಂಕೆಗಳ ಆಕಾರಕ್ಕೆ ಹೊಂದುತ್ತದೆ. ಎರಡನೇ ಸಾಲು: ಸಮೀಪದ ಆಕಾರಗಳನ್ನು ಬಿಡಲಾಗಿದೆ.',
      'print(redact_pii("My SSN is 123-45-6789. Help me fill out this form."))\nprint("not matched (wrong shape):", redact_pii("Order 1234-56-7890 and 12-345-6789 stay"))\nprint("two SSNs:", redact_pii("A 111-22-3333 and B 444-55-6666"))\n\noriginal = [{"role": "system", "content": "You are a helpful assistant."}, {"role": "user", "content": "My SSN is 123-45-6789."}]\nprint(redact_messages(original))\nprint("original untouched:", original[1]["content"])'),
    OUT("My SSN is [REDACTED]. Help me fill out this form.\nnot matched (wrong shape): Order 1234-56-7890 and 12-345-6789 stay\ntwo SSNs: A [REDACTED] and B [REDACTED]\n[{'role': 'system', 'content': 'You are a helpful assistant.'}, {'role': 'user', 'content': 'My SSN is [REDACTED].'}]\noriginal untouched: My SSN is 123-45-6789."),
    CODE('router.py', 'What the provider actually received', 'Provider ವಾಸ್ತವವಾಗಿ ಏನು ಪಡೆಯಿತು',
      'A capturing stub records the messages it is handed. Through the full router the provider sees the redacted text only.',
      'ಸೆರೆಹಿಡಿಯುವ stub ತನಗೆ ನೀಡಿದ ಸಂದೇಶಗಳನ್ನು ದಾಖಲಿಸುತ್ತದೆ. ಪೂರ್ಣ router ಮೂಲಕ provider ಗೆ redact ಆದ ಪಠ್ಯ ಮಾತ್ರ ಕಾಣುತ್ತದೆ.',
      'seen = []\n_orig = call_provider\ndef spy(provider, model, messages):\n    seen.append(messages[-1]["content"]); return _orig(provider, model, messages)\ncall_provider = spy\nroute_request(sample_request("Process SSN 123-45-6789"))\ncall_provider = _orig\nprint("what the provider actually received:", seen)'),
    OUT("what the provider actually received: ['Process SSN [REDACTED]']"),
    C('Regex Is a Floor, Not a Ceiling', 'Regex ಕೆಳಮಟ್ಟ, ಮೇಲಿನ ಮಿತಿ ಅಲ್ಲ',
      'A regex catches known shapes only. Real deployments add more patterns (emails, cards, phones) and often a dedicated PII detector. Treat this as the mechanism (redact before routing) rather than a complete privacy solution.',
      'regex ತಿಳಿದ ಆಕಾರಗಳನ್ನು ಮಾತ್ರ ಹಿಡಿಯುತ್ತದೆ. ನಿಜ ನಿಯೋಜನೆಗಳು ಹೆಚ್ಚಿನ patterns ಮತ್ತು ಮೀಸಲಾದ PII detector ಸೇರಿಸುತ್ತವೆ.'),

    H2('Cost Tracking', 'Cost Tracking'),
    C('Price the Route That Actually Served', 'ವಾಸ್ತವವಾಗಿ ಸೇವೆ ನೀಡಿದ Route ಗೆ ಬೆಲೆ ಹಾಕಿ',
      'cost = input_tokens x input_price + output_tokens x output_price, using the price of the route that answered. A common bug is to price at the primary route\'s rate after a fallback happened; the run below shows the difference.',
      'cost = input_tokens x input_price + output_tokens x output_price, ಉತ್ತರಿಸಿದ route ನ ಬೆಲೆಯೊಂದಿಗೆ. ಫಾಲ್‌ಬ್ಯಾಕ್ ನಂತರ ಪ್ರಾಥಮಿಕ route ಬೆಲೆಯಲ್ಲಿ ಲೆಕ್ಕ ಹಾಕುವುದು ಸಾಮಾನ್ಯ ದೋಷ.'),
    CODE('router.py', 'The cost formula and the fallback pricing bug', 'Cost ಸೂತ್ರ ಮತ್ತು fallback ಬೆಲೆ ದೋಷ',
      'A 1000-in / 250-out request at provider_a prices, then the same 100/25 request after a fallback priced correctly versus incorrectly.',
      '1000-in / 250-out request provider_a ಬೆಲೆಯಲ್ಲಿ, ನಂತರ ಫಾಲ್‌ಬ್ಯಾಕ್ ನಂತರ ಸರಿಯಾದ ಮತ್ತು ತಪ್ಪಾದ ಬೆಲೆ.',
      'print("1000 in x 0.000003 + 250 out x 0.000015 =", calculate_cost("provider_a/smart-model", 1000, 250))\n\nreset(); OUTAGES["provider_a"] = 503\nr = route_request(sample_request())\nwrong = calculate_cost("provider_a/smart-model", r["input_tokens"], r["output_tokens"])\nright = calculate_cost("provider_b/smart-model", r["input_tokens"], r["output_tokens"])\nprint("cost if billed at provider_a prices (WRONG):", round(wrong, 8), "| at provider_b prices (RIGHT):", round(right, 8), "| recorded:", r["cost"])'),
    OUT("1000 in x 0.000003 + 250 out x 0.000015 = 0.00675\ncost if billed at provider_a prices (WRONG): 0.000675 | at provider_b prices (RIGHT): 0.00045 | recorded: 0.00045"),
    CODE('router.py', 'Aggregating spend by team, provider and alias', 'ತಂಡ, provider, alias ಪ್ರಕಾರ ಖರ್ಚು ಒಟ್ಟುಗೂಡಿಸುವುದು',
      'Each response carries its cost, so a simple log can be summed along any dimension. The fallbacks-used count is a health signal: a rising number means the primary is degrading.',
      'ಪ್ರತಿ ಪ್ರತಿಕ್ರಿಯೆ ತನ್ನ cost ಅನ್ನು ಹೊಂದಿದೆ, ಆದ್ದರಿಂದ ಯಾವುದೇ ಆಯಾಮದಲ್ಲಿ ಮೊತ್ತ ಮಾಡಬಹುದು.',
      '# per-request records were logged as (team, response) pairs; then:\nfrom collections import defaultdict\nby_team, by_provider = defaultdict(float), defaultdict(float)\nfor team, r in usage_log:\n    by_team[team] += r["cost"]; by_provider[r["provider"]] += r["cost"]\nprint("by team:", {k: round(v, 8) for k, v in by_team.items()})\nprint("by provider:", {k: round(v, 8) for k, v in by_provider.items()})\nprint("fallbacks used:", sum(1 for _, r in usage_log if r["attempts"] > 1), "of", len(usage_log))'),
    OUT("by team: {'search': 0.001125, 'support': 0.00045, 'research': 0.000675}\nby provider: {'provider_a': 0.00135, 'provider_b': 0.0009}\nfallbacks used: 2 of 4"),

    C('Key Takeaways', 'ಮುಖ್ಯ ಅಂಶಗಳು',
      '• A fallback loop over ROUTES turns a proxy into a gateway: a 503 at provider_a was absorbed and provider_b served the same request in 2 attempts.\n• 5xx cascades; 4xx is returned. We genuinely saw a 400 stop after one provider.\n• When every provider fails, raise one clear terminal error.\n• An attempt budget bounds the cascade: budget 2 failed, budget 3 succeeded under the identical outage; 5 providers x 3 retries would be 15 attempts.\n• PII is redacted before the first provider call, without mutating the caller\'s request, and near-miss shapes are not matched (regex limits).\n• Price the route that actually served: 0.00045 (right) versus 0.000675 (wrong) after a fallback.',
      '• ROUTES ಮೇಲಿನ fallback loop proxy ಅನ್ನು gateway ಮಾಡುತ್ತದೆ.\n• 5xx ಕ್ಯಾಸ್ಕೇಡ್ ಆಗುತ್ತದೆ; 4xx ಹಿಂತಿರುಗುತ್ತದೆ.\n• ಎಲ್ಲಾ providers ವಿಫಲವಾದರೆ ಒಂದು ಸ್ಪಷ್ಟ terminal error.\n• attempt budget ಕ್ಯಾಸ್ಕೇಡ್ ಅನ್ನು ಮಿತಗೊಳಿಸುತ್ತದೆ.\n• ಮೊದಲ provider ಕರೆಗೆ ಮೊದಲು PII redact.\n• ಸೇವೆ ನೀಡಿದ route ಗೆ ಬೆಲೆ ಹಾಕಿ.'),

    { type: 'quiz', data: { questions: [
      { q: 'provider_a returns 503. What should the fallback router do?', qKn: 'provider_a 503 ಹಿಂತಿರುಗಿಸಿದರೆ fallback router ಏನು ಮಾಡಬೇಕು?',
        opts: ['Return the 503 to the user', 'continue to the next route in the chain', 'Retry provider_a forever', 'Delete the alias'],
        optsKn: ['503 ಅನ್ನು ಬಳಕೆದಾರರಿಗೆ ಹಿಂತಿರುಗಿಸಿ', 'ಸರಪಳಿಯ ಮುಂದಿನ route ಗೆ continue', 'provider_a ಅನ್ನು ಶಾಶ್ವತವಾಗಿ ಮರುಪ್ರಯತ್ನಿಸಿ', 'alias ಅಳಿಸಿ'], correct: 1 },
      { q: 'Why is a 400 returned rather than sent to the next provider?', qKn: '400 ಅನ್ನು ಮುಂದಿನ provider ಗೆ ಕಳುಹಿಸದೆ ಹಿಂತಿರುಗಿಸುವುದು ಏಕೆ?',
        opts: ['400 means the provider is down', 'The request itself is malformed, so other providers would fail too and waste money and time', 'Because 400 is a success', 'To hide the error'],
        optsKn: ['400 ಎಂದರೆ provider ಡೌನ್', 'request ತಪ್ಪು, ಆದ್ದರಿಂದ ಇತರ providers ಸಹ ವಿಫಲ ಮತ್ತು ವ್ಯರ್ಥ', '400 ಯಶಸ್ಸು', 'ದೋಷ ಮರೆಮಾಡಲು'], correct: 1 },
      { q: 'In the run, providers A and B were down. Budget 2 vs budget 3 gave what?', qKn: 'run ನಲ್ಲಿ A ಮತ್ತು B ಡೌನ್. Budget 2 vs 3 ಏನು ಕೊಟ್ಟಿತು?',
        opts: ['Both succeeded', 'Budget 2 raised "All providers failed"; budget 3 reached provider_c', 'Both failed', 'Budget 2 succeeded, 3 failed'],
        optsKn: ['ಎರಡೂ ಯಶಸ್ವಿ', 'Budget 2 "All providers failed"; budget 3 provider_c ತಲುಪಿತು', 'ಎರಡೂ ವಿಫಲ', 'Budget 2 ಯಶಸ್ವಿ, 3 ವಿಫಲ'], correct: 1 },
      { q: 'Why redact PII in the gateway before the first provider call?', qKn: 'ಮೊದಲ provider ಕರೆಗೆ ಮೊದಲು gateway ನಲ್ಲಿ PII redact ಏಕೆ?',
        opts: ['So no provider, including fallbacks, ever receives the sensitive value', 'To make responses faster', 'Because providers require it', 'To change the alias'],
        optsKn: ['ಫಾಲ್‌ಬ್ಯಾಕ್ ಸೇರಿದಂತೆ ಯಾವ provider ಗೂ ಸೂಕ್ಷ್ಮ ಮೌಲ್ಯ ತಲುಪದಿರಲು', 'ವೇಗಕ್ಕಾಗಿ', 'providers ಗೆ ಅಗತ್ಯ', 'alias ಬದಲಿಸಲು'], correct: 0 },
      { q: 'After a fallback to provider_b, which price should the cost use?', qKn: 'provider_b ಗೆ fallback ನಂತರ cost ಯಾವ ಬೆಲೆ ಬಳಸಬೇಕು?',
        opts: ['provider_a (the primary)', 'provider_b, the route that actually served the request', 'The average of all', 'Zero'],
        optsKn: ['provider_a (ಪ್ರಾಥಮಿಕ)', 'provider_b, ವಾಸ್ತವವಾಗಿ ಸೇವೆ ನೀಡಿದ route', 'ಎಲ್ಲದರ ಸರಾಸರಿ', 'ಶೂನ್ಯ'], correct: 1 },
    ] } },
  ],
};
