import re

# We will use exactly these standard IDs globally:
# stats, incoming, testing, archive
# financials, ext_financials, reconciliation, comprehensive_reports
# strategic, smart_tasks, operations_room, directives, complaints, establishments

custom_tabs_str = """customTabs={[
          { id: 'stats', label: 'التقارير المختبرية والرقابية', icon: BarChart3, perm: 'viewLabReports', activeBgClass: 'bg-indigo-600 text-white shadow-md shadow-indigo-500/10', iconColorClass: 'text-indigo-500', onClick: () => setActiveTab('stats'), showCondition: hasPerm('viewLabReports') },
          { id: 'incoming', label: 'استلام العينات', icon: Clock, perm: 'receiveSamples', activeBgClass: 'bg-indigo-600 text-white shadow-md shadow-indigo-500/10', iconColorClass: 'text-amber-500', onClick: () => setActiveTab('incoming'), showCondition: hasPerm('receiveSamples') },
          { id: 'testing', label: 'إدخال نتائج الفحص', icon: FlaskConical, perm: 'enterLabResults', activeBgClass: 'bg-indigo-600 text-white shadow-md shadow-indigo-500/10', iconColorClass: 'text-indigo-500', onClick: () => setActiveTab('testing'), showCondition: hasPerm('enterLabResults') },
          { id: 'archive', label: 'الأرشيف المختبري', icon: Archive, perm: 'labArchive', activeBgClass: 'bg-indigo-600 text-white shadow-md shadow-indigo-500/10', iconColorClass: 'text-slate-500', onClick: () => setActiveTab('archive'), showCondition: hasPerm('labArchive') },
          
          { id: 'financials', label: 'التقارير المالية', icon: LayoutDashboard, perm: 'financialReports', activeBgClass: 'bg-emerald-600 text-white shadow-md shadow-emerald-500/10', iconColorClass: 'text-emerald-500', onClick: () => setActiveTab('financials'), showCondition: hasPerm('financialReports') },
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
    if (activeTab === 'financials' && canSeeDashboard) isAllowed = true;
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
       else if (canSeeDashboard) setActiveTab('financials');
       else if (canSeeFines) setActiveTab('ext_financials');
       else if (canSeeInventory) setActiveTab('reconciliation');
       else if (canSeeCompReports) setActiveTab('comprehensive_reports');
       else if (canSeeStrategic) setActiveTab('strategic');
       else if (canSeeSmartTasks) setActiveTab('smart_tasks');
       else if (canSeeOps) setActiveTab('operations_room');
       else if (canSeeDirectives) setActiveTab('directives');
       else if (canSeeComplaints) setActiveTab('complaints');
       else if (canSeeEst) setActiveTab('establishments');
    }
  }, [user?.permissions, activeTab]);"""

def process_file(path, is_lab):
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
        
    # Replace customTabs block entirely
    content = re.sub(r"customTabs=\{.*?\]\}", custom_tabs_str, content, flags=re.DOTALL)
    
    # Replace useEffect fallback block
    content = re.sub(r"React\.useEffect\(\(\) => \{\s*let isAllowed = false;.*?setActiveTab\('establishments'\);\s*\}\s*\}\s*\}, \[user\?\.permissions, activeTab\]\);", new_fallback, content, flags=re.DOTALL)

    # REMOVE any old appended dummy renders that clash with native ones
    # (Since we might have appended them at the bottom of the <main> tag previously)
    junk_patterns = [
        r"\{activeTab === 'stats' && <div className=\"w-full h-full min-h-\[85vh\]\"><LabManager /></div>\}",
        r"\{activeTab === 'incoming' && <div className=\"w-full h-full min-h-\[85vh\]\"><LabManager /></div>\}",
        r"\{activeTab === 'testing' && <div className=\"w-full h-full min-h-\[85vh\]\"><LabManager /></div>\}",
        r"\{activeTab === 'archive' && <div className=\"w-full h-full min-h-\[85vh\]\"><LabManager /></div>\}",
        r"\{activeTab === 'dashboard' && <div className=\"w-full h-full min-h-\[85vh\]\"><FinancialReports /></div>\}",
        r"\{activeTab === 'financials' && <div className=\"w-full h-full min-h-\[85vh\]\"><FinancialReports /></div>\}",
        r"\{activeTab === 'ext_financials' && <div className=\"w-full h-full min-h-\[85vh\]\"><FinancialReports /></div>\}",
        r"\{activeTab === 'reconciliation' && <div className=\"w-full h-full min-h-\[85vh\]\"><FinancialReports /></div>\}",
        r"\{activeTab === 'comprehensive_reports' && <div className=\"w-full h-full min-h-\[85vh\]\"><FinancialReports /></div>\}",
        r"\{activeTab === 'strategic' && <TeamDashboard embeddedTab=\"strategic\" />\}",
        r"\{activeTab === 'smart_tasks' && <div className=\"w-full h-full min-h-\[85vh\]\"><SmartTasks /></div>\}",
        r"\{activeTab === 'operations_room' && <div className=\"w-full h-full min-h-\[85vh\]\"><OperationsRoom /></div>\}",
        r"\{activeTab === 'establishments' && <div className=\"w-full h-full min-h-\[85vh\]\"><EstablishmentsManager /></div>\}",
        r"\{activeTab === 'directives' && <TeamDashboard embeddedTab=\"directives\" />\}",
        r"\{activeTab === 'complaints' && <TeamDashboard embeddedTab=\"complaints\" />\}"
    ]
    
    for pattern in junk_patterns:
        # Some are there multiple times, remove all of them
        content = re.sub(pattern + r"\n?", "", content)
        
    # Standardize specific old tab IDs to the new global ones in the existing native code
    # AccountantPanel had ext_smart_tasks
    content = content.replace('activeTab === "ext_smart_tasks"', 'activeTab === "smart_tasks"')
    
    # We will now ONLY append what the component TRULY lacks!
    # If it's LabDashboard, it lacks: financials, ext_financials, reconciliation, comprehensive_reports
    # operations_room, establishments, smart_tasks, strategic, directives, complaints.
    if is_lab:
        append_str = """
            {activeTab === 'financials' && <div className="w-full h-full min-h-[85vh]"><FinancialReports /></div>}
            {activeTab === 'ext_financials' && <div className="w-full h-full min-h-[85vh]"><FinancialReports /></div>}
            {activeTab === 'reconciliation' && <div className="w-full h-full min-h-[85vh]"><FinancialReports /></div>}
            {activeTab === 'comprehensive_reports' && <div className="w-full h-full min-h-[85vh]"><FinancialReports /></div>}
            
            {activeTab === 'strategic' && <TeamDashboard embeddedTab="strategic" />}
            {activeTab === 'smart_tasks' && <div className="w-full h-full min-h-[85vh]"><SmartTasks /></div>}
            {activeTab === 'operations_room' && <div className="w-full h-full min-h-[85vh]"><OperationsRoom /></div>}
            {activeTab === 'establishments' && <div className="w-full h-full min-h-[85vh]"><EstablishmentsManager /></div>}
            {activeTab === 'directives' && <TeamDashboard embeddedTab="directives" />}
            {activeTab === 'complaints' && <TeamDashboard embeddedTab="complaints" />}
"""
        content = content.replace("</main>", append_str + "\n      </main>")
        
    else:
        # If it's AccountantPanel, it lacks: stats, incoming, testing, archive,
        # operations_room, complaints? Wait, AccountantPanel ALREADY HAS inline code for strategic, directives, establishments!
        # Let's append only what it LACKS to avoid duplicates.
        append_str = """
            {activeTab === 'stats' && <div className="w-full h-full min-h-[85vh]"><LabManager /></div>}
            {activeTab === 'incoming' && <div className="w-full h-full min-h-[85vh]"><LabManager /></div>}
            {activeTab === 'testing' && <div className="w-full h-full min-h-[85vh]"><LabManager /></div>}
            {activeTab === 'archive' && <div className="w-full h-full min-h-[85vh]"><LabManager /></div>}
            
            {activeTab === 'operations_room' && <div className="w-full h-full min-h-[85vh]"><OperationsRoom /></div>}
            {activeTab === 'complaints' && <TeamDashboard embeddedTab="complaints" />}
"""
        # Note: AccountantPanel HAS activeTab === "strategic", activeTab === "establishments", activeTab === "directives", activeTab === "smart_tasks" (via replacing ext_smart_tasks).
        content = content.replace("</main>", append_str + "\n      </main>")

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

process_file("src/pages/LabDashboard.jsx", True)
process_file("src/pages/AccountantPanel.jsx", False)
