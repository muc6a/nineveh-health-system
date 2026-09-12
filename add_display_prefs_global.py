import os
import re
import glob

def fix_all_panels():
    pages_dir = "src/pages"
    files = glob.glob(os.path.join(pages_dir, "*.jsx"))
    
    # Files that represent dashboards/panels
    dashboard_files = [
        "AccountantPanel.jsx",
        "ExecutivePortal.jsx",
        "OwnerPortal.jsx",
        "SuperAdminPanel.jsx",
        "TeamDashboard.jsx",
        "TrackerDashboard.jsx",
        "LabDashboard.jsx"
    ]
    
    button_html = """<button 
              onClick={() => setShowDisplayPrefsModal(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all cursor-pointer shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2 group whitespace-nowrap"
            >
              <Eye className="w-4 h-4 group-hover:text-teal-500 transition-colors" />
              <span className="font-bold text-[10px]">تخصيص العرض</span>
            </button>
            <NotificationBell />"""

    old_mobile_btn_regex = r"(<button[^>]*onClick=\{\(\) => setShowDisplayPrefsModal\(true\)\}[^>]*>\s*<Eye[^>]*/>\s*</button>)"

    for file_path in files:
        filename = os.path.basename(file_path)
        if filename not in dashboard_files:
            continue
            
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()

        # 1. Remove the old mobile button (which is just an icon) to avoid duplication
        content = re.sub(old_mobile_btn_regex, "", content)

        # 2. Add the state if it doesn't exist
        if "setShowDisplayPrefsModal" not in content:
            # Add state
            state_regex = r"(const\s+\[[a-zA-Z]+,\s*set[a-zA-Z]+\]\s*=\s*useState\([^)]*\);)"
            state_match = re.search(state_regex, content)
            if state_match:
                state_insert = "\n  const [showDisplayPrefsModal, setShowDisplayPrefsModal] = useState(false);"
                content = content[:state_match.end()] + state_insert + content[state_match.end():]
        
        # 3. Add DisplayPreferencesModal component to imports if needed
        if "DisplayPreferencesModal" not in content:
            # find last import
            imports_regex = r"import[^;]+;"
            imports = list(re.finditer(imports_regex, content))
            if imports:
                last_import = imports[-1]
                import_insert = "\nimport { DisplayPreferencesModal } from '../components/DisplayPreferencesModal';"
                content = content[:last_import.end()] + import_insert + content[last_import.end():]
                
            # add component to bottom
            comp_insert = "\n      <DisplayPreferencesModal isOpen={showDisplayPrefsModal} onClose={() => setShowDisplayPrefsModal(false)} />\n    </div>"
            content = re.sub(r"</div>\s*$", comp_insert, content)

        # Ensure Eye is imported
        if "import " in content and "Eye" not in content and "lucide-react" in content:
            content = re.sub(r"(import\s+\{[^}]*)(?=\}\s+from\s+['\"]lucide-react['\"])", r"\1, Eye ", content)

        # 4. Replace <NotificationBell /> with our new button + <NotificationBell />
        # We need to make sure we don't accidentally replace it multiple times if we run script twice.
        # So we check if the new button is already near it.
        if "تخصيص العرض" not in content:
            content = content.replace("<NotificationBell />", button_html)

        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
            print(f"Updated {filename}")

if __name__ == "__main__":
    fix_all_panels()
