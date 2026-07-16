import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { AlertCircle, Target, ShieldCheck, Users, Info, Edit, Trash2, Mail, Send } from 'lucide-react';
import AccountModal from './AccountModal';

export default function OperationsRoom() {
  const { establishments, teams, setTeams, trackers, setTrackers, reports, setReports, penaltyRequests, setPenaltyRequests, dispatches, setDispatches, addSystemNotification, notify } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('trackers_management');
  
  const triggerAlert = (msg) => {
    if (notify) notify(msg, 'success', true);
    else alert(msg);
  };

  // States for Dispatch
  const [selectedEstId, setSelectedEstId] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState('');
  
  // Teams Management States
  const [accountModalState, setAccountModalState] = useState({ isOpen: false, mode: 'add', data: null, accountType: 'team' });

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
      </div>

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
          {penaltyRequests.length === 0 ? (
            <div className="text-center p-8 text-slate-400 text-xs border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/50">
              لا توجد طلبات إغلاق معلقة بانتظار المصادقة حالياً.
            </div>
          ) : (
            <div className="space-y-4">
              {penaltyRequests.map(req => (
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
                          setPenaltyRequests(prev => prev.filter(r => r.id !== req.id));
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
                        setPenaltyRequests(prev => prev.filter(r => r.id !== req.id));
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
          )}
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
    </div>
  );
}
