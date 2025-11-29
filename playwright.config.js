const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './e2e',
  timeout: 60000,
  retries: 0,
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'on',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    headless: true,
    viewport: { width: 1280, height: 720 },
    launchOptions: {
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    },
  },
  reporter: [
    ['list'],
    ['html', { outputFolder: 'test-results/html-report', open: 'never' }]
  ],
});
