// Module 1.2 - AI-generated boundary cases
import { test, expect } from '@playwright/test';
import fs from 'fs';
import * as allure from "allure-js-commons";


type EdgeCase = { input: string; expected: 'accept' | 'reject'; reason: string };
const cases: EdgeCase[] = JSON.parse(fs.readFileSync('test-data/age-cases.json', 'utf8'));

for (const c of cases) {
  test(`age "${c.input}" should ${c.expected} - ${c.reason}`, async ({ page }) => {
    await allure.epic('Module 1: AI Test Data Generation');
    await allure.feature('Age Boundary Value Analysis');
    await allure.parameter('Age Input', c.input);
    await allure.parameter('Expected Outcome', c.expected);
    await allure.parameter('Boundary Rule', c.reason);
    // ... existing test steps ...
  });
}