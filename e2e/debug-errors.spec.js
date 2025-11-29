const { test, expect } = require('@playwright/test');

test.describe('Debug Page Errors', () => {

  test('should capture all console messages and errors', async ({ page }) => {
    const consoleMessages = [];
    const pageErrors = [];

    // Listen to all console events
    page.on('console', msg => {
      const type = msg.type();
      const text = msg.text();
      consoleMessages.push({ type, text });
      console.log(`[Browser ${type}]:`, text);
    });

    // Listen to page errors
    page.on('pageerror', error => {
      pageErrors.push(error.message);
      console.log('[Page Error]:', error.message);
      console.log('[Stack]:', error.stack);
    });

    console.log('=== Navigating to page ===');
    await page.goto('/?page=main', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    console.log('=== Page loaded ===');

    // Wait a bit for any async errors
    await page.waitForTimeout(2000);

    // Take screenshot
    await page.screenshot({
      path: 'test-results/screenshots/debug-errors.png',
      fullPage: true
    });

    // Get page content
    const html = await page.content();
    console.log('=== Page HTML (first 1000 chars) ===');
    console.log(html.substring(0, 1000));

    console.log('\n=== Summary ===');
    console.log('Console messages:', consoleMessages.length);
    console.log('Page errors:', pageErrors.length);

    if (pageErrors.length > 0) {
      console.log('\n=== All Page Errors ===');
      pageErrors.forEach((err, i) => {
        console.log(`${i + 1}. ${err}`);
      });
    }

    // Check for specific errors
    const hasErrors = pageErrors.length > 0;
    const errorMessages = consoleMessages.filter(m => m.type === 'error');

    console.log('\n=== Console Errors ===');
    errorMessages.forEach((msg, i) => {
      console.log(`${i + 1}. ${msg.text}`);
    });
  });
});
