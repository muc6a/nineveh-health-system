import re

with open('src/pages/TeamDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "matchesStatus = (penaltyRequests || []).some(req => req.estId === e.id && req.type === 'fine' && req.status === 'approved');",
    "matchesStatus = (penaltyRequests || []).some(req => req.establishmentId === e.id && (req.type === 'fine' || req.type === 'closure'));"
)

with open('src/pages/TeamDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed fined filter in TeamDashboard")
