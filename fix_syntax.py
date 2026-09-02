import re

# Fix EstablishmentModal.jsx
with open('src/components/EstablishmentModal.jsx', 'r', encoding='utf-8') as f:
    content = f.read()
    
# Find the empty condition and remove it, or add null
pattern = r"\{mode === 'edit' && initialData\?\.id && \(\s*\)\}"
content = re.sub(pattern, "", content)

with open('src/components/EstablishmentModal.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

# Fix ExecutivePortal.jsx
# Let's see what is wrong in ExecutivePortal.jsx
with open('src/pages/ExecutivePortal.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Let's find line 1106-1110
lines = content.split('\n')
start = max(0, 1106 - 5)
end = min(len(lines), 1110 + 5)
print("ExecutivePortal snippet around 1108:")
for i in range(start, end):
    print(f"{i+1}: {lines[i]}")

