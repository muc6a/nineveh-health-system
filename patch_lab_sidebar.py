import re

def patch():
    path = "src/pages/LabDashboard.jsx"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # Import UnifiedSidebar and icons (if not imported)
    if "import UnifiedSidebar" not in content:
        content = content.replace("import { AppContext }", "import { AppContext } from '../context/AppContext';\nimport UnifiedSidebar from '../components/UnifiedSidebar';")

    # Replace <aside> ... </aside>
    sidebar_pattern = r"\{\/\* Mobile Overlay \*\/\}.*?</aside>"
    
    # We must provide the correct icons from lucide-react. The unified sidebar imports them?
    # Wait, UnifiedSidebar renders `<tab.icon />`. We need to pass the actual React components in customTabs!
    # Let's import the icons in UnifiedSidebar? No, customTabs can just pass the components.
    # In LabDashboard, we have BarChart3, Clock, FlaskConical, Archive.
    
    new_sidebar = """
      <UnifiedSidebar 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        customTabs={[
          { id: 'stats', label: 'التقارير المختبرية والرقابية للعينات', icon: BarChart3, perm: 'viewLabReports', activeBgClass: 'bg-indigo-600 text-white shadow-md shadow-indigo-500/10', iconColorClass: 'text-indigo-500', onClick: () => setActiveTab('stats'), showCondition: hasPerm('viewLabReports') },
          { id: 'incoming', label: 'استلام العينات', icon: Clock, perm: 'receiveSamples', badge: incomingReqs.length, activeBgClass: 'bg-indigo-600 text-white shadow-md shadow-indigo-500/10', iconColorClass: 'text-amber-500', onClick: () => setActiveTab('incoming'), showCondition: hasPerm('receiveSamples') },
          { id: 'testing', label: 'إدخال نتائج الفحص', icon: FlaskConical, perm: 'enterLabResults', badge: testingReqs.length, activeBgClass: 'bg-indigo-600 text-white shadow-md shadow-indigo-500/10', iconColorClass: 'text-indigo-500', onClick: () => setActiveTab('testing'), showCondition: hasPerm('enterLabResults') },
          { id: 'archive', label: 'الأرشيف المختبري', icon: Archive, perm: 'labArchive', activeBgClass: 'bg-indigo-600 text-white shadow-md shadow-indigo-500/10', iconColorClass: 'text-slate-500', onClick: () => setActiveTab('archive'), showCondition: hasPerm('labArchive') }
        ]}
      />
"""
    content = re.sub(sidebar_pattern, new_sidebar.strip(), content, flags=re.DOTALL)
    
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

if __name__ == "__main__":
    patch()
