import React, { useContext, useState, useEffect } from 'react';
import { WeatherWidget } from './WeatherWidget';
import { NotificationBell } from './NotificationBell';
import { AppContext } from '../context/AppContext';

export const GlobalHeader = ({ title: overrideTitle, subtitle: overrideSubtitle, icon, showPrintButton = false, children }) => {
  const { hasPerm, user } = useContext(AppContext);

  const getDynamicGreeting = () => {
    if (!user) return { title: overrideTitle, subtitle: overrideSubtitle };

    const hour = new Date().getHours();
    let timeGreeting = 'أهلاً بك';
    

    if (hour >= 5 && hour < 12) {
      timeGreeting = 'صباح الخير';
      
    } else if (hour >= 12 && hour < 18) {
      timeGreeting = 'مساء الخير';
      
    } else {
      timeGreeting = 'مساء الخير';
      
    }

    let roleTitle = 'زميلنا العزيز';
    let dashboardName = 'لوحة التحكم الرئيسية لـ ';
    const sector = user.sector || 'عموم محافظة نينوى';

    switch (user.role) {
      case 'accountant':
        roleTitle = 'سيدي المحاسب';
        dashboardName = 'الإدارة المالية لـ ' + sector;
        break;
      case 'lab':
        roleTitle = 'دكتور المختبر';
        dashboardName = 'لوحة المختبر المركزي - ' + sector;
        break;
      case 'team_leader':
        roleTitle = 'قائد الفريق الميداني';
        dashboardName = 'اللوحة الميدانية لـ ' + sector;
        break;
      case 'director':
        roleTitle = 'السيد المدير العام';
        dashboardName = 'غرفة العمليات المركزية لـ ' + sector;
        break;
      case 'executive':
      case 'central_director':
        roleTitle = 'مدير الرقابة المركزية';
        dashboardName = 'غرفة العمليات المركزية لـ ' + sector;
        break;
      case 'admin':
        roleTitle = 'مدير النظام';
        dashboardName = 'لوحة تحكم النظام الشاملة';
        break;
      default:
        dashboardName += sector;
    }

    return {
      title: `${timeGreeting} ${roleTitle}`,
      subtitle: `طاب يومك، تتصفح الآن ${dashboardName}`
    };
  };

  const dynamicInfo = getDynamicGreeting();
  const displayTitle = dynamicInfo.title || overrideTitle;
  const displaySubtitle = dynamicInfo.subtitle || overrideSubtitle;

  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const dayName = new Intl.DateTimeFormat('ar-IQ', { weekday: 'long' }).format(now);
  const gregorian = new Intl.DateTimeFormat('ar-IQ', { day: 'numeric', month: 'long', year: 'numeric' }).format(now);
  const numericDate = new Intl.DateTimeFormat('en-GB').format(now);
  const hijri = new Intl.DateTimeFormat('ar-SA-u-ca-islamic', { day: 'numeric', month: 'long', year: 'numeric' }).format(now);
  const time = new Intl.DateTimeFormat('ar-IQ', { hour: '2-digit', minute: '2-digit', hour12: true }).format(now).replace('AM', 'ص').replace('PM', 'م').replace('am', 'ص').replace('pm', 'م');

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8 relative z-40">
      <div className="flex items-center gap-3">
        <div>
          <h2 className="text-sm font-black text-slate-800 dark:text-white">
            {displayTitle}
          </h2>
          <p className="text-[11px] font-bold text-slate-400 mt-0.5">
            {displaySubtitle}
          </p>
        </div>
      </div>
      
      {/* Action Buttons & Unified Info Rectangle ordered Left to Right in code, which renders Left to Right in LTR, or Right to Left in RTL. Wait, the user wants from Left to Right: Unified Rectangle, Settings, Bell.
      Since the layout is RTL (dir="rtl"), flex items normally flow Right-to-Left. 
      To make them appear Left-to-Right in an RTL layout, we can use `flex-row-reverse`.
      Wait, in RTL:
      [Bell] [Settings] [Rectangle]
      If they want it ordered Left-to-Right: Rectangle -> Settings -> Bell. 
      So Rectangle is on the left, Settings middle, Bell on the right.
      In RTL `flex` (which goes right-to-left), to get Rectangle on left, it must be the LAST item in the DOM, or we use flex-row-reverse.
      Let's just use regular flex with the order: Bell (right), Settings (middle), Rectangle (left).
      */}
      <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold text-slate-600 dark:text-slate-300">
        
        <NotificationBell />
        
        {children}
        
        {(showPrintButton && hasPerm('exportData')) && (
          <button 
            onClick={() => window.print()}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-[10px] transition-all shadow-md flex items-center gap-1.5 no-print"
          >
            🖨️ طباعة الموقف الإحصائي
          </button>
        )}

        {/* Unified Weather & Date/Time Rectangle */}
        <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800/60 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm backdrop-blur-md">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <WeatherWidget variant="full" />
          </div>
          <div className="w-px h-6 bg-slate-300 dark:bg-slate-600"></div>
          <div className="flex flex-col text-right">
            <span className="text-[11px] font-black text-slate-800 dark:text-slate-100">
              {dayName}، {gregorian}
            </span>
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
              {hijri}
            </span>
          </div>
          <div className="w-px h-6 bg-slate-300 dark:bg-slate-600"></div>
          <div className="text-sm font-black text-slate-700 dark:text-slate-200" dir="ltr">
            {time}
          </div>
        </div>
        
      </div>
    </div>
  );
};
