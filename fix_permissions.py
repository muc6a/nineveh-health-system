import re

with open('src/utils/constants.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add missing translations for PERMISSION_DETAILS
missing_perms = """  manageEstablishments: { title: 'إدارة المنشآت', desc: 'صلاحية أساسية للتعامل مع المنشآت وتعديل حالاتها.' },
  createEst: { title: 'إضافة منشأة جديدة', desc: 'يسمح بتسجيل منشآت جديدة في قاعدة البيانات.' },
  addEval: { title: 'إضافة تقييم صحي', desc: 'يسمح بإجراء الكشوفات الصحية وإضافة التقييمات للمنشآت.' },
"""
content = content.replace("export const PERMISSION_DETAILS = {", "export const PERMISSION_DETAILS = {\n" + missing_perms)

with open('src/utils/constants.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed permissions translation")
