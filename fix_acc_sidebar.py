import re

with open("src/pages/AccountantPanel.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Remove the footer
target_footer = r"\{/\* User context footer \*/\}.*?تسجيل الخروج\s*</span>\s*</button>\s*</div>"
content = re.sub(target_footer, "", content, flags=re.DOTALL)

# 2. Add the profile at the top of the sidebar
target_logo = r"(<AnimatedLogo variant=\"sidebar\" className=\"mb-6\" />)"
replacement_profile = r"""\1

          {/* User Profile */}
          <div className="mb-6 bg-slate-50/80 dark:bg-slate-800/80 p-3 rounded-2xl border border-slate-100 dark:border-slate-700/50 flex flex-col gap-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-black text-slate-800 dark:text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  {user?.name}
                </span>
                <span className="text-[10px] text-teal-600 dark:text-teal-400 font-extrabold mt-1">
                  {user?.role === "financial_accountant" ? "محاسب مالي" : "محاسب الدائرة"} {user?.sector ? ` - قطاع ${user.sector}` : ''}
                </span>
              </div>
              <ThemeToggle />
            </div>
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
              <button 
                onClick={globalLogout}
                className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
              >
                تسجيل الخروج
              </button>
            </div>
          </div>"""
content = re.sub(target_logo, replacement_profile, content)

with open("src/pages/AccountantPanel.jsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Done AccountantPanel")
