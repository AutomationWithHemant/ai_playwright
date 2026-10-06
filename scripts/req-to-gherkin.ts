import fs from 'fs';
import { askLLM } from '../utils/llm';

async function main() {
  const req = fs.readFileSync('docs/requirements/login.md', 'utf8');
  const feature = await askLLM(
    `Convert these requirements into a Gherkin .feature file.
     Rules: one Feature; a Background for shared steps; cover happy path, negative and boundary cases;
     use Scenario Outline with Examples for data variations; keep step wording consistent;
     describe behaviour, not UI implementation.
     Requirements:
     ${req}
     Return only the Gherkin text.`);
  fs.writeFileSync('features/login.feature', feature.replace(/```(gherkin)?/g, '').trim() + '\n');
  console.log('Wrote features/login.feature - review it against the requirement');
}
main();
