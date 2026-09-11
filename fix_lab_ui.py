import json

# Let's fix the AppContext.jsx to include the default Lab account in `labs` initialization.
with open('src/context/AppContext.jsx', 'r', encoding='utf-8') as f:
    app_context = f.read()

labs_init_target = """  const [labs, setLabs] = useState(() => {
    const saved = localStorage.getItem('nineveh_labs');
    return saved ? JSON.parse(saved) : [];
  });"""

labs_init_replace = """  const [labs, setLabs] = useState(() => {
    const saved = localStorage.getItem('nineveh_labs');
    if (saved) return JSON.parse(saved);
    return [{
      id: 'lab-1',
      name: 'المختبر المركزي العام',
      email: 'lab@ninveh.health.gov.iq',
      password: 'lab',
      permissions: { receiveSamples: true, enterLabResults: true, editLabResults: true, labArchive: true, centralLabView: true }
    }];
  });"""

app_context = app_context.replace(labs_init_target, labs_init_replace)

with open('src/context/AppContext.jsx', 'w', encoding='utf-8') as f:
    f.write(app_context)
