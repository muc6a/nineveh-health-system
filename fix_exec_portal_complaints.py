import re

with open('src/pages/ExecutivePortal.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Merge Complaints
old_complaints = """                complaints_public: {
                  label: 'شكاوى المواطنين',
                  icon: ShieldAlert,
                  iconColorClass: 'text-red-500',
                  activeBgClass: 'bg-red-600 text-white shadow-md shadow-red-500/10',
                  permission: 'showPublicEvalsPage',
                  onClick: () => { setExecutiveTab('dashboard'); setActiveTab('complaints'); },
                  isActive: executiveTab === 'dashboard' && activeTab === 'complaints',
                  showCondition: true
                },
                complaints_delivery: {
                  label: 'شكاوى خدمة التوصيل',
                  icon: ShieldAlert,
                  iconColorClass: 'text-red-500',
                  activeBgClass: 'bg-red-600 text-white shadow-md shadow-red-500/10',
                  permission: 'showDeliveryPage',
                  onClick: () => { setExecutiveTab('dashboard'); setActiveTab('complaints'); },
                  isActive: executiveTab === 'dashboard' && activeTab === 'complaints',
                  showCondition: true
                },"""

new_complaints = """                complaints: {
                  label: 'الشكاوى',
                  icon: ShieldAlert,
                  iconColorClass: 'text-red-500',
                  activeBgClass: 'bg-red-600 text-white shadow-md shadow-red-500/10',
                  permission: null,
                  onClick: () => { setExecutiveTab('dashboard'); setActiveTab('complaints'); },
                  isActive: executiveTab === 'dashboard' && activeTab === 'complaints',
                  showCondition: hasPerm('showPublicEvalsPage') || hasPerm('showDeliveryPage')
                },"""

content = content.replace(old_complaints, new_complaints)


# Merge Dashboard and Map into Advanced Management
old_adv = """                summary: {
                  label: PERMISSIONS_TABS.find(t => t.id === 'advanced')?.label || 'اللوحة الاستراتيجية',
                  icon: LayoutDashboard,
                  iconColorClass: 'text-indigo-500',
                  activeBgClass: 'bg-indigo-600 text-white shadow-md shadow-indigo-500/10',
                  permission: 'showMainDashboard',
                  onClick: () => { setExecutiveTab('dashboard'); setActiveTab('summary'); },
                  isActive: executiveTab === 'dashboard' && activeTab === 'summary',
                  showCondition: true
                },
                team_reports: {
                  label: PERMISSIONS_TABS.find(t => t.id === 'reports')?.label || 'تقارير اللجان',
                  icon: FileText,
                  iconColorClass: 'text-blue-500',
                  activeBgClass: 'bg-blue-600 text-white shadow-md shadow-blue-500/10',
                  permission: 'showFieldTeamsStats',
                  onClick: () => { 
                    setExecutiveTab('dashboard'); 
                    setActiveTab('team_reports'); 
                    if(allowedTeams.length > 0) {
                      setSelectedTeamId(allowedTeams[0].id);
                    }
                  },
                  isActive: executiveTab === 'dashboard' && activeTab === 'team_reports',
                  showCondition: allowedTeams.length > 0
                },
                operations_room: {
                  label: PERMISSIONS_TABS.find(t => t.id === 'operations_room')?.label || 'غرفة العمليات المركزية',
                  icon: ShieldAlert,
                  iconColorClass: 'text-fuchsia-500',
                  activeBgClass: 'bg-fuchsia-600 text-white shadow-md shadow-fuchsia-500/10',
                  permission: 'showOperationsRoom',
                  onClick: () => { setExecutiveTab('dashboard'); setActiveTab('operations_room'); },
                  isActive: executiveTab === 'dashboard' && activeTab === 'operations_room',
                  showCondition: true
                },
                geographic: {
                  label: 'الخريطة الجغرافية',
                  icon: Map,
                  iconColorClass: 'text-emerald-500',
                  activeBgClass: 'bg-teal-600 text-white shadow-md shadow-teal-500/10',
                  permission: 'showReportsPage',
                  onClick: () => { setExecutiveTab('dashboard'); setActiveTab('geographic'); },
                  isActive: executiveTab === 'dashboard' && activeTab === 'geographic',
                  showCondition: true
                },"""

new_adv = """                advanced_management: {
                  label: 'الإدارة المتقدمة',
                  icon: LayoutDashboard,
                  iconColorClass: 'text-indigo-500',
                  activeBgClass: 'bg-indigo-600 text-white shadow-md shadow-indigo-500/10',
                  permission: null,
                  onClick: () => { setExecutiveTab('dashboard'); setActiveTab('summary'); },
                  isActive: executiveTab === 'dashboard' && (activeTab === 'summary' || activeTab === 'geographic'),
                  showCondition: hasPerm('showMainDashboard') || hasPerm('showReportsPage')
                },
                team_reports: {
                  label: PERMISSIONS_TABS.find(t => t.id === 'reports')?.label || 'تقارير اللجان',
                  icon: FileText,
                  iconColorClass: 'text-blue-500',
                  activeBgClass: 'bg-blue-600 text-white shadow-md shadow-blue-500/10',
                  permission: 'showFieldTeamsStats',
                  onClick: () => { 
                    setExecutiveTab('dashboard'); 
                    setActiveTab('team_reports'); 
                    if(allowedTeams.length > 0) {
                      setSelectedTeamId(allowedTeams[0].id);
                    }
                  },
                  isActive: executiveTab === 'dashboard' && activeTab === 'team_reports',
                  showCondition: allowedTeams.length > 0
                },
                operations_room: {
                  label: PERMISSIONS_TABS.find(t => t.id === 'operations_room')?.label || 'غرفة العمليات المركزية',
                  icon: ShieldAlert,
                  iconColorClass: 'text-fuchsia-500',
                  activeBgClass: 'bg-fuchsia-600 text-white shadow-md shadow-fuchsia-500/10',
                  permission: 'showOperationsRoom',
                  onClick: () => { setExecutiveTab('dashboard'); setActiveTab('operations_room'); },
                  isActive: executiveTab === 'dashboard' && activeTab === 'operations_room',
                  showCondition: true
                },"""

content = content.replace(old_adv, new_adv)

with open('src/pages/ExecutivePortal.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated ExecutivePortal Sidebar")
