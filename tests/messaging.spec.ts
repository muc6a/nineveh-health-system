import { test, expect } from '@playwright/test';

test.describe('Messaging Flow between Team and Director', () => {
  test('Team sends a message and Director receives and replies', async ({ browser }) => {
    // We will use two separate browser contexts to simulate two users
    const page = await browser.newPage();

    // ---------------------------------------------------------
    // 1. Team logs in and sends a message
    // ---------------------------------------------------------
    await page.goto('http://localhost:5173/login');
    
    // Fill login credentials for the right side team
    await page.fill('input[type="text"]', 'team_right');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Wait for dashboard to load
    await expect(page.locator('text=اللجنة الرقابية لمركز المحافظة - الجانب الأيمن').first()).toBeVisible();

    // Wait for the login notification toast to disappear
    await page.waitForTimeout(4000);

    // Open chat widget
    const chatToggleButton = page.locator('button').filter({ has: page.locator('svg.lucide-message-circle') }).first();
    await chatToggleButton.click({ force: true });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'chat_debug.png' });

    // Type and send a message
    const uniqueMessage = `Test Message from Team ${Date.now()}`;
    const chatInput = page.locator('input[placeholder="اكتب رسالتك لغرفة العمليات..."]');
    await chatInput.fill(uniqueMessage);
    await chatInput.press('Enter');

    // Verify it appears in local chat history
    await expect(page.locator(`text=${uniqueMessage}`)).toBeVisible();

    // Log out team
    await page.locator('button').filter({ hasText: 'تسجيل الخروج' }).first().click();
    await page.waitForTimeout(1000); // Wait for logout

    // ---------------------------------------------------------
    // 2. Director logs in, checks messages, and replies
    // ---------------------------------------------------------
    await page.goto('http://localhost:5173/login');
    
    // Fill login credentials for director
    await page.fill('input[type="text"]', 'emad_dg');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Wait for dashboard to load
    await expect(page.locator('text=د. عماد محمد عبد الله').first()).toBeVisible();

    // Go to Directives/Messages tab
    await page.click('text=التبليغات والتوجيهات');

    // Wait for the team's message to appear in the inbox
    await expect(page.locator(`text=${uniqueMessage}`).first()).toBeVisible();

    // Click reply
    const card = page.locator('.glassmorphic-card').filter({ hasText: uniqueMessage });
    await card.locator('text=رد / تأكيد استلام').click();

    // Type reply
    const replyText = `Reply from Director ${Date.now()}`;
    const replyInput = card.locator('input[placeholder="اكتب ردك هنا..."]');
    await replyInput.fill(replyText);
    
    // Click send reply (the button with Send icon next to input)
    // We can just press Enter or click the send button
    const sendReplyBtn = card.locator('button.bg-amber-500.hover\\:bg-amber-600').first();
    await sendReplyBtn.click();

    // Verify success toast
    await expect(page.locator('text=تم إرسال الرد بنجاح')).toBeVisible();

    // Log out director
    await page.locator('button').filter({ hasText: 'تسجيل الخروج' }).first().click();
    await page.waitForTimeout(1000);

    // ---------------------------------------------------------
    // 3. Team checks their inbox for the reply
    // ---------------------------------------------------------
    await page.goto('http://localhost:5173/login');
    await page.fill('input[type="text"]', 'team_right');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');

    await expect(page.locator('text=اللجنة الرقابية لمركز المحافظة - الجانب الأيمن').first()).toBeVisible();
    await page.waitForTimeout(4000);
    
    // Since the team dashboard has an Unread Directive Alert Modal, the reply will popup!
    await expect(page.locator(`text=رد على تبليغ: ${replyText}`).first()).toBeVisible();

    // Click "أخذت علماً وسأقوم بالتنفيذ" to dismiss it
    await page.locator('button').filter({ hasText: 'أخذت علماً وسأقوم بالتنفيذ' }).first().click();


    // End of test
  });
});
