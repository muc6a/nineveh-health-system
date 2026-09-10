import re

with open("src/pages/LabDashboard.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Imports
if "import { GlobalHeader } from '../components/GlobalHeader';" not in content:
    content = content.replace("import { WeatherWidget } from '../components/WeatherWidget';", "import { WeatherWidget } from '../components/WeatherWidget';\nimport { GlobalHeader } from '../components/GlobalHeader';\nimport UnifiedSidebar from '../components/UnifiedSidebar';")

# 2. Add 'hasPerm' and 'executiveTab' states to LabDashboard if missing
if "hasPerm" not in content.split("const {")[1].split("}")[0]:
    content = content.replace("playBeep, uiPreferences , globalLogout } = useContext(AppContext);", "playBeep, uiPreferences, globalLogout, hasPerm } = useContext(AppContext);")

# We need a dummy executiveTab state for UnifiedSidebar
if "const [executiveTab, setExecutiveTab] = useState" not in content:
    content = content.replace("const [isSidebarOpen, setIsSidebarOpen] = useState(false);", "const [isSidebarOpen, setIsSidebarOpen] = useState(false);\n  const [executiveTab, setExecutiveTab] = useState('dashboard');")

# 3. Replace the entire structure
# We need to find the main return statement of LabDashboard
main_return_match = re.search(r"return \(\s*<div className=.min-h-screen", content)
if main_return_match:
    start_idx = main_return_match.start()
    # find the end of the return statement. It's tricky but we can replace from start_idx to the end, but wait, there are modals at the end.
    pass
