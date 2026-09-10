import re

with open("src/context/AppContext.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add skipSyncRef
if "const skipSyncRef = React.useRef({});" not in content:
    content = content.replace(
        "const isMountedEst = React.useRef(false);",
        "const skipSyncRef = React.useRef({});\n  const isMountedEst = React.useRef(false);"
    )

# 2. Update setupFirebaseSync
old_onValue = """        onValue(dbRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            setter(data);
            localStorage.setItem(key, JSON.stringify(data));
          } else if (isFirstLoad && localFallback && (!Array.isArray(localFallback) || localFallback.length > 0)) {
            // If Firebase is empty on first load and we have meaningful local fallback, initialize Firebase
            set(dbRef, localFallback);
          } else {
            // Firebase node was deleted or is genuinely empty
            const emptyData = Array.isArray(localFallback) ? [] : null;
            setter(emptyData);
            localStorage.setItem(key, JSON.stringify(emptyData));
          }
          isFirstLoad = false;
        }, (error) => {
          console.error('Firebase Sync Error for', key, error);
          // Fallback to local storage
          const saved = localStorage.getItem(key);
          if (saved) setter(JSON.parse(saved));
        });"""

new_onValue = """        onValue(dbRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            skipSyncRef.current[key] = true;
            setter(data);
            localStorage.setItem(key, JSON.stringify(data));
          } else if (isFirstLoad && localFallback && (!Array.isArray(localFallback) || localFallback.length > 0)) {
            // If Firebase is empty on first load and we have meaningful local fallback, initialize Firebase
            set(dbRef, localFallback);
          } else {
            // Firebase node was deleted or is genuinely empty
            const emptyData = Array.isArray(localFallback) ? [] : null;
            skipSyncRef.current[key] = true;
            setter(emptyData);
            localStorage.setItem(key, JSON.stringify(emptyData));
          }
          isFirstLoad = false;
        }, (error) => {
          console.error('Firebase Sync Error for', key, error);
          // Fallback to local storage
          const saved = localStorage.getItem(key);
          if (saved) {
            skipSyncRef.current[key] = true;
            setter(JSON.parse(saved));
          }
        });"""

content = content.replace(old_onValue, new_onValue)

# 3. Update useEffects
def replace_use_effect(line):
    # e.g., useEffect(() => { if (isMountedEst.current) syncToCloud('establishments', establishments); else isMountedEst.current = true; }, [establishments]);
    match = re.search(r"useEffect\(\(\) => \{ if \(isMounted[a-zA-Z]+\.current\) syncToCloud\('([^']+)', ([^)]+)\); else isMounted[a-zA-Z]+\.current = true; \}, \[([^\]]+)\]\);", line)
    if not match:
        return line
    key = match.group(1)
    data_var = match.group(2)
    deps = match.group(3)
    mounted_var = line.split("if (")[1].split(".current")[0]
    
    new_line = f"  useEffect(() => {{ if ({mounted_var}.current) {{ if (skipSyncRef.current['{key}']) {{ skipSyncRef.current['{key}'] = false; return; }} syncToCloud('{key}', {data_var}); }} else {mounted_var}.current = true; }}, [{deps}]);"
    return new_line

lines = content.split('\n')
new_lines = []
for line in lines:
    if "useEffect(() => { if (isMounted" in line and "syncToCloud" in line:
        new_lines.append(replace_use_effect(line))
    else:
        new_lines.append(line)

with open("src/context/AppContext.jsx", "w", encoding="utf-8") as f:
    f.write('\n'.join(new_lines))

