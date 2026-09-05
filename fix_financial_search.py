import re

with open('src/components/FinancialReports.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_search = """    const fine = allFines.find(f => 
      (String(f.establishmentId) === code || f.establishmentName?.includes(code)) 
      && f.paymentStatus !== 'paid'
    );"""

new_search = """    const fine = allFines.find(f => 
      (String(f.establishmentId) === code || String(f.targetEstId) === code || String(f.estId) === code || f.establishmentName?.includes(code) || f.targetEstName?.includes(code)) 
      && f.paymentStatus !== 'paid'
    );"""

content = content.replace(old_search, new_search)

# Also fix the name display just in case
old_name = """<h4 className="font-black text-emerald-800 dark:text-emerald-400 mb-2">{foundFine.establishmentName}</h4>"""
new_name = """<h4 className="font-black text-emerald-800 dark:text-emerald-400 mb-2">{foundFine.establishmentName || foundFine.targetEstName || 'منشأة غير محددة'}</h4>"""

content = content.replace(old_name, new_name)

with open('src/components/FinancialReports.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated FinancialReports.jsx search function")
