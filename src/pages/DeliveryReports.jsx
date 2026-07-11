import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { AnimatedLogo } from '../components/AnimatedLogo';
import { ThemeToggle } from '../components/ThemeToggle';
import { Package, ShieldAlert, Camera, Send, ArrowRight, ShieldCheck } from 'lucide-react';

export const DeliveryReports = () => {
  const { navigate, addReport, config } = useContext(AppContext);
  const [restaurantName, setRestaurantName] = useState('');
  const [sector, setSector] = useState('الزهور');
  const [details, setDetails] = useState('');
  const [photo, setPhoto] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!photo) {
      setErrorMsg('التقاط وإرفاق صورة المخالفة إلزامي لإثبات حالة التوصيل المنزلي.');
      return;
    }

    addReport({
      establishmentName: restaurantName,
      sector,
      details,
      evidenceImage: photo,
      isDelivery: true // Sets [📦 توصيل منزلي] blue tag
    });

    setRestaurantName('');
    setDetails('');
    setPhoto(null);
    setErrorMsg('');
    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
    }, 4000);
  };

  // Safe Closure Check from Super Admin config
  if (!config.allowExternalReports) {
    return (
      <div className="min-h-screen bg-slatebg-light dark:bg-slatebg-dark p-4 flex items-center justify-center transition-colors duration-300">
        <div className="w-full max-w-md glassmorphic-card p-6 md:p-8 text-center border border-red-500/10">
          <AnimatedLogo className="mx-auto mb-4" />
          <h2 className="text-base font-black text-slate-800 dark:text-white mb-2">رابط البلاغات الخارجية والتوصيل المنزلي مغلق مؤقتاً</h2>
          <p className="text-xs text-slate-500 leading-relaxed mb-6">
            تم إيقاف استقبال البلاغات الخارجية من قبل إدارة النظام لغرض الصيانة الدورية أو التحديث الفني. يمكنك التواصل عبر الهاتف المباشر للوزارة.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="w-full py-2.5 rounded-xl bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 text-xs font-black cursor-pointer"
          >
            العودة لبوابة النظام
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slatebg-light dark:bg-slatebg-dark p-4 md:p-8 flex items-center justify-center transition-colors duration-300">
      
      {/* Top Floating Controls */}
      <div className="absolute top-4 left-4 z-50 flex items-center gap-2">
        <button
          onClick={() => navigate('/login')}
          className="text-xs font-bold px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-1 cursor-pointer"
        >
          <ArrowRight className="w-4 h-4" />
          <span>بوابة الدخول</span>
        </button>
        <ThemeToggle />
      </div>

      <div className="w-full max-w-lg glassmorphic-card p-6 md:p-8 relative border border-white/30 shadow-2xl">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-teal-500/5 rounded-full blur-2xl pointer-events-none"></div>

        {/* Header Logo */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="p-2.5 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-600 mb-3">
            <Package className="w-8 h-8" />
          </div>
          <h1 className="text-base font-black text-slate-800 dark:text-white">بوابة بلاغات التوصيل المنزلي الخارجية للمستهلك</h1>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 leading-relaxed">
            المنصة الرسمية المعتمدة لتوثيق شكاوى الطعام الفاسد أو المنتهي الصلاحية لطلبات الدليفري بمحافظة نينوى
          </p>
        </div>

        {/* Strict confidentiality guarantees */}
        <div className="p-3.5 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-600 dark:text-teal-400 leading-relaxed text-right mb-6 flex gap-2">
          <ShieldCheck className="w-5 h-5 shrink-0 text-emerald-500" />
          <span>ضمان سرية مطلق: نضمن لك عدم الكشف عن هويتك أو رقم هاتفك لصاحب العلاقة إطلاقاً، بلاغك آمن كلياً ويُرسل فورياً للجنة الرقابية.</span>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {submitted ? (
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-3">
            <h3 className="text-sm font-black text-emerald-600">تم إرسال البلاغ فورياً 🟢</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              شكراً لمساهمتك في الحفاظ على الصحة العامة. تم تحويل هذا البلاغ مباشرةً برقم تصنيف خاص إلى اللجنة الرقابية لـ (قطاع {sector}) مع علامة [📦 توصيل منزلي] لإجراء فحص ميداني عاجل للمطعم.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Restaurant name */}
            <div>
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">اسم المطعم المشكو بحقه</label>
              <input
                type="text"
                required
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                placeholder="اكتب اسم المطعم بدقة..."
                className="w-full p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs font-bold outline-none text-slate-800 dark:text-slate-200 focus:border-teal-500"
              />
            </div>

            {/* Neighborhood sector dropdown */}
            <div>
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">المنطقة الجغرافية / القطاع</label>
              <select
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs font-bold outline-none text-slate-800 dark:text-slate-200"
              >
                <option value="الزهور">قطاع الزهور</option>
                <option value="المصارف">قطاع المصارف</option>
                <option value="الغزلاني">قطاع الغزلاني</option>
                <option value="الجانب الأيمن">قطاع الجانب الأيمن</option>
              </select>
            </div>

            {/* Violation description */}
            <div>
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">تفاصيل المخالفة</label>
              <textarea
                rows="4"
                required
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="اكتب هنا ما لاحظته بالتفصيل (مثل: رائحة اللحوم، العثور على شعرة، تاريخ تالف، تأخر مريب في التوصيل أفسد الطعام)..."
                className="w-full p-3 rounded-xl bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs font-bold outline-none text-slate-800 dark:text-slate-200 focus:border-teal-500"
              />
            </div>

            {/* Mandatory camera trigger */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300 block">إرفاق صورة المخالفة (إلزامي لإرسال الشكوى)</span>
              <label className="border border-dashed border-red-500/20 rounded-xl p-6 flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                <Camera className="w-8 h-8 text-red-500" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">📸 إرفاق صورة المخالفة أو الطعام الفاسد الواصل للمنزل</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setPhoto(e.target.files[0].name);
                      setErrorMsg('');
                    }
                  }}
                  className="hidden"
                />
              </label>
              {photo && (
                <span className="text-[10px] text-emerald-500 font-bold block">✓ تم تحميل إثبات الصورة بنجاح: {photo}</span>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-l from-red-600 to-rose-600 text-white font-extrabold text-xs shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer shadow-3d-inset"
            >
              <Send className="w-4.5 h-4.5" />
              <span>إرسال البلاغ فورياً للجان الميدانية</span>
            </button>
          </form>
        )}
      </div>

    </div>
  );
};

export default DeliveryReports;
