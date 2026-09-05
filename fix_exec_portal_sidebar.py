import re

with open('src/pages/ExecutivePortal.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace single button for complaints with two buttons for Public and Delivery Evals
old_complaints = """                complaints: {
                  label: PERMISSIONS_TABS.find(t => t.id === 'complaints')?.label || 'الشكاوى',
                  icon: ShieldAlert,
                  iconColorClass: 'text-red-500',
                  activeBgClass: 'bg-red-600 text-white shadow-md shadow-red-500/10',
                  permission: null,
                  onClick: () => { setExecutiveTab('dashboard'); setActiveTab('complaints'); },
                  isActive: executiveTab === 'dashboard' && activeTab === 'complaints',
                  showCondition: hasPerm('showPublicEvalsPage') || hasPerm('showDeliveryPage')
                },"""

new_complaints = """                complaints_public: {
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

content = content.replace(old_complaints, new_complaints)

# Lab Results
old_lab_res = """                lab_results: {
                  label: PERMISSIONS_TABS.find(t => t.id === 'lab')?.label || 'المختبر',
                  icon: FlaskConical,
                  iconColorClass: 'text-fuchsia-500',
                  activeBgClass: 'bg-fuchsia-600 text-white shadow-md shadow-fuchsia-500/10',
                  permission: null,
                  onClick: () => { setExecutiveTab('dashboard'); setActiveTab('lab_results'); },
                  isActive: executiveTab === 'dashboard' && activeTab === 'lab_results',
                  showCondition: hasPerm('receiveSamples') || hasPerm('enterLabResults') || hasPerm('labArchive')
                },"""

new_lab_res = """                lab_decisions: {
                  label: 'قرارات المختبر',
                  icon: FlaskConical,
                  iconColorClass: 'text-fuchsia-500',
                  activeBgClass: 'bg-fuchsia-600 text-white shadow-md shadow-fuchsia-500/10',
                  permission: 'authenticatePenalties',
                  onClick: () => { setExecutiveTab('dashboard'); setActiveTab('lab_results'); },
                  isActive: executiveTab === 'dashboard' && activeTab === 'lab_results',
                  showCondition: true
                },
                lab_dashboard: {
                  label: 'إدارة المختبر',
                  icon: FlaskConical,
                  iconColorClass: 'text-indigo-500',
                  activeBgClass: 'bg-indigo-600 text-white shadow-md shadow-indigo-500/10',
                  permission: null,
                  onClick: () => { window.location.hash = '/dashboard/lab'; },
                  isActive: false,
                  showCondition: hasPerm('receiveSamples') || hasPerm('enterLabResults') || hasPerm('labArchive')
                },"""

content = content.replace(old_lab_res, new_lab_res)

with open('src/pages/ExecutivePortal.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated ExecutivePortal Sidebar")
