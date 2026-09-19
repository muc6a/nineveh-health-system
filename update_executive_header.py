import re

path = "src/pages/ExecutivePortal.jsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Make sure GlobalHeader is imported. We already checked that it IS imported on line 3!
# Let's just find the Welcome Headers block
pattern = r'\{\/\* Welcome Headers \*\/\}.*?(?=\{\/\* Main Grid \*\/\}|\{activeTab === \'strategic\' \?|\{\/\* Dynamic Main Content \*\/\})'

replacement = """{/* Welcome Headers */}
        <div className="relative z-40 mb-6">
          <GlobalHeader showPrintButton={true}>
            <button 
              onClick={() => setShowDisplayPrefsModal(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all cursor-pointer shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2 group whitespace-nowrap"
            >
              تخصيص العرض
            </button>
          </GlobalHeader>
        </div>
        
        {/* Dynamic Main Content */}
        """

new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)

with open(path, "w", encoding="utf-8") as f:
    f.write(new_content)

print("Updated ExecutivePortal")
