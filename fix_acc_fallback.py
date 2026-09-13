import re

def fix_acc_panel():
    path = "src/pages/AccountantPanel.jsx"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    fallback_logic = """
  React.useEffect(() => {
    let isAllowed = false;
    if (activeTab === 'dashboard' && hasPerm('financialReports')) isAllowed = true;
    if (activeTab === 'ext_financials' && hasPerm('payFines')) isAllowed = true;
    if (activeTab === 'reconciliation' && hasPerm('dailyInventory')) isAllowed = true;
    if (activeTab === 'directives' && (hasPerm('showDirectivesPage') || hasPerm('sendDirective') || hasPerm('replyDirective'))) isAllowed = true;
    if (activeTab === 'comprehensive_reports' && hasPerm('viewComprehensiveFinancialReports')) isAllowed = true;
    if (activeTab === 'strategic' && hasPerm('showMainDashboard')) isAllowed = true;
    if (activeTab === 'establishments' && hasPerm('manageEstablishments')) isAllowed = true;
    if (activeTab === 'ext_reports' && hasPerm('showReportsPage')) isAllowed = true;
    if (activeTab === 'ext_map' && hasPerm('showSectorMap')) isAllowed = true;
    if (activeTab === 'ext_smart_tasks' && hasPerm('showSmartTasks')) isAllowed = true;

    if (!isAllowed) {
       if (hasPerm('financialReports')) setActiveTab('dashboard');
       else if (hasPerm('payFines')) setActiveTab('ext_financials');
       else if (hasPerm('dailyInventory')) setActiveTab('reconciliation');
       else if (hasPerm('showDirectivesPage') || hasPerm('sendDirective') || hasPerm('replyDirective')) setActiveTab('directives');
       else if (hasPerm('viewComprehensiveFinancialReports')) setActiveTab('comprehensive_reports');
       else if (hasPerm('showMainDashboard')) setActiveTab('strategic');
       else if (hasPerm('manageEstablishments')) setActiveTab('establishments');
       else if (hasPerm('showReportsPage')) setActiveTab('ext_reports');
       else if (hasPerm('showSectorMap')) setActiveTab('ext_map');
       else if (hasPerm('showSmartTasks')) setActiveTab('ext_smart_tasks');
    }
  }, [user?.permissions, activeTab]);
"""

    if "React.useEffect(() => {" not in content.split("const [activeTab, setActiveTab] = useState")[1][:1000]:
        content = re.sub(r"(const \[activeTab, setActiveTab\] = useState\([^)]+\);\n)", r"\1" + fallback_logic, content)
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)

if __name__ == "__main__":
    fix_acc_panel()
