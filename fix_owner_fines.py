import re

file_path = "src/pages/OwnerPortal.jsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update Context extraction to include penaltyRequests
context_target = "const { navigate, establishments, config, ownerCMS, addSystemNotification, directives, setDirectives, setShowDisplayPrefsModal, inspectionTemplates, fines } = useContext(AppContext);"
context_replace = "const { navigate, establishments, config, ownerCMS, addSystemNotification, directives, setDirectives, setShowDisplayPrefsModal, inspectionTemplates, fines, penaltyRequests } = useContext(AppContext);"
if context_target in content:
    content = content.replace(context_target, context_replace)
else:
    print("context_target not found")

# 2. Update fines tab content
fines_target = """            {/* TAB: FINES */}
            {activeTab === 'fines' && (
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-sm border border-slate-200/50 dark:border-slate-800/50 animate-in fade-in slide-in-from-bottom-4">
                {(() => {
                  const ownerFines = (fines || []).filter(f => f.targetEstId === ownerEst.id);
                  if (ownerFines.length > 0) {
                    return (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-xl font-black text-slate-800 dark:text-white">الغرامات المسجلة بحق المنشأة</h3>
                          <span className="px-3 py-1 bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 font-bold text-xs rounded-full border border-red-200 dark:border-red-500/30">
                            يوجد {ownerFines.length} غرامات غير مسددة
                          </span>
                        </div>
                        {ownerFines.map(fine => (
                          <div key={fine.id} className="p-6 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Receipt className="w-5 h-5 text-red-600 dark:text-red-400" />
                                  <h4 className="text-lg font-black text-red-800 dark:text-red-300">غرامة مالية: {fine.amount} دينار عراقي</h4>
                                </div>
                                <p className="text-sm font-bold text-red-700 dark:text-red-400 mb-1">السبب: {fine.reason}</p>
                                <p className="text-xs text-red-600/70 dark:text-red-400/70 font-medium">تاريخ الإصدار: {new Date(fine.date).toLocaleDateString('ar-IQ')}</p>
                              </div>
                              <div className="bg-white/80 dark:bg-slate-900/50 p-4 rounded-xl border border-red-100 dark:border-red-500/20 md:w-64">
                                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">إجراء مطلوب:</p>
                                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                  يرجى مراجعة <strong className="text-slate-800 dark:text-slate-200">دائرة صحة نينوى - قسم الحسابات</strong> لتسديد المبلغ تجنباً لإغلاق المنشأة.
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  }

                  return (
                    <div className="flex flex-col items-center justify-center py-16 opacity-70">
                      <History className="w-16 h-16 text-slate-300 dark:text-slate-600 mb-4" />
                      <p className="text-lg font-black text-slate-700 dark:text-slate-300">سجلك نظيف</p>
                      <p className="text-sm font-bold text-slate-500 mt-2">لا توجد غرامات مالية مسجلة بحق منشأتك.</p>
                    </div>
                  );
                })()}
              </div>
            )}"""

fines_replace = """            {/* TAB: FINES */}
            {activeTab === 'fines' && (
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-sm border border-slate-200/50 dark:border-slate-800/50 animate-in fade-in slide-in-from-bottom-4">
                {(() => {
                  const allMyFines = [...(fines || []), ...(penaltyRequests || [])]
                    .filter(f => (f.type === 'fine' || f.type === 'closure' || !f.type) && (f.targetEstId === ownerEst.id || f.establishmentId === ownerEst.id || f.estId === ownerEst.id));
                  
                  // Deduplicate by ID
                  const uniqueFines = Array.from(new Map(allMyFines.map(item => [item.id, item])).values());
                  
                  const unpaidFines = uniqueFines.filter(f => f.paymentStatus !== 'paid');
                  const paidFines = uniqueFines.filter(f => f.paymentStatus === 'paid');

                  return (
                    <div className="space-y-12">
                      {/* Unpaid Fines Section */}
                      <div>
                        {unpaidFines.length > 0 ? (
                          <div className="space-y-6">
                            <div className="flex items-center justify-between mb-6">
                              <h3 className="text-xl font-black text-slate-800 dark:text-white">الغرامات الحالية (غير مسددة)</h3>
                              <span className="px-3 py-1 bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 font-bold text-xs rounded-full border border-red-200 dark:border-red-500/30">
                                يوجد {unpaidFines.length} غرامات غير مسددة
                              </span>
                            </div>
                            {unpaidFines.map(fine => (
                              <div key={fine.id} className="p-6 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <Receipt className="w-5 h-5 text-red-600 dark:text-red-400" />
                                      <h4 className="text-lg font-black text-red-800 dark:text-red-300">غرامة مالية: {fine.amount?.toLocaleString()} دينار عراقي</h4>
                                    </div>
                                    <p className="text-sm font-bold text-red-700 dark:text-red-400 mb-1">السبب: {fine.reason || fine.violationType}</p>
                                    <p className="text-xs text-red-600/70 dark:text-red-400/70 font-medium">تاريخ الإصدار: {new Date(fine.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                  </div>
                                  <div className="bg-white/80 dark:bg-slate-900/50 p-4 rounded-xl border border-red-100 dark:border-red-500/20 md:w-64">
                                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">إجراء مطلوب:</p>
                                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                      يرجى مراجعة <strong className="text-slate-800 dark:text-slate-200">دائرة صحة نينوى - قسم الحسابات</strong> لتسديد المبلغ تجنباً لإغلاق المنشأة.
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-12 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-800/30">
                            <ShieldCheck className="w-16 h-16 text-emerald-500 mb-4" />
                            <p className="text-lg font-black text-emerald-700 dark:text-emerald-400">لا توجد غرامات حالية مسجلة</p>
                            <p className="text-sm font-bold text-emerald-600/70 mt-2">سجلك المالي نظيف.</p>
                          </div>
                        )}
                      </div>

                      {/* Paid Fines Archive Section */}
                      <div>
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
                            <Archive className="w-5 h-5 text-indigo-500" />
                            أرشيف الوصلات المالية / الغرامات المسددة
                          </h3>
                        </div>
                        {paidFines.length > 0 ? (
                          <div className="overflow-x-auto bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-200 dark:border-slate-700">
                            <table className="w-full text-right border-collapse text-xs font-bold">
                              <thead>
                                <tr className="bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                                  <th className="p-4">رقم الوصل</th>
                                  <th className="p-4">المبلغ المسدد</th>
                                  <th className="p-4">سبب المخالفة</th>
                                  <th className="p-4">تاريخ التسديد</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50">
                                {paidFines.map(fine => (
                                  <tr key={fine.id} className="hover:bg-white dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="p-4 text-slate-800 dark:text-slate-200" dir="ltr" style={{textAlign: 'right'}}>{fine.receiptNumber || 'غير متوفر'}</td>
                                    <td className="p-4 text-emerald-600 font-black">{fine.amount?.toLocaleString()} د.ع</td>
                                    <td className="p-4 text-slate-600 dark:text-slate-400 max-w-[200px] truncate">{fine.reason || fine.violationType}</td>
                                    <td className="p-4 text-slate-500" dir="ltr" style={{textAlign: 'right'}}>
                                      {fine.paymentDate ? new Date(fine.paymentDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }) : 'غير متوفر'}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="text-center p-8 text-slate-500 text-xs font-bold bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-200 dark:border-slate-700/50">
                            لا توجد غرامات سابقة مسددة في الأرشيف.
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}"""

if fines_target in content:
    content = content.replace(fines_target, fines_replace)
else:
    print("fines_target not found")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("OwnerPortal patched successfully.")
