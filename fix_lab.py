import re

with open('src/components/LabManager.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

func = """  const handleReceiveSample = (id) => {
"""

new_func = """  const handleCreateManualSample = () => {
    if (!selectedEstForSample || !manualSampleType) return;
    
    const newReq = {
      id: 'lab_' + Date.now(),
      status: 'pending_arrival',
      estId: selectedEstForSample.id,
      estName: selectedEstForSample.name,
      teamId: user?.id || 'manual',
      teamName: user?.name || 'إدخال يدوي - المختبر',
      date: new Date().toISOString(),
      senderNotes: `نوع العينة: ${manualSampleType}` + (manualSampleRemarks ? ` | ملاحظات: ${manualSampleRemarks}` : '')
    };
    
    setLabRequests(prev => [newReq, ...prev]);
    setSystemNotifications(prev => [{
      id: Date.now().toString(),
      type: 'info',
      title: 'عينة يدوية',
      message: `تم تسجيل عينة جديدة يدوياً للمنشأة: ${selectedEstForSample.name}`,
      date: new Date().toISOString(),
      read: false
    }, ...prev]);
    
    if (playBeep) playBeep('success');
    
    // Reset form
    setSelectedEstForSample(null);
    setSearchEst('');
    setManualSampleType('');
    setManualSampleRemarks('');
    setNewSampleModal({ isOpen: false });
  };

  const handleReceiveSample = (id) => {
"""

content = content.replace(func, new_func)

with open('src/components/LabManager.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Added handleCreateManualSample to LabManager")
