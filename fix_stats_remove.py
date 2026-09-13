import re

def remove_stats():
    # 1. Update constants.jsx
    path = "src/utils/constants.jsx"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # Remove from PERMISSIONS_TABS
    content = content.replace(", 'showFieldTeamsStats'", "")
    content = content.replace("'showFieldTeamsStats', ", "")
    
    # Remove from PERMISSION_DETAILS
    content = re.sub(r"\s*showFieldTeamsStats:\s*\{[^}]+\},", "", content)
    
    # Remove from DEFAULT_PERMISSIONS
    content = re.sub(r"\s*showFieldTeamsStats:\s*(true|false),", "", content)
    
    # Remove from ROLE_CORE_BASICS
    content = content.replace(", 'showFieldTeamsStats'", "")
    content = content.replace("'showFieldTeamsStats', ", "")
    
    # Remove from PERMISSION_ROLES
    content = re.sub(r"\s*showFieldTeamsStats:\s*'[^']+',", "", content)

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

    # 2. Update UnifiedSidebar
    path = "src/components/UnifiedSidebar.jsx"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    content = content.replace(" || hasPerm('showFieldTeamsStats')", "")
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

    # 3. Update Dashboards
    for path in ["src/pages/TeamDashboard.jsx", "src/pages/ExecutivePortal.jsx"]:
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()
        content = content.replace(" || hasPerm('showFieldTeamsStats')", "")
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)

if __name__ == "__main__":
    remove_stats()
