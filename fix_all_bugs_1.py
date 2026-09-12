import re

def fix_team_dashboard():
    with open("src/pages/TeamDashboard.jsx", "r", encoding="utf-8") as f:
        content = f.read()

    # Hide sidebar when embeddedTab is true
    target_sidebar = r"\{/\* Fixed Sticky Sidebar \*/\}\s*<UnifiedSidebar\s*activeTab=\{activeTab\} setActiveTab=\{setActiveTab\}\s*isSidebarOpen=\{isSidebarOpen\} setIsSidebarOpen=\{setIsSidebarOpen\}\s*\/>"
    replace_sidebar = """{/* Fixed Sticky Sidebar */}
      {!embeddedTab && (
        <UnifiedSidebar 
          activeTab={activeTab} setActiveTab={setActiveTab} 
          isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen}
        />
      )}"""
    content = re.sub(target_sidebar, replace_sidebar, content)

    # Hide GlobalHeader when embeddedTab is true
    target_header = r"\{/\* Global Header / Desktop Nav \*/\}\s*<GlobalHeader user=\{user\} />"
    replace_header = """{/* Global Header / Desktop Nav */}
          {!embeddedTab && <GlobalHeader user={user} />}"""
    content = re.sub(target_header, replace_header, content)

    # Hide the flex header with Search and Settings when embeddedTab is true
    target_top_flex = r"\{/\* Enhanced Top Header \*/\}\s*<div className=\"flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center bg-white/40 dark:bg-slate-900/40 border border-slate-200/20 backdrop-blur-md p-4 rounded-2xl\">"
    replace_top_flex = """{/* Enhanced Top Header */}
          {!embeddedTab && (
            <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center bg-white/40 dark:bg-slate-900/40 border border-slate-200/20 backdrop-blur-md p-4 rounded-2xl">"""
    
    # Wait, the closing div for top header is just before {/* Core Statistics Cards */}
    target_close_top_flex = r"\{/\* Core Statistics Cards \*/\}"
    replace_close_top_flex = """  )}
          
          {/* Core Statistics Cards */}"""
    
    content = re.sub(target_top_flex, replace_top_flex, content)
    content = re.sub(target_close_top_flex, replace_close_top_flex, content)

    with open("src/pages/TeamDashboard.jsx", "w", encoding="utf-8") as f:
        f.write(content)

def fix_accountant_panel():
    with open("src/pages/AccountantPanel.jsx", "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Fix hasPerm custom override
    target_hasperm = r"const hasPerm = \(permName\) => \{\s*if \(user\?\.role === \"admin\" \|\| user\?\.role === \"financial_accountant\"\)\s*return true;\s*return user\?\.permissions\?\.\[permName\] === true;\s*\};\s*"
    replace_hasperm = """const { hasPerm: globalHasPerm } = useContext(AppContext);
  const hasPerm = (permName) => {
    return globalHasPerm(permName);
  };\n"""
    # Wait, hasPerm is already exported from AppContext, we can just extract it at the top level
    
    # Let's see how it extracts from AppContext
    target_context = r"globalLogout,\s*\} = useContext\(AppContext\);"
    replace_context = "globalLogout,\n    hasPerm\n  } = useContext(AppContext);"
    content = re.sub(target_context, replace_context, content)
    
    target_hasperm2 = r"const hasPerm = \(permName\) => \{\s*if \(user\?\.role === \"admin\" \|\| user\?\.role === \"financial_accountant\"\)\s*return true;\s*return user\?\.permissions\?\.\[permName\] === true;\s*\};"
    content = re.sub(target_hasperm2, "", content)

    # 2. Fix ext_reports embedded rendering
    target_reports = r"\{activeTab === \"ext_reports\" && \(\s*<div className=\"w-full h-full min-h-\[85vh\]\">\s*<ExecutivePortal embeddedTab=\"reports\" />\s*</div>\s*\)\}"
    replace_reports = """{activeTab === "ext_reports" && (
          <div className="w-full h-full min-h-[85vh]">
            <TeamDashboard embeddedTab="reports" />
          </div>
        )}"""
    content = re.sub(target_reports, replace_reports, content)

    with open("src/pages/AccountantPanel.jsx", "w", encoding="utf-8") as f:
        f.write(content)

if __name__ == "__main__":
    fix_team_dashboard()
    fix_accountant_panel()
    print("Done")
