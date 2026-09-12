import re
import os

def update_app_context():
    filepath = "src/context/AppContext.jsx"
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    if "activeSidebarTabs" not in content:
        # Insert state right after showDisplayPrefsModal
        content = content.replace(
            "const [showDisplayPrefsModal, setShowDisplayPrefsModal] = useState(false);",
            "const [showDisplayPrefsModal, setShowDisplayPrefsModal] = useState(false);\n  const [activeSidebarTabs, setActiveSidebarTabs] = useState([]);"
        )
        
        # Add to AppContext.Provider value
        content = content.replace(
            "setShowDisplayPrefsModal,",
            "setShowDisplayPrefsModal,\n    activeSidebarTabs,\n    setActiveSidebarTabs,"
        )

        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        print("Updated AppContext.jsx")

def update_display_prefs_modal():
    filepath = "src/components/DisplayPreferencesModal.jsx"
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # We want to replace getAvailableTabs logic with using activeSidebarTabs
    pattern = r"const getAvailableTabs = \(\) => \{.*?\};\s*const availableTabsMap = getAvailableTabs\(\);"
    replacement = """
  // Use activeSidebarTabs provided by the currently rendered dashboard
  const availableTabsMap = activeSidebarTabs.reduce((acc, tab) => {
    acc[tab.id] = tab.label;
    return acc;
  }, {});
"""
    new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)
    
    # Also add activeSidebarTabs to context destruction
    new_content = new_content.replace(
        "const { uiPreferences, setUiPreferences, notify, user } = useContext(AppContext);",
        "const { uiPreferences, setUiPreferences, notify, user, activeSidebarTabs } = useContext(AppContext);"
    )

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(new_content)
    print("Updated DisplayPreferencesModal.jsx")

def update_unified_sidebar():
    filepath = "src/components/UnifiedSidebar.jsx"
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Add setActiveSidebarTabs to context destruction
    content = content.replace(
        "const { user, hasPerm, globalLogout, uiPreferences } = React.useContext(AppContext);",
        "const { user, hasPerm, globalLogout, uiPreferences, setActiveSidebarTabs } = React.useContext(AppContext);"
    )

    # Insert useEffect to sync visible tabs
    use_effect_code = """
  React.useEffect(() => {
    if (setActiveSidebarTabs) {
      const visibleTabs = tabOrder
        .filter(key => tabConfig[key] && tabConfig[key].showCondition)
        .map(key => ({ id: key, label: tabConfig[key].label }));
      setActiveSidebarTabs(visibleTabs);
    }
  }, [user?.permissions, uiPreferences?.tabOrder]);
"""
    if "setActiveSidebarTabs(visibleTabs)" not in content:
        content = content.replace(
            "const tabOrder = [...new Set([...savedTabOrder, ...Object.keys(tabConfig)])];",
            "const tabOrder = [...new Set([...savedTabOrder, ...Object.keys(tabConfig)])];\n" + use_effect_code
        )

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
    print("Updated UnifiedSidebar.jsx")

def update_accountant_panel():
    filepath = "src/pages/AccountantPanel.jsx"
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Add setActiveSidebarTabs to context destruction
    content = content.replace(
        "const { user, globalLogout, notify, setActiveSystem, hasPerm, directives, uiPreferences, setShowDisplayPrefsModal, establishments } = React.useContext(AppContext);",
        "const { user, globalLogout, notify, setActiveSystem, hasPerm, directives, uiPreferences, setShowDisplayPrefsModal, establishments, setActiveSidebarTabs } = React.useContext(AppContext);"
    )

    # Insert useEffect to sync visible tabs
    use_effect_code = """
  React.useEffect(() => {
    if (setActiveSidebarTabs) {
      setActiveSidebarTabs(sortedTabs);
    }
  }, [user?.permissions, uiPreferences?.tabOrder]);
"""
    if "setActiveSidebarTabs(sortedTabs)" not in content:
        content = content.replace(
            "const sortedTabs = [...visibleTabs].sort((a, b) => {",
            use_effect_code + "\n  const sortedTabs = [...visibleTabs].sort((a, b) => {"
        )
        
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
    print("Updated AccountantPanel.jsx")

def update_constants():
    filepath = "src/utils/constants.jsx"
    if not os.path.exists(filepath):
        print("constants.jsx not found")
        return
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    old_central_director = "central_director: ['authenticatePenalties', 'showFieldTeamsStats', 'editEst', 'deleteEst'],"
    new_central_director = "central_director: ['showDirectivesPage', 'sendDirective', 'replyDirective', 'showPublicEvalsPage', 'showDeliveryPage', 'showOperationsRoom', 'authenticatePenalties', 'issueFine', 'closeEst', 'reopenEst', 'editEst', 'deleteEst', 'manageEstablishments', 'financialReports'],"
    
    content = content.replace(old_central_director, new_central_director)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
    print("Updated constants.jsx")

def update_super_admin_panel():
    filepath = "src/pages/SuperAdminPanel.jsx"
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Remove the condition that hides 'establishments' tab for director/central_director
    content = re.sub(
        r"if\s*\(\s*tab\.id\s*===\s*'establishments'\s*&&\s*\(\s*selectedPermissionsAccount\?\.role\s*===\s*'director'\s*\|\|\s*selectedPermissionsAccount\?\.role\s*===\s*'central_director'\s*\)\s*\)\s*\{\s*return\s*false;\s*\}",
        "",
        content
    )
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
    print("Updated SuperAdminPanel.jsx")

def update_executive_portal():
    filepath = "src/pages/ExecutivePortal.jsx"
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Replace the dropdown option condition for establishments
    content = content.replace(
        "{(hasPerm('createEst') || hasPerm('editEst') || hasPerm('deleteEst')) && (",
        "{hasPerm('manageEstablishments') && ("
    )

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
    print("Updated ExecutivePortal.jsx")

if __name__ == "__main__":
    update_app_context()
    update_display_prefs_modal()
    update_unified_sidebar()
    update_accountant_panel()
    update_constants()
    update_super_admin_panel()
    update_executive_portal()
