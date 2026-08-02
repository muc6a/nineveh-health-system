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

function processContent(content) {
    // 1. Replace bg-slate-800/40 and bg-slate-900/40 with bg-white/5 (Cards/Boxes)
    content = content.replace(/\bbg-slate-(800|900)\/40\b/g, 'bg-white/5');
    
    // 2. Replace bg-slate-900/50 and bg-slate-900/60 with bg-black/20 (Inputs)
    content = content.replace(/\bbg-slate-900\/(50|60)\b/g, 'bg-black/20');
    
    // 3. Replace bg-slate-800 (when used as a solid card background, not in borders/text) with bg-white/10
    // Be careful not to replace dark:bg-slate-800 if it's meant to be dark.
    // Actually, our current inverted code has `bg-slate-800 dark:bg-slate-50`.
    content = content.replace(/\bbg-slate-800\s+dark:bg-slate-50/g, 'bg-white/10 dark:bg-slate-50');
    content = content.replace(/\bbg-slate-800\s+dark:bg-slate-100/g, 'bg-white/10 dark:bg-slate-100');
    
    // 4. Fix autofill background issue for inputs
    // We add a class to inputs to kill Chrome's white autofill background.
    // Tailwind doesn't have a built-in autofill modifier in v3 unless you configure it, 
    // but we can just use inline style or a custom class in index.css.
    // Instead of messing with every input, we can just inject a global style or use `[color-scheme:dark]` on the modal root.
    
    return content;
}

filesToProcess.forEach(file => {
    if (!fs.existsSync(file)) return;
    const original = fs.readFileSync(file, 'utf-8');
    const updated = processContent(original);
    if (original !== updated) {
        fs.writeFileSync(file, updated, 'utf-8');
        console.log(`Refined colors in ${file}`);
    }
});
