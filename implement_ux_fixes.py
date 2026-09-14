import re

# 1. GlobalHeader.jsx: Add children prop
path_gh = "src/components/GlobalHeader.jsx"
with open(path_gh, "r", encoding="utf-8") as f:
    gh = f.read()
if "children" not in gh:
    gh = gh.replace("export const GlobalHeader = ({ title, subtitle, icon, showPrintButton = false }) => {", 
                    "export const GlobalHeader = ({ title, subtitle, icon, showPrintButton = false, children }) => {")
    gh = gh.replace("        {(showPrintButton && hasPerm('exportData')) && (",
                    "        {children}\n        {(showPrintButton && hasPerm('exportData')) && (")
    with open(path_gh, "w", encoding="utf-8") as f:
        f.write(gh)

# 2. LabDashboard.jsx: Add Display Prefs button
path_lab = "src/pages/LabDashboard.jsx"
with open(path_lab, "r", encoding="utf-8") as f:
    lab = f.read()

btn_code = """            <button
              title="تخصيص العرض"
              onClick={() => setShowDisplayPrefsModal(true)}
              className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-[10px] transition-all shadow-md flex items-center gap-1.5"
            >
              ⚙️ تخصيص العرض
            </button>"""

if "⚙️ تخصيص العرض" not in lab:
    lab = lab.replace('<GlobalHeader', f'<GlobalHeader\n            children={{{btn_code}}}\n')
    
    # Check if DisplayPrefsModal is imported and used
    if 'DisplayPrefsModal' not in lab:
        lab = lab.replace("import { GlobalHeader } from '../components/GlobalHeader';", "import { GlobalHeader } from '../components/GlobalHeader';\nimport DisplayPrefsModal from '../components/DisplayPrefsModal';")
        lab = lab.replace("</Layout>", "  <DisplayPrefsModal isOpen={showDisplayPrefsModal} onClose={() => setShowDisplayPrefsModal(false)} />\n    </Layout>")
        
    with open(path_lab, "w", encoding="utf-8") as f:
        f.write(lab)

# 3. UnifiedSidebar.jsx: Fix strategic condition and Account Card UI
path_sidebar = "src/components/UnifiedSidebar.jsx"
with open(path_sidebar, "r", encoding="utf-8") as f:
    sidebar = f.read()

# Fix strategic condition
sidebar = sidebar.replace("showCondition: hasPerm('showMainDashboard') || hasPerm('showReportsPage') || hasPerm('exportData')",
                          "showCondition: hasPerm('showMainDashboard') || hasPerm('showReportsPage')")

# Fix Account Card UI
old_account_ui = r"""<div className="flex flex-col text-right">\s*<span className="font-black text-xs">\{user\.name\}</span>\s*<span className="text-\[10px\] text-slate-500">\{getRoleNameInArabic\(user\.role\)\}\s*\{user\.sector \? `- \$\{user\.sector\}` : ''\}</span>\s*</div>"""

new_account_ui = """<div className="flex flex-col text-right truncate">
            <span className="font-bold text-[11px] truncate" title={`اسم الحساب: ${user.name}`}>اسم الحساب: {user.name}</span>
            <span className="text-[9px] text-slate-500 truncate mt-0.5" title={`نوع الحساب: ${getRoleNameInArabic(user.role)} ${user.sector ? `- ${user.sector}` : ''}`}>
              نوع الحساب: {getRoleNameInArabic(user.role)} {user.sector ? `- ${user.sector}` : ''}
            </span>
          </div>"""

sidebar = re.sub(old_account_ui, new_account_ui, sidebar, flags=re.DOTALL)

with open(path_sidebar, "w", encoding="utf-8") as f:
    f.write(sidebar)

# 4. DirectivesManager.jsx: Full width if no send perm
path_dir = "src/components/DirectivesManager.jsx"
with open(path_dir, "r", encoding="utf-8") as f:
    dirs = f.read()

dirs = dirs.replace('<div className="lg:col-span-8">', '<div className={canSend ? "lg:col-span-8" : "lg:col-span-12"}>')
with open(path_dir, "w", encoding="utf-8") as f:
    f.write(dirs)

# 5. Login.jsx: Enter key to login
path_login = "src/pages/Login.jsx"
with open(path_login, "r", encoding="utf-8") as f:
    login = f.read()

login = login.replace('type="password"\n                    value={password}', 'type="password"\n                    onKeyDown={(e) => e.key === \'Enter\' && handleLogin()}\n                    value={password}')
with open(path_login, "w", encoding="utf-8") as f:
    f.write(login)

# 6. AppContext.jsx: Default light mode
path_ctx = "src/context/AppContext.jsx"
with open(path_ctx, "r", encoding="utf-8") as f:
    ctx = f.read()

# Replace the theme initialization block
ctx = re.sub(r"const \[theme, setTheme\] = useState\(\(\) => \{.*?\n  \}\);", 
             """const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme;
      }
    }
    return 'light';
  });""", ctx, flags=re.DOTALL)

with open(path_ctx, "w", encoding="utf-8") as f:
    f.write(ctx)

print("UX fixes applied!")
