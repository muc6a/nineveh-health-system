import re

def fix_team_dashboard():
    with open('src/pages/TeamDashboard.jsx', 'r', encoding='utf-8') as f:
        content = f.read()
    
    if "PERMISSIONS_TABS" not in content:
        content = content.replace("import { ROLE_CORE_BASICS }", "import { ROLE_CORE_BASICS, PERMISSIONS_TABS }")
    
    # Replace hardcoded spans with dynamic spans
    content = content.replace("<span>إدارة المنشآت</span>", "<span>{PERMISSIONS_TABS.find(t => t.id === 'establishments')?.label || 'المنشآت'}</span>")
    content = content.replace("<span>غرفة العمليات المركزية</span>", "<span>{PERMISSIONS_TABS.find(t => t.id === 'operations_room')?.label || 'غرفة العمليات المركزية'}</span>")
    content = content.replace("<span>التبليغات</span>", "<span>{PERMISSIONS_TABS.find(t => t.id === 'directives')?.label || 'التبليغات'}</span>")
    content = content.replace("<span>الشكاوى</span>", "<span>{PERMISSIONS_TABS.find(t => t.id === 'complaints')?.label || 'الشكاوى'}</span>")
    content = content.replace("<span>قرارات المختبر</span>", "<span>{PERMISSIONS_TABS.find(t => t.id === 'lab')?.label || 'المختبر'}</span>")
    content = content.replace("<span>المالية والحسابات</span>", "<span>{PERMISSIONS_TABS.find(t => t.id === 'financials')?.label || 'المالية'}</span>")

    with open('src/pages/TeamDashboard.jsx', 'w', encoding='utf-8') as f:
        f.write(content)

def fix_executive_portal():
    with open('src/pages/ExecutivePortal.jsx', 'r', encoding='utf-8') as f:
        content = f.read()
    
    if "PERMISSIONS_TABS" not in content:
        content = content.replace("import { ROLE_CORE_BASICS }", "import { ROLE_CORE_BASICS, PERMISSIONS_TABS }")
    
    # In tabConfig
    content = content.replace("label: 'إدارة متقدمة',", "label: PERMISSIONS_TABS.find(t => t.id === 'advanced')?.label || 'الإدارة المتقدمة',")
    content = content.replace("label: 'غرفة العمليات المركزية',", "label: PERMISSIONS_TABS.find(t => t.id === 'operations_room')?.label || 'غرفة العمليات المركزية',")
    content = content.replace("label: 'التبليغات',", "label: PERMISSIONS_TABS.find(t => t.id === 'directives')?.label || 'التبليغات',")
    content = content.replace("label: 'الشكاوى',", "label: PERMISSIONS_TABS.find(t => t.id === 'complaints')?.label || 'الشكاوى',")
    content = content.replace("label: 'قرارات المختبر',", "label: PERMISSIONS_TABS.find(t => t.id === 'lab')?.label || 'المختبر',")
    content = content.replace("label: 'المالية',", "label: PERMISSIONS_TABS.find(t => t.id === 'financials')?.label || 'المالية',")
    
    content = content.replace("activeTab === 'none' ? 'الإدارة المتقدمة'", "activeTab === 'none' ? (PERMISSIONS_TABS.find(t => t.id === 'advanced')?.label || 'الإدارة المتقدمة')")
    content = content.replace("activeTab === 'establishments' ? 'إدارة المنشآت والـ QR'", "activeTab === 'establishments' ? (PERMISSIONS_TABS.find(t => t.id === 'establishments')?.label || 'المنشآت')")
    
    with open('src/pages/ExecutivePortal.jsx', 'w', encoding='utf-8') as f:
        f.write(content)

fix_team_dashboard()
fix_executive_portal()
print("Fixed sidebars to use PERMISSIONS_TABS")
