const fs = require('fs');

let content = fs.readFileSync('src/pages/SuperAdminPanel.jsx', 'utf8');

// Replace tab button text
content = content.replace('بوابة أصحاب المطاعم', 'بوابة أصحاب المنشآت');
content = content.replace('بوابة أصحاب المطاعم', 'بوابة أصحاب المنشآت'); // Replace twice just in case

// Fix the QR Modal text just in case there's any restaurant mentioned there
// But I didn't add "restaurant" there, I added "المنشأة" mostly.
// But wait, the CMS text also has "بوابة أصحاب المطاعم"

fs.writeFileSync('src/pages/SuperAdminPanel.jsx', content);
console.log('Fixed text to أصحاب المنشآت.');
