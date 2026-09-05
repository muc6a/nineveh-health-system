import re

with open("src/pages/InspectionForm.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add state variables
state_vars = """
  const [needsLabSample, setNeedsLabSample] = useState(false);
  const [labSampleType, setLabSampleType] = useState('');
  const [labSampleCode, setLabSampleCode] = useState('');
  const [labSampleNotes, setLabSampleNotes] = useState('');

  const handleLabSampleToggle = () => {
    const newStatus = !needsLabSample;
    setNeedsLabSample(newStatus);
    if (newStatus && !labSampleCode) {
      // Generate numeric code only (6 digits)
      setLabSampleCode(Math.floor(100000 + Math.random() * 900000).toString());
    }
  };
"""
if "needsLabSample" not in content:
    content = re.sub(r"(const \[isSubmitting, setIsSubmitting\] = useState\(false\);)", r"\1\n" + state_vars, content)

# 2. Add lab request submission
submission_code = """
      // Submit Lab Request if needed
      if (needsLabSample && labSampleType && labSampleCode && setLabRequests) {
        const newLabReq = {
          id: 'lab_' + Date.now() + Math.random().toString(36).substring(7),
          establishmentId: establishment.id,
          establishmentName: establishment.name,
          teamId: user?.teamId || 'team_1',
          date: new Date().toISOString().split('T')[0],
          time: new Date().toLocaleTimeString('ar-IQ'),
          status: 'pending_arrival',
          sampleType: labSampleType,
          sampleCode: labSampleCode,
          notes: labSampleNotes,
          inspectorName: user?.name || 'مفتش',
          result: null,
          decision: null,
          attachments: []
        };
        setLabRequests(prev => [...prev, newLabReq]);
      }
"""
if "needsLabSample && labSampleType" not in content:
    content = content.replace("// Submit any pending document fines", submission_code + "\n      // Submit any pending document fines")

# 3. Add UI below basic documents
ui_code = """
          {/* طلب عينة مختبرية */}
          <div className="glassmorphic-card p-6 border border-fuchsia-500/20 shadow-lg shadow-fuchsia-500/10 relative overflow-hidden mb-6">
            <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-l from-fuchsia-500 to-indigo-500"></div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <span className="text-fuchsia-500 text-lg">🧪</span>
                هل تحتاج عينة مختبرية؟
              </h3>
              <button
                type="button"
                onClick={handleLabSampleToggle}
                className={`w-12 h-6 rounded-full transition-colors relative ${needsLabSample ? 'bg-fuchsia-500' : 'bg-slate-300 dark:bg-slate-700'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${needsLabSample ? 'left-0.5' : 'right-0.5'}`} />
              </button>
            </div>
            
            {needsLabSample && (
              <div className="space-y-4 animate-fade-in pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 block">نوع العينة (مثال: لحم)</label>
                  <input
                    type="text"
                    required
                    value={labSampleType}
                    onChange={(e) => setLabSampleType(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs font-bold text-right focus:outline-none focus:border-fuchsia-500 transition-all text-slate-800 dark:text-slate-200"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 block">كود العينة (تلقائي)</label>
                  <input
                    type="text"
                    readOnly
                    value={labSampleCode}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-lg font-black text-center focus:outline-none text-indigo-600 dark:text-indigo-400 select-all cursor-copy"
                  />
                  <p className="text-[10px] text-fuchsia-500 text-center font-bold">يجب كتابة هذا الكود على ملصق كيس العينة المادية</p>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 block">ملاحظات (اختياري)</label>
                  <textarea
                    value={labSampleNotes}
                    onChange={(e) => setLabSampleNotes(e.target.value)}
                    rows={2}
                    className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs font-bold text-right focus:outline-none focus:border-fuchsia-500 transition-all text-slate-800 dark:text-slate-200 resize-none"
                  />
                </div>
              </div>
            )}
          </div>
"""
if "طلب عينة مختبرية" not in content:
    content = content.replace("          {sections.map(section => (", ui_code + "\n          {sections.map(section => (")

with open("src/pages/InspectionForm.jsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Updated InspectionForm.jsx")
