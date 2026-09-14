import re

# 1. LoginGate.jsx: Enter key to login
path_login = "src/pages/LoginGate.jsx"
with open(path_login, "r", encoding="utf-8") as f:
    login = f.read()

# Only replace if not already replaced
if "onKeyDown={(e) =>" not in login:
    login = login.replace('type="password"\n                    value={password}', 
                          'type="password"\n                    onKeyDown={(e) => e.key === \'Enter\' && handleLogin()}\n                    value={password}')
    with open(path_login, "w", encoding="utf-8") as f:
        f.write(login)


# 2. AppContext.jsx: Default light mode
path_ctx = "src/context/AppContext.jsx"
with open(path_ctx, "r", encoding="utf-8") as f:
    ctx = f.read()

if "return 'light';" not in ctx:
    ctx = re.sub(r"const \[theme, setTheme\] = useState\(\(\) => \{.*?\n  \}\);", 
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
