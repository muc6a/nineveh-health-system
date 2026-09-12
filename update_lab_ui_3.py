import re

# 1. Update LabDashboard.jsx
with open("src/pages/LabDashboard.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# a) Remove bottom user profile from sidebar
bottom_sidebar_target = r"""        <div className="pt-4 border-t border-slate-200/50 dark:border-slate-800/50">\s*<div className="flex items-center gap-3 px-3 mb-4">\s*<div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-md">\s*\{user\?\.name\?\.charAt\(0\) \|\| 'م'\}\s*</div>\s*<div className="flex-1 overflow-hidden">\s*<h4 className="text-sm font-bold text-slate-800 dark:text-white truncate">\{user\?\.name\}</h4>\s*<p className="text-xs text-slate-500 truncate">\{user\?\.sector \|\| 'نطاق غير محدد'\}</p>\s*</div>\s*</div>\s*<button \s*onClick=\{globalLogout\}"""
bottom_sidebar_replace = """        <div className="pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
          <button 
            onClick={globalLogout}"""
content = re.sub(bottom_sidebar_target, bottom_sidebar_replace, content)

# b) Remove the button from the header
header_btn_target = r"""          \{\(activeTab === 'incoming' \|\| activeTab === 'testing'\) && hasPerm\('receiveSamples'\) && \(\s*<div className="mt-2">\s*<button \s*onClick=\{\(\) => setNewSampleModal\(\{ isOpen: true \}\)\}\s*className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-\[10px\] transition-all shadow-md flex items-center gap-1.5 cursor-pointer w-fit"\s*>\s*➕ إنشاء عينة جديدة يدويًا\s*</button>\s*</div>\s*\)\}\s*</header>"""
header_btn_replace = """        </header>"""
content = re.sub(header_btn_target, header_btn_replace, content)

# c) Add the button to incoming tab
incoming_target = r"""            \{\/\* INCOMING \*\/\}\s*\{activeTab === 'incoming' && \(\s*<div className="bg-white dark:bg-slate-900 rounded-\[2rem\] p-6 border border-slate-200/50 dark:border-white/5 shadow-sm min-h-\[50vh\] animate-in fade-in duration-500">\s*<div className="space-y-4">"""
incoming_replace = """            {/* INCOMING */}
            {activeTab === 'incoming' && (
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-200/50 dark:border-white/5 shadow-sm min-h-[50vh] animate-in fade-in duration-500">
                <div className="flex justify-end mb-6">
                  {hasPerm('receiveSamples') && (
                    <button 
                      onClick={() => setNewSampleModal({ isOpen: true })}
                      className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm transition-all shadow-md flex items-center gap-2 cursor-pointer"
                    >
                      <Plus className="w-5 h-5" /> إنشاء عينة جديدة يدويًا
                    </button>
                  )}
                </div>
                <div className="space-y-4">"""
content = re.sub(incoming_target, incoming_replace, content)

# d) Add the button to testing tab
testing_target = r"""            \{\/\* TESTING \*\/\}\s*\{activeTab === 'testing' && \(\s*<div className="bg-white dark:bg-slate-900 rounded-\[2rem\] p-6 border border-slate-200/50 dark:border-white/5 shadow-sm min-h-\[50vh\] animate-in fade-in duration-500">\s*<div className="space-y-4">"""
testing_replace = """            {/* TESTING */}
            {activeTab === 'testing' && (
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-200/50 dark:border-white/5 shadow-sm min-h-[50vh] animate-in fade-in duration-500">
                <div className="flex justify-end mb-6">
                  {hasPerm('receiveSamples') && (
                    <button 
                      onClick={() => setNewSampleModal({ isOpen: true })}
                      className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm transition-all shadow-md flex items-center gap-2 cursor-pointer"
                    >
                      <Plus className="w-5 h-5" /> إنشاء عينة جديدة يدويًا
                    </button>
                  )}
                </div>
                <div className="space-y-4">"""
content = re.sub(testing_target, testing_replace, content)

with open("src/pages/LabDashboard.jsx", "w", encoding="utf-8") as f:
    f.write(content)

# 2. Update SuperAdminPanel.jsx
with open("src/pages/SuperAdminPanel.jsx", "r", encoding="utf-8") as f:
    content2 = f.read()

# Add permissions button to labs list
labs_action_target = r"""                            <div className="flex gap-2 justify-center mt-2 opacity-0 group-hover:opacity-100 transition-opacity">\s*<button\s*onClick=\{\(e\) => \{\s*e\.stopPropagation\(\);\s*handleOpenEditAccount\(t, 'lab'\);\s*\}\}"""
labs_action_replace = """                            <div className="flex gap-2 justify-center mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenPermissions({ ...t, role: 'lab' });
                                }}
                                className="px-2.5 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 transition-all cursor-pointer text-[10px] flex items-center gap-1"
                              >
                                <Shield className="w-3.5 h-3.5" /> الصلاحيات
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenEditAccount(t, 'lab');
                                }}"""
content2 = re.sub(labs_action_target, labs_action_replace, content2)

with open("src/pages/SuperAdminPanel.jsx", "w", encoding="utf-8") as f:
    f.write(content2)

print("Done")
