const fs = require('fs');

let content = fs.readFileSync('src/pages/SuperAdminPanel.jsx', 'utf8');

// Fix destructuring
const regex = /const \{ [^\}]+ \} = useContext\(AppContext\);/;
const match = content.match(regex);
if (match) {
    let oldDestruct = match[0];
    if (!oldDestruct.includes('loginCMS')) {
        let newDestruct = oldDestruct.replace('uiPreferences, setUiPreferences }', 'uiPreferences, setUiPreferences, loginCMS, setLoginCMS, ownerCMS, setOwnerCMS }');
        // fallback if replacing uiPreferences failed
        if (newDestruct === oldDestruct) {
             newDestruct = oldDestruct.replace('} = useContext(AppContext);', ', loginCMS, setLoginCMS, ownerCMS, setOwnerCMS } = useContext(AppContext);');
        }
        content = content.replace(oldDestruct, newDestruct);
    }
}

// Also, the old states `cmsHeroTitle`, `cmsHeroSubtext`, `cmsAnnouncement` use `publicCMS.heroTitle`.
// If publicCMS is null/undefined initially, this will crash with TypeError: Cannot read properties of undefined (reading 'heroTitle').
// Let's safe-navigate them.
content = content.replace('useState(publicCMS.heroTitle)', 'useState(publicCMS?.heroTitle || "")');
content = content.replace('useState(publicCMS.heroSubtext)', 'useState(publicCMS?.heroSubtext || "")');
content = content.replace('useState(publicCMS.announcement || \'\')', 'useState(publicCMS?.announcement || "")');

fs.writeFileSync('src/pages/SuperAdminPanel.jsx', content);
console.log('Fixed SuperAdminPanel CMS References.');
