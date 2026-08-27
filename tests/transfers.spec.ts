import { test, expect } from '@playwright/test';

test.describe('Transfers and Routing for Left Side Team (team_left)', () => {
  test('Team Left sends messages and penalty requests to Director and Central Monitoring', async ({ browser }) => {
    // Single context to share localStorage (mocking shared database in dev)
    const page = await browser.newPage();

    // ---------------------------------------------------------
    // 1. Team Left logs in
    // ---------------------------------------------------------
    await page.goto('http://localhost:5173/login');
    
    // Fill login credentials for the left side team
    await page.fill('input[type="text"]', 'team_left');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Wait for dashboard to load
    await expect(page.locator('text=اللجنة الرقابية لمركز المحافظة - الجانب الأيسر').first()).toBeVisible();

    // Wait for the login notification toast to disappear
    await page.waitForTimeout(4000);

    // ---------------------------------------------------------
    // 2. Team Left sends a chat message to Director
    // ---------------------------------------------------------
    const chatToggleButton = page.locator('button').filter({ has: page.locator('svg.lucide-message-circle') }).first();
    await chatToggleButton.click({ force: true });
    await page.waitForTimeout(1000);

    const chatMessage = `Urgent support needed from Team Left ${Date.now()}`;
    const chatInput = page.locator('input[placeholder="اكتب رسالتك لغرفة العمليات..."]');
    await chatInput.fill(chatMessage);
    await chatInput.press('Enter');

    await expect(page.locator(`text=${chatMessage}`)).toBeVisible();

    // ---------------------------------------------------------
    // 3. Team Left submits a Penalty Request (Transfer to Central Monitoring)
    // ---------------------------------------------------------
    // In Playwright, we need to handle window.prompt before clicking the button
    const penaltyReason = `Repeated severe violations ${Date.now()}`;
    page.once('dialog', dialog => dialog.accept(penaltyReason));

    // Find the first "طلب غرامة" (Fine Request) or "طلب إغلاق" (Closure Request) button in the establishments list
    // We'll use the closure request button (طلب إغلاق)
    // We'll use the closure request button (طلب إغلاق)

    
    // The establishments list might be in another tab. By default team is on "الرئيسية" (Dashboard)
    // Let's click the "إدارة المنشآت" tab first.
    await page.locator('button').filter({ hasText: 'إدارة المنشآت' }).first().click();
    await page.waitForTimeout(1000);

    const closureButton = page.locator('button').filter({ hasText: 'طلب إغلاق' }).first();
    await closureButton.click();

    // Verify success toast
    await expect(page.locator('text=تم رفع طلب الإغلاق بنجاح')).toBeVisible();

    // Log out Team Left
    await page.locator('button').filter({ hasText: 'تسجيل الخروج' }).first().click();
    await page.waitForTimeout(1000);

    // ---------------------------------------------------------
    // 4. Director (emad_dg) logs in to check the chat message
    // ---------------------------------------------------------
    await page.goto('http://localhost:5173/login');
    await page.fill('input[type="text"]', 'emad_dg');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');

    await expect(page.locator('text=د. عماد محمد عبد الله').first()).toBeVisible();

    // Go to Directives/Messages tab
    await page.click('text=التبليغات والتوجيهات');

    // Wait for the Team Left's message to appear in the inbox
    await expect(page.locator(`text=${chatMessage}`).first()).toBeVisible();

    // Log out Director
    await page.locator('button').filter({ hasText: 'تسجيل الخروج' }).first().click();
    await page.waitForTimeout(1000);

    // ---------------------------------------------------------
    // 5. Central Monitoring (central_dir) logs in to check penalty requests
    // ---------------------------------------------------------
    await page.goto('http://localhost:5173/login');
    await page.fill('input[type="text"]', 'central_dir');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');

    await expect(page.locator('text=دكتورة ابتهال غازي').first()).toBeVisible();

    // Go to Operations Room (غرفة العمليات المركزية) where penalties are reviewed
    const opsRoomTab = page.locator('button').filter({ hasText: 'غرفة العمليات المركزية' });
    if (await opsRoomTab.isVisible()) {
      await opsRoomTab.click();
    }
    
    // The penalty request with our specific reason should be visible
    await expect(page.locator(`text=${penaltyReason}`).first()).toBeVisible();

    // We can even approve it!
    const penaltyCard = page.locator('.glassmorphic-card').filter({ hasText: penaltyReason }).first();
    const approveBtn = penaltyCard.locator('button').filter({ hasText: 'إصدار الموافقة' });
    if (await approveBtn.isVisible()) {
      await approveBtn.click();
      await expect(page.locator('text=تم المصادقة على طلب الإغلاق')).toBeVisible();
    }

  });
});
