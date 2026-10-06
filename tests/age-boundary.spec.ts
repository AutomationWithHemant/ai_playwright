// Module 1.2 - AI-generated boundary cases
import { test, expect } from '@playwright/test';
import fs from 'fs';

type EdgeCase = { input: string; expected: 'accept' | 'reject'; reason: string };
const cases: EdgeCase[] = JSON.parse(fs.readFileSync('test-data/age-cases.json', 'utf8'));

for (const c of cases) {
  test(`age "${c.input}" should ${c.expected} - ${c.reason}`, async ({ page }) => {
    await page.goto('/signup');
    await page.getByLabel('Age').fill(c.input);
    await page.getByRole('button', { name: 'Submit' }).click();
    const error = page.getByTestId('age-error');
    if (c.expected === 'reject') await expect(error).toBeVisible();
    else await expect(error).toBeHidden();
  });
}
