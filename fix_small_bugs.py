import re

# Fix InspectionForm.jsx
with open("src/pages/InspectionForm.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# Replace user?.teamId with user?.id
content = content.replace("teamId: user?.teamId || 'team_1',", "teamId: user?.id || 'team_1',")

with open("src/pages/InspectionForm.jsx", "w", encoding="utf-8") as f:
    f.write(content)

# Fix SuperAdminPanel.jsx
with open("src/pages/SuperAdminPanel.jsx", "r", encoding="utf-8") as f:
    content2 = f.read()

# Replace z-[999] with z-40 in sticky tabs
content2 = content2.replace("sticky top-0 z-[999]", "sticky top-0 z-40")

with open("src/pages/SuperAdminPanel.jsx", "w", encoding="utf-8") as f:
    f.write(content2)

