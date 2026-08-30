import React, { useState, useContext, useEffect } from 'react';
import { usePersistentTab } from '../hooks/usePersistentTab';
import { AppContext } from '../context/AppContext';
import { AlertCircle, Target, ShieldCheck, Users, Info, Edit, Trash2, Mail, Send, Camera, CheckCircle, XCircle, X, MessageCircle, Check, CheckCheck, Database, FlaskConical, ShieldAlert, AlertOctagon } from 'lucide-react';
import AccountModal from './AccountModal';
import { FinancialReports } from './FinancialReports';

export default function OperationsRoom() {
  const { notify, teams, trackers, setTeams, setTrackers, penaltyRequests, setPenaltyRequests, establishments, setEstablishments, setSosAlerts, chatMessages, addChatMessage, markChatRead, user, labRequests, setLabRequests, addSystemNotification, sosAlerts, setDispatches, setClosureVerifications, closureVerifications } = useContext(AppContext);
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
      setClosureModalData(verification);
    }
  };

  const confirmClosureWithDuration = () => {
    if (!closureModalData) return;
    
    setClosureVerifications(prev => prev.map(v => v.id === closureModalData.id ? { ...v, status: 'approved' } : v));
    setEstablishments(prev => prev.map(e => e.id === closureModalData.estId ? { ...e, status: 'closed', closureDuration: closureDuration, closureDate: new Date().toISOString() } : e));
    
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
      <div className="flex gap-4 border-b border-slate-200 dark:border-slate-800 pb-3 mb-6 overflow-x-auto whitespace-nowrap hide-scrollbar">
        <button onClick={() => setActiveTab('teams_management')} className={`pb-2 text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${activeTab === 'teams_management' ? 'border-b-2 border-teal-600 text-teal-600 dark:text-teal-400 font-extrabold' : 'text-slate-400 hover:text-slate-600'}`}>
          <ShieldCheck className="w-4 h-4" />إدارة اللجان ({teams?.length || 0})
        </button>
        <button onClick={() => setActiveTab('trackers_management')} className={`pb-2 text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${activeTab === 'trackers_management' ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 font-extrabold' : 'text-slate-400 hover:text-slate-600'}`}>
          <Users className="w-4 h-4" />إدارة المتابعين ({trackers?.length || 0})
        </button>
        <button onClick={() => setActiveTab('penalties')} className={`pb-2 text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${activeTab === 'penalties' ? 'border-b-2 border-red-600 text-red-600 dark:text-red-400 font-extrabold' : 'text-slate-400 hover:text-slate-600'}`}>
          <AlertCircle className="w-4 h-4" />المصادقة على العقوبات
        </button>
      </div>

      {activeTab === 'teams_management' && (
        <div className="glassmorphic-card p-6 border border-teal-500/20">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h3 className="text-sm font-black text-slate-800 dark:text-white">إدارة اللجان الميدانية</h3>
              <p className="text-[10px] text-slate-500 mt-1">توليد حسابات لجان التفتيش وتوزيع المسؤوليات القطاعية في نينوى</p>
            </div>
            <button onClick={() => setAccountModalState({ isOpen: true, mode: 'add', data: null, accountType: 'team' })} className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs transition-all cursor-pointer shadow-md">
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
                    <td className="p-3">{t.active ? <span className="px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-600 text-[10px]">نشط وصالح</span> : <span className="px-2 py-0.5 rounded-lg bg-red-500/10 text-red-600 text-[10px]">مجمد مؤقتاً</span>}</td>
                    <td className="p-3">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => setAccountModalState({ isOpen: true, mode: 'edit', data: { ...t, isTeam: true }, accountType: 'team' })} className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 transition-all cursor-pointer"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleDeleteTeam(t.id)} className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-600 transition-all cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'penalties' && (
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

      {activeTab === 'trackers_management' && (
        <div className="glassmorphic-card p-6 border border-indigo-500/20">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-sm font-black text-slate-800 dark:text-white">إدارة المتابعين الميدانيين</h3>
            </div>
            <button onClick={() => setAccountModalState({ isOpen: true, mode: 'add', data: null, accountType: 'tracker' })} className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-extrabold text-xs">➕ إنشاء حساب متابع</button>
          </div>
          <table className="w-full text-right border-collapse text-xs font-bold">
            <thead>
              <tr className="bg-slate-100/50 border-b border-slate-200">
                <th className="p-3">اسم المتابع</th>
                <th className="p-3">القطاع</th>
                <th className="p-3 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {trackers?.map(t => (
                <tr key={t.id} className="border-b border-slate-100">
                  <td className="p-3">{t.name}</td>
                  <td className="p-3">{t.linkedTeamSector}</td>
                  <td className="p-3 text-center"><button onClick={() => setTrackers(prev => prev.filter(tr => tr.id !== t.id))} className="text-red-600"><Trash2 className="w-4 h-4" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
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