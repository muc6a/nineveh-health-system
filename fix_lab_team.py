import re

with open('src/pages/ExecutivePortal.jsx', 'r', encoding='utf-8') as f:
    exec_content = f.read()

# Extract the lab_results block from ExecutivePortal
# Starts with `activeTab === 'lab_results'` and ends before the next ternary or bracket block
# It's better to just copy it manually as a string since we know the structure.
lab_results_block = """
        {activeTab === 'lab_results' && (hasPerm('receiveSamples') || hasPerm('enterLabResults') || hasPerm('labArchive')) && (
          <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-6">
            <div className="glassmorphic-card p-6 border border-fuchsia-500/20">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
                    <FlaskConical className="w-6 h-6 text-fuchsia-600" />
                    نتائج المختبر المركزي (تحتاج قرار)
                  </h3>
                  <p className="text-xs font-bold text-slate-500 mt-1">النتائج المختبرية التي تثبت تلوث العينات وتستوجب اتخاذ قرار الغرامة أو الإغلاق</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {labRequests?.filter(r => r.status === 'finished' && r.result === 'contaminated').length === 0 ? (
                  <div className="text-center p-12 text-slate-400 font-bold bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-white/5">
                    لا توجد عينات ملوثة حالياً تحتاج لقرار.
                  </div>
                ) : (
                  labRequests?.filter(r => r.status === 'finished' && r.result === 'contaminated').map(req => (
                    <div key={req.id} className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/50 rounded-2xl">
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="flex gap-4">
                          <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 flex items-center justify-center shrink-0">
                            <ShieldAlert className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-black text-slate-800 dark:text-white mb-1">المنشأة: {req.estName}</h4>
                            <p className="text-xs text-slate-600 dark:text-slate-300 font-bold">الفريق المرسل: {req.teamName}</p>
                            <p className="text-[10px] text-slate-500 mt-1">تاريخ الفحص: {new Date(req.finishedAt).toLocaleString('ar-IQ')}</p>
                            {req.notes && (
                              <div className="mt-2 p-3 bg-white/50 dark:bg-slate-900/50 rounded-xl text-xs font-bold text-red-700 dark:text-red-400 border border-red-100 dark:border-red-900/30">
                                ملاحظات المختبر: {req.notes}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2 min-w-[200px]">
                          <button 
                            onClick={() => {
                              setLabRequests(prev => prev.map(r => r.id === req.id ? { ...r, result: 'contaminated_action_taken' } : r));
                              notify('تم توجيه طلب غرامة وإغلاق للفريق الميداني', 'success', true);
                            }}
                            className="w-full py-2.5 rounded-xl bg-gradient-to-l from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-black text-xs transition-all shadow-md flex items-center justify-center gap-2"
                          >
                            <AlertOctagon className="w-4 h-4" />
                            توجيه الفريق بالغلق والتغريم
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
"""

with open('src/pages/TeamDashboard.jsx', 'r', encoding='utf-8') as f:
    team_content = f.read()

# Make sure we don't duplicate
if "{activeTab === 'lab_results' && (hasPerm('receiveSamples')" not in team_content:
    # Insert it right before the activeTab === 'complaints' block
    team_content = team_content.replace(
        "{activeTab === 'complaints' && (hasPerm('showPublicEvalsPage') || hasPerm('showDeliveryPage')) && (",
        lab_results_block + "\n        {activeTab === 'complaints' && (hasPerm('showPublicEvalsPage') || hasPerm('showDeliveryPage')) && ("
    )

    with open('src/pages/TeamDashboard.jsx', 'w', encoding='utf-8') as f:
        f.write(team_content)
        print("Successfully injected lab_results into TeamDashboard")
else:
    print("lab_results already exists in TeamDashboard")

