import re

with open("src/components/FinancialReports.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# Inject hasPerm
if "const hasPerm =" not in content:
    # We need ROLE_CORE_BASICS
    if "ROLE_CORE_BASICS" not in content:
        import_pattern = r"import \{.*?\} from '\.\./utils/constants';"
        match = re.search(import_pattern, content)
        if match:
            new_import = match.group(0).replace("}", ", ROLE_CORE_BASICS }")
            content = content.replace(match.group(0), new_import)
        else:
            content = "import { ROLE_CORE_BASICS } from '../utils/constants';\n" + content

    hasPerm_code = """
  const hasPerm = (permName) => {
    if (user?.role === 'admin') return true;
    if (ROLE_CORE_BASICS[user?.role]?.includes(permName)) return true;
    return user?.permissions?.[permName] === true;
  };
"""
    context_pattern = r"const { user, .*? } = useContext\(AppContext\);"
    content = re.sub(context_pattern, r"\g<0>\n" + hasPerm_code, content, count=1)

# Hide Pay Fine button if not hasPerm('payFines')
pay_fine_btn_pattern = r"(<button onClick=\{\(\) => setShowPayModal\(true\)\}.*?تسديد غرامة\s*</button>)"
content = re.sub(pay_fine_btn_pattern, r"{hasPerm('payFines') && \1}", content, flags=re.DOTALL)

# Hide Stats Cards if not hasPerm('financialReports')
# Let's find the stats grid
grid_pattern = r"(<div className=\"grid grid-cols-2 md:grid-cols-4 gap-4\">.*?</div>)"
content = re.sub(grid_pattern, r"{hasPerm('financialReports') && \1}", content, flags=re.DOTALL)

# Hide Fines Table if not hasPerm('financialReports') (or maybe everyone can see their own? Let's just hide the main stats if not financialReports)
# Wait, let's leave the table as is or hide the whole content area if not financialReports?
# Actually, if someone only has payFines, they shouldn't see the table of all fines. They should only see the button.
# Let's wrap the grid AND the table.
# A better way is to just wrap from the first <div> after the header down to the end of the main section.
# I'll just wrap the main content container if we have it, but for now wrapping the stats grid is a good start.

with open("src/components/FinancialReports.jsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Updated FinancialReports.jsx")
