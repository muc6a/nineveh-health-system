import re

def update():
    path = "src/components/UnifiedSidebar.jsx"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # Modify props
    content = content.replace("testingReqs = [] \n}) => {", "testingReqs = [],\n  customTabs = null\n}) => {")

    # Inside UnifiedSidebar, tabConfig is defined.
    # Where tabOrder is defined:
    # const savedTabOrder = uiPreferences?.tabOrder || Object.keys(tabConfig);
    # const tabOrder = [...new Set([...savedTabOrder, ...Object.keys(tabConfig)])];
    
    # We'll replace that logic with:
    # const effectiveTabs = customTabs || Object.keys(tabConfig).map(k => ({ id: k, ...tabConfig[k] }));
    # But wait! customTabs should just provide the exact array to map over.
    
    # Let's find:
    pattern_render = r"\{tabOrder\.map\(tabKey => \{.*?return \([\s\S]*?</button>\s*\);\s*\}\)\}"
    
    # We will replace the rendering block:
    new_render = """
            {(customTabs ? customTabs : tabOrder.map(k => ({ id: k, ...tabConfig[k] }))).map(tab => {
              if (customTabs) {
                 if (tab.showCondition === false) return null;
                 const isCurrentlyActive = activeTab === tab.id;
                 return (
                  <button
                    key={tab.id}
                    onClick={() => { tab.onClick(); setIsSidebarOpen(false); }}
                    className={`w-full text-right px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center gap-3 ${
                      isCurrentlyActive
                        ? tab.activeBgClass || 'bg-indigo-600 text-white shadow-md shadow-indigo-500/10'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    {tab.icon && <tab.icon className={`w-4.5 h-4.5 ${isCurrentlyActive ? '' : (tab.iconColorClass || '')}`} />}
                    <span>{tab.label}</span>
                    {tab.badge > 0 && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full mr-auto ${isCurrentlyActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>{tab.badge}</span>
                    )}
                  </button>
                 );
              }

              // Normal tabConfig rendering
              const tabKey = tab.id;
              const config = tab;
              if (!config || !config.showCondition) return null;

              let isCurrentlyActive = (executiveTab && activeTab) 
                ? (config.isActive ? config.isActive : (executiveTab === 'dashboard' && activeTab === tabKey) || (executiveTab === tabKey && activeTab === tabKey)) 
                : activeTab === tabKey;
              
              if (tabKey === 'establishments' && executiveTab) {
                if (executiveTab === 'establishments') isCurrentlyActive = true;
              }

              return (
                <button
                  key={tabKey}
                  onClick={() => { config.onClick(); setIsSidebarOpen(false); }}
                  className={`w-full text-right px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center gap-3 ${
                    isCurrentlyActive
                      ? config.activeBgClass
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <config.icon className={`w-4.5 h-4.5 ${isCurrentlyActive ? '' : config.iconColorClass}`} />
                  <span>{config.label}</span>
                </button>
              );
            })}
"""
    content = re.sub(pattern_render, new_render.strip(), content, flags=re.DOTALL)
    
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

if __name__ == "__main__":
    update()
