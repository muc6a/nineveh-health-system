import re

with open('src/pages/TeamDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add missing state and context variables for the directives view
if 'targetRecipient' not in content:
    state_vars = """
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
      setDirectiveSuccessMsg('تم تعميم وإرسال الأمر الإداري بنجاح!');
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
    addDirective(tId, text, user?.role === 'director' ? `المدير العام (${user?.name})` : (user?.name || 'الإدارة المركزية'), user?.id || user?.role);
    notify('تم إرسال التوجيه للفريق الميداني بنجاح', 'success');
    
    setDispatchEstId('');
  };
"""
    # Insert after `const [metricModalType, setMetricModalType] = useState('all');`
    content = content.replace("const [metricModalType, setMetricModalType] = useState('all');", "const [metricModalType, setMetricModalType] = useState('all');\n" + state_vars)

# Update useContext to include directors
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

# In TeamDashboard.jsx, the directives block starts with `{activeTab === 'directives' && (hasPerm('showDirectivesPage') || hasPerm('sendDirective') || hasPerm('replyDirective')) && (`
team_start_marker = "{activeTab === 'directives' && (hasPerm('showDirectivesPage') || hasPerm('sendDirective') || hasPerm('replyDirective')) && ("
team_end_marker = "{activeTab === 'lab_results'"

if team_start_marker in content and team_end_marker in content:
    # Replace it!
    # Note: TeamDashboard's directives_block uses `myDirectives` instead of `directives` in the map loop?
    # In ExecutivePortal it uses `(directives || []).filter(...)`. So it's fine!
    content_before = content[:content.find(team_start_marker)]
    content_after = content[content.find(team_end_marker):]
    
    # We will format the directives_block a bit for TeamDashboard
    new_team_directives_block = directives_block + "\n        "
    content = content_before + new_team_directives_block + content_after
else:
    print("Could not find markers in TeamDashboard.jsx")

with open('src/pages/TeamDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated TeamDashboard.jsx with the ExecutivePortal directives layout.")
