import re

def unify_sidebar_profile(filepath, is_unified_sidebar=False):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # The user profile string we want
    unified_profile = """          {/* User Profile */}
          <div className="mb-6 bg-slate-50/80 dark:bg-slate-800/80 p-3 rounded-2xl border border-slate-100 dark:border-slate-700/50 flex flex-col gap-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-black text-slate-800 dark:text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  {user?.name}
                </span>
                <span className="text-[10px] text-teal-600 dark:text-teal-400 font-extrabold mt-1">
                  {user?.title || user?.role} {user?.sector ? ` - قطاع ${user.sector}` : ''}
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

    # In UnifiedSidebar.jsx
    if is_unified_sidebar:
        # replace from {/* User Profile */} to </ThemeToggle>\n          </div>
        target = r"\{/\* User Profile \*/\}.*?<ThemeToggle />\s*</div>"
        content = re.sub(target, unified_profile, content, flags=re.DOTALL)
        
        # Remove the bottom logout button if it exists
        target_bottom_logout = r"<div className=\"pt-4 border-t border-slate-200/50 dark:border-slate-800/50\">\s*<button\s*onClick=\{globalLogout\}.*?</button>\s*</div>"
        content = re.sub(target_bottom_logout, "", content, flags=re.DOTALL)
    else:
        # In AccountantPanel and SuperAdminPanel
        # They have AnimatedLogo then User Profile? No, let's check AccountantPanel
        # AccountantPanel might not have ThemeToggle imported or might have a different structure.
        pass

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)

if __name__ == "__main__":
    unify_sidebar_profile("src/components/UnifiedSidebar.jsx", True)
