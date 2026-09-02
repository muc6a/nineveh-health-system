import re

# 1. FinancialReports.jsx
with open('src/components/FinancialReports.jsx', 'r', encoding='utf-8') as f:
    fin_content = f.read()

# Remove Receiving Accountant column
fin_content = fin_content.replace('<th className="pb-3 px-2 font-bold">المحاسب المستلم</th>\n', '')
fin_content = fin_content.replace('<th className="pb-3 px-2 font-bold">المحاسب المستلم</th>', '')
fin_content = re.sub(r'<td className="py-4 px-2 font-bold text-slate-600 dark:text-slate-400">\{fine\.accountantName \|\| \'---\'\}</td>\n?', '', fin_content)

# Fix f.reason
fin_content = fin_content.replace(
    "{fine.reason || (fine.type === 'closure' ? 'إغلاق وغرامة' : 'غرامة')}",
    "{fine.reason?.replace(/تطبيق كراس الغرامات - |تطبيق كراس الغرامة و |تطبيق كراس الغرامة /g, '') || (fine.type === 'closure' ? 'إغلاق وغرامة' : 'غرامة')}"
)
fin_content = fin_content.replace('colSpan="6"', 'colSpan="5"')

# Add Pay Modal
pay_modal = """
  const [showPayModal, setShowPayModal] = useState(false);
  const [payCode, setPayCode] = useState('');
  
  const handlePay = () => {
    if(!payCode.trim()) return;
    alert('تم تسديد الغرامة للمنشأة رقم: ' + payCode + ' بنجاح!');
    setShowPayModal(false);
    setPayCode('');
  };
"""
fin_content = fin_content.replace('  const [selectedTeamFilter, setSelectedTeamFilter] = useState(\'all\');', '  const [selectedTeamFilter, setSelectedTeamFilter] = useState(\'all\');\n' + pay_modal)

pay_button = """
          <button onClick={() => setShowPayModal(true)} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-md shadow-emerald-500/20">
            <DollarSign className="w-4 h-4" />
            تسديد غرامة
          </button>
"""
fin_content = fin_content.replace('<label className="text-xs font-bold text-slate-500">تصفية حسب الفريق:</label>', pay_button + '\n          <label className="text-xs font-bold text-slate-500">تصفية حسب الفريق:</label>')

pay_modal_jsx = """
      {showPayModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[2rem] p-6 shadow-2xl">
            <h3 className="text-lg font-black text-slate-800 dark:text-white mb-2">تسديد غرامة</h3>
            <p className="text-xs text-slate-500 mb-4">أدخل كود أو اسم المنشأة لإجراء التسديد المباشر</p>
            <input 
              type="text" 
              placeholder="كود المنشأة..." 
              value={payCode}
              onChange={e => setPayCode(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 mb-4"
            />
            <div className="flex gap-2">
              <button onClick={() => setShowPayModal(false)} className="flex-1 py-2 rounded-xl text-slate-500 bg-slate-100 hover:bg-slate-200 font-bold text-sm">إلغاء</button>
              <button onClick={handlePay} className="flex-1 py-2 rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 font-bold text-sm">تسديد الآن</button>
            </div>
          </div>
        </div>
      )}
"""
fin_content = fin_content.replace('      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">', pay_modal_jsx + '\n      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">')

with open('src/components/FinancialReports.jsx', 'w', encoding='utf-8') as f:
    f.write(fin_content)


# 2. OperationsRoom.jsx filter removal
with open('src/components/OperationsRoom.jsx', 'r', encoding='utf-8') as f:
    ops_content = f.read()

ops_content = re.sub(
    r'<div className="flex items-center gap-2 mb-6">.*?<label.*?تصفية حسب الفريق.*?</select>\s*</div>',
    '',
    ops_content,
    flags=re.DOTALL
)

with open('src/components/OperationsRoom.jsx', 'w', encoding='utf-8') as f:
    f.write(ops_content)

print("Done")
