import { ROLE_CORE_BASICS } from '../utils/constants';
import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { FlaskConical, CheckCircle, AlertTriangle, Clock, Archive, FileText, Check, X, ShieldAlert, FileSearch, Power, BarChart3, LayoutDashboard, Menu, LogOut, Search, Filter } from 'lucide-react';

export const LabManager = () => {

  const { user, labRequests, setLabRequests, systemNotifications, setSystemNotifications, establishments, playBeep, uiPreferences } = useContext(AppContext);

  const hasPerm = (permName) => {
    if (user?.role === 'admin') return true;
    if (ROLE_CORE_BASICS[user?.role]?.includes(permName)) return true;
    return user?.permissions?.[permName] === true;
  };

  const [filterTab, setFilterTab] = useState('all'); // 'all', 'pending_arrival', 'under_testing', 'finished'
  const [resultModal, setResultModal] = useState({ isOpen: false, request: null });
  const [resultStatus, setResultStatus] = useState('safe');
  const [resultNotes, setResultNotes] = useState('');
  
  const [receiveModal, setReceiveModal] = useState({ isOpen: false, code: '' });
  const [manualSampleModal, setManualSampleModal] = useState({ isOpen: false });
  const [searchEst, setSearchEst] = useState('');
  const [selectedEstForSample, setSelectedEstForSample] = useState(null);
  const [manualSampleType, setManualSampleType] = useState('');

  // Filter requests
  const hasCentralView = user?.role === 'admin' || user?.permissions?.centralLabView === true;
  const safeLabRequests = hasCentralView 
    ? (labRequests || [])
    : (labRequests || []).filter(r => r.teamId === user?.id || r.teamId === user?.role);
    
  const safeEstablishments = establishments || [];
  
  // Stats
  const incomingReqs = safeLabRequests.filter(r => r.status === 'pending_arrival');
  const testingReqs = safeLabRequests.filter(r => r.status === 'under_testing');
  const archivedReqs = safeLabRequests.filter(r => r.status === 'finished');

  const filteredReqs = filterTab === 'all' 
    ? safeLabRequests 
    : safeLabRequests.filter(r => r.status === filterTab);

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
      senderNotes: `نوع العينة: ${manualSampleType}`
    };
    
    setLabRequests(prev => [newReq, ...prev]);
    if (playBeep) playBeep('success');
    
    setManualSampleModal({ isOpen: false });
    setSelectedEstForSample(null);
    setSearchEst('');
    setManualSampleType('');
  };

  const handleReceiveSampleCode = () => {
    if (!receiveModal.code) return;
    const reqIndex = labRequests.findIndex(r => r.id === receiveModal.code || r.id.includes(receiveModal.code));
    if (reqIndex === -1) {
      alert('لم يتم العثور على عينة بهذا الكود!');
      return;
    }
    
    setLabRequests(prev => prev.map(r => 
      (r.id === receiveModal.code || r.id.includes(receiveModal.code))
        ? { ...r, status: 'under_testing', receivedAt: new Date().toISOString() } 
        : r
    ));
    playBeep && playBeep('success');
    setReceiveModal({ isOpen: false, code: '' });
  };

  const toggleStatusManually = (req) => {
    if (req.status === 'pending_arrival' && hasPerm('receiveSamples')) {
      setLabRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: 'under_testing', receivedAt: new Date().toISOString() } : r));
      playBeep && playBeep('success');
    }
  };

  const handleSaveResult = () => {
    if (!resultModal.request) return;
    const reqId = resultModal.request.id;
    
    setLabRequests(prev => prev.map(r => r.id === reqId ? { 
      ...r, 
      status: 'finished', 
      result: resultStatus, 
      notes: resultNotes,
      finishedAt: new Date().toISOString()
    } : r));

    setResultModal({ isOpen: false, request: null });
    setResultStatus('safe');
    setResultNotes('');
    playBeep && playBeep('success');
  };

  const getStatusBadge = (status, req) => {
    if (status === 'pending_arrival') return (
      <span onClick={() => toggleStatusManually(req)} className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-700 font-bold text-[10px] flex items-center gap-1 w-fit cursor-pointer hover:bg-amber-200 transition-colors">
        <Clock className="w-3 h-3" /> قيد التوصيل
      </span>
    );
    if (status === 'under_testing') return (
      <span className="px-2.5 py-1 rounded-lg bg-indigo-100 text-indigo-700 font-bold text-[10px] flex items-center gap-1 w-fit">
        <FlaskConical className="w-3 h-3" /> قيد الفحص
      </span>
    );
    if (status === 'finished') return (
      <span className={`px-2.5 py-1 rounded-lg font-bold text-[10px] flex items-center gap-1 w-fit ${req.result === 'safe' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
        {req.result === 'safe' ? <CheckCircle className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />}
        منجزة ({req.result === 'safe' ? 'سليمة' : 'ملوثة'})
      </span>
    );
    return null;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Top Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <h3 className="text-slate-500 dark:text-slate-400 font-bold text-xs mb-1">إجمالي العينات (السجل الكلي)</h3>
            <p className="text-2xl font-black text-slate-800 dark:text-white">{safeLabRequests.length}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
            <Archive className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <h3 className="text-slate-500 dark:text-slate-400 font-bold text-xs mb-1">عينات قيد الفحص (بانتظار نتيجة)</h3>
            <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{testingReqs.length}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600">
            <FlaskConical className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <h3 className="text-slate-500 dark:text-slate-400 font-bold text-xs mb-1">عينات منجزة (مؤرشفة)</h3>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{archivedReqs.length}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Central Ledger Actions & Filters */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 custom-scrollbar">
          <button 
            onClick={() => setFilterTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${filterTab === 'all' ? 'bg-slate-800 text-white dark:bg-white dark:text-slate-900' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
          >
            الكل
          </button>
          <button 
            onClick={() => setFilterTab('pending_arrival')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${filterTab === 'pending_arrival' ? 'bg-slate-800 text-white dark:bg-white dark:text-slate-900' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
          >
            قيد التوصيل
          </button>
          <button 
            onClick={() => setFilterTab('under_testing')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${filterTab === 'under_testing' ? 'bg-slate-800 text-white dark:bg-white dark:text-slate-900' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
          >
            قيد الفحص
          </button>
          <button 
            onClick={() => setFilterTab('finished')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${filterTab === 'finished' ? 'bg-slate-800 text-white dark:bg-white dark:text-slate-900' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
          >
            منجزة
          </button>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          {hasPerm('receiveSamples') && (
            <button 
              onClick={() => setReceiveModal({ isOpen: true, code: '' })}
              className="flex-1 md:flex-none px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <FileSearch className="w-4 h-4" /> استلام عينة بالباركود
            </button>
          )}
          
          {(hasPerm('receiveSamples') || hasPerm('enterLabResults')) && (
            <button 
              onClick={() => setManualSampleModal({ isOpen: true })}
              className="flex-1 md:flex-none px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap border border-slate-200 dark:border-slate-700"
            >
              <Plus className="w-4 h-4" /> إنشاء يدوي
            </button>
          )}
        </div>
      </div>

      {/* Main Unified Table */}
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto">
        <h3 className="text-lg font-black text-slate-800 dark:text-white mb-6 flex items-center gap-2">
          <Database className="w-5 h-5 text-indigo-500" /> السجل المركزي للعينات
        </h3>
        
        <table className="w-full text-right text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
              <th className="pb-3 px-2 font-bold">كود العينة</th>
              <th className="pb-3 px-2 font-bold">المنشأة</th>
              <th className="pb-3 px-2 font-bold">الجهة المرسلة</th>
              <th className="pb-3 px-2 font-bold">تاريخ التسجيل</th>
              <th className="pb-3 px-2 font-bold">الحالة</th>
              <th className="pb-3 px-2 font-bold">الإجراءات التشغيلية</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
            {filteredReqs.length > 0 ? filteredReqs.map(req => (
              <tr key={req.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors group">
                <td className="py-4 px-2 font-black text-slate-400 text-[10px]">{req.id}</td>
                <td className="py-4 px-2 font-black text-slate-700 dark:text-slate-300">{req.estName}</td>
                <td className="py-4 px-2 font-bold text-slate-600 dark:text-slate-400">{req.teamName}</td>
                <td className="py-4 px-2 font-bold text-slate-500">{new Date(req.date).toLocaleDateString('en-GB')}</td>
                <td className="py-4 px-2">
                  {getStatusBadge(req.status, req)}
                </td>
                <td className="py-4 px-2">
                  {req.status === 'under_testing' && hasPerm('enterLabResults') && (
                    <button 
                      onClick={() => setResultModal({ isOpen: true, request: req })}
                      className="px-3 py-1.5 bg-teal-50 dark:bg-teal-900/20 hover:bg-teal-100 dark:hover:bg-teal-900/40 text-teal-700 dark:text-teal-400 rounded-lg text-[10px] font-black transition-colors flex items-center gap-1 w-fit border border-teal-200 dark:border-teal-800/30"
                    >
                      <FileText className="w-3 h-3" /> إدخال النتيجة
                    </button>
                  )}
                  {req.status === 'finished' && (
                    <span className="text-[10px] text-slate-400 font-bold bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">مؤرشفة</span>
                  )}
                  {req.status === 'pending_arrival' && hasPerm('receiveSamples') && (
                    <button 
                      onClick={() => toggleStatusManually(req)}
                      className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-indigo-700 dark:text-indigo-400 rounded-lg text-[10px] font-black transition-colors flex items-center gap-1 w-fit border border-indigo-200 dark:border-indigo-800/30"
                    >
                      <CheckCircle className="w-3 h-3" /> استلام يدوي
                    </button>
                  )}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="6" className="py-12 text-center text-slate-500 font-bold">لا توجد عينات مسجلة تطابق الفلتر الحالي.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Receive Sample by Code Modal */}
      {receiveModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[2rem] shadow-2xl p-6">
            <h2 className="text-lg font-black text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <FileSearch className="w-5 h-5 text-indigo-500" /> استلام عينة
            </h2>
            <p className="text-xs text-slate-500 font-bold mb-4">أدخل كود العينة (الباركود) الواردة مع المندوب لتحويلها فوراً إلى قيد الفحص.</p>
            <input 
              type="text" 
              placeholder="كود العينة..." 
              value={receiveModal.code}
              onChange={(e) => setReceiveModal({...receiveModal, code: e.target.value})}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 outline-none text-sm font-bold text-slate-800 dark:text-white focus:border-indigo-500 mb-6"
              autoFocus
            />
            <div className="flex gap-3">
              <button 
                onClick={() => setReceiveModal({ isOpen: false, code: '' })}
                className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm"
              >إلغاء</button>
              <button 
                onClick={handleReceiveSampleCode}
                className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm"
              >استلام</button>
            </div>
          </div>
        </div>
      )}

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

      {/* Manual Sample Modal */}
      {manualSampleModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[2rem] shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h2 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-indigo-500" /> إنشاء عينة يدوياً
              </h2>
              <button onClick={() => setManualSampleModal({isOpen: false})} className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 rounded-full cursor-pointer transition-colors">
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
                    <button onClick={() => setSelectedEstForSample(null)} className="text-xs text-red-500 hover:underline cursor-pointer">تغيير</button>
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-2">نوع العينة</label>
                <input
                  type="text"
                  value={manualSampleType}
                  onChange={(e) => setManualSampleType(e.target.value)}
                  placeholder="مثال: لحوم مجمدة، مياه شرب..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 outline-none text-sm font-bold text-slate-800 dark:text-white focus:border-indigo-500"
                />
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
              <button 
                onClick={handleCreateManualSample}
                disabled={!selectedEstForSample || !manualSampleType}
                className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-black text-sm transition-all shadow-lg shadow-indigo-600/20 cursor-pointer"
              >
                تسجيل وإنشاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
