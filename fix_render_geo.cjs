const fs = require('fs');
let content = fs.readFileSync('src/components/AccountModal.jsx', 'utf-8');

const regex = /\b(bg|text|border|ring|shadow|divide)-([a-z]+-\d+(?:\/\d+)?|white(?:\/\d+)?|black(?:\/\d+)?|transparent)\s+dark:\1-([a-z]+-\d+(?:\/\d+)?|white(?:\/\d+)?|black(?:\/\d+)?|transparent)\b/g;

// Only process the part before the main return statement (which contains renderGeoSelection)
const modalStart = content.indexOf('return (');
let topPart = content.substring(0, modalStart);
let bottomPart = content.substring(modalStart);

topPart = topPart.replace(regex, (match, prefix, color1, color2) => {
    return `${prefix}-${color2} dark:${prefix}-${color1}`;
});

fs.writeFileSync('src/components/AccountModal.jsx', topPart + bottomPart, 'utf-8');
console.log('Fixed renderGeoSelection in AccountModal');
