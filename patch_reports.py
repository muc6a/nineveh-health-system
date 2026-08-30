import re

file_path = "src/pages/AccountantPanel.jsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add X icon
import_line = "import { LogOut, DollarSign, Activity, FileText, CheckCircle2, ShieldAlert, BadgeInfo, BellRing, Sun, Moon, Cloud, ChevronLeft, CreditCard, Banknote, Search, AlertCircle, Eye, ClipboardList, Menu, LayoutDashboard, Printer, Mail, Inbox, Archive, Filter, Building, Compass, Map, CheckSquare } from 'lucide-react';"
if import_line in content:
    content = content.replace("CheckSquare }", "CheckSquare, X }")

# 2. Add state
state_line = "const [activeTab, setActiveTab] = useState('dashboard');"
if state_line in content:
    content = content.replace(state_line, state_line + "\n  const [selectedReportType, setSelectedReportType] = useState(null);")

# 3. Replace cards
cards_target = """            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 p-5 rounded-2xl">
                <span className="block text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1">الإيرادات المحصلة (هذا الشهر)</span>
                <span className="block text-2xl font-black text-emerald-700 dark:text-emerald-300">{sectorMonthlyRevenue.toLocaleString()} <span className="text-[10px]">د.ع</span></span>
              </div>
              <div className="bg-teal-50 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/20 p-5 rounded-2xl">
                <span className="block text-xs font-bold text-teal-600 dark:text-teal-400 mb-1">إجمالي الإيرادات (الكلية)</span>
                <span className="block text-2xl font-black text-teal-700 dark:text-teal-300">{sectorTotalRevenue.toLocaleString()} <span className="text-[10px]">د.ع</span></span>
              </div>
              <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 p-5 rounded-2xl">
                <span className="block text-xs font-bold text-red-600 dark:text-red-400 mb-1">الغرامات المعلقة (قيد التسديد)</span>
                <span className="block text-2xl font-black text-red-700 dark:text-red-300">{sectorPendingAmount.toLocaleString()} <span className="text-[10px]">د.ع</span></span>
              </div>
            </div>"""

cards_replace = """            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <button onClick={() => setSelectedReportType('monthly')} className="text-right bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 p-5 rounded-2xl hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors shadow-sm">
                <span className="block text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1">الإيرادات المحصلة (هذا الشهر)</span>
                <span className="block text-2xl font-black text-emerald-700 dark:text-emerald-300">{sectorMonthlyRevenue.toLocaleString()} <span className="text-[10px]">د.ع</span></span>
                <span className="text-[10px] text-emerald-500 mt-2 block flex items-center gap-1"><Search className="w-3 h-3" /> عرض التفاصيل</span>
              </button>
              <button onClick={() => setSelectedReportType('total')} className="text-right bg-teal-50 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/20 p-5 rounded-2xl hover:bg-teal-100 dark:hover:bg-teal-900/30 transition-colors shadow-sm">
                <span className="block text-xs font-bold text-teal-600 dark:text-teal-400 mb-1">إجمالي الإيرادات (الكلية)</span>
                <span className="block text-2xl font-black text-teal-700 dark:text-teal-300">{sectorTotalRevenue.toLocaleString()} <span className="text-[10px]">د.ع</span></span>
                <span className="text-[10px] text-teal-500 mt-2 block flex items-center gap-1"><Search className="w-3 h-3" /> عرض التفاصيل</span>
              </button>
              <button onClick={() => setSelectedReportType('pending')} className="text-right bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 p-5 rounded-2xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors shadow-sm">
                <span className="block text-xs font-bold text-red-600 dark:text-red-400 mb-1">الغرامات المعلقة (قيد التسديد)</span>
                <span className="block text-2xl font-black text-red-700 dark:text-red-300">{sectorPendingAmount.toLocaleString()} <span className="text-[10px]">د.ع</span></span>
                <span className="text-[10px] text-red-500 mt-2 block flex items-center gap-1"><Search className="w-3 h-3" /> عرض التفاصيل</span>
              </button>
            </div>"""

if cards_target in content:
    content = content.replace(cards_target, cards_replace)

# 4. Add Modal UI at the end of the main wrapper
modal_ui = """
      {selectedReportType && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-fade-in-up">
             <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 shrink-0">
                <h3 className="font-black text-slate-800 dark:text-white flex items-center gap-2">
                   {selectedReportType === 'monthly' ? <><Banknote className="w-5 h-5 text-emerald-500"/> تفاصيل الإيرادات المحصلة (هذا الشهر)</> :
                    selectedReportType === 'total' ? <><Activity className="w-5 h-5 text-teal-500"/> تفاصيل إجمالي الإيرادات (الكلية)</> :
                    <><AlertCircle className="w-5 h-5 text-red-500"/> تفاصيل الغرامات المعلقة (قيد التسديد)</>}
                </h3>
                <button onClick={() => setSelectedReportType(null)} className="p-2 bg-slate-200 dark:bg-slate-700 rounded-xl hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-500/20 dark:hover:text-red-400 transition-colors">
                  <X className="w-4 h-4" />
                </button>
             </div>
             <div className="flex-1 overflow-y-auto p-0">
                <table className="w-full text-right border-collapse text-xs font-bold">
                  <thead className="bg-slate-50 dark:bg-slate-800/80 sticky top-0 z-10 shadow-sm">
                    <tr>
                      <th className="p-4 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">المنشأة</th>
                      <th className="p-4 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">رقم الوصل</th>
                      <th className="p-4 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">المبلغ</th>
                      <th className="p-4 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">التاريخ</th>
                      <th className="p-4 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">الحالة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {(() => {
                      const dataList = selectedReportType === 'monthly' ? sectorMonthlyPaid :
                                       selectedReportType === 'total' ? paidFines :
                                       pendingFines;
                      
                      if (dataList.length === 0) {
                        return (
                          <tr>
                            <td colSpan="5" className="p-8 text-center text-slate-500">لا توجد سجلات لعرضها في هذا القسم.</td>
                          </tr>
                        );
                      }
                      
                      return dataList.map(item => {
                        const isPaid = item.paymentStatus === 'paid';
                        const targetEst = establishments.find(e => e.id === item.targetEstId || e.id === item.estId || e.id === item.establishmentId);
                        
                        return (
                          <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                            <td className="p-4 text-slate-800 dark:text-slate-200">{item.estName || targetEst?.name || 'غير معروف'}</td>
                            <td className="p-4 text-slate-600 dark:text-slate-400" dir="ltr" style={{textAlign: 'right'}}>{item.receiptNumber || '-'}</td>
                            <td className="p-4 text-slate-800 dark:text-slate-200 font-black">{item.amount?.toLocaleString()} د.ع</td>
                            <td className="p-4 text-slate-500" dir="ltr" style={{textAlign: 'right'}}>
                              {(() => {
                                const d = new Date(isPaid ? item.paymentDate : item.date);
                                return isNaN(d) ? (isPaid ? item.paymentDate : item.date) : `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
                              })()}
                            </td>
                            <td className="p-4">
                              {isPaid ? (
                                <span className="px-2 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 rounded-md text-[10px]">مسددة</span>
                              ) : (
                                <span className="px-2 py-1 bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400 rounded-md text-[10px]">غير مسددة</span>
                              )}
                            </td>
                          </tr>
                        );
                      });
                    })()}
                  </tbody>
                </table>
             </div>
             <div className="p-4 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex justify-end shrink-0">
               <button onClick={() => setSelectedReportType(null)} className="px-6 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white rounded-xl font-bold text-xs transition-colors">
                 إغلاق
               </button>
             </div>
          </div>
        </div>
      )}
"""

# Insert modal UI before the closing tag of the main component.
content = content.replace("    </div>\n  );\n};", modal_ui + "\n    </div>\n  );\n};")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("Patch applied")
