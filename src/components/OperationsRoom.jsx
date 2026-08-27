import React, { useState, useContext, useEffect } from 'react';
import { usePersistentTab } from '../hooks/usePersistentTab';
import { AppContext } from '../context/AppContext';
import { AlertCircle, Target, ShieldCheck, Users, Info, Edit, Trash2, Mail, Send, Camera, CheckCircle, XCircle, X } from 'lucide-react';
import AccountModal from './AccountModal';
import { FinancialReports } from './FinancialReports';
import { Database } from 'lucide-react';

export default function OperationsRoom() {
  const { establishments, setEstablishments, teams, setTeams, trackers, setTrackers, reports, setReports, penaltyRequests, setPenaltyRequests, dispatches, setDispatches, closureVerifications, setClosureVerifications, addSystemNotification, notify, sosAlerts, setSosAlerts } = useContext(AppContext);
  const [activeTab, setActiveTab] = usePersistentTab('opsActiveTab', 'live_operations');
  const [closureModalData, setClosureModalData] = useState(null);
  const [closureDuration, setClosureDuration] = useState('أسبوع واحد');
  const [showClosureArchive, setShowClosureArchive] = useState(false);
  
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
          onClick={() => setActiveTab('teams_management')}
          className={`pb-2 text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'teams_management' ? 'border-b-2 border-teal-600 text-teal-600 dark:text-teal-400 font-extrabold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          إدارة اللجان ({teams?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('trackers_management')}
          className={`pb-2 text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'trackers_management' ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 font-extrabold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Users className="w-4 h-4" />
          إدارة المتابعين ({trackers?.length || 0})
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
          onClick={() => setActiveTab('financials')}
          className={`pb-2 text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'financials' ? 'border-b-2 border-emerald-600 text-emerald-600 dark:text-emerald-400 font-extrabold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Database className="w-4 h-4" />
          التقارير المالية للغرامات
        </button>
        <button
          onClick={() => setActiveTab('live_operations')}
          className={`pb-2 text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'live_operations' ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400 font-extrabold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Target className="w-4 h-4" />
          التتبع والعمليات الحية
        </button>
      </div>

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

      
      {activeTab === 'financials' && (
        <div className="glassmorphic-card p-0 border border-emerald-500/20 overflow-hidden">
          <FinancialReports />
        </div>
      )}

      {activeTab === 'live_operations' && (
        <div className="space-y-6">
          
          {/* Top Section: Alerts & Notifications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* SOS Alerts */}
            <div className="glassmorphic-card p-4 border border-red-500/20 max-h-80 overflow-y-auto">
              <h3 className="text-sm font-black text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500" />
                سجل الطوارئ (SOS)
              </h3>
              {sosAlerts && sosAlerts.length > 0 ? (
                sosAlerts.map(alert => (
                  <div key={alert.id} className="mb-3 p-3 rounded-xl border border-red-500/30 bg-red-50 dark:bg-red-900/10 relative">
                    <div className="absolute top-0 right-0 w-1 h-full bg-red-600 rounded-r-xl"></div>
                    <div className="flex justify-between items-start mb-2 mr-2">
                      <div>
                        <h4 className="font-black text-xs text-red-700 dark:text-red-400">🚨 {alert.teamName}</h4>
                        <p className="text-[10px] text-slate-600">القطاع: {alert.sector}</p>
                      </div>
                      {alert.status === 'active' ? (
                        <span className="bg-red-600 text-white text-[9px] px-2 py-0.5 rounded-full font-bold animate-pulse">عاجل</span>
                      ) : (
                        <span className="bg-emerald-100 text-emerald-700 text-[9px] px-2 py-0.5 rounded-full font-bold">مستجاب</span>
                      )}
                    </div>
                    {alert.status === 'active' && (
                      <button 
                        onClick={() => {
                          setSosAlerts(prev => prev.map(a => a.id === alert.id ? { ...a, status: 'resolved' } : a));
                          triggerAlert('تم الاستجابة لنداء الاستغاثة.');
                        }}
                        className="mr-2 mt-2 w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold"
                      >
                        ✅ تأكيد الاستجابة
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center text-xs text-slate-500 py-4">لا توجد استغاثات حالياً.</p>
              )}
            </div>

            {/* Closure Verifications */}
            <div className="glassmorphic-card p-4 border border-indigo-500/20 max-h-80 overflow-y-auto">
              <div className="flex justify-between items-center mb-4 border-b border-indigo-500/10 pb-2">
                <h3 className="text-sm font-black text-slate-800 dark:text-white flex items-center gap-2">
                  <Camera className="w-4 h-4 text-indigo-500" />
                  أدلة الإغلاق {showClosureArchive ? 'المؤرشفة' : 'الواردة'}
                </h3>
                <button
                  onClick={() => setShowClosureArchive(!showClosureArchive)}
                  className={`text-[10px] font-bold px-3 py-1 rounded-full transition-all ${
                    showClosureArchive 
                      ? 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                  }`}
                >
                  {showClosureArchive ? 'عرض الوارد الجديد' : 'عرض الأرشيف المغلق'}
                </button>
              </div>
              {(() => {
                const activeVerifications = closureVerifications?.filter(v => v.status === 'pending') || [];
                const archivedVerifications = closureVerifications?.filter(v => v.status !== 'pending') || [];
                const displayVerifications = showClosureArchive ? archivedVerifications : activeVerifications;
                
                return displayVerifications.length > 0 ? (
                  displayVerifications
                closureVerifications.map(ver => (
                  <div key={ver.id} className="mb-3 p-3 rounded-xl border border-indigo-500/20 bg-indigo-50/50 dark:bg-indigo-900/10 relative">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-xs text-indigo-700 dark:text-indigo-400">
                          {ver.type === 'reopening' ? '🔓 طلب فتح:' : '🔒 إغلاق:'} {ver.estName}
                        </h4>
                        <p className="text-[10px] text-slate-500">{ver.trackerName}</p>
                      </div>
                      {ver.status === 'pending' ? (
                        <span className="bg-amber-100 text-amber-700 text-[9px] px-2 py-0.5 rounded-full font-bold">مراجعة</span>
                      ) : ver.status === 'approved' ? (
                        <span className="bg-emerald-100 text-emerald-700 text-[9px] px-2 py-0.5 rounded-full font-bold">مُصادق</span>
                      ) : (
                        <span className="bg-rose-100 text-rose-700 text-[9px] px-2 py-0.5 rounded-full font-bold">مرفوض</span>
                      )}
                    </div>
                    {ver.photo && (
                      <div className="mt-2 mb-2 bg-slate-900 rounded-lg overflow-hidden flex justify-center items-center h-20">
                        <img src={ver.photo} alt="دليل" className="max-h-full object-contain" />
                      </div>
                    )}
                    {ver.status === 'pending' && (
                      <div className="flex gap-1 mt-2">
                        <button onClick={() => handleApproveClosure(ver)} className="flex-1 bg-emerald-600 text-white rounded py-1 text-[10px] font-bold">قبول</button>
                        <button onClick={() => handleRejectClosure(ver.id)} className="flex-1 bg-rose-600 text-white rounded py-1 text-[10px] font-bold">رفض</button>
                      </div>
                    )}
                  </div>
                ))
                ) : (
                  <p className="text-center text-xs text-slate-500 py-4">لا توجد أدلة إغلاق {showClosureArchive ? 'مؤرشفة' : 'معلقة'}.</p>
                );
              })()}
            </div>
          </div>

          {/* Bottom Section: Teams Live Tracking & Dispatch */}
          <div className="glassmorphic-card p-6 border border-blue-500/20">
            <h3 className="text-sm font-black text-slate-800 dark:text-white mb-2 flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-500" />
              الفرق الميدانية والتوجيه السريع
            </h3>
            
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-right border-collapse text-xs font-bold">
                <thead>
                  <tr className="bg-slate-100/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                    <th className="p-3">الفريق / القطاع</th>
                    <th className="p-3">آخر تواجد مسجل</th>
                    <th className="p-3">المنشأة المستهدفة للتوجيه</th>
                    <th className="p-3 text-center">إجراء التوجيه</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                  {teams.map(t => {
                    const teamInspections = establishments
                      .filter(e => e.lastInspection !== 'لم يزر بعد' && e.lastInspectorId === t.id)
                      .sort((a, b) => new Date(b.lastInspectionDate || 0) - new Date(a.lastInspectionDate || 0));
                    const lastEst = teamInspections[0];
                    
                    return (
                      <tr key={t.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10">
                        <td className="p-3">
                          <span className="text-slate-800 dark:text-slate-200 block">{t.name}</span>
                          <span className="text-[10px] text-teal-600">{t.sector}</span>
                        </td>
                        <td className="p-3 text-slate-500">
                          <span className="block text-slate-700 dark:text-slate-300">
                            {lastEst ? `${lastEst.name}` : 'غير متوفر'}
                          </span>
                          <span className="text-[10px]">
                            {lastEst ? new Date(lastEst.lastInspectionDate).toLocaleString('ar-IQ') : 'لا يوجد نشاط'}
                          </span>
                        </td>
                        <td className="p-3">
                          <select 
                            onChange={(e) => setSelectedEstId(e.target.value)}
                            className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px]"
                          >
                            <option value="">-- اختر المطعم --</option>
                            {establishments.filter(e => e.sector === t.sector).map(est => (
                              <option key={est.id} value={est.id}>{est.name}</option>
                            ))}
                          </select>
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => {
                              setSelectedTeamId(t.id);
                              // We wait a tick to ensure selectedTeamId is set before dispatching.
                              setTimeout(handleDispatch, 0);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold transition-all cursor-pointer text-[10px]"
                          >
                            🚀 إرسال التوجيه
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
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


      {/* Closure Duration Modal */}
      {closureModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-rose-500/30 text-center animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-black text-slate-800 dark:text-white mb-2">مصادقة قرار الإغلاق</h3>
            
            {closureModalData.photo && (
              <div className="w-full h-40 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-4 overflow-hidden border border-slate-200 dark:border-slate-700 relative">
                <img src={closureModalData.photo} alt="دليل" className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 bg-rose-600 text-white text-[10px] px-2 py-1 rounded-full font-bold">صورة الشمع الأحمر</div>
              </div>
            )}
            
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