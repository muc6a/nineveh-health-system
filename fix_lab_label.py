import re

with open("src/pages/TeamDashboard.jsx", "r", encoding="utf-8") as f:
    content = f.read()
content = content.replace("<span>إدارة المختبر</span>", "<span>المختبر</span>")
with open("src/pages/TeamDashboard.jsx", "w", encoding="utf-8") as f:
    f.write(content)

with open("src/pages/ExecutivePortal.jsx", "r", encoding="utf-8") as f:
    content = f.read()
content = content.replace("label: 'إدارة المختبر',", "label: 'المختبر',")
with open("src/pages/ExecutivePortal.jsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Updated lab label")
