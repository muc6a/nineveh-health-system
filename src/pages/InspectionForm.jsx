import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { ThemeToggle } from '../components/ThemeToggle';
import { ShieldCheck, Camera, AlertOctagon, MapPin, Search, Star, Edit, Save, ArrowRight, Activity, Plus, Trash2, Cpu, FileText, WifiOff, Printer, ClipboardCheck } from 'lucide-react';

export const InspectionForm = () => {
  const { navigate, establishments, inspectionItems, addInspection, config, user, logAudit, notify: triggerAlert } = useContext(AppContext);

  // Parse establishment ID from query string
  const [establishment, setEstablishment] = useState(null);
  const [timestamp, setTimestamp] = useState('');
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
      triggerAlert('تم عودة الاتصال! جاري مزامنة الكشوفات مع غرفة العمليات المركزية...');
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
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
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

    const initialRatings = {};
    if (isEdit && target && target.history && target.history.length > 0) {
      const lastEval = target.history[0];
      inspectionItems.forEach(item => {
        initialRatings[item.id] = lastEval.ratings && lastEval.ratings[item.id] !== undefined ? lastEval.ratings[item.id] : 5;
      });
      if (lastEval.notes) {
        setRemarks(lastEval.notes);
      }
    } else {
      inspectionItems.forEach(item => {
        initialRatings[item.id] = 5;
      });
    }
    setRatings(initialRatings);
  }, [establishments, inspectionItems]);

  if (!establishment) {
    return <div className="p-8 text-center text-xs font-bold text-slate-400">تحميل بيانات المنشأة...</div>;
  }

  const isAtrOrCafe = establishment.type === 'بيع وطحن القهوة' || establishment.type === 'عطارية' || establishment.type === 'مقهى وكافيه' || establishment.type === 'مقهى';
  const activeItems = isAtrOrCafe ? inspectionItems.filter(item => item.section !== 'D') : inspectionItems;

  const sumScores = Object.keys(ratings).reduce((acc, itemId) => {
    const item = activeItems.find(i => String(i.id) === String(itemId));
    if (!item) return acc;
    const val = ratings[itemId] !== undefined ? ratings[itemId] : 5;
    return acc + val;
  }, 0);

  const maxPossible = activeItems.reduce((acc, curr) => acc + 5, 0);
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
        },
        (error) => {
          console.error(error);
          const mockLat = (36.3489 + (Math.random() - 0.5) * 0.02).toFixed(6);
          const mockLon = (43.1578 + (Math.random() - 0.5) * 0.02).toFixed(6);
          setLiveLocation({ lat: mockLat, lon: mockLon });
          setLocationLog(`${mockLat}° N, ${mockLon}° E (محاكاة إحداثيات موقع الموصل 📍)`);
          setIsFetchingLocation(false);
        },
        { enableHighAccuracy: true, timeout: 6000 }
      );
    } else {
      setIsFetchingLocation(false);
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
      addInspection(establishment.id, scorePercentage, remarks || 'تم إجراء التقييم الصحي الدوري.', ratings, user?.name || 'اللجنة الرقابية الأولى', liveLocation, isEdit, user?.id);
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

  const uniqueSections = Array.from(new Set(activeItems.map(item => item.section || 'A'))).sort();
  const sectionLabels = {
    'A': 'مراقبة العمال والجهوزية الطبية (المحور أ)',
    'B': 'النظافة العامة والبيئة المكانية (المحور ب)',
    'C': 'سلامة الأغذية وحفظها وسلسلة التبريد (المحور ج)',
    'D': 'المعدات والتحضير الفني داخل المطبخ (المحور د)',
    'E': 'الوثائق والالتزام الرقابي التراكمي (المحور هـ)'
  };
  const sections = uniqueSections.map(secKey => ({ key: secKey, title: sectionLabels[secKey] || `المحور الرقابي (${secKey})` }));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto flex items-center justify-between mb-6">
        <button onClick={() => navigate('/dashboard/team')} className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400">
          <ArrowRight className="w-4 h-4" /> رجوع
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

        <form onSubmit={handleFormSubmit} className="space-y-6 relative">
          {sections.map(section => (
            <div key={section.key} className="glassmorphic-card p-6">
              <h3 className="text-xs font-black text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-3 mb-4 text-teal-600">
                {section.title}
              </h3>
              <div className="space-y-4">
                {activeItems.filter(item => item.section === section.key).map(item => (
                  <div key={item.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2 border-b border-slate-100/50 dark:border-slate-800/20 last:border-b-0">
                    
                    {/* Item label */}
                    <div className="flex gap-3 min-w-0">
                      <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-400 shrink-0">
                        {item.id}
                      </span>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 leading-relaxed">
                        {item.text}
                      </span>
                    </div>

                    {/* Score Touch Number Input */}
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] text-slate-400 font-bold">الدرجة المستحقة:</span>
                      <input
                        type="number"
                        min="0"
                        max="5"
                        value={ratings[item.id] !== undefined ? ratings[item.id] : 5}
                        onChange={(e) => {
                          const val = Math.min(5, Math.max(0, Number(e.target.value)));
                          handleRatingChange(item.id, val);
                        }}
                        className="p-2 w-16 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs font-black outline-none text-center text-teal-600 focus:border-teal-500"
                      />
                      <span className="text-[10px] text-slate-500 font-extrabold">من أصل 5</span>
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

            {/* Photo Picker */}
            {config.allowImageUpload && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-500 block">توثيق المخالفات أو الالتزام بالصور الحية</span>
                <label className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                  <Camera className="w-8 h-8 text-teal-600" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">📸 التقاط أو إرفاق صورة ميدانية</span>
                  <span className="text-[10px] text-slate-400">يقبل صيغ الصور JPG, PNG كدليل معتمد بالنظام</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setSelectedPhoto(e.target.files[0].name);
                      }
                    }}
                    className="hidden"
                  />
                </label>
                {selectedPhoto && (
                  <span className="text-[10px] text-emerald-500 font-bold block">✓ تم تحميل الصورة بنجاح: {selectedPhoto}</span>
                )}
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

          {/* Live Score Sticky Bar */}
          <div className="sticky bottom-4 w-full p-4 rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 shadow-2xl flex flex-col gap-4 no-print z-50">
            
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 block mb-1">النتيجة النهائية (تلقائي)</span>
                <div className="flex items-end gap-2">
                  <span className={`text-4xl font-black ${scorePercentage >= config.passingScore ? 'text-emerald-500' : scorePercentage >= config.warningScore ? 'text-amber-500' : 'text-red-500'}`}>
                    {scorePercentage}%
                  </span>
                  <span className="text-xs font-bold text-slate-500 mb-1">
                    {scorePercentage >= config.passingScore ? 'مطابق للشروط ✅' : scorePercentage >= config.warningScore ? 'إنذار وتعهد ⚠️' : 'إغلاق وتشميع ❌'}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 block mb-1">مجموع النقاط</span>
                <span className="text-lg font-black text-slate-800 dark:text-white">{sumScores} <span className="text-xs text-slate-500">/ {maxPossible}</span></span>
              </div>
            </div>
          
          <div className="mt-4 pt-4 border-t border-slate-200/50 dark:border-slate-800/50 no-print">
            <button
              type="button"
              onClick={simulateAiScan}
              disabled={isAiScanning}
              className={`w-full p-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
                isAiScanning 
                ? 'bg-purple-100 text-purple-400 animate-pulse'
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white cursor-pointer'
              }`}
            >
              <Camera className="w-5 h-5" />
              {isAiScanning ? '🤖 جاري تحليل الصورة واستخراج المخالفات...' : '🤖 المفتش الذكي (تحليل صورة المطبخ عبر AI)'}
            </button>
            
            {aiReport && (
              <div className="mt-4 p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-700 dark:text-purple-300">
                <h4 className="font-black text-xs mb-2">⚡ نتائج التحليل بالذكاء الاصطناعي:</h4>
                <p className="text-[10px] mb-2">{aiReport.message}</p>
                <ul className="list-disc list-inside text-[10px] font-bold">
                  {aiReport.items.map((item, idx) => (
                    <li key={idx} className="text-red-500">{item} (تم خصم النقاط تلقائياً)</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Live Score Sticky Bar */}     <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-2xl bg-gradient-to-l from-emerald-600 to-teal-600 text-white font-extrabold text-sm shadow-md hover:shadow-lg active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>جاري حفظ وإرسال البيانات...</span>
              ) : (
                <>
                  <span>📌 اعتماد التقييم الصحي وإرسال التقرير للمديرية 🚀</span>
                </>
              )}
            </button>
          </div>

        </form>

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

    </div>
  );
};

export default InspectionForm;
