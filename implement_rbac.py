import re

with open("src/context/AppContext.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Define ROLE_PERMISSIONS
rbac_definition = """
export const ROLE_PERMISSIONS = {
  director: {
    ...DEFAULT_PERMISSIONS,
    showMainDashboard: true,
    showReportsPage: true,
    showPublicEvalsPage: true,
    showDirectivesPage: true,
    sendDirective: true,
    replyDirective: true,
    notify_closures: false,
    notify_inspections: false,
    notify_directives: true,
    financialReports: true,
    receiveSamples: true,
    enterLabResults: true,
    labArchive: true
  },
  central_director: {
    ...DEFAULT_PERMISSIONS,
    showMainDashboard: true,
    showReportsPage: true,
    showDirectivesPage: true,
    sendDirective: true,
    manageEstablishments: true,
    notify_closures: true,
    notify_inspections: true,
    notify_directives: true,
    financialReports: true,
    receiveSamples: true,
    enterLabResults: true,
    labArchive: true
  },
  team: {
    ...DEFAULT_PERMISSIONS,
    showFieldTeamsStats: true,
    showDirectivesPage: true,
    replyDirective: true,
    addEval: true,
    editEst: true
  },
  lab: {
    receiveSamples: true,
    enterLabResults: true,
    labArchive: true
  },
  accountant: {
    financialReports: true,
    payFines: true,
    dailyInventory: true
  }
};
"""

# Inject before INITIAL_TEAMS
content = content.replace("const INITIAL_TEAMS =", rbac_definition + "\nconst INITIAL_TEAMS =")

# 2. Add hasPerm to context provider
has_perm_func = """  // Role-Based Access Control Check
  const hasPerm = (permName) => {
    if (!user) return false;
    // Check if there is an override in localStorage
    const savedRoles = JSON.parse(localStorage.getItem('nineveh_role_permissions') || '{}');
    const rolePerms = savedRoles[user.role] || ROLE_PERMISSIONS[user.role] || {};
    return rolePerms[permName] === true;
  };
"""

content = content.replace("  const globalLogout = () => {", has_perm_func + "\n  const globalLogout = () => {")

# 3. Export hasPerm and ROLE_PERMISSIONS from AppContext value
content = content.replace("globalLogout\n      }}", "globalLogout,\n        hasPerm\n      }}")

with open("src/context/AppContext.jsx", "w", encoding="utf-8") as f:
    f.write(content)
