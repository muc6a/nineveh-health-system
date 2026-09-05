import re

with open('src/pages/TeamDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

bad_snippet = """            {[hasPerm('showDirectivesPage'), hasPerm('sendDirective'), hasPerm('replyDirective')].filter(Boolean).length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">

              {hasPerm('showPublicEvalsPage') && ("""

good_snippet = """            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">

              {hasPerm('showPublicEvalsPage') && ("""

content = content.replace(bad_snippet, good_snippet)

with open('src/pages/TeamDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed the global replace issue in TeamDashboard")
