// Verifies that every asset referenced from libraries.yml, SDC *.component.yml
// and Twig templates exists on disk. Run after "npm run copy" to catch
// upstream design system changes (removed/renamed files) before they break sites.
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const missing = [];

function checkRef(ref, baseDir, source) {
  const resolved = path.resolve(baseDir, ref);
  if (!fs.existsSync(resolved)) {
    missing.push(`${source}: ${ref}`);
  }
}

function walk(dir, ext) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walk(full, ext));
    } else if (entry.name.endsWith(ext)) {
      out.push(full);
    }
  }
  return out;
}

// Asset entries in YAML: "  some/path.css: {}" or "  some/path.js: {}"
const yamlAssetRe = /^\s*([^\s:#]+\.(?:css|js)):\s*\{/;

function checkYaml(file, baseDir) {
  const rel = path.relative(root, file);
  fs.readFileSync(file, 'utf8')
    .split('\n')
    .forEach((line) => {
      const m = line.match(yamlAssetRe);
      if (m && !m[1].startsWith('//') && !m[1].startsWith('http')) {
        checkRef(m[1], baseDir, rel);
      }
    });
}

// gov_cz.libraries.yml — paths are relative to the module root.
checkYaml(path.join(root, 'gov_cz.libraries.yml'), root);

// SDC components — libraryOverrides paths are relative to the component dir.
for (const file of walk(path.join(root, 'components'), '.component.yml')) {
  checkYaml(file, path.dirname(file));
}

// Twig source('@gov_cz/...') references — relative to the module root.
const twigSourceRe = /source\(\s*'@gov_cz\/([^']+)'/g;
for (const file of walk(path.join(root, 'components'), '.twig')) {
  const content = fs.readFileSync(file, 'utf8');
  for (const m of content.matchAll(twigSourceRe)) {
    checkRef(m[1], root, path.relative(root, file));
  }
}

if (missing.length) {
  console.error('Missing asset files:');
  missing.forEach((m) => console.error(`  ${m}`));
  process.exit(1);
}
console.log('verify-assets: all referenced assets exist.');
