import re

with open('src/components/FinancialReports.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    """  const handleSearchFine = () => {
    if(!payCode.trim()) return;
    const allFines = penaltyRequests || [];
    // Search for a pending fine for this establishment ID or Name
    const fine = allFines.find(f => (f.establishmentId === payCode || f.establishmentName?.includes(payCode)) && f.paymentStatus !== 'paid');""",
    """  const handleSearchFine = () => {
    const code = payCode.trim();
    if(!code) return;
    const allFines = (penaltyRequests || []).filter(r => r.type === 'fine' || r.type === 'closure');
    // Search for a pending fine for this establishment ID or Name
    const fine = allFines.find(f => 
      (String(f.establishmentId) === code || f.establishmentName?.includes(code)) 
      && f.paymentStatus !== 'paid'
    );"""
)

with open('src/components/FinancialReports.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed handleSearchFine in FinancialReports.jsx")
