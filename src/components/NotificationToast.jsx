import React, { useEffect, useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export const NotificationToast = () => {
  const { notification } = useContext(AppContext);
  const [visible, setVisible] = useState(false);
  const [currentNotif, setCurrentNotif] = useState(null);

  useEffect(() => {
    if (notification && notification.message) {
      setCurrentNotif(notification);
      setVisible(true);
      
      const timer = setTimeout(() => {
        setVisible(false);
      }, 3000); // 3 seconds as requested
      
      return () => clearTimeout(timer);
    }
  }, [notification]);

  if (!currentNotif) return null;

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-500" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />
  };

  const bgColors = {
    success: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20',
    error: 'bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20',
    warning: 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20',
    info: 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20'
  };

  const textColors = {
    success: 'text-emerald-700 dark:text-emerald-400',
    error: 'text-rose-700 dark:text-rose-400',
    warning: 'text-amber-700 dark:text-amber-400',
    info: 'text-blue-700 dark:text-blue-400'
  };

  const type = currentNotif.type || 'info';

  return (
    <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 ${visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-4 scale-95 pointer-events-none'}`}>
      <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl border shadow-xl backdrop-blur-md min-w-[280px] max-w-sm ${bgColors[type]}`}>
        <div className="shrink-0">
          {icons[type]}
        </div>
        <p className={`text-sm font-bold flex-1 text-right m-0 leading-tight ${textColors[type]}`}>
          {currentNotif.message}
        </p>
        <button onClick={() => setVisible(false)} className="shrink-0 p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors opacity-70 hover:opacity-100">
          <X className={`w-4 h-4 ${textColors[type]}`} />
        </button>
      </div>
    </div>
  );
};

export default NotificationToast;
