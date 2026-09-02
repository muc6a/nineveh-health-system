import re

with open('src/pages/ExecutivePortal.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("label: 'الرئيسية',", "label: 'إدارة متقدمة',")
content = content.replace("label: 'شكاوى المواطنين',", "label: 'الشكاوى',")
content = content.replace("activeTab === 'strategic' ? '💼'", "activeTab === 'strategic' ? '⚙️'")
content = content.replace("activeTab === 'none' ? 'بوابة المدير العام'", "activeTab === 'none' ? 'الإدارة المتقدمة'")

with open('src/pages/ExecutivePortal.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

