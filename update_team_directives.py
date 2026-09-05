import re

with open('src/pages/TeamDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add context and state variables
if 'const [targetRecipient, setTargetRecipient]' not in content:
    state_code = """
  const [targetRecipient, setTargetRecipient] = useState('all');
  const [directiveText, setDirectiveText] = useState('');
  const [directiveSuccessMsg, setDirectiveSuccessMsg] = useState('');
  const [replyText, setReplyText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [dispatchTeamId, setDispatchTeamId] = useState('');
  const [dispatchEstId, setDispatchEstId] = useState('');

  const handleSendDirective = (e) => {
    e.preventDefault();
    if (directiveText.trim()) {
      addDirective(targetRecipient, directiveText, user?.role === 'director' ? `المدير العام (${user?.name})` : (user?.name || 'الفريق الميداني'), user?.id || user?.role);
      setDirectiveText('');
      setTargetRecipient('all');
      setDirectiveSuccessMsg('تم تعميم وإرسال التبليغ بنجاح!');
      setTimeout(() => setDirectiveSuccessMsg(''), 3000);
      notify('تم إرسال التبليغ بنجاح', 'success');
    }
  };

  const handleDispatch = (tId, eId) => {
    if(!tId || !eId) return notify('يرجى تحديد المنشأة المستهدفة للتوجيه', 'error');
    
    // Create directive to the specific team
    const est = establishments.find(e => e.id === parseInt(eId) || e.id === eId);
    if(!est) return;
    
    const text = `توجيه ميداني عاجل: يرجى التوجه فوراً لإجراء كشف صحي على المنشأة (${est.name})`;
    addDirective(tId, text, user?.role === 'director' ? `المدير العام (${user?.name})` : (user?.name || 'الجهة الإدارية'), user?.id || user?.role);
    notify('تم إرسال التوجيه للفريق الميداني بنجاح', 'success');
    
    setDispatchEstId('');
  };
"""
    content = content.replace("const [metricModalType, setMetricModalType] = useState('all');", "const [metricModalType, setMetricModalType] = useState('all');\n" + state_code)

content = content.replace(
    "const { navigate, establishments, addEstablishment,",
    "const { navigate, establishments, addEstablishment, directors,"
)

# 2. Extract the ExecutivePortal directives block
with open('src/pages/ExecutivePortal.jsx', 'r', encoding='utf-8') as f:
    exec_content = f.read()

start_marker = "{activeTab === 'directives' && hasPerm('showDirectivesPage') ? ("
end_marker = ") : activeTab === 'complaints'"

directives_block = exec_content[exec_content.find(start_marker):exec_content.find(end_marker)]
directives_block = directives_block.replace("? (", "&& (")

# 3. Replace the directives block in TeamDashboard
team_start = "{activeTab === 'directives' && (hasPerm('showDirectivesPage') || hasPerm('sendDirective') || hasPerm('replyDirective')) && ("
# The end of the directives block in TeamDashboard.jsx is before `{activeTab === 'lab_results'`
# We can find it using regex
team_block_regex = r"\{activeTab === 'directives' && \(hasPerm\('showDirectivesPage'\) \|\| hasPerm\('sendDirective'\) \|\| hasPerm\('replyDirective'\)\) && \([\s\S]*?\n\s*\)\}\n\n\s*\{activeTab === 'lab_results'"

match = re.search(team_block_regex, content)
if match:
    # We replace everything from `{activeTab === 'directives'` up to `\n\n        {activeTab === 'lab_results'`
    matched_text = match.group(0)
    # The last part of matched_text is `\n\n        {activeTab === 'lab_results'`
    replacement = directives_block + "\n\n        {activeTab === 'lab_results'"
    content = content.replace(matched_text, replacement)
else:
    print("Could not find the directives block in TeamDashboard.jsx")

with open('src/pages/TeamDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated TeamDashboard.jsx with new directives layout.")
