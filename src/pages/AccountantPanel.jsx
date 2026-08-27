import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { ThemeToggle } from '../components/ThemeToggle';
import { LogOut, DollarSign, Activity, FileText, CheckCircle2, ShieldAlert, BadgeInfo, BellRing, Sun, Moon, Cloud, ChevronLeft, CreditCard, Banknote, Search, AlertCircle, Eye, ClipboardList } from 'lucide-react';
import { NINEVEH_GEOGRAPHY } from '../utils/constants';

export const AccountantPanel = () => {
  const { user, setUser, navigate, notify, darkMode, penaltyRequests, setPenaltyRequests, establishments } = useContext(AppContext);

  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'reconciliation'
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedFine, setSelectedFine] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cash'); // 'cash' or 'pos'
  const [receiptNumber, setReceiptNumber] = useState('');

  const [showReconciliationModal, setShowReconciliationModal] = useState(false);

  const targetSector = user?.linkedTeamSector || user?.sector || 'الكل';

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

    notify('تم قبض المبلغ وتسجيل التسديد بنجاح!', 'success');
    setShowPaymentModal(false);
    setSelectedFine(null);
  };

  const handleCloseRegister = (status) => {
    if (status === 'confirm') {
      notify('تم تأكيد صحة الجرد وإغلاق الصندوق بنجاح', 'success');
    } else {
      notify('تم تسجيل وجود خطأ وتم رفع طلب مراجعة للتدقيق', 'warning');
    }
    setShowReconciliationModal(false);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'} font-sans dir-rtl flex transition-colors duration-300`}>
      {/* Sidebar */}
      <aside className={`w-64 fixed inset-y-0 right-0 z-50 flex flex-col ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'} border-l transition-colors duration-300`}>
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-center gap-3">
          <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-teal-500/20">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-black text-sm">منظومة الرقابة الصحية</h2>
            <p className="text-[10px] text-teal-600 dark:text-teal-400 font-bold">بوابة الإدارة المالية</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'dashboard' 
                ? 'bg-teal-500 text-white shadow-md shadow-teal-500/20' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Activity className="w-4 h-4" />
            الرئيسية والغرامات
          </button>
          
          <button
            onClick={() => setShowReconciliationModal(true)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800`}
          >
            <ClipboardList className="w-4 h-4" />
            إغلاق الصندوق / جرد اليومية
          </button>
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-center">
          <div className="mb-3">
            <span className="text-[10px] font-bold text-slate-500 block mb-1">القطاع المالي</span>
            <span className="text-xs font-black text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20 px-3 py-1.5 rounded-lg inline-block border border-teal-100 dark:border-teal-800/50">
              محاسب {targetSector}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 rounded-xl transition-colors cursor-pointer text-xs font-bold"
          >
            <LogOut className="w-4 h-4" />
            تسجيل خروج
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 mr-64">
        {/* Header */}
        <header className={`${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-200'} border-b sticky top-0 z-40 backdrop-blur-md px-6 py-4 flex justify-between items-center transition-colors duration-300`}>
          <div>
            <h1 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-2">
              الرئيسية 
              <span className="text-sm font-bold text-slate-400 hidden md:inline">| لوحة التحكم المالي</span>
            </h1>
            <p className="text-xs text-slate-500 font-bold mt-1">مرحباً بك مجدداً، {user?.name}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
              <Cloud className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">22° مشمس</span>
            </div>
            <button className="relative p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              <BellRing className="w-4.5 h-4.5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <ThemeToggle />
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6 max-w-7xl mx-auto space-y-6">
          
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
                          <button
                            onClick={() => handleOpenPayment(fine)}
                            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-black transition-colors shadow-sm shadow-emerald-500/20"
                          >
                            قبض وتسديد
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Payment Modal */}
      {showPaymentModal && selectedFine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm">
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
            </div>

            <div className="mt-8 flex gap-3">
              <button
                onClick={submitPayment}
                className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-black transition-colors shadow-lg shadow-emerald-500/20"
              >
                قبض المبلغ وتسجيل التسديد
              </button>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold transition-colors"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reconciliation Modal */}
      {showReconciliationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 p-6 rounded-3xl shadow-2xl relative text-right">
            <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2 flex items-center gap-2">
              <ClipboardList className="w-6 h-6 text-indigo-500" />
              جرد اليومية والمطابقة
            </h3>
            <p className="text-xs text-slate-500 font-bold mb-6">ملخص الإيرادات المالية لهذا اليوم لمطابقتها مع الصندوق قبل الإغلاق.</p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50 p-4 rounded-2xl text-center">
                <span className="block text-[10px] font-bold text-emerald-600 dark:text-emerald-500 mb-1">إجمالي المبالغ النقدية</span>
                <span className="block text-xl font-black text-emerald-700 dark:text-emerald-400">{cashCollected.toLocaleString()}</span>
                <span className="block text-[10px] text-emerald-600/70 mt-1">دينار عراقي</span>
              </div>
              <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50 p-4 rounded-2xl text-center">
                <span className="block text-[10px] font-bold text-indigo-600 dark:text-indigo-500 mb-1">إجمالي الدفع الإلكتروني (POS)</span>
                <span className="block text-xl font-black text-indigo-700 dark:text-indigo-400">{posCollected.toLocaleString()}</span>
                <span className="block text-[10px] text-indigo-600/70 mt-1">دينار عراقي</span>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl flex items-center justify-between mb-8">
              <span className="text-sm font-bold text-slate-600 dark:text-slate-300">إجمالي عدد وصولات القبض المصدرة:</span>
              <span className="text-lg font-black text-slate-800 dark:text-white bg-white dark:bg-slate-700 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-600 shadow-sm">{totalReceipts}</span>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => handleCloseRegister('confirm')}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-black transition-colors shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                تأكيد صحة الجرد وإغلاق الصندوق
              </button>
              <div className="flex gap-3">
                <button
                  onClick={() => handleCloseRegister('error')}
                  className="flex-1 py-3 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 rounded-xl text-xs font-bold transition-colors border border-red-200 dark:border-red-500/20"
                >
                  يوجد خطأ / طلب مراجعة وتعديل
                </button>
                <button
                  onClick={() => setShowReconciliationModal(false)}
                  className="px-6 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold transition-colors"
                >
                  رجوع
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
