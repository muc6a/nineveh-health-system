import re

with open("src/pages/SuperAdminPanel.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# DEFAULT_PERMISSIONS in SuperAdminPanel
pattern = r'(labArchive:\s*false,)'
if "editLabResults:" not in content:
    content = re.sub(pattern, r"\1\n    editLabResults: false,", content)

with open("src/pages/SuperAdminPanel.jsx", "w", encoding="utf-8") as f:
    f.write(content)

