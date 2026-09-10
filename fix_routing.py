import re

with open("src/pages/ExecutivePortal.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Fix validations in useEffect
old_validations = """    if (activeTab === 'operations_room' && !hasPerm('showOperationsRoom')) needsRedirect = true;
    if (activeTab === 'lab_management' && !(hasPerm('receiveSamples') || hasPerm('enterLabResults') || hasPerm('labArchive'))) needsRedirect = true;
    if (activeTab === 'financials' && !(hasPerm('financialReports') || hasPerm('payFines') || hasPerm('dailyInventory'))) needsRedirect = true;
    
    if (activeTab === 'directives' && !(hasPerm('showDirectivesPage') || hasPerm('sendDirective') || hasPerm('replyDirective') || hasPerm('quickTeamDispatch'))) needsRedirect = true;
    if (activeTab === 'complaints' && !hasPerm('showPublicEvalsPage')) needsRedirect = true;"""

new_validations = """    if (activeTab === 'operations_room' && !(hasPerm('showOperationsRoom') || hasPerm('showPublicEvalsPage'))) needsRedirect = true;
    if (activeTab === 'lab_management' && !(hasPerm('receiveSamples') || hasPerm('enterLabResults') || hasPerm('labArchive') || hasPerm('authenticatePenalties'))) needsRedirect = true;
    if (activeTab === 'financials' && !(hasPerm('financialReports') || hasPerm('payFines') || hasPerm('dailyInventory'))) needsRedirect = true;
    
    if (activeTab === 'directives' && !(hasPerm('showDirectivesPage') || hasPerm('sendDirective') || hasPerm('replyDirective') || hasPerm('quickTeamDispatch'))) needsRedirect = true;
    if (activeTab === 'complaints' && !(hasPerm('showPublicEvalsPage') || hasPerm('showDeliveryPage'))) needsRedirect = true;"""
content = content.replace(old_validations, new_validations)

# 2. Fix Rendering block
old_rendering = """        {activeTab === 'financials' && <FinancialReports />}
        
        {activeTab !== 'operations_room' && activeTab !== 'financials' && ("""
new_rendering = """        {activeTab === 'financials' && <FinancialReports />}
        {activeTab === 'lab_management' && <LabManager />}
        
        {activeTab !== 'operations_room' && activeTab !== 'financials' && activeTab !== 'lab_management' && ("""
content = content.replace(old_rendering, new_rendering)

with open("src/pages/ExecutivePortal.jsx", "w", encoding="utf-8") as f:
    f.write(content)
