import React, { useState, useContext, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { AppContext } from '../context/AppContext';
import { AnimatedLogo } from '../components/AnimatedLogo';
import { ThemeToggle } from '../components/ThemeToggle';
import { WeatherWidget } from '../components/WeatherWidget';
import { usePersistentTab } from '../hooks/usePersistentTab';
import { NotificationBell } from '../components/NotificationBell';
import { Plus, Search, FileText, LayoutDashboard, Database, AlertCircle, X, Check, Eye, Package, Trash, Printer, Menu, ShieldAlert, CheckSquare, MapPin, Edit, FilePlus, DollarSign, QrCode, Ban, ChevronDown, Map, Siren, Activity, MessageCircle, Send } from 'lucide-react';
import { NinevehMap } from '../components/NinevehMap';
import { EstablishmentModal } from '../components/EstablishmentModal';
import { QRScannerModal } from '../components/QRScannerModal';

export const TeamDashboard = () => {
  const { navigate, establishments, addEstablishment, updateEstablishment, deleteEstablishment, reports, user, setUser, teams, directives, markDirectiveRead, logAudit, notify, config, penaltyRequests, setPenaltyRequests, dispatches, setDispatches, addSystemNotification, uiPreferences, setUiPreferences, triggerSOSAlert } = useContext(AppContext);
  const [showDisplayPrefsModal, setShowDisplayPrefsModal] = useState(false);
  const [draftUiPreferences, setDraftUiPreferences] = useState(null);
  
  // Live Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { id: 1, sender: 'admin', text: 'مرحباً، غرفة العمليات المركزية في خدمتكم. هل تحتاجون لأي دعم؟', time: '08:00 ص' }
  ]);

  const openDisplayPrefsModal = () => {
    setDraftUiPreferences(uiPreferences || { headingSize: '18px', bodySize: '12px', density: 'comfortable' });
    setShowDisplayPrefsModal(true);
  };
  
  // User permissions logic (Default Deny)
  const hasPerm = (permName) => {
    if (user?.role === 'admin') return true;
    return user?.permissions?.[permName] === true;
  };

  // Determine initial tab based on permissions
  const getInitialTab = () => {
    if (hasPerm('showMainDashboard')) return 'summary';
    if (hasPerm('manageEstablishments')) return 'directory';
    if (hasPerm('showReportsPage')) return 'reports';
    if (hasPerm('showDirectivesPage')) return 'directives';
    if (hasPerm('showDeliveryPage')) return 'delivery';
    if (hasPerm('showPublicEvalsPage')) return 'public_evals';
    return null;
  };

  // Active Tab: 'summary', 'directory', 'reports', etc.
  const [activeTab, setActiveTab] = usePersistentTab('teamActiveTab', getInitialTab() || 'summary');

  // Watch for permission changes to set initial tab if it was null
  React.useEffect(() => {
    if (activeTab === 'summary' && !hasPerm('showMainDashboard')) {
      const newTab = getInitialTab();
      if (newTab) setActiveTab(newTab);
    }
  }, [user?.permissions]);
  
  // Mobile Sidebar Toggle
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterExpiredOnly, setFilterExpiredOnly] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'closed', 'fined'
  
  // Modal toggles
  const [establishmentModalState, setEstablishmentModalState] = useState({ isOpen: false, mode: 'add', data: null });
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showMetricModal, setShowMetricModal] = useState(false);
  const [metricModalType, setMetricModalType] = useState('all');
  
  // Selected establishment for inline edits
  const [selectedEstDetails, setSelectedEstDetails] = useState(null);

  // Justification Modal for edits
  const [showJustificationModal, setShowJustificationModal] = useState(false);
  const [editJustification, setEditJustification] = useState('');
  const [pendingEditData, setPendingEditData] = useState(null);
  const [selectedViolationImg, setSelectedViolationImg] = useState(null);

  // Get the most up-to-date user from the teams array, falling back to local user object
  const activeTeam = (teams || []).find(t => t.id === user?.id) || user;
  // User's assigned sector (default to 'الجانب الأيمن' if user isn't logged in correctly)
  const userSector = activeTeam?.sector || (activeTeam?.name?.includes('الأيسر') ? 'الجانب الأيسر' : 'الجانب الأيمن');

  // Filter establishments based on team's sector
  const teamEstablishments = (establishments || []).filter(e => e.sector.includes(userSector));

  // Dynamic list of establishments matching selected metric category modal
  const modalEstList = teamEstablishments.filter(e => {
    if (metricModalType === 'inspected') return e.lastInspection !== 'لم يزر بعد';
    if (metricModalType === 'uninspected') return e.lastInspection === 'لم يزر بعد';
    return true;
  });

  const isLicenseExpired = (est) => {
    if (!est || !est.licenseNumber) return false;
    return est.licenseNumber.includes('Z') || est.licenseNumber.includes('F') || est.licenseNumber.includes('W') || est.licenseNumber.includes('3');
  };

  // Filter based on search term and expired license filter
  const dailyTaskLimit = config?.dailyTaskLimit || 10;
  
  // Smart Tasks list (oldest visits first, up to dailyTaskLimit)
  const smartTasks = [...teamEstablishments].sort((a, b) => {
    if (a.lastInspection === 'لم يزر بعد') return -1;
    if (b.lastInspection === 'لم يزر بعد') return 1;
    return new Date(a.lastInspection) - new Date(b.lastInspection);
  }).slice(0, dailyTaskLimit);

  const filteredEstablishments = teamEstablishments.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          e.owner.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesExpired = filterExpiredOnly ? isLicenseExpired(e) : true;
    
    let matchesStatus = true;
    if (statusFilter === 'closed') {
      matchesStatus = e.status === 'closed';
    } else if (statusFilter === 'fined') {
      matchesStatus = (penaltyRequests || []).some(req => req.estId === e.id && req.type === 'fine' && req.status === 'approved');
    }

    return matchesSearch && matchesExpired && matchesStatus;
  });

  // Filter reports submitted to team's sector
  const teamReports = (reports || []).filter(r => r.sector && r.sector.includes(userSector));

  // Filter directives directed to this team's sector or teamId
  const myDirectives = (directives || []).filter(d => {
    if (user?.id && d.teamId === user.id) return true;
    const targetTeam = teams.find(t => t.id === d.teamId);
    return targetTeam?.sector && targetTeam.sector.includes(userSector);
  });

  const handleSaveEstablishment = (data) => {
    if (establishmentModalState.mode === 'add') {
      addEstablishment({
        id: `est_new_${Date.now()}`,
        ...data,
        lastInspection: 'لم يزر بعد',
        history: [],
        score: 0,
        sector: userSector
      });
      logAudit('إضافة منشأة جديدة', `est_new_${Date.now()}`, null, data, 'إضافة منشأة للشبكة', user);
      notify('تم إضافة المنشأة بنجاح!', 'success', true);
    } else {
      updateEstablishment(data.id, data);
      logAudit('تحديث بيانات منشأة', data.id, establishmentModalState.data, data, 'تعديل البيانات الأساسية', user);
      notify('تم تحديث بيانات المنشأة بنجاح!', 'success', true);
    }
    setEstablishmentModalState({ isOpen: false, mode: 'add', data: null });
  };

  const handleLogout = () => {
    setUser(null);
    navigate('/login');
  };

  // Tab A helper calculations
  const totalShops = teamEstablishments.length;
  const inspectedShops = teamEstablishments.filter(e => e.lastInspection !== 'لم يزر بعد').length;
  const uninspectedShops = totalShops - inspectedShops;

  const visitedStreets = teamEstablishments.filter(e => e.lastInspection !== 'لم يزر بعد').map(e => e.name);
  const pendingStreets = teamEstablishments.filter(e => e.lastInspection === 'لم يزر بعد').map(e => e.name);

  // Urgent Dispatch logic
  const myPendingDispatch = dispatches?.find(d => d.teamId === user?.id && d.status === 'pending');

  // Directives Popup Logic
  const [unreadDirective, setUnreadDirective] = useState(null);

  const handleQRScanSuccess = (decodedText) => {
    setShowQRScanner(false);
    const est = establishments.find(e => e.accessCode === decodedText);
    if (est) {
      if (!est.sector.includes(userSector) && user?.role !== 'admin') {
        notify('عفواً، هذه المنشأة لا تتبع لقاطع مسؤوليتك.', 'error');
        return;
      }
      notify(`تم العثور على: ${est.name}`, 'success');
      setSelectedEstDetails(est);
    } else {
      notify('الكود غير صالح أو المنشأة غير مسجلة في النظام.', 'error');
    }
  };

  React.useEffect(() => {
    // Find the first unread directive
    const unread = myDirectives.find(d => !d.isRead);
    if (unread && (!unreadDirective || unreadDirective.id !== unread.id)) {
      setUnreadDirective(unread);
      // Optional: play an alert sound
      notify('وردك أمر إداري جديد، يرجى الاطلاع فوراً!', 'error', true);
    }
  }, [myDirectives, unreadDirective]);

  // Monthly Stats Calculations
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyClosures = (penaltyRequests || []).filter(req => 
    req.type === 'closure' && req.status === 'approved' && req.sector === userSector && 
    new Date(req.date).getMonth() === currentMonth && new Date(req.date).getFullYear() === currentYear
  );

  const monthlyFines = (penaltyRequests || []).filter(req => 
    req.type === 'fine' && req.status === 'approved' && req.sector === userSector && 
    new Date(req.date).getMonth() === currentMonth && new Date(req.date).getFullYear() === currentYear
  );

  const [showMonthlyStatsModal, setShowMonthlyStatsModal] = useState(false);
  const [monthlyStatsModalType, setMonthlyStatsModalType] = useState('closures'); // 'closures' or 'fines'

  return (
    <div 
      className={`min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300 ${uiPreferences?.density === 'compact' ? 'ui-compact' : 'ui-comfortable'}`}
      style={{
        '--ui-heading-size': uiPreferences?.headingSize || '18px',
        '--ui-body-size': uiPreferences?.bodySize || '12px',
      }}
    >
      
      {/* Urgent Dispatch Modal */}
      {myPendingDispatch && (
        <div className="fixed inset-0 bg-red-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-lg w-full text-center border-4 border-red-500 shadow-2xl shadow-red-500/20 animate-pulse-slow">
            <div className="w-20 h-20 bg-red-500 rounded-full mx-auto flex items-center justify-center mb-6 animate-bounce">
              <AlertCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">أمر تفتيش عاجل وفوري!</h2>
            <p className="text-slate-600 dark:text-slate-300 mb-6 font-bold leading-relaxed">
              ورد أمر الآن من غرفة العمليات المركزية للتوجه فوراً وإجراء كشف صحي على مطعم/منشأة:
              <br/>
              <span className="text-xl text-red-600 dark:text-red-400 font-black inline-block mt-2">{myPendingDispatch.estName}</span>
            </p>
            <button 
              onClick={() => {
                setDispatches(prev => prev.map(d => d.id === myPendingDispatch.id ? { ...d, status: 'accepted' } : d));
                notify('تم استلام الأمر، يرجى التوجه للموقع', 'success', true);
              }}
              className="w-full py-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-lg transition-all"
            >
              استلام الأمر والتحرك
            </button>
          </div>
        </div>
      )}

      {/* Unread Directive Alert Modal */}
      {unreadDirective && (
        <div className="fixed inset-0 bg-amber-900/80 backdrop-blur-md z-[90] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-lg w-full text-center border-4 border-amber-500 shadow-2xl shadow-amber-500/20 animate-pulse-slow">
            <div className="w-20 h-20 bg-amber-500 rounded-full mx-auto flex items-center justify-center mb-6 animate-bounce">
              <ShieldAlert className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">أمر إداري / توجيه عاجل 📢</h2>
            <p className="text-xs text-slate-500 font-bold mb-4">مرسل من: {unreadDirective.sender}</p>
            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl mb-6 border border-slate-200 dark:border-slate-700">
              <p className="text-slate-800 dark:text-slate-200 font-bold text-sm leading-relaxed text-right">
                {unreadDirective.text}
              </p>
            </div>
            <button 
              onClick={() => {
                markDirectiveRead(unreadDirective.id);
                setUnreadDirective(null);
                notify('تم تأكيد استلام التوجيه وسيتم التنفيذ', 'success', true);
              }}
              className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-lg transition-all flex items-center justify-center gap-2"
            >
              <CheckSquare className="w-5 h-5" />
              أخذت علماً وسأقوم بالتنفيذ
            </button>
          </div>
        </div>
      )}

      {/* Monthly Stats Modal */}
      {showMonthlyStatsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6 rounded-3xl text-slate-800 dark:text-white shadow-2xl relative max-h-[80vh] overflow-y-auto text-right">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="text-lg font-black text-teal-600 dark:text-teal-400">
                {monthlyStatsModalType === 'closures' ? '🔒 المطاعم المغلقة هذا الشهر' : '💰 المطاعم المُغرمة هذا الشهر'}
              </h3>
              <button onClick={() => setShowMonthlyStatsModal(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-3">
              {(monthlyStatsModalType === 'closures' ? monthlyClosures : monthlyFines).length === 0 ? (
                <p className="text-center text-sm text-slate-500 py-8">لا توجد بيانات لهذا الشهر.</p>
              ) : (
                (monthlyStatsModalType === 'closures' ? monthlyClosures : monthlyFines).map(req => {
                  // Find the neighborhood from establishments using estId
                  const estData = establishments.find(e => e.id === req.estId);
                  const neighborhood = estData ? estData.neighborhood : 'غير محدد';
                  
                  return (
                    <div key={req.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 flex justify-between items-center">
                      <div>
                        <h4 className="font-black text-sm">{req.estName}</h4>
                        <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3"/> {neighborhood}
                        </p>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400">
                        {new Date(req.date).toLocaleDateString('ar-IQ')}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Fixed Sticky Sidebar */}
      <aside className={`w-80 shrink-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl md:bg-white/60 md:dark:bg-slate-900/60 border-l border-slate-200/50 dark:border-slate-800/50 p-4 flex flex-col justify-between fixed md:sticky top-0 h-screen z-50 transition-transform duration-300 ${
        isSidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
      } right-0`}>
        <div>
          <AnimatedLogo variant="sidebar" className="mb-6" />

          <div className="space-y-1 mb-6">
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block px-3 mb-2">
              لوحة تحكم اللجنة الرقابية
            </span>
            {hasPerm('showMainDashboard') && (
              <button
                onClick={() => { setActiveTab('summary'); setIsSidebarOpen(false); }}
                className={`w-full text-right px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center gap-3 ${
                  activeTab === 'summary'
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-500/10'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                }`}
              >
                <LayoutDashboard className="w-4.5 h-4.5" />
                <span>📊 لوحة التقارير والإحصائيات</span>
              </button>
            )}

            {hasPerm('manageEstablishments') && (
              <button
                onClick={() => { setActiveTab('directory'); setIsSidebarOpen(false); }}
                className={`w-full text-right px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center gap-3 ${
                  activeTab === 'directory'
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-500/10'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                }`}
              >
                <Database className="w-4.5 h-4.5" />
                <span>🍽️ إدارة المنشآت</span>
              </button>
            )}

            {hasPerm('showSectorMap') && (
              <button
                onClick={() => { setActiveTab('map'); setIsSidebarOpen(false); }}
                className={`w-full text-right px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center gap-3 ${
                  activeTab === 'map'
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-500/10'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                }`}
              >
                <Map className="w-4.5 h-4.5" />
                <span>🗺️ خريطة القطاع</span>
              </button>
            )}

            {hasPerm('showSmartTasks') && (
              <button
                onClick={() => { setActiveTab('smart_tasks'); setIsSidebarOpen(false); }}
                className={`w-full text-right px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center gap-3 ${
                  activeTab === 'smart_tasks'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                }`}
              >
                <CheckSquare className="w-4.5 h-4.5" />
                <span>📅 مهام اليوم</span>
              </button>
            )}

            {hasPerm('showReportsPage') && (
              <button
                onClick={() => { setActiveTab('reports'); setIsSidebarOpen(false); }}
                className={`w-full text-right px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center justify-between ${
                  activeTab === 'reports'
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-500/10'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-4.5 h-4.5" />
                  <span>📑 صندوق البلاغات والتقارير</span>
                </div>
                {(teamReports.length > 0 || myDirectives.length > 0) && (
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
                    activeTab === 'reports' ? 'bg-white text-teal-700' : 'bg-red-500 text-white'
                  }`}>
                    {teamReports.length + myDirectives.length}
                  </span>
                )}
              </button>
            )}

          </div>
        </div>

        {/* User context footer */}
        <div className="pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
          <div className="flex flex-col gap-2 mb-4">
             {hasPerm('canSendSOS') && (
               <button 
                  onClick={() => {
                    if (triggerSOSAlert) {
                      triggerSOSAlert(user, 'الموقع الحالي للفريق غير مسجل بعد');
                    }
                    notify('تم إرسال نداء استغاثة (SOS) وموقعك الحالي لغرفة العمليات المركزية!', 'error', true);
                  }}
                  className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow-lg shadow-red-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
               >
                <Siren className="w-4 h-4 animate-pulse" />
                <span>إرسال استغاثة (SOS)</span>
               </button>
             )}
          </div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col text-right">
              <span className="text-xs font-black text-slate-700 dark:text-slate-300">{user?.name || 'مفتش الرقابة الميداني'}</span>
              <span className="text-[10px] text-teal-600 dark:text-teal-600 dark:text-teal-400 font-bold">قطاع: {userSector}</span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={openDisplayPrefsModal}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all cursor-pointer shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center group relative"
                title="تخصيص العرض والمظهر"
              >
                <Eye className="w-4 h-4 group-hover:text-teal-500 transition-colors" />
                <span className="absolute -top-10 scale-0 group-hover:scale-100 transition-transform bg-slate-800 text-white text-[10px] py-1 px-2 rounded-lg whitespace-nowrap">تخصيص العرض</span>
              </button>
              <ThemeToggle />
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full py-2.5 rounded-xl border border-red-500/20 bg-red-500/5 text-red-600 dark:text-red-400 hover:bg-red-500/10 text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
          >
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main Panel Canvas */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        
        {/* Welcome Headers with Date/Time and Mosul Weather */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 p-4 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/20 backdrop-blur-md text-right">
          <div className="flex items-center gap-3">
            <span className="text-xl">👥</span>
            <div>
              <h2 className="text-xs font-black text-slate-800 dark:text-white">أهلاً بك سيدي رئيس اللجنة الرقابية 👋</h2>
              <p className="text-[10px] text-slate-500">طاب يومك، تتصفح الآن لوحة تحكم قطاع: {userSector}</p>
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
          </div>
        </div>

        {/* Welcome / No Permissions State */}
        {!hasPerm('showMainDashboard') && !hasPerm('manageEstablishments') && !hasPerm('showReportsPage') && !hasPerm('showDirectivesPage') && !hasPerm('showDeliveryPage') && !hasPerm('showPublicEvalsPage') && (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 shadow-inner">
              <ShieldAlert className="w-10 h-10 text-slate-400" />
            </div>
            <h2 className="text-lg font-black text-slate-800 dark:text-white">لا توجد صلاحيات مخصصة</h2>
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
              عذراً، لم يتم منحك أي صلاحيات لعرض الصفحات في هذا الحساب حتى الآن. جميع القوائم والمهام محجوبة. يرجى مراجعة مدير النظام (Super Admin) لتفعيل الأذونات اللازمة عبر لوحة التحكم.
            </p>
          </div>
        )}
        
        {/* Mobile Navbar Header */}
        <div className="md:hidden flex items-center justify-between p-4 mb-6 glassmorphic-card rounded-2xl sticky top-4 z-30">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl"
          >
            <Menu className="w-5 h-5" />
          </button>
          <AnimatedLogo variant="sidebar" className="border-none p-0 scale-75 transform origin-center" />
            <div className="flex items-center gap-2">
              <button 
                onClick={openDisplayPrefsModal}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all cursor-pointer shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center group"
                title="تخصيص العرض والمظهر"
              >
                <Eye className="w-4 h-4 group-hover:text-teal-500 transition-colors" />
              </button>
              <NotificationBell />
              <ThemeToggle />
          </div>
        </div>

        {/* Tab A: Summary Dashboard */}
        {activeTab === 'summary' && hasPerm('showMainDashboard') && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white">ملخص المهام والمناطق الغذائية للجنة</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">تتبع التغطية الرقابية والجولات الاستقصائية لقطاع {userSector}</p>
              </div>
              <button 
                onClick={() => setShowQRScanner(true)}
                className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl shadow-lg shadow-teal-500/20 flex items-center gap-2 font-black transition-all active:scale-95 w-full md:w-auto justify-center"
              >
                <QrCode className="w-5 h-5" />
                <span>مسح كود QR لمنشأة 📸</span>
              </button>
            </div>

            {myDirectives.length > 0 && (
              <div className="space-y-3 cursor-pointer" onClick={() => setActiveTab('reports')}>
                {myDirectives.map((dir) => (
                  <div key={dir.id} className="p-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 dark:bg-amber-500/20 text-right relative overflow-hidden hover:scale-[1.01] transition-all">
                    <div className="absolute top-0 right-0 h-full w-1.5 bg-amber-500"></div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] bg-amber-500 text-white px-2 py-0.5 rounded-lg font-black">
                        📢 بلاغ وتوجيه رسمي من {dir.sender} (انقر للانتقال لصندوق البلاغات 📬)
                      </span>
                      <span className="text-[9px] text-amber-600 dark:text-amber-400 font-bold">{dir.date}</span>
                    </div>
                    <p className="text-xs font-black text-amber-900 dark:text-amber-200 mt-1.5 leading-relaxed">
                      {dir.text}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div 
                onClick={() => { setMetricModalType('all'); setShowMetricModal(true); }}
                className="glassmorphic-card p-5 border border-teal-500/10 hover:-translate-y-2 hover:shadow-2xl hover:shadow-teal-500/5 transition-all duration-300 cursor-pointer select-none"
              >
                <span className="text-xs font-black text-slate-500 dark:text-slate-400">إجمالي المنشآت المخصصة للجنة</span>
                <p className="text-4xl font-extrabold text-teal-600 dark:text-teal-600 dark:text-teal-400 mt-3">{totalShops}</p>
                <span className="text-[10px] text-teal-500 font-bold block mt-2">انقر للتفاصيل 👁️</span>
              </div>
              <div 
                onClick={() => { setMetricModalType('inspected'); setShowMetricModal(true); }}
                className="glassmorphic-card p-5 border border-emerald-500/10 hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/5 transition-all duration-300 cursor-pointer select-none"
              >
                <span className="text-xs font-black text-slate-500 dark:text-slate-400">منشآت تم زيارتها بنجاح هذا الشهر 🟢</span>
                <p className="text-4xl font-extrabold text-emerald-500 mt-3">{inspectedShops}</p>
                <span className="text-[10px] text-emerald-500 font-bold block mt-2">انقر للتفاصيل 👁️</span>
              </div>
              <div 
                onClick={() => { setMetricModalType('uninspected'); setShowMetricModal(true); }}
                className="glassmorphic-card p-5 border border-red-500/10 hover:-translate-y-2 hover:shadow-2xl hover:shadow-red-500/5 transition-all duration-300 cursor-pointer select-none"
              >
                <span className="text-xs font-black text-slate-500 dark:text-slate-400">منشآت متأخرة بانتظار الزيارة الفورية 🔴</span>
                <p className="text-4xl font-extrabold text-red-500 mt-3">{uninspectedShops}</p>
                <span className="text-[10px] text-red-500 font-bold block mt-2">انقر للتفاصيل 👁️</span>
              </div>
            </div>

            {/* Team Analytics Chart */}
            <div className="glassmorphic-card p-6 mt-6">
              <h3 className="text-sm font-black text-slate-800 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
                <Activity className="w-5 h-5 text-teal-600" /> إحصائيات الإنجاز الرقابي (هذا الأسبوع)
              </h3>
              <div className="h-64 w-full" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: 'السبت', زيارات: 12, غرامات: 2 },
                    { name: 'الأحد', زيارات: 19, غرامات: 5 },
                    { name: 'الإثنين', زيارات: 15, غرامات: 1 },
                    { name: 'الثلاثاء', زيارات: 22, غرامات: 3 },
                    { name: 'الأربعاء', زيارات: 18, غرامات: 2 },
                    { name: 'الخميس', زيارات: 25, غرامات: 4 },
                    { name: 'الجمعة', زيارات: 5, غرامات: 0 },
                  ]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', textAlign: 'right', direction: 'rtl' }}
                      itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                    />
                    <Bar dataKey="زيارات" fill="#0d9488" radius={[4, 4, 0, 0]} barSize={12} />
                    <Bar dataKey="غرامات" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={12} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 mt-4 border-t border-slate-100 dark:border-slate-800 pt-4">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                  <span className="w-3 h-3 rounded-full bg-teal-600"></span> الجولات التفتيشية
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                  <span className="w-3 h-3 rounded-full bg-amber-500"></span> الغرامات الفورية
                </div>
              </div>
            </div>


          </div>
        )}

        {/* Tab E: Map View */}
        {activeTab === 'map' && hasPerm('showSectorMap') && (
          <div className="h-full glassmorphic-card p-6 animate-fade-in-up flex flex-col min-h-[500px]">
            <h2 className="text-xl font-black text-slate-800 dark:text-white mb-6 flex items-center gap-3">
              <Map className="text-teal-600" />
              خريطة قطاع ({userSector})
            </h2>
            <div className="flex-1 w-full overflow-hidden shadow-inner border border-slate-200 dark:border-slate-800 bg-white" style={{ borderRadius: '0' }}>
              <NinevehMap 
                establishments={establishments} 
                isTeamView={true} 
                teamSector={userSector} 
                fullHeight={true}
              />
            </div>
          </div>
        )}

        {/* Tab B: Smart Tasks (Today's Tasks) */}
        {activeTab === 'smart_tasks' && hasPerm('showSmartTasks') && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-blue-50 dark:bg-blue-900/10 p-6 rounded-3xl border border-blue-100 dark:border-blue-900/30">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                  <CheckSquare className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-800 dark:text-white">مهام اليوم المقترحة</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    أمامك <span className="font-bold text-blue-600">{smartTasks.length}</span> منشآت تحتاج للزيارة القصوى اليوم.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowQRScanner(true)}
                className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl shadow-lg shadow-teal-500/20 flex items-center gap-2 font-black transition-all active:scale-95 w-full md:w-auto justify-center"
              >
                <QrCode className="w-5 h-5" />
                <span>بدء التفتيش بمسح QR 📸</span>
              </button>
            </div>

            {smartTasks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {smartTasks.map(est => (
                  <div key={`smart-${est.id}`} className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between group">
                    <div>
                      <h4 className="font-black text-slate-800 dark:text-white text-base mb-2 group-hover:text-blue-600 transition-colors">{est.name}</h4>
                      <div className="space-y-2 mb-4">
                        <div className="text-xs text-slate-500 flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{est.address || 'العنوان غير محدد'}</span>
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-2">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                          <span>تاريخ آخر زيارة: <strong className="text-slate-700 dark:text-slate-300 bg-amber-50 dark:bg-amber-900/20 px-1.5 py-0.5 rounded">{est.lastInspection}</strong></span>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => navigate(`/inspection/new?id=${est.id}`)}
                      className="w-full py-2.5 rounded-xl bg-blue-50 hover:bg-blue-600 dark:bg-blue-900/20 dark:hover:bg-blue-600 text-blue-600 hover:text-white font-bold flex items-center justify-center gap-2 transition-all"
                    >
                      <FilePlus className="w-4 h-4" />
                      <span>بدء التقييم اليدوي</span>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700">
                <Check className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                <h3 className="text-lg font-black text-slate-800 dark:text-white">لا توجد مهام مقترحة حالياً</h3>
                <p className="text-xs text-slate-500 mt-2">جميع المنشآت مغطاة رقابياً ضمن الحدود المسموحة.</p>
              </div>
            )}
          </div>
        )}

        {/* Tab C: Establishments Directory */}
        {activeTab === 'directory' && hasPerm('manageEstablishments') && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white">إدارة منشآت قطاع {userSector}</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">إضافة، تعديل، وتقييم منشآت الخدمات الغذائية والمقاهي بالمنطقة</p>
              </div>

              {hasPerm('createEst') && (
                <button
                  onClick={() => setEstablishmentModalState({ isOpen: true, mode: 'add', data: null })}
                  className="px-4 py-2.5 rounded-2xl bg-teal-600 text-white text-xs font-black shadow-md hover:bg-teal-700 hover:shadow-teal-500/20 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer no-print w-full sm:w-auto"
                >
                  <Plus className="w-4.5 h-4.5" />
                  <span>إضافة منشأة للشبكة الرقابية</span>
                </button>
              )}
            </div>

            {/* Filter Search Box and License Expiry Filter Button */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center max-w-2xl">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="ابحث باسم المطعم أو اسم المالك..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs font-bold outline-none text-slate-800 dark:text-slate-200 focus:border-teal-500"
                />
                <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
              </div>

              <button
                type="button"
                onClick={() => setFilterExpiredOnly(!filterExpiredOnly)}
                className={`px-4 py-3 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 ${
                  filterExpiredOnly 
                    ? 'bg-red-500 text-white shadow-md shadow-red-500/10' 
                    : 'bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <span>⚠️ الإجازات المنتهية</span>
                {filterExpiredOnly && <span className="w-2 h-2 rounded-full bg-white animate-pulse" />}
              </button>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs font-bold outline-none text-slate-800 dark:text-slate-200 focus:border-teal-500 cursor-pointer"
              >
                <option value="all">كل المنشآت</option>
                <option value="closed">المطاعم المغلقة 🔒</option>
                <option value="fined">المطاعم المغرمة 💰</option>
              </select>

              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-3 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-500/20 print-btn"
              >
                <Printer className="w-4 h-4" />
                <span>إصدار تقرير PDF</span>
              </button>
            </div>

            {/* Directory Grid */}
            <div className="glassmorphic-card overflow-hidden print-only-report">
              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                      <th className="p-4 font-bold w-[20%]">اسم المنشأة</th>
                      <th className="p-4 font-bold w-[15%]">نوع النشاط</th>
                      <th className="p-4 font-bold text-center w-[10%]">كود QR</th>
                      <th className="p-4 font-bold w-[10%]">تاريخ آخر زيارة</th>
                      <th className="p-4 font-bold text-center w-[10%]">التقييم الحالي</th>
                      <th className="p-4 font-bold text-center w-[35%] print:hidden">الإجراءات والعمليات الميدانية</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                    {filteredEstablishments.map((est) => (
                      <tr key={est.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors">
                        <td className="p-4 font-black text-slate-800 dark:text-slate-200 cursor-pointer hover:text-teal-600 transition-colors" onClick={() => setEstablishmentModalState({ isOpen: true, mode: 'edit', data: est })}>
                          <div className="flex items-center gap-2">
                            <span>{est.name}</span>
                            {est.status === 'closed' ? (
                              <span className="px-2 py-0.5 rounded-md bg-red-500/10 text-red-600 dark:text-red-400 text-[9px] font-black border border-red-500/20 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
                                مغلق
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] font-black border border-emerald-500/20 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                                مفتوح
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-4 font-bold text-slate-600 dark:text-slate-300">{est.type}</td>
                        <td className="p-4 font-bold text-center">
                          <div
                            onClick={() => setSelectedEstDetails(est)}
                            className="px-3 py-1.5 flex flex-col md:flex-row items-center justify-center gap-2 rounded-lg bg-slate-500/10 hover:bg-slate-500/20 text-slate-700 dark:text-slate-300 transition-all active:scale-95 cursor-pointer font-bold text-[10px] mx-auto w-fit print:border print:border-slate-300 print:bg-transparent"
                          >
                            <QrCode className="w-5 h-5 text-slate-500" />
                            <span className="text-xs font-black dir-ltr tracking-wider">{est.accessCode}</span>
                          </div>
                        </td>
                        <td className="p-4">{est.lastInspection}</td>
                        <td className="p-4 font-bold text-center">
                          {est.lastInspection === 'لم يزر بعد' ? (
                            <span className="text-red-500 font-black">معلق</span>
                          ) : (
                            <span className={`px-3 py-1.5 rounded-xl text-sm font-black ${
                              est.score >= (config.passingScore || 90) ? 'bg-emerald-500/10 text-emerald-600' :
                              est.score >= (config.warningScore || 70) ? 'bg-amber-500/10 text-amber-600' : 'bg-red-500/10 text-red-600'
                            }`}>
                              {est.score}%
                            </span>
                          )}
                        </td>
                        <td className="p-4 print:hidden">
                          <div className="flex justify-center items-center gap-1.5 flex-wrap w-full max-w-[320px] mx-auto">
                            {hasPerm('addEval') && (
                              <button
                                onClick={() => navigate(`/inspection/new?id=${est.id}`)}
                                className="px-2.5 py-1.5 flex items-center justify-center gap-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-teal-400 transition-all active:scale-95 cursor-pointer no-print font-bold text-[10px]"
                              >
                                <FilePlus className="w-3.5 h-3.5" />
                                <span>إضافة تقييم</span>
                              </button>
                            )}
                            {(() => {
                              const hasHistory = est.history && est.history.length > 0;
                              let isEditLocked = !hasPerm('editEval');
                              let lockReason = 'لا تملك صلاحية التعديل';
                              if (hasHistory && !isEditLocked) {
                                const lastEval = est.history[0];
                                const evalTime = new Date(lastEval.date).getTime();
                                const nowTime = new Date().getTime();
                                const diffHours = (nowTime - evalTime) / (1000 * 60 * 60);
                                isEditLocked = diffHours > 48;
                                lockReason = 'مغلق تلقائياً (مرور 48 ساعة)';
                              }
                              return hasHistory && (
                                <button
                                  disabled={isEditLocked}
                                  onClick={() => navigate(`/inspection/new?id=${est.id}&edit=true`)}
                                  className={`px-2.5 py-1.5 flex items-center justify-center gap-1.5 rounded-lg transition-all active:scale-95 cursor-pointer no-print font-bold text-[10px] ${
                                    isEditLocked 
                                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-50' 
                                      : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400'
                                  }`}
                                  title={isEditLocked ? lockReason : ''}
                                >
                                  <CheckSquare className="w-3.5 h-3.5" />
                                  <span>تعديل تقييم</span>
                                </button>
                              );
                            })()}
                            
                            <button
                              onClick={() => {
                                const reason = window.prompt(`أدخل سبب طلب غرامة مالية لمنشأة (${est.name}):`);
                                if (reason) {
                                  setPenaltyRequests(prev => [...prev, {
                                    id: 'pen_' + Date.now(),
                                    type: 'fine',
                                    estId: est.id,
                                    estName: est.name,
                                    sector: est.sector,
                                    teamName: user?.name,
                                    reason,
                                    status: 'pending',
                                    date: new Date().toISOString()
                                  }]);
                                  addSystemNotification(
                                    'طلب غرامة مالية جديد',
                                    `قام الفريق (${user?.name}) برفع طلب غرامة لمنشأة ${est.name} للسبب: ${reason}`,
                                    'central_director'
                                  );
                                  notify('تم رفع طلب الغرامة بنجاح', 'success', true);
                                }
                              }}
                              className="px-2.5 py-1.5 flex items-center justify-center gap-1.5 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 transition-all active:scale-95 cursor-pointer no-print font-bold text-[10px]"
                            >
                              <DollarSign className="w-3.5 h-3.5" />
                              <span>طلب غرامة</span>
                            </button>
                            
                            <button
                              onClick={() => {
                                const reason = window.prompt(`أدخل سبب طلب إغلاق منشأة (${est.name}):`);
                                if (reason) {
                                  setPenaltyRequests(prev => [...prev, {
                                    id: 'pen_' + Date.now(),
                                    type: 'closure',
                                    estId: est.id,
                                    estName: est.name,
                                    sector: est.sector,
                                    teamName: user?.name,
                                    reason,
                                    status: 'pending',
                                    date: new Date().toISOString()
                                  }]);
                                  addSystemNotification(
                                    'طلب إغلاق وتشميع جديد',
                                    `قام الفريق (${user?.name}) برفع طلب إغلاق لمنشأة ${est.name} للسبب: ${reason}`,
                                    'central_director'
                                  );
                                  notify('تم رفع طلب الإغلاق بنجاح', 'success', true);
                                }
                              }}
                              className="px-2.5 py-1.5 flex items-center justify-center gap-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 transition-all active:scale-95 cursor-pointer no-print font-bold text-[10px]"
                            >
                              <Ban className="w-3.5 h-3.5" />
                              <span>طلب إغلاق</span>
                            </button>

                            {hasPerm('manageEstablishments') && (
                              <>
                                <button
                                  onClick={() => setEstablishmentModalState({ isOpen: true, mode: 'edit', data: est })}
                                  className="px-2.5 py-1.5 flex items-center justify-center gap-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 transition-all active:scale-95 cursor-pointer no-print font-bold text-[10px]"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                  <span>تعديل منشأة</span>
                                </button>
                                <button
                                  onClick={() => {
                                    if (window.confirm('هل أنت متأكد من حذف هذه المنشأة بشكل نهائي؟')) {
                                      logAudit('حذف منشأة', est.id, est, null, 'إزالة نهائية', user);
                                      deleteEstablishment(est.id);
                                    }
                                  }}
                                  className="px-2.5 py-1.5 flex items-center justify-center gap-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 transition-all active:scale-95 cursor-pointer no-print font-bold text-[10px]"
                                >
                                  <Trash className="w-3.5 h-3.5" />
                                  <span>حذف</span>
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredEstablishments.length === 0 && (
                      <tr>
                        <td colSpan="6" className="p-8 text-center text-slate-400 font-bold">
                          لا توجد منشآت مطابقة للبحث أو معينة لهذا القطاع.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab C: Incidents Box */}
        {activeTab === 'reports' && hasPerm('showReportsPage') && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white">صندوق البلاغات والتوجيهات الميدانية للقطاع</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">تتبع التوجيهات الرسمية الصادرة من مدير الصحة وشكاوى المواطنين والمستهلكين لقطاع {userSector}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Right Side: Official Directives */}
              <div className="glassmorphic-card p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
                  <h3 className="text-xs font-black text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                    <span>📢 التوجيهات والتبليغات الرسمية الصادرة من المدير</span>
                  </h3>
                  <span className="text-[10px] bg-amber-500 text-white px-2 py-0.5 rounded-lg font-black">{myDirectives.length} توجيه</span>
                </div>

                <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
                  {myDirectives.map((dir) => (
                    <div key={dir.id} className="p-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 dark:bg-amber-500/20 relative overflow-hidden transition-all hover:scale-[1.01]">
                      <div className="absolute top-0 right-0 h-full w-1 bg-amber-500"></div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] bg-amber-500 text-white px-2 py-0.5 rounded-lg font-black">توجيه عاجل</span>
                        <span className="text-[9px] text-amber-600 dark:text-amber-400 font-bold">{dir.date}</span>
                      </div>
                      <p className="text-xs font-black text-amber-900 dark:text-amber-200 leading-relaxed mt-1.5">{dir.text}</p>
                      <span className="text-[9px] text-slate-400 block mt-2">الجهة المرسلة: {dir.sender}</span>
                    </div>
                  ))}
                  {myDirectives.length === 0 && (
                    <div className="text-center p-8 text-slate-400 font-bold text-xs bg-slate-100/50 dark:bg-slate-900/50 rounded-2xl">
                      لا توجد توجيهات رسمية نشطة حالياً لهذا القطاع.
                    </div>
                  )}
                </div>
              </div>

              {/* Left Side: Citizen Reports */}
              <div className="glassmorphic-card p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-teal-500/20 pb-2">
                  <h3 className="text-xs font-black text-teal-700 dark:text-teal-600 dark:text-teal-400 flex items-center gap-1.5">
                    <span>📩 بلاغات وشكاوى المواطنين والمستهلكين</span>
                  </h3>
                  <span className="text-[10px] bg-teal-500 text-white px-2 py-0.5 rounded-lg font-black">{teamReports.length} شكوى</span>
                </div>

                <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
                  {teamReports.map((r) => (
                    <div key={r.id} className="p-4 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/20 relative overflow-hidden transition-all hover:scale-[1.01]">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-black text-slate-800 dark:text-white">{r.establishmentName}</span>
                        <span className="text-[9px] text-slate-400 font-bold">{r.date}</span>
                      </div>
                      <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 leading-relaxed mt-1.5">{r.details}</p>
                      
                      <div className="mt-3 flex items-center justify-between">
                        {r.isDelivery && (
                          <span className="px-2 py-0.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 font-extrabold text-[9px] flex items-center gap-1 shrink-0">
                            <Package className="w-3 h-3" />
                            <span>📦 توصيل منزلي</span>
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  {teamReports.length === 0 && (
                    <div className="text-center p-8 text-slate-400 font-bold text-xs bg-slate-100/50 dark:bg-slate-900/50 rounded-2xl">
                      صندوق بلاغات المواطنين خالٍ تماماً لهذا القطاع.
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}


      </main>

      <EstablishmentModal 
        isOpen={establishmentModalState.isOpen}
        mode={establishmentModalState.mode}
        initialData={establishmentModalState.data}
        onClose={() => setEstablishmentModalState({ isOpen: false, mode: 'add', data: null })}
        onSave={handleSaveEstablishment}
      />

      {/* Metric details popup modal */}
      {showMetricModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-2xl relative text-right max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-200 dark:border-slate-800 mb-4">
              <h3 className="text-sm font-black text-teal-600 dark:text-teal-600 dark:text-teal-400">
                {metricModalType === 'all' && '🍽️ قائمة كافة منشآت القطاع المعينة'}
                {metricModalType === 'inspected' && '🟢 المنشآت التي تم زيارتها وتقييمها هذا الشهر'}
                {metricModalType === 'uninspected' && '🔴 منشآت متأخرة تنتظر الزيارة الفورية'}
              </h3>
              <button 
                onClick={() => setShowMetricModal(false)} 
                className="p-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold">
                    <th className="p-3">اسم المنشأة</th>
                    <th className="p-3">النوع</th>
                    <th className="p-3">تاريخ آخر زيارة</th>
                    <th className="p-3 text-center">الدرجة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                  {modalEstList.map(e => (
                    <tr key={e.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/10">
                      <td 
                        className="p-3 font-black text-slate-800 dark:text-slate-200 cursor-pointer hover:text-teal-600 transition-colors"
                        onClick={() => {
                          setShowMetricModal(false);
                          setEstablishmentModalState({ isOpen: true, mode: 'edit', data: e });
                        }}
                      >
                        {e.name}
                      </td>
                      <td className="p-3 text-slate-500">{e.type}</td>
                      <td className="p-3 text-slate-550 dark:text-slate-400">{e.lastInspection}</td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black ${
                          e.score >= (config.passingScore || 90) ? 'bg-emerald-500/10 text-emerald-600' :
                          e.score >= (config.warningScore || 70) ? 'bg-amber-500/10 text-amber-600' : 'bg-red-500/10 text-red-600'
                        }`}>
                          {e.lastInspection === 'لم يزر بعد' ? 'معلق ⏳' : `${e.score}%`}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {modalEstList.length === 0 && (
                    <tr>
                      <td colSpan="5" className="p-6 text-center text-slate-400 font-bold">
                        لا توجد سجلات منشآت مطابقة لهذه الفئة حالياً.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <button
              onClick={() => setShowMetricModal(false)}
              className="mt-6 w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-black transition-all cursor-pointer"
            >
              إغلاق قائمة التفاصيل
            </button>
          </div>
        </div>
      )}
      
      {/* Live Violation Photo Modal */}
      {selectedViolationImg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-md glassmorphic-card p-6 border border-white/20 shadow-2xl relative text-center">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/50 dark:border-slate-800/50 mb-4">
              <span className="text-xs font-black text-slate-800 dark:text-white">الصورة المرفقة بالبلاغ للمطعم</span>
              <button onClick={() => setSelectedViolationImg(null)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"><X className="w-4 h-4" /></button>
            </div>
            
            {/* Real placeholder or styled block representing evidence photo */}
            <div className="w-full h-64 bg-slate-200 dark:bg-slate-950 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-teal-500/30 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent z-10 opacity-70"></div>
              {/* Evidence Graphic */}
              <div className="z-20 text-white p-4 absolute bottom-0 right-0 text-right">
                <p className="text-xs font-black">صورة المخالفة المسجلة ميدانياً</p>
                <p className="text-[10px] text-slate-300 mt-1">تاريخ التصوير: {new Date().toISOString().split('T')[0]}</p>
              </div>
              <svg className="w-16 h-16 text-teal-600/40 z-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>

            <button
              onClick={() => setSelectedViolationImg(null)}
              className="mt-6 w-full py-2.5 rounded-xl bg-slate-800 dark:bg-slate-250 text-white dark:text-slate-950 text-xs font-black transition-all cursor-pointer"
            >
              إغلاق المعاينة المباشرة
            </button>
          </div>
        </div>
      )}

      {/* QR Code and Restaurant Details Modal */}
      {selectedEstDetails && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-md animate-fade-in text-right">
          <div className="w-full max-w-md bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl border border-white/10 p-6 rounded-[2rem] text-slate-800 dark:text-white shadow-[0_0_50px_-12px_rgba(20,184,166,0.3)] relative max-h-[90vh] overflow-y-auto custom-scrollbar">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10 mb-5">
              <h3 className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-l from-teal-600 to-emerald-600 dark:from-teal-400 dark:to-emerald-400">🔗 رمز الاستجابة السريعة QR وتفاصيل المنشأة</h3>
              <button 
                onClick={() => setSelectedEstDetails(null)} 
                className="flex p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition-all items-center justify-center group shadow-sm border border-slate-200 dark:border-white/5"
              >
                <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>

            <div className="space-y-5 text-xs">
              <div className="p-5 rounded-2xl bg-slate-100/40 dark:bg-slate-800/40 border border-slate-200 dark:border-white/5 shadow-[inset_0_0_20px_rgba(255,255,255,0.02)] text-right space-y-2">
                <span className="text-[10px] text-teal-600 dark:text-teal-400 block font-black uppercase mb-1">البيانات الرسمية للمنشأة</span>
                <h4 className="text-base font-black text-white">{selectedEstDetails.name}</h4>
                <div className="grid grid-cols-1 gap-2 pt-1">
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">النشاط: <strong className="text-slate-800 dark:text-slate-200">{selectedEstDetails.type}</strong></p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">المالك: <strong className="text-slate-800 dark:text-slate-200">{selectedEstDetails.owner}</strong></p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">رقم الهاتف: <strong className="text-slate-800 dark:text-slate-200">{selectedEstDetails.phone}</strong></p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">الترخيص: <strong className="text-slate-800 dark:text-slate-200">{selectedEstDetails.licenseNumber}</strong></p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">آخر زيارة تفتيش: <strong className="text-slate-800 dark:text-slate-200">{selectedEstDetails.lastInspection}</strong></p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">التقييم: <strong className={selectedEstDetails.score >= 90 ? 'text-emerald-400' : 'text-amber-500'}>{selectedEstDetails.lastInspection === 'لم يزر بعد' ? 'معلق' : `${selectedEstDetails.score}%`}</strong></p>
                </div>
                <div className="mt-4 p-3 bg-teal-500/10 border border-teal-500/20 rounded-xl relative overflow-hidden">
                  <div className="absolute -left-4 -top-4 w-12 h-12 bg-teal-500/20 blur-xl rounded-full"></div>
                  <p className="text-xs text-teal-600 dark:text-teal-400 font-bold text-center">🔑 كود بوابة المالك:</p>
                  <p className="text-2xl font-black text-slate-900 dark:text-white tracking-widest text-center mt-1 dir-ltr drop-shadow-[0_2px_10px_rgba(45,212,191,0.5)]">{selectedEstDetails.accessCode}</p>
                </div>
              </div>

              {/* QR Preview Box */}
              <div className="flex flex-col items-center justify-center p-6 bg-white rounded-3xl border-4 border-slate-200 dark:border-slate-900 shadow-[0_10px_30px_-10px_rgba(255,255,255,0.1)] relative">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`${window.location.origin}/scan/${selectedEstDetails.id}`)}`}
                  alt="Restaurant QR Code"
                  className="w-48 h-48 block rounded-xl shadow-lg mix-blend-multiply"
                />
                <span className="text-[10px] text-slate-500 font-extrabold mt-4 text-center block max-w-[200px] leading-relaxed">
                  كود QR الموحد للمنشأة (يعرض التقييم الصحي ويمكن المواطن من الإبلاغ)
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <a
                  href={`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(`${window.location.origin}/scan/${selectedEstDetails.id}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="py-3 rounded-2xl bg-gradient-to-l from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white text-center font-black block transition-all shadow-[0_5px_15px_-3px_rgba(20,184,166,0.4)] hover:shadow-[0_8px_20px_-3px_rgba(20,184,166,0.5)]"
                >
                  📥 تحميل الصورة
                </a>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white border border-white/10 text-center font-black block transition-all shadow-inner"
                >
                  🖨️ طباعة ملصق
                </button>
              </div>

              <button
                type="button"
                onClick={() => setSelectedEstDetails(null)}
                className="mt-2 w-full py-3 rounded-2xl bg-transparent hover:bg-white/5 text-slate-600 dark:text-slate-400 font-extrabold transition-all border border-transparent hover:border-slate-300 dark:hover:border-white/10"
              >
                إغلاق وخروج
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Justification Modal */}
      {showJustificationModal && pendingEditData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700/60 p-6 rounded-3xl text-white shadow-2xl relative text-right">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-800 mb-4">
              <h3 className="text-sm font-black text-amber-500">⚠️ تأكيد التعديل والإفصاح الرسمي</h3>
              <button 
                onClick={() => {
                  setShowJustificationModal(false);
                  setPendingEditData(null);
                  setEditJustification('');
                }} 
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400 mb-4">
              لإكمال عملية التعديل على بيانات <span className="font-bold text-white">({pendingEditData.name})</span>، يرجى إدخال سبب التعديل أدناه ليتم حفظه في سجل التدقيق الأمني.
            </p>

            <form onSubmit={confirmEditWithJustification}>
              <textarea
                required
                value={editJustification}
                onChange={(e) => setEditJustification(e.target.value)}
                placeholder="اكتب هنا سبب التعديل الرسمي... (مثال: تصحيح رقم الهاتف بطلب من المالك، تحديث الترخيص الصحي...)"
                rows="4"
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white placeholder-slate-500 outline-none text-xs font-bold focus:border-amber-500 mb-4"
              />
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
              >
                تأكيد وحفظ التعديلات
              </button>
            </form>
          </div>
        </div>
      )}



      <QRScannerModal 
        isOpen={showQRScanner}
        onClose={() => setShowQRScanner(false)}
        onScanSuccess={handleQRScanSuccess}
      />

      {/* Floating Chat Widget */}
      <div className="fixed bottom-6 left-6 z-[60] flex flex-col items-end">
        {isChatOpen && (
          <div className="bg-white dark:bg-slate-900 w-80 sm:w-96 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 mb-4 flex flex-col overflow-hidden animate-fade-in-up">
            <div className="bg-gradient-to-r from-teal-600 to-teal-500 p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-right">الدعم المباشر</h4>
                  <p className="text-[10px] text-teal-100">غرفة العمليات المركزية</p>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 h-64 overflow-y-auto flex flex-col gap-3 bg-slate-50 dark:bg-slate-950">
              {chatHistory.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender === 'team' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${msg.sender === 'team' ? 'bg-teal-600 text-white rounded-br-none' : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-bl-none'}`}>
                    <p className="text-xs font-bold leading-relaxed text-right">{msg.text}</p>
                    <span className={`text-[9px] block mt-1 text-left ${msg.sender === 'team' ? 'text-teal-200' : 'text-slate-400'}`}>{msg.time}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex gap-2">
              <button 
                onClick={() => {
                  if (chatMessage.trim()) {
                    setChatHistory([...chatHistory, { id: Date.now(), sender: 'team', text: chatMessage, time: new Date().toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' }) }]);
                    setChatMessage('');
                    // Mock auto-reply
                    setTimeout(() => {
                      setChatHistory(prev => [...prev, { id: Date.now()+1, sender: 'admin', text: 'تم استلام بلاغك. جاري المتابعة.', time: new Date().toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' }) }]);
                    }, 1500);
                  }
                }}
                className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 hover:bg-teal-700 transition-colors"
              >
                <Send className="w-4 h-4 rtl:-scale-x-100" />
              </button>
              <input 
                type="text" 
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && chatMessage.trim()) {
                    setChatHistory([...chatHistory, { id: Date.now(), sender: 'team', text: chatMessage, time: new Date().toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' }) }]);
                    setChatMessage('');
                    setTimeout(() => {
                      setChatHistory(prev => [...prev, { id: Date.now()+1, sender: 'admin', text: 'تم استلام بلاغك. جاري المتابعة.', time: new Date().toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' }) }]);
                    }, 1500);
                  }
                }}
                placeholder="اكتب رسالتك لغرفة العمليات..."
                className="flex-1 bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 text-xs font-bold text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-teal-500/50 text-right"
              />
            </div>
          </div>
        )}
        
        <button 
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl transition-all hover:scale-110 ${isChatOpen ? 'bg-slate-800' : 'bg-teal-600 animate-bounce'}`}
        >
          {isChatOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        </button>
      </div>

    </div>
  );
};

export default TeamDashboard;
