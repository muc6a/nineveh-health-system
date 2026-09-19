import re

path = "src/pages/LabDashboard.jsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace the header block in LabDashboard
pattern = r"<header className=\"shrink-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 flex flex-col p-4 sticky top-0 z-30\">\n.*?<GlobalHeader[\s\S]*?/>\n\s*</header>"

replacement = """<div className="relative z-40 mb-6 mt-4 md:mt-0">
          <div className="flex items-center gap-3 md:hidden mb-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -mr-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
          <GlobalHeader>
            <button
              onClick={() => setShowDisplayPrefsModal(true)}
              className="px-4 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all cursor-pointer shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2 group whitespace-nowrap"
            >
              تخصيص العرض
            </button>
          </GlobalHeader>
        </div>"""

content = re.sub(pattern, replacement, content)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("Fixed Lab Header")
