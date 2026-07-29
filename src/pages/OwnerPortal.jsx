import React, { useState, useContext, useEffect, useRef } from 'react';
import { AppContext } from '../context/AppContext';
import { AnimatedLogo } from '../components/AnimatedLogo';
import { ThemeToggle } from '../components/ThemeToggle';
import { 
  ShieldCheck, AlertTriangle, AlertOctagon, Printer, LogOut, Lock, Clock, 
  Info, ArrowLeft, Download, Brain, TrendingUp, Award, Image as ImageIcon,
  CheckCircle2, XCircle, QrCode, Camera, FileText, ChevronRight, RefreshCw, Send,
  Settings, User, MapPin, Receipt, Activity, ShieldAlert, History
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { AreaChart, Area, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { QRCodeSVG } from 'qrcode.react';

export const OwnerPortal = () => {
  const { navigate, establishments, config, ownerCMS, addSystemNotification, directives, setDirectives, setShowDisplayPrefsModal } = useContext(AppContext);
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  const [ownerEst, setOwnerEst] = useState(null);
  const certificateRef = useRef(null);
  const qrPosterRef = useRef(null);
  
  const [isDownloading, setIsDownloading] = useState(false);
  const [isRequestingInspection, setIsRequestingInspection] = useState(false);
  const [inspectionRequested, setInspectionRequested] = useState(false);
  
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Action Plan State
  const [resolvedTasks, setResolvedTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  
  // Dashboard Chart State
  const [chartView, setChartView] = useState('total'); // 'total' | 'current'

  // Auto-login from localStorage
  useEffect(() => {
    const savedCode = localStorage.getItem('ownerAuthToken');
    if (savedCode && establishments.length > 0 && !ownerEst) {
      const est = establishments.find(e => e.accessCode === savedCode);
      if (est) {
        setOwnerEst(est);
        setAccessCode(savedCode);
      } else {
        localStorage.removeItem('ownerAuthToken');
      }
    }
  }, [establishments, ownerEst]);

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
      localStorage.setItem('ownerAuthToken', est.accessCode);
    } else {
      setError('الكود السري غير صحيح أو غير مسجل في النظام.');
    }
  };

  const handleLogout = () => {
    setOwnerEst(null);
    setAccessCode('');
    localStorage.removeItem('ownerAuthToken');
  };

  const requestReinspection = () => {
    setIsRequestingInspection(true);
    setTimeout(() => {
      const newTask = {
        id: Date.now(),
        title: 'طلب إعادة كشف صحي (مستعجل)',
        description: `المنشأة (${ownerEst.name}) تطلب إجراء كشف جديد بعد إتمام التصحيحات المطلوبة.`,
        targetEstId: ownerEst.id,
        sector: ownerEst.sector,
        status: 'pending', 
        createdAt: new Date().toISOString()
      };
      
      if (setDirectives) {
        setDirectives(prev => [newTask, ...prev]);
      }
      
      if (addSystemNotification) {
        addSystemNotification('مهمة ميدانية جديدة 📋', `المنشأة (${ownerEst.name}) تطلب إعادة كشف.`, 'team');
        addSystemNotification('طلب إعادة كشف وارد 🔄', `صاحب المنشأة (${ownerEst.name}) يطلب إعادة كشف.`, 'admin');
      }
      
      setIsRequestingInspection(false);
      setInspectionRequested(true);
    }, 1000);
  };

  // --- Login View ---
  if (!ownerEst) {
    return (
      <div className="min-h-screen bg-slatebg-light dark:bg-slatebg-dark flex items-center justify-center p-4 transition-colors duration-300 relative overflow-hidden">
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

        <div className="w-full max-w-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/50 dark:border-slate-700/50 p-8 rounded-[2rem] shadow-2xl relative z-10">
          <AnimatedLogo variant="login" className="mb-8" />
          
          <div className="text-center mb-8">
            <h1 className="text-2xl font-black text-slate-800 dark:text-white mb-2 leading-tight tracking-tight">
              {ownerCMS?.heroTitle || 'بوابة أصحاب المنشآت'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold leading-relaxed">
              {ownerCMS?.heroSubtext || 'أدخل الكود السري (PIN) الخاص بمنشأتك للاطلاع على تقارير الرقابة الصحية والتقييمات الخاصة بك.'}
            </p>
          </div>
          
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
              <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-xs font-bold text-red-600 dark:text-red-400 text-center">
                {error}
              </div>
            )}

            <button type="submit" className="w-full py-4 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-black text-sm shadow-xl shadow-teal-900/20 hover:shadow-2xl transition-all flex items-center justify-center gap-2">
              تسجيل الدخول <ArrowLeft className="w-4 h-4 rotate-180" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- Dashboard Data ---
  const score = ownerEst.score;
  const isCompliant = score >= (config.passingScore || 90);
  const isMonitoring = score >= (config.warningScore || 70) && score < (config.passingScore || 90);
  const isNonCompliant = score < (config.warningScore || 70);
  
  const lastHistory = ownerEst.history && ownerEst.history.length > 0 ? ownerEst.history[0] : null;

  // History Chart Data (Total)
  const historyData = ownerEst.history ? [...ownerEst.history].reverse().map(h => ({
    name: h.date, score: h.score
  })) : [];
  if (historyData.length === 0 || historyData[historyData.length - 1].score !== score) {
     historyData.push({ name: 'الحالي', score: score });
  }

  // Current Ratings Data (Detailed)
  const criteriaNames = {
    '1': 'النظافة العامة والمظهر',
    '2': 'حفظ المواد الغذائية',
    '3': 'نظافة المرافق',
    '4': 'بطاقات الفحص الطبي',
    '5': 'التهوية والإضاءة'
  };
  const currentRatingsData = ownerEst.history?.[0]?.ratings ? Object.entries(ownerEst.history[0].ratings).map(([id, val]) => ({
    name: criteriaNames[id] || `معيار ${id}`,
    score: val * 20, // Convert out of 5 to percentage out of 100
    rawScore: val
  })) : [];

  const handleDownloadImage = async (ref, filename) => {
    if (!ref.current) return;
    try {
      setIsDownloading(true);
      await new Promise(resolve => setTimeout(resolve, 100));
      const canvas = await html2canvas(ref.current, { scale: 3, useCORS: true, backgroundColor: '#ffffff' });
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = filename;
      link.click();
    } catch (error) {
      alert("حدث خطأ أثناء التنزيل.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrintCertificate = () => {
    document.body.classList.add('print-certificate-only');
    window.print();
    setTimeout(() => document.body.classList.remove('print-certificate-only'), 1000);
  };

  const handlePrintQR = () => {
    document.body.classList.add('print-qr-only');
    window.print();
    setTimeout(() => document.body.classList.remove('print-qr-only'), 1000);
  };

  const getTaskDetails = (id) => {
    const details = {
      '1': { criteria: 'النظافة الشخصية والمظهر العام للموظفين', reason: 'عدم ارتداء العاملين للملابس الصحية المناسبة (كفوف، قبعات رأس).', solution: 'تجهيز جميع العاملين بالملابس الموحدة وإلزامهم بارتدائها أثناء العمل بشكل دائم.' },
      '2': { criteria: 'طريقة حفظ وتخزين المواد الغذائية', reason: 'رصد مواد منتهية الصلاحية أو غير مخزنة بشكل سليم.', solution: 'إتلاف المواد التالفة فوراً وإعادة ترتيب المخزن حسب درجات الحرارة المطلوبة.' },
      '3': { criteria: 'نظافة المنشأة والمرافق الصحية', reason: 'تدني مستوى النظافة العامة للأرضيات والجدران.', solution: 'إجراء حملة تنظيف شاملة باستخدام المعقمات القياسية.' },
      '4': { criteria: 'بطاقات الفحص الطبي للعمال', reason: 'عدم وجود بطاقات فحص طبي سارية المفعول للعمال.', solution: 'توجيه العمال لمراجعة المركز الصحي لتجديد بطاقات الفحص الطبي.' },
      '5': { criteria: 'التهوية والإضاءة وتصريف المياه', reason: 'سوء التهوية وتراكم الأدخنة في المطبخ.', solution: 'صيانة ساحبات الهواء أو تركيب نظام تهوية جديد لتجديد الهواء.' }
    };
    return details[id] || { criteria: `معيار رقابي رقم ${id}`, reason: 'تم رصد تقصير واضح في هذا المعيار أثناء الزيارة الميدانية الأخيرة.', solution: 'يرجى مراجعة الضوابط الصحية وتصحيح الخلل فوراً لضمان سلامة الغذاء.' };
  };

  const generateTodos = () => {
    let todos = [];
    if (lastHistory?.ratings) {
      Object.entries(lastHistory.ratings).forEach(([id, val]) => {
        if (val < 5) {
          todos.push({ 
            id, 
            text: `تصحيح الخلل في المعيار ${id}`, 
            points: 5 - val,
            ...getTaskDetails(id)
          });
        }
      });
    }
    if (todos.length === 0 && !isCompliant) {
        todos.push({ 
          id: 'general', 
          text: 'تنظيف شامل وصيانة عامة حسب ملاحظات المفتش', 
          points: 10,
          reason: 'وجود ملاحظات عامة حول بيئة العمل لم ترتقِ للمستوى المطلوب.',
          solution: 'القيام بحملة صيانة وتنظيف شاملة لكل مرافق المنشأة.'
        });
    }
    return todos;
  };
  const todos = generateTodos();

  const tabs = [
    { id: 'dashboard', label: 'الرئيسية', icon: Activity },
    { id: 'info', label: 'المعلومات الشخصية', icon: User },
    { id: 'tasks', label: 'خطة العمل', icon: CheckCircle2 },
    { id: 'fines', label: 'سجل الغرامات', icon: Receipt },
    { id: 'evidence', label: 'الإثباتات المرئية', icon: Camera },
    { id: 'certificates', label: 'شهادات الشكر', icon: Award },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] text-slate-800 dark:text-slate-200 transition-colors duration-300 flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-l border-slate-200 dark:border-slate-800/50 flex flex-col no-print shrink-0 md:sticky md:top-0 md:h-screen z-40">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
           <AnimatedLogo variant="sidebar" className="scale-90 origin-right mb-4" />
           <h2 className="text-sm font-black text-slate-800 dark:text-white">بوابة أصحاب المنشآت</h2>
           <p className="text-[10px] font-bold text-slate-500 truncate">{ownerEst.name}</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                  isActive 
                  ? 'bg-teal-500/10 text-teal-700 dark:text-teal-400 border border-teal-500/20 shadow-sm' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                }`}
              >
                <Icon className="w-4 h-4" /> {tab.label}
              </button>
            )
          })}
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
           <button 
             onClick={() => window.print()}
             className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 text-xs font-bold transition-all border border-slate-200 dark:border-slate-700"
           >
             <Printer className="w-4 h-4" /> طباعة الصفحة الحالية
           </button>
           <button 
             onClick={handleLogout}
             className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 hover:bg-red-100 text-xs font-bold transition-all"
           >
             <LogOut className="w-4 h-4" /> تسجيل الخروج
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative max-w-full overflow-hidden">
        {/* Top Header Actions */}
        <div className="absolute top-4 left-4 z-50 flex items-center gap-2 no-print">
          <ThemeToggle />
          <button 
            onClick={() => setShowDisplayPrefsModal && setShowDisplayPrefsModal(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-colors shadow-sm"
            title="تخصيص العرض"
          >
            <Settings className="w-4 h-4" />
            <span className="text-xs font-bold hidden sm:block">تخصيص العرض</span>
          </button>
        </div>

        <div className="h-full overflow-y-auto p-4 md:p-8 pb-32">
          
          <div className="max-w-5xl mx-auto">
            {/* Page Title */}
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-8 tracking-tight flex items-center gap-3">
              {tabs.find(t => t.id === activeTab)?.icon && React.createElement(tabs.find(t => t.id === activeTab).icon, { className: "w-8 h-8 text-teal-600" })}
              {tabs.find(t => t.id === activeTab)?.label}
            </h1>

            {/* TAB: DASHBOARD */}
            {activeTab === 'dashboard' && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-4">
                
                {/* Main Score Card (Col-span 8) */}
                <div className="md:col-span-8 bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-sm border border-slate-200/50 dark:border-slate-800/50 relative overflow-hidden group">
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
                          strokeWidth="12" fill="none" strokeDasharray="439.8" strokeDashoffset={439.8 - (439.8 * score) / 100} strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-black text-slate-800 dark:text-white">{score}%</span>
                      </div>
                    </div>

                    <div className="flex-1 text-center md:text-right">
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl mb-4 text-sm font-black shadow-sm ${
                        isCompliant ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200' :
                        isMonitoring ? 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200' :
                        'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400 border border-red-200'
                      }`}>
                        {isCompliant && <><ShieldCheck className="w-5 h-5" /> مطابق للشروط ممتاز</>}
                        {isMonitoring && <><AlertTriangle className="w-5 h-5" /> إنذار وتعهد بالتحسين</>}
                        {isNonCompliant && <><AlertOctagon className="w-5 h-5" /> حالة حرجة - إجراءات إغلاق</>}
                      </div>
                      
                      <h3 className="text-lg font-black text-slate-800 dark:text-white mb-2">التقييم الصحي العام للمنشأة</h3>
                      <p className="text-xs font-bold text-slate-400 dark:text-slate-500 mb-4 bg-slate-50 dark:bg-slate-800/50 inline-block px-3 py-1 rounded-lg">
                        مبني على نتيجة آخر كشف ميداني بتاريخ: {ownerEst.lastInspection}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-bold leading-relaxed">
                        {isCompliant ? 'تهانينا! منشأتك تعتبر من أفضل المنشآت الملتزمة صحياً في القطاع.' :
                         isMonitoring ? 'تقييمك جيد ولكن تحتاج إلى تحسين بعض الجوانب لتجنب الدخول في المنطقة الحمراء.' :
                         'يجب عليك اتخاذ إجراءات تصحيحية فورية لتجنب الإغلاق أو الغرامات العالية.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* QR Code Quick Card (Col-span 4) */}
                <div className="md:col-span-4 bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-sm border border-slate-200/50 dark:border-slate-800/50 flex flex-col items-center justify-center text-center">
                  <h3 className="text-sm font-black text-slate-800 dark:text-white mb-2">هوية المنشأة للزبائن</h3>
                  <p className="text-[10px] text-slate-500 font-bold mb-6">واجهة الجمهور (QR Code)</p>
                  
                  <div className="p-3 bg-white rounded-2xl shadow-inner border-2 border-slate-100 dark:border-slate-800 mb-6">
                    <QRCodeSVG value={`https://nineveh-health.gov.iq/est/${ownerEst.id}`} size={100} bgColor="#ffffff" fgColor="#0f172a" />
                  </div>
                  
                  <div className="flex flex-col w-full gap-2">
                    <button onClick={() => handleDownloadImage(qrPosterRef, `QR_Poster_${ownerEst.name}.png`)} className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-black text-xs transition-all flex items-center justify-center gap-2">
                      <ImageIcon className="w-4 h-4" /> تنزيل الصورة
                    </button>
                    <button onClick={handlePrintQR} className="w-full py-2 rounded-xl bg-teal-50 dark:bg-teal-500/10 hover:bg-teal-100 text-teal-700 dark:text-teal-400 font-black text-xs transition-all flex items-center justify-center gap-2">
                      <Download className="w-4 h-4" /> تحميل ملصق (PDF)
                    </button>
                  </div>
                </div>

                {/* History Chart (Col-span 12) */}
                <div className="md:col-span-12 bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-sm border border-slate-200/50 dark:border-slate-800/50">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                    <h3 className="text-base font-black text-slate-800 dark:text-white flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-teal-600" /> مسار التقييمات
                    </h3>
                    <div className="flex bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
                      <button 
                        onClick={() => setChartView('total')}
                        className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${chartView === 'total' ? 'bg-white dark:bg-slate-700 shadow-sm text-teal-600 dark:text-teal-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                      >
                        الكلي (تاريخي)
                      </button>
                      <button 
                        onClick={() => setChartView('current')}
                        className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${chartView === 'current' ? 'bg-white dark:bg-slate-700 shadow-sm text-teal-600 dark:text-teal-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                      >
                        الحالي (تفصيلي)
                      </button>
                    </div>
                  </div>
                  
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      {chartView === 'total' ? (
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
                          <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '16px', color: '#fff', fontSize: '12px', fontWeight: 'bold' }} itemStyle={{ color: '#2dd4bf' }} cursor={{ stroke: '#0d9488', strokeWidth: 1, strokeDasharray: '4 4' }} />
                          <Area type="monotone" dataKey="score" name="التقييم (%)" stroke="#0d9488" strokeWidth={4} fillOpacity={1} fill="url(#colorScore)" activeDot={{ r: 8, strokeWidth: 0, fill: '#0f766e' }} />
                        </AreaChart>
                      ) : (
                        <BarChart data={currentRatingsData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }} barSize={30}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.1} vertical={false} />
                          <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} tickMargin={10} axisLine={false} tickLine={false} interval={0} />
                          <YAxis stroke="#94a3b8" fontSize={10} domain={[0, 100]} axisLine={false} tickLine={false} />
                          <RechartsTooltip 
                            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '16px', color: '#fff', fontSize: '12px', fontWeight: 'bold' }} 
                            itemStyle={{ color: '#2dd4bf' }} 
                            cursor={{ fill: '#334155', opacity: 0.1 }}
                            formatter={(value, name, props) => [`${props.payload.rawScore} / 5 (${value}%)`, 'الدرجة']}
                          />
                          <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                            {currentRatingsData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.score === 100 ? '#10b981' : entry.score >= 60 ? '#f59e0b' : '#ef4444'} />
                            ))}
                          </Bar>
                        </BarChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: INFO */}
            {activeTab === 'info' && (
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-sm border border-slate-200/50 dark:border-slate-800/50 animate-in fade-in slide-in-from-bottom-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-6">
                     <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                       <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">الاسم الرسمي</span>
                       <p className="text-lg font-black text-slate-900 dark:text-white">{ownerEst.name}</p>
                     </div>
                     <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                       <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">المالك المسؤول</span>
                       <p className="text-base font-black text-slate-900 dark:text-white">{ownerEst.owner}</p>
                     </div>
                     <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                       <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">رقم الإجازة الصحية</span>
                       <p className="text-base font-black text-slate-900 dark:text-white uppercase tracking-widest">{ownerEst.licenseNumber}</p>
                     </div>
                   </div>
                   <div className="space-y-6">
                     <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                       <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">التصنيف (الصنف)</span>
                       <p className="text-base font-black text-slate-900 dark:text-white">{ownerEst.type}</p>
                     </div>
                     <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                       <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">القاطع (القطاع)</span>
                       <p className="text-base font-black text-slate-900 dark:text-white">{ownerEst.sector}</p>
                     </div>
                     <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                       <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">لجنة التفتيش (آخر زيارة)</span>
                       <p className="text-base font-black text-slate-900 dark:text-white">{ownerEst.inspectorName || 'غير مسجل'}</p>
                     </div>
                   </div>
                </div>
              </div>
            )}

            {/* TAB: TASKS (Action Plan) */}
            {activeTab === 'tasks' && (
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-sm border border-slate-200/50 dark:border-slate-800/50 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex items-center justify-between mb-8">
                  <p className="text-sm font-bold text-slate-500">قم بمعالجة هذه المخالفات لإستعادة تقييمك المثالي.</p>
                  {!isCompliant && (
                    <span className="text-[10px] font-black px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg animate-pulse">
                      {todos.length - resolvedTasks.length} مهام متبقية
                    </span>
                  )}
                </div>

                {todos.length > 0 ? (
                  <div className="space-y-4 mb-8">
                    {todos.map(todo => {
                      const isResolved = resolvedTasks.includes(todo.id);
                      return (
                        <div 
                          key={todo.id} 
                          onClick={() => !isResolved && setSelectedTask(todo)}
                          className={`flex items-start gap-4 p-4 rounded-2xl border transition-all ${
                            isResolved 
                            ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-800 opacity-60' 
                            : 'bg-slate-50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-700/50 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 shadow-sm'
                          } group`}
                        >
                          <div className={`mt-1 w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 ${
                            isResolved 
                            ? 'bg-emerald-500 border-emerald-500 text-white' 
                            : 'border-slate-300 text-transparent group-hover:border-teal-500'
                          }`}>
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                          
                          <div className="flex-1">
                            <p className={`text-sm font-bold ${isResolved ? 'text-emerald-700 dark:text-emerald-400 line-through' : 'text-slate-800 dark:text-slate-200 group-hover:text-teal-700 dark:group-hover:text-teal-400'}`}>
                              {todo.text}
                            </p>
                            {!isResolved && (
                              <div className="flex items-center gap-3 mt-2">
                                <span className="text-[10px] text-red-500 font-bold px-2 py-0.5 bg-red-50 dark:bg-red-500/10 rounded-md">
                                  خصم {todo.points} نقاط
                                </span>
                                <span className="text-[10px] text-teal-600 font-bold">اضغط لمعرفة التفاصيل والحل &larr;</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 opacity-70">
                    <ShieldCheck className="w-16 h-16 text-emerald-500 mb-4" />
                    <p className="text-lg font-black text-slate-700 dark:text-slate-300">لا توجد ملاحظات تصحيحية.</p>
                    <p className="text-sm font-bold text-slate-500 mt-2">استمر بهذا الأداء المتميز في النظافة والالتزام!</p>
                  </div>
                )}

                {!isCompliant && (
                  <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 mt-8 text-center">
                    <h4 className="text-sm font-black text-slate-800 dark:text-white mb-2">أتممت الإصلاحات؟</h4>
                    <p className="text-xs font-bold text-slate-500 mb-6">يجب تحديد جميع المهام كـ "تم الحل" لتتمكن من طلب الكشف.</p>
                    <button 
                      onClick={requestReinspection}
                      disabled={isRequestingInspection || inspectionRequested || resolvedTasks.length !== todos.length}
                      className="w-full md:w-auto px-8 py-4 rounded-xl bg-slate-900 hover:bg-black dark:bg-teal-600 dark:hover:bg-teal-500 text-white font-black text-sm transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed mx-auto shadow-xl"
                    >
                      {isRequestingInspection ? (
                        <RefreshCw className="w-5 h-5 animate-spin" />
                      ) : inspectionRequested ? (
                        <><CheckCircle2 className="w-5 h-5 text-emerald-400" /> تم إرسال الطلب لغرفة العمليات</>
                      ) : resolvedTasks.length !== todos.length ? (
                        <><ShieldAlert className="w-5 h-5" /> يرجى إتمام جميع المهام أولاً</>
                      ) : (
                        <><Send className="w-5 h-5" /> إشعار بإتمام التعديلات وطلب كشف جديد</>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB: FINES */}
            {activeTab === 'fines' && (
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-sm border border-slate-200/50 dark:border-slate-800/50 animate-in fade-in slide-in-from-bottom-4">
                {isNonCompliant ? (
                  <div className="p-6 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 flex items-start gap-4 mb-8">
                    <AlertOctagon className="w-8 h-8 text-red-600 dark:text-red-400 shrink-0 mt-1" />
                    <div>
                      <h3 className="text-base font-black text-red-800 dark:text-red-300 mb-2">تحذير أخير للإغلاق</h3>
                      <p className="text-xs font-bold text-red-600 dark:text-red-400 leading-relaxed">
                        نظراً لتدني مستوى النظافة والتقييم في الكشف الأخير، تم إصدار تحذير نهائي بمنحك مهلة 72 ساعة فقط لتصحيح وضع المنشأة وإلا سيتم تنفيذ قرار الغلق والتشميع بالشمع الأحمر حسب قانون الصحة العامة.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 opacity-70">
                    <History className="w-16 h-16 text-slate-300 dark:text-slate-600 mb-4" />
                    <p className="text-lg font-black text-slate-700 dark:text-slate-300">سجلك نظيف</p>
                    <p className="text-sm font-bold text-slate-500 mt-2">لا توجد غرامات مالية أو إنذارات مسجلة بحق منشأتك.</p>
                  </div>
                )}
              </div>
            )}

            {/* TAB: EVIDENCE */}
            {activeTab === 'evidence' && (
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-sm border border-slate-200/50 dark:border-slate-800/50 animate-in fade-in slide-in-from-bottom-4">
                <p className="text-sm font-bold text-slate-500 mb-8">هذه الصور تم التقاطها من قبل فرق التفتيش كأدلة قانونية للمخالفات المرصودة.</p>
                
                {!isCompliant ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="aspect-square bg-slate-100 dark:bg-slate-800 rounded-2xl flex flex-col items-center justify-center border border-slate-200 dark:border-slate-700/50 group cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors relative overflow-hidden">
                        <ImageIcon className="w-8 h-8 text-slate-400 mb-2" />
                        <span className="text-[10px] font-bold text-slate-500">صورة مخالفة {item}</span>
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-white text-xs font-black">تكبير</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 opacity-70">
                    <Camera className="w-16 h-16 text-slate-300 dark:text-slate-600 mb-4" />
                    <p className="text-lg font-black text-slate-700 dark:text-slate-300">لا توجد أدلة مرئية للمخالفات</p>
                  </div>
                )}
              </div>
            )}

            {/* TAB: CERTIFICATES */}
            {activeTab === 'certificates' && (
              <div className="animate-in fade-in slide-in-from-bottom-4">
                {isCompliant ? (
                  <div className="flex flex-col items-center">
                    <div className="bg-teal-50 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-900/30 rounded-[2rem] p-8 text-center shadow-sm w-full max-w-4xl mb-8">
                      <Award className="w-12 h-12 text-teal-600 mx-auto mb-4" />
                      <h4 className="text-xl font-black text-teal-800 dark:text-teal-400 mb-3">مبارك لك هذا التميز! 🌟</h4>
                      <p className="text-sm font-bold text-teal-700 dark:text-teal-500 mb-8 max-w-2xl mx-auto leading-relaxed">
                        نوصيك بتحميل هذه الشهادة وطباعتها وتعليقها على جدار المنشأة، ليرى الزبائن التزامك الحقيقي الموثق من مديرية الصحة!
                      </p>
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button onClick={() => handleDownloadImage(certificateRef, `شهادة_${ownerEst.name}.png`)} disabled={isDownloading} className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-black text-sm transition-all flex items-center justify-center gap-3 shadow-xl shadow-teal-900/20 disabled:opacity-50">
                          {isDownloading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <ImageIcon className="w-5 h-5" />} تنزيل كصورة (Image)
                        </button>
                        <button onClick={handlePrintCertificate} className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-teal-500 hover:text-teal-600 font-black text-sm transition-all flex items-center justify-center gap-3 shadow-sm">
                          <Printer className="w-5 h-5" /> حفظ / طباعة كـ PDF
                        </button>
                      </div>
                    </div>

                    {/* The Certificate UI (Hidden from regular layout but shown here and in print) */}
                    <div ref={certificateRef} className="relative w-full max-w-4xl bg-white p-12 rounded-[2rem] shadow-2xl overflow-hidden print-only-certificate" style={{ border: '1px solid #e2e8f0', outline: '8px solid #0f766e', outlineOffset: '-16px', minHeight: '500px', backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%230f766e\' fill-opacity=\'0.03\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")' }}>
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
                        <p className="text-xl text-slate-600 font-bold leading-relaxed">تتقدم مديرية صحة نينوى / قسم الرقابة الصحية بالشكر والتقدير إلى:</p>
                        <div className="py-2 inline-block"><h3 className="text-5xl font-black text-teal-700 drop-shadow-sm">{ownerEst.name}</h3></div>
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
                          <img src="/stamp-transparent.png" alt="ختم مطابقة المعايير" className="w-40 h-40 object-contain mx-auto mb-2 drop-shadow-xl" />
                        </div>
                        <div className="text-center w-1/3">
                          <p className="text-sm font-bold text-slate-400 mb-2 uppercase tracking-widest">اللجنة المصدّقة</p>
                          <p className="text-lg font-black text-slate-800 leading-tight">{ownerEst.inspectorName || ownerEst.sector}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-sm border border-slate-200/50 dark:border-slate-800/50 flex flex-col items-center justify-center py-16 opacity-70">
                    <Award className="w-16 h-16 text-slate-300 dark:text-slate-600 mb-4" />
                    <p className="text-lg font-black text-slate-700 dark:text-slate-300">لا توجد شهادات شكر وتقدير</p>
                    <p className="text-sm font-bold text-slate-500 mt-2">عليك رفع التقييم الصحي للحصول على الشهادة.</p>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>

        {/* Hidden QR Poster for PDF Export */}
        <div className="fixed -left-[9999px] top-0 print:block print:static print:left-auto">
           <div ref={qrPosterRef} className="print-only-qr relative w-[800px] h-[1130px] bg-white text-slate-900 flex flex-col items-center p-16 font-sans">
             <div className="absolute inset-0 border-[20px] border-teal-600 m-8 rounded-3xl pointer-events-none"></div>
             
             <div className="flex items-center gap-6 mb-16 mt-8">
                <AnimatedLogo variant="sidebar" className="scale-150 origin-center" />
             </div>
             
             <h1 className="text-5xl font-black text-teal-800 mb-4 text-center">النظام الرقمي للرقابة الصحية</h1>
             <h2 className="text-2xl font-bold text-slate-500 mb-16 text-center">دائرة صحة نينوى</h2>
             
             <div className="bg-teal-50 w-full rounded-[3rem] p-12 flex flex-col items-center shadow-inner border border-teal-100">
               <h3 className="text-4xl font-black text-slate-800 mb-4 text-center">{ownerEst.name}</h3>
               <p className="text-xl font-bold text-slate-500 mb-12">صنف المنشأة: {ownerEst.type}</p>
               
               <div className="bg-white p-8 rounded-3xl shadow-2xl mb-12 border-4 border-teal-600">
                 <QRCodeSVG value={`https://nineveh-health.gov.iq/est/${ownerEst.id}`} size={350} bgColor="#ffffff" fgColor="#0f172a" />
               </div>
               
               <div className="flex items-center gap-4 text-teal-700">
                 <QrCode className="w-10 h-10" />
                 <p className="text-3xl font-black">امسح الرمز للاطلاع على مستوى النظافة والتقييم!</p>
               </div>
             </div>
             
             <div className="mt-auto flex flex-col items-center">
               <p className="text-lg font-bold text-slate-400 mb-2">هذه المنشأة خاضعة للرقابة الصحية المستمرة</p>
               <img src="/stamp-transparent.png" alt="ختم دائرة الصحة" className="w-48 h-48 opacity-80 mix-blend-multiply" />
             </div>
           </div>
        </div>

        {/* Task Details Modal */}
        {selectedTask && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] w-full max-w-lg shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col scale-100 animate-in zoom-in-95 duration-200">
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                <h3 className="font-black text-lg text-slate-800 dark:text-white">تفاصيل المخالفة والإجراء المطلوب</h3>
                <button onClick={() => setSelectedTask(null)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-500">
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <h4 className="text-[10px] font-black text-slate-500 mb-1 uppercase tracking-widest flex items-center gap-2">
                     اسم التقييم (المعيار الرقابي)
                  </h4>
                  <p className="text-sm font-black text-slate-800 dark:text-white bg-slate-100 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                    {selectedTask.criteria || selectedTask.text}
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-black text-red-600 dark:text-red-400 mb-2 uppercase tracking-widest flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4" /> سبب المخالفة (الخلل)
                  </h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300 font-bold leading-relaxed bg-red-50 dark:bg-red-500/10 p-4 rounded-xl border border-red-100 dark:border-red-900/30">
                    {selectedTask.reason}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-xs font-black text-emerald-600 dark:text-emerald-400 mb-2 uppercase tracking-widest flex items-center gap-2">
                    <Brain className="w-4 h-4" /> الحل المقترح (الإجراء التصحيحي)
                  </h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300 font-bold leading-relaxed bg-emerald-50 dark:bg-emerald-500/10 p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                    {selectedTask.solution}
                  </p>
                </div>
              </div>

              <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex gap-4">
                <button 
                  onClick={() => {
                    setResolvedTasks(prev => [...prev, selectedTask.id]);
                    setSelectedTask(null);
                  }}
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-xl font-black text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-teal-600/20"
                >
                  <CheckCircle2 className="w-5 h-5" /> أنا متأكد، تم حل المشكلة
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default OwnerPortal;
