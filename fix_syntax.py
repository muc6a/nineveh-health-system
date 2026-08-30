import re

file_path = "src/pages/AccountantPanel.jsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Fix the commented out code
content = content.replace("onClick={() => { // setActiveTab('dashboard'); setIsSidebarOpen(false); }}", "onClick={() => { setIsSidebarOpen(false); }}")

# There was another occurrence in handleCloseRegister:
content = content.replace("// setActiveTab('dashboard');", "")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Syntax fixed")
