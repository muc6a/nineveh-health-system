import re

with open('src/pages/LabDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# We need the imports, specifically lucide-react and React hooks
imports_block = """import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { FlaskConical, CheckCircle, AlertTriangle, Clock, Archive, FileText, Check, X, ShieldAlert, FileSearch, Power, BarChart3, LayoutDashboard, Menu, LogOut } from 'lucide-react';

export const LabManager = () => {
"""

# Extract the state and functions
start_idx = content.find("  const { user, setUser, navigate")
end_idx = content.find("  return (")

if start_idx == -1 or end_idx == -1:
    print("Could not find state block")
    exit(1)

state_block = content[start_idx:end_idx]

# Modify the state block:
# - change activeTab to labTab
# - remove navigate, setUser, globalLogout if they aren't needed, but it's safe to just leave them (or remove navigate)
state_block = state_block.replace("activeTab", "labTab")
state_block = state_block.replace("setActiveTab", "setLabTab")
state_block = state_block.replace("const { user, setUser, navigate, notify, labRequests, setLabRequests, systemNotifications, setSystemNotifications, establishments, playBeep, uiPreferences , globalLogout }", "const { user, labRequests, setLabRequests, systemNotifications, setSystemNotifications, establishments, playBeep, uiPreferences }")

# Remove the useEffect for routing protect route
state_block = re.sub(r"  // Protect route.*?  }, \[user, navigate\]\);\n", "", state_block, flags=re.DOTALL)
state_block = state_block.replace("  if (!user) return null;\n", "")

# We also need the "Scrollable Content Area" and Modals
# Find "Scrollable Content Area"
scroll_start = content.find("{/* Scrollable Content Area */}")
if scroll_start == -1:
    print("Could not find Scrollable Content Area")
    exit(1)

# Find the end of the return statement. It ends at `</div>\n  );\n};`
# But let's just find `</main>` and grab what's inside and the modals.
main_end = content.find("</main>")

content_area = content[scroll_start:main_end]

# Extract Modals
modals_start = content.find("{/* Result Modal */}")
modals_end = content.find("    </div>\n  );\n};")
if modals_start == -1 or modals_end == -1:
    print("Could not find Modals")
    exit(1)
modals = content[modals_start:modals_end]

# Now let's assemble it!
# Wait, content_area has `<div className="flex-1 overflow-y-auto...`
# We want to replace it with our top tabs and the content.

# The tabs UI
tabs_ui = """
      {/* Top Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 border-b border-slate-200 dark:border-slate-800 custom-scrollbar">
        <button
          onClick={() => setLabTab('stats')}
          className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${labTab === 'stats' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
        >
          <BarChart3 className="w-4 h-4" /> الرئيسية والتقارير
        </button>
        <button
          onClick={() => setLabTab('incoming')}
          className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${labTab === 'incoming' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
        >
          <Clock className="w-4 h-4" /> الطلبات الواردة
          {incomingReqs.length > 0 && <span className="bg-amber-100 text-amber-700 px-1.5 rounded-md text-[10px]">{incomingReqs.length}</span>}
        </button>
        <button
          onClick={() => setLabTab('testing')}
          className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${labTab === 'testing' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
        >
          <FlaskConical className="w-4 h-4" /> قيد الفحص
          {testingReqs.length > 0 && <span className="bg-indigo-100 text-indigo-700 px-1.5 rounded-md text-[10px]">{testingReqs.length}</span>}
        </button>
        <button
          onClick={() => setLabTab('archive')}
          className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${labTab === 'archive' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
        >
          <Archive className="w-4 h-4" /> الأرشيف المختبري
        </button>
        
        {labTab === 'incoming' && (
          <div className="mr-auto">
            <button 
              onClick={() => setNewSampleModal({ isOpen: true })}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[10px] transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              ➕ إنشاء عينة جديدة
            </button>
          </div>
        )}
        {labTab === 'testing' && (
          <div className="mr-auto">
            <button 
              onClick={() => setNewSampleModal({ isOpen: true })}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[10px] transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              ➕ إنشاء عينة جديدة
            </button>
          </div>
        )}
      </div>
"""

# Extract the inner contents of `content_area` (ignoring the wrapping div)
inner_content = content_area[content_area.find('<div className="max-w-6xl mx-auto space-y-6">'):]
inner_content = inner_content.rsplit("</div>", 1)[0]
inner_content = inner_content.replace("activeTab", "labTab")

new_file_content = f"""{imports_block}
{state_block}

  return (
    <div className="space-y-6 animate-fade-in">
{tabs_ui}
{inner_content}
{modals}
    </div>
  );
}};
"""

with open('src/components/LabManager.jsx', 'w', encoding='utf-8') as f:
    f.write(new_file_content)

print("Created LabManager.jsx")
