import re

path = "src/components/UnifiedSidebar.jsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Add a dictionary to translate roles
translation_dict = """
  const getRoleNameInArabic = (role) => {
    const roles = {
      'admin': 'مدير النظام',
      'executive': 'مدير قسم الرقابة',
      'team_leader': 'مدير فريق ميداني',
      'accountant': 'محاسب الوحدة',
      'lab': 'مدير المختبر',
    };
    return roles[role] || role;
  };
"""

# Insert translation dict before it's used
if "getRoleNameInArabic" not in content:
    content = content.replace("const handleLogout = () => {", translation_dict + "\n  const handleLogout = () => {")
    
# Replace {user?.title || user?.role} with {user?.title || getRoleNameInArabic(user?.role)}
content = content.replace("{user?.title || user?.role}", "{user?.title || getRoleNameInArabic(user?.role)}")

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
