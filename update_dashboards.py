import re

def update_team_dashboard():
    path = "src/pages/TeamDashboard.jsx"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    if "import SmartTasks" not in content:
        content = content.replace("import OperationsRoom from '../components/OperationsRoom';", "import OperationsRoom from '../components/OperationsRoom';\nimport SmartTasks from '../components/SmartTasks';")

    if "{activeTab === 'smart_tasks' && <SmartTasks />}" not in content:
        content = content.replace("{activeTab === 'operations_room' && (", "{activeTab === 'smart_tasks' && <SmartTasks />}\n            {activeTab === 'operations_room' && (")

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

def update_exec_portal():
    path = "src/pages/ExecutivePortal.jsx"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    if "import SmartTasks" not in content:
        content = content.replace("import OperationsRoom from '../components/OperationsRoom';", "import OperationsRoom from '../components/OperationsRoom';\nimport SmartTasks from '../components/SmartTasks';")

    if "{activeTab === 'smart_tasks' && <SmartTasks />}" not in content:
        content = content.replace("{activeTab === 'operations_room' && <OperationsRoom />}", "{activeTab === 'smart_tasks' && <SmartTasks />}\n        {activeTab === 'operations_room' && <OperationsRoom />}")

    # Also need to check if we redirect if they don't have permission for smart_tasks
    if "activeTab === 'smart_tasks'" not in content:
        cond = "if (activeTab === 'operations_room' && !(hasPerm('showOperationsRoom') || hasPerm('executeSmartTasks') || hasPerm('showSectorMap') || hasPerm('manageSmartTasks'))) needsRedirect = true;"
        new_cond = "if (activeTab === 'smart_tasks' && !(hasPerm('manageSmartTasks') || hasPerm('executeSmartTasks'))) needsRedirect = true;\n    " + cond
        content = content.replace(cond, new_cond)

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
        
if __name__ == "__main__":
    update_team_dashboard()
    update_exec_portal()
