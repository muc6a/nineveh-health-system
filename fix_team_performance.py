import re

with open('src/components/OperationsRoom.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add states for Team Performance if not already there
if "const [selectedPerfTeam, setSelectedPerfTeam] = useState('all');" not in content:
    content = content.replace(
        "const [activeTab, setActiveTab] = useState('penalties');",
        "const [activeTab, setActiveTab] = useState('penalties');\n  const [selectedPerfTeam, setSelectedPerfTeam] = useState('all');"
    )

# The new UI for Team Performance
perf_ui = """      {(user?.permissions?.showFieldTeamsStats || user?.role === 'admin' || user?.role === 'director' || user?.role === 'central_director') && activeTab === 'team_performance' && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div>
              <h3 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-500" />
                أداء الفرق الميدانية
              </h3>
              <p className="text-xs text-slate-500 mt-1">إحصائيات الكشوفات والغرامات المسجلة لهذا الشهر</p>
            </div>
            
            <div className="w-full sm:w-auto flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">تصفية حسب الفريق:</span>
              <select
                value={selectedPerfTeam}
                onChange={(e) => setSelectedPerfTeam(e.target.value)}
                className="w-full sm:w-64 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500 text-xs font-bold font-mono"
              >
                <option value="all">كافة الفرق الميدانية 📊</option>
                {teams.filter(t => t.active).map(t => (
                  <option key={t.id} value={t.id}>{t.name} ({t.sector})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {teams.filter(t => t.active && (selectedPerfTeam === 'all' || t.id === selectedPerfTeam)).map(team => {
              // Calculate stats dynamically from data
              const teamEsts = establishments.filter(e => e.sector === team.sector);
              const teamFines = penaltyRequests.filter(req => req.type === 'fine' && req.status === 'approved' && teamEsts.some(e => e.name === req.estName));
              const teamClosures = penaltyRequests.filter(req => req.type === 'closure' && req.status === 'approved' && teamEsts.some(e => e.name === req.estName));
              
              return (
                <div key={team.id} className="glassmorphic-card p-5 border border-indigo-500/10 hover:border-indigo-500/30 transition-all group">
                  <div className="flex justify-between items-center mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-800 dark:text-white group-hover:text-indigo-600 transition-colors">{team.name}</h4>
                        <p className="text-[10px] font-bold text-slate-500">قاطع المسؤولية: {team.sector}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-black ${team.active ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'}`}>
                      {team.active ? 'نشط' : 'متوقف'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700/50 text-center">
                      <span className="block text-2xl font-black text-slate-700 dark:text-slate-200">{teamEsts.length}</span>
                      <span className="block text-[9px] font-bold text-slate-500 mt-1">الكشوفات</span>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/10 p-3 rounded-xl border border-red-100 dark:border-red-500/10 text-center">
                      <span className="block text-2xl font-black text-red-600">{teamClosures.length}</span>
                      <span className="block text-[9px] font-bold text-red-500 mt-1">الإغلاقات</span>
                    </div>
                    <div className="bg-amber-50 dark:bg-amber-900/10 p-3 rounded-xl border border-amber-100 dark:border-amber-500/10 text-center">
                      <span className="block text-2xl font-black text-amber-600">{teamFines.length}</span>
                      <span className="block text-[9px] font-bold text-amber-500 mt-1">الغرامات</span>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {teams.filter(t => t.active && (selectedPerfTeam === 'all' || t.id === selectedPerfTeam)).length === 0 && (
              <div className="col-span-full p-8 text-center text-slate-500 font-bold bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                لا توجد بيانات متاحة لهذا الفريق.
              </div>
            )}
          </div>
        </div>
      )}"""

# Replace the placeholder
old_perf_ui_pattern = r"\{\(user\?\.permissions\?\.showFieldTeamsStats \|\| user\?\.role === 'admin' \|\| user\?\.role === 'director'\) && activeTab === 'team_performance' && \([\s\S]*?<\/div>\s*\)\}"
content = re.sub(old_perf_ui_pattern, perf_ui, content)

with open('src/components/OperationsRoom.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

