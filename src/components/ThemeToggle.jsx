import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle = () => {
  const { darkMode, setDarkMode } = useContext(AppContext);

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="relative flex items-center justify-center p-2.5 rounded-2xl bg-white/40 dark:bg-slate-800/40 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-3d-inset hover:scale-105 hover:bg-white/60 dark:hover:bg-slate-700/60 active:scale-95 transition-all duration-300"
      aria-label="تغيير المظهر"
      title="تغيير المظهر"
    >
      <div className="relative w-6 h-6">
        <Sun className={`absolute inset-0 w-6 h-6 text-amber-500 transition-all duration-500 transform ${darkMode ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}`} />
        <Moon className={`absolute inset-0 w-6 h-6 text-indigo-400 transition-all duration-500 transform ${darkMode ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'}`} />
      </div>
    </button>
  );
};
export default ThemeToggle;
