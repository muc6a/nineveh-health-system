import re

with open('src/pages/ExecutivePortal.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

directives_idx = text.find("activeTab === 'directives'")
complaints_idx = text.find("activeTab === 'complaints'", directives_idx)

print("Directives starts at:", directives_idx)
print("Complaints starts at:", complaints_idx)

snippet = text[directives_idx:complaints_idx]

if "الفرق الميدانية والتوجيه السريع" in snippet:
    print("Found Field Teams dispatch in Directives block!")

