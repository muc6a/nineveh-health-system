import re

def update_file(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Change items-start to items-stretch for the directives grid
    # It might be safer to replace the exact grid line that is under activeTab === 'directives'
    # but since it's a specific grid, let's just replace it directly.
    content = content.replace('<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">',
                              '<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">')

    # 2. Update Form container
    old_form = 'className="glassmorphic-card p-5 border border-amber-500/20 bg-amber-500/5 dark:bg-amber-950/10 text-right rounded-3xl sticky top-6"'
    new_form = 'className="glassmorphic-card p-5 border border-amber-500/20 bg-amber-500/5 dark:bg-amber-950/10 text-right rounded-3xl h-full flex flex-col justify-start"'
    content = content.replace(old_form, new_form)

    # 3. Update Inbox container
    old_inbox = 'className="glassmorphic-card p-5 border border-amber-500/20 bg-slate-900 rounded-3xl max-h-[600px] overflow-y-auto"'
    new_inbox = 'className="glassmorphic-card p-5 border border-amber-500/20 bg-slate-900 rounded-3xl flex flex-col h-full overflow-hidden"'
    content = content.replace(old_inbox, new_inbox)

    # 4. Make the inner directives list scrollable
    old_list_container = '<div className="space-y-4 text-right pr-1">'
    new_list_container = '<div className="space-y-4 text-right pr-1 flex-1 overflow-y-auto custom-scrollbar">'
    
    # Ensure we only replace the one inside the directives box, but it's fine as there is likely only one
    # If there are multiple, let's be careful. Let's just do replace.
    content = content.replace(old_list_container, new_list_container)

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)

update_file('src/pages/ExecutivePortal.jsx')
update_file('src/pages/TeamDashboard.jsx')

