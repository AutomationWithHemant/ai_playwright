# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: login-heal.spec.ts >> login with self-healing locator
- Location: tests/login-heal.spec.ts:8:5

# Error details

```
ReferenceError: healRecord is not defined
```

# Page snapshot

```yaml
- generic [ref=e1]:
  - heading "Demo Store" [level=1] [ref=e2]
  - generic [ref=e3]: Username
  - textbox "Username" [ref=e4]: standard_user
  - generic [ref=e5]: Password
  - textbox "Password" [active] [ref=e6]: secret_sauce
  - button "Login" [ref=e7]
  - alert
```

# Test source

```ts
  1  | import { Page, Locator, test } from '@playwright/test';
  2  | import fs from 'fs';
  3  | import { askJSON } from './llm';
  4  | import * as allure from 'allure-js-commons';
  5  | import { ContentType } from 'allure-js-commons';
  6  | 
  7  | export async function healingLocator(page: Page, selector: string, intent: string): Promise<Locator> {
  8  |   const original = page.locator(selector);
  9  |   await original.first().waitFor({ timeout: 3000 }).catch(() => {});
  10 |   if (await original.count() === 1) return original; // healthy, no AI call
  11 | 
  12 |   const snapshot = await page.locator('body').ariaSnapshot();
  13 |   const { newSelector } = await askJSON<{ newSelector: string }>(
  14 |     `The Playwright selector '${selector}' for "${intent}" no longer matches anything.
  15 |      Current page accessibility snapshot:
  16 |      ${snapshot.slice(0, 15000)}
  17 |      Suggest ONE robust Playwright selector. Prefer role, label, text or test-id,
  18 |      for example: role=button[name="Login"]. Use double quotes inside the selector.
  19 |      JSON: {"newSelector": "..."}`);
  20 | 
  21 |   const healed = page.locator(newSelector);
  22 |   if (await healed.count() !== 1) {
  23 |     throw new Error(`Self-heal failed: '${selector}' -> '${newSelector}' matched ${await healed.count()} elements`);
  24 |   }
  25 | 
  26 |   fs.appendFileSync('healed-locators.jsonl',
  27 |     JSON.stringify({ test: test.info().title, old: selector, new: newSelector, intent }) + '\n');
  28 |   test.info().annotations.push({ type: 'self-healed', description: `${selector} -> ${newSelector}` });
  29 |    // Attach AI self-healing metadata directly into the Allure Report!
  30 |   await allure.tag('AI-Self-Healed');
  31 |   await allure.parameter('Broken Selector', selector);
  32 |   await allure.parameter('AI Healed Selector', newSelector);
  33 |   await allure.attachment(
  34 |     'AI Self-Healing Diagnosis (GPT-4o)',
> 35 |     JSON.stringify(healRecord, null, 2),
     |                    ^ ReferenceError: healRecord is not defined
  36 |     ContentType.JSON
  37 |   );
  38 | 
  39 |   return healed;
  40 | }
  41 | 
```