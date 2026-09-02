import re

with open('src/pages/ExecutivePortal.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Make sure tabOrder includes all keys from tabConfig
pattern = r"const tabOrder = uiPreferences\?\.tabOrder \|\| Object\.keys\(tabConfig\);"
replacement = """const savedTabOrder = uiPreferences?.tabOrder || Object.keys(tabConfig);
              const tabOrder = [...new Set([...savedTabOrder, ...Object.keys(tabConfig)])];"""

content = re.sub(pattern, replacement, content)

with open('src/pages/ExecutivePortal.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
