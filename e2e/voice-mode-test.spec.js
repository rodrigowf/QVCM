const { test, expect } = require('@playwright/test');

test.describe('Voice Mode Availability Test', () => {

  test('should check voice mode availability on modern browser', async ({ page }) => {
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

    console.log('=== Navigating to chat page ===');
    await page.goto('/?page=chat', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    console.log('=== Page loaded ===');

    // Wait for React to render
    await page.waitForTimeout(2000);

    // Check if voice mode is supported
    const voiceModeSupported = await page.evaluate(() => {
      // Replicate the isVoiceModeSupported check
      const hasRTCPeerConnection = !!(window.RTCPeerConnection || window.webkitRTCPeerConnection);
      const hasGetUserMedia = !!(navigator.mediaDevices?.getUserMedia ||
                                  navigator.getUserMedia ||
                                  navigator.webkitGetUserMedia ||
                                  navigator.mozGetUserMedia);
      const hasAudioContext = !!(window.AudioContext || window.webkitAudioContext);

      console.log('Browser capabilities:', {
        hasRTCPeerConnection,
        hasGetUserMedia,
        hasAudioContext
      });

      return hasRTCPeerConnection && hasGetUserMedia && hasAudioContext;
    });

    console.log('\n=== Voice Mode Support ===');
    console.log('Voice mode supported:', voiceModeSupported);

    // Try to find voice mode toggle button
    const voiceModeButton = await page.locator('[aria-label*="voice" i], [title*="voice" i], button:has-text("Voice")').first();
    const buttonExists = await voiceModeButton.count() > 0;

    console.log('Voice mode button found:', buttonExists);

    if (buttonExists) {
      const buttonText = await voiceModeButton.textContent().catch(() => 'N/A');
      const isDisabled = await voiceModeButton.isDisabled().catch(() => false);
      console.log('Button text:', buttonText);
      console.log('Button disabled:', isDisabled);
    }

    // Take screenshot
    await page.screenshot({
      path: 'test-results/screenshots/voice-mode-test.png',
      fullPage: true
    });

    console.log('\n=== Summary ===');
    console.log('Page errors:', pageErrors.length);
    console.log('Console errors:', consoleMessages.filter(m => m.type === 'error').length);

    if (pageErrors.length > 0) {
      console.log('\n=== All Page Errors ===');
      pageErrors.forEach((err, i) => {
        console.log(`${i + 1}. ${err}`);
      });
    }

    const errorMessages = consoleMessages.filter(m => m.type === 'error');
    if (errorMessages.length > 0) {
      console.log('\n=== Console Errors ===');
      errorMessages.forEach((msg, i) => {
        console.log(`${i + 1}. ${msg.text}`);
      });
    }

    // Check for specific error about voice chat not being available
    const hasVoiceChatError = consoleMessages.some(m =>
      m.text.includes('Voice chat is not available')
    );

    console.log('\n=== Voice Chat Error Check ===');
    console.log('Has "Voice chat is not available" error:', hasVoiceChatError);

    // Test should fail if we get the error on a modern browser
    if (voiceModeSupported && hasVoiceChatError) {
      throw new Error('Voice chat shows as unavailable on a browser that supports it!');
    }
  });
});
