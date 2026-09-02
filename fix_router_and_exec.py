import re

# Fix Router.jsx
with open('src/components/Router.jsx', 'r', encoding='utf-8') as f:
    router_content = f.read()

# Replace currentRoute with baseRoute for the switch statement and role checks
router_content = router_content.replace(
    "if (currentRoute === '/dashboard/director'",
    "const baseRoute = currentRoute.split('?')[0];\n      if (baseRoute === '/dashboard/director'"
)

# Fix other role checks
router_content = router_content.replace(
    "} else if (currentRoute === '/dashboard/team'",
    "} else if (baseRoute === '/dashboard/team'"
)
router_content = router_content.replace(
    "} else if (currentRoute === '/dashboard/tracker'",
    "} else if (baseRoute === '/dashboard/tracker'"
)
router_content = router_content.replace(
    "} else if (currentRoute === '/dashboard/accountant'",
    "} else if (baseRoute === '/dashboard/accountant'"
)
router_content = router_content.replace(
    "} else if (currentRoute === '/dashboard/lab'",
    "} else if (baseRoute === '/dashboard/lab'"
)
router_content = router_content.replace(
    "} else if (currentRoute === '/admin/control'",
    "} else if (baseRoute === '/admin/control'"
)

# Fix switch
router_content = router_content.replace(
    "switch (currentRoute) {",
    "switch (baseRoute) {"
)

with open('src/components/Router.jsx', 'w', encoding='utf-8') as f:
    f.write(router_content)

# Fix ExecutivePortal.jsx
with open('src/pages/ExecutivePortal.jsx', 'r', encoding='utf-8') as f:
    exec_content = f.read()

# Make ExecutivePortal read the query parameter from currentRoute
exec_tab_logic = """  const { currentRoute } = useContext(AppContext);
  const initialUrlTab = currentRoute.includes('?tab=') ? currentRoute.split('?tab=')[1].split('&')[0] : null;

  useEffect(() => {
    if (initialUrlTab && tabConfig[initialUrlTab]) {
      const config = tabConfig[initialUrlTab];
      if (!config.permission || hasPerm(config.permission)) {
        if (initialUrlTab === 'establishments') {
          setExecutiveTab('establishments');
        } else {
          setExecutiveTab('dashboard');
          setActiveTab(initialUrlTab);
        }
      }
    }
  }, [initialUrlTab, user?.permissions]);
"""
if "initialUrlTab = currentRoute.includes" not in exec_content:
    exec_content = exec_content.replace("const getInitialExecutiveTab = () => {", exec_tab_logic + "\n  const getInitialExecutiveTab = () => {")

with open('src/pages/ExecutivePortal.jsx', 'w', encoding='utf-8') as f:
    f.write(exec_content)

print("Fixed Router and ExecutivePortal for query parameters")
