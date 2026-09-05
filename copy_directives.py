import re

# Read TeamDashboard.jsx
with open('src/pages/TeamDashboard.jsx', 'r', encoding='utf-8') as f:
    team_content = f.read()

# Read ExecutivePortal.jsx
with open('src/pages/ExecutivePortal.jsx', 'r', encoding='utf-8') as f:
    exec_content = f.read()

# 1. Add context and state variables
if 'const [targetRecipient, setTargetRecipient]' not in team_content:
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
    team_content = team_content.replace("const [metricModalType, setMetricModalType] = useState('all');", "const [metricModalType, setMetricModalType] = useState('all');\n" + state_code)

if "directors," not in team_content:
    team_content = team_content.replace(
        "const { navigate, establishments, addEstablishment,",
        "const { navigate, establishments, addEstablishment, directors,"
    )

# 2. Extract the ExecutivePortal directives block
start_marker = "{activeTab === 'directives' && hasPerm('showDirectivesPage') ? ("
end_marker = ") : activeTab === 'complaints'"

start_idx = exec_content.find(start_marker)
end_idx = exec_content.find(end_marker)

directives_block = exec_content[start_idx:end_idx]
directives_block = directives_block.replace("? (", "&& (")

# 3. Replace the old directives block in TeamDashboard.jsx
# Let's find exactly the block to replace in TeamDashboard.jsx
team_start = "{activeTab === 'directives' && (hasPerm('showDirectivesPage') || hasPerm('sendDirective') || hasPerm('replyDirective')) && ("
team_end = "{activeTab === 'lab_results'"

team_start_idx = team_content.find(team_start)
team_end_idx = team_content.find(team_end)

if team_start_idx != -1 and team_end_idx != -1:
    team_content_before = team_content[:team_start_idx]
    team_content_after = team_content[team_end_idx:]
    team_content = team_content_before + directives_block + "\n\n        " + team_content_after
    
    with open('src/pages/TeamDashboard.jsx', 'w', encoding='utf-8') as f:
        f.write(team_content)
    print("Updated TeamDashboard.jsx successfully.")
else:
    print("Could not find markers in TeamDashboard.jsx")
