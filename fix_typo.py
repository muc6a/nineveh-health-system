import os
import re

files = [
    'src/pages/SuperAdminPanel.jsx',
    'src/pages/TeamDashboard.jsx'
]

replacements = [
    (r'\\">', '">')
]

for filepath in files:
    full_path = os.path.join('/Users/admin/web/منظومة الرقابة الصحية الرقمية', filepath)
    if os.path.exists(full_path):
        with open(full_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        new_content = content
        for search, replace in replacements:
            new_content = re.sub(search, replace, new_content)
            
        if new_content != content:
            with open(full_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated {filepath}")
        else:
            print(f"No changes in {filepath}")

