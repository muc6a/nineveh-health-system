import re

def clean_file():
    path = "src/components/OperationsRoom.jsx"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # Remove all Map and Smart Tasks tab buttons (4 times they appear)
    buttons_regex = r"\s*\{\(user\?\.permissions\?\.showSectorMap.*?الخريطة الشاملة\n\s*</button>\n\s*\}\)\n\s*\{\(user\?\.permissions\?\.manageSmartTasks.*?Smart Tasks\)\n\s*</button>\n\s*\}\)"
    content = re.sub(buttons_regex, "", content, flags=re.DOTALL)
    
    # Also if there's a loose map button without smart tasks:
    buttons_regex_map = r"\s*\{\(user\?\.permissions\?\.showSectorMap.*?الخريطة الشاملة\n\s*</button>\n\s*\}\)"
    content = re.sub(buttons_regex_map, "", content, flags=re.DOTALL)
    
    buttons_regex_smart = r"\s*\{\(user\?\.permissions\?\.manageSmartTasks.*?Smart Tasks\)\n\s*</button>\n\s*\}\)"
    content = re.sub(buttons_regex_smart, "", content, flags=re.DOTALL)

    # Remove the content sections at the bottom
    content_regex1 = r"\s*\{\(user\?\.permissions\?\.showSectorMap.*?activeTab === 'map' && \(\n\s*<div className=\"space-y-6\">\n\s*<div className=\"glassmorphic-card p-6 border border-indigo-500/20 h-\[800px\]\">\n\s*<h3 className=\"text-sm font-black text-slate-800 dark:text-white mb-4\">الخريطة الرقابية والتفاعلية המوحدة</h3>\n\s*<NinevehMap.*?/>\n\s*</div>\n\s*</div>\n\s*\)\}"
    content = re.sub(content_regex1, "", content, flags=re.DOTALL)
    
    # Second variation of title just in case
    content_regex1_v2 = r"\s*\{\(user\?\.permissions\?\.showSectorMap.*?activeTab === 'map' && \(\n\s*<div className=\"space-y-6\">\n\s*<div className=\"glassmorphic-card p-6 border border-indigo-500/20 h-\[800px\]\">\n\s*<h3 className=\"text-sm font-black text-slate-800 dark:text-white mb-4\">الخريطة الرقابية والتفاعلية الموحدة</h3>\n\s*<NinevehMap.*?/>\n\s*</div>\n\s*</div>\n\s*\)\}"
    content = re.sub(content_regex1_v2, "", content, flags=re.DOTALL)

    content_regex2 = r"\s*\{\(user\?\.permissions\?\.manageSmartTasks.*?activeTab === 'smart_tasks' && \(\n\s*<div className=\"space-y-6\">.*?</div>\n\s*</div>\n\s*\)\}"
    content = re.sub(content_regex2, "", content, flags=re.DOTALL)

    # Remove NinevehMap import
    content = content.replace("import NinevehMap from './NinevehMap';\n", "")

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
        
if __name__ == "__main__":
    clean_file()
