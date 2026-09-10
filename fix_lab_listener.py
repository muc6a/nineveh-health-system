import re

with open("src/pages/LabDashboard.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# Check if nav listener exists
if "navToLabResults" not in content:
    listener_code = """
  // Listen for navigation events from NotificationBell
  React.useEffect(() => {
    const handleNav = () => {
      setActiveTab('incoming');
      setIsSidebarOpen(false);
    };
    const handleNavResults = () => {
      setActiveTab('testing');
      setIsSidebarOpen(false);
    };
    window.addEventListener('navToLabRequests', handleNav);
    window.addEventListener('navToLabResults', handleNavResults);
    return () => {
      window.removeEventListener('navToLabRequests', handleNav);
      window.removeEventListener('navToLabResults', handleNavResults);
    };
  }, []);
"""
    # Insert after `const [isSidebarOpen, setIsSidebarOpen] = useState(false);`
    if "const [isSidebarOpen, setIsSidebarOpen] = useState(false);" in content:
        content = content.replace("const [isSidebarOpen, setIsSidebarOpen] = useState(false);", "const [isSidebarOpen, setIsSidebarOpen] = useState(false);" + listener_code)
    
    with open("src/pages/LabDashboard.jsx", "w", encoding="utf-8") as f:
        f.write(content)
