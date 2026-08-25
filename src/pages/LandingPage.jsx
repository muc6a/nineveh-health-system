import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { AnimatedLogo } from '../components/AnimatedLogo';
import { ThemeToggle } from '../components/ThemeToggle';
import { Search, Building2, ShieldCheck, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

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
          <span className="font-black text-lg md:text-xl text-slate-800 dark:text-white tracking-tight">
            منظومة الرقابة الصحية
          </span>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-teal-500 hover:text-teal-600 dark:hover:border-teal-500 dark:hover:text-teal-400 font-black text-xs md:text-sm transition-all shadow-sm group"
          >
            <ShieldCheck className="w-5 h-5" />
            <span>الإدارة</span>
          </button>
        </div>
      </header>

      {/* Main Content (Center) */}
      <main className="flex-1 relative z-10 flex flex-col items-center justify-center p-6 text-center max-w-5xl mx-auto w-full">
        <div className="mb-12 animate-in fade-in zoom-in-95 duration-1000 delay-150 fill-mode-both w-full max-w-4xl mx-auto">
          {/* Official Logos */}
          <div className="flex items-center justify-center gap-6 md:gap-10 mb-8 bg-white/40 dark:bg-slate-900/40 p-4 md:p-6 rounded-3xl backdrop-blur-sm border border-white/50 dark:border-slate-800/50 shadow-sm mx-auto w-fit">
            <div className="group relative flex flex-col items-center">
              <img src="/logos/moh.png" alt="وزارة الصحة العراقية" className="h-14 md:h-20 w-auto object-contain drop-shadow-sm hover:scale-110 transition-transform cursor-help" />
              <span className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[10px] md:text-xs font-bold px-2 py-1 rounded whitespace-nowrap pointer-events-none z-10 shadow-lg">وزارة الصحة العراقية</span>
            </div>
            <div className="w-px h-10 md:h-16 bg-slate-200 dark:bg-slate-700/50"></div>
            
            <div className="group relative flex flex-col items-center">
              <img src="/logos/nineveh_gov.png" alt="محافظة نينوى" className="h-14 md:h-20 w-auto object-contain drop-shadow-sm hover:scale-110 transition-transform cursor-help" />
              <span className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[10px] md:text-xs font-bold px-2 py-1 rounded whitespace-nowrap pointer-events-none z-10 shadow-lg">محافظة نينوى</span>
            </div>
            <div className="w-px h-10 md:h-16 bg-slate-200 dark:bg-slate-700/50"></div>
            
            <div className="group relative flex flex-col items-center">
              <img src="/logos/nineveh_health.png" alt="دائرة صحة نينوى" className="h-14 md:h-20 w-auto object-contain drop-shadow-sm hover:scale-110 transition-transform cursor-help" />
              <span className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[10px] md:text-xs font-bold px-2 py-1 rounded whitespace-nowrap pointer-events-none z-10 shadow-lg">دائرة صحة نينوى</span>
            </div>
            <div className="w-px h-10 md:h-16 bg-slate-200 dark:bg-slate-700/50"></div>
            
            <div className="group relative flex flex-col items-center">
              <img src="/logos/public_health.png" alt="قسم الصحة العامة" className="h-14 md:h-20 w-auto object-contain drop-shadow-sm hover:scale-110 transition-transform cursor-help" />
              <span className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[10px] md:text-xs font-bold px-2 py-1 rounded whitespace-nowrap pointer-events-none z-10 shadow-lg">قسم الصحة العامة</span>
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 leading-tight tracking-tight drop-shadow-sm">
            مرحباً بكم في
            <span className="text-transparent bg-clip-text bg-gradient-to-l from-teal-600 to-emerald-500 block mt-3 md:mt-5 pb-2">منظومة الرقابة الصحية</span>
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
                دخول مخصص لأصحاب المنشآت لمتابعة التقييمات خطط العمل والشهادات الصحية الخاصة بهم.
              </p>
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-black text-sm">
                الدخول كصاحب منشأة <ArrowDownLeft className="w-4 h-4 group-hover:translate-y-1 group-hover:-translate-x-1 transition-transform" />
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
