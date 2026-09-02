import re

with open('src/components/OperationsRoom.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Make activeTab robust
pattern_tabs = r"""      <div className="flex gap-4 border-b border-slate-200 dark:border-slate-800 pb-3 mb-6 overflow-x-auto whitespace-nowrap hide-scrollbar">
        <button onClick=\{\(\) => setActiveTab\('penalties'\)\} className=\{`[^`]+`\}>
          <AlertCircle className="w-4 h-4" />المصادقة على العقوبات \(Penalty Authentication\)
        </button>
        <button onClick=\{\(\) => setActiveTab\('team_performance'\)\} className=\{`[^`]+`\}>
          <Target className="w-4 h-4" />أداء الفرق الميدانية \(Team Performance\)
        </button>
      </div>"""

replacement_tabs = """      {(!user?.permissions?.authenticatePenalties && !user?.permissions?.showFieldTeamsStats && user?.role !== 'admin' && user?.role !== 'director') ? (
        <div className="text-center p-10 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h2 className="text-xl font-black text-slate-700 dark:text-slate-300">لا توجد صلاحيات لعرض هذه الغرفة</h2>
          <p className="text-sm text-slate-500 mt-2">يرجى التواصل مع الإدارة العليا لمنحك الصلاحيات اللازمة.</p>
        </div>
      ) : (
      <div className="flex gap-4 border-b border-slate-200 dark:border-slate-800 pb-3 mb-6 overflow-x-auto whitespace-nowrap hide-scrollbar">
        {(user?.permissions?.authenticatePenalties || user?.role === 'admin' || user?.role === 'director') && (
          <button onClick={() => setActiveTab('penalties')} className={`pb-2 text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${activeTab === 'penalties' ? 'border-b-2 border-red-600 text-red-600 dark:text-red-400 font-extrabold' : 'text-slate-400 hover:text-slate-600'}`}>
            <AlertCircle className="w-4 h-4" />المصادقة على العقوبات (Penalty Authentication)
          </button>
        )}
        {(user?.permissions?.showFieldTeamsStats || user?.role === 'admin' || user?.role === 'director') && (
          <button onClick={() => setActiveTab('team_performance')} className={`pb-2 text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${activeTab === 'team_performance' ? 'border-b-2 border-teal-600 text-teal-600 dark:text-teal-400 font-extrabold' : 'text-slate-400 hover:text-slate-600'}`}>
            <Target className="w-4 h-4" />أداء الفرق الميدانية (Team Performance)
          </button>
        )}
      </div>
      )}"""

content = re.sub(pattern_tabs, replacement_tabs, content)

# Also conditionally render the content blocks
content = content.replace("{activeTab === 'penalties' && (", "{(user?.permissions?.authenticatePenalties || user?.role === 'admin' || user?.role === 'director') && activeTab === 'penalties' && (")
content = content.replace("{activeTab === 'team_performance' && (", "{(user?.permissions?.showFieldTeamsStats || user?.role === 'admin' || user?.role === 'director') && activeTab === 'team_performance' && (")

with open('src/components/OperationsRoom.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed Operations Room component")
