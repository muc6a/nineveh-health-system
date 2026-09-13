import re

def update_constants():
    path = "src/utils/constants.jsx"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # Remove 'showOperationsRoom' from the keys of OperationsRoom in PERMISSIONS_TABS
    content = content.replace("'showOperationsRoom', ", "")

    # Remove the toggle definition
    content = re.sub(r"\s*showOperationsRoom:\s*\{\s*title:\s*'الوصول لغرفة العمليات',[^}]*\},", "", content)

    # Remove from default permissions
    content = content.replace("showOperationsRoom: false,", "")
    content = content.replace("showOperationsRoom: true,", "")

    # Remove from roles
    content = content.replace("'showOperationsRoom', ", "")
    
    # Remove from categorization mapping if it exists
    content = re.sub(r"\s*showOperationsRoom:\s*'[^']*',", "", content)

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

if __name__ == "__main__":
    update_constants()
