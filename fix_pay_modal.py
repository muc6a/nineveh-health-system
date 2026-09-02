import re

with open('src/components/FinancialReports.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace states and handlePay
new_states = """
  const [showPayModal, setShowPayModal] = useState(false);
  const [payCode, setPayCode] = useState('');
  const [paymentType, setPaymentType] = useState('electronic');
  const [foundFine, setFoundFine] = useState(null);

  const { setPenaltyRequests, notify } = useContext(AppContext);
  
  const handleSearchFine = () => {
    if(!payCode.trim()) return;
    const allFines = penaltyRequests || [];
    // Search for a pending fine for this establishment ID or Name
    const fine = allFines.find(f => (f.establishmentId === payCode || f.establishmentName.includes(payCode)) && f.paymentStatus !== 'paid');
    
    if (fine) {
      setFoundFine(fine);
    } else {
      setFoundFine(null);
      if (notify) notify('لم يتم العثور على غرامات معلقة لهذه المنشأة', 'error');
      else alert('لم يتم العثور على غرامات معلقة');
    }
  };

  const handlePay = () => {
    if(!foundFine) return;
    
    if (setPenaltyRequests) {
      setPenaltyRequests(prev => prev.map(f => {
        if (f.id === foundFine.id) {
          return {
            ...f,
            paymentStatus: 'paid',
            paymentDate: new Date().toISOString(),
            paymentMethod: paymentType
          };
        }
        return f;
      }));
    }
    
    if (notify) notify('تم تسديد الغرامة بنجاح!', 'success');
    else alert('تم تسديد الغرامة بنجاح!');
    
    setShowPayModal(false);
    setPayCode('');
    setFoundFine(null);
    setPaymentType('electronic');
  };
"""

content = re.sub(r'  const \[showPayModal.*?setPayCode\(\'\'\);\n  };', new_states.strip(), content, flags=re.DOTALL)

# Add notify destructuring if missing
if 'notify' not in content.split('useContext(AppContext)')[0]:
    content = content.replace('const { penaltyRequests, teams } = useContext(AppContext);', 'const { penaltyRequests, teams, setPenaltyRequests, notify } = useContext(AppContext);')

# Replace the modal JSX
new_modal_jsx = """
      {showPayModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2rem] p-6 shadow-2xl">
            <h3 className="text-lg font-black text-slate-800 dark:text-white mb-2">تسديد غرامة فوري</h3>
            <p className="text-xs text-slate-500 mb-4">أدخل كود المنشأة لجلب تفاصيل الغرامة المعلقة وتسديدها</p>
            
            <div className="flex gap-2 mb-4">
              <input 
                type="text" 
                placeholder="كود أو اسم المنشأة..." 
                value={payCode}
                onChange={e => {
                  setPayCode(e.target.value);
                  setFoundFine(null);
                }}
                className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500"
              />
              <button 
                onClick={handleSearchFine}
                className="px-4 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-sm rounded-xl transition-colors"
              >
                بحث
              </button>
            </div>

            {foundFine && (
              <div className="mb-4 p-4 rounded-xl border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-900/10">
                <h4 className="font-black text-emerald-800 dark:text-emerald-400 mb-2">{foundFine.establishmentName}</h4>
                <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300 font-bold">
                  <p>المبلغ المطلوب: <span className="text-red-500 font-black">{(foundFine.amount || 0).toLocaleString()} د.ع</span></p>
                  <p>نوع المخالفة: {foundFine.reason?.replace(/تطبيق كراس الغرامات - |تطبيق كراس الغرامة و |تطبيق كراس الغرامة /g, '') || (foundFine.type === 'closure' ? 'إغلاق وغرامة' : 'غرامة')}</p>
                </div>
                
                <div className="mt-4 pt-3 border-t border-emerald-500/20">
                  <label className="text-xs font-bold text-emerald-700 dark:text-emerald-400 block mb-2">طريقة الدفع:</label>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setPaymentType('electronic')}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold transition-colors ${paymentType === 'electronic' ? 'bg-emerald-500 text-white shadow-md' : 'bg-white dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700'}`}
                    >
                      إلكتروني
                    </button>
                    <button 
                      onClick={() => setPaymentType('manual')}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold transition-colors ${paymentType === 'manual' ? 'bg-emerald-500 text-white shadow-md' : 'bg-white dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700'}`}
                    >
                      يدوي (وصول)
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-2 mt-4">
              <button 
                onClick={() => {
                  setShowPayModal(false);
                  setPayCode('');
                  setFoundFine(null);
                }} 
                className="flex-1 py-3 rounded-xl text-slate-500 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold text-sm"
              >
                إلغاء
              </button>
              <button 
                onClick={handlePay} 
                disabled={!foundFine}
                className="flex-1 py-3 rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                تسديد الآن
              </button>
            </div>
          </div>
        </div>
      )}
"""

content = re.sub(r'      \{showPayModal && \(\n.*?        </div>\n      \)\}', new_modal_jsx.strip(), content, flags=re.DOTALL)

with open('src/components/FinancialReports.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done with FinancialReports")
