import re
import os

def update_lab_dashboard():
    filepath = "src/pages/LabDashboard.jsx"
    if not os.path.exists(filepath): return
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    content = content.replace(
        "const { user, globalLogout, notify, setActiveSystem } = React.useContext(AppContext);",
        "const { user, globalLogout, notify, setActiveSystem, setActiveSidebarTabs } = React.useContext(AppContext);"
    )

    use_effect = """
  React.useEffect(() => {
    if (setActiveSidebarTabs) {
      setActiveSidebarTabs([
        { id: 'stats', label: 'الرئيسية والتقارير' },
        { id: 'testing', label: 'فحص العينات' }
      ]);
    }
  }, []);
"""
    if "setActiveSidebarTabs([" not in content:
        content = content.replace(
            "const [isSidebarOpen, setIsSidebarOpen] = useState(false);",
            "const [isSidebarOpen, setIsSidebarOpen] = useState(false);\n" + use_effect
        )

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
    print("Updated LabDashboard")

def update_owner_portal():
    filepath = "src/pages/OwnerPortal.jsx"
    if not os.path.exists(filepath): return
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    content = content.replace(
        "const { user, globalLogout, establishments, notify, setActiveSystem } = useContext(AppContext);",
        "const { user, globalLogout, establishments, notify, setActiveSystem, setActiveSidebarTabs } = useContext(AppContext);"
    )

    use_effect = """
  React.useEffect(() => {
    if (setActiveSidebarTabs) {
      setActiveSidebarTabs([
        { id: 'dashboard', label: 'الرئيسية' },
        { id: 'profile', label: 'بيانات المنشأة' },
        { id: 'fines', label: 'المخالفات والغرامات' },
        { id: 'history', label: 'سجل الزيارات' }
      ]);
    }
  }, []);
"""
    if "setActiveSidebarTabs([" not in content:
        content = content.replace(
            "const [activeTab, setActiveTab] = useState('dashboard');",
            "const [activeTab, setActiveTab] = useState('dashboard');\n" + use_effect
        )

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
    print("Updated OwnerPortal")

if __name__ == "__main__":
    update_lab_dashboard()
    update_owner_portal()
