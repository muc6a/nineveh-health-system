import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { AlertCircle, Target, ShieldCheck, Users, Info, Edit, Trash2, Mail, Send, Camera, CheckCircle, XCircle, X } from 'lucide-react';
import AccountModal from './AccountModal';

export default function OperationsRoom() {
  const { establishments, setEstablishments, teams, setTeams, trackers, setTrackers, reports, setReports, penaltyRequests, setPenaltyRequests, dispatches, setDispatches, closureVerifications, setClosureVerifications, addSystemNotification, notify } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('trackers_management');
  const [closureModalData, setClosureModalData] = useState(null);
  const [closureDuration, setClosureDuration] = useState('أسبوع واحد');
  
  const triggerAlert = (msg) => {
    if (notify) notify(msg, 'success', true);
    else alert(msg);
  };

  const handleApproveClosure = (verification) => {
    if (verification.type === 'reopening') {
      setClosureVerifications(prev => prev.map(v => v.id === verification.id ? { ...v, status: 'approved' } : v));
      setEstablishments(prev => prev.map(e => e.id === verification.estId ? { ...e, status: 'compliant', score: 75, closureDuration: null } : e));
      triggerAlert('تمت المصادقة على إعادة الفتح. المطعم الآن عاد للعمل بتقييم 75%.');
      addSystemNotification(
        'موافقة الإدارة المركزية على إعادة فتح', 
        `تمت المصادقة على طلب إعادة الفتح لمطعم (${verification.estName}). المطعم الآن مفتوح.`, 
        'all'
      );
    } else {
      // Instead of prompt, open custom modal
      setClosureModalData(verification);
    }
  };

  const confirmClosureWithDuration = () => {
    if (!closureModalData) return;
    
    setClosureVerifications(prev => prev.map(v => v.id === closureModalData.id ? { ...v, status: 'approved' } : v));
    setEstablishments(prev => prev.map(e => e.id === closureModalData.estId ? { ...e, status: 'closed', closureDuration: closureDuration, closureDate: new Date().toISOString() } : e));
    
    // Notify Tracker/Field Team
    addSystemNotification(
      'قرار إغلاق نهائي صادر من الإدارة المركزية 🚫', 
      `المديرية تصادق على غلق مطعم (${closureModalData.estName}) لمدة (${closureDuration}). قرار نهائي واجب التنفيذ.`, 
      'all'
    );
    
    triggerAlert(`تمت المصادقة على الإغلاق لمدة (${closureDuration}) بنجاح.`);
    setClosureModalData(null);
    setClosureDuration('أسبوع واحد');
  };

  const handleRejectClosure = (verificationId) => {
    setClosureVerifications(prev => prev.map(v => v.id === verificationId ? { ...v, status: 'rejected' } : v));
    triggerAlert('تم رفض الدليل وإعادته للمتابعة.');
  };

  // States for Dispatch
  const [selectedEstId, setSelectedEstId] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState('');
  
  const [accountModalState, setAccountModalState] = useState({ isOpen: false, mode: 'add', data: null, accountType: 'team' });

  // Monthly Stats States
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const allMonthlyClosures = (penaltyRequests || []).filter(req => 
    req.type === 'closure' && req.status === 'approved' &&
    new Date(req.date).getMonth() === currentMonth && new Date(req.date).getFullYear() === currentYear
  );

  const allMonthlyFines = (penaltyRequests || []).filter(req => 
    req.type === 'fine' && req.status === 'approved' &&
    new Date(req.date).getMonth() === currentMonth && new Date(req.date).getFullYear() === currentYear
  );

  const [showStatsModal, setShowStatsModal] = useState(false);
  const [statsModalType, setStatsModalType] = useState('closures'); // 'closures' or 'fines'
  const [selectedSector, setSelectedSector] = useState(null); // Which sector to view inside the modal

  // Listen for navigation events from NotificationBell
  useEffect(() => {
    const handleNav = () => {
      setActiveTab('penalties');
    };
    window.addEventListener('navToPenalties', handleNav);
    return () => window.removeEventListener('navToPenalties', handleNav);
  }, []);

  // Handle Team Deletion
  const handleDeleteTeam = (id) => {
    if(window.confirm('هل أنت متأكد من حذف هذا الفريق الميداني؟ لا يمكن التراجع.')) {
      setTeams(prev => prev.filter(t => t.id !== id));
      triggerAlert('تم حذف الفريق بنجاح.');
    }
  };

  // Handle Save Team or Tracker
  const handleSaveAccount = (accountData) => {
    const isTracker = accountModalState.accountType === 'tracker';

    if (accountModalState.mode === 'add') {
      const newObj = {
        ...accountData,
        id: (isTracker ? 'tracker_' : 'team_') + Date.now(),
        active: true
      };
      
      if (isTracker) {
        setTrackers(prev => [...(prev || []), newObj]);
      } else {
        setTeams(prev => [...prev, newObj]);
      }
      triggerAlert(`تم إنشاء وتعيين حساب (${accountData.name}) بنجاح.`);
    } else {
      if (isTracker) {
        setTrackers(prev => prev.map(t => t.id === accountData.id ? { ...t, ...accountData } : t));
      } else {
        setTeams(prev => prev.map(t => t.id === accountData.id ? { ...t, ...accountData } : t));
      }
      triggerAlert(`تم تعديل بيانات ${isTracker ? 'المتابع' : 'الفريق'} بنجاح.`);
    }
    setAccountModalState({ isOpen: false, mode: 'add', data: null, accountType: 'team' });
  };

  // Example Dispatch Function
  const handleDispatch = () => {
    if (!selectedEstId || !selectedTeamId) {
      alert('الرجاء تحديد المنشأة واللجنة المطلوبة');
      return;
    }
    const est = establishments.find(e => e.id === selectedEstId);
    const team = teams.find(t => t.id === selectedTeamId);
    
    setDispatches(prev => [...prev, {
      id: 'disp_' + Date.now(),
      estId: est.id,
      estName: est.name,
      teamId: team.id,
      date: new Date().toISOString(),
      status: 'pending' // pending, accepted, completed
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
    <div className="space-y-6 text-right">
      <div className="flex gap-4 border-b border-slate-200 dark:border-slate-800 pb-3 mb-6 overflow-x-auto whitespace-nowrap hide-scrollbar">
        <button
          onClick={() => setActiveTab('trackers_management')}
          className={`pb-2 text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'trackers_management' ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 font-extrabold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Users className="w-4 h-4" />
          إدارة المتابعين السريين
        </button>
        <button
          onClick={() => setActiveTab('teams_management')}
          className={`pb-2 text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'teams_management' ? 'border-b-2 border-teal-600 text-teal-600 dark:text-teal-400 font-extrabold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          إدارة اللجان الميدانية
        </button>
        <button
          onClick={() => setActiveTab('penalties')}
          className={`pb-2 text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'penalties' ? 'border-b-2 border-red-600 text-red-600 dark:text-red-400 font-extrabold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <AlertCircle className="w-4 h-4" />
          المصادقة على العقوبات
        </button>
        <button
          onClick={() => setActiveTab('complaints')}
          className={`pb-2 text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'complaints' ? 'border-b-2 border-amber-600 text-amber-600 dark:text-amber-400 font-extrabold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Mail className="w-4 h-4" />
          البلاغات والشكاوى
        </button>
        <button
          onClick={() => setActiveTab('dispatch')}
          className={`pb-2 text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'dispatch' ? 'border-b-2 border-fuchsia-600 text-fuchsia-600 dark:text-fuchsia-400 font-extrabold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Target className="w-4 h-4" />
          التوجيه الميداني العاجل
        </button>
        <button
          onClick={() => setActiveTab('monthly_stats')}
          className={`pb-2 text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'monthly_stats' ? 'border-b-2 border-emerald-600 text-emerald-600 dark:text-emerald-400 font-extrabold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Target className="w-4 h-4" />
          إحصائيات الإغلاق والغرامات
        </button>
        <button
          onClick={() => setActiveTab('closure_verifications')}
          className={`pb-2 text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'closure_verifications' ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 font-extrabold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Camera className="w-4 h-4" />
          أدلة الإغلاق (الميدانية)
        </button>
      </div>

      {activeTab === 'monthly_stats' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div 
              onClick={() => { setStatsModalType('closures'); setSelectedSector(null); setShowStatsModal(true); }}
              className="glassmorphic-card p-6 border border-rose-500/20 hover:-translate-y-2 hover:shadow-2xl hover:shadow-rose-500/10 transition-all duration-300 cursor-pointer select-none"
            >
              <h3 className="text-sm font-black text-slate-800 dark:text-white mb-2">المطاعم المغلقة هذا الشهر 🔒</h3>
              <p className="text-[10px] text-slate-500 mb-4">إجمالي المنشآت التي تم اتخاذ قرار بإغلاقها خلال الشهر الحالي في عموم المحافظة.</p>
              <p className="text-5xl font-extrabold text-rose-500">{allMonthlyClosures.length}</p>
              <span className="text-[10px] text-rose-500 font-bold block mt-3">انقر لعرض التفاصيل حسب القطاعات 👁️</span>
            </div>
            
            <div 
              onClick={() => { setStatsModalType('fines'); setSelectedSector(null); setShowStatsModal(true); }}
              className="glassmorphic-card p-6 border border-amber-500/20 hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 cursor-pointer select-none"
            >
              <h3 className="text-sm font-black text-slate-800 dark:text-white mb-2">الغرامات المالية هذا الشهر 💰</h3>
              <p className="text-[10px] text-slate-500 mb-4">إجمالي المطاعم التي تم تغريمها مالياً خلال الشهر الحالي في عموم المحافظة.</p>
              <p className="text-5xl font-extrabold text-amber-500">{allMonthlyFines.length}</p>
              <span className="text-[10px] text-amber-500 font-bold block mt-3">انقر لعرض التفاصيل حسب القطاعات 👁️</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'dispatch' && (
        <div className="glassmorphic-card p-6 border border-fuchsia-500/20">
          <h3 className="text-sm font-black text-slate-800 dark:text-white mb-2">إرسال فرق الطوارئ وتوجيه اللجان</h3>
          <p className="text-[10px] text-slate-500 mb-6">اختر المطعم واللجنة لإرسال أمر تفتيش حصري وعاجل يظهر في شاشاتهم.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1">المنشأة المستهدفة</label>
              <select 
                value={selectedEstId}
                onChange={(e) => setSelectedEstId(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-white"
              >
                <option value="">-- اختر المطعم أو الكافيه --</option>
                {establishments.map(est => (
                  <option key={est.id} value={est.id}>{est.name} ({est.sector})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1">اللجنة المُكلفة بالواجب</label>
              <select 
                value={selectedTeamId}
                onChange={(e) => setSelectedTeamId(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-white"
              >
                <option value="">-- اختر اللجنة الرقابية --</option>
                {teams.map(t => (
                  <option key={t.id} value={t.id}>{t.name} ({t.sector})</option>
                ))}
              </select>
            </div>
          </div>
          <button 
            onClick={handleDispatch}
            className="w-full py-3 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-black text-xs transition-all shadow-md"
          >
            🚀 إرسال أمر التفتيش الآن
          </button>
        </div>
      )}

      {activeTab === 'teams_management' && (
        <div className="glassmorphic-card p-6 border border-teal-500/20">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h3 className="text-sm font-black text-slate-800 dark:text-white">إدارة اللجان الميدانية</h3>
              <p className="text-[10px] text-slate-500 mt-1">توليد حسابات لجان التفتيش وتوزيع المسؤوليات القطاعية في نينوى</p>
            </div>
            <button
              onClick={() => setAccountModalState({ isOpen: true, mode: 'add', data: null, accountType: 'team' })}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs transition-all cursor-pointer shadow-md"
            >
              ➕ إنشاء وتعيين فريق جديد
            </button>
          </div>

          <div className="overflow-x-auto border-t border-slate-200/50 dark:border-slate-800/50 pt-4">
            <table className="w-full text-right border-collapse text-xs font-bold">
              <thead>
                <tr className="bg-slate-100/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                  <th className="p-3">اسم فريق التفتيش</th>
                  <th className="p-3">القطاع المكلف</th>
                  <th className="p-3">حالة الحساب</th>
                  <th className="p-3 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                {teams.map(t => (
                  <tr key={t.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10">
                    <td className="p-3 text-slate-800 dark:text-slate-200">{t.name}</td>
                    <td className="p-3 text-teal-600 dark:text-teal-400">{t.sector}</td>
                    <td className="p-3">
                      {t.active ? (
                        <span className="px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-600 text-[10px]">نشط وصالح</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-lg bg-red-500/10 text-red-600 text-[10px]">مجمد مؤقتاً</span>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => setAccountModalState({ isOpen: true, mode: 'edit', data: { ...t, isTeam: true }, accountType: 'team' })}
                          className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 transition-all cursor-pointer"
                          title="تعديل"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTeam(t.id)}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-600 transition-all cursor-pointer"
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {teams.length === 0 && (
              <div className="text-center p-8 text-slate-400 text-xs">لا توجد لجان مسجلة حالياً.</div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'complaints' && (
        <div className="glassmorphic-card p-6 border border-amber-500/20">
          <h3 className="text-sm font-black text-slate-800 dark:text-white mb-6">بلاغات المواطنين الواردة حديثاً</h3>
          {reports.filter(r => !r.isDelivery).length === 0 ? (
            <div className="text-center p-8 text-slate-400 text-xs">لا توجد بلاغات حالياً.</div>
          ) : (
            <div className="space-y-4">
              {reports.filter(r => !r.isDelivery).map(r => (
                <div key={r.id} className="p-4 border border-amber-500/20 bg-amber-500/5 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h4 className="text-xs font-black text-slate-800 dark:text-white">{r.citizenName || 'مواطن (مجهول)'} يشتكي من {r.establishmentName}</h4>
                    <p className="text-[10px] text-slate-500 mt-1">{r.notes}</p>
                    <div className="flex gap-2 mt-2">
                      <span className="text-[9px] bg-white dark:bg-slate-900 px-2 py-1 rounded text-slate-500">{new Date(r.timestamp).toLocaleString('ar-IQ')}</span>
                      <span className="text-[9px] bg-red-500/10 text-red-500 px-2 py-1 rounded font-bold">شكوى تسمم/نظافة</span>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-bold rounded-lg whitespace-nowrap">
                    توجيه الشكوى للجنة القاطع ➡️
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'penalties' && (
        <div className="glassmorphic-card p-6 border border-red-500/20">
          <h3 className="text-sm font-black text-slate-800 dark:text-white mb-2">المصادقة المركزية على الإغلاقات والغرامات الكبرى</h3>
          <p className="text-[10px] text-slate-500 mb-6">طلبات الإغلاق المعلقة من الفرق الميدانية والتي تنتظر مصادقتك لتنفيذها قانونياً.</p>
          {(() => {
            const pendingPenalties = penaltyRequests.filter(req => req.status === 'pending');
            if (pendingPenalties.length === 0) {
              return (
                <div className="text-center p-8 text-slate-400 text-xs border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/50">
                  لا توجد طلبات إغلاق معلقة بانتظار المصادقة حالياً.
                </div>
              );
            }
            return (
              <div className="space-y-4">
                {pendingPenalties.map(req => (
                <div key={req.id} className={`p-4 rounded-xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${req.type === 'fine' ? 'border-orange-500/30 bg-orange-500/5' : 'border-red-500/30 bg-red-500/5'}`}>
                  <div>
                    <h4 className={`text-xs font-black ${req.type === 'fine' ? 'text-orange-600 dark:text-orange-400' : 'text-red-600 dark:text-red-400'}`}>
                      {req.type === 'fine' ? 'طلب غرامة مالية: ' : 'طلب تشميع: '} {req.estName}
                    </h4>
                    <p className="text-[10px] text-slate-500 mt-1">السبب: {req.reason}</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-1">مُقدم الطلب: {req.teamName} - {new Date(req.date).toLocaleString('ar-IQ')}</p>
                  </div>
                  <div className="flex gap-2 w-full md:w-auto">
                    <button 
                      onClick={() => {
                        if (window.confirm(`الموافقة على ${req.type === 'fine' ? 'الغرامة' : 'الإغلاق'}؟`)) {
                          setPenaltyRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: 'approved' } : r));
                          if (req.type === 'closure') {
                            setEstablishments(prev => prev.map(est => 
                              est.id === req.estId ? { ...est, status: 'closed' } : est
                            ));
                          }
                          triggerAlert(`تم المصادقة على ${req.type === 'fine' ? 'الغرامة' : 'الإغلاق'} وإصدار الأمر لمطعم ${req.estName}`);
                          addSystemNotification(
                            'تمت المصادقة على العقوبة',
                            `قامت إدارة الرقابة المركزية بالمصادقة على ${req.type === 'fine' ? 'الغرامة' : 'الإغلاق'} لمطعم ${req.estName} بناءً على طلب ${req.teamName}.`,
                            'all'
                          );
                        }
                      }}
                      className={`px-3 py-2 rounded-lg text-white font-bold text-xs transition-all flex-1 ${req.type === 'fine' ? 'bg-orange-600 hover:bg-orange-700' : 'bg-red-600 hover:bg-red-700'}`}
                    >
                      صادق على {req.type === 'fine' ? 'الغرامة' : 'الإغلاق'}
                    </button>
                    <button 
                      onClick={() => {
                        setPenaltyRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: 'rejected' } : r));
                        triggerAlert(`تم رفض طلب ${req.type === 'fine' ? 'الغرامة' : 'الإغلاق'}`);
                        addSystemNotification(
                          'رفض طلب العقوبة',
                          `تم رفض طلب ${req.type === 'fine' ? 'الغرامة' : 'الإغلاق'} الخاص بمطعم ${req.estName} من قبل الرقابة المركزية.`,
                          'all'
                        );
                      }}
                      className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex-1"
                    >
                      رفض
                    </button>
                  </div>
                </div>
              ))}
            </div>
          );
        })()}
        </div>
      )}

      {activeTab === 'trackers_management' && (
        <div className="glassmorphic-card p-6 border border-indigo-500/20">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h3 className="text-sm font-black text-slate-800 dark:text-white">إدارة المتابعين الميدانيين</h3>
              <p className="text-[10px] text-slate-500 mt-1">حسابات المتابعين السريين الموزعين على القطاعات لتقييم الفرق الميدانية.</p>
            </div>
            <button
              onClick={() => setAccountModalState({ isOpen: true, mode: 'add', data: null, accountType: 'tracker' })}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs transition-all cursor-pointer shadow-md"
            >
              ➕ إنشاء حساب متابع جديد
            </button>
          </div>

          <div className="overflow-x-auto border-t border-slate-200/50 dark:border-slate-800/50 pt-4">
            <table className="w-full text-right border-collapse text-xs font-bold">
              <thead>
                <tr className="bg-slate-100/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                  <th className="p-3">الاسم الكامل للمتابع</th>
                  <th className="p-3">اسم المستخدم</th>
                  <th className="p-3">القطاع المرتبط</th>
                  <th className="p-3">حالة الحساب</th>
                  <th className="p-3 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                {trackers?.map(t => (
                  <tr key={t.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10">
                    <td className="p-3 text-slate-800 dark:text-slate-200">{t.name}</td>
                    <td className="p-3 text-slate-500 dir-ltr text-right">{t.username}</td>
                    <td className="p-3 text-indigo-600 dark:text-indigo-400">{t.linkedTeamSector}</td>
                    <td className="p-3">
                      {t.active !== false ? (
                        <span className="px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-600 text-[10px]">نشط وصالح</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-lg bg-red-500/10 text-red-600 text-[10px]">مجمد مؤقتاً</span>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => setAccountModalState({ isOpen: true, mode: 'edit', data: { ...t }, accountType: 'tracker' })}
                          className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 transition-all cursor-pointer"
                          title="تعديل"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            const updated = trackers.map(tr => tr.id === t.id ? { ...tr, active: !(tr.active !== false) } : tr);
                            setTrackers(updated);
                            triggerAlert(t.active !== false ? 'تم تجميد المتابع' : 'تم تفعيل المتابع');
                          }}
                          className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                            t.active !== false ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-600' : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600'
                          }`}
                          title={t.active !== false ? 'تجميد' : 'تفعيل'}
                        >
                          {t.active !== false ? '⏸️' : '▶️'}
                        </button>
                        <button
                          onClick={() => {
                            if(window.confirm('هل أنت متأكد من حذف حساب المتابع؟')) {
                              setTrackers(prev => prev.filter(tr => tr.id !== t.id));
                              triggerAlert('تم حذف المتابع بنجاح.');
                            }
                          }}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-600 transition-all cursor-pointer"
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {(!trackers || trackers.length === 0) && (
              <div className="text-center p-8 text-slate-400 text-xs">لا يوجد متابعين مسجلين حالياً.</div>
            )}
          </div>
        </div>
      )}

      {/* Account Modal for Adding/Editing Teams */}
      {accountModalState.isOpen && (
        <AccountModal
          isOpen={accountModalState.isOpen}
          mode={accountModalState.mode}
          initialData={accountModalState.data}
          accountType={accountModalState.accountType}
          teams={teams}
          onClose={() => setAccountModalState({ isOpen: false, mode: 'add', data: null, accountType: 'team' })}
          onSave={handleSaveAccount}
        />
      )}

      {/* Central Stats Modal (Grouped by Sector) */}
      {showStatsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6 rounded-3xl text-slate-800 dark:text-white shadow-2xl relative max-h-[85vh] overflow-y-auto text-right">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4 sticky top-0 bg-white dark:bg-slate-900 z-10">
              <div>
                <h3 className="text-lg font-black text-teal-600 dark:text-teal-400">
                  {statsModalType === 'closures' ? '🔒 المطاعم المغلقة هذا الشهر' : '💰 المطاعم المُغرمة هذا الشهر'}
                </h3>
                {selectedSector && (
                  <button 
                    onClick={() => setSelectedSector(null)}
                    className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white mt-1 underline"
                  >
                    العودة لقائمة القطاعات
                  </button>
                )}
              </div>
              <button onClick={() => setShowStatsModal(false)} className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              {(() => {
                const dataList = statsModalType === 'closures' ? allMonthlyClosures : allMonthlyFines;
                if (dataList.length === 0) {
                  return <p className="text-center text-sm text-slate-500 py-8">لا توجد بيانات لهذا الشهر.</p>;
                }

                // If a sector is selected, show list of items for that sector
                if (selectedSector) {
                  const itemsInSector = dataList.filter(req => req.sector === selectedSector);
                  return (
                    <div className="space-y-3">
                      <h4 className="font-bold text-slate-700 dark:text-slate-300 mb-2">قطاع: {selectedSector}</h4>
                      {itemsInSector.map(req => {
                        const estData = establishments.find(e => e.id === req.estId);
                        const neighborhood = estData ? estData.neighborhood : 'غير محدد';
                        return (
                          <div key={req.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 flex justify-between items-center">
                            <div>
                              <h4 className="font-black text-sm">{req.estName}</h4>
                              <p className="text-[10px] text-slate-500 mt-1">الحي: {neighborhood}</p>
                            </div>
                            <div className="text-left">
                              <span className="text-[10px] font-bold text-slate-400 block mb-1">
                                {new Date(req.date).toLocaleDateString('ar-IQ')}
                              </span>
                              <span className="text-[9px] text-teal-600 bg-teal-500/10 px-2 py-0.5 rounded">
                                {req.teamName || 'غير متوفر'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                }

                // Otherwise, group by sector and show summary cards
                const groupedBySector = dataList.reduce((acc, req) => {
                  const sector = req.sector || 'قطاعات أخرى';
                  if (!acc[sector]) acc[sector] = 0;
                  acc[sector]++;
                  return acc;
                }, {});

                return (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(groupedBySector).map(([sector, count]) => (
                      <div 
                        key={sector} 
                        onClick={() => setSelectedSector(sector)}
                        className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl cursor-pointer hover:border-teal-500 hover:shadow-lg transition-all text-center group"
                      >
                        <h4 className="font-black text-sm text-slate-700 dark:text-slate-300 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors mb-2">
                          {sector}
                        </h4>
                        <div className="w-12 h-12 rounded-full bg-teal-500/10 flex items-center justify-center mx-auto mb-2">
                          <span className="text-xl font-extrabold text-teal-600 dark:text-teal-400">{count}</span>
                        </div>
                        <span className="text-[10px] text-slate-500">
                          {statsModalType === 'closures' ? 'مطعم مغلق' : 'غرامة مسجلة'}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
      {activeTab === 'closure_verifications' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black text-slate-800 dark:text-white">أدلة الإغلاق الميدانية الواردة من فرق المتابعة</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {closureVerifications && closureVerifications.length > 0 ? (
              closureVerifications.map(ver => (
                <div key={ver.id} className="glassmorphic-card p-4 border border-indigo-500/20 relative">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold text-sm text-indigo-700 dark:text-indigo-400">
                        {ver.type === 'reopening' ? '🔓 طلب إعادة فتح:' : '🔒 توثيق إغلاق:'} {ver.estName}
                      </h4>
                      <p className="text-[10px] text-slate-500 font-bold mt-1">المرسل: {ver.trackerName}</p>
                      <p className="text-[10px] text-slate-500">{new Date(ver.date).toLocaleString('ar-IQ')}</p>
                    </div>
                    {ver.status === 'pending' ? (
                      <span className="bg-amber-100 text-amber-700 text-[10px] px-2 py-1 rounded-full font-bold">قيد المراجعة</span>
                    ) : ver.status === 'approved' ? (
                      <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-1 rounded-full font-bold">مصادق عليه</span>
                    ) : (
                      <span className="bg-rose-100 text-rose-700 text-[10px] px-2 py-1 rounded-full font-bold">مرفوض</span>
                    )}
                  </div>
                  
                  {ver.photo && (
                    <div className="mt-2 mb-3 bg-slate-900 rounded-xl overflow-hidden flex justify-center items-center border border-slate-700 h-48 relative group">
                      <img src={ver.photo} alt="دليل إغلاق" className="max-h-full max-w-full object-contain" />
                    </div>
                  )}

                  {ver.notes && (
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700 mb-4">
                      <p className="text-xs text-slate-700 dark:text-slate-300 font-bold">ملاحظات فريق المتابعة:</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{ver.notes}</p>
                    </div>
                  )}

                  {ver.status === 'pending' && (
                    <div className="flex gap-2 mt-4 border-t border-slate-200 dark:border-slate-700 pt-3">
                      <button 
                        onClick={() => handleApproveClosure(ver)}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-xl text-xs font-bold transition-all flex justify-center items-center gap-1"
                      >
                        <CheckCircle className="w-4 h-4" /> {ver.type === 'reopening' ? 'مصادقة الفتح' : 'مصادقة الإغلاق'}
                      </button>
                      <button 
                        onClick={() => handleRejectClosure(ver.id)}
                        className="flex-1 bg-rose-100 hover:bg-rose-200 text-rose-700 p-2 rounded-xl text-xs font-bold transition-all flex justify-center items-center gap-1"
                      >
                        <XCircle className="w-4 h-4" /> رفض
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-1 md:col-span-2 text-center p-8 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                <Camera className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-50" />
                <p className="text-slate-500 font-bold text-sm">لا توجد أدلة إغلاق واردة حالياً</p>
              </div>
            )}
          </div>
        </div>
      )}


      {/* Closure Duration Modal */}
      {closureModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-rose-500/30 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-slate-800 dark:text-white mb-2">مصادقة قرار الإغلاق</h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              يرجى تحديد مدة الإغلاق الرسمية لمطعم ({closureModalData.estName}). سيتم إشعار الفرق الميدانية بهذا القرار فوراً.
            </p>
            
            <div className="text-right mb-6">
              <label className="text-[10px] font-bold text-slate-500 block mb-2">مدة الإغلاق المقررة:</label>
              <select 
                value={closureDuration}
                onChange={(e) => setClosureDuration(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-800 dark:text-white outline-none focus:border-rose-500"
              >
                <option value="3 أيام">3 أيام (إنذار غلق)</option>
                <option value="أسبوع واحد">أسبوع واحد (7 أيام)</option>
                <option value="أسبوعين">أسبوعين (14 يوم)</option>
                <option value="شهر واحد">شهر واحد (30 يوم)</option>
                <option value="مؤقت لحين التصحيح">إغلاق مؤقت (لحين تصحيح المخالفات)</option>
              </select>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={confirmClosureWithDuration}
                className="flex-[2] py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-lg shadow-rose-500/20 transition-all cursor-pointer"
              >
                تأكيد الإغلاق وإشعار الميدان
              </button>
              <button 
                onClick={() => setClosureModalData(null)}
                className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs transition-colors cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}