import re

def update_app_context():
    path = "src/context/AppContext.jsx"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    sync_hook = """
  // Real-time RBAC Hook: Sync current user's permissions with the live database arrays
  useEffect(() => {
    if (!user) return;
    let foundUser = null;
    
    // Find the user in all possible collections based on role
    if (user.role === 'team') {
      foundUser = teams.find(t => t.id === user.id);
    } else if (['director', 'central_director', 'director_general', 'deputy_director_general', 'public_health_director', 'deputy_public_health_director', 'central_health_sector_director', 'right_bank_sector_director', 'left_bank_sector_director', 'district_sector_director_talafar', 'district_sector_director_sinjar', 'district_sector_director_hamdaniya'].includes(user.role)) {
      foundUser = directors.find(d => d.id === user.id);
    } else if (user.role === 'accountant' || user.role === 'financial_accountant') {
      foundUser = accountants.find(a => a.id === user.id);
    } else if (user.role === 'lab') {
      foundUser = labs.find(l => l.id === user.id);
    }

    if (foundUser && foundUser.permissions) {
      // Compare if permissions actually changed
      const currentPerms = JSON.stringify(user.permissions || {});
      const newPerms = JSON.stringify(foundUser.permissions || {});
      if (currentPerms !== newPerms) {
        setUser(prev => ({ ...prev, permissions: foundUser.permissions }));
        localStorage.setItem('user', JSON.stringify({ ...user, permissions: foundUser.permissions }));
      }
    }
  }, [user?.id, teams, directors, accountants, labs]);
"""

    if "Real-time RBAC Hook" not in content:
        # Insert it before hasPerm
        content = content.replace("  // Role-Based Access Control Check", sync_hook + "\n  // Role-Based Access Control Check")

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

if __name__ == "__main__":
    update_app_context()
