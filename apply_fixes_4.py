import re

def fix_unified_sidebar():
    with open("src/components/UnifiedSidebar.jsx", "r", encoding="utf-8") as f:
        content = f.read()

    # Top profile: remove ThemeToggle and Logout
    top_profile_regex = r"<div className=\"mb-6 bg-slate-50/80 dark:bg-slate-800/80 p-3 rounded-2xl border border-slate-100 dark:border-slate-700/50 flex flex-col gap-3 shadow-sm\">\s*<div className=\"flex items-center justify-between\">\s*<div className=\"flex flex-col\">\s*<span className=\"text-sm font-black text-slate-800 dark:text-white flex items-center gap-1.5\">\s*<span className=\"w-2 h-2 rounded-full bg-emerald-500 animate-pulse\"></span>\s*\{user\?\.name\}\s*</span>\s*<span className=\"text-\[10px\] text-teal-600 dark:text-teal-400 font-extrabold mt-1\">\s*\{user\?\.title \|\| user\?\.role\} \{user\?\.sector \? ` - قطاع \$\{user\.sector\}` : ''\}\s*</span>\s*</div>\s*<ThemeToggle />\s*</div>\s*<div className=\"pt-2 border-t border-slate-200 dark:border-slate-700\">\s*<button \s*onClick=\{globalLogout\}\s*className=\"w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors\"\s*>\s*تسجيل الخروج\s*</button>\s*</div>\s*</div>"
    
    top_profile_replacement = """<div className="mb-6 bg-slate-50/80 dark:bg-slate-800/80 p-3 rounded-2xl border border-slate-100 dark:border-slate-700/50 flex flex-col gap-3 shadow-sm">
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
            </div>
          </div>"""
    
    content = re.sub(top_profile_regex, top_profile_replacement, content)
    
    # Add bottom control card
    bottom_control_regex = r"(</aside>)"
    bottom_control_replacement = """  {/* Bottom Controls */}
          <div className="mt-auto pt-4 border-t border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between gap-2">
            <button 
              onClick={globalLogout}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors border border-rose-100 dark:border-rose-900/30"
            >
              تسجيل الخروج
            </button>
            <div className="p-1 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50">
              <ThemeToggle />
            </div>
          </div>
      </aside>"""
    
    content = re.sub(bottom_control_regex, bottom_control_replacement, content)
    
    with open("src/components/UnifiedSidebar.jsx", "w", encoding="utf-8") as f:
        f.write(content)

def fix_lab_dashboard():
    with open("src/pages/LabDashboard.jsx", "r", encoding="utf-8") as f:
        content = f.read()

    # Top profile
    top_profile_regex = r"<div className=\"mb-6 bg-slate-50/80 dark:bg-slate-800/80 p-3 rounded-2xl border border-slate-100 dark:border-slate-700/50 flex flex-col gap-3 shadow-sm\">\s*<div className=\"flex items-center justify-between\">\s*<div className=\"flex flex-col\">\s*<span className=\"text-sm font-black text-slate-800 dark:text-white flex items-center gap-1.5\">\s*<span className=\"w-2 h-2 rounded-full bg-emerald-500 animate-pulse\"></span>\s*\{user\?\.name\}\s*</span>\s*<span className=\"text-\[10px\] text-teal-600 dark:text-teal-400 font-extrabold mt-1\">\s*\{user\?\.title \|\| user\?\.role === 'lab' \? 'المختبر المركزي العام' : user\?\.role\} \{user\?\.sector \? ` - قطاع \$\{user\.sector\}` : ''\}\s*</span>\s*</div>\s*<ThemeToggle />\s*</div>\s*<div className=\"pt-2 border-t border-slate-200 dark:border-slate-700\">\s*<button \s*onClick=\{globalLogout\}\s*className=\"w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors\"\s*>\s*تسجيل الخروج\s*</button>\s*</div>\s*</div>"
    
    top_profile_replacement = """<div className="mb-6 bg-slate-50/80 dark:bg-slate-800/80 p-3 rounded-2xl border border-slate-100 dark:border-slate-700/50 flex flex-col gap-3 shadow-sm">
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
            </div>
          </div>"""
    
    content = re.sub(top_profile_regex, top_profile_replacement, content)
    
    # Bottom control
    # find where aside ends
    bottom_control_regex = r"(</aside>)"
    bottom_control_replacement = """  {/* Bottom Controls */}
          <div className="mt-auto pt-4 border-t border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between gap-2">
            <button 
              onClick={globalLogout}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors border border-rose-100 dark:border-rose-900/30"
            >
              تسجيل الخروج
            </button>
            <div className="p-1 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50">
              <ThemeToggle />
            </div>
          </div>
      </aside>"""
    content = re.sub(bottom_control_regex, bottom_control_replacement, content)
    
    with open("src/pages/LabDashboard.jsx", "w", encoding="utf-8") as f:
        f.write(content)

def fix_accountant_panel():
    with open("src/pages/AccountantPanel.jsx", "r", encoding="utf-8") as f:
        content = f.read()

    # Top profile
    top_profile_regex = r"<div className=\"mb-6 bg-slate-50/80 dark:bg-slate-800/80 p-3 rounded-2xl border border-slate-100 dark:border-slate-700/50 flex flex-col gap-3 shadow-sm\">\s*<div className=\"flex items-center justify-between\">\s*<div className=\"flex flex-col\">\s*<span className=\"text-sm font-black text-slate-800 dark:text-white flex items-center gap-1.5\">\s*<span className=\"w-2 h-2 rounded-full bg-emerald-500 animate-pulse\"></span>\s*\{user\?\.name\}\s*</span>\s*<span className=\"text-\[10px\] text-teal-600 dark:text-teal-400 font-extrabold mt-1\">\s*\{user\?\.role === \"financial_accountant\" \? \"محاسب مالي\" : \"محاسب الدائرة\"\} \{user\?\.sector \? ` - قطاع \$\{user\.sector\}` : ''\}\s*</span>\s*</div>\s*<ThemeToggle />\s*</div>\s*<div className=\"pt-2 border-t border-slate-200 dark:border-slate-700\">\s*<button \s*onClick=\{globalLogout\}\s*className=\"w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors\"\s*>\s*تسجيل الخروج\s*</button>\s*</div>\s*</div>"
    
    top_profile_replacement = """<div className="mb-6 bg-slate-50/80 dark:bg-slate-800/80 p-3 rounded-2xl border border-slate-100 dark:border-slate-700/50 flex flex-col gap-3 shadow-sm">
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
            </div>
          </div>"""
    
    content = re.sub(top_profile_regex, top_profile_replacement, content)
    
    # Bottom control
    bottom_control_regex = r"(</aside>)"
    bottom_control_replacement = """  {/* Bottom Controls */}
          <div className="mt-auto pt-4 border-t border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between gap-2">
            <button 
              onClick={globalLogout}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors border border-rose-100 dark:border-rose-900/30"
            >
              تسجيل الخروج
            </button>
            <div className="p-1 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50">
              <ThemeToggle />
            </div>
          </div>
      </aside>"""
    content = re.sub(bottom_control_regex, bottom_control_replacement, content)
    
    # Missing setActiveTab in dashboard button
    missing_active_tab_regex = r"onClick=\{\(\) => \{\s*setIsSidebarOpen\(false\);\s*\}\}\s*className=\{`w-full text-right px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center gap-3 \$\{\s*activeTab === \"dashboard\""
    missing_active_tab_replacement = """onClick={() => {
                setActiveTab("dashboard");
                setIsSidebarOpen(false);
              }}
              className={`w-full text-right px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center gap-3 ${
                activeTab === "dashboard\""""
    content = re.sub(missing_active_tab_regex, missing_active_tab_replacement, content)
    
    # Remove "صلاحيات إضافية (ممنوحة)"
    remove_extra_perm_regex = r"\{\/\* Dynamic Extra Permissions Tabs \*\/\}[\s\S]*?<span className=\"text-\[11px\] font-bold text-teal-500 dark:text-teal-400 uppercase tracking-wider block px-3 mb-2 flex items-center gap-2\">\s*<ShieldAlert className=\"w-3\.5 h-3\.5\" />\s*صلاحيات إضافية \(ممنوحة\)\s*</span>"
    remove_extra_perm_replacement = ""
    content = re.sub(remove_extra_perm_regex, remove_extra_perm_replacement, content)
    
    # Add accountant directives filtering
    directives_filter_regex = r"if \(d\.target === \"all\"\) return true;\s*if \(d\.target === \"teams\" && user\?\.role === \"team_leader\"\) return true;"
    directives_filter_replacement = """if (d.target === "all") return true;
    if (d.target === "teams" && user?.role === "team_leader") return true;
    if (d.target === "accountants" || d.target === "accountant" || d.target === "financial") return true;"""
    content = re.sub(directives_filter_regex, directives_filter_replacement, content)
    
    # Fix ext_reports embedded rendering to use geographic
    reports_embed_regex = r"\{activeTab === \"ext_reports\" && \(\s*<div className=\"w-full h-full min-h-\[85vh\]\">\s*<TeamDashboard embeddedTab=\"reports\" />\s*</div>\s*\)\}"
    reports_embed_replacement = """{activeTab === "ext_reports" && (
          <div className="w-full h-full min-h-[85vh]">
            <TeamDashboard embeddedTab="geographic" />
          </div>
        )}"""
    content = re.sub(reports_embed_regex, reports_embed_replacement, content)

    with open("src/pages/AccountantPanel.jsx", "w", encoding="utf-8") as f:
        f.write(content)

if __name__ == "__main__":
    fix_unified_sidebar()
    fix_lab_dashboard()
    fix_accountant_panel()
    print("Done fixes")
