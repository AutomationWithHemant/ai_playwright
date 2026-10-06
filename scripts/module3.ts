// Module 3 in one command: npm run module3
// Runs every Defect Insights step and then lists exactly which files to open.
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const step = (title: string, cmd: string) => {
  console.log(`\n==== ${title} ====`);
  try { execSync(cmd, { stdio: 'inherit' }); } catch { /* the fail demo fails on purpose */ }
};

step('3.1 Run 3 tests that fail on purpose -> AI analyses each failure', 'npx playwright test --config=playwright.fail-demo.config.ts');
step('3.4 AI summary of that run', 'npx tsx scripts/summarise-run.ts results-fail-demo.json');
step('3.3 Requirements doc -> Gherkin', 'npx tsx scripts/req-to-gherkin.ts');

const files: [string, string][] = [
  ['3.1  Tests that fail on purpose', 'demo-failures/rca-demo.spec.ts'],
  ['3.1  AI reporter code', 'reporters/ai-rca-reporter.ts'],
  ['3.1  AI analysis RESULT', 'ai-analysis.md'],
  ['3.2  CI workflow (hidden folder)', '.github/workflows/e2e.yml'],
  ['3.3  Requirements (input)', 'docs/requirements/login.md'],
  ['3.3  Gherkin RESULT', 'features/login.feature'],
  ['3.3  Gherkin script', 'scripts/req-to-gherkin.ts'],
  ['3.4  Summary script', 'scripts/summarise-run.ts'],
  ['3.4  Summary RESULT', 'run-summary.md'],
];
console.log('\n==== Module 3: files to open ====');
for (const [label, f] of files) {
  console.log(`${fs.existsSync(f) ? 'OK     ' : 'MISSING'}  ${label.padEnd(34)} ${path.resolve(f)}`);
}
