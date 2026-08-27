import re

filepath = "/Users/admin/web/منظومة الرقابة الصحية الرقمية/src/pages/ExecutivePortal.jsx"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Import FinancialReports
if "import { FinancialReports }" not in content:
    content = content.replace(
        "import { EstablishmentsManager } from '../components/EstablishmentsManager';",
        "import { EstablishmentsManager } from '../components/EstablishmentsManager';\nimport { FinancialReports } from '../components/FinancialReports';"
    )

# 2. Add financials to tabConfig
tab_config_replacement = """                financials: {
                  label: 'التقارير المالية (الغرامات)',
                  icon: Database,
                  iconColorClass: 'text-emerald-500',
                  activeBgClass: 'bg-emerald-600 text-white shadow-md shadow-emerald-500/10',
                  permission: 'showMainDashboard', // Required to be director/admin anyway
                  onClick: () => { setExecutiveTab('dashboard'); setActiveTab('financials'); },
                  isActive: executiveTab === 'dashboard' && activeTab === 'financials',
                  showCondition: ['director', 'central_director', 'admin'].includes(user?.role)
                },
                establishments: {"""

content = content.replace("                establishments: {", tab_config_replacement)

# 3. Add to rendering logic
render_logic = """
        {activeTab === 'financials' && <FinancialReports />}
        
        {activeTab !== 'operations_room' && activeTab !== 'financials' && ("""

content = content.replace("{activeTab !== 'operations_room' && (", render_logic)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated ExecutivePortal.jsx")
