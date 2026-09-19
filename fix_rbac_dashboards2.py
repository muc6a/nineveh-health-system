import re

def update_dashboard(path):
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # Find the render condition for 'strategic' tab
    # {activeTab === 'strategic' && hasPerm('showMainDashboard') && (
    content = content.replace(
        "{activeTab === 'strategic' && hasPerm('showMainDashboard') && (",
        "{activeTab === 'strategic' && (hasPerm('showMainDashboard') || hasPerm('showReportsPage') || hasPerm('exportData')) && ("
    )

    # In ExecutivePortal it might be:
    # {activeTab === 'strategic' && (
    # wait let's check ExecutivePortal
    
    # Let's fix the useEffect redirect as well
    content = content.replace(
        "if (activeTab === 'strategic' && !hasPerm('showMainDashboard'))",
        "if (activeTab === 'strategic' && !(hasPerm('showMainDashboard') || hasPerm('showReportsPage') || hasPerm('exportData')))"
    )

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

update_dashboard("src/pages/TeamDashboard.jsx")
update_dashboard("src/pages/ExecutivePortal.jsx")

