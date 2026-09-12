import re

def fix_rbac_issues():
    # 1. Fix UnifiedSidebar.jsx
    with open("src/components/UnifiedSidebar.jsx", "r", encoding="utf-8") as f:
        content = f.read()
    
    # Fix operations_room showCondition
    content = content.replace(
        "showCondition: hasPerm('showOperationsRoom') || hasPerm('showPublicEvalsPage'),",
        "showCondition: hasPerm('showOperationsRoom'),"
    )
    
    # Fix lab_management showCondition
    content = content.replace(
        "showCondition: hasPerm('receiveSamples') || hasPerm('enterLabResults') || hasPerm('labArchive') || hasPerm('authenticatePenalties'),",
        "showCondition: hasPerm('receiveSamples') || hasPerm('enterLabResults') || hasPerm('labArchive'),"
    )

    with open("src/components/UnifiedSidebar.jsx", "w", encoding="utf-8") as f:
        f.write(content)


    # 2. Fix ExecutivePortal.jsx
    with open("src/pages/ExecutivePortal.jsx", "r", encoding="utf-8") as f:
        content = f.read()

    # Fix getInitialExecutiveTab
    content = content.replace(
        "if (hasPerm('receiveSamples') || hasPerm('enterLabResults') || hasPerm('labArchive')) return 'operations_room';",
        "if (hasPerm('showOperationsRoom')) return 'operations_room';\n    if (hasPerm('receiveSamples') || hasPerm('enterLabResults') || hasPerm('labArchive')) return 'lab_management';"
    )

    # Fix redirect logic
    content = content.replace(
        "if (activeTab === 'operations_room' && !(hasPerm('showOperationsRoom') || hasPerm('showPublicEvalsPage'))) needsRedirect = true;",
        "if (activeTab === 'operations_room' && !hasPerm('showOperationsRoom')) needsRedirect = true;"
    )

    content = content.replace(
        "if (activeTab === 'lab_management' && !(hasPerm('receiveSamples') || hasPerm('enterLabResults') || hasPerm('labArchive') || hasPerm('authenticatePenalties'))) needsRedirect = true;",
        "if (activeTab === 'lab_management' && !(hasPerm('receiveSamples') || hasPerm('enterLabResults') || hasPerm('labArchive'))) needsRedirect = true;"
    )

    with open("src/pages/ExecutivePortal.jsx", "w", encoding="utf-8") as f:
        f.write(content)

if __name__ == "__main__":
    fix_rbac_issues()
    print("Fixed RBAC in UnifiedSidebar and ExecutivePortal")
