import re

with open('src/utils/constants.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix team core basics
content = content.replace(
    "team: ['showTeamDashboard', 'showSmartTasks', 'showSectorMap', 'createEst', 'addEval'],",
    "team: ['showTeamDashboard', 'showSmartTasks', 'showSectorMap', 'createEst', 'addEval', 'manageEstablishments'],"
)

with open('src/utils/constants.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

