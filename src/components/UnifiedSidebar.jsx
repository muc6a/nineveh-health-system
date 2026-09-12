import React from 'react';
import { 
  TrendingUp, Users, ShieldAlert, Mail, FlaskConical, Database, Building, LogOut, CheckCircle
} from 'lucide-react';
import AnimatedLogo from './AnimatedLogo';
import ThemeToggle from './ThemeToggle';
import { AppContext } from '../context/AppContext';

const UnifiedSidebar = ({ 
  activeTab, setActiveTab, 
  executiveTab, setExecutiveTab, 
  isSidebarOpen, setIsSidebarOpen,
  allowedTeams = [], selectedTeamId, setSelectedTeamId,
  incomingReqs = [], testingReqs = [] 
}) => {
  const { user, hasPerm, globalLogout, uiPreferences, setActiveSidebarTabs } = React.useContext(AppContext);

  // Definition of all possible tabs
  const tabConfig = {
    strategic: {
      label: 'الإدارة المتقدمة',
      icon: TrendingUp,
      iconColorClass: '',
      activeBgClass: 'bg-teal-600 text-white shadow-md shadow-teal-500/20',
      showCondition: hasPerm('showMainDashboard') || hasPerm('showReportsPage') || hasPerm('exportData'),
      onClick: () => { if(setExecutiveTab) setExecutiveTab('dashboard'); setActiveTab('strategic'); }
    },
    operations_room: {
      label: 'غرفة العمليات المركزية',
      icon: ShieldAlert,
      iconColorClass: 'text-fuchsia-500',
      activeBgClass: 'bg-fuchsia-600 text-white shadow-md shadow-fuchsia-500/10',
      showCondition: hasPerm('showOperationsRoom'),
      onClick: () => { if(setExecutiveTab) setExecutiveTab('dashboard'); setActiveTab('operations_room'); }
    },
    directives: {
      label: 'التبليغات',
      icon: Mail,
      iconColorClass: 'text-amber-500',
      activeBgClass: 'bg-amber-600 text-white shadow-md shadow-amber-500/10',
      showCondition: hasPerm('showDirectivesPage') || hasPerm('sendDirective') || hasPerm('replyDirective') || hasPerm('quickTeamDispatch'),
      onClick: () => { if(setExecutiveTab) setExecutiveTab('dashboard'); setActiveTab('directives'); }
    },
    complaints: {
      label: 'الشكاوى',
      icon: ShieldAlert,
      iconColorClass: 'text-red-500',
      activeBgClass: 'bg-red-600 text-white shadow-md shadow-red-500/10',
      showCondition: hasPerm('showPublicEvalsPage') || hasPerm('showDeliveryPage'),
      onClick: () => { if(setExecutiveTab) setExecutiveTab('dashboard'); setActiveTab('complaints'); }
    },
        team_reports: {
      label: 'إحصائيات الميدان',
      icon: Users,
      iconColorClass: 'text-orange-500',
      activeBgClass: 'bg-orange-600 text-white shadow-md shadow-orange-500/10',
      showCondition: hasPerm('showFieldTeamsStats'),
      onClick: () => { if(setExecutiveTab) setExecutiveTab('dashboard'); setActiveTab('team_reports'); }
    },
    map: {
      label: 'الخريطة الرقابية',
      icon: Database,
      iconColorClass: 'text-emerald-500',
      activeBgClass: 'bg-emerald-600 text-white shadow-md shadow-emerald-500/10',
      showCondition: hasPerm('showSectorMap'),
      onClick: () => { if(setExecutiveTab) setExecutiveTab('dashboard'); setActiveTab('map'); }
    },
    smart_tasks: {
      label: 'المهام الذكية',
      icon: CheckCircle,
      iconColorClass: 'text-blue-500',
      activeBgClass: 'bg-blue-600 text-white shadow-md shadow-blue-500/10',
      showCondition: hasPerm('showSmartTasks'),
      onClick: () => { if(setExecutiveTab) setExecutiveTab('dashboard'); setActiveTab('smart_tasks'); }
    },
    lab_management: {
      label: 'المختبر',
      icon: FlaskConical,
      iconColorClass: 'text-indigo-500',
      activeBgClass: 'bg-indigo-600 text-white shadow-md shadow-indigo-500/10',
      showCondition: hasPerm('receiveSamples') || hasPerm('enterLabResults') || hasPerm('labArchive'),
      onClick: () => { if(setExecutiveTab) setExecutiveTab('dashboard'); setActiveTab('lab_management'); }
    },
    financials: {
      label: 'المالية',
      icon: Database,
      iconColorClass: 'text-emerald-500',
      activeBgClass: 'bg-emerald-600 text-white shadow-md shadow-emerald-500/10',
      showCondition: hasPerm('financialReports') || hasPerm('payFines') || hasPerm('dailyInventory'),
      onClick: () => { if(setExecutiveTab) setExecutiveTab('dashboard'); setActiveTab('financials'); }
    },
    establishments: {
      label: 'إدارة المنشآت',
      icon: Building,
      iconColorClass: 'text-blue-500',
      activeBgClass: 'bg-blue-600 text-white shadow-md shadow-blue-500/10',
      showCondition: hasPerm('manageEstablishments'),
      onClick: () => { if(setExecutiveTab) setExecutiveTab('establishments'); else setActiveTab('establishments'); if(setSelectedTeamId) setSelectedTeamId(''); }
    }
  };

  const savedTabOrder = uiPreferences?.tabOrder || Object.keys(tabConfig);
  const tabOrder = [...new Set([...savedTabOrder, ...Object.keys(tabConfig)])];

  React.useEffect(() => {
    if (setActiveSidebarTabs) {
      const visibleTabs = tabOrder
        .filter(key => tabConfig[key] && tabConfig[key].showCondition)
        .map(key => ({ id: key, label: tabConfig[key].label }));
      setActiveSidebarTabs(visibleTabs);
    }
  }, [user?.permissions, uiPreferences?.tabOrder]);


  return (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`w-80 shrink-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl md:bg-white/60 md:dark:bg-slate-900/60 border-l border-slate-200/50 dark:border-slate-800/50 p-4 flex flex-col justify-between fixed md:sticky top-0 h-screen z-50 transition-transform duration-300 ${
        isSidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
      } right-0`}>
        <div className="overflow-y-auto flex-1 pb-6 pr-2 -mr-2 flex flex-col">
          <AnimatedLogo variant="sidebar" className="mb-6" />

                    {/* User Profile */}
          <div className="mb-6 bg-slate-50/80 dark:bg-slate-800/80 p-3 rounded-2xl border border-slate-100 dark:border-slate-700/50 flex flex-col gap-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-black text-slate-800 dark:text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  {user?.name}
                </span>
                <span className="text-[10px] text-teal-600 dark:text-teal-400 font-extrabold mt-1">
                  {user?.title || user?.role} {user?.sector ? ` - قطاع ${user.sector}` : ''}
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1 mb-4 pr-1 pl-2">
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block px-3 mb-2">
              الرئيسية
            </span>

            {tabOrder.map(tabKey => {
              const config = tabConfig[tabKey];
              if (!config || !config.showCondition) return null;

              let isCurrentlyActive = (executiveTab && activeTab) 
                ? (config.isActive ? config.isActive : (executiveTab === 'dashboard' && activeTab === tabKey) || (executiveTab === tabKey && activeTab === tabKey)) 
                : activeTab === tabKey;
              
              if (tabKey === 'establishments' && executiveTab) {
                if (executiveTab === 'establishments') isCurrentlyActive = true;
              }

              return (
                <button
                  key={tabKey}
                  onClick={() => { config.onClick(); setIsSidebarOpen(false); }}
                  className={`w-full text-right px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center gap-3 ${
                    isCurrentlyActive
                      ? config.activeBgClass
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <config.icon className={`w-4.5 h-4.5 ${isCurrentlyActive ? '' : config.iconColorClass}`} />
                  <span>{config.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        
        {/* Bottom Controls */}
          <div className="mt-auto pt-4 border-t border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between gap-2">
            <button 
              onClick={globalLogout}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors border border-rose-100 dark:border-rose-900/30"
            >
              تسجيل الخروج
            </button>
            <div className="p-1 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50">
              <ThemeToggle />
            </div>
          </div>
      </aside>
    </>
  );
};

export default UnifiedSidebar;
