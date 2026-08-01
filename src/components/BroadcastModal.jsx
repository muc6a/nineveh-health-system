import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

export const BroadcastModal = () => {
  const { globalBroadcast, setGlobalBroadcast, user } = useContext(AppContext);

  if (!globalBroadcast?.active || !user) return null;

  // If the user has already acknowledged this broadcast, don't show it
  if (globalBroadcast.acknowledgedBy?.includes(user.id || user.email)) return null;

  const handleAcknowledge = () => {
    setGlobalBroadcast(prev => ({
      ...prev,
      acknowledgedBy: [...(prev.acknowledgedBy || []), (user.id || user.email)]
    }));
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-red-950/90 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl p-8 border-4 border-red-500 shadow-2xl relative text-center flex flex-col items-center">
        
        <div className="w-24 h-24 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center mb-6 animate-pulse">
          <AlertTriangle className="w-12 h-12 text-red-600 dark:text-red-500" />
        </div>
        
        <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-2 tracking-tight">
          إنذار عاجل وإلزامي
        </h2>
        <p className="text-sm font-bold text-red-600 dark:text-red-400 mb-8 uppercase tracking-widest">
          صادر من: {globalBroadcast.sender || 'مدير الموقع'}
        </p>
        
        <div className="w-full bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-2xl p-6 mb-8 text-right">
          <p className="text-lg font-bold text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
            {globalBroadcast.message}
          </p>
        </div>

        <button
          onClick={handleAcknowledge}
          className="w-full sm:w-auto px-12 py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-red-600/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
        >
          <CheckCircle2 className="w-6 h-6" />
          <span>تم استلام وتأكيد التبليغ</span>
        </button>

        <p className="text-xs text-slate-400 mt-6 font-bold">
          * لا يمكنك الاستمرار باستخدام المنظومة حتى تقوم بتأكيد استلامك لهذا التعميم.
        </p>

      </div>
    </div>
  );
};
