import re

def fix():
    path = "src/pages/LabDashboard.jsx"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # Remove FileEdit from whatever incorrect import it is in
    if "import {\n  FileEdit," in content:
        content = content.replace("import {\n  FileEdit,", "import {")

    # Add FileEdit to lucide-react if not present
    lucide_match = re.search(r"import\s+\{[^}]*\}\s+from\s+['\"]lucide-react['\"];", content)
    if lucide_match:
        lucide_import = lucide_match.group(0)
        if "FileEdit" not in lucide_import:
            new_lucide_import = lucide_import.replace("import {", "import { FileEdit,")
            content = content.replace(lucide_import, new_lucide_import)

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

if __name__ == "__main__":
    fix()
