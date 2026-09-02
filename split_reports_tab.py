import re

with open('src/pages/TeamDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# First, modify the Sidebar Buttons
content = content.replace(
    "navigate('/dashboard/director?tab=directives'); setIsSidebarOpen(false);",
    "setActiveTab('directives'); setIsSidebarOpen(false);"
)
content = content.replace(
    "navigate('/dashboard/director?tab=complaints'); setIsSidebarOpen(false);",
    "setActiveTab('complaints'); setIsSidebarOpen(false);"
)
content = content.replace(
    "navigate('/dashboard/director?tab=lab_results'); setIsSidebarOpen(false);",
    "setActiveTab('lab_results'); setIsSidebarOpen(false);"
)

# Second, find the reports tab block and replace it
# It looks like:
#         {activeTab === 'reports' && hasPerm('showTeamDashboard') && (
#           <div className="space-y-6">
# ...
#             </div>
#           </div>
#         )}

reports_start = content.find("{activeTab === 'reports' && hasPerm('showTeamDashboard') && (")
# The end is right before "{/* Tab C: Incidents Box */}" if there was one, or before "</main>"
# Let's find "</main>"
main_end = content.find("</main>", reports_start)

# We can carefully extract it, or since I know the exact HTML structure, I can just use a large string replacement.
# Let's write a replacement block.
replacement = """
        {activeTab === 'directives' && hasPerm('showDirectivesPage') && (
          <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-6">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white">التبليغات الإدارية</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">تتبع التوجيهات الرسمية الصادرة من الإدارة العليا والردود عليها</p>
            </div>
            <div className="glassmorphic-card p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
                <h3 className="text-xs font-black text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                  <span>📢 التبليغات الصادرة من المدير</span>
                </h3>
                <span className="text-[10px] bg-amber-500 text-white px-2 py-0.5 rounded-lg font-black">{myDirectives.length} توجيه</span>
              </div>
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {myDirectives.map((dir) => (
                  <div key={dir.id} className={`p-4 rounded-2xl relative overflow-hidden transition-all hover:scale-[1.01] ${dir.text.startsWith('رد على تبليغ:') ? 'bg-teal-900/40 border-2 border-teal-500 shadow-lg shadow-teal-500/20' : 'border border-amber-500/30 bg-amber-500/10 dark:bg-amber-500/20'}`}>
                    <div className={`absolute top-0 right-0 h-full ${dir.text.startsWith('رد على تبليغ:') ? 'w-2 bg-teal-500' : 'w-1 bg-amber-500'}`}></div>
                    <div className="flex justify-between items-center mb-1 relative z-10">
                      <span className={`text-[10px] text-white px-2 py-0.5 rounded-lg font-black ${dir.text.startsWith('رد على تبليغ:') ? 'bg-teal-600' : 'bg-amber-500'}`}>
                        {dir.text.startsWith('رد على تبليغ:') ? 'رد جديد 💬' : 'توجيه عاجل'}
                      </span>
                      <span className={`text-[9px] font-bold ${dir.text.startsWith('رد على تبليغ:') ? 'text-teal-400' : 'text-amber-600 dark:text-amber-400'}`}>{dir.date}</span>
                    </div>
                    <p className={`text-xs font-black leading-relaxed mt-1.5 relative z-10 ${dir.text.startsWith('رد على تبليغ:') ? 'text-teal-100' : 'text-amber-900 dark:text-amber-200'}`}>{dir.text}</p>
                    <span className="text-[9px] text-slate-400 block mt-2">الجهة المرسلة: {dir.sender}</span>
                  </div>
                ))}
                {myDirectives.length === 0 && (
                  <div className="text-center p-8 text-slate-400 font-bold text-xs bg-slate-100/50 dark:bg-slate-900/50 rounded-2xl">
                    لا توجد توجيهات رسمية نشطة حالياً لهذا القطاع.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'complaints' && (hasPerm('showPublicEvalsPage') || hasPerm('showDeliveryPage')) && (
          <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-6">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white">سجل الشكاوى</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">متابعة شكاوى المواطنين والمستهلكين ضمن قاطع المسؤولية</p>
            </div>
            <div className="glassmorphic-card p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-teal-500/20 pb-2">
                <h3 className="text-xs font-black text-teal-700 dark:text-teal-400 flex items-center gap-1.5">
                  <span>📩 بلاغات وشكاوى المواطنين والمستهلكين</span>
                </h3>
                <span className="text-[10px] bg-teal-500 text-white px-2 py-0.5 rounded-lg font-black">{teamReports.length} شكوى</span>
              </div>
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {teamReports.map((r) => (
                  <div key={r.id} className="p-4 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/20 relative overflow-hidden transition-all hover:scale-[1.01]">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-black text-slate-800 dark:text-white">{r.establishmentName}</span>
                      <span className="text-[9px] text-slate-400 font-bold">{r.date}</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 leading-relaxed mt-1.5">{r.details}</p>
                    <div className="mt-3 flex items-center justify-between">
                      {r.isDelivery && (
                        <span className="px-2 py-0.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 font-extrabold text-[9px] flex items-center gap-1 shrink-0">
                          <Package className="w-3 h-3" />
                          <span>📦 توصيل منزلي</span>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                {teamReports.length === 0 && (
                  <div className="text-center p-8 text-slate-400 font-bold text-xs bg-slate-100/50 dark:bg-slate-900/50 rounded-2xl">
                    صندوق بلاغات المواطنين خالٍ تماماً لهذا القطاع.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
"""

# Extract the block to replace
reports_block = content[reports_start:main_end]

content = content.replace(reports_block, replacement)

# We also need to remove the "صندوق البلاغات والتقارير" tab from the sidebar.
sidebar_reports_pattern = r"\{hasPerm\('showTeamDashboard'\) && \(\s*<button\s*onClick=\{\(\) => \{ setActiveTab\('reports'\); setIsSidebarOpen\(false\); \}\}[\s\S]*?📑 صندوق البلاغات والتقارير[\s\S]*?</button>\s*\)\s*\}"
content = re.sub(sidebar_reports_pattern, "", content)

# And replace `activeTab === 'reports'` in the useEffect logic
content = content.replace("activeTab === 'reports'", "(activeTab === 'directives' || activeTab === 'complaints')")

with open('src/pages/TeamDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

