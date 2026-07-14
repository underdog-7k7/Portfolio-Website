import puppeteer from 'puppeteer-core';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--use-gl=angle', '--enable-unsafe-swiftshader', '--window-size=1400,1000'],
  });
  const context = browser.defaultBrowserContext();
  await context.overridePermissions('http://localhost:5174', ['clipboard-read', 'clipboard-write']);
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 1000 });
  const errors = [];
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  page.on('console', (msg) => { if (msg.type() === 'error') errors.push('console: ' + msg.text()); });

  await page.goto('http://localhost:5174/Portfolio-Website/', { waitUntil: 'networkidle2' });
  await page.evaluate(() => document.querySelector('#contact')?.scrollIntoView());
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: 'copy-1-before.png' });

  await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button')].find((b) => b.textContent.includes('@'));
    btn?.click();
  });
  await new Promise((r) => setTimeout(r, 200));
  await page.screenshot({ path: 'copy-2-after-click.png' });

  const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
  const label = await page.evaluate(() => document.querySelector('.copy-affordance')?.textContent);

  await new Promise((r) => setTimeout(r, 2000));
  const labelAfterTimeout = await page.evaluate(() => document.querySelector('.copy-affordance')?.textContent);

  console.log('clipboard contains:', clipboardText);
  console.log('label right after click:', label);
  console.log('label after 2s (should revert to Copy):', labelAfterTimeout);
  console.log('ERRORS:', JSON.stringify(errors, null, 2));

  await browser.close();
})();
