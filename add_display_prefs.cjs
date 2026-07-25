const fs = require('fs');

let content = fs.readFileSync('src/pages/SuperAdminPanel.jsx', 'utf8');

// 1. Add Tab Button for Display Prefs
const oldTabsEnd = `                <ShieldAlert className="w-4 h-4" />
                تحكم النظام ومعايير القياس
              </button>
            </div>`;

const newTabsEnd = `                <ShieldAlert className="w-4 h-4" />
                تحكم النظام ومعايير القياس
              </button>
              <button
                onClick={() => setSubSettingsTab('display_prefs')}
                className={\`pb-2 text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer \${
                  subSettingsTab === 'display_prefs'
                    ? 'border-b-2 border-teal-600 text-teal-600 dark:text-teal-400 font-extrabold'
                    : 'text-slate-400 hover:text-slate-600'
                }\`}
              >
                <Eye className="w-4 h-4" />
                تخصيص العرض والخطوط
              </button>
            </div>`;

content = content.replace(oldTabsEnd, newTabsEnd);

// 2. Add Display Prefs UI Content
const displayPrefsUI = `
              {subSettingsTab === 'display_prefs' && (
                <div className="glassmorphic-card p-6 space-y-6">
                  <h2 className="text-base font-black text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <Eye className="w-5 h-5 text-teal-600" />
                    <span>تخصيص العرض والخطوط (Display & Accessibility)</span>
                  </h2>
                  <p className="text-[10px] text-slate-400 leading-relaxed text-right">
                    تحكم بمقاسات الخطوط وكثافة عرض البيانات لراحتك. يتم حفظ هذه التفضيلات في حسابك الخاص ولا تؤثر على المستخدمين الآخرين.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Controls */}
                    <div className="space-y-6 text-right">
                      {/* Density Control */}
                      <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">كثافة البيانات (Density Mode)</label>
                        <div className="flex gap-4">
                          <label className={\`flex-1 cursor-pointer p-4 rounded-xl border-2 transition-all \${uiPreferences.density === 'comfortable' ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'}\`}>
                            <input
                              type="radio"
                              name="density"
                              value="comfortable"
                              className="hidden"
                              checked={uiPreferences.density === 'comfortable'}
                              onChange={(e) => setUiPreferences({...uiPreferences, density: e.target.value})}
                            />
                            <div className="text-center">
                              <div className="text-sm font-black text-slate-700 dark:text-slate-300">مريح (Comfortable)</div>
                              <p className="text-[10px] text-slate-500 mt-1">مسافات واسعة مناسبة للحواسيب</p>
                            </div>
                          </label>
                          <label className={\`flex-1 cursor-pointer p-4 rounded-xl border-2 transition-all \${uiPreferences.density === 'compact' ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'}\`}>
                            <input
                              type="radio"
                              name="density"
                              value="compact"
                              className="hidden"
                              checked={uiPreferences.density === 'compact'}
                              onChange={(e) => setUiPreferences({...uiPreferences, density: e.target.value})}
                            />
                            <div className="text-center">
                              <div className="text-sm font-black text-slate-700 dark:text-slate-300">مضغوط (Compact)</div>
                              <p className="text-[10px] text-slate-500 mt-1">مسافات أقل مناسبة للأجهزة المحمولة</p>
                            </div>
                          </label>
                        </div>
                      </div>

                      {/* Typography Controls */}
                      <div className="space-y-4">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">حجم الخطوط (Typography)</label>
                        
                        <div className="space-y-1.5">
                          <label className="text-[10px] text-slate-500 flex justify-between">
                            <span>حجم العناوين</span>
                            <span className="font-bold dir-ltr">{uiPreferences.headingSize}</span>
                          </label>
                          <input 
                            type="range" 
                            min="14" 
                            max="32" 
                            value={parseInt(uiPreferences.headingSize)} 
                            onChange={(e) => setUiPreferences({...uiPreferences, headingSize: e.target.value + 'px'})}
                            className="w-full accent-teal-600"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] text-slate-500 flex justify-between">
                            <span>حجم النصوص</span>
                            <span className="font-bold dir-ltr">{uiPreferences.bodySize}</span>
                          </label>
                          <input 
                            type="range" 
                            min="10" 
                            max="20" 
                            value={parseInt(uiPreferences.bodySize)} 
                            onChange={(e) => setUiPreferences({...uiPreferences, bodySize: e.target.value + 'px'})}
                            className="w-full accent-teal-600"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Live Preview */}
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 text-right">
                      <h3 className="text-sm font-bold text-slate-500 mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">نافذة العرض المباشر (Live Preview)</h3>
                      <div className={\`bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden \${uiPreferences.density === 'compact' ? 'p-3 space-y-2' : 'p-6 space-y-4'}\`}>
                        <h4 
                          style={{ fontSize: uiPreferences.headingSize, lineHeight: 1.2 }} 
                          className="font-black text-slate-800 dark:text-white"
                        >
                          مطعم وحلويات الأمين
                        </h4>
                        <p 
                          style={{ fontSize: uiPreferences.bodySize, lineHeight: 1.6 }} 
                          className="text-slate-600 dark:text-slate-400"
                        >
                          تم إجراء الكشف الميداني في حي النور ومطابقة الشروط الصحية. المنشأة مستوفية لجميع معايير الجودة والنظافة العامة.
                        </p>
                        <div className={\`flex gap-2 \${uiPreferences.density === 'compact' ? 'mt-2' : 'mt-4'}\`}>
                          <span className={\`bg-teal-50 text-teal-600 rounded-lg font-bold \${uiPreferences.density === 'compact' ? 'px-2 py-1 text-[10px]' : 'px-3 py-1.5 text-xs'}\`}>مطابق للشروط</span>
                          <span className={\`bg-slate-100 text-slate-600 rounded-lg font-bold \${uiPreferences.density === 'compact' ? 'px-2 py-1 text-[10px]' : 'px-3 py-1.5 text-xs'}\`}>تقييم 95%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}`;

const injectionPoint = `<div className="grid grid-cols-1 gap-8">`;
content = content.replace(injectionPoint, injectionPoint + '\n' + displayPrefsUI);

fs.writeFileSync('src/pages/SuperAdminPanel.jsx', content);
console.log('SuperAdminPanel updated with Display preferences.');
