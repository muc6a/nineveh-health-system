import re

with open("src/pages/InspectionForm.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# Add isSampleSent state
state_var_pattern = r"(const \[labSampleNotes, setLabSampleNotes\] = useState\(''\);)"
content = re.sub(state_var_pattern, r"\1\n  const [isSampleSent, setIsSampleSent] = useState(false);", content)

# Add independent submission function
func_to_add = """
  const handleIndependentSampleSubmit = () => {
    if (!labSampleType.trim()) {
      triggerAlert('يرجى تحديد نوع العينة أولاً', 'error');
      return;
    }
    if (!setLabRequests) return;
    
    const newLabRequest = {
      id: labSampleCode,
      facilityName: selectedFacility?.name || 'مجهول',
      facilityId: selectedFacility?.id,
      inspectorName: user?.name || 'مفتش',
      sector: user?.sector || 'غير محدد',
      type: labSampleType,
      date: new Date().toISOString().split('T')[0],
      status: 'قيد التوصيل',
      notes: labSampleNotes,
      linkedInspectionId: 'temp_pending_' + Date.now(),
      sampleCode: labSampleCode
    };

    setLabRequests(prev => [newLabRequest, ...prev]);
    setIsSampleSent(true);
    triggerAlert('تم إرسال العينة إلى المختبر بنجاح', 'success');
  };
"""

# Find a good place to put it: before handleSubmit
submit_pattern = r"(const handleSubmit = \(e\) => \{)"
content = re.sub(submit_pattern, func_to_add + "\n  \\1", content)

# Remove the sample injection from handleSubmit
# Actually wait, let's see how handleSubmit currently handles it. 
# There's a block: if (hasLabSample && setLabRequests) { ... }
# Or if (needsLabSample && labSampleType && labSampleCode && setLabRequests)
