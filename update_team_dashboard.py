import re

def refactor_team_dashboard():
    with open("src/pages/TeamDashboard.jsx", "r", encoding="utf-8") as f:
        content = f.read()

    # Define AVAILABLE_TABS array before the Main return
    available_tabs = """  const AVAILABLE_TABS = [
    { id: 'strategic', label: 'اللوحة الرئيسية (الاستراتيجية)', icon: BarChart3, perm: ['showMainDashboard'] },
    { id: 'team_reports', label: 'تقارير الفرق الميدانية', icon: LayoutDashboard, perm: ['showFieldTeamsStats'] },
    { id: 'operations_room', label: 'غرفة العمليات المركزية', icon: ShieldAlert, perm: ['authenticatePenalties', 'showOperationsRoom'] },
    { id: 'geographic', label: 'الخريطة الجغرافية', icon: MapPin, perm: ['showReportsPage'] },
    { id: 'directives', label: 'التبليغات والتوجيهات', icon: Mail, perm: ['showDirectivesPage', 'sendDirective', 'replyDirective'] },
    { id: 'complaints', label: 'شكاوى المواطنين', icon: AlertTriangle, perm: ['showPublicEvalsPage', 'showDeliveryPage'] },
    { id: 'lab_results', label: 'قرارات المختبر', icon: FlaskConical, perm: ['showLabPage'] },
    { id: 'financials', label: 'المالية', icon: CreditCard, perm: ['financialReports', 'payFines', 'dailyInventory'] },
    { id: 'establishments', label: 'إدارة المنشآت', icon: Building2, perm: ['createEst', 'editEst', 'deleteEst'] }
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
    sidebar_buttons_regex = r"<div className=\"space-y-1 mb-6\">[\s\S]*?(?=<div className=\"my-4 border-t border-slate-200 dark:border-slate-800\" />\s*<button\s*onClick=\{\(\) => setExpandedFolders)"
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
                  {tab.id === 'complaints' && activeComplaintsCount > 0 && (
                    <span className="bg-amber-500 text-white text-[10px] px-2 py-0.5 rounded-full">
                      {activeComplaintsCount}
                    </span>
                  )}
                  {tab.id === 'lab_results' && activeLabRequestsCount > 0 && (
                    <span className="bg-fuchsia-500 text-white text-[10px] px-2 py-0.5 rounded-full">
                      {activeLabRequestsCount}
                    </span>
                  )}
                </button>
              );
            })}

            """
    content = re.sub(sidebar_buttons_regex, dynamic_buttons, content)

    # Ensure icons like CreditCard, Building2, MapPin are imported correctly
    import_match = re.search(r"import\s+\{([^}]+)\}\s+from\s+'lucide-react';", content)
    if import_match:
        imports_str = import_match.group(1)
        icons_to_add = []
        for icon in ['Building2', 'MapPin', 'CreditCard']:
            if icon not in imports_str:
                icons_to_add.append(icon)
        if icons_to_add:
            new_imports = imports_str + ", " + ", ".join(icons_to_add)
            content = content.replace(imports_str, new_imports)

    with open("src/pages/TeamDashboard.jsx", "w", encoding="utf-8") as f:
        f.write(content)

if __name__ == "__main__":
    refactor_team_dashboard()
    print("Updated TeamDashboard.jsx")
