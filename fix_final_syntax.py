import re

# Fix ExecutivePortal.jsx
with open('src/pages/ExecutivePortal.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the dangling )}
lines = content.split('\n')
if ")} " in lines[1107] or ")}" in lines[1107]:
    lines.pop(1107)
    
content = '\n'.join(lines)
with open('src/pages/ExecutivePortal.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

