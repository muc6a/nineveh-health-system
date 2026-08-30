import re

file_path = "src/pages/AccountantPanel.jsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add context variables
context_target = "const { user, setUser, navigate, notify, penaltyRequests, setPenaltyRequests, establishments, setShowDisplayPrefsModal, uiPreferences, directives, setDirectives } = useContext(AppContext);"
context_replace = "const { user, setUser, navigate, notify, penaltyRequests, setPenaltyRequests, establishments, setShowDisplayPrefsModal, uiPreferences, directives, setDirectives, dailyInventories, setDailyInventories } = useContext(AppContext);"
if context_target in content:
    content = content.replace(context_target, context_replace)
else:
    print("context_target not found")

# Add date filter state
state_target = "const [archiveSearchTerm, setArchiveSearchTerm] = useState('');"
state_replace = """const [archiveSearchTerm, setArchiveSearchTerm] = useState('');
  const [inventoryArchiveDate, setInventoryArchiveDate] = useState('');"""
if state_target in content:
    content = content.replace(state_target, state_replace)
else:
    print("state_target not found")

# 2. Modify handleCloseRegister
close_reg_target = """  const handleCloseRegister = (status) => {
    if (status === 'confirm') {
      notify('تم تأكيد صحة الجرد وإغلاق الصندوق بنجاح', 'success');
      setActiveTab('dashboard');
    } else {
      notify('تم تسجيل وجود خطأ وتم رفع طلب مراجعة للتدقيق', 'warning');
    }
  };"""
close_reg_replace = """  const handleCloseRegister = (status) => {
    if (status === 'confirm') {
      const newInventory = {
        id: `INV-${Date.now()}`,
        date: new Date().toISOString(),
        totalAmount: cashCollected + posCollected,
        totalReceipts: totalReceipts,
        accountantName: user?.name,
        sector: targetSector
      };
      setDailyInventories(prev => [newInventory, ...(prev || [])]);
      notify('تم تأكيد صحة الجرد وإغلاق الصندوق وتوثيق العملية الدائمة بنجاح', 'success');
      setActiveTab('dashboard');
    } else {
      notify('تم تسجيل وجود خطأ وتم رفع طلب مراجعة للتدقيق', 'warning');
    }
  };"""
if close_reg_target in content:
    content = content.replace(close_reg_target, close_reg_replace)
else:
    print("close_reg_target not found")

# 3. Add Inventory Archive to reconciliation tab
recon_target = """                <button
                  onClick={() => handleCloseRegister('error')}
                  className="w-full md:w-auto px-8 py-4 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 rounded-2xl text-sm font-bold transition-all border border-red-200 dark:border-red-500/20 active:scale-[0.98]"
                >
                  يوجد خطأ بالمطابقة (طلب مراجعة)
                </button>
              </div>
            </div>
          </div>
        )}"""
recon_replace = """                <button
                  onClick={() => handleCloseRegister('error')}
                  className="w-full md:w-auto px-8 py-4 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 rounded-2xl text-sm font-bold transition-all border border-red-200 dark:border-red-500/20 active:scale-[0.98]"
                >
                  يوجد خطأ بالمطابقة (طلب مراجعة)
                </button>
              </div>
            </div>

            {/* Monthly Inventory Archive */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm mt-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                <h4 className="text-md font-black text-slate-800 dark:text-white flex items-center gap-2">
                  <Archive className="w-5 h-5 text-indigo-500" />
                  أرشيف الجرد الشهري (سجلات مغلقة)
                </h4>
                <div className="relative w-full sm:w-64">
                  <input 
                    type="date"
                    value={inventoryArchiveDate}
                    onChange={(e) => setInventoryArchiveDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-xl text-xs font-bold focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
              
              {(!dailyInventories || dailyInventories.length === 0) ? (
                <div className="p-8 text-center text-slate-500 text-xs font-bold bg-slate-50 dark:bg-slate-800/30 rounded-2xl">لا توجد سجلات جرد سابقة.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-right border-collapse text-xs font-bold">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 border-b border-slate-100 dark:border-slate-800">
                        <th className="p-3">التاريخ والوقت</th>
                        <th className="p-3">المبلغ الكلي</th>
                        <th className="p-3">عدد الوصولات</th>
                        <th className="p-3">المحاسب المسؤول</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                      {dailyInventories
                        .filter(inv => !inventoryArchiveDate || inv.date.startsWith(inventoryArchiveDate))
                        .map(inv => (
                        <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                          <td className="p-3 text-slate-700 dark:text-slate-300" dir="ltr" style={{textAlign: 'right'}}>
                            {new Date(inv.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}
                          </td>
                          <td className="p-3 text-emerald-600 font-black">{inv.totalAmount?.toLocaleString()} د.ع</td>
                          <td className="p-3 text-slate-600 dark:text-slate-400">{inv.totalReceipts} وصل</td>
                          <td className="p-3 text-slate-600 dark:text-slate-400">{inv.accountantName}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}"""
if recon_target in content:
    content = content.replace(recon_target, recon_replace)
else:
    print("recon_target not found")

# 4. Fix dates to en-GB in the whole file
date_replace1 = "toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })"
content = content.replace("toLocaleDateString('ar-IQ', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })", date_replace1)

date_replace2 = "toLocaleDateString('en-GB', { weekday: 'short', year: 'numeric', month: 'short', day: '2-digit' })"
content = content.replace("toLocaleDateString('ar-IQ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })", date_replace2)

date_replace3 = "toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true })"
content = content.replace("toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' })", date_replace3)

date_replace4 = "toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })"
content = content.replace("toLocaleDateString('ar-IQ')", date_replace4)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("AccountantPanel patched successfully.")
