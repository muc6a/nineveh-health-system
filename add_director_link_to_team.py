import re

with open('src/pages/TeamDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

sidebar_btn = """            {(hasPerm('receiveSamples') || hasPerm('showPublicEvalsPage') || hasPerm('showDirectivesPage') || hasPerm('exportData')) && (
              <button
                onClick={() => { navigate('/dashboard/director'); setIsSidebarOpen(false); }}
                className={`w-full text-right px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center justify-between text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40 border border-amber-500/30 bg-amber-500/5`}
              >
                <div className="flex items-center gap-3">
                  <ShieldAlert className="w-4.5 h-4.5 text-amber-500" />
                  <span className="text-amber-600 font-black">بوابة الإدارة الشاملة</span>
                </div>
              </button>
            )}
"""
if 'بوابة الإدارة الشاملة' not in content:
    content = content.replace("{hasPerm('showReportsPage')", sidebar_btn + "\n            {hasPerm('showReportsPage')")
    with open('src/pages/TeamDashboard.jsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Added advanced link")
