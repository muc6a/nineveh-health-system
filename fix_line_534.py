with open('src/pages/AccountantPanel.jsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

if '</div>\n' in lines[533]:
    lines.pop(533)
    print("Popped line 534 (index 533)")

with open('src/pages/AccountantPanel.jsx', 'w', encoding='utf-8') as f:
    f.writelines(lines)
