import re

with open('src/components/LabManager.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = """  // Filter requests
  const safeLabRequests = labRequests || [];
  const safeEstablishments = establishments || [];
  const incomingReqs = safeLabRequests.filter(r => r.status === 'pending_arrival');
  const testingReqs = safeLabRequests.filter(r => r.status === 'under_testing');
  const archivedReqs = safeLabRequests.filter(r => r.status === 'finished');"""

replacement = """  // Filter requests
  const hasCentralView = user?.role === 'admin' || user?.permissions?.centralLabView === true;
  const safeLabRequests = hasCentralView 
    ? (labRequests || [])
    : (labRequests || []).filter(r => r.teamId === user?.id || r.teamId === user?.role);
    
  const safeEstablishments = establishments || [];
  const incomingReqs = safeLabRequests.filter(r => r.status === 'pending_arrival');
  const testingReqs = safeLabRequests.filter(r => r.status === 'under_testing');
  const archivedReqs = safeLabRequests.filter(r => r.status === 'finished');"""

content = content.replace(target, replacement)

with open('src/components/LabManager.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated LabManager filter logic")
