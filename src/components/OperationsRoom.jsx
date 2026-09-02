import React, { useState, useContext, useEffect } from 'react';
import { usePersistentTab } from '../hooks/usePersistentTab';
import { AppContext } from '../context/AppContext';
import { AlertCircle, Target, ShieldCheck, Users, Info, Edit, Trash2, Mail, Send, Camera, CheckCircle, XCircle, X, MessageCircle, Check, CheckCheck, Database, FlaskConical, ShieldAlert, AlertOctagon } from 'lucide-react';
import AccountModal from './AccountModal';
import { FinancialReports } from './FinancialReports';

export default function OperationsRoom() {
  const { notify, teams, trackers, setTeams, setTrackers, penaltyRequests, setPenaltyRequests, establishments, setEstablishments, setSosAlerts, chatMessages, addChatMessage, markChatRead, user, labRequests, setLabRequests, addSystemNotification, sosAlerts, setDispatches, setClosureVerifications, closureVerifications } = useContext(AppContext);
  const [activeTab, setActiveTab] = usePersistentTab('opsActiveTab', 'penalties');
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
      triggerAlert('تمت المصادقة على إعادة الفتح. المنشأة الآن عاد للعمل بتقييم 75%.');
      addSystemNotification(
        'موافقة الإدارة المركزية على إعادة فتح', 
        `تمت المصادقة على طلب إعادة الفتح لمنشأة (${verification.estName}). المنشأة الآن مفتوح.`, 
        'all'
      );
    } else {
      setClosureModalData(verification);
    }
  };

  const confirmClosureWithDuration = () => {
    if (!closureModalData) return;
    
    setClosureVerifications(prev => prev.map(v => v.id === closureModalData.id ? { ...v, status: 'approved' } : v));
    setEstablishments(prev => prev.map(e => e.id === closureModalData.estId ? { ...e, status: 'closed', closureDuration: closureDuration, closureDate: new Date().toISOString() } : e));
    
    addSystemNotification(
      'قرار إغلاق نهائي صادر من الإدارة المركزية 🚫', 
      `المديرية تصادق على غلق منشأة (${closureModalData.estName}) لمدة (${closureDuration}). قرار نهائي واجب التنفيذ.`, 
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

  const [selectedEstId, setSelectedEstId] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState('');
  
  const [accountModalState, setAccountModalState] = useState({ isOpen: false, mode: 'add', data: null, accountType: 'team' });
  const [activeChatTarget, setActiveChatTarget] = useState(null);

  const opsUnreadMessages = (chatMessages || []).filter(m => (m.targetRole === 'operations' || user?.role === 'admin') && m.senderId !== user?.id && !m.isRead);
  const totalOpsUnread = opsUnreadMessages.length;

  useEffect(() => {
    if (activeChatTarget) {
      const unreadInActiveChat = activeChatTarget.msgs.filter(m => m.senderId !== user?.id && !m.isRead).map(m => m.id);
      if (unreadInActiveChat.length > 0) {
        markChatRead(unreadInActiveChat);
      }
    }
  }, [activeChatTarget, chatMessages, markChatRead, user?.id]);

  useEffect(() => {
    const handleNav = () => {
      setActiveTab('penalties');
    };
    window.addEventListener('navToPenalties', handleNav);
    return () => window.removeEventListener('navToPenalties', handleNav);
  }, []);

  const handleDeleteTeam = (id) => {
    if(window.confirm('هل أنت متأكد من حذف هذا الفريق الميداني؟ لا يمكن التراجع.')) {
      setTeams(prev => prev.filter(t => t.id !== id));
      triggerAlert('تم حذف الفريق بنجاح.');
    }
  };

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
    <div className="space-y-6 text-right">
      {(!user?.permissions?.authenticatePenalties && !user?.permissions?.showFieldTeamsStats && user?.role !== 'admin' && user?.role !== 'director') ? (
        <div className="text-center p-10 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h2 className="text-xl font-black text-slate-700 dark:text-slate-300">لا توجد صلاحيات لعرض هذه الغرفة</h2>
          <p className="text-sm text-slate-500 mt-2">يرجى التواصل مع الإدارة العليا لمنحك الصلاحيات اللازمة.</p>
        </div>
      ) : (
      <div className="flex gap-4 border-b border-slate-200 dark:border-slate-800 pb-3 mb-6 overflow-x-auto whitespace-nowrap hide-scrollbar">
        {(user?.permissions?.authenticatePenalties || user?.role === 'admin' || user?.role === 'director') && (
          <button onClick={() => setActiveTab('penalties')} className={`pb-2 text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${activeTab === 'penalties' ? 'border-b-2 border-red-600 text-red-600 dark:text-red-400 font-extrabold' : 'text-slate-400 hover:text-slate-600'}`}>
            <AlertCircle className="w-4 h-4" />المصادقة على العقوبات (Penalty Authentication)
          </button>
        )}
        {(user?.permissions?.showFieldTeamsStats || user?.role === 'admin' || user?.role === 'director') && (
          <button onClick={() => setActiveTab('team_performance')} className={`pb-2 text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${activeTab === 'team_performance' ? 'border-b-2 border-teal-600 text-teal-600 dark:text-teal-400 font-extrabold' : 'text-slate-400 hover:text-slate-600'}`}>
            <Target className="w-4 h-4" />أداء الفرق الميدانية (Team Performance)
          </button>
        )}
      </div>
      )}

      {(user?.permissions?.authenticatePenalties || user?.role === 'admin' || user?.role === 'director') && activeTab === 'penalties' && (
        <div className="space-y-6">
          <div className="glassmorphic-card p-6 border border-red-500/20">
            <h3 className="text-sm font-black text-slate-800 dark:text-white mb-2">المصادقة المركزية على الإغلاقات والغرامات الكبرى</h3>
            <p className="text-[10px] text-slate-500 mb-6">طلبات الإغلاق المعلقة من الفرق الميدانية والتي تنتظر مصادقتك لتنفيذها قانونياً.</p>
            <div className="space-y-4">
              {penaltyRequests.filter(req => req.status === 'pending').map(req => (
                <div key={req.id} className={`p-4 rounded-xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${req.type === 'fine' ? 'border-orange-500/30 bg-orange-500/5' : 'border-red-500/30 bg-red-500/5'}`}>
                  <div>
                    <h4 className={`text-xs font-black ${req.type === 'fine' ? 'text-orange-600 dark:text-orange-400' : 'text-red-600 dark:text-red-400'}`}>
                      {req.type === 'fine' ? 'طلب غرامة مالية: ' : 'طلب تشميع: '} {req.estName}
                    </h4>
                    <p className="text-[10px] text-slate-500 mt-1">السبب: {req.reason}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setPenaltyRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: 'approved' } : r)); triggerAlert('تمت المصادقة'); }} className="px-3 py-2 rounded-lg text-white font-bold text-xs bg-emerald-600">صادق</button>
                    <button onClick={() => { setPenaltyRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: 'rejected' } : r)); triggerAlert('تم الرفض'); }} className="px-3 py-2 rounded-lg border border-slate-300 text-slate-600 font-bold text-xs">رفض</button>
                  </div>
                </div>
              ))}
              {penaltyRequests.filter(req => req.status === 'pending').length === 0 && (
                <p className="text-center text-xs text-slate-500 py-4">لا توجد طلبات معلقة حالياً.</p>
              )}
            </div>
          </div>
          
          {/* Penalty Archive */}
          <div className="glassmorphic-card p-6 border border-slate-500/20">
            <h3 className="text-sm font-black text-slate-800 dark:text-white mb-2">أرشيف القرارات (آخر 30 يوماً)</h3>
            <p className="text-[10px] text-slate-500 mb-6">يمكنك مراجعة القرارات المصادق عليها حديثاً والتراجع عنها أو تعديلها في حال وجود خطأ.</p>
            <div className="space-y-4">
              {penaltyRequests.filter(req => req.status === 'approved' || req.status === 'rejected').slice(-15).reverse().map(req => (
                <div key={req.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h4 className="text-xs font-black text-slate-700 dark:text-slate-300">
                      {req.type === 'fine' ? 'غرامة مالية: ' : 'إغلاق وتشميع: '} {req.estName}
                    </h4>
                    <p className="text-[10px] text-slate-500 mt-1">السبب: {req.reason}</p>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full inline-block mt-2 ${req.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {req.status === 'approved' ? 'تمت المصادقة' : 'تم الرفض'}
                    </span>
                  </div>
                  <div>
                    <button 
                      onClick={() => {
                        if(window.confirm('هل أنت متأكد من سحب هذا القرار وإعادته للمراجعة والتعديل؟')) {
                          setPenaltyRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: 'pending' } : r));
                          triggerAlert('تم سحب القرار بنجاح وهو الآن قيد المراجعة.');
                        }
                      }}
                      className="px-3 py-2 rounded-lg bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 font-bold text-xs transition-colors flex items-center gap-2"
                    >
                      <Edit className="w-3.5 h-3.5" /> تراجع / تعديل القرار
                    </button>
                  </div>
                </div>
              ))}
              {penaltyRequests.filter(req => req.status === 'approved' || req.status === 'rejected').length === 0 && (
                <p className="text-center text-xs text-slate-500 py-4">لا توجد قرارات مؤرشفة حالياً.</p>
              )}
            </div>
          </div>
        </div>
      )}

            {(user?.permissions?.showFieldTeamsStats || user?.role === 'admin' || user?.role === 'director' || user?.role === 'central_director') && activeTab === 'team_performance' && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div>
              <h3 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-500" />
                أداء الفرق الميدانية
              </h3>
              <p className="text-xs text-slate-500 mt-1">إحصائيات الكشوفات والغرامات المسجلة لهذا الشهر</p>
            </div>
            
            <div className="w-full sm:w-auto flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">تصفية حسب الفريق:</span>
              <select
                value={selectedPerfTeam}
                onChange={(e) => setSelectedPerfTeam(e.target.value)}
                className="w-full sm:w-64 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500 text-xs font-bold font-mono"
              >
                <option value="all">كافة الفرق الميدانية 📊</option>
                {teams.filter(t => t.active).map(t => (
                  <option key={t.id} value={t.id}>{t.name} ({t.sector})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {teams.filter(t => t.active && (selectedPerfTeam === 'all' || t.id === selectedPerfTeam)).map(team => {
              // Calculate stats dynamically from data
              const teamEsts = establishments.filter(e => e.sector === team.sector);
              const teamFines = penaltyRequests.filter(req => req.type === 'fine' && req.status === 'approved' && teamEsts.some(e => e.name === req.estName));
              const teamClosures = penaltyRequests.filter(req => req.type === 'closure' && req.status === 'approved' && teamEsts.some(e => e.name === req.estName));
              
              return (
                <div key={team.id} className="glassmorphic-card p-5 border border-indigo-500/10 hover:border-indigo-500/30 transition-all group">
                  <div className="flex justify-between items-center mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-800 dark:text-white group-hover:text-indigo-600 transition-colors">{team.name}</h4>
                        <p className="text-[10px] font-bold text-slate-500">قاطع المسؤولية: {team.sector}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-black ${team.active ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'}`}>
                      {team.active ? 'نشط' : 'متوقف'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700/50 text-center">
                      <span className="block text-2xl font-black text-slate-700 dark:text-slate-200">{teamEsts.length}</span>
                      <span className="block text-[9px] font-bold text-slate-500 mt-1">الكشوفات</span>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/10 p-3 rounded-xl border border-red-100 dark:border-red-500/10 text-center">
                      <span className="block text-2xl font-black text-red-600">{teamClosures.length}</span>
                      <span className="block text-[9px] font-bold text-red-500 mt-1">الإغلاقات</span>
                    </div>
                    <div className="bg-amber-50 dark:bg-amber-900/10 p-3 rounded-xl border border-amber-100 dark:border-amber-500/10 text-center">
                      <span className="block text-2xl font-black text-amber-600">{teamFines.length}</span>
                      <span className="block text-[9px] font-bold text-amber-500 mt-1">الغرامات</span>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {teams.filter(t => t.active && (selectedPerfTeam === 'all' || t.id === selectedPerfTeam)).length === 0 && (
              <div className="col-span-full p-8 text-center text-slate-500 font-bold bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                لا توجد بيانات متاحة لهذا الفريق.
              </div>
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
              يرجى تحديد مدة الإغلاق الرسمية لمنشأة ({closureModalData.estName}). سيتم إشعار الفرق الميدانية بهذا القرار فوراً.
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