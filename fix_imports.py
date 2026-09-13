import re

def fix_imports(path):
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # Find all lucide-react imports
    lucide_matches = re.findall(r"import \{([^}]+)\} from 'lucide-react';", content)
    
    all_icons = set()
    for match in lucide_matches:
        icons = [i.strip() for i in match.split(',')]
        all_icons.update(icons)
        
    # Remove all lucide-react imports
    content = re.sub(r"import \{[^}]+\} from 'lucide-react';\n?", "", content)
    
    # Re-insert a single clean import
    clean_icons = ", ".join(sorted([i for i in all_icons if i]))
    new_import = f"import {{ {clean_icons} }} from 'lucide-react';\n"
    
    content = new_import + content
    
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

fix_imports("src/pages/LabDashboard.jsx")
fix_imports("src/pages/AccountantPanel.jsx")
