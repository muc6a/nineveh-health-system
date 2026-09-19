import re

def fix_sidebar():
    path = "src/components/UnifiedSidebar.jsx"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Add smart_tasks, map, team_reports
    # We will insert them right before lab_management
    new_tabs = """    team_reports: {
      label: 'إحصائيات الميدان',
      icon: Users,
      iconColorClass: 'text-orange-500',
      activeBgClass: 'bg-orange-600 text-white shadow-md shadow-orange-500/10',
      showCondition: hasPerm('showFieldTeamsStats'),
      onClick: () => { if(setExecutiveTab) setExecutiveTab('dashboard'); setActiveTab('team_reports'); }
    },
    map: {
      label: 'الخريطة الرقابية',
      icon: Database,
      iconColorClass: 'text-emerald-500',
      activeBgClass: 'bg-emerald-600 text-white shadow-md shadow-emerald-500/10',
      showCondition: hasPerm('showSectorMap'),
      onClick: () => { if(setExecutiveTab) setExecutiveTab('dashboard'); setActiveTab('map'); }
    },
    smart_tasks: {
      label: 'المهام الذكية',
      icon: CheckCircle,
      iconColorClass: 'text-blue-500',
      activeBgClass: 'bg-blue-600 text-white shadow-md shadow-blue-500/10',
      showCondition: hasPerm('showSmartTasks'),
      onClick: () => { if(setExecutiveTab) setExecutiveTab('dashboard'); setActiveTab('smart_tasks'); }
    },
    """
    
    if "team_reports:" not in content:
        content = content.replace("lab_management: {", new_tabs + "lab_management: {")
        
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)
        print("Updated UnifiedSidebar.jsx")

def fix_team_dashboard():
    path = "src/pages/TeamDashboard.jsx"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # summary -> strategic
    content = content.replace("activeTab === 'summary'", "activeTab === 'strategic'")
    # directory -> establishments
    content = content.replace("activeTab === 'directory'", "activeTab === 'establishments'")
    # geographic -> reports (wait, the map in TeamDashboard is 'geographic'?, no, we will just map geographic to 'reports' ? No, 'strategic' will handle reports? No, let's keep geographic but make it match a tab? Wait, 'showReportsPage' for Team is 'geographic'. In UnifiedSidebar, showReportsPage is part of 'strategic'. So Team doesn't need geographic tab if strategic covers it? No, strategic is just 'summary'. We can map geographic to team_reports? Let's just rename it to geographic in TeamDashboard.
    
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Updated TeamDashboard.jsx")

def fix_accountant_panel():
    path = "src/pages/AccountantPanel.jsx"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # dashboard -> financials
    content = content.replace('activeTab === "dashboard"', 'activeTab === "financials"')
    # ext_summary -> strategic
    content = content.replace('activeTab === "ext_summary"', 'activeTab === "strategic"')
    # ext_directory -> establishments
    content = content.replace('activeTab === "ext_directory"', 'activeTab === "establishments"')
    
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Updated AccountantPanel.jsx")

if __name__ == "__main__":
    fix_sidebar()
    fix_team_dashboard()
    fix_accountant_panel()

