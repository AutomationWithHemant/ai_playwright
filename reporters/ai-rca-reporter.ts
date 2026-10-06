import type { Reporter, TestCase, TestResult } from '@playwright/test/reporter';
import fs from 'fs';
import { askJSON } from '../utils/llm';

type Rca = { category: string; rootCause: string; suggestedFix: string; confidence: string };
const stripAnsi = (s: string) => s.replace(/\u001b\[[0-9;]*m/g, '');

export default class AiRcaReporter implements Reporter {
  private failures: { title: string; error: string }[] = [];

  onTestEnd(test: TestCase, result: TestResult) {
    if (result.status === 'failed' || result.status === 'timedOut') {
      const error = result.errors.map(e => `${e.message ?? ''}\n${e.stack ?? ''}`).join('\n');
      this.failures.push({ title: test.titlePath().filter(Boolean).join(' > '), error: stripAnsi(error).slice(0, 4000) });
    }
  }

  async onEnd() {
    if (!this.failures.length) return; // no failures: keep the last analysis file as it is
    let md = '## AI failure analysis\n\n| Test | Category | Root cause | Suggested fix |\n|---|---|---|---|\n';
    for (const f of this.failures) {
      const r = await askJSON<Rca>(
        `Analyse this Playwright test failure.
         Test: ${f.title}
         Error and stack:
         ${f.error}
         Category must be one of: product-bug, test-bug, environment, flaky.
         JSON: {"category":"","rootCause":"one sentence","suggestedFix":"one sentence","confidence":"high|medium|low"}`);
      md += `| ${f.title} | ${r.category} (${r.confidence}) | ${r.rootCause} | ${r.suggestedFix} |\n`;
    }
    fs.writeFileSync('ai-analysis.md', md);
    console.log('\nAI failure analysis written to ai-analysis.md');
  }
}
