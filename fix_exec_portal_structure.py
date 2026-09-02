import re

with open('src/pages/ExecutivePortal.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Make ExecutivePortal read the query parameter for 'tab'
if "useLocation()" not in content:
    content = content.replace("import { useNavigate } from 'react-router-dom';", "import { useNavigate, useLocation } from 'react-router-dom';")

url_tab_logic = """  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialUrlTab = queryParams.get('tab');

  useEffect(() => {
    if (initialUrlTab && tabConfig[initialUrlTab]) {
      const config = tabConfig[initialUrlTab];
      if (!config.permission || hasPerm(config.permission)) {
        if (initialUrlTab === 'establishments') {
          setExecutiveTab('establishments');
        } else {
          setExecutiveTab('dashboard');
          setActiveTab(initialUrlTab);
        }
      }
    }
  }, [initialUrlTab, user?.permissions]);
"""
if "const queryParams = new URLSearchParams" not in content:
    content = content.replace("const getInitialTab = () => {", url_tab_logic + "\n  const getInitialTab = () => {")

# Fix the merged UI block
# I will use string replacements to un-nest them.
# In debug_exec.txt, we saw that 'lab_results' is literally inside 'complaints'.
# And 'Field Teams Quick Dispatch' is inside 'directives' but protected by lab permissions!

# Let's fix the complaints block:
# It starts with `) : activeTab === 'complaints' && hasPerm('showPublicEvalsPage') ? (`
# But `showPublicEvalsPage` should be `hasPerm('showPublicEvalsPage') || hasPerm('showDeliveryPage')`
content = content.replace(
    "activeTab === 'complaints' && hasPerm('showPublicEvalsPage') ? (",
    "activeTab === 'complaints' && (hasPerm('showPublicEvalsPage') || hasPerm('showDeliveryPage')) ? ("
)

# Find the end of complaints and separate lab_results
# Currently, it looks like:
#             {hasPerm('receiveSamples') || hasPerm('enterLabResults') || hasPerm('labArchive') && (
# <div className="glassmorphic-card p-6 border border-blue-500/20">
#             <h3 className="text-sm font-black text-slate-800 dark:text-white mb-2 flex items-center gap-2">
#               <Target className="w-5 h-5 text-blue-500" />
#               الفرق الميدانية والتوجيه السريع
#             </h3>
# ...
#             )}
#           </div>
#         ) : activeTab === 'complaints' && hasPerm('showPublicEvalsPage') ? (

# Wait! "الفرق الميدانية والتوجيه السريع" is actually Quick Dispatch!
# I will remove the lab permission wrapper around it, because it belongs to `directives`!
bad_lab_wrapper = r"\{\s*hasPerm\('receiveSamples'\)\s*\|\|\s*hasPerm\('enterLabResults'\)\s*\|\|\s*hasPerm\('labArchive'\)\s*&&\s*\(\s*(<div className=\"glassmorphic-card p-6 border border-blue-500/20\">[\s\S]*?الفرق الميدانية والتوجيه السريع[\s\S]*?)(\s*\)\s*\}\s*</div>\s*\)\s*:\s*activeTab === 'complaints')"
match = re.search(bad_lab_wrapper, content)
if match:
    # Just render it as part of directives
    replacement = r"\1\2"
    content = content.replace(match.group(0), match.group(1) + match.group(2))
    # Wait, the closing `)}` from the wrapper needs to be removed!
    # Let's be safer and replace the start and end separately.
    content = content.replace("{hasPerm('receiveSamples') || hasPerm('enterLabResults') || hasPerm('labArchive') && (", "{hasPerm('sendDirective') && (")

# Now what about lab_results?
# It is AT THE END, but maybe the ternary is messed up?
# Wait, I found it at line 807 of ExecutivePortal.jsx!
# 805-            />
# 806-          </div>
# 807:        ) : activeTab === 'lab_results' && (hasPerm('receiveSamples') || hasPerm('enterLabResults') || hasPerm('labArchive')) ? (
# 808-          <div className="glassmorphic-card p-6 border border-fuchsia-500/20">
# Wait, if it IS at line 807, then it's NOT inside complaints. Complaints is at line 1092!
# Let me double check if `lab_results` is showing up.

with open('src/pages/ExecutivePortal.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
