import re

with open("src/components/LabManager.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add mode to resultModal
content = content.replace("const [resultModal, setResultModal] = useState({ isOpen: false, request: null });", "const [resultModal, setResultModal] = useState({ isOpen: false, request: null, mode: 'create' });")

# 2. Update manual ID generation to be 5-digits
manual_gen_pattern = r"id:\s*'lab_' \+ Date\.now\(\),"
content = re.sub(manual_gen_pattern, "id: Math.floor(10000 + Math.random() * 90000).toString(),\n      sampleCode: Math.floor(10000 + Math.random() * 90000).toString(),", content)

# 3. Update result saving logic to include Audit Trail and Edit Mode
save_result_pattern = r'const handleSaveResult = \(\) => \{[\s\S]*?playBeep && playBeep\(\'success\'\);\s*\};'
save_result_match = re.search(save_result_pattern, content)
if save_result_match:
    new_save_func = """const handleSaveResult = () => {
    if (!resultModal.request) return;
    const reqId = resultModal.request.id;
    const isEditMode = resultModal.mode === 'edit';
    
    setLabRequests(prev => prev.map(r => {
      if (r.id === reqId) {
        const updatedReq = { 
          ...r, 
          status: 'finished', 
          result: resultStatus, 
          notes: resultNotes
        };
        if (!isEditMode) {
          updatedReq.finishedAt = new Date().toISOString();
        } else {
          updatedReq.editedBy = user?.name;
          updatedReq.editedAt = new Date().toISOString();
        }
        return updatedReq;
      }
      return r;
    }));

    setResultModal({ isOpen: false, request: null, mode: 'create' });
    setResultStatus('safe');
    setResultNotes('');
    playBeep && playBeep('success');
  };"""
    content = content.replace(save_result_match.group(0), new_save_func)

# 4. Update the Table columns
th_target = r'<th className="pb-3 px-2 font-bold">كود العينة<\/th>'
th_replace = '<th className="pb-3 px-2 font-bold">كود العينة</th>'
# Actually no need to change table headers if they already say what we need. 

# 5. Update row rendering to show short sampleCode and Audit trail
td_code_target = r'<td className="py-4 px-2 font-black text-slate-400 text-\[10px\]">\{req\.id\}<\/td>'
td_code_replace = """<td className="py-4 px-2 font-black text-slate-600 dark:text-slate-300">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg w-fit">{req.sampleCode || req.id}</span>
                    {req.editedBy && <span className="text-[9px] text-amber-600 dark:text-amber-400">مُعدلة: {req.editedBy}</span>}
                  </div>
                </td>"""
content = re.sub(td_code_target, td_code_replace, content)

# 6. Update action buttons text and Add Edit Button
actions_target = r'<td className="py-4 px-2">\s*\{req\.status === \'under_testing\' && hasPerm\(\'enterLabResults\'\) && \([\s\S]*?<\/td>'
actions_replace = """<td className="py-4 px-2">
                  <div className="flex gap-2 flex-wrap items-center">
                  {req.status === 'under_testing' && hasPerm('enterLabResults') && (
                    <button 
                      onClick={() => setResultModal({ isOpen: true, request: req, mode: 'create' })}
                      className="px-3 py-1.5 bg-teal-50 dark:bg-teal-900/20 hover:bg-teal-100 dark:hover:bg-teal-900/40 text-teal-700 dark:text-teal-400 rounded-lg text-[10px] font-black transition-colors flex items-center gap-1 w-fit border border-teal-200 dark:border-teal-800/30"
                    >
                      <FileText className="w-3 h-3" /> إدخال النتيجة
                    </button>
                  )}
                  {req.status === 'finished' && (
                    <>
                      <span className="text-[10px] text-slate-400 font-bold bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">مؤرشفة</span>
                      {hasPerm('editLabResults') && (
                        <button 
                          onClick={() => {
                            setResultModal({ isOpen: true, request: req, mode: 'edit' });
                            setResultStatus(req.result || 'safe');
                            setResultNotes(req.notes || '');
                          }}
                          className="px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/40 text-amber-700 dark:text-amber-400 rounded-lg text-[10px] font-black transition-colors flex items-center gap-1 w-fit border border-amber-200 dark:border-amber-800/30"
                        >
                          ✏️ تعديل النتيجة
                        </button>
                      )}
                    </>
                  )}
                  {req.status === 'pending_arrival' && hasPerm('receiveSamples') && (
                    <button 
                      onClick={() => toggleStatusManually(req)}
                      className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-indigo-700 dark:text-indigo-400 rounded-lg text-[10px] font-black transition-colors flex items-center gap-1 w-fit border border-indigo-200 dark:border-indigo-800/30"
                    >
                      <CheckCircle className="w-3 h-3" /> استلام التوصيل
                    </button>
                  )}
                  </div>
                </td>"""
content = re.sub(actions_target, actions_replace, content)

with open("src/components/LabManager.jsx", "w", encoding="utf-8") as f:
    f.write(content)

