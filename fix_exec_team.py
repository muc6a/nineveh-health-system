with open('src/pages/ExecutivePortal.jsx', 'r', encoding='utf-8') as f:
    exec_content = f.read()

# Add import
exec_content = exec_content.replace(
    "import { FinancialReports } from '../components/FinancialReports';",
    "import { FinancialReports } from '../components/FinancialReports';\nimport { LabManager } from '../components/LabManager';"
)

# Update sidebar button
old_btn = "onClick: () => { navigate('/dashboard/lab'); },\n                  isActive: false,"
new_btn = "onClick: () => { setExecutiveTab('dashboard'); setActiveTab('lab_management'); },\n                  isActive: executiveTab === 'dashboard' && activeTab === 'lab_management',"
exec_content = exec_content.replace(old_btn, new_btn)

# Add rendering
old_render = ") : activeTab === 'financials'"
new_render = """) : activeTab === 'lab_management' && (hasPerm('receiveSamples') || hasPerm('enterLabResults') || hasPerm('labArchive')) ? (
          <LabManager />
        ) : activeTab === 'financials'"""
exec_content = exec_content.replace(old_render, new_render)

# Change key in sidebar
exec_content = exec_content.replace("lab_dashboard: {", "lab_management: {")

with open('src/pages/ExecutivePortal.jsx', 'w', encoding='utf-8') as f:
    f.write(exec_content)

# TeamDashboard.jsx
with open('src/pages/TeamDashboard.jsx', 'r', encoding='utf-8') as f:
    team_content = f.read()

team_content = team_content.replace(
    "import { FinancialReports } from '../components/FinancialReports';",
    "import { FinancialReports } from '../components/FinancialReports';\nimport { LabManager } from '../components/LabManager';"
)

old_btn_team = "onClick={() => { navigate('/dashboard/lab'); setIsSidebarOpen(false); }}"
new_btn_team = "onClick={() => { setActiveTab('lab_management'); setIsSidebarOpen(false); }}"
team_content = team_content.replace(old_btn_team, new_btn_team)

old_btn_team2 = "activeTab === 'financials'"
# Actually, wait, the button in TeamDashboard doesn't highlight if activeTab === 'lab_management'.
# Let's fix the button class in TeamDashboard manually via python.

import re
old_button_block = r"(<button.*?onClick=\{\(\) => \{ setActiveTab\('lab_management'\);.*?)\n(.*?)text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40(.*?)\n(.*?<FlaskConical.*?)\n(.*?<span>إدارة المختبر</span>\n.*?</button>)"
new_button_block = r"\1\n\2${activeTab === 'lab_management' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/10' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40'}\3\n\4\n\5"
team_content = re.sub(r"(onClick=\{\(\) => \{ setActiveTab\('lab_management'\);.*?className.*?text-slate-700.*?)", r"onClick={() => { setActiveTab('lab_management'); setIsSidebarOpen(false); }}\n                className={`w-full text-right px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center gap-3 ${activeTab === 'lab_management' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/10' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40'}`}", team_content, flags=re.DOTALL)
# The above regex might be messy, I'll just write a custom replace

old_team_btn_full = """            {(hasPerm('receiveSamples') || hasPerm('enterLabResults') || hasPerm('labArchive')) && (
              <button
                onClick={() => { setActiveTab('lab_management'); setIsSidebarOpen(false); }}
                className="w-full text-right px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center gap-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40"
              >
                <FlaskConical className="w-4.5 h-4.5 text-indigo-500" />
                <span>إدارة المختبر</span>
              </button>
            )}"""
new_team_btn_full = """            {(hasPerm('receiveSamples') || hasPerm('enterLabResults') || hasPerm('labArchive')) && (
              <button
                onClick={() => { setActiveTab('lab_management'); setIsSidebarOpen(false); }}
                className={`w-full text-right px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center gap-3 ${activeTab === 'lab_management' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/10' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40'}`}
              >
                <FlaskConical className={`w-4.5 h-4.5 ${activeTab === 'lab_management' ? '' : 'text-indigo-500'}`} />
                <span>إدارة المختبر</span>
              </button>
            )}"""
team_content = team_content.replace(old_team_btn_full, new_team_btn_full)

# Add rendering in TeamDashboard
old_render_team = "{activeTab === 'financials'"
new_render_team = """{activeTab === 'lab_management' && (hasPerm('receiveSamples') || hasPerm('enterLabResults') || hasPerm('labArchive')) && (
          <LabManager />
        )}
        
        {activeTab === 'financials'"""
team_content = team_content.replace(old_render_team, new_render_team)

with open('src/pages/TeamDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(team_content)

print("Updated Exec and Team Dashboards")
