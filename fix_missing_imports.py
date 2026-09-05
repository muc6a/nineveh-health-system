with open("src/components/LabManager.jsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace(
    "from 'lucide-react';", 
    ", Plus, Database } from 'lucide-react';"
)
content = content.replace("} , Plus, Database", ", Plus, Database")

with open("src/components/LabManager.jsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Fixed imports")
