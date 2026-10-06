import fs from 'fs';
import { z } from 'zod';
import { askJSON } from '../utils/llm';
import { EdgeCaseSchema } from '../data/ai-data';

async function main() {
  const spec = 'Field "Age" on the signup form. Whole number. Minimum 18, maximum 60. Required.';
  const raw = await askJSON<unknown[]>(
    `You are a boundary-value testing expert. For this field spec, list 12 test inputs covering:
     min-1, min, min+1, max-1, max, max+1, empty, negative, decimal, non-numeric, spaces, very large number.
     Spec: ${spec}
     JSON array of {"input": string, "expected": "accept"|"reject", "reason": string}`);
  const cases = z.array(EdgeCaseSchema).parse(raw);
  fs.writeFileSync('test-data/age-cases.json', JSON.stringify(cases, null, 2));
  console.log(`Saved ${cases.length} edge cases - a tester must review the "expected" column`);
}
main();
