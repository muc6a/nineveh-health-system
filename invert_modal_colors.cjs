const fs = require('fs');
const path = require('path');

function invertClasses(content) {
    // We want to match: prefix-color1 dark:prefix-color2
    // prefix can be bg, text, border, shadow, ring, divide
    const regex = /\b(bg|text|border|ring|shadow|divide)-([a-z]+-\d+(?:\/\d+)?|white|black|transparent)\s+dark:\1-([a-z]+-\d+(?:\/\d+)?|white|black|transparent)\b/g;
    
    return content.replace(regex, (match, prefix, color1, color2) => {
        // We swap color1 and color2
        return `${prefix}-${color2} dark:${prefix}-${color1}`;
    });
}

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');
    const original = content;
    content = invertClasses(content);
    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`Updated ${filePath}`);
    } else {
        console.log(`No changes for ${filePath}`);
    }
}

processFile('src/components/AccountModal.jsx');

