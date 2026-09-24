import os

file_path = "src/components/UnifiedSidebar.jsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace the openGroups state and renderTabs function
old_render_tabs = """  const [openGroups, setOpenGroups] = React.useState({ lab: false, finance: false });

  const renderTabs = () => {
    const tabsToRender = customTabs ? customTabs : tabOrder.map(k => ({ id: k, ...tabConfig[k] }));
    const visibleTabs = tabsToRender.filter(tab => customTabs ? tab.showCondition !== false : (tab && tab.showCondition));

    const labKeys = ['stats', 'incoming', 'testing', 'archive'];
    const financeKeys = ['financials', 'ext_financials', 'reconciliation', 'comprehensive_reports'];

    const labTabs = visibleTabs.filter(t => labKeys.includes(t.id));
    const financeTabs = visibleTabs.filter(t => financeKeys.includes(t.id));

    const elements = [];
    let labRendered = false;
    let financeRendered = false;

    const renderTabButton = (tab, isNested = false) => {
      const isCurrentlyActive = (executiveTab && activeTab) 
        ? (tab.isActive ? tab.isActive : (executiveTab === 'dashboard' && activeTab === tab.id) || (executiveTab === tab.id && activeTab === tab.id)) 
        : activeTab === tab.id;

      const activeClass = tab.activeBgClass || 'bg-indigo-600 text-white shadow-md shadow-indigo-500/10';

      return (
        <button
          key={tab.id}
          onClick={() => { if(tab.onClick) tab.onClick(); setIsSidebarOpen(false); }}
          className={`w-full text-right px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center gap-3 ${
            isCurrentlyActive
              ? activeClass
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40'
          } ${isNested ? 'pr-8 py-2.5 opacity-90' : ''}`}
        >
          <span>{tab.label}</span>
          {tab.badge > 0 && (
            <span className={`text-[10px] px-2 py-0.5 rounded-full mr-auto ${isCurrentlyActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>{tab.badge}</span>
          )}
        </button>
      );
    };

    const isLabSpecialist = user?.role === 'lab';
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
    });

    return elements;
  };"""

new_render_tabs = """  const renderTabs = () => {
    const tabsToRender = customTabs ? customTabs : tabOrder.map(k => ({ id: k, ...tabConfig[k] }));
    const visibleTabs = tabsToRender.filter(tab => customTabs ? tab.showCondition !== false : (tab && tab.showCondition));

    const renderTabButton = (tab) => {
      const isCurrentlyActive = (executiveTab && activeTab) 
        ? (tab.isActive ? tab.isActive : (executiveTab === 'dashboard' && activeTab === tab.id) || (executiveTab === tab.id && activeTab === tab.id)) 
        : activeTab === tab.id;

      const activeClass = tab.activeBgClass || 'bg-indigo-600 text-white shadow-md shadow-indigo-500/10';
      const IconComponent = tab.icon;

      return (
        <button
          key={tab.id}
          onClick={() => { if(tab.onClick) tab.onClick(); setIsSidebarOpen(false); }}
          className={`w-full text-right px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center gap-3 ${
            isCurrentlyActive
              ? activeClass
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40'
          }`}
        >
          {IconComponent && <IconComponent className={`w-5 h-5 ${isCurrentlyActive ? '' : (tab.iconColorClass || 'text-slate-500')}`} />}
          <span>{tab.label}</span>
          {tab.badge > 0 && (
            <span className={`text-[10px] px-2 py-0.5 rounded-full mr-auto ${isCurrentlyActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>{tab.badge}</span>
          )}
        </button>
      );
    };

    return visibleTabs.map(tab => renderTabButton(tab));
  };"""

content = content.replace(old_render_tabs, new_render_tabs)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("UnifiedSidebar updated.")
