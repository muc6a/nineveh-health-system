import re

for filename in ["src/pages/ExecutivePortal.jsx", "src/pages/TeamDashboard.jsx"]:
    with open(filename, "r", encoding="utf-8") as f:
        content = f.read()
    
    if "import UnifiedSidebar from" not in content:
        # Just inject it after the first import React
        content = content.replace("import React", "import UnifiedSidebar from '../components/UnifiedSidebar';\nimport React", 1)
        
    with open(filename, "w", encoding="utf-8") as f:
        f.write(content)

