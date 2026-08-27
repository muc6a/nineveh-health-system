import sys

with open('src/pages/SuperAdminPanel.jsx', 'r') as f:
    content = f.read()

# Find the accountants block
accountants_start = content.find("{subRosterTab === 'accountants' && (")
if accountants_start != -1:
    accountants_end = content.find("{/* Tab 2: Settings & Parameters */}", accountants_start)
    block = content[accountants_start:accountants_end]
    
    # Fix the toggleAccountStatus call
    block = block.replace("toggleAccountStatus(t.id, false, true)", "toggleAccountStatus(t.id, false, false, true)")
    
    # Fix the handleDeleteAccount call
    block = block.replace("handleDeleteAccount(t.id, false, true)", "handleDeleteAccount(t.id, false, false, true)")
    
    # Fix the handleOpenAddAccount call
    block = block.replace("handleOpenAddAccount('tracker')", "handleOpenAddAccount('accountant')")

    new_content = content[:accountants_start] + block + content[accountants_end:]
    
    with open('src/pages/SuperAdminPanel.jsx', 'w') as f:
        f.write(new_content)
    print("Fixed accountant calls")
else:
    print("Accountant block not found")
