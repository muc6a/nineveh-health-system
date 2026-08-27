with open('src/pages/SuperAdminPanel.jsx', 'r') as f:
    lines = f.readlines()

trackers_lines = lines[1128:1231]
accountant_lines = []

for line in trackers_lines:
    l = line.replace("subRosterTab === 'trackers'", "subRosterTab === 'accountants'")
    l = l.replace("trackers", "accountants")
    l = l.replace("tracker", "accountant")
    l = l.replace("جدول المتابعين ومحرك الإدارة", "جدول المحاسبين الماليين")
    l = l.replace("توليد حسابات المتابعين للمنظومة", "توليد وإدارة حسابات المحاسبين والصناديق")
    l = l.replace("إضافة متابع ميداني جديد", "إضافة محاسب مالي جديد")
    l = l.replace("إجمالي المتابعين", "إجمالي المحاسبين")
    l = l.replace("المتابعين النشطين", "المحاسبين النشطين")
    l = l.replace("المتابعين المجمدين", "المحاسبين المجمدين")
    l = l.replace("setAccountants", "setAccountants")
    l = l.replace("toggleAccountStatus(t.id, false, true)", "toggleAccountStatus(t.id, false, false, true)")
    l = l.replace("handleDeleteAccount(t.id, false, true)", "handleDeleteAccount(t.id, false, false, true)")
    l = l.replace("handleOpenAddAccount('tracker')", "handleOpenAddAccount('accountant')")
    l = l.replace("المتابع", "المحاسب")
    
    accountant_lines.append(l)

new_lines = lines[:1231] + ["\n"] + accountant_lines + ["\n"] + lines[1231:]

with open('src/pages/SuperAdminPanel.jsx', 'w') as f:
    f.writelines(new_lines)
    
print("Added accountants block safely")
