import re
with open("src/pages/SuperAdminPanel.jsx", "r", encoding="utf-8") as f:
    content = f.read()

target = r"reader\.onload = \(event\) => \{\s*setSoundPreferences\(prev => \(\{ \.\.\.prev, \[event\.id\]: event\.target\.result \}\)\);\s*\};"
replace = """reader.onload = (loadEvent) => {
                                setSoundPreferences(prev => ({ ...prev, [event.id]: loadEvent.target.result }));
                              };"""
content = re.sub(target, replace, content)

with open("src/pages/SuperAdminPanel.jsx", "w", encoding="utf-8") as f:
    f.write(content)
