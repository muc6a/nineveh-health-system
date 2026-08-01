// Trigger Vercel deploy
import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { AlertTriangle } from 'lucide-react';

export const CriticalAlertModal = () => {
  const { user, penaltyRequests, setPenaltyRequests, notify, addSystemNotification, setEstablishments } = useContext(AppContext);

  // This modal only shows for central_director
  if (user?.role !== 'central_director') return null;

  // Find all pending penalty requests
  const pendingRequests = penaltyRequests.filter(req => req.status === 'pending');
  const pendingPenalty = pendingRequests[0];

  if (!pendingPenalty) return null;

  const handleApprove = () => {
    // Keep it in history but mark as approved
    setPenaltyRequests(prev => prev.map(r => r.id === pendingPenalty.id ? { ...r, status: 'approved' } : r));
    
    if (pendingPenalty.type === 'closure') {
      setEstablishments(prev => prev.map(est => 
        est.id === pendingPenalty.estId ? { ...est, status: 'closed' } : est
      ));
    }

    notify(`تم المصادقة على ${pendingPenalty.type === 'fine' ? 'الغرامة' : 'الإغلاق'} للمطعم ${pendingPenalty.estName} بنجاح.`, 'success', true);
    addSystemNotification(
      'تمت المصادقة على العقوبة',
      `قامت إدارة الرقابة المركزية بالمصادقة على ${pendingPenalty.type === 'fine' ? 'الغرامة' : 'الإغلاق'} لمطعم ${pendingPenalty.estName} بناءً على طلب ${pendingPenalty.teamName}.`,
      'all'
    );
  };

  const handleReject = () => {
    setPenaltyRequests(prev => prev.map(r => r.id === pendingPenalty.id ? { ...r, status: 'rejected' } : r));
    notify(`تم رفض طلب ${pendingPenalty.type === 'fine' ? 'الغرامة' : 'الإغلاق'}`, 'info', true);
    addSystemNotification(
      'رفض طلب العقوبة',
      `تم رفض طلب ${pendingPenalty.type === 'fine' ? 'الغرامة' : 'الإغلاق'} الخاص بمطعم ${pendingPenalty.estName} من قبل الرقابة المركزية.`,
      'all'
    );
  };

  return (
    <div className="fixed inset-0 bg-red-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-lg w-full text-center border-4 border-red-500 shadow-2xl shadow-red-500/20 animate-pulse-slow">
        <div className="w-20 h-20 bg-red-500 rounded-full mx-auto flex items-center justify-center mb-6 animate-bounce">
          <AlertTriangle className="w-10 h-10 text-white" />
        </div>
        
        <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">
          طلب {pendingPenalty.type === 'fine' ? 'غرامة مالية' : 'إغلاق وتشميع'} عاجل!
        </h2>
        {pendingRequests.length > 1 && (
          <div className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 text-sm font-bold px-3 py-1 rounded-full inline-block mb-2">
            يوجد {pendingRequests.length} طلبات قيد الانتظار
          </div>
        )}
        
        <p className="text-slate-600 dark:text-slate-300 mb-6 font-bold leading-relaxed">
          قام الفريق الميداني <span className="text-red-500">({pendingPenalty.teamName})</span> للتو برفع طلب عاجل:
          <br/>
          <span className="text-xl text-red-600 dark:text-red-400 font-black inline-block mt-4 mb-2">
            {pendingPenalty.estName}
          </span>
          <br/>
          السبب: {pendingPenalty.reason}
        </p>

        <h3 className="text-sm font-bold text-slate-500 mb-4">هل توافق على مصادقة هذا الإجراء وتفعيله قانونياً؟</h3>

        <div className="flex gap-3">
          <button 
            onClick={handleApprove}
            className="flex-1 py-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-lg transition-all shadow-lg"
          >
            نعم، أصادق
          </button>
          <button 
            onClick={handleReject}
            className="flex-1 py-4 rounded-2xl border-2 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-black text-lg transition-all"
          >
            لا، رفض
          </button>
        </div>
      </div>
    </div>
  );
};
