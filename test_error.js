import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('PAGE ERROR:', msg.text());
    }
  });

  page.on('pageerror', error => {
    console.log('PAGE EXCEPTION:', error.message);
    console.log('STACK:', error.stack);
  });

  await page.goto('http://localhost:5174/dashboard/director', { waitUntil: 'networkidle0' }).catch(e => console.log(e));
  
  // Wait a bit to ensure all scripts execute
  await new Promise(r => setTimeout(r, 2000));
  await browser.close();
})();
