require('dotenv').config();
const m = require('mongoose');
const PHASE = '6a369d5e66020ed05b3214c3';
const MODS = [
  [271.1, 'Module 271.1: Skill Discovery and Progressive Disclosure', 'ಸ್ಕಿಲ್ ಡಿಸ್ಕವರಿ ಮತ್ತು ಪ್ರೋಗ್ರೆಸಿವ್ ಡಿಸ್ಕ್ಲೋಶರ್'],
  [271.2, 'Module 271.2: Skill Invocation and Routing', 'ಸ್ಕಿಲ್ ಇನ್ವೋಕೇಶನ್ ಮತ್ತು ರೂಟಿಂಗ್'],
  [271.3, 'Module 271.3: Skill Permissions, Sandboxes, and Trust', 'ಸ್ಕಿಲ್ ಅನುಮತಿಗಳು, ಸ್ಯಾಂಡ್‌ಬಾಕ್ಸ್‌ಗಳು ಮತ್ತು ವಿಶ್ವಾಸ'],
  [271.4, 'Module 271.4: Skill Evals, Packaging, and Portability', 'ಸ್ಕಿಲ್ ಇವಾಲ್ಸ್, ಪ್ಯಾಕೇಜಿಂಗ್ ಮತ್ತು ಪೋರ್ಟೆಬಿಲಿಟಿ'],
];
(async () => {
  await m.connect(process.env.MONGODB_URI || process.env.MONGO_URI);
  const col = m.connection.db.collection('modules');
  for (const [order, name, nameKn] of MODS) {
    const ex = await col.findOne({ name, phaseId: PHASE });
    if (ex) { console.log('exists', ex._id, name); continue; }
    const _id = new m.Types.ObjectId().toString();
    await col.insertOne({ _id, name, nameKn, desc: '', descKn: '', phaseId: PHASE, order, status: 'published', createdAt: new Date(), updatedAt: new Date(), __v: 0 });
    console.log('created', _id, name);
  }
  process.exit(0);
})();
