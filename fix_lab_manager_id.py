import re
with open("src/components/LabManager.jsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("{req.sampleCode || req.id}", "{req.sampleCode || req.id.toString().replace('lab_', '').slice(-5)}")

with open("src/components/LabManager.jsx", "w", encoding="utf-8") as f:
    f.write(content)
