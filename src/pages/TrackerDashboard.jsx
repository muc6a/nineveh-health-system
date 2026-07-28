import React, { useContext, useState, useRef, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { ThemeToggle } from '../components/ThemeToggle';
import { NotificationBell } from '../components/NotificationBell';
import { LogOut, Camera, ShieldAlert, CheckCircle2, MapPin, X, Plus, Map, Target, Building, Save, ScanLine, Radar } from 'lucide-react';

export const TrackerDashboard = () => {
  const { user, establishments, addEstablishment, updateEstablishment, closureVerifications, setClosureVerifications, navigate, notify, addSystemNotification } = useContext(AppContext);
  
  // UI States
  const [activeTab, setActiveTab] = useState('verifications'); // 'verifications', 'update_location', 'add_new'
  
  // Camera & Verification States
  const [selectedEst, setSelectedEst] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraMode, setCameraMode] = useState('verification'); // 'verification', 'add_new'
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Location States
  const [locationLog, setLocationLog] = useState('');
  const [liveLocation, setLiveLocation] = useState(null);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  
  // Form States for "Add New"
  const [newEstName, setNewEstName] = useState('');
  const [newEstType, setNewEstType] = useState('مطعم');

  // Daily Stats (Mock)
  const [dailyStats, setDailyStats] = useState({ verified: 0, added: 0, updated: 0 });

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Sector Logic
  const trackerSector = user?.linkedTeamSector || user?.sector || 'الجانب الأيسر';
  
  // Sector Filter Helper
  const isMatchSector = (estSec) => {
    const t = trackerSector.trim().replace(/[أإآ]/g, 'ا');
    const s = (estSec || '').trim().replace(/[أإآ]/g, 'ا');
    return s === t || s.includes(t) || t.includes(s) || (s.includes('ايمن') && t.includes('ايمن')) || (s.includes('ايسر') && t.includes('ايسر'));
  };

  // Lists
  const sectorEstablishments = establishments.filter(e => isMatchSector(e.sector));
  const closedEstablishments = sectorEstablishments.filter(e => ((e.lastInspection !== 'لم يزر بعد' && e.score < 70) || e.status === 'closed'));
  const establishmentsNeedsLocation = sectorEstablishments.filter(e => !e.lat || !e.lng); // Simple mock check

  // Request Location
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
      
      setClosureVerifications([newVerification, ...closureVerifications]);
      setDailyStats(prev => ({ ...prev, verified: prev.verified + 1 }));
      notify('تم رفع تقرير المتابعة بنجاح وإرساله للمديرية!', 'success', true);
      
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
        photo: capturedPhoto,
        status: 'uninspected',
        score: 0,
        lastInspection: 'لم يزر بعد'
      });
      setDailyStats(prev => ({ ...prev, added: prev.added + 1 }));
      notify('تم رصد المنشأة الجديدة وإضافتها لقاعدة البيانات بنجاح!', 'success', true);
      
      if (addSystemNotification) {
        addSystemNotification(
          '🚨 رصد منشأة جديدة غير مسجلة',
          `تم رصد مطعم جديد باسم "${newEstName}" في قطاع ${trackerSector} من قبل المتابع ${user.name}. يرجى توجيه لجنة لتفتيشه.`,
          'central_director'
        );
      }
      
      setIsSubmitting(false);
      setNewEstName('');
      cancelCamera();
      setActiveTab('verifications');
    }, 1500);
  };

  const updateEstLocation = (estId) => {
    requestLocation((loc) => {
      updateEstablishment(estId, { lat: loc.lat, lng: loc.lon });
      setDailyStats(prev => ({ ...prev, updated: prev.updated + 1 }));
      notify('تم تحديث الإحداثيات الجغرافية بنجاح!', 'success');
    });
  };

  if (user?.role !== 'tracker') {
    return <div className="p-8 text-center text-white">غير مصرح لك بالدخول</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-cairo dir-rtl pb-20">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
              <ScanLine className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="font-black text-sm text-slate-800 dark:text-white">المسح الميداني</h1>
              <p className="text-[10px] text-slate-500 font-bold">{user.name} - {trackerSector}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <NotificationBell />
            <ThemeToggle />
            <button 
              onClick={() => navigate('/login')}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-slate-600 dark:text-slate-400 hover:text-rose-600 transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Daily Stats Bar */}
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

      {/* Main Tabs */}
      <div className="container mx-auto px-4 max-w-2xl mt-6">
        <div className="flex p-1 bg-slate-200 dark:bg-slate-800 rounded-2xl mb-6">
          <button
            onClick={() => setActiveTab('verifications')}
            className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all ${
              activeTab === 'verifications' ? 'bg-white dark:bg-slate-700 shadow-md text-blue-600 dark:text-blue-400' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            التحقق من الإغلاقات
          </button>
          <button
            onClick={() => setActiveTab('add_new')}
            className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all ${
              activeTab === 'add_new' ? 'bg-white dark:bg-slate-700 shadow-md text-emerald-600 dark:text-emerald-400' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            رصد جديد
          </button>
          <button
            onClick={() => setActiveTab('update_location')}
            className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1 ${
              activeTab === 'update_location' ? 'bg-white dark:bg-slate-700 shadow-md text-amber-600 dark:text-amber-400' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Radar className="w-3 h-3" />
            تحديث مواقع
          </button>
        </div>

        {/* Tab Content */}
        
        {/* Tab 1: Verifications */}
        {activeTab === 'verifications' && (
          <div className="space-y-4">
            <h2 className="text-sm font-black text-slate-800 dark:text-white flex justify-between items-center mb-4">
              <span>مطاعم مغلقة تتطلب التأكد من الالتزام</span>
              <span className="bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400 px-2 py-1 rounded-lg text-[10px]">{closedEstablishments.length}</span>
            </h2>
            
            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/50 p-4 rounded-2xl flex gap-3 mb-4">
              <ShieldAlert className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <p className="text-xs text-blue-800 dark:text-blue-400 font-bold leading-relaxed">
                مهمتك هنا هي الذهاب لهذه المطاعم والتقاط صورة للواجهة للتأكد من أن صاحب المطعم لم يكسر الشمع الأحمر وأنه ملتزم بقرار الإغلاق. أنت لست مسؤولاً عن الفتح أو الإغلاق.
              </p>
            </div>
            
            {closedEstablishments.length === 0 ? (
              <div className="text-center p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                <h3 className="font-bold text-slate-700 dark:text-slate-300">لا توجد منشآت مغلقة حالياً في قطاعك</h3>
              </div>
            ) : (
              closedEstablishments.map(est => (
                <div key={est.id} className={`bg-white dark:bg-slate-900 rounded-3xl p-5 border ${est.status === 'closed' ? 'border-amber-200 dark:border-amber-900/30' : 'border-rose-200 dark:border-rose-900/30'} shadow-sm relative overflow-hidden transition-all hover:shadow-md`}>
                  <div className={`absolute top-0 right-0 w-1.5 h-full ${est.status === 'closed' ? 'bg-amber-500' : 'bg-rose-500'}`}></div>
                  
                  <div className="flex flex-col gap-4">
                    <div>
                      <h3 className="font-black text-slate-800 dark:text-white text-base">{est.name}</h3>
                      <p className="text-xs text-slate-500 mt-1 font-bold">القطاع/الحي: {est.neighborhood || est.sector}</p>
                      <p className={`text-[11px] font-bold mt-2 inline-block px-2 py-1 rounded-lg ${est.status === 'closed' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'}`}>
                        {est.status === 'closed' ? 'حالة المطعم: مغلق بالشمع الأحمر' : `التقييم: ${est.score}% - حرج (تأكد من إغلاقه)`}
                      </p>
                    </div>
                    
                    <button
                      onClick={() => startCamera('verification', est)}
                      className="flex items-center justify-center gap-2 w-full py-3 text-white rounded-xl text-xs font-black transition-all shadow-md active:scale-95 bg-rose-600 hover:bg-rose-700 shadow-rose-500/20"
                    >
                      <Camera className="w-4 h-4" />
                      التقاط صورة للتحقق من الالتزام بالإغلاق
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Add New */}
        {activeTab === 'add_new' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-2xl flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-sm font-black text-slate-800 dark:text-white">رصد منشأة جديدة</h2>
                <p className="text-[10px] text-slate-500 font-bold mt-1">هل لاحظت مطعماً جديداً غير مسجل؟ صوّره للإضافة</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-2 mr-1">الاسم التجاري للمنشأة</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={newEstName}
                    onChange={e => setNewEstName(e.target.value)}
                    placeholder="ابحث عن الاسم للتأكد أنه غير مسجل..." 
                    className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-sm font-bold focus:border-emerald-500 outline-none transition-colors"
                  />
                  {newEstName.length > 2 && establishments.some(e => e.name.includes(newEstName)) && (
                    <div className="absolute top-full mt-2 w-full bg-white dark:bg-slate-800 border border-rose-200 dark:border-rose-900 rounded-xl p-3 shadow-lg z-10">
                      <p className="text-xs font-bold text-rose-600 mb-2">⚠️ انتبه، توجد مطاعم مشابهة في النظام:</p>
                      {establishments.filter(e => e.name.includes(newEstName)).slice(0, 3).map(e => (
                        <div key={e.id} className="text-[10px] text-slate-600 p-1 border-b border-slate-100 last:border-0">{e.name} ({e.sector})</div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
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

              <div className="pt-2">
                <button
                  onClick={() => startCamera('add_new')}
                  className="w-full py-4 bg-slate-800 hover:bg-slate-900 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-slate-900/10 active:scale-[0.98] transition-all"
                >
                  <Camera className="w-5 h-5" />
                  <span>التقاط صورة للواجهة (مع GPS)</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Update Location */}
        {activeTab === 'update_location' && (
          <div className="space-y-4">
            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/50 p-4 rounded-2xl flex gap-3 mb-6">
              <MapPin className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800 dark:text-amber-400 font-bold leading-relaxed">
                هل تمر بجوار أحد هذه المطاعم؟ اضغط على زر "تحديث موقعي" لربط إحداثيات الـ GPS الحالية للمكان لتسهيل وصول فرق التفتيش.
              </p>
            </div>

            {establishmentsNeedsLocation.slice(0, 15).map(est => (
              <div key={est.id} className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center shrink-0">
                    <Building className="w-4 h-4 text-slate-500" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-800 dark:text-white text-sm">{est.name}</h3>
                    <p className="text-[10px] text-slate-500 font-bold mt-1">{est.sector}</p>
                  </div>
                </div>
                
                <button
                  onClick={() => updateEstLocation(est.id)}
                  disabled={isFetchingLocation}
                  className="shrink-0 w-10 h-10 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 hover:bg-amber-200 rounded-full flex items-center justify-center transition-all disabled:opacity-50"
                  title="تحديث موقع المطعم للـ GPS الحالي"
                >
                  <MapPin className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Camera/Verification/Add Modal */}
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
                        {cameraMode === 'verification' ? 'إرسال تقرير التحقق للعمليات' : 'حفظ وإضافة المنشأة'}
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
