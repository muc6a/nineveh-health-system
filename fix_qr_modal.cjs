const fs = require('fs');

function fixQRModal(filePath) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Fix restaurant name color (text-white to text-slate-800 dark:text-white)
    content = content.replace(
        /<h4 className="text-base font-black text-white">\{selectedEstDetails\.name\}<\/h4>/g,
        '<h4 className="text-base font-black text-slate-800 dark:text-white">{selectedEstDetails.name}</h4>'
    );

    // 2. Fix Print button color (make it green)
    const oldPrintBtn = `className="py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white border border-white/10 text-center font-black block transition-all shadow-inner"
                >
                  🖨️ طباعة ملصق`;
    
    const newPrintBtn = `className="py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-center font-black block transition-all shadow-inner"
                >
                  🖨️ طباعة ملصق`;
    
    content = content.replace(oldPrintBtn, newPrintBtn);

    // 3. Remove "التقييم" from QR Modal
    const scoreLine = /<p className="text-\[11px\] text-slate-600 dark:text-slate-400">التقييم:[^<]+<strong className=\{[^}]+\}>\{[^}]+\}<\/strong><\/p>/g;
    content = content.replace(scoreLine, '');

    fs.writeFileSync(filePath, content);
}

fixQRModal('src/pages/SuperAdminPanel.jsx');
fixQRModal('src/components/EstablishmentsManager.jsx');

console.log('QR Modal styling fixed.');
