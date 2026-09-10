import re

with open("src/pages/LabDashboard.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# Replace imports
if "import UnifiedSidebar" not in content:
    content = content.replace(
        "import { WeatherWidget } from '../components/WeatherWidget';",
        "import { WeatherWidget } from '../components/WeatherWidget';\nimport { GlobalHeader } from '../components/GlobalHeader';\nimport UnifiedSidebar from '../components/UnifiedSidebar';"
    )

if "hasPerm" not in content.split("const {")[1].split("}")[0]:
    content = content.replace("playBeep, uiPreferences , globalLogout } = useContext(AppContext);", "playBeep, uiPreferences, globalLogout, hasPerm } = useContext(AppContext);")

if "const [executiveTab, setExecutiveTab] = useState" not in content:
    content = content.replace("const [isSidebarOpen, setIsSidebarOpen] = useState(false);", "const [isSidebarOpen, setIsSidebarOpen] = useState(false);\n  const [executiveTab, setExecutiveTab] = useState('dashboard');")

# Find the start of the return statement
# return (
#    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300">
#      {/* Sidebar */}
#      <div className={`fixed inset-y-0 right-0 ...

old_layout_pattern = r"return \(\s*<div className=.min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300.>(.*?){/\* Main Content \*/}\s*<div className=.flex-1 flex flex-col(.*?)>\s*<div className=.bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 sticky top-0 z-40 px-6 py-4.>\s*<div className=.flex flex-col lg:flex-row lg:items-center justify-between gap-4.>(.*?)</div>\s*</div>"

# Wait, the structure in LabDashboard is:
# return (
#    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300">
#      {/* Sidebar */}
#      ...
#      {/* Main Content */}
#      <div className={`flex-1 flex flex-col...
#        <div className="bg-white/70...
#          ... header content ...
#        </div>

# Let's just do it manually with a simpler approach since the exact text might differ.

