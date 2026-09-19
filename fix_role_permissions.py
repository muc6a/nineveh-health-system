import re

with open('src/context/AppContext.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# We need to replace the entire export const ROLE_PERMISSIONS = { ... } block
# up to const INITIAL_TEAMS = [

new_permissions = """export const ROLE_PERMISSIONS = {
  director: {
    ...DEFAULT_PERMISSIONS,
    showMainDashboard: true,
    showDirectivesPage: true,
    sendDirective: true,
    replyDirective: true,
    notify_directives: true
  },
  central_director: {
    ...DEFAULT_PERMISSIONS,
    manageSmartTasks: true,
    authenticatePenalties: true,
    issueFine: true,
    closeEst: true,
    reopenEst: true,
    manageEstablishments: true,
    editEst: true,
    deleteEst: true,
    showPublicEvalsPage: true,
    showDeliveryPage: true,
    viewLabReports: true,
    financialReports: true,
    showDirectivesPage: true,
    sendDirective: true,
    replyDirective: true,
    quickTeamDispatch: true,
    notify_closures: true,
    notify_inspections: true,
    notify_directives: true,
    showMainDashboard: true
  },
  team: {
    ...DEFAULT_PERMISSIONS,
    manageEstablishments: true,
    createEst: true,
    addEval: true,
    showSectorMap: true,
    executeSmartTasks: true,
    showTeamDashboard: true
  },
  tracker: {
    ...DEFAULT_PERMISSIONS,
    showDirectivesPage: true,
    sendDirective: true,
    replyDirective: true,
    monitorClosures: true,
    searchAndAddPreliminaryEst: true
  },
  lab: {
    ...DEFAULT_PERMISSIONS,
    showDirectivesPage: true,
    sendDirective: true,
    replyDirective: true,
    viewLabReports: true,
    receiveSamples: true,
    enterLabResults: true,
    editLabResults: true,
    labArchive: true
  },
  accountant: {
    ...DEFAULT_PERMISSIONS,
    showDirectivesPage: true,
    financialReports: true,
    payFines: true,
    dailyInventory: true
  },
  financial_accountant: {
    ...DEFAULT_PERMISSIONS,
    showDirectivesPage: true,
    financialReports: true,
    payFines: true,
    dailyInventory: true
  }
};
"""

pattern = re.compile(r'export const ROLE_PERMISSIONS = \{.*?\n\};\n', re.DOTALL)
content = re.sub(pattern, new_permissions + '\n', content)

with open('src/context/AppContext.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed ROLE_PERMISSIONS successfully.")
