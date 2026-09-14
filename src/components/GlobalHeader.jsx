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
    let timeEmoji = '👋';

    if (hour >= 5 && hour < 12) {
      timeGreeting = 'صباح الخير';
      timeEmoji = '🌅';
    } else if (hour >= 12 && hour < 18) {
      timeGreeting = 'مساء الخير';
      timeEmoji = '🌇';
    } else {
      timeGreeting = 'مساء الخير';
      timeEmoji = '🌙';
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
      title: `${timeGreeting} ${roleTitle} ${timeEmoji}`,
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
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
      <div className="flex items-center gap-3">
        <span className="w-10 h-10 rounded-2xl bg-slate-800 text-white flex items-center justify-center text-lg shadow-lg">
          {icon || '📊'}
        </span>
        <div>
          <h2 className="text-xs font-black text-slate-800 dark:text-white">
            {displayTitle}
          </h2>
          <p className="text-[10px] text-slate-400 mt-1">
            {displaySubtitle}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold text-slate-600 dark:text-slate-300">
        <NotificationBell />
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex flex-col text-right">
            <span className="text-xs font-black text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              📅 {dayName}، {gregorian} <span className="text-slate-400 font-normal">({numericDate})</span>
            </span>
            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5 mt-0.5">
              🌙 {hijri}
            </span>
          </div>
          <div className="w-px h-8 bg-slate-300 dark:bg-slate-600 mx-1"></div>
          <div className="text-sm font-black text-slate-700 dark:text-slate-200 flex items-center gap-1.5" dir="ltr">
            {time} ⏰
          </div>
        </div>
        <div className="flex items-center gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2.5 py-1 rounded-xl border border-amber-500/20">
          <WeatherWidget variant="full" />
        </div>
        {children}
        {(showPrintButton && hasPerm('exportData')) && (
          <button 
            onClick={() => window.print()}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-[10px] transition-all shadow-md flex items-center gap-1.5 no-print"
          >
            🖨️ طباعة الموقف الإحصائي
          </button>
        )}
      </div>
    </div>
  );
};
