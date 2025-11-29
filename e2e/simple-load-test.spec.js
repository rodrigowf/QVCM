const { test, expect } = require('@playwright/test');

test.describe('Simple Page Load Test', () => {

  test('should load the main page', async ({ page }) => {
    console.log('Navigating to main page...');

    try {
      await page.goto('/?page=main', {
        waitUntil: 'domcontentloaded',
        timeout: 30000
      });

      console.log('Page loaded successfully');

      // Take screenshot
      await page.screenshot({
        path: 'test-results/screenshots/simple-load.png',
        fullPage: true
      });

      console.log('Screenshot taken');

      // Get page HTML to see what we have
      const bodyHTML = await page.evaluate(() => document.body.innerHTML);
      console.log('Page HTML length:', bodyHTML.length);

      // Check if React root exists
      const rootExists = await page.locator('#root').count();
      console.log('React root exists:', rootExists > 0);

      // Check if header exists
      const headerExists = await page.locator('#main-header').count();
      console.log('Main header exists:', headerExists > 0);

      if (headerExists > 0) {
        const headerHTML = await page.locator('#main-header').innerHTML();
        console.log('Header HTML:', headerHTML.substring(0, 500));
      }

    } catch (error) {
      console.error('Error during test:', error.message);
      await page.screenshot({
        path: 'test-results/screenshots/error-state.png',
        fullPage: true
      });
      throw error;
    }
  });
});
