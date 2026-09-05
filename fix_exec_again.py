import re

with open('src/pages/ExecutivePortal.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the quick dispatch title and add permission wrap
old_quick_dispatch = """            <div className="glassmorphic-card p-6 border border-blue-500/20">
            <h3 className="text-sm font-black text-slate-800 dark:text-white mb-2 flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-500" />
              الفرق الميدانية والتوجيه السريع
            </h3>"""

new_quick_dispatch = """            {hasPerm('quickTeamDispatch') && (
            <div className="glassmorphic-card p-6 border border-blue-500/20 mt-6 lg:col-span-2">
            <h3 className="text-sm font-black text-slate-800 dark:text-white mb-2 flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-500" />
              التوجيه السريع للفرق الميدانية
            </h3>"""

content = content.replace(old_quick_dispatch, new_quick_dispatch)

old_closing = """              </table>
            </div>
          </div>
          </div>
        ) : activeTab === 'complaints'"""

new_closing = """              </table>
            </div>
          </div>
            )}
          </div>
        ) : activeTab === 'complaints'"""

content = content.replace(old_closing, new_closing)

with open('src/pages/ExecutivePortal.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed ExecutivePortal.")
