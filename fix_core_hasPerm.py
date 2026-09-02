import re

with open('src/pages/TeamDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

has_perm_pattern = r"  const hasPerm = \(permName\) => {\n    if \(user\?\.role === 'admin'\) return true;\n    return user\?\.permissions\?\.\[permName\] === true;\n  };"
has_perm_replacement = """  const hasPerm = (permName) => {
    if (user?.role === 'admin') return true;
    if (ROLE_CORE_BASICS[user?.role]?.includes(permName)) return true;
    return user?.permissions?.[permName] === true;
  };"""

if "ROLE_CORE_BASICS[user?.role]" not in content:
    content = re.sub(has_perm_pattern, has_perm_replacement, content)
    if "import { ROLE_CORE_BASICS" not in content:
        content = content.replace("import { PERMISSIONS_TABS", "import { PERMISSIONS_TABS, ROLE_CORE_BASICS")
    with open('src/pages/TeamDashboard.jsx', 'w', encoding='utf-8') as f:
        f.write(content)

with open('src/pages/ExecutivePortal.jsx', 'r', encoding='utf-8') as f:
    exec_content = f.read()
    
if "ROLE_CORE_BASICS[user?.role]" not in exec_content:
    exec_content = re.sub(has_perm_pattern, has_perm_replacement, exec_content)
    if "import { ROLE_CORE_BASICS" not in exec_content:
        exec_content = exec_content.replace("import { PERMISSIONS_TABS", "import { PERMISSIONS_TABS, ROLE_CORE_BASICS")
    with open('src/pages/ExecutivePortal.jsx', 'w', encoding='utf-8') as f:
        f.write(exec_content)

print("Fixed core basics protection in hasPerm")
