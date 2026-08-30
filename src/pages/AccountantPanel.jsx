import React, { useContext, useState, useMemo } from 'react';
import { AppContext } from '../context/AppContext';
import { ThemeToggle } from '../components/ThemeToggle';
import { WeatherWidget } from '../components/WeatherWidget';
import { NotificationBell } from '../components/NotificationBell';
import { AnimatedLogo } from '../components/AnimatedLogo';
import { LogOut, DollarSign, Activity, FileText, CheckCircle2, ShieldAlert, BadgeInfo, BellRing, Sun, Moon, Cloud, ChevronLeft, CreditCard, Banknote, Search, AlertCircle, Eye, ClipboardList, Menu, LayoutDashboard, Printer, Mail, Inbox, Archive, Filter, Building, Compass, Map, CheckSquare } from 'lucide-react';
import { TeamDashboard } from './TeamDashboard';
import { ExecutivePortal } from './ExecutivePortal';

export const AccountantPanel = () => {
  const { user, setUser, navigate, notify, penaltyRequests, setPenaltyRequests, establishments, setShowDisplayPrefsModal, uiPreferences, directives, setDirectives } = useContext(AppContext);

  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'pay_fines', 'directives', 'reconciliation', 'comprehensive_reports'
  
  // States for Pay Fines
  const [searchCode, setSearchCode] = useState('');
  const [searchedFine, setSearchedFine] = useState(null);
  const [searchedEstablishment, setSearchedEstablishment] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cash'); // 'cash' or 'pos'
  const [receiptNumber, setReceiptNumber] = useState('');

  // States for Comprehensive Reports
  const [reportFilter, setReportFilter] = useState('الكل');

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const targetSector = user?.linkedTeamSector || user?.sector || 'الكل';

  const hasPerm = (permName) => {
    if (user?.role === 'admin' || user?.role === 'financial_accountant') return true;
    return user?.permissions?.[permName] === true;
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('auth_token');
    notify('تم تسجيل الخروج بنجاح', 'info');
    navigate('/');
  };

  const getEstablishmentSector = (estId) => {
    const est = establishments.find(e => e.id === estId);
    return est ? est.sector : '';
  };

  const getEstablishmentName = (estId) => {
    const est = establishments.find(e => e.id === estId);
    return est ? est.name : 'مجهول';
  };

  const allFines = (penaltyRequests || []).filter(r => r.type === 'fine' || r.type === 'closure');
  
  // Fines for current sector
  const sectorFines = allFines.filter(f => {
    const estSector = getEstablishmentSector(f.establishmentId || f.estId);
    return targetSector === 'الكل' || estSector === targetSector || (estSector && estSector.includes(targetSector));
  });

  const pendingFines = sectorFines.filter(f => f.paymentStatus !== 'paid');
  const paidFines = sectorFines.filter(f => f.paymentStatus === 'paid');

  // Dashboard Stats
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const sectorMonthlyPaid = paidFines.filter(f => {
    const d = new Date(f.paymentDate);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });
  const sectorMonthlyRevenue = sectorMonthlyPaid.reduce((sum, f) => sum + (f.amount || 0), 0);
  const sectorTotalRevenue = paidFines.reduce((sum, f) => sum + (f.amount || 0), 0);
  const sectorPendingAmount = pendingFines.reduce((sum, f) => sum + (f.amount || 0), 0);

  // Reconciliation stats for TODAY
  const today = new Date().toDateString();
  const todayPaidFines = paidFines.filter(f => new Date(f.paymentDate).toDateString() === today);
  const cashCollected = todayPaidFines.filter(f => f.paymentMethod === 'cash').reduce((sum, f) => sum + (f.amount || 0), 0);
  const posCollected = todayPaidFines.filter(f => f.paymentMethod === 'pos').reduce((sum, f) => sum + (f.amount || 0), 0);
  const totalReceipts = todayPaidFines.length;

  // Directives Logic
  const myDirectives = (directives || []).filter(d => {
    if (d.target === 'all') return true;
    if (d.target === 'teams' && user?.role === 'team_leader') return true;
    if (d.target === 'specific' && d.targetSectors?.includes(targetSector)) return true;
    return false;
  });
  const unreadDirectivesCount = myDirectives.filter(d => !d.isRead).length;

  const markDirectiveRead = (id) => {
    setDirectives(prev => prev.map(d => d.id === id ? { ...d, isRead: true } : d));
  };

  // Comprehensive Reports Logic
  const comprehensiveFilteredFines = useMemo(() => {
    return allFines.filter(f => {
      if (reportFilter === 'الكل') return true;
      const estSector = getEstablishmentSector(f.establishmentId || f.estId);
      return estSector.includes(reportFilter);
    });
  }, [allFines, reportFilter]);

  const compMonthlyPaid = comprehensiveFilteredFines.filter(f => f.paymentStatus === 'paid' && new Date(f.paymentDate).getMonth() === currentMonth && new Date(f.paymentDate).getFullYear() === currentYear);
  const compMonthlyRevenue = compMonthlyPaid.reduce((sum, f) => sum + (f.amount || 0), 0);
  const compTotalRevenue = comprehensiveFilteredFines.filter(f => f.paymentStatus === 'paid').reduce((sum, f) => sum + (f.amount || 0), 0);

  // Pay Fines Handlers
  const handleSearchFine = () => {
    if (!searchCode.trim()) {
      notify('يرجى إدخال كود المنشأة أو رقم الغرامة', 'warning');
      return;
    }
    
    // 1. Search for establishment directly by code or name
    let est = establishments.find(e => String(e.id).toLowerCase() === String(searchCode).toLowerCase() || e.name.includes(searchCode));
    
    // 2. Search for fine directly by fine ID
    let fineByFineId = pendingFines.find(f => String(f.id).toLowerCase() === String(searchCode).toLowerCase());

    // 3. Determine target establishment and fine
    let targetEst = null;
    let targetFine = null;

    if (fineByFineId) {
      targetFine = fineByFineId;
      targetEst = establishments.find(e => String(e.id) === String(targetFine.establishmentId || targetFine.estId));
    } else if (est) {
      targetEst = est;
      // find any pending fine for this establishment
      targetFine = pendingFines.find(f => String(f.establishmentId || f.estId) === String(est.id));
    }

    if (targetEst) {
      setSearchedEstablishment(targetEst);
      if (targetFine) {
        setSearchedFine(targetFine);
        setPaymentMethod('cash');
        setReceiptNumber('');
      } else {
        setSearchedFine(null);
        notify('لا توجد غرامة معلقة على هذه المنشأة.', 'info');
      }
    } else {
      setSearchedEstablishment(null);
      setSearchedFine(null);
      notify('المنشأة غير متوفرة في قاعدة البيانات ولم يتم العثور على غرامة مسجلة بهذا الكود', 'error');
    }
  };

  const submitPayment = () => {
    if (!searchedFine) return;
    
    setPenaltyRequests(prev => prev.map(req => {
      if (req.id === searchedFine.id) {
        return {
          ...req,
          paymentStatus: 'paid',
          paymentDate: new Date().toISOString(),
          paymentMethod: paymentMethod,
          receiptNumber: receiptNumber || 'غير محدد',
          processedBy: user?.name
        };
      }
      return req;
    }));

    notify('تم تأكيد القبض وتسجيل التسديد بنجاح!', 'success');
    setSearchedFine(null);
    setSearchCode('');
  };

  const handleCloseRegister = (status) => {
    if (status === 'confirm') {
      notify('تم تأكيد صحة الجرد وإغلاق الصندوق بنجاح', 'success');
      setActiveTab('dashboard');
    } else {
      notify('تم تسجيل وجود خطأ وتم رفع طلب مراجعة للتدقيق', 'warning');
    }
  };

  return (
    <div 
      className={`min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300 ${uiPreferences?.density === 'compact' ? 'ui-compact' : 'ui-comfortable'}`}
      style={{
        '--ui-heading-size': uiPreferences?.headingSize || '18px',
        '--ui-body-size': uiPreferences?.bodySize || '12px',
      }}
    >
      
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
        <div className="overflow-y-auto flex-1 pb-6 pr-2 -mr-2">
          <AnimatedLogo variant="sidebar" className="mb-6" />

          <div className="space-y-1 mb-6">
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block px-3 mb-2">
              بوابة المحاسبين (الإدارة المالية)
            </span>
            
            <button
              onClick={() => { setActiveTab('dashboard'); setIsSidebarOpen(false); }}
              className={`w-full text-right px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center gap-3 ${
                activeTab === 'dashboard'
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-500/10'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40'
              }`}
            >
              <LayoutDashboard className="w-4.5 h-4.5" />
              <span>التقارير</span>
            </button>
            
            <button
              onClick={() => { setActiveTab('pay_fines'); setIsSidebarOpen(false); }}
              className={`w-full text-right px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center gap-3 ${
                activeTab === 'pay_fines'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/10'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40'
              }`}
            >
              <Banknote className="w-4.5 h-4.5" />
              <span>تسديد الغرامات</span>
            </button>

            <button
              onClick={() => { setActiveTab('directives'); setIsSidebarOpen(false); }}
              className={`w-full text-right px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center justify-between ${
                activeTab === 'directives'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <Mail className="w-4.5 h-4.5" />
                <span>التبليغات</span>
              </div>
              {unreadDirectivesCount > 0 && (
                <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">{unreadDirectivesCount}</span>
              )}
            </button>

            <button
              onClick={() => { setActiveTab('reconciliation'); setIsSidebarOpen(false); }}
              className={`w-full text-right px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center gap-3 ${
                activeTab === 'reconciliation'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/10'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40'
              }`}
            >
              <ClipboardList className="w-4.5 h-4.5" />
              <span>جرد اليومية والمطابقة</span>
            </button>

            {hasPerm('viewComprehensiveFinancialReports') && (
              <>
                <div className="my-4 border-t border-slate-200 dark:border-slate-800" />
                <span className="text-[11px] font-bold text-amber-500 dark:text-amber-400 uppercase tracking-wider block px-3 mb-2 flex items-center gap-2">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  صلاحيات رقابية متقدمة
                </span>
                <button
                  onClick={() => { setActiveTab('comprehensive_reports'); setIsSidebarOpen(false); }}
                  className={`w-full text-right px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center gap-3 ${
                    activeTab === 'comprehensive_reports'
                      ? 'bg-amber-600 text-white shadow-md shadow-amber-500/10'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <Activity className="w-4.5 h-4.5" />
                  <span>التقارير المالية الشاملة</span>
                </button>
              </>
            )}

            {/* Dynamic Extra Permissions Tabs */}
            {(hasPerm('manageEstablishments') || hasPerm('showReportsPage') || hasPerm('showMainDashboard') || hasPerm('showSectorMap') || hasPerm('showSmartTasks') || hasPerm('showDeliveryPage')) && (
              <>
                <div className="my-4 border-t border-slate-200 dark:border-slate-800" />
                <span className="text-[11px] font-bold text-teal-500 dark:text-teal-400 uppercase tracking-wider block px-3 mb-2 flex items-center gap-2">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  صلاحيات إضافية (ممنوحة)
                </span>
                
                {hasPerm('showMainDashboard') && (
                  <button
                    onClick={() => { setActiveTab('ext_summary'); setIsSidebarOpen(false); }}
                    className={`w-full text-right px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center gap-3 ${
                      activeTab === 'ext_summary' ? 'bg-teal-600 text-white shadow-md' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <LayoutDashboard className="w-4.5 h-4.5" />
                    <span>لوحة التقارير والإحصائيات</span>
                  </button>
                )}

                {hasPerm('manageEstablishments') && (
                  <button
                    onClick={() => { setActiveTab('ext_directory'); setIsSidebarOpen(false); }}
                    className={`w-full text-right px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center gap-3 ${
                      activeTab === 'ext_directory' ? 'bg-teal-600 text-white shadow-md' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <Building className="w-4.5 h-4.5" />
                    <span>إدارة المنشآت</span>
                  </button>
                )}

                {hasPerm('showReportsPage') && (
                  <button
                    onClick={() => { setActiveTab('ext_reports'); setIsSidebarOpen(false); }}
                    className={`w-full text-right px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center gap-3 ${
                      activeTab === 'ext_reports' ? 'bg-teal-600 text-white shadow-md' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <Compass className="w-4.5 h-4.5" />
                    <span>التقارير الجغرافية</span>
                  </button>
                )}
                
                {hasPerm('showSectorMap') && (
                  <button
                    onClick={() => { setActiveTab('ext_map'); setIsSidebarOpen(false); }}
                    className={`w-full text-right px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center gap-3 ${
                      activeTab === 'ext_map' ? 'bg-teal-600 text-white shadow-md' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <Map className="w-4.5 h-4.5" />
                    <span>خريطة القطاع</span>
                  </button>
                )}
                
                {hasPerm('showSmartTasks') && (
                  <button
                    onClick={() => { setActiveTab('ext_smart_tasks'); setIsSidebarOpen(false); }}
                    className={`w-full text-right px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center gap-3 ${
                      activeTab === 'ext_smart_tasks' ? 'bg-teal-600 text-white shadow-md' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <CheckSquare className="w-4.5 h-4.5" />
                    <span>مهام اليوم الذكية</span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* User context footer */}
        <div className="pt-4 border-t border-slate-200/50 dark:border-slate-800/50 shrink-0 bg-white/95 dark:bg-slate-900/95 md:bg-transparent">
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col flex-1 truncate text-right mr-3">
              <span className="text-xs font-black text-slate-700 dark:text-slate-300">{user?.name || 'سيدي المحاسب'}</span>
              <span className="text-[9px] font-bold text-slate-400 mt-0.5 truncate">
                {user?.role === 'financial_accountant' ? 'محاسب مالي' : 'محاسب الدائرة'}
              </span>
              <span className="text-[8px] font-bold text-teal-500 mt-0.5 truncate">
                الصلاحيات المفعلة: {user?.role === 'admin' || user?.role === 'financial_accountant' ? 'كاملة' : Object.keys(user?.permissions || {}).filter(k => user?.permissions[k]).length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowDisplayPrefsModal(true)}
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
            <span className="text-xl">💰</span>
            <div>
              <h2 className="text-xs font-black text-slate-800 dark:text-white">أهلاً بك سيدي المحاسب 👋</h2>
              <p className="text-[10px] text-slate-500">طاب يومك، تتصفح الآن الإدارة المالية لـ {targetSector}</p>
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
                onClick={() => setShowDisplayPrefsModal(true)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all cursor-pointer shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center group"
              >
                <Eye className="w-4 h-4 group-hover:text-teal-500 transition-colors" />
              </button>
              <NotificationBell />
              <ThemeToggle />
          </div>
        </div>

        {/* --- Tab: Dashboard & Reports --- */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-fade-in-up">
            <h3 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2 mb-4">
              <LayoutDashboard className="w-5 h-5 text-teal-500" />
              الرئيسية وملخص الإيرادات
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 p-5 rounded-2xl">
                <span className="block text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1">الإيرادات المحصلة (هذا الشهر)</span>
                <span className="block text-2xl font-black text-emerald-700 dark:text-emerald-300">{sectorMonthlyRevenue.toLocaleString()} <span className="text-[10px]">د.ع</span></span>
              </div>
              <div className="bg-teal-50 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/20 p-5 rounded-2xl">
                <span className="block text-xs font-bold text-teal-600 dark:text-teal-400 mb-1">إجمالي الإيرادات (الكلية)</span>
                <span className="block text-2xl font-black text-teal-700 dark:text-teal-300">{sectorTotalRevenue.toLocaleString()} <span className="text-[10px]">د.ع</span></span>
              </div>
              <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 p-5 rounded-2xl">
                <span className="block text-xs font-bold text-red-600 dark:text-red-400 mb-1">الغرامات المعلقة (قيد التسديد)</span>
                <span className="block text-2xl font-black text-red-700 dark:text-red-300">{sectorPendingAmount.toLocaleString()} <span className="text-[10px]">د.ع</span></span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <h4 className="text-sm font-bold text-slate-800 dark:text-white">أحدث الغرامات المعلقة للقطاع</h4>
                <span className="px-2 py-1 bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400 rounded text-[10px] font-black">{pendingFines.length} غرامة</span>
              </div>
              {pendingFines.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs font-bold">لا توجد غرامات معلقة حالياً.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-right border-collapse text-xs font-bold">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 border-b border-slate-100 dark:border-slate-800">
                        <th className="p-3">المنشأة</th>
                        <th className="p-3">السبب</th>
                        <th className="p-3">المبلغ</th>
                        <th className="p-3">التاريخ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                      {pendingFines.slice(0, 5).map(fine => (
                        <tr key={fine.id}>
                        <td className="p-3 text-slate-700 dark:text-slate-300">{getEstablishmentName(fine.establishmentId || fine.estId)}</td>
                          <td className="p-3 text-slate-500">{fine.reason}</td>
                          <td className="p-3 text-red-600 font-black">{fine.amount?.toLocaleString()}</td>
                          <td className="p-3 text-slate-500 text-[10px]">{new Date(fine.date).toLocaleDateString('en-GB')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- Tab: Pay Fines & Search --- */}
        {activeTab === 'pay_fines' && (
          <div className="space-y-6 animate-fade-in-up">
            <h3 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2 mb-4">
              <Banknote className="w-5 h-5 text-emerald-500" />
              تسديد الغرامات
            </h3>

            {/* Search Box */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm max-w-xl mx-auto">
              <p className="text-xs text-slate-500 font-bold mb-4 text-center">قم بإدخال كود المنشأة (أو رقم الغرامة) لاسترجاع التفاصيل وتسديد المبلغ فوراً.</p>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="مثال: est_123 أو كود QR..."
                  value={searchCode}
                  onChange={(e) => setSearchCode(e.target.value)}
                  className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-xl text-sm font-bold text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors text-left dir-ltr"
                />
                <button 
                  onClick={handleSearchFine}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs transition-colors flex items-center gap-2 shadow-sm"
                >
                  <Search className="w-4 h-4" />
                  بحث واستعلام
                </button>
              </div>
            </div>

            {/* Searched Details */}
            {searchedEstablishment && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-lg max-w-2xl mx-auto relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-slate-500/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
                
                <div className="mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <h4 className="text-md font-black text-slate-800 dark:text-white flex items-center gap-2 mb-2">
                    تفاصيل المنشأة
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="block text-[10px] text-slate-500 font-bold mb-1">اسم المنشأة</span>
                      <span className="block text-sm font-black text-slate-800 dark:text-white">{searchedEstablishment.name}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-500 font-bold mb-1">كود المنشأة</span>
                      <span className="block text-sm font-black text-slate-700 dark:text-slate-300">{searchedEstablishment.id}</span>
                    </div>
                  </div>
                </div>

                {searchedFine ? (
                  <>
                    <h4 className="text-md font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-2 mb-6">
                      <CheckCircle2 className="w-5 h-5" />
                      تم العثور على غرامة مستحقة
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
                      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                        <span className="block text-[10px] text-slate-500 font-bold mb-1">المبلغ المطلوب تسديده</span>
                        <span className="block text-xl font-black text-red-600">{searchedFine.amount?.toLocaleString()} <span className="text-[10px]">د.ع</span></span>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                        <span className="block text-[10px] text-slate-500 font-bold mb-1">سبب المخالفة</span>
                        <span className="block text-xs font-bold text-slate-700 dark:text-slate-300">{searchedFine.reason}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl mb-6 text-center">
                    <p className="text-emerald-700 dark:text-emerald-400 font-bold text-sm">
                      ✅ لا توجد غرامات لهذه المنشأة.
                    </p>
                  </div>
                )}

                <div className="border-t border-slate-200 dark:border-slate-700 pt-6 relative z-10 space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-2">طريقة الدفع المستلمة:</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setPaymentMethod('cash')}
                        className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition-all font-bold text-xs ${
                          paymentMethod === 'cash' 
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 shadow-sm' 
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <Banknote className="w-5 h-5" /> نقدي (كاش)
                      </button>
                      <button
                        onClick={() => setPaymentMethod('pos')}
                        className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition-all font-bold text-xs ${
                          paymentMethod === 'pos' 
                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 shadow-sm' 
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <CreditCard className="w-5 h-5" /> إلكتروني (POS)
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-2">رقم الوصل الورقي (الدفتر) - إن وجد:</label>
                    <input
                      type="text"
                      value={receiptNumber}
                      onChange={(e) => setReceiptNumber(e.target.value)}
                      placeholder="أدخل رقم الوصل..."
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-xl text-sm font-bold focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={submitPayment}
                      className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-black transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98]"
                    >
                      استلام المبلغ وإثبات التسديد
                    </button>
                    <button
                      onClick={() => notify('جاري التجهيز لطباعة الوصل A4...', 'info')}
                      className="px-4 py-4 bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-xl text-xs font-black transition-all shadow-sm flex items-center gap-2"
                    >
                      <Printer className="w-4 h-4" /> طباعة A4
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Archive of Paid Fines */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
              <h4 className="text-md font-black text-slate-800 dark:text-white flex items-center gap-2 mb-4">
                <Archive className="w-5 h-5 text-slate-400" />
                أرشيف الوصولات المالية (تم التسديد)
              </h4>
              {paidFines.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs font-bold bg-slate-50 dark:bg-slate-800/30 rounded-2xl">لا توجد وصولات مسددة في الأرشيف.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-right border-collapse text-xs font-bold">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 border-b border-slate-100 dark:border-slate-800">
                        <th className="p-3">رقم الوصل</th>
                        <th className="p-3">المنشأة</th>
                        <th className="p-3">المبلغ المستلم</th>
                        <th className="p-3">طريقة الدفع</th>
                        <th className="p-3">تاريخ التسديد</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                      {paidFines.slice(0, 10).map(fine => (
                        <tr key={fine.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                          <td className="p-3 text-slate-700 dark:text-slate-300">{fine.receiptNumber || 'بدون'}</td>
                        <td className="p-3 text-slate-700 dark:text-slate-300">{getEstablishmentName(fine.establishmentId || fine.estId)}</td>
                          <td className="p-3 text-emerald-600 font-black">{fine.amount?.toLocaleString()}</td>
                          <td className="p-3">
                            <span className={`px-2 py-1 text-[10px] rounded-lg ${fine.paymentMethod === 'pos' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'}`}>
                              {fine.paymentMethod === 'pos' ? 'POS' : 'نقدي'}
                            </span>
                          </td>
                          <td className="p-3 text-slate-500 text-[10px]">{new Date(fine.paymentDate).toLocaleDateString('ar-IQ', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- Tab: Directives --- */}
        {activeTab === 'directives' && (
          <div className="space-y-6 animate-fade-in-up">
            <h3 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2 mb-4">
              <Mail className="w-5 h-5 text-blue-500" />
              الأوامر والتوجيهات الرسمية
            </h3>
            
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm min-h-[50vh]">
              {myDirectives.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-20">
                  <Inbox className="w-16 h-16 text-slate-200 dark:text-slate-700 mb-4" />
                  <p className="text-slate-500 font-bold">لا توجد تبليغات واردة حالياً.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {myDirectives.map((dir) => (
                    <div 
                      key={dir.id}
                      onClick={() => !dir.isRead && markDirectiveRead(dir.id)}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                        !dir.isRead 
                          ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 shadow-md' 
                          : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 opacity-75'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          {!dir.isRead && <span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.8)]"></span>}
                          <h4 className={`text-sm font-black ${!dir.isRead ? 'text-blue-700 dark:text-blue-300' : 'text-slate-700 dark:text-slate-300'}`}>
                            {dir.subject}
                          </h4>
                        </div>
                        <span className="text-[10px] text-slate-400 font-bold bg-white dark:bg-slate-800 px-2 py-1 rounded border border-slate-100 dark:border-slate-700 shadow-sm">
                          {new Date(dir.date).toLocaleDateString('ar-IQ')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed bg-white/50 dark:bg-slate-900/50 p-4 rounded-xl border border-white/50 dark:border-slate-700/50">
                        {dir.content}
                      </p>
                      <div className="mt-3 flex items-center justify-between text-[10px] font-bold">
                        <span className="text-slate-500">المرسل: الإدارة المركزية ({dir.senderName || 'غير معروف'})</span>
                        {dir.isRead && <span className="text-emerald-500 flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> مقروء</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- Tab: Reconciliation --- */}
        {activeTab === 'reconciliation' && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm relative">
              
              <button 
                onClick={() => {
                  const testFines = [
                    { id: `test_fine_${Date.now()}_1`, type: 'fine', establishmentId: 'est_1', establishmentName: 'مطعم السعادة السريع', sector: targetSector === 'الكل' ? 'مركز المحافظة - الجانب الأيسر' : targetSector, amount: 250000, reason: 'عدم تجديد الإجازة الصحية', paymentStatus: 'paid', paymentDate: new Date().toISOString(), paymentMethod: 'cash', date: new Date().toISOString() },
                    { id: `test_fine_${Date.now()}_2`, type: 'fine', establishmentId: 'est_2', establishmentName: 'كافيه البستان الملكي', sector: targetSector === 'الكل' ? 'مركز المحافظة - الجانب الأيسر' : targetSector, amount: 100000, reason: 'مخالفة شروط النظافة', paymentStatus: 'paid', paymentDate: new Date().toISOString(), paymentMethod: 'pos', date: new Date().toISOString() },
                    { id: `test_fine_${Date.now()}_3`, type: 'fine', establishmentId: 'est_3', establishmentName: 'أسواق المدينة الكبرى', sector: targetSector === 'الكل' ? 'مركز المحافظة - الجانب الأيمن' : targetSector, amount: 150000, reason: 'عرض مواد منتهية الصلاحية', paymentStatus: 'paid', paymentDate: new Date().toISOString(), paymentMethod: 'cash', date: new Date().toISOString() }
                  ];
                  setPenaltyRequests(prev => [...(prev || []), ...testFines]);
                  notify('تم توليد وصولات دفع وهمية بنجاح! يمكنك رؤيتها الآن في المطابقة.', 'success');
                }}
                className="absolute top-6 left-6 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-xl text-[10px] font-black transition-colors border border-indigo-200 dark:border-indigo-500/30 shadow-sm"
              >
                [Dev] توليد وصولات مسددة
              </button>

              <h3 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white mb-2 flex items-center gap-3">
                <ClipboardList className="w-7 h-7 text-indigo-500" />
                جرد اليومية والمطابقة للصندوق
              </h3>
              <p className="text-xs md:text-sm text-slate-500 font-bold mb-8">ملخص الإيرادات المالية لهذا اليوم لمطابقتها مع الصندوق الفعلي قبل الإغلاق.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50 p-6 rounded-2xl text-center">
                  <span className="block text-xs font-bold text-emerald-600 dark:text-emerald-500 mb-2">إجمالي المبالغ النقدية المقبوضة اليوم</span>
                  <span className="block text-3xl font-black text-emerald-700 dark:text-emerald-400">{cashCollected.toLocaleString()}</span>
                  <span className="block text-xs text-emerald-600/70 mt-2">دينار عراقي</span>
                </div>
                <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50 p-6 rounded-2xl text-center">
                  <span className="block text-xs font-bold text-indigo-600 dark:text-indigo-500 mb-2">إجمالي الدفع الإلكتروني (POS) اليوم</span>
                  <span className="block text-3xl font-black text-indigo-700 dark:text-indigo-400">{posCollected.toLocaleString()}</span>
                  <span className="block text-xs text-indigo-600/70 mt-2">دينار عراقي</span>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl flex items-center justify-between mb-8">
                <span className="text-base font-bold text-slate-600 dark:text-slate-300">إجمالي عدد وصولات القبض المصدرة اليوم:</span>
                <span className="text-2xl font-black text-slate-800 dark:text-white bg-white dark:bg-slate-700 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 shadow-sm">{totalReceipts} وصولات</span>
              </div>

              <div className="space-y-4 md:space-y-0 md:flex gap-4">
                <button
                  onClick={() => handleCloseRegister('confirm')}
                  className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-base font-black transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <CheckCircle2 className="w-6 h-6" />
                  مطابق - تأكيد وإغلاق الصندوق
                </button>
                <button
                  onClick={() => handleCloseRegister('error')}
                  className="w-full md:w-auto px-8 py-4 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 rounded-2xl text-sm font-bold transition-all border border-red-200 dark:border-red-500/20 active:scale-[0.98]"
                >
                  يوجد خطأ بالمطابقة (طلب مراجعة)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- Tab: Comprehensive Reports --- */}
        {activeTab === 'comprehensive_reports' && hasPerm('viewComprehensiveFinancialReports') && (
          <div className="space-y-6 animate-fade-in-up">
            <h3 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-amber-500" />
              التقارير المالية الشاملة والرقابية (الإدارة العليا)
            </h3>

            {/* Filter Bar */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                <Filter className="w-4 h-4 text-amber-500" />
                تصفية وعرض البيانات حسب القطاع:
              </div>
              <select 
                value={reportFilter}
                onChange={(e) => setReportFilter(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white px-4 py-2.5 rounded-xl text-sm font-bold focus:outline-none focus:border-amber-500 min-w-[200px]"
              >
                <option value="الكل">كافة المحافظة (الكل)</option>
                <option value="مركز المحافظة - الجانب الأيسر">مركز المحافظة - الجانب الأيسر</option>
                <option value="مركز المحافظة - الجانب الأيمن">مركز المحافظة - الجانب الأيمن</option>
                <option value="قضاء تلعفر">قضاء تلعفر</option>
                <option value="قضاء الحمدانية">قضاء الحمدانية</option>
              </select>
            </div>

            {/* Comprehensive Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 p-6 rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
                <span className="block text-sm font-bold text-amber-700 dark:text-amber-400 mb-2">الإيرادات المستحصلة (هذا الشهر) - {reportFilter}</span>
                <span className="block text-4xl font-black text-amber-800 dark:text-amber-300 relative z-10">{compMonthlyRevenue.toLocaleString()} <span className="text-sm">د.ع</span></span>
                <div className="mt-4 flex items-center justify-between text-xs font-bold text-amber-600 dark:text-amber-500/80">
                  <span>إجمالي الوصولات المسددة هذا الشهر:</span>
                  <span className="bg-amber-200 dark:bg-amber-500/30 px-2 py-1 rounded-lg">{compMonthlyPaid.length}</span>
                </div>
              </div>

              <div className="bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 p-6 rounded-3xl">
                <span className="block text-sm font-bold text-slate-600 dark:text-slate-400 mb-2">إجمالي الإيرادات التراكمية (منذ الإطلاق) - {reportFilter}</span>
                <span className="block text-4xl font-black text-slate-800 dark:text-white">{compTotalRevenue.toLocaleString()} <span className="text-sm text-slate-500">د.ع</span></span>
                <div className="mt-4 flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
                  <span>إجمالي الوصولات التراكمية:</span>
                  <span className="bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded-lg">{comprehensiveFilteredFines.filter(f => f.paymentStatus === 'paid').length}</span>
                </div>
              </div>
            </div>
            
            {/* Table of Latest Fines in this scope */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
              <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <h4 className="text-sm font-black text-slate-800 dark:text-white">تفاصيل الإيرادات الأخيرة ضمن هذا النطاق</h4>
              </div>
              <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                <table className="w-full text-right border-collapse text-xs font-bold">
                  <thead className="sticky top-0 bg-slate-50 dark:bg-slate-800/90 backdrop-blur-md text-slate-500 border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="p-4">المنشأة</th>
                      <th className="p-4">القطاع</th>
                      <th className="p-4">المبلغ المسدد</th>
                      <th className="p-4">طريقة الدفع</th>
                      <th className="p-4">التاريخ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                    {comprehensiveFilteredFines.filter(f => f.paymentStatus === 'paid').slice(0, 50).map(fine => (
                      <tr key={fine.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20">
                        <td className="p-4 text-slate-800 dark:text-slate-200">{getEstablishmentName(fine.establishmentId || fine.estId)}</td>
                        <td className="p-4 text-teal-600 dark:text-teal-400">{getEstablishmentSector(fine.establishmentId || fine.estId)}</td>
                        <td className="p-4 text-emerald-600 font-black">{fine.amount?.toLocaleString()}</td>
                        <td className="p-4 text-slate-500">{fine.paymentMethod === 'pos' ? 'POS' : 'نقدي'}</td>
                        <td className="p-4 text-slate-500 dir-ltr text-right">{new Date(fine.paymentDate).toLocaleDateString('en-GB')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* Embedded Tabs */}
        {activeTab === 'ext_summary' && (
          <div className="w-full h-full min-h-[85vh]">
            <TeamDashboard embeddedTab="summary" />
          </div>
        )}
        
        {activeTab === 'ext_directory' && (
          <div className="w-full h-full min-h-[85vh]">
            <TeamDashboard embeddedTab="directory" />
          </div>
        )}
        
        {activeTab === 'ext_reports' && (
          <div className="w-full h-full min-h-[85vh]">
            <ExecutivePortal embeddedTab="reports" />
          </div>
        )}
        
        {activeTab === 'ext_map' && (
          <div className="w-full h-full min-h-[85vh]">
            <TeamDashboard embeddedTab="map" />
          </div>
        )}

        {activeTab === 'ext_smart_tasks' && (
          <div className="w-full h-full min-h-[85vh]">
            <TeamDashboard embeddedTab="smart_tasks" />
          </div>
        )}

      </main>
    </div>
  );
};
