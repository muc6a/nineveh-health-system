import re

file_path = "src/pages/AccountantPanel.jsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Fix the crash in e.name.includes
name_target = "e.name.includes(searchCode)"
name_replace = "(e.name || '').includes(searchCode)"
content = content.replace(name_target, name_replace)

# 2. Remove "الصلاحيات المفعلة" line
# The line is: <div className="text-[9px] text-emerald-400 font-bold mt-0.5">الصلاحيات المفعلة: {user?.role === 'admin' || user?.role === 'financial_accountant' ? 'كاملة' : Object.keys(user?.permissions || {}).filter(k => user?.permissions[k]).length}</div>
perm_target = r"<div className=\"text-\[9px\] text-emerald-400 font-bold mt-0.5\">الصلاحيات المفعلة:(.*?)</div>"
content = re.sub(perm_target, "", content, flags=re.DOTALL)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Crash fixed")
