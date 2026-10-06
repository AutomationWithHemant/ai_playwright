import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  globalSetup: './global-setup.ts',
  timeout: 30_000,
  use: { baseURL: 'http://localhost:3000', trace: 'retain-on-failure' },
  webServer: { command: 'node demo-app/server.js', url: 'http://localhost:3000', reuseExistingServer: true },
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['json', { outputFile: 'results.json' }],
    ['./reporters/ai-rca-reporter.ts'],
  ],
});
