import re

with open("src/pages/ExecutivePortal.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add hasPerm to destructuring
content = content.replace(
    "const { navigate, establishments, teams, user, setUser,",
    "const { navigate, establishments, teams, user, setUser, hasPerm,"
)

# 2. Remove local hasPerm definition
old_hasPerm = """
  // User permissions logic (Default Deny)
  const hasPerm = (permName) => {
    if (user?.role === 'admin') return true;
    if (ROLE_CORE_BASICS[user?.role]?.includes(permName)) return true;
    return user?.permissions?.[permName] === true;
  };
"""
content = content.replace(old_hasPerm, "")

# 3. Remove team_reports tab from ExecutivePortal
# There is a block for team_reports in useEffect:
content = content.replace("    if (activeTab === 'team_reports' && !hasPerm('showFieldTeamsStats')) needsRedirect = true;\n", "")

# And in rendering logic:
content = content.replace(" || (activeTab === 'team_reports' && hasPerm('showFieldTeamsStats'))", "")

content = re.sub(
    r"\{\s*/\*\s*Team Reports Tab\s*\*/\s*\}.*?activeTab === 'team_reports' &&.*?(?:</div>\s*){4}\)",
    "",
    content,
    flags=re.DOTALL
)

# Also remove it from the mobile dropdown if it's there
content = content.replace(" || val === 'team_reports'", "")
content = content.replace("""              <option value="team_reports">👥 تقارير الفرق</option>\n""", "")

with open("src/pages/ExecutivePortal.jsx", "w", encoding="utf-8") as f:
    f.write(content)
