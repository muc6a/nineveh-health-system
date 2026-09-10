import re

with open("src/pages/ExecutivePortal.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# Remove the existing hasPerm
old_hasPerm = """  // User permissions logic (Default Deny)
  const hasPerm = (permName) => {
    if (user?.role === 'admin') return true;
    if (ROLE_CORE_BASICS[user?.role]?.includes(permName)) return true;
    return user?.permissions?.[permName] === true;
  };"""
content = content.replace(old_hasPerm, "")

# Insert hasPerm at the very beginning of the component
insert_point = "  const { navigate, establishments, teams, user"
new_hasPerm = """
  // User permissions logic (Default Deny)
  const hasPerm = (permName) => {
    if (user?.role === 'admin') return true;
    if (ROLE_CORE_BASICS[user?.role]?.includes(permName)) return true;
    return user?.permissions?.[permName] === true;
  };
"""

content = content.replace(insert_point, new_hasPerm + "\n" + insert_point)

with open("src/pages/ExecutivePortal.jsx", "w", encoding="utf-8") as f:
    f.write(content)
