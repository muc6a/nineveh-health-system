import re

with open("src/pages/SuperAdminPanel.jsx", "r", encoding="utf-8") as f:
    content = f.read()

old_handle_perm_select = """  const handlePermissionsAccountSelect = (e) => {
    const val = e.target.value;
    setPermissionsSelectedAccountId(val);
    if (!val) {
      setSelectedPermissionsAccount(null);
      return;
    }
    const allOptions = allAccountsForPermissions.flatMap(g => g.options);
    const selected = allOptions.find(o => o.value === val);
    if (selected) {
      // Create a deep copy to avoid mutating state directly during edits
      setSelectedPermissionsAccount(JSON.parse(JSON.stringify(selected.obj)));
    }
  };"""

new_handle_perm_select = """  const handlePermissionsAccountSelect = (e) => {
    const val = e.target.value;
    setPermissionsSelectedAccountId(val);
    if (!val) {
      setSelectedPermissionsAccount(null);
      return;
    }
    const allOptions = allAccountsForPermissions.flatMap(g => g.options);
    const selected = allOptions.find(o => o.value === val);
    if (selected) {
      const roleId = selected.obj.role;
      // Fetch role permissions from localStorage or default
      const savedRoles = JSON.parse(localStorage.getItem('nineveh_role_permissions') || '{}');
      
      // Default definitions
      const DEFAULT_PERMISSIONS = {
        manageEstablishments: true,
        createEst: true,
        editEst: true,
        deleteEst: false,
        addEval: true,
        showMainDashboard: true,
        showReportsPage: true,
        showDirectivesPage: true,
        showPublicEvalsPage: true,
        sendDirective: false,
        replyDirective: false,
        quickTeamDispatch: false,
        showOperationsRoom: false,
        receiveSamples: false,
        enterLabResults: false,
        labArchive: false,
        financialReports: false,
        payFines: false,
        dailyInventory: false,
        manageUsers: false,
        authenticatePenalties: false,
        showDeliveryPage: false,
        exportData: false,
        notify_closures: false,
        notify_inspections: false,
        notify_directives: false
      };

      const ROLE_PERMISSIONS = {
        director: { ...DEFAULT_PERMISSIONS, showMainDashboard: true, showReportsPage: true, showPublicEvalsPage: true, showDirectivesPage: true, sendDirective: true, replyDirective: true, notify_closures: false, notify_inspections: false, notify_directives: true, financialReports: true, receiveSamples: true, enterLabResults: true, labArchive: true },
        central_director: { ...DEFAULT_PERMISSIONS, showMainDashboard: true, showReportsPage: true, showDirectivesPage: true, sendDirective: true, manageEstablishments: true, notify_closures: true, notify_inspections: true, notify_directives: true, financialReports: true, receiveSamples: true, enterLabResults: true, labArchive: true },
        team: { ...DEFAULT_PERMISSIONS, showFieldTeamsStats: true, showDirectivesPage: true, replyDirective: true, addEval: true, editEst: true },
        lab: { receiveSamples: true, enterLabResults: true, labArchive: true },
        accountant: { financialReports: true, payFines: true, dailyInventory: true }
      };

      const perms = savedRoles[roleId] || ROLE_PERMISSIONS[roleId] || {};
      const objCopy = JSON.parse(JSON.stringify(selected.obj));
      objCopy.permissions = perms;
      setSelectedPermissionsAccount(objCopy);
    }
  };"""

content = content.replace(old_handle_perm_select, new_handle_perm_select)

old_save_perm = """  const handleSavePermissions = () => {
    if (!selectedPermissionsAccount) return;
    
    // Determine type
    const val = permissionsSelectedAccountId;
    const finalAccount = selectedPermissionsAccount;

    if (val.startsWith('team_')) {
      setTeams(prev => prev.map(t => t.id === finalAccount.id ? finalAccount : t));
    } else if (val.startsWith('accountant_')) {
      setAccountants(prev => prev.map(a => a.id === finalAccount.id ? finalAccount : a));
    } else if (val.startsWith('lab_')) {
      setLabs(prev => prev.map(l => l.id === finalAccount.id ? finalAccount : l));
    } else if (val.startsWith('tracker_')) {
      setTrackers(prev => prev.map(t => t.id === finalAccount.id ? finalAccount : t));
    } else {
      setDirectors(prev => prev.map(d => d.id === finalAccount.id ? finalAccount : d));
    }
    
    logAudit('تعديل صلاحيات حساب', finalAccount.id, null, finalAccount.permissions, 'تعديل الصلاحيات الإدارية', user);
    triggerAlert('تم حفظ الصلاحيات بنجاح');
    setShowPermissionsModal(false);
  };"""

new_save_perm = """  const handleSavePermissions = () => {
    if (!selectedPermissionsAccount) return;
    
    const roleId = selectedPermissionsAccount.role;
    const savedRoles = JSON.parse(localStorage.getItem('nineveh_role_permissions') || '{}');
    savedRoles[roleId] = selectedPermissionsAccount.permissions;
    localStorage.setItem('nineveh_role_permissions', JSON.stringify(savedRoles));
    
    // trigger a storage event so AppContext can pick it up if we added a listener,
    // or we can just reload the page for now to apply global changes instantly.
    
    logAudit('تعديل صلاحيات دور وظيفي', roleId, null, selectedPermissionsAccount.permissions, 'تعديل الصلاحيات المركزية (RBAC)', user);
    triggerAlert('تم حفظ وتعميم الصلاحيات بنجاح على جميع الحسابات!');
    setShowPermissionsModal(false);
    setTimeout(() => window.location.reload(), 1500);
  };"""

content = content.replace(old_save_perm, new_save_perm)

with open("src/pages/SuperAdminPanel.jsx", "w", encoding="utf-8") as f:
    f.write(content)
