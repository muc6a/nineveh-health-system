import re

with open('src/pages/TeamDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add import
if 'OperationsRoom' not in content:
    content = content.replace("import { FinesBookletModal", "import OperationsRoom from '../components/OperationsRoom';\nimport { FinesBookletModal")

# Add sidebar button
sidebar_btn = """            {hasPerm('authenticatePenalties') && (
              <button
                onClick={() => { setActiveTab('operations_room'); setIsSidebarOpen(false); }}
                className={`w-full text-right px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center justify-between ${
                  activeTab === 'operations_room'
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-500/10'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ShieldAlert className="w-4.5 h-4.5" />
                  <span>غرفة العمليات المركزية</span>
                </div>
              </button>
            )}
"""
if 'operations_room' not in content:
    content = content.replace("{hasPerm('showReportsPage')", sidebar_btn + "\n            {hasPerm('showReportsPage')")

# Add render block
render_block = """
        {activeTab === 'operations_room' && hasPerm('authenticatePenalties') && (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            <OperationsRoom />
          </div>
        )}
"""
content = content.replace("{activeTab === 'reports'", render_block + "\n        {activeTab === 'reports'")

with open('src/pages/TeamDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

