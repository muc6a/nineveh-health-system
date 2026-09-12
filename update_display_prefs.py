import re

def update_display_prefs_modal():
    with open("src/components/DisplayPreferencesModal.jsx", "r", encoding="utf-8") as f:
        content = f.read()

    get_available_tabs_regex = r"const getAvailableTabs = \(\) => \{[\s\S]*?\};\s*const availableTabsMap = getAvailableTabs\(\);"
    
    get_available_tabs_replacement = """const getAvailableTabs = () => {
    const tabs = {};
    if (hasPerm('showMainDashboard') || hasPerm('financialReports')) tabs.strategic = 'اللوحة الرئيسية (الاستراتيجية)';
    if (hasPerm('financialReports')) tabs.dashboard = 'التقارير';
    if (hasPerm('showFieldTeamsStats')) tabs.team_reports = 'تقارير الفرق الميدانية';
    if (hasPerm('showOperationsRoom') || hasPerm('authenticatePenalties') || hasPerm('receiveSamples') || hasPerm('enterLabResults') || hasPerm('labArchive')) tabs.operations_room = 'غرفة العمليات المركزية';
    if (hasPerm('showReportsPage')) tabs.geographic = 'الخريطة الجغرافية';
    if (hasPerm('showDirectivesPage') || hasPerm('sendDirective') || hasPerm('replyDirective') || hasPerm('quickTeamDispatch')) tabs.directives = 'التبليغات والتوجيهات';
    if (hasPerm('showPublicEvalsPage') || hasPerm('showDeliveryPage')) tabs.complaints = 'شكاوى المواطنين';
    if (hasPerm('showLabPage')) tabs.lab_results = 'قرارات المختبر';
    if (hasPerm('receiveSamples') || hasPerm('enterLabResults') || hasPerm('labArchive') || hasPerm('authenticatePenalties')) tabs.lab_management = 'المختبر';
    if (hasPerm('financialReports') || hasPerm('payFines') || hasPerm('dailyInventory')) tabs.financials = 'المالية';
    if (hasPerm('manageEstablishments')) tabs.establishments = 'إدارة المنشآت';
    if (hasPerm('payFines')) tabs.ext_financials = 'الغرامات والإيرادات';
    if (hasPerm('dailyInventory')) tabs.reconciliation = 'جرد اليومية والمطابقة';
    return tabs;
  };

  const availableTabsMap = getAvailableTabs();"""
    
    content = re.sub(get_available_tabs_regex, get_available_tabs_replacement, content)

    with open("src/components/DisplayPreferencesModal.jsx", "w", encoding="utf-8") as f:
        f.write(content)

if __name__ == "__main__":
    update_display_prefs_modal()
    print("Updated DisplayPreferencesModal.jsx")
