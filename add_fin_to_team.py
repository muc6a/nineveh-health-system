import re

with open('src/pages/TeamDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add import
if 'FinancialReports' not in content:
    content = content.replace("import OperationsRoom", "import { FinancialReports } from '../components/FinancialReports';\nimport OperationsRoom")

# Add sidebar button
sidebar_btn = """            {hasPerm('financialReports') && (
              <button
                onClick={() => { setActiveTab('financials'); setIsSidebarOpen(false); }}
                className={`w-full text-right px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center justify-between ${
                  activeTab === 'financials'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/10'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <DollarSign className="w-4.5 h-4.5" />
                  <span>المالية والحسابات</span>
                </div>
              </button>
            )}
"""
if 'financials' not in content:
    content = content.replace("{hasPerm('showReportsPage')", sidebar_btn + "\n            {hasPerm('showReportsPage')")

# Add render block
render_block = """
        {activeTab === 'financials' && hasPerm('financialReports') && (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            <FinancialReports />
          </div>
        )}
"""
content = content.replace("{activeTab === 'reports'", render_block + "\n        {activeTab === 'reports'")

with open('src/pages/TeamDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

