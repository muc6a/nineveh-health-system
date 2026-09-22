import os

bell_path = "src/components/NotificationBell.jsx"
sidebar_path = "src/components/UnifiedSidebar.jsx"

# --- Update NotificationBell.jsx ---
with open(bell_path, 'r') as f:
    bell_content = f.read()

old_bell_render = """  return (
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
  );"""

new_bell_render = """  const icons = [];
  if (user.role === 'admin' || user.permissions?.notify_closures !== false) {
    icons.push(<NotificationIcon key="closures" type="closures" icon={Lock} color="red" title="إشعارات الإغلاقات" myNotifications={myNotifications} markAsRead={markAsRead} deleteNotification={deleteNotification} />);
  }
  if (user.role === 'admin' || user.permissions?.notify_penalties !== false) {
    icons.push(<NotificationIcon key="penalties" type="penalties" icon={FileWarning} color="orange" title="إشعارات العقوبات" myNotifications={myNotifications} markAsRead={markAsRead} deleteNotification={deleteNotification} />);
  }
  if (user.role === 'admin' || user.permissions?.notify_inspections !== false) {
    icons.push(<NotificationIcon key="inspections" type="inspections" icon={ClipboardList} color="purple" title="إشعارات الكشوفات" myNotifications={myNotifications} markAsRead={markAsRead} deleteNotification={deleteNotification} />);
  }
  if (user.role === 'admin' || user.permissions?.notify_tasks !== false) {
    icons.push(<NotificationIcon key="tasks" type="tasks" icon={ClipboardCheck} color="indigo" title="إشعارات المهام" myNotifications={myNotifications} markAsRead={markAsRead} deleteNotification={deleteNotification} />);
  }
  if (user.role === 'admin' || user.permissions?.notify_directives !== false) {
    icons.push(<NotificationIcon key="directives" type="directives" icon={Bell} color="amber" title="التبليغات الإدارية" myNotifications={myNotifications} markAsRead={markAsRead} deleteNotification={deleteNotification} />);
  }

  if (icons.length === 0) return null;

  return (
    <div className="flex items-center gap-1.5 md:gap-3 bg-slate-100/50 dark:bg-slate-800/30 p-1 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
      {icons.map((icon, index) => (
        <React.Fragment key={icon.key}>
          {icon}
          {index < icons.length - 1 && <div className="w-px h-6 bg-slate-300 dark:bg-slate-700"></div>}
        </React.Fragment>
      ))}
    </div>
  );"""

if old_bell_render in bell_content:
    bell_content = bell_content.replace(old_bell_render, new_bell_render)
    with open(bell_path, 'w') as f:
        f.write(bell_content)
    print("Updated NotificationBell.jsx")

# --- Update UnifiedSidebar.jsx ---
with open(sidebar_path, 'r') as f:
    sidebar_content = f.read()

old_sidebar_render = """    visibleTabs.forEach(tab => {
      elements.push(renderTabButton(tab));
    });"""

new_sidebar_render = """    const isLabSpecialist = user?.role === 'lab';
    const isFinanceSpecialist = user?.role === 'accountant' || user?.role === 'financial_accountant';

    visibleTabs.forEach(tab => {
      if (labKeys.includes(tab.id)) {
        if (!labRendered) {
          labRendered = true;
          if (isLabSpecialist || labTabs.length === 1) {
             labTabs.forEach(t => elements.push(renderTabButton(t)));
          } else {
             const isLabActive = labTabs.some(t => t.id === activeTab);
             const isOpen = openGroups.lab || isLabActive;
             
             elements.push(
                <div key="group_lab" className="flex flex-col gap-1">
                  <button
                    onClick={() => setOpenGroups(prev => ({ ...prev, lab: !prev.lab }))}
                    className={`w-full text-right px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center justify-between ${isLabActive ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40'}`}
                  >
                    <div className="flex items-center gap-3">
                      <FlaskConical className={`w-5 h-5 ${isLabActive ? '' : 'text-indigo-500'}`} />
                      <span>قسم المختبر</span>
                    </div>
                    <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  {isOpen && (
                    <div className="flex flex-col gap-1 pr-6 border-r-2 border-indigo-100 dark:border-indigo-900/30 mr-4">
                      {labTabs.map(t => renderTabButton(t, true))}
                    </div>
                  )}
                </div>
             );
          }
        }
      } else if (financeKeys.includes(tab.id)) {
        if (!financeRendered) {
          financeRendered = true;
          if (isFinanceSpecialist || financeTabs.length === 1) {
             financeTabs.forEach(t => elements.push(renderTabButton(t)));
          } else {
             const isFinanceActive = financeTabs.some(t => t.id === activeTab);
             const isOpen = openGroups.finance || isFinanceActive;
             
             elements.push(
                <div key="group_finance" className="flex flex-col gap-1">
                  <button
                    onClick={() => setOpenGroups(prev => ({ ...prev, finance: !prev.finance }))}
                    className={`w-full text-right px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center justify-between ${isFinanceActive ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40'}`}
                  >
                    <div className="flex items-center gap-3">
                      <LayoutDashboard className={`w-5 h-5 ${isFinanceActive ? '' : 'text-emerald-500'}`} />
                      <span>القسم المالي</span>
                    </div>
                    <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  {isOpen && (
                    <div className="flex flex-col gap-1 pr-6 border-r-2 border-emerald-100 dark:border-emerald-900/30 mr-4">
                      {financeTabs.map(t => renderTabButton(t, true))}
                    </div>
                  )}
                </div>
             );
          }
        }
      } else {
        elements.push(renderTabButton(tab));
      }
    });"""

if old_sidebar_render in sidebar_content:
    sidebar_content = sidebar_content.replace(old_sidebar_render, new_sidebar_render)
    with open(sidebar_path, 'w') as f:
        f.write(sidebar_content)
    print("Updated UnifiedSidebar.jsx")

