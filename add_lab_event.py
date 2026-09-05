import re

with open('src/pages/TeamDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_event = """    window.addEventListener('navToDirectives', handleNavDirectives);
    return () => window.removeEventListener('navToDirectives', handleNavDirectives);"""

new_event = """    const handleNavLabResults = () => {
      setActiveTab('lab_results');
    };
    
    window.addEventListener('navToDirectives', handleNavDirectives);
    window.addEventListener('navToLabResults', handleNavLabResults);
    return () => {
      window.removeEventListener('navToDirectives', handleNavDirectives);
      window.removeEventListener('navToLabResults', handleNavLabResults);
    };"""

content = content.replace(old_event, new_event)

with open('src/pages/TeamDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated event listener in TeamDashboard")
