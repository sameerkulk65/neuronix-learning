"""Teaching implementation (our own, not the original main.py): skill validator + primitive chooser."""
import json, re
from dataclasses import dataclass, field, asdict

PORTABLE_FIELDS = {"name", "description", "license", "compatibility", "metadata", "allowed-tools"}
NAME_RE = re.compile(r"^[a-z0-9]+(-[a-z0-9]+)*$")
MAX_NAME, MAX_DESC = 64, 1024

class FrontmatterSyntaxError(ValueError):
    pass

@dataclass
class ValidationIssue:
    code: str
    message: str

@dataclass
class SkillReport:
    directory: str
    valid: bool
    issues: list = field(default_factory=list)

def parse_frontmatter(text):
    lines = text.split("\n")
    if not lines or lines[0].strip() != "---":
        raise FrontmatterSyntaxError("frontmatter must start with '---'")
    try:
        end = next(i for i in range(1, len(lines)) if lines[i].strip() == "---")
    except StopIteration:
        raise FrontmatterSyntaxError("frontmatter is not closed by '---'")
    meta = {}
    for raw in lines[1:end]:
        if not raw.strip():
            continue
        if raw.startswith((" ", "\t", "-")):
            raise FrontmatterSyntaxError(f"nested or list value not supported: {raw.strip()!r}")
        if ":" not in raw:
            raise FrontmatterSyntaxError(f"line is not 'key: value': {raw!r}")
        key, value = raw.split(":", 1)
        meta[key.strip()] = value.strip()
    return meta, "\n".join(lines[end + 1:]).strip()

def validate_skill_text(text, directory_name, allowed_runtime_extensions=()):
    issues = []
    def done():
        return SkillReport(directory_name, not issues, issues)
    try:
        meta, body = parse_frontmatter(text)
    except FrontmatterSyntaxError as e:
        issues.append(ValidationIssue("E_FRONTMATTER_SYNTAX", str(e)))
        return done()                                   # fail on the first broken invariant
    if "name" in meta and meta["name"] != directory_name:
        issues.append(ValidationIssue("E_NAME_DIRECTORY_MISMATCH", f"name {meta['name']!r} != directory {directory_name!r}"))
        return done()
    for req in ("name", "description"):
        if not meta.get(req):
            issues.append(ValidationIssue("E_MISSING_FIELD", f"required field {req!r} is missing or empty"))
    if issues:
        return done()
    if not NAME_RE.match(meta["name"]) or len(meta["name"]) > MAX_NAME:
        issues.append(ValidationIssue("E_NAME_FORMAT", "name must be lowercase letters/digits/hyphens, max 64"))
    if len(meta["description"]) > MAX_DESC:
        issues.append(ValidationIssue("E_DESCRIPTION_LENGTH", f"description over {MAX_DESC} characters"))
    for key in meta:
        if key not in PORTABLE_FIELDS and key not in allowed_runtime_extensions:
            issues.append(ValidationIssue("E_UNKNOWN_EXTENSION", f"field {key!r} is not portable and not allowed by host policy"))
    if not body:
        issues.append(ValidationIssue("E_EMPTY_BODY", "SKILL.md has metadata but no procedure body"))
    return done()

@dataclass
class TaskShape:
    reusable_judgment: bool = False
    must_run_every_time: bool = False
    external_typed_capability: bool = False
    needs_isolated_context: bool = False
    repo_specific_guidance: bool = False

def select_primitives(t):
    chosen = []
    if t.repo_specific_guidance: chosen.append("repository instructions")
    if t.must_run_every_time: chosen.append("hook / application code")
    if t.external_typed_capability: chosen.append("tool / MCP server")
    if t.reusable_judgment: chosen.append("skill")
    if t.needs_isolated_context: chosen.append("subagent")
    return chosen or ["prompt"]

STAGES = ["discovered", "validated", "cataloged", "selected", "activated", "executed", "verified"]

def lifecycle(reached):
    return {s: (s in reached) for s in STAGES}

VALID = """---
name: release-readiness
description: Inspect a release candidate when the user asks whether a version is ready to publish.
license: MIT
---

# Release readiness

1. Read references/release-policy.md.
2. Run python3 scripts/inspect_release.py --format json.
3. Stop if the report contains a blocking failure.
"""
HOST = VALID.replace("license: MIT", "disable-model-invocation: true")

def show(label, obj):
    print(f"--- {label} ---")
    print(json.dumps(obj, indent=2))

if __name__ == "__main__":
    show("valid portable skill", asdict(validate_skill_text(VALID, "release-readiness")))
    show("host-extended, no policy", asdict(validate_skill_text(HOST, "release-readiness")))
    show("host-extended, allowed by host policy", asdict(validate_skill_text(HOST, "release-readiness", ("disable-model-invocation",))))
    bad_name = VALID.replace("name: release-readiness", "name: deploy-prod")
    show("name does not match directory", asdict(validate_skill_text(bad_name, "release-readiness")))
    show("missing description", asdict(validate_skill_text("---\nname: release-readiness\n---\n\n# Body\ntext\n", "release-readiness")))
    show("empty body", asdict(validate_skill_text("---\nname: release-readiness\ndescription: Inspect releases.\n---\n", "release-readiness")))
    show("unclosed frontmatter", asdict(validate_skill_text("---\nname: release-readiness\n", "release-readiness")))
    show("list value in frontmatter", asdict(validate_skill_text("---\nname: release-readiness\ndescription:\n  - a\n---\nbody\n", "release-readiness")))
    print("=== primitive chooser ===")
    print("reusable release procedure ->", select_primitives(TaskShape(reusable_judgment=True)))
    print("check after every tool call ->", select_primitives(TaskShape(must_run_every_time=True)))
    print("fetch typed PR data ->", select_primitives(TaskShape(external_typed_capability=True)))
    print("never edit generated/ ->", select_primitives(TaskShape(repo_specific_guidance=True)))
    print("one-off question ->", select_primitives(TaskShape()))
    print("PR opened workflow ->", select_primitives(TaskShape(True, True, True, True, False)))
    print("=== lifecycle states ===")
    print("found on disk only:", lifecycle({"discovered"}))
    print("activated but script not permitted:", lifecycle({"discovered", "validated", "cataloged", "selected", "activated"}))
