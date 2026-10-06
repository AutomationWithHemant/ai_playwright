// One command for the whole course flow: npm run demo:all
import { execSync } from 'child_process';

const step = (title: string, cmd: string) => {
  console.log(`\n==== ${title} ====`);
  try { execSync(cmd, { stdio: 'inherit' }); } catch { console.log(`(step "${title}" had failures - continuing)`); }
};

step('1.1 Generate users', 'npm run gen:users');
step('1.2 Generate boundary cases', 'npm run gen:edge');
step('1.3 Generate products', 'npm run gen:products');
step('2.1 Run tests (includes self-healing)', 'npx playwright test');
step('2.2 Apply heals to source', 'npm run heal:apply');
step('3.3 Requirements -> Gherkin', 'npm run gherkin');
step('3.4 Run summary', 'npm run summary');
step('3.1 Failure analysis demo (fails on purpose)', 'npm run test:fail-demo');
console.log('\nDone. Open playwright-report/, run-summary.md, ai-analysis.md and features/login.feature');
console.log('To show self-healing again: npm run demo:reset');
