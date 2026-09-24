import React from 'react';
import { Store, ChevronDown, 
  TrendingUp, Users, ShieldAlert, Mail, FlaskConical, Database, Building, LogOut, CheckCircle, BarChart3, Clock, Archive, LayoutDashboard, CreditCard, ClipboardList, FileSearch, Banknote, MessageCircle, Map, CheckSquare
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
  const { user, hasPerm, globalLogout, uiPreferences, setActiveSidebarTabs, navigate, establishments, penaltyRequests, directives } = React.useContext(AppContext);

  const activeTeam = user;
  let userSectorRaw = activeTeam?.sector || (activeTeam?.name?.includes('الأيسر') ? 'مركز المحافظة - الجانب الأيسر' : 'مركز المحافظة - الجانب الأيمن');
  const userSector = (userSectorRaw && !userSectorRaw.includes('قضاء') && !userSectorRaw.includes('الجانب') && !userSectorRaw.includes('قاطع')) 
    ? 'قضاء ' + userSectorRaw 
    : userSectorRaw;

  const matchSector = (teamSector, estSector) => {
    if (!teamSector || !estSector) return false;
    const cleanT = teamSector.replace(/^قضاء\s+/i, '').replace(/^قاطع\s+/i, '').trim();
    const cleanE = estSector.replace(/^قضاء\s+/i, '').replace(/^قاطع\s+/i, '').trim();
    return cleanT.includes(cleanE) || cleanE.includes(cleanT);
  };

  const targetSector = user?.linkedTeamSector || user?.sector || "الكل";
  const myDirectives = (directives || []).filter((d) => {
    if (d.target === "all") return true;
    if (d.target === "teams" && user?.role === "team_leader") return true;
    if (d.target === "accountants" || d.target === "accountant" || d.target === "financial") return true;
    if (d.target === "specific" && d.targetSectors?.includes(targetSector))
      return true;
    return false;
  });
  const unreadDirectivesCount = myDirectives.filter((d) => !d.isRead).length;


  const tabConfig = {
    strategic: {
      label: 'الإدارة المتقدمة',
      icon: TrendingUp,
      iconColorClass: '',
      activeBgClass: 'bg-teal-600 text-white shadow-md shadow-teal-500/20',
      showCondition: hasPerm('showMainDashboard') || hasPerm('showReportsPage') || hasPerm('exportData'),
      isActive: activeTab === 'strategic',
      onClick: () => { if(setExecutiveTab) setExecutiveTab('dashboard'); setActiveTab('strategic'); }
    },
    smart_tasks: {
      label: 'المهام الذكية',
      icon: CheckCircle,
      iconColorClass: 'text-blue-500',
      activeBgClass: 'bg-blue-600 text-white shadow-md shadow-blue-500/10',
      showCondition: hasPerm('manageSmartTasks') || hasPerm('executeSmartTasks'),
      badge: (user?.role === 'team' || user?.role === 'team_leader') && hasPerm('executeSmartTasks') ? 
             (establishments?.filter(e => matchSector(userSector, e.sector) && e.lastInspection === 'لم يزر بعد').length || 0) : null,
      badgeColor: 'bg-blue-500',
      isActive: activeTab === 'smart_tasks',
      onClick: () => { if(setExecutiveTab) setExecutiveTab('dashboard'); setActiveTab('smart_tasks'); }
    },
    operations_room: {
      label: 'غرفة العمليات المركزية',
      icon: ShieldAlert,
      iconColorClass: 'text-fuchsia-500',
      activeBgClass: 'bg-fuchsia-600 text-white shadow-md shadow-fuchsia-500/10',
      showCondition: hasPerm('authenticatePenalties'),
      badge: hasPerm('authenticatePenalties') ? (penaltyRequests?.filter(r => r.status === 'pending').length || 0) : null,
      badgeColor: 'bg-rose-500',
      isActive: activeTab === 'operations_room',
      onClick: () => { if(setExecutiveTab) setExecutiveTab('dashboard'); setActiveTab('operations_room'); }
    },
    complaints: {
      label: 'الشكاوى',
      icon: ShieldAlert,
      iconColorClass: 'text-red-500',
      activeBgClass: 'bg-red-600 text-white shadow-md shadow-red-500/10',
      showCondition: hasPerm('showPublicEvalsPage') || hasPerm('showDeliveryPage'),
      isActive: activeTab === 'complaints',
      onClick: () => { if(setExecutiveTab) setExecutiveTab('dashboard'); setActiveTab('complaints'); }
    },
    directives: {
      label: 'التبليغات',
      icon: Mail,
      iconColorClass: 'text-amber-500',
      activeBgClass: 'bg-amber-600 text-white shadow-md shadow-amber-500/10',
      showCondition: hasPerm('showDirectivesPage') || hasPerm('sendDirective') || hasPerm('replyDirective') || hasPerm('quickTeamDispatch'),
      badge: unreadDirectivesCount > 0 ? unreadDirectivesCount : null,
      badgeColor: 'bg-amber-500',
      isActive: activeTab === 'directives',
      onClick: () => { if(setExecutiveTab) setExecutiveTab('dashboard'); setActiveTab('directives'); }
    },
    establishments: {
      label: 'إدارة المنشآت',
      icon: Building,
      iconColorClass: 'text-blue-500',
      activeBgClass: 'bg-blue-600 text-white shadow-md shadow-blue-500/10',
      showCondition: hasPerm('manageEstablishments'),
      isActive: activeTab === 'establishments' || activeTab === 'directory' || executiveTab === 'establishments',
      onClick: () => { 
        if(setExecutiveTab) setExecutiveTab('establishments'); 
        setActiveTab('establishments'); 
        if(setSelectedTeamId) setSelectedTeamId(''); 
      }
    },
    lab_dashboard: {
      label: 'قسم المختبر',
      icon: FlaskConical,
      iconColorClass: 'text-indigo-500',
      activeBgClass: 'bg-indigo-600 text-white shadow-md shadow-indigo-500/10',
      showCondition: user?.role !== 'lab' && (hasPerm('viewLabReports') || hasPerm('receiveSamples') || hasPerm('enterLabResults') || hasPerm('labArchive')),
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
          setActiveTab('lab_management');
        }
      }
    },
    lab_stats: {
      label: 'التقارير والإحصائيات (المختبر)',
      icon: BarChart3,
      iconColorClass: 'text-indigo-500',
      activeBgClass: 'bg-indigo-600 text-white shadow-md shadow-indigo-500/10',
      showCondition: user?.role === 'lab' && hasPerm('viewLabReports'),
      isActive: activeTab === 'stats',
      onClick: () => { 
        if(setExecutiveTab) setExecutiveTab('dashboard'); 
        setActiveTab('stats');
        if (window.location.pathname !== '/dashboard/lab' && navigate) navigate('/dashboard/lab?tab=stats');
      }
    },
    lab_incoming: {
      label: 'النماذج الواردة',
      icon: FileSearch,
      iconColorClass: 'text-blue-500',
      activeBgClass: 'bg-blue-600 text-white shadow-md shadow-blue-500/10',
      showCondition: user?.role === 'lab' && hasPerm('receiveSamples'),
      isActive: activeTab === 'incoming',
      onClick: () => { 
        if(setExecutiveTab) setExecutiveTab('dashboard'); 
        setActiveTab('incoming');
        if (window.location.pathname !== '/dashboard/lab' && navigate) navigate('/dashboard/lab?tab=incoming');
      }
    },
    lab_testing: {
      label: 'قيد الفحص',
      icon: Clock,
      iconColorClass: 'text-amber-500',
      activeBgClass: 'bg-amber-600 text-white shadow-md shadow-amber-500/10',
      showCondition: user?.role === 'lab' && hasPerm('enterLabResults'),
      isActive: activeTab === 'testing',
      onClick: () => { 
        if(setExecutiveTab) setExecutiveTab('dashboard'); 
        setActiveTab('testing');
        if (window.location.pathname !== '/dashboard/lab' && navigate) navigate('/dashboard/lab?tab=testing');
      }
    },
    lab_archive: {
      label: 'الأرشيف',
      icon: Archive,
      iconColorClass: 'text-emerald-500',
      activeBgClass: 'bg-emerald-600 text-white shadow-md shadow-emerald-500/10',
      showCondition: user?.role === 'lab' && hasPerm('labArchive'),
      isActive: activeTab === 'archive',
      onClick: () => { 
        if(setExecutiveTab) setExecutiveTab('dashboard'); 
        setActiveTab('archive');
        if (window.location.pathname !== '/dashboard/lab' && navigate) navigate('/dashboard/lab?tab=archive');
      }
    },
    finance_dashboard: {
      label: 'القسم المالي',
      icon: Banknote,
      iconColorClass: 'text-emerald-500',
      activeBgClass: 'bg-emerald-600 text-white shadow-md shadow-emerald-500/10',
      showCondition: user?.role !== 'accountant' && (hasPerm('financialReports') || hasPerm('payFines') || hasPerm('dailyInventory') || hasPerm('viewComprehensiveFinancialReports')),
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
    },
    finance_stats: {
      label: 'التقارير والإحصائيات (المالية)',
      icon: BarChart3,
      iconColorClass: 'text-emerald-500',
      activeBgClass: 'bg-emerald-600 text-white shadow-md shadow-emerald-500/10',
      showCondition: user?.role === 'accountant' && hasPerm('financialReports'),
      isActive: activeTab === 'financials',
      onClick: () => { 
        if(setExecutiveTab) setExecutiveTab('dashboard'); 
        setActiveTab('financials');
        if (window.location.pathname !== '/dashboard/accountant' && navigate) navigate('/dashboard/accountant?tab=financials');
      }
    },
    finance_fines: {
      label: 'المبالغ المستوفاة',
      icon: Banknote,
      iconColorClass: 'text-teal-500',
      activeBgClass: 'bg-teal-600 text-white shadow-md shadow-teal-500/10',
      showCondition: user?.role === 'accountant' && hasPerm('payFines'),
      isActive: activeTab === 'ext_financials',
      onClick: () => { 
        if(setExecutiveTab) setExecutiveTab('dashboard'); 
        setActiveTab('ext_financials');
        if (window.location.pathname !== '/dashboard/accountant' && navigate) navigate('/dashboard/accountant?tab=ext_financials');
      }
    },
    finance_reconciliation: {
      label: 'المطابقة والجرد',
      icon: ClipboardList,
      iconColorClass: 'text-blue-500',
      activeBgClass: 'bg-blue-600 text-white shadow-md shadow-blue-500/10',
      showCondition: user?.role === 'accountant' && hasPerm('dailyInventory'),
      isActive: activeTab === 'reconciliation',
      onClick: () => { 
        if(setExecutiveTab) setExecutiveTab('dashboard'); 
        setActiveTab('reconciliation');
        if (window.location.pathname !== '/dashboard/accountant' && navigate) navigate('/dashboard/accountant?tab=reconciliation');
      }
    },
    finance_comprehensive: {
      label: 'تقارير شاملة',
      icon: FileSearch,
      iconColorClass: 'text-purple-500',
      activeBgClass: 'bg-purple-600 text-white shadow-md shadow-purple-500/10',
      showCondition: user?.role === 'accountant' && hasPerm('viewComprehensiveFinancialReports'),
      isActive: activeTab === 'comprehensive_reports',
      onClick: () => { 
        if(setExecutiveTab) setExecutiveTab('dashboard'); 
        setActiveTab('comprehensive_reports');
        if (window.location.pathname !== '/dashboard/accountant' && navigate) navigate('/dashboard/accountant?tab=comprehensive_reports');
      }
    }
  };

  const savedTabOrder = uiPreferences?.tabOrder || Object.keys(tabConfig);
  const tabOrder = [...new Set([...savedTabOrder, ...Object.keys(tabConfig)])];

  React.useEffect(() => {
    if (setActiveSidebarTabs) {
      const tabsToRender = customTabs ? customTabs : tabOrder.map(k => ({ id: k, ...tabConfig[k] }));
      const visibleTabs = tabsToRender
        .filter(tab => customTabs ? tab.showCondition !== false : (tab && tab.showCondition))
        .map(tab => ({ id: tab.id, label: tab.label }));
        
      setActiveSidebarTabs(prev => {
        if (JSON.stringify(prev) !== JSON.stringify(visibleTabs)) {
          return visibleTabs;
        }
        return prev;
      });
    }
  });

  const renderTabs = () => {
    const tabsToRender = customTabs ? customTabs : tabOrder.map(k => ({ id: k, ...tabConfig[k] }));
    const visibleTabs = tabsToRender.filter(tab => customTabs ? tab.showCondition !== false : (tab && tab.showCondition));

    return visibleTabs.map(tab => {
      const isCurrentlyActive = (executiveTab && activeTab) 
        ? (tab.isActive ? tab.isActive : (executiveTab === 'dashboard' && activeTab === tab.id) || (executiveTab === tab.id && activeTab === tab.id)) 
        : (typeof tab.isActive !== 'undefined' ? tab.isActive : activeTab === tab.id);

      const activeClass = tab.activeBgClass || 'bg-indigo-600 text-white shadow-md shadow-indigo-500/10';
      const IconComponent = tab.icon || null;

      return (
        <button
          key={tab.id}
          onClick={() => { if(tab.onClick) tab.onClick(); setIsSidebarOpen(false); }}
          className={`w-full text-right px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center gap-3 ${
            isCurrentlyActive
              ? activeClass
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40'
          }`}
        >
          {IconComponent && <IconComponent className={`w-5 h-5 ${isCurrentlyActive ? '' : (tab.iconColorClass || 'text-slate-500')}`} />}
          <span>{tab.label}</span>
          {tab.badge > 0 && (
            <span className={`text-[10px] px-2 py-0.5 rounded-full mr-auto ${isCurrentlyActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>{tab.badge}</span>
          )}
        </button>
      );
    });
  };

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
