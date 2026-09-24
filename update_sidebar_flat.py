import os

file_path = "src/components/UnifiedSidebar.jsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

import re

new_render_tabs = """  const renderTabs = () => {
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

start_marker = "  const renderTabs = () => {"
end_marker = "  React.useEffect(() => {"

pattern = re.compile(re.escape(start_marker) + r".*?" + r"(?=" + re.escape(end_marker) + r")", re.DOTALL)
content = pattern.sub(new_render_tabs + "\n", content)

# Remove openGroups state
content = re.sub(r"  const \[openGroups, setOpenGroups\] = React\.useState\(\{ lab: false, finance: false \}\);\n\n", "", content)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("UnifiedSidebar updated.")
