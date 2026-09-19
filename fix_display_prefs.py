import re

path = "src/components/DisplayPreferencesModal.jsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Remove ListOrdered icon
content = content.replace('<ListOrdered className="w-4 h-4 text-teal-600" />', '')
with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("ListOrdered removed!")
