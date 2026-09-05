import re

with open("src/components/LabManager.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# Add hasPerm if it's missing (we added it in previous session but let's make sure it's there and imported correctly)
if "const hasPerm =" not in content:
    # Need to add it.
    pass

# Update initial tab
old_state = "const [labTab, setLabTab] = useState('stats');"
new_state = """const getInitialTab = () => {
    if (hasPerm('centralLabView')) return 'stats';
    if (hasPerm('receiveSamples')) return 'incoming';
    if (hasPerm('enterLabResults')) return 'testing';
    if (hasPerm('labArchive')) return 'archive';
    return 'stats';
  };
  const [labTab, setLabTab] = useState(getInitialTab);"""
content = content.replace(old_state, new_state)

# Update tab buttons
# 1. stats
content = re.sub(
    r'(<button[^>]*onClick={\(\) => setLabTab\(\'stats\'\)}.*?</button>)',
    r'{(hasPerm("centralLabView") || hasPerm("receiveSamples") || hasPerm("enterLabResults")) && \1}',
    content,
    flags=re.DOTALL
)
# 2. incoming
content = re.sub(
    r'(<button[^>]*onClick={\(\) => setLabTab\(\'incoming\'\)}.*?</button>)',
    r'{hasPerm("receiveSamples") && \1}',
    content,
    flags=re.DOTALL
)
# 3. testing
content = re.sub(
    r'(<button[^>]*onClick={\(\) => setLabTab\(\'testing\'\)}.*?</button>)',
    r'{hasPerm("enterLabResults") && \1}',
    content,
    flags=re.DOTALL
)
# 4. archive
content = re.sub(
    r'(<button[^>]*onClick={\(\) => setLabTab\(\'archive\'\)}.*?</button>)',
    r'{hasPerm("labArchive") && \1}',
    content,
    flags=re.DOTALL
)

with open("src/components/LabManager.jsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Updated LabManager tabs")
