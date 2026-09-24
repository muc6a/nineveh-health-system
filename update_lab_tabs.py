import os

file_path = "src/pages/LabDashboard.jsx"

with open(file_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

new_lines = []
skip = False

for line in lines:
    if "{/* In-page Tabs (Matching Operations Room) */}" in line:
        skip = True
    
    if not skip:
        new_lines.append(line)
        
    if skip and "            )}" in line:
        # Check if the previous lines were the tab buttons
        if len(new_lines) > 0:
            skip = False

with open(file_path, "w", encoding="utf-8") as f:
    f.writelines(new_lines)

print("Internal tabs removed from LabDashboard.jsx")
