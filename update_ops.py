import re

filepath = "/Users/admin/web/منظومة الرقابة الصحية الرقمية/src/components/OperationsRoom.jsx"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add showClosureArchive state
content = content.replace("const [closureDuration, setClosureDuration] = useState('أسبوع واحد');", 
"const [closureDuration, setClosureDuration] = useState('أسبوع واحد');\n  const [showClosureArchive, setShowClosureArchive] = useState(false);")

# 2. Add FinancialReports import
content = content.replace("import AccountModal from './AccountModal';", 
"import AccountModal from './AccountModal';\nimport { FinancialReports } from './FinancialReports';\nimport { Database } from 'lucide-react';")

# 3. Add financials tab button
tab_buttons = """        <button
          onClick={() => setActiveTab('live_operations')}"""
new_tab_button = """        <button
          onClick={() => setActiveTab('financials')}
          className={`pb-2 text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'financials' ? 'border-b-2 border-emerald-600 text-emerald-600 dark:text-emerald-400 font-extrabold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Database className="w-4 h-4" />
          التقارير المالية للغرامات
        </button>
        <button
          onClick={() => setActiveTab('live_operations')}"""
content = content.replace(tab_buttons, new_tab_button)

# 4. Render financials tab content
live_ops_content = "{activeTab === 'live_operations' && ("
financials_content = """{activeTab === 'financials' && (
        <div className="glassmorphic-card p-0 border border-emerald-500/20 overflow-hidden">
          <FinancialReports />
        </div>
      )}

      {activeTab === 'live_operations' && ("""
content = content.replace(live_ops_content, financials_content)

# 5. Archive logic for closure verifications
closure_target = """              <h3 className="text-sm font-black text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <Camera className="w-4 h-4 text-indigo-500" />
                أدلة الإغلاق الواردة
              </h3>
              {closureVerifications && closureVerifications.length > 0 ? ("""
closure_replacement = """              <div className="flex justify-between items-center mb-4 border-b border-indigo-500/10 pb-2">
                <h3 className="text-sm font-black text-slate-800 dark:text-white flex items-center gap-2">
                  <Camera className="w-4 h-4 text-indigo-500" />
                  أدلة الإغلاق {showClosureArchive ? 'المؤرشفة' : 'الواردة'}
                </h3>
                <button
                  onClick={() => setShowClosureArchive(!showClosureArchive)}
                  className={`text-[10px] font-bold px-3 py-1 rounded-full transition-all ${
                    showClosureArchive 
                      ? 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                  }`}
                >
                  {showClosureArchive ? 'عرض الوارد الجديد' : 'عرض الأرشيف المغلق'}
                </button>
              </div>
              {(() => {
                const activeVerifications = closureVerifications?.filter(v => v.status === 'pending') || [];
                const archivedVerifications = closureVerifications?.filter(v => v.status !== 'pending') || [];
                const displayVerifications = showClosureArchive ? archivedVerifications : activeVerifications;
                
                return displayVerifications.length > 0 ? (
                  displayVerifications"""
content = content.replace(closure_target, closure_replacement)

# Fix the end of the closure block
end_closure_target = """                ))
              ) : (
                <p className="text-center text-xs text-slate-500 py-4">لا توجد أدلة إغلاق معلقة.</p>
              )}"""
end_closure_replacement = """                ))
                ) : (
                  <p className="text-center text-xs text-slate-500 py-4">لا توجد أدلة إغلاق {showClosureArchive ? 'مؤرشفة' : 'معلقة'}.</p>
                );
              })()}"""
content = content.replace(end_closure_target, end_closure_replacement)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated OperationsRoom.jsx")
