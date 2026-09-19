import re

def fix():
    path = "src/pages/LabDashboard.jsx"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Add imports for the other components
    imports = """import { TeamDashboard } from '../pages/TeamDashboard';
import SmartTasks from '../components/SmartTasks';
import OperationsRoom from '../components/OperationsRoom';
import { EstablishmentsManager } from '../components/EstablishmentsManager';
import { ShieldAlert, TrendingUp, Mail, Building, CheckCircle, Database } from 'lucide-react';
"""
    if "import { TeamDashboard }" not in content:
        content = content.replace("import { AnimatedLogo }", imports + "import { AnimatedLogo }")

    # 2. Update customTabs in UnifiedSidebar
    custom_tabs_pattern = r"customTabs=\{\[.*?\]\}"
    new_custom_tabs = """customTabs={[
          { id: 'stats', label: 'التقارير المختبرية والرقابية للعينات', icon: BarChart3, perm: 'viewLabReports', activeBgClass: 'bg-indigo-600 text-white shadow-md shadow-indigo-500/10', iconColorClass: 'text-indigo-500', onClick: () => setActiveTab('stats'), showCondition: hasPerm('viewLabReports') },
          { id: 'incoming', label: 'استلام العينات', icon: Clock, perm: 'receiveSamples', badge: incomingReqs.length, activeBgClass: 'bg-indigo-600 text-white shadow-md shadow-indigo-500/10', iconColorClass: 'text-amber-500', onClick: () => setActiveTab('incoming'), showCondition: hasPerm('receiveSamples') },
          { id: 'testing', label: 'إدخال نتائج الفحص', icon: FlaskConical, perm: 'enterLabResults', badge: testingReqs.length, activeBgClass: 'bg-indigo-600 text-white shadow-md shadow-indigo-500/10', iconColorClass: 'text-indigo-500', onClick: () => setActiveTab('testing'), showCondition: hasPerm('enterLabResults') },
          { id: 'archive', label: 'الأرشيف المختبري', icon: Archive, perm: 'labArchive', activeBgClass: 'bg-indigo-600 text-white shadow-md shadow-indigo-500/10', iconColorClass: 'text-slate-500', onClick: () => setActiveTab('archive'), showCondition: hasPerm('labArchive') },
          
          { id: 'strategic', label: 'الإدارة المتقدمة', icon: TrendingUp, activeBgClass: 'bg-teal-600 text-white shadow-md shadow-teal-500/20', onClick: () => setActiveTab('strategic'), showCondition: hasPerm('showMainDashboard') || hasPerm('showReportsPage') },
          { id: 'smart_tasks', label: 'المهام الذكية', icon: CheckCircle, iconColorClass: 'text-blue-500', activeBgClass: 'bg-blue-600 text-white shadow-md shadow-blue-500/10', onClick: () => setActiveTab('smart_tasks'), showCondition: hasPerm('manageSmartTasks') || hasPerm('executeSmartTasks') },
          { id: 'operations_room', label: 'غرفة العمليات المركزية', icon: ShieldAlert, iconColorClass: 'text-fuchsia-500', activeBgClass: 'bg-fuchsia-600 text-white shadow-md shadow-fuchsia-500/10', onClick: () => setActiveTab('operations_room'), showCondition: hasPerm('authenticatePenalties') },
          { id: 'directives', label: 'التبليغات', icon: Mail, iconColorClass: 'text-amber-500', activeBgClass: 'bg-amber-600 text-white shadow-md shadow-amber-500/10', onClick: () => setActiveTab('directives'), showCondition: hasPerm('showDirectivesPage') || hasPerm('sendDirective') || hasPerm('replyDirective') },
          { id: 'complaints', label: 'الشكاوى', icon: ShieldAlert, iconColorClass: 'text-red-500', activeBgClass: 'bg-red-600 text-white shadow-md shadow-red-500/10', onClick: () => setActiveTab('complaints'), showCondition: hasPerm('showPublicEvalsPage') || hasPerm('showDeliveryPage') },
          { id: 'establishments', label: 'إدارة المنشآت', icon: Building, iconColorClass: 'text-blue-500', activeBgClass: 'bg-blue-600 text-white shadow-md shadow-blue-500/10', onClick: () => setActiveTab('establishments'), showCondition: hasPerm('manageEstablishments') }
        ]}"""
    content = re.sub(custom_tabs_pattern, new_custom_tabs, content, flags=re.DOTALL)

    # 3. Add renders
    # Find {activeTab === 'archive' && hasPerm('labArchive') && (
    # And insert after its closing div. But let's just insert before </main>
    render_blocks = """
            {activeTab === 'strategic' && <TeamDashboard embeddedTab="strategic" />}
            {activeTab === 'smart_tasks' && <div className="w-full h-full min-h-[85vh]"><SmartTasks /></div>}
            {activeTab === 'operations_room' && <div className="w-full h-full min-h-[85vh]"><OperationsRoom /></div>}
            {activeTab === 'establishments' && <div className="w-full h-full min-h-[85vh]"><EstablishmentsManager /></div>}
            {activeTab === 'directives' && <TeamDashboard embeddedTab="directives" />}
            {activeTab === 'complaints' && <TeamDashboard embeddedTab="complaints" />}
    """
    
    # Let's place it right before `</main>`
    if "{activeTab === 'strategic'" not in content:
        content = content.replace("</main>", render_blocks + "\n      </main>")

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

if __name__ == "__main__":
    fix()
