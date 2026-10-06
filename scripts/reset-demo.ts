// Puts the broken locator back so the self-healing demo can be shown again.
import fs from 'fs';
const file = 'tests/login-heal.spec.ts';
const src = fs.readFileSync(file, 'utf8');
fs.writeFileSync(file, src.replace(
  /healingLocator\(page, '[^']*', 'Login button on the sign-in page'\)/,
  `healingLocator(page, '#btn-login', 'Login button on the sign-in page')`));
if (fs.existsSync('healed-locators.jsonl')) fs.unlinkSync('healed-locators.jsonl');
console.log('Demo reset: login-heal.spec.ts uses the broken #btn-login locator again.');
