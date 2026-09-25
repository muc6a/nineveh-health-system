import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { CheckCircle, Send, AlertCircle } from 'lucide-react';

export default function SmartTasks() {
  const { hasPerm, user, establishments, teams, notify, addSystemNotification, setDispatches } = useContext(AppContext);
  const [selectedEstId, setSelectedEstId] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState('');

  // Smart Auto-Routing: Auto-select team based on establishment's sector
  React.useEffect(() => {
    if (selectedEstId && establishments && teams) {
      const est = establishments.find(e => e.id === selectedEstId);
      if (est && est.sector) {
        // Try to find a matching team by sector
        const matchedTeam = teams.find(t => 
           (t.name && t.name.includes(est.sector)) || 
           (t.sector && t.sector === est.sector) ||
           (t.sector && est.sector.includes(t.sector))
        );
        if (matchedTeam) {
          setSelectedTeamId(matchedTeam.id);
        }
      }
    }
  }, [selectedEstId, establishments, teams]);

  const triggerAlert = (msg) => {
    if (notify) notify(msg, 'success', true);
    else alert(msg);
  };

  const handleDispatch = () => {
    if (!selectedEstId || !selectedTeamId) {
      alert('الرجاء تحديد المنشأة واللجنة المطلوبة');
      return;
    }
    const est = establishments.find(e => e.id === selectedEstId);
    const team = teams.find(t => t.id === selectedTeamId);
    
    setDispatches(prev => [...(prev || []), {
      id: 'disp_' + Date.now(),
      estId: est.id,
      estName: est.name,
      teamId: team.id,
      date: new Date().toISOString(),
      status: 'pending'
    }]);

    addSystemNotification(
      'أمر تفتيش عاجل',
      `تم توجيه ${team.name} للتفتيش العاجل على منشأة ${est.name} من قبل الغرفة المركزية.`,
      team.id
    );

    triggerAlert(`تم إرسال أمر توجيه عاجل إلى ${team.name} لزيارة ${est.name} فوراً!`);
    setSelectedEstId('');
    setSelectedTeamId('');
  };

  return (
    <div className="space-y-6 text-right animate-in slide-in-from-bottom-4 duration-500">
      <div className="glassmorphic-card p-6 border border-blue-500/20">
        <h3 className="text-lg font-black text-slate-800 dark:text-white mb-6 flex items-center gap-2">
          <CheckCircle className="w-6 h-6 text-blue-600" />
          المهام الذكية (Smart Tasks)
        </h3>
        
        {(hasPerm('manageSmartTasks') || user?.role === 'admin' || user?.role === 'director') ? (
          <div className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-2xl border border-blue-100 dark:border-blue-900/30">
              <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-2">توجيه أوامر التفتيش (إدارة المهام)</h4>
              <p className="text-xs text-blue-600/80 mb-4">قم بتوجيه أوامر التفتيش المباشرة للفرق الميدانية، وسيصلهم إشعار فوري للتنفيذ.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                   <label className="text-xs font-bold text-slate-700 block mb-2">اختر المنشأة المخالفة</label>
                   <select 
                      value={selectedEstId}
                      onChange={(e) => setSelectedEstId(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-xs">
                      <option value="">اختر...</option>
                      {establishments.map(e => (
                         <option key={e.id} value={e.id}>{e.name} - {e.sector}</option>
                      ))}
                   </select>
                </div>
                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                   <label className="text-xs font-bold text-slate-700 block mb-2">توجيه إلى الفرقة</label>
                   <select 
                      value={selectedTeamId}
                      onChange={(e) => setSelectedTeamId(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-xs">
                      <option value="">اختر...</option>
                      {teams.map(t => (
                         <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                   </select>
                </div>
                <div className="flex items-end">
                   <button onClick={handleDispatch} className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl p-3 text-xs font-black shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all">
                      <Send className="w-4 h-4" />
                      إصدار أمر تفتيش
                   </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <h4 className="font-bold text-slate-800 dark:text-white">المهام العاجلة الموجهة إليك</h4>
            </div>
            
            <div className="bg-red-50 dark:bg-red-900/10 p-5 rounded-2xl border border-red-200 dark:border-red-900/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-md transition-all">
               <div>
                  <h4 className="font-black text-red-700 dark:text-red-400 text-sm">مهمة تفتيش عاجلة: مطعم وكافيه الأمراء</h4>
                  <p className="text-xs text-red-600/80 mt-1">توجيه من غرفة العمليات المركزية بسبب شكوى مواطن. القطاع: الأيسر.</p>
               </div>
               <button onClick={() => triggerAlert('تم بدء المهمة وسيتم رفع التقرير للمركز')} className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-lg shadow-red-500/30 w-full sm:w-auto text-center">
                  تنفيذ المهمة
               </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
