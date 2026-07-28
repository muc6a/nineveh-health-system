import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Sun, Moon, Type } from 'lucide-react';

export const ThemeToggle = () => {
  const { darkMode, setDarkMode } = useContext(AppContext);
  
  const [fontSize, setFontSize] = useState(() => {
    return localStorage.getItem('appFontSize') || 'normal'; // small, normal, large
  });

  useEffect(() => {
    localStorage.setItem('appFontSize', fontSize);
    if (fontSize === 'small') {
      document.documentElement.style.fontSize = '14px';
    } else if (fontSize === 'large') {
      document.documentElement.style.fontSize = '18px';
    } else {
      document.documentElement.style.fontSize = '16px'; // normal
    }
  }, [fontSize]);

  const toggleFontSize = () => {
    if (fontSize === 'normal') setFontSize('large');
    else if (fontSize === 'large') setFontSize('small');
    else setFontSize('normal');
  };

  return (
    <div className="flex items-center gap-2">
      {/* Font Size Toggle */}
      <button
        onClick={toggleFontSize}
        className="relative flex items-center justify-center p-2.5 rounded-2xl bg-white/40 dark:bg-slate-800/40 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-3d-inset hover:scale-105 hover:bg-white/60 dark:hover:bg-slate-700/60 active:scale-95 transition-all duration-300 group"
        title="تغيير حجم الخط"
      >
        <Type className="w-5 h-5 text-slate-700 dark:text-slate-300 transition-transform group-active:scale-90" />
        <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-blue-500 text-[8px] font-bold text-white shadow-sm border border-white dark:border-slate-800">
          {fontSize === 'small' ? 'S' : fontSize === 'large' ? 'L' : 'M'}
        </span>
      </button>

      {/* Dark Mode Toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="relative flex items-center justify-center p-2.5 rounded-2xl bg-white/40 dark:bg-slate-800/40 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-3d-inset hover:scale-105 hover:bg-white/60 dark:hover:bg-slate-700/60 active:scale-95 transition-all duration-300"
        aria-label="تغيير المظهر"
        title="تغيير المظهر"
      >
        <div className="relative w-5 h-5">
          <Sun className={`absolute inset-0 w-5 h-5 text-amber-500 transition-all duration-500 transform ${darkMode ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}`} />
          <Moon className={`absolute inset-0 w-5 h-5 text-indigo-400 transition-all duration-500 transform ${darkMode ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'}`} />
        </div>
      </button>
    </div>
  );
};
export default ThemeToggle;
