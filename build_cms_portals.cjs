const fs = require('fs');

let content = fs.readFileSync('src/pages/SuperAdminPanel.jsx', 'utf8');

// 1. Rename tab in Sidebar
content = content.replace(
  '<Globe className="w-4 h-4" />\n                بوابة المواطنين (CMS)',
  '<Globe className="w-4 h-4" />\n                إدارة البوابات (CMS)'
);

// 2. We need a state for CMS Sub Tabs. Let's add it near subSettingsTab
const stateSearch = `const [subSettingsTab, setSubSettingsTab] = useState('evaluations');`;
const stateReplace = `const [subSettingsTab, setSubSettingsTab] = useState('evaluations');
  const [cmsTab, setCmsTab] = useState('public'); // public, login, owner`;
if (!content.includes('const [cmsTab, setCmsTab]')) {
    content = content.replace(stateSearch, stateReplace);
}

// 3. Replace the CMS UI Block
// I will find the start and end of the public_cms block and replace it entirely.
// Since it's a bit long, I'll use a regex or string split.
const cmsUiStart = `{subSettingsTab === 'public_cms' && (`;
const cmsUiEndIndex = content.indexOf(`{subSettingsTab === 'database' && (`);
const beforeCms = content.substring(0, content.indexOf(cmsUiStart));
const afterCms = content.substring(cmsUiEndIndex);

const newCmsUI = `{subSettingsTab === 'public_cms' && (
                <div className="glassmorphic-card p-6 space-y-6">
                  <h2 className="text-base font-black text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <Globe className="w-5 h-5 text-teal-600" />
                    <span>إدارة البوابات (Portals CMS)</span>
                  </h2>

                  <p className="text-[10px] text-slate-400 leading-relaxed text-right">
                    نظام مركزي للتحكم بجميع بوابات المنظومة (تسجيل الدخول، بوابة المواطن، وبوابة أصحاب المنشآت).
                  </p>

                  {/* CMS Tabs */}
                  <div className="flex gap-4 border-b border-slate-200 dark:border-slate-800 pb-3 mt-4">
                    <button
                      onClick={() => setCmsTab('login')}
                      className={\`pb-2 text-xs font-black transition-all cursor-pointer \${
                        cmsTab === 'login'
                          ? 'border-b-2 border-teal-600 text-teal-600 dark:text-teal-400 font-extrabold'
                          : 'text-slate-400 hover:text-slate-600'
                      }\`}
                    >
                      تسجيل الدخول للموقع
                    </button>
                    <button
                      onClick={() => setCmsTab('public')}
                      className={\`pb-2 text-xs font-black transition-all cursor-pointer \${
                        cmsTab === 'public'
                          ? 'border-b-2 border-teal-600 text-teal-600 dark:text-teal-400 font-extrabold'
                          : 'text-slate-400 hover:text-slate-600'
                      }\`}
                    >
                      بوابة المواطن (الاستعلام)
                    </button>
                    <button
                      onClick={() => setCmsTab('owner')}
                      className={\`pb-2 text-xs font-black transition-all cursor-pointer \${
                        cmsTab === 'owner'
                          ? 'border-b-2 border-teal-600 text-teal-600 dark:text-teal-400 font-extrabold'
                          : 'text-slate-400 hover:text-slate-600'
                      }\`}
                    >
                      بوابة أصحاب المطاعم
                    </button>
                  </div>

                  {/* CMS Content */}
                  <div className="space-y-4 pt-4 text-right">
                    
                    {cmsTab === 'login' && (
                      <div className="space-y-4 animate-fade-in">
                        <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-500">الرابط المباشر للبوابة:</span>
                            <a href="/login" target="_blank" className="text-xs font-black text-indigo-600 dark:text-indigo-400 hover:underline dir-ltr text-left mt-1">
                              {window.location.origin}/login
                            </a>
                          </div>
                          <button onClick={() => { navigator.clipboard.writeText(window.location.origin + '/login'); triggerAlert('تم النسخ!'); }} className="px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 rounded-lg text-[10px] font-bold">نسخ الرابط</button>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 block">العنوان الرئيسي للواجهة</label>
                          <input type="text" value={loginCMS?.heroTitle || ''} onChange={(e) => setLoginCMS({...loginCMS, heroTitle: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-right focus:outline-none focus:border-teal-500 transition-all font-bold" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 block">النص الوصفي الفرعي</label>
                          <textarea value={loginCMS?.heroSubtext || ''} onChange={(e) => setLoginCMS({...loginCMS, heroSubtext: e.target.value})} rows={2} className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-right focus:outline-none focus:border-teal-500 transition-all resize-none"></textarea>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 block">رسالة تعميم للموظفين (تظهر أعلى الدخول)</label>
                          <input type="text" value={loginCMS?.announcement || ''} onChange={(e) => setLoginCMS({...loginCMS, announcement: e.target.value})} placeholder="مثال: يرجى تحديث التطبيق إلى آخر إصدار..." className="w-full bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-xl px-4 py-3 text-sm text-right focus:outline-none focus:border-amber-500 transition-all text-amber-700 dark:text-amber-500" />
                        </div>
                      </div>
                    )}

                    {cmsTab === 'public' && (
                      <div className="space-y-4 animate-fade-in">
                        <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-500">الرابط المباشر للبوابة:</span>
                            <a href="/public-search" target="_blank" className="text-xs font-black text-indigo-600 dark:text-indigo-400 hover:underline dir-ltr text-left mt-1">
                              {window.location.origin}/public-search
                            </a>
                          </div>
                          <button onClick={() => { navigator.clipboard.writeText(window.location.origin + '/public-search'); triggerAlert('تم النسخ!'); }} className="px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 rounded-lg text-[10px] font-bold">نسخ الرابط</button>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 block">العنوان الترحيبي الرئيسي</label>
                          <input type="text" value={publicCMS?.heroTitle || ''} onChange={(e) => setPublicCMS({...publicCMS, heroTitle: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-right focus:outline-none focus:border-teal-500 transition-all font-bold" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 block">النص الترحيبي الفرعي (الوصف)</label>
                          <textarea value={publicCMS?.heroSubtext || ''} onChange={(e) => setPublicCMS({...publicCMS, heroSubtext: e.target.value})} rows={3} className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-right focus:outline-none focus:border-teal-500 transition-all resize-none"></textarea>
                        </div>
                      </div>
                    )}

                    {cmsTab === 'owner' && (
                      <div className="space-y-4 animate-fade-in">
                        <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-500">الرابط المباشر للبوابة:</span>
                            <a href="/owner" target="_blank" className="text-xs font-black text-indigo-600 dark:text-indigo-400 hover:underline dir-ltr text-left mt-1">
                              {window.location.origin}/owner
                            </a>
                          </div>
                          <button onClick={() => { navigator.clipboard.writeText(window.location.origin + '/owner'); triggerAlert('تم النسخ!'); }} className="px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 rounded-lg text-[10px] font-bold">نسخ الرابط</button>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 block">العنوان الترحيبي الرئيسي</label>
                          <input type="text" value={ownerCMS?.heroTitle || ''} onChange={(e) => setOwnerCMS({...ownerCMS, heroTitle: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-right focus:outline-none focus:border-teal-500 transition-all font-bold" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 block">النص الوصفي الفرعي</label>
                          <textarea value={ownerCMS?.heroSubtext || ''} onChange={(e) => setOwnerCMS({...ownerCMS, heroSubtext: e.target.value})} rows={3} className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-right focus:outline-none focus:border-teal-500 transition-all resize-none"></textarea>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 block">تنبيه عاجل لأصحاب المنشآت</label>
                          <input type="text" value={ownerCMS?.announcement || ''} onChange={(e) => setOwnerCMS({...ownerCMS, announcement: e.target.value})} placeholder="مثال: يرجى تجديد الشهادات الصحية قبل نهاية الشهر..." className="w-full bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 rounded-xl px-4 py-3 text-sm text-right focus:outline-none focus:border-red-500 transition-all text-red-700 dark:text-red-500" />
                        </div>
                      </div>
                    )}
                    
                  </div>
                </div>
              )}
              
`;

// Also I need to make sure I add loginCMS, setLoginCMS, ownerCMS, setOwnerCMS to destructuring!
let finalContent = beforeCms + newCmsUI + afterCms;

const destructuringSearch = `uiPreferences, setUiPreferences } = useContext(AppContext);`;
const destructuringReplace = `uiPreferences, setUiPreferences, loginCMS, setLoginCMS, ownerCMS, setOwnerCMS } = useContext(AppContext);`;
if (!finalContent.includes('setLoginCMS')) {
    finalContent = finalContent.replace(destructuringSearch, destructuringReplace);
}

fs.writeFileSync('src/pages/SuperAdminPanel.jsx', finalContent);
console.log('SuperAdminPanel Portals CMS successfully added.');
