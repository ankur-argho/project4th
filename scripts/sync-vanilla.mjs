import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const src = path.join(root, 'backend', 'vanilla');
const dest = path.join(root, 'frontend', 'public', 'vanilla');

if (!fs.existsSync(src)) {
  console.warn('sync-vanilla: source folder missing, skipping');
  process.exit(0);
}

fs.mkdirSync(path.join(dest, 'css'), { recursive: true });
fs.mkdirSync(path.join(dest, 'js'), { recursive: true });

fs.copyFileSync(path.join(src, 'index.html'), path.join(dest, 'index.html'));
fs.copyFileSync(path.join(src, 'css', 'styles.css'), path.join(dest, 'css', 'styles.css'));
fs.copyFileSync(path.join(src, 'js', 'app.js'), path.join(dest, 'js', 'app.js'));

console.log('sync-vanilla: copied vanilla → public/vanilla');
