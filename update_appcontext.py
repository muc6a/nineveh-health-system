import sys

with open('src/context/AppContext.jsx', 'r') as f:
    content = f.read()

# Add state variables for accountants, finesBooklet, and fineTransactions
if 'const [accountants, setAccountants]' not in content:
    old_state = "  const [teams, setTeams] = useState(() => {"
    new_state = """  const [accountants, setAccountants] = useState(() => {
    const saved = localStorage.getItem('nineveh_accountants');
    return saved ? JSON.parse(saved) : [];
  });

  const [finesBooklet, setFinesBooklet] = useState(() => {
    const saved = localStorage.getItem('nineveh_fines_booklet');
    return saved ? JSON.parse(saved) : [
      { id: 'f1', type: 'عدم وجود إجازة صحية', amount: 500000, requiresClosure: true },
      { id: 'f2', type: 'سوء النظافة العامة', amount: 150000, requiresClosure: false },
      { id: 'f3', type: 'وجود مواد منتهية الصلاحية', amount: 250000, requiresClosure: false }
    ];
  });

  const [fineTransactions, setFineTransactions] = useState(() => {
    const saved = localStorage.getItem('nineveh_fine_transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [teams, setTeams] = useState(() => {"""
    content = content.replace(old_state, new_state)

if 'localStorage.setItem(\'nineveh_accountants\'' not in content:
    old_effects = "  useEffect(() => {\n    localStorage.setItem('nineveh_teams', JSON.stringify(teams));\n  }, [teams]);"
    new_effects = """  useEffect(() => {
    localStorage.setItem('nineveh_teams', JSON.stringify(teams));
  }, [teams]);

  useEffect(() => {
    localStorage.setItem('nineveh_accountants', JSON.stringify(accountants));
  }, [accountants]);

  useEffect(() => {
    localStorage.setItem('nineveh_fines_booklet', JSON.stringify(finesBooklet));
  }, [finesBooklet]);

  useEffect(() => {
    localStorage.setItem('nineveh_fine_transactions', JSON.stringify(fineTransactions));
  }, [fineTransactions]);"""
    content = content.replace(old_effects, new_effects)

if 'accountants,' not in content.split("export const AppProvider")[1].split("value={{")[1].split("}}")[0]:
    # It's safer to just regex replace value={{
    import re
    content = re.sub(r'value=\{\{(.*?)\}\}', r'value={{\1, accountants, setAccountants, finesBooklet, setFinesBooklet, fineTransactions, setFineTransactions}}', content, flags=re.DOTALL)

with open('src/context/AppContext.jsx', 'w') as f:
    f.write(content)
print("Updated AppContext.jsx")
