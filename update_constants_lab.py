with open('src/utils/constants.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add centralLabView: false to DEFAULT_PERMISSIONS
content = content.replace(
    "  manageSettings: false,",
    "  manageSettings: false,\n  centralLabView: false,"
)

# 2. Add centralLabView to the lab tab in PERMISSIONS_TABS
content = content.replace(
    "keys: ['receiveSamples', 'enterLabResults', 'labArchive'] }",
    "keys: ['receiveSamples', 'enterLabResults', 'labArchive', 'centralLabView'] }"
)

with open('src/utils/constants.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated constants.jsx")
