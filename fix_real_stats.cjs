const fs = require('fs');
let content = fs.readFileSync('src/pages/SuperAdminPanel.jsx', 'utf8');

// Directors Stats
const dirSearch = `                  <button
                    onClick={() => handleOpenAddAccount('director')}
                    className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs transition-all cursor-pointer"
                  >
                    ➕ إضافة حساب مدير جديد
                  </button>
                </div>`;

const dirReplace = dirSearch + `\n
                {/* Directors Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
                    <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{directors?.length || 0}</span>
                    <p className="text-[10px] font-bold text-slate-500 mt-1">إجمالي المدراء</p>
                  </div>
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800/30 text-center">
                    <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{directors?.filter(d => d.status !== 'frozen').length || 0}</span>
                    <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-500 mt-1">المدراء النشطين</p>
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl border border-slate-300 dark:border-slate-700 text-center">
                    <span className="text-2xl font-black text-slate-500 dark:text-slate-400">{directors?.filter(d => d.status === 'frozen').length || 0}</span>
                    <p className="text-[10px] font-bold text-slate-500 mt-1">المدراء المجمدين</p>
                  </div>
                </div>`;

if (!content.includes('إجمالي المدراء')) {
    content = content.replace(dirSearch, dirReplace);
}

// Trackers Stats
const trackerSearch = `                  <button
                    onClick={() => {
                      setAccountModalState({ isOpen: true, mode: 'add', data: null, accountType: 'tracker' });
                    }}
                    className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs transition-all cursor-pointer"
                  >
                    ➕ إضافة حساب متابع جديد
                  </button>
                </div>`;

const trackerReplace = trackerSearch + `\n
                {/* Trackers Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
                    <span className="text-2xl font-black text-amber-600 dark:text-amber-400">{trackers?.length || 0}</span>
                    <p className="text-[10px] font-bold text-slate-500 mt-1">إجمالي المتابعين</p>
                  </div>
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800/30 text-center">
                    <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{trackers?.filter(t => t.status !== 'frozen').length || 0}</span>
                    <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-500 mt-1">المتابعين النشطين</p>
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl border border-slate-300 dark:border-slate-700 text-center">
                    <span className="text-2xl font-black text-slate-500 dark:text-slate-400">{trackers?.filter(t => t.status === 'frozen').length || 0}</span>
                    <p className="text-[10px] font-bold text-slate-500 mt-1">المتابعين المجمدين</p>
                  </div>
                </div>`;

if (!content.includes('إجمالي المتابعين')) {
    content = content.replace(trackerSearch, trackerReplace);
}

fs.writeFileSync('src/pages/SuperAdminPanel.jsx', content);
console.log('Fixed Stats');
