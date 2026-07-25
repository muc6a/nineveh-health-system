const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'pages', 'SuperAdminPanel.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Rename tab button
content = content.replace(
  '💾 النسخ الاحتياطي للبيانات',
  '💾 البيانات'
);

// 2. Remove display_prefs tab button
const displayPrefsTabRegex = /<button[\s\S]*?onClick=\{\(\) => setSubSettingsTab\('display_prefs'\)\}[\s\S]*?<\/button>/g;
content = content.replace(displayPrefsTabRegex, '');

// 3. Extract display_prefs content block
const displayPrefsBlockRegex = /\{subSettingsTab === 'display_prefs' && \([\s\S]*?\}\)[\s]*\}/;
const displayPrefsMatch = content.match(displayPrefsBlockRegex);
let displayPrefsContent = '';
if (displayPrefsMatch) {
  displayPrefsContent = displayPrefsMatch[0];
  // Remove the block from its current location
  content = content.replace(displayPrefsBlockRegex, '');
  
  // Extract just the inner content (remove the condition wrapper)
  displayPrefsContent = displayPrefsContent.replace(/\{subSettingsTab === 'display_prefs' && \(\s*<div className="glassmorphic-card p-6 space-y-6">([\s\S]*?)<\/div>\s*\)\s*\}/, '$1');
}

// 4. Extract "تحديد مهلة حذف الصور التلقائي" block
const autoDeleteRegex = /<div className="space-y-4 pt-4 border-t border-slate-200\/50 dark:border-slate-800\/50">[\s]*<div className="space-y-1\.5">[\s]*<label className="text-xs font-bold text-slate-500 block">تحديد مهلة حذف الصور التلقائي<\/label>[\s\S]*?<\/div>[\s]*<div className="flex gap-2 justify-between flex-wrap">/;
const autoDeleteMatch = content.match(autoDeleteRegex);
let autoDeleteContent = '';
if (autoDeleteMatch) {
  autoDeleteContent = autoDeleteMatch[0].replace('<div className="flex gap-2 justify-between flex-wrap">', ''); // get just the block
  // Remove it from its current location (but leave the buttons block intact)
  content = content.replace(autoDeleteRegex, '<div className="space-y-4 pt-4 border-t border-slate-200/50 dark:border-slate-800/50">\n\n                <div className="flex gap-2 justify-between flex-wrap">');
}

// 5. Insert displayPrefsContent into appearance tab
const appearanceTabRegex = /(\{subSettingsTab === 'appearance' && \([\s\S]*?)(\n\s*<div className="space-y-4 pt-4 border-t border-slate-200\/50 dark:border-slate-800\/50">)/;
if (displayPrefsContent) {
  content = content.replace(appearanceTabRegex, `$1\n\n                {/* Typography and Display Settings Moved Here */}\n                ${displayPrefsContent}\n$2`);
}

// 6. Insert autoDeleteContent into database tab and rename title
const databaseTabRegex = /\{subSettingsTab === 'database' && \([\s\S]*?<Database className="w-5 h-5 text-teal-600 animate-pulse" \/>[\s]*<span>إدارة النسخ الاحتياطي واستعادة البيانات<\/span>/;
content = content.replace(
  databaseTabRegex,
  `{subSettingsTab === 'database' && (
                <div className="glassmorphic-card p-6 space-y-6">
                  {/* Backup and Restore Database Panel */}
              <h2 className="text-base font-black text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Database className="w-5 h-5 text-teal-600 animate-pulse" />
                <span>البيانات</span>`
);

// Append autoDeleteContent to the database tab
const databaseActionsRegex = /(📥 عمل نسخة احتياطية[\s\S]*?📤 رفع واستعادة[\s\S]*?<\/label>[\s]*<\/div>[\s]*<\/div>)/;
if (autoDeleteContent) {
  content = content.replace(databaseActionsRegex, `$1\n\n              <div className="pt-4 border-t border-slate-200/50 dark:border-slate-800/50 mt-4">\n                ${autoDeleteContent}\n              </div>`);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Modifications completed successfully.');
