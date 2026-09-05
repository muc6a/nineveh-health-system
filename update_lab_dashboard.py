import re

with open('src/pages/LabDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add new sample modal state
content = content.replace(
    "const [resultNotes, setResultNotes] = useState('');",
    "const [resultNotes, setResultNotes] = useState('');\n  const [newSampleModal, setNewSampleModal] = useState({ isOpen: false });\n  const [searchEst, setSearchEst] = useState('');\n  const [selectedEstForSample, setSelectedEstForSample] = useState(null);\n  const [manualSampleType, setManualSampleType] = useState('');\n  const [manualSampleRemarks, setManualSampleRemarks] = useState('');"
)

# Add logic to generate manual sample
content = content.replace(
    "const handleStartTesting = (req) => {",
    """const handleCreateManualSample = () => {
    if (!selectedEstForSample || !manualSampleType) return;
    
    const newLabRequest = {
      id: 'lab_' + Date.now(),
      establishmentId: selectedEstForSample.id,
      establishmentName: selectedEstForSample.name,
      teamId: 'manual',
      teamName: 'مختبر مركزي (إدخال يدوي)',
      sampleCode: Date.now().toString(),
      sampleType: manualSampleType,
      remarks: manualSampleRemarks,
      date: new Date().toISOString(),
      status: 'testing',
      receivedAt: new Date().toISOString()
    };
    
    setLabRequests(prev => [newLabRequest, ...prev]);
    setNewSampleModal({ isOpen: false });
    setSelectedEstForSample(null);
    setManualSampleType('');
    setManualSampleRemarks('');
    setSearchEst('');
    notify('تم إدخال العينة الجديدة بنجاح وهي قيد الفحص الآن', 'success');
  };

  const handleStartTesting = (req) => {"""
)

# Add button to header or incoming tab
content = content.replace(
    "{activeTab === 'incoming' && 'الطلبات الواردة'}",
    """{activeTab === 'incoming' && 'الطلبات الواردة'}
              {activeTab === 'incoming' && (
                <button 
                  onClick={() => setNewSampleModal({ isOpen: true })}
                  className="mr-4 px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[10px] transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  ➕ إنشاء عينة جديدة
                </button>
              )}"""
)

content = content.replace(
    "{activeTab === 'testing' && 'عينات قيد الفحص'}",
    """{activeTab === 'testing' && 'عينات قيد الفحص'}
              {activeTab === 'testing' && (
                <button 
                  onClick={() => setNewSampleModal({ isOpen: true })}
                  className="mr-4 px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[10px] transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  ➕ إنشاء عينة جديدة
                </button>
              )}"""
)

# Add the New Sample Modal at the end, right before return
modal_code = """      {/* New Sample Modal */}
      {newSampleModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[2rem] shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h2 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-indigo-500" /> تسجيل عينة مختبرية جديدة
              </h2>
              <button onClick={() => setNewSampleModal({isOpen: false})} className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 rounded-full cursor-pointer transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-5">
              
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-2">البحث عن المنشأة المعنية</label>
                <div className="relative">
                  <FileSearch className="w-4 h-4 absolute right-3 top-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchEst}
                    onChange={(e) => setSearchEst(e.target.value)}
                    placeholder="اكتب اسم المنشأة أو الكود..."
                    className="w-full pl-4 pr-10 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 outline-none text-sm font-bold text-slate-800 dark:text-white focus:border-indigo-500"
                  />
                </div>
                {searchEst.length > 1 && !selectedEstForSample && (
                  <div className="mt-2 max-h-40 overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 shadow-lg">
                    {establishments.filter(e => e.name.includes(searchEst) || e.id.includes(searchEst)).slice(0,10).map(e => (
                      <div 
                        key={e.id}
                        onClick={() => {
                          setSelectedEstForSample(e);
                          setSearchEst('');
                        }}
                        className="p-3 border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 cursor-pointer flex justify-between items-center"
                      >
                        <span className="font-bold text-sm">{e.name}</span>
                        <span className="text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">{e.id}</span>
                      </div>
                    ))}
                  </div>
                )}
                {selectedEstForSample && (
                  <div className="mt-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl flex justify-between items-center">
                    <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
                      <CheckCircle className="w-4 h-4" />
                      تم اختيار: {selectedEstForSample.name}
                    </div>
                    <button onClick={() => setSelectedEstForSample(null)} className="text-xs text-red-500 hover:underline">تغيير</button>
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-2">نوع وتفاصيل العينة</label>
                <input
                  type="text"
                  value={manualSampleType}
                  onChange={(e) => setManualSampleType(e.target.value)}
                  placeholder="مثال: لحوم مجمدة، مياه شرب..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 outline-none text-sm font-bold text-slate-800 dark:text-white focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-2">ملاحظات إضافية</label>
                <textarea
                  value={manualSampleRemarks}
                  onChange={(e) => setManualSampleRemarks(e.target.value)}
                  placeholder="أي ملاحظات حول حالة العينة..."
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 outline-none text-sm font-bold text-slate-800 dark:text-white focus:border-indigo-500 resize-none"
                />
              </div>

            </div>
            <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
              <button 
                onClick={handleCreateManualSample}
                disabled={!selectedEstForSample || !manualSampleType}
                className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-black text-sm transition-all shadow-lg shadow-indigo-600/20 cursor-pointer"
              >
                تسجيل العينة وإدخالها للفحص
              </button>
            </div>
          </div>
        </div>
      )}
"""

content = content.replace("    </div>\n  );\n};\n\nexport default LabDashboard;", modal_code + "\n    </div>\n  );\n};\n\nexport default LabDashboard;")

with open('src/pages/LabDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated LabDashboard UI")
