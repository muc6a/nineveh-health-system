import os

file_path = "src/components/NotificationBell.jsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace imports
import_line = "import { Bell, Check, Trash2 } from 'lucide-react';"
new_import_line = "import { Bell, Check, Trash2, Lock, ShieldAlert, ClipboardList, Mail } from 'lucide-react';"
if import_line in content:
    content = content.replace(import_line, new_import_line)

# Now, we need to modify the map part.
old_map_start = """              myNotifications.sort((a, b) => new Date(b.date) - new Date(a.date)).map(notif => ("""

new_map_start = """              myNotifications.sort((a, b) => new Date(b.date) - new Date(a.date)).map(notif => {
                const t = notif.title || '';
                const isClosure = notif.type === 'closures' || (notif.type === undefined && (t.includes('إغلاق') || t.includes('تشميع')));
                const isPenalty = notif.type === 'penalties' || (notif.type === undefined && (t.includes('عقوب') || t.includes('غرامة') || t.includes('مخالفة')));
                const isInspectionOrTask = notif.type === 'tasks' || (notif.type === undefined && (t.includes('كشف') || t.includes('تفتيش') || t.includes('مهمة')));
                const isDirective = notif.type === 'directives' || (notif.type === undefined && (t.includes('قرار') || t.includes('تبليغ') || t.includes('توجيه') || t.includes('مجلس') || t.includes('SOS') || t.includes('استغاثة')));

                let Icon = Bell;
                let iconColorClass = 'text-blue-600';
                let bgClass = 'bg-blue-100 dark:bg-blue-900/30';

                if (isClosure) {
                  Icon = Lock;
                  iconColorClass = 'text-rose-600';
                  bgClass = 'bg-rose-100 dark:bg-rose-900/30';
                } else if (isPenalty) {
                  Icon = ShieldAlert;
                  iconColorClass = 'text-red-600';
                  bgClass = 'bg-red-100 dark:bg-red-900/30';
                } else if (isInspectionOrTask) {
                  Icon = ClipboardList;
                  iconColorClass = 'text-emerald-600';
                  bgClass = 'bg-emerald-100 dark:bg-emerald-900/30';
                } else if (isDirective) {
                  Icon = Mail;
                  iconColorClass = 'text-amber-600';
                  bgClass = 'bg-amber-100 dark:bg-amber-900/30';
                }

                if (notif.isRead) {
                  iconColorClass = 'text-slate-500';
                  bgClass = 'bg-slate-100 dark:bg-slate-800';
                }

                return (
"""

if old_map_start in content:
    content = content.replace(old_map_start, new_map_start)
else:
    print("Could not find old_map_start")

old_icon_div = """                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${notif.isRead ? 'bg-slate-100 dark:bg-slate-800 text-slate-500' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600'}`}>
                    <Bell className="w-4 h-4" />
                  </div>"""
                  
new_icon_div = """                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${bgClass} ${iconColorClass}`}>
                    <Icon className="w-4 h-4" />
                  </div>"""

if old_icon_div in content:
    content = content.replace(old_icon_div, new_icon_div)
else:
    print("Could not find old_icon_div")

# Fix the end bracket for the map from `))  )}` to `}))  )}`
# To be safe, we replace the specific end of the map block.
old_end = """                  </button>
                </div>
              ))
            )}"""

new_end = """                  </button>
                </div>
              );
            })
            )}"""

if old_end in content:
    content = content.replace(old_end, new_end)
else:
    print("Could not find old_end")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Notification icons updated!")
