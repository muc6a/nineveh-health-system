import os

file_path = "src/components/NotificationBell.jsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

import re

# Remove activeTab state
content = re.sub(r"const \[activeTab, setActiveTab\] = useState\('all'\);\n", "", content)

# The section to replace starts from the flex container of the tabs down to the closing tag of the notifications list.
# We will just replace from `<div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1 mb-3 overflow-x-auto hide-scrollbar">`
# to the end of the `(() => { ... })()` block.

new_notifications_ui = """
          <div className="space-y-1 mt-2">
            {myNotifications.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400 font-bold">لا توجد إشعارات حالياً.</div>
            ) : (
              myNotifications.sort((a, b) => new Date(b.date) - new Date(a.date)).map(notif => (
                <div 
                  key={notif.id}
                  onClick={() => {
                    markAsRead(notif.id);
                    setIsOpen(false);
                    const t = notif.title || '';
                    if (t.includes('إغلاق') || t.includes('عقوب') || t.includes('غرامة')) {
                      if (user.role === 'admin' || user.role === 'central_director' || user.role === 'operations') {
                        if (user.role === 'central_director' || user.role === 'operations') window.location.hash = '/dashboard/director';
                        else window.location.hash = '/admin/control';
                        setTimeout(() => window.dispatchEvent(new CustomEvent('navToPenalties')), 100);
                      }
                    } else if (t.includes('تبليغ') || t.includes('قرار') || t.includes('توجيه') || t.includes('رد') || t.includes('تفتيش')) {
                      if (user.role === 'director' || user.role === 'central_director') {
                        window.location.hash = '/dashboard/director';
                      }
                      setTimeout(() => window.dispatchEvent(new CustomEvent('navToDirectives')), 100);
                    } else if (t.includes('تلوث') || t.includes('مختبر') || t.includes('عينة')) {
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
                  className={`p-3 rounded-xl cursor-pointer transition-all border group flex gap-3 items-start ${notif.isRead ? 'bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50' : 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30 shadow-sm'}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${notif.isRead ? 'bg-slate-100 dark:bg-slate-800 text-slate-500' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600'}`}>
                    <Bell className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-xs font-black truncate ${notif.isRead ? 'text-slate-700 dark:text-slate-300' : 'text-slate-900 dark:text-white'}`}>{notif.title}</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed break-words whitespace-normal line-clamp-2">{notif.message}</p>
                    <p className={`text-[9px] mt-1.5 font-bold ${notif.isRead ? 'text-slate-400' : 'text-blue-500'}`}>{new Date(notif.date).toLocaleString('ar-IQ')}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notif.id);
                    }}
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full opacity-0 group-hover:opacity-100 transition-all cursor-pointer shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
"""

start_marker = '<div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1 mb-3 overflow-x-auto hide-scrollbar">'
end_marker = '          {(() => {'

# Actually it goes until `})()}`
end_marker_real = '          })()}'

pattern = re.compile(re.escape(start_marker) + r".*?" + re.escape(end_marker_real), re.DOTALL)
content = pattern.sub(new_notifications_ui, content)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("NotificationBell updated.")
