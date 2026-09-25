"""Teaching implementation (our own, NOT the original main.py): skill invocation and routing.
The lexical scorer is a deterministic teaching stand-in; real routing is usually an LLM decision."""
import json, re
from dataclasses import dataclass, field
from enum import Enum
from typing import Any, Mapping, Optional, Sequence

class Actor(str, Enum):
    HUMAN = "human"; MODEL = "model"; AUTONOMOUS_AGENT = "autonomous_agent"
    APPLICATION = "application"; SKILL = "skill"; HARNESS = "harness"

@dataclass(frozen=True)
class InvocationPolicy:
    human: bool = True
    model: bool = True
    autonomous_agent: bool = True
    application: bool = True
    skill: bool = False
    harness: bool = True
    exact_name_allowlist: Mapping[Actor, frozenset] = field(default_factory=dict)

    def allows_actor(self, actor):
        return {Actor.HUMAN: self.human, Actor.MODEL: self.model, Actor.AUTONOMOUS_AGENT: self.autonomous_agent,
                Actor.APPLICATION: self.application, Actor.SKILL: self.skill, Actor.HARNESS: self.harness}[actor]

    def allows_exact_name(self, actor, name):
        allowed = self.exact_name_allowlist.get(actor)
        return True if allowed is None else name in allowed

@dataclass(frozen=True)
class SkillMetadata:
    name: str
    description: str
    positive_terms: tuple = ()
    negative_terms: tuple = ()
    policy: InvocationPolicy = field(default_factory=InvocationPolicy)
    host_extensions: Mapping[str, Any] = field(default_factory=dict)

@dataclass(frozen=True)
class InvocationRequest:
    actor: Actor
    text: str
    explicit_skill: Optional[str] = None
    threshold: float = 0.40
    ambiguity_margin: float = 0.10

@dataclass(frozen=True)
class InvocationDecision:
    status: str
    selected_skill: Optional[str]
    reason: str
    score: Optional[float] = None
    eligible_skills: tuple = ()
    blocked_skills: tuple = ()
    ranked_candidates: tuple = ()
    policy_source: Optional[str] = None

class CorePolicyAdapter:
    def actor_allowed(self, skill, actor):
        return skill.policy.allows_actor(actor), "core-policy"
    def exact_name_allowed(self, skill, actor):
        return skill.policy.allows_exact_name(actor, skill.name), "core-exact-name-policy"

class ExtensionPolicyAdapter(CorePolicyAdapter):
    RECOGNIZED = frozenset({"user-invocable", "disable-model-invocation", "allow_implicit_invocation"})
    def actor_allowed(self, skill, actor):
        ok, src = super().actor_allowed(skill, actor)
        if not ok: return False, src
        ext, modelish = skill.host_extensions, actor in {Actor.MODEL, Actor.AUTONOMOUS_AGENT}
        if actor == Actor.HUMAN and ext.get("user-invocable") is False: return False, "extension:user-invocable"
        if modelish and ext.get("disable-model-invocation") is True: return False, "extension:disable-model-invocation"
        if modelish and ext.get("allow_implicit_invocation") is False: return False, "extension:allow_implicit_invocation"
        return True, "extension:no-blocking-field"

def build_invocation_matrix(policy):
    mode = ("shared" if policy.human and policy.model else "human-only" if policy.human else
            "model-only" if policy.model else "disabled-or-application-only")
    return {"human": "allow" if policy.human else "deny", "model": "allow" if policy.model else "deny", "mode": mode}

def tokenize(text):
    return tuple(re.findall(r"[a-z0-9]+(?:[._-][a-z0-9]+)*", text.lower()))

def relevance_score(skill, text):
    req, desc = set(tokenize(text)), set(tokenize(skill.description))
    if not req: return 0.0
    overlap = len(req & desc) / len(req)
    pos = sum(1 for t in skill.positive_terms if t in req) / max(1, len(skill.positive_terms))
    neg = sum(1 for t in skill.negative_terms if t in req) / max(1, len(skill.negative_terms))
    return round(max(0.0, min(1.0, 0.60 * overlap + 0.40 * pos - 0.60 * neg)), 4)

def route_explicit(skills, request, adapter):
    skill = next((s for s in skills if s.name == request.explicit_skill), None)
    if skill is None:
        return InvocationDecision("not_found", None, f"explicit skill {request.explicit_skill!r} was not discovered")
    ok, src = adapter.actor_allowed(skill, request.actor)
    if not ok:
        return InvocationDecision("denied", None, f"{request.actor.value} is not eligible to invoke {skill.name}", blocked_skills=(skill.name,), policy_source=src)
    ok2, src2 = adapter.exact_name_allowed(skill, request.actor)
    if not ok2:
        return InvocationDecision("denied", None, f"{skill.name} is outside the exact-name allowlist for {request.actor.value}", blocked_skills=(skill.name,), policy_source=src2)
    return InvocationDecision("selected", skill.name, "explicit identity resolved and policy permits invocation", eligible_skills=(skill.name,), policy_source=src)

def route_implicit(skills, request, adapter):
    blocked_names = tuple(s.name for s in skills if not adapter.actor_allowed(s, request.actor)[0])
    eligible = [s for s in skills if adapter.actor_allowed(s, request.actor)[0]]   # eligibility BEFORE ranking
    names = tuple(s.name for s in eligible)
    if not eligible:
        return InvocationDecision("abstained", None, "no discovered skill is eligible for this actor", blocked_skills=blocked_names)
    scored = sorted(((s, relevance_score(s, request.text)) for s in eligible), key=lambda x: (x[1], x[0].name), reverse=True)
    ranked = tuple((s.name, sc) for s, sc in scored)
    best, best_score = scored[0]
    if best_score < request.threshold:
        return InvocationDecision("abstained", None, "best eligible candidate is below the activation threshold", best_score, names, blocked_names, ranked)
    if len(scored) > 1 and best_score - scored[1][1] < request.ambiguity_margin:
        return InvocationDecision("abstained", None, f"ambiguous between {best.name} and {scored[1][0].name}", best_score, names, blocked_names, ranked)
    return InvocationDecision("selected", best.name, "strongest eligible candidate cleared threshold and ambiguity rules", best_score, names, blocked_names, ranked)

def route_request(skills, request, adapter):
    return route_explicit(skills, request, adapter) if request.explicit_skill is not None else route_implicit(skills, request, adapter)

def catalog():
    release = InvocationPolicy(skill=True)
    build = InvocationPolicy(skill=False)
    security = InvocationPolicy(model=False, autonomous_agent=False, skill=True)
    return [
        SkillMetadata("release-readiness", "Inspect an already prepared release candidate and produce a readiness report when a version, tag, package, or image is ready to publish.",
                      ("release", "candidate", "publish", "version"), ("failed", "failure", "feature"), release),
        SkillMetadata("build-diagnostics", "Diagnose ordinary package build failures and CI build errors.",
                      ("build", "failed", "failure", "ci"), ("publish",), build),
        SkillMetadata("security-change-review", "Review security implications of dependency and configuration changes.",
                      ("security", "dependency", "risk"), (), security, {"disable-model-invocation": True}),
    ]

def show(label, d):
    print(f"--- {label} ---")
    print(f"status: {d.status} | skill: {d.selected_skill} | score: {d.score} | source: {d.policy_source}")
    print(f"reason: {d.reason}")
    if d.eligible_skills: print("eligible:", ", ".join(d.eligible_skills))
    if d.blocked_skills: print("blocked:", ", ".join(d.blocked_skills))
    for n, s in d.ranked_candidates: print(f"  {n:<24} {s:.4f}")

def broken_rank_then_check(skills, request, adapter):
    """The WRONG order: rank everything, then check policy on the winner."""
    best = max(skills, key=lambda s: relevance_score(s, request.text))
    ok, _ = adapter.actor_allowed(best, request.actor)
    return best.name, ("selected" if ok else "denied and STOPPED")

@dataclass(frozen=True)
class SkillInvocation:
    target_skill: str
    task: str
    inputs: tuple
    expected: str
    max_depth: int

def validate_composition(inv, path):
    if len(path) >= inv.max_depth: return False, "maximum composition depth reached"
    if inv.target_skill in path: return False, "skill invocation cycle detected"
    return True, "allowed"

def bind_release_arguments(args):
    if not str(args.get("candidate", "")).strip(): raise ValueError("candidate is required")
    if args.get("publish", False) is not False: raise ValueError("publish must remain false")
    return {"candidate": args["candidate"].strip(), "publish": False}

if __name__ == "__main__":
    skills, core, ext = catalog(), CorePolicyAdapter(), ExtensionPolicyAdapter()
    print("=== 1. the human/model 2x2 matrix ===")
    for label, p in [("shared", InvocationPolicy()), ("human-only", InvocationPolicy(model=False)),
                     ("model-only", InvocationPolicy(human=False)), ("neither", InvocationPolicy(human=False, model=False))]:
        print(f"  {label:<10} -> {build_invocation_matrix(p)}")
    print("=== 2. decisions ===")
    show("explicit human", route_request(skills, InvocationRequest(Actor.HUMAN, "Use release-readiness for version 2.4.0.", "release-readiness"), core))
    show("explicit, unknown skill", route_request(skills, InvocationRequest(Actor.HUMAN, "Use quantum-release-validator.", "quantum-release-validator"), core))
    show("implicit model, clear match", route_request(skills, InvocationRequest(Actor.MODEL, "Is this release candidate ready to publish?", threshold=0.35), core))
    show("near miss", route_request(skills, InvocationRequest(Actor.MODEL, "Why did today's package build fail?", threshold=0.25), core))
    show("unrelated request", route_request(skills, InvocationRequest(Actor.MODEL, "Explain rotary position embeddings.", threshold=0.25), core))
    print("=== 3. eligibility before ranking (blocked top match) ===")
    incident = [SkillMetadata("incident-triage", "Triage a production incident quickly and page the on-call engineer.",
                              ("incident", "triage", "production", "page"), (), InvocationPolicy(), {"disable-model-invocation": True}),
                SkillMetadata("incident-review", "Review a finished incident and write a blameless summary.",
                              ("incident", "review", "summary"), (), InvocationPolicy())]
    q = InvocationRequest(Actor.MODEL, "Triage this production incident.", threshold=0.30)
    print("  raw relevance ignoring policy:", [(s.name, relevance_score(s, q.text)) for s in incident])
    print("  wrong order (rank all, then check policy):", broken_rank_then_check(incident, q, ext))
    show("correct order (extension adapter)", route_request(incident, q, ext))
    q2 = InvocationRequest(Actor.MODEL, "Triage this production incident.", threshold=0.25)
    show("same request, threshold 0.25", route_request(incident, q2, ext))
    print("=== 4. same skill, different actor ===")
    show("application explicit", route_request(skills, InvocationRequest(Actor.APPLICATION, "Run the dependency security review.", "security-change-review"), ext))
    show("model explicit", route_request(skills, InvocationRequest(Actor.MODEL, "Run the dependency security review.", "security-change-review"), ext))
    print("=== 5. exact-name allowlist ===")
    restricted = [SkillMetadata("release-readiness", "desc", policy=InvocationPolicy(exact_name_allowlist={Actor.APPLICATION: frozenset({"other-skill"})}))]
    show("application outside allowlist", route_request(restricted, InvocationRequest(Actor.APPLICATION, "x", "release-readiness"), core))
    print("=== 6. ambiguity margin ===")
    twins = [SkillMetadata("release-readiness", "Check whether a deployment is safe to release", ("release", "safe", "deployment")),
             SkillMetadata("deployment-readiness", "Check whether a deployment is safe to release", ("release", "safe", "deployment"))]
    show("two near-identical skills", route_request(twins, InvocationRequest(Actor.MODEL, "Check whether this deployment is safe to release.", threshold=0.3), core))
    print("=== 7. core adapter ignores host extensions; extension adapter honours them ===")
    print("  core:     ", core.actor_allowed(incident[0], Actor.MODEL))
    print("  extension:", ext.actor_allowed(incident[0], Actor.MODEL))
    print("  extension, human on same skill:", ext.actor_allowed(incident[0], Actor.HUMAN))
    print("=== 8. composition guard ===")
    inv = SkillInvocation("security-change-review", "Review dependency changes", ("artifacts/release.diff",), "risk-report.json", 2)
    print("  first hop:", validate_composition(inv, ["release-readiness"]))
    print("  cycle:    ", validate_composition(SkillInvocation("release-readiness", "t", (), "x", 3), ["release-readiness", "security-change-review"]))
    print("  too deep: ", validate_composition(inv, ["a", "b"]))
    print("=== 9. argument binding keeps text as data ===")
    print("  ok:", bind_release_arguments({"candidate": " v2.4.0 "}))
    for bad in ({"candidate": ""}, {"candidate": "v2.4.0", "publish": True}):
        try: bind_release_arguments(bad)
        except ValueError as e: print(f"  {bad} -> ValueError: {e}")
    print("  a hostile string stays one data value:", bind_release_arguments({"candidate": "v2.4.0; rm -rf important-directory"}))
