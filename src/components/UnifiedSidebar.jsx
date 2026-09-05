import React from 'react';
import { 
  TrendingUp, Users, ShieldAlert, Mail, FlaskConical, Database, Building, LogOut, CheckCircle
} from 'lucide-react';
import AnimatedLogo from './AnimatedLogo';
import ThemeToggle from './ThemeToggle';
import { useAppContext } from '../context/AppContext';

const UnifiedSidebar = ({ 
  activeTab, setActiveTab, 
  executiveTab, setExecutiveTab, 
  isSidebarOpen, setIsSidebarOpen,
  allowedTeams = [], selectedTeamId, setSelectedTeamId,
  incomingReqs = [], testingReqs = [] 
}) => {
  const { user, hasPerm, globalLogout, uiPreferences } = useAppContext();

  // Definition of all possible tabs
  const tabConfig = {
    strategic: {
      label: 'الإدارة المتقدمة',
      icon: TrendingUp,
      iconColorClass: '',
      activeBgClass: 'bg-teal-600 text-white shadow-md shadow-teal-500/20',
      showCondition: hasPerm('showMainDashboard'),
      onClick: () => { if(setExecutiveTab) setExecutiveTab('dashboard'); setActiveTab('strategic'); }
    },
    team_reports: {
      label: 'تقارير الفرق الميدانية',
      icon: Users,
      iconColorClass: '',
      activeBgClass: 'bg-indigo-600 text-white shadow-md shadow-indigo-500/10',
      showCondition: hasPerm('showFieldTeamsStats') || user?.role === 'team',
      onClick: () => { 
        if(setExecutiveTab) setExecutiveTab('dashboard'); 
        setActiveTab('team_reports'); 
        if (setSelectedTeamId && (!selectedTeamId || selectedTeamId === 'all')) {
          setSelectedTeamId(allowedTeams[0]?.id || user?.id);
        }
      }
    },
    operations_room: {
      label: 'غرفة العمليات المركزية',
      icon: ShieldAlert,
      iconColorClass: 'text-fuchsia-500',
      activeBgClass: 'bg-fuchsia-600 text-white shadow-md shadow-fuchsia-500/10',
      showCondition: hasPerm('showOperationsRoom') || hasPerm('showPublicEvalsPage'),
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
    lab_management: {
      label: 'المختبر',
      icon: FlaskConical,
      iconColorClass: 'text-indigo-500',
      activeBgClass: 'bg-indigo-600 text-white shadow-md shadow-indigo-500/10',
      showCondition: hasPerm('receiveSamples') || hasPerm('enterLabResults') || hasPerm('labArchive') || hasPerm('authenticatePenalties'),
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
          <div className="mb-6 bg-slate-50/80 dark:bg-slate-800/80 p-3 rounded-2xl border border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm font-black text-slate-800 dark:text-white flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                {user?.name}
              </span>
              <span className="text-[9px] text-teal-650 dark:text-teal-400 font-extrabold uppercase mt-0.5">
                {user?.title || user?.role} {user?.sector ? ` - قطاع ${user.sector}` : ''}
              </span>
              <span className="text-[8px] text-slate-400 font-normal dir-ltr">{user?.email}</span>
            </div>
            <ThemeToggle />
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1 mb-4 pr-1 pl-2">
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block px-3 mb-2">
              الرئيسية
            </span>

            {tabOrder.map(tabKey => {
              const config = tabConfig[tabKey];
              if (!config || !config.showCondition) return null;

              const isCurrentlyActive = (executiveTab && activeTab) 
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

        <div className="pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
          <button 
            onClick={globalLogout}
            className="w-full text-right px-4 py-3 rounded-2xl text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors flex items-center gap-3"
          >
            <LogOut className="w-4.5 h-4.5" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default UnifiedSidebar;
