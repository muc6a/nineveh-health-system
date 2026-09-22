import React from 'react';
import { 
  TrendingUp, Users, ShieldAlert, Mail, FlaskConical, Database, Building, LogOut, CheckCircle, BarChart3, Clock, Archive, LayoutDashboard, CreditCard, ClipboardList, FileSearch
} from 'lucide-react';
import AnimatedLogo from './AnimatedLogo';
import ThemeToggle from './ThemeToggle';
import { AppContext } from '../context/AppContext';

const getRoleNameInArabic = (role) => {
  const roles = {
    'admin': 'مدير النظام',
    'executive': 'مدير قسم الرقابة',
    'team_leader': 'مدير فريق ميداني',
    'accountant': 'محاسب الوحدة',
    'lab': 'مدير المختبر',
  };
  return roles[role] || role;
};

const UnifiedSidebar = ({ 
  activeTab, setActiveTab, 
  executiveTab, setExecutiveTab, 
  isSidebarOpen, setIsSidebarOpen,
  allowedTeams = [], selectedTeamId, setSelectedTeamId,
  incomingReqs = [], testingReqs = [],
  customTabs = null
}) => {
  const { user, hasPerm, globalLogout, uiPreferences, setActiveSidebarTabs, navigate } = React.useContext(AppContext);

  // Definition of all possible tabs
  const tabConfig = {
    strategic: {
      label: 'الإدارة المتقدمة',
      icon: TrendingUp,
      iconColorClass: '',
      activeBgClass: 'bg-teal-600 text-white shadow-md shadow-teal-500/20',
      showCondition: hasPerm('showMainDashboard') || hasPerm('showReportsPage'),
      onClick: () => { if(setExecutiveTab) setExecutiveTab('dashboard'); setActiveTab('strategic'); }
    },
    
    smart_tasks: { 
      label: 'المهام الذكية', 
      icon: CheckCircle, 
      iconColorClass: 'text-blue-500',
      activeBgClass: 'bg-blue-600 text-white shadow-md shadow-blue-500/10',
      showCondition: hasPerm('manageSmartTasks') || hasPerm('executeSmartTasks'),
      onClick: () => { if(setExecutiveTab) setExecutiveTab('dashboard'); setActiveTab('smart_tasks'); }
    },
    operations_room: {
      label: 'غرفة العمليات المركزية',
      icon: ShieldAlert,
      iconColorClass: 'text-fuchsia-500',
      activeBgClass: 'bg-fuchsia-600 text-white shadow-md shadow-fuchsia-500/10',
      showCondition: hasPerm('authenticatePenalties'),
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


  const [openGroups, setOpenGroups] = React.useState({ lab: false, finance: false });

  const renderTabs = () => {
    const tabsToRender = customTabs ? customTabs : tabOrder.map(k => ({ id: k, ...tabConfig[k] }));
    const visibleTabs = tabsToRender.filter(tab => customTabs ? tab.showCondition !== false : (tab && tab.showCondition));

    const labKeys = ['stats', 'incoming', 'testing', 'archive'];
    const financeKeys = ['financials', 'ext_financials', 'reconciliation', 'comprehensive_reports'];

    const labTabs = visibleTabs.filter(t => labKeys.includes(t.id));
    const financeTabs = visibleTabs.filter(t => financeKeys.includes(t.id));

    const elements = [];
    let labRendered = false;
    let financeRendered = false;

    const renderTabButton = (tab, isNested = false) => {
      const isCurrentlyActive = (executiveTab && activeTab) 
        ? (tab.isActive ? tab.isActive : (executiveTab === 'dashboard' && activeTab === tab.id) || (executiveTab === tab.id && activeTab === tab.id)) 
        : activeTab === tab.id;

      const activeClass = tab.activeBgClass || 'bg-indigo-600 text-white shadow-md shadow-indigo-500/10';

      return (
        <button
          key={tab.id}
          onClick={() => { if(tab.onClick) tab.onClick(); setIsSidebarOpen(false); }}
          className={`w-full text-right px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center gap-3 ${
            isCurrentlyActive
              ? activeClass
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40'
          } ${isNested ? 'pr-8 py-2.5 opacity-90' : ''}`}
        >
          <span>{tab.label}</span>
          {tab.badge > 0 && (
            <span className={`text-[10px] px-2 py-0.5 rounded-full mr-auto ${isCurrentlyActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>{tab.badge}</span>
          )}
        </button>
      );
    };

    visibleTabs.forEach(tab => {
      elements.push(renderTabButton(tab));
    });

    return elements;
  };

  React.useEffect(() => {
    const tabsToRender = customTabs ? customTabs : tabOrder.map(k => ({ id: k, ...tabConfig[k] }));
    const visibleTabs = tabsToRender.filter(tab => customTabs ? tab.showCondition !== false : (tab && tab.showCondition));
    
    const labKeys = ['stats', 'incoming', 'testing', 'archive'];
    const financeKeys = ['financials', 'ext_financials', 'reconciliation', 'comprehensive_reports'];
  }, [activeTab, customTabs, tabOrder, user?.permissions]);

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
                  {user?.title || getRoleNameInArabic(user?.role)} {user?.sector ? ` - قطاع ${user.sector}` : ''}
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1 mb-4 pr-1 pl-2">
            {renderTabs()}
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
