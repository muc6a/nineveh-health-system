import re

path_sidebar = "src/components/UnifiedSidebar.jsx"
with open(path_sidebar, "r", encoding="utf-8") as f:
    sidebar = f.read()

missing_icons = ["BarChart3", "Clock", "Archive", "LayoutDashboard", "CreditCard", "ClipboardList", "FileSearch"]
for icon in missing_icons:
    if icon not in sidebar:
        sidebar = sidebar.replace("} from 'lucide-react';", f", {icon} }} from 'lucide-react';")

with open(path_sidebar, "w", encoding="utf-8") as f:
    f.write(sidebar)

# Also update package.json to bump version to 1.0.2 to bust cache again
path_pkg = "package.json"
with open(path_pkg, "r", encoding="utf-8") as f:
    pkg = f.read()
pkg = pkg.replace('"version": "1.0.0"', '"version": "1.0.2"')
pkg = pkg.replace('"version": "1.0.1"', '"version": "1.0.2"')
with open(path_pkg, "w", encoding="utf-8") as f:
    f.write(pkg)

