import re

with open("src/components/LabManager.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# Make sure hasPerm isn't already defined
if "const hasPerm =" not in content:
    # We need ROLE_CORE_BASICS
    if "ROLE_CORE_BASICS" not in content:
        import_pattern = r"import \{.*?\} from '\.\./utils/constants';"
        match = re.search(import_pattern, content)
        if match:
            new_import = match.group(0).replace("}", ", ROLE_CORE_BASICS }")
            content = content.replace(match.group(0), new_import)
        else:
            # Add new import
            content = "import { ROLE_CORE_BASICS } from '../utils/constants';\n" + content

    # Inject hasPerm
    hasPerm_code = """
  const hasPerm = (permName) => {
    if (user?.role === 'admin') return true;
    if (ROLE_CORE_BASICS[user?.role]?.includes(permName)) return true;
    return user?.permissions?.[permName] === true;
  };
"""
    # Insert right after `const { user, labRequests, ... } = useContext(AppContext);`
    context_pattern = r"const { user, .*? } = useContext\(AppContext\);"
    content = re.sub(context_pattern, r"\g<0>\n" + hasPerm_code, content, count=1)

with open("src/components/LabManager.jsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Injected hasPerm into LabManager")
