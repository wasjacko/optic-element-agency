import puppeteer from 'puppeteer';
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('BROWSER_LOG:', msg.text()));
  page.on('pageerror', e => console.log('P_ERR:', e.message));
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await browser.close();
})();
