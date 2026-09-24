import os

file_path = "src/components/UnifiedSidebar.jsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# We need to add openGroups state and ChevronDown icon
if "import { " in content and "ChevronDown" not in content:
    content = content.replace("import { ", "import { ChevronDown, ", 1)

# Add state for openGroups
if "const [openGroups, setOpenGroups]" not in content:
    state_injection = """  const { user, hasPerm, globalLogout, uiPreferences, setActiveSidebarTabs, navigate } = React.useContext(AppContext);
  const [openGroups, setOpenGroups] = React.useState({});
  
  const toggleGroup = (groupName) => {
    setOpenGroups(prev => ({...prev, [groupName]: !prev[groupName]}));
  };
"""
    content = content.replace("  const { user, hasPerm, globalLogout, uiPreferences, setActiveSidebarTabs, navigate } = React.useContext(AppContext);", state_injection)


# Modify renderTabs
old_render_tabs = """  const renderTabs = () => {
    const tabsToRender = customTabs ? customTabs : tabOrder.map(k => ({ id: k, ...tabConfig[k] }));
    const visibleTabs = tabsToRender.filter(tab => customTabs ? tab.showCondition !== false : (tab && tab.showCondition));

    const elements = [];

    const renderTabButton = (tab, isNested = false) => {
      const isCurrentlyActive = (executiveTab && activeTab) 
        ? (tab.isActive ? tab.isActive : (executiveTab === 'dashboard' && activeTab === tab.id) || (executiveTab === tab.id && activeTab === tab.id)) 
        : activeTab === tab.id;

      const activeClass = tab.activeBgClass || 'bg-indigo-600 text-white shadow-md shadow-indigo-500/10';
      const IconComponent = tab.icon || null;

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

    visibleTabs.forEach(tab => {
      elements.push(renderTabButton(tab));
    });

    return elements;
  };"""

new_render_tabs = """  const renderTabs = () => {
    const tabsToRender = customTabs ? customTabs : tabOrder.map(k => ({ id: k, ...tabConfig[k] }));
    const visibleTabs = tabsToRender.filter(tab => customTabs ? tab.showCondition !== false : (tab && tab.showCondition));

    const elements = [];
    const processedKeys = new Set();
    
    const labKeys = ['stats', 'incoming', 'testing', 'archive'];
    const financeKeys = ['financials', 'ext_financials', 'reconciliation', 'comprehensive_reports'];

    const renderTabButton = (tab, isNested = false) => {
      const isCurrentlyActive = (executiveTab && activeTab) 
        ? (tab.isActive ? tab.isActive : (executiveTab === 'dashboard' && activeTab === tab.id) || (executiveTab === tab.id && activeTab === tab.id)) 
        : activeTab === tab.id;

      const activeClass = tab.activeBgClass || 'bg-indigo-600 text-white shadow-md shadow-indigo-500/10';
      const IconComponent = tab.icon || null;

      return (
        <button
          key={tab.id}
          onClick={() => { if(tab.onClick) tab.onClick(); setIsSidebarOpen(false); }}
          className={`w-full text-right px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center gap-3 ${
            isCurrentlyActive
              ? activeClass
              : (isNested ? 'text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800/40 border-r-2 border-transparent hover:border-indigo-500' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40')
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

    const isPrimaryLab = user?.role === 'lab';
    const isPrimaryAccountant = user?.role === 'accountant';

    visibleTabs.forEach(tab => {
      if (processedKeys.has(tab.id)) return;

      // Group Lab for secondary users
      if (!isPrimaryLab && labKeys.includes(tab.id)) {
        const availableLabTabs = visibleTabs.filter(t => labKeys.includes(t.id));
        if (availableLabTabs.length > 0) {
          const isAnyLabActive = availableLabTabs.some(t => activeTab === t.id);
          elements.push(
            <div key="group_lab" className="flex flex-col gap-1">
              <button 
                onClick={() => toggleGroup('lab')}
                className={`w-full text-right px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center gap-3 ${isAnyLabActive ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40'}`}
              >
                <FlaskConical className={`w-5 h-5 ${isAnyLabActive ? 'text-indigo-600' : 'text-indigo-500'}`} />
                <span>قسم المختبر</span>
                <ChevronDown className={`w-4 h-4 mr-auto transition-transform duration-300 ${openGroups['lab'] ? 'rotate-180' : ''}`} />
              </button>
              {openGroups['lab'] && (
                <div className="flex flex-col gap-1 pr-6 pb-2">
                  {availableLabTabs.map(t => renderTabButton(t, true))}
                </div>
              )}
            </div>
          );
          availableLabTabs.forEach(t => processedKeys.add(t.id));
        }
        return;
      }

      // Group Finance for secondary users
      if (!isPrimaryAccountant && financeKeys.includes(tab.id)) {
        const availableFinanceTabs = visibleTabs.filter(t => financeKeys.includes(t.id));
        if (availableFinanceTabs.length > 0) {
          const isAnyFinanceActive = availableFinanceTabs.some(t => activeTab === t.id);
          elements.push(
            <div key="group_finance" className="flex flex-col gap-1">
              <button 
                onClick={() => toggleGroup('finance')}
                className={`w-full text-right px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center gap-3 ${isAnyFinanceActive ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40'}`}
              >
                <LayoutDashboard className={`w-5 h-5 ${isAnyFinanceActive ? 'text-emerald-600' : 'text-emerald-500'}`} />
                <span>القسم المالي</span>
                <ChevronDown className={`w-4 h-4 mr-auto transition-transform duration-300 ${openGroups['finance'] ? 'rotate-180' : ''}`} />
              </button>
              {openGroups['finance'] && (
                <div className="flex flex-col gap-1 pr-6 pb-2">
                  {availableFinanceTabs.map(t => renderTabButton(t, true))}
                </div>
              )}
            </div>
          );
          availableFinanceTabs.forEach(t => processedKeys.add(t.id));
        }
        return;
      }

      elements.push(renderTabButton(tab));
      processedKeys.add(tab.id);
    });

    return elements;
  };"""

content = content.replace(old_render_tabs, new_render_tabs)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("UnifiedSidebar updated with grouped logic.")
