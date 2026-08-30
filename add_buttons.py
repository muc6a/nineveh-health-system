import os
import re

def main():
    # 1. Update EstablishmentModal.jsx
    est_modal = 'src/components/EstablishmentModal.jsx'
    with open(est_modal, 'r', encoding='utf-8') as f:
        content = f.read()

    btn_code = """          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3.5 rounded-2xl text-xs font-black text-slate-300 hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
          >
            إلغاء
          </button>"""

    new_btn_code = """          {mode === 'edit' && initialData?.id && (
            <button
              type="button"
              onClick={() => window.open(`/dashboard/central/establishments/${initialData.id}`, '_blank')}
              className="px-4 py-3.5 rounded-2xl text-xs font-black text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors border border-transparent hover:border-blue-200 flex items-center gap-2 mr-auto"
            >
              🔗 انتقال لصفحة السجل
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3.5 rounded-2xl text-xs font-black text-slate-300 hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
          >
            إلغاء
          </button>"""

    content = content.replace(btn_code, new_btn_code)
    with open(est_modal, 'w', encoding='utf-8') as f:
        f.write(content)

    # 2. Update TeamDashboard.jsx
    team_dash = 'src/pages/TeamDashboard.jsx'
    with open(team_dash, 'r', encoding='utf-8') as f:
        content2 = f.read()

    delete_btn_code = """                                  <Trash className="w-3.5 h-3.5" />
                                  <span>حذف</span>
                                </button>
                              </>
                            )}
                          </div>"""

    new_delete_btn_code = """                                  <Trash className="w-3.5 h-3.5" />
                                  <span>حذف</span>
                                </button>
                                <button
                                  onClick={() => window.open(`/dashboard/central/establishments/${est.id}`, '_blank')}
                                  className="px-2.5 py-1.5 flex items-center justify-center gap-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 transition-all active:scale-95 cursor-pointer no-print font-bold text-[10px]"
                                >
                                  🔗 انتقال للصفحة
                                </button>
                              </>
                            )}
                          </div>"""

    content2 = content2.replace(delete_btn_code, new_delete_btn_code)
    with open(team_dash, 'w', encoding='utf-8') as f:
        f.write(content2)

    print("Added deep link buttons.")

if __name__ == "__main__":
    main()
