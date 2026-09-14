import re

path_sidebar = "src/components/UnifiedSidebar.jsx"
with open(path_sidebar, "r", encoding="utf-8") as f:
    sidebar = f.read()

# Fix the regex:
# {tab.icon && <tab.icon ... />}
sidebar = re.sub(r"\{tab\.icon && <tab\.icon className=\{.*?\)\} \/>\}", "", sidebar, flags=re.DOTALL)
sidebar = re.sub(r"\{tab\.icon && <tab\.icon className=\{`w-4\.5 h-4\.5.*?\/>\}", "", sidebar, flags=re.DOTALL)

# <config.icon ... />
sidebar = re.sub(r"<config\.icon className=\{`w-4\.5 h-4\.5.*?\/>", "", sidebar, flags=re.DOTALL)

with open(path_sidebar, "w", encoding="utf-8") as f:
    f.write(sidebar)

print("Icons truly removed!")
