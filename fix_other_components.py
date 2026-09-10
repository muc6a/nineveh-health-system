import re

def fix_component(filepath, use_context_str, context_vars):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Add hasPerm to destructuring if not present
    if "hasPerm" not in context_vars:
        new_vars = context_vars.replace("}", ", hasPerm }")
        content = content.replace(use_context_str, use_context_str.replace(context_vars, new_vars))

    # Remove local hasPerm definition
    content = re.sub(
        r"\s*// User permissions logic \(Default Deny\)\n\s*const hasPerm = \(permName\) => \{.*?\};\n",
        "\n",
        content,
        flags=re.DOTALL
    )
    # Sometimes it doesn't have the comment
    content = re.sub(
        r"\s*const hasPerm = \(permName\) => \{.*?\};\n",
        "\n",
        content,
        flags=re.DOTALL
    )

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)

fix_component("src/pages/TeamDashboard.jsx", "const { user, notify, activeTab: globalActiveTab, setActiveTab: setGlobalActiveTab, globalLogout, teams } = useContext(AppContext);", "const { user, notify, activeTab: globalActiveTab, setActiveTab: setGlobalActiveTab, globalLogout, teams }")
fix_component("src/components/FinancialReports.jsx", "const { user } = useContext(AppContext);", "const { user }")
fix_component("src/components/LabManager.jsx", "const { user } = useContext(AppContext);", "const { user }")
