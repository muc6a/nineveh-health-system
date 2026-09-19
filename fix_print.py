import re

path = "src/pages/ExecutivePortal.jsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Remove PrintableDailyReport import
content = re.sub(r"import \{ PrintableDailyReport \} from '\.\./components/PrintableDailyReport';\n", "", content)

# Remove the component tag
content = content.replace("      <PrintableDailyReport />\n", "")

# Remove print:hidden
content = content.replace("print:hidden ", "")

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("Fixed Print")
