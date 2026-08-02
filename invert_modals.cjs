const fs = require('fs');

const files = [
  'src/pages/OwnerPortal.jsx',
  'src/pages/TeamDashboard.jsx',
  'src/pages/SuperAdminPanel.jsx',
  'src/pages/ExecutivePortal.jsx',
  'src/components/NotificationBell.jsx',
  'src/components/AccountModal.jsx',
  'src/components/BroadcastModal.jsx',
  'src/components/EstablishmentModal.jsx'
];

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  let changed = false;
  
  for (let i = 0; i < lines.length; i++) {
    // Only target the modal wrapper divs which usually have max-w- and bg-white
    if (lines[i].includes('max-w-') && lines[i].includes('bg-white') && lines[i].includes('dark:bg-slate-900')) {
      // Swap bg
      lines[i] = lines[i].replace(/bg-white(?:\/\d+)? dark:bg-slate-900(?:\/\d+)?/g, (match) => {
        return match.includes('/95') || match.includes('/90') || match.includes('/80') 
          ? match.replace(/bg-white(\/\d+)?/, 'bg-slate-900$1').replace(/dark:bg-slate-900(\/\d+)?/, 'dark:bg-white$1')
          : 'bg-slate-900 dark:bg-white';
      });
      // Swap text
      lines[i] = lines[i].replace(/text-slate-800 dark:text-white/g, 'text-white dark:text-slate-800');
      
      // Fix typo in EstablishmentModal if it exists
      lines[i] = lines[i].replace(/text-slate-800 dark:text-slate-800 dark:text-white/g, 'text-white dark:text-slate-800');
      changed = true;
    }
  }
  
  if (changed) {
    fs.writeFileSync(file, lines.join('\n'), 'utf8');
    console.log('Updated ' + file);
  }
});
