import re

with open("src/context/AppContext.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# Replace localStorage.clear() in globalLogout
old_logout = """  const globalLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setUser(null);
    window.location.replace('/');
  };"""

new_logout = """  const globalLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('currentRoute');
    sessionStorage.clear();
    setUser(null);
    window.location.replace('/');
  };"""

content = content.replace(old_logout, new_logout)

with open("src/context/AppContext.jsx", "w", encoding="utf-8") as f:
    f.write(content)
