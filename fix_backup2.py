with open('src/pages/SuperAdminPanel.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# First, remove backupData: false
content = content.replace("    backupData: false,\n", "")
content = content.replace("    backupData: false\n", "")

import re
# Now carefully remove only the backup section UI
# Specifically, we want to remove this block:
# {/* Backup and Restore Database Panel */}
# ... up to just before {/* Auto Delete Images */}

pattern = r"\{/\* Backup and Restore Database Panel \*/\}.*?(?=\{/\* Auto Delete Images \*/\})"
content = re.sub(pattern, "", content, flags=re.DOTALL)

with open('src/pages/SuperAdminPanel.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Applied fix")
