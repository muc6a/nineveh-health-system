import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { DollarSign, AlertCircle, CheckCircle2, FileText, Activity } from 'lucide-react';

export const FinancialReports = () => {
  const { penaltyRequests, teams, setPenaltyRequests, notify } = useContext(AppContext);
  const [selectedTeamFilter, setSelectedTeamFilter] = useState('all');

const [showPayModal, setShowPayModal] = useState(false);
  const [payCode, setPayCode] = useState('');
  const [paymentType, setPaymentType] = useState('electronic');
  const [foundFine, setFoundFine] = useState(null);


  
  const handleSearchFine = () => {
    if(!payCode.trim()) return;
    const allFines = penaltyRequests || [];
    // Search for a pending fine for this establishment ID or Name
    const fine = allFines.find(f => (f.establishmentId === payCode || f.establishmentName.includes(payCode)) && f.paymentStatus !== 'paid');
    
    if (fine) {
      setFoundFine(fine);
    } else {
      setFoundFine(null);
      if (notify) notify('لم يتم العثور على غرامات معلقة لهذه المنشأة', 'error');
      else alert('لم يتم العثور على غرامات معلقة');
    }
  };

  const handlePay = () => {
    if(!foundFine) return;
    
    if (setPenaltyRequests) {
      setPenaltyRequests(prev => prev.map(f => {
        if (f.id === foundFine.id) {
          return {
            ...f,
            paymentStatus: 'paid',
            paymentDate: new Date().toISOString(),
            paymentMethod: paymentType
          };
        }
        return f;
      }));
    }
    
    if (notify) notify('تم تسديد الغرامة بنجاح!', 'success');
    else alert('تم تسديد الغرامة بنجاح!');
    
    setShowPayModal(false);
    setPayCode('');
    setFoundFine(null);
    setPaymentType('electronic');
  };


  const allFines = (penaltyRequests || []).filter(r => r.type === 'fine' || r.type === 'closure');
  const fines = selectedTeamFilter === 'all' 
    ? allFines 
    : allFines.filter(f => f.teamId === selectedTeamFilter || f.teamName === selectedTeamFilter);

  const totalCollected = fines.filter(f => f.paymentStatus === 'paid').reduce((sum, f) => sum + (f.amount || 0), 0);
  const totalPending = fines.filter(f => f.paymentStatus !== 'paid').reduce((sum, f) => sum + (f.amount || 0), 0);
  const totalFines = fines.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center border border-emerald-500/20 text-emerald-600">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800 dark:text-white">نظام الرقابة المالي</h2>
            <p className="text-xs font-bold text-slate-500">تقارير الجباية والغرامات الفورية</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          
          <button onClick={() => setShowPayModal(true)} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-md shadow-emerald-500/20">
            <DollarSign className="w-4 h-4" />
            تسديد غرامة
          </button>

          <label className="text-xs font-bold text-slate-500">تصفية حسب الفريق:</label>
          <select 
            value={selectedTeamFilter}
            onChange={(e) => setSelectedTeamFilter(e.target.value)}
            className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold outline-none"
          >
            <option value="all">كل الفرق (الجميع)</option>
            {teams?.map(t => (
              <option key={t.id} value={t.name}>{t.name}</option>
            ))}
          </select>
        </div>
      </div>


{showPayModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2rem] p-6 shadow-2xl">
            <h3 className="text-lg font-black text-slate-800 dark:text-white mb-2">تسديد غرامة فوري</h3>
            <p className="text-xs text-slate-500 mb-4">أدخل كود المنشأة لجلب تفاصيل الغرامة المعلقة وتسديدها</p>
            
            <div className="flex gap-2 mb-4">
              <input 
                type="text" 
                placeholder="كود أو اسم المنشأة..." 
                value={payCode}
                onChange={e => {
                  setPayCode(e.target.value);
                  setFoundFine(null);
                }}
                className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500"
              />
              <button 
                onClick={handleSearchFine}
                className="px-4 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-sm rounded-xl transition-colors"
              >
                بحث
              </button>
            </div>

            {foundFine && (
              <div className="mb-4 p-4 rounded-xl border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-900/10">
                <h4 className="font-black text-emerald-800 dark:text-emerald-400 mb-2">{foundFine.establishmentName}</h4>
                <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300 font-bold">
                  <p>المبلغ المطلوب: <span className="text-red-500 font-black">{(foundFine.amount || 0).toLocaleString()} د.ع</span></p>
                  <p>نوع المخالفة: {foundFine.reason?.replace(/تطبيق كراس الغرامات - |تطبيق كراس الغرامة و |تطبيق كراس الغرامة /g, '') || (foundFine.type === 'closure' ? 'إغلاق وغرامة' : 'غرامة')}</p>
                </div>
                
                <div className="mt-4 pt-3 border-t border-emerald-500/20">
                  <label className="text-xs font-bold text-emerald-700 dark:text-emerald-400 block mb-2">طريقة الدفع:</label>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setPaymentType('electronic')}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold transition-colors ${paymentType === 'electronic' ? 'bg-emerald-500 text-white shadow-md' : 'bg-white dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700'}`}
                    >
                      إلكتروني
                    </button>
                    <button 
                      onClick={() => setPaymentType('manual')}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold transition-colors ${paymentType === 'manual' ? 'bg-emerald-500 text-white shadow-md' : 'bg-white dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700'}`}
                    >
                      يدوي (وصول)
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-2 mt-4">
              <button 
                onClick={() => {
                  setShowPayModal(false);
                  setPayCode('');
                  setFoundFine(null);
                }} 
                className="flex-1 py-3 rounded-xl text-slate-500 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold text-sm"
              >
                إلغاء
              </button>
              <button 
                onClick={handlePay} 
                disabled={!foundFine}
                className="flex-1 py-3 rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                تسديد الآن
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glassmorphic-card p-6 border border-emerald-500/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black text-slate-800 dark:text-white">المبالغ المستحصلة</h3>
            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
          </div>
          <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{totalCollected.toLocaleString()} <span className="text-sm">د.ع</span></p>
        </div>

        <div className="glassmorphic-card p-6 border border-amber-500/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black text-slate-800 dark:text-white">المبالغ المعلقة</h3>
            <AlertCircle className="w-6 h-6 text-amber-500" />
          </div>
          <p className="text-3xl font-black text-amber-600 dark:text-amber-400">{totalPending.toLocaleString()} <span className="text-sm">د.ع</span></p>
        </div>

        <div className="glassmorphic-card p-6 border border-blue-500/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black text-slate-800 dark:text-white">إجمالي الغرامات والإغلاقات</h3>
            <FileText className="w-6 h-6 text-blue-500" />
          </div>
          <p className="text-3xl font-black text-blue-600 dark:text-blue-400">{totalFines}</p>
        </div>
      </div>

      <div className="glassmorphic-card p-6 mt-8 overflow-x-auto">
        <h3 className="text-sm font-black text-slate-800 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">السجل التفصيلي للمنوضات المالية</h3>
        <table className="w-full text-right text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">
              <th className="pb-3 px-2 font-bold">المنشأة</th>
              <th className="pb-3 px-2 font-bold">نوع الغرامة</th>
              <th className="pb-3 px-2 font-bold">المبلغ (د.ع)</th>
              <th className="pb-3 px-2 font-bold">حالة الدفع</th>
              <th className="pb-3 px-2 font-bold">تاريخ إصدار المخالفة</th>
              <th className="pb-3 px-2 font-bold">تاريخ التسديد</th>
              <th className="pb-3 px-2 font-bold">نوع الدفع</th>
                          </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
            {fines.length > 0 ? fines.map((fine, idx) => (
              <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                <td className="py-4 px-2 font-black text-slate-700 dark:text-slate-300">{fine.establishmentName}</td>
                <td className="py-4 px-2 text-slate-600 dark:text-slate-400">{fine.reason?.replace(/تطبيق كراس الغرامات - |تطبيق كراس الغرامة و |تطبيق كراس الغرامة /g, '') || (fine.type === 'closure' ? 'إغلاق وغرامة' : 'غرامة')}</td>
                <td className="py-4 px-2 font-black text-red-500">{(fine.amount || 0).toLocaleString()}</td>
                <td className="py-4 px-2">
                  {fine.paymentStatus === 'paid' ? (
                    <span className="px-2 py-1 rounded-lg bg-emerald-100 text-emerald-700 font-bold text-[10px]">مسدد</span>
                  ) : (
                    <span className="px-2 py-1 rounded-lg bg-amber-100 text-amber-700 font-bold text-[10px]">قيد الانتظار</span>
                  )}
                </td>
                <td className="py-4 px-2 text-slate-500">{fine.timestamp ? new Date(fine.timestamp).toLocaleDateString('en-GB') : (fine.date ? new Date(fine.date).toLocaleDateString('en-GB') : '---')}</td>
                <td className="py-4 px-2 text-slate-500">
                  {fine.paymentDate ? (
                    <div className="flex flex-col gap-1">
                      <span>{new Date(fine.paymentDate).toLocaleDateString('en-GB')}</span>
                      <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold w-fit">
                        {Math.ceil(Math.abs(new Date(fine.paymentDate) - new Date(fine.timestamp || fine.date || fine.paymentDate)) / (1000 * 60 * 60 * 24)) === 0 ? 'بنفس اليوم' : `${Math.ceil(Math.abs(new Date(fine.paymentDate) - new Date(fine.timestamp || fine.date || fine.paymentDate)) / (1000 * 60 * 60 * 24))} يوم تأخير`}
                      </span>
                    </div>
                  ) : '---'}
                </td>
                <td className="py-4 px-2 font-bold text-slate-600 dark:text-slate-400">
                  {fine.paymentMethod === 'electronic' ? 'إلكتروني' : fine.paymentMethod === 'manual' ? 'يدوي' : '---'}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" className="py-12 text-center text-slate-500">لا توجد غرامات مسجلة حالياً.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
