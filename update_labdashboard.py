import re

with open("src/pages/LabDashboard.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update resultModal state to include mode
content = content.replace("const [resultModal, setResultModal] = useState({ isOpen: false, request: null });", "const [resultModal, setResultModal] = useState({ isOpen: false, request: null, mode: 'create' });")

# 2. Add handleCreateManualSample
if "const handleCreateManualSample" not in content:
    create_func = """
  const handleCreateManualSample = () => {
    if (!selectedEstForSample || !manualSampleType) return;
    const newLabReq = {
      id: Math.floor(10000 + Math.random() * 90000).toString(),
      establishmentId: selectedEstForSample.id,
      estName: selectedEstForSample.name || 'غير معروف',
      teamId: user?.id || 'lab_manual',
      teamName: user?.name || 'مختبر',
      date: new Date().toISOString().split('T')[0],
      status: 'under_testing', // Automatically in testing if created manually
      receivedAt: new Date().toISOString(),
      sampleCode: Math.floor(10000 + Math.random() * 90000).toString(),
      sampleType: manualSampleType,
      senderNotes: manualSampleRemarks
    };
    setLabRequests(prev => [newLabReq, ...prev]);
    setNewSampleModal({ isOpen: false });
    setSelectedEstForSample(null);
    setManualSampleType('');
    setManualSampleRemarks('');
    playBeep && playBeep('success');
  };
"""
    content = content.replace("const handleReceiveSample = (id) => {", create_func + "\n  const handleReceiveSample = (id) => {")

# 3. Update handleSaveResult to support edit mode and audit trail
save_result_pattern = r'const handleSaveResult = \(\) => \{[\s\S]*?playBeep && playBeep\(\'success\'\);\s*\};'
save_result_match = re.search(save_result_pattern, content)
if save_result_match:
    new_save_func = """const handleSaveResult = () => {
    if (!resultModal.request) return;

    const reqId = resultModal.request.id;
    const isContaminated = resultStatus === 'contaminated';
    const isEditMode = resultModal.mode === 'edit';

    // Update request
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

    // Notify operations if contaminated (only if not editing, or maybe if edit changed it)
    if (!isEditMode) {
      if (isContaminated) {
        setSystemNotifications(prev => [{
          id: 'notif_' + Date.now() + '1',
          title: '🚨 عينة ملوثة مختبرياً!',
          message: `تم ثبوت تلوث العينة المرسلة من ${resultModal.request.teamName} للمنشأة (${resultModal.request.estName}). يرجى اتخاذ القرار الإداري بالغلق أو الغرامة.`,
          date: new Date().toISOString(),
          isRead: false,
          targetRole: 'operations',
          relatedLabRequestId: reqId
        },
        {
          id: 'notif_' + Date.now() + '2',
          title: '🚨 عينة ملوثة مختبرياً!',
          message: `تم ثبوت تلوث العينة المرسلة من قبلكم للمنشأة (${resultModal.request.estName}).`,
          date: new Date().toISOString(),
          isRead: false,
          targetRole: resultModal.request.teamId,
          relatedLabRequestId: reqId
        }, ...prev]);
      } else {
        setSystemNotifications(prev => [{
          id: 'notif_' + Date.now(),
          title: '✅ نتيجة عينة سليمة',
          message: `عينات المنشأة (${resultModal.request.estName}) سليمة ومطابقة للمواصفات.`,
          date: new Date().toISOString(),
          isRead: false,
          targetRole: resultModal.request.teamId
        }, ...prev]);
      }
      
      // Attach lab document to establishment
      if (resultModal.request.establishmentId) {
        setEstablishments(prev => prev.map(est => {
          if (est.id === resultModal.request.establishmentId) {
            const doc = {
              id: 'doc_' + Date.now(),
              name: `نتيجة فحص مختبري - ${resultModal.request.sampleType || 'عينة'}`,
              type: 'وثيقة رسمية',
              url: '#',
              date: new Date().toISOString().split('T')[0],
              isLabResult: true,
              status: isContaminated ? 'سلبية' : 'سليمة'
            };
            return { ...est, documents: [...(est.documents || []), doc] };
          }
          return est;
        }));
      }
    }

    setResultModal({ isOpen: false, request: null, mode: 'create' });
    setResultStatus('safe');
    setResultNotes('');
    playBeep && playBeep('success');
  };"""
    content = content.replace(save_result_match.group(0), new_save_func)

# 4. Add the Edit Button in the Archive tab if hasPerm('editLabResults')
archive_item_pattern = r'<h4 className="font-bold text-slate-800 dark:text-white">\{req.estName\}</h4>'
archive_item_replace = """<h4 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                            {req.estName}
                            {req.id && <span className="text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-full">#{req.id}</span>}
                            {req.editedBy && <span className="text-[9px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200">مُعدلة</span>}
                          </h4>"""
content = content.replace(archive_item_pattern, archive_item_replace)

edit_btn_target = r'\{req.notes && \(\s*<p className="mt-2 text-xs p-2 bg-white/50 dark:bg-slate-800 rounded border border-slate-100 dark:border-slate-700">ملاحظات: \{req.notes\}</p>\s*\)\}'
edit_btn = """{req.notes && (
                            <p className="mt-2 text-xs p-2 bg-white/50 dark:bg-slate-800 rounded border border-slate-100 dark:border-slate-700">ملاحظات: {req.notes}</p>
                          )}
                          {req.editedBy && (
                            <p className="text-[9px] text-slate-400 mt-1 italic">آخر تعديل بواسطة: {req.editedBy} في {new Date(req.editedAt).toLocaleString('ar-IQ')}</p>
                          )}"""
content = content.replace(edit_btn_target, edit_btn)

edit_btn_2_target = r'(<div className={`flex items-center p-4 rounded-2xl border gap-4)'
edit_btn_2 = """<div className={`flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-2xl border gap-4 transition-all ${req.result === 'safe' ? 'bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/30' : 'bg-red-50/50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30'}`}>
                        <div className="flex items-center gap-4 w-full">"""
content = re.sub(r'<div className={`flex items-center p-4 rounded-2xl border gap-4 \$\{req\.result === \'safe\' \? \'bg-emerald-50\/50 dark:bg-emerald-900\/10 border-emerald-100 dark:border-emerald-900\/30\' : \'bg-red-50\/50 dark:bg-red-900\/10 border-red-100 dark:border-red-900\/30\'\}`\}>', edit_btn_2, content)

edit_btn_3_target = r'(<\/div>\s*<\/div>\s*\)\)\s*)\}'
edit_btn_3 = """</div>
                        {hasPerm('editLabResults') && (
                          <button 
                            onClick={() => {
                              setResultModal({ isOpen: true, request: req, mode: 'edit' });
                              setResultStatus(req.result || 'safe');
                              setResultNotes(req.notes || '');
                            }}
                            className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 hover:text-indigo-600 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 shrink-0 w-full md:w-auto"
                          >
                            ✏️ تعديل النتيجة
                          </button>
                        )}
                      </div>
                    ))
                  )}"""
content = re.sub(r'<\/div>\s*<\/div>\s*\)\)\s*\}', edit_btn_3, content)

with open("src/pages/LabDashboard.jsx", "w", encoding="utf-8") as f:
    f.write(content)

