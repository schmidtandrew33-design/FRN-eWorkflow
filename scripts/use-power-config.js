const fs = require('fs');
const path = require('path');

const root = process.cwd();
const targetName = process.argv[2];

if (!targetName) {
  console.error('Usage: node scripts/use-power-config.js <personal|gcc>');
  process.exit(1);
}

const sourcePath = path.join(root, `power.config.${targetName}.json`);
const targetPath = path.join(root, 'power.config.json');

if (!fs.existsSync(sourcePath)) {
  console.error(`Config file not found: ${sourcePath}`);
  process.exit(1);
}

fs.copyFileSync(sourcePath, targetPath);
console.log(`Using Power Apps config: power.config.${targetName}.json`);
