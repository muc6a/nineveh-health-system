import re

with open("src/pages/LabDashboard.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# Add handleCreateManualSample
new_func = """
  const handleCreateManualSample = () => {
    if (!selectedEstForSample || !manualSampleType) return;

    const newReq = {
      id: 'lab_' + Date.now() + Math.random().toString(36).substring(7),
      establishmentId: selectedEstForSample.id,
      estName: selectedEstForSample.name,
      teamId: user?.teamId || user?.role || 'lab_manual',
      teamName: user?.name || 'إنشاء يدوي - مختبر',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('ar-IQ'),
      status: 'pending_arrival',
      sampleType: manualSampleType,
      sampleCode: Math.floor(100000 + Math.random() * 900000).toString(),
      senderNotes: manualSampleRemarks,
      result: null,
      decision: null,
      attachments: []
    };

    setLabRequests(prev => [newReq, ...prev]);
    setNewSampleModal({ isOpen: false });
    setSelectedEstForSample(null);
    setManualSampleType('');
    setManualSampleRemarks('');
    setSearchEst('');
    if (playBeep) playBeep('success');
  };

  const handleReceiveSample = (reqId) => {"""

content = content.replace("  const handleReceiveSample = (reqId) => {", new_func)

with open("src/pages/LabDashboard.jsx", "w", encoding="utf-8") as f:
    f.write(content)
