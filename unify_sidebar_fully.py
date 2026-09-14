import re

# 1. Add all 8 detailed tabs to UnifiedSidebar.jsx
path_sidebar = "src/components/UnifiedSidebar.jsx"
with open(path_sidebar, "r", encoding="utf-8") as f:
    sidebar = f.read()

detailed_tabs = """
    stats: {
      label: 'التقارير المختبرية والرقابية',
      icon: BarChart3,
      iconColorClass: 'text-indigo-500',
      activeBgClass: 'bg-indigo-600 text-white shadow-md shadow-indigo-500/10',
      showCondition: hasPerm('viewLabReports'),
      onClick: () => { if(setExecutiveTab) setExecutiveTab('dashboard'); setActiveTab('stats'); if (window.location.pathname !== '/dashboard/lab' && navigate) navigate('/dashboard/lab?tab=stats'); }
    },
    incoming: {
      label: 'استلام العينات',
      icon: Clock,
      iconColorClass: 'text-amber-500',
      activeBgClass: 'bg-indigo-600 text-white shadow-md shadow-indigo-500/10',
      showCondition: hasPerm('receiveSamples'),
      onClick: () => { if(setExecutiveTab) setExecutiveTab('dashboard'); setActiveTab('incoming'); if (window.location.pathname !== '/dashboard/lab' && navigate) navigate('/dashboard/lab?tab=incoming'); }
    },
    testing: {
      label: 'إدخال نتائج الفحص',
      icon: FlaskConical,
      iconColorClass: 'text-indigo-500',
      activeBgClass: 'bg-indigo-600 text-white shadow-md shadow-indigo-500/10',
      showCondition: hasPerm('enterLabResults'),
      onClick: () => { if(setExecutiveTab) setExecutiveTab('dashboard'); setActiveTab('testing'); if (window.location.pathname !== '/dashboard/lab' && navigate) navigate('/dashboard/lab?tab=testing'); }
    },
    archive: {
      label: 'الأرشيف المختبري',
      icon: Archive,
      iconColorClass: 'text-slate-500',
      activeBgClass: 'bg-indigo-600 text-white shadow-md shadow-indigo-500/10',
      showCondition: hasPerm('labArchive'),
      onClick: () => { if(setExecutiveTab) setExecutiveTab('dashboard'); setActiveTab('archive'); if (window.location.pathname !== '/dashboard/lab' && navigate) navigate('/dashboard/lab?tab=archive'); }
    },
    
    financials: {
      label: 'التقارير المالية',
      icon: LayoutDashboard,
      iconColorClass: 'text-emerald-500',
      activeBgClass: 'bg-emerald-600 text-white shadow-md shadow-emerald-500/10',
      showCondition: hasPerm('financialReports'),
      onClick: () => { if(setExecutiveTab) setExecutiveTab('dashboard'); setActiveTab('financials'); if (window.location.pathname !== '/dashboard/accountant' && navigate) navigate('/dashboard/accountant?tab=financials'); }
    },
    ext_financials: {
      label: 'الغرامات والإيرادات',
      icon: CreditCard,
      iconColorClass: 'text-emerald-500',
      activeBgClass: 'bg-emerald-600 text-white shadow-md shadow-emerald-500/10',
      showCondition: hasPerm('payFines'),
      onClick: () => { if(setExecutiveTab) setExecutiveTab('dashboard'); setActiveTab('ext_financials'); if (window.location.pathname !== '/dashboard/accountant' && navigate) navigate('/dashboard/accountant?tab=ext_financials'); }
    },
    reconciliation: {
      label: 'جرد اليومية والمطابقة',
      icon: ClipboardList,
      iconColorClass: 'text-emerald-500',
      activeBgClass: 'bg-emerald-600 text-white shadow-md shadow-emerald-500/10',
      showCondition: hasPerm('dailyInventory'),
      onClick: () => { if(setExecutiveTab) setExecutiveTab('dashboard'); setActiveTab('reconciliation'); if (window.location.pathname !== '/dashboard/accountant' && navigate) navigate('/dashboard/accountant?tab=reconciliation'); }
    },
    comprehensive_reports: {
      label: 'التقارير المالية الشاملة',
      icon: FileSearch,
      iconColorClass: 'text-amber-500',
      activeBgClass: 'bg-amber-600 text-white shadow-md shadow-amber-500/10',
      showCondition: hasPerm('viewComprehensiveFinancialReports'),
      onClick: () => { if(setExecutiveTab) setExecutiveTab('dashboard'); setActiveTab('comprehensive_reports'); if (window.location.pathname !== '/dashboard/accountant' && navigate) navigate('/dashboard/accountant?tab=comprehensive_reports'); }
    },
"""

# Replace lab_management and financials in UnifiedSidebar.jsx with the detailed tabs
sidebar = re.sub(r"lab_management: \{.*?\},", "", sidebar, flags=re.DOTALL)
sidebar = re.sub(r"financials: \{.*?\},", detailed_tabs, sidebar, flags=re.DOTALL)

with open(path_sidebar, "w", encoding="utf-8") as f:
    f.write(sidebar)


# 2. Remove customTabs from AccountantPanel.jsx
path_acc = "src/pages/AccountantPanel.jsx"
with open(path_acc, "r", encoding="utf-8") as f:
    acc = f.read()

# Just remove the customTabs prop entirely
acc = re.sub(r"customTabs=\{\[.*?\]\}", "", acc, flags=re.DOTALL)

with open(path_acc, "w", encoding="utf-8") as f:
    f.write(acc)


# 3. Remove customTabs from LabDashboard.jsx
path_lab = "src/pages/LabDashboard.jsx"
with open(path_lab, "r", encoding="utf-8") as f:
    lab = f.read()

# Just remove the customTabs prop entirely
lab = re.sub(r"customTabs=\{\[.*?\]\}", "", lab, flags=re.DOTALL)

with open(path_lab, "w", encoding="utf-8") as f:
    f.write(lab)

print("Unified sidebar fixed completely!")
