import re

def update_sidebar():
    path = "src/components/UnifiedSidebar.jsx"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # Add smart_tasks before operations_room
    smart_tasks_obj = """
    smart_tasks: { 
      label: 'المهام الذكية', 
      icon: <CheckCircle className="w-4 h-4"/>, 
      showCondition: hasPerm('manageSmartTasks') || hasPerm('executeSmartTasks')
    },
    operations_room:"""
    
    if "smart_tasks: {" not in content:
        content = content.replace("operations_room:", smart_tasks_obj)

    # Also need to import CheckCircle if not imported
    if "CheckCircle" not in content and "import { " in content:
        content = content.replace("import { ", "import { CheckCircle, ")

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

if __name__ == "__main__":
    update_sidebar()
