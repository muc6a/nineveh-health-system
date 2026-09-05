import re

with open("src/pages/InspectionForm.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add state variable
if "isSampleSent" not in content:
    content = content.replace(
        "const [labSampleNotes, setLabSampleNotes] = useState('');",
        "const [labSampleNotes, setLabSampleNotes] = useState('');\n  const [isSampleSent, setIsSampleSent] = useState(false);"
    )

# 2. Add function
func = """
  const handleIndependentSampleSubmit = () => {
    if (!labSampleType.trim()) {
      triggerAlert('يرجى تحديد نوع العينة أولاً', 'warning');
      return;
    }
    if (isSampleSent) return;
    if (!setLabRequests) return;
    
    const newLabReq = {
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
    };

    setLabRequests(prev => [newLabReq, ...prev]);
    setIsSampleSent(true);
    triggerAlert('تم إرسال العينة إلى المختبر بنجاح', 'success', true);
  };
"""

if "handleIndependentSampleSubmit" not in content:
    content = content.replace(
        "const handleSubmit = (e) => {",
        func + "\n  const handleSubmit = (e) => {"
    )

# 3. Remove submission logic from handleSubmit
# Block 1
block1_regex = r"// Submit Lab Request if needed\s+if \(needsLabSample && labSampleType && labSampleCode && setLabRequests\) \{.*?\}\s*(?=\s*// Submit any pending document fines)"
content = re.sub(block1_regex, "", content, flags=re.DOTALL)

# Block 2
block2_regex = r"if \(hasLabSample && setLabRequests\) \{.*?\}\s*(?=\s*if \(isOffline\))"
content = re.sub(block2_regex, "", content, flags=re.DOTALL)

# 4. Add UI button
ui_button = """
                {/* Independent Submit Button */}
                <button
                  type="button"
                  onClick={handleIndependentSampleSubmit}
                  disabled={isSampleSent}
                  className={`w-full py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all mt-4 ${
                    isSampleSent 
                      ? 'bg-emerald-500 text-white cursor-not-allowed shadow-lg shadow-emerald-500/30' 
                      : 'bg-fuchsia-500 hover:bg-fuchsia-600 text-white shadow-lg shadow-fuchsia-500/30 active:scale-95'
                  }`}
                >
                  {isSampleSent ? 'تم إرسال العينة بنجاح' : 'إرسال العينة إلى المختبر'}
                </button>
              </div>
            )}
          </div>
"""

ui_regex = r"\s*</textarea>\s*</div>\s*</div>\s*\)\}\s*</div>"
content = re.sub(ui_regex, "\n                  </textarea>\n                </div>" + ui_button, content)


with open("src/pages/InspectionForm.jsx", "w", encoding="utf-8") as f:
    f.write(content)
