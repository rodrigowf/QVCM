const { test, expect } = require('@playwright/test');

test.describe('Content Page Language Toggle', () => {
  test('should toggle language and update all UI text', async ({ page }) => {
    // Navigate to the main content page
    await page.goto('/?page=main', { waitUntil: 'networkidle' });

    // Wait for content to load
    await page.waitForSelector('#main-header', { timeout: 10000 });

    // Take initial screenshot
    await page.screenshot({
      path: 'test-results/01-initial-load-en.png',
      fullPage: true
    });

    console.log('=== Initial State (English) ===');

    // Check initial English text
    const initialTitle = await page.locator('h1').first().textContent();
    console.log('Title:', initialTitle);

    const initialSubtitle = await page.locator('.header-content').locator('h2').textContent();
    console.log('Subtitle:', initialSubtitle);

    // Check loading text (if visible)
    const loadingText = await page.locator('text=/Loading|Carregando/').count();
    console.log('Loading text count:', loadingText);

    // Check links
    const githubLink = await page.locator('a:has-text("GitHub")').first().textContent();
    console.log('GitHub link text:', githubLink);

    const rawContentLink = await page.locator('a[href*="QVCM.md"]').first().textContent();
    console.log('Raw content link text:', rawContentLink);

    // Check footer
    const footerText = await page.locator('footer p').textContent();
    console.log('Footer text:', footerText);

    // Find the language toggle button
    const languageButton = page.locator('[data-testid="TranslateIcon"]').locator('..');
    const languageButtonCount = await languageButton.count();
    console.log('Language button count:', languageButtonCount);

    if (languageButtonCount === 0) {
      console.log('Language button not found! Checking all buttons...');
      const allButtons = await page.locator('button').count();
      console.log('Total buttons on page:', allButtons);

      for (let i = 0; i < allButtons; i++) {
        const buttonHtml = await page.locator('button').nth(i).innerHTML();
        console.log(`Button ${i}:`, buttonHtml.substring(0, 100));
      }
    }

    // Take screenshot of header area
    await page.locator('#main-header').screenshot({
      path: 'test-results/02-header-en.png'
    });

    // Verify English text is present
    await expect(page.locator('h1').first()).toContainText('Quantum Vantage Consciousness Model');

    // Click language toggle
    console.log('\n=== Clicking Language Toggle ===');
    await languageButton.click();

    // Wait for content to update
    await page.waitForTimeout(2000);

    // Take screenshot after toggle
    await page.screenshot({
      path: 'test-results/03-after-toggle-pt.png',
      fullPage: true
    });

    console.log('\n=== After Toggle (Portuguese) ===');

    // Check Portuguese text
    const newTitle = await page.locator('h1').first().textContent();
    console.log('New Title:', newTitle);

    const newSubtitle = await page.locator('.header-content').locator('h2').textContent();
    console.log('New Subtitle:', newSubtitle);

    const newGithubLink = await page.locator('a:has-text("GitHub")').first().textContent();
    console.log('New GitHub link text:', newGithubLink);

    const newRawContentLink = await page.locator('a[href*="QVCM.pt-BR.md"]').textContent();
    console.log('New Raw content link text:', newRawContentLink);

    const newFooterText = await page.locator('footer p').textContent();
    console.log('New Footer text:', newFooterText);

    // Take screenshot of header after toggle
    await page.locator('#main-header').screenshot({
      path: 'test-results/04-header-pt.png'
    });

    // Verify Portuguese text is present
    await expect(page.locator('h1').first()).toContainText('Modelo de Consciência Quantum Vantage');

    // Click again to toggle back
    console.log('\n=== Clicking Language Toggle Again ===');
    await languageButton.click();

    // Wait for content to update
    await page.waitForTimeout(2000);

    // Take screenshot after toggling back
    await page.screenshot({
      path: 'test-results/05-toggle-back-en.png',
      fullPage: true
    });

    console.log('\n=== Back to English ===');

    const finalTitle = await page.locator('h1').first().textContent();
    console.log('Final Title:', finalTitle);

    // Verify English text is back
    await expect(page.locator('h1').first()).toContainText('Quantum Vantage Consciousness Model');

    console.log('\n=== Test Complete ===');
  });
});
