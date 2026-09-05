import re

with open('src/pages/InspectionForm.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add setLabRequests to AppContext destructuring
content = content.replace(
    "const { establishments, finesBooklet, user, navigate, reports, config, addInspection, setPenaltyRequests, logAudit, triggerAlert } = useContext(AppContext);",
    "const { establishments, finesBooklet, user, navigate, reports, config, addInspection, setPenaltyRequests, setLabRequests, logAudit, triggerAlert } = useContext(AppContext);"
)

# Add logic to push to labRequests in processSubmission
old_process = """      if (isOffline) {
        localStorage.setItem('has_offline_data', 'true');"""
new_process = """      if (hasLabSample && setLabRequests) {
        const newLabRequest = {
          id: 'lab_' + Date.now(),
          establishmentId: establishment.id,
          establishmentName: establishment.name,
          teamId: user?.id || 'team_1',
          teamName: user?.name || 'اللجنة الرقابية الأولى',
          sampleCode: sampleCode,
          sampleType: sampleType,
          remarks: sampleRemarks,
          date: new Date().toISOString(),
          status: 'pending'
        };
        setLabRequests(prev => [newLabRequest, ...prev]);
      }

      if (isOffline) {"""

content = content.replace(old_process, new_process)

with open('src/pages/InspectionForm.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated InspectionForm to push lab requests")
