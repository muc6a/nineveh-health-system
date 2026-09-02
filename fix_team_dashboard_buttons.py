import re

with open('src/pages/TeamDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Edit Evaluation
edit_eval_old = r"""                              return hasHistory && \(
                                <button
                                  disabled=\{isEditLocked\}
                                  onClick=\{\(\) => navigate\(`/inspection/new\?id=\$\{est\.id\}&edit=true`\)\}
                                  className=\{`px-2\.5 py-1\.5 flex items-center justify-center gap-1\.5 rounded-lg transition-all active:scale-95 cursor-pointer no-print font-bold text-\[10px\] \$\{
                                    isEditLocked 
                                      \? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-50' 
                                      : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400'
                                  \}`\}
                                  title=\{isEditLocked \? lockReason : ''\}
                                >
                                  <CheckSquare className="w-3\.5 h-3\.5" />
                                  <span>تعديل تقييم</span>
                                </button>
                              \);"""

edit_eval_new = """                              return hasHistory && (hasPerm('editEvaluation') || hasPerm('editEst')) && (
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
                              );"""
content = re.sub(edit_eval_old, edit_eval_new, content)


# 2. Edit & Delete Establishment
edit_del_old = r"""                            \{hasPerm\('manageEstablishments'\) && \(
                              <>
                                <button
                                  onClick=\{\(\) => setEstablishmentModalState\(\{ isOpen: true, mode: 'edit', data: est \}\)\}
                                  className="px-2\.5 py-1\.5 flex items-center justify-center gap-1\.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 transition-all active:scale-95 cursor-pointer no-print font-bold text-\[10px\]"
                                >
                                  <Edit className="w-3\.5 h-3\.5" />
                                  <span>تعديل منشأة</span>
                                </button>
                                <button
                                  onClick=\{\(\) => \{
                                    if \(window\.confirm\('هل أنت متأكد من حذف هذه المنشأة بشكل نهائي؟'\)\) \{
                                      logAudit\('حذف منشأة', est\.id, est, null, 'إزالة نهائية', user\);
                                      deleteEstablishment\(est\.id\);
                                    \}
                                  \}\}
                                  className="px-2\.5 py-1\.5 flex items-center justify-center gap-1\.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 transition-all active:scale-95 cursor-pointer no-print font-bold text-\[10px\]"
                                >
                                  <Trash className="w-3\.5 h-3\.5" />
                                  <span>حذف</span>
                                </button>
                              </>
                            \)\}"""

edit_del_new = """                            {hasPerm('manageEstablishments') && (
                              <>
                                {(hasPerm('editEstablishment') || hasPerm('editEst')) && (
                                  <button
                                    onClick={() => setEstablishmentModalState({ isOpen: true, mode: 'edit', data: est })}
                                    className="px-2.5 py-1.5 flex items-center justify-center gap-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 transition-all active:scale-95 cursor-pointer no-print font-bold text-[10px]"
                                  >
                                    <Edit className="w-3.5 h-3.5" />
                                    <span>تعديل منشأة</span>
                                  </button>
                                )}
                                {(hasPerm('deleteEstablishment') || hasPerm('deleteEst')) && (
                                  <button
                                    onClick={() => {
                                      if (window.confirm('هل أنت متأكد من حذف هذه المنشأة بشكل نهائي؟')) {
                                        logAudit('حذف منشأة', est.id, est, null, 'إزالة نهائية', user);
                                        deleteEstablishment(est.id);
                                      }
                                    }}
                                    className="px-2.5 py-1.5 flex items-center justify-center gap-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 transition-all active:scale-95 cursor-pointer no-print font-bold text-[10px]"
                                  >
                                    <Trash className="w-3.5 h-3.5" />
                                    <span>حذف</span>
                                  </button>
                                )}
                              </>
                            )}"""
content = re.sub(edit_del_old, edit_del_new, content)

with open('src/pages/TeamDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("TeamDashboard buttons updated")
