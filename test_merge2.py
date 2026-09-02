import re

with open('src/pages/ExecutivePortal.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

directives_idx = text.rfind("activeTab === 'directives'")
complaints_idx = text.rfind("activeTab === 'complaints'")
lab_idx = text.rfind("activeTab === 'lab_results'")

print("Directives render block at:", directives_idx)
print("Complaints render block at:", complaints_idx)
print("Lab render block at:", lab_idx)

