import re

with open('src/pages/ExecutivePortal.jsx', 'r', encoding='utf-8') as f:
    exec_content = f.read()

# 1. Change title of send directive form
exec_content = exec_content.replace('📢 بوابة الأوامر والتعميمات الإدارية', '📢 إرسال تبليغ جديد')

# 2. Change title of inbox list
exec_content = exec_content.replace('التبليغات\n                </h3>', 'رؤية التبليغات والتوجيهات\n                </h3>')
exec_content = exec_content.replace('<Mail className="w-5 h-5" />\n                  التبليغات', '<Mail className="w-5 h-5" />\n                  رؤية التبليغات والتوجيهات')

# 3. Increase height of the boxes
exec_content = exec_content.replace('max-h-[600px] overflow-y-auto', 'h-[80vh] overflow-y-auto')
exec_content = exec_content.replace('sticky top-6', 'sticky top-6 min-h-[80vh]')

# 4. Change "الفرق الميدانية والتوجيه السريع" and add quickTeamDispatch permission check
old_quick_dispatch = """        {activeTab === 'field_dispatch' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white">🚀 الفرق الميدانية والتوجيه السريع</h2>"""

new_quick_dispatch = """        {activeTab === 'field_dispatch' && hasPerm('quickTeamDispatch') && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white">🚀 التوجيه السريع للفرق الميدانية</h2>"""
exec_content = exec_content.replace(old_quick_dispatch, new_quick_dispatch)

# Replace the other occurrence if it exists (in the directives page bottom section)
# Wait, the screenshot shows "الفرق الميدانية والتوجيه السريع" below the "التبليغات" and "إرسال تبليغ جديد" forms!
# In ExecutivePortal.jsx, activeTab === 'directives' has this section at the bottom? Let's check!
