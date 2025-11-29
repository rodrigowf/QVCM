const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('Content Page Language Toggle - Comprehensive Tests', () => {

  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/?page=main');
    await page.evaluate(() => localStorage.clear());
  });

  test('should load page with default English language', async ({ page }) => {
    await page.goto('/?page=main', { waitUntil: 'networkidle' });

    // Take screenshot
    await page.screenshot({
      path: 'test-results/screenshots/01-initial-english.png',
      fullPage: true
    });

    // Verify English text is present
    const title = await page.locator('h1').first().textContent();
    console.log('Page title:', title);

    expect(title).toContain('Quantum Vantage Consciousness Model');

    // Verify language indicator shows EN
    const langIndicator = await page.locator('span:has-text("EN")').count();
    console.log('EN indicator count:', langIndicator);
    expect(langIndicator).toBeGreaterThan(0);
  });

  test('should find and verify language toggle button exists', async ({ page }) => {
    await page.goto('/?page=main', { waitUntil: 'networkidle' });

    // Wait for page to be ready
    await page.waitForSelector('#main-header', { timeout: 10000 });

    // Take screenshot of header
    await page.locator('#main-header').screenshot({
      path: 'test-results/screenshots/02-header-with-buttons.png'
    });

    // Find translate icon
    const translateIcon = await page.locator('[data-testid="TranslateIcon"]').count();
    console.log('TranslateIcon found:', translateIcon);

    expect(translateIcon).toBeGreaterThan(0);

    // Find the button containing the translate icon
    const languageButton = page.locator('button:has([data-testid="TranslateIcon"])');
    const buttonCount = await languageButton.count();
    console.log('Language buttons found:', buttonCount);

    expect(buttonCount).toBe(1);

    // Check if button is visible and enabled
    await expect(languageButton).toBeVisible();
    await expect(languageButton).toBeEnabled();
  });

  test('should toggle language from EN to PT-BR', async ({ page }) => {
    await page.goto('/?page=main', { waitUntil: 'networkidle' });

    // Wait for initial render
    await page.waitForSelector('#main-header');

    // Capture initial state
    console.log('=== INITIAL STATE (EN) ===');
    const initialTitle = await page.locator('h1').first().textContent();
    console.log('Initial title:', initialTitle);

    const initialSubtitle = await page.locator('.header-content h2').textContent();
    console.log('Initial subtitle:', initialSubtitle);

    await page.screenshot({
      path: 'test-results/screenshots/03-before-toggle.png',
      fullPage: true
    });

    // Find and click language button
    const languageButton = page.locator('button:has([data-testid="TranslateIcon"])');

    console.log('=== CLICKING LANGUAGE TOGGLE ===');
    await languageButton.click();

    // Wait for state to update
    await page.waitForTimeout(1000);

    // Capture after toggle
    await page.screenshot({
      path: 'test-results/screenshots/04-after-toggle-pt.png',
      fullPage: true
    });

    console.log('=== AFTER TOGGLE (PT-BR) ===');
    const newTitle = await page.locator('h1').first().textContent();
    console.log('New title:', newTitle);

    const newSubtitle = await page.locator('.header-content h2').textContent();
    console.log('New subtitle:', newSubtitle);

    // Verify Portuguese text
    expect(newTitle).toContain('Modelo de Consciência Quantum Vantage');
    expect(newSubtitle).toContain('Dualidade');

    // Verify language indicator changed to BR
    const brIndicator = await page.locator('span:has-text("BR")').count();
    console.log('BR indicator count:', brIndicator);
    expect(brIndicator).toBeGreaterThan(0);

    // Verify localStorage was updated
    const storedLanguage = await page.evaluate(() => localStorage.getItem('qhch_language'));
    console.log('Stored language:', storedLanguage);
    expect(storedLanguage).toBe('pt-BR');
  });

  test('should toggle language back to English', async ({ page }) => {
    // Start with Portuguese
    await page.goto('/?page=main');
    await page.evaluate(() => localStorage.setItem('qhch_language', 'pt-BR'));
    await page.reload({ waitUntil: 'networkidle' });

    await page.waitForSelector('#main-header');

    // Verify we're in Portuguese
    const ptTitle = await page.locator('h1').first().textContent();
    console.log('Starting with PT title:', ptTitle);
    expect(ptTitle).toContain('Modelo de Consciência');

    await page.screenshot({
      path: 'test-results/screenshots/05-starting-portuguese.png',
      fullPage: true
    });

    // Toggle back to English
    const languageButton = page.locator('button:has([data-testid="TranslateIcon"])');
    await languageButton.click();
    await page.waitForTimeout(1000);

    await page.screenshot({
      path: 'test-results/screenshots/06-toggled-back-english.png',
      fullPage: true
    });

    const enTitle = await page.locator('h1').first().textContent();
    console.log('After toggle EN title:', enTitle);
    expect(enTitle).toContain('Quantum Vantage Consciousness Model');
  });

  test('should persist language preference across page reloads', async ({ page }) => {
    await page.goto('/?page=main', { waitUntil: 'networkidle' });
    await page.waitForSelector('#main-header');

    // Toggle to Portuguese
    const languageButton = page.locator('button:has([data-testid="TranslateIcon"])');
    await languageButton.click();
    await page.waitForTimeout(500);

    // Verify Portuguese
    let title = await page.locator('h1').first().textContent();
    expect(title).toContain('Modelo de Consciência');

    // Reload page
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForSelector('#main-header');

    await page.screenshot({
      path: 'test-results/screenshots/07-after-reload.png',
      fullPage: true
    });

    // Should still be in Portuguese
    title = await page.locator('h1').first().textContent();
    console.log('Title after reload:', title);
    expect(title).toContain('Modelo de Consciência');
  });

  test('should update all UI elements when toggling language', async ({ page }) => {
    await page.goto('/?page=main', { waitUntil: 'networkidle' });
    await page.waitForSelector('#main-header');

    // Check all English text elements
    console.log('=== CHECKING ALL ENGLISH ELEMENTS ===');

    const enTitle = await page.locator('h1').first().textContent();
    console.log('Title:', enTitle);

    const enGithubLink = await page.locator('a:has-text("GitHub")').first().textContent();
    console.log('GitHub link:', enGithubLink);

    const enFooter = await page.locator('footer p').textContent();
    console.log('Footer:', enFooter);

    expect(enGithubLink).toContain('Repository');
    expect(enFooter).toContain('All rights reserved');

    // Toggle to Portuguese
    const languageButton = page.locator('button:has([data-testid="TranslateIcon"])');
    await languageButton.click();
    await page.waitForTimeout(1000);

    console.log('=== CHECKING ALL PORTUGUESE ELEMENTS ===');

    const ptTitle = await page.locator('h1').first().textContent();
    console.log('Title:', ptTitle);

    const ptGithubLink = await page.locator('a:has-text("GitHub")').first().textContent();
    console.log('GitHub link:', ptGithubLink);

    const ptFooter = await page.locator('footer p').textContent();
    console.log('Footer:', ptFooter);

    expect(ptGithubLink).toContain('Repositório');
    expect(ptFooter).toContain('Todos os direitos reservados');

    await page.screenshot({
      path: 'test-results/screenshots/08-all-elements-portuguese.png',
      fullPage: true
    });
  });

  test('should verify console logs for debugging', async ({ page }) => {
    const consoleLogs = [];

    page.on('console', msg => {
      const text = msg.text();
      consoleLogs.push(text);
      console.log('Browser console:', text);
    });

    await page.goto('/?page=main', { waitUntil: 'networkidle' });
    await page.waitForSelector('#main-header');

    // Toggle language
    const languageButton = page.locator('button:has([data-testid="TranslateIcon"])');
    await languageButton.click();
    await page.waitForTimeout(1500);

    console.log('=== ALL CONSOLE LOGS ===');
    consoleLogs.forEach(log => console.log(log));

    // Check if expected console logs are present
    const hasToggleLog = consoleLogs.some(log => log.includes('[App] Toggling language'));
    const hasLanguageLog = consoleLogs.some(log => log.includes('[ContentPage] Language prop'));

    console.log('Has toggle log:', hasToggleLog);
    console.log('Has language log:', hasLanguageLog);
  });
});
