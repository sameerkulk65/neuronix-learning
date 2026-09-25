module.exports = {
 "phaseId": "6a369d5e66020ed05b3214c3",
 "moduleId": "6ab6d18eb7119db96ad77967",
 "order": 1,
 "type": "interactive",
 "duration": 55,
 "difficulty": "advanced",
 "status": "published",
 "title": "Skill Permissions, Sandboxes, and Trust (Part 2 of 3) — Structured Action Review: Commands, Paths, Secrets, Network and Approval",
 "titleKn": "Skill Permissions, Sandboxes, ಮತ್ತು Trust (Part 2 of 3) — ರಚನಾತ್ಮಕ Action Review: Commands, Paths, Secrets, Network, Approval",
 "desc": "Build and run a non-executing action reviewer: command inspection on argv, resolved path containment, HTTPS origin normalization and egress allowlists, secret handling and environment allowlists, and approvals bound to one exact action. Every decision printed is real.",
 "descKn": "ಚಲಾಯಿಸದ action reviewer ನಿರ್ಮಿಸಿ ಚಲಾಯಿಸಿ: argv ಮೇಲೆ command ಪರಿಶೀಲನೆ, resolved path containment, HTTPS origin, secrets, ಮತ್ತು ನಿರ್ದಿಷ್ಟ ಕ್ರಿಯೆಗೆ ಬಂಧಿತ ಅನುಮೋದನೆ.",
 "objectives": [
  "Explain why shell=False is a starting point and not a complete command policy, and inspect argv for executable, script and inline-code flags.",
  "Resolve paths before checking containment and defeat traversal and link escapes.",
  "Normalize HTTPS origins (scheme, host, effective port, IDNA, IP literals) and enforce an egress allowlist independent of filesystem policy.",
  "Keep secrets out with an environment allowlist and treat pattern detection as a limited signal.",
  "Bind approval to one exact action and produce ALLOW, ASK and DENY correctly for seven scenarios."
 ],
 "objectivesKn": [
  "shell=False ಆರಂಭ ಮಾತ್ರ ಎಂದು ವಿವರಿಸಿ.",
  "resolve ಮಾಡಿ containment ಪರಿಶೀಲಿಸಿ.",
  "HTTPS origins ಸಾಮಾನ್ಯೀಕರಿಸಿ.",
  "environment allowlist ಬಳಸಿ.",
  "ಅನುಮೋದನೆಯನ್ನು ನಿರ್ದಿಷ್ಟ ಕ್ರಿಯೆಗೆ ಬಂಧಿಸಿ."
 ],
 "blocks": [
  {
   "type": "heading",
   "data": {
    "textEn": "Skill Permissions, Sandboxes, and Trust (Part 2 of 3)",
    "textKn": "Skill Permissions, Sandboxes, and Trust (Part 2 of 3)",
    "level": "H1"
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "Lesson Info",
    "headingKn": "Lesson ಮಾಹಿತಿ",
    "bodyEn": "• Type: Build · Language: Python (stdlib only) · Time: ~50 minutes. The source names its main.py components (Verdict, SandboxPolicy, ActionRequest, ReviewDecision, normalize_https_origin, normalize_workspace_path, inspect_command, contains_secret, review_action) but does not include the code. Everything here is our own teaching implementation. The reviewer is non-executing: it classifies proposed actions and never runs them. Every output shown was genuinely produced by running the lab in temporary directories. The Docker sandbox drill from the source was NOT run: the Docker daemon was not running on this machine, so that part is shown as a reference and clearly marked.",
    "bodyKn": "• Type: Build · Language: Python (stdlib only) · Time: ~50 ನಿಮಿಷಗಳು. ಮೂಲ ಪಾಠ main.py ಘಟಕಗಳನ್ನು ಹೆಸರಿಸುತ್ತದೆ ಆದರೆ ಕೋಡ್ ಒಳಗೊಂಡಿಲ್ಲ. ಇಲ್ಲಿರುವುದೆಲ್ಲ ನಮ್ಮದೇ ಬೋಧನಾ ಅನುಷ್ಠಾನ. reviewer ಕ್ರಿಯೆಗಳನ್ನು ಚಲಾಯಿಸುವುದಿಲ್ಲ, ವರ್ಗೀಕರಿಸುತ್ತದೆ. ಎಲ್ಲಾ outputs ನಿಜ run ಗಳಿಂದ. ಮೂಲದ Docker sandbox drill ಚಲಾಯಿಸಲಾಗಿಲ್ಲ: ಈ ಯಂತ್ರದಲ್ಲಿ Docker daemon ಚಲಿಸುತ್ತಿರಲಿಲ್ಲ."
   }
  },
  {
   "type": "heading",
   "data": {
    "textEn": "Commands Are Structured, Not Strings",
    "textKn": "Commands ರಚನಾತ್ಮಕ, strings ಅಲ್ಲ",
    "level": "H2"
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "shell=False Is Not a Policy",
    "headingKn": "shell=False ನೀತಿ ಅಲ್ಲ",
    "bodyEn": "Passing an argument vector instead of a shell string removes shell interpretation (; | > && $() and friends), which is a real gain. But subprocess.run([\"python3\", \"malicious.py\"]) has no shell injection and still runs arbitrary Python. Command policy must also inspect the executable identity, the script, the arguments, interpreter flags that execute inline code, the working directory, the environment, limits and expected side effects. Allowing python3 effectively allows arbitrary Python unless the script and arguments are constrained.",
    "bodyKn": "argv ಬಳಸಿದರೆ shell ವ್ಯಾಖ್ಯಾನ ತೆಗೆದುಹೋಗುತ್ತದೆ, ಆದರೆ [\"python3\",\"malicious.py\"] ಇನ್ನೂ ಅನಿಯಂತ್ರಿತ Python ಚಲಾಯಿಸುತ್ತದೆ."
   }
  },
  {
   "type": "code",
   "data": {
    "filename": "permission_lab.py",
    "headingEn": "inspect_command: classify argv without running it",
    "headingKn": "inspect_command: ಚಲಾಯಿಸದೆ argv ವರ್ಗೀಕರಿಸಿ",
    "descEn": "The executable is reduced to its base name and checked against destructive commands, network tools and the reviewed list. Interpreter flags that execute inline code (-c, -m, -e) are refused, and the script must be on a reviewed list. Nothing is executed, which is exactly how a destructive command can be taught safely: parse, classify, deny, never run.",
    "descKn": "executable ಅಡಿ ಹೆಸರಿಗೆ ಇಳಿಸಿ ವಿನಾಶಕಾರಿ, network tools, ಪರಿಶೀಲಿತ ಪಟ್ಟಿ ವಿರುದ್ಧ ಪರಿಶೀಲಿಸಲಾಗುತ್ತದೆ. -c ತಿರಸ್ಕಾರ. ಏನನ್ನೂ ಚಲಾಯಿಸುವುದಿಲ್ಲ.",
    "code": "DESTRUCTIVE = {\"rm\", \"rmdir\", \"del\", \"erase\", \"format\", \"mkfs\", \"dd\", \"shred\", \"truncate\"}\nNETWORK_TOOLS = {\"curl\", \"wget\", \"nc\", \"ncat\", \"ssh\", \"scp\"}\nINLINE_CODE_FLAGS = {\"-c\", \"-m\", \"-e\", \"--eval\"}\n\ndef inspect_command(policy, argv):\n    if not argv: return Verdict.DENY, \"empty argv\"\n    exe = PurePosixPath(argv[0].replace(\"\\\\\", \"/\")).name.lower().removesuffix(\".exe\")\n    if exe in DESTRUCTIVE: return Verdict.DENY, f\"destructive command {exe!r} is classified and refused\"\n    if exe in NETWORK_TOOLS: return Verdict.DENY, f\"network tool {exe!r} needs an explicit network request\"\n    if exe not in policy.allowed_executables: return Verdict.DENY, f\"executable {exe!r} is not on the reviewed list\"\n    if any(a in INLINE_CODE_FLAGS for a in argv[1:]): return Verdict.DENY, \"interpreter flag would execute arbitrary inline code\"\n    script = next((a for a in argv[1:] if not a.startswith(\"-\")), None)\n    if script not in policy.allowed_scripts: return Verdict.DENY, f\"script {script!r} is not on the reviewed list\"\n    return Verdict.ALLOW, \"reviewed executable and script\""
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
    "headingEn": "Prefer a Narrow Tool to a General Shell",
    "headingKn": "ಸಾಮಾನ್ಯ shell ಗಿಂತ ಕಿರಿದಾದ tool",
    "bodyEn": "inspect_release(candidate=\"v2.4.0\", include_untracked=False) exposes two typed inputs and one job. shell(command: string) exposes an enormous action space. A narrow tool makes the policy surface smaller and approval, validation and verification easier, though its implementation should still run isolated.",
    "bodyKn": "inspect_release(candidate, include_untracked) ಎರಡು ಟೈಪ್ ಇನ್‌ಪುಟ್, ಒಂದು ಕೆಲಸ. shell(command) ಅಪಾರ ಕ್ರಿಯಾ ಸ್ಥಳ."
   }
  },
  {
   "type": "heading",
   "data": {
    "textEn": "Path Jail: Resolve, Then Contain",
    "textKn": "Path Jail: Resolve, ನಂತರ Contain",
    "level": "H2"
   }
  },
  {
   "type": "code",
   "data": {
    "filename": "permission_lab.py",
    "headingEn": "normalize_workspace_path",
    "headingKn": "normalize_workspace_path",
    "descEn": "Reject absolute paths and any \"..\" component, resolve the root, resolve root/requested, and require the target to be relative to the resolved root. This is the lesson's rule: realpath(join(root, p)) must be inside realpath(root). It demonstrates containment, not a solution to every filesystem race: a symlink followed at a later open can still create a time-of-check to time-of-use gap, and higher-assurance tools bind validation to opened file descriptors.",
    "descKn": "absolute ಮತ್ತು \"..\" ತಿರಸ್ಕರಿಸಿ, root ಮತ್ತು root/requested resolve ಮಾಡಿ, ಗುರಿ root ಗೆ ಸಂಬಂಧಿತ ಎಂದು ಬೇಕು. TOCTOU ಬಗ್ಗೆ ಇದು ಪೂರ್ಣ ಪರಿಹಾರವಲ್ಲ.",
    "code": "def normalize_workspace_path(root, requested):\n    ref = Path(requested)\n    if ref.is_absolute(): raise ValueError(\"absolute paths are not allowed\")\n    if \"..\" in ref.parts: raise ValueError(\"parent traversal is not allowed\")\n    resolved_root = Path(root).resolve()\n    target = (resolved_root / ref).resolve()\n    try: target.relative_to(resolved_root)\n    except ValueError: raise ValueError(\"path escapes the workspace\")\n    return target"
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
    "filename": "permission_lab.py",
    "headingEn": "A redirect that starts inside the workspace and resolves outside",
    "headingKn": "workspace ಒಳಗೆ ಆರಂಭ, ಹೊರಗೆ resolve ಆಗುವ redirect",
    "descEn": "We create a real link at project/output pointing at the temp folder that holds secret.txt. The lexical path starts with the workspace path, but it resolves outside, so a write through it is denied by resolved containment. The last line shows why a string prefix fails: /workspace/project-evil/f \"starts with\" /workspace/project. On this Windows account symlinks need extra rights, so the lab used a directory junction and says so.",
    "descKn": "ನಿಜ ಲಿಂಕ್ ರಚಿಸುತ್ತೇವೆ. lexical path ಒಳಗೆ, resolved ಹೊರಗೆ, ಆದ್ದರಿಂದ ನಿರಾಕರಣೆ. ಈ Windows ಖಾತೆಯಲ್ಲಿ symlink ಗೆ ಹೆಚ್ಚಿನ ಹಕ್ಕು ಬೇಕು, ಆದ್ದರಿಂದ junction ಬಳಸಿದೆ.",
    "code": "link = ws / \"output\"\ntry: os.symlink(tmp, link, target_is_directory=True); kind = \"symlink\"\nexcept (OSError, NotImplementedError):\n    subprocess.run([\"cmd\", \"/c\", \"mklink\", \"/J\", str(link), str(tmp)], capture_output=True); kind = \"directory junction (Windows equivalent)\"\nif link.exists():\n    print(\"  redirect created as:\", kind)\n    lex = ws / \"output\" / \"secret.txt\"\n    print(\"  lexical path starts inside workspace:\", str(lex).startswith(str(ws)), \"| resolves inside:\", str(lex.resolve()).startswith(str(ws.resolve())))\n    show(\"write through the redirect\", review_action(policy, ActionRequest(\"skill:x\", \"filesystem.write\", paths=[\"output/secret.txt\"], side_effect=\"workspace_write\")))\nelse:\n    print(\"  could not create a link on this machine; not demonstrated\")\nprint(\"  '/workspace/project-evil/f'.startswith('/workspace/project') ->\", \"/workspace/project-evil/f\".startswith(\"/workspace/project\"))"
   }
  },
  {
   "type": "output",
   "data": {
    "output": "redirect created as: directory junction (Windows equivalent)\n  lexical path starts inside workspace: True | resolves inside: False\n--- write through the redirect ---\nverdict: deny | reasons: [\"path 'output/secret.txt': path escapes the workspace\"] | approvals: []\n  '/workspace/project-evil/f'.startswith('/workspace/project') -> True"
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "Read Is Not Write",
    "headingKn": "Read ≠ Write",
    "bodyEn": "Containment answers \"is the path inside the allowed root?\", not \"what may happen to it?\". Read, create, overwrite and delete have different consequences, so the reviewer reasons about actor, operation, target and consequence together. In our lab a contained write is ASK because workspace writes require approval, while an escaping write is DENY.",
    "bodyKn": "containment \"path ಒಳಗಿದೆಯೇ\" ಎಂದು ಉತ್ತರಿಸುತ್ತದೆ, \"ಏನು ಮಾಡಬಹುದು\" ಅಲ್ಲ."
   }
  },
  {
   "type": "heading",
   "data": {
    "textEn": "Secrets and the Environment",
    "textKn": "Secrets ಮತ್ತು Environment",
    "level": "H2"
   }
  },
  {
   "type": "code",
   "data": {
    "filename": "permission_lab.py",
    "headingEn": "An environment allowlist and a limited secret signal",
    "headingKn": "environment allowlist ಮತ್ತು ಸೀಮಿತ secret ಸೂಚನೆ",
    "descEn": "A child should get only what it needs, not the parent's whole environment with the instruction \"please do not look at secrets\". contains_secret only recognises a few obvious shapes; a roadmap sentence with no key-like text returns False, which does not mean it is safe to send anywhere. Destination policy and data classification are still needed.",
    "descKn": "child ಗೆ ಬೇಕಾದದ್ದು ಮಾತ್ರ. contains_secret ಕೆಲವು ಸ್ಪಷ್ಟ ಆಕಾರಗಳನ್ನು ಮಾತ್ರ ಗುರುತಿಸುತ್ತದೆ; False ≠ ಸುರಕ್ಷಿತ.",
    "code": "SECRET_PATTERNS = [re.compile(p) for p in (r\"AKIA[0-9A-Z]{16}\", r\"ghp_[A-Za-z0-9]{20,}\", r\"-----BEGIN [A-Z ]*PRIVATE KEY-----\", r\"(?i)password\\s*[:=]\\s*\\S+\")]\ndef contains_secret(text):\n    return any(p.search(text) for p in SECRET_PATTERNS)\n\ndef build_env(policy, parent_env):\n    return {k: v for k, v in parent_env.items() if k in policy.allowed_env}\n\nfor s in [\"AKIAABCDEFGHIJKLMNOP\", \"password = hunter2\", \"Customer internal roadmap for the unreleased product\"]:\n    print(f\"  contains_secret({s[:44]!r}) ->\", contains_secret(s))\nparent = {\"PATH\": \"/controlled/bin\", \"LANG\": \"C.UTF-8\", \"WORKSPACE\": \"/workspace/project\", \"AWS_SECRET_ACCESS_KEY\": \"x\", \"GITHUB_TOKEN\": \"y\", \"SSH_AUTH_SOCK\": \"z\"}\nprint(\"  child receives:\", build_env(policy, parent))"
   }
  },
  {
   "type": "output",
   "data": {
    "output": "contains_secret('AKIAABCDEFGHIJKLMNOP') -> True\n  contains_secret('password = hunter2') -> True\n  contains_secret('Customer internal roadmap for the unreleased') -> False\nchild receives: {'PATH': '/controlled/bin', 'LANG': 'C.UTF-8', 'WORKSPACE': '/workspace/project'}"
   }
  },
  {
   "type": "heading",
   "data": {
    "textEn": "Network Is a Separate Permission",
    "textKn": "Network ಪ್ರತ್ಯೇಕ ಅನುಮತಿ",
    "level": "H2"
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "Filesystem Isolation Does Not Stop Exfiltration",
    "headingKn": "Filesystem ಪ್ರತ್ಯೇಕತೆ exfiltration ತಡೆಯುವುದಿಲ್ಲ",
    "bodyEn": "A process confined to /workspace/project can still read proprietary_source.py and POST it to an external server. Egress is an independent control: none for local analysis, an HTTPS origin allowlist for one documented API, a proxy for audited egress, unrestricted only in rare disposable research environments. \"The skill needs the internet\" is not a policy: name the destination, port, outbound data, redirect handling and expected response.",
    "bodyKn": "filesystem ಸೀಮಿತ process ಇನ್ನೂ ಡೇಟಾ ಹೊರಗೆ ಕಳುಹಿಸಬಹುದು. egress ಸ್ವತಂತ್ರ ನಿಯಂತ್ರಣ. \"ಇಂಟರ್ನೆಟ್ ಬೇಕು\" ನೀತಿ ಅಲ್ಲ."
   }
  },
  {
   "type": "code",
   "data": {
    "filename": "permission_lab.py",
    "headingEn": "normalize_https_origin",
    "headingKn": "normalize_https_origin",
    "descEn": "An origin is scheme, host and effective port. https://api.example.test and https://api.example.test:443 are the same origin; port 8443 is a different one; paths do not matter. Host names are lower-cased and IDNA-encoded, IP literals are canonicalised, credentials in the URL and non-https schemes are rejected. Redirects must be checked again before being followed; this lab reviews one destination at a time and does not perform requests.",
    "descKn": "origin = scheme + host + effective port. :443 ಹೊಂದಾಣಿಕೆ; 8443 ಬೇರೆ origin. redirect ಗಳನ್ನು ಮತ್ತೆ ಪರಿಶೀಲಿಸಬೇಕು.",
    "code": "def normalize_https_origin(url):\n    parts = urlsplit(url)\n    if parts.scheme != \"https\": raise ValueError(f\"only https origins are allowed, got {parts.scheme!r}\")\n    if parts.username or parts.password: raise ValueError(\"credentials in the URL are not allowed\")\n    host = parts.hostname\n    if not host: raise ValueError(\"missing host\")\n    port = parts.port or 443\n    try:\n        ip = ipaddress.ip_address(host)\n        host = f\"[{ip.compressed}]\" if ip.version == 6 else str(ip)\n    except ValueError:\n        try: host = host.encode(\"idna\").decode(\"ascii\").lower()\n        except UnicodeError: raise ValueError(\"host is not valid IDNA\")\n    return f\"https://{host}:{port}\"\n\nfor u in [\"https://api.example.test\", \"https://api.example.test:443\", \"https://api.example.test/status\", \"https://API.Example.test/releases\", \"https://api.example.test:8443\", \"https://[2001:db8::1]/x\", \"https://192.168.0.1\", \"https://bücher.example\"]:\n    print(f\"  {u:<38} ->\", normalize_https_origin(u))\nfor u in [\"http://api.example.test\", \"https://user:pw@api.example.test\", \"https:///nohost\", \"ftp://x\"]:\n    try: normalize_https_origin(u)\n    except ValueError as e: print(f\"  {u:<38} -> rejected ({e})\")"
   }
  },
  {
   "type": "output",
   "data": {
    "output": "https://api.example.test               -> https://api.example.test:443\n  https://api.example.test:443           -> https://api.example.test:443\n  https://api.example.test/status        -> https://api.example.test:443\n  https://API.Example.test/releases      -> https://api.example.test:443\n  https://api.example.test:8443          -> https://api.example.test:8443\n  https://[2001:db8::1]/x                -> https://[2001:db8::1]:443\n  https://192.168.0.1                    -> https://192.168.0.1:443\n  https://bücher.example                 -> https://xn--bcher-kva.example:443\n  http://api.example.test                -> rejected (only https origins are allowed, got 'http')\n  https://user:pw@api.example.test       -> rejected (credentials in the URL are not allowed)\n  https:///nohost                        -> rejected (missing host)\n  ftp://x                                -> rejected (only https origins are allowed, got 'ftp')"
   }
  },
  {
   "type": "code",
   "data": {
    "filename": "permission_lab.py",
    "headingEn": "The allowlist decides; the port matters",
    "headingKn": "allowlist ನಿರ್ಧರಿಸುತ್ತದೆ; port ಮುಖ್ಯ",
    "descEn": "Only https://api.example.test:443 is allowed. A request to port 8443 on the same host is denied with the normalized origin named; spelling :443 explicitly is allowed.",
    "descKn": "ಕೇವಲ :443 ಅನುಮತಿ. 8443 ನಿರಾಕರಣೆ; :443 ಸ್ಪಷ್ಟವಾಗಿ ಬರೆದರೆ ಅನುಮತಿ.",
    "code": "show(\"port 8443\", review_action(policy, ActionRequest(\"skill:x\", \"network.request\", network=[\"https://api.example.test:8443/x\"])))\nshow(\"port 443 spelled out\", review_action(policy, ActionRequest(\"skill:x\", \"network.request\", network=[\"https://api.example.test:443/x\"])))"
   }
  },
  {
   "type": "output",
   "data": {
    "output": "allowed origins: ['https://api.example.test:443']\n--- port 8443 ---\nverdict: deny | reasons: ['origin https://api.example.test:8443 is not on the egress allowlist'] | approvals: []\n--- port 443 spelled out ---\nverdict: allow | reasons: ['within pre-authorized policy'] | approvals: []"
   }
  },
  {
   "type": "heading",
   "data": {
    "textEn": "Approval Follows Consequence",
    "textKn": "Approval Consequence ಅನ್ನು ಅನುಸರಿಸುತ್ತದೆ",
    "level": "H2"
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "\"Allow bash?\" Is a Weak Prompt",
    "headingKn": "\"bash ಅನುಮತಿಸಬೇಕೇ?\" ದುರ್ಬಲ ಪ್ರಾಂಪ್ಟ್",
    "bodyEn": "It could mean reading, writing, deleting, running programs, network calls or publishing. A good prompt names the operation, artifact and target: \"Allow the reviewed publish_release tool to publish version 2.4.0 to the staging registry?\". Approval for staging must not be reused for production, and one vague prompt must not bundle upload, delete, retag and notify. Approval satisfies one boundary; it never disables path checks, network checks or the sandbox.",
    "bodyKn": "\"bash ಅನುಮತಿಸಿ?\" ಎಂದರೆ ಏನು ಎಂದು ತಿಳಿಯದು. ಕಾರ್ಯ, artifact, ಗುರಿ ಹೆಸರಿಸಿ. staging ಅನುಮೋದನೆ production ಗೆ ಅಲ್ಲ."
   }
  },
  {
   "type": "code",
   "data": {
    "filename": "permission_lab.py",
    "headingEn": "review_action and action-bound approvals",
    "headingKn": "review_action ಮತ್ತು ಕ್ರಿಯೆಗೆ ಬಂಧಿತ ಅನುಮೋದನೆಗಳು",
    "descEn": "review_action collects hard violations (paths, cwd, command, egress, secrets, credentials, policy change) into DENY, otherwise requires an approval for workspace writes (ASK), otherwise ALLOW. An approval carries an action_id computed from the capability, paths, network, argv and side effect, so it only satisfies the exact action it was granted for.",
    "descKn": "review_action ಕಠಿಣ ಉಲ್ಲಂಘನೆಗಳನ್ನು DENY ಗೆ ಸಂಗ್ರಹಿಸುತ್ತದೆ; ಇಲ್ಲದಿದ್ದರೆ ಬರೆಯಲು ಅನುಮೋದನೆ (ASK); ಇಲ್ಲದಿದ್ದರೆ ALLOW. ಅನುಮೋದನೆ action_id ಹೊಂದಿದೆ.",
    "code": "def action_id(req):\n    key = json.dumps([req.capability, req.paths, req.network, req.argv, req.side_effect], sort_keys=True)\n    return hashlib.sha256(key.encode()).hexdigest()[:12]\n\ndef review_action(policy, req):\n    hard, needs = [], []\n    for p in req.paths:\n        try: normalize_workspace_path(policy.workspace_root, p)\n        except ValueError as e: hard.append(f\"path {p!r}: {e}\")\n    try: normalize_workspace_path(policy.workspace_root, req.cwd)\n    except ValueError as e: hard.append(f\"cwd {req.cwd!r}: {e}\")\n    if req.capability == \"policy.change\":\n        hard.append(\"untrusted content cannot change host policy or disable approvals\")\n    if req.capability == \"process.run\":\n        v, why = inspect_command(policy, req.argv)\n        if v is Verdict.DENY: hard.append(why)\n    for url in req.network:\n        try:\n            origin = normalize_https_origin(url)\n            if origin not in policy.allowed_origins: hard.append(f\"origin {origin} is not on the egress allowlist\")\n        except ValueError as e: hard.append(f\"network {url!r}: {e}\")\n    if req.network and req.payload and contains_secret(req.payload): hard.append(\"outbound payload contains a secret-shaped value\")\n    if req.credentials: hard.append(\"credentials were requested but none are injected into this action\")\n    if req.capability == \"filesystem.write\" and not hard:\n        approved = req.approval and req.approval.get(\"action_id\") == action_id(req)\n        if not approved: needs.append(f\"approve workspace write: {', '.join(req.paths)}\")\n    if hard: return ReviewDecision(Verdict.DENY, hard, [])\n    if needs: return ReviewDecision(Verdict.ASK, [\"workspace writes require approval\"], needs)\n    return ReviewDecision(Verdict.ALLOW, [\"within pre-authorized policy\"], [])"
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
    "filename": "permission_lab.py",
    "headingEn": "Ten decisions, nothing executed",
    "headingKn": "ಹತ್ತು ನಿರ್ಧಾರಗಳು, ಏನೂ ಚಲಿಸಲಿಲ್ಲ",
    "descEn": "A safe read is ALLOW. An unapproved write is ASK, and the same write with its action-bound approval is ALLOW. A path escape, a destructive command, an inline interpreter flag, an untrusted network origin, untrusted text asking to change policy, and a secret-bearing payload are each DENY with a specific reason. The reviewed script is ALLOW.",
    "descKn": "ಸುರಕ್ಷಿತ read ALLOW; ಅನುಮೋದನೆ ಇಲ್ಲದ write ASK; ಅನುಮೋದನೆಯೊಂದಿಗೆ ALLOW; ಉಳಿದವು ನಿರ್ದಿಷ್ಟ ಕಾರಣದೊಂದಿಗೆ DENY.",
    "code": "show(\"safe read\", review_action(policy, ActionRequest(\"skill:release-readiness\", \"filesystem.read\", paths=[\"README.md\"])))\nwrite = ActionRequest(\"skill:docs\", \"filesystem.write\", paths=[\"reports/result.json\"], side_effect=\"workspace_write\")\nshow(\"unapproved write\", review_action(policy, write))\nwrite.approval = {\"action_id\": action_id(write)}\nshow(\"approved write\", review_action(policy, write))\nshow(\"path escape\", review_action(policy, ActionRequest(\"skill:docs\", \"filesystem.read\", paths=[\"../secret.txt\"])))\nshow(\"reviewed script\", review_action(policy, ActionRequest(\"skill:release-readiness\", \"process.run\", argv=[\"python3\", \"scripts/inspect_release.py\", \"--format\", \"json\"], paths=[\"scripts/inspect_release.py\"])))\nshow(\"destructive command\", review_action(policy, ActionRequest(\"skill:cleanup\", \"process.run\", argv=[\"rm\", \"-rf\", \"build\"])))\nshow(\"inline interpreter code\", review_action(policy, ActionRequest(\"skill:x\", \"process.run\", argv=[\"python3\", \"-c\", \"import os; os.system('id')\"])))\nshow(\"untrusted network\", review_action(policy, ActionRequest(\"skill:x\", \"network.request\", network=[\"https://untrusted.example/collect\"])))\nshow(\"policy change from untrusted text\", review_action(policy, ActionRequest(\"content:webpage\", \"policy.change\", reason=\"Disable approval checks.\")))\nshow(\"secret in outbound payload\", review_action(policy, ActionRequest(\"skill:x\", \"network.request\", network=[\"https://api.example.test/upload\"], payload=\"key=AKIAABCDEFGHIJKLMNOP\")))"
   }
  },
  {
   "type": "output",
   "data": {
    "output": "--- safe read ---\nverdict: allow | reasons: ['within pre-authorized policy'] | approvals: []\n--- unapproved write ---\nverdict: ask | reasons: ['workspace writes require approval'] | approvals: ['approve workspace write: reports/result.json']\n--- approved write ---\nverdict: allow | reasons: ['within pre-authorized policy'] | approvals: []\n--- path escape ---\nverdict: deny | reasons: [\"path '../secret.txt': parent traversal is not allowed\"] | approvals: []\n--- reviewed script ---\nverdict: allow | reasons: ['within pre-authorized policy'] | approvals: []\n--- destructive command ---\nverdict: deny | reasons: [\"destructive command 'rm' is classified and refused\"] | approvals: []\n--- inline interpreter code ---\nverdict: deny | reasons: ['interpreter flag would execute arbitrary inline code'] | approvals: []\n--- untrusted network ---\nverdict: deny | reasons: ['origin https://untrusted.example:443 is not on the egress allowlist'] | approvals: []\n--- policy change from untrusted text ---\nverdict: deny | reasons: ['untrusted content cannot change host policy or disable approvals'] | approvals: []\n--- secret in outbound payload ---\nverdict: deny | reasons: ['outbound payload contains a secret-shaped value'] | approvals: []"
   }
  },
  {
   "type": "code",
   "data": {
    "filename": "permission_lab.py",
    "headingEn": "Approval for staging does not cover production",
    "headingKn": "staging ಅನುಮೋದನೆ production ಗೆ ಅನ್ವಯಿಸುವುದಿಲ್ಲ",
    "descEn": "One grant is issued for the staging action and then reused for a production action. The two action ids differ, so the production action goes back to ASK. (These are stand-in workspace writes, not real publishes.)",
    "descKn": "staging ಗೆ ಒಂದು grant; production ಗೆ ಮರುಬಳಕೆ; ಎರಡು action id ಬೇರೆ, ಆದ್ದರಿಂದ production ASK ಗೆ ಹಿಂತಿರುಗುತ್ತದೆ.",
    "code": "pub_stage = ActionRequest(\"skill:release\", \"filesystem.write\", paths=[\"reports/publish-staging.json\"], side_effect=\"workspace_write\")\npub_prod = ActionRequest(\"skill:release\", \"filesystem.write\", paths=[\"reports/publish-production.json\"], side_effect=\"workspace_write\")\ngrant = {\"action_id\": action_id(pub_stage)}\npub_stage.approval = grant; pub_prod.approval = grant\nprint(\"  approved action id:\", grant[\"action_id\"], \"| production action id:\", action_id(pub_prod))\nshow(\"staging with its own approval\", review_action(policy, pub_stage))\nshow(\"production reusing staging approval\", review_action(policy, pub_prod))"
   }
  },
  {
   "type": "output",
   "data": {
    "output": "approved action id: 4e2f0b280f27 | production action id: d4de8a136983\n--- staging with its own approval ---\nverdict: allow | reasons: ['within pre-authorized policy'] | approvals: []\n--- production reusing staging approval ---\nverdict: ask | reasons: ['workspace writes require approval'] | approvals: ['approve workspace write: reports/publish-production.json']"
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "Key Takeaways",
    "headingKn": "ಮುಖ್ಯ ಅಂಶಗಳು",
    "bodyEn": "• shell=False removes shell interpretation, not arbitrary code: our reviewer denied python3 -c and unreviewed scripts by inspecting argv, and refused rm without running it.\n• Path containment must resolve first: the link that started inside the workspace resolved outside and was denied; a string prefix called /workspace/project-evil inside /workspace/project.\n• Origins normalize by scheme, host and effective port: :443 equals the default, 8443 is different; IDNA (bücher.example became xn--bcher-kva.example) and IP literals are canonicalised.\n• Filtering the environment left only PATH, LANG and WORKSPACE; contains_secret is a limited signal (the roadmap sentence returned False).\n• Approval is bound to one exact action; the staging grant did not cover production.\n• ALLOW is not \"run unrestricted\": Part 3 covers isolation.",
    "bodyKn": "• shell=False shell ವ್ಯಾಖ್ಯಾನ ತೆಗೆಯುತ್ತದೆ, ಅನಿಯಂತ್ರಿತ ಕೋಡ್ ಅಲ್ಲ.\n• resolve ಮೊದಲು.\n• origin scheme+host+port.\n• environment allowlist.\n• ಅನುಮೋದನೆ ಒಂದು ನಿರ್ದಿಷ್ಟ ಕ್ರಿಯೆಗೆ.\n• ALLOW ≠ ನಿರ್ಬಂಧವಿಲ್ಲದೆ ಚಲಾಯಿಸು."
   }
  },
  {
   "type": "quiz",
   "data": {
    "questions": [
     {
      "q": "Why is subprocess.run(argv, shell=False) not a complete command policy?",
      "qKn": "subprocess.run(argv, shell=False) ಸಂಪೂರ್ಣ command ನೀತಿ ಅಲ್ಲ ಏಕೆ?",
      "opts": [
       "shell=False stops Python running",
       "It prevents shell interpretation but does not constrain the executable, script, arguments, filesystem, network, environment or side effects",
       "It enables a sandbox",
       "It denies all commands"
      ],
      "optsKn": [
       "Python ನಿಲ್ಲಿಸುತ್ತದೆ",
       "shell ವ್ಯಾಖ್ಯಾನ ತಡೆಯುತ್ತದೆ ಆದರೆ ಉಳಿದವನ್ನು ನಿಯಂತ್ರಿಸುವುದಿಲ್ಲ",
       "sandbox ಸಕ್ರಿಯ",
       "ಎಲ್ಲವನ್ನೂ ನಿರಾಕರಿಸುತ್ತದೆ"
      ],
      "correct": 1
     },
     {
      "q": "Why resolve a path before checking containment?",
      "qKn": "containment ಪರಿಶೀಲನೆಗೆ ಮೊದಲು path resolve ಏಕೆ?",
      "opts": [
       "Links always contain invalid YAML",
       "Resolution encrypts the file",
       "A lexically in-workspace path may resolve outside the workspace",
       "realpath grants write permission"
      ],
      "optsKn": [
       "links ಅಮಾನ್ಯ YAML ಹೊಂದಿರುತ್ತವೆ",
       "resolve ಫೈಲ್ ಎನ್‌ಕ್ರಿಪ್ಟ್ ಮಾಡುತ್ತದೆ",
       "lexical ಒಳಗಿರುವ path ಹೊರಗೆ resolve ಆಗಬಹುದು",
       "realpath ಬರೆಯುವ ಅನುಮತಿ ನೀಡುತ್ತದೆ"
      ],
      "correct": 2
     },
     {
      "q": "A contained write with no approval yet should produce what?",
      "qKn": "ಇನ್ನೂ ಅನುಮೋದನೆ ಇಲ್ಲದ ಒಳಗಿರುವ write ಏನನ್ನು ನೀಡಬೇಕು?",
      "opts": [
       "ALLOW",
       "ASK",
       "DENY because every write is malicious",
       "Execute and ask afterwards"
      ],
      "optsKn": [
       "ALLOW",
       "ASK",
       "ಪ್ರತಿ write ದುರುದ್ದೇಶ, DENY",
       "ಚಲಾಯಿಸಿ ನಂತರ ಕೇಳಿ"
      ],
      "correct": 1
     },
     {
      "q": "Which two URLs are the same normalized HTTPS origin?",
      "qKn": "ಯಾವ ಎರಡು URL ಗಳು ಒಂದೇ ಸಾಮಾನ್ಯೀಕೃತ HTTPS origin?",
      "opts": [
       "https://api.example.test and https://other.example.test",
       "https://api.example.test and https://api.example.test:443",
       "https://api.example.test and https://api.example.test:8443",
       "http://api.example.test and https://api.example.test"
      ],
      "optsKn": [
       "api.example.test ಮತ್ತು other.example.test",
       "api.example.test ಮತ್ತು api.example.test:443",
       "api.example.test ಮತ್ತು :8443",
       "http ಮತ್ತು https"
      ],
      "correct": 1
     },
     {
      "q": "Why is \"Allow bash?\" a weak approval prompt?",
      "qKn": "\"bash ಅನುಮತಿಸಬೇಕೇ?\" ದುರ್ಬಲ ಪ್ರಾಂಪ್ಟ್ ಏಕೆ?",
      "opts": [
       "Bash cannot run commands",
       "It does not communicate the exact target and consequence being authorized",
       "Approval is never needed",
       "Bash lacks files"
      ],
      "optsKn": [
       "bash ಚಲಾಯಿಸಲಾರದು",
       "ನಿಖರ ಗುರಿ ಮತ್ತು ಪರಿಣಾಮ ತಿಳಿಸುವುದಿಲ್ಲ",
       "ಅನುಮೋದನೆ ಬೇಡ",
       "bash ಗೆ ಫೈಲ್ ಇಲ್ಲ"
      ],
      "correct": 1
     }
    ]
   }
  }
 ]
};
