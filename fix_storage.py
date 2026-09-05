import re

with open("src/pages/SuperAdminPanel.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# Add icons to imports if missing
lucide_import_pattern = r"import { (.*?) } from 'lucide-react';"
lucide_match = re.search(lucide_import_pattern, content)
if lucide_match:
    icons = lucide_match.group(1)
    if 'ChevronLeft' not in icons:
        icons += ", ChevronLeft"
    if 'ChevronRight' not in icons:
        icons += ", ChevronRight"
    if 'HardDrive' not in icons:
        icons += ", HardDrive"
    content = content.replace(lucide_match.group(0), f"import {{ {icons} }} from 'lucide-react';")

# Add state selectedStorageTeam
state_pattern = r"const \[activeTab, setActiveTab\] = useState\(\(\) => sessionStorage\.getItem\('superAdminActiveTab'\) \|\| 'roster'\);"
new_state = "const [activeTab, setActiveTab] = useState(() => sessionStorage.getItem('superAdminActiveTab') || 'roster');\n  const [selectedStorageTeam, setSelectedStorageTeam] = useState(null);"
content = content.replace(state_pattern, new_state)

# Replace the settings tab
start_tag = "{activeTab === 'settings' && ("
end_tag = "        {/* Tab 4: Establishments Directory & QR Codes */}"

# We need to extract the exact block between these two and replace it.
new_block = """        {activeTab === 'settings' && (
          <section className="glassmorphic-card p-6 min-h-[500px]">
            {!selectedStorageTeam ? (
              <div className="space-y-6 animate-in fade-in duration-300">
                {/* Main View: Overall Storage */}
                <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 text-right">
                  <h3 className="text-lg font-black text-white flex items-center justify-end gap-2 mb-3">
                    الاستهلاك الكلي للسيرفر
                    <HardDrive className="w-5 h-5 text-teal-400" />
                  </h3>
                  <div className="w-full bg-slate-800 rounded-full h-3 mb-3 overflow-hidden">
                    <div className="bg-gradient-to-l from-teal-500 to-emerald-400 h-3 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-slate-400 flex-row-reverse">
                    <span>المستخدم: 14.0 GB من أصل 20 GB</span>
                    <span>المتبقي: 6.0 GB</span>
                  </div>
                </div>

                {/* Main View: Teams List */}
                <div className="space-y-3 text-right">
                  <h4 className="text-sm font-black text-slate-800 dark:text-slate-200 px-2 pb-1">استهلاك الفرق والأقسام</h4>
                  {teams.map(team => (
                    <button 
                      key={team.id}
                      onClick={() => setSelectedStorageTeam(team)}
                      className="w-full flex items-center justify-between p-4 bg-white/50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer group shadow-sm hover:shadow-md"
                    >
                      <ChevronLeft className="w-5 h-5 text-slate-400 group-hover:text-teal-500 transition-colors" />
                      
                      <div className="flex items-center gap-4 flex-1 justify-end">
                        <div className="flex flex-col text-right">
                          <span className="text-sm font-black text-slate-800 dark:text-slate-200">{team.name} ({team.sector})</span>
                          <span className="text-[11px] text-slate-500 font-bold">{120 + team.name.length * 15} MB مستخدم</span>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center text-teal-600 shrink-0">
                          <Database className="w-5 h-5" />
                        </div>
                      </div>
                    </button>
                  ))}
                  {/* Central Control Mock Item */}
                  <button 
                      onClick={() => setSelectedStorageTeam({id: 'central', name: 'الرقابة المركزية', sector: 'المقر العام'})}
                      className="w-full flex items-center justify-between p-4 bg-white/50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer group shadow-sm hover:shadow-md"
                    >
                      <ChevronLeft className="w-5 h-5 text-slate-400 group-hover:text-teal-500 transition-colors" />
                      
                      <div className="flex items-center gap-4 flex-1 justify-end">
                        <div className="flex flex-col text-right">
                          <span className="text-sm font-black text-slate-800 dark:text-slate-200">الرقابة المركزية (المقر العام)</span>
                          <span className="text-[11px] text-slate-500 font-bold">840 MB مستخدم</span>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center text-teal-600 shrink-0">
                          <Database className="w-5 h-5" />
                        </div>
                      </div>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6 animate-in slide-in-from-left-4 duration-300">
                {/* Detail View Header */}
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                  <h3 className="text-base font-black text-slate-800 dark:text-white flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center text-teal-600">
                      <Database className="w-5 h-5" />
                    </div>
                    {selectedStorageTeam.name}
                  </h3>
                  <button 
                    onClick={() => setSelectedStorageTeam(null)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors cursor-pointer"
                  >
                    <span>رجوع</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Detail Breakdown */}
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 text-right space-y-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black text-teal-600">{120 + selectedStorageTeam.name.length * 15} MB</span>
                    <span className="text-xs font-bold text-slate-500">الحجم الكلي للاستهلاك</span>
                  </div>
                  
                  <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-800 dark:text-slate-200">{90 + selectedStorageTeam.name.length * 10} MB</span>
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-400">الصور والمرفقات (Media)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-800 dark:text-slate-200">{20 + selectedStorageTeam.name.length * 3} MB</span>
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-400">قواعد البيانات (Data)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-800 dark:text-slate-200">{10 + selectedStorageTeam.name.length * 2} MB</span>
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-400">المستندات (Documents)</span>
                    </div>
                  </div>
                </div>

                {/* Settings / Actions for this team */}
                <div className="space-y-4 pt-4">
                  <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 text-right px-2">إجراءات المساحة والتخزين</h4>
                  
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-right shadow-sm">
                    <div className="w-1/2 md:w-1/3">
                      <select
                        value={retentionDropdown}
                        onChange={(e) => setRetentionDropdown(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-xs font-bold outline-none text-slate-800 dark:text-slate-200 cursor-pointer"
                      >
                        <option value="3 Months">أرشفة بعد 3 أشهر</option>
                        <option value="6 Months">أرشفة بعد 6 أشهر</option>
                        <option value="12 Months">أرشفة بعد سنة كاملة</option>
                        <option value="Disable Auto-Delete">إيقاف الأرشفة التلقائية</option>
                      </select>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-slate-800 dark:text-slate-200">أرشفة الصور القديمة</span>
                      <span className="text-[10px] text-slate-400 font-medium mt-1">أرشفة المرفقات لتوفير مساحة الاستهلاك</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                        triggerAlert('🗑️ تم إفراغ الذاكرة العشوائية وتخزين البيانات المؤقتة لهذا الفريق بنجاح.');
                    }}
                    className="w-full p-4 rounded-2xl bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors flex items-center justify-between group cursor-pointer shadow-sm"
                  >
                    <Trash2 className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform shrink-0" />
                    <div className="flex flex-col text-right">
                      <span className="text-xs font-black text-red-500">حذف البيانات المؤقتة (Clear Cache)</span>
                      <span className="text-[10px] text-red-400/80 font-medium mt-1">تفريغ المساحة المخبأة للفريق من السيرفر</span>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => {
                        saveZeroCodeConfig();
                        triggerAlert('تم تطبيق وحفظ إعدادات التخزين للفريق.');
                    }}
                    className="w-full mt-4 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-sm transition-all shadow-lg shadow-teal-600/20 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    حفظ التغييرات
                  </button>
                </div>
              </div>
            )}
          </section>
        )}
"""

pattern = re.compile(re.escape(start_tag) + r".*?" + r"(?=" + re.escape(end_tag) + r")", re.DOTALL)
content = pattern.sub(new_block, content)

with open("src/pages/SuperAdminPanel.jsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Updated SuperAdminPanel.jsx storage UI")
