module.exports = {
 "phaseId": "6a369d5e66020ed05b3214c3",
 "moduleId": "6a369d6066020ed05b321505",
 "order": 2,
 "type": "interactive",
 "duration": 55,
 "difficulty": "advanced",
 "status": "published",
 "title": "Agent Skills: Portable Contract and Runtime Boundary (Part 3 of 3) — Building a Skill Validator and Primitive Chooser",
 "titleKn": "Agent Skills: Portable Contract ಮತ್ತು Runtime Boundary (Part 3 of 3) — Skill Validator ಮತ್ತು Primitive Chooser ನಿರ್ಮಾಣ",
 "desc": "Build and run our own stdlib-only teaching validator (parse_frontmatter, validate_skill_text, ValidationIssue, SkillReport, FrontmatterSyntaxError) and primitive chooser (TaskShape, select_primitives). Every output is real, and the code is clearly labelled as ours, not the original main.py.",
 "descKn": "ನಮ್ಮದೇ stdlib-only ಬೋಧನಾ validator ಮತ್ತು primitive chooser ನಿರ್ಮಿಸಿ ಚಲಾಯಿಸಿ. ಎಲ್ಲಾ outputs ನಿಜ; ಕೋಡ್ ನಮ್ಮದು, ಮೂಲ main.py ಅಲ್ಲ.",
 "objectives": [
  "Separate parsing (can I interpret this safely?) from validation (does it satisfy the contract?) and raise FrontmatterSyntaxError only for the former.",
  "Return structured ValidationIssue codes inside a SkillReport instead of one opaque boolean.",
  "Enforce the validation order and fail on the first broken invariant so secondary errors do not hide it.",
  "Accept a host extension only through an explicit allowed_runtime_extensions policy and demonstrate both outcomes.",
  "Use TaskShape and select_primitives to decide whether a task should be a skill at all, and tell static validation, tests and real-host evidence apart."
 ],
 "objectivesKn": [
  "parsing ಮತ್ತು validation ಅನ್ನು ಬೇರ್ಪಡಿಸಿ.",
  "ಒಂದು boolean ಬದಲು ರಚನಾತ್ಮಕ ValidationIssue ಕೋಡ್‌ಗಳನ್ನು SkillReport ನಲ್ಲಿ ಹಿಂತಿರುಗಿಸಿ.",
  "validation ಕ್ರಮ ಜಾರಿಗೊಳಿಸಿ; ಮೊದಲ ಮುರಿದ ನಿಯಮದಲ್ಲಿ ವಿಫಲವಾಗಿ.",
  "host extension ಅನ್ನು ಸ್ಪಷ್ಟ policy ಮೂಲಕ ಮಾತ್ರ ಒಪ್ಪಿ.",
  "TaskShape ಮತ್ತು select_primitives ಬಳಸಿ ಕಾರ್ಯ skill ಆಗಬೇಕೇ ಎಂದು ನಿರ್ಧರಿಸಿ."
 ],
 "blocks": [
  {
   "type": "heading",
   "data": {
    "textEn": "Agent Skills: Portable Contract and Runtime Boundary (Part 3 of 3)",
    "textKn": "Agent Skills: Portable Contract and Runtime Boundary (Part 3 of 3)",
    "level": "H1"
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "Lesson Info",
    "headingKn": "Lesson ಮಾಹಿತಿ",
    "bodyEn": "• Type: Build · Language: Python (stdlib only) · Prerequisites: Parts 1 and 2 · Time: ~55 minutes · Part 3 of 3. IMPORTANT: the source lesson names an original main.py (parse_frontmatter, validate_skill_text, ValidationIssue, SkillReport, FrontmatterSyntaxError, TaskShape, select_primitives) but does not include its source. The code below is our own working implementation of those named components. Its rules (for example the 64/1024 limits and the E_ codes) are our choices for teaching, not a claim about the original.",
    "bodyKn": "• Type: Build · Language: Python (stdlib only) · Time: ~55 ನಿಮಿಷಗಳು · Part 3 of 3. ಗಮನಿಸಿ: ಮೂಲ ಪಾಠ main.py ಹೆಸರಿಸುತ್ತದೆ ಆದರೆ ಅದರ ಕೋಡ್ ಒಳಗೊಂಡಿಲ್ಲ. ಕೆಳಗಿನ ಕೋಡ್ ಆ ಘಟಕಗಳ ನಮ್ಮದೇ ಕಾರ್ಯಗತ ಅನುಷ್ಠಾನ; ನಿಯಮಗಳು ನಮ್ಮ ಆಯ್ಕೆಗಳು."
   }
  },
  {
   "type": "heading",
   "data": {
    "textEn": "Two Questions, Two Halves",
    "textKn": "ಎರಡು ಪ್ರಶ್ನೆಗಳು, ಎರಡು ಭಾಗಗಳು",
    "level": "H2"
   }
  },
  {
   "type": "diagram",
   "data": {
    "titleEn": "The program has two halves",
    "titleKn": "ಕಾರ್ಯಕ್ರಮದ ಎರಡು ಭಾಗಗಳು",
    "contentEn": "                 main program\n        +---------+---------+\n        |                   |\n  CONTRACT VALIDATOR   ARTIFACT CHOOSER\n  \"Is this valid?\"     \"Should this be a skill at all?\"\n  parse_frontmatter    TaskShape\n  validate_skill_text  select_primitives\n  ValidationIssue\n  SkillReport\n  FrontmatterSyntaxError"
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "Valid but Wrong Abstraction",
    "headingKn": "ಮಾನ್ಯ ಆದರೆ ತಪ್ಪು Abstraction",
    "bodyEn": "A perfectly valid SKILL.md can still be the wrong primitive: \"this check MUST run after every tool call\" belongs in a hook or application code, not in a skill the model may or may not select. So there are two separate questions: did you build the skill correctly, and should you have built a skill at all?",
    "bodyKn": "ಸಂಪೂರ್ಣ ಮಾನ್ಯ SKILL.md ಸಹ ತಪ್ಪು primitive ಆಗಿರಬಹುದು. ಆದ್ದರಿಂದ ಎರಡು ಪ್ರಶ್ನೆಗಳು: ಸರಿಯಾಗಿ ನಿರ್ಮಿಸಿದ್ದೀರಾ, ಮತ್ತು skill ನಿರ್ಮಿಸಬೇಕಿತ್ತೇ?"
   }
  },
  {
   "type": "heading",
   "data": {
    "textEn": "Parsing: Can I Interpret This Safely?",
    "textKn": "Parsing: ಇದನ್ನು ಸುರಕ್ಷಿತವಾಗಿ ಅರ್ಥೈಸಬಹುದೇ?",
    "level": "H2"
   }
  },
  {
   "type": "code",
   "data": {
    "filename": "skill_lab.py",
    "headingEn": "parse_frontmatter and its error type (our implementation)",
    "headingKn": "parse_frontmatter ಮತ್ತು ದೋಷ ಪ್ರಕಾರ (ನಮ್ಮ ಅನುಷ್ಠಾನ)",
    "descEn": "Parsing only separates metadata from body. It raises FrontmatterSyntaxError when the document cannot be safely interpreted (missing or unclosed delimiters, list or nested values). That is a syntax problem, distinct from valid metadata that breaks the contract. We deliberately support only flat key: value pairs, which is a teaching simplification, not real YAML.",
    "descKn": "Parsing metadata ಮತ್ತು body ಬೇರ್ಪಡಿಸುತ್ತದೆ. ಸುರಕ್ಷಿತವಾಗಿ ಅರ್ಥೈಸಲಾಗದಿದ್ದರೆ FrontmatterSyntaxError ಎತ್ತುತ್ತದೆ. ನಾವು ಸಮತಟ್ಟಾದ key: value ಮಾತ್ರ ಬೆಂಬಲಿಸುತ್ತೇವೆ; ಇದು ನಿಜ YAML ಅಲ್ಲ.",
    "code": "import json, re\nfrom dataclasses import dataclass, field, asdict\n\nPORTABLE_FIELDS = {\"name\", \"description\", \"license\", \"compatibility\", \"metadata\", \"allowed-tools\"}\nNAME_RE = re.compile(r\"^[a-z0-9]+(-[a-z0-9]+)*$\")\nMAX_NAME, MAX_DESC = 64, 1024\n\nclass FrontmatterSyntaxError(ValueError):\n    pass\n\n@dataclass\nclass ValidationIssue:\n    code: str\n    message: str\n\n@dataclass\nclass SkillReport:\n    directory: str\n    valid: bool\n    issues: list = field(default_factory=list)\n\ndef parse_frontmatter(text):\n    lines = text.split(\"\\n\")\n    if not lines or lines[0].strip() != \"---\":\n        raise FrontmatterSyntaxError(\"frontmatter must start with '---'\")\n    try:\n        end = next(i for i in range(1, len(lines)) if lines[i].strip() == \"---\")\n    except StopIteration:\n        raise FrontmatterSyntaxError(\"frontmatter is not closed by '---'\")\n    meta = {}\n    for raw in lines[1:end]:\n        if not raw.strip():\n            continue\n        if raw.startswith((\" \", \"\\t\", \"-\")):\n            raise FrontmatterSyntaxError(f\"nested or list value not supported: {raw.strip()!r}\")\n        if \":\" not in raw:\n            raise FrontmatterSyntaxError(f\"line is not 'key: value': {raw!r}\")\n        key, value = raw.split(\":\", 1)\n        meta[key.strip()] = value.strip()\n    return meta, \"\\n\".join(lines[end + 1:]).strip()"
   }
  },
  {
   "type": "output",
   "data": {
    "output": "(definitions only: no output yet)"
   }
  },
  {
   "type": "heading",
   "data": {
    "textEn": "Validation and Structured Evidence",
    "textKn": "Validation ಮತ್ತು ರಚನಾತ್ಮಕ ಸಾಕ್ಷ್ಯ",
    "level": "H2"
   }
  },
  {
   "type": "code",
   "data": {
    "filename": "skill_lab.py",
    "headingEn": "validate_skill_text: the ordered invariants",
    "headingKn": "validate_skill_text: ಕ್ರಮಬದ್ಧ ನಿಯಮಗಳು",
    "descEn": "Cheap structural checks come first: delimiters, then safe parse, then name equals directory, then required fields, then extensions, then body and portable limits. The function returns early at the first broken invariant so a parse failure does not produce fifteen misleading secondary errors. It returns a SkillReport of ValidationIssue codes, never a bare True/False.",
    "descKn": "ಸರಳ ರಚನಾತ್ಮಕ ಪರಿಶೀಲನೆಗಳು ಮೊದಲು: delimiters, ಸುರಕ್ಷಿತ parse, name = directory, ಕಡ್ಡಾಯ fields, extensions, body. ಮೊದಲ ಮುರಿದ ನಿಯಮದಲ್ಲೇ ಹಿಂತಿರುಗುತ್ತದೆ.",
    "code": "def validate_skill_text(text, directory_name, allowed_runtime_extensions=()):\n    issues = []\n    def done():\n        return SkillReport(directory_name, not issues, issues)\n    try:\n        meta, body = parse_frontmatter(text)\n    except FrontmatterSyntaxError as e:\n        issues.append(ValidationIssue(\"E_FRONTMATTER_SYNTAX\", str(e)))\n        return done()                                   # fail on the first broken invariant\n    if \"name\" in meta and meta[\"name\"] != directory_name:\n        issues.append(ValidationIssue(\"E_NAME_DIRECTORY_MISMATCH\", f\"name {meta['name']!r} != directory {directory_name!r}\"))\n        return done()\n    for req in (\"name\", \"description\"):\n        if not meta.get(req):\n            issues.append(ValidationIssue(\"E_MISSING_FIELD\", f\"required field {req!r} is missing or empty\"))\n    if issues:\n        return done()\n    if not NAME_RE.match(meta[\"name\"]) or len(meta[\"name\"]) > MAX_NAME:\n        issues.append(ValidationIssue(\"E_NAME_FORMAT\", \"name must be lowercase letters/digits/hyphens, max 64\"))\n    if len(meta[\"description\"]) > MAX_DESC:\n        issues.append(ValidationIssue(\"E_DESCRIPTION_LENGTH\", f\"description over {MAX_DESC} characters\"))\n    for key in meta:\n        if key not in PORTABLE_FIELDS and key not in allowed_runtime_extensions:\n            issues.append(ValidationIssue(\"E_UNKNOWN_EXTENSION\", f\"field {key!r} is not portable and not allowed by host policy\"))\n    if not body:\n        issues.append(ValidationIssue(\"E_EMPTY_BODY\", \"SKILL.md has metadata but no procedure body\"))\n    return done()"
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
    "filename": "skill_lab.py",
    "headingEn": "A valid portable skill",
    "headingKn": "ಮಾನ್ಯ portable skill",
    "descEn": "The baseline positive case proves the validator does not simply reject everything.",
    "descKn": "ಧನಾತ್ಮಕ ಆಧಾರ ಪ್ರಕರಣ validator ಎಲ್ಲವನ್ನೂ ತಿರಸ್ಕರಿಸುವುದಿಲ್ಲ ಎಂದು ತೋರಿಸುತ್ತದೆ.",
    "code": "print(json.dumps(asdict(validate_skill_text(VALID, \"release-readiness\")), indent=2))"
   }
  },
  {
   "type": "output",
   "data": {
    "output": "{\n  \"directory\": \"release-readiness\",\n  \"valid\": true,\n  \"issues\": []\n}"
   }
  },
  {
   "type": "heading",
   "data": {
    "textEn": "Extensions Need an Explicit Policy",
    "textKn": "Extensions ಗೆ ಸ್ಪಷ್ಟ Policy ಬೇಕು",
    "level": "H2"
   }
  },
  {
   "type": "code",
   "data": {
    "filename": "skill_lab.py",
    "headingEn": "The same host-extended skill, without and with policy",
    "headingKn": "ಅದೇ host-extended skill, policy ಇಲ್ಲದೆ ಮತ್ತು ಇರುವಾಗ",
    "descEn": "HOST is the valid skill with a host-only field, disable-model-invocation, in place of license. Without host policy it is reported as an unknown extension. When the host explicitly allows that field through allowed_runtime_extensions it validates. One runtime's convenience feature never becomes a portable guarantee by accident.",
    "descKn": "HOST ಎಂದರೆ license ಬದಲು host-ಮಾತ್ರ field ಇರುವ ಅದೇ skill. host policy ಇಲ್ಲದೆ ತಿಳಿಯದ extension ಎಂದು ವರದಿ; ಸ್ಪಷ್ಟವಾಗಿ ಅನುಮತಿಸಿದಾಗ ಮಾನ್ಯ.",
    "code": "print(json.dumps(asdict(validate_skill_text(HOST, \"release-readiness\")), indent=2))\nprint(json.dumps(asdict(validate_skill_text(HOST, \"release-readiness\", (\"disable-model-invocation\",))), indent=2))"
   }
  },
  {
   "type": "output",
   "data": {
    "output": "{\n  \"directory\": \"release-readiness\",\n  \"valid\": false,\n  \"issues\": [\n    {\n      \"code\": \"E_UNKNOWN_EXTENSION\",\n      \"message\": \"field 'disable-model-invocation' is not portable and not allowed by host policy\"\n    }\n  ]\n}\n{\n  \"directory\": \"release-readiness\",\n  \"valid\": true,\n  \"issues\": []\n}"
   }
  },
  {
   "type": "heading",
   "data": {
    "textEn": "The Invalid Packages",
    "textKn": "ಅಮಾನ್ಯ Packages",
    "level": "H2"
   }
  },
  {
   "type": "code",
   "data": {
    "filename": "skill_lab.py",
    "headingEn": "Name mismatch, missing field, empty body",
    "headingKn": "name ಹೊಂದಾಣಿಕೆ ಇಲ್ಲ, ಕಾಣೆಯಾದ field, ಖಾಲಿ body",
    "descEn": "Each invalid package yields one precise, actionable code. The name mismatch shows the identity rule: the directory is release-readiness but the metadata claims deploy-prod, so discovery and packaging would disagree about who this skill is.",
    "descKn": "ಪ್ರತಿ ಅಮಾನ್ಯ package ಒಂದು ನಿಖರ ಕೋಡ್ ನೀಡುತ್ತದೆ. name ಹೊಂದಾಣಿಕೆ ಇಲ್ಲದಿದ್ದರೆ discovery ಮತ್ತು packaging ಗುರುತಿನ ಬಗ್ಗೆ ಭಿನ್ನವಾಗಿರುತ್ತವೆ.",
    "code": "bad_name = VALID.replace(\"name: release-readiness\", \"name: deploy-prod\")\nprint(json.dumps(asdict(validate_skill_text(bad_name, \"release-readiness\")), indent=2))\nprint(json.dumps(asdict(validate_skill_text(\"---\\nname: release-readiness\\n---\\n\\n# Body\\ntext\\n\", \"release-readiness\")), indent=2))\nprint(json.dumps(asdict(validate_skill_text(\"---\\nname: release-readiness\\ndescription: Inspect releases.\\n---\\n\", \"release-readiness\")), indent=2))"
   }
  },
  {
   "type": "output",
   "data": {
    "output": "{\n  \"directory\": \"release-readiness\",\n  \"valid\": false,\n  \"issues\": [\n    {\n      \"code\": \"E_NAME_DIRECTORY_MISMATCH\",\n      \"message\": \"name 'deploy-prod' != directory 'release-readiness'\"\n    }\n  ]\n}\n{\n  \"directory\": \"release-readiness\",\n  \"valid\": false,\n  \"issues\": [\n    {\n      \"code\": \"E_MISSING_FIELD\",\n      \"message\": \"required field 'description' is missing or empty\"\n    }\n  ]\n}\n{\n  \"directory\": \"release-readiness\",\n  \"valid\": false,\n  \"issues\": [\n    {\n      \"code\": \"E_EMPTY_BODY\",\n      \"message\": \"SKILL.md has metadata but no procedure body\"\n    }\n  ]\n}"
   }
  },
  {
   "type": "code",
   "data": {
    "filename": "skill_lab.py",
    "headingEn": "Syntax errors are a different class",
    "headingKn": "Syntax ದೋಷಗಳು ಬೇರೆ ವರ್ಗ",
    "descEn": "An unclosed frontmatter block and a list-valued field cannot be interpreted safely, so validation stops with E_FRONTMATTER_SYNTAX. These are not contract violations of understood metadata; the validator simply cannot understand the document yet.",
    "descKn": "ಮುಚ್ಚದ frontmatter ಮತ್ತು list ಮೌಲ್ಯದ field ಸುರಕ್ಷಿತವಾಗಿ ಅರ್ಥೈಸಲಾಗದು, ಆದ್ದರಿಂದ E_FRONTMATTER_SYNTAX ನೊಂದಿಗೆ ನಿಲ್ಲುತ್ತದೆ.",
    "code": "print(json.dumps(asdict(validate_skill_text(\"---\\nname: release-readiness\\n\", \"release-readiness\")), indent=2))\nprint(json.dumps(asdict(validate_skill_text(\"---\\nname: release-readiness\\ndescription:\\n  - a\\n---\\nbody\\n\", \"release-readiness\")), indent=2))"
   }
  },
  {
   "type": "output",
   "data": {
    "output": "{\n  \"directory\": \"release-readiness\",\n  \"valid\": false,\n  \"issues\": [\n    {\n      \"code\": \"E_FRONTMATTER_SYNTAX\",\n      \"message\": \"frontmatter is not closed by '---'\"\n    }\n  ]\n}\n{\n  \"directory\": \"release-readiness\",\n  \"valid\": false,\n  \"issues\": [\n    {\n      \"code\": \"E_FRONTMATTER_SYNTAX\",\n      \"message\": \"nested or list value not supported: '- a'\"\n    }\n  ]\n}"
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "What This Validator Does Not Check",
    "headingKn": "ಈ Validator ಪರಿಶೀಲಿಸದೇ ಇರುವುದು",
    "bodyEn": "It checks the contract of SKILL.md text. It does not verify that every file mentioned in the body exists, that scripts run, or that the host will select the skill. That is why Part 1 said the directory is the deployable unit, and why there are three levels of proof below.",
    "bodyKn": "ಇದು SKILL.md ಪಠ್ಯದ ಒಪ್ಪಂದ ಪರಿಶೀಲಿಸುತ್ತದೆ. ಉಲ್ಲೇಖಿತ ಫೈಲ್‌ಗಳು ಇವೆಯೇ, scripts ಚಲಿಸುತ್ತವೆಯೇ ಎಂದು ಪರಿಶೀಲಿಸುವುದಿಲ್ಲ."
   }
  },
  {
   "type": "heading",
   "data": {
    "textEn": "The Primitive Chooser",
    "textKn": "Primitive Chooser",
    "level": "H2"
   }
  },
  {
   "type": "code",
   "data": {
    "filename": "skill_lab.py",
    "headingEn": "TaskShape and select_primitives (our implementation)",
    "headingKn": "TaskShape ಮತ್ತು select_primitives (ನಮ್ಮ ಅನುಷ್ಠಾನ)",
    "descEn": "A task is described by engineering requirements rather than topic. The function is plural on purpose: real workflows often need more than one primitive. This mapping follows the decision card from Part 2 and is our own encoding of it.",
    "descKn": "ಕಾರ್ಯವನ್ನು ವಿಷಯದ ಬದಲು ಎಂಜಿನಿಯರಿಂಗ್ ಅಗತ್ಯಗಳಿಂದ ವಿವರಿಸಲಾಗುತ್ತದೆ. ಕಾರ್ಯ ಬಹುವಚನ: ನಿಜ ವರ್ಕ್‌ಫ್ಲೋ ಹಲವು primitives ಬೇಕು.",
    "code": "@dataclass\nclass TaskShape:\n    reusable_judgment: bool = False\n    must_run_every_time: bool = False\n    external_typed_capability: bool = False\n    needs_isolated_context: bool = False\n    repo_specific_guidance: bool = False\n\ndef select_primitives(t):\n    chosen = []\n    if t.repo_specific_guidance: chosen.append(\"repository instructions\")\n    if t.must_run_every_time: chosen.append(\"hook / application code\")\n    if t.external_typed_capability: chosen.append(\"tool / MCP server\")\n    if t.reusable_judgment: chosen.append(\"skill\")\n    if t.needs_isolated_context: chosen.append(\"subagent\")\n    return chosen or [\"prompt\"]"
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
    "filename": "skill_lab.py",
    "headingEn": "Six task shapes",
    "headingKn": "ಆರು ಕಾರ್ಯ ಆಕಾರಗಳು",
    "descEn": "A reusable procedure becomes a skill; an every-time check becomes a hook; typed data becomes a tool; a repository rule becomes repository instructions; a one-off becomes a prompt; and the PR-opened workflow needs four primitives at once.",
    "descKn": "ಮರುಬಳಕೆ procedure = skill; ಪ್ರತಿ ಬಾರಿ ಪರಿಶೀಲನೆ = hook; ಟೈಪ್ ಡೇಟಾ = tool; ಒಮ್ಮೆಯ ಕೆಲಸ = prompt; PR workflow ಗೆ ನಾಲ್ಕು.",
    "code": "print(\"reusable release procedure ->\", select_primitives(TaskShape(reusable_judgment=True)))\nprint(\"check after every tool call ->\", select_primitives(TaskShape(must_run_every_time=True)))\nprint(\"fetch typed PR data ->\", select_primitives(TaskShape(external_typed_capability=True)))\nprint(\"never edit generated/ ->\", select_primitives(TaskShape(repo_specific_guidance=True)))\nprint(\"one-off question ->\", select_primitives(TaskShape()))\nprint(\"PR opened workflow ->\", select_primitives(TaskShape(True, True, True, True, False)))"
   }
  },
  {
   "type": "output",
   "data": {
    "output": "reusable release procedure -> ['skill']\ncheck after every tool call -> ['hook / application code']\nfetch typed PR data -> ['tool / MCP server']\nnever edit generated/ -> ['repository instructions']\none-off question -> ['prompt']\nPR opened workflow -> ['hook / application code', 'tool / MCP server', 'skill', 'subagent']"
   }
  },
  {
   "type": "heading",
   "data": {
    "textEn": "Three Levels of Proof",
    "textKn": "ಮೂರು ಹಂತದ ಸಾಕ್ಷ್ಯ",
    "level": "H2"
   }
  },
  {
   "type": "table",
   "data": {
    "headingEn": "Complementary, not interchangeable",
    "headers": [
     "Level",
     "Question",
     "Evidence"
    ],
    "rows": [
     [
      "1. Static package validation",
      "Does SKILL.md satisfy the contract?",
      "parse_frontmatter + validate_skill_text report"
     ],
     [
      "2. Implementation tests",
      "Does our validator and chooser behave as expected?",
      "A test suite run (for example python -m unittest)"
     ],
     [
      "3. Real-host lifecycle",
      "Can the host discover, activate, execute and verify the installed bundle?",
      "Resolved script path, target path, cwd, argv and exit code"
     ]
    ]
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "Demo Output Is Not Regression Evidence",
    "headingKn": "Demo output ≠ regression ಸಾಕ್ಷ್ಯ",
    "bodyEn": "What you saw above is a demonstration of representative cases. A test suite checks declared invariants systematically. And neither proves that a real host installed the whole bundle: installing only SKILL.md and dropping references, scripts and assets would violate the package model. In this lesson we did not run a real host, so level 3 is unverified here.",
    "bodyKn": "ಮೇಲೆ ನೋಡಿದ್ದು ಪ್ರಾತಿನಿಧಿಕ ಪ್ರಕರಣಗಳ ಪ್ರದರ್ಶನ. ಈ ಪಾಠದಲ್ಲಿ ನಿಜ host ಚಲಾಯಿಸಿಲ್ಲ, ಆದ್ದರಿಂದ ಹಂತ 3 ಇಲ್ಲಿ ಪರಿಶೀಲಿಸಲಾಗಿಲ್ಲ."
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "Key Takeaways",
    "headingKn": "ಮುಖ್ಯ ಅಂಶಗಳು",
    "bodyEn": "• Parsing (can I interpret this safely?) is separate from validation (does it satisfy the contract?), and only the first raises FrontmatterSyntaxError.\n• We genuinely ran the validator: the valid skill had no issues; the unknown host field produced E_UNKNOWN_EXTENSION until the host policy allowed it; deploy-prod versus release-readiness produced E_NAME_DIRECTORY_MISMATCH; a missing description produced E_MISSING_FIELD; an empty body produced E_EMPTY_BODY; malformed frontmatter produced E_FRONTMATTER_SYNTAX.\n• Structured issues let humans, tests, CI and agents act on failures.\n• The chooser returned skill, hook, tool, repository instructions and prompt for single needs, and four primitives for the PR workflow.\n• Static validation, tests and real-host evidence are three separate levels of proof. This code is ours, not the original main.py.",
    "bodyKn": "• Parsing ಮತ್ತು validation ಬೇರೆ; ಮೊದಲನೆಯದು ಮಾತ್ರ FrontmatterSyntaxError ಎತ್ತುತ್ತದೆ.\n• validator ಅನ್ನು ನಿಜವಾಗಿ ಚಲಾಯಿಸಿದ್ದೇವೆ.\n• ರಚನಾತ್ಮಕ issues ಮನುಷ್ಯರು, ಪರೀಕ್ಷೆಗಳು, CI, ಏಜೆಂಟ್‌ಗಳಿಗೆ ಉಪಯುಕ್ತ.\n• chooser ಒಂದು ಅಗತ್ಯಕ್ಕೆ ಒಂದು primitive, PR ವರ್ಕ್‌ಫ್ಲೋಗೆ ನಾಲ್ಕು ನೀಡಿತು.\n• ಮೂರು ಸಾಕ್ಷ್ಯ ಹಂತಗಳು ಪ್ರತ್ಯೇಕ. ಈ ಕೋಡ್ ನಮ್ಮದು."
   }
  },
  {
   "type": "quiz",
   "data": {
    "questions": [
     {
      "q": "Why are parse_frontmatter and validate_skill_text separate?",
      "qKn": "parse_frontmatter ಮತ್ತು validate_skill_text ಬೇರೆ ಏಕೆ?",
      "opts": [
       "Parsing calls external APIs",
       "Parsing establishes interpretable structure; validation checks it against the contract",
       "Validation runs before parsing",
       "They are the same operation"
      ],
      "optsKn": [
       "Parsing ಬಾಹ್ಯ API ಕರೆಯುತ್ತದೆ",
       "Parsing ಅರ್ಥೈಸಬಹುದಾದ ರಚನೆ ಸ್ಥಾಪಿಸುತ್ತದೆ; validation ಒಪ್ಪಂದಕ್ಕೆ ಹೋಲಿಸುತ್ತದೆ",
       "Validation ಮೊದಲು ಚಲಿಸುತ್ತದೆ",
       "ಎರಡೂ ಒಂದೇ"
      ],
      "correct": 1
     },
     {
      "q": "Why return a SkillReport of ValidationIssue codes instead of True or False?",
      "qKn": "True/False ಬದಲು ValidationIssue ಕೋಡ್‌ಗಳ SkillReport ಏಕೆ?",
      "opts": [
       "To make validation slower",
       "To provide structured, actionable evidence about failures",
       "To bypass host policy",
       "To activate the skill"
      ],
      "optsKn": [
       "ಮಂದಗೊಳಿಸಲು",
       "ರಚನಾತ್ಮಕ, ಕ್ರಿಯಾತ್ಮಕ ಸಾಕ್ಷ್ಯ ನೀಡಲು",
       "host policy ದಾಟಲು",
       "skill activate ಮಾಡಲು"
      ],
      "correct": 1
     },
     {
      "q": "A check must run after every tool call without exception. Which primitive fits?",
      "qKn": "ಪ್ರತಿ tool call ನಂತರ ವಿನಾಯಿತಿ ಇಲ್ಲದೆ ಪರಿಶೀಲನೆ ಚಲಿಸಬೇಕು. ಯಾವ primitive?",
      "opts": [
       "Skill",
       "Prompt",
       "Lifecycle hook / application code",
       "Asset"
      ],
      "optsKn": [
       "Skill",
       "Prompt",
       "Lifecycle hook / application code",
       "Asset"
      ],
      "correct": 2
     },
     {
      "q": "In the run, the host-only field disable-model-invocation was rejected, then accepted. What changed?",
      "qKn": "run ನಲ್ಲಿ host-ಮಾತ್ರ field ತಿರಸ್ಕೃತ, ನಂತರ ಒಪ್ಪಲ್ಪಟ್ಟಿತು. ಏನು ಬದಲಾಯಿತು?",
      "opts": [
       "The file content",
       "The host passed it in allowed_runtime_extensions",
       "The directory name",
       "Nothing"
      ],
      "optsKn": [
       "ಫೈಲ್ ವಿಷಯ",
       "host ಅದನ್ನು allowed_runtime_extensions ನಲ್ಲಿ ನೀಡಿತು",
       "ಡೈರೆಕ್ಟರಿ ಹೆಸರು",
       "ಏನೂ ಇಲ್ಲ"
      ],
      "correct": 1
     },
     {
      "q": "Which order is correct?",
      "qKn": "ಯಾವ ಕ್ರಮ ಸರಿ?",
      "opts": [
       "Selection, Discovery, Validation, Activation",
       "Discovery, Validation, Cataloging, Selection, Activation, Disclosure, Execution, Verification",
       "Verification, Execution, Activation",
       "Activation, Discovery, Selection"
      ],
      "optsKn": [
       "Selection, Discovery, Validation, Activation",
       "Discovery, Validation, Cataloging, Selection, Activation, Disclosure, Execution, Verification",
       "Verification, Execution, Activation",
       "Activation, Discovery, Selection"
      ],
      "correct": 1
     }
    ]
   }
  }
 ]
};
