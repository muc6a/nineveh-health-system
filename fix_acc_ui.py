import re

file_path = "src/pages/AccountantPanel.jsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add new state for receiptType and archiveSearch
state_target = "const [receiptNumber, setReceiptNumber] = useState('');"
state_replace = """const [receiptNumber, setReceiptNumber] = useState('');
  const [receiptType, setReceiptType] = useState('electronic');
  const [archiveSearchTerm, setArchiveSearchTerm] = useState('');"""
content = content.replace(state_target, state_replace)

# 2. Add setSearchedEstablishment(null) to submitPayment
submit_target = """    notify('تم تأكيد القبض وتسجيل التسديد بنجاح!', 'success');
    setSearchedFine(null);
    setSearchCode('');"""
submit_replace = """    notify('تم تأكيد القبض وتسجيل التسديد بنجاح!', 'success');
    setSearchedFine(null);
    setSearchedEstablishment(null);
    setSearchCode('');
    setReceiptNumber('');
    setReceiptType('electronic');"""
content = content.replace(submit_target, submit_replace)

# 3. Widen card
card_target = """              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-lg max-w-2xl mx-auto relative overflow-hidden">"""
card_replace = """              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-lg w-full mx-auto relative overflow-hidden">"""
content = content.replace(card_target, card_replace)

# 4. Bigger Fine Amount
amount_target = """                        <span className="block text-xl font-black text-red-600">{searchedFine.amount?.toLocaleString()} <span className="text-[10px]">د.ع</span></span>"""
amount_replace = """                        <span className="block text-3xl md:text-4xl font-black text-red-600 py-1 drop-shadow-sm">{searchedFine.amount?.toLocaleString()} <span className="text-xs">د.ع</span></span>"""
content = content.replace(amount_target, amount_replace)

# 5. Smart Receipt System (Electronic vs Manual)
receipt_target = """                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-2">رقم الوصل الورقي (الدفتر) - إن وجد:</label>
                    <input
                      type="text"
                      value={receiptNumber}
                      onChange={(e) => setReceiptNumber(e.target.value)}
                      placeholder="أدخل رقم الوصل..."
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-xl text-sm font-bold focus:outline-none focus:border-emerald-500"
                    />
                  </div>"""

receipt_replace = """                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-2">رقم الوصل ونوع الإصدار:</label>
                    <div className="flex bg-slate-100 dark:bg-slate-800/50 p-1 rounded-xl mb-3">
                      <button
                        onClick={() => { setReceiptType('electronic'); setReceiptNumber(`REC-${Date.now().toString().slice(-6)}`); }}
                        className={`flex-1 text-xs py-2 rounded-lg font-bold transition-all ${receiptType === 'electronic' ? 'bg-white dark:bg-slate-700 shadow-sm text-emerald-600' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                      >
                        إلكتروني (تلقائي)
                      </button>
                      <button
                        onClick={() => { setReceiptType('manual'); setReceiptNumber(''); }}
                        className={`flex-1 text-xs py-2 rounded-lg font-bold transition-all ${receiptType === 'manual' ? 'bg-white dark:bg-slate-700 shadow-sm text-emerald-600' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                      >
                        يدوي (ورقي)
                      </button>
                    </div>
                    {receiptType === 'manual' ? (
                      <input
                        type="text"
                        value={receiptNumber}
                        onChange={(e) => setReceiptNumber(e.target.value)}
                        placeholder="أدخل رقم الوصل الورقي من الدفتر..."
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-xl text-sm font-bold focus:outline-none focus:border-emerald-500"
                      />
                    ) : (
                      <div className="w-full bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/50 px-4 py-3 rounded-xl flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">رقم الوصل الإلكتروني:</span>
                        <span className="text-sm font-black text-emerald-800 dark:text-emerald-300">{receiptNumber || `REC-${Date.now().toString().slice(-6)}`}</span>
                      </div>
                    )}
                  </div>"""
content = content.replace(receipt_target, receipt_replace)

# Set initial electronic receipt when they search
search_res_target = """        if (targetFine) {
          setSearchedFine(targetFine);
          setPaymentMethod('cash');
          setReceiptNumber('');"""
search_res_replace = """        if (targetFine) {
          setSearchedFine(targetFine);
          setPaymentMethod('cash');
          setReceiptType('electronic');
          setReceiptNumber(`REC-${Date.now().toString().slice(-6)}`);"""
content = content.replace(search_res_target, search_res_replace)

# 6. Print button
print_target = """                    <button
                      onClick={() => notify('جاري التجهيز لطباعة الوصل A4...', 'info')}
                      className="px-4 py-4 bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-xl text-xs font-black transition-all shadow-sm flex items-center gap-2"
                    >
                      <Printer className="w-4 h-4" /> طباعة A4
                    </button>"""
print_replace = """                    <button
                      onClick={() => { notify('جاري التجهيز لطباعة الوصل...', 'info'); setTimeout(() => window.print(), 500); }}
                      className="px-4 py-4 bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-xl text-xs font-black transition-all shadow-sm flex items-center gap-2"
                    >
                      <Printer className="w-4 h-4" /> طباعة الوصل
                    </button>"""
content = content.replace(print_target, print_replace)


# 7. Archive search
archive_header_target = """              <h4 className="text-md font-black text-slate-800 dark:text-white flex items-center gap-2 mb-4">
                <Archive className="w-5 h-5 text-slate-400" />
                أرشيف الوصولات المالية (تم التسديد)
              </h4>"""
archive_header_replace = """              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                <h4 className="text-md font-black text-slate-800 dark:text-white flex items-center gap-2">
                  <Archive className="w-5 h-5 text-slate-400" />
                  أرشيف الوصولات المالية (تم التسديد)
                </h4>
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 absolute right-3 top-2.5 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="بحث برقم الوصل أو المنشأة..."
                    value={archiveSearchTerm}
                    onChange={(e) => setArchiveSearchTerm(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 pl-4 pr-9 py-2 rounded-xl text-xs font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>"""
content = content.replace(archive_header_target, archive_header_replace)


# And we need to filter the paidFines mapping
archive_map_target = """                      {paidFines.slice(0, 10).map(fine => ("""
archive_map_replace = """                      {paidFines
                        .filter(f => !archiveSearchTerm || 
                           (f.receiptNumber && f.receiptNumber.toLowerCase().includes(archiveSearchTerm.toLowerCase())) ||
                           (getEstablishmentName(f.establishmentId || f.estId).toLowerCase().includes(archiveSearchTerm.toLowerCase())) ||
                           (f.establishmentId || f.estId).toLowerCase().includes(archiveSearchTerm.toLowerCase())
                        )
                        .slice(0, 20).map(fine => ("""
content = content.replace(archive_map_target, archive_map_replace)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Accountant UI modified.")
