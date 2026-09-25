"""Teaching implementation (our own, NOT the original main.py): skill discovery + progressive disclosure."""
import json, os, tempfile
from dataclasses import dataclass
from pathlib import Path

@dataclass(frozen=True)
class Scope:
    name: str
    root: Path
    rank: int          # higher wins a collision; explicit, never directory order

@dataclass(frozen=True)
class SkillCandidate:
    name: str
    description: str
    skill_dir: Path
    scope: str
    rank: int

@dataclass(frozen=True)
class CatalogEntry:
    name: str
    description: str
    scope: str
    path: str

@dataclass
class CatalogBudget:
    max_chars: int

MAX_BODY = 4000
MAX_REF = 2000

def read_meta(skill_file):
    text = skill_file.read_text(encoding="utf-8")
    lines = text.split("\n")
    if lines[0].strip() != "---" or "---" not in [l.strip() for l in lines[1:]]:
        return None
    end = [l.strip() for l in lines[1:]].index("---") + 1
    meta = dict(l.split(":", 1) for l in lines[1:end] if ":" in l)
    return {k.strip(): v.strip() for k, v in meta.items()}, "\n".join(lines[end + 1:]).strip()

def discover_scope(scope, diagnostics):
    found = []
    diagnostics["searched"].append(scope.name)
    for child in sorted(scope.root.iterdir()):            # immediate children only
        skill_file = child / "SKILL.md"
        if not child.is_dir() or not skill_file.is_file():
            continue
        parsed = read_meta(skill_file)
        if not parsed:
            diagnostics["rejected"].append((scope.name, child.name, "bad frontmatter")); continue
        meta, body = parsed
        if meta.get("name") != child.name:
            diagnostics["rejected"].append((scope.name, child.name, f"name {meta.get('name')!r} != directory")); continue
        if not meta.get("description") or not body:
            diagnostics["rejected"].append((scope.name, child.name, "missing description or body")); continue
        if len(body) > MAX_BODY:
            diagnostics["rejected"].append((scope.name, child.name, "body too large")); continue
        found.append(SkillCandidate(meta["name"], meta["description"], child, scope.name, scope.rank))
    return found

def resolve_collisions(candidates, diagnostics):
    by_name = {}
    for c in candidates: by_name.setdefault(c.name, []).append(c)
    selected = []
    for name in sorted(by_name):
        group = sorted(by_name[name], key=lambda c: -c.rank)
        if len(group) > 1 and group[0].rank == group[1].rank:
            diagnostics["ambiguous"].append((name, [c.scope for c in group if c.rank == group[0].rank]))
            continue
        selected.append(group[0])
        for loser in group[1:]:
            diagnostics["shadowed"].append((name, loser.scope, "by", group[0].scope))
    return selected

def build_catalog(selected, budget, diagnostics):
    catalog, used = [], 0
    for c in selected:
        entry = CatalogEntry(c.name, c.description, c.scope, str(c.skill_dir))
        cost = len(json.dumps(entry.__dict__))
        if used + cost > budget.max_chars:
            diagnostics["omitted"].append(c.name); continue
        catalog.append(entry); used += cost
    return catalog, used

def load_skill_body(entry):
    meta, body = read_meta(Path(entry.path) / "SKILL.md")
    return body

def validate_reference(skill_dir, reference, max_bytes=MAX_REF):
    ref = Path(reference)
    if ref.is_absolute(): raise ValueError("absolute paths are not allowed")
    if ".." in ref.parts: raise ValueError("parent traversal is not allowed")
    root = skill_dir.resolve()
    candidate = (root / ref).resolve()
    try:
        candidate.relative_to(root)
    except ValueError:
        raise ValueError("resource escaped skill root")
    if not candidate.is_file(): raise ValueError("resource must be a regular file")
    if candidate.stat().st_size > max_bytes: raise ValueError("resource exceeds size limit")
    return candidate

def load_reference(entry, reference, reason, events):
    path = validate_reference(Path(entry.path), reference)
    text = path.read_text(encoding="utf-8")
    events.append({"event": "skill.resource.loaded", "skill": entry.name, "resource": reference, "reason": reason, "bytes": len(text.encode())})
    return text

def make_world(tmp):
    def skill(root, name, desc, body, refs=None, fname=None):
        d = root / name; d.mkdir(parents=True)
        (d / "SKILL.md").write_text(f"---\nname: {fname or name}\ndescription: {desc}\n---\n\n{body}\n", encoding="utf-8")
        for rel, content in (refs or {}).items():
            p = d / rel; p.parent.mkdir(parents=True, exist_ok=True); p.write_text(content, encoding="utf-8")
    ws, user = tmp / "workspace", tmp / "user"; ws.mkdir(); user.mkdir()
    body = "1. Identify artifact type.\n2. For a Python package read references/python-release.md.\n3. For a container image read references/container-release.md."
    skill(ws, "release-readiness", "Validate a release candidate and produce a readiness report. Use when the user asks whether a version, tag, or package is ready to publish.", body,
          {"references/python-release.md": "Python release rules: build sdist and wheel, check twine.", "references/container-release.md": "Container release rules.",
           "references/example/SKILL.md": "---\nname: fake\ndescription: nested fixture\n---\nnot a package"})
    skill(user, "release-readiness", "USER copy of release readiness.", "user body")
    skill(user, "sql-analysis", "Analyze SQL query plans. Use when the user asks why a query is slow.", "Explain the plan.")
    skill(user, "bad-name", "Wrong name in metadata.", "body", fname="other-name")
    (ws / "notes.txt").write_text("not a skill")
    return Scope("workspace", ws, 100), Scope("user", user, 50)

if __name__ == "__main__":
    with tempfile.TemporaryDirectory() as t:
        tmp = Path(t)
        wsc, usc = make_world(tmp)
        diag = {"searched": [], "rejected": [], "shadowed": [], "ambiguous": [], "omitted": []}
        print("=== 1. discover_scope (shallow, validated) ===")
        cands = discover_scope(wsc, diag) + discover_scope(usc, diag)
        for c in cands: print(f"  candidate {c.name} from {c.scope} (rank {c.rank})")
        print("  rejected:", diag["rejected"])
        print("=== 2. collision resolution ===")
        selected = resolve_collisions(cands, diag)
        print("  selected:", [(c.name, c.scope) for c in selected])
        print("  shadowed:", diag["shadowed"])
        print("=== 3. equal precedence is ambiguous, not first-wins ===")
        d2 = {"searched": [], "rejected": [], "shadowed": [], "ambiguous": [], "omitted": []}
        tie = [SkillCandidate("release-readiness", "A", tmp, "plugin-a", 50), SkillCandidate("release-readiness", "B", tmp, "plugin-b", 50)]
        print("  selected:", resolve_collisions(tie, d2), "| ambiguous:", d2["ambiguous"])
        print("=== 4. catalog under a small budget ===")
        big, used_big = build_catalog(selected, CatalogBudget(10000), {"omitted": []})
        catalog, used = build_catalog(selected, CatalogBudget(330), diag)
        print(f"  big budget: {len(big)} entries, {used_big} chars | budget 330: {len(catalog)} entries, {used} chars")
        print("  omitted:", diag["omitted"])
        print("  model sees:", [(e.name, e.scope) for e in catalog])
        entry = next(e for e in big if e.name == "release-readiness")
        print("=== 5. Level 2: activate one skill ===")
        body = load_skill_body(entry)
        print(body)
        print("=== 6. Level 3: branch-specific reference + disclosure event ===")
        events = []
        text = load_reference(entry, "references/python-release.md", "candidate contains pyproject.toml", events)
        print("  loaded:", text)
        print("  event:", json.dumps(events[0]))
        print("  container-release.md loaded?", any(e["resource"].endswith("container-release.md") for e in events))
        print("=== 7. containment rejects escapes ===")
        (tmp / "secret.txt").write_text("TOP SECRET")
        for label, ref in [("parent traversal", "references/../../../secret.txt"), ("absolute path", str(tmp / "secret.txt")), ("directory", "references"), ("missing file", "references/nope.md")]:
            try:
                validate_reference(Path(entry.path), ref); print(f"  {label}: ALLOWED")
            except ValueError as e:
                print(f"  {label}: rejected ({e})")
            except OSError as e:
                print(f"  {label}: rejected ({type(e).__name__})")
        print("=== 8. symlink escape ===")
        link = Path(entry.path) / "references" / "external"
        kind = "symlink"
        try:
            os.symlink(tmp, link, target_is_directory=True)
        except (OSError, NotImplementedError):
            import subprocess                     # Windows without symlink rights: a directory junction redirects the same way
            subprocess.run(["cmd", "/c", "mklink", "/J", str(link), str(tmp)], capture_output=True)
            kind = "directory junction (Windows equivalent of a directory symlink)"
        if link.exists():
            lexical = Path(entry.path) / "references" / "external" / "secret.txt"
            print("  redirect created as:", kind)
            print("  lexical path starts inside package:", str(lexical).startswith(str(Path(entry.path))))
            print("  resolves to:", "outside the package" if not str(lexical.resolve()).startswith(str(Path(entry.path).resolve())) else "inside the package")
            try:
                validate_reference(Path(entry.path), "references/external/secret.txt"); print("  redirect: ALLOWED")
            except ValueError as e:
                print(f"  redirect: rejected ({e})")
        else:
            print("  could not create a symlink or junction on this machine; not demonstrated")
        print("=== 9. why a string-prefix check is wrong ===")
        root, other = "/app/skills/release", "/app/skills/release-malicious/file.md"
        print("  startswith says inside:", other.startswith(root), "| real parent relationship:", other.startswith(root + "/"))
        print("=== 10. catalog cost is not active cost ===")
        cat_cost = used_big
        active = len(body) + len(text)
        loaded_all = len(body) + sum(len(p.read_text()) for p in (Path(entry.path) / "references").glob("*.md"))
        print(f"  catalog chars: {cat_cost} | active chars (body + one reference): {active} | if every reference were loaded: {loaded_all}")
