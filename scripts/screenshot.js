import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  console.log('Opening http://localhost:3001...');
  await page.goto('http://localhost:3001');
  await page.waitForLoadState('networkidle');

  const title = await page.title();
  console.log('Page title:', title);

  // Screenshot
  await page.screenshot({ path: 'screenshot-login.png', fullPage: true });
  console.log('Screenshot saved: screenshot-login.png');

  await browser.close();
})();
