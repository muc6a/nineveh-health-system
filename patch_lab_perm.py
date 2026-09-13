import re

def patch_constants():
    path = "src/utils/constants.jsx"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # Add to PERMISSIONS_TABS under 'lab'
    if "'viewLabReports'" not in content:
        content = content.replace(
            "keys: ['receiveSamples', 'enterLabResults', 'editLabResults', 'labArchive']",
            "keys: ['receiveSamples', 'enterLabResults', 'editLabResults', 'labArchive', 'viewLabReports']"
        )
        content = content.replace(
            "keys: ['receiveSamples', 'enterLabResults', 'labArchive']",
            "keys: ['receiveSamples', 'enterLabResults', 'editLabResults', 'labArchive', 'viewLabReports']"
        )

    # Add to PERMISSION_DETAILS
    if "viewLabReports: {" not in content:
        desc = "  viewLabReports: { title: 'عرض التقارير المختبرية والرقابية للعينات', desc: 'يسمح للجهات المختصة بالاطلاع على الإحصائيات ونتائج الفحوصات دون التدخل المباشر في إدخال النتائج.' },\n"
        content = content.replace(
            "  labArchive:",
            desc + "  labArchive:"
        )

    # Add to DEFAULT_PERMISSIONS
    if "viewLabReports: false" not in content and "viewLabReports: true" not in content:
        content = content.replace(
            "  labArchive: false,",
            "  viewLabReports: false,\n  labArchive: false,"
        )

    # Add to PERMISSION_ROLES
    if "viewLabReports: 'lab_management'" not in content:
        content = content.replace(
            "  labArchive: 'lab_management',",
            "  viewLabReports: 'lab_management',\n  labArchive: 'lab_management',"
        )

    # Note: the central lab should have it by default. 
    if "'viewLabReports'" not in content.split("export const ROLE_CORE_BASICS")[1]:
        content = content.replace(
            "lab: ['receiveSamples', 'enterLabResults', 'labArchive', 'centralLabView']",
            "lab: ['viewLabReports', 'receiveSamples', 'enterLabResults', 'editLabResults', 'labArchive', 'centralLabView']"
        )
        content = content.replace(
            "lab: ['receiveSamples', 'enterLabResults', 'labArchive']",
            "lab: ['viewLabReports', 'receiveSamples', 'enterLabResults', 'editLabResults', 'labArchive']"
        )

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

if __name__ == "__main__":
    patch_constants()
