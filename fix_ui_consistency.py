import re

# 1. Update LabDashboard stats layout
path_lab = "src/pages/LabDashboard.jsx"
with open(path_lab, "r", encoding="utf-8") as f:
    lab = f.read()

old_stats = r"""<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 mb-8">
                  <div className="glassmorphic-card p-5 relative overflow-hidden rounded-3xl border border-white/20 shadow-\[0_8px_30px_rgb\(0,0,0,0\.04\)\] bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-900/50 group hover:shadow-\[0_8px_30px_rgb\(0,0,0,0\.08\)\] transition-all duration-500">
                    <h3 className="text-slate-500 dark:text-slate-400 font-bold mb-2">إجمالي العينات المستلمة</h3>
                    <p className="text-4xl font-black text-indigo-600 dark:text-indigo-400">\{labRequests\.length\}</p>
                  </div>
                  <div className="glassmorphic-card p-5 relative overflow-hidden rounded-3xl border border-white/20 shadow-\[0_8px_30px_rgb\(0,0,0,0\.04\)\] bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-900/50 group hover:shadow-\[0_8px_30px_rgb\(0,0,0,0\.08\)\] transition-all duration-500">
                    <h3 className="text-slate-500 dark:text-slate-400 font-bold mb-2">عينات قيد الفحص</h3>
                    <p className="text-4xl font-black text-amber-600 dark:text-amber-400">\{testingReqs\.length\}</p>
                  </div>
                  <div className="glassmorphic-card p-5 relative overflow-hidden rounded-3xl border border-white/20 shadow-\[0_8px_30px_rgb\(0,0,0,0\.04\)\] bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-900/50 group hover:shadow-\[0_8px_30px_rgb\(0,0,0,0\.08\)\] transition-all duration-500">
                    <h3 className="text-slate-500 dark:text-slate-400 font-bold mb-2">عينات منجزة</h3>
                    <p className="text-4xl font-black text-emerald-600 dark:text-emerald-400">\{archivedReqs\.length\}</p>
                  </div>
                </div>"""

new_stats = """<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {/* Card 1: Total */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xl border border-slate-700/50 hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 text-right group relative overflow-hidden">
                    <div className="absolute top-2 left-2 opacity-5 group-hover:opacity-10 transition-opacity">
                      <FlaskConical className="w-32 h-32 text-white" />
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-400 text-[10px] font-black tracking-wider uppercase bg-slate-500/10 px-2 py-0.5 rounded-lg border border-slate-500/20">عينات نينوى</span>
                    </div>
                    <h3 className="text-xs text-slate-300 font-bold">إجمالي العينات المستلمة</h3>
                    <span className="text-4xl lg:text-5xl font-black text-white mt-1 block">{labRequests.length} <span className="text-sm text-slate-400 font-medium">عينة</span></span>
                  </div>

                  {/* Card 2: Pending */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-900 to-slate-900 text-white shadow-xl border border-amber-800/40 hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 text-right group relative overflow-hidden">
                    <div className="absolute top-2 left-2 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Clock className="w-32 h-32 text-white" />
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-amber-400 text-[10px] font-black tracking-wider uppercase bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">قيد الفحص</span>
                    </div>
                    <h3 className="text-xs text-amber-300/70 font-bold">عينات تنتظر الفحص</h3>
                    <span className="text-4xl lg:text-5xl font-black text-amber-500 mt-1 block">{testingReqs.length} <span className="text-sm text-amber-500/60 font-medium">عينة</span></span>
                  </div>

                  {/* Card 3: Completed */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-900 to-slate-900 text-white shadow-xl border border-emerald-800/40 hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 text-right group relative overflow-hidden">
                    <div className="absolute top-2 left-2 opacity-5 group-hover:opacity-10 transition-opacity">
                      <CheckCircle className="w-32 h-32 text-white" />
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-emerald-400 text-[10px] font-black tracking-wider uppercase bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">إنجاز</span>
                    </div>
                    <h3 className="text-xs text-emerald-300/70 font-bold">عينات منجزة بنجاح</h3>
                    <span className="text-4xl lg:text-5xl font-black text-emerald-500 mt-1 block">{archivedReqs.length} <span className="text-sm text-emerald-500/60 font-medium">عينة</span></span>
                  </div>

                  {/* Card 4: Completion Rate */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white shadow-xl border border-indigo-800/40 hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 text-right group relative overflow-hidden">
                    <div className="absolute top-2 left-2 opacity-5 group-hover:opacity-10 transition-opacity">
                      <TrendingUp className="w-32 h-32 text-white" />
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-indigo-400 text-[10px] font-black tracking-wider uppercase bg-indigo-500/10 px-2 py-0.5 rounded-lg border border-indigo-500/20">أداء</span>
                    </div>
                    <h3 className="text-xs text-indigo-300/70 font-bold">نسبة إنجاز المختبر</h3>
                    <span className="text-4xl lg:text-5xl font-black text-indigo-500 mt-1 block">{labRequests.length > 0 ? ((archivedReqs.length / labRequests.length) * 100).toFixed(1) : 0} <span className="text-sm text-indigo-500/60 font-medium">%</span></span>
                  </div>
                </div>"""

lab = re.sub(old_stats, new_stats, lab, flags=re.DOTALL)
# Remove the gear emoji from LabDashboard settings button
lab = lab.replace("⚙️ تخصيص العرض", "تخصيص العرض")
with open(path_lab, "w", encoding="utf-8") as f:
    f.write(lab)

# 2. Remove Settings2 from other files
files = ["src/pages/ExecutivePortal.jsx", "src/pages/AccountantPanel.jsx", "src/pages/TeamDashboard.jsx"]

for file in files:
    with open(file, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Remove Settings2 icon completely
    content = re.sub(r'<Settings2 className="[^"]+" />\s*', '', content)
    
    with open(file, "w", encoding="utf-8") as f:
        f.write(content)

print("Lab layout unified and sort icons removed!")
