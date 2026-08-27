import sys

with open('src/pages/SuperAdminPanel.jsx', 'r') as f:
    content = f.read()

old_state = """  // Permissions Modal States
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [permissionsTarget, setPermissionsTarget] = useState(null);
  const [editingPermissions, setEditingPermissions] = useState({});"""
new_state = """  // Permissions Modal States
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [activePermissionsTab, setActivePermissionsTab] = useState('establishments');
  const [selectedPermissionsAccount, setSelectedPermissionsAccount] = useState(null);"""
content = content.replace(old_state, new_state)

old_handlers = """  const handleOpenPermissions = (target) => {
    handleOpenEditAccount(target, target.isTeam ? 'team' : 'director');
  };

  const handleSavePermissions = () => {
    if (!permissionsTarget) return;
    const updatedTarget = { ...permissionsTarget, permissions: editingPermissions };
    if (permissionsTarget.isTeam) {
      setTeams(prev => prev.map(t => t.id === permissionsTarget.id ? updatedTarget : t));
    } else {
      setDirectors(prev => prev.map(d => d.id === permissionsTarget.id ? updatedTarget : d));
    }
    logAudit('تعديل صلاحيات حساب', permissionsTarget.id, permissionsTarget.permissions, editingPermissions, 'تعديل الصلاحيات الإدارية', user);
    setShowPermissionsModal(false);
    setPermissionsTarget(null);
    triggerAlert('✓ تم تحديث الأذونات والصلاحيات بنجاح.');
  };"""
new_handlers = """  const handleOpenPermissions = (target) => {
    setSelectedPermissionsAccount(target);
    setActivePermissionsTab('establishments');
    setShowPermissionsModal(true);
  };

  const handleSavePermissions = () => {
    if (!selectedPermissionsAccount) return;
    
    if (selectedPermissionsAccount.role === 'team' || selectedPermissionsAccount.isTeam || !selectedPermissionsAccount.role) {
      setTeams(prev => prev.map(t => t.id === selectedPermissionsAccount.id ? selectedPermissionsAccount : t));
    } else {
      setDirectors(prev => prev.map(d => d.id === selectedPermissionsAccount.id ? selectedPermissionsAccount : d));
    }
    
    logAudit('تعديل صلاحيات حساب', selectedPermissionsAccount.id, null, selectedPermissionsAccount.permissions, 'تعديل الصلاحيات الإدارية', user);
    triggerAlert(`تم حفظ وتحديث الأذونات لحساب (${selectedPermissionsAccount.name}) بنجاح.`);
    setShowPermissionsModal(false);
  };

  const togglePermission = (key) => {
    if (!selectedPermissionsAccount) return;
    setSelectedPermissionsAccount(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [key]: !prev.permissions?.[key]
      }
    }));
  };"""
content = content.replace(old_handlers, new_handlers)

start_str = "      {/* PERMISSIONS MODAL */}"
end_str = "      {accountModalState.isOpen && ("

start_idx = content.find(start_str)
end_idx = content.find(end_str)

if start_idx != -1 and end_idx != -1:
    with open('extracted_permissions_modal.jsx', 'r') as f:
        modal_ui = f.read()
    
    content = content[:start_idx] + "      {/* PROFESSIONAL PERMISSIONS HUB MODAL */}\n" + modal_ui + "\n" + content[end_idx:]

with open('src/pages/SuperAdminPanel.jsx', 'w') as f:
    f.write(content)

print("Done")
