import re

with open('src/pages/TeamDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix default tab
old_state = "const [directiveTab, setDirectiveTab] = useState('inbox');"
new_state = """  const [directiveTab, setDirectiveTab] = useState(() => {
    if (user?.permissions?.showDirectivesPage) return 'inbox';
    if (user?.permissions?.sendDirective) return 'send';
    if (user?.permissions?.replyDirective) return 'replies';
    return 'inbox';
  });"""
content = content.replace(old_state, new_state)

# Hide tabs if only 1 permission
old_tabs = """            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">"""
new_tabs = """            {[hasPerm('showDirectivesPage'), hasPerm('sendDirective'), hasPerm('replyDirective')].filter(Boolean).length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
"""
content = content.replace(old_tabs, new_tabs)

# Close the new condition block before the tab content starts
old_tab_content = """              )}
            </div>

            {directiveTab === 'inbox' && hasPerm('showDirectivesPage') && ("""

new_tab_content = """              )}
            </div>
            )}

            {directiveTab === 'inbox' && hasPerm('showDirectivesPage') && ("""
content = content.replace(old_tab_content, new_tab_content)

with open('src/pages/TeamDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed TeamDashboard Directives Tabs UI")
