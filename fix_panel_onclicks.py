import re

def update_file(path, panel_type):
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # For lab tabs
    lab_tabs = ['stats', 'incoming', 'testing', 'archive', 'lab_management']
    for tab in lab_tabs:
        old_click = f"onClick: () => setActiveTab('{tab}')"
        if panel_type == 'acc':
            new_click = f"onClick: () => {{ setActiveTab('{tab}'); navigate('/dashboard/lab?tab={tab}'); }}"
        else:
            new_click = f"onClick: () => {{ setActiveTab('{tab}'); }}" # already on lab
        content = content.replace(old_click, new_click)

    # For financial tabs
    fin_tabs = ['financials', 'ext_financials', 'reconciliation', 'comprehensive_reports']
    for tab in fin_tabs:
        old_click = f"onClick: () => setActiveTab('{tab}')"
        if panel_type == 'lab':
            new_click = f"onClick: () => {{ setActiveTab('{tab}'); navigate('/dashboard/accountant?tab={tab}'); }}"
        else:
            new_click = f"onClick: () => {{ setActiveTab('{tab}'); }}" # already on acc
        content = content.replace(old_click, new_click)
        
    # For strategic tabs that exist in Executive Portal or others? They probably don't have separate URLs...
    # But wait, strategic, smart_tasks, operations_room, directives, complaints, establishments are rendered natively in both panels using <TeamDashboard embeddedTab/> or <OperationsRoom/>!
    # YES! The other tabs ARE rendered correctly in both panels because they just use a shared component like <OperationsRoom />!
    # Wait, DOES LabDashboard have <OperationsRoom />?
    
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

update_file("src/pages/AccountantPanel.jsx", "acc")
update_file("src/pages/LabDashboard.jsx", "lab")

print("Onclicks fixed!")
