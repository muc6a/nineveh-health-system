import re

def update_sidebar():
    path = "src/components/UnifiedSidebar.jsx"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # Fix operations_room condition
    # Old: hasPerm('showOperationsRoom') || hasPerm('executeSmartTasks') || hasPerm('showSectorMap') || hasPerm('manageSmartTasks')
    # New: hasPerm('authenticatePenalties') || hasPerm('showFieldTeamsStats')
    content = content.replace(
        "hasPerm('showOperationsRoom') || hasPerm('executeSmartTasks') || hasPerm('showSectorMap') || hasPerm('manageSmartTasks')",
        "hasPerm('authenticatePenalties') || hasPerm('showFieldTeamsStats')"
    )

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

if __name__ == "__main__":
    update_sidebar()
