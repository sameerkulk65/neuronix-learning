const phaseId = '6a369d5e66020ed05b3214c3'; // Phase 16: Tools and Protocols
const moduleId = '6a369d6066020ed05b321505'; // Module 271: Skills and Agent SDKs
const L = ['6ab6cfa67b369f60c0c651b5', '6ab6cfa7a1c797d3e86c0aa5', '6ab6cfa89232e6c4ee6a6c78'];

const P = (part, order, difficulty, title, titleKn, problem, problemKn) => ({
  phaseId, moduleId, lessonId: L[part - 1], order, difficulty, title, titleKn, problem, problemKn,
});

module.exports = [
  // ── Part 1: What a skill is ──
  P(1, 1, 'beginner',
    'Write a Description That Routes',
    'Routing ಮಾಡುವ Description ಬರೆಯಿರಿ',
    'The lesson showed that "Helps with releases." tells a runtime nothing, while a WHAT + WHEN description does.\n1. Write a SKILL.md for a skill called decision-record with a description that states both what it does and when it applies.\n2. Write one deliberately bad description for the same skill and explain what routing information it loses.\n3. Why does the catalog make the description matter more than the body for selection?',
    'ಪಾಠ "Helps with releases." runtime ಗೆ ಏನೂ ಹೇಳುವುದಿಲ್ಲ, ಆದರೆ ಏನು + ಯಾವಾಗ description ಹೇಳುತ್ತದೆ ಎಂದು ತೋರಿಸಿತು.\n1. decision-record skill ಗೆ ಏನು ಮಾಡುತ್ತದೆ ಮತ್ತು ಯಾವಾಗ ಅನ್ವಯಿಸುತ್ತದೆ ಎಂದು ಹೇಳುವ description ಇರುವ SKILL.md ಬರೆಯಿರಿ.\n2. ಅದೇ skill ಗೆ ಉದ್ದೇಶಪೂರ್ವಕವಾಗಿ ಕೆಟ್ಟ description ಬರೆದು ಯಾವ routing ಮಾಹಿತಿ ಕಳೆದುಹೋಗುತ್ತದೆ ಎಂದು ವಿವರಿಸಿ.\n3. selection ಗೆ body ಗಿಂತ description ಏಕೆ ಹೆಚ್ಚು ಮುಖ್ಯ?'),
  P(1, 2, 'intermediate',
    'Classify Eight Statements',
    'ಎಂಟು ಹೇಳಿಕೆಗಳನ್ನು ವರ್ಗೀಕರಿಸಿ',
    'Decide whether each belongs in a skill, repository instructions, a hook, an MCP tool, a subagent or a plain prompt, and justify each in one sentence:\n(a) Never edit generated/.  (b) Scan every tool result for secrets.  (c) Fetch pull request data by id.  (d) The steps for reviewing a release candidate.  (e) Summarize this paragraph.  (f) A worker with separate context that audits security.  (g) Use uv in this repository.  (h) Turn meeting notes into a decision record.\nThen say which of them could reasonably need more than one primitive.',
    'ಪ್ರತಿಯೊಂದು skill, repository instructions, hook, MCP tool, subagent ಅಥವಾ prompt ನಲ್ಲಿ ಯಾವುದಕ್ಕೆ ಸೇರುತ್ತದೆ ಎಂದು ನಿರ್ಧರಿಸಿ, ಒಂದು ವಾಕ್ಯದಲ್ಲಿ ಸಮರ್ಥಿಸಿ:\n(a) generated/ ಎಂದಿಗೂ ಸಂಪಾದಿಸಬೇಡಿ.  (b) ಪ್ರತಿ tool ಫಲಿತಾಂಶದಲ್ಲಿ ರಹಸ್ಯ ಹುಡುಕಿ.  (c) id ಮೂಲಕ pull request ಡೇಟಾ ತನ್ನಿ.  (d) release candidate ಪರಿಶೀಲಿಸುವ ಹಂತಗಳು.  (e) ಈ ಪ್ಯಾರಾ ಸಾರಾಂಶ.  (f) ಭದ್ರತೆ ಲೆಕ್ಕಪರಿಶೋಧಿಸುವ ಪ್ರತ್ಯೇಕ context ಕೆಲಸಗಾರ.  (g) ಈ repository ಯಲ್ಲಿ uv ಬಳಸಿ.  (h) ಸಭೆ ಟಿಪ್ಪಣಿಗಳನ್ನು decision record ಮಾಡಿ.\nನಂತರ ಯಾವುದಕ್ಕೆ ಒಂದಕ್ಕಿಂತ ಹೆಚ್ಚು primitive ಬೇಕಾಗಬಹುದು ಎಂದು ತಿಳಿಸಿ.'),
  P(1, 3, 'advanced',
    'Design a Portable Skill with an Adapter',
    'Adapter ಇರುವ Portable Skill ವಿನ್ಯಾಸಗೊಳಿಸಿ',
    'You want one release-readiness skill to work on two hosts, and Host A adds a field that hides the skill from the model.\n1. Sketch the directory tree and the SKILL.md frontmatter so the portable core makes sense on both hosts.\n2. Decide where the Host A field lives and what the adapter for Host B does when it meets it (ignore, reject or preserve) and why.\n3. List two ways the frontmatter can change runtime behaviour before the body is ever loaded, and how your design keeps the procedure meaningful if the extension is ignored.',
    'ಒಂದು release-readiness skill ಎರಡು hosts ನಲ್ಲಿ ಕೆಲಸ ಮಾಡಬೇಕು; Host A ಮಾದರಿಯಿಂದ skill ಮರೆಮಾಡುವ field ಸೇರಿಸುತ್ತದೆ.\n1. ಎರಡೂ hosts ನಲ್ಲಿ portable core ಅರ್ಥಪೂರ್ಣವಾಗುವಂತೆ ಡೈರೆಕ್ಟರಿ ಮತ್ತು frontmatter ರೂಪಿಸಿ.\n2. Host A field ಎಲ್ಲಿರಬೇಕು, Host B adapter ಅದನ್ನು ಕಂಡಾಗ ಏನು ಮಾಡುತ್ತದೆ (ನಿರ್ಲಕ್ಷಿಸು, ತಿರಸ್ಕರಿಸು, ಉಳಿಸು) ಮತ್ತು ಏಕೆ ಎಂದು ನಿರ್ಧರಿಸಿ.\n3. body ಲೋಡ್ ಆಗುವ ಮೊದಲೇ frontmatter runtime ವರ್ತನೆ ಬದಲಿಸಬಲ್ಲ ಎರಡು ವಿಧಾನ ಪಟ್ಟಿ ಮಾಡಿ, ಮತ್ತು extension ನಿರ್ಲಕ್ಷಿಸಿದರೂ procedure ಅರ್ಥಪೂರ್ಣವಾಗಿರುವಂತೆ ನಿಮ್ಮ ವಿನ್ಯಾಸ ಹೇಗೆ ಕಾಪಾಡುತ್ತದೆ ಎಂದು ತಿಳಿಸಿ.'),

  // ── Part 2: Lifecycle ──
  P(2, 1, 'beginner',
    'Read the Stage Tracker',
    'Stage Tracker ಓದಿ',
    'The lesson ran lifecycle({"discovered"}) and a second call for a skill that was activated but not executed.\n1. Run the lab and reproduce both outputs.\n2. Add a third call for a skill that was executed but never verified and predict the output before running it.\n3. Why is "activated True, executed False" not a contradiction?',
    'ಪಾಠ lifecycle({"discovered"}) ಮತ್ತು activated ಆದರೆ execute ಆಗದ skill ಗೆ ಎರಡನೇ ಕರೆ ಚಲಾಯಿಸಿತು.\n1. lab ಚಲಾಯಿಸಿ ಎರಡೂ outputs ಪುನರುತ್ಪಾದಿಸಿ.\n2. execute ಆಗಿ ಆದರೆ verify ಆಗದ skill ಗೆ ಮೂರನೇ ಕರೆ ಸೇರಿಸಿ; ಚಲಾಯಿಸುವ ಮೊದಲು output ಊಹಿಸಿ.\n3. "activated True, executed False" ವಿರೋಧಾಭಾಸ ಅಲ್ಲ ಏಕೆ?'),
  P(2, 2, 'intermediate',
    'Debug with the Lifecycle',
    'Lifecycle ಬಳಸಿ Debug ಮಾಡಿ',
    'For each report, name the first failing stage and the most likely cause, and say what evidence you would collect next:\n1. "The skill is installed but the model never picks it."\n2. "The runtime lists the skill as broken at startup."\n3. "The model followed the steps but never ran the script."\n4. "The script exited 0 but the checklist is wrong."\nThen explain why a single "my skill does not work" report is too vague to act on.',
    'ಪ್ರತಿ ವರದಿಗೆ ಮೊದಲ ವಿಫಲ ಹಂತ ಮತ್ತು ಸಂಭವನೀಯ ಕಾರಣ ತಿಳಿಸಿ, ಮತ್ತು ಮುಂದೆ ಯಾವ ಸಾಕ್ಷ್ಯ ಸಂಗ್ರಹಿಸುವಿರಿ ಎಂದು ಹೇಳಿ:\n1. "skill ಇನ್‌ಸ್ಟಾಲ್ ಆಗಿದೆ ಆದರೆ ಮಾದರಿ ಎಂದಿಗೂ ಆರಿಸುವುದಿಲ್ಲ."\n2. "ಆರಂಭದಲ್ಲಿ runtime skill ಅನ್ನು ಮುರಿದದ್ದು ಎಂದು ಪಟ್ಟಿ ಮಾಡುತ್ತದೆ."\n3. "ಮಾದರಿ ಹಂತಗಳನ್ನು ಅನುಸರಿಸಿತು ಆದರೆ script ಚಲಾಯಿಸಲಿಲ್ಲ."\n4. "script 0 ನೊಂದಿಗೆ ನಿರ್ಗಮಿಸಿತು ಆದರೆ checklist ತಪ್ಪು."\nಒಂದೇ "ನನ್ನ skill ಕೆಲಸ ಮಾಡುವುದಿಲ್ಲ" ವರದಿ ಕ್ರಮಕ್ಕೆ ತುಂಬಾ ಅಸ್ಪಷ್ಟ ಏಕೆ ಎಂದು ವಿವರಿಸಿ.'),
  P(2, 3, 'advanced',
    'Specify a Skill Dependency Contract',
    'Skill Dependency ಒಪ್ಪಂದ ನಿರ್ದಿಷ್ಟಪಡಿಸಿ',
    'release-readiness needs a separate risk review from a skill called release-risk-review.\n1. Write the exact SKILL.md line(s) stating the condition, the input, the required output and what to do when the dependency is missing.\n2. Explain three things a silent language-level import would let the second skill bypass.\n3. Add a tool-contract table for one tool the procedure calls (inputs, outputs, permissions, side effects, errors, evidence) and state what evidence proves the tool actually ran.',
    'release-readiness ಗೆ release-risk-review skill ಇಂದ ಪ್ರತ್ಯೇಕ ಅಪಾಯ ಪರಿಶೀಲನೆ ಬೇಕು.\n1. ಷರತ್ತು, input, ಅಗತ್ಯ output ಮತ್ತು dependency ಕಾಣೆಯಾದರೆ ಏನು ಮಾಡಬೇಕು ಎಂದು ಹೇಳುವ ನಿಖರ SKILL.md ಸಾಲು(ಗಳು) ಬರೆಯಿರಿ.\n2. ಮೌನ ಭಾಷಾ-ಮಟ್ಟದ import ಎರಡನೇ skill ಗೆ ದಾಟಲು ಬಿಡುವ ಮೂರು ವಿಷಯ ವಿವರಿಸಿ.\n3. procedure ಕರೆಯುವ ಒಂದು tool ಗೆ tool-contract ಕೋಷ್ಟಕ (inputs, outputs, permissions, side effects, errors, evidence) ಸೇರಿಸಿ, ಮತ್ತು tool ನಿಜವಾಗಿ ಚಲಿಸಿತು ಎಂದು ಯಾವ ಸಾಕ್ಷ್ಯ ಸಾಬೀತುಪಡಿಸುತ್ತದೆ ಎಂದು ತಿಳಿಸಿ.'),

  // ── Part 3: Validator and chooser ──
  P(3, 1, 'beginner',
    'Break the Validator on Purpose',
    'Validator ಅನ್ನು ಉದ್ದೇಶಪೂರ್ವಕವಾಗಿ ಮುರಿಯಿರಿ',
    'Using the lab\'s validate_skill_text:\n1. Produce E_NAME_DIRECTORY_MISMATCH, E_MISSING_FIELD and E_EMPTY_BODY, each from a one-line change to the valid skill.\n2. Produce E_NAME_FORMAT with an uppercase name that also matches its directory.\n3. Explain why the validator returns early on the first broken invariant instead of collecting every issue.',
    'lab ನ validate_skill_text ಬಳಸಿ:\n1. ಮಾನ್ಯ skill ಗೆ ಒಂದು ಸಾಲಿನ ಬದಲಾವಣೆಯಿಂದ E_NAME_DIRECTORY_MISMATCH, E_MISSING_FIELD, E_EMPTY_BODY ಪ್ರತಿಯೊಂದನ್ನು ಉತ್ಪಾದಿಸಿ.\n2. ಡೈರೆಕ್ಟರಿಗೂ ಹೊಂದುವ ದೊಡ್ಡಕ್ಷರದ name ನೊಂದಿಗೆ E_NAME_FORMAT ಉತ್ಪಾದಿಸಿ.\n3. ಎಲ್ಲಾ issues ಸಂಗ್ರಹಿಸುವ ಬದಲು ಮೊದಲ ಮುರಿದ ನಿಯಮದಲ್ಲಿ validator ಹಿಂತಿರುಗುವುದು ಏಕೆ?'),
  P(3, 2, 'intermediate',
    'Add a Portable-Limit Rule',
    'Portable-Limit ನಿಯಮ ಸೇರಿಸಿ',
    'Extend validate_skill_text with a new check of your choice, such as rejecting a description shorter than 20 characters or a body without any numbered step.\n1. Add a new E_ code and place the check at the right point in the validation order; justify the position.\n2. Add one passing and one failing test input and show both reports.\n3. State clearly which limits are the lesson\'s own teaching choices rather than something the source lesson specifies.',
    'validate_skill_text ಅನ್ನು ನಿಮ್ಮ ಆಯ್ಕೆಯ ಹೊಸ ಪರಿಶೀಲನೆಯೊಂದಿಗೆ ವಿಸ್ತರಿಸಿ, ಉದಾಹರಣೆಗೆ 20 ಅಕ್ಷರಗಳಿಗಿಂತ ಚಿಕ್ಕ description ಅಥವಾ ಸಂಖ್ಯೆಯ ಹಂತವಿಲ್ಲದ body ತಿರಸ್ಕರಿಸುವುದು.\n1. ಹೊಸ E_ ಕೋಡ್ ಸೇರಿಸಿ, validation ಕ್ರಮದಲ್ಲಿ ಸರಿಯಾದ ಸ್ಥಳದಲ್ಲಿ ಇರಿಸಿ ಮತ್ತು ಸ್ಥಳವನ್ನು ಸಮರ್ಥಿಸಿ.\n2. ಒಂದು ಪಾಸ್ ಮತ್ತು ಒಂದು ಫೇಲ್ ಇನ್‌ಪುಟ್ ಸೇರಿಸಿ ಎರಡೂ ವರದಿಗಳನ್ನು ತೋರಿಸಿ.\n3. ಯಾವ ಮಿತಿಗಳು ಪಾಠದ ಸ್ವಂತ ಬೋಧನಾ ಆಯ್ಕೆಗಳು, ಮೂಲ ಪಾಠ ನಿರ್ದಿಷ್ಟಪಡಿಸಿದ್ದಲ್ಲ ಎಂದು ಸ್ಪಷ್ಟವಾಗಿ ತಿಳಿಸಿ.'),
  P(3, 3, 'advanced',
    'Extend to Package-Level Validation and Prove It',
    'Package-ಮಟ್ಟದ Validation ವಿಸ್ತರಿಸಿ ಮತ್ತು ಸಾಬೀತುಪಡಿಸಿ',
    'The lab validates only SKILL.md text, but Part 1 says the directory is the deployable unit.\n1. Write validate_package(path) that also checks every references/, scripts/ and assets/ path mentioned in the body actually exists, returning ValidationIssue codes.\n2. Build a temporary directory that has SKILL.md but omits references/release-policy.md, and show the exact report.\n3. Write three unittest cases (valid package, missing reference, name mismatch) and run them. Then say which of the lesson\'s three levels of proof you have now covered and which you still have not.',
    'lab SKILL.md ಪಠ್ಯ ಮಾತ್ರ ಪರಿಶೀಲಿಸುತ್ತದೆ, ಆದರೆ Part 1 ಡೈರೆಕ್ಟರಿ ನಿಯೋಜನಾ ಘಟಕ ಎನ್ನುತ್ತದೆ.\n1. body ನಲ್ಲಿ ಉಲ್ಲೇಖಿಸಿದ ಪ್ರತಿ references/, scripts/, assets/ path ವಾಸ್ತವವಾಗಿ ಇದೆಯೇ ಎಂದೂ ಪರಿಶೀಲಿಸಿ ValidationIssue ಕೋಡ್‌ಗಳನ್ನು ಹಿಂತಿರುಗಿಸುವ validate_package(path) ಬರೆಯಿರಿ.\n2. SKILL.md ಇದ್ದು references/release-policy.md ಇಲ್ಲದ ತಾತ್ಕಾಲಿಕ ಡೈರೆಕ್ಟರಿ ನಿರ್ಮಿಸಿ, ನಿಖರ ವರದಿ ತೋರಿಸಿ.\n3. ಮೂರು unittest ಪ್ರಕರಣಗಳನ್ನು (ಮಾನ್ಯ package, ಕಾಣೆಯಾದ reference, name ಹೊಂದಾಣಿಕೆ ಇಲ್ಲ) ಬರೆದು ಚಲಾಯಿಸಿ. ನಂತರ ಪಾಠದ ಮೂರು ಸಾಕ್ಷ್ಯ ಹಂತಗಳಲ್ಲಿ ಯಾವುದನ್ನು ಈಗ ಒಳಗೊಂಡಿದ್ದೀರಿ, ಯಾವುದನ್ನು ಇನ್ನೂ ಇಲ್ಲ ಎಂದು ತಿಳಿಸಿ.'),
];
