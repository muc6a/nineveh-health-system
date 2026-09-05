import re

with open('src/pages/LabDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_auth = """  // Protect route
  useEffect(() => {
    if (!user || user.role !== 'lab') {
      navigate('/login');
    }
  }, [user, navigate]);"""

new_auth = """  // Protect route
  useEffect(() => {
    const hasLabAccess = user && (user.role === 'lab' || user.permissions?.receiveSamples || user.permissions?.enterLabResults || user.permissions?.labArchive);
    if (!hasLabAccess) {
      navigate('/login');
    }
  }, [user, navigate]);"""

content = content.replace(old_auth, new_auth)

with open('src/pages/LabDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated LabDashboard Authentication")
