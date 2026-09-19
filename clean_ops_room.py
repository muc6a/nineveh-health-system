import re

def clean_ops():
    path = "src/components/OperationsRoom.jsx"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # We want to remove the Map and Smart Tasks tab buttons
    buttons_regex = r"\{\(user\?\.permissions\?\.showSectorMap.*?الخريطة الشاملة\n\s*</button>\n\s*\}\)\n\s*\{\(user\?\.permissions\?\.manageSmartTasks.*?Smart Tasks\)\n\s*</button>\n\s*\}\)"
    content = re.sub(buttons_regex, "", content, flags=re.DOTALL)

    # We also want to remove the content blocks for map and smart_tasks
    content_regex1 = r"\{\(user\?\.permissions\?\.showSectorMap.*?activeTab === 'map' && \(\n\s*<div className=\"space-y-6\">\n\s*<div className=\"glassmorphic-card p-6 border border-indigo-500/20 h-\[800px\]\">\n\s*<h3 className=\"text-sm font-black text-slate-800 dark:text-white mb-4\">الخريطة الرقابية والتفاعلية الموحدة</h3>\n\s*<NinevehMap \n\s*establishments=\{user\?\.sector \? establishments\.filter\(e => e\.sector === user\.sector\) : establishments\} \n\s*teams=\{teams\}\n\s*/>\n\s*</div>\n\s*</div>\n\s*\)\}"
    content = re.sub(content_regex1, "", content, flags=re.DOTALL)
    
    content_regex2 = r"\{\(user\?\.permissions\?\.manageSmartTasks.*?activeTab === 'smart_tasks' && \(\n\s*<div className=\"space-y-6\">.*?</div>\n\s*</div>\n\s*\)\}"
    content = re.sub(content_regex2, "", content, flags=re.DOTALL)

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
        
if __name__ == "__main__":
    clean_ops()
