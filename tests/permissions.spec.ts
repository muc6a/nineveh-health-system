import { test, expect } from '@playwright/test';

test('SuperAdmin permissions save bug', async ({ page }) => {
  // Login as SuperAdmin
  await page.goto('http://localhost:5173/');
  await page.waitForLoadState('networkidle');
  await page.click('button:has-text("⚙️ مدير الموقع (Super Admin)")');
  await page.waitForTimeout(1000);
  await page.click('button:has-text("تسجيل الدخول الآمن للمنظومة")');
  
  // Go to Account Management
  await page.click('button:has-text("إدارة الحسابات")');
  await page.waitForTimeout(1000);
  
  // Open permissions modal for Dr. Ibtihal
  const ibtihalRow = page.locator('tr').filter({ hasText: 'دكتورة ابتهال غازي' });
  await ibtihalRow.locator('button:has-text("الأذونات")').click();
  await page.waitForTimeout(1000);
  
  // Turn off manageEstablishments permission (click on it)
  await page.click('div:has-text("إدارة المنشآت (المفتاح الرئيسي)") >> nth=-1');
  await page.waitForTimeout(500);
  
  // Click save
  await page.click('button:has-text("حفظ واعتماد صلاحيات الحساب")');
  await page.waitForTimeout(1000);
  
  // Logout
  await page.click('button:has-text("تسجيل الخروج")');
  await page.waitForTimeout(1000);
  
  // Refresh page just in case (to simulate real user reloading or navigating)
  await page.reload();
  await page.waitForLoadState('networkidle');
  
  // Login again as SuperAdmin
  await page.click('button:has-text("⚙️ مدير الموقع (Super Admin)")');
  await page.waitForTimeout(1000);
  await page.click('button:has-text("تسجيل الدخول الآمن للمنظومة")');
  
  // Go to Account Management
  await page.click('button:has-text("إدارة الحسابات")');
  await page.waitForTimeout(1000);
  
  // Open permissions modal for Dr. Ibtihal
  const ibtihalRow2 = page.locator('tr').filter({ hasText: 'دكتورة ابتهال غازي' });
  await ibtihalRow2.locator('button:has-text("الأذونات")').click();
  await page.waitForTimeout(1000);
  
  // Take screenshot of the modal to verify if the permission is on or off
  await page.screenshot({ path: 'permissions_test_result.png' });
  
});
