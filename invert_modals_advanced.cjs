const fs = require('fs');

const filesToProcess = [
  'src/components/AccountModal.jsx',
  'src/components/EstablishmentModal.jsx',
  'src/components/BroadcastModal.jsx',
  'src/components/CriticalAlertModal.jsx',
  'src/components/DisplayPreferencesModal.jsx',
  'src/components/QRScannerModal.jsx',
  'src/pages/SuperAdminPanel.jsx',
  'src/pages/ExecutivePortal.jsx',
  'src/pages/TeamDashboard.jsx',
  'src/pages/OwnerPortal.jsx'
];

const regex = /\b(bg|text|border|ring|shadow|divide)-([a-z]+-\d+(?:\/\d+)?|white(?:\/\d+)?|black(?:\/\d+)?|transparent)\s+dark:\1-([a-z]+-\d+(?:\/\d+)?|white(?:\/\d+)?|black(?:\/\d+)?|transparent)\b/g;

function invertClasses(text) {
    return text.replace(regex, (match, prefix, color1, color2) => {
        return `${prefix}-${color2} dark:${prefix}-${color1}`;
    });
}

function processModals(content) {
    // Find all occurrences of "fixed inset-0"
    // Since we are in JSX, a modal usually looks like:
    // <div className="fixed inset-0 ..."> ... </div>
    // We can just use a simple state machine to find the matching closing </div>
    
    let result = '';
    let i = 0;
    while (i < content.length) {
        const modalStart = content.indexOf('className="fixed inset-0', i);
        if (modalStart === -1) {
            result += content.substring(i);
            break;
        }

        // Find the <div that contains this className
        const divStart = content.lastIndexOf('<div', modalStart);
        if (divStart === -1 || divStart < i) {
            // Something went wrong, just append and continue
            result += content.substring(i, modalStart + 24);
            i = modalStart + 24;
            continue;
        }

        // Add everything before the modal to result
        result += content.substring(i, divStart);
        
        // Find the matching closing </div>
        let depth = 0;
        let j = divStart;
        let inString = false;
        let stringChar = '';
        
        while (j < content.length) {
            const char = content[j];
            const nextChar = content[j+1];
            
            if (!inString) {
                if (char === '"' || char === "'" || char === "`") {
                    inString = true;
                    stringChar = char;
                } else if (char === '<' && nextChar === 'd' && content.substring(j, j+4) === '<div') {
                    depth++;
                    j += 3;
                } else if (char === '<' && nextChar === '/' && content.substring(j, j+6) === '</div') {
                    depth--;
                    j += 5;
                    if (depth === 0) {
                        j++; // skip '>'
                        while(content[j] !== '>') j++;
                        j++;
                        break;
                    }
                }
            } else {
                if (char === '\\') {
                    j++; // skip escaped char
                } else if (char === stringChar) {
                    inString = false;
                }
            }
            j++;
        }
        
        const modalBlock = content.substring(divStart, j);
        
        // We want to invert classes inside the modal.
        // BUT we must NOT invert the root wrapper's background AGAIN, because I already did that manually!
        // Wait! The manual inversion I did earlier was specifically for the SECOND div inside the modal (the actual modal card).
        // e.g. <div className="w-full max-w-md bg-white dark:bg-slate-900 ...">
        // I changed it to <div className="w-full max-w-md bg-slate-900 dark:bg-white ...">
        // If I run my script on the whole block, it will REVERT the manual change, AND invert all inner children.
        // Which means the modal background goes back to white(light) / navy(dark). And children become navy(light) / white(dark).
        // BUT we WANT the modal background to be navy(light) / white(dark) and the children to be inverted!
        // So I should let it revert the root? NO! If it reverts the root, the background becomes white!
        
        // Actually, if I just manually replace specific classes that are NOT the root background, it's much safer!
        // The root background is usually `bg-slate-900 dark:bg-white` or `bg-slate-900/95 dark:bg-white/90` or `bg-slate-900 dark:bg-slate-50`.
        // I will just invert EVERYTHING, and then re-force the root backgrounds to be what we want!
        
        // Invert everything
        let invertedBlock = invertClasses(modalBlock);
        
        // Re-force the root card background (it usually has max-w-)
        invertedBlock = invertedBlock.replace(/max-w-([a-z0-9]+)\s+bg-white(\/\d+)?\s+dark:bg-slate-900(\/\d+)?/g, 'max-w-$1 bg-slate-900$3 dark:bg-white$2');
        invertedBlock = invertedBlock.replace(/max-w-([a-z0-9]+)\s+bg-slate-50(\/\d+)?\s+dark:bg-slate-900(\/\d+)?/g, 'max-w-$1 bg-slate-900$3 dark:bg-slate-50$2');
        invertedBlock = invertedBlock.replace(/max-w-([a-z0-9]+)\s+bg-slate-100(\/\d+)?\s+dark:bg-slate-800(\/\d+)?/g, 'max-w-$1 bg-slate-800$3 dark:bg-slate-100$2');
        invertedBlock = invertedBlock.replace(/max-w-([a-z0-9]+)\s+bg-white\s+dark:bg-slate-800/g, 'max-w-$1 bg-slate-800 dark:bg-white');

        // Also fix the text colors that might have been inverted back to dark in light mode
        // Wait, if the root background is Navy (dark), the text on the root should be White!
        invertedBlock = invertedBlock.replace(/max-w-([a-z0-9]+)\s+bg-slate-900(\/\d+)?\s+dark:bg-white(\/\d+)?(.*?)text-slate-800\s+dark:text-white/g, 'max-w-$1 bg-slate-900$2 dark:bg-white$3$4text-white dark:text-slate-800');

        result += invertedBlock;
        i = j;
    }
    
    return result;
}

filesToProcess.forEach(file => {
    if (!fs.existsSync(file)) return;
    const content = fs.readFileSync(file, 'utf-8');
    const newContent = processModals(content);
    if (content !== newContent) {
        fs.writeFileSync(file, newContent, 'utf-8');
        console.log(`Updated ${file}`);
    }
});
