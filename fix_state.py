with open("src/pages/ExecutivePortal.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# find a good place to insert it
if "const [isSidebarOpen" not in content:
    content = content.replace("const [executiveTab", "const [isSidebarOpen, setIsSidebarOpen] = useState(false);\n  const [executiveTab")

with open("src/pages/ExecutivePortal.jsx", "w", encoding="utf-8") as f:
    f.write(content)
