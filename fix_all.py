import os
import re

def fix_all():
    constants_path = "src/utils/constants.jsx"
    sidebar_path = "src/components/UnifiedSidebar.jsx"

    if not os.path.exists(constants_path) or not os.path.exists(sidebar_path):
        return

    # 1. Update constants.jsx
    with open(constants_path, "r", encoding="utf-8") as f:
        c_text = f.read()

    # Add showOperationsRoom to PERMISSION_DETAILS if missing
    if "showOperationsRoom: {" not in c_text:
        c_text = re.sub(
            r"(manageEstablishments: \{[^\}]+?\},)",
            r"\1\n  showOperationsRoom: { title: 'الوصول لغرفة العمليات', desc: 'يسمح للحساب بالوصول إلى لوحة غرفة العمليات المركزية.' },",
            c_text
        )
        
    # Add showLabPage to PERMISSION_DETAILS if missing
    if "showLabPage: {" not in c_text:
        c_text = re.sub(
            r"(manageEstablishments: \{[^\}]+?\},)",
            r"\1\n  showLabPage: { title: 'لوحة المختبر', desc: 'الوصول المباشر إلى واجهات المختبر المركزي.' },",
            c_text
        )

    # Change lab core basics to include centralLabView
    c_text = re.sub(
        r"(lab: \['receiveSamples', 'enterLabResults', 'labArchive')(\],)",
        r"\1, 'centralLabView'\2",
        c_text
    )

    with open(constants_path, "w", encoding="utf-8") as f:
        f.write(c_text)

    # 2. Update UnifiedSidebar.jsx
    with open(sidebar_path, "r", encoding="utf-8") as f:
        s_text = f.read()

    # Fix strategic tab to include showReportsPage and exportData
    s_text = re.sub(
        r"showCondition:\s*hasPerm\('showMainDashboard'\),",
        r"showCondition: hasPerm('showMainDashboard') || hasPerm('showReportsPage') || hasPerm('exportData'),",
        s_text
    )

    with open(sidebar_path, "w", encoding="utf-8") as f:
        f.write(s_text)

    print("All fixes applied!")

if __name__ == "__main__":
    fix_all()
