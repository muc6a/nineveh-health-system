import re

with open('src/pages/TeamDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the "الإدارة المتقدمة" button I added previously
# It looks like: {(hasPerm('receiveSamples') || hasPerm('showPublicEvalsPage') || hasPerm('showDirectivesPage') || hasPerm('exportData')) && ( ... <span className="text-amber-600 font-black">الإدارة المتقدمة</span> ... )}

pattern_remove = r"\{\(hasPerm\('receiveSamples'\) \|\| hasPerm\('showPublicEvalsPage'\) \|\| hasPerm\('showDirectivesPage'\) \|\| hasPerm\('exportData'\)\) && \(\s*<button[\s\S]*?الإدارة المتقدمة[\s\S]*?</button>\s*\)\s*\}"
content = re.sub(pattern_remove, "", content)

# Add the specific buttons for Lab, Complaints, and Directives
new_buttons = """
            {hasPerm('showDirectivesPage') && (
              <button
                onClick={() => { navigate('/dashboard/director?tab=directives'); setIsSidebarOpen(false); }}
                className={`w-full text-right px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center justify-between text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40 border border-slate-200 dark:border-slate-700 mt-2`}
              >
                <div className="flex items-center gap-3">
                  <Mail className="w-4.5 h-4.5 text-slate-500" />
                  <span>التبليغات</span>
                </div>
              </button>
            )}

            {(hasPerm('showPublicEvalsPage') || hasPerm('showDeliveryPage')) && (
              <button
                onClick={() => { navigate('/dashboard/director?tab=complaints'); setIsSidebarOpen(false); }}
                className={`w-full text-right px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center justify-between text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40 border border-rose-500/20 mt-2`}
              >
                <div className="flex items-center gap-3">
                  <Compass className="w-4.5 h-4.5 text-rose-500" />
                  <span>الشكاوى</span>
                </div>
              </button>
            )}

            {(hasPerm('receiveSamples') || hasPerm('enterLabResults') || hasPerm('labArchive')) && (
              <button
                onClick={() => { navigate('/dashboard/director?tab=lab_results'); setIsSidebarOpen(false); }}
                className={`w-full text-right px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center justify-between text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40 border border-fuchsia-500/20 mt-2`}
              >
                <div className="flex items-center gap-3">
                  <Activity className="w-4.5 h-4.5 text-fuchsia-500" />
                  <span>قرارات المختبر</span>
                </div>
              </button>
            )}
"""
content = content.replace("{hasPerm('showReportsPage')", new_buttons + "\n            {hasPerm('showReportsPage')")

# Make sure icons are imported
if "Compass" not in content:
    content = content.replace("import { ", "import { Compass, Mail, Activity, ", 1)

with open('src/pages/TeamDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed TeamDashboard sidebar")
