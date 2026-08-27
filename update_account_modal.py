import sys
import re

with open('src/components/AccountModal.jsx', 'r') as f:
    content = f.read()

# Add accountant to condition checks
content = content.replace("accountType === 'tracker'", "(accountType === 'tracker' || accountType === 'accountant')")
content = content.replace("? 'إضافة حساب متابع ميداني'", "? (accountType === 'accountant' ? 'إضافة حساب محاسب مالي' : 'إضافة حساب متابع ميداني')")
content = content.replace("? 'بيانات المتابع الميداني'", "? (accountType === 'accountant' ? 'بيانات المحاسب المالي' : 'بيانات المتابع الميداني')")
content = content.replace("المتابع الميداني: الاسم الكامل", "الاسم الكامل")
content = content.replace("? 'صلاحيات المتابعة (اختياري)'", "? (accountType === 'accountant' ? 'صلاحيات المحاسب (اختياري)' : 'صلاحيات المتابعة (اختياري)')")
content = content.replace("المتابع حصراً", "الحساب حصراً")

with open('src/components/AccountModal.jsx', 'w') as f:
    f.write(content)
print("Updated AccountModal.jsx for accountant type")
