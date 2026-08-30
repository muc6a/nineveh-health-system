import os
import re
import glob

def main():
    # 1. Dashboard files to update
    files = [
        'src/pages/AccountantPanel.jsx',
        'src/pages/ExecutivePortal.jsx',
        'src/pages/LabDashboard.jsx',
        'src/pages/OwnerPortal.jsx',
        'src/pages/SuperAdminPanel.jsx',
        'src/pages/TeamDashboard.jsx',
        'src/pages/TrackerDashboard.jsx'
    ]

    for filepath in files:
        if not os.path.exists(filepath):
            continue
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # Step 1: Add globalLogout to useContext if not already there
        if 'globalLogout' not in content:
            content = re.sub(
                r'(const \{.*?)(useContext\(AppContext\);)',
                r'\1 globalLogout, \2',
                content
            )

        # Step 2: Remove handleLogout function
        # Typical format: 
        # const handleLogout = () => {
        #   localStorage.removeItem('auth_token');
        #   // ... possibly other lines
        #   window.location.href = '/';
        # };
        # OR
        # const handleLogout = () => {
        #   localStorage.removeItem('ownerAuthToken');
        #   window.location.href = '/login';
        # };
        content = re.sub(r'const handleLogout = \(\) => \{.*?\};', '', content, flags=re.DOTALL)
        
        # SuperAdminPanel has a slightly different one sometimes or OwnerPortal. Let's make regex a bit more robust
        # Actually, let's just replace all instances of handleLogout with globalLogout
        content = content.replace('handleLogout', 'globalLogout')
        
        # Cleanup any dangling setUser(null) in handleLogout if the regex missed it
        # Actually, re.sub with `.*?};` might eat too much if there are nested blocks or multiple functions.
        # Let's do a safer string replace for known blocks or just trust the regex if it's non-greedy `.*?`
        # Wait, DOTALL with `.*?` stops at the FIRST `};`, which might be inside the function.
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
            
    print("Updated logout handlers.")

if __name__ == "__main__":
    main()
