import re

with open('src/pages/ExecutivePortal.jsx', 'r', encoding='utf-8') as f:
    exec_content = f.read()

start_marker = "{activeTab === 'directives' && hasPerm('showDirectivesPage') ? ("
end_marker = ") : activeTab === 'complaints'"

s_idx = exec_content.find(start_marker)
e_idx = exec_content.find(end_marker)

if s_idx == -1 or e_idx == -1:
    print("Could not find block in Exec")
    exit(1)

new_block = exec_content[s_idx:e_idx]
new_block = new_block.replace(
    "{activeTab === 'directives' && hasPerm('showDirectivesPage') ? (",
    "{activeTab === 'directives' && (hasPerm('showDirectivesPage') || hasPerm('sendDirective') || hasPerm('replyDirective')) && ("
)
new_block = new_block.rstrip() + ")}"

with open('src/pages/TeamDashboard.jsx', 'r', encoding='utf-8') as f:
    team_content = f.read()

# We need to insert it right before `{activeTab === 'lab_results'`
lab_marker = "{activeTab === 'lab_results' &&"
lab_idx = team_content.find(lab_marker)

if lab_idx == -1:
    print("Could not find lab marker in Team")
    exit(1)

# Check if there is already a directives block, and remove it if it exists
# Currently we know it's missing entirely!
# So we just insert it before lab_marker
team_content = team_content[:lab_idx] + new_block + "\n\n        " + team_content[lab_idx:]

with open('src/pages/TeamDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(team_content)
print("SUCCESSFULLY INJECTED")
