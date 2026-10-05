const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const SKILL = path.join(__dirname, '..', '..', 'skills', 'intellinode');
const PLUGIN_SKILL = path.join(__dirname, '..', '..', '..', 'plugins', 'intellinode', 'skills', 'intellinode');

function listFiles(root) {
  const files = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === '.DS_Store') continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else files.push(path.relative(root, full));
    }
  };
  walk(root);
  return files.sort();
}

function testFrontmatter() {
  const text = fs.readFileSync(path.join(SKILL, 'SKILL.md'), 'utf8');
  const match = /^---\n([\s\S]*?)\n---\n/.exec(text);
  assert.ok(match, 'SKILL.md starts with YAML frontmatter');
  const fields = Object.fromEntries(match[1].split('\n').map((line) => [line.slice(0, line.indexOf(':')), line.slice(line.indexOf(':') + 1).trim()]));
  // the Agent Skills rules shared by Claude Code and Codex
  assert.strictEqual(fields.name, path.basename(SKILL), 'name matches the folder');
  assert.ok(/^[a-z0-9]+(-[a-z0-9]+)*$/.test(fields.name) && fields.name.length <= 64);
  assert.ok(fields.description && fields.description.length <= 1024, 'description is 1-1024 characters');
  assert.deepStrictEqual(Object.keys(fields).filter((key) => !['name', 'description', 'license', 'compatibility', 'metadata', 'allowed-tools'].includes(key)), [],
    'only portable frontmatter keys');
  assert.ok(text.split('\n').length < 500, 'SKILL.md stays under 500 lines');
  for (const [, link] of text.matchAll(/\]\(((?:references|assets)\/[^)]+)\)/g)) {
    assert.ok(fs.existsSync(path.join(SKILL, link)), `linked file ${link} exists`);
  }
}

function testPluginCopyInSync() {
  if (!fs.existsSync(PLUGIN_SKILL)) return; // the npm package has no plugins folder
  const files = listFiles(SKILL);
  assert.deepStrictEqual(listFiles(PLUGIN_SKILL), files, 'run `npm run sync-skill` after editing skills/intellinode');
  for (const file of files) {
    assert.ok(fs.readFileSync(path.join(SKILL, file)).equals(fs.readFileSync(path.join(PLUGIN_SKILL, file))),
      `plugins copy of ${file} is out of date: run \`npm run sync-skill\``);
  }
}

function testInstallCommand() {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'intellinode-skill-'));
  try {
    const cli = path.join(__dirname, '..', '..', 'bin', 'intellinode.js');
    execFileSync(process.execPath, [cli, 'skill', 'install', '--project'], { cwd: home, stdio: 'pipe' });
    for (const folder of ['.claude', '.agents']) {
      assert.deepStrictEqual(listFiles(path.join(home, folder, 'skills', 'intellinode')), listFiles(SKILL));
    }
    // another skill with the same folder name is never replaced
    const other = path.join(home, 'other', 'intellinode');
    fs.mkdirSync(other, { recursive: true });
    fs.writeFileSync(path.join(other, 'SKILL.md'), '---\nname: something-else\n---\n');
    assert.throws(() => execFileSync(process.execPath, [cli, 'skill', 'install', '--dir', path.join(home, 'other')], { stdio: 'pipe' }));
    assert.ok(fs.readFileSync(path.join(other, 'SKILL.md'), 'utf8').includes('something-else'));
  } finally {
    fs.rmSync(home, { recursive: true, force: true });
  }
}

async function testSkill() {
  testFrontmatter();
  testPluginCopyInSync();
  testInstallCommand();
  console.log('Agent skill tests passed.');
}

module.exports = testSkill;

if (require.main === module) {
  testSkill().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
