import re

with open("src/pages/SuperAdminPanel.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# Fix imports
if "Archive," not in content:
    content = content.replace("import { Plus,", "import { Archive, Image, FileText, ArrowRight, ArrowLeft, Plus,")

# Add state variable
if "const [selectedStorageTeam, setSelectedStorageTeam]" not in content:
    content = content.replace(
        "const [retentionDropdown, setRetentionDropdown] = useState(config.imageRetention);",
        "const [retentionDropdown, setRetentionDropdown] = useState(config.imageRetention);\n  const [selectedStorageTeam, setSelectedStorageTeam] = useState(null);"
    )

# Replace settings block
start_marker = "        {/* Tab 2: Settings & Parameters */}"
end_marker = "        {/* Tab 4: Establishments Directory & QR Codes */}"

nested_storage_ui = """        {/* Tab 2: Settings & Parameters (Storage - Nested Routing) */}
        {activeTab === 'settings' && (
          <section className="animate-fade-in">
            {!selectedStorageTeam ? (
              /* --- Main View --- */
              <div className="glassmorphic-card p-6 space-y-6">
                <div>
                  <h2 className="text-base font-black text-slate-800 dark:text-white flex items-center gap-2">
                    <Database className="w-5 h-5 text-indigo-500" />
                    الاستهلاك الكلي للسيرفر
                  </h2>
                  <p className="text-[11px] text-slate-500 mt-1">تتبع المساحة المستخدمة لكل فريق وإدارة الملفات والمرفقات</p>
                </div>
                
                {/* Overall Storage Bar */}
                <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <div className="flex justify-between items-end mb-2">
                    <div className="flex flex-col text-right">
                      <span className="text-sm font-black text-slate-800 dark:text-slate-200">مساحة التخزين الإجمالية</span>
                      <span className="text-xs text-slate-500 font-bold">750 GB / 1000 GB مستخدمة</span>
                    </div>
                    <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">75%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 mb-2 overflow-hidden flex">
                    <div className="bg-indigo-500 h-3" style={{ width: '45%' }}></div>
                    <div className="bg-fuchsia-500 h-3" style={{ width: '20%' }}></div>
                    <div className="bg-amber-500 h-3" style={{ width: '10%' }}></div>
                  </div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-500 mt-2">
                    <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-500"></span> صور الميدان (45%)</div>
                    <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-fuchsia-500"></span> الوثائق الثبوتية (20%)</div>
                    <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span> قاعدة البيانات النصية (10%)</div>
                  </div>
                </div>

                <div className="pt-2">
                  <h3 className="text-sm font-black text-slate-700 dark:text-slate-300 mb-3 border-b border-slate-200 dark:border-slate-800 pb-2">تفاصيل الاستهلاك حسب الفريق</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {teams.map(team => (
                      <div 
                        key={team.id}
                        onClick={() => setSelectedStorageTeam(team)}
                        className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 cursor-pointer transition-all flex flex-col justify-between"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex flex-col text-right">
                            <span className="text-sm font-black text-slate-800 dark:text-slate-200">{team.name}</span>
                            <span className="text-[10px] font-bold text-slate-500">{team.sector}</span>
                          </div>
                          <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                            <Database className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                          </div>
                        </div>
                        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3 mt-1">
                          <span className="text-xs font-black text-slate-600 dark:text-slate-400 text-left dir-ltr">
                            {((team.name.length * 5.2) % 150 + 20).toFixed(1)} GB
                          </span>
                          <span className="text-[10px] font-bold text-indigo-500 flex items-center gap-1">
                            التفاصيل <ArrowLeft className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* --- Detail View (Nested Page) --- */
              <div className="glassmorphic-card p-6 space-y-6 animate-slide-in-right">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-4">
                  <div className="flex flex-col text-right">
                    <h2 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
                      <Database className="w-6 h-6 text-indigo-500" />
                      استهلاك: {selectedStorageTeam.name}
                    </h2>
                    <span className="text-xs font-bold text-slate-500">{selectedStorageTeam.sector}</span>
                  </div>
                  <button 
                    onClick={() => setSelectedStorageTeam(null)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-black transition-all flex items-center gap-1.5"
                  >
                    <ArrowRight className="w-4 h-4" />
                    الرجوع للقائمة
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-indigo-50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100 dark:border-indigo-900/30 text-center">
                    <Image className="w-6 h-6 mx-auto mb-2 text-indigo-500" />
                    <div className="text-xs font-bold text-slate-500 mb-1">الصور الميدانية</div>
                    <div className="text-xl font-black text-indigo-600 dark:text-indigo-400 dir-ltr">{((selectedStorageTeam.name.length * 3.1) % 80 + 10).toFixed(1)} GB</div>
                  </div>
                  <div className="p-4 bg-fuchsia-50 dark:bg-fuchsia-900/10 rounded-2xl border border-fuchsia-100 dark:border-fuchsia-900/30 text-center">
                    <FileText className="w-6 h-6 mx-auto mb-2 text-fuchsia-500" />
                    <div className="text-xs font-bold text-slate-500 mb-1">الوثائق والإثباتات</div>
                    <div className="text-xl font-black text-fuchsia-600 dark:text-fuchsia-400 dir-ltr">{((selectedStorageTeam.name.length * 1.5) % 40 + 5).toFixed(1)} GB</div>
                  </div>
                  <div className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-100 dark:border-amber-900/30 text-center">
                    <Database className="w-6 h-6 mx-auto mb-2 text-amber-500" />
                    <div className="text-xs font-bold text-slate-500 mb-1">البيانات النصية (JSON)</div>
                    <div className="text-xl font-black text-amber-600 dark:text-amber-400 dir-ltr">{((selectedStorageTeam.name.length * 0.4) % 10 + 1).toFixed(2)} GB</div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 mt-4 space-y-4">
                  <h3 className="text-sm font-black text-slate-800 dark:text-slate-200">إدارة مساحة الفريق</h3>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button 
                      onClick={() => { triggerAlert(`تم أرشفة الصور القديمة لفريق ${selectedStorageTeam.name}`); }}
                      className="flex-1 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-indigo-500 dark:hover:border-indigo-500 text-xs font-black text-slate-700 dark:text-slate-300 transition-all flex items-center justify-center gap-2"
                    >
                      <Archive className="w-4 h-4 text-indigo-500" />
                      أرشفة الصور (أقدم من 6 أشهر)
                    </button>
                    <button 
                      onClick={() => { 
                        if(window.confirm('هل أنت متأكد من مسح كافة الوثائق المؤقتة؟')) {
                          triggerAlert('تم تفريغ مساحة الوثائق بنجاح');
                        }
                      }}
                      className="flex-1 py-3 bg-red-50 hover:bg-red-100 dark:bg-red-900/10 dark:hover:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-xl text-xs font-black text-red-600 dark:text-red-400 transition-all flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      حذف الوثائق المؤقتة والتالفة
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}
"""

pattern = re.compile(re.escape(start_marker) + r".*?" + re.escape(end_marker), re.DOTALL)
if pattern.search(content):
    content = pattern.sub(nested_storage_ui + "\n" + end_marker, content)
else:
    print("Could not find the block to replace")

with open("src/pages/SuperAdminPanel.jsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Updated SuperAdminPanel.jsx")
