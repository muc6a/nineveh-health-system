import re

# 1. ExecutivePortal.jsx: Directives Full Width
path_exec = "src/pages/ExecutivePortal.jsx"
with open(path_exec, "r", encoding="utf-8") as f:
    exec_content = f.read()

exec_content = exec_content.replace(
    "          <div className=\"space-y-6\">\n            <div className=\"grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch\">",
    "          <div className=\"space-y-6\">\n            <div className={`grid grid-cols-1 ${hasPerm('sendDirective') ? 'lg:grid-cols-2' : ''} gap-6 items-stretch`}>"
)

with open(path_exec, "w", encoding="utf-8") as f:
    f.write(exec_content)


# 2. TeamDashboard.jsx: Directives Full Width
path_team = "src/pages/TeamDashboard.jsx"
with open(path_team, "r", encoding="utf-8") as f:
    team_content = f.read()

team_content = team_content.replace(
    "          <div className=\"space-y-6\">\n            <div className=\"grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch\">",
    "          <div className=\"space-y-6\">\n            <div className={`grid grid-cols-1 ${hasPerm('sendDirective') ? 'lg:grid-cols-2' : ''} gap-6 items-stretch`}>"
)

with open(path_team, "w", encoding="utf-8") as f:
    f.write(team_content)


# 3. Login.jsx: Enter key to login
path_login = "src/pages/Login.jsx"
with open(path_login, "r", encoding="utf-8") as f:
    login = f.read()

# Only replace if not already replaced
if "onKeyDown={(e) =>" not in login:
    login = login.replace('type="password"\n                    value={password}', 
                          'type="password"\n                    onKeyDown={(e) => e.key === \'Enter\' && handleLogin()}\n                    value={password}')
    with open(path_login, "w", encoding="utf-8") as f:
        f.write(login)


# 4. AppContext.jsx: Default light mode
path_ctx = "src/context/AppContext.jsx"
with open(path_ctx, "r", encoding="utf-8") as f:
    ctx = f.read()

if "return 'light';" not in ctx:
    ctx = re.sub(r"const \[theme, setTheme\] = useState\(\(\) => \{.*?\}\);", 
                 """const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme;
      }
    }
    return 'light';
  });""", ctx, flags=re.DOTALL)
    with open(path_ctx, "w", encoding="utf-8") as f:
        f.write(ctx)

print("Remaining UX fixes applied!")
