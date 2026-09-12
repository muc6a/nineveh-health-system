import re
import os

def fix_app_context():
    filepath = "src/context/AppContext.jsx"
    if not os.path.exists(filepath): return
    
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. In DEFAULT_PERMISSIONS, replace manageEstablishments: true with manageEstablishments: false
    # We find the specific block starting with "const DEFAULT_PERMISSIONS = {"
    
    # We can just do a regex replace to be safe
    content = re.sub(
        r'(const DEFAULT_PERMISSIONS = \{\s*)manageEstablishments:\s*true,',
        r'\1manageEstablishments: false,',
        content
    )

    # 2. In ROLE_PERMISSIONS, central_director has a hardcoded manageEstablishments: true,
    content = re.sub(
        r'(central_director: \{[^\}]+?)\s*manageEstablishments:\s*true,',
        r'\1',
        content
    )

    # 3. Add manageEstablishments: true to team in ROLE_PERMISSIONS so team doesn't lose it
    # Find team: { ...DEFAULT_PERMISSIONS,
    content = re.sub(
        r'(team: \{\s*\.\.\.DEFAULT_PERMISSIONS,)',
        r'\1\n    manageEstablishments: true,',
        content
    )

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
        
    print("Fixed AppContext.jsx permissions!")

if __name__ == "__main__":
    fix_app_context()
