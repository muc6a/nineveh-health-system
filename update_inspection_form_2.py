import re

filepath = "/Users/admin/web/منظومة الرقابة الصحية الرقمية/src/pages/InspectionForm.jsx"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# Add logic to process pendingFines in processSubmission
logic_to_insert = """
      // Submit any pending document fines
      if (pendingFines.length > 0 && setPenaltyRequests) {
        const newRequests = pendingFines.map(fine => ({
          id: 'req_' + Date.now() + Math.random().toString(36).substring(7),
          establishmentId: establishment.id,
          establishmentName: establishment.name,
          teamId: user?.id || 'team_1',
          teamName: user?.name || 'اللجنة الرقابية الأولى',
          date: new Date().toISOString(),
          type: 'fine',
          status: 'pending',
          reason: `مخالفة وثائق (تلقائي): ${fine.type}`,
          amount: fine.amount,
          fineId: fine.id
        }));
        setPenaltyRequests(prev => [...newRequests, ...prev]);
        triggerAlert(`تم تسجيل ${pendingFines.length} غرامة وثائق تلقائياً!`, 'warning', true);
      }
"""

content = content.replace(
    "addInspection(establishment.id, scorePercentage, remarks || 'تم إجراء التقييم الصحي الدوري.', ratings, user?.name || 'اللجنة الرقابية الأولى', liveLocation, isEdit, user?.id, selectedPhoto);",
    "addInspection(establishment.id, scorePercentage, remarks || 'تم إجراء التقييم الصحي الدوري.', ratings, user?.name || 'اللجنة الرقابية الأولى', liveLocation, isEdit, user?.id, selectedPhoto);\n" + logic_to_insert
)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated processSubmission in InspectionForm.jsx")
