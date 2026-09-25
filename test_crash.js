import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const logs = [];
  page.on('console', msg => {
    if (msg.type() === 'error') logs.push(msg.text());
  });
  page.on('pageerror', err => logs.push(err.message));
  
  await page.goto('http://localhost:5173', { waitUntil: 'domcontentloaded' });
  // Login
  await page.fill('input[type="text"]', 'central_dir');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button:has-text("تسجيل الدخول")');
  
  await page.waitForTimeout(2000);
  
  // Click Operations Room
  const opsBtn = await page.$('button:has-text("غرفة العمليات المركزية")');
  if (opsBtn) {
    await opsBtn.click();
    await page.waitForTimeout(2000);
  } else {
    logs.push("Button not found");
  }
  
  console.log("ERRORS:", logs);
  await browser.close();
})();
