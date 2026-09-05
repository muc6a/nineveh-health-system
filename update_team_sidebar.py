import re

with open("src/pages/TeamDashboard.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# Import UnifiedSidebar
if "import UnifiedSidebar from" not in content:
    content = content.replace("import AnimatedLogo from", "import UnifiedSidebar from '../components/UnifiedSidebar';\nimport AnimatedLogo from")

# Replace sidebar code with UnifiedSidebar
sidebar_regex = r"<aside className=\"w-80 shrink-0 bg-white/60.*?</aside>"
new_sidebar = """<UnifiedSidebar 
          activeTab={activeTab} setActiveTab={setActiveTab} 
          isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen}
        />"""
content = re.sub(sidebar_regex, new_sidebar, content, flags=re.DOTALL)

with open("src/pages/TeamDashboard.jsx", "w", encoding="utf-8") as f:
    f.write(content)
