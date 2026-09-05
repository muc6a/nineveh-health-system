import re

with open('src/utils/constants.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add centralLabView to DEFAULT_PERMISSIONS
if "  centralLabView: false," not in content:
    content = content.replace(
        "  receiveSamples: false,",
        "  receiveSamples: false,\n  centralLabView: false,"
    )

# Add to PERMISSIONS_TABS under 'lab'
tab_target = "{ id: 'lab', label: 'المختبر', icon: <Microscope className=\"w-4 h-4 text-indigo-400\"/>, keys: ['receiveSamples', 'enterLabResults', 'labArchive'] },"
tab_replacement = "{ id: 'lab', label: 'المختبر', icon: <Microscope className=\"w-4 h-4 text-indigo-400\"/>, keys: ['receiveSamples', 'enterLabResults', 'labArchive', 'centralLabView'] },"
content = content.replace(tab_target, tab_replacement)

# Add to PERMISSION_DETAILS
details_target = "  labArchive: { title: 'أرشيف المختبر', desc: 'يسمح بالاطلاع على السجل التاريخي لكافة الفحوصات المختبرية السابقة.' },"
details_replacement = "  labArchive: { title: 'أرشيف المختبر', desc: 'يسمح بالاطلاع على السجل التاريخي لكافة الفحوصات المختبرية السابقة.' },\n  centralLabView: { title: 'الرؤية المركزية لعينات المحافظة', desc: 'يسمح للحساب بالاطلاع على الإحصائيات الكلية وكافة العينات المسحوبة من جميع الفرق في المحافظة' },"
content = content.replace(details_target, details_replacement)

with open('src/utils/constants.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated constants.jsx")
