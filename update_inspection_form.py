import re

filepath = "/Users/admin/web/منظومة الرقابة الصحية الرقمية/src/pages/InspectionForm.jsx"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add finesBooklet and penaltyRequests to useContext
content = content.replace(
    "const { navigate, establishments, inspectionTemplates, addInspection, config, user, logAudit, notify: triggerAlert, triggerSOSAlert } = useContext(AppContext);",
    "const { navigate, establishments, inspectionTemplates, addInspection, config, user, logAudit, notify: triggerAlert, triggerSOSAlert, finesBooklet, penaltyRequests, setPenaltyRequests } = useContext(AppContext);"
)

# 2. Add new states
state_addition = """
  // Smart Trigger States
  const [docsChecked, setDocsChecked] = useState({});
  const [pendingFines, setPendingFines] = useState([]);
  const [showClosureTrigger, setShowClosureTrigger] = useState(false);
  const [triggeredFine, setTriggeredFine] = useState(null);

  const handleDocCheck = (fineId, isOk) => {
    setDocsChecked(prev => ({ ...prev, [fineId]: isOk }));
    
    if (isOk === false) {
      const fine = finesBooklet?.find(f => f.id === fineId);
      if (fine) {
        if (fine.requiresClosure) {
          setTriggeredFine(fine);
          setShowClosureTrigger(true);
        } else {
          // Add to pending fines silently without blocking
          setPendingFines(prev => {
            if (!prev.find(p => p.id === fine.id)) {
              return [...prev, fine];
            }
            return prev;
          });
        }
      }
    } else {
      // Remove fine if changed to yes
      setPendingFines(prev => prev.filter(p => p.id !== fineId));
    }
  };

  const submitImmediateClosure = () => {
    if (!triggeredFine) return;
    
    const newRequest = {
      id: 'req_' + Date.now(),
      establishmentId: establishment.id,
      establishmentName: establishment.name,
      teamId: user?.id || 'team_1',
      teamName: user?.name || 'اللجنة الرقابية الأولى',
      date: new Date().toISOString(),
      type: 'closure',
      status: 'pending',
      reason: `تم التفعيل الذكي: ${triggeredFine.type}`,
      amount: triggeredFine.amount,
      fineId: triggeredFine.id
    };

    if (setPenaltyRequests) {
      setPenaltyRequests(prev => [newRequest, ...prev]);
    }
    
    triggerAlert('تم رفع طلب الإغلاق الفوري وتغريم المنشأة إلى السيد المدير بنجاح!', 'success');
    navigate('/dashboard/team');
  };
"""

content = content.replace(
    "const [timestamp, setTimestamp] = useState('');",
    "const [timestamp, setTimestamp] = useState('');\n" + state_addition
)

# 3. Add Basic Documents Section before sections.map
docs_section = """
          {/* الوثائق الأساسية (Smart Trigger) */}
          <div className="glassmorphic-card p-6 border-2 border-red-500/20 shadow-lg shadow-red-500/10 relative overflow-hidden mb-6">
            <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-l from-red-500 to-amber-500"></div>
            <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-3 mb-4 flex items-center gap-2">
              <Siren className="w-5 h-5 text-red-500 animate-pulse" />
              الوثائق الأساسية والتراخيص (تفعيل ذكي للغرامات)
            </h3>
            <div className="space-y-4">
              {finesBooklet?.map(fine => (
                <div key={fine.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 border-b border-slate-100/50 dark:border-slate-800/20 last:border-b-0">
                  <div className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center text-[10px] font-black shrink-0">
                      📄
                    </span>
                    <div>
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-300 block">
                        هل يتوفر: {fine.type}؟
                      </span>
                      {fine.requiresClosure && (
                        <span className="text-[10px] text-red-500 font-bold">⚠️ غيابها يستوجب إغلاق فوري وغرامة {fine.amount.toLocaleString()} د.ع</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleDocCheck(fine.id, true)}
                      className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${docsChecked[fine.id] === true ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}
                    >
                      نعم
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDocCheck(fine.id, false)}
                      className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${docsChecked[fine.id] === false ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}
                    >
                      لا (مخالفة)
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
"""

content = content.replace(
    "{sections.map(section => (",
    docs_section + "\n          {sections.map(section => ("
)


# 4. Add the Blocking Modal at the bottom
modal_ui = """
      {/* Smart Trigger Closure Modal */}
      {showClosureTrigger && triggeredFine && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl border-2 border-red-500/50 text-center relative overflow-hidden animate-bounce-in">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-red-500 to-amber-500"></div>
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertOctagon className="w-10 h-10 text-red-600 animate-pulse" />
            </div>
            
            <h2 className="text-xl font-black text-slate-800 dark:text-white mb-2">تنبيه حرج: مخالفة جسيمة!</h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm font-bold mb-6">
              غياب <span className="text-red-500">({triggeredFine.type})</span> يستوجب فرض غرامة مالية قدرها <span className="text-red-500 font-black">{triggeredFine.amount.toLocaleString()} د.ع</span> مع إغلاق المنشأة فوراً!
            </p>
            
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-900/50 mb-8 text-xs text-red-600 dark:text-red-400 font-bold leading-relaxed">
              تم إيقاف استمارة التقييم الاعتيادية تلقائياً.. لا يمكنك المتابعة إلا بعد اتخاذ إجراء قانوني تجاه هذه المخالفة الجسيمة.
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={submitImmediateClosure}
                className="w-full py-4 rounded-xl bg-gradient-to-l from-red-600 to-red-500 text-white font-black shadow-lg shadow-red-500/30 hover:scale-105 active:scale-95 transition-all text-sm flex items-center justify-center gap-2"
              >
                <Siren className="w-5 h-5" />
                إرسال طلب إغلاق فوري وتغريم للمدير
              </button>
              
              <button
                onClick={() => {
                  setShowClosureTrigger(false);
                  setDocsChecked(prev => ({ ...prev, [triggeredFine.id]: undefined }));
                }}
                className="w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-xs"
              >
                تراجع عن التحديد (إلغاء)
              </button>
            </div>
          </div>
        </div>
      )}
"""

content = content.replace("export default InspectionForm;", modal_ui + "\nexport default InspectionForm;")

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated InspectionForm.jsx")
