const { test, expect } = require('@playwright/test');

test.describe('Verify Portuguese Content Loads', () => {

  test('should load actual Portuguese content, not English fallback', async ({ page }) => {
    // Set language to Portuguese in localStorage before loading
    await page.goto('/?page=main');
    await page.evaluate(() => {
      localStorage.setItem('qhch_language', 'pt-BR');
    });

    // Reload to pick up the language setting
    await page.reload({ waitUntil: 'networkidle', timeout: 30000 });

    // Wait for content to load
    await page.waitForTimeout(3000);

    // Take screenshot
    await page.screenshot({
      path: 'test-results/screenshots/portuguese-content-check.png',
      fullPage: true
    });

    // Get the page text
    const bodyText = await page.evaluate(() => document.body.innerText);

    console.log('=== Checking for Portuguese Content ===');
    console.log('Body text length:', bodyText.length);
    console.log('First 500 chars:', bodyText.substring(0, 500));

    // Check for Portuguese-specific text that should appear
    const hasPortugueseTitle = bodyText.includes('Modelo de Consciência Quantum Vantage') ||
                                bodyText.includes('Dualidade Percepção');

    const hasPortugueseContent = bodyText.includes('Resumo') ||
                                  bodyText.includes('momento consciente') ||
                                  bodyText.includes('substrato biológico');

    const hasEnglishFallbackNote = bodyText.includes('Tradução completa para o português em andamento') ||
                                   bodyText.includes('O conteúdo abaixo replica o texto original em inglês');

    console.log('Has Portuguese title:', hasPortugueseTitle);
    console.log('Has Portuguese content:', hasPortugueseContent);
    console.log('Has English fallback note:', hasEnglishFallbackNote);

    // Search for specific Portuguese phrases
    if (bodyText.includes('Modelo de Consciência')) {
      console.log('✅ Found "Modelo de Consciência"');
    }
    if (bodyText.includes('Dualidade Percepção–Decisão')) {
      console.log('✅ Found "Dualidade Percepção–Decisão"');
    }
    if (bodyText.includes('Resumo')) {
      console.log('✅ Found "Resumo" (Portuguese for Abstract)');
    }

    // The content should have Portuguese text
    expect(hasPortugueseTitle || hasPortugueseContent).toBe(true);

    // Should NOT have the English fallback note
    expect(hasEnglishFallbackNote).toBe(false);
  });

  test('should verify markdown file path is correct', async ({ page }) => {
    const consoleLogs = [];

    page.on('console', msg => {
      consoleLogs.push(msg.text());
    });

    // Intercept network requests
    const requests = [];
    page.on('request', request => {
      const url = request.url();
      if (url.includes('.md')) {
        requests.push(url);
        console.log('Markdown request:', url);
      }
    });

    await page.goto('/?page=main');
    await page.evaluate(() => {
      localStorage.setItem('qhch_language', 'pt-BR');
    });
    await page.reload({ waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);

    console.log('\n=== Markdown Files Requested ===');
    requests.forEach(req => console.log(req));

    // Should request QVCM-pt.md, not QVCM.pt-BR.md
    const requestedCorrectFile = requests.some(url => url.includes('QVCM-pt.md'));
    const requestedWrongFile = requests.some(url => url.includes('QVCM.pt-BR.md'));

    console.log('\nRequested QVCM-pt.md:', requestedCorrectFile);
    console.log('Requested QVCM.pt-BR.md (wrong):', requestedWrongFile);

    expect(requestedCorrectFile).toBe(true);
    expect(requestedWrongFile).toBe(false);
  });
});
