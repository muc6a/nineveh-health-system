import re

with open("src/components/LabManager.jsx", "r", encoding="utf-8") as f:
    content = f.read()

target = r'<span onClick=\{.*?\} className="px-2\.5 py-1 rounded-lg bg-amber-100 text-amber-700 font-bold text-\[10px\] flex items-center gap-1 w-fit cursor-pointer hover:bg-amber-200 transition-colors">'
replace = '<span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-700 font-bold text-[10px] flex items-center gap-1 w-fit">'
content = re.sub(target, replace, content)

with open("src/components/LabManager.jsx", "w", encoding="utf-8") as f:
    f.write(content)

