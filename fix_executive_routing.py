import re

with open("src/pages/ExecutivePortal.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# Fix the needsRedirect bug
old_redirect = """    if (activeTab === 'operations_room' && !hasPerm('receiveSamples') || hasPerm('enterLabResults') || hasPerm('labArchive')) needsRedirect = true;"""
new_redirect = """    if (activeTab === 'operations_room' && !hasPerm('showOperationsRoom')) needsRedirect = true;
    if (activeTab === 'lab_management' && !(hasPerm('receiveSamples') || hasPerm('enterLabResults') || hasPerm('labArchive'))) needsRedirect = true;
    if (activeTab === 'financials' && !(hasPerm('financialReports') || hasPerm('payFines') || hasPerm('dailyInventory'))) needsRedirect = true;"""
content = content.replace(old_redirect, new_redirect)

# Fix the duplicate tabs in tabConfig
old_lab_decisions = """                lab_decisions: {
                  label: 'قرارات المختبر',
                  icon: FlaskConical,
                  iconColorClass: 'text-fuchsia-500',
                  activeBgClass: 'bg-fuchsia-600 text-white shadow-md shadow-fuchsia-500/10',
                  permission: 'authenticatePenalties',
                  onClick: () => { setExecutiveTab('dashboard'); setActiveTab('lab_results'); },
                  isActive: executiveTab === 'dashboard' && activeTab === 'lab_results',
                  showCondition: true
                },
                lab_management: {
                  label: 'المختبر',
                  icon: FlaskConical,
                  iconColorClass: 'text-indigo-500',
                  activeBgClass: 'bg-indigo-600 text-white shadow-md shadow-indigo-500/10',
                  permission: null,
                  onClick: () => { setExecutiveTab('dashboard'); setActiveTab('lab_management'); },
                  isActive: executiveTab === 'dashboard' && activeTab === 'lab_management',
                  showCondition: hasPerm('receiveSamples') || hasPerm('enterLabResults') || hasPerm('labArchive')
                },"""

new_lab_management = """                lab_management: {
                  label: 'المختبر',
                  icon: FlaskConical,
                  iconColorClass: 'text-indigo-500',
                  activeBgClass: 'bg-indigo-600 text-white shadow-md shadow-indigo-500/10',
                  permission: null,
                  onClick: () => { setExecutiveTab('dashboard'); setActiveTab('lab_management'); },
                  isActive: executiveTab === 'dashboard' && activeTab === 'lab_management',
                  showCondition: hasPerm('receiveSamples') || hasPerm('enterLabResults') || hasPerm('labArchive')
                },"""
content = content.replace(old_lab_decisions, new_lab_management)

# Change all instances of 'lab_results' to 'lab_management' for the render block
content = content.replace("activeTab === 'lab_results'", "activeTab === 'lab_management'")
content = content.replace("value=\"lab_results\"", "value=\"lab_management\"")

with open("src/pages/ExecutivePortal.jsx", "w", encoding="utf-8") as f:
    f.write(content)
