import re

with open('src/pages/AccountantPanel.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the dangling )}
lines = content.split('\n')
for i, line in enumerate(lines):
    if ")} " in line or ")}" in line:
        # Check if it's right before the directives tab
        if i+2 < len(lines) and "activeTab === 'directives'" in lines[i+2]:
            print(f"Found dangling bracket at line {i+1}")
            lines[i] = ""

content = '\n'.join(lines)
with open('src/pages/AccountantPanel.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

