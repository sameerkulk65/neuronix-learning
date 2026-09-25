module.exports = {
 "phaseId": "6a369d5e66020ed05b3214c3",
 "moduleId": "6ab6d18eb7119db96ad77965",
 "order": 2,
 "type": "interactive",
 "duration": 50,
 "difficulty": "advanced",
 "status": "published",
 "title": "Skill Discovery and Progressive Disclosure (Part 3 of 3) — Secure Resource Loading and Path Containment",
 "titleKn": "Skill Discovery ಮತ್ತು Progressive Disclosure (Part 3 of 3) — ಸುರಕ್ಷಿತ Resource ಲೋಡಿಂಗ್ ಮತ್ತು Path Containment",
 "desc": "When an activated skill asks for a resource, how does the runtime prove the file belongs to that package? Treat every path as untrusted, reject absolute and parent-escape forms, resolve before checking containment, defeat symlink and junction escapes, bound type and size, and keep path trust separate from content trust.",
 "descKn": "ಸಕ್ರಿಯ skill resource ಕೇಳಿದಾಗ ಫೈಲ್ ಆ package ಗೆ ಸೇರಿದೆ ಎಂದು runtime ಹೇಗೆ ಸಾಬೀತುಪಡಿಸುತ್ತದೆ? ಪ್ರತಿ path ಅಪನಂಬಿಕೆ, resolve ಮಾಡಿ ನಂತರ containment.",
 "objectives": [
  "Treat every requested resource path as untrusted and reject absolute paths and parent-directory escapes.",
  "Resolve the package root and candidate, then prove the resolved target stays under the resolved root.",
  "Show that a string-prefix check is wrong and that a symlink or directory junction can escape an apparently in-package path.",
  "Validate file type and size before reading, and keep validate_reference (where may I read) separate from load_reference (bounded read).",
  "State what containment does not prove: content trust."
 ],
 "objectivesKn": [
  "ಪ್ರತಿ resource path ಅನ್ನು ಅಪನಂಬಿಕೆ ಎಂದು ಪರಿಗಣಿಸಿ.",
  "root ಮತ್ತು candidate resolve ಮಾಡಿ containment ಸಾಬೀತುಪಡಿಸಿ.",
  "string-prefix ತಪ್ಪು ಮತ್ತು symlink/junction ತಪ್ಪಿಸಿಕೊಳ್ಳುವಿಕೆ ತೋರಿಸಿ.",
  "ಪ್ರಕಾರ ಮತ್ತು ಗಾತ್ರ ಪರಿಶೀಲಿಸಿ.",
  "containment ಏನನ್ನು ಸಾಬೀತುಪಡಿಸುವುದಿಲ್ಲ ಎಂದು ತಿಳಿಸಿ."
 ],
 "blocks": [
  {
   "type": "heading",
   "data": {
    "textEn": "Skill Discovery and Progressive Disclosure (Part 3 of 3)",
    "textKn": "Skill Discovery and Progressive Disclosure (Part 3 of 3)",
    "level": "H1"
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "Lesson Info",
    "headingKn": "Lesson ಮಾಹಿತಿ",
    "bodyEn": "• Type: Build · Language: Python (stdlib only) · Time: ~45 minutes. The source lesson describes its main.py but does not include the code, so the program here is our own teaching implementation of the same components (Scope, SkillCandidate, discover_scope, resolve_collisions, CatalogEntry, CatalogBudget, build_catalog, load_skill_body, validate_reference, load_reference). All outputs were produced by genuinely running it in temporary directories. Its limits (4000-char body, 2000-byte reference, the catalog budget) are our teaching numbers. Symlink section: this Windows account cannot create symlinks, so the lab falls back to a directory junction, which redirects a directory in the same way, and says so in its output.",
    "bodyKn": "• Type: Build · Language: Python (stdlib only) · Time: ~45 ನಿಮಿಷಗಳು. ಮೂಲ ಪಾಠ main.py ಕೋಡ್ ಒಳಗೊಂಡಿಲ್ಲ; ಇಲ್ಲಿನ ಕಾರ್ಯಕ್ರಮ ಅದೇ ಘಟಕಗಳ ನಮ್ಮದೇ ಬೋಧನಾ ಅನುಷ್ಠಾನ. ಎಲ್ಲಾ outputs ತಾತ್ಕಾಲಿಕ ಡೈರೆಕ್ಟರಿಗಳಲ್ಲಿ ನಿಜವಾಗಿ ಚಲಾಯಿಸಿ ಪಡೆದವು. ಮಿತಿಗಳು ನಮ್ಮ ಬೋಧನಾ ಸಂಖ್ಯೆಗಳು."
   }
  },
  {
   "type": "heading",
   "data": {
    "textEn": "The Trust Boundary",
    "textKn": "ವಿಶ್ವಾಸ ಗಡಿ",
    "level": "H2"
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "The Requested Path Is Untrusted Until Proven Otherwise",
    "headingKn": "ಕೇಳಿದ Path ಸಾಬೀತಾಗುವವರೆಗೆ ಅಪನಂಬಿಕೆ",
    "bodyEn": "After activation, SKILL.md legitimately says \"read references/python-release.md\". But the same mechanism could be asked for references/../../../../.ssh/config, for /etc/passwd, or for a file that is really a link to /private/company-secrets. The lexical path may start inside the package while the real target does not. Requested path is not approved resource: it becomes one only after validation.",
    "bodyKn": "SKILL.md ಸಮರ್ಪಕವಾಗಿ references/python-release.md ಕೇಳಬಹುದು. ಆದರೆ ಅದೇ ಯಂತ್ರ ../../.ssh/config ಅಥವಾ /etc/passwd ಕೇಳಬಹುದು. ಕೇಳಿದ path ≠ ಅನುಮೋದಿತ resource."
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "Why a String Prefix Is Wrong",
    "headingKn": "String Prefix ಏಕೆ ತಪ್ಪು",
    "bodyEn": "candidate.startswith(root) treats /app/skills/release-malicious/file.md as inside /app/skills/release because the text begins the same way, yet release-malicious is not a child of release. Containment must be based on resolved path structure, not text prefixes.",
    "bodyKn": "candidate.startswith(root) /app/skills/release-malicious/file.md ಅನ್ನು ಒಳಗಿದೆ ಎನ್ನುತ್ತದೆ, ಆದರೆ ಅದು ಮಕ್ಕಳಲ್ಲ."
   }
  },
  {
   "type": "code",
   "data": {
    "filename": "discovery_lab.py",
    "headingEn": "The prefix check lies",
    "headingKn": "Prefix ಪರಿಶೀಲನೆ ಸುಳ್ಳು ಹೇಳುತ್ತದೆ",
    "descEn": "The first value is what a naive startswith check would conclude; the second requires a real path-separator boundary. Even the second is only text, which is why we resolve real paths below.",
    "descKn": "ಮೊದಲ ಮೌಲ್ಯ ಸರಳ startswith ತೀರ್ಮಾನ; ಎರಡನೆಯದು ನಿಜ ಬೇರ್ಪಡಿಸುವ ಗಡಿ ಬೇಕು.",
    "code": "root, other = \"/app/skills/release\", \"/app/skills/release-malicious/file.md\"\nprint(\"  startswith says inside:\", other.startswith(root), \"| real parent relationship:\", other.startswith(root + \"/\"))"
   }
  },
  {
   "type": "output",
   "data": {
    "output": "startswith says inside: True | real parent relationship: False"
   }
  },
  {
   "type": "heading",
   "data": {
    "textEn": "validate_reference: The Gate",
    "textKn": "validate_reference: ದ್ವಾರ",
    "level": "H2"
   }
  },
  {
   "type": "code",
   "data": {
    "filename": "discovery_lab.py",
    "headingEn": "validate_reference and load_reference (our implementation)",
    "headingKn": "validate_reference ಮತ್ತು load_reference (ನಮ್ಮ ಅನುಷ್ಠಾನ)",
    "descEn": "Steps in order: reject absolute paths; reject any \"..\" component; resolve the package root; resolve root/reference; prove candidate.relative_to(root); require a regular file; enforce a size limit; only then return the safe resolved path. load_reference does the bounded read and writes the disclosure event. validate answers \"where may I read?\", load performs the read.",
    "descKn": "ಕ್ರಮ: absolute ತಿರಸ್ಕರಿಸಿ; \"..\" ತಿರಸ್ಕರಿಸಿ; root resolve; candidate resolve; relative_to ಸಾಬೀತು; regular file; ಗಾತ್ರ ಮಿತಿ; ನಂತರ ಮಾತ್ರ ಓದಿ.",
    "code": "def validate_reference(skill_dir, reference, max_bytes=MAX_REF):\n    ref = Path(reference)\n    if ref.is_absolute(): raise ValueError(\"absolute paths are not allowed\")\n    if \"..\" in ref.parts: raise ValueError(\"parent traversal is not allowed\")\n    root = skill_dir.resolve()\n    candidate = (root / ref).resolve()\n    try:\n        candidate.relative_to(root)\n    except ValueError:\n        raise ValueError(\"resource escaped skill root\")\n    if not candidate.is_file(): raise ValueError(\"resource must be a regular file\")\n    if candidate.stat().st_size > max_bytes: raise ValueError(\"resource exceeds size limit\")\n    return candidate\n\ndef load_reference(entry, reference, reason, events):\n    path = validate_reference(Path(entry.path), reference)\n    text = path.read_text(encoding=\"utf-8\")\n    events.append({\"event\": \"skill.resource.loaded\", \"skill\": entry.name, \"resource\": reference, \"reason\": reason, \"bytes\": len(text.encode())})\n    return text"
   }
  },
  {
   "type": "output",
   "data": {
    "output": "(definitions only: no output yet)"
   }
  },
  {
   "type": "diagram",
   "data": {
    "titleEn": "The containment gate",
    "titleKn": "Containment ದ್ವಾರ",
    "contentEn": "requested resource\n  -> relative?            no  -> REJECT\n  -> contains \"..\"?       yes -> REJECT\n  -> resolve root, resolve candidate\n  -> candidate under root? no -> REJECT\n  -> regular file?         no -> REJECT\n  -> within size limit?    no -> REJECT\n  -> LOAD (bounded read) -> disclosure event"
   }
  },
  {
   "type": "code",
   "data": {
    "filename": "discovery_lab.py",
    "headingEn": "Four rejections",
    "headingKn": "ನಾಲ್ಕು ತಿರಸ್ಕಾರಗಳು",
    "descEn": "A parent traversal, an absolute path to a real secret file, a directory instead of a file, and a missing file are each refused with a specific reason, and the secret is never read.",
    "descKn": "parent traversal, absolute path, directory, ಕಾಣೆಯಾದ ಫೈಲ್ ಪ್ರತಿಯೊಂದೂ ನಿರ್ದಿಷ್ಟ ಕಾರಣದೊಂದಿಗೆ ತಿರಸ್ಕೃತ.",
    "code": "(tmp / \"secret.txt\").write_text(\"TOP SECRET\")\nfor label, ref in [(\"parent traversal\", \"references/../../../secret.txt\"), (\"absolute path\", str(tmp / \"secret.txt\")), (\"directory\", \"references\"), (\"missing file\", \"references/nope.md\")]:\n    try:\n        validate_reference(Path(entry.path), ref); print(f\"  {label}: ALLOWED\")\n    except ValueError as e:\n        print(f\"  {label}: rejected ({e})\")"
   }
  },
  {
   "type": "output",
   "data": {
    "output": "parent traversal: rejected (parent traversal is not allowed)\n  absolute path: rejected (absolute paths are not allowed)\n  directory: rejected (resource must be a regular file)\n  missing file: rejected (resource must be a regular file)"
   }
  },
  {
   "type": "heading",
   "data": {
    "textEn": "Symlinks: The Subtler Escape",
    "textKn": "Symlinks: ಸೂಕ್ಷ್ಮ ತಪ್ಪಿಸಿಕೊಳ್ಳುವಿಕೆ",
    "level": "H2"
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "Lexical Inside, Real Outside",
    "headingKn": "ಲೆಕ್ಸಿಕಲ್ ಒಳಗೆ, ನಿಜ ಹೊರಗೆ",
    "bodyEn": "A path like references/external/secret.txt has no \"..\" and starts inside the package, but if external redirects to a directory outside, the file the OS opens is outside. Only resolving first and then comparing the real target with the real root catches it. If a host supports symlinks at all, it must resolve them and validate the actual target; supporting symlinks does not mean skipping containment.",
    "bodyKn": "references/external/secret.txt ನಲ್ಲಿ \"..\" ಇಲ್ಲ, ಒಳಗೇ ಆರಂಭ, ಆದರೆ external ಹೊರಗೆ ಸೂಚಿಸಿದರೆ ಓಎಸ್ ತೆರೆಯುವ ಫೈಲ್ ಹೊರಗಿದೆ. resolve ಮಾಡಿ ನಂತರ ಹೋಲಿಸಿ."
   }
  },
  {
   "type": "code",
   "data": {
    "filename": "discovery_lab.py",
    "headingEn": "Create a redirect and try to read through it",
    "headingKn": "redirect ರಚಿಸಿ ಅದರ ಮೂಲಕ ಓದಲು ಪ್ರಯತ್ನಿಸಿ",
    "descEn": "We create a real directory redirect inside references/ that points at the temp folder holding secret.txt. The lexical path starts inside the package, but it resolves outside, and validate_reference rejects it on the resolved-containment check, not on the \"..\" check.",
    "descKn": "references/ ಒಳಗೆ secret.txt ಇರುವ ಫೋಲ್ಡರ್‌ಗೆ ಸೂಚಿಸುವ ನಿಜ ನಿರ್ದೇಶಿಕೆ ರಚಿಸುತ್ತೇವೆ. resolved containment ಪರಿಶೀಲನೆ ಅದನ್ನು ತಿರಸ್ಕರಿಸುತ್ತದೆ.",
    "code": "link = Path(entry.path) / \"references\" / \"external\"\nkind = \"symlink\"\ntry:\n    os.symlink(tmp, link, target_is_directory=True)\nexcept (OSError, NotImplementedError):\n    import subprocess                     # Windows without symlink rights: a directory junction redirects the same way\n    subprocess.run([\"cmd\", \"/c\", \"mklink\", \"/J\", str(link), str(tmp)], capture_output=True)\n    kind = \"directory junction (Windows equivalent of a directory symlink)\"\nif link.exists():\n    lexical = Path(entry.path) / \"references\" / \"external\" / \"secret.txt\"\n    print(\"  redirect created as:\", kind)\n    print(\"  lexical path starts inside package:\", str(lexical).startswith(str(Path(entry.path))))\n    print(\"  resolves to:\", \"outside the package\" if not str(lexical.resolve()).startswith(str(Path(entry.path).resolve())) else \"inside the package\")\n    try:\n        validate_reference(Path(entry.path), \"references/external/secret.txt\"); print(\"  redirect: ALLOWED\")\n    except ValueError as e:\n        print(f\"  redirect: rejected ({e})\")\nelse:\n    print(\"  could not create a symlink or junction on this machine; not demonstrated\")"
   }
  },
  {
   "type": "output",
   "data": {
    "output": "redirect created as: directory junction (Windows equivalent of a directory symlink)\n  lexical path starts inside package: True\n  resolves to: outside the package\n  redirect: rejected (resource escaped skill root)"
   }
  },
  {
   "type": "heading",
   "data": {
    "textEn": "Path Trust Is Not Content Trust",
    "textKn": "Path Trust ≠ Content Trust",
    "level": "H2"
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "What Containment Proves",
    "headingKn": "Containment ಏನನ್ನು ಸಾಬೀತುಪಡಿಸುತ್ತದೆ",
    "bodyEn": "A file that is relative, inside the resolved root, a regular file and small enough is proven to belong to the package boundary. It is not proven to be safe or truthful: python-release.md could still say something misleading or malicious. Resolved containment protects the package boundary; content trust needs its own controls (review, provenance, treating the text as data), which Module 271.3 covers.",
    "bodyKn": "containment ಫೈಲ್ package ಗಡಿಗೆ ಸೇರಿದೆ ಎಂದು ಸಾಬೀತುಪಡಿಸುತ್ತದೆ; ವಿಷಯ ಸುರಕ್ಷಿತ ಎಂದಲ್ಲ."
   }
  },
  {
   "type": "table",
   "data": {
    "headingEn": "The invariants a test suite should prove",
    "headers": [
     "Invariant",
     "What it checks"
    ],
    "rows": [
     [
      "Discovery",
      "Nested fixture SKILL.md files are not published"
     ],
     [
      "Collision",
      "The declared precedence decides the winner"
     ],
     [
      "Determinism",
      "Equal precedence is ambiguous, not resolved by ordering"
     ],
     [
      "Budget",
      "The published catalog stays bounded"
     ],
     [
      "Disclosure",
      "Selecting one skill does not load every body"
     ],
     [
      "Branch",
      "The Python branch does not need the container or docs guides"
     ],
     [
      "Containment",
      "A resource cannot resolve outside its package"
     ],
     [
      "Traversal and symlink",
      "../ and resolved external targets are rejected"
     ]
    ]
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "Do Not Invent a YAML Dialect",
    "headingKn": "YAML ಉಪಭಾಷೆ ಆವಿಷ್ಕರಿಸಬೇಡಿ",
    "bodyEn": "Our lab only reads flat key: value frontmatter because it is stdlib-only. That is a teaching constraint, not a design to copy. A production runtime should use a safe YAML parser with an explicit schema, size limits and custom object construction disabled, rather than growing an undocumented partial dialect.",
    "bodyKn": "ನಮ್ಮ lab ಸಮತಟ್ಟಾದ key: value ಮಾತ್ರ ಓದುತ್ತದೆ. production ನಲ್ಲಿ ಸುರಕ್ಷಿತ YAML parser ಬಳಸಿ."
   }
  },
  {
   "type": "heading",
   "data": {
    "textEn": "The Whole Flow",
    "textKn": "ಪೂರ್ಣ ಹರಿವು",
    "level": "H2"
   }
  },
  {
   "type": "diagram",
   "data": {
    "titleEn": "Discovery to safe disclosure",
    "titleKn": "Discovery ಇಂದ ಸುರಕ್ಷಿತ disclosure ಗೆ",
    "contentEn": "Scopes -> discover_scope -> SkillCandidate[] -> validation\n  -> resolve_collisions -> build_catalog (budget) -> LEVEL 1 catalog\n  -> skill selected -> load_skill_body -> LEVEL 2 SKILL.md\n  -> branch selected -> validate_reference -> load_reference -> LEVEL 3 resource\n  -> skill.resource.loaded event (skill, resource, reason, bytes)\n\nDiscover broadly. Publish compactly. Activate selectively.\nLoad branch-specifically. Resolve before trusting paths."
   }
  },
  {
   "type": "concept",
   "data": {
    "headingEn": "Key Takeaways",
    "headingKn": "ಮುಖ್ಯ ಅಂಶಗಳು",
    "bodyEn": "• Every requested resource path is untrusted until validate_reference proves otherwise.\n• In our run parent traversal, an absolute path to a real secret, a directory and a missing file were all rejected, and the secret was never read.\n• A redirect that started inside the package and resolved outside was rejected by resolved containment (\"resource escaped skill root\"); the lexical prefix check said it was inside.\n• A string startswith check called /app/skills/release-malicious/file.md inside /app/skills/release.\n• Containment proves package boundary, not content trust. Our limits are teaching numbers, and the frontmatter reader is deliberately minimal.",
    "bodyKn": "• ಪ್ರತಿ resource path ಅಪನಂಬಿಕೆ.\n• ನಮ್ಮ run ಎಲ್ಲಾ ಪಲಾಯನ ಪ್ರಯತ್ನಗಳನ್ನು ತಿರಸ್ಕರಿಸಿತು.\n• resolved containment redirect ಅನ್ನು ಹಿಡಿಯಿತು.\n• startswith ತಪ್ಪು.\n• containment ≠ content trust."
   }
  },
  {
   "type": "quiz",
   "data": {
    "questions": [
     {
      "q": "Why is candidate.startswith(skill_root) insufficient?",
      "qKn": "candidate.startswith(skill_root) ಅಸಮರ್ಪಕ ಏಕೆ?",
      "opts": [
       "Strings cannot hold paths",
       "It does not reliably model containment or resolved link targets",
       "Python cannot compare strings",
       "Every resource must be absolute"
      ],
      "optsKn": [
       "strings paths ಹೊಂದಲಾರವು",
       "ಇದು containment ಅಥವಾ resolved ಲಿಂಕ್ ಗುರಿಗಳನ್ನು ನಂಬಲರ್ಹವಾಗಿ ಮಾದರಿ ಮಾಡುವುದಿಲ್ಲ",
       "Python strings ಹೋಲಿಸಲಾರದು",
       "ಎಲ್ಲಾ resources absolute"
      ],
      "correct": 1
     },
     {
      "q": "What is the strongest containment invariant?",
      "qKn": "ಬಲಿಷ್ಠ containment ನಿಯಮ ಯಾವುದು?",
      "opts": [
       "The filename ends in .md",
       "The path begins with references/",
       "The resolved target remains under the resolved package root",
       "The file is new"
      ],
      "optsKn": [
       "ಫೈಲ್ ಹೆಸರು .md ನಲ್ಲಿ ಕೊನೆ",
       "path references/ ನಿಂದ ಆರಂಭ",
       "resolved ಗುರಿ resolved package root ಅಡಿಯಲ್ಲಿ ಉಳಿಯುತ್ತದೆ",
       "ಫೈಲ್ ಹೊಸದು"
      ],
      "correct": 2
     },
     {
      "q": "Why must links (symlinks or junctions) be considered?",
      "qKn": "links ಏಕೆ ಪರಿಗಣಿಸಬೇಕು?",
      "opts": [
       "They make files larger",
       "An apparently in-package path can resolve to a target outside the package",
       "They cannot hold Markdown",
       "They bypass catalog budgeting"
      ],
      "optsKn": [
       "ಫೈಲ್‌ಗಳನ್ನು ದೊಡ್ಡದಾಗಿಸುತ್ತವೆ",
       "ಒಳಗಿರುವಂತೆ ಕಾಣುವ path ಹೊರಗಿನ ಗುರಿಗೆ resolve ಆಗಬಹುದು",
       "Markdown ಹೊಂದಲಾರವು",
       "catalog ಬಜೆಟ್ ದಾಟುತ್ತವೆ"
      ],
      "correct": 1
     },
     {
      "q": "What does successful path containment prove?",
      "qKn": "ಯಶಸ್ವಿ path containment ಏನು ಸಾಬೀತುಪಡಿಸುತ್ತದೆ?",
      "opts": [
       "The file contents are trustworthy",
       "The model should obey everything inside it",
       "The resolved target stays within the permitted package boundary",
       "No further limits are needed"
      ],
      "optsKn": [
       "ವಿಷಯ ನಂಬಲರ್ಹ",
       "ಮಾದರಿ ಒಳಗಿನದನ್ನೆಲ್ಲ ಪಾಲಿಸಬೇಕು",
       "resolved ಗುರಿ ಅನುಮತಿತ ಗಡಿಯೊಳಗೆ",
       "ಬೇರೆ ಮಿತಿ ಬೇಡ"
      ],
      "correct": 2
     },
     {
      "q": "Which is the correct end-to-end order?",
      "qKn": "ಸರಿಯಾದ ಆರಂಭದಿಂದ ಕೊನೆಯ ಕ್ರಮ?",
      "opts": [
       "References, catalog, discovery, SKILL.md",
       "Execute scripts, discover, resolve paths, catalog",
       "Discovery, collision resolution, catalog, activation, branch selection, containment, resource loading",
       "Load all skills, choose one, delete the rest"
      ],
      "optsKn": [
       "References, catalog, discovery, SKILL.md",
       "scripts ಚಲಾಯಿಸಿ, discover, paths resolve, catalog",
       "Discovery, collision, catalog, activation, branch, containment, resource loading",
       "ಎಲ್ಲಾ skills ಲೋಡ್, ಒಂದು ಆರಿಸಿ, ಉಳಿದವನ್ನು ಅಳಿಸಿ"
      ],
      "correct": 2
     }
    ]
   }
  }
 ]
};
