import os

file_path = "src/components/UnifiedSidebar.jsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

import re

# We will replace the React.useEffect that sets setActiveSidebarTabs
old_effect = """  React.useEffect(() => {
    if (setActiveSidebarTabs) {
      const visibleTabs = tabOrder
        .filter(key => tabConfig[key] && tabConfig[key].showCondition)
        .map(key => ({ id: key, label: tabConfig[key].label }));
      setActiveSidebarTabs(visibleTabs);
    }
  }, [user?.permissions, uiPreferences?.tabOrder]);"""

new_effect = """  React.useEffect(() => {
    if (setActiveSidebarTabs) {
      const tabsToRender = customTabs ? customTabs : tabOrder.map(k => ({ id: k, ...tabConfig[k] }));
      const visibleTabs = tabsToRender
        .filter(tab => customTabs ? tab.showCondition !== false : (tab && tab.showCondition))
        .map(tab => ({ id: tab.id, label: tab.label }));
        
      setActiveSidebarTabs(prev => {
        if (JSON.stringify(prev) !== JSON.stringify(visibleTabs)) {
          return visibleTabs;
        }
        return prev;
      });
    }
  }); // Run on every render, but only update state if it changed"""

content = content.replace(old_effect, new_effect)

# Also there's another empty useEffect I left by mistake earlier!
old_empty_effect = """  React.useEffect(() => {
    const tabsToRender = customTabs ? customTabs : tabOrder.map(k => ({ id: k, ...tabConfig[k] }));
    const visibleTabs = tabsToRender.filter(tab => customTabs ? tab.showCondition !== false : (tab && tab.showCondition));
    
    const labKeys = ['stats', 'incoming', 'testing', 'archive'];
    const financeKeys = ['financials', 'ext_financials', 'reconciliation', 'comprehensive_reports'];
  }, [activeTab, customTabs, tabOrder, user?.permissions]);"""

content = content.replace(old_empty_effect, "")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("UnifiedSidebar updated.")
