const { test, expect } = require('@playwright/test');

test.describe('Language Toggle Button', () => {
  test('should display language toggle on main content page', async ({ page }) => {
    // Navigate to the main content page
    await page.goto('/?page=main', { waitUntil: 'domcontentloaded' });

    // Wait a bit for the app to render
    await page.waitForTimeout(2000);

    // Log what we find
    const pageContent = await page.content();
    console.log('Page loaded, content length:', pageContent.length);

    // Look for TranslateIcon
    const translateIcons = await page.locator('[data-testid="TranslateIcon"]').count();
    console.log('TranslateIcon count:', translateIcons);

    // Look for any span containing "EN" or "BR"
    const enSpans = await page.locator('span:has-text("EN")').count();
    const brSpans = await page.locator('span:has-text("BR")').count();
    console.log('Spans with EN:', enSpans);
    console.log('Spans with BR:', brSpans);

    // Check for the header
    const header = await page.locator('#main-header').count();
    console.log('Header found:', header);

    // Get header HTML if it exists
    if (header > 0) {
      const headerHtml = await page.locator('#main-header').innerHTML();
      console.log('Header HTML:', headerHtml);
    }

    // Look for dark mode button (should exist)
    const brightness4 = await page.locator('[data-testid="Brightness4Icon"]').count();
    const brightness7 = await page.locator('[data-testid="Brightness7Icon"]').count();
    console.log('Brightness4Icon count:', brightness4);
    console.log('Brightness7Icon count:', brightness7);

    // Try to take a small screenshot
    try {
      await page.screenshot({ path: 'e2e/screenshots/content-page.png' });
      console.log('Screenshot saved');
    } catch (e) {
      console.log('Screenshot failed:', e.message);
    }
  });

  test('should display language toggle on chat page', async ({ page }) => {
    // Navigate to the chat page
    await page.goto('/?page=chat', { waitUntil: 'domcontentloaded' });

    // Wait a bit for the app to render
    await page.waitForTimeout(2000);

    // Log what we find
    const pageContent = await page.content();
    console.log('Page loaded, content length:', pageContent.length);

    // Look for TranslateIcon
    const translateIcons = await page.locator('[data-testid="TranslateIcon"]').count();
    console.log('TranslateIcon count:', translateIcons);

    // Look for any span containing "EN" or "BR"
    const enSpans = await page.locator('span:has-text("EN")').count();
    const brSpans = await page.locator('span:has-text("BR")').count();
    console.log('Spans with EN:', enSpans);
    console.log('Spans with BR:', brSpans);

    // Check for the toolbar
    const toolbar = await page.locator('.MuiToolbar-root').count();
    console.log('Toolbar found:', toolbar);

    // Get toolbar HTML if it exists
    if (toolbar > 0) {
      const toolbarHtml = await page.locator('.MuiToolbar-root').innerHTML();
      console.log('Toolbar HTML:', toolbarHtml);
    }

    // Look for dark mode button (should exist)
    const brightness4 = await page.locator('[data-testid="Brightness4Icon"]').count();
    const brightness7 = await page.locator('[data-testid="Brightness7Icon"]').count();
    console.log('Brightness4Icon count:', brightness4);
    console.log('Brightness7Icon count:', brightness7);

    // Try to take a small screenshot
    try {
      await page.screenshot({ path: 'e2e/screenshots/chat-page.png' });
      console.log('Screenshot saved');
    } catch (e) {
      console.log('Screenshot failed:', e.message);
    }
  });
});
