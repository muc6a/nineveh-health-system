import re

with open('src/pages/TeamDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("window.location.hash = '/dashboard/lab'", "navigate('/dashboard/lab')")

with open('src/pages/TeamDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

with open('src/pages/ExecutivePortal.jsx', 'r', encoding='utf-8') as f:
    content2 = f.read()

content2 = content2.replace("window.location.hash = '/dashboard/lab'", "navigate('/dashboard/lab')")

with open('src/pages/ExecutivePortal.jsx', 'w', encoding='utf-8') as f:
    f.write(content2)

print("Updated navigation to LabDashboard")
