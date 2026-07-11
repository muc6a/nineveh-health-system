import os
import re

files = [
    'src/components/AccountModal.jsx',
    'src/components/EstablishmentModal.jsx',
    'src/pages/SuperAdminPanel.jsx',
    'src/pages/TeamDashboard.jsx'
]

replacements = [
    # Modals main background
    (r'bg-slate-950/80', r'bg-slate-900/40 dark:bg-slate-950/80'),
    (r'bg-slate-900/90', r'bg-white/95 dark:bg-slate-900/90'),
    # Modals inner wrapper borders and text
    (r'border border-white/10 rounded-\[2rem\] text-white', r'border border-slate-200 dark:border-white/10 rounded-[2rem] text-slate-800 dark:text-white'),
    # AccountModal sticky header
    (r'bg-slate-900/40 sticky top-0', r'bg-white/50 dark:bg-slate-900/40 sticky top-0'),
    (r'border-white/5 bg-slate-900/40', r'border-slate-200 dark:border-white/5 bg-white/50 dark:bg-slate-900/40'),
    # Icons and badges inner containers
    (r'bg-slate-800/80 border border-white/10 text-purple-400', r'bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-purple-600 dark:text-purple-400'),
    (r'bg-slate-800/40 border border-white/5', r'bg-slate-100/40 dark:bg-slate-800/40 border border-slate-200 dark:border-white/5'),
    # inputs and selects
    (r'bg-slate-900/60 border border-white/10 text-white', r'bg-slate-50 dark:bg-slate-900/60 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-white'),
    (r'bg-slate-900/50 border border-white/10 text-white', r'bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-white'),
    (r'bg-slate-800 border border-slate-700 text-white', r'bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white'),
    # AccountModal typography
    (r'from-purple-400 to-indigo-400', r'from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400'),
    (r'text-slate-300 cursor-pointer', r'text-slate-600 dark:text-slate-300 cursor-pointer'),
    (r'hover:text-white transition-colors', r'hover:text-slate-900 dark:hover:text-white transition-colors'),
    (r'text-teal-400', r'text-teal-600 dark:text-teal-400'),
    (r'from-teal-400 to-emerald-400', r'from-teal-600 to-emerald-600 dark:from-teal-400 dark:to-emerald-400'),
    (r'bg-white/5 hover:bg-white/10 text-slate-300', r'bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300'),
    (r'border border-white/5', r'border border-slate-200 dark:border-white/5'),
    
    # EstablishmentModal specific
    (r'from-amber-400 to-orange-400', r'from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400'),
    (r'text-slate-400 hover:bg-slate-800 hover:text-slate-200', r'text-slate-600 hover:bg-slate-200 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'),
    (r'bg-slate-800/60 border-white/5 text-slate-400', r'bg-slate-100/60 dark:bg-slate-800/60 border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400'),
    (r'bg-slate-800/40 p-5', r'bg-slate-100/40 dark:bg-slate-800/40 p-5'),
    (r'bg-slate-800/40 p-6', r'bg-slate-100/40 dark:bg-slate-800/40 p-6'),
    
    # QR code modals (SuperAdminPanel & TeamDashboard)
    (r'bg-slate-800/40 border border-white/5 shadow-\[inset_0_0_20px_rgba\(255,255,255,0\.02\)\] text-right', r'bg-slate-100/40 dark:bg-slate-800/40 border border-slate-200 dark:border-white/5 shadow-[inset_0_0_20px_rgba(0,0,0,0.02)] dark:shadow-[inset_0_0_20px_rgba(255,255,255,0.02)] text-right'),
    (r'text-white shadow-\[0_0_50px_-12px_rgba\(20,184,166,0\.3\)\]', r'text-slate-800 dark:text-white shadow-[0_0_50px_-12px_rgba(20,184,166,0.3)]'),
    (r'border-b border-white/10 mb-5', r'border-b border-slate-200 dark:border-white/10 mb-5'),
    (r'text-slate-400\">النشاط:', r'text-slate-600 dark:text-slate-400\">النشاط:'),
    (r'text-slate-400\">المالك:', r'text-slate-600 dark:text-slate-400\">المالك:'),
    (r'text-slate-400\">رقم الهاتف:', r'text-slate-600 dark:text-slate-400\">رقم الهاتف:'),
    (r'text-slate-400\">الترخيص:', r'text-slate-600 dark:text-slate-400\">الترخيص:'),
    (r'text-slate-400\">آخر زيارة تفتيش:', r'text-slate-600 dark:text-slate-400\">آخر زيارة تفتيش:'),
    (r'text-slate-400\">التقييم:', r'text-slate-600 dark:text-slate-400\">التقييم:'),
    (r'text-slate-200\"', r'text-slate-800 dark:text-slate-200\"'),
    (r'text-white tracking-widest', r'text-slate-900 dark:text-white tracking-widest'),
    (r'border-4 border-slate-900', r'border-4 border-slate-200 dark:border-slate-900'),
    (r'text-slate-400 font-extrabold transition-all border border-transparent hover:border-white/10', r'text-slate-600 dark:text-slate-400 font-extrabold transition-all border border-transparent hover:border-slate-300 dark:hover:border-white/10'),
]

for filepath in files:
    full_path = os.path.join('/Users/admin/web/منظومة الرقابة الصحية الرقمية', filepath)
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

