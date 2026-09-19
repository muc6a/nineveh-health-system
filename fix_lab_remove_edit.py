import re

def fix():
    path = "src/pages/LabDashboard.jsx"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Remove the edit block in fallback logic
    content = content.replace("const canSeeEdit = hasPerm('editLabResults');", "")
    content = content.replace("if (activeTab === 'edit' && canSeeEdit) isAllowed = true;", "")
    content = content.replace("else if (canSeeEdit) setActiveTab('edit');", "")

    # 2. Remove 'edit' from subtitle switch
    content = content.replace("activeTab === 'testing' ? 'إدخال نتائج الفحص' :\n              activeTab === 'edit' ? 'تعديل النتائج' :", "activeTab === 'testing' ? 'إدخال نتائج الفحص' :")

    # 3. Remove the edit sidebar button
    # The button is: {hasPerm('editLabResults') && ( <button ... </button> )}
    edit_btn_pattern = r"\{hasPerm\('editLabResults'\) && \([\s\S]*?<span>تعديل النتائج</span>\s*</div>\s*</button>\s*\)\}"
    content = re.sub(edit_btn_pattern, "", content)

    # 4. Remove the edit content block
    edit_content_pattern = r"\{activeTab === 'edit' && hasPerm\('editLabResults'\) && \([\s\S]*?<p>قسم تعديل النتائج قيد التطوير\.\.\.</p>\s*</div>\s*</div>\s*\)\}"
    content = re.sub(edit_content_pattern, "", content)

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

if __name__ == "__main__":
    fix()
