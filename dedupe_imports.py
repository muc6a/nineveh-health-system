import re

def remove_duplicate_imports(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
        
    lines = content.split('\n')
    new_lines = []
    seen_imports = set()
    
    for line in lines:
        if line.startswith("import "):
            if line in seen_imports:
                continue
            seen_imports.add(line)
        new_lines.append(line)
        
    with open(filepath, "w", encoding="utf-8") as f:
        f.write('\n'.join(new_lines))

remove_duplicate_imports("src/pages/LabDashboard.jsx")
remove_duplicate_imports("src/pages/AccountantPanel.jsx")
