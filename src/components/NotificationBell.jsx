import React, { useContext, useState, useRef, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { Bell, Check, Trash2 } from 'lucide-react';

export const NotificationBell = () => {
  const { user, systemNotifications, setSystemNotifications } = useContext(AppContext);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  // Filter notifications for the current user
  const myNotifications = systemNotifications.filter(notif => {
    if (notif.targetRole === 'all') return true;
    if (notif.targetRole === user.role) return true;
    if (notif.targetRole === user.id) return true; // targeted to specific team or user ID
    return false;
  });

  const unreadCount = myNotifications.filter(n => !n.isRead).length;

  const markAsRead = (id) => {
    setSystemNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllAsRead = () => {
    setSystemNotifications(prev => prev.map(n => {
      // Only mark read if it belongs to me
      const isMine = n.targetRole === 'all' || n.targetRole === user.role || n.targetRole === user.id;
      if (isMine) return { ...n, isRead: true };
      return n;
    }));
  };

  const deleteNotification = (id) => {
    setSystemNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-slate-100/50 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all cursor-pointer"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-[340px] sm:w-[400px] max-h-96 overflow-y-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 p-2">
          <div className="flex items-center justify-between p-2 border-b border-slate-100 dark:border-slate-800 mb-2">
            <h3 className="text-sm font-black text-slate-800 dark:text-white">الإشعارات</h3>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="text-[10px] font-bold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
              >
                تحديد الكل كمقروء
              </button>
            )}
          </div>
          
          {myNotifications.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-400 font-bold">لا توجد إشعارات حالياً.</div>
          ) : (
            <div className="space-y-1">
              {myNotifications.map(notif => (
                <div 
                  key={notif.id}
                  onClick={() => {
                    markAsRead(notif.id);
                    setIsOpen(false);
                    if (notif.title?.includes('إغلاق') || notif.title?.includes('عقوب')) {
                      if (user.role === 'admin' || user.role === 'central_director') {
                        // Navigate to director or admin panel
                        if (user.role === 'central_director') window.location.hash = '/dashboard/director';
                        else window.location.hash = '/admin/control';
                        
                        // Fire custom event to switch to penalties tab
                        setTimeout(() => window.dispatchEvent(new CustomEvent('navToPenalties')), 100);
                      }
                    } else if (notif.title?.includes('تفتيش')) {
                      if (user.role === 'team') {
                        setTimeout(() => window.dispatchEvent(new CustomEvent('navToDirectives')), 100);
                      }
                    }
                  }}
                  className={`p-3 rounded-xl cursor-pointer transition-all border group ${notif.isRead ? 'bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50' : 'bg-teal-50/50 dark:bg-teal-900/10 border-teal-100 dark:border-teal-900/30'}`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h4 className={`text-xs font-black ${notif.isRead ? 'text-slate-700 dark:text-slate-300' : 'text-teal-700 dark:text-teal-400'}`}>{notif.title}</h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed break-words whitespace-normal">{notif.message}</p>
                      <p className="text-[9px] text-slate-400 mt-2 font-bold">{new Date(notif.date).toLocaleString('ar-IQ')}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notif.id);
                      }}
                      className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
