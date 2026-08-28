import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { ThemeToggle } from '../components/ThemeToggle';
import { WeatherWidget } from '../components/WeatherWidget';
import { NotificationBell } from '../components/NotificationBell';
import { AnimatedLogo } from '../components/AnimatedLogo';
import { LogOut, DollarSign, Activity, FileText, CheckCircle2, ShieldAlert, BadgeInfo, BellRing, Sun, Moon, Cloud, ChevronLeft, CreditCard, Banknote, Search, AlertCircle, Eye, ClipboardList, Menu, LayoutDashboard, Printer } from 'lucide-react';

export const AccountantPanel = () => {
  const { user, setUser, navigate, notify, darkMode, penaltyRequests, setPenaltyRequests, establishments, setShowDisplayPrefsModal, uiPreferences } = useContext(AppContext);

  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'reconciliation'
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedFine, setSelectedFine] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cash'); // 'cash' or 'pos'
  const [receiptNumber, setReceiptNumber] = useState('');

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

  const allFines = (penaltyRequests || []).filter(r => r.type === 'fine' || r.type === 'closure');
  
  const sectorFines = allFines.filter(f => {
    if (targetSector === 'الكل') return true;
    const estSector = getEstablishmentSector(f.establishmentId);
    return estSector === targetSector || estSector.includes(targetSector);
  });

  const pendingFines = sectorFines.filter(f => f.paymentStatus !== 'paid');
  const paidFines = sectorFines.filter(f => f.paymentStatus === 'paid');

  // Reconciliation stats for TODAY
  const today = new Date().toDateString();
  const todayPaidFines = paidFines.filter(f => new Date(f.paymentDate).toDateString() === today);
  const cashCollected = todayPaidFines.filter(f => f.paymentMethod === 'cash').reduce((sum, f) => sum + (f.amount || 0), 0);
  const posCollected = todayPaidFines.filter(f => f.paymentMethod === 'pos').reduce((sum, f) => sum + (f.amount || 0), 0);
  const totalReceipts = todayPaidFines.length;

  const handleOpenPayment = (fine) => {
    setSelectedFine(fine);
    setPaymentMethod('cash');
    setReceiptNumber('');
    setShowPaymentModal(true);
  };

  const submitPayment = () => {
    if (!selectedFine) return;
    
    setPenaltyRequests(prev => prev.map(req => {
      if (req.id === selectedFine.id) {
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
    setShowPaymentModal(false);
    setSelectedFine(null);
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

      {/* Fixed Sticky Sidebar (Matches TeamDashboard exactly) */}
      <aside className={`w-80 shrink-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl md:bg-white/60 md:dark:bg-slate-900/60 border-l border-slate-200/50 dark:border-slate-800/50 p-4 flex flex-col justify-between fixed md:sticky top-0 h-screen z-50 transition-transform duration-300 ${
        isSidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
      } right-0`}>
        <div>
          <AnimatedLogo variant="sidebar" className="mb-6" />

          <div className="space-y-1 mb-6">
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block px-3 mb-2">
              لوحة تحكم الإدارة المالية
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
              <span>الرئيسية وقائمة الغرامات</span>
            </button>
            
            {hasPerm('viewFinancialReports') && (
              <button
                onClick={() => { setActiveTab('reconciliation'); setIsSidebarOpen(false); }}
                className={`w-full text-right px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center gap-3 ${
                  activeTab === 'reconciliation'
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-500/10'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                }`}
              >
                <ClipboardList className="w-4.5 h-4.5" />
                <span>إغلاق الصندوق / جرد اليومية</span>
              </button>
            )}
          </div>
        </div>

        {/* User context footer */}
        <div className="pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col text-right">
              <span className="text-xs font-black text-slate-700 dark:text-slate-300">{user?.name || 'سيدي المحاسب'}</span>
              <span className="text-[10px] text-teal-600 dark:text-teal-400 font-bold">محاسب {targetSector}</span>
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
        
        {/* Welcome Headers with Date/Time and Mosul Weather (Matches TeamDashboard exactly) */}
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
                title="تخصيص العرض والمظهر"
              >
                <Eye className="w-4 h-4 group-hover:text-teal-500 transition-colors" />
              </button>
              <NotificationBell />
              <ThemeToggle />
          </div>
        </div>

        {/* Dashboard Content */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                قائمة الغرامات المعلقة للقطاع
              </h2>
              <div className="px-2.5 py-1 bg-red-500 text-white rounded-lg text-[10px] font-black shadow-sm shadow-red-500/20">
                {pendingFines.length} غرامة معلقة
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
              {pendingFines.length === 0 ? (
                <div className="p-12 text-center">
                  <CheckCircle2 className="w-16 h-16 text-emerald-500/20 mx-auto mb-4" />
                  <h3 className="text-lg font-black text-slate-800 dark:text-slate-200 mb-2">لا توجد غرامات معلقة!</h3>
                  <p className="text-slate-500 text-sm">جميع غرامات قطاعك تم تسديدها أو لا توجد مخالفات مسجلة.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-right border-collapse text-xs font-bold">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500">
                        <th className="p-4">المنشأة المخالفة</th>
                        <th className="p-4">القطاع</th>
                        <th className="p-4">نوع المخالفة</th>
                        <th className="p-4">المبلغ (د.ع)</th>
                        <th className="p-4">تاريخ الغرامة</th>
                        <th className="p-4 text-center">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                      {pendingFines.map(fine => (
                        <tr key={fine.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                          <td className="p-4 text-slate-800 dark:text-slate-200">{fine.establishmentName}</td>
                          <td className="p-4 text-teal-600 dark:text-teal-400">{getEstablishmentSector(fine.establishmentId)}</td>
                          <td className="p-4 text-slate-600 dark:text-slate-400">{fine.reason}</td>
                          <td className="p-4 text-red-600 font-black">{fine.amount?.toLocaleString()}</td>
                          <td className="p-4 text-slate-500 dir-ltr text-right">{new Date(fine.date).toLocaleDateString('en-GB')}</td>
                          <td className="p-4 text-center">
                            {hasPerm('confirmReceipt') ? (
                              <button
                                onClick={() => handleOpenPayment(fine)}
                                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-black transition-colors shadow-sm shadow-emerald-500/20"
                              >
                                قبض وتسديد
                              </button>
                            ) : (
                              <span className="text-[10px] text-slate-400 font-bold">لا تملك صلاحية تأكيد القبض</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Reconciliation Content */}
        {activeTab === 'reconciliation' && hasPerm('viewFinancialReports') && (
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

      </main>

      {/* Payment Modal */}
      {showPaymentModal && selectedFine && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 p-6 rounded-3xl shadow-2xl relative text-right">
            <h3 className="text-lg font-black text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-500" />
              تسجيل تسديد الغرامة
            </h3>
            
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl mb-6 border border-slate-100 dark:border-slate-800">
              <p className="text-xs text-slate-500 font-bold mb-1">المنشأة</p>
              <p className="text-sm font-black text-slate-800 dark:text-slate-200 mb-3">{selectedFine.establishmentName}</p>
              
              <p className="text-xs text-slate-500 font-bold mb-1">المبلغ المطلوب</p>
              <p className="text-xl font-black text-red-600">{selectedFine.amount?.toLocaleString()} د.ع</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-2">طريقة الدفع</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setPaymentMethod('cash')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all font-bold text-xs ${
                      paymentMethod === 'cash' 
                        ? 'border-teal-500 bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400' 
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Banknote className="w-6 h-6" />
                    نقدي (كاش)
                  </button>
                  <button
                    onClick={() => setPaymentMethod('pos')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all font-bold text-xs ${
                      paymentMethod === 'pos' 
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400' 
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <CreditCard className="w-6 h-6" />
                    إلكتروني (POS)
                  </button>
                </div>
              </div>

              {hasPerm('enterReceiptNumber') && (
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-2">رقم الوصل (اختياري)</label>
                  <input
                    type="text"
                    value={receiptNumber}
                    onChange={(e) => setReceiptNumber(e.target.value)}
                    placeholder="أدخل رقم الوصل للتوثيق"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white px-4 py-3 rounded-xl text-sm font-bold focus:outline-none focus:border-teal-500 transition-colors"
                  />
                </div>
              )}
            </div>

            <div className="mt-8 flex gap-3 flex-wrap">
              <button
                onClick={submitPayment}
                className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-black transition-colors shadow-lg shadow-emerald-500/20"
              >
                تأكيد القبض والتسديد
              </button>
              {hasPerm('printReceiptA4') && (
                <button
                  onClick={() => notify('جاري التجهيز لطباعة الوصل A4...', 'info')}
                  className="px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs font-black transition-colors shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                >
                  <Printer className="w-4 h-4" /> طباعة A4
                </button>
              )}
              <button
                onClick={() => setShowPaymentModal(false)}
                className="w-full md:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold transition-colors"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
