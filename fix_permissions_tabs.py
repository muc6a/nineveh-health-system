import os
import re

def fix_constants():
    filepath = "src/utils/constants.jsx"
    if not os.path.exists(filepath): return
    
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # We need to replace the entire PERMISSIONS_TABS block
    old_block_pattern = r'export const PERMISSIONS_TABS = \[\s*\{ id: \'operations_room\'.*?\];'
    
    new_block = """export const PERMISSIONS_TABS = [
  { id: 'operations_room', label: 'غرفة العمليات المركزية', icon: <Target className="w-4 h-4 text-red-500"/>, keys: ['showOperationsRoom', 'authenticatePenalties', 'showFieldTeamsStats', 'issueFine', 'closeEst', 'reopenEst'] },
  { id: 'establishments', label: 'المنشآت', icon: <Building className="w-4 h-4"/>, keys: ['manageEstablishments', 'createEst', 'addEval', 'editEst', 'deleteEst'] },
  { id: 'complaints', label: 'الشكاوى', icon: <Compass className="w-4 h-4 text-rose-500"/>, keys: ['showPublicEvalsPage', 'showDeliveryPage'] },
  { id: 'lab', label: 'المختبر', icon: <Activity className="w-4 h-4 text-teal-500"/>, keys: ['receiveSamples', 'enterLabResults', 'editLabResults', 'labArchive', 'centralLabView'] },
  { id: 'financials', label: 'المالية', icon: <Activity className="w-4 h-4 text-emerald-500"/>, keys: ['financialReports', 'payFines', 'dailyInventory'] },
  { id: 'directives', label: 'التبليغات', icon: <Mail className="w-4 h-4"/>, keys: ['showDirectivesPage', 'sendDirective', 'replyDirective', 'quickTeamDispatch'] },
  { id: 'notifications', label: 'الإشعارات', icon: <Bell className="w-4 h-4 text-amber-500"/>, keys: ['notify_closures', 'notify_inspections', 'notify_directives'] },
  { id: 'advanced', label: 'الإدارة المتقدمة', icon: <Settings className="w-4 h-4"/>, keys: ['showMainDashboard', 'showReportsPage', 'exportData'] },
];"""

    content = re.sub(old_block_pattern, new_block, content, flags=re.DOTALL)
    
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
        
    print("Fixed PERMISSIONS_TABS in constants.jsx!")

if __name__ == "__main__":
    fix_constants()
