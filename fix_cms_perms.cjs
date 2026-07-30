const fs = require('fs');

let content = fs.readFileSync('src/pages/SuperAdminPanel.jsx', 'utf8');

// 1. Add Direct Link to CMS
const oldCmsText = `<p className="text-[10px] text-slate-400 leading-relaxed text-right">
                من هنا يمكنك التحكم في النصوص والصور الترحيبية المعروضة للمواطنين في شاشة البحث العام (بوابة المواطن).
              </p>`;
const newCmsText = `<p className="text-[10px] text-slate-400 leading-relaxed text-right">
                من هنا يمكنك التحكم في النصوص والصور الترحيبية المعروضة للمواطنين في شاشة البحث العام (بوابة المواطن).
              </p>
              
              <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-right mt-4">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-500">رابط البوابة المباشر (للنشر على السوشيال ميديا):</span>
                  <a href="/public-search" target="_blank" className="text-xs font-black text-indigo-600 dark:text-indigo-400 hover:underline dir-ltr text-left mt-1">
                    {window.location.origin}/public-search
                  </a>
                </div>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.origin + '/public-search');
                    triggerAlert('تم نسخ رابط البوابة بنجاح!');
                  }}
                  className="px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 rounded-lg text-[10px] font-bold cursor-pointer"
                >
                  نسخ الرابط 📋
                </button>
              </div>`;

content = content.replace(oldCmsText, newCmsText);

// 2. Add Permissions Toggle for "إظهار كفاءة الفرق"
const oldPermissionsList = `                      <label className="flex items-center gap-2 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={selectedPermissionsAccount?.permissions?.viewCoverage || false}
                          onChange={() => togglePermission('viewCoverage')}
                          className="w-4 h-4 text-teal-600 rounded"
                        />
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">خرائط التغطية والتوزيع (GIS)</span>
                      </label>
                    </div>
                  </div>`;

const newPermissionsList = `                      <label className="flex items-center gap-2 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={selectedPermissionsAccount?.permissions?.viewCoverage || false}
                          onChange={() => togglePermission('viewCoverage')}
                          className="w-4 h-4 text-teal-600 rounded"
                        />
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">خرائط التغطية والتوزيع (GIS)</span>
                      </label>
                      <label className="flex items-center gap-2 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={selectedPermissionsAccount?.permissions?.viewAnalytics || false}
                          onChange={() => togglePermission('viewAnalytics')}
                          className="w-4 h-4 text-teal-600 rounded"
                        />
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">إظهار كفاءة الفرق (للتحليلات الإدارية)</span>
                      </label>
                    </div>
                  </div>`;

content = content.replace(oldPermissionsList, newPermissionsList);

fs.writeFileSync('src/pages/SuperAdminPanel.jsx', content);
console.log('CMS and Permissions fixed.');
