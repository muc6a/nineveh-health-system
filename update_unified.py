import re

def update():
    path = "src/components/UnifiedSidebar.jsx"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # Find the imports to add icons
    # import { FlaskConical, CheckCircle, AlertTriangle, Clock, Archive, FileText, Check, X, ShieldAlert, FileSearch, Power, BarChart3, LayoutDashboard, Menu, LogOut, Plus, TrendingUp, Mail, Database, Building, CreditCard, ClipboardList } from 'lucide-react';
    if "BarChart3" not in content:
        content = content.replace("import {", "import { BarChart3, Clock, Archive, LayoutDashboard, CreditCard, ClipboardList,")

    # Add the missing tabs to tabConfig
    # We'll insert them into the tabConfig dictionary
    new_tabs = """
    lab_stats: {
      label: 'التقارير المختبرية والرقابية للعينات',
      icon: BarChart3,
      iconColorClass: 'text-indigo-500',
      activeBgClass: 'bg-indigo-600 text-white shadow-md shadow-indigo-500/10',
      showCondition: hasPerm('viewLabReports'),
      onClick: () => { if(setExecutiveTab) setExecutiveTab('dashboard'); setActiveTab('stats'); }
    },
    lab_incoming: {
      label: 'استلام العينات',
      icon: Clock,
      iconColorClass: 'text-amber-500',
      activeBgClass: 'bg-amber-600 text-white shadow-md shadow-amber-500/10',
      showCondition: hasPerm('receiveSamples'),
      onClick: () => { if(setExecutiveTab) setExecutiveTab('dashboard'); setActiveTab('incoming'); }
    },
    lab_testing: {
      label: 'إدخال نتائج الفحص',
      icon: FlaskConical,
      iconColorClass: 'text-indigo-500',
      activeBgClass: 'bg-indigo-600 text-white shadow-md shadow-indigo-500/10',
      showCondition: hasPerm('enterLabResults'),
      onClick: () => { if(setExecutiveTab) setExecutiveTab('dashboard'); setActiveTab('testing'); }
    },
    lab_archive: {
      label: 'الأرشيف المختبري',
      icon: Archive,
      iconColorClass: 'text-slate-500',
      activeBgClass: 'bg-slate-600 text-white shadow-md shadow-slate-500/10',
      showCondition: hasPerm('labArchive'),
      onClick: () => { if(setExecutiveTab) setExecutiveTab('dashboard'); setActiveTab('archive'); }
    },
    acc_dashboard: {
      label: 'تقارير المحاسب',
      icon: LayoutDashboard,
      iconColorClass: 'text-emerald-500',
      activeBgClass: 'bg-emerald-600 text-white shadow-md shadow-emerald-500/10',
      showCondition: hasPerm('financialReports'),
      onClick: () => { if(setExecutiveTab) setExecutiveTab('dashboard'); setActiveTab('dashboard'); }
    },
    acc_fines: {
      label: 'الغرامات والإيرادات',
      icon: CreditCard,
      iconColorClass: 'text-emerald-500',
      activeBgClass: 'bg-emerald-600 text-white shadow-md shadow-emerald-500/10',
      showCondition: hasPerm('payFines'),
      onClick: () => { if(setExecutiveTab) setExecutiveTab('dashboard'); setActiveTab('ext_financials'); }
    },
    acc_inventory: {
      label: 'جرد اليومية والمطابقة',
      icon: ClipboardList,
      iconColorClass: 'text-emerald-500',
      activeBgClass: 'bg-emerald-600 text-white shadow-md shadow-emerald-500/10',
      showCondition: hasPerm('dailyInventory'),
      onClick: () => { if(setExecutiveTab) setExecutiveTab('dashboard'); setActiveTab('reconciliation'); }
    },
"""
    
    # Insert new_tabs after "strategic: {"
    content = content.replace("strategic: {", new_tabs + "    strategic: {")
    
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

if __name__ == "__main__":
    update()
