with open("src/components/FinancialReports.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# Add ROLE_CORE_BASICS import if missing
if "ROLE_CORE_BASICS" not in content:
    content = "import { ROLE_CORE_BASICS } from '../utils/constants';\n" + content

# Replace the useContext line to include 'user'
target = "const { penaltyRequests, teams, setPenaltyRequests, notify, establishments } = useContext(AppContext);"
replacement = """const { user, penaltyRequests, teams, setPenaltyRequests, notify, establishments } = useContext(AppContext);

  const hasPerm = (permName) => {
    if (user?.role === 'admin') return true;
    if (ROLE_CORE_BASICS[user?.role]?.includes(permName)) return true;
    return user?.permissions?.[permName] === true;
  };
"""

if "const hasPerm =" not in content:
    content = content.replace(target, replacement)

with open("src/components/FinancialReports.jsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Fixed hasPerm manually")
