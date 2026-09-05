import re

with open('src/pages/LabDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_filter = """  // Filter requests
  const incomingReqs = labRequests.filter(r => r.status === 'pending_arrival');
  const testingReqs = labRequests.filter(r => r.status === 'under_testing');
  const archivedReqs = labRequests.filter(r => r.status === 'finished');"""

new_filter = """  // Filter requests
  const safeLabRequests = labRequests || [];
  const safeEstablishments = establishments || [];
  const incomingReqs = safeLabRequests.filter(r => r.status === 'pending_arrival');
  const testingReqs = safeLabRequests.filter(r => r.status === 'under_testing');
  const archivedReqs = safeLabRequests.filter(r => r.status === 'finished');"""

content = content.replace(old_filter, new_filter)

# And replace establishments usage
content = content.replace("establishments.filter", "safeEstablishments.filter")
content = content.replace("establishments.length", "safeEstablishments.length")

with open('src/pages/LabDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated LabDashboard safety")
