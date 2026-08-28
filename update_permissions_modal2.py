import re

filepath = "/Users/admin/web/منظومة الرقابة الصحية الرقمية/src/pages/SuperAdminPanel.jsx"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Outer Container
target_outer = """<div className="w-full max-w-4xl bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-[2rem] text-slate-800 dark:text-white shadow-[0_0_50px_-12px_rgba(168,85,247,0.3)] relative flex flex-col md:flex-row text-right max-h-[90vh] overflow-hidden">"""
replacement_outer = """<div className="w-full max-w-4xl bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-[2rem] text-slate-800 dark:text-white shadow-[0_0_50px_-12px_rgba(168,85,247,0.3)] relative flex flex-col text-right max-h-[90vh] overflow-hidden">
              
              {/* Main Scrollable Body */}
              <div className="flex flex-col md:flex-row flex-1 overflow-y-auto md:overflow-hidden min-h-0">"""
content = content.replace(target_outer, replacement_outer)

# 2. Sidebar
target_sidebar = """<div className="w-full md:w-1/3 bg-slate-100/50 dark:bg-slate-900/50 border-l border-slate-200 dark:border-white/5 p-6 flex flex-col relative z-10">"""
replacement_sidebar = """<div className="w-full md:w-1/3 bg-slate-100/50 dark:bg-slate-900/50 border-l border-slate-200 dark:border-white/5 p-6 flex flex-col relative z-10 shrink-0 md:overflow-y-auto custom-scrollbar">"""
content = content.replace(target_sidebar, replacement_sidebar)

# 3. Content Area
target_content = """{/* Left Content Area: Toggle Switches */}
              <div className="w-full md:w-2/3 flex flex-col h-[70vh] md:h-full bg-slate-50/80 dark:bg-slate-900/40 relative z-10 min-h-0">
                <div className="p-4 md:p-8 flex flex-col min-h-0 flex-1 overflow-hidden">
                <div className="flex items-center justify-between mb-8 pb-5 border-b border-slate-200 dark:border-white/5 shrink-0">"""
replacement_content = """{/* Left Content Area: Toggle Switches */}
              <div className="w-full md:w-2/3 flex flex-col bg-slate-50/80 dark:bg-slate-900/40 relative z-10 shrink-0 md:shrink md:min-h-0">
                <div className="p-4 md:p-8 flex flex-col min-h-0 flex-1 md:overflow-hidden">
                <div className="flex items-center justify-between mb-8 pb-5 border-b border-slate-200 dark:border-white/5 shrink-0">"""
content = content.replace(target_content, replacement_content)

# 4. Scrollable List in Content Area
target_scroll_list = """<div className="flex-1 overflow-y-auto pr-3 pb-6 space-y-3 custom-scrollbar">"""
replacement_scroll_list = """<div className="flex-1 md:overflow-y-auto pr-3 pb-6 space-y-3 custom-scrollbar">"""
content = content.replace(target_scroll_list, replacement_scroll_list)

# 5. Footer (close the Main Body flex-row and add Footer at outer modal level)
target_footer = """{/* STICKY FOOTER OUTSIDE SCROLLING AREA */}
                <div className="shrink-0 p-4 md:p-6 lg:p-8 border-t border-slate-200 dark:border-white/5 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-xl z-20">
                  <button onClick={handleSavePermissions} className="w-full py-4 rounded-2xl bg-gradient-to-l from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-sm transition-all shadow-[0_10px_25px_-5px_rgba(124,58,237,0.4)] hover:shadow-[0_15px_35px_-5px_rgba(124,58,237,0.5)] active:scale-[0.98]">
                    حفظ واعتماد صلاحيات الحساب
                  </button>
                </div>
              </div>

            </div>"""
replacement_footer = """</div>
              </div>
              
              </div> {/* Close Main Scrollable Body */}

              {/* STICKY FOOTER OUTSIDE SCROLLING AREA */}
              <div className="shrink-0 p-4 md:p-6 lg:p-8 border-t border-slate-200 dark:border-white/5 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-xl z-20 w-full rounded-b-[2rem]">
                <button onClick={handleSavePermissions} className="w-full py-4 rounded-2xl bg-gradient-to-l from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-sm transition-all shadow-[0_10px_25px_-5px_rgba(124,58,237,0.4)] hover:shadow-[0_15px_35px_-5px_rgba(124,58,237,0.5)] active:scale-[0.98]">
                  حفظ واعتماد صلاحيات الحساب
                </button>
              </div>

            </div>"""
content = content.replace(target_footer, replacement_footer)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated PermissionsModal layout properly")
