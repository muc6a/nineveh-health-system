import re

with open('src/components/Router.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the baseRoute from inside the useEffect
content = content.replace("      const baseRoute = currentRoute.split('?')[0];\n", "")

# Add it outside the useEffect
content = content.replace(
    "  // Strict Role Authentication Guard\n  useEffect(() => {",
    "  const baseRoute = currentRoute.split('?')[0];\n\n  // Strict Role Authentication Guard\n  useEffect(() => {"
)

with open('src/components/Router.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

