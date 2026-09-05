with open('src/pages/SuperAdminPanel.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = """                  
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-200/50 dark:border-slate-800/50">"""

replacement = """                  
                </div>

              <div className="space-y-4 pt-4 border-t border-slate-200/50 dark:border-slate-800/50">"""

content = content.replace(target, replacement)

with open('src/pages/SuperAdminPanel.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed syntax")
