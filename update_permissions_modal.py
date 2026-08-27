import sys

with open('src/pages/SuperAdminPanel.jsx', 'r') as f:
    content = f.read()

# 1. Add financials to PERMISSIONS_TABS
old_tabs = """{ id: 'advanced', label: 'إدارة متقدمة', icon: <Settings className="w-4 h-4"/>, keys: ['manageComplaints', 'exportData', 'viewAuditLogs', 'manageAccounts', 'manageSettings', 'backupData'] },
        ];"""
new_tabs = """{ id: 'advanced', label: 'إدارة متقدمة', icon: <Settings className="w-4 h-4"/>, keys: ['manageComplaints', 'exportData', 'viewAuditLogs', 'manageAccounts', 'manageSettings', 'backupData'] },
          { id: 'financials', label: 'الإدارة المالية / المحاسبين', icon: <DollarSign className="w-4 h-4 text-emerald-500"/>, keys: ['confirmReceipt', 'enterReceiptNumber', 'printReceiptA4', 'viewFinancialReports'] },
        ];"""
content = content.replace(old_tabs, new_tabs)

# Ensure DollarSign is imported
if 'import { DollarSign } from' not in content and 'DollarSign' not in content.split('lucide-react')[0]:
    if 'DollarSign' not in content:
        # Let's just add it to lucide-react imports
        content = content.replace("import { Plus, Trash2", "import { Plus, Trash2, DollarSign")

# 2. Add to PERMISSION_DETAILS
old_details = "backupData: { title: 'النسخ الاحتياطي', desc: 'يسمح للحساب بأخذ نسخة احتياطية من كامل قاعدة بيانات المنظومة وتنزيلها.' }"
new_details = """backupData: { title: 'النسخ الاحتياطي', desc: 'يسمح للحساب بأخذ نسخة احتياطية من كامل قاعدة بيانات المنظومة وتنزيلها.' },
          confirmReceipt: { title: 'تأكيد القبض واستلام المبالغ', desc: 'يمنح المحاسب صلاحية النقر على تأكيد استلام مبالغ الغرامة من صاحب المنشأة وتوثيقها في النظام.' },
          enterReceiptNumber: { title: 'إدخال رقم وصل القبض (الدفتر)', desc: 'يسمح بكتابة وربط رقم الوصل الورقي الرسمي (دفتر الوصولات) بالغرامة الإلكترونية.' },
          printReceiptA4: { title: 'طباعة وصل القبض A4', desc: 'يتيح خيار إنشاء وطباعة وصل استلام رسمي من المنظومة بنسق A4 كأرشيف للإدارة.' },
          viewFinancialReports: { title: 'عرض التقارير المالية للقطاع', desc: 'يسمح للحساب بمشاهدة ملخص الإيرادات والغرامات المستحصلة ضمن الرقعة الجغرافية المسؤولة عنها.' }"""
content = content.replace(old_details, new_details)

# 3. Add to PERMISSION_ROLES
old_roles = "exportData: 'management', viewAuditLogs: 'management', manageAccounts: 'management', manageSettings: 'management', backupData: 'management'"
new_roles = "exportData: 'management', viewAuditLogs: 'management', manageAccounts: 'management', manageSettings: 'management', backupData: 'management',\n          confirmReceipt: 'all', enterReceiptNumber: 'all', printReceiptA4: 'all', viewFinancialReports: 'all'"
content = content.replace(old_roles, new_roles)

# 4. Fix scrolling in PermissionsModal
# Search for: <div className="w-full max-w-4xl bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-[2rem] text-slate-800 dark:text-white shadow-[0_0_50px_-12px_rgba(168,85,247,0.3)] relative overflow-hidden flex flex-col md:flex-row text-right max-h-[85vh]">
old_modal_container = '<div className="w-full max-w-4xl bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-[2rem] text-slate-800 dark:text-white shadow-[0_0_50px_-12px_rgba(168,85,247,0.3)] relative overflow-hidden flex flex-col md:flex-row text-right max-h-[85vh]">'
new_modal_container = '<div className="w-full max-w-4xl bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-[2rem] text-slate-800 dark:text-white shadow-[0_0_50px_-12px_rgba(168,85,247,0.3)] relative flex flex-col md:flex-row text-right max-h-[90vh] overflow-hidden">'
content = content.replace(old_modal_container, new_modal_container)

# The list container
old_list_container = '<div className="flex-1 overflow-y-auto pr-3 space-y-3 custom-scrollbar">'
new_list_container = '<div className="flex-1 overflow-y-auto pr-3 pb-6 space-y-3 custom-scrollbar">'
content = content.replace(old_list_container, new_list_container)

# 5. Fix Save Buttons to be sticky at the bottom
# The save button is at the end of the modal, let's find it.
old_save_buttons = """                <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/5 flex gap-4">
                  <button onClick={() => setShowPermissionsModal(false)} className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-extrabold text-sm transition-all cursor-pointer">
                    إلغاء
                  </button>
                  <button onClick={() => {
                    handleSaveAccount(selectedPermissionsAccount);
                    setShowPermissionsModal(false);
                    triggerAlert('تم حفظ الصلاحيات والأذونات بنجاح.');
                  }} className="flex-1 py-3 rounded-xl bg-gradient-to-l from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-sm transition-all shadow-[0_10px_25px_-5px_rgba(168,85,247,0.4)] hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer">
                    <Check className="w-5 h-5" /> حفظ واعتماد الصلاحيات
                  </button>
                </div>"""
new_save_buttons = """                <div className="sticky bottom-0 mt-4 pt-4 pb-4 border-t border-slate-200 dark:border-white/5 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-md flex gap-4 z-20">
                  <button onClick={() => setShowPermissionsModal(false)} className="px-6 py-3 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-extrabold text-sm transition-all cursor-pointer">
                    إلغاء
                  </button>
                  <button onClick={() => {
                    handleSaveAccount(selectedPermissionsAccount);
                    setShowPermissionsModal(false);
                    triggerAlert('تم حفظ الصلاحيات والأذونات بنجاح.');
                  }} className="flex-1 py-3 rounded-xl bg-gradient-to-l from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-sm transition-all shadow-[0_10px_25px_-5px_rgba(168,85,247,0.4)] hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer">
                    <Check className="w-5 h-5" /> حفظ واعتماد الصلاحيات
                  </button>
                </div>"""
content = content.replace(old_save_buttons, new_save_buttons)

with open('src/pages/SuperAdminPanel.jsx', 'w') as f:
    f.write(content)
print("Updated permissions modal")
