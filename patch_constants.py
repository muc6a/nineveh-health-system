import re

def update_constants():
    with open('src/utils/constants.jsx', 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update PERMISSION_DETAILS
    new_perms = """  manageSmartTasks: { title: 'إدارة وتوجيه المهام', desc: 'يسمح بتوجيه أوامر تفتيش مركزية للفرق الميدانية وتتبع إنجازها.' },
  executeSmartTasks: { title: 'تنفيذ المهام الذكية', desc: 'يسمح للفرقة باستقبال المهام الموجهة من غرفة العمليات وإنجازها.' },
"""
    if "manageSmartTasks" not in content:
        content = content.replace("showSmartTasks: { title: 'المهام الذكية', desc: 'رؤية اقتراحات المهام الذكية.' },", new_perms)
        # If showSmartTasks was slightly different:
        content = re.sub(r"  showSmartTasks: \{.*?\},\n", new_perms, content)
        
    # 2. Update ROLE_CORE_BASICS
    # replace showSmartTasks with executeSmartTasks for team
    content = content.replace("'showSmartTasks'", "'executeSmartTasks'")
    
    # Add manageSmartTasks to central_director
    if "'manageSmartTasks'" not in content:
        content = content.replace("'showOperationsRoom',", "'showOperationsRoom', 'manageSmartTasks',")

    # 3. Update PERMISSION_ROLES
    if "manageSmartTasks: 'management'" not in content:
        content = content.replace("showMainDashboard: 'management',", "showMainDashboard: 'management',\n  manageSmartTasks: 'management',")
        
    with open('src/utils/constants.jsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("constants.jsx updated.")

if __name__ == "__main__":
    update_constants()
