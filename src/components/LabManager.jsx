import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { FlaskConical, CheckCircle, AlertTriangle, Clock, Archive, FileText, Check, X, ShieldAlert, FileSearch, Power, BarChart3, LayoutDashboard, Menu, LogOut } from 'lucide-react';

export const LabManager = () => {

  const { user, labRequests, setLabRequests, systemNotifications, setSystemNotifications, establishments, playBeep, uiPreferences } = useContext(AppContext);
  const [labTab, setLabTab] = useState('stats'); // 'stats', 'incoming', 'testing', 'archive'
  const [resultModal, setResultModal] = useState({ isOpen: false, request: null });
  const [resultStatus, setResultStatus] = useState('safe');
  const [resultNotes, setResultNotes] = useState('');
  const [newSampleModal, setNewSampleModal] = useState({ isOpen: false });
  const [searchEst, setSearchEst] = useState('');
  const [selectedEstForSample, setSelectedEstForSample] = useState(null);
  const [manualSampleType, setManualSampleType] = useState('');
  const [manualSampleRemarks, setManualSampleRemarks] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);



  // Filter requests
  const safeLabRequests = labRequests || [];
  const safeEstablishments = establishments || [];
  const incomingReqs = safeLabRequests.filter(r => r.status === 'pending_arrival');
  const testingReqs = safeLabRequests.filter(r => r.status === 'under_testing');
  const archivedReqs = safeLabRequests.filter(r => r.status === 'finished');

  

  const handleCreateManualSample = () => {
    if (!selectedEstForSample || !manualSampleType) return;
    
    const newReq = {
      id: 'lab_' + Date.now(),
      status: 'pending_arrival',
      estId: selectedEstForSample.id,
      estName: selectedEstForSample.name,
      teamId: user?.id || 'manual',
      teamName: user?.name || 'إدخال يدوي - المختبر',
      date: new Date().toISOString(),
      senderNotes: `نوع العينة: ${manualSampleType}` + (manualSampleRemarks ? ` | ملاحظات: ${manualSampleRemarks}` : '')
    };
    
    setLabRequests(prev => [newReq, ...prev]);
    setSystemNotifications(prev => [{
      id: Date.now().toString(),
      type: 'info',
      title: 'عينة يدوية',
      message: `تم تسجيل عينة جديدة يدوياً للمنشأة: ${selectedEstForSample.name}`,
      date: new Date().toISOString(),
      read: false
    }, ...prev]);
    
    if (playBeep) playBeep('success');
    
    // Reset form
    setSelectedEstForSample(null);
    setSearchEst('');
    setManualSampleType('');
    setManualSampleRemarks('');
    setNewSampleModal({ isOpen: false });
  };

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
        id: 'notif_' + Date.now() + '1',
        title: '🚨 عينة ملوثة مختبرياً!',
        message: `تم ثبوت تلوث العينة المرسلة من ${resultModal.request.teamName} للمنشأة (${resultModal.request.estName}). يرجى اتخاذ القرار الإداري بالغلق أو الغرامة.`,
        date: new Date().toISOString(),
        isRead: false,
        targetRole: 'operations',
        relatedLabRequestId: reqId
      },
      {
        id: 'notif_' + Date.now() + '2',
        title: '🚨 عينة ملوثة مختبرياً!',
        message: `تم ثبوت تلوث العينة المرسلة من قبلكم للمنشأة (${resultModal.request.estName}).`,
        date: new Date().toISOString(),
        isRead: false,
        targetRole: resultModal.request.teamId,
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
    <div className="space-y-6 animate-fade-in">

      {/* Top Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 border-b border-slate-200 dark:border-slate-800 custom-scrollbar">
        <button
          onClick={() => setLabTab('stats')}
          className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${labTab === 'stats' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
        >
          <BarChart3 className="w-4 h-4" /> الرئيسية والتقارير
        </button>
        <button
          onClick={() => setLabTab('incoming')}
          className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${labTab === 'incoming' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
        >
          <Clock className="w-4 h-4" /> الطلبات الواردة
          {incomingReqs.length > 0 && <span className="bg-amber-100 text-amber-700 px-1.5 rounded-md text-[10px]">{incomingReqs.length}</span>}
        </button>
        <button
          onClick={() => setLabTab('testing')}
          className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${labTab === 'testing' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
        >
          <FlaskConical className="w-4 h-4" /> قيد الفحص
          {testingReqs.length > 0 && <span className="bg-indigo-100 text-indigo-700 px-1.5 rounded-md text-[10px]">{testingReqs.length}</span>}
        </button>
        <button
          onClick={() => setLabTab('archive')}
          className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${labTab === 'archive' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
        >
          <Archive className="w-4 h-4" /> الأرشيف المختبري
        </button>
        
        {labTab === 'incoming' && (
          <div className="mr-auto">
            <button 
              onClick={() => setNewSampleModal({ isOpen: true })}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[10px] transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              ➕ إنشاء عينة جديدة
            </button>
          </div>
        )}
        {labTab === 'testing' && (
          <div className="mr-auto">
            <button 
              onClick={() => setNewSampleModal({ isOpen: true })}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[10px] transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              ➕ إنشاء عينة جديدة
            </button>
          </div>
        )}
      </div>

<div className="max-w-6xl mx-auto space-y-6">

            {/* STATS */}
            {labTab === 'stats' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200/50 dark:border-white/5 shadow-sm">
                    <h3 className="text-slate-500 dark:text-slate-400 font-bold mb-2">إجمالي العينات المستلمة</h3>
                    <p className="text-4xl font-black text-indigo-600 dark:text-indigo-400">{labRequests.length}</p>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200/50 dark:border-white/5 shadow-sm">
                    <h3 className="text-slate-500 dark:text-slate-400 font-bold mb-2">عينات قيد الفحص</h3>
                    <p className="text-4xl font-black text-amber-600 dark:text-amber-400">{testingReqs.length}</p>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200/50 dark:border-white/5 shadow-sm">
                    <h3 className="text-slate-500 dark:text-slate-400 font-bold mb-2">عينات منجزة</h3>
                    <p className="text-4xl font-black text-emerald-600 dark:text-emerald-400">{archivedReqs.length}</p>
                  </div>
                </div>

                <div className="bg-indigo-600 text-white rounded-[2rem] p-8 relative overflow-hidden shadow-xl shadow-indigo-600/20">
                  <div className="relative z-10 max-w-2xl">
                    <h2 className="text-2xl font-black mb-2">بوابة المختبر المركزي جاهزة</h2>
                    <p className="text-indigo-100 leading-relaxed">
                      يمكنك استلام العينات الميدانية، إجراء الفحوصات، واعتماد النتائج. 
                      سيتم إشعار الفرق الرقابية أو الرقابة المركزية بالنتائج فور اعتمادها للمتابعة الميدانية أو اتخاذ الإجراءات القانونية بحق المخالفين.
                    </p>
                  </div>
                  <FlaskConical className="w-48 h-48 absolute -left-12 -bottom-12 text-white/10 transform -rotate-12" />
                </div>
              </div>
            )}

            {/* INCOMING */}
            {labTab === 'incoming' && (
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-200/50 dark:border-white/5 shadow-sm min-h-[50vh] animate-in fade-in duration-500">
                <div className="space-y-4">
                  {incomingReqs.length === 0 ? (
                    <div className="text-center p-12 flex flex-col items-center">
                      <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 mb-4">
                        <CheckCircle className="w-8 h-8" />
                      </div>
                      <h3 className="text-slate-600 dark:text-slate-300 font-bold text-lg mb-1">لا توجد عينات قيد الوصول</h3>
                      <p className="text-slate-400 text-sm">تم استلام جميع العينات بنجاح.</p>
                    </div>
                  ) : (
                    incomingReqs.map(req => (
                      <div key={req.id} className="flex flex-col md:flex-row items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-white/5 gap-4 transition-all hover:border-indigo-300 dark:hover:border-indigo-700/50">
                        <div className="flex gap-4 items-center">
                          <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/20 text-amber-600 flex items-center justify-center">
                            <Clock className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-800 dark:text-white">{req.estName}</h4>
                            <p className="text-xs text-slate-500 mt-1">مرسلة من: {req.teamName} - {new Date(req.date).toLocaleString('ar-IQ')}</p>
                            {req.senderNotes && <p className="text-xs text-slate-400 mt-1 bg-white dark:bg-slate-800 px-2 py-1 rounded inline-block">ملاحظة: {req.senderNotes}</p>}
                          </div>
                        </div>
                        <button 
                          onClick={() => handleReceiveSample(req.id)}
                          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2 cursor-pointer w-full md:w-auto justify-center whitespace-nowrap"
                        >
                          <CheckCircle className="w-4 h-4" /> تأكيد الاستلام المادي
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TESTING */}
            {labTab === 'testing' && (
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-200/50 dark:border-white/5 shadow-sm min-h-[50vh] animate-in fade-in duration-500">
                <div className="space-y-4">
                  {testingReqs.length === 0 ? (
                    <div className="text-center p-12 flex flex-col items-center">
                      <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 mb-4">
                        <FlaskConical className="w-8 h-8" />
                      </div>
                      <h3 className="text-slate-600 dark:text-slate-300 font-bold text-lg mb-1">لا توجد عينات قيد الفحص</h3>
                      <p className="text-slate-400 text-sm">جميع العينات المستلمة تم فحصها.</p>
                    </div>
                  ) : (
                    testingReqs.map(req => (
                      <div key={req.id} className="flex flex-col md:flex-row items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-white/5 gap-4 transition-all hover:border-indigo-300 dark:hover:border-indigo-700/50">
                        <div className="flex gap-4 items-center">
                          <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 flex items-center justify-center animate-pulse">
                            <FlaskConical className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-800 dark:text-white text-lg">{req.estName}</h4>
                            <p className="text-xs text-slate-500 mt-1">مرسلة من: {req.teamName} - تم الاستلام: {new Date(req.receivedAt).toLocaleTimeString('ar-IQ')}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => setResultModal({ isOpen: true, request: req })}
                          className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-teal-600/20 flex items-center gap-2 cursor-pointer w-full md:w-auto justify-center whitespace-nowrap"
                        >
                          <FileText className="w-4 h-4" /> إدخال النتيجة
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* ARCHIVE */}
            {labTab === 'archive' && (
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-200/50 dark:border-white/5 shadow-sm min-h-[50vh] animate-in fade-in duration-500">
                <div className="space-y-4">
                  {archivedReqs.length === 0 ? (
                    <div className="text-center p-12 text-slate-400 font-bold">الأرشيف فارغ.</div>
                  ) : (
                    archivedReqs.map(req => (
                      <div key={req.id} className={`flex items-center p-4 rounded-2xl border gap-4 ${req.result === 'safe' ? 'bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/30' : 'bg-red-50/50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30'}`}>
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${req.result === 'safe' ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600' : 'bg-red-100 dark:bg-red-900/20 text-red-600'}`}>
                          {req.result === 'safe' ? <CheckCircle className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 dark:text-white">{req.estName}</h4>
                          <p className="text-sm font-bold mt-1 text-slate-700 dark:text-slate-300">النتيجة: {req.result === 'safe' ? <span className="text-emerald-600 dark:text-emerald-400">سليمة ومطابقة للمواصفات</span> : <span className="text-red-600 dark:text-red-400">ملوثة / غير مطابقة</span>}</p>
                          <div className="flex gap-3 text-[10px] text-slate-400 mt-2">
                            <span>الفريق: {req.teamName}</span>
                            <span>&bull;</span>
                            <span>تاريخ الفحص: {new Date(req.finishedAt).toLocaleString('ar-IQ')}</span>
                          </div>
                          {req.notes && (
                            <p className="mt-2 text-xs p-2 bg-white/50 dark:bg-slate-800 rounded border border-slate-100 dark:border-slate-700">ملاحظات: {req.notes}</p>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

          </div>
        
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
                    className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white outline-none focus:border-indigo-500 h-24 resize-none custom-scrollbar"
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

      {/* New Sample Modal */}
      {newSampleModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[2rem] shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h2 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-indigo-500" /> تسجيل عينة مختبرية جديدة
              </h2>
              <button onClick={() => setNewSampleModal({isOpen: false})} className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 rounded-full cursor-pointer transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-5">
              
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-2">البحث عن المنشأة المعنية</label>
                <div className="relative">
                  <FileSearch className="w-4 h-4 absolute right-3 top-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchEst}
                    onChange={(e) => setSearchEst(e.target.value)}
                    placeholder="اكتب اسم المنشأة أو الكود..."
                    className="w-full pl-4 pr-10 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 outline-none text-sm font-bold text-slate-800 dark:text-white focus:border-indigo-500"
                  />
                </div>
                {searchEst.length > 1 && !selectedEstForSample && (
                  <div className="mt-2 max-h-40 overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 shadow-lg">
                    {safeEstablishments.filter(e => e.name.includes(searchEst) || e.id.includes(searchEst)).slice(0,10).map(e => (
                      <div 
                        key={e.id}
                        onClick={() => {
                          setSelectedEstForSample(e);
                          setSearchEst('');
                        }}
                        className="p-3 border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 cursor-pointer flex justify-between items-center"
                      >
                        <span className="font-bold text-sm">{e.name}</span>
                        <span className="text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">{e.id}</span>
                      </div>
                    ))}
                  </div>
                )}
                {selectedEstForSample && (
                  <div className="mt-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl flex justify-between items-center">
                    <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
                      <CheckCircle className="w-4 h-4" />
                      تم اختيار: {selectedEstForSample.name}
                    </div>
                    <button onClick={() => setSelectedEstForSample(null)} className="text-xs text-red-500 hover:underline">تغيير</button>
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-2">نوع وتفاصيل العينة</label>
                <input
                  type="text"
                  value={manualSampleType}
                  onChange={(e) => setManualSampleType(e.target.value)}
                  placeholder="مثال: لحوم مجمدة، مياه شرب..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 outline-none text-sm font-bold text-slate-800 dark:text-white focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-2">ملاحظات إضافية</label>
                <textarea
                  value={manualSampleRemarks}
                  onChange={(e) => setManualSampleRemarks(e.target.value)}
                  placeholder="أي ملاحظات حول حالة العينة..."
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 outline-none text-sm font-bold text-slate-800 dark:text-white focus:border-indigo-500 resize-none"
                />
              </div>

            </div>
            <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
              <button 
                onClick={handleCreateManualSample}
                disabled={!selectedEstForSample || !manualSampleType}
                className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-black text-sm transition-all shadow-lg shadow-indigo-600/20 cursor-pointer"
              >
                تسجيل العينة وإدخالها للفحص
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};
