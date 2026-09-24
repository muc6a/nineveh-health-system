import re
import os

sidebar_path = "/Users/admin/web/منظومة الرقابة الصحية الرقمية/src/components/UnifiedSidebar.jsx"
lab_path = "/Users/admin/web/منظومة الرقابة الصحية الرقمية/src/pages/LabDashboard.jsx"
acc_path = "/Users/admin/web/منظومة الرقابة الصحية الرقمية/src/pages/AccountantPanel.jsx"

# 1. Update UnifiedSidebar.jsx
with open(sidebar_path, "r", encoding="utf-8") as f:
    sidebar_content = f.read()

# Replace tabConfig to just have lab_dashboard and finance_dashboard instead of the sub-items
# Let's completely replace the tabConfig definition
new_tab_config = """  const tabConfig = {
    summary: {
      label: 'الرئيسية (لوحة التحكم)',
      icon: LayoutDashboard,
      iconColorClass: 'text-indigo-500',
      activeBgClass: 'bg-indigo-600 text-white shadow-md shadow-indigo-500/10',
      showCondition: hasPerm('showMainDashboard'),
      isActive: activeTab === 'summary',
      onClick: () => { if(setExecutiveTab) setExecutiveTab('dashboard'); setActiveTab('summary'); }
    },
    strategic: {
      label: 'ملخص العمليات الرقابية',
      icon: BarChart3,
      iconColorClass: 'text-teal-500',
      activeBgClass: 'bg-teal-600 text-white shadow-md shadow-teal-500/10',
      showCondition: hasPerm('showMainDashboard') || hasPerm('showReportsPage') || hasPerm('exportData'),
      isActive: activeTab === 'strategic',
      onClick: () => { if(setExecutiveTab) setExecutiveTab('dashboard'); setActiveTab('strategic'); if (window.location.pathname !== '/dashboard/team' && navigate) navigate('/dashboard/team?tab=strategic'); }
    },
    smart_tasks: {
      label: 'المهام الذكية الموجهة',
      icon: CheckSquare,
      iconColorClass: 'text-blue-500',
      activeBgClass: 'bg-blue-600 text-white shadow-md shadow-blue-500/10',
      showCondition: hasPerm('manageSmartTasks') || hasPerm('executeSmartTasks'),
      badge: (user?.role === 'team' || user?.role === 'team_leader') && hasPerm('executeSmartTasks') ? 
             (establishments?.filter(e => matchSector(userSector, e.sector) && e.lastInspection === 'لم يزر بعد').length || 0) : null,
      badgeColor: 'bg-blue-500',
      isActive: activeTab === 'smart_tasks',
      onClick: () => { if(setExecutiveTab) setExecutiveTab('dashboard'); setActiveTab('smart_tasks'); if (window.location.pathname !== '/dashboard/team' && navigate) navigate('/dashboard/team?tab=smart_tasks'); }
    },
    operations_room: {
      label: 'غرفة العمليات المركزية',
      icon: ShieldAlert,
      iconColorClass: 'text-rose-500',
      activeBgClass: 'bg-rose-600 text-white shadow-md shadow-rose-500/10',
      showCondition: hasPerm('authenticatePenalties'),
      badge: hasPerm('authenticatePenalties') ? (penaltyRequests?.filter(r => r.status === 'pending').length || 0) : null,
      badgeColor: 'bg-rose-500',
      isActive: activeTab === 'operations_room',
      onClick: () => { if(setExecutiveTab) setExecutiveTab('dashboard'); setActiveTab('operations_room'); if (window.location.pathname !== '/dashboard/team' && navigate) navigate('/dashboard/team?tab=operations_room'); }
    },
    complaints: {
      label: 'شكاوى المواطنين والتوصيل',
      icon: MessageCircle,
      iconColorClass: 'text-purple-500',
      activeBgClass: 'bg-purple-600 text-white shadow-md shadow-purple-500/10',
      showCondition: hasPerm('showPublicEvalsPage') || hasPerm('showDeliveryPage'),
      isActive: activeTab === 'complaints',
      onClick: () => { if(setExecutiveTab) setExecutiveTab('dashboard'); setActiveTab('complaints'); if (window.location.pathname !== '/dashboard/team' && navigate) navigate('/dashboard/team?tab=complaints'); }
    },
    directives: {
      label: 'بوابة التبليغات الإدارية',
      icon: Mail,
      iconColorClass: 'text-amber-500',
      activeBgClass: 'bg-amber-600 text-white shadow-md shadow-amber-500/10',
      showCondition: hasPerm('showDirectivesPage') || hasPerm('sendDirective') || hasPerm('replyDirective'),
      badge: unreadDirectivesCount > 0 ? unreadDirectivesCount : null,
      badgeColor: 'bg-amber-500',
      isActive: activeTab === 'directives',
      onClick: () => { if(setExecutiveTab) setExecutiveTab('dashboard'); setActiveTab('directives'); if (window.location.pathname !== '/dashboard/team' && navigate) navigate('/dashboard/team?tab=directives'); }
    },
    establishments: {
      label: 'إدارة المنشآت الغذائية',
      icon: Store,
      iconColorClass: 'text-emerald-500',
      activeBgClass: 'bg-emerald-600 text-white shadow-md shadow-emerald-500/10',
      showCondition: hasPerm('manageEstablishments'),
      isActive: activeTab === 'establishments' || activeTab === 'directory',
      onClick: () => { if(setExecutiveTab) setExecutiveTab('dashboard'); setActiveTab('establishments'); if (window.location.pathname !== '/dashboard/team' && navigate) navigate('/dashboard/team?tab=establishments'); }
    },
    map: {
      label: 'الخريطة التفاعلية (GPS)',
      icon: Map,
      iconColorClass: 'text-sky-500',
      activeBgClass: 'bg-sky-600 text-white shadow-md shadow-sky-500/10',
      showCondition: hasPerm('showSectorMap'),
      isActive: activeTab === 'map',
      onClick: () => { if(setExecutiveTab) setExecutiveTab('dashboard'); setActiveTab('map'); if (window.location.pathname !== '/dashboard/team' && navigate) navigate('/dashboard/team?tab=map'); }
    },
    lab_dashboard: {
      label: 'قسم المختبر',
      icon: FlaskConical,
      iconColorClass: 'text-indigo-500',
      activeBgClass: 'bg-indigo-600 text-white shadow-md shadow-indigo-500/10',
      showCondition: hasPerm('viewLabReports') || hasPerm('receiveSamples') || hasPerm('enterLabResults') || hasPerm('labArchive'),
      isActive: ['stats', 'incoming', 'testing', 'archive', 'lab_dashboard', 'lab_management'].includes(activeTab),
      onClick: () => { 
        if(setExecutiveTab) setExecutiveTab('dashboard'); 
        
        let defaultTab = 'stats';
        if (!hasPerm('viewLabReports')) {
          if (hasPerm('receiveSamples')) defaultTab = 'incoming';
          else if (hasPerm('enterLabResults')) defaultTab = 'testing';
          else if (hasPerm('labArchive')) defaultTab = 'archive';
        }
        
        setActiveTab(defaultTab); 
        if (window.location.pathname !== '/dashboard/lab' && navigate) navigate(`/dashboard/lab?tab=${defaultTab}`); 
        else if (window.location.pathname === '/dashboard/team' && navigate) {
          // If in team dashboard, we just show it embedded
          setActiveTab('lab_management');
        }
      }
    },
    finance_dashboard: {
      label: 'القسم المالي',
      icon: Banknote,
      iconColorClass: 'text-emerald-500',
      activeBgClass: 'bg-emerald-600 text-white shadow-md shadow-emerald-500/10',
      showCondition: hasPerm('financialReports') || hasPerm('payFines') || hasPerm('dailyInventory') || hasPerm('viewComprehensiveFinancialReports'),
      isActive: ['financials', 'ext_financials', 'reconciliation', 'comprehensive_reports', 'finance_dashboard', 'accountant'].includes(activeTab),
      onClick: () => { 
        if(setExecutiveTab) setExecutiveTab('dashboard'); 
        
        let defaultTab = 'financials';
        if (!hasPerm('financialReports')) {
          if (hasPerm('payFines')) defaultTab = 'ext_financials';
          else if (hasPerm('dailyInventory')) defaultTab = 'reconciliation';
          else if (hasPerm('viewComprehensiveFinancialReports')) defaultTab = 'comprehensive_reports';
        }

        setActiveTab(defaultTab); 
        if (window.location.pathname !== '/dashboard/accountant' && navigate) navigate(`/dashboard/accountant?tab=${defaultTab}`); 
        else if (window.location.pathname === '/dashboard/team' && navigate) {
          setActiveTab('financials');
        }
      }
    }
  };"""

# Replace in UnifiedSidebar.jsx
pattern_tab_config = re.compile(r'  const tabConfig = \{.*?(?=  // Generate visible tabs based on permissions)', re.DOTALL)
sidebar_content = pattern_tab_config.sub(new_tab_config + '\n', sidebar_content)

# We also need to remove openGroups logic or just render flat tabs
sidebar_content = re.sub(
    r'      \{/\* Render Sidebar Tabs \*/\}.*?\{/\* Profile Section \*/\}',
    r'''      {/* Render Sidebar Tabs */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1.5 custom-scrollbar">
        {visibleTabs.map(tab => {
          const Icon = tab.icon;
          const isActive = tab.isActive;
          
          return (
            <button
              key={tab.id}
              onClick={tab.onClick}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-300 group ${
                isActive 
                  ? tab.activeBgClass
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'} ${!isActive && tab.iconColorClass}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`text-sm font-bold tracking-wide transition-colors duration-300 ${isActive ? 'text-white' : 'group-hover:text-slate-900 dark:group-hover:text-slate-200'}`}>
                  {tab.label}
                </span>
              </div>
              
              {tab.badge !== null && tab.badge !== undefined && tab.badge > 0 && (
                <div className={`px-2 py-0.5 rounded-lg text-[10px] font-black ${
                  isActive 
                    ? 'bg-white text-slate-800'
                    : `${tab.badgeColor} text-white`
                } shadow-sm animate-pulse-slow`}>
                  {tab.badge}
                </div>
              )}
            </button>
          );
        })}
      </nav>
      {/* Profile Section */}''',
    sidebar_content,
    flags=re.DOTALL
)

# Ensure Store icon is imported
if 'Store' not in sidebar_content:
    sidebar_content = sidebar_content.replace('import {', 'import { Store, ', 1)

with open(sidebar_path, "w", encoding="utf-8") as f:
    f.write(sidebar_content)


# 2. Update LabDashboard.jsx
with open(lab_path, "r", encoding="utf-8") as f:
    lab_content = f.read()

# Make sure imports are present
for icon in ['BarChart3', 'Clock', 'FlaskConical', 'Archive']:
    if icon not in lab_content:
        lab_content = lab_content.replace('import {', f'import {{ {icon}, ', 1)

horizontal_tabs_lab = """            {/* Horizontal Navigation Tabs for Lab */}
            <div className="mb-6 flex gap-2 overflow-x-auto pb-2 custom-scrollbar no-print px-1">
              {hasPerm('viewLabReports') && (
                <button
                  onClick={() => setActiveTab('stats')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'stats' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                >
                  <BarChart3 className="w-4 h-4" /> التقارير والإحصائيات
                </button>
              )}
              {hasPerm('receiveSamples') && (
                <button
                  onClick={() => setActiveTab('incoming')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'incoming' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                >
                  <Clock className="w-4 h-4" /> استلام العينات
                </button>
              )}
              {hasPerm('enterLabResults') && (
                <button
                  onClick={() => setActiveTab('testing')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'testing' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                >
                  <FlaskConical className="w-4 h-4" /> إدخال النتائج
                </button>
              )}
              {hasPerm('labArchive') && (
                <button
                  onClick={() => setActiveTab('archive')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'archive' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                >
                  <Archive className="w-4 h-4" /> الأرشيف
                </button>
              )}
            </div>
            
            {/* STATS */}"""

lab_content = lab_content.replace("{/* STATS */}", horizontal_tabs_lab)
with open(lab_path, "w", encoding="utf-8") as f:
    f.write(lab_content)


# 3. Update AccountantPanel.jsx
with open(acc_path, "r", encoding="utf-8") as f:
    acc_content = f.read()

for icon in ['LayoutDashboard', 'CreditCard', 'ClipboardList', 'Mail']:
    if icon not in acc_content:
        acc_content = acc_content.replace('import {', f'import {{ {icon}, ', 1)

horizontal_tabs_acc = """        {/* Horizontal Navigation Tabs for Finance */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2 custom-scrollbar no-print px-1">
          {hasPerm('financialReports') && (
            <button
              onClick={() => setActiveTab('financials')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'financials' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
            >
              <LayoutDashboard className="w-4 h-4" /> التقارير
            </button>
          )}
          {hasPerm('payFines') && (
            <button
              onClick={() => setActiveTab('ext_financials')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'ext_financials' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
            >
              <CreditCard className="w-4 h-4" /> الغرامات والإيرادات
            </button>
          )}
          {hasPerm('dailyInventory') && (
            <button
              onClick={() => setActiveTab('reconciliation')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'reconciliation' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
            >
              <ClipboardList className="w-4 h-4" /> جرد اليومية والمطابقة
            </button>
          )}
          {hasPerm('viewComprehensiveFinancialReports') && (
            <button
              onClick={() => setActiveTab('comprehensive_reports')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'comprehensive_reports' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
            >
              <BarChart3 className="w-4 h-4" /> التقارير الشاملة
            </button>
          )}
        </div>

        {/* --- Tab: Dashboard & Reports --- */}"""

acc_content = acc_content.replace("{/* --- Tab: Dashboard & Reports --- */}", horizontal_tabs_acc)
with open(acc_path, "w", encoding="utf-8") as f:
    f.write(acc_content)

print("Update completed successfully.")
