// Module 3 demo: runs tests that FAIL on purpose so the AI reporter has something to analyse.
import { defineConfig } from '@playwright/test';
import base from './playwright.config';

export default defineConfig({
  ...base,
  testDir: './demo-failures',
  use: { ...base.use, baseURL: 'https://www.saucedemo.com' },
  webServer: undefined,
  reporter: [
    ['list'],
    ['json', { outputFile: 'results-fail-demo.json' }], // keeps the main results.json clean
    ['./reporters/ai-rca-reporter.ts'],
  ],
});
