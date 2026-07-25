const fs = require('fs');

let content = fs.readFileSync('src/pages/SuperAdminPanel.jsx', 'utf8');

// 1. Rename tab from '🎨 تخصيص مظهر النظام' to '⚙️ التهيئة العامة والتخزين'
content = content.replace('🎨 تخصيص مظهر النظام', '⚙️ التهيئة العامة والتخزين');

// 2. Remove the redundant scale selector div
const scaleSelectorSearch = `              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 block">مقياس حجم الخط بالخطوط الرئيسية</label>
                <select
                  value={scaleSelector}
                  onChange={(e) => setScaleSelector(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs font-bold outline-none text-slate-800 dark:text-slate-800 dark:text-slate-200\\"
                >
                  <option value="small">صغير (مضغوط لشاشات الجوال القديمة)</option>
                  <option value="normal">عادي ومتوسط (افتراضي للمنظومة)</option>
                  <option value="large">ضخم (لكبار السن وضعاف البصر)</option>
                </select>
              </div>`;

if (content.includes('مقياس حجم الخط بالخطوط الرئيسية')) {
    // We will do a generic replacement if the exact string doesn't match perfectly.
    // It's safer to use regex to remove the whole block.
    const regex = /<div className="space-y-1\.5">\s*<label className="text-xs font-bold text-slate-500 block">مقياس حجم الخط بالخطوط الرئيسية<\/label>[\s\S]*?<\/select>\s*<\/div>/;
    content = content.replace(regex, '');
}

fs.writeFileSync('src/pages/SuperAdminPanel.jsx', content);
console.log('Fixed Appearance Redundancy.');
