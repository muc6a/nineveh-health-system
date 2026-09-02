import re

with open('src/components/OperationsRoom.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add the missing state declaration
content = content.replace(
    "const [activeTab, setActiveTab] = usePersistentTab('opsActiveTab', 'penalties');",
    "const [activeTab, setActiveTab] = usePersistentTab('opsActiveTab', 'penalties');\n  const [selectedPerfTeam, setSelectedPerfTeam] = useState('all');"
)

with open('src/components/OperationsRoom.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

