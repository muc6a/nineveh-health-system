import re

with open("src/pages/SuperAdminPanel.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# Replace allAccountsForPermissions
new_roles = """  const allAccountsForPermissions = [
    { label: 'الأدوار الوظيفية (Roles)', options: [
      { value: 'director', label: 'صلاحيات الإدارة العامة (المدير العام)', obj: { id: 'director', role: 'director', name: 'المدير العام', permissions: {} } },
      { value: 'central_director', label: 'صلاحيات الرقابة المركزية', obj: { id: 'central_director', role: 'central_director', name: 'مدير الرقابة المركزية', permissions: {} } },
      { value: 'team', label: 'صلاحيات الفرق الميدانية', obj: { id: 'team', role: 'team', name: 'الفريق الميداني', permissions: {} } },
      { value: 'lab', label: 'صلاحيات المختبرات', obj: { id: 'lab', role: 'lab', name: 'المختبر المركزي', permissions: {} } },
      { value: 'accountant', label: 'صلاحيات الحسابات والمالية', obj: { id: 'accountant', role: 'accountant', name: 'القسم المالي', permissions: {} } }
    ]}
  ];"""

content = re.sub(r"const allAccountsForPermissions = \[\s*\{ label: 'الفرق الميدانية'[^\]]+\]\s*\];", new_roles, content)

# Fix handlePermissionsAccountSelect to load permissions from localStorage ROLE_PERMISSIONS
# Wait, handlePermissionsAccountSelect sets the selected account and its permissions.
# We need to make it load from ROLE_PERMISSIONS saved state or default.
with open("src/pages/SuperAdminPanel.jsx", "w", encoding="utf-8") as f:
    f.write(content)
