import re

with open('src/pages/TeamDashboard.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find("activeTab === 'reports'")
print("Found activeTab === 'reports' at index:", idx)
print(text[idx-50:idx+500])

