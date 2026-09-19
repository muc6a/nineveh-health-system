import re

# 1. Update LabDashboard.jsx
path_lab = "src/pages/LabDashboard.jsx"
with open(path_lab, "r", encoding="utf-8") as f:
    lab = f.read()

# Replace plain cards with glassmorphic cards
lab = lab.replace(
    'className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200/50 dark:border-white/5 shadow-sm"',
    'className="glassmorphic-card p-5 relative overflow-hidden rounded-3xl border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-900/50 group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500"'
)

# Also update the big section card if it exists
lab = lab.replace(
    'className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-200/50 dark:border-white/5 shadow-sm min-h-[50vh] animate-in fade-in duration-500"',
    'className="glassmorphic-card rounded-3xl p-6 border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-900/50 min-h-[50vh] animate-in fade-in duration-500"'
)

# Replace the inner team cards with executive style inner cards if any
lab = lab.replace(
    'className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-700/50 flex flex-col gap-2"',
    'className="bg-white/50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-200/50 dark:border-slate-700/50 flex flex-col gap-2 shadow-sm hover:shadow-md transition-all"'
)

# Adjust grid from grid-cols-3 to match executive style closely
lab = lab.replace(
    '<div className="grid grid-cols-1 md:grid-cols-3 gap-6">',
    '<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 mb-8">'
)

with open(path_lab, "w", encoding="utf-8") as f:
    f.write(lab)

# 2. Update UnifiedSidebar.jsx to remove all icons from sidebar tabs
path_sidebar = "src/components/UnifiedSidebar.jsx"
with open(path_sidebar, "r", encoding="utf-8") as f:
    sidebar = f.read()

# Remove {tab.icon && ... }
sidebar = re.sub(r"\{tab\.icon && <tab\.icon className=\{`w-4\.5 h-4\.5 \$\{.*?\}/>\}", "", sidebar)
# Remove <config.icon ... />
sidebar = re.sub(r"<config\.icon className=\{`w-4\.5 h-4\.5 \$\{.*?\}/>", "", sidebar)

with open(path_sidebar, "w", encoding="utf-8") as f:
    f.write(sidebar)

print("Lab styling and Sidebar icons removed!")
