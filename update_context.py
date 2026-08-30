import re

file_path = "src/context/AppContext.jsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add state declaration
state_target = "  const [fineTransactions, setFineTransactions] = useState(() => {"
state_replace = """  const [dailyInventories, setDailyInventories] = useState(() => {
    const saved = localStorage.getItem('nineveh_daily_inventories');
    return saved ? JSON.parse(saved) : [];
  });
  const [fineTransactions, setFineTransactions] = useState(() => {"""
if state_target in content:
    content = content.replace(state_target, state_replace)
else:
    print("state_target not found")

# 2. Add storage sync
sync_target = """        setFineTransactions(JSON.parse(e.newValue));
      }"""
sync_replace = """        setFineTransactions(JSON.parse(e.newValue));
      } else if (e.key === 'nineveh_daily_inventories' && e.newValue) {
        setDailyInventories(JSON.parse(e.newValue));
      }"""
if sync_target in content:
    content = content.replace(sync_target, sync_replace)
else:
    print("sync_target not found")

# 3. Add setupFirebaseSync
firebase_target = "      setupFirebaseSync('nineveh_fine_transactions', setFineTransactions, fineTransactions);"
firebase_replace = """      setupFirebaseSync('nineveh_fine_transactions', setFineTransactions, fineTransactions);
      setupFirebaseSync('nineveh_daily_inventories', setDailyInventories, dailyInventories);"""
if firebase_target in content:
    content = content.replace(firebase_target, firebase_replace)
else:
    print("firebase_target not found")
    
# 4. Add useEffect for localStorage
effect_target = """  useEffect(() => { if (isMountedTrans.current) syncToCloud('nineveh_fine_transactions', fineTransactions); else isMountedTrans.current = true; }, [fineTransactions]);"""
effect_replace = """  useEffect(() => { if (isMountedTrans.current) syncToCloud('nineveh_fine_transactions', fineTransactions); else isMountedTrans.current = true; }, [fineTransactions]);
  const isMountedInv = useRef(false);
  useEffect(() => { if (isMountedInv.current) syncToCloud('nineveh_daily_inventories', dailyInventories); else isMountedInv.current = true; }, [dailyInventories]);"""
if effect_target in content:
    content = content.replace(effect_target, effect_replace)
else:
    print("effect_target not found")
    
# 5. Add to Context Provider
provider_target = "      finesBooklet, setFinesBooklet,"
provider_replace = """      finesBooklet, setFinesBooklet,
      dailyInventories, setDailyInventories,"""
if provider_target in content:
    content = content.replace(provider_target, provider_replace)
else:
    print("provider_target not found")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("AppContext modified successfully.")
