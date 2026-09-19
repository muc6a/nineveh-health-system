with open('src/context/AppContext.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace hasPerm definition
old_has_perm = """  const hasPerm = (permName) => {
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

new_has_perm = """  const hasPerm = (permName) => {
    if (!user) return false;
    if (user.role === 'admin' || user.isSuperAdmin) return true;

    // MANDATORY CORE PERMISSIONS (Cannot be overridden or revoked)
    const mandatoryPerms = ROLE_PERMISSIONS[user.role] || {};
    if (mandatoryPerms[permName] === true) {
      return true;
    }

    // User-specific permissions override role permissions (only for non-mandatory optional perms)
    if (user.permissions && typeof user.permissions[permName] !== 'undefined') {
       return user.permissions[permName] === true;
    }

    // Otherwise fallback to saved custom Role permissions (if admin changed them)
    const savedRoles = JSON.parse(localStorage.getItem('nineveh_role_permissions') || '{}');
    const rolePerms = savedRoles[user.role] || {};

    return rolePerms[permName] === true || mandatoryPerms[permName] === true;
  };"""

content = content.replace(old_has_perm, new_has_perm)

with open('src/context/AppContext.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed hasPerm successfully.")
