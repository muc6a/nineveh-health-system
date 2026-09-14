import re

# 1. Update AccountantPanel.jsx
path_acc = "src/pages/AccountantPanel.jsx"
with open(path_acc, "r", encoding="utf-8") as f:
    acc = f.read()

lab_replacement = "          { id: 'lab_management', label: 'المختبر', icon: FlaskConical, activeBgClass: 'bg-indigo-600 text-white shadow-md shadow-indigo-500/10', iconColorClass: 'text-indigo-500', onClick: () => { setActiveTab('lab_management'); navigate('/dashboard/lab?tab=lab_management'); }, showCondition: hasPerm('receiveSamples') || hasPerm('enterLabResults') || hasPerm('labArchive') || hasPerm('viewLabReports') },"

# The four lines to replace in AccountantPanel
acc = re.sub(r"\s*\{\s*id:\s*'stats'.*?viewLabReports'\)\s*\}," +
             r"\s*\{\s*id:\s*'incoming'.*?receiveSamples'\)\s*\}," +
             r"\s*\{\s*id:\s*'testing'.*?enterLabResults'\)\s*\}," +
             r"\s*\{\s*id:\s*'archive'.*?labArchive'\)\s*\},", 
             f"\n{lab_replacement}", acc, flags=re.DOTALL)

with open(path_acc, "w", encoding="utf-8") as f:
    f.write(acc)

# 2. Update LabDashboard.jsx
path_lab = "src/pages/LabDashboard.jsx"
with open(path_lab, "r", encoding="utf-8") as f:
    lab = f.read()

fin_replacement = "          { id: 'financials', label: 'المالية', icon: Database, activeBgClass: 'bg-emerald-600 text-white shadow-md shadow-emerald-500/10', iconColorClass: 'text-emerald-500', onClick: () => { setActiveTab('financials'); navigate('/dashboard/accountant?tab=financials'); }, showCondition: hasPerm('financialReports') || hasPerm('payFines') || hasPerm('dailyInventory') || hasPerm('viewComprehensiveFinancialReports') },"

lab = re.sub(r"\s*\{\s*id:\s*'financials'.*?financialReports'\)\s*\}," +
             r"\s*\{\s*id:\s*'ext_financials'.*?payFines'\)\s*\}," +
             r"\s*\{\s*id:\s*'reconciliation'.*?dailyInventory'\)\s*\}," +
             r"\s*\{\s*id:\s*'comprehensive_reports'.*?viewComprehensiveFinancialReports'\)\s*\},", 
             f"\n{fin_replacement}", lab, flags=re.DOTALL)

# Add Database icon import to LabDashboard if missing
if "Database" not in lab:
    lab = lab.replace("FlaskConical,", "FlaskConical, Database,")

with open(path_lab, "w", encoding="utf-8") as f:
    f.write(lab)

print("Custom tabs updated!")
