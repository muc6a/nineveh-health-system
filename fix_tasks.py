import re

filepath = "src/pages/TeamDashboard.jsx"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# Find the useContext(AppContext) line
match = re.search(r"const \{.*?\} = useContext\(AppContext\);", content)
if match:
    old_line = match.group(0)
    if "tasks," not in old_line:
        new_line = old_line.replace("} = useContext(AppContext)", ", tasks } = useContext(AppContext)")
        content = content.replace(old_line, new_line)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
