import React, { useContext, useState, useRef, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { Bell, Check, Trash2, Lock, FileWarning, ClipboardCheck, ClipboardList } from 'lucide-react';

const NotificationIcon = ({ type, icon: Icon, color, title, myNotifications, markAsRead, deleteNotification }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user } = useContext(AppContext);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredNotifications = myNotifications.filter(n => {
    const t = n.title || '';
    if (type === 'closures') {
      return n.type === 'closures' || (n.type === undefined && (t.includes('إغلاق') || t.includes('تشميع')));
    }
    if (type === 'penalties') {
      return n.type === 'penalties' || (n.type === undefined && (t.includes('غرامة') || t.includes('عقوب')));
    }
    if (type === 'inspections') {
      return n.type === 'inspections' || (n.type === undefined && (t.includes('كشف') || t.includes('رقاب') || t.includes('عينة')));
    }
    if (type === 'tasks') {
      return n.type === 'tasks' || (n.type === undefined && (t.includes('تفتيش') || t.includes('مهمة')));
    }
    if (type === 'directives') {
      return n.type === 'directives' || (n.type === undefined && (t.includes('تبليغ') || t.includes('قرار') || t.includes('توجيه') || t.includes('مجلس') || t.includes('SOS') || t.includes('استغاثة') || t.includes('إداري')));
    }
    return false;
  });

  const unreadCount = filteredNotifications.filter(n => !n.isRead).length;

  const bgColors = {
    red: 'bg-red-500 text-white',
    orange: 'bg-orange-500 text-white',
    indigo: 'bg-indigo-500 text-white',
    purple: 'bg-purple-500 text-white',
    amber: 'bg-amber-500 text-white'
  };
  const iconColors = {
    red: 'text-red-500',
    orange: 'text-orange-500',
    indigo: 'text-indigo-500',
    purple: 'text-purple-500',
    amber: 'text-amber-500'
  };

  return (
    <div className="relative z-[60]" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        title={title}
        className="relative p-2 rounded-xl bg-slate-100/50 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all cursor-pointer"
      >
        <Icon className={`w-5 h-5 ${iconColors[color]}`} />
        {unreadCount > 0 && (
          <span className={`absolute -top-1 -right-1 w-5 h-5 rounded-full ${bgColors[color]} text-[10px] font-bold flex items-center justify-center animate-pulse shadow-md`}>
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed top-[70px] left-4 right-4 md:absolute md:top-full md:right-0 md:left-auto md:w-[350px] mt-2 max-h-[80vh] overflow-y-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 p-2">
          <div className="flex items-center justify-between p-2 border-b border-slate-100 dark:border-slate-800 mb-2">
            <h3 className="text-sm font-black text-slate-800 dark:text-white flex items-center gap-2">
              <Icon className={`w-4 h-4 ${iconColors[color]}`} />
              {title}
            </h3>
            {unreadCount > 0 && (
              <button 
                onClick={() => {
                  filteredNotifications.forEach(n => markAsRead(n.id));
                }}
                className="text-[10px] font-bold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
              >
                تحديد الكل كمقروء
              </button>
            )}
          </div>
          
          {filteredNotifications.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-400 font-bold">لا توجد إشعارات حالياً.</div>
          ) : (
            <div className="space-y-1">
              {filteredNotifications.map(notif => (
                <div 
                  key={notif.id}
                  onClick={() => {
                    markAsRead(notif.id);
                    setIsOpen(false);
                    if (type === 'closures' || type === 'penalties') {
                      if (user.role === 'admin' || user.role === 'central_director' || user.role === 'operations') {
                        if (user.role === 'central_director' || user.role === 'operations') window.location.hash = '/dashboard/director';
                        else window.location.hash = '/admin/control';
                        setTimeout(() => window.dispatchEvent(new CustomEvent('navToPenalties')), 100);
                      }
                    } else if (type === 'directives') {
                      if (user.role === 'director' || user.role === 'central_director') {
                        window.location.hash = '/dashboard/director';
                      }
                      setTimeout(() => window.dispatchEvent(new CustomEvent('navToDirectives')), 100);
                    } else if ((type === 'tasks' || type === 'inspections') && (notif.title?.includes('تلوث') || notif.title?.includes('مختبر') || notif.title?.includes('عينة'))) {
                      if (user.role === 'operations' || user.role === 'central_director' || user.role === 'director' || user.isDirector) {
                        window.location.hash = '/dashboard/director';
                        setTimeout(() => window.dispatchEvent(new CustomEvent('navToLabResults')), 100);
                      } else if (user.role === 'lab') {
                         window.location.hash = '/dashboard/lab';
                      } else if (user.role === 'team' || user.isTeam) {
                         window.location.hash = '/dashboard/team';
                         setTimeout(() => window.dispatchEvent(new CustomEvent('navToLabResults')), 100);
                      }
                    }
                  }}
                  className={`p-3 rounded-xl cursor-pointer transition-all border group ${notif.isRead ? 'bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50' : `bg-${color}-50/50 dark:bg-${color}-900/10 border-${color}-100 dark:border-${color}-900/30`}`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h4 className={`text-xs font-black ${notif.isRead ? 'text-slate-700 dark:text-slate-300' : 'text-slate-800 dark:text-white'}`}>{notif.title}</h4>
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

export const NotificationBell = () => {
  const { user, systemNotifications, setSystemNotifications, playBeep } = useContext(AppContext);

  if (!user) return null;

  const myNotifications = systemNotifications.filter(notif => {
    const isTargeted = notif.targetRole === 'all' || notif.targetRole === user.role || notif.targetRole === user.id;
    if (!isTargeted) return false;

    if (user.role === 'admin') return true; 

    const t = notif.title || '';
    const isClosure = notif.type === 'closures' || (notif.type === undefined && (t.includes('إغلاق') || t.includes('تشميع')));
    const isPenalty = notif.type === 'penalties' || (notif.type === undefined && (t.includes('عقوب') || t.includes('غرامة') || t.includes('مخالفة')));
    const isInspection = notif.type === 'inspections' || (notif.type === undefined && (t.includes('كشف') || t.includes('رقاب') || t.includes('عينة')));
    const isTask = notif.type === 'tasks' || (notif.type === undefined && (t.includes('تفتيش') || t.includes('مهمة')));
    const isDirective = notif.type === 'directives' || (notif.type === undefined && (t.includes('قرار') || t.includes('تبليغ') || t.includes('توجيه') || t.includes('مجلس') || t.includes('SOS') || t.includes('استغاثة')));

    let allowed = true;

    if (isClosure) {
      allowed = user.permissions?.notify_closures !== false;
    } else if (isPenalty) {
      allowed = user.permissions?.notify_penalties !== false; 
    } else if (isInspection) {
      allowed = user.permissions?.notify_inspections !== false;
    } else if (isTask) {
      allowed = user.permissions?.notify_tasks !== false;
    } else if (isDirective) {
      allowed = user.permissions?.notify_directives !== false;
    }

    return allowed;
  });

  const unreadCount = myNotifications.filter(n => !n.isRead).length;

  const prevUnreadCountRef = useRef(unreadCount);
  useEffect(() => {
    if (unreadCount > prevUnreadCountRef.current) {
      if (playBeep) playBeep('notification'); 
    }
    prevUnreadCountRef.current = unreadCount;
  }, [unreadCount, playBeep]);

  const markAsRead = (id) => {
    setSystemNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const deleteNotification = (id) => {
    setSystemNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="flex items-center gap-1.5 md:gap-3 bg-slate-100/50 dark:bg-slate-800/30 p-1 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
      <NotificationIcon type="closures" icon={Lock} color="red" title="إشعارات الإغلاقات" myNotifications={myNotifications} markAsRead={markAsRead} deleteNotification={deleteNotification} />
      <div className="w-px h-6 bg-slate-300 dark:bg-slate-700"></div>
      <NotificationIcon type="penalties" icon={FileWarning} color="orange" title="إشعارات العقوبات" myNotifications={myNotifications} markAsRead={markAsRead} deleteNotification={deleteNotification} />
      <div className="w-px h-6 bg-slate-300 dark:bg-slate-700"></div>
      <NotificationIcon type="inspections" icon={ClipboardList} color="purple" title="إشعارات الكشوفات" myNotifications={myNotifications} markAsRead={markAsRead} deleteNotification={deleteNotification} />
      <div className="w-px h-6 bg-slate-300 dark:bg-slate-700"></div>
      <NotificationIcon type="tasks" icon={ClipboardCheck} color="indigo" title="إشعارات المهام" myNotifications={myNotifications} markAsRead={markAsRead} deleteNotification={deleteNotification} />
      <div className="w-px h-6 bg-slate-300 dark:bg-slate-700"></div>
      <NotificationIcon type="directives" icon={Bell} color="amber" title="التبليغات الإدارية" myNotifications={myNotifications} markAsRead={markAsRead} deleteNotification={deleteNotification} />
    </div>
  );
};
