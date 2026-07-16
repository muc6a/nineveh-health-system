import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { AnimatedLogo } from '../components/AnimatedLogo';
import { ThemeToggle } from '../components/ThemeToggle';
import { ThreeDPieChart } from '../components/ThreeDPieChart';
import { ThreeDBarChart } from '../components/ThreeDBarChart';
import { NinevehMap } from '../components/NinevehMap';
import OperationsRoom from '../components/OperationsRoom';
import { NotificationBell } from '../components/NotificationBell';
import { CriticalAlertModal } from '../components/CriticalAlertModal';
import { PrintableDailyReport } from '../components/PrintableDailyReport';
import { EstablishmentsManager } from '../components/EstablishmentsManager';
import { LogOut, MapPin, AlertTriangle, X, CheckCircle, TrendingUp, Users, ShieldAlert, FileText, Send, Building, LayoutDashboard, Camera } from 'lucide-react';

export const ExecutivePortal = () => {
  const { navigate, establishments, teams, user, setUser, addDirective, notify, reports, config, penaltyRequests } = useContext(AppContext);
  // Core UI state
  const [selectedTeamId, setSelectedTeamId] = useState('all');
  const [executiveTab, setExecutiveTab] = useState('dashboard');
  const [showUninspectedModal, setShowUninspectedModal] = useState(false);
  const [showCategoryBreakdownModal, setShowCategoryBreakdownModal] = useState(false);
  const [showComplaintsModal, setShowComplaintsModal] = useState(false);
  // User permissions logic (Default Deny)
  const hasPerm = (permName) => {
    if (user?.role === 'admin') return true;
    return user?.permissions?.[permName] === true;
  };

  const getInitialExecutiveTab = () => {
    if (user?.role === 'central_director') return 'operations_room';
    if (hasPerm('showMainDashboard')) return 'strategic';
    if (hasPerm('showReportsPage')) return 'geographic';
    return null;
  };

  const [activeTab, setActiveTab] = useState(getInitialExecutiveTab() || 'strategic');

  React.useEffect(() => {
    if (activeTab === 'strategic' && !hasPerm('showMainDashboard')) {
      const newTab = getInitialExecutiveTab();
      if (newTab) setActiveTab(newTab);
    }
  }, [user?.permissions]);

  // Listen for navigation events from NotificationBell
  React.useEffect(() => {
    const handleNav = () => {
      setActiveTab('operations_room');
    };
    window.addEventListener('navToPenalties', handleNav);
    return () => window.removeEventListener('navToPenalties', handleNav);
  }, []);

  // Send directives form states
  const [targetRecipient, setTargetRecipient] = useState('all');
  const [directiveText, setDirectiveText] = useState('');
  const [directiveSuccessMsg, setDirectiveSuccessMsg] = useState('');

  const handleSendDirective = (e) => {
    e.preventDefault();
    if (!directiveText) return;
    
    // Format sender name properly
    const senderName = user?.role === 'director' 
      ? `المدير العام لصحّة نينوى (${user?.name || 'د. عماد'})` 
      : `إدارة الصحة العامة (${user?.name || 'المدير العام'})`;

    // Send directive to target recipient
    addDirective(targetRecipient, directiveText, senderName);
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

  // Filter establishments based on selected team sector
  const filteredEsts = targetSector 
    ? (establishments || []).filter(e => e.sector === targetSector)
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

  // Calculate Closed and Fined from penaltyRequests
  const closedRestaurants = (penaltyRequests || []).filter(p => p.type === 'closure' && p.status === 'approved');
  const finedRestaurants = (penaltyRequests || []).filter(p => p.type === 'fine' && p.status === 'approved');

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

  const handleLogout = () => {
    setUser(null);
    navigate('/login');
  };

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
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300 print:hidden relative">
        <CriticalAlertModal />
        
        {/* Fixed Sticky Left Sidebar */}
        <aside className="w-80 shrink-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-lg border-l border-slate-200/50 dark:border-slate-800/50 p-4 flex flex-col justify-between hidden md:flex sticky top-0 h-screen">
          <div>
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
              <NotificationBell />
              <ThemeToggle />
            </div>
          </div>

          <div className="space-y-1 mb-6">
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block px-3 mb-2">
              لوحة التحكم والفرز الإقليمي
            </span>

            {/* General Overview Button */}
            {hasPerm('showMainDashboard') && (
              <button
                onClick={() => { setExecutiveTab('dashboard'); setSelectedTeamId('all'); }}
                className={`w-full text-right px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center gap-3 ${
                  executiveTab === 'dashboard' && selectedTeamId === 'all'
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-500/10'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                }`}
              >
                <TrendingUp className="w-4.5 h-4.5" />
                <span>📊 الملخص الإحصائي العام للمحافظة</span>
              </button>
            )}

            {/* Teams Roster list for sidebar */}
            {hasPerm('showReportsPage') && !isDirectorGeneral && allowedTeams.map((t) => (
              <button
                key={t.id}
                onClick={() => { setExecutiveTab('dashboard'); setSelectedTeamId(t.id); }}
                className={`w-full text-right px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center gap-3 ${
                  executiveTab === 'dashboard' && selectedTeamId === t.id
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-500/10'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                }`}
              >
                <Users className="w-4.5 h-4.5" />
                <span>👥 {t.name}</span>
              </button>
            ))}

            {/* Establishments Manager Tab */}
            <button
              onClick={() => { setExecutiveTab('establishments'); setSelectedTeamId(''); }}
              className={`w-full text-right px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center gap-3 ${
                executiveTab === 'establishments'
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-500/10'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40'
              }`}
            >
              <Building className="w-4.5 h-4.5" />
              <span>🏢 إدارة المنشآت</span>
            </button>
          </div>
        </div>

        {/* Logout at bottom - Sticky */}
        <div className="pt-4 mt-auto border-t border-slate-200/50 dark:border-slate-800/50 sticky bottom-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md pb-6 -mb-6">
          <button
            onClick={handleLogout}
            className="w-full py-2.5 rounded-xl border border-red-500/20 bg-red-500/5 text-red-600 dark:text-red-400 hover:bg-red-500/10 text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>تسجيل الخروج الآمن</span>
          </button>
        </div>
      </aside>

      {/* Main Canvas Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {/* Top bar for small screens */}
        <div className="md:hidden flex items-center justify-between p-4 mb-6 glassmorphic-card rounded-2xl">
          <AnimatedLogo variant="sidebar" className="border-none p-0" />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="md:hidden mb-6">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-2 mr-1">اللجنة أو القسم</label>
          <select
            value={executiveTab === 'establishments' ? 'establishments' : selectedTeamId}
            onChange={(e) => {
              if (e.target.value === 'establishments') {
                setExecutiveTab('establishments');
              } else {
                setExecutiveTab('dashboard');
                setSelectedTeamId(e.target.value);
              }
            }}
            className="w-full p-3 rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs font-bold outline-none text-slate-800 dark:text-slate-200"
          >
            {hasPerm('showMainDashboard') && (
              <option value="all">📊 الملخص الإحصائي العام للمحافظة</option>
            )}
            <option value="establishments">🏢 إدارة المنشآت</option>
            {hasPerm('showReportsPage') && !isDirectorGeneral && allowedTeams.map(t => (
              <option key={t.id} value={t.id}>👥 {t.name}</option>
            ))}
          </select>
        </div>

        {/* Welcome Headers */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 p-4 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/20 backdrop-blur-md text-right">
          <div className="flex items-center gap-3">
            <span className="text-xl">💼</span>
            <div>
              <h2 className="text-xs font-black text-slate-800 dark:text-white">
                {executiveTab === 'establishments' ? 'إدارة المنشآت والـ QR' : (selectedTeamId === 'all' ? 'الملخص الإحصائي العام للمحافظة' : `إحصائيات ${allowedTeams.find(t => t.id === selectedTeamId)?.name}`)}
              </h2>
              <p className="text-[10px] text-slate-400 mt-1">
                {executiveTab === 'establishments' ? 'عرض وتعديل والتحكم الكامل بالمنشآت المضافة' : 'عرض البيانات والأرقام الرقابية المحدثة في الوقت الفعلي للمنظومة'}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-xl">
              <span>📅 {new Date().toLocaleDateString('ar-IQ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              <span className="text-slate-300">|</span>
              <span>⏰ {new Date().toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className="flex items-center gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2.5 py-1 rounded-xl border border-amber-500/20">
              <span> Mosul الموصل: 38°C مشمس ☀️</span>
            </div>
            {isDirectorGeneral && (
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
        {executiveTab === 'establishments' ? (
          <EstablishmentsManager />
        ) : (
          <>
        {/* Executive Sub-tabs / Page Splitting */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 mb-6">
          {hasPerm('showMainDashboard') && (
            <button
              onClick={() => setActiveTab('strategic')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'strategic'
                  ? 'bg-teal-600 text-white font-black'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              📊 مؤشرات الامتثال والسلامة الاستراتيجية
            </button>
          )}

          {hasPerm('showReportsPage') && (
            <button
              onClick={() => setActiveTab('geographic')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'geographic'
                  ? 'bg-teal-600 text-white font-black'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              🗺️ خارطة الكثافة والتوزيع الجغرافي
            </button>
          )}

          {user?.role === 'central_director' && (
            <button
              onClick={() => setActiveTab('operations_room')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'operations_room'
                  ? 'bg-fuchsia-600 text-white font-black'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              🚨 غرفة العمليات المركزية
            </button>
          )}
        </div>

        {activeTab === 'operations_room' && <OperationsRoom />}

        {activeTab !== 'operations_room' && (
          <>
            {/* Welcome / No Permissions State */}
        {!hasPerm('showMainDashboard') && !hasPerm('manageEstablishments') && !hasPerm('showReportsPage') && !hasPerm('showDirectivesPage') && !hasPerm('showDeliveryPage') && !hasPerm('showPublicEvalsPage') && (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 shadow-inner">
              <ShieldAlert className="w-10 h-10 text-slate-400" />
            </div>
            <h2 className="text-lg font-black text-slate-800 dark:text-white">لا توجد صلاحيات مخصصة</h2>
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
              عذراً، لم يتم منحك أي صلاحيات لعرض الصفحات في هذا الحساب الإداري. جميع المؤشرات والمهام محجوبة كإجراء احترازي. يرجى مراجعة مدير النظام (Super Admin) لتفعيل الأذونات اللازمة عبر لوحة التحكم المركزية.
            </p>
          </div>
        )}

        {/* Summary Minimalist 3D Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
            <span className="text-5xl font-black text-white mt-1 block">{filteredEsts.length} <span className="text-sm text-slate-450 font-medium">منشأة مسجلة</span></span>
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
            <span className="text-5xl font-black text-emerald-400 mt-1 block">
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
            <span className="text-5xl font-black text-red-400 mt-1 block">
              {nonCompliantCount} <span className="text-sm text-red-500/70 font-medium">مخالفة</span>
            </span>
          </div>
        </div>

        {/* Dynamic Tab Switching Content */}
        {activeTab === 'strategic' && hasPerm('showMainDashboard') ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Compliance Bar Chart */}
              <div className="glassmorphic-card p-5 flex flex-col min-h-[320px]">
                <ThreeDBarChart
                  title="مؤشر امتثال السلامة الصحية للمطاعم والمنشآت"
                  data={chart3Data}
                />
              </div>

              {/* Inspection Pie Chart */}
              <div className="glassmorphic-card p-5 flex flex-col min-h-[320px]">
                <ThreeDPieChart
                  title="نسبة تقييم وإصدار رموز QR هذا الشهر"
                  data={chart1Data}
                  onRedClick={() => setShowUninspectedModal(true)}
                />
              </div>
            </div>

            {/* Penalties and Closures Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="glassmorphic-card p-5 border-t-4 border-red-500 min-h-[160px] flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-black text-slate-800 dark:text-white flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-red-500" /> المطاعم والمنشآت المغلقة 
                    </h3>
                    <span className="px-3 py-1 bg-red-500/10 text-red-600 dark:text-red-400 rounded-full text-xs font-bold">{closedRestaurants.length}</span>
                  </div>
                  {closedRestaurants.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-4 font-bold">لا توجد منشآت مغلقة حالياً.</p>
                  ) : (
                    <ul className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                      {closedRestaurants.map(r => (
                        <li key={r.id} className="text-xs font-bold bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                          <span className="text-slate-800 dark:text-slate-200">{r.estName} <span className="text-[10px] text-slate-400 mr-1">({r.sector})</span></span>
                          <span className="text-[10px] text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-md">{new Date(r.date).toLocaleDateString('ar-IQ')}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="glassmorphic-card p-5 border-t-4 border-orange-500 min-h-[160px] flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-black text-slate-800 dark:text-white flex items-center gap-2">
                      <FileText className="w-5 h-5 text-orange-500" /> الغرامات المالية المفروضة
                    </h3>
                    <span className="px-3 py-1 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-full text-xs font-bold">{finedRestaurants.length}</span>
                  </div>
                  {finedRestaurants.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-4 font-bold">لا توجد غرامات مسجلة حالياً.</p>
                  ) : (
                    <ul className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                      {finedRestaurants.map(r => (
                        <li key={r.id} className="text-xs font-bold bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                          <span className="text-slate-800 dark:text-slate-200">{r.estName} <span className="text-[10px] text-slate-400 mr-1">({r.sector})</span></span>
                          <span className="text-[10px] text-orange-500 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded-md">{new Date(r.date).toLocaleDateString('ar-IQ')}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            {/* Extra Executive Dashboard Widgets for Director General */}
            {isDirectorGeneral && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Worst Sectors List */}
                <div className="glassmorphic-card p-5 text-right">
                  <h3 className="text-sm font-black text-slate-800 dark:text-white mb-4 border-b border-slate-200 dark:border-slate-800 pb-2 flex items-center justify-end gap-2">
                    القطاعات الأكثر تسجيلًا للمخالفات <AlertTriangle className="w-4 h-4 text-red-500" />
                  </h3>
                  <div className="space-y-3">
                    {worstSectors.length > 0 ? worstSectors.map((s, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-red-50 dark:bg-red-950/20 p-3 rounded-xl border border-red-100 dark:border-red-900/30">
                        <span className="font-bold text-red-600 dark:text-red-400 text-xs">مخالفات: {s.nonCompliant}</span>
                        <span className="font-black text-slate-800 dark:text-slate-200 text-sm">{s.name}</span>
                      </div>
                    )) : (
                      <p className="text-slate-500 text-xs font-bold text-center p-4">لا توجد منشآت مخالفة حالياً</p>
                    )}
                  </div>
                </div>

                {/* Public Complaints KPI */}
                <div 
                  onClick={() => setShowComplaintsModal(true)}
                  className="glassmorphic-card p-5 text-right bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-900/20 border-indigo-100 dark:border-indigo-900/30 flex flex-col justify-center items-center relative overflow-hidden cursor-pointer hover:scale-[1.02] transition-all"
                >
                  <div className="absolute top-2 left-2 opacity-5">
                    <Users className="w-40 h-40 text-indigo-500" />
                  </div>
                  <div className="absolute top-4 right-4 animate-bounce">
                    <span className="flex h-3 w-3 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                  </div>
                  <h3 className="text-sm font-black text-indigo-800 dark:text-indigo-300 mb-2 z-10 text-center">مؤشر شكاوى وبلاغات المواطنين</h3>
                  <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold mb-4 z-10 text-center">انقر هنا لعرض كافة الشكاوى الواردة من المواطنين بشكل سري</p>
                  <span className="text-6xl font-black text-indigo-600 dark:text-indigo-400 z-10 block text-center">
                    {publicComplaintsCount}
                  </span>
                </div>
              </div>
            )}


            {/* Direct Command Directive Form */}
            {(!isDirectorGeneral && user?.permissions?.sendDirectives) && (
              <div className="glassmorphic-card p-5 border border-amber-500/20 bg-amber-500/5 dark:bg-amber-950/10 text-right rounded-3xl">
                <div className="flex items-center gap-2 border-b border-amber-500/10 pb-3 mb-4">
                  <ShieldAlert className="w-5 h-5 text-amber-500" />
                  <div>
                    <h3 className="text-xs font-black text-slate-800 dark:text-white">📢 بوابة الأوامر والتعميمات الإدارية (مدير الصحة العامة)</h3>
                    <p className="text-[10px] text-slate-500 mt-0.5">توجيه اللجان الميدانية أو شعب الرقابة بمختلف القطاعات</p>
                  </div>
                </div>

                <form onSubmit={handleSendDirective} className="space-y-4 text-xs font-bold">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-slate-600 dark:text-slate-400">الجهة الإدارية المعنية بالأمر</label>
                      <select
                        value={targetRecipient}
                        onChange={(e) => setTargetRecipient(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200 outline-none focus:border-amber-500 font-bold"
                      >
                        <option value="all">📢 كافة شعب ولجان التفتيش بالمحافظة</option>
                        <option value="public_health">🏢 مدير قسم الصحة العامة</option>
                        <option value="left_bank">🗺️ شعبة الرقابة الصحية - الجانب الأيسر</option>
                        <option value="right_bank">🗺️ شعبة الرقابة الصحية - الجانب الأيمن</option>
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
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-600 dark:text-slate-400">نص التوجيه / الأمر الرقابي والتعليمات الوزارية</label>
                    <textarea
                      rows="3"
                      required
                      placeholder="اكتب التوجيه هنا (مثال: يرجى إطلاق حملة تفتيشية مكثفة على المطاعم والعيادات في منطقة تلعفر للتأكد من رخص العمل الرسمية...)"
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
          </div>
        ) : activeTab === 'geographic' && hasPerm('showReportsPage') ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Interactive map */}
              <div className="glassmorphic-card p-5 flex flex-col lg:col-span-2 min-h-[320px]">
                <h3 className="text-xs font-black text-slate-800 dark:text-white mb-3 text-right">🗺️ الخارطة التفاعلية لتوزيع القطاعات لعموم نينوى</h3>
                <div className="flex-1 min-h-[260px] bg-slate-100/50 dark:bg-slate-950/40 rounded-2xl border border-slate-200/25">
                  <NinevehMap
                    establishments={establishments}
                    selectedSector={targetSector}
                    onSectorSelect={handleMapSectorSelect}
                  />
                </div>
              </div>

              {/* Geographic density pie chart */}
              <div className="glassmorphic-card p-5 flex flex-col min-h-[320px]">
                <ThreeDPieChart
                  title="خارطة الكثافة وتوزيع المحلات والمنشآت"
                  data={chart2Data.length > 0 ? chart2Data : [{ label: 'لا توجد محلات', value: 0, color: '#94A3B8' }]}
                />
              </div>
            </div>

            {/* Non-Compliant by Sector Bar Chart */}
            <div className="glassmorphic-card p-5 flex flex-col min-h-[320px] mt-6">
              <ThreeDBarChart
                title="تحليل جودة القطاعات: المنشآت المخالفة حسب الرقعة الجغرافية"
                data={chart4Data.length > 0 ? chart4Data : [{ label: 'لا توجد مخالفات', value: 0, color: '#94A3B8' }]}
              />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm transition-all">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700/60 p-6 rounded-3xl text-white shadow-2xl relative text-right">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-800 mb-4">
              <h3 className="text-sm font-black text-teal-400">📊 تفاصيل وإحصائيات المنشآت حسب التصنيف</h3>
              <button 
                onClick={() => setShowCategoryBreakdownModal(false)}
                className="p-1 rounded bg-slate-800 text-slate-450 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {Object.keys(categoryCounts).map((cat) => (
                <div key={cat} className="flex justify-between items-center p-2.5 rounded-xl bg-slate-800 border border-slate-800/80">
                  <span className="font-extrabold text-slate-200">{cat}</span>
                  <span className="px-3 py-1 rounded-lg bg-teal-500/10 text-teal-400 font-black text-xs border border-teal-500/20">
                    {categoryCounts[cat]} منشأة
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowCategoryBreakdownModal(false)}
              className="mt-6 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-white font-extrabold text-xs transition-all cursor-pointer"
            >
              إغلاق النافذة
            </button>
          </div>
        </div>
      )}

      {/* Uninspected Locations Modal */}
      {showUninspectedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md transition-all">
          <div className="w-full max-w-md bg-white/70 dark:bg-slate-900/60 backdrop-blur-2xl p-6 border border-red-500/20 dark:border-red-500/20 shadow-2xl shadow-red-500/10 rounded-3xl relative overflow-hidden">
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

      {/* Complaints List Modal */}
      {showComplaintsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm transition-all">
          <div className="w-full max-w-3xl bg-slate-900 border border-slate-700/60 p-6 rounded-3xl text-white shadow-2xl relative text-right">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-800 mb-4">
              <h3 className="text-sm font-black text-red-400 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5" />
                سجل شكاوى المواطنين السرية
              </h3>
              <button 
                onClick={() => setShowComplaintsModal(false)}
                className="p-1 rounded bg-slate-800 text-slate-450 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              {(reports || []).filter(r => !r.isDelivery).length > 0 ? (
                (reports || []).filter(r => !r.isDelivery).map((comp, idx) => (
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
