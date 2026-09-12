import re

def fix_accountant_panel_5():
    with open("src/pages/AccountantPanel.jsx", "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Remove "بوابة المحاسبين (الإدارة المالية)"
    title_regex = r"<span className=\"text-\[11px\] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block px-3 mb-2\">\s*بوابة المحاسبين \(الإدارة المالية\)\s*</span>"
    title_replacement = ""
    content = re.sub(title_regex, title_replacement, content)
    
    # 2. Replace activeTab === "directives" block with TeamDashboard embeddedTab="directives"
    directives_regex = r"\{\/\* --- Tab: Directives --- \*\/\}[\s\S]*?\{activeTab === \"reconciliation\""
    directives_replacement = """{/* --- Tab: Directives --- */}
        {activeTab === "directives" && (
          <div className="w-full h-full min-h-[85vh]">
            <TeamDashboard embeddedTab="directives" />
          </div>
        )}

        {/* --- Tab: Reconciliation --- */}
        {activeTab === "reconciliation\""""
    content = re.sub(directives_regex, directives_replacement, content)
    
    with open("src/pages/AccountantPanel.jsx", "w", encoding="utf-8") as f:
        f.write(content)

if __name__ == "__main__":
    fix_accountant_panel_5()
    print("Done fixes 5")
