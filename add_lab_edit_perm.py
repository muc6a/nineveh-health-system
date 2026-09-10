import re

with open("src/utils/constants.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# Add editLabResults to DEFAULT_PERMISSIONS in SuperAdminPanel (or where it lives)
# Wait, let's just append it to PERMISSION_DETAILS if missing, and PERMISSION_ROLES
perm_details_pattern = r'labArchive:\s*\{\s*title:\s*\'أرشيف المختبر\',\s*desc:\s*\'الوصول لأرشيف العينات المنجزة السابقة\'\s*\},'
if perm_details_pattern and "editLabResults:" not in content:
    content = re.sub(perm_details_pattern, r"labArchive: { title: 'أرشيف المختبر', desc: 'الوصول لأرشيف العينات المنجزة السابقة' },\n  editLabResults: { title: 'تعديل نتائج المختبر المنجزة', desc: 'إمكانية تعديل حالة النتيجة وإضافة سجل تعديل لضمان الشفافية' },", content)
    
perm_roles_pattern = r'labArchive:\s*\'lab\','
if "editLabResults: 'lab'" not in content:
    content = re.sub(perm_roles_pattern, r"labArchive: 'lab',\n  editLabResults: 'lab',", content)

with open("src/utils/constants.jsx", "w", encoding="utf-8") as f:
    f.write(content)

