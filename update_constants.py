import sys

with open('src/utils/constants.js', 'r') as f:
    content = f.read()

if 'financial_accountant' not in content:
    old_roles = "  { id: 'food_quality_controller', label: 'مراقب جودة الأغذية', category: 'الكوادر الفنية' },"
    new_roles = "  { id: 'food_quality_controller', label: 'مراقب جودة الأغذية', category: 'الكوادر الفنية' },\n  { id: 'financial_accountant', label: 'محاسب مالي / مسؤول صندوق', category: 'الكوادر الفنية' },"
    content = content.replace(old_roles, new_roles)

    with open('src/utils/constants.js', 'w') as f:
        f.write(content)
    print("Added financial_accountant to constants.js")
else:
    print("financial_accountant already in constants.js")

