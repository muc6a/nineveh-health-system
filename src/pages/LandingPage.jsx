import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { AnimatedLogo } from '../components/AnimatedLogo';
import { ThemeToggle } from '../components/ThemeToggle';
import { Search, Building2, ShieldCheck, ArrowLeft, ArrowUpRight } from 'lucide-react';

export const LandingPage = () => {
  const { navigate } = useContext(AppContext);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] text-slate-800 dark:text-slate-200 transition-colors duration-300 relative overflow-hidden flex flex-col">
      {/* Background Decorative Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-teal-500/20 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-amber-500/10 rounded-full blur-[150px] pointer-events-none"></div>

      {/* Top Header */}
      <header className="relative z-50 p-6 max-w-7xl mx-auto w-full flex items-center justify-between animate-in fade-in slide-in-from-top-8 duration-700">
        <div className="flex items-center gap-4">
          <AnimatedLogo variant="login" className="scale-75 origin-right" />
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-teal-500 hover:text-teal-600 dark:hover:border-teal-500 dark:hover:text-teal-400 font-black text-xs md:text-sm transition-all shadow-sm group"
          >
            <ShieldCheck className="w-5 h-5" />
            <span>الإدارة والموظفين</span>
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </button>
        </div>
      </header>

      {/* Main Content (Center) */}
      <main className="flex-1 relative z-10 flex flex-col items-center justify-center p-6 text-center max-w-5xl mx-auto w-full">
        <div className="mb-12 animate-in fade-in zoom-in-95 duration-1000 delay-150 fill-mode-both">
          <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 rounded-full bg-teal-50 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/20 text-teal-700 dark:text-teal-400 font-bold text-xs">
            <span className="w-2 h-2 rounded-full bg-teal-500 mr-2 animate-pulse"></span>
            النسخة الرقمية المحدثة 2026
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 leading-tight tracking-tight drop-shadow-sm">
            مرحباً بكم في <span className="text-transparent bg-clip-text bg-gradient-to-l from-teal-600 to-emerald-500">منظومة الرقابة الصحية</span>
          </h1>
          <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 font-bold max-w-2xl mx-auto leading-relaxed">
            نافذتكم الموثوقة لضمان بيئة صحية آمنة. اختر البوابة المناسبة لك للوصول إلى الخدمات الرقمية بكل سهولة وسرعة.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          {/* Citizens Portal */}
          <button
            onClick={() => navigate('/public-search')}
            className="group relative text-right p-8 rounded-[2.5rem] bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(13,148,136,0.15)] transition-all duration-500 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl group-hover:bg-teal-500/20 transition-colors"></div>
            <div className="relative z-10 flex flex-col h-full">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-900/30 dark:to-emerald-900/30 border border-teal-100 dark:border-teal-800/50 flex items-center justify-center mb-6 text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform duration-500 shadow-sm">
                <Search className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-3 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                بوابة المواطنين
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-bold leading-relaxed mb-8 flex-1">
                للبحث عن المنشآت، الاطلاع على تقييماتها الصحية، وتقديم الشكاوى والبلاغات إلكترونياً.
              </p>
              <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-black text-sm">
                الدخول للبحث والإبلاغ <ArrowUpRight className="w-4 h-4 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </button>

          {/* Owners Portal */}
          <button
            onClick={() => navigate('/owner')}
            className="group relative text-right p-8 rounded-[2.5rem] bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(245,158,11,0.15)] transition-all duration-500 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500 fill-mode-both"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-colors"></div>
            <div className="relative z-10 flex flex-col h-full">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 border border-amber-100 dark:border-amber-800/50 flex items-center justify-center mb-6 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform duration-500 shadow-sm">
                <Building2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-3 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                بوابة أصحاب المنشآت
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-bold leading-relaxed mb-8 flex-1">
                دخول مخصص لأصحاب المطاعم والمعامل لمتابعة التقييمات، خطط العمل، والشهادات الصحية الخاصة بهم.
              </p>
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-black text-sm">
                الدخول كصاحب منشأة <ArrowUpRight className="w-4 h-4 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </button>
        </div>
      </main>
      
      {/* Footer minimal */}
      <footer className="relative z-10 text-center p-6 text-xs font-bold text-slate-400">
        &copy; {new Date().getFullYear()} مديرية صحة نينوى - قسم الرقابة الصحية
      </footer>
    </div>
  );
};
