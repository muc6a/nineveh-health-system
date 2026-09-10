import re

with open("src/pages/TeamDashboard.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# Fix teamReports filter
old_filter = "  const teamReports = (reports || []).filter(r => r.sector && matchSector(userSector, r.sector));"
new_filter = """  const teamReports = (reports || []).filter(r => {
    // Match by sector
    if (r.sector && r.sector !== 'غير محدد' && matchSector(userSector, r.sector)) return true;
    // If it's a delivery complaint with no specific sector, should we show it?
    // Let's rely on tasks assignment if sector is missing.
    const isAssigned = tasks?.some(t => (t.targetEstId === r.establishmentId || t.targetEstId === r.id) && (t.teamId === user?.id || t.teamId === 'all'));
    return isAssigned;
  });"""
content = content.replace(old_filter, new_filter)

# Fix rendering block
old_render = """                    {teamReports.map((r) => (
                      <div key={r.id} className="p-4 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/20 relative overflow-hidden transition-all hover:scale-[1.01]">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-black text-slate-800 dark:text-white">{r.establishmentName}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${r.type === 'food_poisoning' ? 'bg-red-100 text-red-600' : r.type === 'hygiene' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                            {r.type === 'food_poisoning' ? 'اشتباه تسمم غذائي' : r.type === 'hygiene' ? 'مخالفة شروط صحية' : 'مخالفة تسعيرة/غش'}
                          </span>
                        </div>
                        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-2 bg-slate-50 dark:bg-slate-800 p-2 rounded-xl">{r.description}</p>
                        <div className="mt-3 flex justify-between items-center">
                          <span className="text-[9px] font-bold text-slate-400">{new Date(r.timestamp).toLocaleString('ar-IQ')}</span>
                          <button onClick={() => { notify('تم بدء التحقيق في الشكوى', 'success'); }} className="text-[10px] bg-teal-50 dark:bg-teal-900/30 text-teal-600 hover:bg-teal-100 rounded-lg px-3 py-1 font-black transition-colors">
                            بدء التحقيق 🔍
                          </button>
                        </div>
                      </div>
                    ))}"""

new_render = """                    {teamReports.map((r, idx) => (
                      <div key={r.id || idx} className={`p-4 rounded-2xl bg-white/40 dark:bg-slate-900/40 border ${r.isDelivery ? 'border-amber-500/30' : 'border-slate-200/20'} relative overflow-hidden transition-all hover:scale-[1.01]`}>
                        {r.isDelivery && <div className="absolute top-0 right-0 w-1.5 h-full bg-amber-500"></div>}
                        {!r.isDelivery && <div className="absolute top-0 right-0 w-1.5 h-full bg-red-500"></div>}
                        <div className="flex justify-between items-start mb-1">
                          <div>
                            <span className="text-xs font-black text-slate-800 dark:text-white">{r.establishmentName || r.deliveryCompanyName || 'جهة غير محددة'}</span>
                            <div className="text-[9px] text-slate-500 mt-0.5">{r.sector || 'قطاع غير محدد'}</div>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${r.isDelivery ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'}`}>
                            {r.isDelivery ? 'شكوى توصيل' : (r.type === 'food_poisoning' ? 'اشتباه تسمم غذائي' : r.type === 'hygiene' ? 'مخالفة شروط صحية' : 'شكوى مواطن')}
                          </span>
                        </div>
                        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-2 bg-slate-50 dark:bg-slate-800 p-2 rounded-xl">{r.description || r.details}</p>
                        <div className="mt-3 flex justify-between items-center">
                          <span className="text-[9px] font-bold text-slate-400">{r.timestamp ? new Date(r.timestamp).toLocaleString('ar-IQ') : r.date}</span>
                          <button onClick={() => { notify('تم بدء التحقيق في الشكوى', 'success'); }} className="text-[10px] bg-teal-50 dark:bg-teal-900/30 text-teal-600 hover:bg-teal-100 rounded-lg px-3 py-1 font-black transition-colors">
                            بدء التحقيق 🔍
                          </button>
                        </div>
                      </div>
                    ))}"""

content = content.replace(old_render, new_render)

with open("src/pages/TeamDashboard.jsx", "w", encoding="utf-8") as f:
    f.write(content)
