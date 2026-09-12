import re

def fix_lab():
    with open("src/pages/LabDashboard.jsx", "r", encoding="utf-8") as f:
        content = f.read()

    unified_profile = """          {/* User Profile */}
          <div className="mb-6 bg-slate-50/80 dark:bg-slate-800/80 p-3 rounded-2xl border border-slate-100 dark:border-slate-700/50 flex flex-col gap-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-black text-slate-800 dark:text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  {user?.name}
                </span>
                <span className="text-[10px] text-teal-600 dark:text-teal-400 font-extrabold mt-1">
                  {user?.title || user?.role === 'lab' ? 'المختبر المركزي العام' : user?.role} {user?.sector ? ` - قطاع ${user.sector}` : ''}
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

    target = r"\{/\* User Profile \*/\}.*?<ThemeToggle />\s*</div>"
    content = re.sub(target, unified_profile, content, flags=re.DOTALL)

    target_logout = r"<div className=\"pt-4 border-t border-slate-200/50 dark:border-slate-800/50\">\s*<button\s*onClick=\{globalLogout\}.*?</button>\s*</div>"
    content = re.sub(target_logout, "", content, flags=re.DOTALL)

    with open("src/pages/LabDashboard.jsx", "w", encoding="utf-8") as f:
        f.write(content)

def fix_admin():
    with open("src/pages/SuperAdminPanel.jsx", "r", encoding="utf-8") as f:
        content = f.read()

    # Admin doesn't have a sidebar, so we update the header to be clean.
    # We remove the globalLogout from the right side, and put it near ThemeToggle.
    # Actually, the user profile is in the header, they wanted it to be unified.
    # Since there's no sidebar, making the header clean is enough.
    target_header = r"<header className=\"max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 glassmorphic-card p-4 text-right\">.*?</header>"
    
    clean_header = """<header className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 bg-slate-50/80 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-sm text-right">
        <div className="flex items-center gap-3">
          <AnimatedLogo variant="sidebar" className="border-none p-0" />
          <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>
          <div className="flex flex-col">
            <span className="text-sm font-black text-slate-800 dark:text-white flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {user?.name || "مدير النظام"}
            </span>
            <span className="text-[10px] text-teal-600 dark:text-teal-400 font-extrabold mt-1">
              المسؤول المركزي للنظام
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-xl">
            <span>📅 {new Date().toLocaleDateString('ar-IQ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <span className="text-slate-300">|</span>
            <span>⏰ {new Date().toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <div className="flex items-center gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2.5 py-1 rounded-xl border border-amber-500/20">
            <WeatherWidget variant="full" />
          </div>
          
          <ThemeToggle />
          <button
            onClick={globalLogout}
            className="px-3 py-1.5 rounded-xl border border-red-500/20 bg-red-500/5 text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer font-black"
          >
            تسجيل الخروج
          </button>
        </div>
      </header>"""
    
    content = re.sub(target_header, clean_header, content, flags=re.DOTALL)

    with open("src/pages/SuperAdminPanel.jsx", "w", encoding="utf-8") as f:
        f.write(content)

if __name__ == "__main__":
    fix_lab()
    fix_admin()
    print("Done fixes")
