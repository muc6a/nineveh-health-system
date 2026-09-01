import re

with open('src/components/Router.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# We want to change the routing logic that kicks them out of /dashboard/director
# from: if (currentRoute === '/dashboard/director' && !(user.role === 'admin' || user.role === 'director' || user.role === 'central_director' || user.isDirector)) {
# to: if (currentRoute === '/dashboard/director' && !(user.role === 'admin' || user.role === 'director' || user.role === 'central_director' || user.isDirector || user.permissions?.showMainDashboard || user.permissions?.authenticatePenalties || user.permissions?.receiveSamples || user.permissions?.showPublicEvalsPage || user.permissions?.showDirectivesPage)) {

pattern = r"if \(currentRoute === '/dashboard/director' && !\(user\.role === 'admin' \|\| user\.role === 'director' \|\| user\.role === 'central_director' \|\| user\.isDirector\)\) {"
replacement = """if (currentRoute === '/dashboard/director' && !(user.role === 'admin' || user.role === 'director' || user.role === 'central_director' || user.isDirector || Object.values(user.permissions || {}).some(v => v === true))) {"""

if 'Object.values(user.permissions || {})' not in content:
    content = re.sub(pattern, replacement, content)
    with open('src/components/Router.jsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print('Router fixed')
else:
    print('Router already fixed')
