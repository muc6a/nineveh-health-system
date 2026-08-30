import re

file_path = "src/pages/ExecutivePortal.jsx"
with open(file_path, "r") as f:
    content = f.read()

# 1. Remove from tab config
pattern_tab_config = r"""\s*field_dispatch:\s*\{\s*label:\s*'الفرق الميدانية والتوجيه السريع',\s*icon:\s*Target,\s*iconColorClass:\s*'text-blue-500',\s*activeBgClass:\s*'bg-blue-600 text-white shadow-md shadow-blue-500/10',\s*permission:\s*'showOperationsRoom',\s*onClick:\s*\(\)\s*=>\s*\{\s*setExecutiveTab\('dashboard'\);\s*setActiveTab\('field_dispatch'\);\s*\},\s*isActive:\s*executiveTab\s*===\s*'dashboard'\s*&&\s*activeTab\s*===\s*'field_dispatch',\s*showCondition:\s*true\s*\},"""
content = re.sub(pattern_tab_config, "", content)

# 2. Remove from mobile menu
pattern_mobile = r"""\s*\{\s*hasPerm\('showOperationsRoom'\)\s*&&\s*\(\s*<option value="field_dispatch">\s*🚀 الفرق الميدانية والتوجيه السريع\s*</option>\s*\)\s*\}"""
content = re.sub(pattern_mobile, "", content)

# 3. Remove from title logic
content = content.replace("activeTab === 'field_dispatch' ? 'الفرق الميدانية والتوجيه السريع' :\n                 ", "")

# 4. Move the dispatch UI
# Find the field dispatch block
start_str = ") : activeTab === 'field_dispatch' && hasPerm('showOperationsRoom') ? ("
end_str = ") : activeTab === 'lab_results' && hasPerm('showOperationsRoom') ? ("

if start_str in content and end_str in content:
    start_idx = content.find(start_str)
    end_idx = content.find(end_str)
    
    # Extract the block
    field_dispatch_block = content[start_idx + len(start_str):end_idx].strip()
    
    # Remove the block from original position
    content = content[:start_idx] + content[end_idx:]
    
    # Now find directives tab
    directives_start_str = ") : activeTab === 'directives' && hasPerm('showDirectivesPage') ? ("
    directives_end_str = ") : activeTab === 'complaints' && hasPerm('showPublicEvalsPage') ? ("
    
    if directives_start_str in content and directives_end_str in content:
        d_start_idx = content.find(directives_start_str)
        d_end_idx = content.find(directives_end_str)
        
        directives_inner = content[d_start_idx + len(directives_start_str):d_end_idx].strip()
        
        # Modify directives inner to include field dispatch
        new_directives_inner = f"""
          <div className="space-y-6">
            {directives_inner}
            
            {{hasPerm('showOperationsRoom') && (
{field_dispatch_block}
            )}}
          </div>
        """
        
        content = content[:d_start_idx + len(directives_start_str)] + new_directives_inner + content[d_end_idx:]

with open(file_path, "w") as f:
    f.write(content)
print("Updated successfully")
