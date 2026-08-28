import re

filepath = "/Users/admin/web/منظومة الرقابة الصحية الرقمية/src/pages/SuperAdminPanel.jsx"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

target = """  const handleSavePermissions = () => {
    if (!selectedPermissionsAccount) return;
    
    if (selectedPermissionsAccount.role === 'team' || selectedPermissionsAccount.isTeam || !selectedPermissionsAccount.role) {
      setTeams(prev => prev.map(t => t.id === selectedPermissionsAccount.id ? selectedPermissionsAccount : t));
    } else {
      setDirectors(prev => prev.map(d => d.id === selectedPermissionsAccount.id ? selectedPermissionsAccount : d));
    }"""

replacement = """  const handleSavePermissions = () => {
    if (!selectedPermissionsAccount) return;
    
    const role = selectedPermissionsAccount.role;
    if (role === 'team' || selectedPermissionsAccount.isTeam || !role) {
      setTeams(prev => prev.map(t => t.id === selectedPermissionsAccount.id ? selectedPermissionsAccount : t));
    } else if (role === 'accountant') {
      setAccountants(prev => prev.map(a => a.id === selectedPermissionsAccount.id ? selectedPermissionsAccount : a));
    } else if (role === 'tracker') {
      setTrackers(prev => prev.map(t => t.id === selectedPermissionsAccount.id ? selectedPermissionsAccount : t));
    } else {
      setDirectors(prev => prev.map(d => d.id === selectedPermissionsAccount.id ? selectedPermissionsAccount : d));
    }"""

content = content.replace(target, replacement)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated SuperAdminPanel.jsx permissions logic")
