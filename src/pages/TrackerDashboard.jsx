import React, { useContext, useState, useRef, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { ThemeToggle } from '../components/ThemeToggle';
import { NotificationBell } from '../components/NotificationBell';
import { WeatherWidget } from '../components/WeatherWidget';
import { usePersistentTab } from '../hooks/usePersistentTab';
import { LogOut, Settings, Camera, ShieldAlert, CheckCircle2, MapPin, X, Plus, Target, Building, Save, ScanLine, Radar, RefreshCw, Search, ClipboardList, Clock } from 'lucide-react';

export const TrackerDashboard = () => {
  const { user, establishments, addEstablishment, updateEstablishment, closureVerifications, setClosureVerifications, navigate, notify, addSystemNotification, setShowDisplayPrefsModal, tasks, setTasks } = useContext(AppContext);
  
  // UI States
  const [activeTab, setActiveTab] = usePersistentTab('trackerActiveTab', 'daily_tasks');
  
  // Camera & Verification States
  const [selectedEst, setSelectedEst] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraMode, setCameraMode] = useState('verification');
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Location States
  const [locationLog, setLocationLog] = useState('');
  const [liveLocation, setLiveLocation] = useState(null);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  
  // States for "Add New"
  const [newEstName, setNewEstName] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newEstType, setNewEstType] = useState('مطعم');
  const [newEstAddress, setNewEstAddress] = useState('');

  // States for "Update Location"
  const [updatingEstId, setUpdatingEstId] = useState(null);
  const [updateManualAddress, setUpdateManualAddress] = useState('');
  const [updateLiveLocation, setUpdateLiveLocation] = useState(null);

  // Daily Stats (Mock)
  const [dailyStats, setDailyStats] = useState({ verified: 0, added: 0, updated: 0 });

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const trackerSector = user?.linkedTeamSector || user?.sector || 'الجانب الأيسر';
  
  const isMatchSector = (estSec) => {
    const t = trackerSector.trim().replace(/[أإآ]/g, 'ا');
    const s = (estSec || '').trim().replace(/[أإآ]/g, 'ا');
    return s === t || s.includes(t) || t.includes(s) || (s.includes('ايمن') && t.includes('ايمن')) || (s.includes('ايسر') && t.includes('ايسر'));
  };

  // Lists
  const sectorEstablishments = establishments.filter(e => isMatchSector(e.sector));
  const closedEstablishments = sectorEstablishments.filter(e => ((e.lastInspection !== 'لم يزر بعد' && e.score < 70) || e.status === 'closed'));
  
  // Establishments missing either GPS or manual Address
  const establishmentsNeedsLocation = sectorEstablishments.filter(e => !e.lat || !e.lng || !e.manualAddress);

  // Verification Logic: Split closed establishments into verified today and pending
  const todayStr = new Date().toDateString();
  const todayVerifications = closureVerifications.filter(v => v.trackerId === user.id && new Date(v.date).toDateString() === todayStr);
  const verifiedEstIds = todayVerifications.map(v => v.estId);

  const pendingVerifications = closedEstablishments.filter(e => !verifiedEstIds.includes(e.id));
  const verifiedToday = closedEstablishments.filter(e => verifiedEstIds.includes(e.id));

  // Request Location
  const myTasks = (tasks || []).filter(t => t.assignedTo === user.id || t.assignedTo === 'all');
  const pendingTasks = myTasks.filter(t => t.status === 'pending');
  const completedTasks = myTasks.filter(t => t.status === 'completed');
  const requestLocation = (onSuccess) => {
    setIsFetchingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude.toFixed(6);
          const lon = position.coords.longitude.toFixed(6);
          setLiveLocation({ lat, lon });
          setLocationLog(`${lat}° N, ${lon}° E`);
          setIsFetchingLocation(false);
          if (onSuccess) onSuccess({ lat, lon });
        },
        (error) => {
          console.error(error);
          const mockLat = (36.3489 + (Math.random() - 0.5) * 0.02).toFixed(6);
          const mockLon = (43.1578 + (Math.random() - 0.5) * 0.02).toFixed(6);
          setLiveLocation({ lat: mockLat, lon: mockLon });
          setLocationLog(`${mockLat}° N, ${mockLon}° E (محاكاة)`);
          setIsFetchingLocation(false);
          if (onSuccess) onSuccess({ lat: mockLat, lon: mockLon });
        }
      );
    } else {
      setIsFetchingLocation(false);
      notify('الـ GPS غير مدعوم في جهازك', 'error');
    }
  };

  const startCamera = async (mode = 'verification', est = null) => {
    setCameraMode(mode);
    setSelectedEst(est);
    setIsCameraOpen(true);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      requestLocation();
    } catch (err) {
      console.error("Camera access denied:", err);
      notify('تعذر الوصول للكاميرا. يرجى التأكد من الصلاحيات.', 'error');
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      const context = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setCapturedPhoto(dataUrl);
      
      const stream = video.srcObject;
      if (stream) stream.getTracks().forEach(track => track.stop());
      setIsCameraOpen(false);
    }
  };

  const cancelCamera = () => {
    const video = videoRef.current;
    if (video && video.srcObject) {
      video.srcObject.getTracks().forEach(track => track.stop());
    }
    setIsCameraOpen(false);
    setSelectedEst(null);
    setCapturedPhoto(null);
  };

  // Handlers for submission
  const submitVerification = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      // Remove any previous verification for today to replace it (Retake photo logic)
      const filteredVerifications = closureVerifications.filter(v => !(v.estId === selectedEst.id && new Date(v.date).toDateString() === todayStr));
      
      const newVerification = {
        id: `ver_${Date.now()}`,
        type: 'compliance_check',
        trackerId: user.id,
        trackerName: user.name,
        estId: selectedEst.id,
        estName: selectedEst.name,
        photo: capturedPhoto,
        location: liveLocation,
        locationLog,
        date: new Date().toISOString()
      };
      
      setClosureVerifications([newVerification, ...filteredVerifications]);
      setDailyStats(prev => ({ ...prev, verified: prev.verified + 1 }));
      notify('تم إرسال تقرير التوثيق بنجاح!', 'success', true);
      
      setIsSubmitting(false);
      cancelCamera();
    }, 1500);
  };

  const submitNewEstablishment = () => {
    if (!newEstName) return notify('يرجى إدخال اسم المنشأة', 'error');
    if (!capturedPhoto) return notify('يرجى التقاط صورة للواجهة', 'error');

    setIsSubmitting(true);
    setTimeout(() => {
      addEstablishment({
        name: newEstName,
        type: newEstType,
        sector: trackerSector,
        lat: liveLocation?.lat,
        lng: liveLocation?.lon,
        manualAddress: newEstAddress,
        photo: capturedPhoto,
        status: 'uninspected',
        score: 0,
        lastInspection: 'لم يزر بعد'
      });
      setDailyStats(prev => ({ ...prev, added: prev.added + 1 }));
      notify('تم رصد المنشأة وإضافتها للنظام!', 'success', true);
      
      if (addSystemNotification) {
        addSystemNotification(
          '🚨 رصد منشأة جديدة غير مسجلة',
          `تم رصد مطعم جديد باسم "${newEstName}" في قطاع ${trackerSector} من قبل المتابع ${user.name}. يرجى توجيه لجنة لتفتيشه.`,
          'central_director'
        );
      }
      
      setIsSubmitting(false);
      setNewEstName('');
      setNewEstAddress('');
      setIsAddingNew(false);
      cancelCamera();
      setActiveTab('verifications');
    }, 1500);
  };

  const handleUpdateLocation = (estId) => {
    if (!updateLiveLocation && !updateManualAddress) {
      return notify('يرجى سحب الموقع الإلكتروني أو إدخال العنوان اليدوي', 'error');
    }
    
    setIsSubmitting(true);
    setTimeout(() => {
      const updates = {};
      if (updateLiveLocation) {
        updates.lat = updateLiveLocation.lat;
        updates.lng = updateLiveLocation.lon;
      }
      if (updateManualAddress) {
        updates.manualAddress = updateManualAddress;
      }
      
      updateEstablishment(estId, updates);
      setDailyStats(prev => ({ ...prev, updated: prev.updated + 1 }));
      notify('تم تحديث بيانات الموقع بنجاح!', 'success');
      
      setUpdatingEstId(null);
      setUpdateManualAddress('');
      setUpdateLiveLocation(null);
      setIsSubmitting(false);
    }, 800);
  };

  if (user?.role !== 'tracker') {
    return <div className="p-8 text-center text-white">غير مصرح لك بالدخول</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-cairo dir-rtl pb-20">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
              <ScanLine className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-black text-slate-800 dark:text-white">المتابع الميداني</h1>
              <p className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400">حساب المتابعة والرصد المستمر</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400">
              <span>{new Date().toLocaleDateString('ar-IQ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              <span className="text-slate-300 dark:text-slate-600">|</span>
              <WeatherWidget variant="minimal" />
            </div>
            <NotificationBell />
            <ThemeToggle />
            <button 
              onClick={() => setShowDisplayPrefsModal(true)}
              className="flex items-center gap-2 p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 transition-colors"
            >
              <Settings className="w-5 h-5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline text-xs font-bold">تخصيص العرض</span>
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="flex items-center gap-2 p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-slate-600 dark:text-slate-400 hover:text-rose-600 transition-colors"
            >
              <LogOut className="w-5 h-5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline text-xs font-bold">تسجيل خروج</span>
            </button>
          </div>
        </div>
      </header>

      {/* Daily Stats */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4">
        <div className="container mx-auto max-w-2xl flex justify-between items-center text-center divide-x divide-x-reverse divide-white/20">
          <div className="px-2 flex-1">
            <p className="text-2xl font-black">{dailyStats.verified}</p>
            <p className="text-[10px] font-bold opacity-80">توثيق إغلاق</p>
          </div>
          <div className="px-2 flex-1">
            <p className="text-2xl font-black text-emerald-300">{dailyStats.added}</p>
            <p className="text-[10px] font-bold opacity-80">رصد جديد</p>
          </div>
          <div className="px-2 flex-1">
            <p className="text-2xl font-black text-amber-300">{dailyStats.updated}</p>
            <p className="text-[10px] font-bold opacity-80">تحديث موقع</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="container mx-auto px-4 max-w-2xl mt-6">
        <div className="flex flex-wrap p-1 bg-slate-200 dark:bg-slate-800 rounded-2xl mb-6 gap-1">
          <button
            onClick={() => setActiveTab('daily_tasks')}
            className={`flex-1 min-w-[100px] py-2.5 text-xs font-black rounded-xl transition-all relative ${
              activeTab === 'daily_tasks' ? 'bg-white dark:bg-slate-700 shadow-md text-purple-600 dark:text-purple-400' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <div className="flex items-center justify-center gap-1.5">
              <ClipboardList className="w-3.5 h-3.5" />
              مهام موجهة
              {pendingTasks.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[9px] flex items-center justify-center shadow-md animate-pulse">
                  {pendingTasks.length}
                </span>
              )}
            </div>
          </button>
          <button
            onClick={() => setActiveTab('verifications')}
            className={`flex-1 min-w-[100px] py-2.5 text-xs font-black rounded-xl transition-all ${
              activeTab === 'verifications' ? 'bg-white dark:bg-slate-700 shadow-md text-blue-600 dark:text-blue-400' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            التحقق للإغلاقات
          </button>
          <button
            onClick={() => { setActiveTab('add_new'); setIsAddingNew(false); setNewEstName(''); }}
            className={`flex-1 min-w-[100px] py-2.5 text-xs font-black rounded-xl transition-all ${
              activeTab === 'add_new' ? 'bg-white dark:bg-slate-700 shadow-md text-emerald-600 dark:text-emerald-400' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            رصد جديد
          </button>
          <button
            onClick={() => setActiveTab('update_location')}
            className={`flex-1 min-w-[100px] py-2.5 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1 ${
              activeTab === 'update_location' ? 'bg-white dark:bg-slate-700 shadow-md text-amber-600 dark:text-amber-400' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Radar className="w-3 h-3" />
            تحديث مواقع
          </button>
        </div>
        
        {/* Tab 0: Daily Tasks */}
        {activeTab === 'daily_tasks' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {pendingTasks.length === 0 ? (
              <div className="text-center p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center min-h-[40vh]">
                <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </div>
                <h3 className="font-black text-slate-800 dark:text-white text-lg">لا توجد مهام حالية</h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-2 font-bold max-w-xs leading-relaxed">أنتظر توجيهات جديدة من غرفة العمليات أو يمكنك البدء بالرصد الميداني الروتيني.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-sm font-black text-slate-800 dark:text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    مهام موجهة عاجلة
                  </h2>
                  <span className="text-[10px] font-bold text-slate-500">{pendingTasks.length} مهام متبقية</span>
                </div>
                
                {pendingTasks.map(task => {
                  const targetEst = establishments.find(e => e.id === task.targetEstId);
                  return (
                    <div key={task.id} className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-purple-200 dark:border-purple-900/30 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
                      <div className="absolute top-0 right-0 w-1.5 h-full bg-gradient-to-b from-purple-500 to-indigo-500"></div>
                      
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-black text-slate-800 dark:text-white text-sm pl-2 leading-relaxed">{task.title}</h3>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-lg">
                          <Clock className="w-3 h-3" />
                          {new Date(task.createdAt).toLocaleTimeString('ar-IQ', {hour: '2-digit', minute:'2-digit'})}
                        </div>
                      </div>
                      
                      <p className="text-xs text-slate-600 dark:text-slate-300 font-bold leading-relaxed mb-4 bg-purple-50 dark:bg-purple-900/10 p-3 rounded-xl border border-purple-100 dark:border-purple-900/20">
                        {task.description}
                      </p>

                      {targetEst && (
                        <div className="mb-4 flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                          <MapPin className="w-4 h-4 text-slate-400" />
                          <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                            الهدف: <span className="text-slate-900 dark:text-white">{targetEst.name}</span> ({targetEst.sector})
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            if (targetEst) {
                              startCamera('verification', targetEst);
                            } else {
                              startCamera('add_new');
                            }
                          }}
                          className="flex-1 py-3 text-white rounded-xl text-xs font-black transition-all shadow-md active:scale-95 bg-purple-600 hover:bg-purple-700 shadow-purple-500/20 flex items-center justify-center gap-2"
                        >
                          <Camera className="w-4 h-4" />
                          توثيق وإنجاز
                        </button>
                        <button
                          onClick={() => {
                            setTasks(tasks.map(t => t.id === task.id ? {...t, status: 'completed'} : t));
                            notify('تم إغلاق المهمة!', 'success');
                          }}
                          className="px-4 text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/40 rounded-xl text-[10px] font-bold transition-colors"
                        >
                          إنهاء بدون توثيق
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
            {completedTasks.length > 0 && (
              <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
                <h3 className="text-xs font-black text-slate-400 mb-3">مهام أُنجزت مؤخراً ({completedTasks.length})</h3>
                <div className="space-y-2">
                  {completedTasks.slice(0, 3).map(task => (
                    <div key={task.id} className="flex items-center gap-3 p-3 bg-slate-100 dark:bg-slate-800/50 rounded-xl">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 line-through decoration-emerald-500/30">{task.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Tab 1: Verifications */}
        {activeTab === 'verifications' && (
          <div className="space-y-6">
            
            {/* Pending Verifications */}
            <div>
              <h2 className="text-sm font-black text-slate-800 dark:text-white flex justify-between items-center mb-4">
                <span>مطاعم مغلقة بانتظار التأكد من الالتزام</span>
                <span className="bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400 px-2 py-1 rounded-lg text-[10px]">{pendingVerifications.length}</span>
              </h2>
              
              <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/50 p-4 rounded-2xl flex gap-3 mb-4">
                <ShieldAlert className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-800 dark:text-blue-400 font-bold leading-relaxed">
                  مهمتك هنا هي التقاط صورة للواجهة للتأكد من أن صاحب المطعم لم يكسر الشمع الأحمر وأنه ملتزم بالقرار. لست مسؤولاً عن قرار الفتح أو الإغلاق.
                </p>
              </div>
              
              {pendingVerifications.length === 0 ? (
                <div className="text-center p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                  <h3 className="font-bold text-slate-700 dark:text-slate-300">لقد وثقت جميع المطاعم المغلقة لليوم!</h3>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingVerifications.map(est => (
                    <div key={est.id} className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-rose-200 dark:border-rose-900/30 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
                      <div className="absolute top-0 right-0 w-1.5 h-full bg-rose-500"></div>
                      <div className="flex flex-col gap-4">
                        <div>
                          <h3 className="font-black text-slate-800 dark:text-white text-base">{est.name}</h3>
                          <p className="text-xs text-slate-500 mt-1 font-bold">القطاع/الحي: {est.neighborhood || est.sector}</p>
                          <p className="text-[11px] font-bold mt-2 inline-block px-2 py-1 rounded-lg bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400">
                            {est.status === 'closed' ? 'حالة المطعم: مغلق بالشمع الأحمر' : `التقييم: ${est.score}% - حرج (تأكد من إغلاقه)`}
                          </p>
                        </div>
                        <button
                          onClick={() => startCamera('verification', est)}
                          className="flex items-center justify-center gap-2 w-full py-3 text-white rounded-xl text-xs font-black transition-all shadow-md active:scale-95 bg-rose-600 hover:bg-rose-700 shadow-rose-500/20"
                        >
                          <Camera className="w-4 h-4" />
                          التقاط صورة للتحقق من الالتزام
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Verified Today */}
            {verifiedToday.length > 0 && (
              <div className="mt-8">
                <h2 className="text-sm font-black text-slate-500 dark:text-slate-400 mb-4">
                  تم توثيقه اليوم ({verifiedToday.length})
                </h2>
                <div className="space-y-3">
                  {verifiedToday.map(est => {
                    const verification = todayVerifications.find(v => v.estId === est.id);
                    return (
                      <div key={est.id} className="bg-emerald-50/50 dark:bg-emerald-900/10 rounded-2xl p-4 border border-emerald-100 dark:border-emerald-900/30 flex items-center justify-between">
                        <div>
                          <h3 className="font-bold text-sm text-slate-800 dark:text-white line-through decoration-emerald-500/50">{est.name}</h3>
                          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> تم التوثيق {new Date(verification.date).toLocaleTimeString('ar-IQ', { hour: '2-digit', minute:'2-digit' })}
                          </p>
                        </div>
                        <button
                          onClick={() => startCamera('verification', est)}
                          className="text-[10px] font-bold text-slate-500 hover:text-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center gap-1 transition-colors"
                        >
                          <RefreshCw className="w-3 h-3" />
                          إعادة الالتقاط
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Add New */}
        {activeTab === 'add_new' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm transition-all">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-2xl flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-sm font-black text-slate-800 dark:text-white">رصد منشأة جديدة</h2>
                <p className="text-[10px] text-slate-500 font-bold mt-1">ابحث عن المحل للتأكد من عدم وجوده أولاً</p>
              </div>
            </div>

            <div className="space-y-5">
              {/* Step 1: Search and verify it doesn't exist */}
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-2 mr-1">بحث بالاسم التجاري</label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                    <Search className="w-4 h-4 text-slate-400" />
                  </div>
                  <input 
                    type="text" 
                    value={newEstName}
                    onChange={e => setNewEstName(e.target.value)}
                    placeholder="اكتب اسم المحل للبحث..." 
                    className="w-full p-4 pr-10 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-sm font-bold focus:border-emerald-500 outline-none transition-colors"
                  />
                  
                  {/* Search Results */}
                  {newEstName.length > 2 && (
                    <div className="mt-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3">
                      {establishments.filter(e => e.name.includes(newEstName)).length > 0 ? (
                        <>
                          <p className="text-[10px] font-bold text-rose-500 mb-2">توجد محلات مطابقة، هل هو أحدها؟</p>
                          {establishments.filter(e => e.name.includes(newEstName)).slice(0, 3).map(e => (
                            <div key={e.id} className="text-xs text-slate-700 dark:text-slate-300 py-1.5 border-b border-slate-200 dark:border-slate-700 last:border-0">{e.name} <span className="text-slate-400">({e.sector})</span></div>
                          ))}
                        </>
                      ) : (
                        <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> هذا المحل غير مسجل في النظام.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Reveal Adding form only if requested */}
              {newEstName.length > 2 && !isAddingNew && (
                <button
                  onClick={() => setIsAddingNew(true)}
                  className="w-full py-3 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-emerald-200 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  هذا المحل جديد، أريد إضافته
                </button>
              )}

              {/* Step 2: The rest of the form */}
              {isAddingNew && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-300 space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div>
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-2 mr-1">النوع</label>
                    <select 
                      value={newEstType}
                      onChange={e => setNewEstType(e.target.value)}
                      className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-sm font-bold focus:border-emerald-500 outline-none transition-colors appearance-none"
                    >
                      <option value="مطعم">مطعم / كافيه</option>
                      <option value="معمل">معمل غذائي</option>
                      <option value="متجر">سوبر ماركت / متجر غذائي</option>
                      <option value="أخرى">أخرى</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-2 mr-1">العنوان اليدوي (أقرب نقطة دالة)</label>
                    <input 
                      type="text" 
                      value={newEstAddress}
                      onChange={e => setNewEstAddress(e.target.value)}
                      placeholder="مثال: مقابل جامع التوبة..." 
                      className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-sm font-bold focus:border-emerald-500 outline-none transition-colors"
                    />
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={() => startCamera('add_new')}
                      className="w-full py-4 bg-slate-800 hover:bg-slate-900 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-slate-900/10 active:scale-[0.98] transition-all"
                    >
                      <Camera className="w-5 h-5" />
                      <span>التقاط صورة للواجهة وإرسال للعمليات</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Update Location */}
        {activeTab === 'update_location' && (
          <div className="space-y-4">
            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/50 p-4 rounded-2xl flex gap-3 mb-6">
              <MapPin className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800 dark:text-amber-400 font-bold leading-relaxed">
                هذه القائمة تحتوي على المحلات التي ينقصها عنوان إلكتروني (GPS) أو عنوان يدوي واضح. 
              </p>
            </div>

            {establishmentsNeedsLocation.length === 0 ? (
               <div className="text-center p-6 bg-slate-100 dark:bg-slate-800 rounded-3xl">
                 <CheckCircle2 className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                 <p className="text-xs text-slate-500 font-bold">جميع مطاعم القطاع تحتوي على إحداثيات!</p>
               </div>
            ) : (
              establishmentsNeedsLocation.slice(0, 15).map(est => (
                <div key={est.id} className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center shrink-0">
                      <Building className="w-4 h-4 text-slate-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-black text-slate-800 dark:text-white text-sm">{est.name}</h3>
                      <p className="text-[10px] text-slate-500 font-bold mt-1">المنطقة: {est.sector}</p>
                    </div>
                    {updatingEstId !== est.id && (
                      <button
                        onClick={() => setUpdatingEstId(est.id)}
                        className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold px-3 py-1.5 rounded-lg hover:bg-slate-200 transition-colors"
                      >
                        تحديث موقعه
                      </button>
                    )}
                  </div>
                  
                  {/* Expanded Form for Location Update */}
                  {updatingEstId === est.id && (
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 animate-in fade-in slide-in-from-top-2">
                      <div className="space-y-3">
                        {/* Electronic GPS */}
                        <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                          <div>
                            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">العنوان الإلكتروني (GPS)</p>
                            <p className="text-[10px] text-slate-500 mt-1 font-mono">
                              {updateLiveLocation ? `${updateLiveLocation.lat}, ${updateLiveLocation.lon}` : (est.lat ? 'متوفر مسبقاً' : 'غير متوفر - يتطلب سحب')}
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              requestLocation((loc) => setUpdateLiveLocation(loc));
                            }}
                            disabled={isFetchingLocation}
                            className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-amber-200 transition-colors"
                          >
                            <MapPin className="w-3 h-3" />
                            سحب موقعي الحالي
                          </button>
                        </div>
                        
                        {/* Manual Address */}
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 mb-1 block">العنوان اليدوي (احتياطاً)</label>
                          <input
                            type="text"
                            value={updateManualAddress}
                            onChange={(e) => setUpdateManualAddress(e.target.value)}
                            placeholder="اكتب أقرب نقطة دالة للمطعم..."
                            className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-amber-500"
                          />
                        </div>
                        
                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={() => { setUpdatingEstId(null); setUpdateLiveLocation(null); setUpdateManualAddress(''); }}
                            className="flex-1 py-2 text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 rounded-xl"
                          >
                            إلغاء
                          </button>
                          <button
                            onClick={() => handleUpdateLocation(est.id)}
                            disabled={isSubmitting || (!updateLiveLocation && !updateManualAddress && !est.lat)}
                            className="flex-[2] py-2 text-xs font-black text-white bg-amber-600 hover:bg-amber-700 rounded-xl flex items-center justify-center gap-1 transition-colors disabled:opacity-50"
                          >
                            <Save className="w-3 h-3" />
                            حفظ البيانات
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

      </div>

      {/* Camera/Verification Modal */}
      {(isCameraOpen || capturedPhoto) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 p-4 rounded-[2rem] text-white shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                {cameraMode === 'verification' ? (
                  <>
                    <ShieldAlert className="w-4 h-4 text-rose-500" />
                    التحقق من التزام: {selectedEst?.name}
                  </>
                ) : (
                  <>
                    <Target className="w-4 h-4 text-emerald-500" />
                    صورة واجهة المحل: {newEstName}
                  </>
                )}
              </h3>
              <button onClick={cancelCamera} className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {!capturedPhoto ? (
              <div className="relative rounded-3xl overflow-hidden bg-black aspect-[3/4] shadow-inner">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                
                {/* Location Overlay */}
                <div className="absolute top-4 left-4 right-4 flex justify-center">
                  <div className="bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-mono flex items-center gap-2">
                    <MapPin className="w-3 h-3 text-emerald-400" />
                    {isFetchingLocation ? 'جاري تحديد الموقع...' : locationLog}
                  </div>
                </div>

                <button 
                  onClick={capturePhoto}
                  className="absolute bottom-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-white rounded-full border-[5px] border-slate-300 shadow-2xl flex items-center justify-center active:scale-95 transition-transform"
                >
                  <div className={`w-12 h-12 rounded-full animate-pulse ${cameraMode === 'verification' ? 'bg-rose-500' : 'bg-emerald-500'}`}></div>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative rounded-3xl overflow-hidden border border-slate-700 shadow-lg">
                  <img src={capturedPhoto} alt="Captured" className="w-full h-auto" />
                  <div className="absolute bottom-0 left-0 w-full bg-slate-900/80 backdrop-blur-md p-4 text-[10px] text-slate-300 font-mono text-left" dir="ltr">
                    <p>{new Date().toLocaleString('en-US')}</p>
                    <p className="text-emerald-400 mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> {locationLog}</p>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button 
                    onClick={() => { setCapturedPhoto(null); startCamera(cameraMode, selectedEst); }}
                    className="flex-1 py-4 rounded-2xl bg-slate-800 text-slate-300 hover:text-white font-bold text-xs transition-colors"
                    disabled={isSubmitting}
                  >
                    إعادة الالتقاط
                  </button>
                  <button 
                    onClick={cameraMode === 'verification' ? submitVerification : submitNewEstablishment}
                    className={`flex-[2] py-4 rounded-2xl text-white font-black text-xs shadow-xl flex justify-center items-center gap-2 transition-transform active:scale-[0.98] ${
                      cameraMode === 'verification' ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-900/50' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-900/50'
                    }`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="animate-pulse">جاري الرفع للحفظ...</span>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        {cameraMode === 'verification' ? 'إرسال التقرير للعمليات' : 'حفظ وإضافة للمنظومة'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
            <canvas ref={canvasRef} className="hidden" />
          </div>
        </div>
      )}
    </div>
  );
};
