import re

def update_team_dashboard():
    path = "src/pages/TeamDashboard.jsx"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # Change condition for operations_room
    old_cond = "activeTab === 'operations_room' && (hasPerm('authenticatePenalties') || hasPerm('showFieldTeamsStats'))"
    new_cond = "activeTab === 'operations_room' && (hasPerm('showOperationsRoom') || hasPerm('executeSmartTasks') || hasPerm('showSectorMap') || hasPerm('manageSmartTasks'))"
    content = content.replace(old_cond, new_cond)

    # We will just remove the old smart_tasks, map, and team_reports rendering in TeamDashboard.jsx
    # to avoid rendering them twice or causing confusion. But actually, if they are removed from UnifiedSidebar,
    # the user can never click them to set activeTab to them anyway. But cleaning them up is better.
    # For now, let's just leave the dead code or remove it if easy. I'll just leave it since activeTab won't reach it.

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
        
def update_sidebar():
    path = "src/components/UnifiedSidebar.jsx"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # Change condition for operations_room
    old_cond = "showCondition: hasPerm('showOperationsRoom'),"
    new_cond = "showCondition: hasPerm('showOperationsRoom') || hasPerm('executeSmartTasks') || hasPerm('showSectorMap') || hasPerm('manageSmartTasks'),"
    content = content.replace(old_cond, new_cond)

    # Remove the tabs we just added (team_reports, map, smart_tasks) from UnifiedSidebar
    # I'll use regex to remove them.
    content = re.sub(r"\s+team_reports: \{.*?\},", "", content, flags=re.DOTALL)
    content = re.sub(r"\s+map: \{.*?\},", "", content, flags=re.DOTALL)
    content = re.sub(r"\s+smart_tasks: \{.*?\},", "", content, flags=re.DOTALL)

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
        
    print("Files updated.")

if __name__ == "__main__":
    update_team_dashboard()
    update_sidebar()
