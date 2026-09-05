import re

with open('src/components/FinancialReports.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add establishments to useContext
content = content.replace(
    "const { penaltyRequests, teams, setPenaltyRequests, notify } = useContext(AppContext);",
    "const { penaltyRequests, teams, setPenaltyRequests, notify, establishments } = useContext(AppContext);"
)

# Update the search function to check establishments.accessCode
old_search = """    const codeLower = code.toLowerCase();
    const fine = allFines.find(f => 
      (
        String(f.establishmentId).toLowerCase().includes(codeLower) || 
        String(f.targetEstId).toLowerCase().includes(codeLower) || 
        String(f.estId).toLowerCase().includes(codeLower) || 
        String(f.id).toLowerCase().includes(codeLower) || 
        (f.establishmentName && f.establishmentName.toLowerCase().includes(codeLower)) || 
        (f.targetEstName && f.targetEstName.toLowerCase().includes(codeLower))
      ) 
      && f.paymentStatus !== 'paid'
    );"""

new_search = """    const codeLower = code.toLowerCase();
    // Find establishment if user entered accessCode
    const est = establishments?.find(e => e.accessCode?.toLowerCase() === codeLower);
    
    const fine = allFines.find(f => {
      const matchId = 
        String(f.establishmentId).toLowerCase().includes(codeLower) || 
        String(f.targetEstId).toLowerCase().includes(codeLower) || 
        String(f.estId).toLowerCase().includes(codeLower) || 
        String(f.id).toLowerCase().includes(codeLower);
      
      const matchName = 
        (f.establishmentName && f.establishmentName.toLowerCase().includes(codeLower)) || 
        (f.targetEstName && f.targetEstName.toLowerCase().includes(codeLower));
        
      const matchAccessCode = est && (f.establishmentId === est.id || f.targetEstId === est.id || f.estId === est.id);
      
      return (matchId || matchName || matchAccessCode) && f.paymentStatus !== 'paid';
    });"""

content = content.replace(old_search, new_search)

with open('src/components/FinancialReports.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed search in FinancialReports to include accessCode mapping.")
