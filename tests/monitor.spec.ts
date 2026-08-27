import { test, expect } from '@playwright/test';

test.describe('Tracker (Secret Monitor) E2E Test', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage and state to ensure clean run
    await page.addInitScript(() => {
      window.localStorage.clear();
    });
  });

  test('Tracker goes through all tabs and actions', async ({ page, context }) => {
    // Grant location and camera permissions for the test
    await context.grantPermissions(['geolocation', 'camera'], { origin: 'http://localhost:5173' });

    // 1. Login as Tracker
    await page.goto('http://localhost:5173/login');
    
    await page.fill('input[type="text"]', 'tracker_left');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button:has-text("تسجيل الدخول الآمن للمنظومة")');

    // Wait for successful login and URL change
    await expect(page).toHaveURL(/.*dashboard\/tracker/);
    await page.waitForTimeout(2000); // wait for page load

    // Check we are on the tracker dashboard
    await expect(page.locator('h1').filter({ hasText: 'المتابع الميداني' })).toBeVisible();

    // 2. Tab: مهام موجهة (daily_tasks)
    await page.locator('button').filter({ hasText: 'مهام موجهة' }).click();
    await page.waitForTimeout(500);
    // There is a default task assigned to tracker_1
    await expect(page.locator('h2').filter({ hasText: 'مهام موجهة عاجلة' })).toBeVisible();
    
    // Complete the task
    await page.locator('button').filter({ hasText: 'إنهاء بدون توثيق' }).first().click();
    await page.waitForTimeout(500);

    // 3. Tab: رصد جديد (add_new)
    await page.locator('button').filter({ hasText: 'رصد جديد' }).click();
    await page.waitForTimeout(500);
    
    // Search for a new establishment
    await page.fill('input[placeholder="اكتب اسم المحل للبحث..."]', 'مطعم الفحص الآلي الجديد');
    await page.waitForTimeout(1000);
    
    // Click "هذا المحل جديد، أريد إضافته"
    await page.locator('button').filter({ hasText: 'هذا المحل جديد، أريد إضافته' }).click();
    await page.waitForTimeout(500);
    
    // Select Type
    await page.selectOption('select', 'مطعم');
    
    // Fill Manual Address
    await page.fill('input[placeholder="مثال: مقابل جامع التوبة..."]', 'حي المهندسين - الشارع العام');
    
    // Click capture photo button
    await page.locator('button').filter({ hasText: 'التقاط صورة للواجهة وإرسال للعمليات' }).click();
    await page.waitForTimeout(1000);
    
    // In camera modal, wait a bit for camera stream to "load" and capture photo
    await page.locator('button.bg-white.rounded-full.border-\\[5px\\]').click();
    await page.waitForTimeout(1000);
    
    // Submit the new establishment
    await page.locator('button').filter({ hasText: 'حفظ وإضافة للمنظومة' }).click();
    
    // Wait for success toast
    await expect(page.locator('text=تم رصد المنشأة وإضافتها للنظام!')).toBeVisible();
    await page.waitForTimeout(2000);

    // 4. Tab: تحديث مواقع (update_location)
    await page.locator('button').filter({ hasText: 'تحديث مواقع' }).click();
    await page.waitForTimeout(500);

    // If there are establishments needing location, update the first one
    const updateLocButton = page.locator('button').filter({ hasText: 'تحديث موقعه' }).first();
    if (await updateLocButton.isVisible()) {
      await updateLocButton.click();
      await page.waitForTimeout(500);
      
      // Pull current GPS
      await page.locator('button').filter({ hasText: 'سحب موقعي الحالي' }).click();
      await page.waitForTimeout(1000);
      
      // Fill manual address
      await page.fill('input[placeholder="اكتب أقرب نقطة دالة للمطعم..."]', 'الجانب الأيسر - قرب الجسر');
      
      // Save data
      await page.locator('button').filter({ hasText: 'حفظ البيانات' }).click();
      
      // Wait for success toast
      await expect(page.locator('text=تم تحديث بيانات الموقع بنجاح!')).toBeVisible();
      await page.waitForTimeout(2000);
    }

    // 5. Tab: التحقق للإغلاقات (verifications)
    // Note: We might not have closed establishments by default unless we set one up,
    // but we can at least click the tab and verify it loads.
    await page.locator('button').filter({ hasText: 'التحقق للإغلاقات' }).click();
    await page.waitForTimeout(500);
    await expect(page.locator('h2').filter({ hasText: 'مطاعم مغلقة بانتظار التأكد من الالتزام' })).toBeVisible();

    // 6. Log out
    await page.locator('button').filter({ hasText: 'تسجيل خروج' }).first().click();
    await expect(page).toHaveURL(/.*login/);
  });
});
