import re

def add_import(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if "ROLE_CORE_BASICS" in content and "import { ROLE_CORE_BASICS" not in content:
        content = content.replace("import React,", "import { ROLE_CORE_BASICS } from '../utils/constants';\nimport React,")
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Fixed {filename}")

add_import('src/pages/TeamDashboard.jsx')
add_import('src/pages/ExecutivePortal.jsx')
