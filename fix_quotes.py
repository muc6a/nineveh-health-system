with open('src/pages/SuperAdminPanel.jsx', 'r') as f:
    content = f.read()

content = content.replace(r"\'lucide-react\'", "'lucide-react'")

with open('src/pages/SuperAdminPanel.jsx', 'w') as f:
    f.write(content)
