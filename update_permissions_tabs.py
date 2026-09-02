import re

with open('src/utils/constants.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# I will just write a python script to replace the labels in PERMISSIONS_TABS
# 1. غرفة العمليات المركزية (stays same)
# 2. إدارة المنشآت -> المنشآت
# 3. الشكاوى (stays same)
# 4. قرارات المختبر -> المختبر
# 5. المالية (stays same)
# 6. التبليغات (stays same)
# 7. العقوبات والإغلاقات -> العقوبات
# 8. الإشعارات (stays same)
# 9. إدارة متقدمة -> الإدارة المتقدمة

content = content.replace("label: 'إدارة المنشآت',", "label: 'المنشآت',")
content = content.replace("label: 'قرارات المختبر',", "label: 'المختبر',")
content = content.replace("label: 'العقوبات والإغلاقات',", "label: 'العقوبات',")
content = content.replace("label: 'إدارة متقدمة',", "label: 'الإدارة المتقدمة',")

with open('src/utils/constants.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

