import re

path = "src/pages/TeamDashboard.jsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Make sure GlobalHeader is imported
if "GlobalHeader" not in content:
    content = content.replace("import UnifiedSidebar from '../components/UnifiedSidebar';", "import UnifiedSidebar from '../components/UnifiedSidebar';\nimport { GlobalHeader } from '../components/GlobalHeader';")

# Find the welcome headers block
pattern = r'\{\/\* Welcome Headers with Date\/Time and Mosul Weather \*\/\}.*?(?=\{\/\* Welcome \/ No Permissions State \*\/\})'

replacement = """{/* Welcome Headers */}
        {!embeddedTab && (
          <GlobalHeader showPrintButton={true}>
            <button 
              onClick={() => setShowDisplayPrefsModal(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all cursor-pointer shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2 group whitespace-nowrap"
            >
              تخصيص العرض
            </button>
          </GlobalHeader>
        )}
        """

new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)

with open(path, "w", encoding="utf-8") as f:
    f.write(new_content)

print("Updated TeamDashboard")
