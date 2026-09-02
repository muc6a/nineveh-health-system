import re

with open('src/pages/AccountantPanel.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the junk
junk = """        {/* --- Tab: Directives --- */}
        
          </div>
        </div>
      )}"""
content = content.replace(junk, "        {/* --- Tab: Directives --- */}")

with open('src/pages/AccountantPanel.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

