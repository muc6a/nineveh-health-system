import os
import re

def main():
    filepath = 'src/pages/SuperAdminPanel.jsx'
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace PERMISSIONS_TABS
    old_tabs = """        const PERMISSIONS_TABS = [
          { id: 'establishments', label: 'إدارة المنشآت', icon: <Building className="w-4 h-4"/>, keys: ['manageEstablishments', 'createEst', 'editEst', 'deleteEst', 'addEval'] },
          { id: 'pages', label: 'صفحات النظام', icon: <Compass className="w-4 h-4"/>, keys: ['showMainDashboard', 'showReportsPage', 'showDirectivesPage', 'showDeliveryPage', 'showPublicEvalsPage', 'showLabPage'] },
          { id: 'directives', label: 'التبليغات', icon: <Mail className="w-4 h-4"/>, keys: ['sendDirective', 'replyDirective'] },
          { id: 'penalties', label: 'العقوبات والإغلاقات', icon: <ShieldAlert className="w-4 h-4 text-red-400"/>, keys: ['issueFine', 'closeEst', 'reopenEst'] },
          { id: 'advanced', label: 'إدارة متقدمة', icon: <Settings className="w-4 h-4"/>, keys: ['manageComplaints', 'exportData', 'viewAuditLogs', 'manageAccounts', 'manageSettings', 'backupData'] },
          { id: 'financials', label: 'المالية', icon: <Activity className="w-4 h-4 text-amber-500"/>, keys: ['viewComprehensiveFinancialReports'] },
        ];"""

    # Note that old_tabs might have 'المالية' or 'التقارير المالية' depending on what patch_strings.py did. Let's use regex or string replace.
    # Actually, patch_strings changed 'التقارير المالية' to 'المالية' in the original file.
    
    new_tabs = """        const PERMISSIONS_TABS = [
          { id: 'establishments', label: 'إدارة المنشآت', icon: <Building className="w-4 h-4"/>, keys: ['manageEstablishments', 'createEst', 'editEst', 'deleteEst', 'addEval'] },
          { id: 'pages', label: 'صفحات النظام', icon: <Compass className="w-4 h-4"/>, keys: ['showMainDashboard', 'showReportsPage'] },
          { id: 'directives', label: 'التبليغات', icon: <Mail className="w-4 h-4"/>, keys: ['showDirectivesPage', 'sendDirective', 'replyDirective'] },
          { id: 'penalties', label: 'العقوبات والإغلاقات', icon: <ShieldAlert className="w-4 h-4 text-red-400"/>, keys: ['issueFine', 'closeEst', 'reopenEst'] },
          { id: 'complaints', label: 'الشكاوى', icon: <Activity className="w-4 h-4 text-rose-400"/>, keys: ['showPublicEvalsPage', 'showDeliveryPage', 'manageComplaints'] },
          { id: 'lab', label: 'قرارات المختبر', icon: <Activity className="w-4 h-4 text-teal-400"/>, keys: ['showLabPage'] },
          { id: 'advanced', label: 'إدارة متقدمة', icon: <Settings className="w-4 h-4"/>, keys: ['exportData', 'viewAuditLogs', 'manageAccounts', 'manageSettings', 'backupData'] },
          { id: 'financials', label: 'المالية', icon: <Activity className="w-4 h-4 text-emerald-500"/>, keys: ['viewComprehensiveFinancialReports'] },
        ];"""

    # We can just replace the block between `const PERMISSIONS_TABS = [` and `];`
    content = re.sub(
        r'const PERMISSIONS_TABS = \[.*?\];',
        new_tabs,
        content,
        flags=re.DOTALL
    )

    # In PERMISSION_DETAILS, update title for showPublicEvalsPage and showDeliveryPage
    content = content.replace(
        "showPublicEvalsPage: { title: 'شكاوى المواطنين'",
        "showPublicEvalsPage: { title: 'شكاوى المواطنين'"
    ) # Wait, patch_strings.py renamed "التقييمات العامة (الشكاوى)" to "شكاوى المواطنين".
    
    content = content.replace(
        "showDeliveryPage: { title: 'خدمة التوصيل', desc: 'يمنح الحساب صلاحية رؤية صفحة التوصيل لمراقبة ومتابعة عمال الدليفري.' }",
        "showDeliveryPage: { title: 'شكاوى خدمة التوصيل', desc: 'يمنح الحساب صلاحية رؤية صفحة التوصيل لمراقبة ومتابعة عمال الدليفري.' }"
    )
    
    content = content.replace(
        "showDirectivesPage: { title: 'التبليغات والتوجيهات', desc: 'يسمح للحساب بفتح صفحة \"التوجيهات\" لمشاهدة المراسلات الإدارية الواردة والصادرة.' }",
        "showDirectivesPage: { title: 'تصفح التبليغات', desc: 'يسمح للحساب بفتح صفحة \"التبليغات\" لمشاهدة المراسلات الإدارية الواردة والصادرة.' }"
    )

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Updated SuperAdminPanel.jsx permissions.")

if __name__ == "__main__":
    main()
