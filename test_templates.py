import json, re
with open('src/context/AppContext.jsx', 'r') as f:
    text = f.read()

m = re.search(r'const defaultInspectionTemplates = (\[.*?\]);', text, re.DOTALL)
if m:
    print("Found templates.")
    templates = m.group(1)
    print(templates[:500])
else:
    print("Not found.")
