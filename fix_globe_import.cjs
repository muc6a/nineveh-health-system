const fs = require('fs');

let content = fs.readFileSync('src/pages/SuperAdminPanel.jsx', 'utf8');

const importSearch = `import { Plus, Trash2, Edit, X, Power, ShieldAlert, Check, Users, Settings, Database, Shield, Eye, EyeOff, Info, UserPlus, Compass, Building, Search, Mail, AlertTriangle, BarChart3, BellRing } from 'lucide-react';`;
const importReplace = `import { Plus, Trash2, Edit, X, Power, ShieldAlert, Check, Users, Settings, Database, Shield, Eye, EyeOff, Info, UserPlus, Compass, Building, Search, Mail, AlertTriangle, BarChart3, BellRing, Globe } from 'lucide-react';`;

if (content.includes(importSearch)) {
    content = content.replace(importSearch, importReplace);
    fs.writeFileSync('src/pages/SuperAdminPanel.jsx', content);
    console.log('Fixed Globe import in SuperAdminPanel.');
} else {
    // If it was already modified or slightly different
    console.log('Could not find exact import string.');
}
