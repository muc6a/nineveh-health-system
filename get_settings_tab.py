with open("src/pages/SuperAdminPanel.jsx", "r", encoding="utf-8") as f:
    lines = f.readlines()

start_idx = -1
end_idx = -1
for i, line in enumerate(lines):
    if "{activeTab === 'settings' && (" in line:
        start_idx = i
        break

if start_idx != -1:
    brace_count = 0
    in_block = False
    for i in range(start_idx, len(lines)):
        line = lines[i]
        brace_count += line.count('{') - line.count('}')
        if brace_count > 0:
            in_block = True
        if in_block and brace_count == 0:
            end_idx = i
            break

print(f"Start: {start_idx}, End: {end_idx}")
with open("settings_tab.txt", "w", encoding="utf-8") as f:
    f.writelines(lines[start_idx:end_idx+1])
