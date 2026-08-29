import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { AnimatedLogo } from '../components/AnimatedLogo';
import { ThemeToggle } from '../components/ThemeToggle';
import { WeatherWidget } from '../components/WeatherWidget';
import { NotificationBell } from '../components/NotificationBell';
import { FlaskConical, CheckCircle, AlertTriangle, Clock, Archive, FileText, Check, X, ShieldAlert, FileSearch, Power, BarChart3 } from 'lucide-react';

export const LabDashboard = () => {
  const { user, setUser, navigate, labRequests, setLabRequests, systemNotifications, setSystemNotifications, establishments, playBeep } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('incoming'); // 'stats', 'incoming', 'testing', 'archive'
  const [resultModal, setResultModal] = useState({ isOpen: false, request: null });
  const [resultStatus, setResultStatus] = useState('safe');
  const [resultNotes, setResultNotes] = useState('');

  // Protect route
  useEffect(() => {
    if (!user || user.role !== 'lab') {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  // Filter requests
  const incomingReqs = labRequests.filter(r => r.status === 'pending_arrival');
  const testingReqs = labRequests.filter(r => r.status === 'under_testing');
  const archivedReqs = labRequests.filter(r => r.status === 'finished');

  const handleReceiveSample = (id) => {
    setLabRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'under_testing', receivedAt: new Date().toISOString() } : r));
    playBeep && playBeep('success');
  };

  const handleSaveResult = () => {
    if (!resultModal.request) return;

    const reqId = resultModal.request.id;
    const isContaminated = resultStatus === 'contaminated';

    // Update request
    setLabRequests(prev => prev.map(r => r.id === reqId ? { 
      ...r, 
      status: 'finished', 
      result: resultStatus, 
      notes: resultNotes,
      finishedAt: new Date().toISOString()
    } : r));

    // Notify operations if contaminated
    if (isContaminated) {
      setSystemNotifications(prev => [{
        id: 'notif_' + Date.now(),
        title: '🚨 عينة ملوثة مختبرياً!',
        message: `تم ثبوت تلوث العينة المرسلة من ${resultModal.request.teamName} للمنشأة (${resultModal.request.estName}). يرجى اتخاذ القرار الإداري بالغلق أو الغرامة.`,
        date: new Date().toISOString(),
        isRead: false,
        targetRole: 'operations',
        relatedLabRequestId: reqId
      }, ...prev]);
    } else {
      // Notify team that it is safe
      setSystemNotifications(prev => [{
        id: 'notif_' + Date.now(),
        title: '✅ نتيجة عينة سليمة',
        message: `عينات المنشأة (${resultModal.request.estName}) سليمة ومطابقة للمواصفات.`,
        date: new Date().toISOString(),
        isRead: false,
        targetRole: resultModal.request.teamId
      }, ...prev]);
    }

    setResultModal({ isOpen: false, request: null });
    setResultStatus('safe');
    setResultNotes('');
    playBeep && playBeep('success');
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-sans" dir="rtl">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <AnimatedLogo className="w-12 h-12" />
            <div>
              <h1 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-l from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 leading-tight">بوابة المختبر المركزي</h1>
              <p className="text-xs font-bold text-slate-500">نظام فحص العينات والتحليل</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <WeatherWidget />
            <div className="h-8 w-px bg-slate-200 dark:bg-white/10 hidden md:block"></div>
            <NotificationBell />
            <ThemeToggle />
            <button 
              onClick={() => { setUser(null); navigate('/login'); }}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-600 dark:text-slate-300 hover:text-red-600 transition-colors cursor-pointer"
            >
              <Power className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-6 pb-24">
        {/* Welcome Card */}
        <div className="mb-6 p-6 rounded-[2rem] bg-gradient-to-bl from-indigo-600 to-purple-700 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-black mb-2 flex items-center gap-2">
              <FlaskConical className="w-6 h-6" /> مرحباً بك، {user.name}
            </h2>
            <p className="text-indigo-100 font-medium">لوحة التحكم الخاصة بفحص وتحليل العينات الميدانية.</p>
          </div>
          <FlaskConical className="w-32 h-32 absolute -left-8 -bottom-8 text-white/10 transform -rotate-12" />
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto gap-2 mb-6 custom-scrollbar pb-2">
          {[
            { id: 'stats', label: 'الإحصائيات', icon: BarChart3 },
            { id: 'incoming', label: 'قيد الوصول', icon: Clock, count: incomingReqs.length },
            { id: 'testing', label: 'قيد الفحص', icon: FlaskConical, count: testingReqs.length },
            { id: 'archive', label: 'الأرشيف', icon: Archive }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-[0_4px_20px_-5px_rgba(79,70,229,0.5)]'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-white/5'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === tab.id ? 'bg-white/20' : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 shadow-sm border border-slate-200 dark:border-white/5 min-h-[50vh]">
          
          {/* STATS */}
          {activeTab === 'stats' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-indigo-50 dark:bg-indigo-900/10 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-800/30">
                <h3 className="text-indigo-600 dark:text-indigo-400 font-bold mb-2">إجمالي العينات المستلمة</h3>
                <p className="text-4xl font-black text-indigo-700 dark:text-indigo-300">{labRequests.length}</p>
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/10 p-6 rounded-2xl border border-amber-100 dark:border-amber-800/30">
                <h3 className="text-amber-600 dark:text-amber-400 font-bold mb-2">عينات قيد الفحص</h3>
                <p className="text-4xl font-black text-amber-700 dark:text-amber-300">{testingReqs.length}</p>
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-900/10 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-800/30">
                <h3 className="text-emerald-600 dark:text-emerald-400 font-bold mb-2">عينات منجزة</h3>
                <p className="text-4xl font-black text-emerald-700 dark:text-emerald-300">{archivedReqs.length}</p>
              </div>
            </div>
          )}

          {/* INCOMING */}
          {activeTab === 'incoming' && (
            <div className="space-y-4">
              {incomingReqs.length === 0 ? (
                <div className="text-center p-12 text-slate-400 font-bold">لا توجد عينات قيد الوصول حالياً.</div>
              ) : (
                incomingReqs.map(req => (
                  <div key={req.id} className="flex flex-col md:flex-row items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-white/5 gap-4">
                    <div className="flex gap-4 items-center">
                      <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/20 text-amber-600 flex items-center justify-center">
                        <Clock className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-white">{req.estName}</h4>
                        <p className="text-xs text-slate-500 mt-1">مرسلة من: {req.teamName} - {new Date(req.date).toLocaleString('ar-IQ')}</p>
                        {req.senderNotes && <p className="text-xs text-slate-400 mt-1">ملاحظة: {req.senderNotes}</p>}
                      </div>
                    </div>
                    <button 
                      onClick={() => handleReceiveSample(req.id)}
                      className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2 cursor-pointer w-full md:w-auto justify-center"
                    >
                      <CheckCircle className="w-4 h-4" /> تأكيد الاستلام المادي
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TESTING */}
          {activeTab === 'testing' && (
            <div className="space-y-4">
              {testingReqs.length === 0 ? (
                <div className="text-center p-12 text-slate-400 font-bold">لا توجد عينات قيد الفحص حالياً.</div>
              ) : (
                testingReqs.map(req => (
                  <div key={req.id} className="flex flex-col md:flex-row items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-white/5 gap-4">
                    <div className="flex gap-4 items-center">
                      <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 flex items-center justify-center animate-pulse">
                        <FlaskConical className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-white">{req.estName}</h4>
                        <p className="text-xs text-slate-500 mt-1">مرسلة من: {req.teamName} - تم الاستلام: {new Date(req.receivedAt).toLocaleTimeString('ar-IQ')}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setResultModal({ isOpen: true, request: req })}
                      className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-teal-600/20 flex items-center gap-2 cursor-pointer w-full md:w-auto justify-center"
                    >
                      <FileText className="w-4 h-4" /> إدخال النتيجة
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ARCHIVE */}
          {activeTab === 'archive' && (
            <div className="space-y-4">
              {archivedReqs.length === 0 ? (
                <div className="text-center p-12 text-slate-400 font-bold">الأرشيف فارغ.</div>
              ) : (
                archivedReqs.map(req => (
                  <div key={req.id} className={`flex items-center p-4 rounded-2xl border gap-4 ${req.result === 'safe' ? 'bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/30' : 'bg-red-50/50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30'}`}>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${req.result === 'safe' ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600' : 'bg-red-100 dark:bg-red-900/20 text-red-600'}`}>
                      {req.result === 'safe' ? <CheckCircle className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-white">{req.estName}</h4>
                      <p className="text-xs text-slate-500 mt-1">النتيجة: {req.result === 'safe' ? 'سليمة ومطابقة' : 'ملوثة / غير مطابقة'}</p>
                      <p className="text-[10px] text-slate-400 mt-1">التاريخ: {new Date(req.finishedAt).toLocaleString('ar-IQ')}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

        </div>
      </main>

      {/* Result Modal */}
      {resultModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[2rem] shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6">
              <h2 className="text-lg font-black text-slate-800 dark:text-white mb-6">إدخال النتيجة المختبرية</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-bold text-slate-600 dark:text-slate-300 block mb-3">النتيجة النهائية للمختبر</label>
                  <div className="flex gap-4">
                    <label className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${resultStatus === 'safe' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' : 'border-slate-200 dark:border-white/10 text-slate-500'}`}>
                      <input type="radio" name="resultStatus" value="safe" checked={resultStatus === 'safe'} onChange={(e) => setResultStatus(e.target.value)} className="sr-only" />
                      <CheckCircle className="w-6 h-6" />
                      <span className="font-bold text-sm">سليمة ومطابقة</span>
                    </label>
                    
                    <label className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${resultStatus === 'contaminated' ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400' : 'border-slate-200 dark:border-white/10 text-slate-500'}`}>
                      <input type="radio" name="resultStatus" value="contaminated" checked={resultStatus === 'contaminated'} onChange={(e) => setResultStatus(e.target.value)} className="sr-only" />
                      <ShieldAlert className="w-6 h-6" />
                      <span className="font-bold text-sm">ملوثة / غير مطابقة</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-600 dark:text-slate-300 block mb-2">ملاحظات التحليل (اختياري)</label>
                  <textarea 
                    value={resultNotes}
                    onChange={(e) => setResultNotes(e.target.value)}
                    className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white outline-none focus:border-indigo-500 h-24 resize-none"
                    placeholder="اكتب أسباب التلوث أو ملاحظات الفحص هنا..."
                  ></textarea>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button 
                  onClick={() => setResultModal({ isOpen: false, request: null })}
                  className="flex-1 py-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                >
                  إلغاء
                </button>
                <button 
                  onClick={handleSaveResult}
                  className="flex-[2] py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm transition-all shadow-lg shadow-indigo-600/20 cursor-pointer"
                >
                  حفظ واعتماد النتيجة
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default LabDashboard;
