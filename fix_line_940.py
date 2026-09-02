with open('src/pages/AccountantPanel.jsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

if '</div>\n' in lines[939]:
    lines.pop(939)
    print("Popped line 940 (index 939)")

with open('src/pages/AccountantPanel.jsx', 'w', encoding='utf-8') as f:
    f.writelines(lines)
