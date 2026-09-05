import re

with open('src/pages/TeamDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the edit evaluation button logic
old_eval = """                            {(() => {
                              const hasHistory = est.history && est.history.length > 0;
                              let isEditLocked = !hasPerm('editEval');
                              let lockReason = 'لا تملك صلاحية التعديل';
                              if (hasHistory && !isEditLocked) {
                                const lastEval = est.history[0];
                                const evalTime = new Date(lastEval.date).getTime();
                                const nowTime = new Date().getTime();
                                const diffHours = (nowTime - evalTime) / (1000 * 60 * 60);
                                isEditLocked = diffHours > 48;
                                lockReason = 'مغلق تلقائياً (مرور 48 ساعة)';
                              }
                              return hasHistory && (hasPerm('editEvaluation') || hasPerm('editEst')) && (
                                <button
                                  disabled={isEditLocked}
                                  onClick={() => navigate(`/inspection/new?id=${est.id}&edit=true`)}
                                  className={`px-2.5 py-1.5 flex items-center justify-center gap-1.5 rounded-lg transition-all active:scale-95 cursor-pointer no-print font-bold text-[10px] ${
                                    isEditLocked 
                                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-50' 
                                      : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400'
                                  }`}
                                  title={isEditLocked ? lockReason : ''}
                                >
                                  <CheckSquare className="w-3.5 h-3.5" />
                                  <span>تعديل تقييم</span>
                                </button>
                              );
                            })()}"""

new_eval = """                            {(() => {
                              const hasHistory = est.history && est.history.length > 0;
                              const canEditEval = hasPerm('editEval') || hasPerm('editEvaluation');
                              if (!canEditEval) return null;
                              
                              let isEditLocked = false;
                              let lockReason = '';
                              if (hasHistory) {
                                const lastEval = est.history[0];
                                const evalTime = new Date(lastEval.date).getTime();
                                const nowTime = new Date().getTime();
                                const diffHours = (nowTime - evalTime) / (1000 * 60 * 60);
                                isEditLocked = diffHours > 48;
                                lockReason = 'مغلق تلقائياً (مرور 48 ساعة)';
                              }
                              
                              if (isEditLocked) return null; // Hide completely if locked, per user instruction
                              
                              return hasHistory && (
                                <button
                                  onClick={() => navigate(`/inspection/new?id=${est.id}&edit=true`)}
                                  className="px-2.5 py-1.5 flex items-center justify-center gap-1.5 rounded-lg transition-all active:scale-95 cursor-pointer no-print font-bold text-[10px] bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400"
                                >
                                  <CheckSquare className="w-3.5 h-3.5" />
                                  <span>تعديل تقييم</span>
                                </button>
                              );
                            })()}"""

content = content.replace(old_eval, new_eval)

with open('src/pages/TeamDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated TeamDashboard Edit Logic")
