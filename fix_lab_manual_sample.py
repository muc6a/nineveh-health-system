import re

with open('src/pages/LabDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

handler_code = """  const handleCreateManualSample = () => {
    if (!selectedEstForSample || !manualSampleType) return;
    
    const newSample = {
      id: `LAB-MAN-${Math.floor(1000 + Math.random() * 9000)}`,
      estId: selectedEstForSample.id,
      estName: selectedEstForSample.name,
      teamId: user?.id || 'lab',
      teamName: user?.name || 'مختبر مركزي',
      type: manualSampleType,
      notes: manualSampleRemarks,
      status: 'under_testing',
      timestamp: new Date().toISOString(),
      receivedAt: new Date().toISOString()
    };
    
    setLabRequests(prev => [newSample, ...(prev || [])]);
    
    if (typeof notify !== 'undefined' && notify) notify('تم تسجيل العينة يدوياً بنجاح', 'success');
    
    // Reset modal
    setNewSampleModal({ isOpen: false });
    setSelectedEstForSample(null);
    setSearchEst('');
    setManualSampleType('');
    setManualSampleRemarks('');
    
    if (typeof playBeep !== 'undefined' && playBeep) playBeep('success');
  };

"""

# Let's insert it after handleSaveResult closes
# I will use a simple replace

old_code = """    // Add notification
    const newNotif = {
      id: `NOTIF-${Math.floor(Math.random() * 10000)}`,
      title: 'نتيجة فحص مختبري',
      message: `تم إصدار نتيجة فحص لمنشأة (${resultModal.request.estName}) - النتيجة: ${isContaminated ? 'تلوث' : 'سليمة'}`,
      type: isContaminated ? 'error' : 'success',
      timestamp: new Date().toISOString(),
      read: false
    };
    setSystemNotifications(prev => [newNotif, ...prev]);

    setResultModal({ isOpen: false, request: null });
    setResultNotes('');
    setResultStatus('safe');
    playBeep && playBeep('success');
  };"""

new_code = old_code + "\n\n" + handler_code

content = content.replace(old_code, new_code)

with open('src/pages/LabDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Injected handleCreateManualSample")
