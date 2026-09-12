import re

def refactor_accountant_panel():
    with open("src/pages/AccountantPanel.jsx", "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Define AVAILABLE_TABS array before the Main return
    available_tabs = """  const AVAILABLE_TABS = [
    { id: 'dashboard', label: 'التقارير', icon: LayoutDashboard, perm: ['financialReports'] },
    { id: 'ext_financials', label: 'الغرامات والإيرادات', icon: CreditCard, perm: ['payFines'] },
    { id: 'reconciliation', label: 'جرد اليومية والمطابقة', icon: ClipboardList, perm: ['dailyInventory'] },
    { id: 'directives', label: 'التبليغات', icon: Mail, perm: ['showDirectivesPage', 'sendDirective', 'replyDirective'] }
  ];

  const visibleTabs = AVAILABLE_TABS.filter(tab => {
    return tab.perm.some(p => hasPerm(p));
  });

  const sortedTabs = [...visibleTabs].sort((a, b) => {
    const order = uiPreferences?.tabOrder || [];
    const indexA = order.indexOf(a.id);
    const indexB = order.indexOf(b.id);
    if (indexA === -1 && indexB === -1) return 0;
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  return (
    <div
      className={`min-h-screen bg-slate-50"""
    
    # Replace ONLY the main return
    content = content.replace("  return (\n    <div\n      className={`min-h-screen bg-slate-50", available_tabs)

    # 2. Pass sidebarTabs to DisplayPreferencesModal
    content = content.replace(
        "<DisplayPreferencesModal isOpen={showDisplayPrefsModal} onClose={() => setShowDisplayPrefsModal(false)} />",
        "<DisplayPreferencesModal isOpen={showDisplayPrefsModal} onClose={() => setShowDisplayPrefsModal(false)} sidebarTabs={AVAILABLE_TABS} />"
    )

    # 3. Replace the sidebar buttons with a dynamic map
    sidebar_buttons_regex = r"<div className=\"space-y-1 mb-6\">[\s\S]*?(?=\{hasPerm\(\"viewComprehensiveFinancialReports\"\))"
    dynamic_buttons = """<div className="space-y-1 mb-6">
            {sortedTabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full text-right px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center justify-between ${
                    activeTab === tab.id
                      ? "bg-teal-600 text-white shadow-md shadow-teal-500/10"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4.5 h-4.5" />
                    <span>{tab.label}</span>
                  </div>
                  {tab.id === 'directives' && unreadDirectivesCount > 0 && (
                    <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">
                      {unreadDirectivesCount}
                    </span>
                  )}
                </button>
              );
            })}

            """
    content = re.sub(sidebar_buttons_regex, dynamic_buttons, content)

    with open("src/pages/AccountantPanel.jsx", "w", encoding="utf-8") as f:
        f.write(content)

if __name__ == "__main__":
    refactor_accountant_panel()
    print("Updated AccountantPanel.jsx")
