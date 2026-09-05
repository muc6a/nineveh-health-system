with open('src/utils/constants.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

bad_insert = """export const PERMISSION_DETAILS = {
  manageEstablishments: { title: 'إدارة المنشآت', desc: 'صلاحية أساسية للتعامل مع المنشآت وتعديل حالاتها.' },
  createEst: { title: 'إضافة منشأة جديدة', desc: 'يسمح بتسجيل منشآت جديدة في قاعدة البيانات.' },
  addEval: { title: 'إضافة تقييم صحي', desc: 'يسمح بإجراء الكشوفات الصحية وإضافة التقييمات للمنشآت.' },
"""

good_insert = """export const PERMISSION_DETAILS = {
  manageEstablishments: { title: 'إدارة المنشآت', desc: 'صلاحية أساسية للتعامل مع المنشآت وتعديل حالاتها.' },
"""
content = content.replace(bad_insert, good_insert)

with open('src/utils/constants.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed duplicate permissions")
