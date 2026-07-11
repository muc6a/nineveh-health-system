import os
import re

filepath = 'src/pages/SuperAdminPanel.jsx'
full_path = os.path.join('/Users/admin/web/منظومة الرقابة الصحية الرقمية', filepath)

replacements = [
    (r'bg-slate-900/50 border-l border-white/5', r'bg-slate-100/50 dark:bg-slate-900/50 border-l border-slate-200 dark:border-white/5'),
    (r'bg-white/5 border border-white/10 shadow', r'bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow'),
    (r'text-white mb-5 truncate', r'text-slate-800 dark:text-white mb-5 truncate'),
    (r'bg-slate-800/80 ring-1 ring-white/5', r'bg-slate-200 dark:bg-slate-800/80 ring-1 ring-slate-300 dark:ring-white/5'),
    (r'text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent', r'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-slate-200 border border-transparent'),
    (r"bg-slate-800 text-slate-500'", r"bg-slate-200 dark:bg-slate-800 text-slate-500'"),
    (r'bg-slate-900/40 relative z-10', r'bg-slate-50/80 dark:bg-slate-900/40 relative z-10'),
    (r'border-b border-white/5', r'border-b border-slate-200 dark:border-white/5'),
    (r'text-xl font-black text-white flex items-center', r'text-xl font-black text-slate-800 dark:text-white flex items-center'),
    (r"bg-slate-800/40 border-white/5 hover:bg-slate-800/80 hover:border-white/10'", r"bg-white/60 dark:bg-slate-800/40 border-slate-200 dark:border-white/5 hover:bg-white dark:hover:bg-slate-800/80 hover:border-slate-300 dark:hover:border-white/10'"),
    (r"text-slate-200'\}", r"text-slate-700 dark:text-slate-200'}"),
    (r"bg-slate-700/80 border-slate-600 shadow-inner'", r"bg-slate-300 dark:bg-slate-700/80 border-slate-400 dark:border-slate-600 shadow-inner'"),
    (r'border-t border-white/5', r'border-t border-slate-200 dark:border-white/5'),
    (r'bg-amber-500/10 border border-amber-500/20', r'bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20')
]

if os.path.exists(full_path):
    with open(full_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    new_content = content
    for search, replace in replacements:
        new_content = re.sub(search, replace, new_content)
        
    if new_content != content:
        with open(full_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")
    else:
        print(f"No changes in {filepath}")
else:
    print(f"File {filepath} not found")

