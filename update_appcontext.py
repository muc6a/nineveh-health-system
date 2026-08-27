import sys

with open('src/context/AppContext.jsx', 'r') as f:
    content = f.read()

# Check if accountants already added
if 'const [accountants, setAccountants]' not in content:
    # Add states right after trackers
    trackers_decl = "const [trackers, setTrackers] = useLocalStorage('health_trackers', []);"
    new_decls = """const [trackers, setTrackers] = useLocalStorage('health_trackers', []);
  const [accountants, setAccountants] = useLocalStorage('health_accountants', []);
  const [finesBooklet, setFinesBooklet] = useLocalStorage('health_fines_booklet', []);
  const [fineTransactions, setFineTransactions] = useLocalStorage('health_fine_transactions', []);"""
    content = content.replace(trackers_decl, new_decls)

    # Add to value object
    value_decl = "trackers, setTrackers,"
    new_value = "trackers, setTrackers, accountants, setAccountants, finesBooklet, setFinesBooklet, fineTransactions, setFineTransactions,"
    content = content.replace(value_decl, new_value)

    with open('src/context/AppContext.jsx', 'w') as f:
        f.write(content)
    print("Updated AppContext")
else:
    print("AppContext already updated")
