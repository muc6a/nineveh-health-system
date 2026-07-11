import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { AnimatedLogo } from '../components/AnimatedLogo';
import { ThemeToggle } from '../components/ThemeToggle';
import { ShieldCheck, AlertTriangle, AlertOctagon, Printer, LogOut, Lock, Clock, Info, ArrowLeft, Download, Brain, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

export const OwnerPortal = () => {
  const { navigate, establishments, config } = useContext(AppContext);
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  const [ownerEst, setOwnerEst] = useState(null);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!accessCode.trim()) {
      setError('يرجى إدخال الكود السري الخاص بمنشأتك.');
      return;
    }
    // Sanitize input: strip EVERYTHING except A-Z, 0-9, and -
    const sanitizedInput = accessCode.replace(/[^a-zA-Z0-9-]/g, '').toUpperCase();
    const est = establishments.find(e => e.accessCode === sanitizedInput);
    if (est) {
      setOwnerEst(est);
      setError('');
    } else {
      setError('الكود السري غير صحيح أو غير مسجل في النظام.');
    }
  };

  const handleLogout = () => {
    setOwnerEst(null);
    setAccessCode('');
  };

  // Login View
  if (!ownerEst) {
    return (
      <div className="min-h-screen bg-slatebg-light dark:bg-slatebg-dark flex items-center justify-center p-4 transition-colors duration-300">
        <div className="absolute top-4 left-4 z-50">
          <ThemeToggle />
        </div>
        <div className="absolute top-4 right-4 z-50">
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> العودة للرئيسية
          </button>
        </div>

        <div className="w-full max-w-md glassmorphic-card p-8 relative overflow-hidden">
          <AnimatedLogo variant="login" className="mb-6" />
          
          <div className="text-center mb-8">
            <h1 className="text-2xl font-black text-slate-800 dark:text-white mb-2">بوابة أصحاب المنشآت</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">
              يرجى إدخال الكود السري (PIN) المُسلم لك من قبل فرق الرقابة الصحية للاطلاع على التقرير.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-[11px] font-black text-slate-700 dark:text-slate-300 mb-2">الكود السري (Access Code)</label>
              <div className="relative">
                <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value.replace(/[–—]/g, '-').replace(/[^a-zA-Z0-9-]/g, '').toUpperCase())}
                  placeholder="مثال: M-782X"
                  className="w-full pl-4 pr-10 py-3.5 rounded-xl bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-teal-500/50 text-center uppercase tracking-widest"
                  dir="ltr"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-[10px] font-bold text-red-600 dark:text-red-400 text-center animate-shake">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-l from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              دخول للبوابة
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Dashboard View
  const score = ownerEst.score;
  const isCompliant = score >= (config.passingScore || 90);
  const isMonitoring = score >= (config.warningScore || 70) && score < (config.passingScore || 90);
  const isNonCompliant = score < (config.warningScore || 70);
  
  const lastHistory = ownerEst.history && ownerEst.history.length > 0 ? ownerEst.history[0] : null;

  // Prepare chart data from history
  const historyData = ownerEst.history ? [...ownerEst.history].reverse().map(h => ({
    name: h.date.split(',')[0] || h.date,
    score: h.score
  })) : [];
  
  // Also add current score if there's no history or as the latest point if it differs
  if (historyData.length === 0 || historyData[historyData.length - 1].score !== score) {
     historyData.push({ name: 'الحالي', score: score });
  }

  // Generate AI Suggestions based on score
  const getAiSuggestions = () => {
    if (score >= 95) return ['حافظ على مستوى النظافة الممتاز.', 'استمر في تدريب العمال الجدد على نفس المعايير.', 'فكر في توسيع خدماتك فأنت مثال يقتدى به.'];
    if (score >= 80) return ['يوجد تراخي بسيط في بعض معايير النظافة، يرجى تشديد الرقابة الداخلية.', 'تأكد من تجديد الشهادات الصحية للعمال قبل انتهائها.', 'اهتم أكثر بنظافة الثلاجات من الداخل.'];
    return ['تحذير حرج: يجب تنظيف المطبخ بالكامل بمواد معقمة فوراً.', 'أرسل جميع العمال للفحص الطبي لتجديد بطاقاتهم.', 'راجع صلاحية المواد الغذائية في المخزن وتخلص من التالف.', 'صيانة الأرضيات والجدران التالفة لمنع تجمع الحشرات.'];
  };
  const aiSuggestions = getAiSuggestions();

  return (
    <div className="min-h-screen bg-slatebg-light dark:bg-slatebg-dark p-4 md:p-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between mb-8 gap-4 no-print">
        <div className="flex items-center gap-3">
          <AnimatedLogo variant="sidebar" />
          <div className="h-8 w-px bg-slate-300 dark:bg-slate-700"></div>
          <h2 className="text-sm font-black text-slate-800 dark:text-white">بوابة المنشآت الرسمية</h2>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl bg-teal-600 text-white shadow-md shadow-teal-500/20 text-xs font-black transition-all flex items-center gap-2 cursor-pointer print-btn"
          >
            <Download className="w-4 h-4" />
            <span>استخراج PDF / طباعة التقرير</span>
          </button>
          <ThemeToggle />
          <button
            onClick={handleLogout}
            className="p-2 rounded-xl bg-red-500/10 text-red-600 hover:bg-red-500/20 cursor-pointer transition-colors"
            title="تسجيل الخروج"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-6 print-only-report">
        
        {/* Print Header (hidden on screen) */}
        <div className="hidden print-only mb-8 text-center border-b-2 border-black pb-4">
          <h1 className="text-2xl font-black mb-1">دائرة صحة نينوى - قسم الرقابة الصحية</h1>
          <h2 className="text-xl font-bold">تقرير كشف ميداني رسمي (نسخة صاحب المنشأة)</h2>
          <p className="text-sm mt-2">تاريخ الإصدار: {new Date().toLocaleDateString('ar-IQ')}</p>
        </div>

        {/* Establishment Info Card */}
        <div className="glassmorphic-card p-6 border-r-4 border-r-teal-600">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-black text-slate-800 dark:text-white mb-1">{ownerEst.name}</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">{ownerEst.type} | {ownerEst.sector}</p>
            </div>
            <div className="text-left">
              <span className="text-[10px] text-slate-400 block mb-1">تاريخ الكشف الأخير</span>
              <span className="text-sm font-black text-slate-800 dark:text-white">{ownerEst.lastInspection}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
            <div>
              <span className="text-[10px] text-slate-400 block mb-1">المالك</span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{ownerEst.owner}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block mb-1">رقم الإجازة</span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{ownerEst.licenseNumber}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block mb-1">اللجنة الفاحصة</span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{ownerEst.inspectorName || 'غير مسجل'}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block mb-1">المحور</span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{ownerEst.sector}</span>
            </div>
          </div>
        </div>

        {/* Score and Status Card */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="glassmorphic-card p-6 flex flex-col items-center justify-center text-center">
            <h3 className="text-xs font-black text-slate-500 dark:text-slate-400 mb-4 uppercase tracking-wider">نتيجة التقييم الصحي</h3>
            
            <div className={`relative flex items-center justify-center w-32 h-32 rounded-full mb-4 border-8 ${
              isCompliant ? 'border-emerald-500 text-emerald-500' :
              isMonitoring ? 'border-amber-500 text-amber-500' : 'border-red-500 text-red-500'
            }`}>
              <span className="text-4xl font-black">{score}%</span>
            </div>

            {isCompliant && (
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-black">
                <ShieldCheck className="w-5 h-5" /> مطابق للشروط والمواصفات
              </div>
            )}
            {isMonitoring && (
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-black">
                <AlertTriangle className="w-5 h-5" /> إنذار وتعهد بالتحسين
              </div>
            )}
            {isNonCompliant && (
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-black">
                <AlertOctagon className="w-5 h-5" /> مخالف للشروط - إجراءات إغلاق
              </div>
            )}
          </div>

          <div className="glassmorphic-card p-6 flex flex-col justify-center">
            <h3 className="text-sm font-black text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-teal-600" />
              ملاحظات وتوجيهات الرقابة
            </h3>
            
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-200 text-sm font-bold leading-relaxed mb-4">
              {lastHistory?.notes || ownerEst.notes || 'لا توجد ملاحظات مسجلة لهذه الزيارة.'}
            </div>

            {!isCompliant && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex gap-3">
                <Clock className="w-6 h-6 text-red-500 shrink-0" />
                <div>
                  <h4 className="text-xs font-black text-red-700 dark:text-red-400 mb-1">مهلة تصحيح المسار</h4>
                  <p className="text-[10px] font-bold text-red-600/80 dark:text-red-400/80">
                    لديك مهلة <strong className="text-red-700 dark:text-red-300">72 ساعة</strong> من تاريخ التفتيش لتصحيح المخالفات المذكورة أعلاه. سيتم اتخاذ الإجراءات القانونية والغرامة أو التشميع في حال عدم الالتزام.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Detailed Points (Simulated representation if ratings aren't fully stored per item) */}
        {lastHistory?.ratings && (
          <div className="glassmorphic-card p-6">
            <h3 className="text-sm font-black text-slate-800 dark:text-white mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">تفاصيل النقاط المخصومة (المخالفات)</h3>
            <div className="space-y-3">
              {Object.entries(lastHistory.ratings).map(([itemId, rating]) => {
                if (rating < 5) {
                  return (
                    <div key={itemId} className="flex items-center justify-between p-3 rounded-xl bg-red-500/5 border border-red-500/10">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500"></span>
                        مخالفة في المعيار رقم {itemId}
                      </span>
                      <span className="text-[10px] font-black text-red-600 bg-red-500/10 px-2 py-1 rounded-lg">تم خصم {5 - rating} نقطة</span>
                    </div>
                  );
                }
                return null;
              })}
              
              {Object.values(lastHistory.ratings).every(r => r === 5) && (
                <div className="text-center text-xs font-bold text-slate-500 p-4">
                  لا توجد نقاط مخصومة. جميع المعايير مطابقة! 🌟
                </div>
              )}
            </div>
          </div>
        )}

        {/* Evaluation History Chart */}
        <div className="glassmorphic-card p-6 no-print">
          <h3 className="text-sm font-black text-slate-800 dark:text-white mb-6 border-b border-slate-200 dark:border-slate-700 pb-2 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-teal-600" />
            مسار التقييمات التاريخي
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickMargin={10} />
                <YAxis stroke="#64748b" fontSize={10} domain={[0, 100]} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                  itemStyle={{ color: '#2dd4bf' }}
                />
                <Line type="monotone" dataKey="score" name="التقييم (%)" stroke="#0d9488" strokeWidth={4} dot={{ r: 6, fill: '#0d9488', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Suggestions Box */}
        <div className="glassmorphic-card p-6 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/20 dark:to-purple-900/20 border-indigo-100 dark:border-indigo-900/30">
          <h3 className="text-sm font-black text-indigo-800 dark:text-indigo-300 mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5 text-indigo-500" />
            توصيات المساعد الذكي (AI) للتحسين
          </h3>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mb-4 font-bold">بناءً على نتائج الكشف الأخير ونقاط الضعف، نقترح عليك الآتي لتجنب الغرامات ورفع تقييمك:</p>
          <ul className="space-y-3">
            {aiSuggestions.map((sug, idx) => (
              <li key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-indigo-100/50 dark:border-indigo-800/30">
                <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 text-xs font-black">
                  {idx + 1}
                </span>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 mt-1 leading-relaxed">
                  {sug}
                </span>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
};

export default OwnerPortal;
