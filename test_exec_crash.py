import re

with open('src/pages/ExecutivePortal.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's check the directives, complaints, lab_results blocks
directives_block = text[text.find("activeTab === 'directives'"):text.find("activeTab === 'complaints'")]
complaints_block = text[text.find("activeTab === 'complaints'"):text.find("activeTab === 'field_dispatch'")]
lab_block = text[text.find("activeTab === 'lab_results'"):text.find("activeTab === 'financials'")]

# Look for missing ?. or common undefined errors in these blocks
print("Directives vars:")
for match in re.finditer(r'\{([A-Za-z0-9_]+)\.', directives_block):
    print(match.group(1))

print("Complaints vars:")
for match in re.finditer(r'\{([A-Za-z0-9_]+)\.', complaints_block):
    print(match.group(1))

