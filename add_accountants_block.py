import sys
import re

with open('src/pages/SuperAdminPanel.jsx', 'r') as f:
    content = f.read()

# Find trackers block
trackers_start = content.find("{subRosterTab === 'trackers' && (")
if trackers_start != -1:
    # Need to find the matching closing tag.
    # It's usually `            )}` before `{/* Tab 2:` or the end of roster section
    roster_end = content.find("{/* Tab 2: Settings & Parameters */}")
    
    # Wait, the trackers block ends where `            )}` is just before `          </section>` of roster tab.
    trackers_block_end = content.rfind("            )}", trackers_start, roster_end) + 14
    
    trackers_block = content[trackers_start:trackers_block_end]
    
    # Now create the accountants block by replacing tracker specific words
    accountants_block = trackers_block.replace("subRosterTab === 'trackers'", "subRosterTab === 'accountants'")
    accountants_block = accountants_block.replace("trackers", "accountants")
    accountants_block = accountants_block.replace("tracker", "accountant")
    accountants_block = accountants_block.replace("جدول المتابعين ومحرك الإدارة", "جدول المحاسبين الماليين")
    accountants_block = accountants_block.replace("توليد حسابات المتابعين للمنظومة", "توليد وإدارة حسابات المحاسبين والصناديق")
    accountants_block = accountants_block.replace("إضافة متابع ميداني جديد", "إضافة محاسب مالي جديد")
    accountants_block = accountants_block.replace("إجمالي المتابعين", "إجمالي المحاسبين")
    accountants_block = accountants_block.replace("المتابعين النشطين", "المحاسبين النشطين")
    accountants_block = accountants_block.replace("المتابعين المجمدين", "المحاسبين المجمدين")
    
    # Note: `setTrackers` -> `setAccountants`
    accountants_block = accountants_block.replace("setAccountants", "setAccountants")
    
    # We should insert the new block right after trackers block
    new_content = content[:trackers_block_end] + "\n\n" + accountants_block + content[trackers_block_end:]
    
    with open('src/pages/SuperAdminPanel.jsx', 'w') as f:
        f.write(new_content)
    print("Added accountants UI block successfully")
else:
    print("Could not find trackers block")
