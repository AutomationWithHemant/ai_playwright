import { Page, Locator, test } from '@playwright/test';
import fs from 'fs';
import { askJSON } from './llm';
import * as allure from 'allure-js-commons';
import { ContentType } from 'allure-js-commons';

export async function healingLocator(page: Page, selector: string, intent: string): Promise<Locator> {
  const original = page.locator(selector);
  await original.first().waitFor({ timeout: 3000 }).catch(() => {});
  if (await original.count() === 1) return original; // healthy, no AI call

  const snapshot = await page.locator('body').ariaSnapshot();
  const { newSelector } = await askJSON<{ newSelector: string }>(
    `The Playwright selector '${selector}' for "${intent}" no longer matches anything.
     Current page accessibility snapshot:
     ${snapshot.slice(0, 15000)}
     Suggest ONE robust Playwright selector. Prefer role, label, text or test-id,
     for example: role=button[name="Login"]. Use double quotes inside the selector.
     JSON: {"newSelector": "..."}`);

  const healed = page.locator(newSelector);
  if (await healed.count() !== 1) {
    throw new Error(`Self-heal failed: '${selector}' -> '${newSelector}' matched ${await healed.count()} elements`);
  }
  let healRecord: Record<string, unknown> | undefined;

  fs.appendFileSync('healed-locators.jsonl',
    JSON.stringify({ test: test.info().title, old: selector, new: newSelector, intent }) + '\n');
  test.info().annotations.push({ type: 'self-healed', description: `${selector} -> ${newSelector}` });
   // Attach AI self-healing metadata directly into the Allure Report!
  await allure.tag('AI-Self-Healed');
  await allure.parameter('Broken Selector', selector);
  await allure.parameter('AI Healed Selector', newSelector);
  await allure.attachment(
    'AI Self-Healing Diagnosis (GPT-4o)',
    JSON.stringify(healRecord, null, 2),
    ContentType.JSON
  );

  return healed;
}
