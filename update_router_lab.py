import re

with open('src/components/Router.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_auth = "} else if (baseRoute === '/dashboard/lab' && user.role !== 'lab') {"
new_auth = "} else if (baseRoute === '/dashboard/lab' && user.role !== 'lab' && !user.permissions?.receiveSamples && !user.permissions?.enterLabResults && !user.permissions?.labArchive) {"

old_route = "case '/dashboard/lab':\n      return user && user.role === 'lab' ? <LabDashboard /> : null;"
new_route = "case '/dashboard/lab':\n      return user && (user.role === 'lab' || user.permissions?.receiveSamples || user.permissions?.enterLabResults || user.permissions?.labArchive) ? <LabDashboard /> : null;"

content = content.replace(old_auth, new_auth)
content = content.replace(old_route, new_route)

with open('src/components/Router.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated Router.jsx for Lab Dashboard access")
