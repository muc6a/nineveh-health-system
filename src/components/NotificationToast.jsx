import React, { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';

export const NotificationToast = ({ message, type = 'info', duration = 4000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Play sound
    try {
      const audio = new Audio('/notification.mp3');
      audio.volume = 0.5;
      audio.play().catch(e => console.log('Audio autoplay blocked', e));
    } catch(e) {}

    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible && !message) return null;

  return (
    <div className={`fixed bottom-6 left-6 z-[100] flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl transition-all duration-300 border ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'} ${
      type === 'success' ? 'bg-emerald-500/90 border-emerald-400 text-white' : 
      type === 'error' ? 'bg-rose-500/90 border-rose-400 text-white' : 
      'bg-slate-900 border-slate-700 text-white'
    }`}>
      <div className="p-2 bg-white/20 rounded-full animate-pulse">
        <Bell className="w-4 h-4" />
      </div>
      <div className="flex flex-col text-right">
        <span className="font-bold text-sm">{message}</span>
      </div>
      <button onClick={() => setIsVisible(false)} className="ml-2 p-1 hover:bg-white/20 rounded-full transition-colors cursor-pointer">
        <X className="w-3 h-3" />
      </button>
    </div>
  );
};

export default NotificationToast;
