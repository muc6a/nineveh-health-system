import re

with open("src/pages/SuperAdminPanel.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# Add trackers tab button
old_buttons = """              <button
                onClick={() => setSubRosterTab('accountants')}
                className={`px-4 py-2 rounded-xl text-sm font-black transition-all cursor-pointer ${subRosterTab === 'accountants' ? 'bg-teal-600 text-white shadow-md' : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400'}`}
              >
                💼 إدارة المحاسبين
              </button>"""

new_buttons = """              <button
                onClick={() => setSubRosterTab('accountants')}
                className={`px-4 py-2 rounded-xl text-sm font-black transition-all cursor-pointer ${subRosterTab === 'accountants' ? 'bg-teal-600 text-white shadow-md' : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400'}`}
              >
                💼 إدارة المحاسبين
              </button>
              <button
                onClick={() => setSubRosterTab('trackers')}
                className={`px-4 py-2 rounded-xl text-sm font-black transition-all cursor-pointer ${subRosterTab === 'trackers' ? 'bg-teal-600 text-white shadow-md' : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400'}`}
              >
                🕵️ إدارة المتابعين الميدانيين
              </button>"""

content = content.replace(old_buttons, new_buttons)

with open("src/pages/SuperAdminPanel.jsx", "w", encoding="utf-8") as f:
    f.write(content)
