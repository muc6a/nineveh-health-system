import re

file_path = "src/pages/ExecutivePortal.jsx"
with open(file_path, "r") as f:
    content = f.read()

# 1. Remove field_dispatch from tabConfig
field_dispatch_pattern = r"""\s*field_dispatch:\s*\{\s*label:\s*'الفرق الميدانية والتوجيه السريع',\s*icon:\s*Target,\s*iconColorClass:\s*'text-blue-500',\s*activeBgClass:\s*'bg-blue-600 text-white shadow-md shadow-blue-500/10',\s*permission:\s*'showOperationsRoom',\s*onClick:\s*\(\)\s*=>\s*\{\s*setExecutiveTab\('dashboard'\);\s*setActiveTab\('field_dispatch'\);\s*\},\s*isActive:\s*executiveTab\s*===\s*'dashboard'\s*&&\s*activeTab\s*===\s*'field_dispatch',\s*showCondition:\s*true\s*\},"""
content = re.sub(field_dispatch_pattern, "", content)

# 2. Remove from mobile dropdown
dropdown_pattern = r"""\s*\{\s*hasPerm\('showOperationsRoom'\)\s*&&\s*\(\s*<option\s*value="field_dispatch">\s*🚀\s*الفرق الميدانية والتوجيه السريع\s*</option>\s*\)\s*\}"""
content = re.sub(dropdown_pattern, "", content)

# 3. Remove field_dispatch from active tab titles
title_pattern = r"""activeTab\s*===\s*'field_dispatch'\s*\?\s*'الفرق الميدانية والتوجيه السريع'\s*:\s*"""
content = content.replace("activeTab === 'field_dispatch' ? 'الفرق الميدانية والتوجيه السريع' :\n                 ", "")

# 4. Extract field_dispatch UI
dispatch_ui_regex = r"(\)\s*:\s*activeTab\s*===\s*'field_dispatch'\s*&&\s*hasPerm\('showOperationsRoom'\)\s*\?\s*\(\s*<div\s*className=\"glassmorphic-card\s*p-6\s*border\s*border-blue-500/20\">.*?</div>\s*\))"
match = re.search(dispatch_ui_regex, content, re.DOTALL)
if match:
    dispatch_ui_full = match.group(1)
    # Get just the inner div
    inner_div_match = re.search(r"(<div\s*className=\"glassmorphic-card\s*p-6\s*border\s*border-blue-500/20\">.*?</div>\s*)\)", dispatch_ui_full, re.DOTALL)
    if inner_div_match:
        dispatch_ui = inner_div_match.group(1)
        # Remove the whole field_dispatch activeTab block
        content = content.replace(dispatch_ui_full, "")
        
        # Inject it into directives tab
        directives_block_regex = r"(activeTab\s*===\s*'directives'\s*&&\s*hasPerm\('showDirectivesPage'\)\s*\?\s*\(\s*)<div\s*className=\"grid\s*grid-cols-1\s*lg:grid-cols-2\s*gap-6\s*items-start\">"
        
        injection = r"\1<div className=\"space-y-6\">\n            <div className=\"grid grid-cols-1 lg:grid-cols-2 gap-6 items-start\">"
        content = re.sub(directives_block_regex, injection, content)
        
        # Close the space-y-6 div at the end of directives tab
        end_directives_regex = r"(</div>\s*)\)\s*:\s*activeTab\s*===\s*'complaints'"
        
        end_injection = rf"</div>\n            {{hasPerm('showOperationsRoom') && (\n              {dispatch_ui}\n            )}}\n          \1) : activeTab === 'complaints'"
        content = re.sub(end_directives_regex, end_injection, content)

with open(file_path, "w") as f:
    f.write(content)
print("Updated ExecutivePortal.jsx")
