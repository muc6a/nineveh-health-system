import re

# 1. ExecutivePortal Geographic Sidebar Removal
with open('src/pages/ExecutivePortal.jsx', 'r', encoding='utf-8') as f:
    exec_content = f.read()

# Let's remove 'geographic' from tabConfig in ExecutivePortal.jsx
# We need to find the block for geographic in tabConfig and remove it.
# Wait, I can just replace `showCondition: true` with `showCondition: false` for geographic in tabConfig! Or remove it entirely.
exec_content = re.sub(r"geographic:\s*\{[\s\S]*?showCondition:\s*true\s*\},", "", exec_content)

# 2. ExecutivePortal Directives Tabs
# ExecutivePortal currently shows Directives in a grid.
# I need to refactor it to have tabs if they have multiple permissions.
# Actually, the user says "تظهر التبليغات الواردة فقط رغم منح كافة الصلاحيات", which means they were talking about TeamDashboard! Because in TeamDashboard it defaults to 'inbox' (التبليغات الواردة) and the other tabs were hidden due to the wrong permission names!
# Let's check TeamDashboard permissions for Directives!

with open('src/pages/TeamDashboard.jsx', 'r', encoding='utf-8') as f:
    team_content = f.read()

team_content = team_content.replace("hasPerm('sendDirectives')", "hasPerm('sendDirective')")
team_content = team_content.replace("hasPerm('replyToDirectives')", "hasPerm('replyDirective')")

# Also check ExecutivePortal just in case
exec_content = exec_content.replace("hasPerm('sendDirectives')", "hasPerm('sendDirective')")
exec_content = exec_content.replace("hasPerm('replyToDirectives')", "hasPerm('replyDirective')")

# 3. Financial Search
# Change === to includes for IDs
with open('src/components/FinancialReports.jsx', 'r', encoding='utf-8') as f:
    fin_content = f.read()

fin_search_old = """    const fine = allFines.find(f => 
      (String(f.establishmentId) === code || String(f.targetEstId) === code || String(f.estId) === code || f.establishmentName?.includes(code) || f.targetEstName?.includes(code)) 
      && f.paymentStatus !== 'paid'
    );"""

fin_search_new = """    const codeLower = code.toLowerCase();
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
fin_content = fin_content.replace(fin_search_old, fin_search_new)


# Let's save the files back
with open('src/pages/TeamDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(team_content)

with open('src/pages/ExecutivePortal.jsx', 'w', encoding='utf-8') as f:
    f.write(exec_content)

with open('src/components/FinancialReports.jsx', 'w', encoding='utf-8') as f:
    f.write(fin_content)

print("Applied fixes for ExecutivePortal geo, TeamDashboard directives tabs, and Financial search.")
