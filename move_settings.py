import re

with open("src/pages/SuperAdminPanel.jsx", "r") as f:
    content = f.read()

# Extract the sovereign rules block
# It starts at <div className="border-t border-slate-200 dark:border-slate-800 my-8"></div>
# and ends at the closing </div> before {subSettingsTab === 'database' && (
start_str = '<div className="border-t border-slate-200 dark:border-slate-800 my-8"></div>'
end_str = "{subSettingsTab === 'database' && ("

idx_start = content.find(start_str)
idx_end = content.find(end_str)
if idx_start == -1 or idx_end == -1:
    print("Could not find block boundaries")
    exit(1)

block = content[idx_start:idx_end]
content = content[:idx_start] + content[idx_end:]

# Now split the block into two parts
# 1. Sovereign settings
# 2. Dynamic evaluation settings

# Find dynamic evaluation settings
dynamic_start_str = '                  {/* Dynamic Grading Thresholds */}'
save_btn_str = '                  <div className="flex justify-end pt-4">'

dyn_idx = block.find(dynamic_start_str)
save_idx = block.find(save_btn_str)

sovereign_block = block[:dyn_idx]
dynamic_block = block[dyn_idx:save_idx]
save_btn_block = block[save_idx:]

# Combine them with their own save buttons
sovereign_final = sovereign_block + save_btn_block
dynamic_final = '<div className="glassmorphic-card p-6 mt-6">\n' + dynamic_block + save_btn_block + '</div>\n'

# Insert sovereign_final into activeTab === 'broadcast'
# right before </div>\n          </div>\n        )}\n\n        {activeTab === 'analytics' && (
broadcast_end_str = '              )}\n            </div>\n          </div>\n        )}'
b_idx = content.find(broadcast_end_str)
content = content[:b_idx] + '              )}\n\n' + sovereign_final + content[b_idx:]

# Insert dynamic_final into subSettingsTab === 'evaluations'
# right after <EvaluationManager />
eval_end_str = '                <EvaluationManager />\n              )}'
e_idx = content.find(eval_end_str)
e_insert_idx = e_idx + len(eval_end_str)
content = content[:e_insert_idx] + '\n\n' + dynamic_final + content[e_insert_idx:]

with open("src/pages/SuperAdminPanel.jsx", "w") as f:
    f.write(content)

print("Successfully moved sections.")
