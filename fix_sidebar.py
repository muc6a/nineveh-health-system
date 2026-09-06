import re

with open("src/components/UnifiedSidebar.jsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("const isCurrentlyActive = (executiveTab && activeTab)", "let isCurrentlyActive = (executiveTab && activeTab)")

with open("src/components/UnifiedSidebar.jsx", "w", encoding="utf-8") as f:
    f.write(content)
