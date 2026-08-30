import re

file_path = "src/context/AppContext.jsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add isMountedLabs
ref_target = "const isMountedAcc = React.useRef(false);"
ref_replacement = "const isMountedAcc = React.useRef(false);\n  const isMountedLabs = React.useRef(false);"
content = content.replace(ref_target, ref_replacement)

# 2. Add useEffect for syncToCloud
effect_target = "useEffect(() => { if (isMountedAcc.current) syncToCloud('nineveh_accountants', accountants); else isMountedAcc.current = true; }, [accountants]);"
effect_replacement = "useEffect(() => { if (isMountedAcc.current) syncToCloud('nineveh_accountants', accountants); else isMountedAcc.current = true; }, [accountants]);\n  useEffect(() => { if (isMountedLabs.current) syncToCloud('nineveh_labs', labs); else isMountedLabs.current = true; }, [labs]);"
content = content.replace(effect_target, effect_replacement)

# 3. Add setupFirebaseSync
sync_target = "setupFirebaseSync('nineveh_accountants', setAccountants, accountants);"
sync_replacement = "setupFirebaseSync('nineveh_accountants', setAccountants, accountants);\n      setupFirebaseSync('nineveh_labs', setLabs, labs);"
content = content.replace(sync_target, sync_replacement)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Labs persistence fixed")
