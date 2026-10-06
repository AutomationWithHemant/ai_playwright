import fs from 'fs';
import { askLLM } from '../utils/llm';

async function main() {
  // Usage: npm run summary                      -> summarises the main run (results.json)
  //        tsx scripts/summarise-run.ts results-fail-demo.json -> summarises the fail demo
  const file = process.argv[2] ?? 'results.json';
  if (!fs.existsSync(file)) { console.log(`${file} not found. Run the tests first.`); return; }
  const report = JSON.parse(fs.readFileSync(file, 'utf8'));
  const s = report.stats; // expected, unexpected, flaky, skipped, duration

  const failed: string[] = [];
  const walk = (suite: any) => {
    suite.specs?.forEach((spec: any) =>
      spec.tests.forEach((t: any) => { if (t.status === 'unexpected') failed.push(spec.title); }));
    suite.suites?.forEach(walk);
  };
  report.suites.forEach(walk);

  const rca = s.unexpected > 0 && fs.existsSync('ai-analysis.md') ? fs.readFileSync('ai-analysis.md', 'utf8') : 'none';
  const summary = await askLLM(
    `Write a 5-line test run summary for an engineering manager. Use ONLY these numbers.
     Passed: ${s.expected}, Failed: ${s.unexpected}, Flaky: ${s.flaky}, Skipped: ${s.skipped},
     Duration: ${Math.round(s.duration / 1000)} s
     Failed tests: ${failed.join('; ') || 'none'}
     Root-cause notes: ${rca}
     End with a recommendation: GO, NO-GO or GO WITH CAUTION, and one reason.`);
  fs.writeFileSync('run-summary.md', summary);
  console.log(summary);
}
main();
