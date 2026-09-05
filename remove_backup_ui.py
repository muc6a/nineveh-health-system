with open('src/pages/SuperAdminPanel.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

import re
# Regex to remove the backup section
# We will match from {/* Backup and Restore Database Panel */} up to just before {/* Auto Delete Images */}
pattern = r"\{/\* Backup and Restore Database Panel \*/\}.*?(?=\{/\* Auto Delete Images \*/\})"
new_content = re.sub(pattern, "", content, flags=re.DOTALL)

with open('src/pages/SuperAdminPanel.jsx', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Removed Backup UI block")
