import re

def patch():
    path = "src/pages/AccountantPanel.jsx"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # Import UnifiedSidebar
    if "import UnifiedSidebar from" not in content:
        content = content.replace("import { AnimatedLogo", "import UnifiedSidebar from '../components/UnifiedSidebar';\nimport { AnimatedLogo")

    # The mobile overlay and aside
    sidebar_pattern = r"\{\/\* Mobile Overlay \*\/\}.*?</aside>"
    
    new_sidebar = """
      <UnifiedSidebar 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        customTabs={[
          ...sortedTabs.map(t => ({ id: t.id, label: t.label, icon: t.icon, activeBgClass: 'bg-teal-600 text-white shadow-md shadow-teal-500/10', onClick: () => setActiveTab(t.id), showCondition: true, badge: t.id === 'directives' ? unreadDirectivesCount : 0 })),
          { id: 'comprehensive_reports', label: 'التقارير المالية الشاملة', icon: FileSearch, activeBgClass: 'bg-amber-600 text-white shadow-md shadow-amber-500/10', iconColorClass: 'text-amber-500', onClick: () => setActiveTab('comprehensive_reports'), showCondition: hasPerm('viewComprehensiveFinancialReports') },
          { id: 'strategic', label: 'اللوحة الاستراتيجية', icon: TrendingUp, activeBgClass: 'bg-indigo-600 text-white shadow-md shadow-indigo-500/10', iconColorClass: 'text-indigo-500', onClick: () => setActiveTab('strategic'), showCondition: hasPerm('showMainDashboard') },
          { id: 'establishments', label: 'إدارة المنشآت', icon: Building, activeBgClass: 'bg-blue-600 text-white shadow-md shadow-blue-500/10', iconColorClass: 'text-blue-500', onClick: () => setActiveTab('establishments'), showCondition: hasPerm('manageEstablishments') },
          { id: 'ext_reports', label: 'تقارير الفرق الشاملة', icon: BarChart3, activeBgClass: 'bg-fuchsia-600 text-white shadow-md shadow-fuchsia-500/10', iconColorClass: 'text-fuchsia-500', onClick: () => setActiveTab('ext_reports'), showCondition: hasPerm('showReportsPage') },
          { id: 'ext_map', label: 'الخارطة الجغرافية', icon: FileSearch, activeBgClass: 'bg-emerald-600 text-white shadow-md shadow-emerald-500/10', iconColorClass: 'text-emerald-500', onClick: () => setActiveTab('ext_map'), showCondition: hasPerm('showSectorMap') },
          { id: 'ext_smart_tasks', label: 'المهام الذكية', icon: CheckCircle, activeBgClass: 'bg-violet-600 text-white shadow-md shadow-violet-500/10', iconColorClass: 'text-violet-500', onClick: () => setActiveTab('ext_smart_tasks'), showCondition: hasPerm('showSmartTasks') }
        ]}
      />
"""
    content = re.sub(sidebar_pattern, new_sidebar.strip(), content, flags=re.DOTALL)
    
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

if __name__ == "__main__":
    patch()
