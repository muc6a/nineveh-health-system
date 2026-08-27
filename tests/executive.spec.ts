import { test, expect } from '@playwright/test';

test.describe('Director General Flow', () => {
  test('should login as Director General and view the executive portal', async ({ page }) => {
    // Navigate to the login page
    await page.goto('http://localhost:5173/');
    
    // Click the Administration button on the landing page to go to login
    await page.click('button:has-text("الإدارة")');

    // Wait for the login form to be visible
    await page.waitForSelector('form');

    // Fill in the login credentials for the Director General (د. عماد محمد عبد الله)
    await page.fill('input[type="text"]', 'emad_dg');
    
    // Playwright cannot easily select the password field if it just has type="password". 
    // We will use standard selectors for the second input in the form.
    await page.fill('input[type="password"]', 'password123');

    // Click the login button
    await page.click('button[type="submit"]');

    // Verify redirection to the executive portal (the dashboard)
    // The sidebar has a distinct element displaying the user's name
    await expect(page.locator('text=د. عماد محمد عبد الله')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=مدير عام صحة نينوى')).toBeVisible();

    // Verify the presence of the 4 KPI cards on the Strategic Dashboard
    await expect(page.locator('text=إجمالي المنشآت الخاضعة للرقابة الصحية')).toBeVisible();
    await expect(page.locator('text=نسبة تغطية الرقابة الصحية المنجزة')).toBeVisible();
    await expect(page.locator('text=إجمالي المخالفات الحرجة غير الملتزمة')).toBeVisible();
    await expect(page.locator('text=إجمالي المطاعم والمنشآت المغلقة للآن')).toBeVisible();

    // Verify the presence of the navigation sidebar items
    const navItems = [
      'اللوحة الرئيسية (الاستراتيجية)',
      'الخريطة الجغرافية',
      'التبليغات والتوجيهات',
      'التقييمات العامة (الشكاوى)'
    ];

    for (const item of navItems) {
      await expect(page.locator(`text=${item}`).first()).toBeVisible();
    }

    // Navigate to 'التبليغات والتوجيهات' (Directives)
    await page.click('text=التبليغات والتوجيهات >> nth=0');
    // For director role without sendDirective permission, we only check if the directives list/page is visible
    await expect(page.locator('text=التبليغات والتوجيهات').first()).toBeVisible();
  });
});
