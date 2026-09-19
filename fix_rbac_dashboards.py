import re

def update_dashboards():
    files = ["src/pages/TeamDashboard.jsx", "src/pages/ExecutivePortal.jsx"]
    for path in files:
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()

        # Update render condition
        # Look for {activeTab === 'operations_room' && (hasPerm(...)
        regex = r"\{activeTab === 'operations_room' && \(hasPerm\('showOperationsRoom'\) \|\| hasPerm\('executeSmartTasks'\) \|\| hasPerm\('showSectorMap'\) \|\| hasPerm\('manageSmartTasks'\)\) && \("
        new_cond = "{activeTab === 'operations_room' && (hasPerm('authenticatePenalties') || hasPerm('showFieldTeamsStats')) && ("
        content = re.sub(regex, new_cond, content)
        
        # also sometimes it is {activeTab === 'operations_room' && <OperationsRoom />}
        # Let's verify if there is another redirect check in ExecutivePortal.jsx
        if "activeTab === 'operations_room' && !(hasPerm('showOperationsRoom')" in content:
            content = content.replace(
                "hasPerm('showOperationsRoom') || hasPerm('executeSmartTasks') || hasPerm('showSectorMap') || hasPerm('manageSmartTasks')",
                "hasPerm('authenticatePenalties') || hasPerm('showFieldTeamsStats')"
            )

        with open(path, "w", encoding="utf-8") as f:
            f.write(content)

if __name__ == "__main__":
    update_dashboards()
