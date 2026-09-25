const phaseId = '6a369d5e66020ed05b3214c3'; // Phase 16: Tools and Protocols
const moduleId = '6a369d6066020ed05b321502'; // Module 270: LLM Routing Layer
const L = ['6ab6c1818afdbaf8a4c02590', '6ab6c1f1c78049fa230bbd54', '6ab6c27db216008e5f3698a9'];

const P = (part, order, difficulty, title, titleKn, problem, problemKn) => ({
  phaseId, moduleId, lessonId: L[part - 1], order, difficulty, title, titleKn, problem, problemKn,
});

module.exports = [
  // ── Part 1: Gateway foundations ──
  P(1, 1, 'beginner',
    'Add an Alias and Resolve It',
    'Alias ಸೇರಿಸಿ ಮತ್ತು ಪರಿಹರಿಸಿ',
    'The lesson built a ROUTES table and resolved an alias with split("/", 1).\n1. Add an alias "cheap_model" to ROUTES with two routes of your choice.\n2. Print its first choice and its fallbacks, then split the first route into provider and model.\n3. Why must an unknown alias raise KeyError instead of being routed somewhere by default?',
    'ಪಾಠ ROUTES ಕೋಷ್ಟಕ ನಿರ್ಮಿಸಿ split("/", 1) ಮೂಲಕ alias ಪರಿಹರಿಸಿತು.\n1. ROUTES ಗೆ ನಿಮ್ಮ ಆಯ್ಕೆಯ ಎರಡು routes ಇರುವ "cheap_model" alias ಸೇರಿಸಿ.\n2. ಅದರ ಮೊದಲ ಆಯ್ಕೆ ಮತ್ತು fallbacks ಮುದ್ರಿಸಿ, ಮೊದಲ route ಅನ್ನು provider ಮತ್ತು model ಆಗಿ ವಿಭಜಿಸಿ.\n3. ತಿಳಿಯದ alias ಅನ್ನು ಎಲ್ಲೋ ರೂಟ್ ಮಾಡುವ ಬದಲು KeyError ಎತ್ತಬೇಕು ಏಕೆ?'),
  P(1, 2, 'intermediate',
    'Reorder ROUTES Without Touching the Request',
    'Request ಮುಟ್ಟದೆ ROUTES ಮರುಕ್ರಮಿಸಿ',
    'The lesson showed the same request served by provider_a, then by provider_b after ROUTES was reordered.\n1. Reproduce this with route_request_v1 and CALL_LOG.\n2. Now make provider_b the primary for "fast_model" and prove with CALL_LOG that the change took effect.\n3. Explain what would have to change in every application if they called providers directly instead.',
    'ಒಂದೇ request ಅನ್ನು provider_a, ನಂತರ ROUTES ಮರುಕ್ರಮಿಸಿದ ಮೇಲೆ provider_b ಸೇವೆ ನೀಡಿದ್ದನ್ನು ಪಾಠ ತೋರಿಸಿತು.\n1. route_request_v1 ಮತ್ತು CALL_LOG ಬಳಸಿ ಇದನ್ನು ಪುನರುತ್ಪಾದಿಸಿ.\n2. "fast_model" ಗೆ provider_b ಪ್ರಾಥಮಿಕ ಮಾಡಿ, ಬದಲಾವಣೆ ಕೆಲಸ ಮಾಡಿದೆ ಎಂದು CALL_LOG ನಿಂದ ಸಾಬೀತುಪಡಿಸಿ.\n3. ಅನ್ವಯಗಳು providers ಅನ್ನು ನೇರವಾಗಿ ಕರೆದರೆ ಪ್ರತಿಯೊಂದರಲ್ಲಿ ಏನು ಬದಲಾಗಬೇಕಾಗುತ್ತಿತ್ತು ಎಂದು ವಿವರಿಸಿ.'),
  P(1, 3, 'advanced',
    'Design a Provider Adapter Boundary',
    'Provider Adapter ಗಡಿ ವಿನ್ಯಾಸಗೊಳಿಸಿ',
    'The router must not contain scattered if provider == "openai" ... elif ... branches.\n1. Write a registry ADAPTERS = {"provider_a": fn, ...} where each fn translates the common request and normalizes the reply to {"status", "content", "input_tokens", "output_tokens"}.\n2. Change call_provider to dispatch through the registry and make an unknown provider return a 500-class error rather than crash.\n3. Run the Part 1 outage demo again and show it still behaves the same.',
    'router ನಲ್ಲಿ ಹರಡಿದ if provider == "openai" ... elif ... ಶಾಖೆಗಳು ಇರಬಾರದು.\n1. ADAPTERS = {"provider_a": fn, ...} registry ಬರೆಯಿರಿ; ಪ್ರತಿ fn ಸಾಮಾನ್ಯ request ಅನುವಾದಿಸಿ ಪ್ರತಿಕ್ರಿಯೆಯನ್ನು {"status","content","input_tokens","output_tokens"} ಗೆ ಸಾಮಾನ್ಯೀಕರಿಸಬೇಕು.\n2. call_provider ಅನ್ನು registry ಮೂಲಕ ವಿತರಿಸುವಂತೆ ಬದಲಿಸಿ; ತಿಳಿಯದ provider ಕ್ರ್ಯಾಶ್ ಆಗದೆ 500-ವರ್ಗ ದೋಷ ಹಿಂತಿರುಗಿಸಲಿ.\n3. Part 1 outage ಡೆಮೊ ಮತ್ತೆ ಚಲಾಯಿಸಿ, ಅದೇ ವರ್ತನೆ ತೋರಿಸಿ.'),

  // ── Part 2: Reliability ──
  P(2, 1, 'beginner',
    'Trace a Fallback',
    'Fallback ಅನ್ನು ಅನುಸರಿಸಿ',
    'In the lesson a 503 at provider_a was absorbed and provider_b served the request in 2 attempts.\n1. Set OUTAGES["provider_a"] = 503, call route_request, and print provider, attempts, cost and CALL_LOG.\n2. Then also take provider_b down and predict the provider and attempts before running it.\n3. Why is the returned cost different from what provider_a would have charged?',
    'ಪಾಠದಲ್ಲಿ provider_a ನ 503 ಅನ್ನು ಹೀರಿಕೊಂಡು provider_b 2 ಪ್ರಯತ್ನಗಳಲ್ಲಿ ಸೇವೆ ನೀಡಿತು.\n1. OUTAGES["provider_a"] = 503 ಹೊಂದಿಸಿ route_request ಕರೆದು provider, attempts, cost, CALL_LOG ಮುದ್ರಿಸಿ.\n2. provider_b ಅನ್ನೂ ಡೌನ್ ಮಾಡಿ; ಚಲಾಯಿಸುವ ಮೊದಲು provider ಮತ್ತು attempts ಊಹಿಸಿ.\n3. ಹಿಂತಿರುಗಿದ cost provider_a ವಿಧಿಸುತ್ತಿದ್ದದ್ದಕ್ಕಿಂತ ಬೇರೆ ಏಕೆ?'),
  P(2, 2, 'intermediate',
    'Which Statuses Should Cascade?',
    'ಯಾವ Statuses ಕ್ಯಾಸ್ಕೇಡ್ ಆಗಬೇಕು?',
    'The lesson cascades 5xx, returns 4xx, and returns success on 2xx.\n1. Use OUTAGES to test 500, 503, 400 and 401 and record which providers CALL_LOG shows for each.\n2. Decide what a 429 (rate limited) should do and justify it; then implement it as a fallback and test it.\n3. Show that your change did not alter the 400 behaviour.',
    'ಪಾಠ 5xx ಕ್ಯಾಸ್ಕೇಡ್, 4xx ಹಿಂತಿರುಗಿಸಿ, 2xx ಯಶಸ್ಸು.\n1. OUTAGES ಬಳಸಿ 500, 503, 400, 401 ಪರೀಕ್ಷಿಸಿ ಮತ್ತು ಪ್ರತಿಯೊಂದಕ್ಕೆ CALL_LOG ದಾಖಲಿಸಿ.\n2. 429 ಏನು ಮಾಡಬೇಕು ಎಂದು ನಿರ್ಧರಿಸಿ ಸಮರ್ಥಿಸಿ; fallback ಆಗಿ ಅನುಷ್ಠಾನಿಸಿ ಪರೀಕ್ಷಿಸಿ.\n3. ನಿಮ್ಮ ಬದಲಾವಣೆ 400 ವರ್ತನೆಯನ್ನು ಬದಲಿಸಿಲ್ಲ ಎಂದು ತೋರಿಸಿ.'),
  P(2, 3, 'advanced',
    'Extend Redaction and Prove No Leak',
    'Redaction ವಿಸ್ತರಿಸಿ, ಸೋರಿಕೆ ಇಲ್ಲ ಎಂದು ಸಾಬೀತುಪಡಿಸಿ',
    'The lesson redacted SSNs by regex and showed the provider received only redacted text.\n1. Add email and 16-digit card patterns to redact_pii and test them, including a near-miss that must NOT be redacted.\n2. Use a capturing stub (like the lesson\'s spy) to prove that during a fallback from provider_a to provider_b neither provider saw the raw values.\n3. Verify the caller\'s original request list is unchanged, and state one input your regexes would still miss.',
    'ಪಾಠ regex ಮೂಲಕ SSN redact ಮಾಡಿ provider ಗೆ redact ಆದ ಪಠ್ಯ ಮಾತ್ರ ಸಿಕ್ಕಿತು ಎಂದು ತೋರಿಸಿತು.\n1. redact_pii ಗೆ email ಮತ್ತು 16-ಅಂಕಿ card patterns ಸೇರಿಸಿ ಪರೀಕ್ಷಿಸಿ; redact ಆಗಬಾರದ ಸಮೀಪದ ಉದಾಹರಣೆ ಸೇರಿಸಿ.\n2. ಸೆರೆಹಿಡಿಯುವ stub ಬಳಸಿ, provider_a ಇಂದ provider_b ಗೆ fallback ವೇಳೆ ಯಾವ provider ಗೂ ಮೂಲ ಮೌಲ್ಯ ಕಾಣಲಿಲ್ಲ ಎಂದು ಸಾಬೀತುಪಡಿಸಿ.\n3. ಕರೆದವರ ಮೂಲ request ಬದಲಾಗಿಲ್ಲ ಎಂದು ಪರಿಶೀಲಿಸಿ, ಮತ್ತು ನಿಮ್ಮ regex ತಪ್ಪಿಸುವ ಒಂದು ಇನ್‌ಪುಟ್ ತಿಳಿಸಿ.'),

  // ── Part 3: Production routing ──
  P(3, 1, 'beginner',
    'Cheapest Acceptable Model',
    'ಅಗ್ಗದ ಸ್ವೀಕಾರಾರ್ಹ Model',
    'The lesson filtered models by quality before choosing the cheapest.\n1. Using the models dictionary, print the selected model for quality thresholds 50, 75, 90 and 99.\n2. For which thresholds does the naive cheapest choice give a wrong answer?\n3. What should the router return when nobody qualifies, and why is a silent downgrade dangerous?',
    'ಪಾಠ ಅಗ್ಗದ್ದು ಆರಿಸುವ ಮೊದಲು quality ಮೂಲಕ models ಫಿಲ್ಟರ್ ಮಾಡಿತು.\n1. models dictionary ಬಳಸಿ quality ಮಿತಿ 50, 75, 90, 99 ಗೆ ಆಯ್ಕೆಯಾದ model ಮುದ್ರಿಸಿ.\n2. ಯಾವ ಮಿತಿಗಳಿಗೆ ಸರಳ ಅಗ್ಗದ ಆಯ್ಕೆ ತಪ್ಪು?\n3. ಯಾರೂ ಅರ್ಹರಲ್ಲದಿದ್ದರೆ router ಏನು ಹಿಂತಿರುಗಿಸಬೇಕು, ಮತ್ತು ಮೌನ downgrade ಅಪಾಯಕಾರಿ ಏಕೆ?'),
  P(3, 2, 'intermediate',
    'Mean vs Median Latency',
    'Mean vs Median Latency',
    'One 5000 ms sample moved the mean to 778.9 ms while the median stayed 310.\n1. Recompute both for your own list of ten samples with one spike.\n2. Build a rolling window of the last 5 samples and pick the fastest provider using the median. Show a case where using the last sample alone would flip the choice wrongly.\n3. What is the trade-off of a longer window?',
    'ಒಂದು 5000 ms sample mean ಅನ್ನು 778.9 ms ಗೆ ಬದಲಿಸಿತು, median 310 ಉಳಿಯಿತು.\n1. ಒಂದು spike ಇರುವ ನಿಮ್ಮ ಹತ್ತು samples ಗೆ ಎರಡನ್ನೂ ಮರುಲೆಕ್ಕ ಹಾಕಿ.\n2. ಕೊನೆಯ 5 samples ನ rolling window ಮಾಡಿ median ಬಳಸಿ ವೇಗದ provider ಆರಿಸಿ; ಕೊನೆಯ sample ಮಾತ್ರ ಬಳಸಿದರೆ ಆಯ್ಕೆ ತಪ್ಪಾಗಿ ಬದಲಾಗುವ ಸಂದರ್ಭ ತೋರಿಸಿ.\n3. ಉದ್ದದ window ನ ಸಮಸ್ಯೆ-ಲಾಭ ಏನು?'),
  P(3, 3, 'advanced',
    'Scoped Semantic Cache Under Attack',
    'Scoped Semantic Cache ಪರೀಕ್ಷೆ',
    'The lesson genuinely showed an unscoped toy semantic cache returning Alice\'s balance to Bob.\n1. Re-run the SemanticCache from the lesson unscoped and scoped and confirm the leak and the fix.\n2. Raise the threshold above 0.8 and show what happens to the leak and to the hit rate on harmless paraphrases. Why is a higher threshold NOT a fix for the leak?\n3. Propose which requests should never be cached at all, and what the cache key should contain for the rest.',
    'ಪಾಠ unscoped ಆಟಿಕೆ semantic cache Bob ಗೆ Alice ನ ಬಾಕಿ ಹಿಂತಿರುಗಿಸಿದ್ದನ್ನು ನಿಜವಾಗಿ ತೋರಿಸಿತು.\n1. ಪಾಠದ SemanticCache ಅನ್ನು unscoped ಮತ್ತು scoped ಚಲಾಯಿಸಿ ಸೋರಿಕೆ ಮತ್ತು ಪರಿಹಾರ ದೃಢೀಕರಿಸಿ.\n2. ಮಿತಿಯನ್ನು 0.8 ಕ್ಕಿಂತ ಹೆಚ್ಚಿಸಿ, ಸೋರಿಕೆ ಮತ್ತು ನಿರುಪದ್ರವಿ ಪದಬದಲಾವಣೆಗಳ hit rate ಗೆ ಏನಾಗುತ್ತದೆ ತೋರಿಸಿ. ಹೆಚ್ಚಿನ ಮಿತಿ ಸೋರಿಕೆಗೆ ಪರಿಹಾರ ಅಲ್ಲ ಏಕೆ?\n3. ಯಾವ requests ಅನ್ನು ಎಂದಿಗೂ cache ಮಾಡಬಾರದು, ಉಳಿದವಕ್ಕೆ cache key ನಲ್ಲಿ ಏನಿರಬೇಕು ಎಂದು ಸೂಚಿಸಿ.'),
];
