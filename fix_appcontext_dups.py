import re

with open("src/context/AppContext.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# Find the full block of hasPerm
block = """  // Role-Based Access Control Check
  const hasPerm = (permName) => {
    if (!user) return false;
    // Check if there is an override in localStorage
    const savedRoles = JSON.parse(localStorage.getItem('nineveh_role_permissions') || '{}');
    const rolePerms = savedRoles[user.role] || ROLE_PERMISSIONS[user.role] || {};
    return rolePerms[permName] === true;
  };"""

# Replace all occurrences with empty string except the first one
count = content.count(block)
if count > 1:
    content = content.replace(block, "", count - 1)

with open("src/context/AppContext.jsx", "w", encoding="utf-8") as f:
    f.write(content)
