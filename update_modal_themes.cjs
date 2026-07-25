const fs = require('fs');

const replaceTheme = (filePath) => {
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace teal/emerald gradients with purple/indigo
    content = content.replace(/from-teal-600 to-emerald-600/g, 'from-purple-600 to-indigo-600');
    content = content.replace(/from-teal-400 to-emerald-400/g, 'from-purple-400 to-indigo-400');
    content = content.replace(/from-teal-500 to-emerald-500/g, 'from-purple-600 to-indigo-600');
    content = content.replace(/hover:from-teal-400 hover:to-emerald-400/g, 'hover:from-purple-500 hover:to-indigo-500');
    
    // Replace solid teal with indigo/purple
    content = content.replace(/text-teal-600/g, 'text-indigo-600');
    content = content.replace(/text-teal-500/g, 'text-indigo-600');
    content = content.replace(/text-teal-400/g, 'text-indigo-400');
    content = content.replace(/text-teal-300/g, 'text-indigo-300');
    
    content = content.replace(/border-teal-500/g, 'border-indigo-500');
    content = content.replace(/ring-teal-500/g, 'ring-indigo-500');
    content = content.replace(/accent-teal-500/g, 'accent-indigo-500');
    
    // Replace box shadows
    content = content.replace(/rgba\(20,184,166,0.3\)/g, 'rgba(99,102,241,0.3)');
    content = content.replace(/rgba\(20,184,166,0.4\)/g, 'rgba(99,102,241,0.4)');
    content = content.replace(/rgba\(20,184,166,0.5\)/g, 'rgba(99,102,241,0.5)');

    fs.writeFileSync(filePath, content);
};

const modals = [
    'src/components/AccountModal.jsx',
    'src/components/EstablishmentModal.jsx'
];

modals.forEach(modal => {
    if (fs.existsSync(modal)) {
        replaceTheme(modal);
        console.log(`Updated theme for ${modal}`);
    }
});
