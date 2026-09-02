import re

with open('src/pages/TeamDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("📊 لوحة التقارير والإحصائيات", "📊 اللوحة الاستراتيجية")

with open('src/pages/TeamDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

with open('src/pages/AccountantPanel.jsx', 'r', encoding='utf-8') as f:
    acct = f.read()

acct = acct.replace("لوحة التقارير والإحصائيات", "اللوحة الاستراتيجية")

with open('src/pages/AccountantPanel.jsx', 'w', encoding='utf-8') as f:
    f.write(acct)
