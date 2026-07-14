import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { AnimatedLogo } from '../components/AnimatedLogo';
import { ThemeToggle } from '../components/ThemeToggle';
import { Plus, Search, FileText, LayoutDashboard, Database, AlertCircle, X, Check, Eye, Package, Trash, Printer } from 'lucide-react';
import { NinevehMap } from '../components/NinevehMap';
import { EstablishmentModal } from '../components/EstablishmentModal';

export const TeamDashboard = () => {
  const { navigate, establishments, addEstablishment, updateEstablishment, deleteEstablishment, reports, user, setUser, teams, directives, logAudit } = useContext(AppContext);
  
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
  const [activeTab, setActiveTab] = useState(getInitialTab());
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterExpiredOnly, setFilterExpiredOnly] = useState(false);
  
  // Modal toggles
  const [establishmentModalState, setEstablishmentModalState] = useState({ isOpen: false, mode: 'add', data: null });
  const [showMetricModal, setShowMetricModal] = useState(false);
  const [metricModalType, setMetricModalType] = useState('all');
  
  // Selected establishment for inline edits
  const [selectedEstDetails, setSelectedEstDetails] = useState(null);

  // Justification Modal for edits
  const [showJustificationModal, setShowJustificationModal] = useState(false);
  const [editJustification, setEditJustification] = useState('');
  const [pendingEditData, setPendingEditData] = useState(null);

  // User's assigned sector (default to 'الجانب الأيمن' if user isn't logged in correctly)
  const userSector = user?.sector || 'الجانب الأيمن';

  // Filter establishments based on team's sector
  const teamEstablishments = establishments.filter(e => e.sector === userSector);

  // Dynamic list of establishments matching selected metric category modal
  const modalEstList = teamEstablishments.filter(e => {
    if (metricModalType === 'inspected') return e.lastInspection !== 'لم يزر بعد';
    if (metricModalType === 'uninspected') return e.lastInspection === 'لم يزر بعد';
    return true;
  });

  const isLicenseExpired = (est) => {
    return est.licenseNumber.includes('Z') || est.licenseNumber.includes('F') || est.licenseNumber.includes('W') || est.licenseNumber.includes('3');
  };

  // Filter based on search term and expired license filter
  const filteredEstablishments = teamEstablishments.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          e.owner.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesExpired = filterExpiredOnly ? isLicenseExpired(e) : true;
    return matchesSearch && matchesExpired;
  });

  // Filter reports submitted to team's sector
  const teamReports = reports.filter(r => r.sector === userSector);

  // Filter directives directed to this team's sector or teamId
  const myDirectives = (directives || []).filter(d => {
    if (user?.id && d.teamId === user.id) return true;
    const targetTeam = teams.find(t => t.id === d.teamId);
    return targetTeam?.sector === userSector;
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
    } else {
      updateEstablishment(data.id, data);
      logAudit('تحديث بيانات منشأة', data.id, establishmentModalState.data, data, 'تعديل البيانات الأساسية', user);
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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300">
      
      {/* Fixed Sticky Sidebar */}
      <aside className="w-80 shrink-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-lg border-l border-slate-200/50 dark:border-slate-800/50 p-4 flex flex-col justify-between hidden md:flex sticky top-0 h-screen">
        <div>
          <AnimatedLogo variant="sidebar" className="mb-6" />

          <div className="space-y-1 mb-6">
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block px-3 mb-2">
              لوحة تحكم اللجنة الرقابية
            </span>
            {hasPerm('showMainDashboard') && (
              <button
                onClick={() => setActiveTab('summary')}
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
                onClick={() => setActiveTab('directory')}
                className={`w-full text-right px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center gap-3 ${
                  activeTab === 'directory'
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-500/10'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                }`}
              >
                <Database className="w-4.5 h-4.5" />
                <span>🍽️ دليل مطاعم ومنشآت المنطقة</span>
              </button>
            )}

            {hasPerm('showReportsPage') && (
              <button
                onClick={() => setActiveTab('reports')}
                className={`w-full text-right px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center justify-between ${
                  activeTab === 'reports'
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-500/10'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-4.5 h-4.5" />
                  <span>📑 التقارير الجغرافية</span>
                </div>
              </button>
            )}

            {hasPerm('showDirectivesPage') && (
              <button
                onClick={() => setActiveTab('directives')}
                className={`w-full text-right px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center justify-between ${
                  activeTab === 'directives'
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-500/10'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-4.5 h-4.5" />
                  <span>📦 صندوق البلاغات</span>
                </div>
                {teamReports.length > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
                    activeTab === 'directives' ? 'bg-white text-teal-700' : 'bg-red-500 text-white'
                  }`}>
                    {teamReports.length}
                  </span>
                )}
              </button>
            )}

            {hasPerm('showDeliveryPage') && (
              <button
                onClick={() => setActiveTab('delivery')}
                className={`w-full text-right px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center gap-3 ${
                  activeTab === 'delivery'
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-500/10'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                }`}
              >
                <Package className="w-4.5 h-4.5" />
                <span>🚚 خدمة التوصيل</span>
              </button>
            )}

            {hasPerm('showPublicEvalsPage') && (
              <button
                onClick={() => setActiveTab('public_evals')}
                className={`w-full text-right px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center gap-3 ${
                  activeTab === 'public_evals'
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-500/10'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                }`}
              >
                <CheckSquare className="w-4.5 h-4.5" />
                <span>⭐ التقييمات العامة</span>
              </button>
            )}
          </div>
        </div>

        {/* User context footer */}
        <div className="pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col text-right">
              <span className="text-xs font-black text-slate-700 dark:text-slate-300">{user?.name || 'مفتش الرقابة الميداني'}</span>
              <span className="text-[10px] text-teal-600 dark:text-teal-400 font-bold">قطاع: {userSector}</span>
            </div>
            <ThemeToggle />
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
          <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold text-slate-650 dark:text-slate-350">
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-850 px-2.5 py-1 rounded-xl">
              <span>📅 {new Date().toLocaleDateString('ar-IQ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              <span className="text-slate-300">|</span>
              <span>⏰ {new Date().toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className="flex items-center gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2.5 py-1 rounded-xl border border-amber-500/20">
              <span> Mosul الطقس في الموصل: 38°C مشمس ☀️</span>
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
        <div className="md:hidden flex items-center justify-between p-4 mb-6 glassmorphic-card rounded-2xl">
          <AnimatedLogo variant="sidebar" className="border-none p-0" />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button onClick={handleLogout} className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl">
              <span>خروج</span>
            </button>
          </div>
        </div>

        {/* Tab A: Summary Dashboard */}
        {activeTab === 'summary' && hasPerm('showMainDashboard') && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white">ملخص المهام والمناطق الغذائية للجنة</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">تتبع التغطية الرقابية والجولات الاستقصائية لقطاع {userSector}</p>
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
                <p className="text-4xl font-extrabold text-teal-600 dark:text-teal-400 mt-3">{totalShops}</p>
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

            {/* Close-up Interactive Map of Sector */}
            <div className="glassmorphic-card p-5 mt-6">
              <NinevehMap
                establishments={establishments}
                isTeamView={true}
                teamSector={userSector}
              />
            </div>

            {/* Target States */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="glassmorphic-card p-5">
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2.5 mb-3">
                  أحياء وشوارع تم زيارتها بنجاح 🟢
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {visitedStreets.length > 0 ? visitedStreets.map((street, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-xl text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      <Check className="w-4 h-4 shrink-0" />
                      <span>{street}</span>
                    </div>
                  )) : <p className="text-xs text-slate-400">لم يتم إتمام أي زيارات بعد لهذا الشهر.</p>}
                </div>
              </div>

              <div className="glassmorphic-card p-5">
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2.5 mb-3">
                  أحياء وشوارع بانتظار الجولة الرقابية الفورية 🔴
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {pendingStreets.length > 0 ? pendingStreets.map((street, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 bg-red-500/5 dark:bg-red-950/20 rounded-xl text-xs font-bold text-red-500">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{street}</span>
                    </div>
                  )) : <p className="text-xs text-slate-400">كافة المنشآت مغطاة بنجاح 100%.</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab B: Directory */}
        {activeTab === 'directory' && hasPerm('manageEstablishments') && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white">دليل مطاعم ومنشآت قطاع {userSector}</h2>
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
                    : 'bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <span>⚠️ تصفية الإجازات المنتهية / القريبة</span>
                {filterExpiredOnly && <span className="w-2 h-2 rounded-full bg-white animate-pulse" />}
              </button>

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
            <div className="glassmorphic-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                      <th className="p-4 font-bold">اسم المطعم / المنشأة</th>
                      <th className="p-4 font-bold">نوع النشاط</th>
                      <th className="p-4 font-bold">المالك</th>
                      <th className="p-4 font-bold">تاريخ آخر زيارة</th>
                      <th className="p-4 font-bold">التقييم الحالي</th>
                      <th className="p-4 font-bold text-center">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                    {filteredEstablishments.map((est) => (
                      <tr key={est.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors">
                        <td className="p-4 font-black text-slate-800 dark:text-slate-200">{est.name}</td>
                        <td className="p-4 font-bold text-slate-600 dark:text-slate-300">{est.type}</td>
                        <td className="p-4">{est.owner}</td>
                        <td className="p-4">{est.lastInspection}</td>
                        <td className="p-4">{est.score}%</td>
                        <td className="p-4 flex gap-2 justify-center">
                          {hasPerm('manageEstablishments') && (
                            <>
                              <button
                                onClick={() => setEstablishmentModalState({ isOpen: true, mode: 'edit', data: est })}
                                className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 transition-colors"
                                title="تعديل المنشأة"
                              >
                                <FileText className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (window.confirm('هل أنت متأكد من حذف هذه المنشأة بشكل نهائي؟')) {
                                    logAudit('حذف منشأة', est.id, est, null, 'إزالة نهائية', user);
                                    deleteEstablishment(est.id);
                                  }
                                }}
                                className="p-1.5 rounded-lg bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-colors"
                                title="حذف المنشأة"
                              >
                                <Trash className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
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
                  <h3 className="text-xs font-black text-teal-700 dark:text-teal-400 flex items-center gap-1.5">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700/60 p-6 rounded-3xl text-white shadow-2xl relative text-right max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-800 mb-4">
              <h3 className="text-sm font-black text-teal-400">🔗 رمز الاستجابة السريعة QR وتفاصيل المنشأة</h3>
              <button 
                onClick={() => setSelectedEstDetails(null)} 
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-850 border border-slate-800 text-right space-y-1.5">
                <span className="text-[10px] text-teal-400 block font-black uppercase">البيانات الرسمية للمنشأة</span>
                <h4 className="text-sm font-black text-white">{selectedEstDetails.name}</h4>
                <p className="text-[10.5px] text-slate-300">النشاط: <strong className="text-slate-100">{selectedEstDetails.type}</strong></p>
                <p className="text-[10.5px] text-slate-300">المالك: <strong className="text-slate-100">{selectedEstDetails.owner}</strong></p>
                <p className="text-[10.5px] text-slate-300">رقم الهاتف: <strong className="text-slate-100">{selectedEstDetails.phone}</strong></p>
                <p className="text-[10.5px] text-slate-300">الترخيص: <strong className="text-slate-100">{selectedEstDetails.licenseNumber}</strong></p>
                <p className="text-[10.5px] text-slate-300">آخر زيارة تفتيش: <strong className="text-slate-200">{selectedEstDetails.lastInspection}</strong></p>
                <p className="text-[10.5px] text-slate-300">التقييم: <strong className={selectedEstDetails.score >= 90 ? 'text-teal-400' : 'text-amber-500'}>{selectedEstDetails.lastInspection === 'لم يزر بعد' ? 'معلق' : `${selectedEstDetails.score}%`}</strong></p>
              </div>

              {/* QR Preview Box */}
              <div className="flex flex-col items-center justify-center p-6 bg-white rounded-3xl border border-slate-700 shadow-inner">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`${window.location.origin}/scan/${selectedEstDetails.id}`)}`}
                  alt="Restaurant QR Code"
                  className="w-48 h-48 block border border-slate-100 shadow-sm rounded-lg"
                />
                <span className="text-[10px] text-slate-500 font-extrabold mt-3 text-center block">
                  كود QR الموحد للمنشأة (يعرض التقييم الصحي ويمكن المواطن من الإبلاغ)
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <a
                  href={`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(`${window.location.origin}/scan/${selectedEstDetails.id}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-center font-black block transition-all active:scale-[0.98]"
                >
                  📥 تحميل الصورة
                </a>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-center font-black block transition-all active:scale-[0.98]"
                >
                  🖨️ طباعة ملصق الباركود
                </button>
              </div>

              <button
                type="button"
                onClick={() => setSelectedEstDetails(null)}
                className="mt-4 w-full py-2.5 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-400 font-extrabold transition-all"
              >
                إغلاق وخروج
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Justification Modal */}
      {showJustificationModal && pendingEditData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
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
                className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 outline-none text-xs font-bold focus:border-amber-500 mb-4"
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

    </div>
  );
};

export default TeamDashboard;
