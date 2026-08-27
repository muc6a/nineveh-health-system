import sys

with open('src/pages/SuperAdminPanel.jsx', 'r') as f:
    content = f.read()

# Find the accountants block
start_idx = content.find("{subRosterTab === 'accountants' && (")
if start_idx != -1:
    end_idx = content.find("</>", start_idx) + 3
    block = content[start_idx:end_idx]
    
    # 1. Update title & button
    block = block.replace("جدول المحاسبين الماليين", "جدول الكوادر المالية - المحاسبون المسؤولون عن الجباية وإيصالات القبض")
    block = block.replace("الكوادر المكلفة بالتحقق من الإغلاقات في الميدان", "إدارة كافة الحسابات المالية للمنظومة")
    block = block.replace("إضافة محاسب مالي جديد", "إضافة حساب محاسب جديد")
    
    # 2. Update table headers
    # "القطاع (الفريق المرتبط)" -> "القطاع المالي المرتبط"
    block = block.replace("القطاع (الفريق المرتبط)", "القطاع المالي المرتبط")
    block = block.replace("اسم المحاسب", "اسم المحاسب") # Already correct
    
    # 3. Add Permissions button
    old_buttons = """<button
                                onClick={() => handleOpenEditAccount(t, 'accountant')}"""
    new_buttons = """<button
                                onClick={() => handleOpenPermissions({ ...t, role: 'financial_accountant' })}
                                className="px-2.5 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 transition-all cursor-pointer text-[10px] flex items-center gap-1"
                              >
                                <Shield className="w-3.5 h-3.5" /> الصلاحيات
                              </button>
                              <button
                                onClick={() => handleOpenEditAccount(t, 'accountant')}"""
    block = block.replace(old_buttons, new_buttons)
    
    content = content[:start_idx] + block + content[end_idx:]
    with open('src/pages/SuperAdminPanel.jsx', 'w') as f:
        f.write(content)
    print("Updated accountant table UI")
else:
    print("Accountant block not found")
