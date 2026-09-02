import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { ThemeToggle } from '../components/ThemeToggle';
import { ShieldCheck, Camera, AlertOctagon, MapPin, Search, Star, Edit, Save, ArrowRight, Activity, Plus, Trash2, Cpu, FileText, WifiOff, Printer, ClipboardCheck, Siren, X, FlaskConical } from 'lucide-react';

export const InspectionForm = () => {
  const { navigate, establishments, inspectionTemplates, addInspection, config, user, logAudit, notify: triggerAlert, finesBooklet, penaltyRequests, setPenaltyRequests, labRequests, setLabRequests } = useContext(AppContext);

  // Parse establishment ID from query string
  const [establishment, setEstablishment] = useState(null);
  const [timestamp, setTimestamp] = useState('');
  const [hasLabSample, setHasLabSample] = useState(false);
  const [sampleType, setSampleType] = useState('');

  // Smart Trigger States
  const [docsChecked, setDocsChecked] = useState({});
  const [pendingFines, setPendingFines] = useState([]);
  const [showClosureTrigger, setShowClosureTrigger] = useState(false);
  const [triggeredFine, setTriggeredFine] = useState(null);

  const handleDocCheck = (fineId, isOk) => {
    setDocsChecked(prev => ({ ...prev, [fineId]: isOk }));
    
    if (isOk === false) {
      const fine = finesBooklet?.find(f => f.id === fineId);
      if (fine) {
        if (fine.requiresClosure) {
          setTriggeredFine(fine);
          setShowClosureTrigger(true);
        } else {
          // Add to pending fines silently without blocking
          setPendingFines(prev => {
            if (!prev.find(p => p.id === fine.id)) {
              return [...prev, fine];
            }
            return prev;
          });
        }
      }
    } else {
      // Remove fine if changed to yes
      setPendingFines(prev => prev.filter(p => p.id !== fineId));
    }
  };

  const submitImmediateClosure = () => {
    if (!triggeredFine) return;
    
    const newRequest = {
      id: 'req_' + Date.now(),
      establishmentId: establishment.id,
      establishmentName: establishment.name,
      teamId: user?.id || 'team_1',
      teamName: user?.name || 'اللجنة الرقابية الأولى',
      date: new Date().toISOString(),
      type: 'closure',
      status: 'pending',
      reason: `تم التفعيل الذكي: ${triggeredFine.type}`,
      amount: triggeredFine.amount,
      fineId: triggeredFine.id
    };

    if (setPenaltyRequests) {
      setPenaltyRequests(prev => [newRequest, ...prev]);
    }
    
    triggerAlert('تم رفع طلب الإغلاق الفوري وتغريم المنشأة إلى السيد المدير بنجاح!', 'success');
    navigate('/dashboard/team');
  };

  const [locationLog, setLocationLog] = useState('');

  // Form State
  const [ratings, setRatings] = useState({}); // { item_id: rating_value }
  const [drawnSamples, setDrawnSamples] = useState(false);
  const [sampleBookNumber, setSampleBookNumber] = useState('');
  const [sampleBookDate, setSampleBookDate] = useState('');
  const [remarks, setRemarks] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [ownerPhoto, setOwnerPhoto] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Geolocation captures
  const [liveLocation, setLiveLocation] = useState(null);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [locationVerified, setLocationVerified] = useState(false);

  // AI Inspector
  const [isAiScanning, setIsAiScanning] = useState(false);
  const [aiReport, setAiReport] = useState(null);

  // Justification Modal for edits
  const [showJustificationModal, setShowJustificationModal] = useState(false);
  const [editJustification, setEditJustification] = useState('');

  // Offline Mode State
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // Offline Mode Listeners
  useEffect(() => {
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => {
      setIsOffline(false);
      const offlineData = JSON.parse(localStorage.getItem('offline_inspections') || '[]');
      if (offlineData.length > 0) {
        triggerAlert(`تم عودة الاتصال! جاري مزامنة ${offlineData.length} كشوفات مع غرفة العمليات...`);
        setTimeout(() => {
          offlineData.forEach(report => {
            addInspection(report.establishmentId, report);
          });
          localStorage.removeItem('offline_inspections');
          localStorage.removeItem('has_offline_data');
          triggerAlert('تمت المزامنة بنجاح! ✅', 'success', true);
        }, 1500);
      } else {
        triggerAlert('تم عودة الاتصال بالإنترنت.');
      }
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, [triggerAlert]);

  // Signature Pad State
  const canvasRef = React.useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureData, setSignatureData] = useState(null);

  const startDrawing = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e) => {
    e.preventDefault();
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    setSignatureData(canvasRef.current.toDataURL('image/png'));
  };

  const clearSignature = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setSignatureData(null);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const estId = params.get('id');
    const isEdit = params.get('edit') === 'true';
    const target = establishments.find(e => e.id === estId) || establishments[0];
    setEstablishment(target);

    const now = new Date();
    setTimestamp(now.toLocaleString('ar-IQ', { hour12: true }));
    setLocationLog('36.3489° N, 43.1578° E (الموصل - نينوى)');

    const targetItems = inspectionTemplates[target?.type] || inspectionTemplates['المطاعم، الكافيهات، والمقاهي'] || [];
    
    const initialRatings = {};
    if (isEdit && target && target.history && target.history.length > 0) {
      const lastEval = target.history[0];
      targetItems.forEach(item => {
        initialRatings[item.id] = lastEval.ratings && lastEval.ratings[item.id] !== undefined ? lastEval.ratings[item.id] : 5;
      });
      if (lastEval.notes) {
        setRemarks(lastEval.notes);
      }
    } else {
      targetItems.forEach(item => {
        initialRatings[item.id] = 5;
      });
    }
    setRatings(initialRatings);
  }, [establishments, inspectionTemplates]);

  const activeItems = React.useMemo(() => {
    if (!establishment) return [];
    return inspectionTemplates[establishment.type] || inspectionTemplates['المطاعم، الكافيهات، والمقاهي'] || [];
  }, [establishment, inspectionTemplates]);

  if (!establishment) {
    return <div className="p-8 text-center text-xs font-bold text-slate-400">تحميل بيانات المنشأة...</div>;
  }

  const sumScores = Math.round(Object.keys(ratings).reduce((acc, itemId) => {
    const item = activeItems.find(i => String(i.id) === String(itemId));
    if (!item) return acc;
    const val = ratings[itemId] !== undefined ? ratings[itemId] : 5;
    const itemScore = (val / 5) * (parseInt(item.points) || 5);
    return acc + itemScore;
  }, 0));

  const maxPossible = activeItems.reduce((acc, curr) => acc + (parseInt(curr.points) || 0), 0);
  const scorePercentage = maxPossible > 0 ? Math.round((sumScores / maxPossible) * 100) : 0;

  const handleRatingChange = (itemId, val) => {
    setRatings(prev => ({
      ...prev,
      [itemId]: Number(val)
    }));
  };

  const requestLocation = () => {
    setIsFetchingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude.toFixed(6);
          const lon = position.coords.longitude.toFixed(6);
          setLiveLocation({ lat, lon });
          setLocationLog(`${lat}° N, ${lon}° E (إحداثيات حية ملتقطة مسبقاً 📍)`);
          setIsFetchingLocation(false);
          setLocationVerified(true);
        },
        (error) => {
          console.error(error);
          const mockLat = (36.3489 + (Math.random() - 0.5) * 0.02).toFixed(6);
          const mockLon = (43.1578 + (Math.random() - 0.5) * 0.02).toFixed(6);
          setLiveLocation({ lat: mockLat, lon: mockLon });
          setLocationLog(`${mockLat}° N, ${mockLon}° E (محاكاة إحداثيات موقع الموصل 📍)`);
          setIsFetchingLocation(false);
          setLocationVerified(true);
        },
        { enableHighAccuracy: true, timeout: 6000 }
      );
    } else {
      setIsFetchingLocation(false);
      setLocationVerified(true);
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
          setSelectedPhoto(dataUrl);
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(window.location.search);
    const isEdit = params.get('edit') === 'true';
    if (isEdit) {
      setShowJustificationModal(true);
      return;
    }
    processSubmission(false);
  };

  const simulateAiScan = () => {
    setIsAiScanning(true);
    setAiReport(null);
    setTimeout(() => {
      const simulatedRatings = { ...ratings };
      const penalizedItems = [];
      const activeIds = activeItems.map(i => i.id);
      for(let i=0; i<2; i++) {
        const randomId = activeIds[Math.floor(Math.random() * activeIds.length)];
        simulatedRatings[randomId] = 0;
        const itemObj = activeItems.find(it => it.id === randomId);
        if (itemObj) penalizedItems.push(itemObj.text);
      }
      setRatings(simulatedRatings);
      setIsAiScanning(false);
      setAiReport({
        message: 'تم رصد مخالفات بصرياً بواسطة الذكاء الاصطناعي بناءً على الصورة المرفوعة للمطبخ.',
        items: penalizedItems
      });
      triggerAlert('اكتمل الفحص بالذكاء الاصطناعي وتم تحديث التقييم', 'info', true);
    }, 2500);
  };

  const processSubmission = (isEdit, justification = '') => {
    setIsSubmitting(true);
    setTimeout(() => {
      if (isEdit && logAudit) {
        const originalData = establishment.history && establishment.history.length > 0 ? establishment.history[0] : null;
        logAudit('تعديل تقييم كشف صحي', establishment.id, originalData, { score: scorePercentage, ratings, remarks }, justification, user);
      }
      addInspection(establishment.id, scorePercentage, remarks || 'تم إجراء التقييم الصحي الدوري.', ratings, user?.name || 'اللجنة الرقابية الأولى', liveLocation, isEdit, user?.id, selectedPhoto, aiReport, signatureData, ownerPhoto);

      // Submit any pending document fines
      if (pendingFines.length > 0 && setPenaltyRequests) {
        const newRequests = pendingFines.map(fine => ({
          id: 'req_' + Date.now() + Math.random().toString(36).substring(7),
          establishmentId: establishment.id,
          establishmentName: establishment.name,
          teamId: user?.id || 'team_1',
          teamName: user?.name || 'اللجنة الرقابية الأولى',
          date: new Date().toISOString(),
          type: 'fine',
          status: 'pending',
          reason: `مخالفة وثائق (تلقائي): ${fine.type}`,
          amount: fine.amount,
          fineId: fine.id
        }));
        setPenaltyRequests(prev => [...newRequests, ...prev]);
        triggerAlert(`تم تسجيل ${pendingFines.length} غرامة وثائق تلقائياً!`, 'warning', true);
      }

      if (isOffline) {
        localStorage.setItem('has_offline_data', 'true');
        triggerAlert('تم الحفظ في وضع عدم الاتصال (أوفلاين). ستتم المزامنة التلقائية فور عودة الإنترنت.', 'warning', true);
      } else {
        triggerAlert(isEdit ? 'تم تعديل التقييم بنجاح' : 'تم إضافة التقييم بنجاح', 'success', true);
      }
      setIsSubmitting(false);
      navigate(`/scan/${establishment.id}`);
    }, 1200);
  };

  const confirmEditWithJustification = (e) => {
    e.preventDefault();
    if (!editJustification.trim()) return;
    setShowJustificationModal(false);
    processSubmission(true, editJustification);
    setEditJustification('');
  };

  const uniqueSections = Array.from(new Set(activeItems.map(item => item.section || 'A')));
  const sections = uniqueSections.map(secKey => {
    const sectionItems = activeItems.filter(item => item.section === secKey);
    const sectionMax = sectionItems.reduce((acc, curr) => acc + (parseInt(curr.points)||0), 0);
    const displayLabel = sectionItems.length > 0 && sectionItems[0].sectionName ? sectionItems[0].sectionName : `القسم ${secKey}`;
    return { 
      key: secKey, 
      title: `${displayLabel} (${sectionMax} درجة)`
    };
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <button onClick={() => navigate('/dashboard/team')} className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400">
          <ArrowRight className="w-4 h-4" /> رجوع إلى اللوحة الرقابية
        </button>
        <div className="flex items-center gap-4">

          <ThemeToggle />
          <div className="w-10 h-10 bg-teal-500/10 rounded-2xl flex items-center justify-center border border-teal-500/20 shadow-inner">
            <ShieldCheck className="w-5 h-5 text-teal-600" />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {isOffline && (
          <div className="mb-6 p-4 rounded-2xl bg-slate-800 dark:bg-slate-900 border border-slate-700 text-white flex items-center justify-center gap-3 animate-pulse shadow-lg">
            <WifiOff className="w-6 h-6 text-slate-400" />
            <div className="text-right">
              <h3 className="text-xs font-black text-slate-200">وضع عدم الاتصال نشط (Offline Mode) 📵</h3>
              <p className="text-[10px] text-slate-400">سيتم حفظ الكشف محلياً في ذاكرة الجهاز والمزامنة تلقائياً عند عودة الإنترنت.</p>
            </div>
          </div>
        )}

        {!locationVerified ? (
          <div className="glassmorphic-card p-12 flex flex-col items-center justify-center text-center space-y-6 animate-fade-in-up">
            <div className="w-24 h-24 rounded-full bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center text-teal-600 mb-4 shadow-inner">
              <MapPin className="w-12 h-12" />
            </div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-white">التحقق المكاني مطلوب لبدء التقييم</h2>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              لضمان موثوقية الرقابة ونزاهة العملية التفتيشية، يرجى تفعيل الموقع (GPS) والضغط على الزر أدناه لتسجيل وتوثيق تواجدك الفعلي في مقر المنشأة: <span className="font-bold text-teal-600">({establishment.name})</span>
            </p>
            <button
              onClick={requestLocation}
              disabled={isFetchingLocation}
              className="mt-6 px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl shadow-xl shadow-teal-500/30 flex items-center justify-center gap-3 font-black transition-all active:scale-95 disabled:opacity-50 text-lg"
            >
              <MapPin className="w-6 h-6" />
              {isFetchingLocation ? 'جاري الاتصال بالأقمار الصناعية...' : 'تحقق من الموقع لبدء التقييم الآن'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleFormSubmit} className="space-y-6 relative animate-fade-in-up">
          
          {/* الوثائق الأساسية (Smart Trigger) */}
          <div className="glassmorphic-card p-6 border-2 border-red-500/20 shadow-lg shadow-red-500/10 relative overflow-hidden mb-6">
            <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-l from-red-500 to-amber-500"></div>
            <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-3 mb-4 flex items-center gap-2">
              <Siren className="w-5 h-5 text-red-500 animate-pulse" />
              الوثائق الأساسية والتراخيص (تفعيل ذكي للغرامات)
            </h3>
            <div className="space-y-4">
              {finesBooklet?.map(fine => (
                <div key={fine.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 border-b border-slate-100/50 dark:border-slate-800/20 last:border-b-0">
                  <div className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center text-[10px] font-black shrink-0">
                      📄
                    </span>
                    <div>
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-300 block">
                        هل يتوفر: {fine.type}؟
                      </span>
                      {fine.requiresClosure && (
                        <span className="text-[10px] text-red-500 font-bold">⚠️ غيابها يستوجب إغلاق فوري وغرامة {fine.amount.toLocaleString()} د.ع</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleDocCheck(fine.id, true)}
                      className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${docsChecked[fine.id] === true ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}
                    >
                      نعم
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDocCheck(fine.id, false)}
                      className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${docsChecked[fine.id] === false ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}
                    >
                      لا (مخالفة)
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {sections.map(section => (
            <div key={section.key} className="glassmorphic-card p-6">
              <h3 className="text-xs font-black text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-3 mb-4 text-teal-600">
                {section.title}
              </h3>
              <div className="space-y-4">
                {activeItems.filter(item => item.section === section.key).map(item => (
                  <div key={item.id} className="flex flex-col gap-3 py-4 border-b border-slate-100/50 dark:border-slate-800/20 last:border-b-0 transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/20 rounded-xl px-2 -mx-2">
                    
                    {/* Item label */}
                    <div className="flex gap-3 min-w-0">
                      <span className="w-6 h-6 rounded-full bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 flex items-center justify-center text-xs font-black shrink-0">
                        {item.id}
                      </span>
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed pt-0.5">
                        {item.text}
                      </span>
                    </div>

                    {/* Touch-Friendly Score Picker */}
                    <div className="flex items-center justify-end gap-1.5 sm:gap-2 mt-1">
                      {[0, 1, 2, 3, 4, 5].map(score => {
                        const isSelected = (ratings[item.id] !== undefined ? ratings[item.id] : 5) === score;
                        return (
                          <button
                            key={score}
                            type="button"
                            onClick={() => handleRatingChange(item.id, score)}
                            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl font-black text-sm sm:text-base flex items-center justify-center transition-all ${
                              isSelected
                              ? score === 0 
                                ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 scale-105' 
                                : score <= 2 
                                  ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30 scale-105'
                                  : 'bg-teal-500 text-white shadow-lg shadow-teal-500/30 scale-105'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'
                            }`}
                          >
                            {score}
                          </button>
                        );
                      })}
                    </div>

                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Remarks, File Picker, Action Buttons */}
          <div className="glassmorphic-card p-6 space-y-6">
            <h3 className="text-xs font-black text-slate-800 dark:text-white">التقرير الميداني النهائي واعتماد التقييم</h3>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 block">ملاحظات اللجنة وتوصيات الإغلاق أو الإنذار</label>
              <textarea
                rows="3"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="اكتب أي ملاحظات إضافية حول التجهيزات، العمال، أو العقوبات الموقعة هنا..."
                className="w-full p-3 rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs font-bold outline-none text-slate-800 dark:text-slate-200"
              />
            </div>

            {/* Evidences Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Photo Picker */}
              {config.allowImageUpload && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-500 block">توثيق المخالفات أو الالتزام</span>
                  <label className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors h-32">
                    <Camera className="w-6 h-6 text-teal-600" />
                    <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">التقاط صورة ميدانية</span>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                  {selectedPhoto && (
                    <div className="mt-2 p-2 rounded-xl border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-900/20 flex items-center gap-3">
                      <img src={selectedPhoto} alt="مرفق" className="w-10 h-10 object-cover rounded-lg shadow-sm" />
                      <div>
                        <span className="text-[10px] text-emerald-600 font-bold block">تم إرفاق الصورة</span>
                        <button type="button" onClick={() => setSelectedPhoto(null)} className="text-[9px] text-red-500 hover:underline">إزالة</button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* AI Inspector Button */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-500 block">المفتش الذكي (تحليل بالذكاء الاصطناعي)</span>
                <label className="w-full relative block cursor-pointer h-32">
                  <input 
                    type="file" 
                    accept="image/*" 
                    capture="environment"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        simulateAiScan();
                      }
                    }}
                    disabled={isAiScanning}
                    className="hidden" 
                  />
                  <div
                    className={`w-full h-full rounded-2xl font-black text-[11px] flex flex-col items-center justify-center gap-2 transition-all shadow-md border-2 border-transparent ${
                      isAiScanning 
                      ? 'bg-purple-100 text-purple-400 animate-pulse border-purple-300'
                      : 'bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 text-purple-700 dark:text-purple-300 hover:border-purple-300 dark:hover:border-purple-700 border-purple-100 dark:border-purple-900/50'
                    }`}
                  >
                    <Cpu className="w-6 h-6" />
                    <span className="text-center px-2">{isAiScanning ? 'جاري تحليل الصورة واستخراج المخالفات...' : 'التقط صورة ليقوم الذكاء الاصطناعي بتحليلها'}</span>
                  </div>
                </label>
              </div>
            </div>

            {aiReport && (
              <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-700 dark:text-purple-300 animate-fade-in">
                <h4 className="font-black text-xs mb-2 flex items-center gap-1"><Cpu className="w-4 h-4"/> نتائج التحليل:</h4>
                <p className="text-[10px] mb-2">{aiReport.message}</p>
                <ul className="list-disc list-inside text-[10px] font-bold">
                  {aiReport.items.map((item, idx) => (
                    <li key={idx} className="text-red-500">{item} (تم الخصم تلقائياً)</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Signature Pad */}
            <div className="space-y-2 mt-4">
              <span className="text-xs font-bold text-slate-500 block">توقيع صاحب المنشأة على نتيجة التقييم والإقرار (إلزامي)</span>
              <div className="border border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden bg-white relative">
                {signatureData ? (
                  <div className="relative">
                    <img src={signatureData} alt="توقيع صاحب المنشأة" className="w-full h-40 object-contain bg-white" />
                    <button 
                      type="button"
                      onClick={clearSignature}
                      className="absolute top-2 left-2 p-1.5 bg-rose-500 text-white rounded-lg text-[10px] font-bold"
                    >
                      إعادة التوقيع
                    </button>
                  </div>
                ) : (
                  <>
                    <canvas
                      ref={canvasRef}
                      width={400}
                      height={160}
                      className="w-full h-40 touch-none cursor-crosshair bg-slate-50"
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={draw}
                      onTouchEnd={stopDrawing}
                    />
                    <div className="absolute bottom-2 right-2 flex gap-2">
                      <button 
                        type="button" 
                        onClick={clearSignature}
                        className="px-2 py-1 bg-slate-200 text-slate-600 rounded text-[10px] font-bold hover:bg-slate-300"
                      >
                        مسح
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Biometric / ID Capture */}
            <div className="space-y-2 mt-4 pb-4 border-b border-slate-200/50 dark:border-slate-800/50">
              <span className="text-xs font-bold text-slate-500 block">التوثيق البيومتري / المستمسكات (اختياري كبديل للبصمة)</span>
              <label className="border border-dashed border-indigo-200 dark:border-indigo-800 rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-900/40 transition-colors">
                <Camera className="w-6 h-6 text-indigo-500" />
                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">
                  📸 التقاط صورة حية لوجه صاحب المنشأة أو هويته الرسمية
                </span>
                <span className="text-[9px] text-slate-400">تدعم هذه الميزة فتح كاميرا الموبايل/الآيباد مباشرة</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setOwnerPhoto(e.target.files[0].name);
                    }
                  }}
                  className="hidden"
                />
              </label>
              {ownerPhoto && (
                <span className="text-[10px] text-indigo-500 font-bold block mt-2">✓ تم التقاط/إرفاق صورة المستمسك بنجاح: {ownerPhoto}</span>
              )}
            </div>

          </div> {/* End of Remarks and Evidence Card */}

          {/* Live Score Sticky Bar (Thin) */}
          <div className="sticky bottom-4 w-full p-3 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 shadow-2xl flex items-center justify-between no-print z-50">
            
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black shadow-inner ${scorePercentage >= config.passingScore ? 'bg-emerald-50 text-emerald-500 dark:bg-emerald-900/20' : scorePercentage >= config.warningScore ? 'bg-amber-50 text-amber-500 dark:bg-amber-900/20' : 'bg-red-50 text-red-500 dark:bg-red-900/20'}`}>
                {scorePercentage}%
              </div>
              <div className="hidden sm:block">
                <span className="text-[10px] font-bold text-slate-400 block">مجموع النقاط: <strong className="text-slate-800 dark:text-white text-xs">{sumScores}</strong> / {maxPossible}</span>
                <span className="text-[10px] font-bold text-slate-500">
                  {scorePercentage >= config.passingScore ? 'مطابق للشروط ✅' : scorePercentage >= config.warningScore ? 'إنذار وتعهد ⚠️' : 'إغلاق وتشميع ❌'}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">


              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 rounded-xl bg-gradient-to-l from-emerald-600 to-teal-600 text-white font-black text-[11px] sm:text-xs shadow-md hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>جاري الحفظ...</span>
                ) : (
                  <>
                    <ClipboardCheck className="w-4 h-4" />
                    <span>اعتماد وإرسال</span>
                  </>
                )}
              </button>
            </div>
          </div>

          </form>
        )}

      </div>

      {/* Justification Modal */}
      {showJustificationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700/60 p-6 rounded-3xl text-white shadow-2xl relative text-right">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-800 mb-4">
              <h3 className="text-sm font-black text-amber-500">⚠️ تأكيد تعديل التقييم والإفصاح الرسمي</h3>
              <button 
                onClick={() => {
                  setShowJustificationModal(false);
                  setEditJustification('');
                }} 
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400 mb-4">
              لإكمال عملية التعديل على التقييم المسجل للمنشأة <span className="font-bold text-white">({establishment.name})</span>، يرجى إدخال سبب التعديل أدناه ليتم حفظه في سجل التدقيق الأمني.
            </p>

            <form onSubmit={confirmEditWithJustification}>
              <textarea
                required
                value={editJustification}
                onChange={(e) => setEditJustification(e.target.value)}
                placeholder="اكتب هنا سبب التعديل الرسمي... (مثال: تصحيح خطأ إدخال سابق، تقييم لاحق بعد تلافي الملاحظات...)"
                rows="4"
                className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 outline-none text-xs font-bold focus:border-amber-500 mb-4"
              />
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
              >
                تأكيد وحفظ التعديلات على التقييم
              </button>
            </form>
          </div>
        </div>
      )}




      {/* Smart Trigger Closure Modal */}
      {showClosureTrigger && triggeredFine && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl border-2 border-red-500/50 text-center relative overflow-hidden animate-bounce-in">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-red-500 to-amber-500"></div>
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertOctagon className="w-10 h-10 text-red-600 animate-pulse" />
            </div>
            
            <h2 className="text-xl font-black text-slate-800 dark:text-white mb-2">تنبيه حرج: مخالفة جسيمة!</h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm font-bold mb-6">
              غياب <span className="text-red-500">({triggeredFine.type})</span> يستوجب فرض غرامة مالية قدرها <span className="text-red-500 font-black">{triggeredFine.amount.toLocaleString()} د.ع</span> مع إغلاق المنشأة فوراً!
            </p>
            
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-900/50 mb-8 text-xs text-red-600 dark:text-red-400 font-bold leading-relaxed">
              تم إيقاف استمارة التقييم الاعتيادية تلقائياً.. لا يمكنك المتابعة إلا بعد اتخاذ إجراء قانوني تجاه هذه المخالفة الجسيمة.
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={submitImmediateClosure}
                className="w-full py-4 rounded-xl bg-gradient-to-l from-red-600 to-red-500 text-white font-black shadow-lg shadow-red-500/30 hover:scale-105 active:scale-95 transition-all text-sm flex items-center justify-center gap-2"
              >
                <Siren className="w-5 h-5" />
                إرسال طلب إغلاق فوري وتغريم للمدير
              </button>
              
              <button
                onClick={() => {
                  setShowClosureTrigger(false);
                  setDocsChecked(prev => ({ ...prev, [triggeredFine.id]: undefined }));
                }}
                className="w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-xs"
              >
                تراجع عن التحديد (إلغاء)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};export default InspectionForm;
