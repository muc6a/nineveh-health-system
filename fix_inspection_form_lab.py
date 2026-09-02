import re

with open('src/pages/InspectionForm.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove old handleSendSampleToLab
content = re.sub(r'  const handleSendSampleToLab = \(\) => \{.*?  \};\n\n', '', content, flags=re.DOTALL)

# Add lab states
if 'const [hasLabSample, setHasLabSample]' not in content:
    content = content.replace(
        "  const [timestamp, setTimestamp] = useState('');",
        "  const [timestamp, setTimestamp] = useState('');\n  const [hasLabSample, setHasLabSample] = useState(false);\n  const [sampleType, setSampleType] = useState('');"
    )

# Find handleSubmit to inject lab creation logic
handle_submit_match = re.search(r'    try \{\n      // Save or update\n      if \(isEdit\) \{', content)
if handle_submit_match:
    lab_logic = """
      if (hasLabSample && sampleType.trim()) {
        const newReq = {
          id: 'lab_req_' + Date.now(),
          teamId: user?.id || 'team_1',
          teamName: user?.name || 'اللجنة الرقابية الأولى',
          estId: establishment.id,
          estName: establishment.name,
          date: new Date().toISOString(),
          status: 'pending_arrival',
          senderNotes: 'نوع العينة: ' + sampleType
        };
        if (setLabRequests) {
          setLabRequests(prev => [newReq, ...prev]);
        }
      }
"""
    content = content.replace('    try {\n      // Save or update', '    try {\n' + lab_logic + '\n      // Save or update')

# Find the lab button to remove it
lab_btn = r"""              <button
                type="button"
                onClick=\{handleSendSampleToLab\}
                disabled=\{isSubmitting \|\| !establishment\}
                className="px-4 py-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-bold text-\[11px\] sm:text-xs hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <FlaskConical className="w-4 h-4" />
                <span className="hidden sm:inline">إرسال عينة للمختبر</span>
              </button>"""
content = re.sub(lab_btn, '', content, flags=re.DOTALL)


# Add the lab section UI before the remarks section
remarks_section = r"""          <div className="glassmorphic-card p-6 mt-8 shadow-sm">
            <h3 className="text-sm font-black text-slate-800 dark:text-white mb-4">📝 ملاحظات المفتش الصحية (تظهر في التقرير)</h3>"""

lab_section = """
          <div className="glassmorphic-card p-6 mt-8 shadow-sm border border-indigo-500/20">
            <div className="flex items-center gap-3 mb-6 border-b border-indigo-500/20 pb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <FlaskConical className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-800 dark:text-white">الفحص المختبري</h3>
                <p className="text-xs font-bold text-slate-500">سحب عينات للتحليل المختبري (يتم إرسالها تلقائياً للمختبر المركزي)</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={hasLabSample}
                  onChange={(e) => setHasLabSample(e.target.checked)}
                  className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 transition-colors cursor-pointer"
                />
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">يوجد عينة مختبرية مسحوبة من المنشأة؟ (نعم)</span>
              </label>

              {hasLabSample && (
                <div className="pl-8 animate-fade-in mt-4">
                  <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-2">نوع وتفاصيل العينة:</label>
                  <input
                    type="text"
                    required
                    value={sampleType}
                    onChange={(e) => setSampleType(e.target.value)}
                    placeholder="اكتب نوع العينة (مثال: لحوم مجمدة، مياه شرب...)"
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-indigo-500 transition-colors"
                  />
                  <p className="text-[10px] text-slate-500 font-bold mt-2">ملاحظة: سيتم توليد طلب إرسال للمختبر المركزي بمجرد اعتماد الاستمارة.</p>
                </div>
              )}
            </div>
          </div>\n\n"""

if lab_section not in content:
    content = content.replace(remarks_section, lab_section + remarks_section)


with open('src/pages/InspectionForm.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("InspectionForm Lab UI updated")
