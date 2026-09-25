module.exports = {
 "phaseId": "6a369d5e66020ed05b3214c3",
 "moduleId": "6ab6d18eb7119db96ad77965",
 "order": 0,
 "type": "interactive",
 "duration": 45,
 "difficulty": "intermediate",
 "status": "published",
 "title": "Skill Discovery and Progressive Disclosure (Part 1 of 3) — From Filesystem to a Deterministic Catalog",
 "titleKn": "Skill Discovery ಮತ್ತು Progressive Disclosure (Part 1 of 3) — Filesystem ಇಂದ ನಿರ್ಧಾರಾತ್ಮಕ Catalog ಗೆ",
 "desc": "A skill should be discoverable before its instructions or resources are loaded. Build discovery as a compiler pipeline: explicit scopes with precedence, shallow candidate enumeration, validation with diagnostics, deterministic collision resolution, and a budget-bounded model-visible catalog.",
 "descKn": "skill ಅದರ ಸೂಚನೆಗಳು ಲೋಡ್ ಆಗುವ ಮೊದಲೇ ಪತ್ತೆಯಾಗಬೇಕು. discovery ಅನ್ನು compiler pipeline ಆಗಿ ನಿರ್ಮಿಸಿ: ಸ್ಪಷ್ಟ scopes, ಶಾಲೋ enumeration, ಮಾನ್ಯತೆ, ನಿರ್ಧಾರಾತ್ಮಕ collision, ಬಜೆಟ್ catalog.",
 "objectives": [
  "Explain why discovery is not recursively finding SKILL.md and list the stages it really has.",
  "Model Scope with explicit precedence and SkillCandidate as a found-but-unpublished package.",
  "Enumerate only immediate child directories so nested fixtures and examples are never published.",
  "Resolve duplicate names deterministically, keep the shadowed candidate in diagnostics and treat equal precedence as ambiguous.",
  "Build a model-visible catalog under a serialized-size budget and record what was omitted."
 ],
 "objectivesKn": [
  "discovery ಎಂದರೆ SKILL.md ಅನ್ನು ಪುನರಾವರ್ತಿತವಾಗಿ ಹುಡುಕುವುದು ಅಲ್ಲ ಎಂದು ವಿವರಿಸಿ.",
  "ಸ್ಪಷ್ಟ precedence ಇರುವ Scope ಮತ್ತು SkillCandidate ಮಾದರಿ ಮಾಡಿ.",
  "ತಕ್ಷಣದ ಮಕ್ಕಳ ಡೈರೆಕ್ಟರಿಗಳನ್ನು ಮಾತ್ರ enumerate ಮಾಡಿ.",
  "ನಕಲು ಹೆಸರುಗಳನ್ನು ನಿರ್ಧಾರಾತ್ಮಕವಾಗಿ ಪರಿಹರಿಸಿ; ಸಮಾನ precedence ಅಸ್ಪಷ್ಟ.",
  "ಬಜೆಟ್ ಒಳಗೆ catalog ನಿರ್ಮಿಸಿ."
 ],
 "blocks": [
  {
   "type": "heading",
   "data": {
    "textEn": "Skill Discovery and Progressive Disclosure (Part 1 of 3)",
    "textKn": "Skill Discovery and Progressive Disclosure (Part 1 of 3)",
    "level": "H1"
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "Lesson Info",
    "headingKn": "Lesson ಮಾಹಿತಿ",
    "bodyEn": "• Type: Build · Language: Python (stdlib only) · Time: ~45 minutes. The source lesson describes its main.py but does not include the code, so the program here is our own teaching implementation of the same components (Scope, SkillCandidate, discover_scope, resolve_collisions, CatalogEntry, CatalogBudget, build_catalog, load_skill_body, validate_reference, load_reference). All outputs were produced by genuinely running it in temporary directories. Its limits (4000-char body, 2000-byte reference, the catalog budget) are our teaching numbers.",
    "bodyKn": "• Type: Build · Language: Python (stdlib only) · Time: ~45 ನಿಮಿಷಗಳು. ಮೂಲ ಪಾಠ main.py ಕೋಡ್ ಒಳಗೊಂಡಿಲ್ಲ; ಇಲ್ಲಿನ ಕಾರ್ಯಕ್ರಮ ಅದೇ ಘಟಕಗಳ ನಮ್ಮದೇ ಬೋಧನಾ ಅನುಷ್ಠಾನ. ಎಲ್ಲಾ outputs ತಾತ್ಕಾಲಿಕ ಡೈರೆಕ್ಟರಿಗಳಲ್ಲಿ ನಿಜವಾಗಿ ಚಲಾಯಿಸಿ ಪಡೆದವು. ಮಿತಿಗಳು ನಮ್ಮ ಬೋಧನಾ ಸಂಖ್ಯೆಗಳು."
   }
  },
  {
   "type": "heading",
   "data": {
    "textEn": "Why Discovery Is a Pipeline",
    "textKn": "Discovery ಒಂದು Pipeline ಏಕೆ",
    "level": "H2"
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "Neither Everything Nor Nothing",
    "headingKn": "ಎಲ್ಲವೂ ಅಲ್ಲ, ಏನೂ ಇಲ್ಲದಿರುವುದೂ ಅಲ್ಲ",
    "bodyEn": "With 200 installed skills, loading every SKILL.md, reference, script and asset into context wastes it on unrelated workflows. Loading nothing leaves the model unaware that skills exist. The answer is a catalog: expose compact routing metadata first, load the selected skill's body second, and load only the branch-specific resources third. That is progressive disclosure, and it needs reliable discovery first.",
    "bodyKn": "200 skills ಇದ್ದರೆ ಎಲ್ಲವನ್ನೂ context ಗೆ ಹಾಕುವುದು ವ್ಯರ್ಥ; ಏನನ್ನೂ ಹಾಕದಿದ್ದರೆ ಮಾದರಿಗೆ skills ಇವೆ ಎಂದೇ ತಿಳಿಯದು. ಪರಿಹಾರ catalog."
   }
  },
  {
   "type": "table",
   "data": {
    "headingEn": "Key terms",
    "headers": [
     "Term",
     "Practical meaning"
    ],
    "rows": [
     [
      "Skill discovery",
      "Find candidates, validate them, attach source and scope, resolve conflicts, decide what may enter the catalog"
     ],
     [
      "Skill catalog",
      "Small model-visible representation of eligible skills"
     ],
     [
      "Collision policy",
      "Deterministic rule for two packages with the same name"
     ],
     [
      "Progressive disclosure",
      "Metadata first, instructions second, branch-specific resources third"
     ],
     [
      "Reference graph",
      "Resources reachable from SKILL.md and the conditions for loading each"
     ],
     [
      "Path containment",
      "Proof that a requested resource still resolves inside its skill package"
     ]
    ]
   }
  },
  {
   "type": "diagram",
   "data": {
    "titleEn": "Discovery as compilation",
    "titleKn": "Compilation ಆಗಿ Discovery",
    "contentEn": "configured roots (scopes)\n   -> enumerate immediate skill directories\n   -> find SKILL.md\n   -> validate package shape + limits      --> rejected (diagnostics)\n   -> attach scope + source (provenance)\n   -> resolve collisions                    --> shadowed / ambiguous (diagnostics)\n   -> apply a bounded catalog budget        --> omitted (diagnostics)\n   -> publish name + description + path"
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "Failures Must Be Structured",
    "headingKn": "ವೈಫಲ್ಯಗಳು ರಚನಾತ್ಮಕವಾಗಿರಬೇಕು",
    "bodyEn": "Wrapping discovery in try/except and moving on hides the answer to the question \"why did the model not use my skill?\". The discovery log should say which roots were searched, which candidates were rejected and why, which candidate won a collision, and which entries were omitted by the budget. Our lab keeps a diagnostics dictionary with exactly those four lists.",
    "bodyKn": "try/except ಹಾಕಿ ಮುಂದುವರಿದರೆ \"ನನ್ನ skill ಅನ್ನು ಮಾದರಿ ಏಕೆ ಬಳಸಲಿಲ್ಲ?\" ಎಂಬ ಪ್ರಶ್ನೆಗೆ ಉತ್ತರ ಮರೆಯಾಗುತ್ತದೆ. diagnostics ಇರಬೇಕು."
   }
  },
  {
   "type": "heading",
   "data": {
    "textEn": "Scope, Candidate and Shallow Discovery",
    "textKn": "Scope, Candidate ಮತ್ತು ಶಾಲೋ Discovery",
    "level": "H2"
   }
  },
  {
   "type": "code",
   "data": {
    "filename": "discovery_lab.py",
    "headingEn": "The data model (our implementation)",
    "headingKn": "ಡೇಟಾ ಮಾದರಿ (ನಮ್ಮ ಅನುಷ್ಠಾನ)",
    "descEn": "A Scope says where skills came from and carries an explicit numeric rank. A SkillCandidate is a found package that has not necessarily been published. A CatalogEntry is the compact thing the model sees. Precedence is host policy, so SKILL.md never claims \"I override user skills\".",
    "descKn": "Scope skills ಎಲ್ಲಿಂದ ಬಂದವು ಎಂದು ಮತ್ತು ಸ್ಪಷ್ಟ rank ಹೊಂದಿದೆ. SkillCandidate ಪ್ರಕಟಿಸದ ಪ್ಯಾಕೇಜ್. CatalogEntry ಮಾದರಿ ನೋಡುವ ಸಂಕ್ಷಿಪ್ತ ರೂಪ.",
    "code": "@dataclass(frozen=True)\nclass Scope:\n    name: str\n    root: Path\n    rank: int          # higher wins a collision; explicit, never directory order\n\n@dataclass(frozen=True)\nclass SkillCandidate:\n    name: str\n    description: str\n    skill_dir: Path\n    scope: str\n    rank: int\n\n@dataclass(frozen=True)\nclass CatalogEntry:\n    name: str\n    description: str\n    scope: str\n    path: str\n\n@dataclass\nclass CatalogBudget:\n    max_chars: int"
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
    "filename": "discovery_lab.py",
    "headingEn": "discover_scope: immediate children only, validated",
    "headingKn": "discover_scope: ತಕ್ಷಣದ ಮಕ್ಕಳು ಮಾತ್ರ, ಮಾನ್ಯಗೊಳಿಸಿದ",
    "descEn": "Only immediate child directories that contain SKILL.md are candidates. A nested SKILL.md (an example or a fixture) is never a package entry point. Each candidate is validated: frontmatter present, name equals directory, description and body present, body within the limit. Failures go to diagnostics instead of being silently dropped.",
    "descKn": "ತಕ್ಷಣದ ಮಕ್ಕಳ ಡೈರೆಕ್ಟರಿಗಳು ಮಾತ್ರ ಅಭ್ಯರ್ಥಿಗಳು. ಒಳಗಿನ SKILL.md ಎಂದಿಗೂ package ಪ್ರವೇಶ ಅಲ್ಲ. ವೈಫಲ್ಯಗಳು diagnostics ಗೆ.",
    "code": "MAX_BODY = 4000\nMAX_REF = 2000\n\ndef read_meta(skill_file):\n    text = skill_file.read_text(encoding=\"utf-8\")\n    lines = text.split(\"\\n\")\n    if lines[0].strip() != \"---\" or \"---\" not in [l.strip() for l in lines[1:]]:\n        return None\n    end = [l.strip() for l in lines[1:]].index(\"---\") + 1\n    meta = dict(l.split(\":\", 1) for l in lines[1:end] if \":\" in l)\n    return {k.strip(): v.strip() for k, v in meta.items()}, \"\\n\".join(lines[end + 1:]).strip()\n\ndef discover_scope(scope, diagnostics):\n    found = []\n    diagnostics[\"searched\"].append(scope.name)\n    for child in sorted(scope.root.iterdir()):            # immediate children only\n        skill_file = child / \"SKILL.md\"\n        if not child.is_dir() or not skill_file.is_file():\n            continue\n        parsed = read_meta(skill_file)\n        if not parsed:\n            diagnostics[\"rejected\"].append((scope.name, child.name, \"bad frontmatter\")); continue\n        meta, body = parsed\n        if meta.get(\"name\") != child.name:\n            diagnostics[\"rejected\"].append((scope.name, child.name, f\"name {meta.get('name')!r} != directory\")); continue\n        if not meta.get(\"description\") or not body:\n            diagnostics[\"rejected\"].append((scope.name, child.name, \"missing description or body\")); continue\n        if len(body) > MAX_BODY:\n            diagnostics[\"rejected\"].append((scope.name, child.name, \"body too large\")); continue\n        found.append(SkillCandidate(meta[\"name\"], meta[\"description\"], child, scope.name, scope.rank))\n    return found"
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
    "filename": "discovery_lab.py",
    "headingEn": "A workspace scope and a user scope",
    "headingKn": "workspace scope ಮತ್ತು user scope",
    "descEn": "make_world builds a temporary world: a workspace with release-readiness (with a nested example/SKILL.md fixture and a stray notes.txt) and a user scope with a release-readiness of its own, a sql-analysis skill, and a bad-name skill whose metadata name does not match its directory. Discovery returns three candidates and rejects the fourth with a reason; the nested fixture and notes.txt never appear.",
    "descKn": "make_world ತಾತ್ಕಾಲಿಕ ಜಗತ್ತು ನಿರ್ಮಿಸುತ್ತದೆ. discovery ಮೂರು ಅಭ್ಯರ್ಥಿಗಳನ್ನು ನೀಡಿ ನಾಲ್ಕನೆಯದನ್ನು ಕಾರಣದೊಂದಿಗೆ ತಿರಸ್ಕರಿಸುತ್ತದೆ; ನಿಸ್ಸಾರ fixture ಕಾಣುವುದಿಲ್ಲ.",
    "code": "diag = {\"searched\": [], \"rejected\": [], \"shadowed\": [], \"ambiguous\": [], \"omitted\": []}\ncands = discover_scope(wsc, diag) + discover_scope(usc, diag)\nfor c in cands:\n    print(f\"  candidate {c.name} from {c.scope} (rank {c.rank})\")\nprint(\"  rejected:\", diag[\"rejected\"])"
   }
  },
  {
   "type": "output",
   "data": {
    "output": "candidate release-readiness from workspace (rank 100)\n  candidate release-readiness from user (rank 50)\n  candidate sql-analysis from user (rank 50)\n  rejected: [('user', 'bad-name', \"name 'other-name' != directory\")]"
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "Why Not rglob(\"SKILL.md\")",
    "headingKn": "rglob(\"SKILL.md\") ಏಕೆ ಬೇಡ",
    "bodyEn": "A recursive search would have published references/example/SKILL.md as a skill named fake. Packages are directories one level under a scope root; anything deeper is example, fixture or reference material. Preserving that boundary is what keeps examples from being installed by accident.",
    "bodyKn": "ಪುನರಾವರ್ತಿತ ಹುಡುಕಾಟ references/example/SKILL.md ಅನ್ನು ಸ್ಕಿಲ್ ಎಂದು ಪ್ರಕಟಿಸುತ್ತಿತ್ತು. package ಗಡಿ ಕಾಪಾಡಿ."
   }
  },
  {
   "type": "heading",
   "data": {
    "textEn": "Deterministic Collisions",
    "textKn": "ನಿರ್ಧಾರಾತ್ಮಕ Collisions",
    "level": "H2"
   }
  },
  {
   "type": "table",
   "data": {
    "headingEn": "Four collision policies",
    "headers": [
     "Policy",
     "Result"
    ],
    "rows": [
     [
      "Keep every candidate",
      "Both remain visible"
     ],
     [
      "Highest precedence wins",
      "One deterministic winner"
     ],
     [
      "Reject duplicates",
      "Neither silently shadows the other"
     ],
     [
      "Qualify names by source",
      "Distinct qualified identities"
     ]
    ]
   }
  },
  {
   "type": "code",
   "data": {
    "filename": "discovery_lab.py",
    "headingEn": "resolve_collisions: explicit precedence, ties are ambiguous",
    "headingKn": "resolve_collisions: ಸ್ಪಷ್ಟ precedence, ಸಮಾನತೆ ಅಸ್ಪಷ್ಟ",
    "descEn": "Group by name and sort by rank. A unique highest rank wins and the losers are recorded as shadowed rather than discarded. An equal-rank tie is reported as ambiguous and neither is selected, because \"whichever the filesystem listed first\" would make routing depend on incidental ordering.",
    "descKn": "ಹೆಸರಿನ ಪ್ರಕಾರ ಗುಂಪು ಮಾಡಿ rank ನಲ್ಲಿ ವಿಂಗಡಿಸಿ. ಸಮಾನ rank ಅಸ್ಪಷ್ಟ ಎಂದು ವರದಿ.",
    "code": "def resolve_collisions(candidates, diagnostics):\n    by_name = {}\n    for c in candidates: by_name.setdefault(c.name, []).append(c)\n    selected = []\n    for name in sorted(by_name):\n        group = sorted(by_name[name], key=lambda c: -c.rank)\n        if len(group) > 1 and group[0].rank == group[1].rank:\n            diagnostics[\"ambiguous\"].append((name, [c.scope for c in group if c.rank == group[0].rank]))\n            continue\n        selected.append(group[0])\n        for loser in group[1:]:\n            diagnostics[\"shadowed\"].append((name, loser.scope, \"by\", group[0].scope))\n    return selected"
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
    "filename": "discovery_lab.py",
    "headingEn": "Workspace beats user; a plugin tie is ambiguous",
    "headingKn": "workspace user ಅನ್ನು ಮೀರಿಸುತ್ತದೆ; plugin ಸಮಾನತೆ ಅಸ್ಪಷ್ಟ",
    "descEn": "The workspace copy of release-readiness (rank 100) wins over the user copy (rank 50), and the user copy stays visible in diagnostics as shadowed. Two plugin copies at equal rank 50 produce no selection and an ambiguity report.",
    "descKn": "workspace (100) user (50) ಅನ್ನು ಮೀರಿಸುತ್ತದೆ; user ನಕಲು shadowed ಆಗಿ ಉಳಿಯುತ್ತದೆ. ಸಮಾನ rank ಎರಡು plugin ಗಳು ಆಯ್ಕೆ ಇಲ್ಲ.",
    "code": "selected = resolve_collisions(cands, diag)\nprint(\"  selected:\", [(c.name, c.scope) for c in selected])\nprint(\"  shadowed:\", diag[\"shadowed\"])\n\nd2 = {\"searched\": [], \"rejected\": [], \"shadowed\": [], \"ambiguous\": [], \"omitted\": []}\ntie = [SkillCandidate(\"release-readiness\", \"A\", tmp, \"plugin-a\", 50), SkillCandidate(\"release-readiness\", \"B\", tmp, \"plugin-b\", 50)]\nprint(\"  selected:\", resolve_collisions(tie, d2), \"| ambiguous:\", d2[\"ambiguous\"])"
   }
  },
  {
   "type": "output",
   "data": {
    "output": "selected: [('release-readiness', 'workspace'), ('sql-analysis', 'user')]\n  shadowed: [('release-readiness', 'user', 'by', 'workspace')]\nselected: [] | ambiguous: [('release-readiness', ['plugin-a', 'plugin-b'])]"
   }
  },
  {
   "type": "heading",
   "data": {
    "textEn": "The Bounded Catalog",
    "textKn": "ಬಜೆಟ್ ಇರುವ Catalog",
    "level": "H2"
   }
  },
  {
   "type": "code",
   "data": {
    "filename": "discovery_lab.py",
    "headingEn": "build_catalog with a CatalogBudget",
    "headingKn": "CatalogBudget ಜೊತೆ build_catalog",
    "descEn": "Each entry is costed by its actual serialized form (here JSON length), not by an assumed characters-equal-tokens ratio. Entries that do not fit are omitted and named in diagnostics. What the model sees is only name, description, scope and path, never a body.",
    "descKn": "ಪ್ರತಿ entry ಅನ್ನು ವಾಸ್ತವ serialized ರೂಪದಿಂದ ಬೆಲೆ ಕಟ್ಟಲಾಗುತ್ತದೆ. ಹೊಂದದ entries omitted ಆಗಿ diagnostics ನಲ್ಲಿ ಹೆಸರಿಸಲ್ಪಡುತ್ತವೆ.",
    "code": "def build_catalog(selected, budget, diagnostics):\n    catalog, used = [], 0\n    for c in selected:\n        entry = CatalogEntry(c.name, c.description, c.scope, str(c.skill_dir))\n        cost = len(json.dumps(entry.__dict__))\n        if used + cost > budget.max_chars:\n            diagnostics[\"omitted\"].append(c.name); continue\n        catalog.append(entry); used += cost\n    return catalog, used\n\nbig, used_big = build_catalog(selected, CatalogBudget(10000), {\"omitted\": []})\ncatalog, used = build_catalog(selected, CatalogBudget(330), diag)\nprint(f\"  big budget: {len(big)} entries, {used_big} chars | budget 330: {len(catalog)} entries, {used} chars\")\nprint(\"  omitted:\", diag[\"omitted\"])\nprint(\"  model sees:\", [(e.name, e.scope) for e in catalog])"
   }
  },
  {
   "type": "output",
   "data": {
    "output": "big budget: 2 entries, 513 chars | budget 330: 1 entries, 302 chars\n  omitted: ['sql-analysis']\n  model sees: [('release-readiness', 'workspace')]"
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "A Description Has Two Clauses",
    "headingKn": "Description ಎರಡು ಉಪವಾಕ್ಯಗಳು",
    "bodyEn": "A good catalog description states the capability and the trigger boundary: \"Validate a release candidate and produce a readiness report. Use when the user asks whether a version, tag, or package is ready to publish.\" The first sentence says what the skill can do; the second says when to use it. That is what lets the model route from a catalog entry alone.",
    "bodyKn": "ಒಳ್ಳೆಯ description capability ಮತ್ತು trigger ಗಡಿ ಹೇಳುತ್ತದೆ. ಅದರಿಂದ ಮಾದರಿ catalog ನಿಂದಲೇ routing ಮಾಡಬಹುದು."
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "Key Takeaways",
    "headingKn": "ಮುಖ್ಯ ಅಂಶಗಳು",
    "bodyEn": "• Discovery is enumerate, validate, attach provenance, resolve collisions, apply a budget and publish, not \"find SKILL.md\".\n• In our run discovery found 3 candidates, rejected bad-name for a name/directory mismatch, and never saw the nested fixture or notes.txt.\n• Workspace (rank 100) won over user (rank 50) and the loser was kept as shadowed; two plugins at rank 50 were reported ambiguous with nothing selected.\n• A budget of 330 published 1 entry (302 chars) and named sql-analysis as omitted; a budget of 10000 published both (513 chars).\n• Nothing loaded a body, reference, script or asset yet.",
    "bodyKn": "• Discovery = enumerate, validate, provenance, collisions, budget, publish.\n• ನಮ್ಮ run 3 ಅಭ್ಯರ್ಥಿಗಳನ್ನು ಕಂಡುಹಿಡಿಯಿತು.\n• workspace user ಅನ್ನು ಮೀರಿಸಿತು.\n• ಬಜೆಟ್ ಒಂದು entry ಪ್ರಕಟಿಸಿತು.\n• ಇನ್ನೂ ಯಾವ body ಯೂ ಲೋಡ್ ಆಗಿಲ್ಲ."
   }
  },
  {
   "type": "quiz",
   "data": {
    "questions": [
     {
      "q": "Why is recursively searching for every SKILL.md insufficient?",
      "qKn": "ಪ್ರತಿ SKILL.md ಅನ್ನು ಪುನರಾವರ್ತಿತವಾಗಿ ಹುಡುಕುವುದು ಅಸಮರ್ಪಕ ಏಕೆ?",
      "opts": [
       "Python cannot recurse",
       "Discovery also needs scope, validation, provenance, collision policy and publication rules",
       "SKILL.md cannot be nested",
       "Every skill is built in"
      ],
      "optsKn": [
       "Python ಗೆ ಸಾಧ್ಯವಿಲ್ಲ",
       "discovery ಗೆ scope, ಮಾನ್ಯತೆ, provenance, collision ನೀತಿ, ಪ್ರಕಟಣೆ ನಿಯಮಗಳೂ ಬೇಕು",
       "SKILL.md ನೆಸ್ಟ್ ಆಗುವುದಿಲ್ಲ",
       "ಎಲ್ಲವೂ built-in"
      ],
      "correct": 1
     },
     {
      "q": "What is SkillCandidate for?",
      "qKn": "SkillCandidate ಯಾವುದಕ್ಕೆ?",
      "opts": [
       "Executing a skill",
       "Representing a discovered package before publication or selection",
       "Storing model answers",
       "Loading references"
      ],
      "optsKn": [
       "skill ಚಲಾಯಿಸಲು",
       "ಪ್ರಕಟಣೆಗೆ ಮೊದಲು ಪತ್ತೆಯಾದ package ಪ್ರತಿನಿಧಿಸಲು",
       "ಮಾದರಿ ಉತ್ತರ ಸಂಗ್ರಹಿಸಲು",
       "references ಲೋಡ್ ಮಾಡಲು"
      ],
      "correct": 1
     },
     {
      "q": "Two release-readiness skills have equal rank. Why not take the first one the filesystem returned?",
      "qKn": "ಎರಡು release-readiness ಸಮಾನ rank. ಫೈಲ್‌ಸಿಸ್ಟಂ ಮೊದಲು ನೀಡಿದ್ದನ್ನು ಏಕೆ ತೆಗೆದುಕೊಳ್ಳಬಾರದು?",
      "opts": [
       "It uses too many tokens",
       "Routing would depend on incidental ordering and be hard to reproduce and audit",
       "Python forbids duplicates",
       "Both must run"
      ],
      "optsKn": [
       "ಹೆಚ್ಚು tokens",
       "routing ಆಕಸ್ಮಿಕ ಕ್ರಮವನ್ನು ಅವಲಂಬಿಸಿ ಪುನರುತ್ಪಾದನೆ ಕಷ್ಟ",
       "Python ನಿಷೇಧಿಸುತ್ತದೆ",
       "ಎರಡೂ ಚಲಿಸಬೇಕು"
      ],
      "correct": 1
     },
     {
      "q": "What did the run do with the losing user copy of release-readiness?",
      "qKn": "ಸೋತ user ನಕಲಿಗೆ run ಏನು ಮಾಡಿತು?",
      "opts": [
       "Deleted it silently",
       "Kept it in diagnostics as shadowed",
       "Published it too",
       "Executed it"
      ],
      "optsKn": [
       "ಮೌನವಾಗಿ ಅಳಿಸಿತು",
       "shadowed ಆಗಿ diagnostics ನಲ್ಲಿ ಉಳಿಸಿತು",
       "ಇದನ್ನೂ ಪ್ರಕಟಿಸಿತು",
       "ಚಲಾಯಿಸಿತು"
      ],
      "correct": 1
     },
     {
      "q": "What should the initial catalog primarily contain?",
      "qKn": "ಆರಂಭಿಕ catalog ಪ್ರಮುಖವಾಗಿ ಏನು ಹೊಂದಿರಬೇಕು?",
      "opts": [
       "Every script and reference",
       "Full SKILL.md bodies",
       "Compact routing metadata such as name and description",
       "Output of every skill"
      ],
      "optsKn": [
       "ಎಲ್ಲಾ scripts, references",
       "ಪೂರ್ಣ SKILL.md bodies",
       "name ಮತ್ತು description ನಂತಹ ಸಂಕ್ಷಿಪ್ತ routing metadata",
       "ಪ್ರತಿ skill ನ output"
      ],
      "correct": 2
     }
    ]
   }
  }
 ]
};
