import re

with open('src/pages/TeamDashboard.jsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# 1. Add context and state variables
content = "".join(lines)
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

if "directors," not in content:
    content = content.replace(
        "const { navigate, establishments, addEstablishment,",
        "const { navigate, establishments, addEstablishment, directors,"
    )

# 2. Re-read as lines after state injection
lines = content.split('\n')
for i in range(len(lines)):
    lines[i] = lines[i] + '\n'

# Find the start and end of the directives block in TeamDashboard
start_idx = -1
end_idx = -1
for i, line in enumerate(lines):
    if "{activeTab === 'directives' && (hasPerm('showDirectivesPage') || hasPerm('sendDirective') || hasPerm('replyDirective')) && (" in line:
        start_idx = i
        break

for i in range(start_idx + 1, len(lines)):
    if "{activeTab === 'lab_results'" in lines[i]:
        # Backtrack to find the end of the previous block
        for j in range(i - 1, start_idx, -1):
            if lines[j].strip() == ")}":
                end_idx = j
                break
        break

if start_idx != -1 and end_idx != -1:
    old_block = "".join(lines[start_idx:end_idx+1])
    
    # Read the new block from ExecutivePortal
    with open('src/pages/ExecutivePortal.jsx', 'r', encoding='utf-8') as f:
        exec_content = f.read()
    
    exec_start = "{activeTab === 'directives' && hasPerm('showDirectivesPage') ? ("
    exec_end = ") : activeTab === 'complaints'"
    
    e_start_idx = exec_content.find(exec_start)
    e_end_idx = exec_content.find(exec_end)
    
    new_block = exec_content[e_start_idx:e_end_idx]
    
    # Adjust the start of the block to match TeamDashboard's condition
    new_block = new_block.replace("{activeTab === 'directives' && hasPerm('showDirectivesPage') ? (", 
                                "{activeTab === 'directives' && (hasPerm('showDirectivesPage') || hasPerm('sendDirective') || hasPerm('replyDirective')) && (")
    
    # Ensure it ends with `)}`
    new_block = new_block.rstrip()
    
    content = content.replace(old_block, new_block + "\n")
    
    with open('src/pages/TeamDashboard.jsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Replaced successfully!")
else:
    print(f"Could not find indices: start={start_idx}, end={end_idx}")
