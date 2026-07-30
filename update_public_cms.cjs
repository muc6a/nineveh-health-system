const fs = require('fs');

let content = fs.readFileSync('src/pages/SuperAdminPanel.jsx', 'utf8');

const publicCmsTextarea = `<textarea value={publicCMS?.heroSubtext || ''} onChange={(e) => setPublicCMS({...publicCMS, heroSubtext: e.target.value})} rows={3} className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-right focus:outline-none focus:border-teal-500 transition-all resize-none"></textarea>
                        </div>`;

const newPublicCmsAnnouncement = `\n                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 block">إعلان عاجل في بوابة المواطنين</label>
                          <input type="text" value={publicCMS?.announcement || ''} onChange={(e) => setPublicCMS({...publicCMS, announcement: e.target.value})} placeholder="مثال: يرجى الانتباه للتحذيرات الصحية الأخيرة..." className="w-full bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-xl px-4 py-3 text-sm text-right focus:outline-none focus:border-amber-500 transition-all text-amber-700 dark:text-amber-500" />
                        </div>`;

if (!content.includes('إعلان عاجل في بوابة المواطنين')) {
    content = content.replace(publicCmsTextarea, publicCmsTextarea + newPublicCmsAnnouncement);
    fs.writeFileSync('src/pages/SuperAdminPanel.jsx', content);
    console.log('Added publicCMS announcement field.');
} else {
    console.log('Already exists.');
}
