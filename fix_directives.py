import re

def wrap_inbox_outbox(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Wrap Directives Inbox/Outbox List
    # From {/* Directives Inbox/Outbox List */}
    # to the end of the div (which is just before `          </div>\n            \n            {hasPerm('quickTeamDispatch')` or similar)
    
    # Actually, we can use string replace safely if we capture the exact structure.
    # The start is:             {/* Directives Inbox/Outbox List */}
    # The div starts right after.
    
    # A safer way using regex:
    pattern = r"( \{\/\* Directives Inbox/Outbox List \*\/\}\n\s*)(<div className=\"glassmorphic-card p-5 border border-amber-500/20 bg-slate-900.*?\n\s+</div>\n\s+</div>)"
    # We replace with: \1{hasPerm('showDirectivesPage') && (\n\2\n)}
    # Let's write a targeted function to do this.
    pass

wrap_inbox_outbox('src/pages/TeamDashboard.jsx')
