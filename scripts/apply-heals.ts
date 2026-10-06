import fs from 'fs';
import path from 'path';

if (!fs.existsSync('healed-locators.jsonl')) {
  console.log('No heals logged - nothing to apply.');
  process.exit(0);
}
const heals = fs.readFileSync('healed-locators.jsonl', 'utf8').trim().split('\n').map(l => JSON.parse(l));
const files = ['tests', 'pages'].filter(d => fs.existsSync(d)).flatMap(dir =>
  fs.readdirSync(dir, { recursive: true }).map(f => path.join(dir, String(f))).filter(f => f.endsWith('.ts')));

for (const h of heals) {
  for (const file of files) {
    const src = fs.readFileSync(file, 'utf8');
    if (src.includes(`'${h.old}'`)) {
      fs.writeFileSync(file, src.split(`'${h.old}'`).join(`'${h.new}'`));
      console.log(`Healed ${h.old} -> ${h.new} in ${file}`);
    }
  }
}
