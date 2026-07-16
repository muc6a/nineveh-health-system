const fs = require('fs');

let content = fs.readFileSync('src/context/AppContext.jsx', 'utf8');

// The keys we want to sync globally
const syncKeys = [
  'establishments', 'reports', 'teams_v2', 'trackers_v1', 
  'closureVerifications_v1', 'inspectionItems', 'systemConfig', 
  'auditLogs', 'globalBroadcast', 'systemTickets', 'sysNotifs', 
  'publicCMS', 'directives', 'directors'
];

// Add the syncToCloud helper right after the notifications
if (!content.includes('const syncToCloud')) {
  content = content.replace(
    /const notify = \(message, type = 'info', playSound = false\) => {[\s\S]*?};\n/,
    `$&
  const syncToCloud = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
    fetch('/api/state/' + key, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).catch(() => {});
  };
`
  );
}

// Replace localStorage.setItem for the keys with syncToCloud
syncKeys.forEach(key => {
  const regex = new RegExp(`localStorage\\.setItem\\('${key}', JSON\\.stringify\\(([a-zA-Z0-9_]+)\\)\\);(?:\\s*fetch\\('/api/state/.*?;)?`, 'g');
  content = content.replace(regex, `syncToCloud('${key}', $1);`);
});

// Update the initial fetch useEffect
const fetchCalls = syncKeys.map(key => {
  const setterMatch = content.match(new RegExp(`const \\[${key === 'systemConfig' ? 'config' : key.replace(/_v[0-9]+$/, '')}, (set[a-zA-Z0-9_]+)\\]`));
  if (setterMatch) {
    return `    fetchState('${key}', ${setterMatch[1]});`;
  }
  // Hardcoded mappings
  if (key === 'systemConfig') return `    fetchState('systemConfig', setConfig);`;
  if (key === 'sysNotifs') return `    fetchState('sysNotifs', setSystemNotifications);`;
  if (key === 'systemTickets') return `    fetchState('systemTickets', setTickets);`;
  if (key === 'closureVerifications_v1') return `    fetchState('closureVerifications_v1', setClosureVerifications);`;
  if (key === 'trackers_v1') return `    fetchState('trackers_v1', setTrackers);`;
  if (key === 'teams_v2') return `    fetchState('teams_v2', setTeams);`;
  return '';
}).filter(Boolean).join('\n');

const initialFetchRegex = /\/\/ Sync state from backend prototype DB on initial load[\s\S]*?\}, \[\]\);/;
if (initialFetchRegex.test(content)) {
  content = content.replace(initialFetchRegex, `// Sync state from backend prototype DB on initial load
  useEffect(() => {
    const fetchState = async (key, setter) => {
      try {
        const res = await fetch('/api/state/' + key);
        if (res.ok) {
          const data = await res.json();
          if (data) setter(data);
        }
      } catch (err) {}
    };
${fetchCalls}
  }, []);`);
}

fs.writeFileSync('src/context/AppContext.jsx', content);
console.log('Fixed AppContext.jsx');
