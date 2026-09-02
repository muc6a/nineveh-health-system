import re

# Fix TeamDashboard.jsx
with open('src/pages/TeamDashboard.jsx', 'r', encoding='utf-8') as f:
    team_content = f.read()

team_content = team_content.replace(
    "{hasPerm('authenticatePenalties') && (",
    "{(hasPerm('authenticatePenalties') || hasPerm('showFieldTeamsStats')) && ("
)
team_content = team_content.replace(
    "{activeTab === 'operations_room' && hasPerm('authenticatePenalties') && (",
    "{activeTab === 'operations_room' && (hasPerm('authenticatePenalties') || hasPerm('showFieldTeamsStats')) && ("
)

# Rename "بوابة الإدارة الشاملة" to "الإدارة المتقدمة"
team_content = team_content.replace("بوابة الإدارة الشاملة", "الإدارة المتقدمة")

with open('src/pages/TeamDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(team_content)


# Fix ExecutivePortal.jsx
with open('src/pages/ExecutivePortal.jsx', 'r', encoding='utf-8') as f:
    exec_content = f.read()

exec_content = exec_content.replace(
    "permission: 'authenticatePenalties',",
    "permission: 'operations_room_composite'," # We'll handle this manually
)

# Actually, the sidebar config in ExecutivePortal uses `hasPerm(tab.permission)`. 
# We need to change how `hasPerm` works or change the `showCondition` directly.
# Wait, `showCondition` is already there!
# It has:
# showCondition: true
# We should change it to:
# showCondition: hasPerm('authenticatePenalties') || hasPerm('showFieldTeamsStats')

pattern = r"operations_room: \{\s*label: 'غرفة العمليات المركزية',\s*icon: ShieldAlert,\s*iconColorClass: '',\s*activeBgClass: 'bg-rose-600 text-white shadow-md shadow-rose-500/10',\s*permission: 'authenticatePenalties',\s*onClick: \(\) => \{ setExecutiveTab\('dashboard'\); setActiveTab\('operations_room'\); \},\s*isActive: executiveTab === 'dashboard' && activeTab === 'operations_room',\s*showCondition: true\s*\}"

replacement = """operations_room: {
                  label: 'غرفة العمليات المركزية',
                  icon: ShieldAlert,
                  iconColorClass: '',
                  activeBgClass: 'bg-rose-600 text-white shadow-md shadow-rose-500/10',
                  permission: 'authenticatePenalties',
                  onClick: () => { setExecutiveTab('dashboard'); setActiveTab('operations_room'); },
                  isActive: executiveTab === 'dashboard' && activeTab === 'operations_room',
                  showCondition: hasPerm('authenticatePenalties') || hasPerm('showFieldTeamsStats')
                }"""

exec_content = re.sub(pattern, replacement, exec_content)

with open('src/pages/ExecutivePortal.jsx', 'w', encoding='utf-8') as f:
    f.write(exec_content)

print("Fixed Operations Room sidebar conditions")
