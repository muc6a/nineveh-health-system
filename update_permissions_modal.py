import re

filepath = "/Users/admin/web/منظومة الرقابة الصحية الرقمية/src/pages/SuperAdminPanel.jsx"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# Fix outer container for mobile scrolling
target_container = """<div className="w-full max-w-4xl bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-[2rem] text-slate-800 dark:text-white shadow-[0_0_50px_-12px_rgba(168,85,247,0.3)] relative flex flex-col md:flex-row text-right max-h-[90vh] overflow-hidden">"""
replacement_container = """<div className="w-full max-w-4xl bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-[2rem] text-slate-800 dark:text-white shadow-[0_0_50px_-12px_rgba(168,85,247,0.3)] relative flex flex-col md:flex-row text-right max-h-[90vh] overflow-hidden">"""
# Wait, if we keep overflow-hidden on outer, we MUST make the inner left container min-h-0 and footer sticky properly.

# Left Content Area:
target_left = """              {/* Left Content Area: Toggle Switches */}
              <div className="w-full md:w-2/3 p-8 flex flex-col h-full bg-slate-50/80 dark:bg-slate-900/40 relative z-10">"""
replacement_left = """              {/* Left Content Area: Toggle Switches */}
              <div className="w-full md:w-2/3 flex flex-col h-[70vh] md:h-full bg-slate-50/80 dark:bg-slate-900/40 relative z-10 min-h-0">
                <div className="p-4 md:p-8 flex flex-col min-h-0 flex-1 overflow-hidden">"""
content = content.replace(target_left, replacement_left)

# Inner part of left content:
target_inner_bottom = """                  {activePermissionsTab === 'directives' && (
                    <div className="mt-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      <p className="text-[11px] text-amber-400/90 font-bold leading-relaxed">
                        تنويه: إطفاء إذن الإرسال والرد يكتسب من خلاله الحساب "صلاحية المشاهدة فقط" للتبليغات الموجهة له دون إمكانية الرد عليها أو إرسال تبليغات جديدة.
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/5 shrink-0">
                  <button onClick={handleSavePermissions} className="w-full py-4 rounded-2xl bg-gradient-to-l from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-sm transition-all shadow-[0_10px_25px_-5px_rgba(124,58,237,0.4)] hover:shadow-[0_15px_35px_-5px_rgba(124,58,237,0.5)] hover:-translate-y-0.5 active:translate-y-0">
                    حفظ واعتماد صلاحيات الحساب
                  </button>
                </div>
              </div>"""

replacement_inner_bottom = """                  {activePermissionsTab === 'directives' && (
                    <div className="mt-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      <p className="text-[11px] text-amber-400/90 font-bold leading-relaxed">
                        تنويه: إطفاء إذن الإرسال والرد يكتسب من خلاله الحساب "صلاحية المشاهدة فقط" للتبليغات الموجهة له دون إمكانية الرد عليها أو إرسال تبليغات جديدة.
                      </p>
                    </div>
                  )}
                </div>
                </div>

                {/* STICKY FOOTER OUTSIDE SCROLLING AREA */}
                <div className="shrink-0 p-4 md:p-6 lg:p-8 border-t border-slate-200 dark:border-white/5 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-xl z-20">
                  <button onClick={handleSavePermissions} className="w-full py-4 rounded-2xl bg-gradient-to-l from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-sm transition-all shadow-[0_10px_25px_-5px_rgba(124,58,237,0.4)] hover:shadow-[0_15px_35px_-5px_rgba(124,58,237,0.5)] active:scale-[0.98]">
                    حفظ واعتماد صلاحيات الحساب
                  </button>
                </div>
              </div>"""
content = content.replace(target_inner_bottom, replacement_inner_bottom)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated PermissionsModal layout in SuperAdminPanel.jsx")
