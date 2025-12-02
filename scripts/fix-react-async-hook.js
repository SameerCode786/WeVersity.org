const fs = require('fs');
const path = require('path');

const targets = [
  path.join(__dirname, '..', 'node_modules', 'react-native-phone-number-input', 'node_modules', 'react-async-hook', 'react-async-hook.esm.js'),
  path.join(__dirname, '..', 'node_modules', 'react-async-hook', 'react-async-hook.esm.js'),
];

const content = `module.exports = require('./dist/index.js');\nexports.default = module.exports;\n`;

for (const p of targets) {
  try {
    const dir = path.dirname(p);
    if (!fs.existsSync(dir)) {
      // directory doesn't exist; skip
      continue;
    }
    if (!fs.existsSync(p)) {
      fs.writeFileSync(p, content, 'utf8');
      console.log('Wrote shim:', p);
    }
  } catch (err) {
    // ignore errors - postinstall should not fail the whole install
    console.warn('Could not write shim at', p, err && err.message);
  }
}

