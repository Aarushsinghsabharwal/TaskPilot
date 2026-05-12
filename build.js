import { readFileSync, mkdirSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const html = readFileSync(join(__dirname, 'taskpilot.html'), 'utf8');
const core = readFileSync(join(__dirname, 'taskpilot-core.js'), 'utf8');

// Strip the CommonJS export guard — not needed in the browser bundle
const coreBrowser = core.replace(
  /\nif \(typeof module !== 'undefined'\) \{[\s\S]*?\}\n/,
  '\n'
);

const output = html.replace(
  '<script src="taskpilot-core.js"></script>',
  `<script>\n${coreBrowser}</script>`
);

mkdirSync(join(__dirname, 'dist'), { recursive: true });
writeFileSync(join(__dirname, 'dist', 'taskpilot.html'), output, 'utf8');
console.log('Built dist/taskpilot.html');
