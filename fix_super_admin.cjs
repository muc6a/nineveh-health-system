const fs = require('fs');

let code = fs.readFileSync('src/pages/SuperAdminPanel.jsx', 'utf8');

const replacement = `  const handleGrantAll = () => {
    setSelectedPermissionsAccount(prev => {
      if (!prev) return prev;
      const allTrue = {};
      PERMISSIONS_TABS.forEach(tab => {
        tab.keys.forEach(k => {
          allTrue[k] = true;
        });
      });
      return { ...prev, permissions: allTrue };
    });
  };

  const handleRevokeAll = () => {
    setSelectedPermissionsAccount(prev => {
      if (!prev) return prev;
      const allFalse = { ...prev.permissions };
      const coreBasics = ROLE_CORE_BASICS[prev.role] || [];
      PERMISSIONS_TABS.forEach(tab => {
        tab.keys.forEach(k => {
          if (!coreBasics.includes(k)) {
            allFalse[k] = false;
          } else {
            allFalse[k] = true;
          }
        });
      });
      return { ...prev, permissions: allFalse };
    });
  };`;

code = code.replace(/  const handleGrantAll = \(\) => {[\s\S]*?  const activeTabObj = /m, replacement + '\n\n  const activeTabObj = ');

fs.writeFileSync('src/pages/SuperAdminPanel.jsx', code);
console.log('Fixed handleGrantAll and handleRevokeAll');
