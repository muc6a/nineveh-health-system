import { ROLE_CORE_BASICS, PERMISSIONS_TABS } from '../utils/constants';
import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { AnimatedLogo } from '../components/AnimatedLogo';
import { ThemeToggle } from '../components/ThemeToggle';
import { WeatherWidget } from '../components/WeatherWidget';
import { usePersistentTab } from '../hooks/usePersistentTab';
import { ThreeDPieChart } from '../components/ThreeDPieChart';
import { ThreeDBarChart } from '../components/ThreeDBarChart';
import { NinevehMap } from '../components/NinevehMap';
import OperationsRoom from '../components/OperationsRoom';
import { NotificationBell } from '../components/NotificationBell';
import { CriticalAlertModal } from '../components/CriticalAlertModal';
import { PrintableDailyReport } from '../components/PrintableDailyReport';
import { EstablishmentsManager } from '../components/EstablishmentsManager';
import { FinancialReports } from '../components/FinancialReports';
import { LabManager } from '../components/LabManager';
import { LogOut, MapPin, AlertTriangle, X, CheckCircle, TrendingUp, Users, ShieldAlert, FileText, Send, Building, LayoutDashboard, Camera, Mail, Package, CheckSquare, Settings, Database, BarChart3, Map, Archive, Megaphone, ClipboardList, MessageSquareWarning, Target, FlaskConical, AlertOctagon } from 'lucide-react';

export const ExecutivePortal = ({ embeddedTab }) => {
  const { navigate, establishments, teams, user, setUser, directives, addDirective, markDirectiveRead, notify, reports, setReports, config, penaltyRequests, setShowDisplayPrefsModal, directors, tasks, setTasks, systemNotifications, setSystemNotifications, uiPreferences, labRequests, setLabRequests, setDispatches , globalLogout } = useContext(AppContext);
  // Core UI state
  const [selectedTeamId, setSelectedTeamId] = useState('all');
  const [executiveTab, setExecutiveTab] = usePersistentTab('executiveTab', 'dashboard');
  const [showUninspectedModal, setShowUninspectedModal] = useState(false);
  const [showCategoryBreakdownModal, setShowCategoryBreakdownModal] = useState(false);
  const [showComplaintsModal, setShowComplaintsModal] = useState(false);
  const [chartModalState, setChartModalState] = useState({ isOpen: false, title: '', data: [] });
  const [replyingTo, setReplyingTo] = useState(null); // ID of the directive being replied to
  const [replyText, setReplyText] = useState('');
  const [dispatchEstId, setDispatchEstId] = useState('');
  const [dispatchTeamId, setDispatchTeamId] = useState('');
  // User permissions logic (Default Deny)
  const hasPerm = (permName) => {
    if (user?.role === 'admin') return true;
    if (ROLE_CORE_BASICS[user?.role]?.includes(permName)) return true;
    return user?.permissions?.[permName] === true;
  };

    const { currentRoute } = useContext(AppContext);
  const initialUrlTab = currentRoute.includes('?tab=') ? currentRoute.split('?tab=')[1].split('&')[0] : null;

  useEffect(() => {
    if (initialUrlTab && tabConfig[initialUrlTab]) {
      const config = tabConfig[initialUrlTab];
      if (!config.permission || hasPerm(config.permission)) {
        if (initialUrlTab === 'establishments') {
          setExecutiveTab('establishments');
        } else {
          setExecutiveTab('dashboard');
          setActiveTab(initialUrlTab);
        }
      }
    }
  }, [initialUrlTab, user?.permissions]);

  const getInitialExecutiveTab = () => {
    if (hasPerm('showMainDashboard')) return 'strategic';
    if (hasPerm('showFieldTeamsStats')) return 'team_reports';
    if (hasPerm('receiveSamples') || hasPerm('enterLabResults') || hasPerm('labArchive')) return 'operations_room';
    if (hasPerm('manageEstablishments')) return 'establishments';
    
    if (hasPerm('showDirectivesPage') || hasPerm('showPublicEvalsPage')) return 'unified_inbox';
    return null;
  };

  const [persistentTab, setPersistentTab] = usePersistentTab('execActiveTab', getInitialExecutiveTab() || 'strategic');
  const activeTab = embeddedTab || persistentTab;
  const setActiveTab = embeddedTab ? () => {} : setPersistentTab;

  React.useEffect(() => {
    let needsRedirect = false;
    if (activeTab === 'strategic' && !hasPerm('showMainDashboard')) needsRedirect = true;
    if (activeTab === 'team_reports' && !hasPerm('showFieldTeamsStats')) needsRedirect = true;
    if (activeTab === 'operations_room' && !hasPerm('receiveSamples') || hasPerm('enterLabResults') || hasPerm('labArchive')) needsRedirect = true;
    
    if (activeTab === 'directives' && !(hasPerm('showDirectivesPage') || hasPerm('sendDirective') || hasPerm('replyDirective') || hasPerm('quickTeamDispatch'))) needsRedirect = true;
    if (activeTab === 'complaints' && !hasPerm('showPublicEvalsPage')) needsRedirect = true;

    if (needsRedirect) {
      const newTab = getInitialExecutiveTab();
      setActiveTab(newTab || 'none');
    }

    if (executiveTab === 'establishments' && !hasPerm('manageEstablishments')) {
      setExecutiveTab('dashboard');
    }
  }, [user?.permissions, activeTab, executiveTab]);

  // Auto clear directive notifications when in directives tab
  useEffect(() => {
    if (activeTab === 'directives' && systemNotifications?.length > 0) {
      const hasUnread = systemNotifications.some(n => {
        const isMine = n.targetRole === 'all' || n.targetRole === user?.role || n.targetRole === user?.id;
        if (!isMine || n.isRead) return false;
        const t = n.title || '';
        return t.includes('قرار') || t.includes('تبليغ') || t.includes('توجيه') || t.includes('SOS') || t.includes('استغاثة');
      });

      if (hasUnread) {
        setSystemNotifications(prev => prev.map(n => {
          const isMine = n.targetRole === 'all' || n.targetRole === user?.role || n.targetRole === user?.id;
          const t = n.title || '';
          const isDirective = t.includes('قرار') || t.includes('تبليغ') || t.includes('توجيه') || t.includes('SOS') || t.includes('استغاثة');
          if (isMine && isDirective && !n.isRead) {
            return { ...n, isRead: true };
          }
          return n;
        }));
      }
    }
  }, [activeTab, systemNotifications, user, setSystemNotifications]);

  // Listen for navigation events from NotificationBell
  React.useEffect(() => {
    const handleNav = () => {
      setActiveTab('operations_room');
    };
    const handleNavDirectives = () => {
      setExecutiveTab('dashboard');
      setActiveTab('directives');
    };
    window.addEventListener('navToPenalties', handleNav);
    window.addEventListener('navToDirectives', handleNavDirectives);
    return () => {
      window.removeEventListener('navToPenalties', handleNav);
      window.removeEventListener('navToDirectives', handleNavDirectives);
    };
  }, []);

  // Send directives form states
  const [targetRecipient, setTargetRecipient] = useState('all');
  const [directiveText, setDirectiveText] = useState('');
  const [directiveSuccessMsg, setDirectiveSuccessMsg] = useState('');

  const handleRedirectComplaint = (complaint) => {
    const targetTeam = teams.find(t => t.sector?.includes(complaint.sector) || complaint.sector?.includes(t.sector)) || teams[0];
    if (targetTeam) {
      const newTask = {
        id: 'task_comp_' + Date.now(),
        title: `معالجة شكوى - ${complaint.establishmentName}`,
        description: `ورد تبليغ من بوابة المواطن: "${complaint.details}". يرجى التوجه للمكان ومعالجة الأمر.`,
        targetEstId: complaint.establishmentId || 'unknown',
        assignedTo: 'all_team',
        teamId: targetTeam.id,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      setTasks(prev => [newTask, ...prev]);
      setReports(prev => prev.map(r => r.id === complaint.id ? { ...r, forwarded: true, forwardedAt: new Date().toISOString() } : r));
      notify(`تم إعادة توجيه الشكوى إلى فريق ${targetTeam.name} بنجاح وإضافتها لمهامهم`, 'success');
    } else {
      notify('لم يتم العثور على فريق مطابق لهذا القطاع', 'error');
    }
  };

  const handleDispatch = (tId, eId) => {
    if (!eId || !tId) {
      notify('الرجاء تحديد المنشأة واللجنة المطلوبة', 'error');
      return;
    }
    const est = establishments.find(e => e.id === eId);
    const team = teams.find(t => t.id === tId);
    
    setDispatches(prev => [...prev, {
      id: 'disp_' + Date.now(),
      estId: est.id,
      estName: est.name,
      teamId: team.id,
      date: new Date().toISOString(),
      status: 'pending'
    }]);

    notify(`تم إرسال أمر توجيه عاجل إلى ${team.name} لزيارة ${est.name} فوراً!`, 'success', true);
  };

  const handleSendDirective = (e) => {
    e.preventDefault();
    if (!directiveText) return;
    
    // Format sender name properly
    const senderName = user?.role === 'director' 
      ? `المدير العام لصحّة نينوى (${user?.name || 'د. عماد'})` 
      : `إدارة الصحة العامة (${user?.name || 'المدير العام'})`;

    // Send directive to target recipient
    addDirective(targetRecipient, directiveText, senderName, user?.id || user?.role);
    notify('تم إرسال الأمر الإداري إلى اللجان المعنية بنجاح', 'success');
    setDirectiveSuccessMsg('✔️ تم إرسال الأمر الإداري والتبليغ فوراً إلى الجهة المعنية.');
    setDirectiveText('');
    setTimeout(() => {
      setDirectiveSuccessMsg('');
    }, 3000);
  };

  // Auto-linking: filter teams based on logged-in director's assigned sector
  const isDirectorGeneral = ['director', 'admin', 'public_health', 'central_director', 'committee_director'].includes(user?.role);
  const allowedTeams = isDirectorGeneral 
    ? (teams || []) 
    : (teams || []).filter(t => t.sector?.includes(user?.sector) || user?.sector?.includes(t.sector));

  // Compute active team filter
  const selectedTeam = allowedTeams.find(t => t.id === selectedTeamId);
  
  // If the director is restricted to a sector and hasn't selected a team, their default targetSector is their own sector
  const defaultTargetSector = isDirectorGeneral ? null : user?.sector;
  const targetSector = selectedTeam ? selectedTeam.sector : defaultTargetSector;

  // Match sector helper
  const matchSector = (tSec, eSec) => {
    if (!tSec || !eSec) return false;
    const cleanT = tSec.replace(/^قضاء\s+/i, '').replace(/^قاطع\s+/i, '').trim();
    const cleanE = eSec.replace(/^قضاء\s+/i, '').replace(/^قاطع\s+/i, '').trim();
    return cleanT.includes(cleanE) || cleanE.includes(cleanT);
  };

  // Filter establishments based on selected team sector
  const filteredEsts = targetSector && targetSector !== 'الكل'
    ? (establishments || []).filter(e => matchSector(targetSector, e.sector))
    : (establishments || []);

  // Compute Chart 1 data (Inspected vs Uninspected)
  const inspectedCount = filteredEsts.filter(e => e.lastInspection !== 'لم يزر بعد').length;
  const uninspectedCount = filteredEsts.filter(e => e.lastInspection === 'لم يزر بعد').length;
  
  const chart1Data = [
    { label: 'تم تقييمها وإصدار QR', value: inspectedCount, color: '#0D9488', key: 'green' },
    { label: 'غير مزارة هذا الشهر', value: uninspectedCount, color: '#DC2626', key: 'red' }
  ];

  // Compute Chart 2 data (Density Map - establishments count per sub-neighborhood/sector)
  const sectorCounts = filteredEsts.reduce((acc, curr) => {
    acc[curr.sector] = (acc[curr.sector] || 0) + 1;
    return acc;
  }, {});

  const chart2Data = Object.keys(sectorCounts).map((sectorName, idx) => {
    const colors = ['#1E3A8A', '#0D9488', '#F59E0B', '#6366F1', '#EC4899'];
    return {
      label: `قطاع ${sectorName}`,
      value: sectorCounts[sectorName],
      color: colors[idx % colors.length]
    };
  });

  // Compute Compliance Index using system config
  const compliantCount = filteredEsts.filter(e => e.lastInspection !== 'لم يزر بعد' && e.score >= (config?.passingScore || 90)).length;
  const monitoringCount = filteredEsts.filter(e => e.lastInspection !== 'لم يزر بعد' && e.score >= (config?.warningScore || 70) && e.score < (config?.passingScore || 90)).length;
  const nonCompliantCount = filteredEsts.filter(e => e.lastInspection !== 'لم يزر بعد' && e.score < (config?.warningScore || 70)).length;

  const chart3Data = [
    { label: `ممتاز وملتزم (${config?.passingScore || 90}-100%)`, value: compliantCount || 0, color: '#0D9488' },
    { label: `تحت المراقبة (${config?.warningScore || 70}-${(config?.passingScore || 90) - 1}%)`, value: monitoringCount || 0, color: '#F59E0B' },
    { label: `غير ملتزم ومخالف (<${config?.warningScore || 70}%)`, value: nonCompliantCount || 0, color: '#DC2626' }
  ];

  // Calculate Worst Sectors
  const sectorScores = filteredEsts.reduce((acc, curr) => {
    if (curr.lastInspection !== 'لم يزر بعد') {
      if (!acc[curr.sector]) acc[curr.sector] = { totalScore: 0, count: 0, nonCompliant: 0 };
      acc[curr.sector].totalScore += curr.score;
      acc[curr.sector].count += 1;
      if (curr.score < (config?.warningScore || 70)) acc[curr.sector].nonCompliant += 1;
    }
    return acc;
  }, {});

  const worstSectors = Object.keys(sectorScores)
    .map(sector => ({
      name: sector,
      avgScore: Math.round(sectorScores[sector].totalScore / sectorScores[sector].count),
      nonCompliant: sectorScores[sector].nonCompliant
    }))
    .sort((a, b) => b.nonCompliant - a.nonCompliant || a.avgScore - b.avgScore)
    .slice(0, 3);

  const chart4Data = Object.keys(sectorScores)
    .map((sector, idx) => {
      const colors = ['#E11D48', '#C026D3', '#7C3AED', '#2563EB', '#059669'];
      return {
        label: sector,
        value: sectorScores[sector].nonCompliant,
        color: colors[idx % colors.length]
      };
    })
    .filter(d => d.value > 0)
    .sort((a, b) => b.value - a.value);

  // Filter penalty requests based on selected targetSector
  const filteredPenaltyRequests = (penaltyRequests || []).filter(req => {
    if (!targetSector || targetSector === 'الكل') return true;
    const est = establishments.find(e => e.id === req.targetEstId);
    return est && matchSector(targetSector, est.sector);
  });

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const allMonthlyClosures = filteredPenaltyRequests.filter(req => 
    req.type === 'closure' && req.status === 'approved' &&
    new Date(req.date).getMonth() === currentMonth && new Date(req.date).getFullYear() === currentYear
  );
  const allMonthlyFines = filteredPenaltyRequests.filter(req => 
    req.type === 'fine' && req.status === 'approved' &&
    new Date(req.date).getMonth() === currentMonth && new Date(req.date).getFullYear() === currentYear
  );
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [statsModalType, setStatsModalType] = useState('closures'); 
  const [selectedSector, setSelectedSector] = useState(null); 

  const closedRestaurants = filteredPenaltyRequests.filter(p => p.type === 'closure' && p.status === 'approved');
  const finedRestaurants = filteredPenaltyRequests.filter(p => p.type === 'fine' && p.status === 'approved');

  // Calculate Public Complaints
  const publicComplaintsCount = (reports || []).filter(r => !r.isDelivery).length;

  // Dynamic category breakdown counts
  const categoryCounts = filteredEsts.reduce((acc, curr) => {
    const category = curr.type || 'أخرى';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  // Get uninspected shop list descriptions for the modal
  const uninspectedList = filteredEsts.filter(e => e.lastInspection === 'لم يزر بعد');
  const uninspectedNeighborhoods = uninspectedList.length > 0 
    ? uninspectedList.map(e => `${e.name} (${e.sector})`).join('， ')
    : 'لا توجد منشآت غير مزارة في هذا القطاع.';

  

  const handleMapSectorSelect = (sector) => {
    if (sector === 'all') {
      setSelectedTeamId('all');
    } else {
      const matchingTeam = allowedTeams.find(t => t.sector?.includes(sector) || sector.includes(t.sector));
      if (matchingTeam) {
        setSelectedTeamId(matchingTeam.id);
      }
    }
  };

  return (
    <>
      <PrintableDailyReport />
      <div className={`bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300 print:hidden relative ${embeddedTab ? 'min-h-full rounded-2xl overflow-hidden' : 'min-h-screen'}`}>
        <CriticalAlertModal />
        
        {/* Fixed Sticky Left Sidebar */}
        {!embeddedTab && (
        <aside className="w-80 shrink-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-lg border-l border-slate-200/50 dark:border-slate-800/50 p-4 flex flex-col hidden md:flex sticky top-0 h-screen">
          <div className="shrink-0">
            {/* Logo */}
            <AnimatedLogo variant="sidebar" className="mb-4" />

          {/* User Profile Card */}
          <div className="mb-4 p-3 rounded-2xl bg-teal-500/5 border border-teal-500/10 flex items-center justify-between text-right">
            <div className="flex flex-col">
              <span className="text-xs font-black text-slate-800 dark:text-white">
                {user?.name || 'مدير النظام'}
              </span>
              <span className="text-[9px] text-teal-650 dark:text-teal-400 font-extrabold uppercase mt-0.5">
                {user?.title || 'إدارة النظام'} {user?.sector ? ` - قطاع ${user.sector}` : ''}
              </span>
              <span className="text-[8px] text-slate-400 font-normal dir-ltr">{user?.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
            </div>
          </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1 mb-4 pr-1 pl-2">
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block px-3 mb-2">
              الرئيسية
            </span>

            {/* Dynamic Sidebar Buttons Based on uiPreferences.tabOrder */}
            {(() => {
              const tabConfig = {
                strategic: {
                  label: PERMISSIONS_TABS.find(t => t.id === 'advanced')?.label || 'الإدارة المتقدمة',
                  icon: TrendingUp,
                  iconColorClass: '',
                  activeBgClass: 'bg-teal-600 text-white shadow-md shadow-teal-500/20',
                  permission: 'showMainDashboard',
                  onClick: () => { setExecutiveTab('dashboard'); setActiveTab('strategic'); },
                  isActive: executiveTab === 'dashboard' && activeTab === 'strategic',
                  showCondition: true
                },
                team_reports: {
                  label: 'تقارير الفرق الميدانية',
                  icon: Users,
                  iconColorClass: '',
                  activeBgClass: 'bg-indigo-600 text-white shadow-md shadow-indigo-500/10',
                  permission: 'showFieldTeamsStats',
                  onClick: () => { 
                    setExecutiveTab('dashboard'); 
                    setActiveTab('team_reports'); 
                    if (!selectedTeamId || selectedTeamId === 'all') {
                      setSelectedTeamId(allowedTeams[0]?.id);
                    }
                  },
                  isActive: executiveTab === 'dashboard' && activeTab === 'team_reports',
                  showCondition: allowedTeams.length > 0
                },
                operations_room: {
                  label: PERMISSIONS_TABS.find(t => t.id === 'operations_room')?.label || 'غرفة العمليات المركزية',
                  icon: ShieldAlert,
                  iconColorClass: 'text-fuchsia-500',
                  activeBgClass: 'bg-fuchsia-600 text-white shadow-md shadow-fuchsia-500/10',
                  permission: 'showOperationsRoom',
                  onClick: () => { setExecutiveTab('dashboard'); setActiveTab('operations_room'); },
                  isActive: executiveTab === 'dashboard' && activeTab === 'operations_room',
                  showCondition: true
                },
                
                directives: {
                  label: PERMISSIONS_TABS.find(t => t.id === 'directives')?.label || 'التبليغات',
                  icon: Mail,
                  iconColorClass: 'text-amber-500',
                  activeBgClass: 'bg-amber-600 text-white shadow-md shadow-amber-500/10',
                  permission: null,
                  onClick: () => { setExecutiveTab('dashboard'); setActiveTab('directives'); },
                  isActive: executiveTab === 'dashboard' && activeTab === 'directives',
                  showCondition: hasPerm('showDirectivesPage') || hasPerm('sendDirective') || hasPerm('replyDirective') || hasPerm('quickTeamDispatch')
                },
                complaints: {
                  label: 'الشكاوى',
                  icon: ShieldAlert,
                  iconColorClass: 'text-red-500',
                  activeBgClass: 'bg-red-600 text-white shadow-md shadow-red-500/10',
                  permission: null,
                  onClick: () => { setExecutiveTab('dashboard'); setActiveTab('complaints'); },
                  isActive: executiveTab === 'dashboard' && activeTab === 'complaints',
                  showCondition: hasPerm('showPublicEvalsPage') || hasPerm('showDeliveryPage')
                },
                lab_decisions: {
                  label: 'قرارات المختبر',
                  icon: FlaskConical,
                  iconColorClass: 'text-fuchsia-500',
                  activeBgClass: 'bg-fuchsia-600 text-white shadow-md shadow-fuchsia-500/10',
                  permission: 'authenticatePenalties',
                  onClick: () => { setExecutiveTab('dashboard'); setActiveTab('lab_results'); },
                  isActive: executiveTab === 'dashboard' && activeTab === 'lab_results',
                  showCondition: true
                },
                lab_management: {
                  label: 'المختبر',
                  icon: FlaskConical,
                  iconColorClass: 'text-indigo-500',
                  activeBgClass: 'bg-indigo-600 text-white shadow-md shadow-indigo-500/10',
                  permission: null,
                  onClick: () => { setExecutiveTab('dashboard'); setActiveTab('lab_management'); },
                  isActive: executiveTab === 'dashboard' && activeTab === 'lab_management',
                  showCondition: hasPerm('receiveSamples') || hasPerm('enterLabResults') || hasPerm('labArchive')
                },
                financials: {
                  label: PERMISSIONS_TABS.find(t => t.id === 'financials')?.label || 'المالية',
                  icon: Database,
                  iconColorClass: 'text-emerald-500',
                  activeBgClass: 'bg-emerald-600 text-white shadow-md shadow-emerald-500/10',
                  permission: null,
                  onClick: () => { setExecutiveTab('dashboard'); setActiveTab('financials'); },
                  isActive: executiveTab === 'dashboard' && activeTab === 'financials',
                  showCondition: hasPerm('financialReports') || hasPerm('payFines') || hasPerm('dailyInventory')
                },
                establishments: {
                  label: 'إدارة المنشآت',
                  icon: Building,
                  iconColorClass: 'text-blue-500',
                  activeBgClass: 'bg-blue-600 text-white shadow-md shadow-blue-500/10',
                  permission: 'manageEstablishments',
                  onClick: () => { setExecutiveTab('establishments'); setSelectedTeamId(''); },
                  isActive: executiveTab === 'establishments',
                  showCondition: true
                }
              };

              const savedTabOrder = uiPreferences?.tabOrder || Object.keys(tabConfig);
              const tabOrder = [...new Set([...savedTabOrder, ...Object.keys(tabConfig)])];
              return tabOrder.map(tabKey => {
                const config = tabConfig[tabKey];
                if (!config || (config.permission && !hasPerm(config.permission)) || !config.showCondition) return null;
                const Icon = config.icon;
                
                return (
                  <button
                    key={tabKey}
                    onClick={config.onClick}
                    className={`w-full text-right px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center gap-3 ${
                      config.isActive
                        ? config.activeBgClass
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <Icon className={`w-4.5 h-4.5 ${!config.isActive && config.iconColorClass ? config.iconColorClass : ''}`} />
                    <span>{config.label}</span>
                  </button>
                );
              });
            })()}
          </div>

        {/* Logout at bottom - Sticky */}
        <div className="pt-4 mt-auto border-t border-slate-200/50 dark:border-slate-800/50 sticky bottom-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md pb-6 -mb-6 space-y-2">
          <button 
            onClick={() => setShowDisplayPrefsModal(true)}
            className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
          >
            <Settings className="w-4 h-4" />
            <span>تخصيص العرض</span>
          </button>
          <button
            onClick={globalLogout}
            className="w-full py-2.5 rounded-xl border border-red-500/20 bg-red-500/5 text-red-600 dark:text-red-400 hover:bg-red-500/10 text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>تسجيل الخروج الآمن</span>
          </button>
        </div>
      </aside>
        )}

      {/* Main Panel Canvas */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {/* Top bar for small screens */}
        <div className="md:hidden flex items-center justify-between p-4 mb-6 glassmorphic-card rounded-2xl">
          <AnimatedLogo variant="sidebar" className="border-none p-0" />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setShowDisplayPrefsModal(true)}
              className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={globalLogout}
              className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="md:hidden mb-6">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-2 mr-1">القائمة السريعة</label>
          <select
            value={executiveTab === 'establishments' ? 'establishments' : (activeTab === 'strategic' ? selectedTeamId : activeTab)}
            onChange={(e) => {
              const val = e.target.value;
              if (val === 'establishments') {
                setExecutiveTab('establishments');
              } else if (val === 'operations_room' || val === 'directives' || val === 'complaints' || val === 'team_reports') {
                setExecutiveTab('dashboard');
                setActiveTab(val);
                if (val === 'team_reports' && (!selectedTeamId || selectedTeamId === 'all')) {
                  setSelectedTeamId(allowedTeams[0]?.id);
                }
              } else {
                setExecutiveTab('dashboard');
                setSelectedTeamId(val);
                setActiveTab('strategic');
              }
            }}
            className="w-full p-3 rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs font-bold outline-none text-slate-800 dark:text-slate-200"
          >
            {hasPerm('showMainDashboard') && (
              <option value="all">📊 اللوحة الرئيسية (الاستراتيجية)</option>
            )}
            {hasPerm('showFieldTeamsStats') && allowedTeams.length > 0 && (
              <option value="team_reports">👥 تقارير الفرق الميدانية</option>
            )}
            {hasPerm('sendDirective') && (
              <option value="operations_room">🚨 غرفة العمليات المركزية</option>
            )}

            {(hasPerm('showDirectivesPage') || hasPerm('sendDirective') || hasPerm('replyDirective') || hasPerm('quickTeamDispatch')) && (
              <option value="directives">📢 التبليغات</option>
            )}
            {hasPerm('showPublicEvalsPage') && (
              <option value="complaints">⚠️ شكاوى المواطنين</option>
            )}
            {(hasPerm('receiveSamples') || hasPerm('enterLabResults') || hasPerm('labArchive')) && (
              <option value="lab_results">🧪 قرارات المختبر</option>
            )}
            {(hasPerm('createEst') || hasPerm('editEst') || hasPerm('deleteEst')) && (
              <option value="establishments">🏢 إدارة المنشآت</option>
            )}

          </select>
        </div>

        {/* Welcome Headers */}
        <div className="relative z-40 flex flex-wrap items-center justify-between gap-4 mb-6 p-4 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/20 text-right">
          <div className="flex items-center gap-3">
            <span className="text-xl">
              {activeTab === 'strategic' ? '⚙️' : activeTab === 'establishments' ? '🏢' : activeTab === 'directives' ? '📢' : activeTab === 'complaints' ? '⚖️' : activeTab === 'field_dispatch' ? '🚀' : activeTab === 'lab_results' ? '🧪' : '💼'}
            </span>
            <div>
              <h2 className="text-xs font-black text-slate-800 dark:text-white">
                {activeTab === 'establishments' ? (PERMISSIONS_TABS.find(t => t.id === 'establishments')?.label || 'المنشآت') : 
                 activeTab === 'directives' ? 'التبليغات' : 
                 activeTab === 'complaints' ? 'شكاوى المواطنين' :
                 
                 activeTab === 'lab_results' ? 'قرارات المختبر' :
                 activeTab === 'team_reports' ? `تقارير ${allowedTeams.find(t => t.id === selectedTeamId)?.name || 'الفريق الميداني'}` :
                 (activeTab === 'none' ? (PERMISSIONS_TABS.find(t => t.id === 'advanced')?.label || 'الإدارة المتقدمة') : (selectedTeamId === 'all' ? 'الملخص الإحصائي العام للمحافظة' : `إحصائيات ${allowedTeams.find(t => t.id === selectedTeamId)?.name || 'المنظومة'}`))}
              </h2>
              <p className="text-[10px] text-slate-400 mt-1">
                {activeTab === 'establishments' ? 'عرض وتعديل والتحكم الكامل بالمنشآت المضافة' : 
                 activeTab === 'directives' ? 'إرسال الأوامر والتعميمات للفرق الرقابية' :
                 activeTab === 'complaints' ? 'عرض شكاوى وملاحظات المواطنين الواردة من خلال مسح QR' :
                 
                 (activeTab === 'none' ? 'نظام إدارة الرقابة الصحية الموحد - محافظة نينوى' : 'عرض البيانات والأرقام الرقابية المحدثة في الوقت الفعلي للمنظومة')}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold text-slate-600 dark:text-slate-300">
            <NotificationBell />
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-xl">
              <span>📅 {new Date().toLocaleDateString('ar-IQ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              <span className="text-slate-300">|</span>
              <span>⏰ {new Date().toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className="flex items-center gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2.5 py-1 rounded-xl border border-amber-500/20">
              <WeatherWidget variant="full" />
            </div>
            {hasPerm('exportData') && (
              <button 
                onClick={() => window.print()}
                className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-[10px] transition-all shadow-md flex items-center gap-1.5 no-print"
              >
                🖨️ طباعة الموقف الإحصائي اليومي
              </button>
            )}
          </div>
        </div>



        {/* Tab Content Rendering */}
        {executiveTab === 'establishments' && hasPerm('manageEstablishments') ? (
          <EstablishmentsManager />
        ) : (
          <>
        {activeTab === 'operations_room' && <OperationsRoom />}

        
        {activeTab === 'financials' && <FinancialReports />}
        
        {activeTab !== 'operations_room' && activeTab !== 'financials' && (
          <>
            {/* Welcome / No Permissions State */}
        {!hasPerm('showMainDashboard') && !hasPerm('manageEstablishments') && !hasPerm('showReportsPage') && !(hasPerm('showDirectivesPage') || hasPerm('sendDirective') || hasPerm('replyDirective') || hasPerm('quickTeamDispatch')) && !hasPerm('showPublicEvalsPage') && (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 shadow-inner">
              <ShieldAlert className="w-10 h-10 text-slate-400" />
            </div>
            <h2 className="text-lg font-black text-slate-800 dark:text-white">لا توجد صلاحيات مخصصة</h2>
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
              عذراً، لم يتم منحك أي صلاحيات لعرض الصفحات في هذا الحساب الإداري. جميع المؤشرات والمهام محجوبة كإجراء احترازي. يرجى مراجعة مدير النظام (Super Admin) لتفعيل الأذونات اللازمة عبر الرئيسية.
            </p>
          </div>
        )}

        {/* Dynamic Tab Switching Content */}
        {(activeTab === 'strategic' && hasPerm('showMainDashboard')) || (activeTab === 'team_reports' && hasPerm('showFieldTeamsStats')) ? (
          <div className="space-y-6">
            
            {activeTab === 'team_reports' && (
              <div className="flex gap-3 overflow-x-auto pb-4 custom-scrollbar hide-scroll-indicator -mx-4 px-4 md:mx-0 md:px-0">
                {allowedTeams.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTeamId(t.id)}
                    className={`shrink-0 px-5 py-3 rounded-xl text-xs font-black transition-all border ${
                      selectedTeamId === t.id 
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-500/30' 
                        : 'bg-white/60 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-slate-700 hover:scale-[1.02]'
                    }`}
                  >
                    👥 {t.name}
                  </button>
                ))}
              </div>
            )}

            {/* Summary Minimalist 3D Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Card 1: Total establishments */}
          <div 
            onClick={() => setShowCategoryBreakdownModal(true)}
            className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xl border border-slate-700/50 cursor-pointer hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 text-right group relative overflow-hidden"
          >
            <div className="absolute top-2 left-2 opacity-5 group-hover:opacity-10 transition-opacity">
              <Building className="w-32 h-32 text-white" />
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-teal-400 text-[10px] font-black tracking-wider uppercase bg-teal-500/10 px-2 py-0.5 rounded-lg border border-teal-500/20">منشآت نينوى</span>
              <span className="text-xs text-slate-400">اضغط للمعاينة بالتصنيف 🔍</span>
            </div>
            <h3 className="text-xs text-slate-300 font-bold">إجمالي المنشآت الخاضعة للرقابة الصحية</h3>
            <span className="text-4xl lg:text-5xl font-black text-white mt-1 block">{filteredEsts.length} <span className="text-sm text-slate-450 font-medium">منشأة مسجلة</span></span>
          </div>

          {/* Card 2: Coverage Ratio */}
          <div 
            className="p-5 rounded-2xl bg-gradient-to-br from-teal-900 to-slate-900 text-white shadow-xl border border-teal-800/40 text-right relative overflow-hidden"
          >
            <div className="absolute top-2 left-2 opacity-5">
              <TrendingUp className="w-32 h-32 text-teal-400" />
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-emerald-450 text-[10px] font-black tracking-wider uppercase bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">نسبة الإنجاز</span>
              <span className="text-emerald-400 text-xs font-bold">مؤشر أداء متميز</span>
            </div>
            <h3 className="text-xs text-slate-300 font-bold">نسبة تغطية الرقابة الصحية المنجزة</h3>
            <span className="text-4xl lg:text-5xl font-black text-emerald-400 mt-1 block">
              {filteredEsts.length > 0 ? Math.round((inspectedCount / filteredEsts.length) * 100) : 0}%
            </span>
          </div>

          {/* Card 3: Critical Violations */}
          <div 
            className="p-5 rounded-2xl bg-gradient-to-br from-red-900 to-slate-900 text-white shadow-xl border border-red-800/40 text-right relative overflow-hidden"
          >
            <div className="absolute top-2 left-2 opacity-5">
              <AlertTriangle className="w-32 h-32 text-red-400" />
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-red-450 text-[10px] font-black tracking-wider uppercase bg-red-500/10 px-2 py-0.5 rounded-lg border border-red-500/20">منشآت حرجة</span>
              <span className="text-red-400 text-xs font-bold">تتطلب متابعة</span>
            </div>
            <h3 className="text-xs text-slate-300 font-bold">إجمالي المخالفات الحرجة غير الملتزمة</h3>
            <span className="text-4xl lg:text-5xl font-black text-red-400 mt-1 block">
              {nonCompliantCount} <span className="text-sm text-red-500/70 font-medium">مخالفة</span>
            </span>
          </div>

          {/* Card 4: Closed Establishments */}
          <div 
            className="p-5 rounded-2xl bg-gradient-to-br from-orange-900 to-slate-900 text-white shadow-xl border border-orange-800/40 text-right relative overflow-hidden"
          >
            <div className="absolute top-2 left-2 opacity-5">
              <AlertTriangle className="w-32 h-32 text-orange-400" />
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-orange-450 text-[10px] font-black tracking-wider uppercase bg-orange-500/10 px-2 py-0.5 rounded-lg border border-orange-500/20">إغلاق رسمي</span>
              <span className="text-orange-400 text-xs font-bold">محاسبة قانونية</span>
            </div>
            <h3 className="text-xs text-slate-300 font-bold">إجمالي المنشآت المغلقة للآن</h3>
            <span className="text-4xl lg:text-5xl font-black text-orange-400 mt-1 block">
              {closedRestaurants.length} <span className="text-sm text-orange-500/70 font-medium">منشأة</span>
            </span>
          </div>
        </div>



          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div 
              onClick={() => { setStatsModalType('closures'); setSelectedSector(null); setShowStatsModal(true); }}
              className="glassmorphic-card p-6 border border-rose-500/20 hover:-translate-y-2 hover:shadow-2xl hover:shadow-rose-500/10 transition-all duration-300 cursor-pointer select-none"
            >
              <h3 className="text-sm font-black text-slate-800 dark:text-white mb-2">المنشآت المغلقة هذا الشهر 🔒</h3>
              <p className="text-[10px] text-slate-500 mb-4">إجمالي المنشآت التي تم اتخاذ قرار بإغلاقها خلال الشهر الحالي في القطاعات المعنية.</p>
              <p className="text-5xl font-extrabold text-rose-500">{allMonthlyClosures.length}</p>
              <span className="text-[10px] text-rose-500 font-bold block mt-3">انقر لعرض التفاصيل 👁️</span>
            </div>
            
            <div 
              onClick={() => { setStatsModalType('fines'); setSelectedSector(null); setShowStatsModal(true); }}
              className="glassmorphic-card p-6 border border-amber-500/20 hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 cursor-pointer select-none"
            >
              <h3 className="text-sm font-black text-slate-800 dark:text-white mb-2">الغرامات المالية هذا الشهر 💰</h3>
              <p className="text-[10px] text-slate-500 mb-4">إجمالي المنشآت التي تم تغريمها مالياً خلال الشهر الحالي في القطاعات المعنية.</p>
              <p className="text-5xl font-extrabold text-amber-500">{allMonthlyFines.length}</p>
              <span className="text-[10px] text-amber-500 font-bold block mt-3">انقر لعرض التفاصيل 👁️</span>
            </div>
          </div>


            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Compliance Bar Chart */}
              <div 
                className="glassmorphic-card p-5 flex flex-col min-h-[320px] cursor-pointer hover:shadow-2xl transition-all"
                onClick={() => setChartModalState({ isOpen: true, title: 'تفاصيل مؤشر امتثال السلامة الصحية للمنشآت', data: chart3Data })}
              >
                <ThreeDBarChart
                  title="مؤشر امتثال السلامة الصحية للمنشآت"
                  data={chart3Data}
                />
              </div>

              {/* Inspection Pie Chart */}
              <div 
                className="glassmorphic-card p-5 flex flex-col min-h-[320px] cursor-pointer hover:shadow-2xl transition-all relative"
                onClick={() => setChartModalState({ isOpen: true, title: 'تفاصيل نسبة تقييم وإصدار رموز QR هذا الشهر', data: chart1Data })}
              >
                <ThreeDPieChart
                  title="نسبة تقييم وإصدار رموز QR هذا الشهر"
                  data={chart1Data}
                  onRedClick={(e) => {
                    e?.stopPropagation();
                    setShowUninspectedModal(true);
                  }}
                />
              </div>
            </div>

            {/* Strategic Map Integration */}
            {hasPerm('showReportsPage') && (
              <div className="w-full h-[70vh] min-h-[600px] rounded-3xl overflow-hidden shadow-2xl border border-emerald-500/20 relative z-10 bg-slate-50 dark:bg-slate-900 flex flex-col p-6 mt-8">
                <NinevehMap
                  establishments={establishments}
                  selectedSector={targetSector}
                  onSectorSelect={handleMapSectorSelect}
                  fullHeight={true}
                />
              </div>
            )}

          </div>
        ) : activeTab === 'lab_results' && (hasPerm('receiveSamples') || hasPerm('enterLabResults') || hasPerm('labArchive')) ? (
          <div className="glassmorphic-card p-6 border border-fuchsia-500/20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h3 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
                  <FlaskConical className="w-6 h-6 text-fuchsia-600" />
                  نتائج المختبر المركزي (تحتاج قرار)
                </h3>
                <p className="text-xs font-bold text-slate-500 mt-1">النتائج المختبرية التي تثبت تلوث العينات وتستوجب اتخاذ قرار الغرامة أو الإغلاق</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {labRequests?.filter(r => r.status === 'finished' && r.result === 'contaminated').length === 0 ? (
                <div className="text-center p-12 text-slate-400 font-bold bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-white/5">
                  لا توجد عينات ملوثة حالياً تحتاج لقرار.
                </div>
              ) : (
                labRequests?.filter(r => r.status === 'finished' && r.result === 'contaminated').map(req => (
                  <div key={req.id} className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/50 rounded-2xl">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 flex items-center justify-center shrink-0">
                          <ShieldAlert className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-black text-slate-800 dark:text-white mb-1">المنشأة: {req.estName}</h4>
                          <p className="text-xs text-slate-600 dark:text-slate-300 font-bold">الفريق المرسل: {req.teamName}</p>
                          <p className="text-[10px] text-slate-500 mt-1">تاريخ الفحص: {new Date(req.finishedAt).toLocaleString('ar-IQ')}</p>
                          {req.notes && (
                            <div className="mt-2 p-3 bg-white/50 dark:bg-slate-900/50 rounded-xl text-xs font-bold text-red-700 dark:text-red-400 border border-red-100 dark:border-red-900/30">
                              ملاحظات المختبر: {req.notes}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2 min-w-[200px]">
                        <button 
                          onClick={() => {
                            setLabRequests(prev => prev.map(r => r.id === req.id ? { ...r, result: 'contaminated_action_taken' } : r));
                            notify('تم توجيه طلب غرامة وإغلاق للفريق الميداني', 'success', true);
                          }}
                          className="w-full py-2.5 rounded-xl bg-gradient-to-l from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-black text-xs transition-all shadow-md flex items-center justify-center gap-2"
                        >
                          <AlertOctagon className="w-4 h-4" />
                          توجيه الفريق بالغلق والتغريم
                        </button>
                        <button 
                          onClick={() => {
                            setLabRequests(prev => prev.map(r => r.id === req.id ? { ...r, result: 'contaminated_ignored' } : r));
                            notify('تم أرشفة النتيجة دون اتخاذ إجراء', 'info');
                          }}
                          className="w-full py-2.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-bold text-xs transition-all"
                        >
                          أرشفة بدون إجراء
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : activeTab === 'directives' && (hasPerm('showDirectivesPage') || hasPerm('sendDirective') || hasPerm('replyDirective') || hasPerm('quickTeamDispatch')) ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* Direct Command Directive Form */}
            {hasPerm('sendDirective') && (
              <div className="glassmorphic-card p-5 border border-amber-500/20 bg-amber-500/5 dark:bg-amber-950/10 text-right rounded-3xl sticky top-6">
                <div className="flex items-center gap-2 border-b border-amber-500/10 pb-3 mb-4">
                  <ShieldAlert className="w-5 h-5 text-amber-500" />
                  <div>
                    <h3 className="text-xs font-black text-slate-800 dark:text-white">📢 بوابة الأوامر والتعميمات الإدارية</h3>
                    <p className="text-[10px] text-slate-500 mt-0.5">توجيه اللجان الميدانية أو شعب الرقابة بمختلف القطاعات</p>
                  </div>
                </div>

                <form onSubmit={handleSendDirective} className="space-y-4 text-xs font-bold">
                  <div className="space-y-1">
                    <label className="text-slate-600 dark:text-slate-400">الجهة الإدارية المعنية بالأمر</label>
                    <select
                      value={targetRecipient}
                      onChange={(e) => setTargetRecipient(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200 outline-none focus:border-amber-500 font-bold"
                    >
                      <option value="all">📢 كافة شعب ولجان التفتيش بالمحافظة</option>
                      {directors?.filter(d => d.id !== user?.id && d.active).map(d => (
                        <option key={d.id} value={d.id}>👑 {d.title} ({d.name})</option>
                      ))}
                      {allowedTeams.map(t => (
                        <option key={t.id} value={t.id}>👥 {t.name} ({t.sector})</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-600 dark:text-slate-400">الأولوية ودرجة الإلحاح</label>
                    <select
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200 outline-none focus:border-amber-500"
                    >
                      <option value="high">🚨 عاجل وهام جداً - تنفيذ فوري</option>
                      <option value="medium">⚠️ متابعة روتينية يومية</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-600 dark:text-slate-400">نص التوجيه / الأمر الرقابي والتعليمات الوزارية</label>
                    <textarea
                      rows="4"
                      required
                      placeholder="اكتب التوجيه هنا..."
                      value={directiveText}
                      onChange={(e) => setDirectiveText(e.target.value)}
                      className="w-full p-3 rounded-2xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200 outline-none focus:border-amber-500 font-medium"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/10 active:scale-95 transition-all"
                  >
                    <Send className="w-4 h-4" />
                    <span>إرسال وتعميم الأمر الإداري فوراً 🚀</span>
                  </button>
                </form>

                {directiveSuccessMsg && (
                  <div className="mt-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-center font-bold text-[10px] animate-pulse">
                    {directiveSuccessMsg}
                  </div>
                )}
              </div>
            )}
            
            {/* Directives Inbox/Outbox List */}
            {hasPerm('showDirectivesPage') && (
            <div className="glassmorphic-card p-5 border border-amber-500/20 bg-slate-900 rounded-3xl max-h-[600px] overflow-y-auto">
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-800 mb-4 text-right">
                <h3 className="text-sm font-black text-amber-500 flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  التبليغات
                </h3>
              </div>
              <div className="space-y-4 text-right pr-1">
                {(directives || []).filter(d => d.teamId === user?.role || d.teamId === user?.id || d.teamId === 'all' || d.sender?.includes(user?.name)).length > 0 ? (
                  (directives || []).filter(d => d.teamId === user?.role || d.teamId === user?.id || d.teamId === 'all' || d.sender?.includes(user?.name)).map((dir, idx) => (
                    <div key={idx} className={`${dir.text.startsWith('رد على تبليغ:') ? 'bg-teal-900/40 border-teal-500 border-2 shadow-teal-500/20' : 'bg-slate-800 border-slate-700/60'} p-4 rounded-2xl border shadow-md transition-all relative overflow-hidden`}>
                      {dir.text.startsWith('رد على تبليغ:') && (
                        <div className="absolute top-0 right-0 h-full w-1.5 bg-teal-500"></div>
                      )}
                      <div className="flex justify-between items-start mb-2 relative z-10">
                        <div>
                          <h4 className="text-xs font-black text-white">من: {dir.sender}</h4>
                          <span className="text-[10px] text-slate-400">إلى: {dir.teamId === 'all' ? 'جميع الجهات والفرق' : (teams.find(t => t.id === dir.teamId)?.name || directors.find(d => d.id === dir.teamId)?.title || dir.teamId)}</span>
                        </div>
                        <span className="bg-slate-900 text-slate-300 text-[9px] font-bold px-2 py-1 rounded-md border border-slate-700/50">
                          {dir.date || 'تاريخ غير محدد'}
                        </span>
                      </div>
                      <p className={`text-xs font-bold p-3 rounded-xl border mt-2 ${dir.text.startsWith('رد على تبليغ:') ? 'bg-teal-950/50 border-teal-800/50 text-teal-100' : 'bg-slate-900/50 border-slate-700 text-slate-300'}`}>
                        {dir.text}
                      </p>
                      
                      {/* Reply button for received directives */}
                      {dir.senderId !== user?.id && dir.senderId !== user?.role && hasPerm('replyDirective') && (
                        <div className="mt-3">
                          {replyingTo === dir.id ? (
                            <div className="flex gap-2 items-center bg-slate-900 p-2 rounded-xl border border-slate-700/50">
                              <input 
                                type="text"
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="اكتب ردك هنا..."
                                className="flex-1 bg-transparent border-none outline-none text-xs text-slate-200"
                              />
                              <button 
                                onClick={() => {
                                  if (replyText.trim()) {
                                    const senderName = user?.role === 'director' ? `المدير العام (${user?.name})` : `الإدارة (${user?.name})`;
                                    addDirective(dir.senderId || 'admin', `رد على تبليغ: ${replyText}`, senderName, user?.id || user?.role);
                                    setReplyingTo(null);
                                    setReplyText('');
                                    notify('تم إرسال الرد بنجاح', 'success');
                                  }
                                }}
                                className="p-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg shadow cursor-pointer transition-all"
                              >
                                <Send className="w-3 h-3" />
                              </button>
                              <button 
                                onClick={() => { setReplyingTo(null); setReplyText(''); }}
                                className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg cursor-pointer transition-all"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <button 
                              onClick={() => { setReplyingTo(dir.id); setReplyText(''); }}
                              className="text-[10px] font-bold text-amber-500 hover:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1.5 rounded-lg transition-all cursor-pointer border border-amber-500/20"
                            >
                              رد / تأكيد استلام
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center p-8 text-slate-500 font-bold text-xs">لا توجد تبليغات مسجلة حالياً</div>
                )}
              </div>
            </div>
            )}
          </div>
            
            {hasPerm('quickTeamDispatch') && (
            <div className="glassmorphic-card p-6 border border-blue-500/20 mt-6 lg:col-span-2">
            <h3 className="text-sm font-black text-slate-800 dark:text-white mb-2 flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-500" />
              التوجيه السريع للفرق الميدانية
            </h3>
            
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-right border-collapse text-xs font-bold">
                <thead>
                  <tr className="bg-slate-100/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                    <th className="p-3">الفريق / القطاع</th>
                    <th className="p-3">آخر تواجد مسجل</th>
                    <th className="p-3">المنشأة المستهدفة للتوجيه</th>
                    <th className="p-3 text-center">إجراء التوجيه</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                  {teams.map(t => {
                    const teamInspections = establishments
                      .filter(e => e.lastInspection !== 'لم يزر بعد' && e.lastInspectorId === t.id)
                      .sort((a, b) => new Date(b.lastInspectionDate || 0) - new Date(a.lastInspectionDate || 0));
                    const lastEst = teamInspections[0];
                    
                    return (
                      <tr key={t.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10">
                        <td className="p-3">
                          <span className="text-slate-800 dark:text-slate-200 block">{t.name}</span>
                          <span className="text-[10px] text-teal-600">{t.sector}</span>
                        </td>
                        <td className="p-3 text-slate-500">
                          <span className="block text-slate-700 dark:text-slate-300">
                            {lastEst ? `${lastEst.name}` : 'غير متوفر'}
                          </span>
                          <span className="text-[10px]">
                            {lastEst ? new Date(lastEst.lastInspectionDate).toLocaleString('ar-IQ') : 'لا يوجد نشاط'}
                          </span>
                        </td>
                        <td className="p-3">
                          <select 
                            onChange={(e) => {
                              setDispatchEstId(e.target.value);
                              setDispatchTeamId(t.id);
                            }}
                            className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px]"
                          >
                            <option value="">-- اختر المنشأة --</option>
                            {establishments.filter(e => e.sector === t.sector).map(est => (
                              <option key={est.id} value={est.id}>{est.name}</option>
                            ))}
                          </select>
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => handleDispatch(dispatchTeamId || t.id, dispatchEstId)}
                            className="px-3 py-1.5 rounded-lg bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold transition-all cursor-pointer text-[10px]"
                          >
                            🚀 إرسال التوجيه
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
            )}
          </div>
        ) : activeTab === 'complaints' && (hasPerm('showPublicEvalsPage') || hasPerm('showDeliveryPage')) ? (
          <div className="grid grid-cols-1 gap-6 items-start">
            {/* Public Evals / Complaints List */}
            <div className="glassmorphic-card p-5 border border-slate-700/60 bg-slate-900 rounded-3xl">
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-800 mb-4 text-right">
                <h3 className="text-sm font-black text-red-400 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5" />
                  سجل شكاوى المواطنين وبلاغاتهم
                </h3>
              </div>

              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1 text-right custom-scrollbar">
                {/* Active Complaints */}
                {(reports || []).filter(r => !r.isDelivery && !r.forwarded).length > 0 ? (
                  (reports || []).filter(r => !r.isDelivery && !r.forwarded).map((comp, idx) => (
                    <div key={idx} className="bg-slate-800 p-4 rounded-2xl border border-red-500/20 shadow-lg relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-2 h-full bg-red-500"></div>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="text-sm font-black text-white">{comp.establishmentName}</h4>
                          <span className="text-[10px] text-slate-400">القطاع: {comp.sector}</span>
                        </div>
                        <span className="bg-red-500/10 text-red-400 text-[10px] font-bold px-2 py-1 rounded-full border border-red-500/20">
                          {comp.date || 'تاريخ غير محدد'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 font-bold bg-slate-900 p-3 rounded-xl border border-slate-700 mt-2">
                        {comp.details}
                      </p>
                      {comp.evidenceImage && (
                        <div className="mt-3 flex items-center gap-2 text-[10px] text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg w-fit border border-emerald-500/20">
                          <Camera className="w-3.5 h-3.5" />
                          مرفق صورة إثبات المخالفة ({comp.evidenceImage})
                        </div>
                      )}
                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={() => handleRedirectComplaint(comp)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 text-xs font-bold rounded-xl transition-all border border-blue-500/30"
                        >
                          <Send className="w-4 h-4" />
                          إعادة توجيه للفريق
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-8 text-slate-500 font-bold text-xs">لا توجد شكاوى جديدة معلقة</div>
                )}

                {/* Archived Complaints */}
                {(reports || []).filter(r => !r.isDelivery && r.forwarded).length > 0 && (
                  <div className="mt-8 pt-4 border-t border-slate-700/50">
                    <h4 className="text-xs font-black text-slate-500 mb-4 flex items-center gap-2">
                      <Archive className="w-4 h-4" />
                      أرشيف الشكاوى المحالة (آخر 30 يوم)
                    </h4>
                    <div className="space-y-4 opacity-75">
                      {(reports || []).filter(r => !r.isDelivery && r.forwarded).map((comp, idx) => {
                        const forwardedDate = new Date(comp.forwardedAt || comp.date || comp.timestamp || Date.now());
                        const isRecent = (new Date() - forwardedDate) < 30 * 24 * 60 * 60 * 1000;
                        if (!isRecent) return null;
                        return (
                          <div key={`arch-${idx}`} className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 relative overflow-hidden">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="text-sm font-black text-slate-300">{comp.establishmentName}</h4>
                                <span className="text-[10px] text-slate-500">القطاع: {comp.sector}</span>
                              </div>
                              <div className="flex flex-col items-end">
                                <span className="text-emerald-500 text-[10px] font-bold">
                                  ✓ تمت الإحالة
                                </span>
                                <span className="text-slate-500 text-[9px]">
                                  {comp.forwardedAt ? new Date(comp.forwardedAt).toLocaleDateString('ar-IQ') : ''}
                                </span>
                              </div>
                            </div>
                            <p className="text-xs text-slate-400 font-medium">
                              {comp.details}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}
          </>
        )}
          </>
        )}
      </main>

      {/* Pop modal for Category breakdown details */}
      {showCategoryBreakdownModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-md transition-all">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 p-6 rounded-3xl text-slate-800 dark:text-white shadow-2xl relative text-right">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-200 dark:border-slate-800 mb-4">
              <h3 className="text-sm font-black text-teal-600 dark:text-teal-400">📊 تفاصيل وإحصائيات المنشآت حسب التصنيف</h3>
              <button 
                onClick={() => setShowCategoryBreakdownModal(false)}
                className="p-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {Object.keys(categoryCounts).map((cat) => (
                <div key={cat} className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800/80">
                  <span className="font-extrabold text-slate-700 dark:text-slate-200">{cat}</span>
                  <span className="px-3 py-1 rounded-lg bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 font-black text-xs border border-teal-500/20">
                    {categoryCounts[cat]} منشأة
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowCategoryBreakdownModal(false)}
              className="mt-6 w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-700 dark:text-white font-extrabold text-xs transition-all cursor-pointer"
            >
              إغلاق النافذة
            </button>
          </div>
        </div>
      )}

      

      {/* Central Stats Modal (Grouped by Sector) */}
      {showStatsModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6 rounded-3xl text-slate-800 dark:text-white shadow-2xl relative max-h-[85vh] overflow-y-auto text-right">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4 sticky top-0 bg-white dark:bg-slate-900 z-10">
              <div>
                <h3 className="text-lg font-black text-teal-600 dark:text-teal-400">
                  {statsModalType === 'closures' ? '🔒 المنشآت المغلقة هذا الشهر' : '💰 المنشآت المُغرمة هذا الشهر'}
                </h3>
                {selectedSector && (
                  <button 
                    onClick={() => setSelectedSector(null)}
                    className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white mt-1 underline"
                  >
                    العودة لقائمة القطاعات
                  </button>
                )}
              </div>
              <button onClick={() => setShowStatsModal(false)} className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              {(() => {
                const dataList = statsModalType === 'closures' ? allMonthlyClosures : allMonthlyFines;
                if (dataList.length === 0) {
                  return <p className="text-center text-sm text-slate-500 py-8">لا توجد بيانات لهذا الشهر.</p>;
                }

                // If a sector is selected, show list of items for that sector
                if (selectedSector) {
                  const itemsInSector = dataList.filter(req => req.sector === selectedSector);
                  return (
                    <div className="space-y-3">
                      <h4 className="font-bold text-slate-700 dark:text-slate-300 mb-2">قطاع: {selectedSector}</h4>
                      {itemsInSector.map(req => {
                        const estData = establishments.find(e => e.id === req.estId);
                        const neighborhood = estData ? estData.neighborhood : 'غير محدد';
                        return (
                          <div key={req.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 flex justify-between items-center">
                            <div>
                              <h4 className="font-black text-sm">{req.estName}</h4>
                              <p className="text-[10px] text-slate-500 mt-1">الحي: {neighborhood}</p>
                            </div>
                            <div className="text-left">
                              <span className="text-[10px] font-bold text-slate-400 block mb-1">
                                {new Date(req.date).toLocaleDateString('ar-IQ')}
                              </span>
                              <span className="text-[9px] text-teal-600 bg-teal-500/10 px-2 py-0.5 rounded">
                                {req.teamName || 'غير متوفر'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                }

                // Otherwise, group by sector and show summary cards
                const groupedBySector = dataList.reduce((acc, req) => {
                  const sector = req.sector || 'قطاعات أخرى';
                  if (!acc[sector]) acc[sector] = 0;
                  acc[sector]++;
                  return acc;
                }, {});

                return (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(groupedBySector).map(([sector, count]) => (
                      <div 
                        key={sector} 
                        onClick={() => setSelectedSector(sector)}
                        className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl cursor-pointer hover:border-teal-500 hover:shadow-lg transition-all text-center group"
                      >
                        <h4 className="font-black text-sm text-slate-700 dark:text-slate-300 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors mb-2">
                          {sector}
                        </h4>
                        <div className="w-12 h-12 rounded-full bg-teal-500/10 flex items-center justify-center mx-auto mb-2">
                          <span className="text-xl font-extrabold text-teal-600 dark:text-teal-400">{count}</span>
                        </div>
                        <span className="text-[10px] text-slate-500">
                          {statsModalType === 'closures' ? 'منشأة مغلقة' : 'غرامة مسجلة'}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Uninspected Locations Modal */}
      {showUninspectedModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-md transition-all">
          <div className="w-full max-w-md bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl p-6 border border-red-500/20 dark:border-red-500/20 shadow-2xl shadow-red-500/10 rounded-3xl relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-red-500/10 dark:border-red-500/20 mb-4">
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="text-sm font-black">المناطق والمنشآت المتبقية</h3>
              </div>
              <button
                onClick={() => setShowUninspectedModal(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <p className="text-xs text-slate-700 dark:text-slate-300 mb-4 leading-relaxed text-right font-bold">
              أحياء وشوارع متبقّية بانتظار الزيارة والتفتيش هذا الشهر:
            </p>

            <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-500/20 text-xs font-black text-red-700 dark:text-red-400 max-h-40 overflow-y-auto leading-relaxed text-right shadow-inner">
              {uninspectedNeighborhoods}
            </div>

            <button
              onClick={() => setShowUninspectedModal(false)}
              className="mt-6 w-full py-3 rounded-xl bg-gradient-to-l from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg shadow-red-600/20 text-xs font-black transition-all cursor-pointer"
            >
              إغلاق نافذة المعاينة
            </button>
          </div>
        </div>
      )}

      {/* Chart Details Modal */}
      {chartModalState.isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-md transition-all">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 p-6 rounded-3xl text-slate-800 dark:text-white shadow-2xl relative text-right">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-200 dark:border-slate-800 mb-4">
              <h3 className="text-sm font-black text-teal-600 dark:text-teal-400 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                {chartModalState.title}
              </h3>
              <button 
                onClick={() => setChartModalState({ ...chartModalState, isOpen: false })}
                className="p-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {chartModalState.data && chartModalState.data.length > 0 ? (
                chartModalState.data.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/50">
                    <span className="font-bold text-slate-700 dark:text-slate-200 text-xs flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                      {item.label}
                    </span>
                    <span className="px-3 py-1 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-white font-black text-xs border border-slate-200 dark:border-slate-700">
                      {item.value}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center text-slate-500 text-xs py-4">لا توجد بيانات لعرضها</div>
              )}
            </div>

            <button
              onClick={() => setChartModalState({ ...chartModalState, isOpen: false })}
              className="mt-6 w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-700 dark:text-white font-extrabold text-xs transition-all cursor-pointer"
            >
              إغلاق النافذة
            </button>
          </div>
        </div>
      )}

      {/* Complaints List Modal */}
      {showComplaintsModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-md transition-all">
          <div className="w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 p-6 rounded-3xl text-slate-800 dark:text-white shadow-2xl relative text-right">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-200 dark:border-slate-800 mb-4">
              <h3 className="text-sm font-black text-red-500 dark:text-red-400 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5" />
                سجل شكاوى المواطنين السرية
              </h3>
              <button 
                onClick={() => setShowComplaintsModal(false)}
                className="p-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              {(reports || []).filter(r => !r.isDelivery).length > 0 ? (
                (reports || []).filter(r => !r.isDelivery).map((comp, idx) => (
                  <div key={idx} className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-red-500/20 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-2 h-full bg-red-500"></div>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="text-sm font-black text-slate-800 dark:text-white">{comp.establishmentName}</h4>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400">القطاع: {comp.sector}</span>
                      </div>
                      <span className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-[10px] font-bold px-2 py-1 rounded-full border border-red-500/20">
                        {comp.date || 'تاريخ غير محدد'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 font-bold bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 mt-2">
                      {comp.details}
                    </p>
                    {comp.evidenceImage && (
                      <div className="mt-3 flex items-center gap-2 text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 rounded-lg w-fit border border-emerald-500/20">
                        <Camera className="w-3.5 h-3.5" />
                        مرفق صورة إثبات المخالفة ({comp.evidenceImage})
                      </div>
                    )}
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => handleRedirectComplaint(comp)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-600/20 hover:bg-blue-200 dark:hover:bg-blue-600/40 text-blue-700 dark:text-blue-400 text-xs font-bold rounded-xl transition-all border border-blue-200 dark:border-blue-500/30"
                      >
                        <Send className="w-4 h-4" />
                        إعادة توجيه للفريق
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-8 text-slate-500 font-bold text-xs">لا توجد شكاوى مسجلة حالياً</div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
    </>
  );
};

export default ExecutivePortal;
