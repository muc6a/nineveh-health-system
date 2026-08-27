import re

filepath = "/Users/admin/web/منظومة الرقابة الصحية الرقمية/src/components/FinancialReports.jsx"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# Add useState import
content = content.replace("import React, { useContext } from 'react';", "import React, { useContext, useState } from 'react';")

# Add state and filter logic
target_1 = """  const { penaltyRequests } = useContext(AppContext);

  const fines = (penaltyRequests || []).filter(r => r.type === 'fine' || r.type === 'closure');"""

replacement_1 = """  const { penaltyRequests, teams } = useContext(AppContext);
  const [selectedTeamFilter, setSelectedTeamFilter] = useState('all');

  const allFines = (penaltyRequests || []).filter(r => r.type === 'fine' || r.type === 'closure');
  const fines = selectedTeamFilter === 'all' 
    ? allFines 
    : allFines.filter(f => f.teamId === selectedTeamFilter || f.teamName === selectedTeamFilter);"""

content = content.replace(target_1, replacement_1)

# Add filter UI
target_2 = """    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center border border-emerald-500/20 text-emerald-600">
          <DollarSign className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-800 dark:text-white">نظام الرقابة المالي</h2>
          <p className="text-xs font-bold text-slate-500">تقارير الجباية والغرامات الفورية</p>
        </div>
      </div>"""

replacement_2 = """    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center border border-emerald-500/20 text-emerald-600">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800 dark:text-white">نظام الرقابة المالي</h2>
            <p className="text-xs font-bold text-slate-500">تقارير الجباية والغرامات الفورية</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-500">تصفية حسب الفريق:</label>
          <select 
            value={selectedTeamFilter}
            onChange={(e) => setSelectedTeamFilter(e.target.value)}
            className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold outline-none"
          >
            <option value="all">كل الفرق (الجميع)</option>
            {teams?.map(t => (
              <option key={t.id} value={t.name}>{t.name}</option>
            ))}
          </select>
        </div>
      </div>"""

content = content.replace(target_2, replacement_2)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated FinancialReports.jsx")
