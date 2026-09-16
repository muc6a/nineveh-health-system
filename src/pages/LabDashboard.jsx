import { AlertTriangle, Archive, BarChart3, Building, Check, CheckCircle, ClipboardList, Clock, CreditCard, Database, Eye, FileEdit, FileSearch, FileText, FlaskConical, LayoutDashboard, LogOut, Mail, Menu, Plus, Power, ShieldAlert, TrendingUp, X, Users } from 'lucide-react';
import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import UnifiedSidebar from '../components/UnifiedSidebar';
import { TeamDashboard } from '../pages/TeamDashboard';
import SmartTasks from '../components/SmartTasks';
import OperationsRoom from '../components/OperationsRoom';
import { EstablishmentsManager } from '../components/EstablishmentsManager';

import { FinancialReports } from '../components/FinancialReports';

import { AnimatedLogo } from '../components/AnimatedLogo';
import { ThemeToggle } from '../components/ThemeToggle';
import { WeatherWidget } from '../components/WeatherWidget';
import { GlobalHeader } from '../components/GlobalHeader';
import { NotificationBell } from '../components/NotificationBell';
import { DisplayPreferencesModal } from '../components/DisplayPreferencesModal';

export const LabDashboard = () => {
    const { user, setUser, navigate, notify, labRequests, setLabRequests, systemNotifications, setSystemNotifications, establishments, playBeep, uiPreferences, globalLogout, hasPerm, teams, setActiveSidebarTabs } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState(() => {
    const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    return params.get('tab') || 'stats';
  });

  const [showDisplayPrefsModal, setShowDisplayPrefsModal] = useState(false); // 'stats', 'incoming', 'testing', 'archive'

  React.useEffect(() => {
    let isAllowed = false;
    const canSeeStats = hasPerm('viewLabReports');
    const canSeeIncoming = hasPerm('receiveSamples');
    const canSeeTesting = hasPerm('enterLabResults');
    const canSeeArchive = hasPerm('labArchive');
    
    const canSeeDashboard = hasPerm('financialReports');
    const canSeeFines = hasPerm('payFines');
    const canSeeInventory = hasPerm('dailyInventory');
    const canSeeCompReports = hasPerm('viewComprehensiveFinancialReports');
    
    const canSeeStrategic = hasPerm('showMainDashboard') || hasPerm('showReportsPage');
    const canSeeSmartTasks = hasPerm('manageSmartTasks') || hasPerm('executeSmartTasks');
    const canSeeOps = hasPerm('authenticatePenalties');
    const canSeeDirectives = hasPerm('showDirectivesPage') || hasPerm('sendDirective') || hasPerm('replyDirective');
    const canSeeComplaints = hasPerm('showPublicEvalsPage') || hasPerm('showDeliveryPage');
    const canSeeEst = hasPerm('manageEstablishments');

    if (activeTab === 'stats' && canSeeStats) isAllowed = true;
    if (activeTab === 'incoming' && canSeeIncoming) isAllowed = true;
    if (activeTab === 'testing' && canSeeTesting) isAllowed = true;
    if (activeTab === 'archive' && canSeeArchive) isAllowed = true;
    if (activeTab === 'financials' && canSeeDashboard) isAllowed = true;
    if (activeTab === 'ext_financials' && canSeeFines) isAllowed = true;
    if (activeTab === 'reconciliation' && canSeeInventory) isAllowed = true;
    if (activeTab === 'comprehensive_reports' && canSeeCompReports) isAllowed = true;
    if (activeTab === 'strategic' && canSeeStrategic) isAllowed = true;
    if (activeTab === 'smart_tasks' && canSeeSmartTasks) isAllowed = true;
    if (activeTab === 'operations_room' && canSeeOps) isAllowed = true;
    if (activeTab === 'directives' && canSeeDirectives) isAllowed = true;
    if (activeTab === 'complaints' && canSeeComplaints) isAllowed = true;
    if (activeTab === 'establishments' && canSeeEst) isAllowed = true;

    if (!isAllowed) {
       if (canSeeStats) setActiveTab('stats');
       else if (canSeeIncoming) setActiveTab('incoming');
       else if (canSeeTesting) setActiveTab('testing');
       else if (canSeeArchive) setActiveTab('archive');
       else if (canSeeDashboard) setActiveTab('financials');
       else if (canSeeFines) setActiveTab('ext_financials');
       else if (canSeeInventory) setActiveTab('reconciliation');
       else if (canSeeCompReports) setActiveTab('comprehensive_reports');
       else if (canSeeStrategic) setActiveTab('strategic');
       else if (canSeeSmartTasks) setActiveTab('smart_tasks');
       else if (canSeeOps) setActiveTab('operations_room');
       else if (canSeeDirectives) setActiveTab('directives');
       else if (canSeeComplaints) setActiveTab('complaints');
       else if (canSeeEst) setActiveTab('establishments');
    }
  }, [user?.permissions, activeTab]);
  const [resultModal, setResultModal] = useState({ isOpen: false, request: null, mode: 'create' });
  const [resultStatus, setResultStatus] = useState('safe');
  const [resultNotes, setResultNotes] = useState('');
  const [newSampleModal, setNewSampleModal] = useState({ isOpen: false });
  const [searchEst, setSearchEst] = useState('');
  const [selectedEstForSample, setSelectedEstForSample] = useState(null);
  const [manualSampleType, setManualSampleType] = useState('');
  const [manualSampleRemarks, setManualSampleRemarks] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  React.useEffect(() => {
    if (setActiveSidebarTabs) {
      setActiveSidebarTabs([
        { id: 'stats', label: 'الرئيسية والتقارير' },
        { id: 'testing', label: 'فحص العينات' }
      ]);
    }
  }, []);

  // Listen for navigation events from NotificationBell
  React.useEffect(() => {
    const handleNav = () => {
      setActiveTab('incoming');
      setIsSidebarOpen(false);
    };
    const handleNavResults = () => {
      setActiveTab('testing');
      setIsSidebarOpen(false);
    };
    window.addEventListener('navToLabRequests', handleNav);
    window.addEventListener('navToLabResults', handleNavResults);
    return () => {
      window.removeEventListener('navToLabRequests', handleNav);
      window.removeEventListener('navToLabResults', handleNavResults);
    };
  }, []);


  // Protect route
  useEffect(() => {
    const hasLabAccess = user && (user.role === 'lab' || user.permissions?.receiveSamples || user.permissions?.enterLabResults || user.permissions?.labArchive);
    if (!hasLabAccess) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  // Filter requests
  const safeLabRequests = labRequests || [];
  const safeEstablishments = establishments || [];
  const incomingReqs = safeLabRequests.filter(r => r.status === 'pending_arrival');
  const testingReqs = safeLabRequests.filter(r => r.status === 'under_testing');
  const archivedReqs = safeLabRequests.filter(r => r.status === 'finished');

  

  
  const handleCreateManualSample = () => {
    if (!selectedEstForSample || !manualSampleType) return;
    const newLabReq = {
      id: Math.floor(10000 + Math.random() * 90000).toString(),
      establishmentId: selectedEstForSample.id,
      estName: selectedEstForSample.name || 'غير معروف',
      teamId: user?.id || 'lab_manual',
      teamName: user?.name || 'مختبر',
      date: new Date().toISOString().split('T')[0],
      status: 'under_testing', // Automatically in testing if created manually
      receivedAt: new Date().toISOString(),
      sampleCode: Math.floor(10000 + Math.random() * 90000).toString(),
      sampleType: manualSampleType,
      senderNotes: manualSampleRemarks
    };
    setLabRequests(prev => [newLabReq, ...prev]);
    setNewSampleModal({ isOpen: false });
    setSelectedEstForSample(null);
    setManualSampleType('');
    setManualSampleRemarks('');
    playBeep && playBeep('success');
  };

  const handleReceiveSample = (id) => {
    setLabRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'under_testing', receivedAt: new Date().toISOString() } : r));
    playBeep && playBeep('success');
  };

  const handleSaveResult = () => {
    if (!resultModal.request) return;

    const reqId = resultModal.request.id;
    const isContaminated = resultStatus === 'contaminated';
    const isEditMode = resultModal.mode === 'edit';

    // Update request
    setLabRequests(prev => prev.map(r => {
      if (r.id === reqId) {
        const updatedReq = { 
          ...r, 
          status: 'finished', 
          result: resultStatus, 
          notes: resultNotes
        };
        if (!isEditMode) {
          updatedReq.finishedAt = new Date().toISOString();
        } else {
          updatedReq.editedBy = user?.name;
          updatedReq.editedAt = new Date().toISOString();
        }
        return updatedReq;
      }
      return r;
    }));

    // Notify operations if contaminated (only if not editing, or maybe if edit changed it)
    if (!isEditMode) {
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
        setSystemNotifications(prev => [{
          id: 'notif_' + Date.now(),
          title: '✅ نتيجة عينة سليمة',
          message: `عينات المنشأة (${resultModal.request.estName}) سليمة ومطابقة للمواصفات.`,
          date: new Date().toISOString(),
          isRead: false,
          targetRole: resultModal.request.teamId
        }, ...prev]);
      }
      
      // Attach lab document to establishment
      if (resultModal.request.establishmentId) {
        setEstablishments(prev => prev.map(est => {
          if (est.id === resultModal.request.establishmentId) {
            const doc = {
              id: 'doc_' + Date.now(),
              name: `نتيجة فحص مختبري - ${resultModal.request.sampleType || 'عينة'}`,
              type: 'وثيقة رسمية',
              url: '#',
              date: new Date().toISOString().split('T')[0],
              isLabResult: true,
              status: isContaminated ? 'سلبية' : 'سليمة'
            };
            return { ...est, documents: [...(est.documents || []), doc] };
          }
          return est;
        }));
      }
    }

    setResultModal({ isOpen: false, request: null, mode: 'create' });
    setResultStatus('safe');
    setResultNotes('');
    playBeep && playBeep('success');
  };

  return (
    <div 
      className={`min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300 ${uiPreferences?.density === 'compact' ? 'ui-compact' : 'ui-comfortable'}`}
      style={{
        '--ui-heading-size': uiPreferences?.headingSize || '18px',
        '--ui-body-size': uiPreferences?.bodySize || '12px',
      }}
      dir="rtl"
    >
      
      <UnifiedSidebar 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />
      
      <DisplayPreferencesModal 
        isOpen={showDisplayPrefsModal} 
        onClose={() => setShowDisplayPrefsModal(false)} 
      />

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
        
        {/* Header */}
        <div className="relative z-40 mb-6 pt-6 lg:pt-8 px-4 lg:px-8 mt-4 md:mt-0">
          <div className="flex items-center gap-3 md:hidden mb-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -mr-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
          <GlobalHeader>
            <button
              onClick={() => setShowDisplayPrefsModal(true)}
              className="px-4 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all cursor-pointer shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2 group whitespace-nowrap"
            >
              <Eye className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:text-teal-600 transition-colors" />
              تخصيص العرض
            </button>
          </GlobalHeader>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 custom-scrollbar">
          <div className="w-full max-w-full mx-auto space-y-6">

            {/* STATS */}
            {activeTab === 'stats' && hasPerm('viewLabReports') && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {/* Card 1: Total */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xl border border-slate-700/50 hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 text-right group relative overflow-hidden">
                    <div className="absolute top-2 left-2 opacity-5 group-hover:opacity-10 transition-opacity">
                      <FlaskConical className="w-32 h-32 text-white" />
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-400 text-[10px] font-black tracking-wider uppercase bg-slate-500/10 px-2 py-0.5 rounded-lg border border-slate-500/20">عينات نينوى</span>
                    </div>
                    <h3 className="text-xs text-slate-300 font-bold">إجمالي العينات المستلمة</h3>
                    <span className="text-4xl lg:text-5xl font-black text-white mt-1 block">{labRequests.length} <span className="text-sm text-slate-400 font-medium">عينة</span></span>
                  </div>

                  {/* Card 2: Pending */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-900 to-slate-900 text-white shadow-xl border border-amber-800/40 hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 text-right group relative overflow-hidden">
                    <div className="absolute top-2 left-2 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Clock className="w-32 h-32 text-white" />
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-amber-400 text-[10px] font-black tracking-wider uppercase bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">قيد الفحص</span>
                    </div>
                    <h3 className="text-xs text-amber-300/70 font-bold">عينات تنتظر الفحص</h3>
                    <span className="text-4xl lg:text-5xl font-black text-amber-500 mt-1 block">{testingReqs.length} <span className="text-sm text-amber-500/60 font-medium">عينة</span></span>
                  </div>

                  {/* Card 3: Completed */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-900 to-slate-900 text-white shadow-xl border border-emerald-800/40 hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 text-right group relative overflow-hidden">
                    <div className="absolute top-2 left-2 opacity-5 group-hover:opacity-10 transition-opacity">
                      <CheckCircle className="w-32 h-32 text-white" />
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-emerald-400 text-[10px] font-black tracking-wider uppercase bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">إنجاز</span>
                    </div>
                    <h3 className="text-xs text-emerald-300/70 font-bold">عينات منجزة بنجاح</h3>
                    <span className="text-4xl lg:text-5xl font-black text-emerald-500 mt-1 block">{archivedReqs.length} <span className="text-sm text-emerald-500/60 font-medium">عينة</span></span>
                  </div>

                  {/* Card 4: Completion Rate */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white shadow-xl border border-indigo-800/40 hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 text-right group relative overflow-hidden">
                    <div className="absolute top-2 left-2 opacity-5 group-hover:opacity-10 transition-opacity">
                      <TrendingUp className="w-32 h-32 text-white" />
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-indigo-400 text-[10px] font-black tracking-wider uppercase bg-indigo-500/10 px-2 py-0.5 rounded-lg border border-indigo-500/20">أداء</span>
                    </div>
                    <h3 className="text-xs text-indigo-300/70 font-bold">نسبة إنجاز المختبر</h3>
                    <span className="text-4xl lg:text-5xl font-black text-indigo-500 mt-1 block">{labRequests.length > 0 ? ((archivedReqs.length / labRequests.length) * 100).toFixed(1) : 0} <span className="text-sm text-indigo-500/60 font-medium">%</span></span>
                  </div>
                </div>

                <div className="glassmorphic-card rounded-3xl p-6 border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-900/50 min-h-[50vh] animate-in fade-in duration-500">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-900/20 text-teal-600 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-800 dark:text-white text-lg">إحصائيات العينات الواردة</h3>
                    <p className="text-xs text-slate-500">عدد العينات المرسلة من الفرق الميدانية</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {(teams || []).map(team => {
                    const teamSamplesCount = (labRequests || []).filter(r => r.teamId === team.id || r.senderName === team.name).length;
                    return (
                      <div key={team.id} className="bg-white/50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-200/50 dark:border-slate-700/50 flex flex-col gap-2 shadow-sm hover:shadow-md transition-all">
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{team.name}</span>
                        <div className="flex items-end justify-between">
                          <span className="text-2xl font-black text-slate-800 dark:text-white">{teamSamplesCount}</span>
                          <span className="text-[10px] text-teal-600 bg-teal-50 dark:bg-teal-900/30 px-2 py-0.5 rounded-full font-bold">عينة</span>
                        </div>
                      </div>
                    );
                  })}
                  {(teams?.length === 0) && (
                    <div className="col-span-full p-4 text-center text-slate-400 text-sm">
                      لا توجد فرق ميدانية مسجلة حتى الآن.
                    </div>
                  )}
                </div>
              </div>
              </div>
            )}

            {/* INCOMING */}
            {activeTab === 'incoming' && hasPerm('receiveSamples') && (
              <div className="glassmorphic-card rounded-3xl p-6 border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-900/50 min-h-[50vh] animate-in fade-in duration-500">
                <div className="flex justify-end mb-6">
                  {hasPerm('receiveSamples') && (
                    <button 
                      onClick={() => setNewSampleModal({ isOpen: true })}
                      className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm transition-all shadow-md flex items-center gap-2 cursor-pointer"
                    >
                      <Plus className="w-5 h-5" /> إنشاء عينة جديدة يدويًا
                    </button>
                  )}
                </div>
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
                            <h4 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                              {req.estName}
                              {req.sampleCode && <span className="text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-full">كود: {req.sampleCode}</span>}
                              {req.sampleType && <span className="text-[10px] bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-2 py-0.5 rounded-full">{req.sampleType}</span>}
                            </h4>
                            <p className="text-xs text-slate-500 mt-1">مرسلة من: {req.teamName} - {new Date(req.date).toLocaleString('ar-IQ')}</p>
                            {req.senderNotes && <p className="text-xs text-slate-400 mt-1 bg-white dark:bg-slate-800 px-2 py-1 rounded inline-block">ملاحظة: {req.senderNotes}</p>}
                          </div>
                        </div>
                        {hasPerm('receiveSamples') && (
                          <button 
                            onClick={() => handleReceiveSample(req.id)}
                            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2 cursor-pointer w-full md:w-auto justify-center whitespace-nowrap"
                          >
                            <CheckCircle className="w-4 h-4" /> تأكيد الاستلام المادي
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TESTING */}
            {activeTab === 'testing' && hasPerm('enterLabResults') && (
              <div className="glassmorphic-card rounded-3xl p-6 border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-900/50 min-h-[50vh] animate-in fade-in duration-500">
                <div className="flex justify-end mb-6">
                  {hasPerm('receiveSamples') && (
                    <button 
                      onClick={() => setNewSampleModal({ isOpen: true })}
                      className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm transition-all shadow-md flex items-center gap-2 cursor-pointer"
                    >
                      <Plus className="w-5 h-5" /> إنشاء عينة جديدة يدويًا
                    </button>
                  )}
                </div>
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
                            <h4 className="font-bold text-slate-800 dark:text-white text-lg flex items-center gap-2">
                              {req.estName}
                              {req.sampleCode && <span className="text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-full">كود: {req.sampleCode}</span>}
                              {req.sampleType && <span className="text-[10px] bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-2 py-0.5 rounded-full">{req.sampleType}</span>}
                            </h4>
                            <p className="text-xs text-slate-500 mt-1">مرسلة من: {req.teamName} - تم الاستلام: {new Date(req.receivedAt).toLocaleTimeString('ar-IQ')}</p>
                          </div>
                        </div>
                        {hasPerm('enterLabResults') && (
                          <button 
                            onClick={() => setResultModal({ isOpen: true, request: req })}
                            className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-teal-600/20 flex items-center gap-2 cursor-pointer w-full md:w-auto justify-center whitespace-nowrap"
                          >
                            <FileText className="w-4 h-4" /> إدخال النتيجة
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* ARCHIVE */}
            
            
    
            {activeTab === 'archive' && hasPerm('labArchive') && (
              <div className="glassmorphic-card rounded-3xl p-6 border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-900/50 min-h-[50vh] animate-in fade-in duration-500">
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
        </div>
      
                                                                            
      
                                                                                    
                                                    
      
            {activeTab === 'financials' && <div className="w-full h-full min-h-[85vh]"><FinancialReports /></div>}
            {activeTab === 'ext_financials' && <div className="w-full h-full min-h-[85vh]"><FinancialReports /></div>}
            {activeTab === 'reconciliation' && <div className="w-full h-full min-h-[85vh]"><FinancialReports /></div>}
            {activeTab === 'comprehensive_reports' && <div className="w-full h-full min-h-[85vh]"><FinancialReports /></div>}
            
            {activeTab === 'strategic' && <TeamDashboard embeddedTab="strategic" />}
            {activeTab === 'smart_tasks' && <div className="w-full h-full min-h-[85vh]"><SmartTasks /></div>}
            {activeTab === 'operations_room' && <div className="w-full h-full min-h-[85vh]"><OperationsRoom /></div>}
            {activeTab === 'establishments' && <div className="w-full h-full min-h-[85vh]"><EstablishmentsManager /></div>}
            {activeTab === 'directives' && <TeamDashboard embeddedTab="directives" />}
            {activeTab === 'complaints' && <TeamDashboard embeddedTab="complaints" />}

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

export default LabDashboard;
