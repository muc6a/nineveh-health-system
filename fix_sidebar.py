import re

with open("src/components/UnifiedSidebar.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# Remove team_reports tab
content = re.sub(
    r"\s*team_reports: \{.*?\},\s*",
    "\n    ",
    content,
    flags=re.DOTALL
)

with open("src/components/UnifiedSidebar.jsx", "w", encoding="utf-8") as f:
    f.write(content)
