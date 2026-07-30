const fs = require('fs');

let content = fs.readFileSync('src/context/AppContext.jsx', 'utf8');

// 1. Add uiPreferences state
const oldSystemNotifs = `  // Persistent System Notifications for the Bell Icon
  const [systemNotifications, setSystemNotifications] = useState(() => {
    const saved = localStorage.getItem('sysNotifs');
    return saved ? JSON.parse(saved) : [];
  });`;

const newSystemNotifs = `  // User UI Preferences (Density & Typography)
  const [uiPreferences, setUiPreferences] = useState(() => {
    const saved = localStorage.getItem('uiPreferences');
    return saved ? JSON.parse(saved) : {
      headingSize: '18px', // Default
      bodySize: '12px',    // Default (text-xs)
      density: 'comfortable', // comfortable | compact
    };
  });

  useEffect(() => {
    localStorage.setItem('uiPreferences', JSON.stringify(uiPreferences));
    
    // Apply preferences to document body/root for easy CSS variable usage
    document.documentElement.style.setProperty('--heading-size', uiPreferences.headingSize);
    document.documentElement.style.setProperty('--body-size', uiPreferences.bodySize);
    
    if (uiPreferences.density === 'compact') {
      document.documentElement.classList.add('density-compact');
    } else {
      document.documentElement.classList.remove('density-compact');
    }
  }, [uiPreferences]);

  // Persistent System Notifications for the Bell Icon
  const [systemNotifications, setSystemNotifications] = useState(() => {
    const saved = localStorage.getItem('sysNotifs');
    return saved ? JSON.parse(saved) : [];
  });`;

content = content.replace(oldSystemNotifs, newSystemNotifs);

// 2. Export uiPreferences and setUiPreferences
const oldExport = `      setGlobalBroadcast,
      publicCMS,
      setPublicCMS
    }}>
      {children}
    </AppContext.Provider>
  );`;

const newExport = `      setGlobalBroadcast,
      publicCMS,
      setPublicCMS,
      uiPreferences,
      setUiPreferences
    }}>
      {children}
    </AppContext.Provider>
  );`;

content = content.replace(oldExport, newExport);

fs.writeFileSync('src/context/AppContext.jsx', content);
console.log('AppContext updated with uiPreferences.');
