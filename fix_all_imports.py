import re

def fix_file(path):
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # Find all lucide-react imports (single or double quotes)
    matches = re.findall(r"import\s+\{([^}]+)\}\s+from\s+['\"]lucide-react['\"];", content)
    
    all_icons = set()
    for match in matches:
        icons = [i.strip() for i in match.split(',')]
        all_icons.update(icons)
        
    # Add icons needed for customTabs
    required_icons = ["BarChart3", "Clock", "FlaskConical", "Archive", "LayoutDashboard", "CreditCard", "ClipboardList", "FileSearch", "TrendingUp", "CheckCircle", "ShieldAlert", "Mail", "Building"]
    all_icons.update(required_icons)
    
    clean_icons = ", ".join(sorted([i for i in all_icons if i]))
    
    # Remove old imports
    content = re.sub(r"import\s+\{[^}]+\}\s+from\s+['\"]lucide-react['\"];\n?", "", content)
    
    # Insert new import
    new_import = f"import {{ {clean_icons} }} from 'lucide-react';\n"
    content = new_import + content
    
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

fix_file("src/pages/LabDashboard.jsx")
fix_file("src/pages/AccountantPanel.jsx")
