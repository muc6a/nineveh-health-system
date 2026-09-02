with open('src/pages/AccountantPanel.jsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

if '</div>\n' in lines[827]:
    lines.pop(827)
    print("Popped line 828 (index 827)")

with open('src/pages/AccountantPanel.jsx', 'w', encoding='utf-8') as f:
    f.writelines(lines)
