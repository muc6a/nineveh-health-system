import re

file_path = "src/pages/AccountantPanel.jsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Fix 1: Remove setActiveTab('dashboard') from handleCloseRegister
target_redirect = "setActiveTab('dashboard');"
content = content.replace(target_redirect, "// setActiveTab('dashboard');")

# Fix 2: Change the date format in the daily inventory archive
target_date = "{new Date(inv.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}"
replacement_date = "{(() => { const d = new Date(inv.date); return isNaN(d) ? inv.date : `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()} | ${d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase()}`; })()}"
content = content.replace(target_date, replacement_date)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("AccountantPanel fixes applied successfully.")
