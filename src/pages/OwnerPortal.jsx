import React, { useState, useContext, useEffect, useRef } from 'react';
import { AppContext } from '../context/AppContext';
import { AnimatedLogo } from '../components/AnimatedLogo';
import { ThemeToggle } from '../components/ThemeToggle';
import { 
  ShieldCheck, AlertTriangle, AlertOctagon, Printer, LogOut, Lock, Clock, 
  Info, ArrowLeft, Download, Brain, TrendingUp, Award, Image as ImageIcon,
  CheckCircle2, XCircle, QrCode, Camera, FileText, ChevronRight, RefreshCw, Send
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { QRCodeSVG } from 'qrcode.react';

export const OwnerPortal = () => {
  const { navigate, establishments, config, ownerCMS, addSystemNotification, directives, setDirectives } = useContext(AppContext);
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  const [ownerEst, setOwnerEst] = useState(null);
  const certificateRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isRequestingInspection, setIsRequestingInspection] = useState(false);
  const [inspectionRequested, setInspectionRequested] = useState(false);

  // Check if there is already a pending directive for this establishment
  useEffect(() => {
    if (ownerEst && directives) {
      const hasPending = directives.some(d => d.targetEstId === ownerEst.id && d.status === 'pending');
      setInspectionRequested(hasPending);
    }
  }, [ownerEst, directives]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!accessCode.trim()) {
      setError('يرجى إدخال الكود السري الخاص بمنشأتك.');
      return;
    }
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

  const requestReinspection = () => {
    setIsRequestingInspection(true);
    setTimeout(() => {
      // Create a new task/directive for the Field Team of this sector
      const newTask = {
        id: Date.now(),
        title: 'طلب إعادة كشف صحي (مستعجل)',
        description: `المنشأة (${ownerEst.name}) تطلب إجراء كشف جديد بعد إتمام التصحيحات المطلوبة.`,
        targetEstId: ownerEst.id,
        sector: ownerEst.sector,
        status: 'pending', // pending, completed
        createdAt: new Date().toISOString()
      };
      
      if (setDirectives) {
        setDirectives(prev => [newTask, ...prev]);
      }
      
      if (addSystemNotification) {
        // Notify the specific field team responsible for this sector
        addSystemNotification(
          'مهمة ميدانية جديدة 📋',
          `المنشأة (${ownerEst.name}) في قاطعك تطلب إعادة كشف لتعديل التقييم.`,
          'team' // Could be specific team ID if mapped, for now 'team' means all teams will see it or filter it
        );
        // Also notify operations room
        addSystemNotification(
          'طلب إعادة كشف وارد 🔄',
          `صاحب المنشأة (${ownerEst.name}) يطلب إعادة كشف للتقييم.`,
          'admin'
        );
      }
      
      setIsRequestingInspection(false);
      setInspectionRequested(true);
    }, 1000);
  };

  // --- Login View ---
  if (!ownerEst) {
    return (
      <div className="min-h-screen bg-slatebg-light dark:bg-slatebg-dark flex items-center justify-center p-4 transition-colors duration-300 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-500/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="absolute top-4 left-4 z-50">
          <ThemeToggle />
        </div>
        <div className="absolute top-4 right-4 z-50">
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 transition-all shadow-sm cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> العودة للرئيسية
          </button>
        </div>

        <div className="w-full max-w-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/50 dark:border-slate-700/50 p-8 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] relative z-10">
          <AnimatedLogo variant="login" className="mb-8" />
          
          <div className="text-center mb-8">
            <h1 className="text-2xl font-black text-slate-800 dark:text-white mb-2 leading-tight tracking-tight">
              {ownerCMS?.heroTitle || 'بوابة أصحاب المنشآت'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold leading-relaxed">
              {ownerCMS?.heroSubtext || 'أدخل الكود السري (PIN) الخاص بمنشأتك للاطلاع على تقارير الرقابة الصحية والتقييمات الخاصة بك.'}
            </p>
          </div>
          
          {ownerCMS?.announcement && (
             <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-2xl text-center">
              <span className="text-xs font-black text-red-700 dark:text-red-400 flex items-center justify-center gap-2">
                <AlertTriangle className="w-4 h-4" /> {ownerCMS.announcement}
              </span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-2">الكود السري (Access Code)</label>
              <div className="relative group">
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <Lock className="w-5 h-5 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
                </div>
                <input
                  type="text"
                  required
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value.replace(/[–—]/g, '-').replace(/[^a-zA-Z0-9-]/g, '').toUpperCase())}
                  placeholder="مثال: M-782X"
                  className="w-full pl-4 pr-12 py-4 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border-2 border-slate-100 dark:border-slate-800 text-lg font-black text-slate-800 dark:text-white outline-none focus:border-teal-500/50 focus:ring-4 focus:ring-teal-500/10 text-center uppercase tracking-[0.3em] transition-all"
                  dir="ltr"
                />
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-xs font-bold text-red-600 dark:text-red-400 text-center flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="w-4 h-4" /> {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-slate-800 dark:bg-teal-600 hover:bg-slate-900 dark:hover:bg-teal-500 text-white font-black text-sm shadow-xl shadow-slate-900/20 dark:shadow-teal-900/20 hover:shadow-2xl transition-all flex items-center justify-center gap-2 cursor-pointer group active:scale-[0.98]"
            >
              تسجيل الدخول <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- Dashboard View (Bento Grid) ---
  const score = ownerEst.score;
  const isCompliant = score >= (config.passingScore || 90);
  const isMonitoring = score >= (config.warningScore || 70) && score < (config.passingScore || 90);
  const isNonCompliant = score < (config.warningScore || 70);
  
  const lastHistory = ownerEst.history && ownerEst.history.length > 0 ? ownerEst.history[0] : null;

  const historyData = ownerEst.history ? [...ownerEst.history].reverse().map(h => ({
    name: h.date.split(',')[0] || h.date,
    score: h.score
  })) : [];
  
  if (historyData.length === 0 || historyData[historyData.length - 1].score !== score) {
     historyData.push({ name: 'الحالي', score: score });
  }

  const handleDownloadCertificate = async (format) => {
    if (!certificateRef.current) return;
    if (format === 'pdf') {
      window.print();
      return;
    }
    try {
      setIsDownloading(true);
      await new Promise(resolve => setTimeout(resolve, 100));
      const canvas = await html2canvas(certificateRef.current, { scale: 3, useCORS: true, backgroundColor: '#ffffff' });
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `شهادة_شكر_${ownerEst.name.replace(/\s+/g, '_')}.png`;
      link.click();
    } catch (error) {
      alert("حدث خطأ أثناء التنزيل.");
    } finally {
      setIsDownloading(false);
    }
  };

  // Fake "To-Do" Items based on missing score points
  const generateTodos = () => {
    let todos = [];
    if (lastHistory?.ratings) {
      Object.entries(lastHistory.ratings).forEach(([id, val]) => {
        if (val < 5) {
          todos.push({
            id,
            text: `تصحيح الخلل في المعيار ${id}`,
            points: 5 - val,
            isDone: false
          });
        }
      });
    }
    if (todos.length === 0 && !isCompliant) {
        todos.push({ id: '1', text: 'تنظيف شامل وصيانة عامة حسب ملاحظات المفتش', points: 10, isDone: false });
    }
    return todos;
  };
  const todos = generateTodos();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] text-slate-800 dark:text-slate-200 pb-20 transition-colors duration-300">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-teal-500/10 to-transparent dark:from-teal-900/20"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800/50 px-4 md:px-8 py-4 no-print">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <AnimatedLogo variant="sidebar" className="scale-90 origin-right" />
            <div className="hidden sm:block h-8 w-px bg-slate-300 dark:bg-slate-700"></div>
            <div className="hidden sm:block">
              <h2 className="text-sm font-black text-slate-800 dark:text-white leading-tight">بوابة المالك الرسمية</h2>
              <p className="text-[10px] font-bold text-slate-500">نظام الرقابة الصحية الموحد</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => window.print()}
              className="hidden sm:flex px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-black transition-all items-center gap-2 cursor-pointer shadow-sm border border-slate-200 dark:border-slate-700"
            >
              <Download className="w-4 h-4" /> حفظ كـ PDF
            </button>
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors cursor-pointer"
              title="تسجيل الخروج"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content (Bento Grid) */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 pt-8 space-y-6">
        
        {/* Welcome Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
              مرحباً، <span className="text-teal-600 dark:text-teal-400">{ownerEst.name}</span>
            </h1>
            <p className="text-sm font-bold text-slate-500 flex items-center gap-2">
              <FileText className="w-4 h-4" /> رخصة رقم: <span className="text-slate-700 dark:text-slate-300 uppercase tracking-widest">{ownerEst.licenseNumber}</span>
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700/50 text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-2 shadow-sm">
            <Clock className="w-4 h-4 text-teal-500" /> آخر زيارة: <span className="text-slate-900 dark:text-white">{ownerEst.lastInspection}</span>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Main Score Card (Col-span 8) */}
          <div className="md:col-span-8 bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-sm border border-slate-200/50 dark:border-slate-800/50 relative overflow-hidden group">
            {/* Background Status Glow */}
            <div className={`absolute top-0 right-0 w-64 h-64 blur-[80px] rounded-full opacity-20 transition-colors duration-700 pointer-events-none ${
              isCompliant ? 'bg-emerald-500' : isMonitoring ? 'bg-amber-500' : 'bg-red-500'
            }`}></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
              {/* Score Circle */}
              <div className="shrink-0 relative">
                <svg className="w-40 h-40 transform -rotate-90">
                  <circle cx="80" cy="80" r="70" className="stroke-slate-100 dark:stroke-slate-800" strokeWidth="12" fill="none" />
                  <circle 
                    cx="80" cy="80" r="70" 
                    className={`transition-all duration-1000 ease-out ${
                      isCompliant ? 'stroke-emerald-500' : isMonitoring ? 'stroke-amber-500' : 'stroke-red-500'
                    }`} 
                    strokeWidth="12" 
                    fill="none" 
                    strokeDasharray="439.8" 
                    strokeDashoffset={439.8 - (439.8 * score) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black text-slate-800 dark:text-white">{score}%</span>
                </div>
              </div>

              {/* Status Details */}
              <div className="flex-1 text-center md:text-right">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl mb-4 text-sm font-black shadow-sm ${
                  isCompliant ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20' :
                  isMonitoring ? 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20' :
                  'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400 border border-red-200 dark:border-red-500/20'
                }`}>
                  {isCompliant && <><ShieldCheck className="w-5 h-5" /> مطابق للشروط ممتاز</>}
                  {isMonitoring && <><AlertTriangle className="w-5 h-5" /> إنذار وتعهد بالتحسين</>}
                  {isNonCompliant && <><AlertOctagon className="w-5 h-5" /> حالة حرجة - إجراءات إغلاق</>}
                </div>
                
                <h3 className="text-lg font-black text-slate-800 dark:text-white mb-2">التقييم الصحي العام للمنشأة</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-bold leading-relaxed mb-6">
                  {isCompliant ? 'تهانينا! منشأتك تعتبر من أفضل المنشآت الملتزمة صحياً في القطاع.' :
                   isMonitoring ? 'تقييمك جيد ولكن تحتاج إلى تحسين بعض الجوانب لتجنب الدخول في المنطقة الحمراء.' :
                   'يجب عليك اتخاذ إجراءات تصحيحية فورية لتجنب الإغلاق أو الغرامات العالية.'}
                </p>
                
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">المالك: {ownerEst.owner}</span>
                  <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">اللجنة: {ownerEst.inspectorName || ownerEst.sector}</span>
                </div>
              </div>
            </div>
          </div>

          {/* QR Code Card (Col-span 4) */}
          <div className="md:col-span-4 bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-sm border border-slate-200/50 dark:border-slate-800/50 flex flex-col items-center justify-center text-center group">
            <h3 className="text-sm font-black text-slate-800 dark:text-white mb-2">هوية المنشأة للزبائن</h3>
            <p className="text-[10px] text-slate-500 font-bold mb-6">امسح الكود لرؤية التقييم العام (نسخة الجمهور)</p>
            
            <div className="p-4 bg-white rounded-2xl shadow-inner border-2 border-slate-100 dark:border-slate-800 mb-6 group-hover:scale-105 transition-transform">
              <QRCodeSVG 
                value={`https://nineveh-health.gov.iq/est/${ownerEst.id}`} 
                size={120}
                bgColor="#ffffff"
                fgColor="#0f172a"
                level="H"
              />
            </div>
            
            <button className="w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-900/20 text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer border border-slate-200 dark:border-slate-700">
              <Printer className="w-4 h-4" /> طباعة الهوية لتعليقها
            </button>
          </div>

          {/* Action Plan (To-Do) (Col-span 6) */}
          <div className="md:col-span-6 bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-sm border border-slate-200/50 dark:border-slate-800/50 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-black text-slate-800 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-teal-500" /> خطة العمل التصحيحية
              </h3>
              {!isCompliant && (
                <span className="text-[10px] font-black px-2 py-1 bg-amber-100 text-amber-700 rounded-lg animate-pulse">مطلوب التدخل</span>
              )}
            </div>

            {todos.length > 0 ? (
              <div className="flex-1 space-y-3 mb-6">
                {todos.map(todo => (
                  <label key={todo.id} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group">
                    <input type="checkbox" className="mt-1 w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500" />
                    <div className="flex-1">
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">{todo.text}</p>
                      <p className="text-[10px] text-red-500 mt-1 font-bold">كلفتك {todo.points} نقاط من تقييمك</p>
                    </div>
                  </label>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-8 opacity-50">
                <ShieldCheck className="w-12 h-12 text-emerald-500 mb-2" />
                <p className="text-xs font-bold text-slate-500 text-center">لا توجد ملاحظات تصحيحية. استمر بهذا الأداء المتميز!</p>
              </div>
            )}

            {!isCompliant && (
              <button 
                onClick={requestReinspection}
                disabled={isRequestingInspection || inspectionRequested}
                className="w-full py-3.5 rounded-xl bg-slate-800 hover:bg-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-black text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRequestingInspection ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : inspectionRequested ? (
                  <><CheckCircle2 className="w-4 h-4 text-emerald-400" /> تم إرسال الطلب لغرفة العمليات</>
                ) : (
                  <><Send className="w-4 h-4" /> إشعار بإتمام التعديلات وطلب كشف جديد</>
                )}
              </button>
            )}
          </div>

          {/* Fines & Photo Evidence (Col-span 6) */}
          <div className="md:col-span-6 grid grid-rows-2 gap-6">
            
            {/* Warnings Vault */}
            <div className={`rounded-[2rem] p-6 shadow-sm border flex items-center gap-6 relative overflow-hidden ${
              isNonCompliant ? 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30' : 'bg-white dark:bg-slate-900 border-slate-200/50 dark:border-slate-800/50'
            }`}>
              {isNonCompliant && <div className="absolute left-0 top-0 w-2 h-full bg-red-500"></div>}
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                isNonCompliant ? 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
              }`}>
                <AlertOctagon className="w-7 h-7" />
              </div>
              <div>
                <h3 className={`text-sm font-black mb-1 ${isNonCompliant ? 'text-red-800 dark:text-red-300' : 'text-slate-800 dark:text-white'}`}>سجل الغرامات والإنذارات</h3>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  {isNonCompliant ? 'يوجد تحذير نهائي نشط! يجب عليك مراجعة أقرب مركز رقابة صحية خلال 72 ساعة لتجنب قرار الغلق والتشميع.' : 'سجلك نظيف من الغرامات والإنذارات في الوقت الحالي.'}
                </p>
              </div>
            </div>

            {/* Photo Evidence Placeholder */}
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 shadow-sm border border-slate-200/50 dark:border-slate-800/50 flex flex-col justify-center relative overflow-hidden">
              <h3 className="text-sm font-black text-slate-800 dark:text-white mb-2 flex items-center gap-2">
                <Camera className="w-4 h-4 text-teal-500" /> الإثباتات المرئية للمخالفات
              </h3>
              <div className="flex gap-2 mt-2">
                {!isCompliant ? (
                  <>
                    <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center border border-slate-200 dark:border-slate-700">
                      <ImageIcon className="w-6 h-6 text-slate-400" />
                    </div>
                    <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center border border-slate-200 dark:border-slate-700">
                      <ImageIcon className="w-6 h-6 text-slate-400" />
                    </div>
                    <div className="flex-1 flex flex-col justify-center px-2">
                       <p className="text-[10px] font-bold text-slate-500">تم إرفاق صورتين من قبل المفتش كدليل على المخالفات المرصودة أعلاه.</p>
                       <button className="text-[10px] font-black text-teal-600 mt-1 text-right hover:underline">عرض الصور بحجم كامل</button>
                    </div>
                  </>
                ) : (
                  <p className="text-xs font-bold text-slate-400 flex items-center gap-2">لا توجد صور مخالفات مرفقة.</p>
                )}
              </div>
            </div>

          </div>

          {/* History Chart (Col-span 12) */}
          <div className="md:col-span-12 bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-sm border border-slate-200/50 dark:border-slate-800/50 no-print">
            <h3 className="text-base font-black text-slate-800 dark:text-white mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-teal-600" /> مسار التقييمات التاريخي
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={historyData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.1} vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickMargin={10} axisLine={false} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} domain={[0, 100]} axisLine={false} tickLine={false} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '16px', color: '#fff', fontSize: '12px', fontWeight: 'bold', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)' }}
                    itemStyle={{ color: '#2dd4bf' }}
                    cursor={{ stroke: '#0d9488', strokeWidth: 1, strokeDasharray: '4 4' }}
                  />
                  <Area type="monotone" dataKey="score" name="التقييم (%)" stroke="#0d9488" strokeWidth={4} fillOpacity={1} fill="url(#colorScore)" activeDot={{ r: 8, strokeWidth: 0, fill: '#0f766e' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          
        </div>

        {/* Certificate (Only if compliant) */}
        {isCompliant && (
          <div className="mt-8 mb-8 flex flex-col items-center">
            <div 
              ref={certificateRef}
              className="relative w-full max-w-4xl bg-white p-12 rounded-[2rem] shadow-2xl overflow-hidden print-only-certificate"
              style={{
                border: '1px solid #e2e8f0',
                outline: '8px solid #0f766e',
                outlineOffset: '-16px',
                minHeight: '500px',
                backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%230f766e\' fill-opacity=\'0.03\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
              }}
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-teal-600/10 rounded-bl-[150px] -z-10"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/10 rounded-tr-[150px] -z-10"></div>
              
              <div className="text-center mb-10 mt-6 relative z-10">
                <div className="w-24 h-24 mx-auto mb-6 bg-white rounded-full flex items-center justify-center border-4 border-teal-100 shadow-[0_0_30px_rgba(15,118,110,0.2)]">
                  <Award className="w-12 h-12 text-teal-600" />
                </div>
                <h1 className="text-4xl font-black text-teal-800 mb-2 tracking-tight">شهادة شكر وتقدير</h1>
                <h2 className="text-xl font-bold text-slate-500 tracking-wide">للتميز في الالتزام بالشروط الصحية</h2>
              </div>
              
              <div className="text-center space-y-8 px-12 relative z-10">
                <p className="text-xl text-slate-600 font-bold leading-relaxed">
                  تتقدم مديرية صحة نينوى / قسم الرقابة الصحية بالشكر والتقدير إلى:
                </p>
                <div className="py-2 inline-block">
                  <h3 className="text-5xl font-black text-teal-700 drop-shadow-sm">{ownerEst.name}</h3>
                </div>
                <p className="text-xl text-slate-700 font-bold leading-relaxed max-w-3xl mx-auto">
                  وذلك لحصولهم على تقييم متميز بنسبة <strong className="text-amber-500 text-3xl mx-2 drop-shadow-sm">{score}%</strong> في الكشف الميداني الأخير 
                  والتزامهم العالي بتطبيق كافة المعايير والشروط الصحية مما يعكس حرصهم على سلامة وصحة المواطنين.
                </p>
              </div>

              <div className="mt-16 flex justify-between items-end px-12 pb-6 relative z-10">
                <div className="text-center w-1/3">
                  <p className="text-sm font-bold text-slate-400 mb-2 uppercase tracking-widest">تاريخ التقييم</p>
                  <p className="text-xl font-black text-slate-800 whitespace-nowrap">{ownerEst.lastInspection}</p>
                </div>
                <div className="text-center w-1/3">
                  <img 
                    src="/stamp-transparent.png" 
                    alt="ختم مطابقة المعايير" 
                    className="w-40 h-40 object-contain mx-auto mb-2 drop-shadow-xl"
                  />
                </div>
                <div className="text-center w-1/3">
                  <p className="text-sm font-bold text-slate-400 mb-2 uppercase tracking-widest">اللجنة المصدّقة</p>
                  <p className="text-lg font-black text-slate-800 leading-tight">{ownerEst.inspectorName || ownerEst.sector}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 max-w-4xl w-full no-print">
              <div className="bg-gradient-to-l from-amber-50 to-teal-50 dark:from-amber-500/5 dark:to-teal-500/5 border border-amber-200/50 dark:border-amber-900/30 rounded-[2rem] p-8 text-center shadow-sm">
                <h4 className="text-xl font-black text-slate-800 dark:text-white mb-3">مبارك لك هذا التميز! 🌟</h4>
                <p className="text-sm font-bold text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed">
                  نوصيك بتحميل هذه الشهادة ونشرها على صفحات المطعم، ليرى الزبائن التزامك الحقيقي الموثق من مديرية الصحة، مما يزيد ثقتهم بك.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    onClick={() => handleDownloadCertificate('image')}
                    disabled={isDownloading}
                    className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-black text-sm transition-all flex items-center justify-center gap-3 shadow-xl shadow-teal-900/20 hover:shadow-2xl disabled:opacity-50"
                  >
                    {isDownloading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <ImageIcon className="w-5 h-5" />}
                    تنزيل كصورة (Image)
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default OwnerPortal;
