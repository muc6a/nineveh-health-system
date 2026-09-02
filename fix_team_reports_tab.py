import re

with open('src/pages/TeamDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace hasPerm('showReportsPage') around the "صندوق البلاغات والتقارير" button and render block
# with hasPerm('showTeamDashboard')

content = content.replace("{hasPerm('showReportsPage') && (", "{hasPerm('showTeamDashboard') && (")
content = content.replace("{activeTab === 'reports' && hasPerm('showReportsPage') && (", "{activeTab === 'reports' && hasPerm('showTeamDashboard') && (")
# Ensure we don't accidentally replace anything else, but these patterns are quite specific.

with open('src/pages/TeamDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

