import React, { useContext } from 'react';
import { WeatherWidget } from './WeatherWidget';
import { NotificationBell } from './NotificationBell';
import { AppContext } from '../context/AppContext';

export const GlobalHeader = ({ title, subtitle, icon, showPrintButton = false }) => {
  const { hasPerm } = useContext(AppContext);

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
      <div className="flex items-center gap-3">
        <span className="w-10 h-10 rounded-2xl bg-slate-800 text-white flex items-center justify-center text-lg shadow-lg">
          {icon || '📊'}
        </span>
        <div>
          <h2 className="text-xs font-black text-slate-800 dark:text-white">
            {title}
          </h2>
          <p className="text-[10px] text-slate-400 mt-1">
            {subtitle}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold text-slate-600 dark:text-slate-300">
        <NotificationBell />
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-xl">
          <span>📅 {new Date().toLocaleDateString('ar-IQ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          <span className="text-slate-300">|</span>
          <span>⏰ {new Date().toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        <div className="flex items-center gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2.5 py-1 rounded-xl border border-amber-500/20">
          <WeatherWidget variant="full" />
        </div>
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
