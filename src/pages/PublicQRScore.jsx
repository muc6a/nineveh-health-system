import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { AnimatedLogo } from '../components/AnimatedLogo';
import { ThemeToggle } from '../components/ThemeToggle';
import { Star, Shield, ShieldCheck, AlertOctagon, ChevronDown, ChevronUp, Camera, Send, Check, Package, Info, Award, Download } from 'lucide-react';
import html2canvas from 'html2canvas';

export const PublicQRScore = () => {
  const { navigate, establishments, routeParams, addReport, user, inspectionItems, config } = useContext(AppContext);
  const [establishment, setEstablishment] = useState(null);
  
  // Accordion details toggle
  const [showDetails, setShowDetails] = useState(false);
  
  // Tab/Mode state: 'dining' or 'delivery'
  const [citizenMode, setCitizenMode] = useState('dining');

  // Feedback Form State
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackPhoto, setFeedbackPhoto] = useState(null);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [citizenPoints, setCitizenPoints] = useState(0);
  const certificateRef = React.useRef(null);

  useEffect(() => {
    // Lookup based on route parameter
    const id = routeParams.qr_id || 'rest_1';
    const target = establishments.find(e => e.id === id) || establishments[0];
    setEstablishment(target);

    // Read initial mode from URL parameter
    const params = new URLSearchParams(window.location.search);
    const queryMode = params.get('mode') || 'dining';
    setCitizenMode(queryMode);
  }, [establishments, routeParams]);

  if (!establishment) {
    return <div className="p-8 text-center text-xs font-bold text-slate-400">جاري قراءة كود QR وتأكيد الترخيص...</div>;
  }

  // Score properties
  const score = establishment.score || 100;
  
  // Stars count out of 5
  const starsCount = Math.round((score / 100) * 5);

  // Status mappings
  const isCompliant = score >= (config.passingScore || 90);
  const isMonitoring = score >= (config.warningScore || 70) && score < (config.passingScore || 90);
  const isNonCompliant = score < (config.warningScore || 70);

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    addReport({
      establishmentName: establishment.name,
      sector: establishment.sector,
      details: feedbackText,
      evidenceImage: feedbackPhoto || 'camera_shot.jpg',
      isDelivery: citizenMode === 'delivery'
    });

    setFeedbackText('');
    setFeedbackPhoto(null);
    setFeedbackSubmitted(true);
    setCitizenPoints(prev => prev + 50); // Award 50 points
  };

  const downloadCertificate = async () => {
    if (!certificateRef.current) return;
    try {
      const canvas = await html2canvas(certificateRef.current, { scale: 2, backgroundColor: null });
      const image = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement("a");
      link.download = "شهادة-الرقيب-المدني-المتميز.png";
      link.href = image;
      link.click();
    } catch (error) {
      console.error("Error generating certificate:", error);
    }
  };

  // Mock section scores (for the accordion view)
  const getSectionScores = () => {
    if (score >= 95) return { A: 20, B: 20, C: 25, D: 20, E: 15 };
    if (score >= 90) return { A: 19, B: 18, C: 24, D: 19, E: 14 };
    if (score >= 80) return { A: 17, B: 16, C: 21, D: 16, E: 12 };
    if (score >= (config.passingScore || 90)) return { A: 15, B: 14, C: 18, D: 15, E: 10 };
    return { A: 10, B: 11, C: 13, D: 11, E: 7 };
  };
  const sectionScores = getSectionScores();

  return (
    <div className="min-h-screen bg-slatebg-light dark:bg-slatebg-dark p-4 md:p-8 flex items-center justify-center transition-colors duration-300">
      
      {/* Floating Controls */}
      <div className="absolute top-4 left-4 z-50 flex gap-2">
        <button
          onClick={() => {
            if (user?.role === 'team') {
              navigate('/dashboard/team');
            } else if (user?.role === 'director') {
              navigate('/dashboard/director');
            } else if (user?.role === 'admin') {
              navigate('/admin/control');
            } else {
              navigate('/public-search');
            }
          }}
          className="text-xs font-bold px-3 py-2 rounded-xl bg-slate-500/10 border border-slate-500/20 text-slate-600 dark:text-slate-400 hover:bg-slate-500/20 cursor-pointer"
        >
          {user ? 'العودة للوحة التحكم 🔙' : '✕ إغلاق'}
        </button>
        <ThemeToggle />
      </div>

      <div className="w-full max-w-lg glassmorphic-card p-6 md:p-8 relative overflow-hidden border border-white/30 shadow-2xl">
        
        {/* Pulsing 3D Digital Verification Seal */}
        <AnimatedLogo variant="seal" className="mb-6" />

        {/* Header information */}
        <div className="text-center mb-4">
          <h1 className="text-lg md:text-xl font-black text-slate-800 dark:text-white leading-tight">
            {establishment.name}
          </h1>
          <span className="inline-block mt-1 px-3 py-0.5 rounded-full bg-slate-100 dark:bg-slate-850 text-slate-500 text-[10px] font-bold">
            نشاط المنشأة: {establishment.type}
          </span>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 font-medium">
            تاريخ التقييم الرسمي الصادر: {establishment.lastInspection}
          </p>
        </div>

        {/* Mode Switcher Tabs for Citizen */}
        <div className="flex gap-2 mb-6 border-b border-slate-200 dark:border-slate-800 pb-3">
          <button
            onClick={() => setCitizenMode('dining')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${
              citizenMode === 'dining'
                ? 'bg-teal-600 text-white font-extrabold shadow-md'
                : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            🍽️ كشف وتراخيص الصالة
          </button>
          <button
            onClick={() => setCitizenMode('delivery')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${
              citizenMode === 'delivery'
                ? 'bg-teal-600 text-white font-extrabold shadow-md'
                : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            🛵 كشف وتراخيص التوصيل
          </button>
        </div>

        {citizenMode === 'dining' ? (
          <>
            {/* 3D Interactive Score Module */}
            <div className="p-6 rounded-3xl bg-slate-100/50 dark:bg-slate-900/50 border border-white/20 dark:border-slate-800 flex flex-col items-center justify-center mb-6 relative">
              <div className="absolute w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl animate-pulse"></div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">التقييم التفتيشي العام للمنشأة</span>
              
              <span className={`text-5xl font-black tracking-tight drop-shadow-[0_0_15px_rgba(13,148,136,0.3)] ${
                isCompliant ? 'text-emerald-500 dark:text-teal-400' :
                isMonitoring ? 'text-amber-500' : 'text-red-500'
              }`}>
                {score}%
              </span>

              <div className="flex gap-1.5 mt-4">
                {[1, 2, 3, 4, 5].map((starVal) => {
                  const active = starVal <= starsCount;
                  return (
                    <Star
                      key={starVal}
                      className={`w-6 h-6 transform transition-transform hover:scale-125 ${
                        active 
                          ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]' 
                          : 'text-slate-300 dark:text-slate-700'
                      }`}
                    />
                  );
                })}
              </div>
            </div>

            {/* Status badges */}
            <div className="space-y-3 mb-6">
              <div className="w-full">
                {isCompliant && (
                  <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-teal-400 text-xs font-black flex items-center justify-center gap-2">
                    <ShieldCheck className="w-5 h-5 shrink-0" />
                    <span>🟢 ملتزم بالاشتراطات الصحية والبيئية داخل الصالة</span>
                  </div>
                )}
                {isMonitoring && (
                  <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 text-xs font-black flex items-center justify-center gap-2">
                    <Star className="w-5 h-5 shrink-0" />
                    <span>🟡 تحت المتابعة والتحسين المستمر</span>
                  </div>
                )}
                {isNonCompliant && (
                  <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-black flex items-center justify-center gap-2">
                    <AlertOctagon className="w-5 h-5 shrink-0" />
                    <span>🔴 غير ملتزم - اتخاذ إجراءات وتنبيهات صحية</span>
                  </div>
                )}
              </div>

              <div className="w-full p-3 rounded-2xl bg-white/40 dark:bg-slate-800/40 border border-white/20 dark:border-slate-800 text-xs font-bold flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">صلاحية الإجازة الصحية للمحل:</span>
                {!establishment.licenseExpired ? (
                  <span className="text-emerald-500 font-black">🟢 سارية المفعول وصالحة</span>
                ) : (
                  <span className="text-red-500 font-black">🔴 منتهية الصلاحية قانونياً</span>
                )}
              </div>
            </div>

            {/* Collapsible Accordion: Details */}
            <div className="mb-6 border-b border-slate-200/50 dark:border-slate-800/50 pb-2">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="w-full flex items-center justify-between py-2 text-xs font-black text-slate-800 dark:text-slate-200 hover:text-teal-600 transition-colors cursor-pointer"
              >
                <span>👁️ عرض تفاصيل التقييم الصحي للمحاور الخمسة</span>
                {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showDetails && (
                <div className="mt-3 space-y-2.5 p-3 rounded-2xl bg-slate-50/50 dark:bg-slate-900/30 text-[11px] font-bold text-slate-600 dark:text-slate-300 text-right">
                  {establishment.inspectorName && (
                    <div className="p-2 mb-2 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-400 font-extrabold text-[10px] text-center">
                      🛡️ تم التفتيش بواسطة: {establishment.inspectorName}
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>أ. سلامة العمال والجهوزية الطبية</span>
                    <span className="font-extrabold text-teal-600">{sectionScores.A}/20 نقطة</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ب. النظافة العامة والبيئة المكانية</span>
                    <span className="font-extrabold text-teal-600">{sectionScores.B}/20 نقطة</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ج. سلامة الأغذية وسلاسل الحفظ</span>
                    <span className="font-extrabold text-teal-600">{sectionScores.C}/25 نقطة</span>
                  </div>
                  <div className="flex justify-between">
                    <span>د. المعدات والتحضير الفني داخل المطبخ</span>
                    <span className="font-extrabold text-teal-600">{sectionScores.D}/20 نقطة</span>
                  </div>
                  <div className="flex justify-between">
                    <span>هـ. إجازة العمل والالتزام بالزيارات السابقة</span>
                    <span className="font-extrabold text-teal-600">{sectionScores.E}/15 نقطة</span>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Delivery-focused evaluation viewport */}
            <div className="p-6 rounded-3xl bg-blue-500/5 border border-blue-500/15 flex flex-col items-center justify-center mb-6 relative text-center">
              <Package className="w-12 h-12 text-teal-600 mb-2.5" />
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">الامتثال العام لخدمة التوصيل (Delivery)</span>
              
              <span className="text-3xl font-black text-teal-600 dark:text-teal-400 mt-1">
                مطابق للمواصفات 🛵
              </span>
              <p className="text-[10px] text-slate-500 mt-2 max-w-xs leading-relaxed">
                تلتزم هذه المنشأة بمعايير التعبئة الحرارية الآمنة وتدقيق رخص مندوبيها صحياً
              </p>
            </div>

            {/* Delivery Specifications Listing */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/30 border border-slate-200/50 dark:border-slate-800 mb-6 text-right text-xs font-bold space-y-2.5">
              <div className="flex items-center justify-between border-b border-slate-200/30 pb-2">
                <span className="text-[10.5px] text-slate-500">مؤشرات السلامة للتوصيل:</span>
                <span className="text-[10px] text-teal-600 font-black">الامتثال الفعلي</span>
              </div>
              <div className="flex justify-between items-center">
                <span>📦 سلامة وجودة تغليف وتعبئة علب الأغذية</span>
                <span className="text-emerald-500 font-black">ممتاز (5/5)</span>
              </div>
              <div className="flex justify-between items-center">
                <span>👜 نظافة حقائب التوصيل الحافظة للحرارة</span>
                <span className="text-emerald-500 font-black">مطابق (5/5)</span>
              </div>
              <div className="flex justify-between items-center">
                <span>👤 حيازة كابتن التوصيل لبطاقة اللياقة الطبية</span>
                <span className="text-emerald-500 font-black">مكتمل (5/5)</span>
              </div>
            </div>
          </>
        )}

        {/* Anonymized Crowd Feedback Section */}
        <div className="pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
          {!showFeedbackForm ? (
            <button
              onClick={() => setShowFeedbackForm(true)}
              className="w-full py-3 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 font-extrabold text-xs transition-all active:scale-[0.98] border border-red-500/20 cursor-pointer"
            >
              {citizenMode === 'dining' 
                ? '⚠️ تقديم بلاغ أو شكوى سرية عن الصالة والطعام' 
                : '🛵 تقديم شكوى حول جودة أو تعبئة خدمة التوصيل'}
            </button>
          ) : (
            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/10 text-[10px] font-bold text-amber-600 dark:text-amber-400 leading-relaxed text-right">
                <span>ملاحظة: بلاغك سري وآمن بالكامل. لن يظهر اسمك أو هويتك لأي جهة. هذا النظام صُمم لحمايتك.</span>
              </div>

              {feedbackSubmitted ? (
                <div className="flex flex-col gap-4">
                  <div 
                    ref={certificateRef}
                    className="mx-auto w-[360px] min-h-[400px] p-6 pb-8 rounded-2xl bg-gradient-to-tr from-emerald-700 via-teal-600 to-emerald-500 text-white text-center flex flex-col items-center justify-between shadow-2xl relative overflow-hidden border border-emerald-400/30"
                  >
                    {/* Background decorations */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-900/20 rounded-full blur-2xl transform -translate-x-10 translate-y-10"></div>
                    
                    {/* Fixed Top Header (No Flex Space-Between to avoid text rendering issues) */}
                    {/* Fixed Top Header */}
                    <div className="w-full text-center relative z-10">
                      <p className="text-[10px] font-black text-emerald-100/90 mb-1">محافظة نينوى</p>
                      <p className="text-xs font-black text-white">منظومة الرقابة الصحية الرقمية</p>
                    </div>

                    {/* Badge and Main Text */}
                    <div className="flex flex-col items-center justify-center relative z-10 flex-1 my-4">
                      <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-3 backdrop-blur-sm border border-white/30 shadow-inner">
                        <Award className="w-12 h-12 text-yellow-300 drop-shadow-[0_0_10px_rgba(253,224,71,0.5)]" />
                      </div>
                      
                      <h3 className="font-black text-2xl text-yellow-300 drop-shadow-md mb-2">الرقيب المدني المتميز 🏅</h3>
                      <div className="h-px w-3/4 bg-gradient-to-r from-transparent via-emerald-300/50 to-transparent my-2"></div>
                      <p className="text-base font-black text-white leading-relaxed mt-2">شكراً لك لمساعدتنا في حماية المجتمع!</p>
                      <p className="text-[11px] opacity-90 mt-2 max-w-[280px]">لقد ساهمت في رصد المخالفات وتم تحويل بلاغك للفرق الميدانية المختصة.</p>
                    </div>
                    
                    {/* Bottom Logos Section */}
                    <div className="w-full flex items-center justify-center gap-6 mt-4 relative z-10 border-t border-emerald-500/30 pt-4 pb-2">
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-1.5 shadow-[0_4px_0_rgba(6,78,59,0.5),0_10px_15px_rgba(0,0,0,0.3)] border-2 border-emerald-100 p-1.5 transform hover:scale-105 transition-all">
                          <img src="/logo-ninveh.png" alt="محافظة نينوى" className="w-full h-full object-contain drop-shadow-sm" onError={(e) => e.target.style.display='none'} />
                        </div>
                        <span className="text-[9px] font-black text-white drop-shadow-md">محافظة نينوى</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-1.5 shadow-[0_4px_0_rgba(6,78,59,0.5),0_10px_15px_rgba(0,0,0,0.3)] border-2 border-emerald-100 p-1.5 transform hover:scale-105 transition-all">
                          <img src="/logo-health.png" alt="صحة نينوى" className="w-full h-full object-contain drop-shadow-sm" onError={(e) => e.target.style.display='none'} />
                        </div>
                        <span className="text-[9px] font-black text-white drop-shadow-md">صحة نينوى</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-1.5 shadow-[0_4px_0_rgba(6,78,59,0.5),0_10px_15px_rgba(0,0,0,0.3)] border-2 border-emerald-100 p-1.5 transform hover:scale-105 transition-all">
                          <img src="/logo-ministry.png" alt="وزارة الصحة" className="w-full h-full object-contain drop-shadow-sm" onError={(e) => e.target.style.display='none'} />
                        </div>
                        <span className="text-[9px] font-black text-white drop-shadow-md">وزارة الصحة</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={downloadCertificate}
                    className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-xs transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    حفظ الشهادة ومشاركتها
                  </button>
                  <button
                    onClick={() => {
                      setFeedbackSubmitted(false);
                      setShowFeedbackForm(false);
                    }}
                    className="w-full py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs transition-all cursor-pointer"
                  >
                    العودة
                  </button>
                </div>
              ) : (
                <>
                  <textarea
                    rows="3"
                    required
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder={citizenMode === 'dining' 
                      ? "اكتب تفاصيل المخالفة المشاهدة داخل المطعم..." 
                      : "اكتب تفاصيل مشكلة الديليفري (مثال: حقيبة متسخة، غلاف الأكل مفتوح، مندوب لا يرتدي كفوف)..."}
                    className="w-full p-3 rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs font-bold outline-none text-slate-800 dark:text-slate-200"
                  />

                  {/* Camera trigger */}
                  <div className="space-y-2">
                    <label className="border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                      <Camera className="w-6 h-6 text-red-500" />
                      <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">
                        {citizenMode === 'dining' 
                          ? "📸 التقاط صورة أو فيديو حية للمخالفة داخل الصالة" 
                          : "📸 التقط صورة أو فيديو لعلبة الطعام أو حقيبة التوصيل المخالفة"}
                      </span>
                      <span className="text-[8px] text-slate-400 font-bold text-center mt-1">يُسمح بملف واحد (صورة أو فيديو قصير)<br/>(يتم حذف المرفقات تلقائياً بعد فترة زمنية للحفاظ على سرعة النظام)</span>
                      <input
                        type="file"
                        accept="image/*,video/*"
                        multiple={false}
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setFeedbackPhoto(e.target.files[0].name);
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                    {feedbackPhoto && (
                      <span className="text-[9px] text-emerald-500 font-bold block">✓ تم تحميل الصورة بنجاح: {feedbackPhoto}</span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>إرسال البلاغ السري</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowFeedbackForm(false)}
                      className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 text-xs font-bold cursor-pointer"
                    >
                      إلغاء
                    </button>
                  </div>
                </>
              )}
            </form>
          )}
        </div>

      </div>

    </div>
  );
};

export default PublicQRScore;
