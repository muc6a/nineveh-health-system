import sys

with open('src/pages/SuperAdminPanel.jsx', 'r') as f:
    content = f.read()

# 1. handleSaveAccount
old_save = """        id: accountData.role === 'tracker' ? 'tracker_' + Date.now() : (accountData.isTeam ? 'team_' + Date.now() : 'dir_acc_' + Date.now()),
        permissions: accountData.permissions ? { ...accountData.permissions } : { ...DEFAULT_PERMISSIONS }
      };
      if (accountData.role === 'tracker') {
        setTrackers(prev => [...prev, newAccount]);
      } else if (accountData.isTeam) {
        setTeams(prev => [...prev, newAccount]);
      } else {
        setDirectors(prev => [...prev, newAccount]);
      }
      triggerAlert(`تم إضافة الحساب (${accountData.name}) بنجاح.`);
    } else {
      if (accountData.role === 'tracker') {
        setTrackers(prev => prev.map(t => t.id === accountData.id ? accountData : t));
      } else if (accountData.isTeam) {
        setTeams(prev => prev.map(t => t.id === accountData.id ? accountData : t));
      } else {
        setDirectors(prev => prev.map(d => d.id === accountData.id ? accountData : d));
      }"""

new_save = """        id: accountData.role === 'tracker' ? 'tracker_' + Date.now() : (accountData.role === 'financial_accountant' ? 'accountant_' + Date.now() : (accountData.isTeam ? 'team_' + Date.now() : 'dir_acc_' + Date.now())),
        permissions: accountData.permissions ? { ...accountData.permissions } : { ...DEFAULT_PERMISSIONS }
      };
      if (accountData.role === 'tracker') {
        setTrackers(prev => [...prev, newAccount]);
      } else if (accountData.role === 'financial_accountant') {
        setAccountants(prev => [...prev, newAccount]);
      } else if (accountData.isTeam) {
        setTeams(prev => [...prev, newAccount]);
      } else {
        setDirectors(prev => [...prev, newAccount]);
      }
      triggerAlert(`تم إضافة الحساب (${accountData.name}) بنجاح.`);
    } else {
      if (accountData.role === 'tracker') {
        setTrackers(prev => prev.map(t => t.id === accountData.id ? accountData : t));
      } else if (accountData.role === 'financial_accountant') {
        setAccountants(prev => prev.map(t => t.id === accountData.id ? accountData : t));
      } else if (accountData.isTeam) {
        setTeams(prev => prev.map(t => t.id === accountData.id ? accountData : t));
      } else {
        setDirectors(prev => prev.map(d => d.id === accountData.id ? accountData : d));
      }"""
content = content.replace(old_save, new_save)

# 2. handleDeleteAccount
old_del = """  const handleDeleteAccount = (id, isTeam) => {
    if (isTeam) {
      setTeams(prev => prev.filter(t => t.id !== id));
    } else {
      setDirectors(prev => prev.filter(d => d.id !== id));
    }"""
new_del = """  const handleDeleteAccount = (id, isTeam, isTracker = false, isAccountant = false) => {
    if (isTracker) {
      setTrackers(prev => prev.filter(t => t.id !== id));
    } else if (isAccountant) {
      setAccountants(prev => prev.filter(t => t.id !== id));
    } else if (isTeam) {
      setTeams(prev => prev.filter(t => t.id !== id));
    } else {
      setDirectors(prev => prev.filter(d => d.id !== id));
    }"""
content = content.replace(old_del, new_del)

# 3. toggleAccountStatus
old_toggle = """  const toggleAccountStatus = (id, isTeam) => {
    if (isTeam) {
      setTeams(prev => prev.map(t => t.id === id ? { ...t, status: t.status === 'active' ? 'frozen' : 'active' } : t));
    } else {
      setDirectors(prev => prev.map(d => d.id === id ? { ...d, status: d.status === 'active' ? 'frozen' : 'active' } : d));
    }"""
new_toggle = """  const toggleAccountStatus = (id, isTeam, isTracker = false, isAccountant = false) => {
    if (isTracker) {
      setTrackers(prev => prev.map(t => t.id === id ? { ...t, status: t.status === 'active' ? 'frozen' : 'active' } : t));
    } else if (isAccountant) {
      setAccountants(prev => prev.map(t => t.id === id ? { ...t, status: t.status === 'active' ? 'frozen' : 'active' } : t));
    } else if (isTeam) {
      setTeams(prev => prev.map(t => t.id === id ? { ...t, status: t.status === 'active' ? 'frozen' : 'active' } : t));
    } else {
      setDirectors(prev => prev.map(d => d.id === id ? { ...d, status: d.status === 'active' ? 'frozen' : 'active' } : d));
    }"""
content = content.replace(old_toggle, new_toggle)

with open('src/pages/SuperAdminPanel.jsx', 'w') as f:
    f.write(content)
print("Updated handler functions in SuperAdminPanel.jsx")
