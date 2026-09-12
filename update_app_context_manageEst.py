import os

def update_app_context():
    filepath = "src/context/AppContext.jsx"
    if not os.path.exists(filepath): return
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Replace the hardcoded mock user in setDirectors logic
    content = content.replace(
        "showDirectivesPage: true, sendDirective: true, manageEstablishments: true } };",
        "showDirectivesPage: true, sendDirective: true } };"
    )
    
    content = content.replace(
        "showDirectivesPage: true, sendDirective: true, manageEstablishments: true, notify_closures: true,",
        "showDirectivesPage: true, sendDirective: true, notify_closures: true,"
    )

    # Add the cleanup logic to remove manageEstablishments from local storage
    migration_code = """
  // Run once on load to clean up manageEstablishments from central_director in localStorage
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem('nineveh_directors');
      if (stored) {
        let dirs = JSON.parse(stored);
        let updated = false;
        dirs = dirs.map(d => {
          if (d.role === 'central_director' && d.permissions?.manageEstablishments) {
            d.permissions.manageEstablishments = false;
            updated = true;
          }
          return d;
        });
        if (updated) {
          localStorage.setItem('nineveh_directors', JSON.stringify(dirs));
          
          // If the currently logged in user is central_director, update their session too
          const activeUser = JSON.parse(localStorage.getItem('nineveh_user') || 'null');
          if (activeUser?.role === 'central_director' && activeUser?.permissions?.manageEstablishments) {
             activeUser.permissions.manageEstablishments = false;
             localStorage.setItem('nineveh_user', JSON.stringify(activeUser));
             // Also update state if user state is already set (handled by reload usually)
          }
        }
      }
    } catch (e) {
      console.error("Migration error:", e);
    }
  }, []);
"""

    if "// Run once on load to clean up manageEstablishments" not in content:
        content = content.replace(
            "const AppProvider = ({ children }) => {",
            "const AppProvider = ({ children }) => {" + migration_code
        )

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
    print("Updated AppContext.jsx")

if __name__ == "__main__":
    update_app_context()
