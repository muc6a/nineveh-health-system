import re

with open('src/utils/constants.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove backupData from constants.jsx
content = content.replace("  backupData: false\n", "")
content = content.replace("  backupData: false,\n", "")
content = content.replace(", 'backupData'", "")
content = content.replace("  backupData: { title: 'النسخ الاحتياطي', desc: 'يسمح للحساب بأخذ نسخة احتياطية من كامل قاعدة بيانات المنظومة وتنزيلها.' },\n", "")
content = content.replace("  backupData: 'management',\n", "")

with open('src/utils/constants.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

with open('src/pages/SuperAdminPanel.jsx', 'r', encoding='utf-8') as f:
    content2 = f.read()

content2 = content2.replace("    backupData: false,\n", "")
content2 = content2.replace("    backupData: false\n", "")

# Remove any UI block related to backup in SuperAdminPanel
# Usually it looks like:
# {hasPerm('backupData') && (
# ...
# )}
# Or just a button. We will find out.
with open('src/pages/SuperAdminPanel.jsx', 'w', encoding='utf-8') as f:
    f.write(content2)

print("Removed backupData permission")
