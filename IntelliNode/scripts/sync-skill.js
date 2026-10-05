// Copy the agent skill (skills/intellinode, shipped in the npm package) into the repository plugin
// (../plugins/intellinode/skills/intellinode) used by the Claude Code and Codex marketplaces.
const fs = require('fs');
const path = require('path');

const source = path.join(__dirname, '..', 'skills', 'intellinode');
const target = path.join(__dirname, '..', '..', 'plugins', 'intellinode', 'skills', 'intellinode');

if (!fs.existsSync(path.dirname(path.dirname(target)))) {
  console.log('No plugins/intellinode folder next to the package; nothing to sync.');
  process.exit(0);
}
fs.rmSync(target, { recursive: true, force: true });
fs.mkdirSync(path.dirname(target), { recursive: true });
fs.cpSync(source, target, { recursive: true, filter: (file) => path.basename(file) !== '.DS_Store' });
console.log(`Synced the skill into ${path.relative(process.cwd(), target)}`);
