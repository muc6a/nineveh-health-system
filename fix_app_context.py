import re

path = "src/context/AppContext.jsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Fix default light mode
pattern = r"const \[darkMode, setDarkMode\] = useState\(\(\) => \{\n    const saved = localStorage\.getItem\('theme'\);\n    return saved === 'dark' \|\| \(\!saved && window\.matchMedia\('\(prefers-color-scheme: dark\)'\)\.matches\);\n  \}\);"
replacement = """const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark';
  });"""
content = re.sub(pattern, replacement, content)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("Updated AppContext.jsx")
