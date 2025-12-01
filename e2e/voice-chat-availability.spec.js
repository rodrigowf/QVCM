const { test, expect } = require('@playwright/test');

test.describe('Voice Chat Availability', () => {

  test('should allow voice chat on modern browsers', async ({ page, browser }) => {
    const consoleMessages = [];
    const pageErrors = [];

    // Listen to console messages
    page.on('console', msg => {
      const type = msg.type();
      const text = msg.text();
      consoleMessages.push({ type, text });
      console.log(`[${type.toUpperCase()}]:`, text);
    });

    // Listen to page errors
    page.on('pageerror', error => {
      pageErrors.push(error.message);
      console.error('[PAGE ERROR]:', error.message);
    });

    console.log('\n=== Starting Voice Chat Availability Test ===\n');

    // Navigate to chat page
    await page.goto('/?page=chat', {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });

    console.log('✓ Page loaded');

    // Wait for React to render
    await page.waitForTimeout(2000);

    // Check browser capabilities (same as our app does)
    const browserCapabilities = await page.evaluate(() => {
      const hasRTCPeerConnection = !!(window.RTCPeerConnection || window.webkitRTCPeerConnection);
      const hasGetUserMedia = !!(navigator.mediaDevices?.getUserMedia ||
                                  navigator.getUserMedia ||
                                  navigator.webkitGetUserMedia ||
                                  navigator.mozGetUserMedia);
      const hasAudioContext = !!(window.AudioContext || window.webkitAudioContext);

      return {
        hasRTCPeerConnection,
        hasGetUserMedia,
        hasAudioContext,
        isSupported: hasRTCPeerConnection && hasGetUserMedia && hasAudioContext
      };
    });

    console.log('\n=== Browser Capabilities ===');
    console.log('RTCPeerConnection:', browserCapabilities.hasRTCPeerConnection);
    console.log('getUserMedia:', browserCapabilities.hasGetUserMedia);
    console.log('AudioContext:', browserCapabilities.hasAudioContext);
    console.log('Voice Mode Supported:', browserCapabilities.isSupported);

    // Check for error messages in console
    const errorMessages = consoleMessages.filter(m => m.type === 'error');
    const voiceChatNotAvailableError = errorMessages.find(m =>
      m.text.includes('Voice chat is not available')
    );

    console.log('\n=== Console Check ===');
    console.log('Total console errors:', errorMessages.length);
    console.log('Has "Voice chat not available" error:', !!voiceChatNotAvailableError);

    if (voiceChatNotAvailableError) {
      console.error('\n❌ ERROR: Found "Voice chat not available" message:');
      console.error(voiceChatNotAvailableError.text);
    }

    // Take screenshot
    await page.screenshot({
      path: 'test-results/screenshots/voice-chat-availability.png',
      fullPage: true
    });

    console.log('\n=== Test Result ===');

    // Chromium/modern browsers should support voice chat
    if (browserCapabilities.isSupported) {
      console.log('✓ Browser supports voice chat');

      // Should NOT have the error message
      if (voiceChatNotAvailableError) {
        console.error('❌ FAIL: Voice chat shows as unavailable on supported browser');
        throw new Error('Voice chat incorrectly reported as unavailable on a browser that supports it');
      } else {
        console.log('✓ PASS: Voice chat is available on supported browser');
      }
    } else {
      console.log('⚠ Browser does not support voice chat (expected on old browsers)');

      // Should have graceful error handling
      if (voiceChatNotAvailableError) {
        console.log('✓ PASS: Properly shows error message on unsupported browser');
      }
    }

    // Check for any page errors
    if (pageErrors.length > 0) {
      console.error('\n❌ Page Errors Found:');
      pageErrors.forEach((err, i) => {
        console.error(`${i + 1}. ${err}`);
      });
      throw new Error(`Page had ${pageErrors.length} error(s)`);
    }

    console.log('\n✓ Test completed successfully\n');
  });
});
