import re

# 1. Update UnifiedSidebar.jsx
path = "src/components/UnifiedSidebar.jsx"
with open(path, "r", encoding="utf-8") as f:
    sidebar = f.read()

sidebar = sidebar.replace(
    "const { user, hasPerm, globalLogout, uiPreferences, setActiveSidebarTabs } = React.useContext(AppContext);",
    "const { user, hasPerm, globalLogout, uiPreferences, setActiveSidebarTabs, navigate } = React.useContext(AppContext);"
)

# For lab tabs
lab_tabs = ['stats', 'incoming', 'testing', 'archive', 'lab_management']
for tab in lab_tabs:
    # lab_management sets activeTab('lab_management')
    old_click = f"setActiveTab('{tab}');"
    new_click = f"setActiveTab('{tab}'); if (window.location.pathname !== '/dashboard/lab' && navigate) navigate('/dashboard/lab?tab={tab}');"
    sidebar = sidebar.replace(old_click, new_click)

# For financial tabs
fin_tabs = ['financials', 'ext_financials', 'reconciliation', 'comprehensive_reports']
for tab in fin_tabs:
    old_click = f"setActiveTab('{tab}');"
    new_click = f"setActiveTab('{tab}'); if (window.location.pathname !== '/dashboard/accountant' && navigate) navigate('/dashboard/accountant?tab={tab}');"
    sidebar = sidebar.replace(old_click, new_click)

with open(path, "w", encoding="utf-8") as f:
    f.write(sidebar)


# 2. Update LabDashboard.jsx
path = "src/pages/LabDashboard.jsx"
with open(path, "r", encoding="utf-8") as f:
    lab = f.read()

url_effect = """
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, []);
"""
if "const tabParam = params.get('tab');" not in lab:
    lab = lab.replace("const [activeTab, setActiveTab] = useState('stats');", f"const [activeTab, setActiveTab] = useState('stats');\n{url_effect}")

with open(path, "w", encoding="utf-8") as f:
    f.write(lab)


# 3. Update AccountantPanel.jsx
path = "src/pages/AccountantPanel.jsx"
with open(path, "r", encoding="utf-8") as f:
    acc = f.read()

url_effect_acc = """
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, []);
"""
if "const tabParam = params.get('tab');" not in acc:
    acc = acc.replace("const [activeTab, setActiveTab] = useState('dashboard');", f"const [activeTab, setActiveTab] = useState('dashboard');\n{url_effect_acc}")

with open(path, "w", encoding="utf-8") as f:
    f.write(acc)

print("Routing fixed!")
