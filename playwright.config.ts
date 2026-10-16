import 'dotenv/config';
import * as os from 'node:os';
import { defineConfig, devices, type ReporterDescription } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

const bddTestDir = defineBddConfig({
  features: 'features/*.feature',
  steps: 'features/steps/*.steps.ts',
});

// 1. Reporter list config ke BAHAR banti hai
const reporters: ReporterDescription[] = [
  ['list'],
  ['html', { open: 'never' }],
  ['json', { outputFile: 'results.json' }],
  ['junit', { outputFile: 'reports/junit.xml' }],
  [
    'allure-playwright',
    {
      resultsDir: 'allure-results',
      detail: true,
      suiteTitle: true,
      environmentInfo: {
        os_platform: os.platform(),
        os_release: os.release(),
        node_version: process.version,
        ai_model: process.env.OPENAI_MODEL ?? 'gpt-4o',
        app_url: 'http://localhost:3000',
      },
    },
  ],
];

if (process.env.OPENAI_API_KEY) {
  reporters.push(['./reporters/ai-rca-reporter.ts']);
} else {
  console.warn('OPENAI_API_KEY not set — AI RCA reporter disabled for this run.');
}

export default defineConfig({
  testDir: './tests',
  globalSetup: './global-setup.ts',
  timeout: 30_000,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  use: { baseURL: 'http://localhost:3000', 
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
   },
  webServer: {
    command: 'node demo-app/server.js',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit',   use: { ...devices['Desktop Safari'] } },
    { name: 'bdd-chromium', testDir: bddTestDir, use: { ...devices['Desktop Chrome'] } },
  ],
  reporter: reporters,
});
