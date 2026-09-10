import re

with open("src/context/AppContext.jsx", "r", encoding="utf-8") as f:
    content = f.read()

old_hasPerm = """  const hasPerm = (permName) => {
    if (!user) return false;
    // Check if there is an override in localStorage
    const savedRoles = JSON.parse(localStorage.getItem('nineveh_role_permissions') || '{}');
    const rolePerms = savedRoles[user.role] || ROLE_PERMISSIONS[user.role] || {};
    return rolePerms[permName] === true;
  };"""

new_hasPerm = """  const hasPerm = (permName) => {
    if (!user) return false;
    if (user.role === 'admin' || user.isSuperAdmin) return true;
    
    // User-specific permissions override role permissions
    if (user.permissions && typeof user.permissions[permName] !== 'undefined') {
       return user.permissions[permName] === true;
    }
    
    // Otherwise fallback to Role permissions
    const savedRoles = JSON.parse(localStorage.getItem('nineveh_role_permissions') || '{}');
    const rolePerms = savedRoles[user.role] || ROLE_PERMISSIONS[user.role] || {};
    
    return rolePerms[permName] === true;
  };"""

content = content.replace(old_hasPerm, new_hasPerm)

with open("src/context/AppContext.jsx", "w", encoding="utf-8") as f:
    f.write(content)
