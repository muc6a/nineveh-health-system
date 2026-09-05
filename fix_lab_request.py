import re

with open("src/pages/InspectionForm.jsx", "r", encoding="utf-8") as f:
    content = f.read()

old_req = """    const newLabReq = {
      id: 'lab_' + Date.now() + Math.random().toString(36).substring(7),
      establishmentId: establishment?.id,
      establishmentName: establishment?.name || 'غير معروف',
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
    };"""

new_req = """    const newLabReq = {
      id: 'lab_' + Date.now() + Math.random().toString(36).substring(7),
      establishmentId: establishment?.id,
      estName: establishment?.name || 'غير معروف',
      teamId: user?.teamId || 'team_1',
      teamName: user?.name || 'مفتش',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('ar-IQ'),
      status: 'pending_arrival',
      sampleType: labSampleType,
      sampleCode: labSampleCode,
      senderNotes: labSampleNotes,
      result: null,
      decision: null,
      attachments: []
    };"""

content = content.replace(old_req, new_req)

with open("src/pages/InspectionForm.jsx", "w", encoding="utf-8") as f:
    f.write(content)
