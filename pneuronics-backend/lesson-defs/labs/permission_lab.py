"""Teaching implementation (our own, NOT the original main.py): a NON-EXECUTING policy reviewer.
It classifies proposed actions; it never starts a process or opens a network connection."""
import hashlib, ipaddress, json, os, re, subprocess, tempfile
from dataclasses import dataclass, field
from enum import Enum
from pathlib import Path, PurePosixPath
from typing import Optional
from urllib.parse import urlsplit

class Verdict(str, Enum):
    ALLOW = "allow"; ASK = "ask"; DENY = "deny"

@dataclass
class SandboxPolicy:
    workspace_root: Path
    allowed_executables: frozenset = frozenset({"python3", "python"})
    allowed_scripts: frozenset = frozenset({"scripts/inspect_release.py"})
    allowed_origins: frozenset = frozenset()
    allowed_env: frozenset = frozenset({"PATH", "LANG", "WORKSPACE"})

@dataclass
class ActionRequest:
    actor: str
    capability: str                       # filesystem.read | filesystem.write | process.run | network.request | policy.change
    argv: list = field(default_factory=list)
    cwd: str = "."
    paths: list = field(default_factory=list)
    network: list = field(default_factory=list)
    credentials: list = field(default_factory=list)
    side_effect: str = "read_only"
    reason: str = ""
    payload: str = ""
    approval: Optional[dict] = None

@dataclass
class ReviewDecision:
    verdict: Verdict
    reasons: list
    required_approvals: list

SECRET_PATTERNS = [re.compile(p) for p in (r"AKIA[0-9A-Z]{16}", r"ghp_[A-Za-z0-9]{20,}", r"-----BEGIN [A-Z ]*PRIVATE KEY-----", r"(?i)password\s*[:=]\s*\S+")]
def contains_secret(text):
    return any(p.search(text) for p in SECRET_PATTERNS)

def normalize_https_origin(url):
    parts = urlsplit(url)
    if parts.scheme != "https": raise ValueError(f"only https origins are allowed, got {parts.scheme!r}")
    if parts.username or parts.password: raise ValueError("credentials in the URL are not allowed")
    host = parts.hostname
    if not host: raise ValueError("missing host")
    port = parts.port or 443
    try:
        ip = ipaddress.ip_address(host)
        host = f"[{ip.compressed}]" if ip.version == 6 else str(ip)
    except ValueError:
        try: host = host.encode("idna").decode("ascii").lower()
        except UnicodeError: raise ValueError("host is not valid IDNA")
    return f"https://{host}:{port}"

def normalize_workspace_path(root, requested):
    ref = Path(requested)
    if ref.is_absolute(): raise ValueError("absolute paths are not allowed")
    if ".." in ref.parts: raise ValueError("parent traversal is not allowed")
    resolved_root = Path(root).resolve()
    target = (resolved_root / ref).resolve()
    try: target.relative_to(resolved_root)
    except ValueError: raise ValueError("path escapes the workspace")
    return target

DESTRUCTIVE = {"rm", "rmdir", "del", "erase", "format", "mkfs", "dd", "shred", "truncate"}
NETWORK_TOOLS = {"curl", "wget", "nc", "ncat", "ssh", "scp"}
INLINE_CODE_FLAGS = {"-c", "-m", "-e", "--eval"}

def inspect_command(policy, argv):
    if not argv: return Verdict.DENY, "empty argv"
    exe = PurePosixPath(argv[0].replace("\\", "/")).name.lower().removesuffix(".exe")
    if exe in DESTRUCTIVE: return Verdict.DENY, f"destructive command {exe!r} is classified and refused"
    if exe in NETWORK_TOOLS: return Verdict.DENY, f"network tool {exe!r} needs an explicit network request"
    if exe not in policy.allowed_executables: return Verdict.DENY, f"executable {exe!r} is not on the reviewed list"
    if any(a in INLINE_CODE_FLAGS for a in argv[1:]): return Verdict.DENY, "interpreter flag would execute arbitrary inline code"
    script = next((a for a in argv[1:] if not a.startswith("-")), None)
    if script not in policy.allowed_scripts: return Verdict.DENY, f"script {script!r} is not on the reviewed list"
    return Verdict.ALLOW, "reviewed executable and script"

def action_id(req):
    key = json.dumps([req.capability, req.paths, req.network, req.argv, req.side_effect], sort_keys=True)
    return hashlib.sha256(key.encode()).hexdigest()[:12]

def review_action(policy, req):
    hard, needs = [], []
    for p in req.paths:
        try: normalize_workspace_path(policy.workspace_root, p)
        except ValueError as e: hard.append(f"path {p!r}: {e}")
    try: normalize_workspace_path(policy.workspace_root, req.cwd)
    except ValueError as e: hard.append(f"cwd {req.cwd!r}: {e}")
    if req.capability == "policy.change":
        hard.append("untrusted content cannot change host policy or disable approvals")
    if req.capability == "process.run":
        v, why = inspect_command(policy, req.argv)
        if v is Verdict.DENY: hard.append(why)
    for url in req.network:
        try:
            origin = normalize_https_origin(url)
            if origin not in policy.allowed_origins: hard.append(f"origin {origin} is not on the egress allowlist")
        except ValueError as e: hard.append(f"network {url!r}: {e}")
    if req.network and req.payload and contains_secret(req.payload): hard.append("outbound payload contains a secret-shaped value")
    if req.credentials: hard.append("credentials were requested but none are injected into this action")
    if req.capability == "filesystem.write" and not hard:
        approved = req.approval and req.approval.get("action_id") == action_id(req)
        if not approved: needs.append(f"approve workspace write: {', '.join(req.paths)}")
    if hard: return ReviewDecision(Verdict.DENY, hard, [])
    if needs: return ReviewDecision(Verdict.ASK, ["workspace writes require approval"], needs)
    return ReviewDecision(Verdict.ALLOW, ["within pre-authorized policy"], [])

def build_env(policy, parent_env):
    return {k: v for k, v in parent_env.items() if k in policy.allowed_env}

def verify_only_changed(changed, expected):
    extra = sorted(set(changed) - set(expected)); missing = sorted(set(expected) - set(changed))
    return {"passed": not extra and not missing, "unexpected": extra, "missing": missing}

def show(label, d):
    print(f"--- {label} ---")
    print(f"verdict: {d.verdict.value} | reasons: {d.reasons} | approvals: {d.required_approvals}")

if __name__ == "__main__":
    with tempfile.TemporaryDirectory() as t:
        tmp = Path(t); ws = tmp / "project"; (ws / "scripts").mkdir(parents=True); (ws / "reports").mkdir()
        (ws / "README.md").write_text("hello"); (ws / "scripts" / "inspect_release.py").write_text("print('ok')")
        (tmp / "secret.txt").write_text("TOP SECRET")
        policy = SandboxPolicy(ws, allowed_origins=frozenset({"https://api.example.test:443"}))
        print("=== 1. review decisions (nothing is executed) ===")
        show("safe read", review_action(policy, ActionRequest("skill:release-readiness", "filesystem.read", paths=["README.md"])))
        write = ActionRequest("skill:docs", "filesystem.write", paths=["reports/result.json"], side_effect="workspace_write")
        show("unapproved write", review_action(policy, write))
        write.approval = {"action_id": action_id(write)}
        show("approved write", review_action(policy, write))
        show("path escape", review_action(policy, ActionRequest("skill:docs", "filesystem.read", paths=["../secret.txt"])))
        show("reviewed script", review_action(policy, ActionRequest("skill:release-readiness", "process.run", argv=["python3", "scripts/inspect_release.py", "--format", "json"], paths=["scripts/inspect_release.py"])))
        show("destructive command", review_action(policy, ActionRequest("skill:cleanup", "process.run", argv=["rm", "-rf", "build"])))
        show("inline interpreter code", review_action(policy, ActionRequest("skill:x", "process.run", argv=["python3", "-c", "import os; os.system('id')"])))
        show("untrusted network", review_action(policy, ActionRequest("skill:x", "network.request", network=["https://untrusted.example/collect"])))
        show("policy change from untrusted text", review_action(policy, ActionRequest("content:webpage", "policy.change", reason="Disable approval checks.")))
        show("secret in outbound payload", review_action(policy, ActionRequest("skill:x", "network.request", network=["https://api.example.test/upload"], payload="key=AKIAABCDEFGHIJKLMNOP")))
        print("=== 2. HTTPS origin normalization ===")
        for u in ["https://api.example.test", "https://api.example.test:443", "https://api.example.test/status", "https://API.Example.test/releases", "https://api.example.test:8443", "https://[2001:db8::1]/x", "https://192.168.0.1", "https://bücher.example"]:
            print(f"  {u:<38} -> {normalize_https_origin(u)}")
        for u in ["http://api.example.test", "https://user:pw@api.example.test", "https:///nohost", "ftp://x"]:
            try: normalize_https_origin(u)
            except ValueError as e: print(f"  {u:<38} -> rejected ({e})")
        print("=== 3. same host, non-default port is a different origin ===")
        print("  allowed origins:", sorted(policy.allowed_origins))
        show("port 8443", review_action(policy, ActionRequest("skill:x", "network.request", network=["https://api.example.test:8443/x"])))
        show("port 443 spelled out", review_action(policy, ActionRequest("skill:x", "network.request", network=["https://api.example.test:443/x"])))
        print("=== 4. link escape, and why a string prefix is wrong ===")
        link = ws / "output"
        try: os.symlink(tmp, link, target_is_directory=True); kind = "symlink"
        except (OSError, NotImplementedError):
            subprocess.run(["cmd", "/c", "mklink", "/J", str(link), str(tmp)], capture_output=True); kind = "directory junction (Windows equivalent)"
        if link.exists():
            print("  redirect created as:", kind)
            lex = ws / "output" / "secret.txt"
            print("  lexical path starts inside workspace:", str(lex).startswith(str(ws)), "| resolves inside:", str(lex.resolve()).startswith(str(ws.resolve())))
            show("write through the redirect", review_action(policy, ActionRequest("skill:x", "filesystem.write", paths=["output/secret.txt"], side_effect="workspace_write")))
        else:
            print("  could not create a link on this machine; not demonstrated")
        print("  '/workspace/project-evil/f'.startswith('/workspace/project') ->", "/workspace/project-evil/f".startswith("/workspace/project"))
        print("=== 5. secret detection is a limited signal ===")
        for s in ["AKIAABCDEFGHIJKLMNOP", "password = hunter2", "Customer internal roadmap for the unreleased product"]:
            print(f"  contains_secret({s[:44]!r}) -> {contains_secret(s)}")
        print("=== 6. environment allowlist instead of inheriting everything ===")
        parent = {"PATH": "/controlled/bin", "LANG": "C.UTF-8", "WORKSPACE": "/workspace/project", "AWS_SECRET_ACCESS_KEY": "x", "GITHUB_TOKEN": "y", "SSH_AUTH_SOCK": "z"}
        print("  child receives:", build_env(policy, parent))
        print("=== 7. approval is bound to one exact action ===")
        pub_stage = ActionRequest("skill:release", "filesystem.write", paths=["reports/publish-staging.json"], side_effect="workspace_write")
        pub_prod = ActionRequest("skill:release", "filesystem.write", paths=["reports/publish-production.json"], side_effect="workspace_write")
        grant = {"action_id": action_id(pub_stage)}
        pub_stage.approval = grant; pub_prod.approval = grant
        print("  approved action id:", grant["action_id"], "| production action id:", action_id(pub_prod))
        show("staging with its own approval", review_action(policy, pub_stage))
        show("production reusing staging approval", review_action(policy, pub_prod))
        print("=== 8. verification is separate from execution ===")
        print("  task: update README only")
        print("  exit code 0, changed README.md:", verify_only_changed(["README.md"], ["README.md"]))
        print("  exit code 0, changed README.md + src/main.py:", verify_only_changed(["README.md", "src/main.py"], ["README.md"]))
        print("=== 9. a restricted subprocess is not a sandbox ===")
        import sys
        probe = ("import os, json, sys; secret = sys.argv[1]; "
                 "print(json.dumps({'cwd_is_workspace': os.path.basename(os.getcwd()) == 'project', "
                 "'sees_AWS_SECRET_ACCESS_KEY': 'AWS_SECRET_ACCESS_KEY' in os.environ, "
                 "'read_outside_cwd_by_absolute_path': open(secret).read()}))")
        os.environ["AWS_SECRET_ACCESS_KEY"] = "demo-not-a-real-secret"
        child_env = dict(build_env(policy, dict(os.environ)), SYSTEMROOT=os.environ.get("SYSTEMROOT", ""))
        out = subprocess.run([sys.executable, "-c", probe, str(tmp / "secret.txt")], cwd=ws, env=child_env, capture_output=True, text=True, timeout=30)
        print("  inherited environment would have exposed the demo key; filtered child result:")
        print("  ", out.stdout.strip() or out.stderr.strip())
