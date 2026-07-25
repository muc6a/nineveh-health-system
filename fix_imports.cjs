const fs = require('fs');
let content = fs.readFileSync('src/pages/ExecutivePortal.jsx', 'utf8');

const importSearch = /import \{ (.*?) \} from 'lucide-react';/;
content = content.replace(importSearch, (match, p1) => {
    let newImports = p1;
    if (!newImports.includes('Settings')) {
        newImports += ', Settings';
    }
    if (!newImports.includes('Database')) {
        newImports += ', Database';
    }
    return `import { ${newImports} } from 'lucide-react';`;
});

fs.writeFileSync('src/pages/ExecutivePortal.jsx', content);
console.log('Fixed imports');
