import re

filepath = "/Users/admin/web/منظومة الرقابة الصحية الرقمية/src/context/AppContext.jsx"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add to setupFirebaseSync
target_sync = "      setupFirebaseSync('fines', setFines, fines);"
replacement_sync = """      setupFirebaseSync('fines', setFines, fines);
      setupFirebaseSync('nineveh_accountants', setAccountants, accountants);
      setupFirebaseSync('nineveh_fines_booklet', setFinesBooklet, finesBooklet);
      setupFirebaseSync('nineveh_fine_transactions', setFineTransactions, fineTransactions);"""
content = content.replace(target_sync, replacement_sync)

# 2. Add isMounted refs
target_refs = "  const isMountedEst = React.useRef(false);"
replacement_refs = """  const isMountedAcc = React.useRef(false);
  const isMountedFinesBooklet = React.useRef(false);
  const isMountedFineTrans = React.useRef(false);
  const isMountedEst = React.useRef(false);"""
content = content.replace(target_refs, replacement_refs)

# 3. Replace useEffects for accountants and finesBooklet
target_useeffects = """  // Persist new states to localStorage
  useEffect(() => {
    localStorage.setItem('nineveh_accountants', JSON.stringify(accountants));
  }, [accountants]);

  useEffect(() => {
    localStorage.setItem('nineveh_fines_booklet', JSON.stringify(finesBooklet));
  }, [finesBooklet]);"""

replacement_useeffects = """  // Persist new states to Firebase Cloud
  useEffect(() => { if (isMountedAcc.current) syncToCloud('nineveh_accountants', accountants); else isMountedAcc.current = true; }, [accountants]);
  useEffect(() => { if (isMountedFinesBooklet.current) syncToCloud('nineveh_fines_booklet', finesBooklet); else isMountedFinesBooklet.current = true; }, [finesBooklet]);
  useEffect(() => { if (isMountedFineTrans.current) syncToCloud('nineveh_fine_transactions', fineTransactions); else isMountedFineTrans.current = true; }, [fineTransactions]);"""

content = content.replace(target_useeffects, replacement_useeffects)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated AppContext.jsx")
