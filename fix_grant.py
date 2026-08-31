import sys

def main():
    with open('src/pages/SuperAdminPanel.jsx', 'r', encoding='utf-8') as f:
        sap = f.read()

    # 1. Inject before return (
    injection = """  const handleGrantAll = () => {
    setSelectedPermissionsAccount(prev => {
      if (!prev) return prev;
      const allTrue = {};
      Object.keys(DEFAULT_PERMISSIONS).forEach(k => allTrue[k] = true);
      return { ...prev, permissions: allTrue };
    });
  };

  const handleRevokeAll = () => {
    setSelectedPermissionsAccount(prev => {
      if (!prev) return prev;
      const allFalse = {};
      Object.keys(DEFAULT_PERMISSIONS).forEach(k => allFalse[k] = false);
      return { ...prev, permissions: allFalse };
    });
  };

  const activeTabObj = PERMISSIONS_TABS.find(t => t.id === activePermissionsTab);

  return ("""
    
    sap = sap.replace("  return (", injection, 1)

    # 2. Remove them from the IIFE so we don't redefine them
    # Because of indentation variations, I will just find and remove them string by string
    
    grant_all_str = """        const handleGrantAll = () => {
          setSelectedPermissionsAccount(prev => {
            const allTrue = {};
            Object.keys(DEFAULT_PERMISSIONS).forEach(k => allTrue[k] = true);
            return { ...prev, permissions: allTrue };
          });
        };"""
    
    revoke_all_str = """        const handleRevokeAll = () => {
          setSelectedPermissionsAccount(prev => {
            const allFalse = {};
            Object.keys(DEFAULT_PERMISSIONS).forEach(k => allFalse[k] = false);
            return { ...prev, permissions: allFalse };
          });
        };"""
        
    active_tab_obj_str = "        const activeTabObj = PERMISSIONS_TABS.find(t => t.id === activePermissionsTab);"
    
    sap = sap.replace(grant_all_str, "")
    sap = sap.replace(revoke_all_str, "")
    sap = sap.replace(active_tab_obj_str, "")
    
    # Also remove them if they were duplicated in other IIFEs or weird locations (like handlePermissionsAccountSelect duplicates)
    # Wait, earlier I found 5 definitions of handlePermissionsAccountSelect. I should leave those alone for now unless they break, but they might be dead code.
    
    with open('src/pages/SuperAdminPanel.jsx', 'w', encoding='utf-8') as f:
        f.write(sap)
    print("handleGrantAll fixed successfully.")

if __name__ == "__main__":
    main()
