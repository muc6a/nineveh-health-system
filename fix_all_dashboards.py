import re

def fix():
    # The universal customTabs block we want for both
    custom_tabs_str = """customTabs={[
          { id: 'stats', label: 'التقارير المختبرية والرقابية', icon: BarChart3, perm: 'viewLabReports', activeBgClass: 'bg-indigo-600 text-white shadow-md shadow-indigo-500/10', iconColorClass: 'text-indigo-500', onClick: () => setActiveTab('stats'), showCondition: hasPerm('viewLabReports') },
          { id: 'incoming', label: 'استلام العينات', icon: Clock, perm: 'receiveSamples', activeBgClass: 'bg-indigo-600 text-white shadow-md shadow-indigo-500/10', iconColorClass: 'text-amber-500', onClick: () => setActiveTab('incoming'), showCondition: hasPerm('receiveSamples') },
          { id: 'testing', label: 'إدخال نتائج الفحص', icon: FlaskConical, perm: 'enterLabResults', activeBgClass: 'bg-indigo-600 text-white shadow-md shadow-indigo-500/10', iconColorClass: 'text-indigo-500', onClick: () => setActiveTab('testing'), showCondition: hasPerm('enterLabResults') },
          { id: 'archive', label: 'الأرشيف المختبري', icon: Archive, perm: 'labArchive', activeBgClass: 'bg-indigo-600 text-white shadow-md shadow-indigo-500/10', iconColorClass: 'text-slate-500', onClick: () => setActiveTab('archive'), showCondition: hasPerm('labArchive') },
          
          { id: 'dashboard', label: 'التقارير المالية', icon: LayoutDashboard, perm: 'financialReports', activeBgClass: 'bg-emerald-600 text-white shadow-md shadow-emerald-500/10', iconColorClass: 'text-emerald-500', onClick: () => setActiveTab('dashboard'), showCondition: hasPerm('financialReports') },
          { id: 'ext_financials', label: 'الغرامات والإيرادات', icon: CreditCard, perm: 'payFines', activeBgClass: 'bg-emerald-600 text-white shadow-md shadow-emerald-500/10', iconColorClass: 'text-emerald-500', onClick: () => setActiveTab('ext_financials'), showCondition: hasPerm('payFines') },
          { id: 'reconciliation', label: 'جرد اليومية والمطابقة', icon: ClipboardList, perm: 'dailyInventory', activeBgClass: 'bg-emerald-600 text-white shadow-md shadow-emerald-500/10', iconColorClass: 'text-emerald-500', onClick: () => setActiveTab('reconciliation'), showCondition: hasPerm('dailyInventory') },
          { id: 'comprehensive_reports', label: 'التقارير المالية الشاملة', icon: FileSearch, perm: 'viewComprehensiveFinancialReports', activeBgClass: 'bg-amber-600 text-white shadow-md shadow-amber-500/10', iconColorClass: 'text-amber-500', onClick: () => setActiveTab('comprehensive_reports'), showCondition: hasPerm('viewComprehensiveFinancialReports') },
          
          { id: 'strategic', label: 'الإدارة المتقدمة', icon: TrendingUp, activeBgClass: 'bg-teal-600 text-white shadow-md shadow-teal-500/20', onClick: () => setActiveTab('strategic'), showCondition: hasPerm('showMainDashboard') || hasPerm('showReportsPage') },
          { id: 'smart_tasks', label: 'المهام الذكية', icon: CheckCircle, iconColorClass: 'text-blue-500', activeBgClass: 'bg-blue-600 text-white shadow-md shadow-blue-500/10', onClick: () => setActiveTab('smart_tasks'), showCondition: hasPerm('manageSmartTasks') || hasPerm('executeSmartTasks') },
          { id: 'operations_room', label: 'غرفة العمليات المركزية', icon: ShieldAlert, iconColorClass: 'text-fuchsia-500', activeBgClass: 'bg-fuchsia-600 text-white shadow-md shadow-fuchsia-500/10', onClick: () => setActiveTab('operations_room'), showCondition: hasPerm('authenticatePenalties') },
          { id: 'directives', label: 'التبليغات', icon: Mail, iconColorClass: 'text-amber-500', activeBgClass: 'bg-amber-600 text-white shadow-md shadow-amber-500/10', onClick: () => setActiveTab('directives'), showCondition: hasPerm('showDirectivesPage') || hasPerm('sendDirective') || hasPerm('replyDirective') },
          { id: 'complaints', label: 'الشكاوى', icon: ShieldAlert, iconColorClass: 'text-red-500', activeBgClass: 'bg-red-600 text-white shadow-md shadow-red-500/10', onClick: () => setActiveTab('complaints'), showCondition: hasPerm('showPublicEvalsPage') || hasPerm('showDeliveryPage') },
          { id: 'establishments', label: 'إدارة المنشآت', icon: Building, iconColorClass: 'text-blue-500', activeBgClass: 'bg-blue-600 text-white shadow-md shadow-blue-500/10', onClick: () => setActiveTab('establishments'), showCondition: hasPerm('manageEstablishments') }
        ]}"""

    # We need to make sure the dashboards import these missing components:
    # TeamDashboard, SmartTasks, OperationsRoom, EstablishmentsManager
    # FinancialReports, LabManager
    imports_str = """
import { TeamDashboard } from '../pages/TeamDashboard';
import SmartTasks from '../components/SmartTasks';
import OperationsRoom from '../components/OperationsRoom';
import { EstablishmentsManager } from '../components/EstablishmentsManager';
import { FinancialReports } from '../components/FinancialReports';
import { LabManager } from '../components/LabManager';
import { ShieldAlert, TrendingUp, Mail, Building, CheckCircle, Database, BarChart3, Clock, FlaskConical, Archive, LayoutDashboard, CreditCard, ClipboardList, FileSearch } from 'lucide-react';
"""

    def process_file(path, fallback_additions, render_additions):
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()
            
        # Add imports
        if "TeamDashboard" not in content:
            content = content.replace("import { AnimatedLogo }", imports_str + "\nimport { AnimatedLogo }")

        # Update customTabs block
        custom_tabs_pattern = r"customTabs=\{\[.*?\]\}"
        content = re.sub(custom_tabs_pattern, custom_tabs_str, content, flags=re.DOTALL)
        
        # Add fallback additions if any
        # Wait, the fallback logic:
        # React.useEffect(() => { let isAllowed = false; ... }
        # Let's just completely replace the useEffect fallback logic in both to cover EVERYTHING!
        fallback_pattern = r"React\.useEffect\(\(\) => \{\s*let isAllowed = false;.*?setActiveTab\('archive'\);\s*\}\s*\}\s*\}, \[user\?\.permissions, activeTab\]\);"
        new_fallback = """React.useEffect(() => {
    let isAllowed = false;
    const canSeeStats = hasPerm('viewLabReports');
    const canSeeIncoming = hasPerm('receiveSamples');
    const canSeeTesting = hasPerm('enterLabResults');
    const canSeeArchive = hasPerm('labArchive');
    
    const canSeeDashboard = hasPerm('financialReports');
    const canSeeFines = hasPerm('payFines');
    const canSeeInventory = hasPerm('dailyInventory');
    const canSeeCompReports = hasPerm('viewComprehensiveFinancialReports');
    
    const canSeeStrategic = hasPerm('showMainDashboard') || hasPerm('showReportsPage');
    const canSeeSmartTasks = hasPerm('manageSmartTasks') || hasPerm('executeSmartTasks');
    const canSeeOps = hasPerm('authenticatePenalties');
    const canSeeDirectives = hasPerm('showDirectivesPage') || hasPerm('sendDirective') || hasPerm('replyDirective');
    const canSeeComplaints = hasPerm('showPublicEvalsPage') || hasPerm('showDeliveryPage');
    const canSeeEst = hasPerm('manageEstablishments');

    if (activeTab === 'stats' && canSeeStats) isAllowed = true;
    if (activeTab === 'incoming' && canSeeIncoming) isAllowed = true;
    if (activeTab === 'testing' && canSeeTesting) isAllowed = true;
    if (activeTab === 'archive' && canSeeArchive) isAllowed = true;
    if (activeTab === 'dashboard' && canSeeDashboard) isAllowed = true;
    if (activeTab === 'ext_financials' && canSeeFines) isAllowed = true;
    if (activeTab === 'reconciliation' && canSeeInventory) isAllowed = true;
    if (activeTab === 'comprehensive_reports' && canSeeCompReports) isAllowed = true;
    if (activeTab === 'strategic' && canSeeStrategic) isAllowed = true;
    if (activeTab === 'smart_tasks' && canSeeSmartTasks) isAllowed = true;
    if (activeTab === 'operations_room' && canSeeOps) isAllowed = true;
    if (activeTab === 'directives' && canSeeDirectives) isAllowed = true;
    if (activeTab === 'complaints' && canSeeComplaints) isAllowed = true;
    if (activeTab === 'establishments' && canSeeEst) isAllowed = true;

    if (!isAllowed) {
       if (canSeeStats) setActiveTab('stats');
       else if (canSeeIncoming) setActiveTab('incoming');
       else if (canSeeTesting) setActiveTab('testing');
       else if (canSeeArchive) setActiveTab('archive');
       else if (canSeeDashboard) setActiveTab('dashboard');
       else if (canSeeFines) setActiveTab('ext_financials');
       else if (canSeeInventory) setActiveTab('reconciliation');
       else if (canSeeStrategic) setActiveTab('strategic');
       else if (canSeeOps) setActiveTab('operations_room');
       else if (canSeeDirectives) setActiveTab('directives');
       else if (canSeeComplaints) setActiveTab('complaints');
       else if (canSeeEst) setActiveTab('establishments');
    }
  }, [user?.permissions, activeTab]);"""
        if "React.useEffect(() => {\n    let isAllowed = false;" in content:
            content = re.sub(r"React\.useEffect\(\(\) => \{\s*let isAllowed = false;.*?\}\s*\}, \[user\?\.permissions, activeTab\]\);", new_fallback, content, flags=re.DOTALL)

        # Add renders
        if render_additions not in content:
            content = content.replace("</main>", render_additions + "\n      </main>")
            
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)

    # For LabDashboard, we need to add Accountant renders and Executive renders
    lab_renders = """
            {activeTab === 'strategic' && <TeamDashboard embeddedTab="strategic" />}
            {activeTab === 'smart_tasks' && <div className="w-full h-full min-h-[85vh]"><SmartTasks /></div>}
            {activeTab === 'operations_room' && <div className="w-full h-full min-h-[85vh]"><OperationsRoom /></div>}
            {activeTab === 'establishments' && <div className="w-full h-full min-h-[85vh]"><EstablishmentsManager /></div>}
            {activeTab === 'directives' && <TeamDashboard embeddedTab="directives" />}
            {activeTab === 'complaints' && <TeamDashboard embeddedTab="complaints" />}
            
            {activeTab === 'dashboard' && <div className="w-full h-full min-h-[85vh]"><FinancialReports /></div>}
            {activeTab === 'ext_financials' && <div className="w-full h-full min-h-[85vh]"><FinancialReports /></div>}
            {activeTab === 'reconciliation' && <div className="w-full h-full min-h-[85vh]"><FinancialReports /></div>}
            {activeTab === 'comprehensive_reports' && <div className="w-full h-full min-h-[85vh]"><FinancialReports /></div>}
    """
    
    process_file("src/pages/LabDashboard.jsx", "", lab_renders)
    
    # For AccountantPanel, we need to add Lab renders and Executive renders
    acc_renders = """
            {activeTab === 'stats' && <div className="w-full h-full min-h-[85vh]"><LabManager /></div>}
            {activeTab === 'incoming' && <div className="w-full h-full min-h-[85vh]"><LabManager /></div>}
            {activeTab === 'testing' && <div className="w-full h-full min-h-[85vh]"><LabManager /></div>}
            {activeTab === 'archive' && <div className="w-full h-full min-h-[85vh]"><LabManager /></div>}
            
            {activeTab === 'strategic' && <TeamDashboard embeddedTab="strategic" />}
            {activeTab === 'smart_tasks' && <div className="w-full h-full min-h-[85vh]"><SmartTasks /></div>}
            {activeTab === 'operations_room' && <div className="w-full h-full min-h-[85vh]"><OperationsRoom /></div>}
            {activeTab === 'establishments' && <div className="w-full h-full min-h-[85vh]"><EstablishmentsManager /></div>}
            {activeTab === 'directives' && <TeamDashboard embeddedTab="directives" />}
            {activeTab === 'complaints' && <TeamDashboard embeddedTab="complaints" />}
    """
    
    process_file("src/pages/AccountantPanel.jsx", "", acc_renders)

if __name__ == "__main__":
    fix()
